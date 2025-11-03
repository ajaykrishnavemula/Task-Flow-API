import { Document, Types } from 'mongoose';

/**
 * Team member role interface
 */
export interface ITeamMemberRole {
  role: 'owner' | 'admin' | 'member' | 'guest';
  permissions: {
    createTask: boolean;
    updateTask: boolean;
    deleteTask: boolean;
    assignTask: boolean;
    viewAllTasks: boolean;
    manageTeam: boolean;
    viewReports: boolean;
  };
}

/**
 * Team member interface
 */
export interface ITeamMember {
  user: Types.ObjectId;
  role: ITeamMemberRole;
  joinedAt: Date;
  invitedBy?: Types.ObjectId;
}

/**
 * Team invitation interface
 */
export interface ITeamInvitation {
  email: string;
  role: 'admin' | 'member' | 'guest';
  token: string;
  expiresAt: Date;
  invitedBy: Types.ObjectId;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

/**
 * Team interface
 */
export interface ITeam extends Document {
  name: string;
  description?: string;
  avatar?: string;
  createdBy: Types.ObjectId;
  members: ITeamMember[];
  invitations: ITeamInvitation[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  addMember(userId: Types.ObjectId, role: string): Promise<void>;
  removeMember(userId: Types.ObjectId): Promise<void>;
  updateMemberRole(userId: Types.ObjectId, role: string): Promise<void>;
  inviteMember(email: string, role: string, invitedBy: Types.ObjectId): Promise<string>;
  acceptInvitation(token: string, userId: Types.ObjectId): Promise<void>;
  declineInvitation(token: string): Promise<void>;
}

// Made with Bob
