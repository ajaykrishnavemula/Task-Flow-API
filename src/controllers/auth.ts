import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User';
import asyncWrapper from '../middleware/async';
import { BadRequestError, UnauthenticatedError, NotFoundError } from '../errors/custom-error';
import crypto from 'crypto';
import { logger } from '../utils/logger';
import config from '../config';

// Register a new user
export const register = asyncWrapper(async (req: Request, res: Response) => {
  // Create user
  const user = await User.create({ ...req.body });
  
  // Generate email verification token
  const verificationToken = user.generateVerificationToken();
  await user.save();
  
  // In a real application, you would send an email with the verification link
  // For now, we'll just return the token in the response
  const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationToken}`;
  
  logger.info(`Verification URL for user ${user._id}: ${verificationUrl}`);
  
  // Generate auth token
  const token = user.generateAuthToken();
  
  res.status(StatusCodes.CREATED).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    },
    token,
    verificationUrl, // In production, remove this and send via email
  });
});

// Verify email
export const verifyEmail = asyncWrapper(async (req: Request, res: Response) => {
  const { token } = req.params;
  
  // Hash the token to compare with the one in the database
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // Find user with the token and check if token is still valid
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });
  
  if (!user) {
    throw new BadRequestError('Invalid or expired verification token');
  }
  
  // Update user
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  
  res.status(StatusCodes.OK).json({
    message: 'Email verified successfully',
  });
});

// Resend verification email
export const resendVerificationEmail = asyncWrapper(async (req: Request, res: Response) => {
  const { email } = req.body;
  
  if (!email) {
    throw new BadRequestError('Please provide email');
  }
  
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  if (user.isEmailVerified) {
    throw new BadRequestError('Email already verified');
  }
  
  // Generate new verification token
  const verificationToken = user.generateVerificationToken();
  await user.save();
  
  // In a real application, you would send an email with the verification link
  const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationToken}`;
  
  logger.info(`New verification URL for user ${user._id}: ${verificationUrl}`);
  
  res.status(StatusCodes.OK).json({
    message: 'Verification email sent',
    verificationUrl, // In production, remove this and send via email
  });
});

// Login user
export const login = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  // Check if email and password are provided
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  
  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  
  // Check if user exists
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }
  
  // Check if user is active
  if (!user.isActive) {
    throw new UnauthenticatedError('Account is deactivated');
  }
  
  // Check if password is correct
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials');
  }
  
  // Update last login time
  user.lastLogin = new Date();
  await user.save();
  
  // Generate token
  const token = user.generateAuthToken();
  
  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    },
    token,
  });
});

// Forgot password
export const forgotPassword = asyncWrapper(async (req: Request, res: Response) => {
  const { email } = req.body;
  
  if (!email) {
    throw new BadRequestError('Please provide email');
  }
  
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  // Generate password reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save();
  
  // In a real application, you would send an email with the reset link
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;
  
  logger.info(`Password reset URL for user ${user._id}: ${resetUrl}`);
  
  res.status(StatusCodes.OK).json({
    message: 'Password reset email sent',
    resetUrl, // In production, remove this and send via email
  });
});

// Reset password
export const resetPassword = asyncWrapper(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;
  
  if (!password) {
    throw new BadRequestError('Please provide a new password');
  }
  
  // Hash the token to compare with the one in the database
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // Find user with the token and check if token is still valid
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+password');
  
  if (!user) {
    throw new BadRequestError('Invalid or expired reset token');
  }
  
  // Update user password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  
  res.status(StatusCodes.OK).json({
    message: 'Password reset successful',
  });
});

// Get current user
export const getCurrentUser = asyncWrapper(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.userId);
  
  if (!user) {
    throw new UnauthenticatedError('User not found');
  }
  
  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      avatar: user.avatar,
      profile: user.profile,
      lastLogin: user.lastLogin,
    },
  });
});

// Update user profile
export const updateProfile = asyncWrapper(async (req: Request, res: Response) => {
  const { name, email, avatar, profile } = req.body;
  
  // Create update object
  const updateData: any = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (avatar) updateData.avatar = avatar;
  if (profile) updateData.profile = profile;
  
  const user = await User.findByIdAndUpdate(
    req.user?.userId,
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!user) {
    throw new UnauthenticatedError('User not found');
  }
  
  const token = user.generateAuthToken();
  
  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      avatar: user.avatar,
      profile: user.profile,
    },
    token,
  });
});

// Change password
export const changePassword = asyncWrapper(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    throw new BadRequestError('Please provide current and new password');
  }
  
  const user = await User.findById(req.user?.userId).select('+password');
  
  if (!user) {
    throw new UnauthenticatedError('User not found');
  }
  
  // Check if current password is correct
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Current password is incorrect');
  }
  
  // Update password
  user.password = newPassword;
  await user.save();
  
  res.status(StatusCodes.OK).json({
    message: 'Password changed successfully',
  });
});

// Deactivate account
export const deactivateAccount = asyncWrapper(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.user?.userId,
    { isActive: false },
    { new: true }
  );
  
  if (!user) {
    throw new UnauthenticatedError('User not found');
  }
  
  res.status(StatusCodes.OK).json({
    message: 'Account deactivated successfully',
  });
});

// Reactivate account
export const reactivateAccount = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }
  
  // Check if password is correct
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials');
  }
  
  // Reactivate account
  user.isActive = true;
  await user.save();
  
  // Generate token
  const token = user.generateAuthToken();
  
  res.status(StatusCodes.OK).json({
    message: 'Account reactivated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    },
    token,
  });
});

// Made with Bob
