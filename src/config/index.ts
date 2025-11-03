import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface Config {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  environment: 'development' | 'production' | 'test';
  nodeEnv: string;
  
  // Email configuration
  emailHost: string;
  emailPort: number;
  emailSecure: boolean;
  emailUser: string;
  emailPassword: string;
  emailFromName: string;
  emailFromAddress: string;
  
  // File upload configuration
  maxFileSize: number;
  uploadDir: string;
  
  // Application URL for email links
  appUrl: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/task-manager',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  environment: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Email configuration
  emailHost: process.env.EMAIL_HOST || 'smtp.example.com',
  emailPort: parseInt(process.env.EMAIL_PORT || '587', 10),
  emailSecure: process.env.EMAIL_SECURE === 'true',
  emailUser: process.env.EMAIL_USER || 'user@example.com',
  emailPassword: process.env.EMAIL_PASSWORD || 'password',
  emailFromName: process.env.EMAIL_FROM_NAME || 'Task Manager',
  emailFromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@taskmanager.com',
  
  // File upload configuration
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  
  // Application URL for email links
  appUrl: process.env.APP_URL || 'http://localhost:5000',
};

export default config;

