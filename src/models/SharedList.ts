import mongoose, { Schema } from 'mongoose';
import { 
  ISharedList, 
  ISharedListMember, 
  ISharedListPermission, 
  ISharedListInvitation 
} from '../interfaces/SharedList';

// Shared list permission schema
const SharedListPermissionSchema: Schema = new Schema<ISharedListPermission>({
  view: {
    type: Boolean,
    default: true,
  },
  create: {
    type: Boolean,
    default: false,
  },
  update: {
    type: Boolean,
    default: false,
  },
  delete: {
    type: Boolean,
    default: false,
  },
  share: {
    type: Boolean,
    default: false,
  },
});

// Shared list member schema
const SharedListMemberSchema: Schema = new Schema<ISharedListMember>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  permissions: {
    type: SharedListPermissionSchema,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Shared list invitation schema
const SharedListInvitationSchema: Schema = new Schema<ISharedListInvitation>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  permissions: {
    type: SharedListPermissionSchema,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'expired'],
    default: 'pending',
  },
});

// Shared list schema
const SharedListSchema: Schema = new Schema<ISharedList>(
  {
    name: {
      type: String,
      required: [true, 'List name is required'],
      trim: true,
      minlength: [2, 'List name must be at least 2 characters long'],
      maxlength: [100, 'List name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'List description cannot exceed 500 characters'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },
    isTeamList: {
      type: Boolean,
      default: false,
    },
    members: [SharedListMemberSchema],
    invitations: [SharedListInvitationSchema],
    tasks: [{
      type: Schema.Types.ObjectId,
      ref: 'Task',
    }],
    isPublic: {
      type: Boolean,
      default: false,
    },
    publicAccessCode: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Add member method
SharedListSchema.methods.addMember = async function (
  userId: mongoose.Types.ObjectId,
  permissions: ISharedListPermission,
  addedBy: mongoose.Types.ObjectId
): Promise<void> {
  // Check if user is already a member
  const existingMember = this.members.find(
    (member: ISharedListMember) => member.user.toString() === userId.toString()
  );

  if (existingMember) {
    existingMember.permissions = permissions;
  } else {
    this.members.push({
      user: userId,
      permissions,
      addedAt: new Date(),
      addedBy,
    });
  }

  await this.save();
};

// Remove member method
SharedListSchema.methods.removeMember = async function (
  userId: mongoose.Types.ObjectId
): Promise<void> {
  // Cannot remove the owner
  if (this.owner.toString() === userId.toString()) {
    throw new Error('Cannot remove the list owner');
  }

  this.members = this.members.filter(
    (member: ISharedListMember) => member.user.toString() !== userId.toString()
  );

  await this.save();
};

// Update member permissions method
SharedListSchema.methods.updateMemberPermissions = async function (
  userId: mongoose.Types.ObjectId,
  permissions: ISharedListPermission
): Promise<void> {
  const member = this.members.find(
    (m: ISharedListMember) => m.user.toString() === userId.toString()
  );

  if (!member) {
    throw new Error('Member not found');
  }

  member.permissions = permissions;
  await this.save();
};

// Invite member method
SharedListSchema.methods.inviteMember = async function (
  email: string,
  permissions: ISharedListPermission,
  invitedBy: mongoose.Types.ObjectId
): Promise<string> {
  // Generate a random token
  const token = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);

  // Set expiration to 7 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Check if invitation already exists
  const existingInvitation = this.invitations.find(
    (invitation: ISharedListInvitation) => 
      invitation.email === email && 
      invitation.status === 'pending'
  );

  if (existingInvitation) {
    existingInvitation.token = token;
    existingInvitation.expiresAt = expiresAt;
    existingInvitation.permissions = permissions;
    existingInvitation.invitedBy = invitedBy;
  } else {
    this.invitations.push({
      email,
      permissions,
      token,
      expiresAt,
      invitedBy,
      status: 'pending',
    });
  }

  await this.save();
  return token;
};

// Accept invitation method
SharedListSchema.methods.acceptInvitation = async function (
  token: string,
  userId: mongoose.Types.ObjectId
): Promise<void> {
  const invitation = this.invitations.find(
    (inv: ISharedListInvitation) => inv.token === token && inv.status === 'pending'
  );

  if (!invitation) {
    throw new Error('Invitation not found or already processed');
  }

  if (invitation.expiresAt < new Date()) {
    invitation.status = 'expired';
    await this.save();
    throw new Error('Invitation has expired');
  }

  // Add the user as a member
  await this.addMember(userId, invitation.permissions, invitation.invitedBy);

  // Update invitation status
  invitation.status = 'accepted';
  await this.save();
};

// Decline invitation method
SharedListSchema.methods.declineInvitation = async function (
  token: string
): Promise<void> {
  const invitation = this.invitations.find(
    (inv: ISharedListInvitation) => inv.token === token && inv.status === 'pending'
  );

  if (!invitation) {
    throw new Error('Invitation not found or already processed');
  }

  invitation.status = 'declined';
  await this.save();
};

// Add task method
SharedListSchema.methods.addTask = async function (
  taskId: mongoose.Types.ObjectId
): Promise<void> {
  if (!this.tasks.includes(taskId)) {
    this.tasks.push(taskId);
    this.updatedAt = new Date();
    await this.save();
  }
};

// Remove task method
SharedListSchema.methods.removeTask = async function (
  taskId: mongoose.Types.ObjectId
): Promise<void> {
  this.tasks = this.tasks.filter(
    (id: mongoose.Types.ObjectId) => id.toString() !== taskId.toString()
  );
  this.updatedAt = new Date();
  await this.save();
};

// Generate public access code method
SharedListSchema.methods.generatePublicAccessCode = function (): string {
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  this.publicAccessCode = code;
  return code;
};

// Revoke public access method
SharedListSchema.methods.revokePublicAccess = function (): void {
  this.isPublic = false;
  this.publicAccessCode = undefined;
};

export default mongoose.model<ISharedList>('SharedList', SharedListSchema);

