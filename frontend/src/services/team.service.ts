import api from './api';
import type {
  Team,
  CreateTeamData,
  UpdateTeamData,
  InviteTeamMemberData,
  UpdateMemberRoleData,
  TeamStats,
  ApiResponse,
} from '@/types';

class TeamService {
  /**
   * Get all teams for the current user
   */
  async getTeams(): Promise<ApiResponse<Team[]>> {
    const response = await api.get<ApiResponse<Team[]>>('/teams');
    return response.data;
  }

  /**
   * Get a single team by ID
   */
  async getTeam(id: string): Promise<ApiResponse<Team>> {
    const response = await api.get<ApiResponse<Team>>(`/teams/${id}`);
    return response.data;
  }

  /**
   * Create a new team
   */
  async createTeam(data: CreateTeamData): Promise<ApiResponse<Team>> {
    const response = await api.post<ApiResponse<Team>>('/teams', data);
    return response.data;
  }

  /**
   * Update a team
   */
  async updateTeam(id: string, data: UpdateTeamData): Promise<ApiResponse<Team>> {
    const response = await api.patch<ApiResponse<Team>>(`/teams/${id}`, data);
    return response.data;
  }

  /**
   * Delete a team
   */
  async deleteTeam(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/teams/${id}`);
    return response.data;
  }

  /**
   * Invite a member to the team
   */
  async inviteMember(teamId: string, data: InviteTeamMemberData): Promise<ApiResponse<Team>> {
    const response = await api.post<ApiResponse<Team>>(`/teams/${teamId}/invite`, data);
    return response.data;
  }

  /**
   * Accept team invitation
   */
  async acceptInvitation(token: string): Promise<ApiResponse<Team>> {
    const response = await api.post<ApiResponse<Team>>(`/teams/invitations/${token}/accept`);
    return response.data;
  }

  /**
   * Decline team invitation
   */
  async declineInvitation(token: string): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>(`/teams/invitations/${token}/decline`);
    return response.data;
  }

  /**
   * Remove a member from the team
   */
  async removeMember(teamId: string, userId: string): Promise<ApiResponse<Team>> {
    const response = await api.delete<ApiResponse<Team>>(`/teams/${teamId}/members/${userId}`);
    return response.data;
  }

  /**
   * Update member role
   */
  async updateMemberRole(teamId: string, data: UpdateMemberRoleData): Promise<ApiResponse<Team>> {
    const response = await api.patch<ApiResponse<Team>>(
      `/teams/${teamId}/members/${data.userId}/role`,
      { role: data.role }
    );
    return response.data;
  }

  /**
   * Get team statistics
   */
  async getTeamStats(teamId: string): Promise<ApiResponse<TeamStats>> {
    const response = await api.get<ApiResponse<TeamStats>>(`/teams/${teamId}/stats`);
    return response.data;
  }

  /**
   * Get team members
   */
  async getTeamMembers(teamId: string): Promise<ApiResponse<Team['members']>> {
    const response = await api.get<ApiResponse<Team['members']>>(`/teams/${teamId}/members`);
    return response.data;
  }

  /**
   * Get pending invitations for a team
   */
  async getPendingInvitations(teamId: string): Promise<ApiResponse<Team['invitations']>> {
    const response = await api.get<ApiResponse<Team['invitations']>>(
      `/teams/${teamId}/invitations`
    );
    return response.data;
  }

  /**
   * Cancel team invitation
   */
  async cancelInvitation(teamId: string, invitationId: string): Promise<ApiResponse<Team>> {
    const response = await api.delete<ApiResponse<Team>>(
      `/teams/${teamId}/invitations/${invitationId}`
    );
    return response.data;
  }

  /**
   * Resend team invitation
   */
  async resendInvitation(teamId: string, invitationId: string): Promise<ApiResponse<Team>> {
    const response = await api.post<ApiResponse<Team>>(
      `/teams/${teamId}/invitations/${invitationId}/resend`
    );
    return response.data;
  }

  /**
   * Upload team avatar
   */
  async uploadAvatar(teamId: string, file: File): Promise<ApiResponse<{ avatar: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post<ApiResponse<{ avatar: string }>>(
      `/teams/${teamId}/avatar`,
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
   * Delete team avatar
   */
  async deleteAvatar(teamId: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/teams/${teamId}/avatar`);
    return response.data;
  }

  /**
   * Leave team
   */
  async leaveTeam(teamId: string): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>(`/teams/${teamId}/leave`);
    return response.data;
  }

  /**
   * Transfer team ownership
   */
  async transferOwnership(teamId: string, newOwnerId: string): Promise<ApiResponse<Team>> {
    const response = await api.post<ApiResponse<Team>>(`/teams/${teamId}/transfer-ownership`, {
      newOwnerId,
    });
    return response.data;
  }

  /**
   * Archive team
   */
  async archiveTeam(teamId: string): Promise<ApiResponse<Team>> {
    const response = await api.post<ApiResponse<Team>>(`/teams/${teamId}/archive`);
    return response.data;
  }

  /**
   * Restore archived team
   */
  async restoreTeam(teamId: string): Promise<ApiResponse<Team>> {
    const response = await api.post<ApiResponse<Team>>(`/teams/${teamId}/restore`);
    return response.data;
  }
}

export default new TeamService();

