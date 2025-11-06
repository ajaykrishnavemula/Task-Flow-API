import { Document, Types } from 'mongoose';

// Interface for user profile
export interface IUserProfile {
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  position?: string;
  skills?: string[];
  phoneNumber?: string;
  dateOfBirth?: Date;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    facebook?: string;
    instagram?: string;
  };
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  department?: string;
  employeeId?: string;
  timezone?: string;
  languages?: string[];
}

// Interface for user preferences
export interface IUserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  emailNotifications?: {
    taskAssigned: boolean;
    taskCompleted: boolean;
    taskDueSoon: boolean;
    taskCommented: boolean;
    teamInvitation: boolean;
    listShared: boolean;
    dailySummary: boolean;
    weeklySummary: boolean;
  };
  pushNotifications?: {
    taskAssigned: boolean;
    taskCompleted: boolean;
    taskDueSoon: boolean;
    taskCommented: boolean;
    teamInvitation: boolean;
    listShared: boolean;
  };
  defaultView?: 'list' | 'board' | 'calendar' | 'timeline';
  defaultTaskSort?: string;
  defaultTaskFilter?: string;
  workingHours?: {
    start: string; // HH:MM format
    end: string; // HH:MM format
    workDays: number[]; // 0-6, where 0 is Sunday
  };
}

// Interface for user statistics
export interface IUserStatistics {
  tasksCreated: number;
  tasksCompleted: number;
  tasksOverdue: number;
  averageCompletionTime?: number; // in hours
  completionRate?: number; // percentage
  productivityScore?: number; // 0-100
  weeklyActivity?: {
    date: string; // YYYY-MM-DD
    count: number;
  }[];
  categoryBreakdown?: {
    category: string;
    count: number;
  }[];
  lastUpdated: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Phase 2 enhancements
  profile?: IUserProfile;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  isActive: boolean;
  
  // Phase 3 enhancements - Teams and collaboration
  teams?: Types.ObjectId[];
  defaultTeam?: Types.ObjectId;
  sharedLists?: Types.ObjectId[];
  defaultList?: Types.ObjectId;
  recentTasks?: Types.ObjectId[];
  favoriteTaskIds?: Types.ObjectId[];
  favoriteListIds?: Types.ObjectId[];
  favoriteTeamIds?: Types.ObjectId[];
  
  // Phase 3 enhancements - User experience
  preferences?: IUserPreferences;
  lastActive?: Date;
  status?: 'online' | 'away' | 'busy' | 'offline';
  
  // Phase 3 enhancements - Analytics
  statistics?: IUserStatistics;
  
  // Phase 3 enhancements - Notifications
  unreadNotifications?: number;
  notificationSettings?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    digest: 'none' | 'daily' | 'weekly';
  };
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  generateVerificationToken(): string;
  generatePasswordResetToken(): string;
  
  // Phase 3 methods
  addRecentTask(taskId: Types.ObjectId): Promise<void>;
  toggleFavoriteTask(taskId: Types.ObjectId): Promise<boolean>;
  toggleFavoriteList(listId: Types.ObjectId): Promise<boolean>;
  toggleFavoriteTeam(teamId: Types.ObjectId): Promise<boolean>;
  updateLastActive(): Promise<void>;
  updateStatus(status: 'online' | 'away' | 'busy' | 'offline'): Promise<void>;
  updateStatistics(): Promise<void>;
  markNotificationsAsRead(): Promise<void>;
}

