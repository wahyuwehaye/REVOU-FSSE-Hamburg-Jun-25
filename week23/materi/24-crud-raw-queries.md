# 🔍 CRUD Operations dengan Raw SQL Queries

## 📋 Daftar Isi

1. [Pengantar](#pengantar)
2. [Apa itu Raw Queries?](#apa-itu-raw-queries)
3. [Setup Awal](#setup-awal)
4. [CREATE - Insert Data](#create---insert-data)
5. [READ - Select Data](#read---select-data)
6. [UPDATE - Modify Data](#update---modify-data)
7. [DELETE - Remove Data](#delete---remove-data)
8. [Advanced Queries](#advanced-queries)
9. [Security & Best Practices](#security--best-practices)
10. [ORM vs Raw Queries](#orm-vs-raw-queries)

---

## 📖 Pengantar

Setelah berhasil menghubungkan NestJS dengan PostgreSQL, sekarang kita akan belajar **CRUD Operations** - operasi dasar untuk manipulasi data.

### 🎯 Tujuan Pembelajaran

✅ Memahami apa itu CRUD operations  
✅ Menulis raw SQL queries di NestJS  
✅ Implement CREATE (INSERT)  
✅ Implement READ (SELECT)  
✅ Implement UPDATE  
✅ Implement DELETE  
✅ Handle SQL injection  
✅ Best practices untuk raw queries  

### ⏱️ Estimasi Waktu

**Total:** 3-4 jam
- Teori: 45 menit
- Praktik: 2-2.5 jam
- Exercise: 30-45 menit

---

## 🤔 Apa itu Raw Queries?

### Analogi Sederhana

**Raw Query = Berbicara Langsung ke Database**

```
┌─────────────────┐                    ┌──────────────────┐
│   NestJS App    │   SQL Query        │    PostgreSQL    │
│                 │ ══════════════════►│                  │
│ "SELECT * FROM  │                    │  "Oke, ini       │
│  users"         │                    │   datanya..."    │
└─────────────────┘                    └──────────────────┘
```

**2 Cara Berkomunikasi dengan Database:**

**1. Raw Queries (SQL Langsung):**
```typescript
// Tulis SQL manual
await connection.query('SELECT * FROM users WHERE id = $1', [userId]);
```

**2. ORM (Object-Relational Mapping):**
```typescript
// Pakai method JavaScript
await userRepository.findOne({ where: { id: userId } });
```

### Kapan Pakai Raw Queries?

✅ **Gunakan Raw Queries ketika:**
- Query sangat kompleks (multiple JOINs, subqueries)
- Perlu performance optimal
- Pakai PostgreSQL-specific features
- Migrasi dari project lama yang pakai SQL

❌ **Hindari Raw Queries ketika:**
- Query sederhana (CRUD basic)
- Project besar dengan banyak entity
- Ingin type safety dari TypeScript
- Team belum mahir SQL

### CRUD Operations Explained

```
┌──────────────────────────────────────────────────────────┐
│                    CRUD OPERATIONS                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  C = CREATE   →  Tambah data baru      (INSERT)         │
│  R = READ     →  Baca/ambil data       (SELECT)         │
│  U = UPDATE   →  Ubah data yang ada    (UPDATE)         │
│  D = DELETE   →  Hapus data            (DELETE)         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Contoh Real-World:**

| Operation | Aplikasi | SQL |
|-----------|----------|-----|
| CREATE | Daftar akun baru | INSERT INTO users ... |
| READ | Lihat profil user | SELECT * FROM users ... |
| UPDATE | Edit email | UPDATE users SET email ... |
| DELETE | Hapus akun | DELETE FROM users ... |

---

## 🛠️ Setup Awal

### Step 1: Buat Table di PostgreSQL

Kita akan buat aplikasi **Todo List** sederhana.

**Connect ke database:**

```bash
psql todo_app
```

**Create table:**

```sql
-- Buat table tasks
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Verify table created
\dt

-- Describe table structure
\d tasks

-- Exit
\q
```

**Penjelasan SQL:**

```sql
-- SERIAL = Auto-increment integer
id SERIAL PRIMARY KEY,
-- Setiap task punya ID unik: 1, 2, 3, 4...

-- VARCHAR(255) = Text dengan max 255 karakter
title VARCHAR(255) NOT NULL,
-- NOT NULL = Wajib diisi

-- TEXT = Text panjang tanpa limit
description TEXT,
-- Boleh kosong (NULL)

-- DEFAULT 'pending' = Nilai default jika tidak diisi
status VARCHAR(50) DEFAULT 'pending',
-- Possible values: pending, in_progress, completed

-- TIMESTAMP = Waktu lengkap (tanggal + jam)
created_at TIMESTAMP DEFAULT NOW(),
-- NOW() = Waktu saat ini otomatis
```

### Step 2: Generate Module, Controller, Service

```bash
# Generate tasks module
nest g module tasks
nest g controller tasks
nest g service tasks
```

**Struktur yang terbuat:**

```
src/
├── tasks/
│   ├── tasks.module.ts
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   └── tasks.service.spec.ts
```

### Step 3: Create DTOs (Data Transfer Objects)

**Buat `src/tasks/dto/create-task.dto.ts`:**

```typescript
import { IsString, IsOptional, IsIn, Length } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'in_progress', 'completed'])
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;
}
```

**Buat `src/tasks/dto/update-task.dto.ts`:**

```typescript
import { IsString, IsOptional, IsIn, Length } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'in_progress', 'completed'])
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;
}
```

**📝 Penjelasan Decorators:**

```typescript
// @IsString() - Harus berupa text
@IsString()
title: string;

// @Length(min, max) - Panjang karakter
@Length(1, 255)  // Minimal 1, maksimal 255 karakter

// @IsOptional() - Boleh tidak diisi
@IsOptional()
description?: string;  // ? = optional

// @IsIn([...]) - Harus salah satu dari list
@IsIn(['low', 'medium', 'high'])
priority?: string;  // Hanya boleh: low, medium, atau high
```

### Step 4: Create Interface

**Buat `src/tasks/interfaces/task.interface.ts`:**

```typescript
export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  created_at: Date;
  updated_at: Date;
}
```

---

## ➕ CREATE - Insert Data

### Concept

**INSERT = Tambah data baru ke table**

```
Before:                          After:
┌─────────────────┐             ┌─────────────────┐
│ tasks (empty)   │   INSERT    │ tasks           │
│                 │  ═══════►   │ ├─ Task 1       │
│                 │             │ └─ Task 2       │
└─────────────────┘             └─────────────────┘
```

### Implementation

**Edit `src/tasks/tasks.service.ts`:**

```typescript
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './interfaces/task.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectConnection()
    private connection: Connection,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, status, priority } = createTaskDto;

    try {
      // SQL Query dengan RETURNING untuk dapat data yang baru dibuat
      const query = `
        INSERT INTO tasks (title, description, status, priority)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const values = [
        title,
        description || null,
        status || 'pending',
        priority || 'medium',
      ];

      const result = await this.connection.query(query, values);

      return result[0]; // Return task yang baru dibuat
    } catch (error) {
      console.error('Error creating task:', error);
      throw new InternalServerErrorException('Failed to create task');
    }
  }
}
```

**📝 Penjelasan Detail:**

```typescript
// 1. Inject Connection
@InjectConnection()
private connection: Connection,
// Ini untuk akses database connection

// 2. SQL Query
const query = `
  INSERT INTO tasks (title, description, status, priority)
  VALUES ($1, $2, $3, $4)
  RETURNING *
`;
// $1, $2, $3, $4 = Placeholder untuk values
// RETURNING * = Return data yang baru diinsert

// 3. Values array
const values = [title, description, status, priority];
// Index 0 → $1
// Index 1 → $2
// Index 2 → $3
// Index 3 → $4

// 4. Execute query
const result = await this.connection.query(query, values);
// connection.query(sql, parameters)

// 5. Return first row
return result[0];
// result adalah array: [{ id: 1, title: '...', ... }]
```

**Kenapa Pakai $1, $2, $3?**

❌ **BAHAYA - SQL Injection:**
```typescript
// ❌ Vulnerable!
const query = `INSERT INTO tasks (title) VALUES ('${title}')`;
// User input: '); DROP TABLE tasks; --
// Result: Data hilang semua!
```

✅ **AMAN - Parameterized Query:**
```typescript
// ✅ Safe!
const query = `INSERT INTO tasks (title) VALUES ($1)`;
const values = [title];
// PostgreSQL automatically escapes input
```

### Controller Endpoint

**Edit `src/tasks/tasks.controller.ts`:**

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }
}
```

### Testing CREATE

```bash
# Start app
npm run start:dev

# Test dengan cURL
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Belajar NestJS",
    "description": "Setup database dan CRUD",
    "status": "in_progress",
    "priority": "high"
  }'

# Expected response:
{
  "id": 1,
  "title": "Belajar NestJS",
  "description": "Setup database dan CRUD",
  "status": "in_progress",
  "priority": "high",
  "created_at": "2024-12-04T10:30:00.000Z",
  "updated_at": "2024-12-04T10:30:00.000Z"
}
```

**Verify di PostgreSQL:**

```bash
psql todo_app

SELECT * FROM tasks;

# Output:
# id |     title      |        description         |    status    | priority
#----+----------------+----------------------------+--------------+----------
#  1 | Belajar NestJS | Setup database dan CRUD    | in_progress  | high

\q
```

---

## 📖 READ - Select Data

### Concept

**SELECT = Ambil/baca data dari table**

```
┌─────────────────────────┐
│ tasks                   │
│ ├─ Task 1: "Belajar"    │  SELECT
│ ├─ Task 2: "Coding"     │  ═══════►  Return: Task 1, 2, 3
│ └─ Task 3: "Deploy"     │
└─────────────────────────┘
```

### Implementation - Get All Tasks

**Add to `tasks.service.ts`:**

```typescript
async findAll(): Promise<Task[]> {
  try {
    const query = `
      SELECT * FROM tasks
      ORDER BY created_at DESC
    `;

    const result = await this.connection.query(query);
    return result;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new InternalServerErrorException('Failed to fetch tasks');
  }
}
```

**📝 Penjelasan:**

```sql
SELECT * FROM tasks
-- * = Semua kolom
-- FROM tasks = Dari table tasks

ORDER BY created_at DESC
-- ORDER BY = Urutkan berdasarkan
-- created_at = Kolom waktu dibuat
-- DESC = Descending (terbaru dulu)
-- ASC = Ascending (terlama dulu)
```

### Implementation - Get One Task by ID

**Add to `tasks.service.ts`:**

```typescript
import { NotFoundException } from '@nestjs/common';

async findOne(id: number): Promise<Task> {
  try {
    const query = `
      SELECT * FROM tasks
      WHERE id = $1
    `;

    const result = await this.connection.query(query, [id]);

    if (result.length === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return result[0];
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    console.error('Error fetching task:', error);
    throw new InternalServerErrorException('Failed to fetch task');
  }
}
```

**📝 Penjelasan:**

```sql
WHERE id = $1
-- WHERE = Filter kondisi
-- id = $1 = Cari task dengan ID tertentu
```

```typescript
if (result.length === 0) {
  throw new NotFoundException(`Task with ID ${id} not found`);
}
// Jika tidak ada data, throw error 404
```

### Implementation - Search Tasks

**Add to `tasks.service.ts`:**

```typescript
async search(keyword: string): Promise<Task[]> {
  try {
    const query = `
      SELECT * FROM tasks
      WHERE 
        title ILIKE $1 OR 
        description ILIKE $1
      ORDER BY created_at DESC
    `;

    const searchPattern = `%${keyword}%`;
    const result = await this.connection.query(query, [searchPattern]);

    return result;
  } catch (error) {
    console.error('Error searching tasks:', error);
    throw new InternalServerErrorException('Failed to search tasks');
  }
}
```

**📝 Penjelasan:**

```sql
ILIKE $1
-- ILIKE = Case-insensitive LIKE
-- 'nestjs' akan match: 'NestJS', 'nestjs', 'NESTJS'

WHERE title ILIKE $1 OR description ILIKE $1
-- OR = Salah satu kondisi benar
-- Cari di title ATAU description
```

```typescript
const searchPattern = `%${keyword}%`;
// % = Wildcard (anything)
// %nestjs% = "nestjs" di mana saja
// Examples:
//   "Belajar NestJS" ✅ match
//   "nestjs tutorial" ✅ match
//   "Setup nest.js" ✅ match
```

### Implementation - Filter by Status

**Add to `tasks.service.ts`:**

```typescript
async findByStatus(status: string): Promise<Task[]> {
  try {
    const query = `
      SELECT * FROM tasks
      WHERE status = $1
      ORDER BY priority DESC, created_at DESC
    `;

    const result = await this.connection.query(query, [status]);
    return result;
  } catch (error) {
    console.error('Error filtering tasks:', error);
    throw new InternalServerErrorException('Failed to filter tasks');
  }
}
```

**📝 Penjelasan:**

```sql
ORDER BY priority DESC, created_at DESC
-- Multiple sorting:
-- 1. Sort by priority first (high, medium, low)
-- 2. Then by date (newest first)
```

### Controller Endpoints

**Update `tasks.controller.ts`:**

```typescript
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAll(@Query('search') search?: string) {
    if (search) {
      return this.tasksService.search(search);
    }
    return this.tasksService.findAll();
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string) {
    return this.tasksService.findByStatus(status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(parseInt(id, 10));
  }
}
```

**📝 Penjelasan Decorators:**

```typescript
// @Query() - Query parameters (?key=value)
@Get()
findAll(@Query('search') search?: string)
// URL: /tasks?search=nestjs
// search = 'nestjs'

// @Param() - URL parameters (/:param)
@Get(':id')
findOne(@Param('id') id: string)
// URL: /tasks/5
// id = '5'
```

### Testing READ

```bash
# Test 1: Get all tasks
curl http://localhost:3000/tasks

# Test 2: Get task by ID
curl http://localhost:3000/tasks/1

# Test 3: Search tasks
curl http://localhost:3000/tasks?search=belajar

# Test 4: Filter by status
curl http://localhost:3000/tasks/status/pending
```

---

## ✏️ UPDATE - Modify Data

### Concept

**UPDATE = Ubah data yang sudah ada**

```
Before:                          After:
┌─────────────────┐             ┌─────────────────┐
│ Task 1          │   UPDATE    │ Task 1          │
│ status: pending │  ═══════►   │ status: done ✅ │
└─────────────────┘             └─────────────────┘
```

### Implementation

**Add to `tasks.service.ts`:**

```typescript
import { UpdateTaskDto } from './dto/update-task.dto';

async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
  try {
    // Check if task exists
    await this.findOne(id);

    // Build dynamic UPDATE query
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updateTaskDto.title !== undefined) {
      fields.push(`title = $${paramIndex}`);
      values.push(updateTaskDto.title);
      paramIndex++;
    }

    if (updateTaskDto.description !== undefined) {
      fields.push(`description = $${paramIndex}`);
      values.push(updateTaskDto.description);
      paramIndex++;
    }

    if (updateTaskDto.status !== undefined) {
      fields.push(`status = $${paramIndex}`);
      values.push(updateTaskDto.status);
      paramIndex++;
    }

    if (updateTaskDto.priority !== undefined) {
      fields.push(`priority = $${paramIndex}`);
      values.push(updateTaskDto.priority);
      paramIndex++;
    }

    // Always update updated_at
    fields.push(`updated_at = NOW()`);

    if (fields.length === 1) {
      // Only updated_at, no changes
      return this.findOne(id);
    }

    // Add ID as last parameter
    values.push(id);

    const query = `
      UPDATE tasks
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await this.connection.query(query, values);
    return result[0];
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    console.error('Error updating task:', error);
    throw new InternalServerErrorException('Failed to update task');
  }
}
```

**📝 Penjelasan Detail:**

```typescript
// 1. Check if task exists first
await this.findOne(id);
// Throw 404 if not found

// 2. Build dynamic query
const fields = [];
const values = [];
// Kita build query sesuai field yang diupdate

// 3. Example flow:
// Input: { title: "New Title", status: "done" }
// 
// Iteration 1 (title):
//   fields = ["title = $1"]
//   values = ["New Title"]
//   paramIndex = 2
//
// Iteration 2 (status):
//   fields = ["title = $1", "status = $2"]
//   values = ["New Title", "done"]
//   paramIndex = 3

// 4. Join fields
fields.join(', ')
// Result: "title = $1, status = $2"

// 5. Final query:
UPDATE tasks
SET title = $1, status = $2, updated_at = NOW()
WHERE id = $3
RETURNING *
```

**Kenapa Pakai Dynamic Query?**

```typescript
// ❌ Bad - Update semua field (even if not provided)
UPDATE tasks
SET 
  title = $1,
  description = $2,
  status = $3,
  priority = $4
WHERE id = $5

// Problem: Harus kirim semua field setiap kali update

// ✅ Good - Update only provided fields
UPDATE tasks
SET title = $1, status = $2  -- Only 2 fields
WHERE id = $3

// Benefit: Lebih flexible, bisa partial update
```

### Controller Endpoint

**Update `tasks.controller.ts`:**

```typescript
import { Patch } from '@nestjs/common';

@Patch(':id')
async update(
  @Param('id') id: string,
  @Body() updateTaskDto: UpdateTaskDto,
) {
  return this.tasksService.update(parseInt(id, 10), updateTaskDto);
}
```

**📝 Penjelasan:**

```typescript
@Patch(':id')
// PATCH = Partial update (sebagian field)
// vs PUT = Full update (semua field)

// RESTful best practice:
// PATCH = Update beberapa field
// PUT = Replace seluruh resource
```

### Testing UPDATE

```bash
# Update title dan status
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Belajar NestJS - Updated",
    "status": "completed"
  }'

# Update only status
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Update priority
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"priority": "low"}'
```

**Verify di PostgreSQL:**

```sql
SELECT * FROM tasks WHERE id = 1;

-- Check updated_at changed
```

---

## 🗑️ DELETE - Remove Data

### Concept

**DELETE = Hapus data dari table**

```
Before:                          After:
┌─────────────────┐             ┌─────────────────┐
│ tasks           │             │ tasks           │
│ ├─ Task 1       │   DELETE    │ ├─ Task 2       │
│ ├─ Task 2       │  ═══════►   │ └─ Task 3       │
│ └─ Task 3       │             │                 │
└─────────────────┘             └─────────────────┘
                                  Task 1 deleted ✅
```

### Implementation

**Add to `tasks.service.ts`:**

```typescript
async remove(id: number): Promise<{ message: string }> {
  try {
    // Check if task exists
    await this.findOne(id);

    const query = `
      DELETE FROM tasks
      WHERE id = $1
    `;

    await this.connection.query(query, [id]);

    return {
      message: `Task with ID ${id} has been deleted`,
    };
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    console.error('Error deleting task:', error);
    throw new InternalServerErrorException('Failed to delete task');
  }
}
```

**📝 Penjelasan:**

```sql
DELETE FROM tasks
WHERE id = $1
-- Hapus row dimana id = parameter
```

```typescript
await this.findOne(id);
// Check dulu apakah task ada
// Jika tidak ada, throw 404

return { message: '...' };
// DELETE tidak return data
// Return confirmation message saja
```

### Implementation - Bulk Delete

**Add to `tasks.service.ts`:**

```typescript
async removeByStatus(status: string): Promise<{ message: string; count: number }> {
  try {
    const query = `
      DELETE FROM tasks
      WHERE status = $1
      RETURNING id
    `;

    const result = await this.connection.query(query, [status]);

    return {
      message: `Deleted ${result.length} tasks with status: ${status}`,
      count: result.length,
    };
  } catch (error) {
    console.error('Error bulk deleting tasks:', error);
    throw new InternalServerErrorException('Failed to delete tasks');
  }
}
```

**📝 Penjelasan:**

```sql
DELETE FROM tasks
WHERE status = $1
RETURNING id
-- RETURNING id untuk hitung berapa yang dihapus
```

### Controller Endpoints

**Update `tasks.controller.ts`:**

```typescript
import { Delete } from '@nestjs/common';

@Delete(':id')
async remove(@Param('id') id: string) {
  return this.tasksService.remove(parseInt(id, 10));
}

@Delete('status/:status/bulk')
async removeByStatus(@Param('status') status: string) {
  return this.tasksService.removeByStatus(status);
}
```

### Testing DELETE

```bash
# Delete single task
curl -X DELETE http://localhost:3000/tasks/1

# Response:
{
  "message": "Task with ID 1 has been deleted"
}

# Bulk delete by status
curl -X DELETE http://localhost:3000/tasks/status/completed/bulk

# Response:
{
  "message": "Deleted 3 tasks with status: completed",
  "count": 3
}
```

**Verify di PostgreSQL:**

```sql
SELECT * FROM tasks;
-- Task yang dihapus tidak muncul lagi
```

---

## 🚀 Advanced Queries

### Pagination

```typescript
async findAllPaginated(page: number = 1, limit: number = 10) {
  try {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = 'SELECT COUNT(*) FROM tasks';
    const countResult = await this.connection.query(countQuery);
    const total = parseInt(countResult[0].count, 10);

    // Get paginated data
    const query = `
      SELECT * FROM tasks
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const tasks = await this.connection.query(query, [limit, offset]);

    return {
      data: tasks,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error with pagination:', error);
    throw new InternalServerErrorException('Failed to fetch paginated tasks');
  }
}
```

**📝 Penjelasan:**

```sql
LIMIT $1 OFFSET $2
-- LIMIT = Berapa banyak data
-- OFFSET = Skip berapa data

-- Example: Page 2, Limit 10
-- OFFSET = (2-1) * 10 = 10
-- Skip 10 data pertama, ambil 10 berikutnya
```

### Aggregation

```typescript
async getStatistics() {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_tasks,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_tasks,
        COUNT(*) FILTER (WHERE priority = 'high') as high_priority_tasks
      FROM tasks
    `;

    const result = await this.connection.query(query);
    return result[0];
  } catch (error) {
    console.error('Error getting statistics:', error);
    throw new InternalServerErrorException('Failed to get statistics');
  }
}
```

**📝 Penjelasan:**

```sql
COUNT(*) FILTER (WHERE status = 'completed')
-- COUNT dengan kondisi
-- Hitung hanya row yang status = 'completed'
```

### Transaction

```typescript
async createMultipleTasks(tasks: CreateTaskDto[]) {
  const queryRunner = this.connection.createQueryRunner();
  
  try {
    // Start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const results = [];

    for (const task of tasks) {
      const query = `
        INSERT INTO tasks (title, description, status, priority)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const values = [
        task.title,
        task.description || null,
        task.status || 'pending',
        task.priority || 'medium',
      ];

      const result = await queryRunner.query(query, values);
      results.push(result[0]);
    }

    // Commit if all success
    await queryRunner.commitTransaction();
    return results;

  } catch (error) {
    // Rollback if error
    await queryRunner.rollbackTransaction();
    console.error('Error creating multiple tasks:', error);
    throw new InternalServerErrorException('Failed to create tasks');
  } finally {
    // Release connection
    await queryRunner.release();
  }
}
```

**📝 Penjelasan Transaction:**

```
┌─────────────────────────────────────────┐
│           TRANSACTION                   │
├─────────────────────────────────────────┤
│                                         │
│  BEGIN                                  │
│    ├─ INSERT task 1 ✅                 │
│    ├─ INSERT task 2 ✅                 │
│    └─ INSERT task 3 ❌ ERROR!          │
│  ROLLBACK (undo all)                    │
│                                         │
│  Result: Tidak ada data yang tersimpan  │
│                                         │
└─────────────────────────────────────────┘

All or nothing! Semua berhasil atau semua dibatalkan.
```

---

## 🔒 Security & Best Practices

### 1. Always Use Parameterized Queries

❌ **VULNERABLE:**
```typescript
// SQL Injection attack!
const query = `SELECT * FROM tasks WHERE id = ${id}`;
await this.connection.query(query);
```

✅ **SAFE:**
```typescript
const query = `SELECT * FROM tasks WHERE id = $1`;
await this.connection.query(query, [id]);
```

### 2. Validate Input

```typescript
import { IsString, IsInt, Min } from 'class-validator';

export class GetTaskDto {
  @IsInt()
  @Min(1)
  id: number;
}
```

### 3. Handle Errors Properly

```typescript
try {
  // Database operation
} catch (error) {
  // Log error (for developers)
  console.error('Database error:', error);
  
  // Return user-friendly message
  throw new InternalServerErrorException('Failed to process request');
}
```

### 4. Use Transactions for Multiple Operations

```typescript
// ✅ Use transaction untuk operasi multiple yang dependent
await queryRunner.startTransaction();
try {
  await queryRunner.query(query1, values1);
  await queryRunner.query(query2, values2);
  await queryRunner.commitTransaction();
} catch {
  await queryRunner.rollbackTransaction();
}
```

### 5. Limit Query Results

```typescript
// ✅ Always use LIMIT untuk prevent memory issues
const query = `
  SELECT * FROM tasks
  LIMIT 100  -- Jangan ambil unlimited
`;
```

### 6. Index Important Columns

```sql
-- Create index for faster queries
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

---

## 🆚 ORM vs Raw Queries

### Comparison

| Aspect | Raw Queries | ORM (TypeORM) |
|--------|-------------|---------------|
| **Learning Curve** | Need SQL knowledge | Easier for beginners |
| **Type Safety** | No TypeScript types | Full TypeScript support |
| **Performance** | Faster (optimized SQL) | Slightly slower |
| **Complex Queries** | Full control | Limited by ORM |
| **Maintenance** | More code | Less code |
| **SQL Injection** | Manual protection | Automatic protection |
| **Database Switch** | Rewrite queries | Minimal changes |

### When to Use Each?

**Use Raw Queries when:**
- ✅ Need maximum performance
- ✅ Complex queries (multiple JOINs, subqueries)
- ✅ Database-specific features
- ✅ Working with existing SQL

**Use ORM when:**
- ✅ Simple CRUD operations
- ✅ Want type safety
- ✅ Need quick development
- ✅ Team less familiar with SQL

### Example Comparison

**Raw Query:**
```typescript
const query = `
  SELECT t.*, COUNT(c.id) as comment_count
  FROM tasks t
  LEFT JOIN comments c ON c.task_id = t.id
  WHERE t.status = $1
  GROUP BY t.id
  HAVING COUNT(c.id) > $2
`;
const result = await connection.query(query, ['pending', 5]);
```

**ORM (TypeORM):**
```typescript
const result = await taskRepository
  .createQueryBuilder('task')
  .leftJoinAndSelect('task.comments', 'comment')
  .where('task.status = :status', { status: 'pending' })
  .groupBy('task.id')
  .having('COUNT(comment.id) > :count', { count: 5 })
  .getMany();
```

### Best Practice: Hybrid Approach

```typescript
// Simple operations: Use ORM
const task = await taskRepository.findOne({ where: { id } });

// Complex queries: Use Raw SQL
const stats = await connection.query(`
  SELECT status, COUNT(*), AVG(priority_score)
  FROM tasks
  WHERE created_at > NOW() - INTERVAL '30 days'
  GROUP BY status
`);
```

---

## 📚 Kesimpulan

### Yang Sudah Dipelajari

✅ Konsep CRUD operations  
✅ CREATE - INSERT data baru  
✅ READ - SELECT data (all, one, search, filter)  
✅ UPDATE - Modify data  
✅ DELETE - Remove data  
✅ Advanced queries (pagination, aggregation, transactions)  
✅ Security best practices  
✅ SQL injection prevention  
✅ Error handling  
✅ ORM vs Raw Queries comparison  

### Complete CRUD Checklist

```
☑️ Table tasks created
☑️ DTOs created (Create, Update)
☑️ Service methods:
   ☑️ create()
   ☑️ findAll()
   ☑️ findOne()
   ☑️ search()
   ☑️ findByStatus()
   ☑️ update()
   ☑️ remove()
☑️ Controller endpoints:
   ☑️ POST /tasks
   ☑️ GET /tasks
   ☑️ GET /tasks/:id
   ☑️ GET /tasks?search=keyword
   ☑️ GET /tasks/status/:status
   ☑️ PATCH /tasks/:id
   ☑️ DELETE /tasks/:id
☑️ All tested with cURL/Postman
```

### API Endpoints Summary

```
┌──────────────────────────────────────────────────────┐
│                  TASKS API                           │
├──────────────────────────────────────────────────────┤
│                                                      │
│  POST   /tasks                    Create new task   │
│  GET    /tasks                    Get all tasks     │
│  GET    /tasks?search=keyword     Search tasks      │
│  GET    /tasks/status/:status     Filter by status  │
│  GET    /tasks/:id                Get single task   │
│  PATCH  /tasks/:id                Update task       │
│  DELETE /tasks/:id                Delete task       │
│  DELETE /tasks/status/:status/bulk  Bulk delete    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Next Steps

Sekarang kita akan belajar:

1. 🔄 **Migrations** - Version control untuk database schema
2. 🌱 **Seeding** - Insert data awal untuk testing

---

📖 **Next:** [25-migrations-seeding.md](./25-migrations-seeding.md)
