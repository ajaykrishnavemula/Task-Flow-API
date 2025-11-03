import mongoose, { Schema } from 'mongoose';
import { ITeam, ITeamMember, ITeamMemberRole, ITeamInvitation } from '../interfaces/Team';

// Team member role schema
const TeamMemberRoleSchema: Schema = new Schema<ITeamMemberRole>({
  role: {
    type: String,
    enum: ['owner', 'admin', 'member', 'guest'],
    default: 'member',
  },
  permissions: {
    createTask: {
      type: Boolean,
      default: true,
    },
    updateTask: {
      type: Boolean,
      default: true,
    },
    deleteTask: {
      type: Boolean,
      default: false,
    },
    assignTask: {
      type: Boolean,
      default: true,
    },
    viewAllTasks: {
      type: Boolean,
      default: true,
    },
    manageTeam: {
      type: Boolean,
      default: false,
    },
    viewReports: {
      type: Boolean,
      default: false,
    },
  },
});

// Team member schema
const TeamMemberSchema: Schema = new Schema<ITeamMember>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: TeamMemberRoleSchema,
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

// Team invitation schema
const TeamInvitationSchema: Schema = new Schema<ITeamInvitation>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'member', 'guest'],
    default: 'member',
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

// Team schema
const TeamSchema: Schema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      minlength: [2, 'Team name must be at least 2 characters long'],
      maxlength: [50, 'Team name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Team description cannot exceed 500 characters'],
    },
    avatar: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [TeamMemberSchema],
    invitations: [TeamInvitationSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Add member method
TeamSchema.methods.addMember = async function (
  userId: mongoose.Types.ObjectId,
  role: string
): Promise<void> {
  const memberRole: ITeamMemberRole = {
    role: role as 'owner' | 'admin' | 'member' | 'guest',
    permissions: {
      createTask: true,
      updateTask: true,
      deleteTask: role === 'owner' || role === 'admin',
      assignTask: true,
      viewAllTasks: true,
      manageTeam: role === 'owner' || role === 'admin',
      viewReports: role === 'owner' || role === 'admin',
    },
  };

  // Check if user is already a member
  const existingMember = this.members.find(
    (member: ITeamMember) => member.user.toString() === userId.toString()
  );

  if (existingMember) {
    existingMember.role = memberRole;
  } else {
    this.members.push({
      user: userId,
      role: memberRole,
      joinedAt: new Date(),
    });
  }

  await this.save();
};

// Remove member method
TeamSchema.methods.removeMember = async function (
  userId: mongoose.Types.ObjectId
): Promise<void> {
  // Cannot remove the owner
  const ownerMember = this.members.find(
    (member: ITeamMember) => member.role.role === 'owner'
  );
  
  if (ownerMember && ownerMember.user.toString() === userId.toString()) {
    throw new Error('Cannot remove the team owner');
  }

  this.members = this.members.filter(
    (member: ITeamMember) => member.user.toString() !== userId.toString()
  );

  await this.save();
};

// Update member role method
TeamSchema.methods.updateMemberRole = async function (
  userId: mongoose.Types.ObjectId,
  role: string
): Promise<void> {
  const member = this.members.find(
    (m: ITeamMember) => m.user.toString() === userId.toString()
  );

  if (!member) {
    throw new Error('Member not found');
  }

  // Cannot change the role of the owner
  if (member.role.role === 'owner') {
    throw new Error('Cannot change the role of the team owner');
  }

  member.role.role = role as 'admin' | 'member' | 'guest';
  
  // Update permissions based on role
  member.role.permissions = {
    createTask: true,
    updateTask: true,
    deleteTask: role === 'admin',
    assignTask: true,
    viewAllTasks: true,
    manageTeam: role === 'admin',
    viewReports: role === 'admin',
  };

  await this.save();
};

// Invite member method
TeamSchema.methods.inviteMember = async function (
  email: string,
  role: string,
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
    (invitation: ITeamInvitation) => 
      invitation.email === email && 
      invitation.status === 'pending'
  );

  if (existingInvitation) {
    existingInvitation.token = token;
    existingInvitation.expiresAt = expiresAt;
    existingInvitation.role = role as 'admin' | 'member' | 'guest';
    existingInvitation.invitedBy = invitedBy;
  } else {
    this.invitations.push({
      email,
      role: role as 'admin' | 'member' | 'guest',
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
TeamSchema.methods.acceptInvitation = async function (
  token: string,
  userId: mongoose.Types.ObjectId
): Promise<void> {
  const invitation = this.invitations.find(
    (inv: ITeamInvitation) => inv.token === token && inv.status === 'pending'
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
  await this.addMember(userId, invitation.role);

  // Update invitation status
  invitation.status = 'accepted';
  await this.save();
};

// Decline invitation method
TeamSchema.methods.declineInvitation = async function (
  token: string
): Promise<void> {
  const invitation = this.invitations.find(
    (inv: ITeamInvitation) => inv.token === token && inv.status === 'pending'
  );

  if (!invitation) {
    throw new Error('Invitation not found or already processed');
  }

  invitation.status = 'declined';
  await this.save();
};

export default mongoose.model<ITeam>('Team', TeamSchema);

// Made with Bob
