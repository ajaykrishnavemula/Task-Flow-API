import { Document, Types } from 'mongoose';

/**
 * Activity types
 */
export type ActivityType = 
  // Task activities
  | 'task_created'
  | 'task_updated'
  | 'task_deleted'
  | 'task_completed'
  | 'task_reopened'
  | 'task_assigned'
  | 'task_unassigned'
  | 'task_due_date_changed'
  | 'task_priority_changed'
  | 'task_category_changed'
  | 'task_attachment_added'
  | 'task_attachment_removed'
  | 'task_comment_added'
  | 'task_comment_updated'
  | 'task_comment_deleted'
  | 'task_subtask_added'
  | 'task_subtask_updated'
  | 'task_subtask_deleted'
  | 'task_subtask_completed'
  | 'task_subtask_reopened'
  
  // Team activities
  | 'team_created'
  | 'team_updated'
  | 'team_deleted'
  | 'team_member_added'
  | 'team_member_removed'
  | 'team_member_role_changed'
  | 'team_invitation_sent'
  | 'team_invitation_accepted'
  | 'team_invitation_declined'
  
  // Shared list activities
  | 'shared_list_created'
  | 'shared_list_updated'
  | 'shared_list_deleted'
  | 'shared_list_member_added'
  | 'shared_list_member_removed'
  | 'shared_list_permissions_changed'
  | 'shared_list_task_added'
  | 'shared_list_task_removed';

/**
 * Activity interface
 */
export interface IActivity extends Document {
  type: ActivityType;
  user: Types.ObjectId;
  task?: Types.ObjectId;
  team?: Types.ObjectId;
  sharedList?: Types.ObjectId;
  comment?: Types.ObjectId;
  targetUser?: Types.ObjectId;
  metadata: {
    [key: string]: any;
  };
  createdAt: Date;
}

/**
 * Notification interface
 */
export interface INotification extends Document {
  recipient: Types.ObjectId;
  activity: Types.ObjectId;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
}

/**
 * Notification preference interface
 */
export interface INotificationPreference extends Document {
  user: Types.ObjectId;
  preferences: {
    [key in ActivityType]?: {
      inApp: boolean;
      email: boolean;
      push: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// Made with Bob
