import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { KanbanCard } from './KanbanCard';
import type { Task } from '@/types';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  color,
  tasks,
  onEditTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col h-full">
      <div className={`${color} rounded-t-lg px-4 py-3 border-b-2 border-gray-300`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700">
            {tasks.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 bg-gray-50 rounded-b-lg p-3 space-y-3 min-h-[500px] transition-colors ${
          isOver ? 'bg-primary-50 ring-2 ring-primary-300' : ''
        }`}
      >
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard key={task._id} task={task} onEdit={() => onEditTask(task)} />
          ))
        )}
      </div>
    </div>
  );
};

