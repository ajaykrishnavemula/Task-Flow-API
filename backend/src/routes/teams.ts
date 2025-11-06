import express from 'express';
import {
  createTeam,
  getMyTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
  updateMemberRole,
  inviteTeamMember,
  acceptInvitation,
  declineInvitation,
} from '../controllers/teams';
import authenticateUser from '../middleware/auth';

const router = express.Router();

/**
 * @route   POST /api/v1/teams/accept-invitation
 * @desc    Accept a team invitation
 * @access  Private
 */
router.post('/accept-invitation', authenticateUser, acceptInvitation);

/**
 * @route   POST /api/v1/teams/decline-invitation
 * @desc    Decline a team invitation
 * @access  Private
 */
router.post('/decline-invitation', authenticateUser, declineInvitation);

/**
 * @route   GET /api/v1/teams
 * @desc    Get all teams for current user
 * @access  Private
 */
router.get('/', authenticateUser, getMyTeams);

/**
 * @route   POST /api/v1/teams
 * @desc    Create a new team
 * @access  Private
 */
router.post('/', authenticateUser, createTeam);

/**
 * @route   GET /api/v1/teams/:id
 * @desc    Get a single team by ID
 * @access  Private
 */
router.get('/:id', authenticateUser, getTeam);

/**
 * @route   PATCH /api/v1/teams/:id
 * @desc    Update a team
 * @access  Private (Owner/Admin only)
 */
router.patch('/:id', authenticateUser, updateTeam);

/**
 * @route   DELETE /api/v1/teams/:id
 * @desc    Delete a team
 * @access  Private (Owner only)
 */
router.delete('/:id', authenticateUser, deleteTeam);

/**
 * @route   POST /api/v1/teams/:id/members
 * @desc    Add a member to a team
 * @access  Private (Owner/Admin only)
 */
router.post('/:id/members', authenticateUser, addTeamMember);

/**
 * @route   DELETE /api/v1/teams/:id/members/:memberId
 * @desc    Remove a member from a team
 * @access  Private (Owner/Admin only)
 */
router.delete('/:id/members/:memberId', authenticateUser, removeTeamMember);

/**
 * @route   PATCH /api/v1/teams/:id/members/:memberId
 * @desc    Update a member's role
 * @access  Private (Owner/Admin only)
 */
router.patch('/:id/members/:memberId', authenticateUser, updateMemberRole);

/**
 * @route   POST /api/v1/teams/:id/invite
 * @desc    Invite a member to a team
 * @access  Private (Owner/Admin only)
 */
router.post('/:id/invite', authenticateUser, inviteTeamMember);

export default router;

