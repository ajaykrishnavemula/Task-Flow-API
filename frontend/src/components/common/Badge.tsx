import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    danger: 'bg-danger-100 text-danger-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: string; className?: string }> = ({
  status,
  className = '',
}) => {
  const statusConfig: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    todo: { variant: 'default', label: 'To Do' },
    'in-progress': { variant: 'primary', label: 'In Progress' },
    'in-review': { variant: 'info', label: 'In Review' },
    completed: { variant: 'success', label: 'Completed' },
    blocked: { variant: 'danger', label: 'Blocked' },
    cancelled: { variant: 'default', label: 'Cancelled' },
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};

export const PriorityBadge: React.FC<{ priority: string; className?: string }> = ({
  priority,
  className = '',
}) => {
  const priorityConfig: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    low: { variant: 'success', label: 'Low' },
    medium: { variant: 'warning', label: 'Medium' },
    high: { variant: 'danger', label: 'High' },
    urgent: { variant: 'danger', label: 'Urgent' },
  };

  const config = priorityConfig[priority] || { variant: 'default', label: priority };

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};
