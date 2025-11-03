import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SavedReport, AnalyticsService } from '../models/Analytics';
import Task from '../models/Task';
import { BadRequestError, NotFoundError, UnauthenticatedError } from '../errors/custom-error';
import asyncWrapper from '../middleware/async';
import mongoose from 'mongoose';

/**
 * @desc    Get dashboard analytics
 * @route   GET /api/v1/analytics/dashboard
 * @access  Private
 */
export const getDashboardAnalytics = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { period = 'month', startDate, endDate } = req.query;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  // Calculate date range
  let start: Date, end: Date;
  const now = new Date();

  if (startDate && endDate) {
    start = new Date(startDate as string);
    end = new Date(endDate as string);
  } else {
    end = now;
    switch (period) {
      case 'day':
        start = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        start = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        start = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'quarter':
        start = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        start = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        start = new Date(now.setMonth(now.getMonth() - 1));
    }
  }

  // Generate analytics
  const analytics = await AnalyticsService.generateDashboardAnalytics(
    start,
    end,
    period as any,
    { userId }
  );

  res.json({
    success: true,
    analytics,
  });
});

/**
 * @desc    Get task completion stats
 * @route   GET /api/v1/analytics/tasks/completion
 * @access  Private
 */
export const getTaskCompletionStats = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { startDate, endDate } = req.query;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate as string) : new Date();

  const stats = await AnalyticsService.generateTaskCompletionStats(start, end, { userId });

  res.json({
    success: true,
    stats,
  });
});

/**
 * @desc    Get user productivity stats
 * @route   GET /api/v1/analytics/productivity
 * @access  Private
 */
export const getUserProductivityStats = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { startDate, endDate } = req.query;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate as string) : new Date();

  const stats = await AnalyticsService.generateUserProductivityStats(
    new mongoose.Types.ObjectId(userId),
    start,
    end,
    {}
  );

  res.json({
    success: true,
    stats,
  });
});

/**
 * @desc    Get category statistics
 * @route   GET /api/v1/analytics/categories
 * @access  Private
 */
export const getCategoryStats = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { startDate, endDate } = req.query;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate as string) : new Date();

  const stats = await AnalyticsService.generateCategoryStats(start, end, { userId });

  res.json({
    success: true,
    stats,
  });
});

/**
 * @desc    Get priority statistics
 * @route   GET /api/v1/analytics/priorities
 * @access  Private
 */
export const getPriorityStats = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { startDate, endDate } = req.query;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate as string) : new Date();

  const stats = await AnalyticsService.generatePriorityStats(start, end, { userId });

  res.json({
    success: true,
    stats,
  });
});

/**
 * @desc    Create saved report
 * @route   POST /api/v1/analytics/reports
 * @access  Private
 */
export const createSavedReport = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { name, description, reportType, filters, schedule } = req.body;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  if (!name || !reportType) {
    throw new BadRequestError('Name and report type are required');
  }

  const report = await SavedReport.create({
    name,
    description,
    owner: userId,
    reportType,
    filters: filters || {},
    schedule,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    report,
  });
});

/**
 * @desc    Get all saved reports
 * @route   GET /api/v1/analytics/reports
 * @access  Private
 */
export const getSavedReports = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const reports = await SavedReport.find({
    $or: [
      { owner: userId },
      { isPublic: true },
    ],
  })
    .populate('owner', 'name email')
    .populate('team', 'name')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: reports.length,
    reports,
  });
});

/**
 * @desc    Get saved report by ID
 * @route   GET /api/v1/analytics/reports/:id
 * @access  Private
 */
export const getSavedReport = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const report = await SavedReport.findById(id)
    .populate('owner', 'name email')
    .populate('team', 'name');

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  // Check access
  if (report.owner._id.toString() !== userId && !report.isPublic) {
    throw new UnauthenticatedError('Not authorized to view this report');
  }

  res.json({
    success: true,
    report,
  });
});

/**
 * @desc    Update saved report
 * @route   PATCH /api/v1/analytics/reports/:id
 * @access  Private
 */
export const updateSavedReport = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const updates = req.body;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const report = await SavedReport.findById(id);
  if (!report) {
    throw new NotFoundError('Report not found');
  }

  // Check if user is owner
  if (report.owner.toString() !== userId) {
    throw new UnauthenticatedError('Only the owner can update the report');
  }

  const updatedReport = await SavedReport.findByIdAndUpdate(
    id,
    { ...updates, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    report: updatedReport,
  });
});

/**
 * @desc    Delete saved report
 * @route   DELETE /api/v1/analytics/reports/:id
 * @access  Private
 */
export const deleteSavedReport = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const report = await SavedReport.findById(id);
  if (!report) {
    throw new NotFoundError('Report not found');
  }

  // Check if user is owner
  if (report.owner.toString() !== userId) {
    throw new UnauthenticatedError('Only the owner can delete the report');
  }

  await SavedReport.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Report deleted successfully',
  });
});

/**
 * @desc    Generate report data
 * @route   POST /api/v1/analytics/reports/:id/generate
 * @access  Private
 */
export const generateReport = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthenticatedError('User not authenticated');
  }

  const report = await SavedReport.findById(id);
  if (!report) {
    throw new NotFoundError('Report not found');
  }

  // Check access
  if (report.owner.toString() !== userId && !report.isPublic) {
    throw new UnauthenticatedError('Not authorized to generate this report');
  }

  // Generate report data based on type
  let data;
  const { startDate, endDate, period } = report.filters;
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate || new Date();

  switch (report.reportType) {
    case 'task_completion':
      data = await AnalyticsService.generateTaskCompletionStats(start, end, report.filters);
      break;
    case 'category_analysis':
      data = await AnalyticsService.generateCategoryStats(start, end, report.filters);
      break;
    case 'priority_analysis':
      data = await AnalyticsService.generatePriorityStats(start, end, report.filters);
      break;
    case 'user_productivity':
      data = await AnalyticsService.generateUserProductivityStats(
        new mongoose.Types.ObjectId(userId),
        start,
        end,
        report.filters
      );
      break;
    default:
      throw new BadRequestError('Invalid report type');
  }

  // Save generated data
  report.lastGenerated = {
    data,
    date: new Date(),
  };
  await report.save();

  res.json({
    success: true,
    data,
  });
});

// Made with Bob