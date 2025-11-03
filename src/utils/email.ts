import nodemailer from 'nodemailer';
import config from '../config';
import { logger } from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send email using nodemailer
 * In development, emails are logged to console
 * In production, emails are sent using the configured SMTP server
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: config.emailHost,
      port: config.emailPort,
      secure: config.emailSecure,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });

    // Define email options
    const mailOptions = {
      from: `"${config.emailFromName}" <${config.emailFromAddress}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    // In development, log email instead of sending
    if (config.nodeEnv === 'development') {
      logger.info('Email not sent in development mode');
      logger.info(`To: ${options.to}`);
      logger.info(`Subject: ${options.subject}`);
      logger.info(`Content: ${options.html}`);
      return;
    }

    // Send email
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${options.to}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error sending email: ${error.message}`);
    } else {
      logger.error('Unknown error sending email');
    }
    throw error;
  }
};

/**
 * Send verification email
 */
export const sendVerificationEmail = async (
  email: string,
  name: string,
  verificationUrl: string
): Promise<void> => {
  const subject = 'Email Verification - Task Manager';
  const html = `
    <h1>Email Verification</h1>
    <p>Hello ${name},</p>
    <p>Please verify your email address by clicking the link below:</p>
    <p><a href="${verificationUrl}">Verify Email</a></p>
    <p>If you did not create an account, please ignore this email.</p>
    <p>Thank you,</p>
    <p>Task Manager Team</p>
  `;

  await sendEmail({ to: email, subject, html });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetUrl: string
): Promise<void> => {
  const subject = 'Password Reset - Task Manager';
  const html = `
    <h1>Password Reset</h1>
    <p>Hello ${name},</p>
    <p>You requested a password reset. Please click the link below to reset your password:</p>
    <p><a href="${resetUrl}">Reset Password</a></p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Thank you,</p>
    <p>Task Manager Team</p>
  `;

  await sendEmail({ to: email, subject, html });
};

// Made with Bob
