import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Team from '../models/Team';
import asyncWrapper from '../middleware/async';
import { BadRequestError, NotFoundError, UnauthenticatedError } from '../errors/custom-error';

/**
 * Create a new team
 * @route POST /api/v1/teams
 */
export const createTeam = asyncWrapper(async (req: Request, res: Response) => {
  const { name, description, avatar } = req.body;
  const userId = req.user?.userId;

  if (!name) {
    throw new BadRequestError('Team name is required');
  }

  // Create team with creator as owner
  const team = await Team.create({
    name,
    description,
    avatar,
    createdBy: userId,
    members: [{
      user: userId,
      role: {
        role: 'owner',
        permissions: {
          createTask: true,
          updateTask: true,
          deleteTask: true,
          assignTask: true,
          viewAllTasks: true,
          manageTeam: true,
          viewReports: true,
        },
      },
      joinedAt: new Date(),
    }],
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Team created successfully',
    team,
  });
});

/**
 * Get all teams for the current user
 * @route GET /api/v1/teams
 */
export const getMyTeams = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const teams = await Team.find({
    'members.user': userId,
    isActive: true,
  }).populate('members.user', 'name email');

  res.status(StatusCodes.OK).json({
    success: true,
    count: teams.length,
    teams,
  });
});

/**
 * Get a single team by ID
 * @route GET /api/v1/teams/:id
 */
export const getTeam = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const team = await Team.findById(id)
    .populate('members.user', 'name email')
    .populate('createdBy', 'name email');

  if (!team) {
    throw new NotFoundError(`No team found with id ${id}`);
  }

  // Check if user is a member
  const isMember = team.members.some(
    (member: any) => member.user._id.toString() === userId
  );

  if (!isMember) {
    throw new UnauthenticatedError('Not authorized to view this team');
  }

  res.status(StatusCodes.OK).json({
    success: true,
    team,
  });
});

/**
 * Update a team
 * @route PATCH /api/v1/teams/:id
 */
export const updateTeam = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const { name, description, avatar } = req.body;

  const team = await Team.findById(id);

  if (!team) {
    throw new NotFoundError(`No team found with id ${id}`);
  }

  // Check if user has permission to manage team
  const member = team.members.find(
    (m: any) => m.user.toString() === userId
  );

  if (!member || !member.role.permissions.manageTeam) {
    throw new UnauthenticatedError('Not authorized to update this team');
  }

  // Update team
  if (name) team.name = name;
  if (description !== undefined) team.description = description;
  if (avatar !== undefined) team.avatar = avatar;

  await team.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Team updated successfully',
    team,
  });
});

/**
 * Delete a team
 * @route DELETE /api/v1/teams/:id
 */
export const deleteTeam = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const team = await Team.findById(id);

  if (!team) {
    throw new NotFoundError(`No team found with id ${id}`);
  }

  // Only owner can delete team
  const ownerMember = team.members.find(
    (m: any) => m.role.role === 'owner'
  );

  if (!ownerMember || ownerMember.user.toString() !== userId) {
    throw new UnauthenticatedError('Only team owner can delete the team');
  }

  // Soft delete by setting isActive to false
  team.isActive = false;
  await team.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Team deleted successfully',
  });
});

/**
 * Add a member to a team
 * @route POST /api/v1/teams/:id/members
 */
export const addTeamMember = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const { userId: newMemberId, role } = req.body;

  if (!newMemberId || !role) {
    throw new BadRequestError('User ID and role are required');
  }

  const team = await Team.findById(id);

  if (!team) {
    throw new NotFoundError(`No team found with id ${id}`);
  }

  // Check if user has permission to manage team
  const member = team.members.find(
    (m: any) => m.user.toString() === userId
  );

  if (!member || !member.role.permissions.manageTeam) {
    throw new UnauthenticatedError('Not authorized to add members to this team');
  }

  // Add member
  await team.addMember(newMemberId, role);

  const updatedTeam = await Team.findById(id).populate('members.user', 'name email');

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Member added successfully',
    team: updatedTeam,
  });
});

/**
 * Remove a member from a team
 * @route DELETE /api/v1/teams/:id/members/:memberId
 */
export const removeTeamMember = asyncWrapper(async (req: Request, res: Response) => {
  const { id, memberId } = req.params;
  const userId = req.user?.userId;

  const team = await Team.findById(id);

  if (!team) {
    throw new NotFoundError(`No team found with id ${id}`);
  }

  // Check if user has permission to manage team
  const member = team.members.find(
    (m: any) => m.user.toString() === userId
  );

  if (!member || !member.role.permissions.manageTeam) {
    throw new UnauthenticatedError('Not authorized to remove members from this team');
  }

  // Remove member
  await team.removeMember(memberId);

  const updatedTeam = await Team.findById(id).populate('members.user', 'name email');

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Member removed successfully',
    team: updatedTeam,
  });
});

/**
 * Update a member's role
 * @route PATCH /api/v1/teams/:id/members/:memberId
 */
export const updateMemberRole = asyncWrapper(async (req: Request, res: Response) => {
  const { id, memberId } = req.params;
  const userId = req.user?.userId;
  const { role } = req.body;

  if (!role) {
    throw new BadRequestError('Role is required');
  }

  const team = await Team.findById(id);

  if (!team) {
    throw new NotFoundError(`No team found with id ${id}`);
  }

  // Check if user has permission to manage team
  const member = team.members.find(
    (m: any) => m.user.toString() === userId
  );

  if (!member || !member.role.permissions.manageTeam) {
    throw new UnauthenticatedError('Not authorized to update member roles');
  }

  // Update member role
  await team.updateMemberRole(memberId, role);

  const updatedTeam = await Team.findById(id).populate('members.user', 'name email');

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Member role updated successfully',
    team: updatedTeam,
  });
});

/**
 * Invite a member to a team
 * @route POST /api/v1/teams/:id/invite
 */
export const inviteTeamMember = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const { email, role } = req.body;

  if (!email || !role) {
    throw new BadRequestError('Email and role are required');
  }

  const team = await Team.findById(id);

  if (!team) {
    throw new NotFoundError(`No team found with id ${id}`);
  }

  // Check if user has permission to manage team
  const member = team.members.find(
    (m: any) => m.user.toString() === userId
  );

  if (!member || !member.role.permissions.manageTeam) {
    throw new UnauthenticatedError('Not authorized to invite members to this team');
  }

  // Invite member
  const token = await team.inviteMember(email, role, userId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Invitation sent successfully',
    token, // In production, this would be sent via email
  });
});

/**
 * Accept a team invitation
 * @route POST /api/v1/teams/accept-invitation
 */
export const acceptInvitation = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { token } = req.body;

  if (!token) {
    throw new BadRequestError('Invitation token is required');
  }

  // Find team with this invitation token
  const team = await Team.findOne({
    'invitations.token': token,
    'invitations.status': 'pending',
  });

  if (!team) {
    throw new NotFoundError('Invitation not found or already processed');
  }

  // Accept invitation
  await team.acceptInvitation(token, userId);

  const updatedTeam = await Team.findById(team._id).populate('members.user', 'name email');

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Invitation accepted successfully',
    team: updatedTeam,
  });
});

/**
 * Decline a team invitation
 * @route POST /api/v1/teams/decline-invitation
 */
export const declineInvitation = asyncWrapper(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw new BadRequestError('Invitation token is required');
  }

  // Find team with this invitation token
  const team = await Team.findOne({
    'invitations.token': token,
    'invitations.status': 'pending',
  });

  if (!team) {
    throw new NotFoundError('Invitation not found or already processed');
  }

  // Decline invitation
  await team.declineInvitation(token);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Invitation declined successfully',
  });
});

// Made with Bob