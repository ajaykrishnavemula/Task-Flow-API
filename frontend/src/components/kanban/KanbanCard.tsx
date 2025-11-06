import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Paperclip, User, MoreVertical } from 'lucide-react';
import { PriorityBadge, MenuDropdown } from '@/components/common';
import { useTaskStore } from '@/store/taskStore';
import type { Task } from '@/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface KanbanCardProps {
  task: Task;
  isDragging?: boolean;
  onEdit?: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ task, isDragging = false, onEdit }) => {
  const { deleteTask } = useTaskStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task._id);
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const menuItems = [
    {
      label: 'Edit',
      icon: <MoreVertical className="w-4 h-4" />,
      onClick: () => onEdit?.(),
    },
    {
      label: 'Delete',
      icon: <MoreVertical className="w-4 h-4" />,
      onClick: handleDelete,
      danger: true,
    },
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 flex-1 line-clamp-2">{task.name}</h4>
        <MenuDropdown
          trigger={
            <button className="text-gray-400 hover:text-gray-600 p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
          }
          items={menuItems}
        />
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2 mb-3">
        <PriorityBadge priority={task.priority} />
        {task.tags && task.tags.length > 0 && (
          <div className="flex gap-1">
            {task.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
            </div>
          )}
          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              <span>{task.attachments.length}</span>
            </div>
          )}
        </div>

        {task.assignedTo && task.assignedTo.length > 0 && (
          <div className="flex -space-x-2">
            {task.assignedTo.slice(0, 3).map((userId, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center"
                title={`User ${userId}`}
              >
                <User className="w-3 h-3 text-primary-600" />
              </div>
            ))}
            {task.assignedTo.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium">
                +{task.assignedTo.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

