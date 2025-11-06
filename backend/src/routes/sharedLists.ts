import express from 'express';
import {
  createSharedList,
  getSharedLists,
  getSharedList,
  updateSharedList,
  deleteSharedList,
  addMember,
  removeMember,
  updateMemberPermissions,
  inviteMember,
  acceptInvitation,
  declineInvitation,
  addTask,
  removeTask,
  getPublicSharedLists,
  accessByCode,
} from '../controllers/sharedLists';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/public', getPublicSharedLists);

// Protected routes
router.use(authMiddleware);

// Shared list CRUD
router.post('/', createSharedList);
router.get('/', getSharedLists);
router.get('/:id', getSharedList);
router.patch('/:id', updateSharedList);
router.delete('/:id', deleteSharedList);

// Member management
router.post('/:id/members', addMember);
router.delete('/:id/members/:memberId', removeMember);
router.patch('/:id/members/:memberId', updateMemberPermissions);

// Invitations
router.post('/:id/invitations', inviteMember);
router.post('/:id/invitations/:token/accept', acceptInvitation);
router.post('/:id/invitations/:token/decline', declineInvitation);

// Task management
router.post('/:id/tasks', addTask);
router.delete('/:id/tasks/:taskId', removeTask);

// Access by code
router.post('/access/:code', accessByCode);

export default router;

