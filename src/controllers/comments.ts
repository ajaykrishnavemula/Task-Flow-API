import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Comment, CommentReaction } from '../models/Comment';
import Task from '../models/Task';
import { Activity } from '../models/Activity';
import { BadRequestError, NotFoundError, UnauthenticatedError } from '../errors/custom-error';
import asyncWrapper from '../middleware/async';

/**
 * @desc    Create a comment on a task
 * @route   POST /api/v1/comments
 * @access  Private
 */
export const createComment = asyncWrapper(async (req: Request, res: Response) => {
  const { taskId, content, mentions, parentComment } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  // Validate required fields
  if (!taskId || !content) {
    throw new BadRequestError('Task ID and content are required');
  }

  // Check if task exists
  const task = await Task.findById(taskId);
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  // Check if user has access to the task
  if (
    task.createdBy.toString() !== userId &&
    task.assignedTo?.toString() !== userId
  ) {
    throw new UnauthenticatedError('Not authorized to comment on this task');
  }

  // If it's a reply, check if parent comment exists
  if (parentComment) {
    const parent = await Comment.findById(parentComment);
    if (!parent) {
      throw new NotFoundError('Parent comment not found');
    }
    if (parent.task.toString() !== taskId) {
      throw new BadRequestError('Parent comment does not belong to this task');
    }
  }

  // Create comment
  const comment = await Comment.create({
    task: taskId,
    user: userId,
    content,
    mentions: mentions || [],
    parentComment: parentComment || undefined,
  });

  // Populate user details
  await comment.populate('user', 'name email avatar');

  // Log activity
  await Activity.create({
    type: 'task_comment_added',
    user: userId,
    task: taskId,
    comment: comment._id,
    metadata: {
      commentContent: content.substring(0, 100),
    },
  });

  res.status(201).json({
    success: true,
    comment,
  });
});

/**
 * @desc    Get all comments for a task
 * @route   GET /api/v1/comments/task/:taskId
 * @access  Private
 */
export const getTaskComments = asyncWrapper(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  // Check if task exists
  const task = await Task.findById(taskId);
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  // Check if user has access to the task
  if (
    task.createdBy.toString() !== userId &&
    task.assignedTo?.toString() !== userId
  ) {
    throw new UnauthenticatedError('Not authorized to view comments');
  }

  // Get all comments for the task
  const comments = await Comment.find({ task: taskId })
    .populate('user', 'name email avatar')
    .populate('mentions', 'name email')
    .sort({ createdAt: 1 });

  res.json({
    success: true,
    count: comments.length,
    comments,
  });
});

/**
 * @desc    Get a single comment
 * @route   GET /api/v1/comments/:id
 * @access  Private
 */
export const getComment = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const comment = await Comment.findById(id)
    .populate('user', 'name email avatar')
    .populate('mentions', 'name email')
    .populate('task');

  if (!comment) {
    throw new NotFoundError('Comment not found');
  }

  // Check if user has access
  const task = await Task.findById(comment.task);
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  if (
    task.createdBy.toString() !== userId &&
    task.assignedTo?.toString() !== userId
  ) {
    throw new UnauthenticatedError('Not authorized to view this comment');
  }

  res.json({
    success: true,
    comment,
  });
});

/**
 * @desc    Update a comment
 * @route   PATCH /api/v1/comments/:id
 * @access  Private
 */
export const updateComment = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  if (!content) {
    throw new BadRequestError('Content is required');
  }

  const comment = await Comment.findById(id);
  if (!comment) {
    throw new NotFoundError('Comment not found');
  }

  // Check if user is the comment author
  if (comment.user.toString() !== userId) {
    throw new UnauthenticatedError('Not authorized to update this comment');
  }

  // Update comment
  comment.content = content;
  comment.isEdited = true;
  comment.editedAt = new Date();
  await comment.save();

  await comment.populate('user', 'name email avatar');

  // Log activity
  await Activity.create({
    type: 'task_comment_updated',
    user: userId,
    task: comment.task,
    comment: comment._id,
  });

  res.json({
    success: true,
    comment,
  });
});

/**
 * @desc    Delete a comment
 * @route   DELETE /api/v1/comments/:id
 * @access  Private
 */
export const deleteComment = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const comment = await Comment.findById(id);
  if (!comment) {
    throw new NotFoundError('Comment not found');
  }

  // Check if user is the comment author or task owner
  const task = await Task.findById(comment.task);
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  if (
    comment.user.toString() !== userId &&
    task.createdBy.toString() !== userId
  ) {
    throw new UnauthenticatedError('Not authorized to delete this comment');
  }

  // Delete all replies to this comment
  await Comment.deleteMany({ parentComment: id });

  // Delete the comment
  await Comment.findByIdAndDelete(id);

  // Log activity
  await Activity.create({
    type: 'task_comment_deleted',
    user: userId,
    task: comment.task,
    metadata: {
      commentContent: comment.content.substring(0, 100),
    },
  });

  res.json({
    success: true,
    message: 'Comment deleted successfully',
  });
});

/**
 * @desc    Add reaction to a comment
 * @route   POST /api/v1/comments/:id/reactions
 * @access  Private
 */
export const addReaction = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reaction } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  if (!reaction) {
    throw new BadRequestError('Reaction is required');
  }

  const comment = await Comment.findById(id);
  if (!comment) {
    throw new NotFoundError('Comment not found');
  }

  // Check if user has access to the task
  const task = await Task.findById(comment.task);
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  if (
    task.createdBy.toString() !== userId &&
    task.assignedTo?.toString() !== userId
  ) {
    throw new UnauthenticatedError('Not authorized to react to this comment');
  }

  // Check if user already reacted
  const existingReaction = await CommentReaction.findOne({
    comment: id,
    user: userId,
  });

  if (existingReaction) {
    // Update existing reaction
    existingReaction.reaction = reaction;
    await existingReaction.save();
  } else {
    // Create new reaction
    await CommentReaction.create({
      comment: id,
      user: userId,
      reaction,
    });
  }

  // Get all reactions for this comment
  const reactions = await CommentReaction.find({ comment: id })
    .populate('user', 'name email avatar');

  res.json({
    success: true,
    reactions,
  });
});

/**
 * @desc    Remove reaction from a comment
 * @route   DELETE /api/v1/comments/:id/reactions
 * @access  Private
 */
export const removeReaction = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const comment = await Comment.findById(id);
  if (!comment) {
    throw new NotFoundError('Comment not found');
  }

  // Remove user's reaction
  await CommentReaction.findOneAndDelete({
    comment: id,
    user: userId,
  });

  // Get remaining reactions
  const reactions = await CommentReaction.find({ comment: id })
    .populate('user', 'name email avatar');

  res.json({
    success: true,
    reactions,
  });
});

/**
 * @desc    Get reactions for a comment
 * @route   GET /api/v1/comments/:id/reactions
 * @access  Private
 */
export const getCommentReactions = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const comment = await Comment.findById(id);
  if (!comment) {
    throw new NotFoundError('Comment not found');
  }

  // Check if user has access
  const task = await Task.findById(comment.task);
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  if (
    task.createdBy.toString() !== userId &&
    task.assignedTo?.toString() !== userId
  ) {
    throw new UnauthenticatedError('Not authorized to view reactions');
  }

  const reactions = await CommentReaction.find({ comment: id })
    .populate('user', 'name email avatar');

  res.json({
    success: true,
    count: reactions.length,
    reactions,
  });
});

