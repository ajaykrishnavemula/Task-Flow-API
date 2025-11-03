import express from 'express';
import { 
  register, 
  login, 
  getCurrentUser, 
  updateProfile,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  deactivateAccount,
  reactivateAccount
} from '../controllers/auth';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/reactivate', reactivateAccount);

// Protected routes
router.use(authMiddleware); // Apply auth middleware to all routes below
router.get('/me', getCurrentUser);
router.patch('/update-profile', updateProfile);
router.patch('/change-password', changePassword);
router.delete('/deactivate', deactivateAccount);

export default router;

// Made with Bob
