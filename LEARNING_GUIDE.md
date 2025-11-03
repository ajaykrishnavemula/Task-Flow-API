# TaskFlowAPI - Beginner's Learning Guide

## 📚 What is TaskFlowAPI?

TaskFlowAPI is a **task management and collaboration system**. Think of it as the backend for apps like Trello, Asana, or Todoist - it helps teams organize work, track progress, and collaborate on projects.

---

## 🎯 What Does This Project Do?

Imagine you're managing a team project. You need:
- Create tasks and to-do lists
- Assign tasks to team members
- Track task progress (todo → in progress → done)
- Set deadlines and priorities
- Attach files to tasks
- Collaborate with comments
- Get notifications about updates

**This project handles the core task management!**

---

## 🏗️ Project Structure (How Files Are Organized)

```
TaskFlowAPI/
├── src/                          # All source code lives here
│   ├── controllers/              # Handle requests (the "brain")
│   │   ├── auth.ts              # User authentication (login, register)
│   │   ├── tasks.ts             # Task management (CRUD operations)
│   │   └── attachments.ts       # File attachments
│   ├── models/                   # Database structure
│   │   ├── User.ts              # User accounts
│   │   ├── Task.ts              # Tasks and to-dos
│   │   ├── Team.ts              # Team/workspace (model only)
│   │   ├── Comment.ts           # Task comments (model only)
│   │   ├── SharedList.ts        # Shared task lists (model only)
│   │   ├── Activity.ts          # Activity tracking (model only)
│   │   └── Analytics.ts         # Usage analytics (model only)
│   ├── routes/                   # URL paths
│   │   ├── auth.ts              # /api/v1/auth/*
│   │   ├── tasks.ts             # /api/v1/tasks/*
│   │   └── attachments.ts       # /api/v1/attachments/*
│   ├── middleware/               # Code that runs before controllers
│   │   ├── auth.ts              # Check if user is logged in
│   │   └── rate-limiter.ts      # Prevent spam
│   ├── services/                 # Business logic
│   ├── utils/                    # Helper functions
│   ├── config/                   # Settings
│   └── app.ts                    # Main application setup
├── .env                          # Secret keys
├── package.json                  # Project dependencies
└── tsconfig.json                 # TypeScript settings
```

---

## 🔑 Key Task Management Concepts

### 1. **Tasks**

A task is a unit of work:
```typescript
{
  title: "Design homepage mockup",
  description: "Create wireframes for new homepage",
  status: "in-progress",        // todo, in-progress, done
  priority: "high",              // low, medium, high, urgent
  dueDate: "2024-12-31",
  assignedTo: "user123",
  createdBy: "manager456",
  tags: ["design", "frontend"],
  attachments: ["mockup.pdf"],
  completedAt: null
}
```

### 2. **Task Status Flow**

Tasks move through stages:
```
TODO → IN PROGRESS → DONE
  ↓         ↓          ↓
Start    Working    Complete
```

### 3. **Task Priority**

Importance levels:
```typescript
- Urgent: Do immediately (red flag)
- High: Do soon (orange)
- Medium: Normal priority (yellow)
- Low: Do when possible (green)
```

### 4. **File Attachments**

Attach files to tasks:
```typescript
{
  taskId: "task123",
  filename: "design-mockup.pdf",
  originalName: "Homepage Design.pdf",
  mimeType: "application/pdf",
  size: 2048576,              // 2MB in bytes
  url: "/uploads/mockup.pdf",
  uploadedBy: "user123",
  uploadedAt: Date
}
```

### 5. **Collaboration** (Planned)

Team features (models exist, not implemented):
- **Teams**: Group of users working together
- **Comments**: Discuss tasks
- **Shared Lists**: Collaborative task lists
- **Activity Log**: Track who did what
- **Notifications**: Alert team members

---

## 📖 How the Code Works (Step by Step)

### Example 1: Creating a Task

**What happens when someone creates a task?**

```typescript
// 1. User sends task data
POST /api/v1/tasks
{
  "title": "Design homepage mockup",
  "description": "Create wireframes",
  "priority": "high",
  "dueDate": "2024-12-31"
}

// 2. Code in tasks.ts controller runs:
export const createTask = async (req: Request, res: Response) => {
  // Get data from request
  const { title, description, priority, dueDate, assignedTo } = req.body;
  const createdBy = req.user.userId;
  
  // Validate required fields
  if (!title) {
    throw new BadRequestError('Title is required');
  }
  
  // Create task in database
  const task = await Task.create({
    title,
    description,
    priority: priority || 'medium',
    status: 'todo',              // Default status
    dueDate,
    assignedTo,
    createdBy
  });
  
  // Return created task
  res.status(201).json({
    success: true,
    task
  });
};
```

**Flow Diagram**:
```
User → Create Task → Validate Data → Save to DB → Return Task
```

### Example 2: Updating Task Status

**What happens when someone marks a task as done?**

```typescript
// 1. User updates task
PATCH /api/v1/tasks/task123
{
  "status": "done"
}

// 2. Code in tasks.ts controller runs:
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const userId = req.user.userId;
  
  // Find task
  const task = await Task.findById(id);
  if (!task) {
    throw new NotFoundError('Task not found');
  }
  
  // Check permissions (owner or assigned user)
  if (task.createdBy.toString() !== userId && 
      task.assignedTo?.toString() !== userId) {
    throw new UnauthorizedError('Not authorized');
  }
  
  // If marking as done, set completion time
  if (updates.status === 'done' && task.status !== 'done') {
    updates.completedAt = new Date();
  }
  
  // Update task
  const updatedTask = await Task.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  );
  
  res.json({
    success: true,
    task: updatedTask
  });
};
```

**Flow Diagram**:
```
User → Update Task → Find Task → Check Permission → 
Update Status → Set Completion Time → Save → Return
```

### Example 3: Attaching Files

**What happens when someone uploads a file?**

```typescript
// 1. User uploads file
POST /api/v1/attachments
FormData: {
  taskId: "task123",
  file: [binary data]
}

// 2. Code in attachments.ts controller runs:
export const uploadAttachment = async (req: Request, res: Response) => {
  const { taskId } = req.body;
  const file = req.file;        // From multer middleware
  const userId = req.user.userId;
  
  // Validate file
  if (!file) {
    throw new BadRequestError('No file uploaded');
  }
  
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new BadRequestError('File too large');
  }
  
  // Check task exists
  const task = await Task.findById(taskId);
  if (!task) {
    throw new NotFoundError('Task not found');
  }
  
  // Save file info to database
  const attachment = await Attachment.create({
    taskId,
    filename: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    url: `/uploads/${file.filename}`,
    uploadedBy: userId
  });
  
  // Add attachment to task
  task.attachments.push(attachment._id);
  await task.save();
  
  res.status(201).json({
    success: true,
    attachment
  });
};
```

**Flow Diagram**:
```
User → Upload File → Validate File → Check Task → 
Save File → Create Attachment Record → Link to Task
```

---

## 🎨 Features Implemented (What Works Now)

### ✅ Authentication System
1. **Register** - Create account
2. **Login** - Sign in with JWT
3. **Get Profile** - View account info
4. **Update Profile** - Change details
5. **Change Password** - Update password

### ✅ Task Management
1. **Create Task** - Add new task
2. **Get All Tasks** - List tasks with filters
3. **Get Task by ID** - View task details
4. **Update Task** - Modify task
5. **Delete Task** - Remove task
6. **Filter Tasks** - By status, priority, assignee
7. **Sort Tasks** - By date, priority
8. **Search Tasks** - Find by title/description

### ✅ File Attachments
1. **Upload File** - Attach to task
2. **Get Attachments** - List task files
3. **Download File** - Get file
4. **Delete Attachment** - Remove file

---

## ⚠️ Features NOT Implemented (Models Exist)

### ❌ Team Collaboration
- **Teams Model** exists but no controllers
- Cannot create teams
- Cannot invite members
- Cannot manage team permissions

### ❌ Comments System
- **Comment Model** exists but no controllers
- Cannot add comments to tasks
- Cannot reply to comments
- Cannot mention team members

### ❌ Shared Lists
- **SharedList Model** exists but no controllers
- Cannot create shared task lists
- Cannot collaborate on lists
- Cannot set list permissions

### ❌ Activity Tracking
- **Activity Model** exists but no controllers
- Cannot see who did what
- Cannot track changes
- Cannot view history

### ❌ Analytics
- **Analytics Model** exists but no controllers
- Cannot see task completion rates
- Cannot track productivity
- Cannot generate reports

---

## 📊 Database Models Explained

### Task Model (✅ Implemented)
```typescript
{
  title: "Design homepage",
  description: "Create wireframes and mockups",
  status: "in-progress",        // todo, in-progress, done
  priority: "high",              // low, medium, high, urgent
  dueDate: "2024-12-31",
  assignedTo: ObjectId,          // User ID
  createdBy: ObjectId,           // User ID
  tags: ["design", "frontend"],
  attachments: [ObjectId],       // Attachment IDs
  completedAt: null,
  createdAt: Date,
  updatedAt: Date
}
```

### User Model (✅ Implemented)
```typescript
{
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  role: "user",                  // user, admin
  avatar: "avatar.jpg",
  isActive: true,
  lastLogin: Date,
  createdAt: Date
}
```

### Attachment Model (✅ Implemented)
```typescript
{
  taskId: ObjectId,
  filename: "mockup-abc123.pdf",
  originalName: "Homepage Design.pdf",
  mimeType: "application/pdf",
  size: 2048576,
  url: "/uploads/mockup-abc123.pdf",
  uploadedBy: ObjectId,
  uploadedAt: Date
}
```

### Team Model (❌ Not Implemented)
```typescript
{
  name: "Design Team",
  description: "UI/UX designers",
  members: [
    {
      userId: ObjectId,
      role: "admin",             // admin, member
      joinedAt: Date
    }
  ],
  createdBy: ObjectId,
  createdAt: Date
}
```

### Comment Model (❌ Not Implemented)
```typescript
{
  taskId: ObjectId,
  userId: ObjectId,
  content: "Great work on this!",
  mentions: [ObjectId],          // Mentioned users
  parentId: ObjectId,            // For replies
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Features

### 1. **Authentication**
```typescript
// JWT tokens for secure access
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

### 2. **Authorization**
```typescript
// Only task owner or assignee can update
if (task.createdBy !== userId && task.assignedTo !== userId) {
  throw new UnauthorizedError('Not authorized');
}
```

### 3. **File Upload Security**
```typescript
// File size limit: 10MB
// Allowed types: images, PDFs, documents
// Files stored with random names
// Original names preserved in database
```

### 4. **Rate Limiting**
```typescript
// Prevent abuse
- Max 100 requests per 15 minutes
- Max 10 file uploads per hour
```

---

## 🚀 How to Use This API

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your-secret-key
UPLOAD_DIR=./uploads

# 3. Start server
npm run dev
```

### API Examples

#### Create a Task
```bash
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design homepage",
    "description": "Create wireframes",
    "priority": "high",
    "dueDate": "2024-12-31"
  }'
```

#### Get All Tasks
```bash
curl http://localhost:5000/api/v1/tasks?status=todo&priority=high \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Update Task Status
```bash
curl -X PATCH http://localhost:5000/api/v1/tasks/task123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "done"
  }'
```

#### Upload Attachment
```bash
curl -X POST http://localhost:5000/api/v1/attachments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "taskId=task123" \
  -F "file=@/path/to/file.pdf"
```

---

## 🎓 Learning Path

### Beginner Level
1. ✅ Understand task management basics
2. ✅ Learn about REST APIs
3. ✅ Understand CRUD operations
4. ✅ Learn about file uploads

### Intermediate Level
1. ✅ Understand task status workflows
2. ✅ Learn about filtering and sorting
3. ✅ Understand file handling
4. ⚠️ Learn about team collaboration (not implemented)

### Advanced Level
1. ⚠️ Implement real-time updates (WebSockets)
2. ⚠️ Add notification system
3. ⚠️ Build activity tracking
4. ⚠️ Add analytics dashboard

---

## 🐛 Common Issues & Solutions

### Issue 1: "Task not found"
**Problem**: Trying to access non-existent task
**Solution**: Check task ID is correct

### Issue 2: "Not authorized"
**Problem**: Trying to update someone else's task
**Solution**: Only owner or assignee can update

### Issue 3: "File too large"
**Problem**: Uploading file > 10MB
**Solution**: Compress file or split into parts

---

## 🔧 What Needs to Be Implemented

### Priority 1: Team Collaboration
```typescript
// Need to implement:
1. Create team
2. Add/remove members
3. Assign roles
4. Team permissions
```

### Priority 2: Comments System
```typescript
// Need to implement:
1. Add comment to task
2. Reply to comments
3. Mention users (@username)
4. Edit/delete comments
```

### Priority 3: Shared Lists
```typescript
// Need to implement:
1. Create shared list
2. Add tasks to list
3. Share with team
4. Set permissions
```

### Priority 4: Activity Tracking
```typescript
// Need to implement:
1. Log all actions
2. Show activity feed
3. Filter by user/task
4. Export activity log
```

### Priority 5: Analytics
```typescript
// Need to implement:
1. Task completion rates
2. User productivity
3. Team performance
4. Time tracking
```

---

## 📚 Further Learning

### Concepts to Study
1. **Task Management** - Kanban, Scrum, Agile
2. **File Uploads** - Multer, file storage
3. **Real-time Updates** - WebSockets, Socket.io
4. **Notifications** - Push notifications, emails
5. **Team Collaboration** - Permissions, roles

### Next Steps to Complete This Project
1. Implement team management
2. Add comments system
3. Build shared lists
4. Add activity tracking
5. Create analytics dashboard
6. Add real-time updates
7. Implement notifications

---

## 💡 Tips for Learning

### Understanding the Code
1. Start with [`auth.ts`](src/controllers/auth.ts) - See how login works
2. Then [`tasks.ts`](src/controllers/tasks.ts) - Understand CRUD
3. Look at [`Task.ts`](src/models/Task.ts) model - See data structure
4. Check [`attachments.ts`](src/controllers/attachments.ts) - File handling

### Experimenting
1. Try creating tasks with different priorities
2. Test filtering and sorting
3. Upload different file types
4. Try updating task status
5. Test authorization (try updating others' tasks)

### Building Features
1. Pick one missing feature (e.g., comments)
2. Study the existing model
3. Create controller functions
4. Add routes
5. Test with Postman
6. Repeat for other features!

---

**Remember**: This project has a solid foundation. The core task management works great. The missing features (teams, comments, etc.) have models ready - you just need to implement the controllers and routes!

**Happy Learning! 📝**