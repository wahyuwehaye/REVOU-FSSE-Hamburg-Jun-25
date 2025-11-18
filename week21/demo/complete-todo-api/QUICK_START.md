# Quick Start Guide - Complete Todo API

## 🚀 Cara Cepat Menjalankan & Testing API

### Step 1: Persiapan (5 menit)

```bash
# 1. Masuk ke folder project
cd week21/demo/complete-todo-api

# 2. Install dependencies
npm install

# 3. Jalankan server
npm run start:dev
```

Server akan running di: **http://localhost:3000**

---

### Step 2: Test dengan Browser (2 menit)

Buka browser dan akses URL berikut:

#### ✅ Base Endpoints
```
http://localhost:3000/
http://localhost:3000/health
http://localhost:3000/info
```

#### ✅ Get All Todos
```
http://localhost:3000/todos
```

#### ✅ Get Statistics
```
http://localhost:3000/todos/statistics
```

#### ✅ Get All Categories
```
http://localhost:3000/categories
```

#### ✅ Get Todos by Category (Nested Resource)
```
http://localhost:3000/categories/1/todos
```

---

### Step 3: Test dengan Query Parameters

#### Filter by Completion Status
```
http://localhost:3000/todos?completed=false
```

#### Filter by Priority
```
http://localhost:3000/todos?priority=high
```

#### Search Todos
```
http://localhost:3000/todos?search=meeting
```

#### Sort by Created Date (Descending)
```
http://localhost:3000/todos?sortBy=createdAt&order=desc
```

#### Pagination
```
http://localhost:3000/todos?page=1&limit=5
```

#### Complex Query (Combine Multiple)
```
http://localhost:3000/todos?completed=false&priority=high&sortBy=createdAt&order=desc&page=1&limit=10
```

---

### Step 4: Test dengan Postman (Recommended)

#### Import Collection
1. Buka **Postman**
2. Click **Import** button
3. Drag & drop atau browse file: `Complete-Todo-API.postman_collection.json`
4. Collection akan muncul dengan **25+ requests** siap pakai

#### Structure Collection
```
📁 Complete Todo API - Week 21
  📁 Base Endpoints (3 requests)
    - Welcome Message
    - Health Check
    - API Info
  
  📁 Todos (16 requests)
    - Create Todo
    - Get All Todos
    - Get Incomplete Todos
    - Get High Priority Todos
    - Get Todos with Sorting
    - Get Todos with Pagination
    - Search Todos
    - Complex Query
    - Get Statistics
    - Get Todo by ID
    - Update (PATCH)
    - Update (PUT)
    - Mark as Completed
    - Mark as Incomplete
    - Bulk Delete
    - Delete
  
  📁 Categories (7 requests)
    - Create Category
    - Get All Categories
    - Get Statistics
    - Get Category by ID
    - Get Todos by Category (Nested)
    - Update Category
    - Delete Category
  
  📁 Validation Examples (7 requests)
    - Valid Todo ✅
    - Missing Required Field ❌
    - Invalid Priority ❌
    - Title Too Short ❌
    - Title Too Long ❌
    - Invalid Boolean ❌
    - Non-existent Todo (404) ❌
```

---

### Step 5: Test Create & Update (POST/PATCH)

#### Create New Todo (POST)
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Task",
    "description": "Learning NestJS is fun!",
    "priority": "high",
    "categoryId": 1,
    "tags": "learning,nestjs"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": 6,
    "title": "My New Task",
    "description": "Learning NestJS is fun!",
    "completed": false,
    "priority": "high",
    "categoryId": 1,
    "tags": ["learning", "nestjs"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Todo (PATCH)
```bash
curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

#### Delete Todo
```bash
curl -X DELETE http://localhost:3000/todos/1
```

---

### Step 6: Test Validation (Should Fail)

#### Missing Required Field
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "description": "No title provided"
  }'
```

**Expected Error:**
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

#### Invalid Priority
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task",
    "priority": "invalid"
  }'
```

**Expected Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": ["Priority must be one of: low, medium, high, urgent"]
}
```

---

## 📊 Sample Data yang Tersedia

### Todos (5 items)
1. Complete NestJS Tutorial (High priority, Not completed)
2. Build REST API (Urgent, Not completed)
3. Write Unit Tests (Medium, Not completed)
4. Review Pull Requests (Low, Completed)
5. Prepare Meeting Agenda (Medium, Completed)

### Categories (4 items)
1. Work (#3B82F6 - Blue)
2. Personal (#10B981 - Green)
3. Shopping (#F59E0B - Orange)
4. Health (#EF4444 - Red)

---

## 🎯 Testing Checklist

### Basic CRUD ✅
- [ ] Create todo (POST /todos)
- [ ] Get all todos (GET /todos)
- [ ] Get one todo (GET /todos/:id)
- [ ] Update todo (PATCH /todos/:id)
- [ ] Delete todo (DELETE /todos/:id)

### Advanced Features ✅
- [ ] Filter by completed status
- [ ] Filter by priority
- [ ] Filter by category
- [ ] Sort todos (asc/desc)
- [ ] Paginate results
- [ ] Search in title/description
- [ ] Complex query (multiple filters)

### Validation ✅
- [ ] Missing required field (should fail)
- [ ] Invalid priority value (should fail)
- [ ] Title too short (should fail)
- [ ] Title too long (should fail)
- [ ] Get non-existent todo (should return 404)

### Nested Resources ✅
- [ ] Get todos by category (GET /categories/:id/todos)

### Statistics ✅
- [ ] Get todo statistics
- [ ] Get category statistics

### Bulk Operations ✅
- [ ] Bulk delete todos

---

## 💡 Tips untuk Testing

1. **Gunakan Postman** - Paling mudah untuk testing POST/PATCH/DELETE
2. **Test Validation** - Coba semua validation examples untuk memahami error handling
3. **Try Complex Queries** - Combine filtering + sorting + pagination
4. **Check Response Format** - Semua response wrapped in consistent format
5. **Test Edge Cases** - Non-existent IDs, empty results, etc.

---

## 🔍 Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run start:dev
```

### npm install Failed
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### TypeScript Errors
```bash
# Rebuild project
npm run build
```

---

## 📚 Resources

- **Full Documentation:** README.md
- **API Endpoints:** README.md (API Documentation section)
- **Learning Materials:** /week21/materi/
- **Exercises:** /week21/exercises/EXERCISES.md
- **Assignments:** /week21/projects/ASSIGNMENTS.md

---

## ⏱️ Estimated Time

- **Setup & Installation:** 5 minutes
- **Browser Testing:** 2 minutes
- **Postman Import:** 1 minute
- **Testing All Endpoints:** 10-15 minutes
- **Trying Advanced Features:** 10 minutes

**Total:** ~30 minutes untuk mencoba semua fitur

---

## 🎓 What You'll Learn

1. ✅ How NestJS handles HTTP requests
2. ✅ How validation works with class-validator
3. ✅ How to implement filtering & pagination
4. ✅ How error handling works
5. ✅ How to structure modular applications
6. ✅ How to test APIs with Postman
7. ✅ RESTful API best practices

---

**Ready to Start? Let's go! 🚀**

```bash
npm run start:dev
```

Then open: **http://localhost:3000**
