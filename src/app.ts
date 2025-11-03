import express, { Express } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import fileUpload from 'express-fileupload';
import fs from 'fs';

// Import routes
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import teamRoutes from './routes/teams';
import commentRoutes from './routes/comments';
import sharedListRoutes from './routes/sharedLists';
import activityRoutes from './routes/activity';
import analyticsRoutes from './routes/analytics';

// Import middleware
import notFoundMiddleware from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';
import authMiddleware from './middleware/auth';

// Import config
import config from './config';
import connectDB from './db/connect';
import { logger } from './utils/logger';

// Initialize express app
const app: Express = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  logger.info('Created uploads directory');
}

// Security middleware
app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

// Request parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  abortOnLimit: true,
  createParentPath: true,
}));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger documentation
// Uncomment when swagger.yaml is created
// const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Routes
app.get('/', (req, res) => {
  res.send('<h1>Task Manager API</h1><a href="/api-docs">Documentation</a>');
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', authMiddleware, taskRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/shared-lists', sharedListRoutes);
app.use('/api/v1/activity', activityRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Start server
const start = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      logger.info(`Server is listening on port ${config.port}...`);
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
    } else {
      logger.error('Unknown error occurred');
    }
    process.exit(1);
  }
};

start();

// Made with Bob
