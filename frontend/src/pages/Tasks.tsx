import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { 
  Button, 
  Input, 
  Dropdown, 
  Card, 
  Loading, 
  StatusBadge, 
  PriorityBadge,
  MenuDropdown 
} from '@/components/common';
import { TaskModal } from '@/components/kanban';
import { useTaskStore } from '@/store/taskStore';
import type { Task, TaskFilters } from '@/types';
import type { DropdownOption } from '@/components/common/Dropdown';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  CheckCircle,
  Circle,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Tasks: React.FC = () => {
  const { tasks, isLoading, fetchTasks, deleteTask, toggleTaskCompletion } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTasks(filters);
  }, [fetchTasks, filters]);

  const statusOptions: DropdownOption[] = [
    { label: 'All Status', value: '' },
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'In Review', value: 'in-review' },
    { label: 'Completed', value: 'completed' },
  ];

  const priorityOptions: DropdownOption[] = [
    { label: 'All Priorities', value: '' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
  ];

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleToggleCompletion = async (taskId: string) => {
    try {
      await toggleTaskCompletion(taskId);
    } catch (error) {
      toast.error('Failed to toggle task completion');
    }
  };

  const handleStatusFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value ? (value as any) : undefined,
    }));
  };

  const handlePriorityFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      priority: value ? (value as any) : undefined,
    }));
  };

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && !tasks.length) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loading size="lg" text="Loading tasks..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600 mt-1">Manage and organize your tasks</p>
          </div>
          <Button onClick={handleCreateTask} leftIcon={<Plus className="w-5 h-5" />}>
            New Task
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <div className="p-4 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-5 h-5 text-gray-400" />}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<Filter className="w-5 h-5" />}
              >
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Dropdown
                    options={statusOptions}
                    value={filters.status as string || ''}
                    onChange={handleStatusFilter}
                    placeholder="Select status"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <Dropdown
                    options={priorityOptions}
                    value={filters.priority as string || ''}
                    onChange={handlePriorityFilter}
                    placeholder="Select priority"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Completion</label>
                  <Dropdown
                    options={[
                      { label: 'All Tasks', value: '' },
                      { label: 'Completed', value: 'true' },
                      { label: 'Incomplete', value: 'false' },
                    ]}
                    value={filters.completed !== undefined ? String(filters.completed) : ''}
                    onChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        completed: value ? value === 'true' : undefined,
                      }))
                    }
                    placeholder="Select completion"
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <Card>
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || Object.keys(filters).length > 0
                    ? 'Try adjusting your search or filters'
                    : 'Get started by creating your first task'}
                </p>
                <Button onClick={handleCreateTask}>Create Task</Button>
              </div>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task._id} hoverable>
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Completion Checkbox */}
                    <button
                      onClick={() => handleToggleCompletion(task._id)}
                      className="mt-1 flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle className="w-6 h-6 text-success-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 hover:text-primary-600" />
                      )}
                    </button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3
                            className={`text-lg font-semibold ${
                              task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}
                          >
                            {task.name}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Actions Menu */}
                        <MenuDropdown
                          trigger={
                            <button className="text-gray-400 hover:text-gray-600 p-1">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          }
                          items={[
                            {
                              label: 'View Details',
                              icon: <Eye className="w-4 h-4" />,
                              onClick: () => handleEditTask(task),
                            },
                            {
                              label: 'Edit',
                              icon: <Edit className="w-4 h-4" />,
                              onClick: () => handleEditTask(task),
                            },
                            {
                              label: 'Delete',
                              icon: <Trash2 className="w-4 h-4" />,
                              onClick: () => handleDeleteTask(task._id),
                              danger: true,
                            },
                          ]}
                        />
                      </div>

                      {/* Task Meta */}
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        {task.status && <StatusBadge status={task.status} />}
                        <PriorityBadge priority={task.priority} />
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                          </div>
                        )}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex gap-1">
                            {task.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {task.tags.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                                +{task.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
        />
      )}
    </MainLayout>
  );
};

export default Tasks;

