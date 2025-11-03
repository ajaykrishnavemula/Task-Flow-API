import { Document, Types } from 'mongoose';

/**
 * Time period for analytics
 */
export type AnalyticsTimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

/**
 * Task completion statistics interface
 */
export interface ITaskCompletionStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageCompletionTime: number; // in hours
  onTimeCompletion: number;
  lateCompletion: number;
  onTimeCompletionRate: number;
}

/**
 * Task category statistics interface
 */
export interface ICategoryStats {
  category: string;
  count: number;
  completedCount: number;
  completionRate: number;
  averageCompletionTime: number; // in hours
}

/**
 * Task priority statistics interface
 */
export interface IPriorityStats {
  priority: string;
  count: number;
  completedCount: number;
  completionRate: number;
  averageCompletionTime: number; // in hours
}

/**
 * User productivity statistics interface
 */
export interface IUserProductivityStats {
  user: Types.ObjectId;
  tasksAssigned: number;
  tasksCompleted: number;
  completionRate: number;
  averageCompletionTime: number; // in hours
  onTimeCompletion: number;
  lateCompletion: number;
  onTimeCompletionRate: number;
}

/**
 * Team productivity statistics interface
 */
export interface ITeamProductivityStats {
  team: Types.ObjectId;
  tasksAssigned: number;
  tasksCompleted: number;
  completionRate: number;
  averageCompletionTime: number; // in hours
  onTimeCompletion: number;
  lateCompletion: number;
  onTimeCompletionRate: number;
  memberStats: IUserProductivityStats[];
}

/**
 * Time tracking statistics interface
 */
export interface ITimeTrackingStats {
  totalTimeTracked: number; // in minutes
  averageTimePerTask: number; // in minutes
  timeByCategory: {
    category: string;
    timeSpent: number; // in minutes
  }[];
  timeByPriority: {
    priority: string;
    timeSpent: number; // in minutes
  }[];
  timeByUser: {
    user: Types.ObjectId;
    timeSpent: number; // in minutes
  }[];
}

/**
 * Dashboard analytics interface
 */
export interface IDashboardAnalytics {
  taskCompletionStats: ITaskCompletionStats;
  categoryStats: ICategoryStats[];
  priorityStats: IPriorityStats[];
  userProductivityStats: IUserProductivityStats[];
  teamProductivityStats?: ITeamProductivityStats[];
  timeTrackingStats?: ITimeTrackingStats;
  startDate: Date;
  endDate: Date;
  period: AnalyticsTimePeriod;
  generatedAt: Date;
}

/**
 * Saved report interface
 */
export interface ISavedReport extends Document {
  name: string;
  description?: string;
  owner: Types.ObjectId;
  team?: Types.ObjectId;
  isTeamReport: boolean;
  isPublic: boolean;
  reportType: 'task_completion' | 'category_analysis' | 'priority_analysis' | 'user_productivity' | 'team_productivity' | 'time_tracking' | 'custom';
  filters: {
    startDate?: Date;
    endDate?: Date;
    period?: AnalyticsTimePeriod;
    categories?: string[];
    priorities?: string[];
    users?: Types.ObjectId[];
    teams?: Types.ObjectId[];
    includeSubtasks?: boolean;
    includeArchived?: boolean;
    customFilters?: {
      [key: string]: any;
    };
  };
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    dayOfWeek?: number; // 0-6, where 0 is Sunday
    dayOfMonth?: number; // 1-31
    time?: string; // HH:MM format
    recipients: string[]; // email addresses
    lastSent?: Date;
    nextScheduled?: Date;
  };
  lastGenerated?: {
    data: any;
    date: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

