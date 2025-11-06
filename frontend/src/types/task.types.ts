// Task types based on backend Task model

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'completed';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Subtask {
  _id?: string;
  name: string;
  completed: boolean;
  createdAt?: Date;
  completedAt?: Date;
}

export interface TaskAttachment {
  _id?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedAt?: Date;
}

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval: number;
  endDate?: Date;
  count?: number;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  monthOfYear?: number; // 0-11 (January-December)
}

export interface Task {
  _id: string;
  name: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date;
  category?: string;
  tags?: string[];
  createdBy: string;
  assignedTo?: string[];
  subtasks?: Subtask[];
  dependencies?: string[];
  attachments?: TaskAttachment[];
  isMarkdown?: boolean;
  isRecurring?: boolean;
  recurrenceRule?: RecurrenceRule;
  parentTaskId?: string;
  startDate?: Date;
  completedAt?: Date;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskData {
  name: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date;
  category?: string;
  tags?: string[];
  assignedTo?: string[];
  subtasks?: Omit<Subtask, '_id' | 'createdAt' | 'completedAt'>[];
  dependencies?: string[];
  isMarkdown?: boolean;
  isRecurring?: boolean;
  recurrenceRule?: RecurrenceRule;
  startDate?: Date;
  estimatedTime?: number;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  completed?: boolean;
  actualTime?: number;
}

export interface TaskFilters {
  completed?: boolean;
  priority?: TaskPriority | TaskPriority[];
  status?: TaskStatus | TaskStatus[];
  category?: string;
  tags?: string[];
  assignedTo?: string;
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  search?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  byStatus: {
    todo: number;
    'in-progress': number;
    'in-review': number;
    completed: number;
  };
}

export interface TaskGroup {
  status: TaskStatus;
  tasks: Task[];
  count: number;
}

