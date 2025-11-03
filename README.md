# Task Manager API

A comprehensive task management application with advanced features, built with TypeScript, Express, and MongoDB.

## Project Overview

Task Manager is a full-stack web application that allows users to:
- Create, read, update, and delete tasks
- Register and authenticate users
- Categorize and prioritize tasks
- Filter and search tasks
- Track task completion status
- View task statistics

## Enhanced Features

### Phase 1: Foundation Upgrade
- **TypeScript Integration**: Type-safe code with interfaces and type definitions
- **User Authentication**: JWT-based authentication with role-based access control
- **Advanced Task Management**: Categories, priorities, due dates, and tags
- **Filtering & Searching**: Filter by multiple criteria and search by text
- **Pagination & Sorting**: Control data retrieval with pagination and sorting options
- **Statistics**: View task completion statistics and metrics
- **Security Features**: Helmet, XSS protection, rate limiting, and more
- **Logging**: Comprehensive logging with Winston
- **Error Handling**: Custom error classes and consistent error responses

### Phase 2: Core Feature Enhancement
- **Email Verification**: Verify user email addresses during registration
- **Password Reset**: Allow users to reset forgotten passwords
- **User Profiles**: Enhanced user profiles with additional information
- **Subtasks**: Break down tasks into smaller subtasks
- **Task Dependencies**: Define dependencies between tasks
- **Recurring Tasks**: Create tasks that repeat on a schedule
- **File Attachments**: Attach files to tasks
- **Markdown Support**: Rich text descriptions with markdown formatting
- **Account Management**: Deactivate and reactivate user accounts

### Phase 3: Advanced Features
- **Team Collaboration**: Create and manage teams with role-based permissions
- **Shared Task Lists**: Share task lists with team members or individuals
- **Comments & Discussions**: Add comments to tasks with mentions and attachments
- **Activity Feed**: Track all activities and changes in real-time
- **Notifications**: Receive in-app, email, and push notifications for important events
- **Advanced Analytics**: Generate reports and visualize productivity metrics
- **Time Tracking**: Track time spent on tasks and generate time reports
- **Task Boards**: Kanban-style boards with customizable columns
- **User Preferences**: Personalized settings for notifications, views, and more
- **Public Sharing**: Share task lists with external users via public links

## Project Architecture

The application follows a structured architecture with clear separation of concerns:

### Backend Components

1. **Models**: Defines the data structure using Mongoose schemas
   - Task model with extended properties (subtasks, attachments, recurrence)
   - User model with authentication and verification methods

2. **Controllers**: Handle the business logic for CRUD operations
   - Auth controllers for user management and verification
   - Task controllers for task operations and file handling

3. **Routes**: Define API endpoints
   - Auth routes for authentication and account management
   - Task routes for task management and attachments

4. **Middleware**:
   - Authentication middleware for protected routes
   - Error handling middleware
   - Async wrapper for cleaner code
   - Security middleware
   - File upload middleware

5. **Error Handling**:
   - Custom error classes for different error scenarios
   - Consistent error responses with appropriate status codes

6. **Utilities**:
   - Email sending functionality
   - Markdown processing
   - File handling

### Folder Structure

```
Task_Manager/
├── src/                  # TypeScript source files
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── db/               # Database connection
│   ├── errors/           # Custom error classes
│   ├── interfaces/       # TypeScript interfaces
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── types/            # Type declarations
│   ├── utils/            # Utility functions
│   └── app.ts            # Main application file
├── public/               # Static files
├── uploads/              # Uploaded files
├── dist/                 # Compiled JavaScript files
├── logs/                 # Application logs
├── .env.example          # Example environment variables
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/v1/auth/register | Register a new user |
| POST   | /api/v1/auth/login | Login a user |
| GET    | /api/v1/auth/verify-email/:token | Verify email address |
| POST   | /api/v1/auth/resend-verification | Resend verification email |
| POST   | /api/v1/auth/forgot-password | Request password reset |
| POST   | /api/v1/auth/reset-password/:token | Reset password |
| GET    | /api/v1/auth/me | Get current user profile |
| PATCH  | /api/v1/auth/update-profile | Update user profile |
| PATCH  | /api/v1/auth/change-password | Change password |
| DELETE | /api/v1/auth/deactivate | Deactivate account |
| POST   | /api/v1/auth/reactivate | Reactivate account |
| PATCH  | /api/v1/auth/preferences | Update user preferences |
| GET    | /api/v1/auth/statistics | Get user statistics |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/v1/tasks | Get all tasks with filtering and pagination |
| POST   | /api/v1/tasks | Create a new task |
| GET    | /api/v1/tasks/stats | Get task statistics |
| GET    | /api/v1/tasks/:id | Get a specific task |
| PATCH  | /api/v1/tasks/:id | Update a task |
| DELETE | /api/v1/tasks/:id | Delete a task |
| POST   | /api/v1/tasks/:id/subtasks | Add a subtask |
| PATCH  | /api/v1/tasks/:id/subtasks/:subtaskId | Update a subtask |
| DELETE | /api/v1/tasks/:id/subtasks/:subtaskId | Delete a subtask |
| POST   | /api/v1/tasks/:id/attachments | Upload an attachment |
| DELETE | /api/v1/tasks/:id/attachments/:attachmentId | Delete an attachment |
| POST   | /api/v1/tasks/:id/comments | Add a comment |
| GET    | /api/v1/tasks/:id/comments | Get task comments |
| PATCH  | /api/v1/tasks/:id/comments/:commentId | Update a comment |
| DELETE | /api/v1/tasks/:id/comments/:commentId | Delete a comment |
| POST   | /api/v1/tasks/:id/track | Start time tracking |
| PATCH  | /api/v1/tasks/:id/track/stop | Stop time tracking |
| GET    | /api/v1/tasks/:id/time-entries | Get time tracking entries |
| POST   | /api/v1/tasks/:id/watchers | Add a watcher |
| DELETE | /api/v1/tasks/:id/watchers/:userId | Remove a watcher |

### Teams

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/v1/teams | Get all teams |
| POST   | /api/v1/teams | Create a new team |
| GET    | /api/v1/teams/:id | Get a specific team |
| PATCH  | /api/v1/teams/:id | Update a team |
| DELETE | /api/v1/teams/:id | Delete a team |
| POST   | /api/v1/teams/:id/members | Add a team member |
| PATCH  | /api/v1/teams/:id/members/:userId | Update member role |
| DELETE | /api/v1/teams/:id/members/:userId | Remove a team member |
| POST   | /api/v1/teams/:id/invitations | Invite a user to the team |
| GET    | /api/v1/teams/:id/invitations | Get team invitations |
| POST   | /api/v1/teams/invitations/:token/accept | Accept team invitation |
| POST   | /api/v1/teams/invitations/:token/decline | Decline team invitation |

### Shared Lists

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/v1/shared-lists | Get all shared lists |
| POST   | /api/v1/shared-lists | Create a new shared list |
| GET    | /api/v1/shared-lists/:id | Get a specific shared list |
| PATCH  | /api/v1/shared-lists/:id | Update a shared list |
| DELETE | /api/v1/shared-lists/:id | Delete a shared list |
| POST   | /api/v1/shared-lists/:id/tasks/:taskId | Add a task to the list |
| DELETE | /api/v1/shared-lists/:id/tasks/:taskId | Remove a task from the list |
| POST   | /api/v1/shared-lists/:id/members | Add a member to the list |
| PATCH  | /api/v1/shared-lists/:id/members/:userId | Update member permissions |
| DELETE | /api/v1/shared-lists/:id/members/:userId | Remove a member from the list |
| POST   | /api/v1/shared-lists/:id/invitations | Invite a user to the list |
| POST   | /api/v1/shared-lists/:id/public-access | Generate public access link |
| DELETE | /api/v1/shared-lists/:id/public-access | Revoke public access |

### Analytics & Reporting

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/v1/analytics/dashboard | Get dashboard analytics |
| GET    | /api/v1/analytics/tasks | Get task completion analytics |
| GET    | /api/v1/analytics/categories | Get category analytics |
| GET    | /api/v1/analytics/priorities | Get priority analytics |
| GET    | /api/v1/analytics/users/:userId | Get user productivity analytics |
| GET    | /api/v1/analytics/teams/:teamId | Get team productivity analytics |
| GET    | /api/v1/analytics/time-tracking | Get time tracking analytics |
| GET    | /api/v1/reports | Get all saved reports |
| POST   | /api/v1/reports | Create a new report |
| GET    | /api/v1/reports/:id | Get a specific report |
| PATCH  | /api/v1/reports/:id | Update a report |
| DELETE | /api/v1/reports/:id | Delete a report |
| POST   | /api/v1/reports/:id/generate | Generate a report |
| POST   | /api/v1/reports/:id/schedule | Schedule a report |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/v1/notifications | Get user notifications |
| PATCH  | /api/v1/notifications/:id/read | Mark notification as read |
| PATCH  | /api/v1/notifications/read-all | Mark all notifications as read |
| GET    | /api/v1/notifications/preferences | Get notification preferences |
| PATCH  | /api/v1/notifications/preferences | Update notification preferences |

## Query Parameters for Tasks

| Parameter | Description | Example |
|-----------|-------------|---------|
| category  | Filter by category | ?category=work |
| completed | Filter by completion status | ?completed=true |
| priority  | Filter by priority | ?priority=high |
| search    | Search in name and description | ?search=meeting |
| sort      | Sort by field(s) | ?sort=dueDate,-priority |
| fields    | Select specific fields | ?fields=name,priority,dueDate |
| page      | Page number for pagination | ?page=2 |
| limit     | Number of results per page | ?limit=10 |
| isRecurring | Filter by recurring status | ?isRecurring=true |
| dueDate   | Filter by due date | ?dueDate=today |
| hasAttachments | Filter by attachment presence | ?hasAttachments=true |
| hasSubtasks | Filter by subtask presence | ?hasSubtasks=true |

## Project Setup

1. Clone the repository

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory (use .env.example as a template):
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
   
   # Email configuration
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=user@example.com
   EMAIL_PASSWORD=password
   EMAIL_FROM_NAME=Task Manager
   EMAIL_FROM_ADDRESS=noreply@taskmanager.com
   
   # Application URL for email links
   APP_URL=http://localhost:5000
   ```

4. Build the TypeScript code:
   ```
   npm run build
   ```

5. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

6. Access the API at `http://localhost:5000`

## Dependencies

- **Core**: express, mongoose, typescript
- **Authentication**: jsonwebtoken, bcryptjs
- **Validation**: joi
- **Security**: helmet, cors, xss-clean, express-rate-limit
- **Utilities**: winston, morgan, dotenv
- **Documentation**: swagger-ui-express, yamljs
- **Email**: nodemailer
- **File Handling**: express-fileupload, uuid
- **Markdown**: marked, sanitize-html
- **Collaboration**: socket.io
- **Analytics**: chart.js, d3.js
- **Time Tracking**: moment, date-fns
- **Notifications**: web-push