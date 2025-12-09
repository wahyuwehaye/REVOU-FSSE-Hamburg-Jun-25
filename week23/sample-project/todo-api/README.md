# 📝 Todo API - Complete Sample Project

> **Project ini mengimplementasikan semua konsep dari Week 23:**
> - ✅ Connecting NestJS with PostgreSQL
> - ✅ CRUD Operations with Raw Queries
> - ✅ Database Migrations
> - ✅ Data Seeding

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Database Setup](#database-setup)
6. [Running Migrations](#running-migrations)
7. [Seeding Data](#seeding-data)
8. [Running the App](#running-the-app)
9. [API Endpoints](#api-endpoints)
10. [Testing](#testing)
11. [Project Structure](#project-structure)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Todo API** adalah aplikasi REST API untuk task management yang dibangun dengan NestJS dan PostgreSQL. Project ini mendemonstrasikan:

- Database connection management
- Raw SQL queries dengan parameterized statements
- TypeORM migrations untuk version control schema
- Database seeding untuk test data
- CRUD operations
- Input validation dengan DTOs
- Error handling
- Security best practices

---

## 🛠️ Tech Stack

- **Framework:** NestJS 10
- **Database:** PostgreSQL 14+
- **ORM:** TypeORM 0.3.17
- **Validation:** class-validator, class-transformer
- **Environment:** dotenv (@nestjs/config)
- **Language:** TypeScript 5

---

## ✅ Prerequisites

Sebelum memulai, pastikan sudah install:

1. **Node.js** (v18 atau lebih tinggi)
   ```bash
   node --version  # Should be >= 18.x
   ```

2. **PostgreSQL** (v14 atau lebih tinggi)
   ```bash
   psql --version  # Should be >= 14.x
   ```

3. **npm** atau **yarn**
   ```bash
   npm --version  # Should be >= 9.x
   ```

---

## 📦 Installation

### Step 1: Clone atau Copy Project

```bash
# Jika di repo git
git clone <repository-url>
cd todo-api

# Atau copy folder ini ke lokasi anda
```

### Step 2: Install Dependencies

```bash
npm install
```

**Dependencies yang diinstall:**
```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/config": "^3.0.0",
  "@nestjs/typeorm": "^10.0.0",
  "typeorm": "^0.3.17",
  "pg": "^8.11.0",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.1",
  "reflect-metadata": "^0.1.13",
  "rxjs": "^7.8.1"
}
```

---

## 🗄️ Database Setup

### Step 1: Start PostgreSQL

```bash
# macOS (dengan Homebrew)
brew services start postgresql@14

# Linux (Ubuntu/Debian)
sudo systemctl start postgresql

# Windows (Service)
# Start dari Services.msc
```

### Step 2: Create Database

```bash
# Login ke PostgreSQL
psql -U postgres

# Di psql prompt:
CREATE DATABASE todo_app;

# Verify
\l

# Exit
\q
```

### Step 3: Configure Environment Variables

**Copy `.env.example` ke `.env`:**

```bash
cp .env.example .env
```

**Edit `.env` file:**

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password_here
DATABASE_NAME=todo_app

# Application
NODE_ENV=development
PORT=3000
```

⚠️ **Important:** Ganti `your_password_here` dengan password PostgreSQL Anda!

---

## 🔄 Running Migrations

Migrations sudah dibuat dan siap dijalankan:

### Step 1: Check Migration Status

```bash
npm run migration:show
```

**Output:**
```
[ ] CreateUsersTable1701234567890 (pending)
[ ] CreateTasksTable1701234598765 (pending)
[ ] AddIndexes1701234623456 (pending)
```

### Step 2: Run All Migrations

```bash
npm run migration:run
```

**Output:**
```
query: CREATE TABLE "users" ...
Migration CreateUsersTable1701234567890 has been executed successfully.

query: CREATE TABLE "tasks" ...
Migration CreateTasksTable1701234598765 has been executed successfully.

query: CREATE INDEX ...
Migration AddIndexes1701234623456 has been executed successfully.
```

### Step 3: Verify in Database

```bash
psql -U postgres todo_app

-- Check tables
\dt

-- Output:
--  Schema |    Name    | Type  |  Owner
-- --------+------------+-------+----------
--  public | migrations | table | postgres
--  public | tasks      | table | postgres
--  public | users      | table | postgres

-- Check users table structure
\d users

-- Check tasks table structure
\d tasks

-- Exit
\q
```

### Migration Commands Reference

```bash
# Show migration status
npm run migration:show

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Generate new migration from entities
npm run migration:generate src/migrations/MigrationName

# Create empty migration
npm run migration:create src/migrations/MigrationName
```

---

## 🌱 Seeding Data

### Step 1: Run All Seeds

```bash
npm run seed
```

**Output:**
```
🌱 Starting database seeding...

✅ Users seeded successfully!
   - 5 users created (1 admin, 4 regular users)

✅ Tasks seeded successfully!
   - 15 tasks created

✅ All seeds completed successfully!
```

### Step 2: Verify Seeded Data

```bash
psql -U postgres todo_app

-- Check users
SELECT id, email, full_name, role FROM users;

-- Check tasks
SELECT id, title, status, user_id FROM tasks;

\q
```

### Seeding Commands Reference

```bash
# Run all seeds
npm run seed

# Run specific seed
npm run seed:users
npm run seed:tasks

# Clear and re-seed (development only!)
npm run seed:reset
```

### Default Seed Data

**Users:**
```
Email: admin@example.com
Password: admin123
Role: admin

Email: user1@example.com
Password: user123
Role: user

Email: user2@example.com
Password: user123
Role: user
```

---

## 🚀 Running the App

### Development Mode

```bash
npm run start:dev
```

**Output:**
```
[Nest] 12345  - 12/04/2024, 10:30:15 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 12/04/2024, 10:30:15 AM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 12/04/2024, 10:30:15 AM     LOG [InstanceLoader] ConfigModule dependencies initialized
[Nest] 12345  - 12/04/2024, 10:30:15 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345  - 12/04/2024, 10:30:15 AM     LOG [InstanceLoader] UsersModule dependencies initialized
[Nest] 12345  - 12/04/2024, 10:30:15 AM     LOG [InstanceLoader] TasksModule dependencies initialized
[Nest] 12345  - 12/04/2024, 10:30:16 AM     LOG [NestApplication] Nest application successfully started
[Nest] 12345  - 12/04/2024, 10:30:16 AM     LOG Application is running on: http://localhost:3000
```

### Production Mode

```bash
# Build
npm run build

# Start production server
npm run start:prod
```

### Quick Start (Full Setup)

```bash
# Install, migrate, seed, and run - all in one!
npm run quickstart
```

---

## 📡 API Endpoints

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-12-04T10:30:00.000Z"
}
```

---

### Users API

#### 1. Create User

```http
POST /users
Content-Type: application/json

{
  "email": "newuser@example.com",
  "full_name": "New User",
  "password": "password123",
  "role": "user"
}
```

**Response (201):**
```json
{
  "id": 6,
  "email": "newuser@example.com",
  "full_name": "New User",
  "role": "user",
  "is_active": true,
  "created_at": "2024-12-04T10:30:00.000Z",
  "updated_at": "2024-12-04T10:30:00.000Z"
}
```

#### 2. Get All Users

```http
GET /users
```

**Response (200):**
```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "full_name": "Admin User",
    "role": "admin",
    "is_active": true,
    "created_at": "2024-12-04T10:00:00.000Z"
  },
  ...
]
```

#### 3. Get User by ID

```http
GET /users/1
```

**Response (200):**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "full_name": "Admin User",
  "role": "admin",
  "is_active": true,
  "created_at": "2024-12-04T10:00:00.000Z"
}
```

#### 4. Update User

```http
PATCH /users/1
Content-Type: application/json

{
  "full_name": "Updated Name",
  "is_active": false
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "full_name": "Updated Name",
  "role": "admin",
  "is_active": false,
  "updated_at": "2024-12-04T10:35:00.000Z"
}
```

#### 5. Delete User

```http
DELETE /users/1
```

**Response (200):**
```json
{
  "message": "User with ID 1 has been deleted"
}
```

---

### Tasks API

#### 1. Create Task

```http
POST /tasks
Content-Type: application/json

{
  "title": "Finish Week 23 Assignment",
  "description": "Complete all exercises and submit",
  "status": "pending",
  "priority": "high",
  "user_id": 1
}
```

**Response (201):**
```json
{
  "id": 16,
  "title": "Finish Week 23 Assignment",
  "description": "Complete all exercises and submit",
  "status": "pending",
  "priority": "high",
  "user_id": 1,
  "created_at": "2024-12-04T10:30:00.000Z",
  "updated_at": "2024-12-04T10:30:00.000Z"
}
```

#### 2. Get All Tasks

```http
GET /tasks
```

**Optional Query Parameters:**
- `?search=week` - Search in title/description
- `?status=pending` - Filter by status
- `?priority=high` - Filter by priority
- `?user_id=1` - Filter by user
- `?page=1&limit=10` - Pagination

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Task 1",
    "description": "Description",
    "status": "pending",
    "priority": "high",
    "user_id": 1,
    "created_at": "2024-12-04T10:00:00.000Z"
  },
  ...
]
```

#### 3. Get Task by ID

```http
GET /tasks/1
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Task 1",
  "description": "Description",
  "status": "pending",
  "priority": "high",
  "user_id": 1,
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "full_name": "Admin User"
  },
  "created_at": "2024-12-04T10:00:00.000Z"
}
```

#### 4. Update Task

```http
PATCH /tasks/1
Content-Type: application/json

{
  "status": "completed",
  "priority": "medium"
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Task 1",
  "status": "completed",
  "priority": "medium",
  "updated_at": "2024-12-04T10:35:00.000Z"
}
```

#### 5. Delete Task

```http
DELETE /tasks/1
```

**Response (200):**
```json
{
  "message": "Task with ID 1 has been deleted"
}
```

#### 6. Get Task Statistics

```http
GET /tasks/statistics
```

**Response (200):**
```json
{
  "total": 15,
  "pending": 5,
  "in_progress": 7,
  "completed": 3,
  "by_priority": {
    "high": 4,
    "medium": 8,
    "low": 3
  }
}
```

---

## 🧪 Testing

### Using cURL

**Test Create Task:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Testing API",
    "status": "pending",
    "priority": "high",
    "user_id": 1
  }'
```

**Test Get All Tasks:**
```bash
curl http://localhost:3000/tasks
```

**Test Search:**
```bash
curl "http://localhost:3000/tasks?search=test"
```

**Test Update:**
```bash
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

**Test Delete:**
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

### Using Postman

**Import collection:** `postman_collection.json`

1. Open Postman
2. Click "Import"
3. Select `postman_collection.json`
4. Run requests from collection

### Using Browser

```
http://localhost:3000/health
http://localhost:3000/users
http://localhost:3000/tasks
```

---

## 📁 Project Structure

```
todo-api/
├── src/
│   ├── config/
│   │   └── data-source.ts          # TypeORM DataSource config
│   ├── database/
│   │   ├── seeds/
│   │   │   ├── user.seed.ts        # User seeder
│   │   │   ├── task.seed.ts        # Task seeder
│   │   │   └── index.ts            # Main seed runner
│   │   └── factories/
│   │       └── user.factory.ts     # User factory for fake data
│   ├── migrations/
│   │   ├── 1701234567890-CreateUsersTable.ts
│   │   ├── 1701234598765-CreateTasksTable.ts
│   │   └── 1701234623456-AddIndexes.ts
│   ├── users/
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts  # Create DTO
│   │   │   └── update-user.dto.ts  # Update DTO
│   │   ├── entities/
│   │   │   └── user.entity.ts      # User entity
│   │   ├── users.controller.ts     # REST endpoints
│   │   ├── users.service.ts        # Business logic (Raw SQL)
│   │   └── users.module.ts         # Module definition
│   ├── tasks/
│   │   ├── dto/
│   │   │   ├── create-task.dto.ts
│   │   │   └── update-task.dto.ts
│   │   ├── entities/
│   │   │   └── task.entity.ts
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts        # Raw SQL CRUD operations
│   │   └── tasks.module.ts
│   ├── health/
│   │   ├── health.controller.ts    # Health check endpoint
│   │   └── health.module.ts
│   ├── app.module.ts               # Root module
│   └── main.ts                     # Application entry point
├── .env.example                    # Environment template
├── .env                            # Your local config (gitignored)
├── .gitignore
├── package.json
├── tsconfig.json
├── nest-cli.json
├── postman_collection.json         # API testing collection
└── README.md                       # This file
```

---

## 🔧 Troubleshooting

### Problem 1: Database Connection Error

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
```bash
# Check if PostgreSQL running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Start PostgreSQL
brew services start postgresql@14  # macOS
sudo systemctl start postgresql  # Linux
```

---

### Problem 2: Authentication Failed

**Error:**
```
Error: password authentication failed for user "postgres"
```

**Solution:**
```bash
# Check .env file
cat .env | grep DATABASE_PASSWORD

# Update with correct password
nano .env

# Test connection
psql -U postgres -h localhost
```

---

### Problem 3: Database Does Not Exist

**Error:**
```
Error: database "todo_app" does not exist
```

**Solution:**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE todo_app;"

# Or interactive
psql -U postgres
CREATE DATABASE todo_app;
\q
```

---

### Problem 4: Migration Already Run

**Error:**
```
Error: Migration xxx has already been run
```

**Solution:**
```bash
# Option 1: Skip (already applied)
# Do nothing - migration already complete

# Option 2: Force revert and rerun
npm run migration:revert
npm run migration:run
```

---

### Problem 5: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux

# Or use different port
# Edit .env: PORT=3001
```

---

### Problem 6: TypeORM CLI Not Found

**Error:**
```
Error: typeorm: command not found
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or run directly
npx typeorm-ts-node-commonjs -d src/config/data-source.ts migration:show
```

---

## 📚 Learning Resources

### Week 23 Materials

1. **[Connecting NestJS with Database](../materi/23-connecting-nestjs-database.md)**
   - Database connection setup
   - Environment variables
   - TypeORM configuration
   - Connection testing

2. **[CRUD with Raw Queries](../materi/24-crud-raw-queries.md)**
   - Raw SQL queries
   - Parameterized statements
   - CRUD operations
   - Security best practices

3. **[Migrations and Seeding](../materi/25-migrations-seeding.md)**
   - Database migrations
   - TypeORM CLI
   - Data seeding
   - Version control

### Code Examples

Check `src/` folder untuk melihat implementasi:
- ✅ Raw SQL queries di `*.service.ts`
- ✅ DTO validation di `dto/`
- ✅ Migrations di `migrations/`
- ✅ Seeds di `database/seeds/`

---

## 🎯 Next Steps

Setelah menjalankan project ini, coba:

1. **Tambah fitur baru:**
   - User authentication (JWT)
   - Task categories
   - Task comments
   - File uploads

2. **Improve security:**
   - Hash passwords (bcrypt)
   - API rate limiting
   - Input sanitization
   - CORS configuration

3. **Add tests:**
   - Unit tests
   - Integration tests
   - E2E tests

4. **Optimize:**
   - Query optimization
   - Caching (Redis)
   - Pagination
   - Indexing

5. **Deploy:**
   - Docker containerization
   - Deploy to cloud (Heroku, AWS, GCP)
   - CI/CD pipeline
   - Monitoring

---

## 🤝 Contributing

Ada saran atau improvement? Silakan:
1. Fork project
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📄 License

MIT License - feel free to use for learning!

---

**🎉 Selamat belajar! Happy coding!**

Need help? Check [Week 23 materials](../materi/) atau tanya di Discord/Slack!
