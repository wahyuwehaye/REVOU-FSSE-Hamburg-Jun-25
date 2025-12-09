# 🧪 API Testing Guide

Complete guide for testing the School Management API with various tools.

---

## 🔧 Testing Tools

### 1. cURL (Command Line)
Best for: Quick tests, automation, CI/CD

### 2. Postman
Best for: Visual testing, collections, team collaboration

### 3. Thunder Client (VS Code Extension)
Best for: Testing without leaving VS Code

### 4. REST Client (VS Code Extension)
Best for: File-based API tests in VS Code

---

## 🚀 cURL Examples

### Authentication

#### Register New Student
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "age": 20
  }'
```

#### Login and Save Token
```bash
# Login and extract token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' | jq -r '.access_token')

# Verify token was saved
echo $TOKEN
```

#### Get Profile (Protected Route)
```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

### Students Endpoints

#### Create Student
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "age": 22
  }'
```

#### Get All Students (with pagination)
```bash
# Default pagination
curl http://localhost:3000/api/students

# With parameters
curl 'http://localhost:3000/api/students?page=1&limit=5&search=john'
```

#### Get Student by ID
```bash
curl http://localhost:3000/api/students/1
```

#### Update Student
```bash
curl -X PATCH http://localhost:3000/api/students/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "age": 21
  }'
```

#### Delete Student
```bash
curl -X DELETE http://localhost:3000/api/students/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Student Statistics
```bash
curl http://localhost:3000/api/students/1/statistics \
  -H "Authorization: Bearer $TOKEN"
```

---

### Courses Endpoints

#### Create Course
```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Database Systems",
    "description": "Introduction to relational databases and SQL",
    "credits": 4,
    "instructor": "Dr. Smith"
  }'
```

#### Get All Courses
```bash
curl http://localhost:3000/api/courses
```

#### Get Course by ID
```bash
curl http://localhost:3000/api/courses/1
```

#### Get Course with Students
```bash
curl http://localhost:3000/api/courses/1/students
```

#### Get Course Statistics
```bash
curl http://localhost:3000/api/courses/1/statistics
```

---

### Enrollments Endpoints

#### Enroll in Course
```bash
curl -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "courseId": 1
  }'
```

#### Get My Courses
```bash
curl http://localhost:3000/api/enrollments/my-courses \
  -H "Authorization: Bearer $TOKEN"
```

#### Update Grade (Instructor)
```bash
curl -X PATCH http://localhost:3000/api/enrollments/1/grade \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "grade": "A"
  }'
```

#### Drop Course
```bash
curl -X DELETE http://localhost:3000/api/enrollments/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📝 Complete Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000/api"

echo "🚀 Testing School Management API"
echo "================================"

# 1. Register Student
echo -e "\n📝 1. Registering new student..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test@example.com",
    "password": "password123",
    "age": 20
  }')

echo $REGISTER_RESPONSE | jq '.'
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.access_token')

# 2. Login
echo -e "\n🔐 2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo $LOGIN_RESPONSE | jq '.'
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

# 3. Get Profile
echo -e "\n👤 3. Getting profile..."
curl -s $BASE_URL/auth/profile \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 4. Create Course
echo -e "\n📚 4. Creating course..."
COURSE_RESPONSE=$(curl -s -X POST $BASE_URL/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Course",
    "description": "This is a test course",
    "credits": 4,
    "instructor": "Dr. Test"
  }')

echo $COURSE_RESPONSE | jq '.'
COURSE_ID=$(echo $COURSE_RESPONSE | jq -r '.id')

# 5. Enroll in Course
echo -e "\n✏️ 5. Enrolling in course..."
curl -s -X POST $BASE_URL/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"courseId\": $COURSE_ID}" | jq '.'

# 6. Get My Courses
echo -e "\n📖 6. Getting my courses..."
curl -s $BASE_URL/enrollments/my-courses \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n✅ All tests completed!"
```

Run with:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 📮 Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "School Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\",\n  \"age\": 20\n}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}"
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const response = pm.response.json();",
                  "pm.environment.set('token', response.access_token);"
                ]
              }
            }
          ]
        },
        {
          "name": "Get Profile",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/auth/profile",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

---

## 🧪 Testing Scenarios

### Scenario 1: Complete Student Flow

```bash
# 1. Register
# 2. Login
# 3. Get profile
# 4. Update profile
# 5. Get statistics
```

### Scenario 2: Course Management

```bash
# 1. Create multiple courses
# 2. List all courses
# 3. Get course details
# 4. Get course statistics
```

### Scenario 3: Enrollment Flow

```bash
# 1. Student enrolls in 3 courses
# 2. Check my courses
# 3. Drop 1 course
# 4. Verify enrollment count
```

### Scenario 4: Error Handling

```bash
# 1. Try to register with existing email (409)
# 2. Try to login with wrong password (401)
# 3. Try protected route without token (401)
# 4. Try to enroll in same course twice (400)
# 5. Try to enroll in 6th course (400 - max 5)
```

---

## 🎯 Expected Responses

### Successful Response (200/201)
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 20,
  "enrolledAt": "2024-01-15T10:00:00Z"
}
```

### Error Response (400/401/404)
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Validation Error (400)
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "age must be at least 16"
  ],
  "error": "Bad Request"
}
```

---

## 📊 Performance Testing

### Load Testing with Apache Bench

```bash
# Install apache2-utils
sudo apt install apache2-utils  # Linux
brew install apr-util            # macOS

# Test GET endpoint (100 requests, 10 concurrent)
ab -n 100 -c 10 http://localhost:3000/api/courses

# Test POST endpoint with auth
ab -n 100 -c 10 -p data.json -T application/json \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/students
```

---

## ✅ Testing Checklist

### Manual Testing
- [ ] All POST endpoints create resources
- [ ] All GET endpoints return data
- [ ] PATCH endpoints update correctly
- [ ] DELETE endpoints remove resources
- [ ] Authentication works (login/register)
- [ ] Protected routes require token
- [ ] Invalid data returns 400
- [ ] Non-existent resources return 404
- [ ] Duplicate emails return 409

### Edge Cases
- [ ] Empty request body
- [ ] Extra fields in request
- [ ] Invalid email format
- [ ] Age below minimum (16)
- [ ] Password too short
- [ ] Enroll in non-existent course
- [ ] Enroll twice in same course
- [ ] Enroll in more than 5 courses

---

**Happy Testing! 🧪**
