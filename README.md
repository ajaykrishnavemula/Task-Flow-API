<div align="center">

# ✅ Project-Flow

### 🚀 Collaborative Task Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)

📋 **Kanban boards** • 👥 **Team collaboration** • ⚡ **Real-time updates** • 💬 **Task discussions**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📋 Task Management
- ✅ Create & organize tasks
- 📊 Kanban board view
- 🎯 Priority levels
- 📅 Due dates & reminders
- 🏷️ Tags & categories
- 📎 File attachments
- ✔️ Task completion tracking
- 🔍 Advanced filtering

</td>
<td width="50%">

### 👥 Team Collaboration
- 👥 Team creation
- 📧 Member invitations
- 🎭 Role-based permissions
- 📋 Shared task lists
- 💬 Task comments
- 🔔 Real-time notifications
- 📊 Activity tracking
- 👁️ Presence indicators

</td>
</tr>
<tr>
<td width="50%">

### ⚡ Real-Time Features
- 🔄 Live synchronization
- 💬 Real-time comments
- 👁️ Who's online
- ⚡ Instant updates
- 🔔 Push notifications
- 🎯 Typing indicators
- 📊 Live dashboards

</td>
<td width="50%">

### 🎨 User Experience
- 📱 Responsive design
- 🌙 Dark mode support
- 🎨 Theme customization
- 🖱️ Drag & drop
- ⌨️ Keyboard shortcuts
- 🔍 Quick search
- 📊 Visual analytics

</td>
</tr>
</table>

---

## 🎬 Demo

<div align="center">

### 🖥️ Screenshots

| Kanban Board | Task Details | Team Dashboard |
|:------------:|:------------:|:--------------:|
| ![Kanban](https://via.placeholder.com/250x150/4CAF50/FFFFFF?text=Kanban+Board) | ![Task](https://via.placeholder.com/250x150/2196F3/FFFFFF?text=Task+Details) | ![Team](https://via.placeholder.com/250x150/FF9800/FFFFFF?text=Team+Dashboard) |

</div>

---

## 🚀 Quick Start

### 📋 Prerequisites

```bash
Node.js 18+  ✅
MongoDB 6+   ✅
npm/yarn     ✅
```

### ⚡ Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/yourusername/project-flow.git
cd project-flow

# 2️⃣ Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev

# 3️⃣ Setup Frontend
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

### 🌐 Access Application

- 🎨 **Frontend**: http://localhost:5173
- ⚙️ **Backend API**: http://localhost:5000
- 🔌 **WebSocket**: ws://localhost:5000

---

## 💻 Tech Stack

<div align="center">

### Backend 🔧

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

### Frontend 🎨

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react&logoColor=white)

</div>

---

## 📁 Project Structure

```
✅ Project-Flow/
├── 📂 backend/                 # Backend API
│   ├── 📂 src/
│   │   ├── ⚙️ config/         # Configuration
│   │   ├── 🎮 controllers/    # Controllers
│   │   ├── 🗄️ models/         # Database models
│   │   ├── 🛣️ routes/         # API routes
│   │   ├── 💼 services/       # Business logic
│   │   ├── 🔒 middleware/     # Middleware
│   │   ├── 🔌 socket/         # Socket.io handlers
│   │   └── 🛠️ utils/          # Utilities
│   └── 📦 package.json
│
├── 📂 frontend/               # React Frontend
│   ├── 📂 src/
│   │   ├── 🧩 components/    # Components
│   │   │   ├── 🎯 common/    # Reusable UI
│   │   │   └── 📋 kanban/    # Kanban board
│   │   ├── 📄 pages/         # Pages
│   │   ├── 🛣️ router/        # Routing
│   │   ├── 🌐 services/      # API services
│   │   ├── 💾 store/         # State management
│   │   └── 📝 types/         # TypeScript types
│   └── 📦 package.json
│
├── 📚 ARCHITECTURE.md         # Architecture docs
├── 📖 API_REFERENCE.md        # API documentation
└── 📄 README.md               # This file
```

---

## 🎯 Key Features in Detail

### 📋 Kanban Board
- 🖱️ Drag & drop interface
- 📊 Multiple status columns
- 🎨 Customizable columns
- 🔄 Auto-save changes
- ⚡ Real-time updates
- 📱 Mobile-friendly
- 🎯 Quick actions

### 👥 Team Collaboration
- 👥 Create teams
- 📧 Invite members
- 🎭 Role management (Owner, Admin, Member)
- 📋 Shared workspaces
- 💬 Team discussions
- 📊 Activity feeds
- 🔔 Team notifications

### ⚡ Real-Time Updates
- 🔄 Live task updates
- 💬 Real-time comments
- 👁️ Online presence
- ⚡ Instant notifications
- 🎯 Typing indicators
- 📊 Live dashboards
- 🔌 WebSocket connection

### 📎 File Management
- 📎 File attachments
- 🖼️ Image preview
- 📄 Document sharing
- 🔄 Version control
- 📊 Storage management
- 🗑️ File deletion

---

## 📚 API Documentation

### 🔐 Authentication Endpoints

```http
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
POST   /api/auth/logout            # Logout user
GET    /api/auth/me                # Get current user
PUT    /api/auth/profile           # Update profile
POST   /api/auth/verify-email      # Verify email
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password    # Reset password
```

### 📋 Task Endpoints

```http
GET    /api/tasks                  # Get all tasks
GET    /api/tasks/:id              # Get task by ID
POST   /api/tasks                  # Create new task
PUT    /api/tasks/:id              # Update task
DELETE /api/tasks/:id              # Delete task
PATCH  /api/tasks/:id/status       # Update task status
PATCH  /api/tasks/:id/complete     # Toggle completion
GET    /api/tasks/stats            # Get task statistics
```

### 👥 Team Endpoints

```http
GET    /api/teams                  # Get all teams
GET    /api/teams/:id              # Get team by ID
POST   /api/teams                  # Create new team
PUT    /api/teams/:id              # Update team
DELETE /api/teams/:id              # Delete team
POST   /api/teams/:id/members      # Add team member
DELETE /api/teams/:id/members/:id  # Remove member
POST   /api/teams/:id/invite       # Send invitation
```

### 💬 Comment Endpoints

```http
GET    /api/comments/task/:taskId  # Get task comments
POST   /api/comments               # Create comment
PUT    /api/comments/:id           # Update comment
DELETE /api/comments/:id           # Delete comment
POST   /api/comments/:id/reactions # Add reaction
```

For complete API documentation, see [API_REFERENCE.md](./API_REFERENCE.md)

---

## 🔌 Real-Time Events

### Client → Server Events

```javascript
socket.emit('room:join', { room: 'task:123' });
socket.emit('room:leave', { room: 'task:123' });
socket.emit('comment:typing', { taskId: '123', isTyping: true });
socket.emit('user:presence', { status: 'online' });
```

### Server → Client Events

```javascript
socket.on('realtime:event', (event) => {
  // Handle real-time events
});

socket.on('task:created', (task) => {
  // Handle new task
});

socket.on('task:updated', (task) => {
  // Handle task update
});

socket.on('user:typing', ({ userId, taskId, isTyping }) => {
  // Handle typing indicator
});
```

---

## 🧪 Testing

```bash
# 🔬 Run backend tests
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report

# 🎨 Run frontend tests
cd frontend
npm test                    # Run all tests
npm run test:ui            # UI mode
npm run test:coverage      # Coverage report
```

---

## 📝 Environment Variables

### Backend Configuration

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/taskflow

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=TaskFlow <noreply@taskflow.com>

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Frontend Configuration

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚀 Deployment

### 🌐 Deployment Options

- ☁️ **Backend**: Railway, Heroku, Render, AWS
- 🎨 **Frontend**: Vercel, Netlify, AWS S3
- 🗄️ **Database**: MongoDB Atlas, AWS DocumentDB

### 📦 Build for Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

---

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation (Joi)
- ✅ Rate limiting (100 req/15min)
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ XSS protection
- ✅ Email verification
- ✅ Secure password reset

---

## 📊 Performance

- 📦 **Frontend Bundle**: ~550KB (gzipped: ~170KB)
- ⚡ **API Response**: <100ms average
- 🔌 **Real-time Latency**: <50ms
- 🗄️ **Database**: Optimized with indexes
- 🚀 **Lighthouse Score**: 95+

---

## 🤝 Contributing

We welcome contributions! 🎉

1. 🍴 Fork the repository
2. 🌿 Create feature branch (`git checkout -b feature/amazing`)
3. 💾 Commit changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to branch (`git push origin feature/amazing`)
5. 🔀 Open Pull Request

---

## 🗺️ Roadmap

### Phase 1 (Completed) ✅
- [x] Task management
- [x] Kanban board
- [x] Team collaboration
- [x] Real-time updates
- [x] File attachments

### Phase 2 (Planned) 🚧
- [ ] Calendar view
- [ ] Gantt chart
- [ ] Time tracking
- [ ] Task dependencies
- [ ] Recurring tasks

### Phase 3 (Future) 🔮
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] AI-powered suggestions
- [ ] Third-party integrations
- [ ] Offline mode with sync

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- 🌐 Website: [yourwebsite.com](https://yourwebsite.com)
- 💼 LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
- 🐙 GitHub: [@yourusername](https://github.com/yourusername)
- 📧 Email: your.email@example.com

---

## 🙏 Acknowledgments

- 💙 React Team for the amazing framework
- ⚡ Express Team for the web framework
- 🍃 MongoDB Team for the database
- 🔌 Socket.io Team for real-time magic
- 🎨 Tailwind CSS for beautiful styling
- 🖱️ dnd-kit for drag & drop

---

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/project-flow?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/project-flow?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/project-flow)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/project-flow)

---

<div align="center">

### 🌟 Star this repo if you find it helpful!

**Made with ❤️ and ☕**

**Version**: 1.0.0 | **Status**: ✅ Production Ready

[⬆ Back to Top](#-project-flow)

</div>