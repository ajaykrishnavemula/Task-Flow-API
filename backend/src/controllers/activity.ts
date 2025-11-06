import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Activity, Notification, NotificationPreference } from '../models/Activity';
import { BadRequestError, NotFoundError, UnauthenticatedError } from '../errors/custom-error';
import asyncWrapper from '../middleware/async';
import mongoose from 'mongoose';

/**
 * @desc    Get activity feed for current user
 * @route   GET /api/v1/activity
 * @access  Private
 */
export const getActivityFeed = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { page = 1, limit = 20, type, startDate, endDate } = req.query;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  // Build query
  const query: any = {
    $or: [
      { user: userId },
      { targetUser: userId },
    ],
  };

  if (type) {
    query.type = type;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate as string);
    if (endDate) query.createdAt.$lte = new Date(endDate as string);
  }

  // Pagination
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // Get activities
  const activities = await Activity.find(query)
    .populate('user', 'name email avatar')
    .populate('targetUser', 'name email')
    .populate('task', 'name')
    .populate('team', 'name')
    .populate('sharedList', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);

  const total = await Activity.countDocuments(query);

  res.json({
    success: true,
    count: activities.length,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    activities,
  });
});

/**
 * @desc    Get activity for a specific task
 * @route   GET /api/v1/activity/task/:taskId
 * @access  Private
 */
export const getTaskActivity = asyncWrapper(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const activities = await Activity.find({ task: taskId })
    .populate('user', 'name email avatar')
    .populate('targetUser', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: activities.length,
    activities,
  });
});

/**
 * @desc    Get activity for a specific team
 * @route   GET /api/v1/activity/team/:teamId
 * @access  Private
 */
export const getTeamActivity = asyncWrapper(async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const activities = await Activity.find({ team: teamId })
    .populate('user', 'name email avatar')
    .populate('targetUser', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: activities.length,
    activities,
  });
});

/**
 * @desc    Get notifications for current user
 * @route   GET /api/v1/activity/notifications
 * @access  Private
 */
export const getNotifications = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { read, page = 1, limit = 20 } = req.query;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  // Build query
  const query: any = { recipient: userId };
  if (read !== undefined) {
    query.read = read === 'true';
  }

  // Pagination
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // Get notifications
  const notifications = await Notification.find(query)
    .populate({
      path: 'activity',
      populate: [
        { path: 'user', select: 'name email avatar' },
        { path: 'task', select: 'name' },
        { path: 'team', select: 'name' },
        { path: 'sharedList', select: 'name' },
      ],
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ recipient: userId, read: false });

  res.json({
    success: true,
    count: notifications.length,
    total,
    unreadCount,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    notifications,
  });
});

/**
 * @desc    Mark notification as read
 * @route   PATCH /api/v1/activity/notifications/:id/read
 * @access  Private
 */
export const markNotificationAsRead = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const notification = await Notification.findOne({
    _id: id,
    recipient: userId,
  });

  if (!notification) {
    throw new NotFoundError('Notification not found');
  }

  notification.read = true;
  notification.readAt = new Date();
  await notification.save();

  res.json({
    success: true,
    notification,
  });
});

/**
 * @desc    Mark all notifications as read
 * @route   PATCH /api/v1/activity/notifications/read-all
 * @access  Private
 */
export const markAllNotificationsAsRead = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  await Notification.updateMany(
    { recipient: userId, read: false },
    { read: true, readAt: new Date() }
  );

  res.json({
    success: true,
    message: 'All notifications marked as read',
  });
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/v1/activity/notifications/:id
 * @access  Private
 */
export const deleteNotification = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const notification = await Notification.findOneAndDelete({
    _id: id,
    recipient: userId,
  });

  if (!notification) {
    throw new NotFoundError('Notification not found');
  }

  res.json({
    success: true,
    message: 'Notification deleted',
  });
});

/**
 * @desc    Get notification preferences
 * @route   GET /api/v1/activity/preferences
 * @access  Private
 */
export const getNotificationPreferences = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  let preferences = await NotificationPreference.findOne({ user: userId });

  // Create default preferences if not exists
  if (!preferences) {
    preferences = await NotificationPreference.create({ user: userId });
  }

  res.json({
    success: true,
    preferences,
  });
});

/**
 * @desc    Update notification preferences
 * @route   PATCH /api/v1/activity/preferences
 * @access  Private
 */
export const updateNotificationPreferences = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { preferences } = req.body;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  if (!preferences) {
    throw new BadRequestError('Preferences are required');
  }

  let userPreferences = await NotificationPreference.findOne({ user: userId });

  if (!userPreferences) {
    userPreferences = await NotificationPreference.create({
      user: userId,
      preferences,
    });
  } else {
    userPreferences.preferences = { ...userPreferences.preferences, ...preferences };
    userPreferences.updatedAt = new Date();
    await userPreferences.save();
  }

  res.json({
    success: true,
    preferences: userPreferences,
  });
});

/**
 * @desc    Get unread notification count
 * @route   GET /api/v1/activity/notifications/unread/count
 * @access  Private
 */
export const getUnreadCount = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const count = await Notification.countDocuments({
    recipient: userId,
    read: false,
  });

  res.json({
    success: true,
    count,
  });
});

