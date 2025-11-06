# TaskFlow Frontend

A modern, feature-rich task management application built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Features
- **Authentication System**
  - User registration and login
  - JWT-based authentication
  - Protected routes
  - Profile management
  - Password reset functionality

- **Task Management**
  - Create, read, update, and delete tasks
  - Task status tracking (To Do, In Progress, In Review, Completed)
  - Priority levels (Low, Medium, High, Urgent)
  - Due dates and reminders
  - Tags and categories
  - Subtasks support
  - Task dependencies
  - File attachments

- **Kanban Board**
  - Drag-and-drop functionality using @dnd-kit
  - Visual task organization
  - Real-time updates
  - Column-based workflow

- **Team Collaboration**
  - Create and manage teams
  - Invite team members
  - Role-based permissions
  - Shared task lists
  - Team activity tracking

- **Real-time Features** (Planned)
  - Live task updates
  - Typing indicators
  - Online presence
  - Instant notifications

- **File Management** (Planned)
  - AWS S3 integration
  - File upload and download
  - Image preview
  - Document management

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### State Management
- **Zustand** - Lightweight state management
- **Zustand Persist** - State persistence

### Routing
- **React Router v6** - Client-side routing

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

### HTTP Client
- **Axios** - HTTP requests
- **Axios Interceptors** - Request/response handling

### Real-time Communication
- **Socket.io Client** - WebSocket communication

### Drag and Drop
- **@dnd-kit/core** - Drag and drop core
- **@dnd-kit/sortable** - Sortable lists
- **@dnd-kit/utilities** - Utility functions

### Utilities
- **date-fns** - Date manipulation
- **React Hot Toast** - Toast notifications

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   │   ├── common/     # Common UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Alert.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Dropdown.tsx
│   │   ├── kanban/     # Kanban board components
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── KanbanCard.tsx
│   │   │   └── TaskModal.tsx
│   │   └── ProtectedRoute.tsx
│   ├── layouts/        # Layout components
│   │   ├── AuthLayout.tsx
│   │   └── MainLayout.tsx
│   ├── pages/          # Page components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Tasks.tsx
│   │   ├── Teams.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   └── NotFound.tsx
│   ├── services/       # API services
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── task.service.ts
│   │   ├── team.service.ts
│   │   ├── sharedList.service.ts
│   │   ├── comment.service.ts
│   │   └── socket.service.ts
│   ├── store/          # Zustand stores
│   │   ├── authStore.ts
│   │   ├── taskStore.ts
│   │   ├── teamStore.ts
│   │   └── uiStore.ts
│   ├── types/          # TypeScript types
│   │   ├── user.types.ts
│   │   ├── task.types.ts
│   │   ├── team.types.ts
│   │   ├── sharedList.types.ts
│   │   ├── comment.types.ts
│   │   └── common.types.ts
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── .env                # Environment variables
├── .env.example        # Environment variables template
├── index.html          # HTML template
├── package.json        # Dependencies
├── tailwind.config.js  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Full-Stack/Project-Flow/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and set your configuration:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Component Library

### Common Components

#### Button
```tsx
import { Button } from '@/components/common';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `disabled`: boolean
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode

#### Input
```tsx
import { Input } from '@/components/common';

<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  error={errors.email?.message}
  leftIcon={<Mail />}
/>
```

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common';

<Card variant="elevated" hoverable>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

#### Modal
```tsx
import { Modal } from '@/components/common';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="md"
>
  Modal content
</Modal>
```

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token is stored in Zustand store with persistence
3. Token is automatically attached to API requests via Axios interceptors
4. Protected routes check authentication status
5. Socket connection is established with the token

## 📊 State Management

### Auth Store
```tsx
import { useAuthStore } from '@/store/authStore';

const { user, isAuthenticated, login, logout } = useAuthStore();
```

### Task Store
```tsx
import { useTaskStore } from '@/store/taskStore';

const { tasks, fetchTasks, createTask, updateTask, deleteTask } = useTaskStore();
```

### Team Store
```tsx
import { useTeamStore } from '@/store/teamStore';

const { teams, fetchTeams, createTeam } = useTeamStore();
```

### UI Store
```tsx
import { useUIStore } from '@/store/uiStore';

const { theme, setTheme, viewMode, setViewMode } = useUIStore();
```

## 🎯 API Integration

All API calls are centralized in service files:

```tsx
// services/task.service.ts
export const taskService = {
  getTasks: (filters?: TaskFilters) => api.get('/tasks', { params: filters }),
  getTask: (id: string) => api.get(`/tasks/${id}`),
  createTask: (data: CreateTaskData) => api.post('/tasks', data),
  updateTask: (id: string, data: UpdateTaskData) => api.patch(`/tasks/${id}`, data),
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
};
```

## 🎨 Styling Guide

### Tailwind Configuration
Custom colors and utilities are defined in `tailwind.config.js`:

```js
colors: {
  primary: { /* blue shades */ },
  secondary: { /* purple shades */ },
  success: { /* green shades */ },
  warning: { /* yellow shades */ },
  danger: { /* red shades */ },
}
```

### Custom Animations
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## 🧪 Testing (Planned)

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📝 Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Naming Conventions**:
  - Components: PascalCase
  - Functions: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Types/Interfaces: PascalCase

## 🔧 Development Tips

### Hot Module Replacement
Vite provides instant HMR for fast development.

### Path Aliases
Use `@/` for absolute imports:
```tsx
import { Button } from '@/components/common';
import { useAuthStore } from '@/store/authStore';
```

### Type Safety
Always define proper TypeScript types for components and functions.

### Component Patterns
- Use functional components with hooks
- Implement proper error boundaries
- Handle loading and error states
- Use React.memo for performance optimization

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [React Router Documentation](https://reactrouter.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- All open-source contributors
