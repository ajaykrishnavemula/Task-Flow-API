import api from './api';
import type {
  SharedList,
  CreateSharedListData,
  UpdateSharedListData,
  InviteToSharedListData,
  UpdateMemberPermissionsData,
  ApiResponse,
} from '@/types';

class SharedListService {
  /**
   * Get all shared lists for the current user
   */
  async getSharedLists(): Promise<ApiResponse<SharedList[]>> {
    const response = await api.get<ApiResponse<SharedList[]>>('/shared-lists');
    return response.data;
  }

  /**
   * Get a single shared list by ID
   */
  async getSharedList(id: string): Promise<ApiResponse<SharedList>> {
    const response = await api.get<ApiResponse<SharedList>>(`/shared-lists/${id}`);
    return response.data;
  }

  /**
   * Create a new shared list
   */
  async createSharedList(data: CreateSharedListData): Promise<ApiResponse<SharedList>> {
    const response = await api.post<ApiResponse<SharedList>>('/shared-lists', data);
    return response.data;
  }

  /**
   * Update a shared list
   */
  async updateSharedList(
    id: string,
    data: UpdateSharedListData
  ): Promise<ApiResponse<SharedList>> {
    const response = await api.patch<ApiResponse<SharedList>>(`/shared-lists/${id}`, data);
    return response.data;
  }

  /**
   * Delete a shared list
   */
  async deleteSharedList(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/shared-lists/${id}`);
    return response.data;
  }

  /**
   * Invite a member to the shared list
   */
  async inviteMember(
    listId: string,
    data: InviteToSharedListData
  ): Promise<ApiResponse<SharedList>> {
    const response = await api.post<ApiResponse<SharedList>>(`/shared-lists/${listId}/invite`, data);
    return response.data;
  }

  /**
   * Accept shared list invitation
   */
  async acceptInvitation(token: string): Promise<ApiResponse<SharedList>> {
    const response = await api.post<ApiResponse<SharedList>>(
      `/shared-lists/invitations/${token}/accept`
    );
    return response.data;
  }

  /**
   * Decline shared list invitation
   */
  async declineInvitation(token: string): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>(
      `/shared-lists/invitations/${token}/decline`
    );
    return response.data;
  }

  /**
   * Remove a member from the shared list
   */
  async removeMember(listId: string, userId: string): Promise<ApiResponse<SharedList>> {
    const response = await api.delete<ApiResponse<SharedList>>(
      `/shared-lists/${listId}/members/${userId}`
    );
    return response.data;
  }

  /**
   * Update member permissions
   */
  async updateMemberPermissions(
    listId: string,
    data: UpdateMemberPermissionsData
  ): Promise<ApiResponse<SharedList>> {
    const response = await api.patch<ApiResponse<SharedList>>(
      `/shared-lists/${listId}/members/${data.userId}/permissions`,
      { permissions: data.permissions }
    );
    return response.data;
  }

  /**
   * Add task to shared list
   */
  async addTask(listId: string, taskId: string): Promise<ApiResponse<SharedList>> {
    const response = await api.post<ApiResponse<SharedList>>(`/shared-lists/${listId}/tasks`, {
      taskId,
    });
    return response.data;
  }

  /**
   * Remove task from shared list
   */
  async removeTask(listId: string, taskId: string): Promise<ApiResponse<SharedList>> {
    const response = await api.delete<ApiResponse<SharedList>>(
      `/shared-lists/${listId}/tasks/${taskId}`
    );
    return response.data;
  }

  /**
   * Generate public access code
   */
  async generatePublicAccessCode(listId: string): Promise<ApiResponse<{ code: string }>> {
    const response = await api.post<ApiResponse<{ code: string }>>(
      `/shared-lists/${listId}/public-access`
    );
    return response.data;
  }

  /**
   * Revoke public access
   */
  async revokePublicAccess(listId: string): Promise<ApiResponse<SharedList>> {
    const response = await api.delete<ApiResponse<SharedList>>(
      `/shared-lists/${listId}/public-access`
    );
    return response.data;
  }

  /**
   * Access shared list by public code
   */
  async accessByPublicCode(code: string): Promise<ApiResponse<SharedList>> {
    const response = await api.get<ApiResponse<SharedList>>(`/shared-lists/public/${code}`);
    return response.data;
  }

  /**
   * Get shared lists by team
   */
  async getTeamSharedLists(teamId: string): Promise<ApiResponse<SharedList[]>> {
    const response = await api.get<ApiResponse<SharedList[]>>('/shared-lists', {
      params: { team: teamId },
    });
    return response.data;
  }

  /**
   * Leave shared list
   */
  async leaveSharedList(listId: string): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>(`/shared-lists/${listId}/leave`);
    return response.data;
  }

  /**
   * Transfer ownership
   */
  async transferOwnership(listId: string, newOwnerId: string): Promise<ApiResponse<SharedList>> {
    const response = await api.post<ApiResponse<SharedList>>(
      `/shared-lists/${listId}/transfer-ownership`,
      { newOwnerId }
    );
    return response.data;
  }
}

export default new SharedListService();

