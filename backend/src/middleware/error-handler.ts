import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import CustomAPIError from '../errors/custom-error';
import { logger } from '../utils/logger';

interface MongooseError extends Error {
  code?: number;
  keyValue?: Record<string, any>;
  errors?: Record<string, { message: string }>;
  name: string;
  value?: any;
}

const errorHandlerMiddleware = (
  err: Error | CustomAPIError | MongooseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`${err.name}: ${err.message}`);
  
  let customError = {
    statusCode: (err as CustomAPIError).statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong, please try again later',
  };

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError' && (err as MongooseError).errors) {
    const mongooseErr = err as MongooseError;
    customError.message = Object.values(mongooseErr.errors || {})
      .map((item) => item.message)
      .join(', ');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Handle Mongoose duplicate key errors
  if ((err as MongooseError).code === 11000) {
    const mongooseErr = err as MongooseError;
    const field = Object.keys(mongooseErr.keyValue || {})[0];
    customError.message = `Duplicate value entered for ${field} field`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Handle Mongoose cast errors (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    const mongooseErr = err as MongooseError;
    customError.message = `No item found with id: ${mongooseErr.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  return res.status(customError.statusCode).json({ message: customError.message });
};

export default errorHandlerMiddleware;

