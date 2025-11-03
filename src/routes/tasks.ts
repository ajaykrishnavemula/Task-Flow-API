import express from 'express';
import {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  uploadAttachment,
  deleteAttachment
} from '../controllers/tasks';

const router = express.Router();

// Get all tasks and create a new task
router.route('/')
  .get(getAllTasks)
  .post(createTask);

// Get task statistics
router.route('/stats')
  .get(getTaskStats);

// Get, update, and delete a specific task
router.route('/:id')
  .get(getTask)
  .patch(updateTask)
  .delete(deleteTask);

// Subtask routes
router.route('/:id/subtasks')
  .post(addSubtask);

router.route('/:id/subtasks/:subtaskId')
  .patch(updateSubtask)
  .delete(deleteSubtask);

// Attachment routes
router.route('/:id/attachments')
  .post(uploadAttachment);

router.route('/:id/attachments/:attachmentId')
  .delete(deleteAttachment);

export default router;

// Made with Bob
