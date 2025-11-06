import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/custom-error';
import config from '../config';

interface UserPayload {
  userId: string;
  name: string;
  email: string;
  role: string;
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = jwt.verify(token, config.jwtSecret) as UserPayload;
    // Attach the user to the request object
    req.user = payload;
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

export const adminOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  
  if (req.user.role !== 'admin') {
    throw new UnauthenticatedError('Not authorized to access this route');
  }
  
  next();
};

export default authMiddleware;

