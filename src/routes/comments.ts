import express from 'express';
import {
  createComment,
  getTaskComments,
  getComment,
  updateComment,
  deleteComment,
  addReaction,
  removeReaction,
  getCommentReactions,
} from '../controllers/comments';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Comment routes
router.post('/', createComment);
router.get('/task/:taskId', getTaskComments);
router.get('/:id', getComment);
router.patch('/:id', updateComment);
router.delete('/:id', deleteComment);

// Reaction routes
router.post('/:id/reactions', addReaction);
router.delete('/:id/reactions', removeReaction);
router.get('/:id/reactions', getCommentReactions);

export default router;

