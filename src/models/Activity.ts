import mongoose, { Schema } from 'mongoose';
import { IActivity, ActivityType, INotification, INotificationPreference } from '../interfaces/Activity';

// Activity schema
const ActivitySchema: Schema = new Schema<IActivity>({
  type: {
    type: String,
    required: true,
    enum: [
      // Task activities
      'task_created',
      'task_updated',
      'task_deleted',
      'task_completed',
      'task_reopened',
      'task_assigned',
      'task_unassigned',
      'task_due_date_changed',
      'task_priority_changed',
      'task_category_changed',
      'task_attachment_added',
      'task_attachment_removed',
      'task_comment_added',
      'task_comment_updated',
      'task_comment_deleted',
      'task_subtask_added',
      'task_subtask_updated',
      'task_subtask_deleted',
      'task_subtask_completed',
      'task_subtask_reopened',
      
      // Team activities
      'team_created',
      'team_updated',
      'team_deleted',
      'team_member_added',
      'team_member_removed',
      'team_member_role_changed',
      'team_invitation_sent',
      'team_invitation_accepted',
      'team_invitation_declined',
      
      // Shared list activities
      'shared_list_created',
      'shared_list_updated',
      'shared_list_deleted',
      'shared_list_member_added',
      'shared_list_member_removed',
      'shared_list_permissions_changed',
      'shared_list_task_added',
      'shared_list_task_removed',
    ],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
  },
  sharedList: {
    type: Schema.Types.ObjectId,
    ref: 'SharedList',
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
  targetUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for faster querying
ActivitySchema.index({ user: 1, createdAt: -1 });
ActivitySchema.index({ task: 1, createdAt: -1 });
ActivitySchema.index({ team: 1, createdAt: -1 });
ActivitySchema.index({ sharedList: 1, createdAt: -1 });
ActivitySchema.index({ targetUser: 1, createdAt: -1 });
ActivitySchema.index({ createdAt: -1 });

// Notification schema
const NotificationSchema: Schema = new Schema<INotification>({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  activity: {
    type: Schema.Types.ObjectId,
    ref: 'Activity',
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for faster querying
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ activity: 1 });

// Notification preference schema
const NotificationPreferenceSchema: Schema = new Schema<INotificationPreference>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  preferences: {
    type: Schema.Types.Mixed,
    default: {
      // Default preferences for all activity types
      task_created: { inApp: true, email: false, push: false },
      task_updated: { inApp: true, email: false, push: false },
      task_deleted: { inApp: true, email: false, push: false },
      task_completed: { inApp: true, email: false, push: false },
      task_reopened: { inApp: true, email: false, push: false },
      task_assigned: { inApp: true, email: true, push: true },
      task_unassigned: { inApp: true, email: false, push: false },
      task_due_date_changed: { inApp: true, email: true, push: false },
      task_priority_changed: { inApp: true, email: false, push: false },
      task_category_changed: { inApp: true, email: false, push: false },
      task_attachment_added: { inApp: true, email: false, push: false },
      task_attachment_removed: { inApp: true, email: false, push: false },
      task_comment_added: { inApp: true, email: false, push: true },
      task_comment_updated: { inApp: true, email: false, push: false },
      task_comment_deleted: { inApp: true, email: false, push: false },
      task_subtask_added: { inApp: true, email: false, push: false },
      task_subtask_updated: { inApp: true, email: false, push: false },
      task_subtask_deleted: { inApp: true, email: false, push: false },
      task_subtask_completed: { inApp: true, email: false, push: false },
      task_subtask_reopened: { inApp: true, email: false, push: false },
      
      team_created: { inApp: true, email: false, push: false },
      team_updated: { inApp: true, email: false, push: false },
      team_deleted: { inApp: true, email: true, push: false },
      team_member_added: { inApp: true, email: false, push: false },
      team_member_removed: { inApp: true, email: true, push: false },
      team_member_role_changed: { inApp: true, email: true, push: false },
      team_invitation_sent: { inApp: true, email: true, push: false },
      team_invitation_accepted: { inApp: true, email: false, push: false },
      team_invitation_declined: { inApp: true, email: false, push: false },
      
      shared_list_created: { inApp: true, email: false, push: false },
      shared_list_updated: { inApp: true, email: false, push: false },
      shared_list_deleted: { inApp: true, email: true, push: false },
      shared_list_member_added: { inApp: true, email: false, push: false },
      shared_list_member_removed: { inApp: true, email: true, push: false },
      shared_list_permissions_changed: { inApp: true, email: true, push: false },
      shared_list_task_added: { inApp: true, email: false, push: false },
      shared_list_task_removed: { inApp: true, email: false, push: false },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create models
const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
const NotificationPreference = mongoose.model<INotificationPreference>('NotificationPreference', NotificationPreferenceSchema);

export { Activity, Notification, NotificationPreference };

