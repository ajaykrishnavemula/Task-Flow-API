import { Document, Types } from 'mongoose';

// Interface for subtask
export interface ISubtask {
  name: string;
  completed: boolean;
  createdAt?: Date;
  completedAt?: Date;
  assignedTo?: Types.ObjectId;
  dueDate?: Date;
}

// Interface for file attachment
export interface IAttachment {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedAt: Date;
  uploadedBy?: Types.ObjectId;
}

// Interface for recurrence rule
export interface IRecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // e.g., every 2 days, every 3 weeks
  endDate?: Date;
  count?: number; // number of occurrences
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
  dayOfMonth?: number;
  monthOfYear?: number;
}

// Interface for time tracking entry
export interface ITimeTrackingEntry {
  user: Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for task comment reference
export interface ITaskCommentRef {
  commentId: Types.ObjectId;
  createdAt: Date;
}

export interface ITask extends Document {
  name: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  category?: string;
  tags?: string[];
  createdBy: string;
  assignedTo?: string[];
  createdAt: Date;
  updatedAt: Date;
  
  // Phase 2 enhancements
  subtasks?: ISubtask[];
  dependencies?: Types.ObjectId[]; // Tasks that this task depends on
  attachments?: IAttachment[];
  isMarkdown?: boolean; // Whether description is in markdown format
  
  // Recurring task properties
  isRecurring?: boolean;
  recurrenceRule?: IRecurrenceRule;
  parentTaskId?: Types.ObjectId; // For tasks created from a recurring task
  
  // Task status tracking
  startDate?: Date;
  completedAt?: Date;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  
  // Phase 3 enhancements - Collaboration
  team?: Types.ObjectId; // Team that owns this task
  sharedList?: Types.ObjectId; // Shared list this task belongs to
  watchers?: Types.ObjectId[]; // Users watching this task
  comments?: ITaskCommentRef[]; // References to comments on this task
  lastActivityAt?: Date; // Last activity timestamp
  lastActivityBy?: Types.ObjectId; // User who performed the last activity
  
  // Phase 3 enhancements - Advanced status tracking
  status?: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  statusHistory?: {
    status: string;
    changedAt: Date;
    changedBy: Types.ObjectId;
    comment?: string;
  }[];
  
  // Phase 3 enhancements - Time tracking
  timeTracking?: ITimeTrackingEntry[];
  totalTimeSpent?: number; // in minutes
  
  // Phase 3 enhancements - Visibility
  isPublic: boolean;
  accessCode?: string; // For public tasks with restricted access
  
  // Phase 3 enhancements - Task relationships
  dependents?: Types.ObjectId[]; // Tasks that depend on this task
  relatedTasks?: Types.ObjectId[]; // Tasks that are related but not dependencies
  
  // Phase 3 enhancements - Completion tracking
  completedBy?: Types.ObjectId; // User who completed the task
  verifiedBy?: Types.ObjectId; // User who verified the task completion
  verifiedAt?: Date; // When the task was verified
}

// Made with Bob
