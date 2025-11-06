import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Task from '../models/Task';
import asyncWrapper from '../middleware/async';
import { BadRequestError, NotFoundError } from '../errors/custom-error';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';
// We'll use a simple function to generate UUIDs instead of importing uuid
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
import { ISubtask, IAttachment } from '../interfaces/Task';

// Get all tasks for the current user
export const getAllTasks = asyncWrapper(async (req: Request, res: Response) => {
  const { 
    category, 
    completed, 
    priority, 
    search, 
    sort = 'createdAt', 
    fields,
    page = 1,
    limit = 10,
    isRecurring,
    dueDate,
    hasAttachments,
    hasSubtasks
  } = req.query;
  
  // Build query
  const queryObject: any = { createdBy: req.user?.userId };
  
  // Filter by category
  if (category) {
    queryObject.category = category;
  }
  
  // Filter by completion status
  if (completed) {
    queryObject.completed = completed === 'true';
  }
  
  // Filter by priority
  if (priority) {
    queryObject.priority = priority;
  }
  
  // Filter by recurring status
  if (isRecurring) {
    queryObject.isRecurring = isRecurring === 'true';
  }
  
  // Filter by due date
  if (dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate === 'today') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      queryObject.dueDate = { $gte: today, $lt: tomorrow };
    } else if (dueDate === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      queryObject.dueDate = { $gte: tomorrow, $lt: dayAfterTomorrow };
    } else if (dueDate === 'week') {
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      queryObject.dueDate = { $gte: today, $lt: nextWeek };
    } else if (dueDate === 'overdue') {
      queryObject.dueDate = { $lt: today };
      queryObject.completed = false;
    }
  }
  
  // Filter by attachments
  if (hasAttachments) {
    if (hasAttachments === 'true') {
      queryObject.attachments = { $exists: true, $ne: [] };
    } else {
      queryObject.$or = [
        { attachments: { $exists: false } },
        { attachments: [] }
      ];
    }
  }
  
  // Filter by subtasks
  if (hasSubtasks) {
    if (hasSubtasks === 'true') {
      queryObject.subtasks = { $exists: true, $ne: [] };
    } else {
      queryObject.$or = [
        { subtasks: { $exists: false } },
        { subtasks: [] }
      ];
    }
  }
  
  // Search by name or description
  if (search) {
    queryObject.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Execute query
  let result = Task.find(queryObject);
  
  // Sort
  if (sort) {
    const sortList = (sort as string).split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }
  
  // Field selection
  if (fields) {
    const fieldsList = (fields as string).split(',').join(' ');
    result = result.select(fieldsList);
  }
  
  // Pagination
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;
  
  result = result.skip(skip).limit(limitNumber);
  
  // Execute query
  const tasks = await result;
  
  // Get total count for pagination
  const totalTasks = await Task.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalTasks / limitNumber);
  
  res.status(StatusCodes.OK).json({ 
    tasks, 
    count: tasks.length,
    totalTasks,
    numOfPages
  });
});

// Get a single task
export const getTask = asyncWrapper(async (req: Request, res: Response) => {
  const { id: taskId } = req.params;
  
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new BadRequestError(`Invalid task ID: ${taskId}`);
  }
  
  const task = await Task.findOne({ 
    _id: taskId,
    createdBy: req.user?.userId
  }).populate('assignedTo', 'name email');
  
  if (!task) {
    throw new NotFoundError(`No task found with id ${taskId}`);
  }
  
  res.status(StatusCodes.OK).json({ task });
});

// Create a new task
export const createTask = asyncWrapper(async (req: Request, res: Response) => {
  // Add user ID to request body
  req.body.createdBy = req.user?.userId;
  
  const task = await Task.create(req.body);
  
  // If task is recurring, schedule the next occurrence
  if (task.isRecurring && task.recurrenceRule) {
    await scheduleNextOccurrence(task);
  }
  
  res.status(StatusCodes.CREATED).json({ task });
});

// Update a task
export const updateTask = asyncWrapper(async (req: Request, res: Response) => {
  const { id: taskId } = req.params;
  
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new BadRequestError(`Invalid task ID: ${taskId}`);
  }
  
  // Find and update task
  const task = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: req.user?.userId },
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!task) {
    throw new NotFoundError(`No task found with id ${taskId}`);
  }
  
  // If task is recurring and recurrence rule was updated, reschedule
  if (task.isRecurring && req.body.recurrenceRule) {
    await scheduleNextOccurrence(task);
  }
  
  res.status(StatusCodes.OK).json({ task });
});

// Delete a task
export const deleteTask = asyncWrapper(async (req: Request, res: Response) => {
  const { id: taskId } = req.params;
  
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new BadRequestError(`Invalid task ID: ${taskId}`);
  }
  
  const task = await Task.findOneAndDelete({ 
    _id: taskId,
    createdBy: req.user?.userId
  });
  
  if (!task) {
    throw new NotFoundError(`No task found with id ${taskId}`);
  }
  
  // Delete all attachments
  if (task.attachments && task.attachments.length > 0) {
    for (const attachment of task.attachments) {
      try {
        fs.unlinkSync(attachment.path);
      } catch (error) {
        logger.error(`Failed to delete attachment file: ${attachment.path}`);
      }
    }
  }
  
  res.status(StatusCodes.OK).json({ task });
});

// Get task statistics
export const getTaskStats = asyncWrapper(async (req: Request, res: Response) => {
  const stats = await Task.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user?.userId) } },
    { $group: {
      _id: null,
      total: { $sum: 1 },
      completed: { $sum: { $cond: ['$completed', 1, 0] } },
      pending: { $sum: { $cond: ['$completed', 0, 1] } },
      highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
      mediumPriority: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
      lowPriority: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } },
      withAttachments: { $sum: { $cond: [{ $gt: [{ $size: { $ifNull: ['$attachments', []] } }, 0] }, 1, 0] } },
      withSubtasks: { $sum: { $cond: [{ $gt: [{ $size: { $ifNull: ['$subtasks', []] } }, 0] }, 1, 0] } },
      recurringTasks: { $sum: { $cond: ['$isRecurring', 1, 0] } }
    }}
  ]);
  
  // If no tasks, return default stats
  if (stats.length === 0) {
    return res.status(StatusCodes.OK).json({
      stats: {
        total: 0,
        completed: 0,
        pending: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,
        withAttachments: 0,
        withSubtasks: 0,
        recurringTasks: 0
      }
    });
  }
  
  res.status(StatusCodes.OK).json({ stats: stats[0] });
});

// Add subtask
export const addSubtask = asyncWrapper(async (req: Request, res: Response) => {
  const { id: taskId } = req.params;
  const { name } = req.body;
  
  if (!name) {
    throw new BadRequestError('Subtask name is required');
  }
  
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new BadRequestError(`Invalid task ID: ${taskId}`);
  }
  
  const task = await Task.findOne({ 
    _id: taskId,
    createdBy: req.user?.userId
  });
  
  if (!task) {
    throw new NotFoundError(`No task found with id ${taskId}`);
  }
  
  // Create subtask
  const subtask: ISubtask = {
    name,
    completed: false,
    createdAt: new Date()
  };
  
  // Add subtask to task
  if (!task.subtasks) {
    task.subtasks = [];
  }
  
  task.subtasks.push(subtask);
  await task.save();
  
  res.status(StatusCodes.CREATED).json({ task });
});

// Update subtask
export const updateSubtask = asyncWrapper(async (req: Request, res: Response) => {
  const { id: taskId, subtaskId } = req.params;
  const { name, completed } = req.body;
  
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new BadRequestError(`Invalid task ID: ${taskId}`);
  }
  
  const task = await Task.findOne({ 
    _id: taskId,
    createdBy: req.user?.userId
  });
  
  if (!task) {
    throw new NotFoundError(`No task found with id ${taskId}`);
  }
  
  // Find subtask
  if (!task.subtasks) {
    throw new NotFoundError(`No subtasks found for task ${taskId}`);
  }
  
  const subtaskIndex = task.subtasks.findIndex(
    (subtask: any) => subtask._id.toString() === subtaskId
  );
  
  if (subtaskIndex === -1) {
    throw new NotFoundError(`No subtask found with id ${subtaskId}`);
  }
  
  // Update subtask
  if (name) {
    task.subtasks[subtaskIndex].name = name;
  }
  
  if (completed !== undefined) {
    task.subtasks[subtaskIndex].completed = completed;
    
    // Set completedAt if completed
    if (completed) {
      task.subtasks[subtaskIndex].completedAt = new Date();
    } else {
      task.subtasks[subtaskIndex].completedAt = undefined;
    }
  }
  
  await task.save();
  
  res.status(StatusCodes.OK).json({ task });
});

// Delete subtask
export const deleteSubtask = asyncWrapper(async (req: Request, res: Response) => {
  const { id: taskId, subtaskId } = req.params;
  
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new BadRequestError(`Invalid task ID: ${taskId}`);
  }
  
  const task = await Task.findOne({ 
    _id: taskId,
    createdBy: req.user?.userId
  });
  
  if (!task) {
    throw new NotFoundError(`No task found with id ${taskId}`);
  }
  
  // Find subtask
  if (!task.subtasks) {
    throw new NotFoundError(`No subtasks found for task ${taskId}`);
  }
  
  // Remove subtask
  task.subtasks = task.subtasks.filter(
    (subtask: any) => subtask._id.toString() !== subtaskId
  );
  
  await task.save();
  
  res.status(StatusCodes.OK).json({ task });
});

// Upload attachment
export const uploadAttachment = asyncWrapper(async (req: Request, res: Response) => {
  const { id: taskId } = req.params;
  
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new BadRequestError(`Invalid task ID: ${taskId}`);
  }
  
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new BadRequestError('No files were uploaded');
  }
  
  const task = await Task.findOne({ 
    _id: taskId,
    createdBy: req.user?.userId
  });
  
  if (!task) {
    throw new NotFoundError(`No task found with id ${taskId}`);
  }
  
  // Process file upload
  // TypeScript fix: handle req.files as any since we don't have proper type definitions
  const file = (req.files as any).file;
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Generate unique filename
  const filename = `${generateUUID()}-${file.name}`;
  const filePath = path.join(uploadsDir, filename);
  
  // Move file to uploads directory
  await file.mv(filePath);
  
  // Create attachment
  const attachment: IAttachment = {
    filename,
    originalName: file.name,
    mimeType: file.mimetype,
    size: file.size,
    path: filePath,
    uploadedAt: new Date()
  };
  
  // Add attachment to task
  if (!task.attachments) {
    task.attachments = [];
  }
  
  task.attachments.push(attachment);
  await task.save();
  
  res.status(StatusCodes.CREATED).json({ task });
});

// Delete attachment
export const deleteAttachment = asyncWrapper(async (req: Request, res: Response) => {
  const { id: taskId, attachmentId } = req.params;
  
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new BadRequestError(`Invalid task ID: ${taskId}`);
  }
  
  const task = await Task.findOne({ 
    _id: taskId,
    createdBy: req.user?.userId
  });
  
  if (!task) {
    throw new NotFoundError(`No task found with id ${taskId}`);
  }
  
  // Find attachment
  if (!task.attachments) {
    throw new NotFoundError(`No attachments found for task ${taskId}`);
  }
  
  const attachmentIndex = task.attachments.findIndex(
    (attachment: any) => attachment._id.toString() === attachmentId
  );
  
  if (attachmentIndex === -1) {
    throw new NotFoundError(`No attachment found with id ${attachmentId}`);
  }
  
  // Delete file
  try {
    fs.unlinkSync(task.attachments[attachmentIndex].path);
  } catch (error) {
    logger.error(`Failed to delete attachment file: ${task.attachments[attachmentIndex].path}`);
  }
  
  // Remove attachment from task
  task.attachments.splice(attachmentIndex, 1);
  await task.save();
  
  res.status(StatusCodes.OK).json({ task });
});

// Helper function to schedule next occurrence of a recurring task
const scheduleNextOccurrence = async (task: any) => {
  if (!task.isRecurring || !task.recurrenceRule) {
    return;
  }
  
  const { frequency, interval, endDate, count } = task.recurrenceRule;
  
  // Check if we've reached the end of recurrence
  if (endDate && new Date(endDate) < new Date()) {
    return;
  }
  
  if (count !== undefined && count <= 0) {
    return;
  }
  
  // Calculate next occurrence date
  const nextDate = calculateNextOccurrence(task);
  
  // Create next occurrence
  const nextTask = {
    name: task.name,
    description: task.description,
    priority: task.priority,
    category: task.category,
    tags: task.tags,
    createdBy: task.createdBy,
    assignedTo: task.assignedTo,
    isRecurring: task.isRecurring,
    recurrenceRule: task.recurrenceRule,
    parentTaskId: task._id,
    dueDate: nextDate
  };
  
  // Decrement count if specified
  if (count !== undefined) {
    nextTask.recurrenceRule.count = count - 1;
  }
  
  await Task.create(nextTask);
  
  logger.info(`Scheduled next occurrence of recurring task ${task._id} for ${nextDate}`);
};

// Helper function to calculate next occurrence date
const calculateNextOccurrence = (task: any) => {
  const { frequency, interval } = task.recurrenceRule;
  const baseDate = task.dueDate || new Date();
  let nextDate = new Date(baseDate);
  
  switch (frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + interval);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + (interval * 7));
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + interval);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + interval);
      break;
    default:
      nextDate.setDate(nextDate.getDate() + interval);
  }
  
  return nextDate;
};

