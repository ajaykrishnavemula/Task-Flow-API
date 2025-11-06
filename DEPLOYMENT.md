# TaskFlow Deployment Guide

Complete guide for deploying TaskFlow to production environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Database Setup](#database-setup)
- [AWS S3 Configuration](#aws-s3-configuration)
- [Domain & SSL](#domain--ssl)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## ✅ Prerequisites

### Required Tools
- Node.js 18+ and npm
- MongoDB 6.0+
- Git
- AWS Account (for S3)
- Domain name (optional)

### Recommended Services
- **Backend Hosting**: Heroku, Railway, Render, DigitalOcean
- **Frontend Hosting**: Vercel, Netlify, Cloudflare Pages
- **Database**: MongoDB Atlas
- **File Storage**: AWS S3
- **CDN**: Cloudflare, AWS CloudFront

## 🔧 Environment Setup

### Backend Environment Variables

Create `.env` file in backend directory:

```env
# Server Configuration
NODE_ENV=production
PORT=5000
API_URL=https://api.taskflow.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# CORS
CORS_ORIGIN=https://taskflow.com,https://www.taskflow.com

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=taskflow-uploads

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@taskflow.com
FROM_NAME=TaskFlow

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Socket.io
SOCKET_CORS_ORIGIN=https://taskflow.com
```

### Frontend Environment Variables

Create `.env.production` file in frontend directory:

```env
VITE_API_URL=https://api.taskflow.com/api
VITE_SOCKET_URL=https://api.taskflow.com
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0
```

## 🚀 Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd backend
heroku create taskflow-api
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
# ... set all other variables
```

5. **Deploy**
```bash
git push heroku main
```

6. **Open App**
```bash
heroku open
```

### Option 2: Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login**
```bash
railway login
```

3. **Initialize Project**
```bash
cd backend
railway init
```

4. **Set Environment Variables**
```bash
railway variables set NODE_ENV=production
railway variables set MONGODB_URI=your-mongodb-uri
# ... set all other variables
```

5. **Deploy**
```bash
railway up
```

### Option 3: DigitalOcean App Platform

1. **Connect GitHub Repository**
   - Go to DigitalOcean App Platform
   - Click "Create App"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build Command: `npm install && npm run build`
   - Run Command: `npm start`
   - Environment: Node.js

3. **Set Environment Variables**
   - Add all required environment variables in the dashboard

4. **Deploy**
   - Click "Deploy"

### Option 4: Docker Deployment

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

2. **Create docker-compose.yml**
```yaml
version: '3.8'

services:
  api:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb
    restart: unless-stopped

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

3. **Build and Run**
```bash
docker-compose up -d
```

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
cd frontend
vercel --prod
```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add all VITE_* variables

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Build**
```bash
cd frontend
npm run build
```

4. **Deploy**
```bash
netlify deploy --prod --dir=dist
```

5. **Configure Environment Variables**
   - Go to Netlify Dashboard
   - Site Settings → Environment Variables
   - Add all VITE_* variables

### Option 3: Cloudflare Pages

1. **Connect GitHub Repository**
   - Go to Cloudflare Pages
   - Click "Create a project"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `frontend`

3. **Set Environment Variables**
   - Add all VITE_* variables

4. **Deploy**
   - Click "Save and Deploy"

### Option 4: Static Hosting (Nginx)

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name taskflow.com www.taskflow.com;

    root /var/www/taskflow/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

3. **Copy Files**
```bash
sudo cp -r dist/* /var/www/taskflow/
```

4. **Restart Nginx**
```bash
sudo systemctl restart nginx
```

## 💾 Database Setup

### MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Shared" (Free tier)
   - Select region closest to your users
   - Click "Create Cluster"

3. **Create Database User**
   - Database Access → Add New Database User
   - Choose authentication method
   - Set username and password
   - Grant read/write permissions

4. **Configure Network Access**
   - Network Access → Add IP Address
   - Allow access from anywhere (0.0.0.0/0) or specific IPs

5. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `taskflow`

### Self-Hosted MongoDB

1. **Install MongoDB**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community
```

2. **Start MongoDB**
```bash
sudo systemctl start mongodb
```

3. **Create Database**
```bash
mongosh
use taskflow
db.createUser({
  user: "taskflow_user",
  pwd: "secure_password",
  roles: ["readWrite"]
})
```

## ☁️ AWS S3 Configuration

### Create S3 Bucket

1. **Login to AWS Console**
   - Go to S3 service

2. **Create Bucket**
   - Click "Create bucket"
   - Enter bucket name: `taskflow-uploads`
   - Choose region
   - Uncheck "Block all public access" (for public files)
   - Enable versioning (optional)
   - Click "Create bucket"

3. **Configure CORS**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://taskflow.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

4. **Create IAM User**
   - Go to IAM service
   - Create new user: `taskflow-s3-user`
   - Attach policy: `AmazonS3FullAccess`
   - Save access key and secret key

5. **Set Environment Variables**
```bash
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=taskflow-uploads
```

## 🌐 Domain & SSL

### Configure Domain

1. **Add DNS Records**
```
Type    Name    Value                   TTL
A       @       your-server-ip          3600
A       www     your-server-ip          3600
CNAME   api     your-backend-url        3600
```

2. **For Vercel/Netlify**
   - Add custom domain in dashboard
   - Follow DNS configuration instructions

### SSL Certificate (Let's Encrypt)

1. **Install Certbot**
```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. **Obtain Certificate**
```bash
sudo certbot --nginx -d taskflow.com -d www.taskflow.com
```

3. **Auto-Renewal**
```bash
sudo certbot renew --dry-run
```

## 📊 Monitoring

### Application Monitoring

1. **PM2 (Process Manager)**
```bash
npm install -g pm2

# Start application
pm2 start npm --name "taskflow-api" -- start

# Monitor
pm2 monit

# Logs
pm2 logs taskflow-api

# Auto-restart on reboot
pm2 startup
pm2 save
```

2. **Health Check Endpoint**
```javascript
// Add to backend
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Error Tracking

**Sentry Integration**

1. **Install Sentry**
```bash
npm install @sentry/node @sentry/react
```

2. **Configure Backend**
```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

3. **Configure Frontend**
```javascript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

### Performance Monitoring

**New Relic Integration**

```bash
npm install newrelic
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy TaskFlow

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "taskflow-api"
          heroku_email: "your-email@example.com"

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd frontend && npm ci
      - run: cd frontend && npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{secrets.VERCEL_TOKEN}}
          vercel-org-id: ${{secrets.VERCEL_ORG_ID}}
          vercel-project-id: ${{secrets.VERCEL_PROJECT_ID}}
          vercel-args: '--prod'
```

## 🐳 Docker Deployment

### Complete Docker Setup

1. **Backend Dockerfile**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["npm", "start"]
```

2. **Frontend Dockerfile**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

3. **docker-compose.yml**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
    depends_on:
      - mongodb
    restart: unless-stopped
    networks:
      - taskflow-network

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - taskflow-network

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=secure_password
    restart: unless-stopped
    networks:
      - taskflow-network

volumes:
  mongodb_data:

networks:
  taskflow-network:
    driver: bridge
```

4. **Deploy**
```bash
docker-compose up -d
```

## 🔒 Security Checklist

### Pre-Deployment Security

- [ ] Change all default passwords
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication
- [ ] Secure AWS credentials
- [ ] Remove console.logs from production
- [ ] Enable security headers
- [ ] Set up firewall rules
- [ ] Configure CSP headers
- [ ] Enable CSRF protection

### Security Headers (Helmet.js)

```javascript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## 📈 Performance Optimization

### Backend Optimization

1. **Enable Compression**
```javascript
import compression from 'compression';
app.use(compression());
```

2. **Database Indexing**
```javascript
// Add indexes to frequently queried fields
taskSchema.index({ createdBy: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ tags: 1 });
```

3. **Caching with Redis**
```javascript
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// Cache frequently accessed data
const cachedData = await redis.get(key);
if (cachedData) return JSON.parse(cachedData);
```

### Frontend Optimization

1. **Code Splitting**
```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));
```

2. **Image Optimization**
```javascript
// Use WebP format
// Lazy load images
// Use CDN for static assets
```

3. **Bundle Analysis**
```bash
npm run build -- --analyze
```

## 🔍 Health Checks

### Backend Health Check

```javascript
app.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'healthy',
    checks: {
      database: 'unknown',
      redis: 'unknown',
      s3: 'unknown'
    }
  };

  try {
    // Check database
    await mongoose.connection.db.admin().ping();
    health.checks.database = 'healthy';
  } catch (error) {
    health.checks.database = 'unhealthy';
    health.status = 'degraded';
  }

  res.status(health.status === 'healthy' ? 200 : 503).json(health);
});
```

## 🚨 Troubleshooting

### Common Issues

**Issue: CORS Errors**
```javascript
// Solution: Configure CORS properly
app.use(cors({
  origin: process.env.CORS_ORIGIN.split(','),
  credentials: true
}));
```

**Issue: MongoDB Connection Failed**
```bash
# Check connection string
# Verify network access in MongoDB Atlas
# Check firewall rules
```

**Issue: Socket.io Not Connecting**
```javascript
// Solution: Configure Socket.io CORS
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN,
    credentials: true
  }
});
```

**Issue: Build Fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📝 Post-Deployment Checklist

- [ ] Verify all API endpoints work
- [ ] Test authentication flow
- [ ] Check WebSocket connections
- [ ] Verify file uploads to S3
- [ ] Test email notifications
- [ ] Check error logging
- [ ] Verify SSL certificate
- [ ] Test on multiple devices
- [ ] Check performance metrics
- [ ] Set up monitoring alerts
- [ ] Create database backups
- [ ] Document deployment process

## 🔄 Rollback Procedure

### Heroku Rollback
```bash
heroku releases
heroku rollback v123
```

### Docker Rollback
```bash
docker-compose down
git checkout previous-commit
docker-compose up -d
```

### Vercel Rollback
```bash
vercel rollback
```

## 📊 Monitoring Dashboard

### Recommended Tools

1. **Uptime Monitoring**: UptimeRobot, Pingdom
2. **Error Tracking**: Sentry, Rollbar
3. **Performance**: New Relic, DataDog
4. **Logs**: Loggly, Papertrail
5. **Analytics**: Google Analytics, Mixpanel

## 🎯 Production Best Practices

1. **Use Environment Variables** - Never hardcode secrets
2. **Enable Logging** - Track all errors and important events
3. **Set Up Backups** - Regular database backups
4. **Monitor Performance** - Track response times and errors
5. **Use CDN** - Serve static assets via CDN
6. **Enable Caching** - Cache frequently accessed data
7. **Implement Rate Limiting** - Prevent abuse
8. **Use HTTPS** - Always use SSL/TLS
9. **Keep Dependencies Updated** - Regular security updates
10. **Document Everything** - Maintain deployment documentation

## 📞 Support

For deployment support:
- Documentation: https://docs.taskflow.com
- Email: devops@taskflow.com
- Slack: #taskflow-deployment