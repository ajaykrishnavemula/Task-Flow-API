import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, Tag, Flag } from 'lucide-react';
import { Modal, Button, Input, Dropdown, Badge } from '@/components/common';
import type { DropdownOption } from '@/components/common/Dropdown';
import { useTaskStore } from '@/store/taskStore';
import type { Task, TaskPriority, TaskStatus } from '@/types';
import toast from 'react-hot-toast';

const taskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  status: z.string(),
  priority: z.string(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

const statusOptions: DropdownOption[] = [
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'In Review', value: 'in-review' },
  { label: 'Completed', value: 'completed' },
];

const priorityOptions: DropdownOption[] = [
  { label: 'Low', value: 'low', icon: <Flag className="w-4 h-4 text-green-500" /> },
  { label: 'Medium', value: 'medium', icon: <Flag className="w-4 h-4 text-yellow-500" /> },
  { label: 'High', value: 'high', icon: <Flag className="w-4 h-4 text-orange-500" /> },
  { label: 'Urgent', value: 'urgent', icon: <Flag className="w-4 h-4 text-red-500" /> },
];

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
  const { createTask, updateTask } = useTaskStore();
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(task?.tags || []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: task?.name || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      priority: task?.priority || 'medium',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      tags: task?.tags || [],
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        name: task.name,
        description: task.description,
        status: task.status || 'todo',
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags,
      });
      setTags(task.tags || []);
    }
  }, [task, reset]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsLoading(true);
      const taskData = {
        ...data,
        tags,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      };

      if (task) {
        await updateTask(task._id, {
          ...taskData,
          priority: taskData.priority as TaskPriority,
          status: taskData.status as TaskStatus,
        });
        toast.success('Task updated successfully');
      } else {
        await createTask({
          ...taskData,
          priority: taskData.priority as TaskPriority,
          status: taskData.status as TaskStatus,
        } as any);
        toast.success('Task created successfully');
      }
      onClose();
      reset();
      setTags([]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleClose = () => {
    onClose();
    reset();
    setTags([]);
    setTagInput('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Task Name"
          placeholder="Enter task name"
          error={errors.name?.message}
          {...register('name')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={4}
            placeholder="Enter task description"
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Dropdown
                  options={statusOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select status"
                />
              </div>
            )}
          />

          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <Dropdown
                  options={priorityOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select priority"
                />
              </div>
            )}
          />
        </div>

        <Input
          label="Due Date"
          type="date"
          leftIcon={<Calendar className="w-5 h-5 text-gray-400" />}
          {...register('dueDate')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add a tag"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button type="button" onClick={handleAddTag} variant="outline">
              <Tag className="w-4 h-4" />
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="primary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-primary-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

