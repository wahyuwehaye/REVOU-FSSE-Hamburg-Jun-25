# Complete Todo API - Week 21 NestJS Project

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

Proyek lengkap yang mencakup **SEMUA materi Week 21** - Introduction to NestJS & REST API, termasuk CRUD operations, validation, error handling, filtering, sorting, pagination, dan search functionality.

**Complete project covering ALL Week 21 materials** - Introduction to NestJS & REST API, including CRUD operations, validation, error handling, filtering, sorting, pagination, and search functionality.

---

## 📋 Table of Contents

- [Features](#-features)
- [Technologies](#-technologies)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
  - [Base Endpoints](#base-endpoints)
  - [Todos Endpoints](#todos-endpoints)
  - [Categories Endpoints](#categories-endpoints)
- [Postman Collection](#-postman-collection)
- [Validation Examples](#-validation-examples)
- [Error Handling](#-error-handling)
- [Learning Objectives Covered](#-learning-objectives-covered)

---

## ✨ Features

### Core Features
- ✅ **CRUD Operations** - Create, Read, Update, Delete for Todos and Categories
- ✅ **Input Validation** - Using class-validator decorators
- ✅ **Error Handling** - Custom exception filters with consistent error responses
- ✅ **DTOs** - Data Transfer Objects with validation
- ✅ **Modular Architecture** - Separation of concerns (Modules, Controllers, Services)

### Advanced Features
- ✅ **Filtering** - Filter todos by status, priority, category
- ✅ **Sorting** - Sort by any field (createdAt, priority, title)
- ✅ **Pagination** - Page-based pagination with metadata
- ✅ **Search** - Full-text search in title and description
- ✅ **Nested Resources** - Get todos by category (`/categories/:id/todos`)
- ✅ **Bulk Operations** - Delete multiple todos at once
- ✅ **Statistics** - Get statistics for todos and categories
- ✅ **Custom Endpoints** - Mark as completed/incomplete

---

## 🛠 Technologies

- **NestJS** 10.x - Progressive Node.js framework
- **TypeScript** 5.1.3 - Type-safe JavaScript
- **class-validator** 0.14.0 - Validation decorators
- **class-transformer** 0.5.1 - Transform plain objects to class instances
- **@nestjs/mapped-types** 2.0.2 - PartialType helper

---

## 📁 Project Structure

```
complete-todo-api/
├── src/
│   ├── main.ts                          # Bootstrap aplikasi / Application bootstrap
│   ├── app.module.ts                    # Root module
│   ├── app.controller.ts                # Base controller (/, /health, /info)
│   ├── app.service.ts                   # Base service
│   │
│   ├── common/                          # Shared utilities
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts # Global exception filter
│   │   └── interceptors/
│   │       └── transform.interceptor.ts # Response transformer
│   │
│   ├── todos/                           # Todos feature module
│   │   ├── dto/
│   │   │   ├── create-todo.dto.ts       # Create DTO with validation
│   │   │   ├── update-todo.dto.ts       # Update DTO (PartialType)
│   │   │   └── query-todo.dto.ts        # Query parameters DTO
│   │   ├── todos.controller.ts          # Todos HTTP handlers
│   │   ├── todos.service.ts             # Todos business logic
│   │   └── todos.module.ts              # Todos module
│   │
│   └── categories/                      # Categories feature module
│       ├── dto/
│       │   ├── create-category.dto.ts   # Create category DTO
│       │   └── update-category.dto.ts   # Update category DTO
│       ├── categories.controller.ts     # Categories HTTP handlers
│       ├── categories.service.ts        # Categories business logic
│       └── categories.module.ts         # Categories module
│
├── package.json                         # Dependencies
├── tsconfig.json                        # TypeScript config
├── nest-cli.json                        # NestJS CLI config
├── .prettierrc                          # Code formatting
├── .gitignore                           # Git ignore
├── .env.example                         # Environment variables example
└── README.md                            # This file
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ installed
- npm atau yarn

### Steps

1. **Clone atau copy folder ini**
   ```bash
   cd week21/demo/complete-todo-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Verify installation**
   ```bash
   npm run build
   ```

---

## ▶️ Running the Application

### Development Mode (dengan auto-reload)
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Watch Mode
```bash
npm run start:debug
```

**Server akan berjalan di:** `http://localhost:3000`

---

## 📚 API Documentation

### Base Endpoints

#### 1. Welcome Message
```
GET http://localhost:3000/
```
**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "message": "Welcome to Complete Todo API! 🚀",
    "version": "1.0.0",
    "endpoints": {
      "todos": "/todos",
      "categories": "/categories",
      "health": "/health",
      "info": "/info"
    }
  }
}
```

#### 2. Health Check
```
GET http://localhost:3000/health
```

#### 3. API Info
```
GET http://localhost:3000/info
```

---

### Todos Endpoints

#### 1. Create Todo
```http
POST http://localhost:3000/todos
Content-Type: application/json

{
  "title": "Complete NestJS Tutorial",
  "description": "Learn all concepts",
  "completed": false,
  "priority": "high",
  "categoryId": 1,
  "tags": "learning,nestjs"
}
```

**Validation Rules:**
- `title`: Required, min 3, max 100 characters
- `priority`: Optional, must be: "low", "medium", "high", "urgent"
- `completed`: Optional, boolean
- `tags`: Optional, comma-separated string

#### 2. Get All Todos (with filtering, sorting, pagination)
```http
GET http://localhost:3000/todos
```

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `completed` | boolean | Filter by status | `?completed=false` |
| `priority` | string | Filter by priority | `?priority=high` |
| `categoryId` | number | Filter by category | `?categoryId=1` |
| `tags` | string | Filter by tag | `?tags=work` |
| `search` | string | Search in title/description | `?search=meeting` |
| `sortBy` | string | Field to sort by | `?sortBy=createdAt` |
| `order` | string | Sort order (asc/desc) | `?order=desc` |
| `page` | number | Page number | `?page=1` |
| `limit` | number | Items per page | `?limit=10` |

**Examples:**
```http
# Get incomplete todos
GET http://localhost:3000/todos?completed=false

# Get high priority todos, sorted by creation date
GET http://localhost:3000/todos?priority=high&sortBy=createdAt&order=desc

# Search todos with pagination
GET http://localhost:3000/todos?search=meeting&page=1&limit=5

# Complex query
GET http://localhost:3000/todos?completed=false&priority=urgent&categoryId=1&sortBy=createdAt&order=desc&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "data": [
      {
        "id": 1,
        "title": "Complete NestJS Tutorial",
        "description": "Learn all concepts",
        "completed": false,
        "priority": "high",
        "categoryId": 1,
        "tags": ["learning", "nestjs"],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "meta": {
      "total": 10,
      "page": 1,
      "limit": 10,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}
```

#### 3. Get Todo by ID
```http
GET http://localhost:3000/todos/1
```

#### 4. Update Todo (PATCH - partial update)
```http
PATCH http://localhost:3000/todos/1
Content-Type: application/json

{
  "completed": true
}
```

#### 5. Update Todo (PUT - full update)
```http
PUT http://localhost:3000/todos/1
Content-Type: application/json

{
  "title": "Updated Title",
  "completed": true
}
```

#### 6. Delete Todo
```http
DELETE http://localhost:3000/todos/1
```

#### 7. Get Todo Statistics
```http
GET http://localhost:3000/todos/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "completed": 3,
    "pending": 7,
    "completionRate": "30.00%",
    "byPriority": {
      "low": 2,
      "medium": 3,
      "high": 4,
      "urgent": 1
    }
  }
}
```

#### 8. Mark as Completed
```http
PATCH http://localhost:3000/todos/1/complete
```

#### 9. Mark as Incomplete
```http
PATCH http://localhost:3000/todos/1/incomplete
```

#### 10. Bulk Delete
```http
POST http://localhost:3000/todos/bulk-delete
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

---

### Categories Endpoints

#### 1. Create Category
```http
POST http://localhost:3000/categories
Content-Type: application/json

{
  "name": "Work",
  "description": "Work-related tasks",
  "color": "#3B82F6"
}
```

#### 2. Get All Categories
```http
GET http://localhost:3000/categories
```

#### 3. Get Category by ID
```http
GET http://localhost:3000/categories/1
```

#### 4. Get Todos by Category (Nested Resource)
```http
GET http://localhost:3000/categories/1/todos
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categoryId": 1,
    "totalTodos": 5,
    "todos": [
      {
        "id": 1,
        "title": "Task 1",
        "categoryId": 1,
        ...
      }
    ]
  }
}
```

#### 5. Update Category
```http
PATCH http://localhost:3000/categories/1
Content-Type: application/json

{
  "name": "Updated Name"
}
```

#### 6. Delete Category
```http
DELETE http://localhost:3000/categories/1
```
**Note:** Cannot delete category if it has todos

#### 7. Get Category Statistics
```http
GET http://localhost:3000/categories/statistics
```

---

## 📮 Postman Collection

Postman collection sudah disediakan di file `Complete-Todo-API.postman_collection.json`

### Import ke Postman:
1. Buka Postman
2. Click **Import**
3. Pilih file `Complete-Todo-API.postman_collection.json`
4. Collection akan muncul di sidebar

### Collection Contents:
- ✅ 25+ pre-configured requests
- ✅ All endpoints documented
- ✅ Example requests and responses
- ✅ Organized by feature (Todos, Categories)
- ✅ Environment variables ready

---

## ✅ Validation Examples

### Valid Request
```json
{
  "title": "Valid Task",
  "priority": "high"
}
```
✅ **Success:** 201 Created

### Invalid Requests

#### Missing Required Field
```json
{
  "description": "No title provided"
}
```
❌ **Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": [
    "Title is required",
    "Title must be at least 3 characters long"
  ]
}
```

#### Invalid Priority Value
```json
{
  "title": "Task",
  "priority": "invalid"
}
```
❌ **Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": ["Priority must be one of: low, medium, high, urgent"]
}
```

#### Title Too Short
```json
{
  "title": "Hi"
}
```
❌ **Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": ["Title must be at least 3 characters long"]
}
```

---

## ❌ Error Handling

Semua error dikembalikan dalam format yang konsisten:

```json
{
  "success": false,
  "statusCode": 404,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/todos/999",
  "method": "GET",
  "error": "Not Found",
  "message": "Todo with ID 999 not found"
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request (Validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🎯 Learning Objectives Covered

Proyek ini mencakup **SEMUA** materi Week 21:

### ✅ Chapter 1-3: Backend & NestJS Introduction
- [x] Understanding backend development
- [x] Why use backend frameworks
- [x] Why NestJS over others

### ✅ Chapter 4: REST API Fundamentals
- [x] HTTP Methods (GET, POST, PUT, PATCH, DELETE)
- [x] RESTful design principles
- [x] Status codes usage

### ✅ Chapter 5-6: Setup & Architecture
- [x] Project setup with NestJS CLI
- [x] Understanding modules, controllers, services
- [x] Dependency Injection

### ✅ Chapter 7-8: Creating Endpoints
- [x] Decorators (@Controller, @Get, @Post, etc.)
- [x] Route parameters (@Param)
- [x] Query parameters (@Query)
- [x] Request body (@Body)

### ✅ Chapter 9: DTOs & Validation
- [x] Creating DTOs
- [x] class-validator decorators
- [x] Validation pipes
- [x] PartialType for updates

### ✅ Chapter 10: Error Handling
- [x] HttpException usage
- [x] Custom exception filters
- [x] Consistent error responses

### ✅ Chapter 11: Testing with Postman
- [x] Creating collections
- [x] Testing all endpoints
- [x] Organizing requests

### ✅ Bonus: Advanced Features
- [x] Filtering, sorting, pagination
- [x] Search functionality
- [x] Nested resources
- [x] Bulk operations
- [x] Statistics endpoints

---

## 🔗 Related Files

- **Learning Materials:** `/week21/materi/`
- **Exercises:** `/week21/exercises/EXERCISES.md`
- **Assignments:** `/week21/projects/ASSIGNMENTS.md`
- **Teaching Guide:** `/week21/TEACHING_GUIDE.md`

---

## 👨‍💻 Author

**RevoU Week 21** - Introduction to NestJS & REST API

---

## 📝 Notes

- Proyek ini menggunakan **in-memory storage** (array) untuk demonstrasi
- Tidak ada database requirement
- Semua data akan hilang saat server di-restart
- Cocok untuk learning dan testing

---

## 🤝 Contributing

Jika menemukan bug atau ingin menambahkan fitur:
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## ⭐ Support

Jika proyek ini membantu pembelajaran Anda, jangan lupa kasih ⭐!

---

**Happy Coding! 🚀**
