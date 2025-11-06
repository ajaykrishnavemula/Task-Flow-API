# Task-Flow Architecture Documentation

## Overview

Task-Flow is a full-stack collaborative task management application built with modern web technologies. It features real-time collaboration, drag-and-drop Kanban boards, team management, and comprehensive task tracking capabilities.

## Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Validation**: Joi
- **Security**: bcrypt, helmet, cors, express-rate-limit
- **File Upload**: Multer
- **Email**: Nodemailer

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 4.1
- **State Management**: Zustand with persist middleware
- **Routing**: React Router v7
- **Forms**: React Hook Form + Zod validation
- **Drag & Drop**: @dnd-kit
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Notifications**: react-hot-toast
- **Icons**: lucide-react

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │   Services   │      │
│  │              │  │              │  │              │      │
│  │ - Dashboard  │  │ - Common UI  │  │ - Auth       │      │
│  │ - Tasks      │  │ - Kanban     │  │ - Task       │      │
│  │ - Teams      │  │ - Layouts    │  │ - Team       │      │
│  │ - Profile    │  │              │  │ - Socket     │      │
│  │ - Settings   │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           State Management (Zustand)                  │   │
│  │  - Auth Store  - Task Store  - Team Store  - UI Store│   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend (Express)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routes     │  │ Controllers  │  │   Models     │      │
│  │              │  │              │  │              │      │
│  │ - Auth       │  │ - Auth       │  │ - User       │      │
│  │ - Tasks      │  │ - Tasks      │  │ - Task       │      │
│  │ - Teams      │  │ - Teams      │  │ - Team       │      │
│  │ - Comments   │  │ - Comments   │  │ - Comment    │      │
│  │ - Lists      │  │ - Lists      │  │ - SharedList │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Middleware & Services                    │   │
│  │  - Authentication  - Validation  - Error Handling    │   │
│  │  - Rate Limiting   - File Upload - Email Service     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (MongoDB)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Users        │  │ Tasks        │  │ Teams        │      │
│  │ Collection   │  │ Collection   │  │ Collection   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Comments     │  │ SharedLists  │                        │
│  │ Collection   │  │ Collection   │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Core Features

### 1. Authentication & Authorization
- JWT-based authentication
- Role-based access control (user, admin)
- Email verification
- Password reset functionality
- Secure session management

### 2. Task Management
- CRUD operations for tasks
- Task status tracking (todo, in-progress, in-review, completed)
- Priority levels (low, medium, high, urgent)
- Due dates and reminders
- Task assignments
- Tags and categories
- File attachments
- Task comments and discussions

### 3. Kanban Board
- Drag-and-drop interface using @dnd-kit
- Visual task organization
- Status columns (To Do, In Progress, In Review, Completed)
- Real-time updates
- Task filtering and search

### 4. Team Collaboration
- Team creation and management
- Member invitations
- Role assignments (owner, admin, member)
- Team-specific tasks
- Shared task lists
- Activity tracking

### 5. Real-time Features
- Live task updates
- Typing indicators
- User presence
- Instant notifications
- Collaborative editing

### 6. User Profile & Settings
- Profile customization
- Avatar upload
- Theme preferences (light/dark/system)
- Notification settings
- Password management
- Account security

## Data Models

### User Model
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  password: string (hashed),
  role: 'user' | 'admin',
  avatar?: string,
  isEmailVerified: boolean,
  emailVerificationToken?: string,
  resetPasswordToken?: string,
  resetPasswordExpires?: Date,
  profile: {
    bio?: string,
    location?: string,
    website?: string,
    company?: string,
    position?: string
  },
  preferences: {
    theme: 'light' | 'dark' | 'system',
    notifications: {
      email: boolean,
      push: boolean,
      taskReminders: boolean
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```typescript
{
  _id: ObjectId,
  name: string,
  description?: string,
  status: 'todo' | 'in-progress' | 'in-review' | 'completed',
  priority: 'low' | 'medium' | 'high' | 'urgent',
  dueDate?: Date,
  completed: boolean,
  completedAt?: Date,
  tags?: string[],
  assignedTo?: ObjectId[],
  createdBy: ObjectId,
  team?: ObjectId,
  sharedList?: ObjectId,
  attachments?: [{
    filename: string,
    url: string,
    size: number,
    mimeType: string
  }],
  order: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Team Model
```typescript
{
  _id: ObjectId,
  name: string,
  description?: string,
  owner: ObjectId,
  members: [{
    user: ObjectId,
    role: 'owner' | 'admin' | 'member',
    joinedAt: Date
  }],
  invitations: [{
    email: string,
    role: 'admin' | 'member',
    token: string,
    expiresAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```typescript
{
  _id: ObjectId,
  task: ObjectId,
  user: ObjectId,
  content: string,
  mentions?: ObjectId[],
  reactions?: [{
    user: ObjectId,
    emoji: string
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### SharedList Model
```typescript
{
  _id: ObjectId,
  name: string,
  description?: string,
  owner: ObjectId,
  team?: ObjectId,
  sharedWith: [{
    user: ObjectId,
    permission: 'view' | 'edit'
  }],
  isPublic: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status
- `PATCH /api/tasks/:id/complete` - Toggle task completion
- `GET /api/tasks/stats` - Get task statistics

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/members` - Add team member
- `DELETE /api/teams/:id/members/:userId` - Remove team member
- `POST /api/teams/:id/invite` - Send team invitation

### Comments
- `GET /api/comments/task/:taskId` - Get task comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/reactions` - Add reaction

### Shared Lists
- `GET /api/lists` - Get all shared lists
- `GET /api/lists/:id` - Get shared list by ID
- `POST /api/lists` - Create shared list
- `PUT /api/lists/:id` - Update shared list
- `DELETE /api/lists/:id` - Delete shared list
- `POST /api/lists/:id/share` - Share list with user

## Real-time Events

### Socket.io Events

#### Client → Server
- `room:join` - Join a room
- `room:leave` - Leave a room
- `comment:typing` - Send typing indicator
- `user:presence` - Update user presence
- `sync:request` - Request data sync

#### Server → Client
- `realtime:event` - Generic real-time event
- `task:created` - New task created
- `task:updated` - Task updated
- `task:deleted` - Task deleted
- `comment:created` - New comment added
- `comment:updated` - Comment updated
- `user:typing` - User is typing
- `user:presence` - User presence changed

## Security Features

### Authentication Security
- Password hashing with bcrypt (10 rounds)
- JWT tokens with expiration
- Secure HTTP-only cookies
- Email verification
- Password reset with time-limited tokens

### API Security
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet.js security headers
- Input validation with Joi
- XSS protection
- SQL injection prevention (MongoDB)

### Data Security
- Encrypted passwords
- Secure file uploads
- Access control checks
- Team-based permissions
- Private/public list controls

## Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Alert.tsx
│   │   ├── Loading.tsx
│   │   ├── Badge.tsx
│   │   └── Dropdown.tsx
│   ├── kanban/          # Kanban board components
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── KanbanCard.tsx
│   │   └── TaskModal.tsx
│   └── ProtectedRoute.tsx
├── layouts/
│   ├── AuthLayout.tsx   # Layout for auth pages
│   └── MainLayout.tsx   # Layout for app pages
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Tasks.tsx
│   ├── Teams.tsx
│   ├── Profile.tsx
│   ├── Settings.tsx
│   └── NotFound.tsx
├── services/
│   ├── api.ts           # Axios instance
│   ├── auth.service.ts
│   ├── task.service.ts
│   ├── team.service.ts
│   ├── comment.service.ts
│   ├── sharedList.service.ts
│   └── socket.service.ts
├── store/
│   ├── authStore.ts     # Authentication state
│   ├── taskStore.ts     # Task management state
│   ├── teamStore.ts     # Team management state
│   └── uiStore.ts       # UI preferences state
├── types/
│   └── index.ts         # TypeScript type definitions
└── App.tsx              # Main app component
```

### State Management

#### Zustand Stores

**Auth Store**
- User authentication state
- Login/logout functionality
- Profile management
- Token handling

**Task Store**
- Task list management
- CRUD operations
- Filtering and sorting
- Statistics

**Team Store**
- Team list management
- Member management
- Invitations

**UI Store**
- Theme preferences
- Sidebar state
- Notification settings

### Routing Structure
```
/ → Redirect to /dashboard or /login
/login → Login page
/register → Registration page
/dashboard → Main dashboard (protected)
/tasks → Task list view (protected)
/teams → Team management (protected)
/profile → User profile (protected)
/settings → User settings (protected)
* → 404 Not Found page
```

## Development Workflow

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

### Environment Variables

**Backend (.env)**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Deployment Considerations

### Backend Deployment
- Use environment variables for configuration
- Enable production MongoDB connection
- Configure CORS for production domain
- Set up SSL/TLS certificates
- Enable rate limiting
- Configure file upload limits
- Set up email service (SendGrid, AWS SES)
- Enable logging and monitoring

### Frontend Deployment
- Build optimized production bundle
- Configure API endpoints
- Enable service worker for PWA
- Set up CDN for static assets
- Configure environment-specific settings
- Enable analytics (optional)

### Database
- Set up MongoDB Atlas or self-hosted MongoDB
- Configure database backups
- Set up indexes for performance
- Enable authentication
- Configure connection pooling

## Performance Optimizations

### Frontend
- Code splitting with React.lazy
- Image optimization
- Lazy loading components
- Memoization with React.memo
- Virtual scrolling for large lists
- Debounced search inputs
- Optimistic UI updates

### Backend
- Database indexing
- Query optimization
- Caching with Redis (optional)
- Connection pooling
- Compression middleware
- Static file caching

## Testing Strategy

### Backend Testing
- Unit tests for models
- Integration tests for API endpoints
- Authentication flow tests
- Real-time event tests

### Frontend Testing
- Component unit tests
- Integration tests
- E2E tests with Playwright/Cypress
- Accessibility tests

## Future Enhancements

### Planned Features
- Calendar view for tasks
- Gantt chart visualization
- Time tracking
- Task dependencies
- Recurring tasks
- Advanced analytics dashboard
- Mobile app (React Native)
- Desktop app (Electron)
- Third-party integrations (Slack, GitHub, etc.)
- AI-powered task suggestions
- Voice commands
- Offline mode with sync

### Technical Improvements
- GraphQL API
- Microservices architecture
- Redis caching
- Elasticsearch for search
- WebRTC for video calls
- Progressive Web App (PWA)
- Server-side rendering (SSR)
- Internationalization (i18n)

## Troubleshooting

### Common Issues

**Connection Issues**
- Verify MongoDB is running
- Check environment variables
- Verify CORS configuration
- Check firewall settings

**Authentication Issues**
- Verify JWT secret is set
- Check token expiration
- Verify email verification status
- Check password hash

**Real-time Issues**
- Verify Socket.io connection
- Check WebSocket support
- Verify authentication token
- Check room subscriptions

## Contributing Guidelines

1. Fork the repository
2. Create a feature branch
3. Follow code style guidelines
4. Write tests for new features
5. Update documentation
6. Submit pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [repository-url]/issues
- Documentation: [docs-url]
- Email: support@taskflow.com