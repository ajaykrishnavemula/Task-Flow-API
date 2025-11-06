// Team types based on backend Team model

export type TeamRole = 'owner' | 'admin' | 'member' | 'guest';
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export interface TeamPermissions {
  createTask: boolean;
  updateTask: boolean;
  deleteTask: boolean;
  assignTask: boolean;
  viewAllTasks: boolean;
  manageTeam: boolean;
  viewReports: boolean;
}

export interface TeamMemberRole {
  role: TeamRole;
  permissions: TeamPermissions;
}

export interface TeamMember {
  _id?: string;
  user: string;
  role: TeamMemberRole;
  joinedAt: Date;
  invitedBy?: string;
}

export interface TeamInvitation {
  _id?: string;
  email: string;
  role: Exclude<TeamRole, 'owner'>;
  token: string;
  expiresAt: Date;
  invitedBy: string;
  status: InvitationStatus;
}

export interface Team {
  _id: string;
  name: string;
  description?: string;
  avatar?: string;
  createdBy: string;
  members: TeamMember[];
  invitations: TeamInvitation[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTeamData {
  name: string;
  description?: string;
  avatar?: string;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
  avatar?: string;
}

export interface InviteTeamMemberData {
  email: string;
  role: Exclude<TeamRole, 'owner'>;
}

export interface UpdateMemberRoleData {
  userId: string;
  role: Exclude<TeamRole, 'owner'>;
}

export interface TeamStats {
  totalMembers: number;
  totalTasks: number;
  completedTasks: number;
  pendingInvitations: number;
  activeMembers: number;
}

