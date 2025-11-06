import { create } from 'zustand';
import type { Task, CreateTaskData, UpdateTaskData, TaskFilters, TaskStats } from '@/types';
import { taskService } from '@/services';
import toast from 'react-hot-toast';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  stats: TaskStats | null;
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;
}

interface TaskActions {
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  createTask: (data: CreateTaskData) => Promise<Task | null>;
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  fetchTaskStats: (filters?: TaskFilters) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
  setCurrentTask: (task: Task | null) => void;
  clearError: () => void;
}

type TaskStore = TaskState & TaskActions;

const initialFilters: TaskFilters = {};

export const useTaskStore = create<TaskStore>((set, get) => ({
  // Initial state
  tasks: [],
  currentTask: null,
  stats: null,
  filters: initialFilters,
  isLoading: false,
  error: null,

  // Actions
  fetchTasks: async (filters?: TaskFilters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.getTasks(filters || get().filters);
      if (response.success && response.data) {
        set({
          tasks: response.data.data,
          isLoading: false,
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch tasks';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  fetchTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.getTask(id);
      if (response.success && response.data) {
        set({
          currentTask: response.data,
          isLoading: false,
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch task';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  createTask: async (data: CreateTaskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.createTask(data);
      if (response.success && response.data) {
        set((state) => ({
          tasks: [response.data!, ...state.tasks],
          isLoading: false,
        }));
        toast.success('Task created successfully');
        return response.data;
      }
      return null;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create task';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updateTask: async (id: string, data: UpdateTaskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.updateTask(id, data);
      if (response.success && response.data) {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task._id === id ? response.data! : task
          ),
          currentTask:
            state.currentTask?._id === id ? response.data : state.currentTask,
          isLoading: false,
        }));
        toast.success('Task updated successfully');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update task';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.deleteTask(id);
      if (response.success) {
        set((state) => ({
          tasks: state.tasks.filter((task) => task._id !== id),
          currentTask: state.currentTask?._id === id ? null : state.currentTask,
          isLoading: false,
        }));
        toast.success('Task deleted successfully');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete task';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  toggleTaskCompletion: async (id: string) => {
    try {
      const response = await taskService.toggleTaskCompletion(id);
      if (response.success && response.data) {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task._id === id ? response.data! : task
          ),
          currentTask:
            state.currentTask?._id === id ? response.data : state.currentTask,
        }));
        toast.success(
          response.data.completed
            ? 'Task marked as completed'
            : 'Task marked as incomplete'
        );
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to toggle task completion';
      toast.error(errorMessage);
    }
  },

  fetchTaskStats: async (filters?: TaskFilters) => {
    try {
      const response = await taskService.getTaskStats(filters || get().filters);
      if (response.success && response.data) {
        set({ stats: response.data });
      }
    } catch (error: any) {
      console.error('Failed to fetch task stats:', error);
    }
  },

  setFilters: (filters: TaskFilters) => {
    set({ filters });
    get().fetchTasks(filters);
  },

  clearFilters: () => {
    set({ filters: initialFilters });
    get().fetchTasks(initialFilters);
  },

  setCurrentTask: (task: Task | null) => {
    set({ currentTask: task });
  },

  clearError: () => {
    set({ error: null });
  },
}));

