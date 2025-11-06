// Common types used across the application

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  order: SortOrder;
}

export interface FilterConfig {
  [key: string]: any;
}

export interface SearchParams {
  query: string;
  filters?: FilterConfig;
  sort?: SortConfig;
  pagination?: PaginationParams;
}

// Socket.io event types
export interface SocketEvent<T = any> {
  type: string;
  data: T;
  timestamp: Date;
}

export interface NotificationData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Real-time event types
export type RealTimeEventType = 
  | 'task:created'
  | 'task:updated'
  | 'task:deleted'
  | 'task:assigned'
  | 'task:completed'
  | 'comment:created'
  | 'comment:updated'
  | 'comment:deleted'
  | 'team:member:added'
  | 'team:member:removed'
  | 'team:updated'
  | 'list:shared'
  | 'list:updated';

export interface RealTimeEvent {
  type: RealTimeEventType;
  data: any;
  userId?: string;
  teamId?: string;
  timestamp: Date;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  accentColor: string;
}

// View modes
export type ViewMode = 'list' | 'grid' | 'kanban' | 'calendar';

// Export/Import types
export type ExportFormat = 'json' | 'csv' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  includeCompleted?: boolean;
  dateRange?: DateRange;
  filters?: FilterConfig;
}

