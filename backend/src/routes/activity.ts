import express from 'express';
import {
  getActivityFeed,
  getTaskActivity,
  getTeamActivity,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  getUnreadCount,
} from '../controllers/activity';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Activity feed
router.get('/', getActivityFeed);
router.get('/task/:taskId', getTaskActivity);
router.get('/team/:teamId', getTeamActivity);

// Notifications
router.get('/notifications', getNotifications);
router.get('/notifications/unread/count', getUnreadCount);
router.patch('/notifications/read-all', markAllNotificationsAsRead);
router.patch('/notifications/:id/read', markNotificationAsRead);
router.delete('/notifications/:id', deleteNotification);

// Notification preferences
router.get('/preferences', getNotificationPreferences);
router.patch('/preferences', updateNotificationPreferences);

export default router;

