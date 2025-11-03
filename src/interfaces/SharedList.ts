import { Document, Types } from 'mongoose';

/**
 * Shared list permission interface
 */
export interface ISharedListPermission {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  share: boolean;
}

/**
 * Shared list member interface
 */
export interface ISharedListMember {
  user: Types.ObjectId;
  permissions: ISharedListPermission;
  addedAt: Date;
  addedBy: Types.ObjectId;
}

/**
 * Shared list invitation interface
 */
export interface ISharedListInvitation {
  email: string;
  permissions: ISharedListPermission;
  token: string;
  expiresAt: Date;
  invitedBy: Types.ObjectId;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

/**
 * Shared task list interface
 */
export interface ISharedList extends Document {
  name: string;
  description?: string;
  owner: Types.ObjectId;
  team?: Types.ObjectId;
  isTeamList: boolean;
  members: ISharedListMember[];
  invitations: ISharedListInvitation[];
  tasks: Types.ObjectId[];
  isPublic: boolean;
  publicAccessCode?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  addMember(userId: Types.ObjectId, permissions: ISharedListPermission, addedBy: Types.ObjectId): Promise<void>;
  removeMember(userId: Types.ObjectId): Promise<void>;
  updateMemberPermissions(userId: Types.ObjectId, permissions: ISharedListPermission): Promise<void>;
  inviteMember(email: string, permissions: ISharedListPermission, invitedBy: Types.ObjectId): Promise<string>;
  acceptInvitation(token: string, userId: Types.ObjectId): Promise<void>;
  declineInvitation(token: string): Promise<void>;
  addTask(taskId: Types.ObjectId): Promise<void>;
  removeTask(taskId: Types.ObjectId): Promise<void>;
  generatePublicAccessCode(): string;
  revokePublicAccess(): void;
}

// Made with Bob
