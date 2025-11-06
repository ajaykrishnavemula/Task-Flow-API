import api from './api';
import type {
  Comment,
  CreateCommentData,
  UpdateCommentData,
  AddReactionData,
  ApiResponse,
} from '@/types';

class CommentService {
  /**
   * Get all comments for a task
   */
  async getTaskComments(taskId: string): Promise<ApiResponse<Comment[]>> {
    const response = await api.get<ApiResponse<Comment[]>>(`/tasks/${taskId}/comments`);
    return response.data;
  }

  /**
   * Get a single comment by ID
   */
  async getComment(commentId: string): Promise<ApiResponse<Comment>> {
    const response = await api.get<ApiResponse<Comment>>(`/comments/${commentId}`);
    return response.data;
  }

  /**
   * Create a new comment
   */
  async createComment(data: CreateCommentData): Promise<ApiResponse<Comment>> {
    const response = await api.post<ApiResponse<Comment>>('/comments', data);
    return response.data;
  }

  /**
   * Update a comment
   */
  async updateComment(commentId: string, data: UpdateCommentData): Promise<ApiResponse<Comment>> {
    const response = await api.patch<ApiResponse<Comment>>(`/comments/${commentId}`, data);
    return response.data;
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/comments/${commentId}`);
    return response.data;
  }

  /**
   * Get replies to a comment
   */
  async getCommentReplies(commentId: string): Promise<ApiResponse<Comment[]>> {
    const response = await api.get<ApiResponse<Comment[]>>(`/comments/${commentId}/replies`);
    return response.data;
  }

  /**
   * Upload attachment to a comment
   */
  async uploadAttachment(commentId: string, file: File): Promise<ApiResponse<Comment>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ApiResponse<Comment>>(
      `/comments/${commentId}/attachments`,
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
   * Delete attachment from a comment
   */
  async deleteAttachment(commentId: string, attachmentId: string): Promise<ApiResponse<Comment>> {
    const response = await api.delete<ApiResponse<Comment>>(
      `/comments/${commentId}/attachments/${attachmentId}`
    );
    return response.data;
  }

  /**
   * Add reaction to a comment
   */
  async addReaction(data: AddReactionData): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>(
      `/comments/${data.commentId}/reactions`,
      { reaction: data.reaction }
    );
    return response.data;
  }

  /**
   * Remove reaction from a comment
   */
  async removeReaction(commentId: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/comments/${commentId}/reactions`);
    return response.data;
  }

  /**
   * Get reactions for a comment
   */
  async getCommentReactions(commentId: string): Promise<ApiResponse<any[]>> {
    const response = await api.get<ApiResponse<any[]>>(`/comments/${commentId}/reactions`);
    return response.data;
  }

  /**
   * Add mention to a comment
   */
  async addMention(commentId: string, userId: string): Promise<ApiResponse<Comment>> {
    const response = await api.post<ApiResponse<Comment>>(`/comments/${commentId}/mentions`, {
      userId,
    });
    return response.data;
  }

  /**
   * Remove mention from a comment
   */
  async removeMention(commentId: string, userId: string): Promise<ApiResponse<Comment>> {
    const response = await api.delete<ApiResponse<Comment>>(
      `/comments/${commentId}/mentions/${userId}`
    );
    return response.data;
  }
}

export default new CommentService();

