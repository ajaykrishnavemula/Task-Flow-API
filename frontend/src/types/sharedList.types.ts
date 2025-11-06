// Shared List types based on backend SharedList model

export interface SharedListPermission {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  share: boolean;
}

export interface SharedListMember {
  _id?: string;
  user: string;
  permissions: SharedListPermission;
  addedAt: Date;
  addedBy: string;
}

export interface SharedListInvitation {
  _id?: string;
  email: string;
  permissions: SharedListPermission;
  token: string;
  expiresAt: Date;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface SharedList {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  team?: string;
  isTeamList: boolean;
  members: SharedListMember[];
  invitations: SharedListInvitation[];
  tasks: string[];
  isPublic: boolean;
  publicAccessCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSharedListData {
  name: string;
  description?: string;
  team?: string;
  isTeamList?: boolean;
  isPublic?: boolean;
}

export interface UpdateSharedListData {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export interface InviteToSharedListData {
  email: string;
  permissions: SharedListPermission;
}

export interface UpdateMemberPermissionsData {
  userId: string;
  permissions: SharedListPermission;
}

export const DEFAULT_PERMISSIONS: SharedListPermission = {
  view: true,
  create: false,
  update: false,
  delete: false,
  share: false,
};

export const EDITOR_PERMISSIONS: SharedListPermission = {
  view: true,
  create: true,
  update: true,
  delete: false,
  share: false,
};

export const ADMIN_PERMISSIONS: SharedListPermission = {
  view: true,
  create: true,
  update: true,
  delete: true,
  share: true,
};

