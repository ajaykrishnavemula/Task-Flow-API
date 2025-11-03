import express from 'express';
import {
  getDashboardAnalytics,
  getTaskCompletionStats,
  getUserProductivityStats,
  getCategoryStats,
  getPriorityStats,
  createSavedReport,
  getSavedReports,
  getSavedReport,
  updateSavedReport,
  deleteSavedReport,
  generateReport,
} from '../controllers/analytics';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Analytics endpoints
router.get('/dashboard', getDashboardAnalytics);
router.get('/tasks/completion', getTaskCompletionStats);
router.get('/productivity', getUserProductivityStats);
router.get('/categories', getCategoryStats);
router.get('/priorities', getPriorityStats);

// Saved reports
router.post('/reports', createSavedReport);
router.get('/reports', getSavedReports);
router.get('/reports/:id', getSavedReport);
router.patch('/reports/:id', updateSavedReport);
router.delete('/reports/:id', deleteSavedReport);
router.post('/reports/:id/generate', generateReport);

export default router;

// Made with Bob