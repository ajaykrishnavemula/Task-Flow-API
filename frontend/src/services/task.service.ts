import api from './api';
import type {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  TaskStats,
  Subtask,
  TaskAttachment,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

class TaskService {
  /**
   * Get all tasks with optional filters and pagination
   */
  async getTasks(
    filters?: TaskFilters,
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Task>>> {
    const params = {
      ...filters,
      ...pagination,
    };
    const response = await api.get<ApiResponse<PaginatedResponse<Task>>>('/tasks', { params });
    return response.data;
  }

  /**
   * Get a single task by ID
   */
  async getTask(id: string): Promise<ApiResponse<Task>> {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data;
  }

  /**
   * Create a new task
   */
  async createTask(data: CreateTaskData): Promise<ApiResponse<Task>> {
    const response = await api.post<ApiResponse<Task>>('/tasks', data);
    return response.data;
  }

  /**
   * Update a task
   */
  async updateTask(id: string, data: UpdateTaskData): Promise<ApiResponse<Task>> {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data;
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/tasks/${id}`);
    return response.data;
  }

  /**
   * Toggle task completion status
   */
  async toggleTaskCompletion(id: string): Promise<ApiResponse<Task>> {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/toggle`);
    return response.data;
  }

  /**
   * Get task statistics
   */
  async getTaskStats(filters?: TaskFilters): Promise<ApiResponse<TaskStats>> {
    const response = await api.get<ApiResponse<TaskStats>>('/tasks/stats', {
      params: filters,
    });
    return response.data;
  }

  /**
   * Add a subtask to a task
   */
  async addSubtask(
    taskId: string,
    subtask: Omit<Subtask, '_id' | 'createdAt' | 'completedAt'>
  ): Promise<ApiResponse<Task>> {
    const response = await api.post<ApiResponse<Task>>(`/tasks/${taskId}/subtasks`, subtask);
    return response.data;
  }

  /**
   * Update a subtask
   */
  async updateSubtask(
    taskId: string,
    subtaskId: string,
    data: Partial<Subtask>
  ): Promise<ApiResponse<Task>> {
    const response = await api.patch<ApiResponse<Task>>(
      `/tasks/${taskId}/subtasks/${subtaskId}`,
      data
    );
    return response.data;
  }

  /**
   * Delete a subtask
   */
  async deleteSubtask(taskId: string, subtaskId: string): Promise<ApiResponse<Task>> {
    const response = await api.delete<ApiResponse<Task>>(
      `/tasks/${taskId}/subtasks/${subtaskId}`
    );
    return response.data;
  }

  /**
   * Toggle subtask completion
   */
  async toggleSubtaskCompletion(
    taskId: string,
    subtaskId: string
  ): Promise<ApiResponse<Task>> {
    const response = await api.patch<ApiResponse<Task>>(
      `/tasks/${taskId}/subtasks/${subtaskId}/toggle`
    );
    return response.data;
  }

  /**
   * Upload attachment to a task
   */
  async uploadAttachment(taskId: string, file: File): Promise<ApiResponse<TaskAttachment>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ApiResponse<TaskAttachment>>(
      `/tasks/${taskId}/attachments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Delete an attachment from a task
   */
  async deleteAttachment(taskId: string, attachmentId: string): Promise<ApiResponse<Task>> {
    const response = await api.delete<ApiResponse<Task>>(
      `/tasks/${taskId}/attachments/${attachmentId}`
    );
    return response.data;
  }

  /**
   * Assign task to users
   */
  async assignTask(taskId: string, userIds: string[]): Promise<ApiResponse<Task>> {
    const response = await api.post<ApiResponse<Task>>(`/tasks/${taskId}/assign`, {
      userIds,
    });
    return response.data;
  }

  /**
   * Unassign task from users
   */
  async unassignTask(taskId: string, userIds: string[]): Promise<ApiResponse<Task>> {
    const response = await api.post<ApiResponse<Task>>(`/tasks/${taskId}/unassign`, {
      userIds,
    });
    return response.data;
  }

  /**
   * Add dependency to a task
   */
  async addDependency(taskId: string, dependencyId: string): Promise<ApiResponse<Task>> {
    const response = await api.post<ApiResponse<Task>>(`/tasks/${taskId}/dependencies`, {
      dependencyId,
    });
    return response.data;
  }

  /**
   * Remove dependency from a task
   */
  async removeDependency(taskId: string, dependencyId: string): Promise<ApiResponse<Task>> {
    const response = await api.delete<ApiResponse<Task>>(
      `/tasks/${taskId}/dependencies/${dependencyId}`
    );
    return response.data;
  }

  /**
   * Get tasks by category
   */
  async getTasksByCategory(category: string): Promise<ApiResponse<Task[]>> {
    const response = await api.get<ApiResponse<Task[]>>('/tasks', {
      params: { category },
    });
    return response.data;
  }

  /**
   * Get tasks by tag
   */
  async getTasksByTag(tag: string): Promise<ApiResponse<Task[]>> {
    const response = await api.get<ApiResponse<Task[]>>('/tasks', {
      params: { tags: tag },
    });
    return response.data;
  }

  /**
   * Get overdue tasks
   */
  async getOverdueTasks(): Promise<ApiResponse<Task[]>> {
    const response = await api.get<ApiResponse<Task[]>>('/tasks/overdue');
    return response.data;
  }

  /**
   * Get tasks due today
   */
  async getTasksDueToday(): Promise<ApiResponse<Task[]>> {
    const response = await api.get<ApiResponse<Task[]>>('/tasks/due-today');
    return response.data;
  }

  /**
   * Get recurring tasks
   */
  async getRecurringTasks(): Promise<ApiResponse<Task[]>> {
    const response = await api.get<ApiResponse<Task[]>>('/tasks', {
      params: { isRecurring: true },
    });
    return response.data;
  }

  /**
   * Duplicate a task
   */
  async duplicateTask(id: string): Promise<ApiResponse<Task>> {
    const response = await api.post<ApiResponse<Task>>(`/tasks/${id}/duplicate`);
    return response.data;
  }

  /**
   * Bulk update tasks
   */
  async bulkUpdateTasks(
    taskIds: string[],
    data: UpdateTaskData
  ): Promise<ApiResponse<Task[]>> {
    const response = await api.patch<ApiResponse<Task[]>>('/tasks/bulk', {
      taskIds,
      ...data,
    });
    return response.data;
  }

  /**
   * Bulk delete tasks
   */
  async bulkDeleteTasks(taskIds: string[]): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>('/tasks/bulk', {
      data: { taskIds },
    });
    return response.data;
  }

  /**
   * Search tasks
   */
  async searchTasks(query: string): Promise<ApiResponse<Task[]>> {
    const response = await api.get<ApiResponse<Task[]>>('/tasks/search', {
      params: { q: query },
    });
    return response.data;
  }

  /**
   * Export tasks
   */
  async exportTasks(format: 'json' | 'csv' | 'pdf', filters?: TaskFilters): Promise<Blob> {
    const response = await api.get('/tasks/export', {
      params: { format, ...filters },
      responseType: 'blob',
    });
    return response.data;
  }
}

export default new TaskService();

