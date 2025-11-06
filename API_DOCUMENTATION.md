# TaskFlow API Documentation

Complete API reference for the TaskFlow task management system.

## 📋 Table of Contents

- [Authentication](#authentication)
- [Tasks](#tasks)
- [Teams](#teams)
- [Comments](#comments)
- [Shared Lists](#shared-lists)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## 🔐 Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register User

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token",
    "isEmailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token"
  }
}
```

### Get Current User

**Endpoint:** `GET /api/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "avatar_url",
    "profile": {
      "bio": "Software Developer",
      "location": "San Francisco, CA"
    }
  }
}
```

### Update Profile

**Endpoint:** `PATCH /api/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "profile": {
    "bio": "Senior Software Developer",
    "location": "New York, NY",
    "website": "https://johndoe.com"
  }
}
```

**Response:** `200 OK`

### Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

## 📝 Tasks

### Get All Tasks

**Endpoint:** `GET /api/tasks`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `completed` (boolean): Filter by completion status
- `priority` (string): Filter by priority (low, medium, high, urgent)
- `status` (string): Filter by status (todo, in-progress, in-review, completed)
- `category` (string): Filter by category
- `tags` (string): Filter by tags (comma-separated)
- `search` (string): Search in name and description
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `sort` (string): Sort field (default: -createdAt)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "_id": "task_id",
        "name": "Complete project documentation",
        "description": "Write comprehensive docs",
        "completed": false,
        "priority": "high",
        "status": "in-progress",
        "dueDate": "2024-12-31T23:59:59.000Z",
        "category": "Documentation",
        "tags": ["docs", "important"],
        "createdBy": "user_id",
        "assignedTo": ["user_id_1", "user_id_2"],
        "subtasks": [],
        "attachments": [],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

### Get Single Task

**Endpoint:** `GET /api/tasks/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "task_id",
    "name": "Complete project documentation",
    "description": "Write comprehensive docs",
    "completed": false,
    "priority": "high",
    "status": "in-progress",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "subtasks": [
      {
        "_id": "subtask_id",
        "name": "Write API docs",
        "completed": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "attachments": [
      {
        "_id": "attachment_id",
        "filename": "document.pdf",
        "originalName": "Project Document.pdf",
        "mimeType": "application/pdf",
        "size": 1024000,
        "path": "uploads/document.pdf",
        "uploadedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### Create Task

**Endpoint:** `POST /api/tasks`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "New Task",
  "description": "Task description",
  "priority": "medium",
  "status": "todo",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "category": "Development",
  "tags": ["feature", "backend"],
  "assignedTo": ["user_id_1"],
  "subtasks": [
    {
      "name": "Subtask 1",
      "completed": false
    }
  ]
}
```

**Response:** `201 Created`

### Update Task

**Endpoint:** `PATCH /api/tasks/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Task Name",
  "status": "in-progress",
  "priority": "high"
}
```

**Response:** `200 OK`

### Delete Task

**Endpoint:** `DELETE /api/tasks/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Toggle Task Completion

**Endpoint:** `PATCH /api/tasks/:id/toggle`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Add Subtask

**Endpoint:** `POST /api/tasks/:id/subtasks`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "New Subtask",
  "completed": false
}
```

**Response:** `200 OK`

### Update Subtask

**Endpoint:** `PATCH /api/tasks/:id/subtasks/:subtaskId`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Subtask",
  "completed": true
}
```

**Response:** `200 OK`

### Delete Subtask

**Endpoint:** `DELETE /api/tasks/:id/subtasks/:subtaskId`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Add Attachment

**Endpoint:** `POST /api/tasks/:id/attachments`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body:** FormData with file

**Response:** `200 OK`

### Delete Attachment

**Endpoint:** `DELETE /api/tasks/:id/attachments/:attachmentId`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Get Task Statistics

**Endpoint:** `GET /api/tasks/stats`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total": 100,
    "completed": 45,
    "pending": 55,
    "overdue": 10,
    "byPriority": {
      "low": 20,
      "medium": 40,
      "high": 30,
      "urgent": 10
    },
    "byStatus": {
      "todo": 30,
      "in-progress": 25,
      "in-review": 10,
      "completed": 35
    }
  }
}
```

### Bulk Operations

**Endpoint:** `POST /api/tasks/bulk`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "action": "delete",
  "taskIds": ["task_id_1", "task_id_2", "task_id_3"]
}
```

**Actions:** `delete`, `complete`, `archive`

**Response:** `200 OK`

### Search Tasks

**Endpoint:** `GET /api/tasks/search`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `q` (string): Search query
- `fields` (string): Fields to search (comma-separated)

**Response:** `200 OK`

### Export Tasks

**Endpoint:** `GET /api/tasks/export`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `format` (string): Export format (json, csv)

**Response:** File download

## 👥 Teams

### Get All Teams

**Endpoint:** `GET /api/teams`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "team_id",
      "name": "Development Team",
      "description": "Main development team",
      "owner": "user_id",
      "members": [
        {
          "user": "user_id",
          "role": "owner",
          "joinedAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Single Team

**Endpoint:** `GET /api/teams/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Create Team

**Endpoint:** `POST /api/teams`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "New Team",
  "description": "Team description"
}
```

**Response:** `201 Created`

### Update Team

**Endpoint:** `PATCH /api/teams/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Team Name",
  "description": "Updated description"
}
```

**Response:** `200 OK`

### Delete Team

**Endpoint:** `DELETE /api/teams/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Add Team Member

**Endpoint:** `POST /api/teams/:id/members`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "userId": "user_id",
  "role": "member"
}
```

**Roles:** `owner`, `admin`, `member`

**Response:** `200 OK`

### Update Member Role

**Endpoint:** `PATCH /api/teams/:id/members/:userId`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "role": "admin"
}
```

**Response:** `200 OK`

### Remove Team Member

**Endpoint:** `DELETE /api/teams/:id/members/:userId`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Get Team Tasks

**Endpoint:** `GET /api/teams/:id/tasks`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

## 💬 Comments

### Get Task Comments

**Endpoint:** `GET /api/comments/task/:taskId`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "comment_id",
      "content": "This is a comment",
      "author": {
        "_id": "user_id",
        "name": "John Doe",
        "avatar": "avatar_url"
      },
      "task": "task_id",
      "parentComment": null,
      "reactions": [
        {
          "user": "user_id",
          "emoji": "👍"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create Comment

**Endpoint:** `POST /api/comments/task/:taskId`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "This is a new comment",
  "parentComment": "parent_comment_id"
}
```

**Response:** `201 Created`

### Update Comment

**Endpoint:** `PATCH /api/comments/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "Updated comment content"
}
```

**Response:** `200 OK`

### Delete Comment

**Endpoint:** `DELETE /api/comments/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Add Reaction

**Endpoint:** `POST /api/comments/:id/reactions`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "emoji": "👍"
}
```

**Response:** `200 OK`

### Remove Reaction

**Endpoint:** `DELETE /api/comments/:id/reactions/:emoji`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

## 🔗 Shared Lists

### Get Shared Lists

**Endpoint:** `GET /api/shared-lists`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Create Shared List

**Endpoint:** `POST /api/shared-lists`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Shared Project Tasks",
  "description": "Tasks for the project",
  "tasks": ["task_id_1", "task_id_2"],
  "sharedWith": [
    {
      "user": "user_id",
      "permission": "edit"
    }
  ]
}
```

**Permissions:** `view`, `edit`, `admin`

**Response:** `201 Created`

### Update Shared List

**Endpoint:** `PATCH /api/shared-lists/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Delete Shared List

**Endpoint:** `DELETE /api/shared-lists/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Generate Access Code

**Endpoint:** `POST /api/shared-lists/:id/access-code`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessCode": "ABC123",
    "expiresAt": "2024-12-31T23:59:59.000Z"
  }
}
```

### Join with Access Code

**Endpoint:** `POST /api/shared-lists/join`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "accessCode": "ABC123"
}
```

**Response:** `200 OK`

## ⚠️ Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "statusCode": 400,
    "errors": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes

- `400` - Bad Request (Invalid input)
- `401` - Unauthorized (Missing or invalid token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Resource doesn't exist)
- `409` - Conflict (Duplicate resource)
- `422` - Unprocessable Entity (Validation error)
- `429` - Too Many Requests (Rate limit exceeded)
- `500` - Internal Server Error

### Validation Errors

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 422,
    "errors": [
      {
        "field": "email",
        "message": "Email must be valid"
      },
      {
        "field": "password",
        "message": "Password must be at least 6 characters"
      }
    ]
  }
}
```

## 🚦 Rate Limiting

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limits

- **Authentication endpoints**: 5 requests per 15 minutes
- **General API endpoints**: 100 requests per 15 minutes
- **File upload endpoints**: 10 requests per hour

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "message": "Too many requests, please try again later",
    "statusCode": 429,
    "retryAfter": 900
  }
}
```

## 🔌 WebSocket Events

### Connection

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'jwt_token'
  }
});
```

### Events

#### Client → Server

- `join_room` - Join a task/team room
- `leave_room` - Leave a room
- `task_update` - Update task in real-time
- `typing_start` - User started typing
- `typing_stop` - User stopped typing

#### Server → Client

- `task_updated` - Task was updated
- `task_created` - New task created
- `task_deleted` - Task was deleted
- `user_typing` - Another user is typing
- `user_joined` - User joined room
- `user_left` - User left room

### Example Usage

```javascript
// Join task room
socket.emit('join_room', { taskId: 'task_id' });

// Listen for updates
socket.on('task_updated', (data) => {
  console.log('Task updated:', data);
});

// Send typing indicator
socket.emit('typing_start', { taskId: 'task_id' });
```

## 📚 Additional Resources

- [Postman Collection](./postman_collection.json)
- [OpenAPI Specification](./openapi.yaml)
- [Code Examples](./examples/)

## 🔄 Versioning

Current API Version: `v1`

Base URL: `http://localhost:5000/api`

## 📞 Support

For API support, please contact:
- Email: support@taskflow.com
- Documentation: https://docs.taskflow.com
- GitHub Issues: https://github.com/taskflow/issues