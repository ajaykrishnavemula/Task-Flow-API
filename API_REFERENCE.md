# Task-Flow-API - Complete API Reference

> **Comprehensive API documentation for the Task & Project Management System**

**Base URL**: `http://localhost:5000/api/v1`  
**Version**: 1.0.0  
**Authentication**: JWT Bearer Token

---

## 📋 Table of Contents

- [Authentication](#authentication)
- [Tasks](#tasks)
- [Projects](#projects)
- [Comments](#comments)
- [Shared Lists](#shared-lists)
- [Activity](#activity)
- [Analytics](#analytics)
- [Error Responses](#error-responses)

---

## 🔐 Authentication

Protected endpoints require JWT token:
```http
Authorization: Bearer <your-jwt-token>
```

---

## ✅ Tasks

### 1. Get All Tasks

Retrieve user's tasks with filters.

**Endpoint**: `GET /tasks`

**Headers**:
```http
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (pending, in_progress, completed)
- `priority` (optional): Filter by priority (low, medium, high, urgent)
- `projectId` (optional): Filter by project
- `dueDate` (optional): Filter by due date
- `sort` (optional): Sort by (dueDate, priority, createdAt)

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Complete API documentation",
        "description": "Write comprehensive API docs",
        "status": "in_progress",
        "priority": "high",
        "dueDate": "2024-01-20T00:00:00.000Z",
        "projectId": "507f1f77bcf86cd799439012",
        "projectName": "Backend Development",
        "assignedTo": ["507f1f77bcf86cd799439013"],
        "tags": ["documentation", "api"],
        "progress": 60,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-16T14:20:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20
    },
    "summary": {
      "total": 100,
      "pending": 30,
      "inProgress": 45,
      "completed": 25
    }
  }
}
```

---

### 2. Get Task by ID

Get detailed task information.

**Endpoint**: `GET /tasks/:id`

**Headers**:
```http
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "507f1f77bcf86cd799439011",
      "title": "Complete API documentation",
      "description": "Write comprehensive API documentation for all endpoints",
      "status": "in_progress",
      "priority": "high",
      "dueDate": "2024-01-20T00:00:00.000Z",
      "projectId": "507f1f77bcf86cd799439012",
      "projectName": "Backend Development",
      "createdBy": {
        "id": "507f1f77bcf86cd799439013",
        "name": "John Doe"
      },
      "assignedTo": [
        {
          "id": "507f1f77bcf86cd799439014",
          "name": "Jane Smith"
        }
      ],
      "tags": ["documentation", "api"],
      "attachments": [
        {
          "id": "507f1f77bcf86cd799439015",
          "name": "api-spec.pdf",
          "url": "https://example.com/files/api-spec.pdf",
          "size": 1024000
        }
      ],
      "checklist": [
        {
          "id": "507f1f77bcf86cd799439016",
          "text": "Document authentication endpoints",
          "completed": true
        },
        {
          "id": "507f1f77bcf86cd799439017",
          "text": "Document task endpoints",
          "completed": false
        }
      ],
      "progress": 60,
      "timeTracking": {
        "estimated": 8,
        "spent": 5
      },
      "commentCount": 12,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-16T14:20:00.000Z"
    }
  }
}
```

---

### 3. Create Task

Create a new task.

**Endpoint**: `POST /tasks`

**Headers**:
```http
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "title": "Complete API documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-01-20T00:00:00.000Z",
  "projectId": "507f1f77bcf86cd799439012",
  "assignedTo": ["507f1f77bcf86cd799439013"],
  "tags": ["documentation", "api"],
  "checklist": [
    {
      "text": "Document authentication endpoints",
      "completed": false
    }
  ],
  "timeEstimate": 8
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "id": "507f1f77bcf86cd799439011",
      "title": "Complete API documentation",
      "status": "pending",
      "priority": "high",
      "dueDate": "2024-01-20T00:00:00.000Z"
    }
  }
}
```

---

### 4. Update Task

Update existing task.

**Endpoint**: `PATCH /tasks/:id`

**Headers**:
```http
Authorization: Bearer <token>
```

**Request Body** (partial update):
```json
{
  "status": "in_progress",
  "progress": 60,
  "assignedTo": ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"]
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "id": "507f1f77bcf86cd799439011",
      "title": "Complete API documentation",
      "status": "in_progress",
      "progress": 60
    }
  }
}
```

---

### 5. Delete Task

Delete a task.

**Endpoint**: `DELETE /tasks/:id`

**Headers**:
```http
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## 📁 Projects

### 1. Get All Projects

Retrieve user's projects.

**Endpoint**: `GET /projects`

**Headers**:
```http
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `sort` (optional): Sort by (name, createdAt, dueDate)

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Backend Development",
        "description": "API development project",
        "status": "active",
        "progress": 65,
        "startDate": "2024-01-01T00:00:00.000Z",
        "dueDate": "2024-03-31T00:00:00.000Z",
        "owner": {
          "id": "507f1f77bcf86cd799439012",
          "name": "John Doe"
        },
        "members": [
          {
            "id": "507f1f77bcf86cd799439013",
            "name": "Jane Smith",
            "role": "developer"
          }
        ],
        "taskCount": 45,
        "completedTasks": 30,
        "createdAt": "2024-01-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25
    }
  }
}
```

---

### 2. Create Project

Create a new project.

**Endpoint**: `POST /projects`

**Headers**:
```http
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "name": "Backend Development",
  "description": "API development project",
  "startDate": "2024-01-01T00:00:00.000Z",
  "dueDate": "2024-03-31T00:00:00.000Z",
  "members": [
    {
      "userId": "507f1f77bcf86cd799439013",
      "role": "developer"
    }
  ],
  "tags": ["backend", "api"]
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "project": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Backend Development",
      "status": "active"
    }
  }
}
```

---

### 3. Update Project

Update project details.

**Endpoint**: `PATCH /projects/:id`

**Headers**:
```http
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "name": "Backend Development - Updated",
  "status": "active",
  "progress": 70
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Project updated successfully"
}
```

---

### 4. Delete Project

Delete a project.

**Endpoint**: `DELETE /projects/:id`

**Headers**:
```http
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

## 💬 Comments

### 1. Get Task Comments

Get all comments for a task.

**Endpoint**: `GET /tasks/:taskId/comments`

**Headers**:
```http
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "507f1f77bcf86cd799439011",
        "taskId": "507f1f77bcf86cd799439012",
        "author": {
          "id": "507f1f77bcf86cd799439013",
          "name": "John Doe"
        },
        "content": "Great progress on this task!",
        "mentions": ["507f1f77bcf86cd799439014"],
        "attachments": [],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "count": 12
  }
}
```

---

### 2. Add Comment

Add comment to task.

**Endpoint**: `POST /tasks/:taskId/comments`

**Headers**:
```http
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "content": "Great progress on this task!",
  "mentions": ["507f1f77bcf86cd799439014"]
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "comment": {
      "id": "507f1f77bcf86cd799439011",
      "content": "Great progress on this task!",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### 3. Update Comment

Update existing comment.

**Endpoint**: `PATCH /comments/:id`

**Headers**:
```http
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "content": "Updated comment text"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Comment updated successfully"
}
```

---

### 4. Delete Comment

Delete a comment.

**Endpoint**: `DELETE /comments/:id`

**Headers**:
```http
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

## 🔗 Shared Lists

### 1. Get Shared Lists

Get all shared task lists.

**Endpoint**: `GET /shared-lists`

**Headers**:
```http
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "lists": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Team Sprint Tasks",
        "description": "Current sprint tasks",
        "owner": {
          "id": "507f1f77bcf86cd799439012",
          "name": "John Doe"
        },
        "sharedWith": [
          {
            "id": "507f1f77bcf86cd799439013",
            "name": "Jane Smith",
            "permission": "edit"
          }
        ],
        "taskCount": 15,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 2. Create Shared List

Create a new shared list.

**Endpoint**: `POST /shared-lists`

**Headers**:
```http
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "name": "Team Sprint Tasks",
  "description": "Current sprint tasks",
  "sharedWith": [
    {
      "userId": "507f1f77bcf86cd799439013",
      "permission": "edit"
    }
  ],
  "tasks": ["507f1f77bcf86cd799439014", "507f1f77bcf86cd799439015"]
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Shared list created successfully",
  "data": {
    "list": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Team Sprint Tasks"
    }
  }
}
```

---

## 📊 Activity

### 1. Get Activity Feed

Get recent activity for user's tasks and projects.

**Endpoint**: `GET /activity`

**Headers**:
```http
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): Filter by activity type
- `projectId` (optional): Filter by project

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "507f1f77bcf86cd799439011",
        "type": "task_created",
        "actor": {
          "id": "507f1f77bcf86cd799439012",
          "name": "John Doe"
        },
        "target": {
          "type": "task",
          "id": "507f1f77bcf86cd799439013",
          "title": "Complete API documentation"
        },
        "description": "John Doe created task 'Complete API documentation'",
        "timestamp": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200
    }
  }
}
```

---

## 📈 Analytics

### 1. Get Task Analytics

Get analytics for tasks.

**Endpoint**: `GET /analytics/tasks`

**Headers**:
```http
Authorization: Bearer <token>
```

**Query Parameters**:
- `startDate` (optional): Start date for analytics
- `endDate` (optional): End date for analytics
- `projectId` (optional): Filter by project

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 150,
      "completed": 90,
      "inProgress": 45,
      "pending": 15,
      "completionRate": 60
    },
    "byPriority": {
      "urgent": 10,
      "high": 35,
      "medium": 70,
      "low": 35
    },
    "byStatus": {
      "pending": 15,
      "inProgress": 45,
      "completed": 90
    },
    "productivity": {
      "tasksCompletedThisWeek": 25,
      "tasksCompletedLastWeek": 20,
      "averageCompletionTime": 3.5
    },
    "timeline": [
      {
        "date": "2024-01-15",
        "created": 5,
        "completed": 8
      }
    ]
  }
}
```

---

### 2. Get Project Analytics

Get analytics for projects.

**Endpoint**: `GET /analytics/projects`

**Headers**:
```http
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 10,
      "active": 7,
      "completed": 2,
      "onHold": 1
    },
    "progress": {
      "averageProgress": 65,
      "onTrack": 6,
      "atRisk": 3,
      "delayed": 1
    },
    "timeline": [
      {
        "date": "2024-01-15",
        "activeProjects": 7,
        "completedTasks": 25
      }
    ]
  }
}
```

---

## ❌ Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Human-readable error message"
}
```

### Common Errors

- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## 📊 Status Codes

| Code | Description |
|------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: Ajay Krishna (ajaykrishnatech@gmail.com)