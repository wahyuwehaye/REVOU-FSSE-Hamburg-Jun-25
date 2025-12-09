# 🚀 Library Management API - Quick Start Guide

Welcome to the Library Management API! This guide will help you get started in **5 minutes**.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Setup (5 Minutes)](#quick-setup-5-minutes)
3. [Testing with cURL](#testing-with-curl)
4. [Testing with Postman](#testing-with-postman)
5. [Complete Workflow Example](#complete-workflow-example)
6. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Make sure you have these installed:

```bash
# Check Node.js (v18+)
node --version

# Check PostgreSQL (v14+)
psql --version

# Check if PostgreSQL is running
pg_isready
```

If PostgreSQL is not running:

```bash
# macOS (Homebrew)
brew services start postgresql@14

# Or using pg_ctl
pg_ctl -D /usr/local/var/postgres start
```

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies

```bash
cd week23/demo/library-api
npm install
```

### Step 2: Create Database

```bash
createdb library_db
```

### Step 3: Configure Environment

The `.env` file is already configured for local development:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username  # Update this!
DATABASE_PASSWORD=
DATABASE_NAME=library_db
JWT_SECRET=week23-library-api-secret-key-demo
JWT_EXPIRATION=7d
PORT=3001
NODE_ENV=development
```

**⚠️ Important:** Update `DATABASE_USERNAME` to match your system username:

```bash
# Find your username
whoami

# Update .env file
# Change DATABASE_USERNAME=your_username to DATABASE_USERNAME=actual_username
```

### Step 4: Build & Run

```bash
# Build the application
npm run build

# Start the server
node dist/main.js
```

You should see:

```
🚀 Library API is running on: http://localhost:3001/api
📚 Environment: development
🗄️  Database: library_db
```

**✅ Done!** Your API is ready to use!

---

## 🧪 Testing with cURL

### 1. Register a Librarian

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "librarian@library.com",
    "fullName": "John Librarian",
    "password": "password123",
    "role": "librarian",
    "phoneNumber": "08123456789"
  }'
```

**Response:**

```json
{
  "user": {
    "id": "uuid-here",
    "email": "librarian@library.com",
    "fullName": "John Librarian",
    "role": "librarian"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**💾 Save the token!** You'll need it for protected endpoints.

```bash
# Set token as environment variable for easier testing
export TOKEN="your_token_here"
```

### 2. Create an Author

```bash
curl -X POST http://localhost:3001/api/authors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "J.K. Rowling",
    "biography": "British author, best known for Harry Potter series",
    "country": "United Kingdom",
    "birthDate": "1965-07-31"
  }'
```

**Save the author ID** from the response!

### 3. Create a Category

```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Fantasy",
    "description": "Fantasy and magical adventure books"
  }'
```

**Save the category ID** from the response!

### 4. Add a Book

```bash
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Harry Potter and the Philosopher'\''s Stone",
    "isbn": "978-0747532743",
    "description": "The first book in the Harry Potter series",
    "publisher": "Bloomsbury",
    "publishedDate": "1997-06-26",
    "totalCopies": 5,
    "pageCount": 223,
    "language": "English",
    "authorId": "author-id-here",
    "categoryId": "category-id-here"
  }'
```

**Save the book ID** from the response!

### 5. Register a Member

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "member@example.com",
    "fullName": "Jane Member",
    "password": "password123",
    "phoneNumber": "08123456788",
    "membershipExpiryDate": "2025-12-31"
  }'
```

**Save the member user ID** from the response!

### 6. Borrow a Book

```bash
curl -X POST http://localhost:3001/api/borrowings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": "member-user-id-here",
    "bookId": "book-id-here",
    "borrowDate": "2024-12-02",
    "dueDate": "2024-12-16",
    "notes": "First borrowing"
  }'
```

**Save the borrowing ID** from the response!

### 7. Return a Book

```bash
curl -X POST http://localhost:3001/api/borrowings/borrowing-id-here/return \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "returnDate": "2024-12-15"
  }'
```

### 8. View All Books

```bash
# Get all available books
curl http://localhost:3001/api/books

# Filter by status
curl http://localhost:3001/api/books?status=available

# Filter by category
curl http://localhost:3001/api/books?categoryId=category-id-here
```

### 9. Get Overdue Borrowings

```bash
curl http://localhost:3001/api/borrowings/overdue \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📮 Testing with Postman

### Import Collection

1. Open Postman
2. Click **Import**
3. Select `postman/Library-API.postman_collection.json`
4. The collection will be imported with all endpoints!

### Collection Variables

The Postman collection includes automatic variable saving:

- `{{base_url}}` - http://localhost:3001/api
- `{{token}}` - Auto-saved after register/login
- `{{user_id}}` - Auto-saved after register
- `{{author_id}}` - Auto-saved after creating author
- `{{category_id}}` - Auto-saved after creating category
- `{{book_id}}` - Auto-saved after creating book
- `{{borrowing_id}}` - Auto-saved after creating borrowing

### Testing Flow in Postman

1. **Authentication → Register User** (Sets `{{token}}` and `{{user_id}}`)
2. **Authors → Create Author** (Sets `{{author_id}}`)
3. **Categories → Create Category** (Sets `{{category_id}}`)
4. **Books → Create Book** (Uses `{{author_id}}` and `{{category_id}}`)
5. **Borrowings → Create Borrowing** (Uses `{{user_id}}` and `{{book_id}}`)
6. **Borrowings → Return Book** (Uses `{{borrowing_id}}`)

---

## 🎯 Complete Workflow Example

Here's a complete bash script to test the full workflow:

```bash
#!/bin/bash

BASE_URL="http://localhost:3001/api"

echo "=== 1. Register Librarian ==="
RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "librarian@lib.com",
    "fullName": "John Doe",
    "password": "pass123",
    "role": "librarian"
  }')

TOKEN=$(echo $RESPONSE | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')
echo "Token: $TOKEN"

echo "\n=== 2. Create Author ==="
AUTHOR_RESPONSE=$(curl -s -X POST $BASE_URL/authors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "George Orwell",
    "biography": "English novelist and essayist",
    "country": "United Kingdom"
  }')

AUTHOR_ID=$(echo $AUTHOR_RESPONSE | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
echo "Author ID: $AUTHOR_ID"

echo "\n=== 3. Create Category ==="
CATEGORY_RESPONSE=$(curl -s -X POST $BASE_URL/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Science Fiction",
    "description": "Sci-fi and dystopian novels"
  }')

CATEGORY_ID=$(echo $CATEGORY_RESPONSE | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
echo "Category ID: $CATEGORY_ID"

echo "\n=== 4. Add Book ==="
BOOK_RESPONSE=$(curl -s -X POST $BASE_URL/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"title\": \"1984\",
    \"isbn\": \"978-0451524935\",
    \"description\": \"Dystopian social science fiction novel\",
    \"publisher\": \"Secker & Warburg\",
    \"publishedDate\": \"1949-06-08\",
    \"totalCopies\": 3,
    \"pageCount\": 328,
    \"language\": \"English\",
    \"authorId\": \"$AUTHOR_ID\",
    \"categoryId\": \"$CATEGORY_ID\"
  }")

BOOK_ID=$(echo $BOOK_RESPONSE | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
echo "Book ID: $BOOK_ID"

echo "\n=== 5. Register Member ==="
MEMBER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "member@example.com",
    "fullName": "Jane Smith",
    "password": "pass123"
  }')

USER_ID=$(echo $MEMBER_RESPONSE | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
echo "Member ID: $USER_ID"

echo "\n=== 6. Borrow Book ==="
BORROWING_RESPONSE=$(curl -s -X POST $BASE_URL/borrowings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"userId\": \"$USER_ID\",
    \"bookId\": \"$BOOK_ID\",
    \"borrowDate\": \"2024-12-02\",
    \"dueDate\": \"2024-12-16\"
  }")

BORROWING_ID=$(echo $BORROWING_RESPONSE | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
echo "Borrowing ID: $BORROWING_ID"

echo "\n=== 7. Get All Books ==="
curl -s $BASE_URL/books | head -20

echo "\n\n=== 8. Get Book Stats ==="
curl -s $BASE_URL/books/$BOOK_ID/stats | head -20

echo "\n\n✅ Workflow completed!"
```

Save as `test-workflow.sh` and run:

```bash
chmod +x test-workflow.sh
./test-workflow.sh
```

---

## 🔍 Exploring the Database

### Connect to PostgreSQL

```bash
psql library_db
```

### Useful SQL Queries

```sql
-- View all tables
\dt

-- View users
SELECT id, email, "fullName", role FROM users;

-- View books with authors and categories
SELECT 
  b.title, 
  b.isbn, 
  a.name as author, 
  c.name as category,
  b.status,
  b."availableCopies"
FROM books b
JOIN authors a ON b."authorId" = a.id
JOIN categories c ON b."categoryId" = c.id;

-- View active borrowings
SELECT 
  u."fullName" as member,
  b.title as book,
  br."borrowDate",
  br."dueDate",
  br.status
FROM borrowings br
JOIN users u ON br."userId" = u.id
JOIN books b ON br."bookId" = b.id
WHERE br.status = 'borrowed';

-- Exit psql
\q
```

---

## 🐛 Troubleshooting

### Problem: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3001`

**Solution:**

```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=3002
```

### Problem: Database Connection Failed

**Error:** `connection to database "library_db" failed`

**Solutions:**

```bash
# 1. Check if PostgreSQL is running
pg_isready

# 2. Start PostgreSQL
brew services start postgresql@14

# 3. Verify database exists
psql -l | grep library_db

# 4. Create database if missing
createdb library_db

# 5. Check DATABASE_USERNAME in .env
whoami  # Use this as your username
```

### Problem: Module Not Found

**Error:** `Cannot find module '@nestjs/...'`

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild project
npm run build
```

### Problem: JWT Token Expired

**Error:** `Unauthorized` or `Token expired`

**Solution:**

```bash
# Login again to get new token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "librarian@lib.com",
    "password": "pass123"
  }'

# Update your TOKEN variable
export TOKEN="new_token_here"
```

### Problem: Circular Dependency Warning

**Warning:** `Circular dependency between modules`

**Solution:** This is already handled in the code using string references for relations. You can safely ignore this warning.

---

## 📚 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login existing user

### Users (Protected)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/stats` - Get user statistics
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Authors
- `GET /api/authors` - Get all authors (Public)
- `GET /api/authors/:id` - Get author by ID (Public)
- `POST /api/authors` - Create author (Protected)
- `PATCH /api/authors/:id` - Update author (Protected)
- `DELETE /api/authors/:id` - Delete author (Protected)

### Categories
- `GET /api/categories` - Get all categories (Public)
- `GET /api/categories/:id` - Get category by ID (Public)
- `GET /api/categories/slug/:slug` - Get category by slug (Public)
- `POST /api/categories` - Create category (Protected)
- `PATCH /api/categories/:id` - Update category (Protected)
- `DELETE /api/categories/:id` - Delete category (Protected)

### Books
- `GET /api/books` - Get all books (Public, with filters)
- `GET /api/books/:id` - Get book by ID (Public)
- `GET /api/books/:id/stats` - Get book statistics (Public)
- `GET /api/books/isbn/:isbn` - Get book by ISBN (Public)
- `POST /api/books` - Create book (Protected)
- `PATCH /api/books/:id` - Update book (Protected)
- `DELETE /api/books/:id` - Delete book (Protected)

### Borrowings (All Protected)
- `POST /api/borrowings` - Create borrowing
- `GET /api/borrowings` - Get all borrowings (with filters)
- `GET /api/borrowings/:id` - Get borrowing by ID
- `GET /api/borrowings/overdue` - Get overdue borrowings
- `POST /api/borrowings/:id/return` - Return book
- `PATCH /api/borrowings/:id` - Update borrowing
- `DELETE /api/borrowings/:id` - Delete borrowing

---

## 🎓 What You'll Learn

By using this API, you'll understand:

1. **TypeORM Entities** - How to define database models with decorators
2. **Entity Relationships** - One-to-Many, Many-to-One, and how they work
3. **JWT Authentication** - Token-based authentication and authorization
4. **Protected Routes** - Using guards to protect endpoints
5. **Query Filtering** - Filtering data with query parameters
6. **Business Logic** - Managing book availability, late fees, etc.
7. **Database Operations** - CRUD operations with TypeORM
8. **Error Handling** - Proper error responses and validation
9. **Data Validation** - Using DTOs with class-validator
10. **PostgreSQL** - Working with a production-ready database

---

## 🚀 Next Steps

After getting familiar with the API:

1. **Explore the Code** - Check `src/` folder to understand the structure
2. **Read the README** - Full documentation of features and architecture
3. **Modify & Experiment** - Try adding new features
4. **Study the Database** - Use pgAdmin or DBeaver to visualize the schema
5. **Add Features** - Try implementing:
   - Book ratings and reviews
   - Fine/penalty system
   - Book reservations
   - Search functionality
   - Email notifications

---

## 📞 Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review the code comments in `src/` folder
- Check Week 23 materials for SQL and TypeORM tutorials
- Ask questions in your cohort's Discord channel

---

**Happy Coding! 🎉**

Project created for Week 23 - Database & SQL with PostgreSQL
