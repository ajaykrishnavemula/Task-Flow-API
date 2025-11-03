import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import SharedList from '../models/SharedList';
import Task from '../models/Task';
import User from '../models/User';
import { Activity } from '../models/Activity';
import { BadRequestError, NotFoundError, UnauthenticatedError } from '../errors/custom-error';
import asyncWrapper from '../middleware/async';
import mongoose from 'mongoose';

/**
 * @desc    Create a new shared list
 * @route   POST /api/v1/shared-lists
 * @access  Private
 */
export const createSharedList = asyncWrapper(async (req: Request, res: Response) => {
  const { name, description, isPublic, team } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  if (!name) {
    throw new BadRequestError('List name is required');
  }

  // Create shared list
  const sharedList = await SharedList.create({
    name,
    description,
    owner: userId,
    team,
    isTeamList: !!team,
    isPublic: isPublic || false,
    members: [],
    invitations: [],
    tasks: [],
  });

  // Generate public access code if public
  if (isPublic) {
    sharedList.generatePublicAccessCode();
    await sharedList.save();
  }

  // Log activity
  await Activity.create({
    type: 'shared_list_created',
    user: userId,
    sharedList: sharedList._id,
    metadata: {
      listName: name,
    },
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    sharedList,
  });
});

/**
 * @desc    Get all shared lists for current user
 * @route   GET /api/v1/shared-lists
 * @access  Private
 */
export const getSharedLists = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  // Find lists where user is owner or member
  const sharedLists = await SharedList.find({
    $or: [
      { owner: userId },
      { 'members.user': userId },
    ],
  })
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .populate('team', 'name')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: sharedLists.length,
    sharedLists,
  });
});

/**
 * @desc    Get a single shared list
 * @route   GET /api/v1/shared-lists/:id
 * @access  Private
 */
export const getSharedList = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const sharedList = await SharedList.findById(id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .populate('members.addedBy', 'name email')
    .populate('team', 'name')
    .populate('tasks');

  if (!sharedList) {
    throw new NotFoundError('Shared list not found');
  }

  // Check if user has access
  const isOwner = sharedList.owner._id.toString() === userId;
  const isMember = sharedList.members.some(
    (member: any) => member.user._id.toString() === userId
  );

  if (!isOwner && !isMember && !sharedList.isPublic) {
    throw new UnauthenticatedError('Not authorized to view this list');
  }

  res.json({
    success: true,
    sharedList,
  });
});

/**
 * @desc    Update a shared list
 * @route   PATCH /api/v1/shared-lists/:id
 * @access  Private
 */
export const updateSharedList = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, isPublic } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const sharedList = await SharedList.findById(id);
  if (!sharedList) {
    throw new NotFoundError('Shared list not found');
  }

  // Check if user is owner
  if (sharedList.owner.toString() !== userId) {
    throw new UnauthenticatedError('Only the owner can update the list');
  }

  // Update fields
  if (name) sharedList.name = name;
  if (description !== undefined) sharedList.description = description;
  if (isPublic !== undefined) {
    sharedList.isPublic = isPublic;
    if (isPublic && !sharedList.publicAccessCode) {
      sharedList.generatePublicAccessCode();
    } else if (!isPublic) {
      sharedList.revokePublicAccess();
    }
  }

  sharedList.updatedAt = new Date();
  await sharedList.save();

  // Log activity
  await Activity.create({
    type: 'shared_list_updated',
    user: userId,
    sharedList: sharedList._id,
  });

  res.json({
    success: true,
    sharedList,
  });
});

/**
 * @desc    Delete a shared list
 * @route   DELETE /api/v1/shared-lists/:id
 * @access  Private
 */
export const deleteSharedList = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const sharedList = await SharedList.findById(id);
  if (!sharedList) {
    throw new NotFoundError('Shared list not found');
  }

  // Check if user is owner
  if (sharedList.owner.toString() !== userId) {
    throw new UnauthenticatedError('Only the owner can delete the list');
  }

  await SharedList.findByIdAndDelete(id);

  // Log activity
  await Activity.create({
    type: 'shared_list_deleted',
    user: userId,
    metadata: {
      listName: sharedList.name,
    },
  });

  res.json({
    success: true,
    message: 'Shared list deleted successfully',
  });
});

/**
 * @desc    Add a member to shared list
 * @route   POST /api/v1/shared-lists/:id/members
 * @access  Private
 */
export const addMember = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId: memberUserId, permissions } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  if (!memberUserId) {
    throw new BadRequestError('User ID is required');
  }

  const sharedList = await SharedList.findById(id);
  if (!sharedList) {
    throw new NotFoundError('Shared list not found');
  }

  // Check if current user has permission to add members
  const isOwner = sharedList.owner.toString() === userId;
  const member = sharedList.members.find(
    (m: any) => m.user.toString() === userId
  );
  const canShare = member?.permissions?.share || false;

  if (!isOwner && !canShare) {
    throw new UnauthenticatedError('Not authorized to add members');
  }

  // Check if user exists
  const userToAdd = await User.findById(memberUserId);
  if (!userToAdd) {
    throw new NotFoundError('User not found');
  }

  // Add member with permissions
  await sharedList.addMember(
    new mongoose.Types.ObjectId(memberUserId),
    permissions || {
      view: true,
      create: false,
      update: false,
      delete: false,
      share: false,
    },
    new mongoose.Types.ObjectId(userId)
  );

  await sharedList.populate('members.user', 'name email avatar');

  // Log activity
  await Activity.create({
    type: 'shared_list_member_added',
    user: userId,
    sharedList: sharedList._id,
    targetUser: memberUserId,
  });

  res.json({
    success: true,
    sharedList,
  });
});

/**
 * @desc    Remove a member from shared list
 * @route   DELETE /api/v1/shared-lists/:id/members/:memberId
 * @access  Private
 */
export const removeMember = asyncWrapper(async (req: Request, res: Response) => {
  const { id, memberId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const sharedList = await SharedList.findById(id);
  if (!sharedList) {
    throw new NotFoundError('Shared list not found');
  }

  // Check if current user is owner
  if (sharedList.owner.toString() !== userId) {
    throw new UnauthenticatedError('Only the owner can remove members');
  }

  await sharedList.removeMember(new mongoose.Types.ObjectId(memberId));

  // Log activity
  await Activity.create({
    type: 'shared_list_member_removed',
    user: userId,
    sharedList: sharedList._id,
    targetUser: memberId,
  });

  res.json({
    success: true,
    message: 'Member removed successfully',
  });
});

/**
 * @desc    Update member permissions
 * @route   PATCH /api/v1/shared-lists/:id/members/:memberId
 * @access  Private
 */
export const updateMemberPermissions = asyncWrapper(async (req: Request, res: Response) => {
  const { id, memberId } = req.params;
  const { permissions } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  if (!permissions) {
    throw new BadRequestError('Permissions are required');
  }

  const sharedList = await SharedList.findById(id);
  if (!sharedList) {
    throw new NotFoundError('Shared list not found');
  }

  // Check if current user is owner
  if (sharedList.owner.toString() !== userId) {
    throw new UnauthenticatedError('Only the owner can update permissions');
  }

  await sharedList.updateMemberPermissions(
    new mongoose.Types.ObjectId(memberId),
    permissions
  );

  // Log activity
  await Activity.create({
    type: 'shared_list_permissions_changed',
    user: userId,
    sharedList: sharedList._id,
    targetUser: memberId,
  });

  res.json({
    success: true,
    sharedList,
  });
});

/**
 * @desc    Invite member to shared list
 * @route   POST /api/v1/shared-lists/:id/invitations
 * @access  Private
 */
export const inviteMember = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, permissions } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  if (!email) {
    throw new BadRequestError('Email is required');
  }

  const sharedList = await SharedList.findById(id);
  if (!sharedList) {
    throw new NotFoundError('Shared list not found');
  }

  // Check if current user has permission to invite
  const isOwner = sharedList.owner.toString() === userId;
  const member = sharedList.members.find(
    (m: any) => m.user.toString() === userId
  );
  const canShare = member?.permissions?.share || false;

  if (!isOwner && !canShare) {
    throw new UnauthenticatedError('Not authorized to invite members');
  }

  // Create invitation
  const token = await sharedList.inviteMember(
    email,
    permissions || {
      view: true,
      create: false,
      update: false,
      delete: false,
      share: false,
    },
    new mongoose.Types.ObjectId(userId)
  );

  // In production, send email with invitation link
  const invitationUrl = `${req.protocol}://${req.get('host')}/api/v1/shared-lists/${id}/invitations/${token}/accept`;

  res.json({
    success: true,
    message: 'Invitation sent successfully',
    invitationUrl, // Remove in production
  });
});

/**
 * @desc    Accept invitation
 * @route   POST /api/v1/shared-lists/:id/invitations/:token/accept
 * @access  Private
 */
export const acceptInvitation = asyncWrapper(async (req: Request, res: Response) => {
  const { id, token } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const sharedList = await SharedList.findById(id);
  if (!sharedList) {
    throw new NotFoundError('Shared list not found');
  }

  await sharedList.acceptInvitation(token, new mongoose.Types.ObjectId(userId));

  res.json({
    success: true,
    message: 'Invitation accepted successfully',
    sharedList,
  });
});

/**
 * @desc    Decline invitation
 * @route   POST /api/v1/shared-lists/:id/invitations/:token/decline
 * @access  Private
 */
export const declineInvitation = asyncWrapper(async (req: Request, res: Response) => {
  const { id, token } = req.params;

  const sharedList = await SharedList.findById(id);
  if (!sharedList) {
    throw new NotFoundError('Shared list not found');
  }

  await sharedList.declineInvitation(token);

  res.json({
    success: true,
    message: 'Invitation declined',
  });
});

/**
 * @desc    Add task to shared list
 * @route   POST /api/v1/shared-lists/:id/tasks
 * @access  Private
 */
export const addTask = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { taskId } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  if (!taskId) {
    throw new BadRequestError('Task ID is required');
  }

  const sharedList = await SharedList.findById(id);
  if (!sharedList) {
    throw new NotFoundError('Shared list not found');
  }

  // Check permissions
  const isOwner = sharedList.owner.toString() === userId;
  const member = sharedList.members.find(
    (m: any) => m.user.toString() === userId
  );
  const canCreate = member?.permissions?.create || false;

  if (!isOwner && !canCreate) {
    throw new UnauthenticatedError('Not authorized to add tasks');
  }

  // Check if task exists
  const task = await Task.findById(taskId);
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  await sharedList.addTask(new mongoose.Types.ObjectId(taskId));

  // Log activity
  await Activity.create({
    type: 'shared_list_task_added',
    user: userId,
    sharedList: sharedList._id,
    task: taskId,
  });

  res.json({
    success: true,
    sharedList,
  });
});

/**
 * @desc    Remove task from shared list
 * @route   DELETE /api/v1/shared-lists/:id/tasks/:taskId
 * @access  Private
 */
export const removeTask = asyncWrapper(async (req: Request, res: Response) => {
  const { id, taskId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const sharedList = await SharedList.findById(id);
  if (!sharedList) {
    throw new NotFoundError('Shared list not found');
  }

  // Check permissions
  const isOwner = sharedList.owner.toString() === userId;
  const member = sharedList.members.find(
    (m: any) => m.user.toString() === userId
  );
  const canDelete = member?.permissions?.delete || false;

  if (!isOwner && !canDelete) {
    throw new UnauthenticatedError('Not authorized to remove tasks');
  }

  await sharedList.removeTask(new mongoose.Types.ObjectId(taskId));

  // Log activity
  await Activity.create({
    type: 'shared_list_task_removed',
    user: userId,
    sharedList: sharedList._id,
    task: taskId,
  });

  res.json({
    success: true,
    message: 'Task removed from list',
  });
});

/**
 * @desc    Get public shared lists
 * @route   GET /api/v1/shared-lists/public
 * @access  Public
 */
export const getPublicSharedLists = asyncWrapper(async (req: Request, res: Response) => {
  const sharedLists = await SharedList.find({ isPublic: true })
    .populate('owner', 'name email avatar')
    .select('-members -invitations')
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({
    success: true,
    count: sharedLists.length,
    sharedLists,
  });
});

/**
 * @desc    Access shared list by code
 * @route   POST /api/v1/shared-lists/access/:code
 * @access  Private
 */
export const accessByCode = asyncWrapper(async (req: Request, res: Response) => {
  const { code } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const sharedList = await SharedList.findOne({ publicAccessCode: code })
    .populate('owner', 'name email avatar')
    .populate('tasks');

  if (!sharedList) {
    throw new NotFoundError('Shared list not found or invalid code');
  }

  if (!sharedList.isPublic) {
    throw new BadRequestError('This list is no longer public');
  }

  res.json({
    success: true,
    sharedList,
  });
});

// Made with Bob