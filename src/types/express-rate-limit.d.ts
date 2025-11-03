declare module 'express-rate-limit' {
  import { Request, Response, NextFunction } from 'express';

  interface RateLimitOptions {
    windowMs?: number;
    max?: number;
    message?: string | object;
    statusCode?: number;
    headers?: boolean;
    skipFailedRequests?: boolean;
    skipSuccessfulRequests?: boolean;
    keyGenerator?: (req: Request) => string;
    handler?: (req: Request, res: Response, next: NextFunction) => void;
    onLimitReached?: (req: Request, res: Response, options: RateLimitOptions) => void;
    skip?: (req: Request, res: Response) => boolean;
    store?: any;
  }

  interface RateLimitRequestHandler {
    (req: Request, res: Response, next: NextFunction): void;
    resetKey(key: string): void;
  }

  function rateLimit(options?: RateLimitOptions): RateLimitRequestHandler;

  export = rateLimit;
}

