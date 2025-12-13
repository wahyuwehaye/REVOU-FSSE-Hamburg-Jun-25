# 🔷 Introduction to Prisma ORM

## 📋 Daftar Isi

1. [Pengantar](#pengantar)
2. [Review: Week 23 dengan TypeORM](#review-week-23)
3. [Apa itu Prisma?](#apa-itu-prisma)
4. [Setup Prisma di NestJS](#setup-prisma)
5. [Prisma Schema](#prisma-schema)
6. [Migrations dengan Prisma](#migrations)
7. [CRUD Operations](#crud-operations)
8. [Prisma Client](#prisma-client)
9. [Seeding dengan Prisma](#seeding)
10. [Best Practices](#best-practices)

---

## 📖 Pengantar

Selamat datang di Week 24! Minggu ini kita akan belajar **Prisma ORM** - next-generation ORM yang modern, type-safe, dan developer-friendly.

### 🎯 Tujuan Pembelajaran

✅ Memahami perbedaan TypeORM vs Prisma  
✅ Setup Prisma di NestJS project  
✅ Membuat Prisma schema  
✅ Generate migrations  
✅ Implement CRUD dengan Prisma Client  
✅ Seeding data dengan Prisma  
✅ Best practices untuk production  

### ⏱️ Estimasi Waktu

**Total:** 3-4 jam
- Teori & Comparison: 30 menit
- Setup: 30 menit
- Schema & Migrations: 1 jam
- CRUD Implementation: 1-1.5 jam
- Seeding: 30 menit

---

## 🔄 Review: Week 23 dengan TypeORM

### Apa yang Sudah Kita Pelajari

Di Week 23, kita menggunakan **TypeORM** dengan **raw SQL queries**:

```typescript
// Week 23: TypeORM dengan Raw SQL
@Injectable()
export class TasksService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, user_id } = createTaskDto;
    
    // Raw SQL query
    const result = await this.dataSource.query(
      `INSERT INTO tasks (title, description, user_id) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [title, description, user_id]
    );
    
    return result[0];
  }
}
```

**Characteristics Week 23:**
- ✅ Full control dengan raw SQL
- ✅ Belajar SQL fundamentals
- ❌ Manual query building
- ❌ No type safety
- ❌ Prone to SQL injection jika salah
- ❌ No auto-completion

### Progression ke Week 24

Week 24, kita upgrade ke **Prisma ORM**:

```typescript
// Week 24: Prisma ORM
@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        userId: createTaskDto.userId,
      },
    });
  }
}
```

**Benefits Week 24:**
- ✅ Type-safe queries
- ✅ Auto-completion (IntelliSense)
- ✅ Automatic migrations
- ✅ Built-in relation handling
- ✅ SQL injection prevention by default
- ✅ Modern developer experience

---

## 🤔 Apa itu Prisma?

### Definisi

**Prisma** adalah next-generation ORM (Object-Relational Mapping) yang:
- Modern & developer-friendly
- Type-safe dari database sampai aplikasi
- Auto-generates TypeScript types
- Supports PostgreSQL, MySQL, SQLite, SQL Server, MongoDB

### Analogi Sederhana

```
Manual SQL (Week 23):         Prisma (Week 24):
┌────────────────────┐       ┌────────────────────┐
│ Nulis SQL manual   │       │ Nulis schema       │
│ Build query string │  →    │ Auto-generate code │
│ Manual type check  │       │ Type-safe otomatis │
│ Error di runtime   │       │ Error di compile   │
└────────────────────┘       └────────────────────┘

Kayak:                        Kayak:
Nulis assembly code           Nulis Python
Manual gearbox                Automatic transmission
```

### Komponen Prisma

```
┌─────────────────────────────────────────────────────┐
│                  PRISMA ECOSYSTEM                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Prisma Schema (schema.prisma)                  │
│     └─ Define database structure                   │
│                                                     │
│  2. Prisma CLI                                      │
│     ├─ prisma init                                  │
│     ├─ prisma migrate dev                           │
│     ├─ prisma generate                              │
│     └─ prisma studio                                │
│                                                     │
│  3. Prisma Client                                   │
│     └─ Type-safe database client                    │
│                                                     │
│  4. Prisma Studio                                   │
│     └─ Visual database browser                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### TypeORM vs Prisma

| Feature | TypeORM | Prisma |
|---------|---------|--------|
| **Type Safety** | Decorators + manual types | Auto-generated types |
| **Schema Definition** | TypeScript classes | Prisma Schema Language |
| **Migrations** | Manual or auto-sync | Automatic |
| **Query API** | Repository pattern | Fluent API |
| **Relations** | Manual decorators | Automatic |
| **Auto-completion** | Limited | Excellent |
| **Learning Curve** | Steeper | Gentler |
| **Raw SQL** | Easy | Possible |
| **Performance** | Good | Excellent |
| **Community** | Large (older) | Growing (newer) |

**When to use TypeORM:**
- Need direct SQL control
- Complex legacy database
- Team familiar with decorators

**When to use Prisma:**
- New projects (recommended)
- Need type safety
- Want modern DX (Developer Experience)
- Fast development

---

## 🛠️ Setup Prisma di NestJS

### Step 1: Install Prisma

```bash
# Install Prisma CLI as dev dependency
npm install -D prisma

# Install Prisma Client
npm install @prisma/client

# Verify installation
npx prisma --version
```

**Output:**
```
prisma                  : 5.7.0
@prisma/client          : 5.7.0
```

### Step 2: Initialize Prisma

```bash
# Initialize Prisma
npx prisma init

# Creates:
# - prisma/schema.prisma
# - .env (if doesn't exist)
```

**Output:**
```
✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database
2. Run prisma db pull to turn your database schema into a Prisma schema
3. Run prisma generate to generate the Prisma Client
```

**File structure after init:**
```
your-project/
├── prisma/
│   └── schema.prisma    # ← Created!
├── .env                 # ← Updated!
└── ...
```

### Step 3: Configure Database URL

**Edit `.env` file:**

```env
# PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/blog_db?schema=public"

# Format breakdown:
# postgresql://     Protocol
# postgres          Username
# :password         Password
# @localhost        Host
# :5432            Port
# /blog_db         Database name
# ?schema=public   Schema (optional, default: public)
```

**For other databases:**

```env
# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/mydb"

# SQLite
DATABASE_URL="file:./dev.db"

# SQL Server
DATABASE_URL="sqlserver://localhost:1433;database=mydb;user=sa;password=password"
```

### Step 4: Create Prisma Module

**Generate module:**

```bash
nest g module prisma
nest g service prisma
```

**Edit `src/prisma/prisma.service.ts`:**

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  
  async onModuleInit() {
    // Connect to database when module initializes
    await this.$connect();
    console.log('✅ Prisma connected to database');
  }

  async onModuleDestroy() {
    // Disconnect when module destroys
    await this.$disconnect();
    console.log('🔌 Prisma disconnected from database');
  }
}
```

**📝 Penjelasan:**

```typescript
// extends PrismaClient
// Inherit semua Prisma Client methods (create, findMany, etc.)

// implements OnModuleInit
// Hook yang dipanggil saat module di-initialize

async onModuleInit() {
  await this.$connect();
  // Connect ke database saat app start
}

// implements OnModuleDestroy
// Hook yang dipanggil saat module di-destroy

async onModuleDestroy() {
  await this.$disconnect();
  // Disconnect saat app shutdown (graceful shutdown)
}
```

**Edit `src/prisma/prisma.module.ts`:**

```typescript
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  // ← Make PrismaService available globally
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

**📝 Penjelasan:**

```typescript
@Global()
// Decorator supaya PrismaService bisa dipakai di semua module
// Tanpa perlu import PrismaModule di tiap module

exports: [PrismaService]
// Export service supaya bisa di-inject di module lain
```

### Step 5: Import ke App Module

**Edit `src/app.module.ts`:**

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,  // ← Add this
    // ... other modules
  ],
})
export class AppModule {}
```

---

## 📝 Prisma Schema

### Schema File Structure

**File:** `prisma/schema.prisma`

```prisma
// Prisma Schema Language (PSL)

// 1. Generator - How to generate Prisma Client
generator client {
  provider = "prisma-client-js"
}

// 2. Datasource - Database connection
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 3. Models - Database tables
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Model Definition Syntax

```prisma
model ModelName {
  fieldName  Type  @attribute1 @attribute2
  //   │       │         │          │
  //   │       │         │          └─ Additional attributes
  //   │       │         └─ Primary attribute
  //   │       └─ Data type
  //   └─ Field name
}
```

### Data Types

**Scalar Types:**

```prisma
model Example {
  // Numbers
  id        Int       // Integer
  bigNum    BigInt    // Large integer
  price     Float     // Floating point
  precise   Decimal   // High precision decimal
  
  // Text
  name      String    // Variable length
  content   String    @db.Text  // Long text
  
  // Boolean
  active    Boolean
  
  // Date/Time
  createdAt DateTime
  
  // JSON (PostgreSQL)
  metadata  Json
  
  // Bytes
  avatar    Bytes
}
```

**Type Modifiers:**

```prisma
model Example {
  required  String      // Required (NOT NULL)
  optional  String?     // Optional (NULL allowed)
  list      String[]    // Array/List
}
```

### Field Attributes

**Common attributes:**

```prisma
model User {
  // Primary Key
  id        Int      @id @default(autoincrement())
  
  // Unique
  email     String   @unique
  
  // Default values
  role      String   @default("user")
  createdAt DateTime @default(now())
  
  // Auto-update on change
  updatedAt DateTime @updatedAt
  
  // Custom database column name
  fullName  String   @map("full_name")
  
  // Index for performance
  username  String   @unique
  @@index([email, username])
}
```

**📝 Penjelasan Attributes:**

```prisma
@id
// Mark sebagai primary key

@default(autoincrement())
// Auto-increment untuk id

@unique
// Ensure nilai unique di database

@default("value")
// Default value jika tidak diisi

@default(now())
// Default ke timestamp sekarang

@updatedAt
// Auto-update ke timestamp sekarang saat record di-update

@map("column_name")
// Custom nama column di database

@@index([field1, field2])
// Create index untuk query performance
```

### Block-level Attributes

```prisma
model User {
  id    Int    @id
  email String
  name  String
  
  // Composite primary key
  @@id([email, name])
  
  // Composite unique constraint
  @@unique([email, name])
  
  // Multiple indexes
  @@index([email])
  @@index([name])
  
  // Custom table name
  @@map("users")
}
```

### Complete Example: Blog Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  role      String   @default("user")
  bio       String?  // Optional field
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations (we'll learn in next material)
  posts     Post[]
  comments  Comment[]
  
  @@map("users")  // Table name in database
}

model Post {
  id          Int      @id @default(autoincrement())
  title       String
  content     String   @db.Text
  published   Boolean  @default(false)
  slug        String   @unique
  viewCount   Int      @default(0)
  authorId    Int
  categoryId  Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  author      User      @relation(fields: [authorId], references: [id])
  category    Category? @relation(fields: [categoryId], references: [id])
  comments    Comment[]
  tags        TagsOnPosts[]
  
  @@index([authorId])
  @@index([categoryId])
  @@map("posts")
}

model Category {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  slug        String   @unique
  description String?
  createdAt   DateTime @default(now())
  
  posts       Post[]
  
  @@map("categories")
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  postId    Int
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  author    User     @relation(fields: [authorId], references: [id])
  
  @@index([postId])
  @@index([authorId])
  @@map("comments")
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  slug  String @unique
  
  posts TagsOnPosts[]
  
  @@map("tags")
}

// Many-to-Many join table
model TagsOnPosts {
  postId Int
  tagId  Int
  
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([postId, tagId])
  @@map("tags_on_posts")
}
```

---

## 🔄 Migrations dengan Prisma

### Migration Workflow

```
1. Define schema         prisma/schema.prisma
   │
   ▼
2. Create migration      npx prisma migrate dev --name init
   │
   ├─ Generate SQL       prisma/migrations/xxx_init/migration.sql
   │
   └─ Apply to DB        Execute SQL on database
   │
   ▼
3. Generate Client       Prisma Client updated with types
   │
   ▼
4. Use in code           Type-safe database access
```

### Create Initial Migration

```bash
# Create and apply migration
npx prisma migrate dev --name init
```

**What happens:**

1. **Generates SQL migration:**
```
prisma/migrations/
└── 20241209120000_init/
    └── migration.sql
```

2. **migration.sql content:**
```sql
-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "bio" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateTable
CREATE TABLE "posts" (
    -- ... similar structure
);

-- CreateTable
CREATE TABLE "categories" (
    -- ...
);

-- Add foreign keys
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" 
  FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

3. **Applies to database**
4. **Generates Prisma Client** with types

**Output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "blog_db"

Applying migration `20241209120000_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20241209120000_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (5.7.0) to ./node_modules/@prisma/client
```

### Add More Migrations

**Scenario:** Add `viewCount` field to Post

**Step 1: Update schema**

```prisma
model Post {
  id          Int      @id @default(autoincrement())
  title       String
  viewCount   Int      @default(0)  // ← Added this
  // ... rest
}
```

**Step 2: Create migration**

```bash
npx prisma migrate dev --name add_view_count
```

**Generated SQL:**

```sql
-- AlterTable
ALTER TABLE "posts" ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0;
```

### Migration Commands

```bash
# Development: Create and apply migration
npx prisma migrate dev --name migration_name

# Production: Apply pending migrations
npx prisma migrate deploy

# Reset database (WARNING: Deletes all data!)
npx prisma migrate reset

# Check migration status
npx prisma migrate status

# Generate Prisma Client without migration
npx prisma generate
```

### Migration Best Practices

✅ **DO:**
```bash
# Descriptive migration names
npx prisma migrate dev --name add_user_profile
npx prisma migrate dev --name create_posts_table
npx prisma migrate dev --name add_post_categories
```

❌ **DON'T:**
```bash
# Vague names
npx prisma migrate dev --name update
npx prisma migrate dev --name fix
npx prisma migrate dev --name test
```

✅ **DO:**
- Commit migration files to git
- Test migrations before production
- Have backups before migrate deploy

❌ **DON'T:**
- Edit migration files manually (unless you know what you're doing)
- Skip migrations in production
- Delete migration history

---

## 💾 CRUD Operations

### Generate Prisma Client

After migration, generate client:

```bash
npx prisma generate
```

This creates type-safe client in `node_modules/@prisma/client`.

### Example: Users Module

**Step 1: Create DTO**

**File:** `src/users/dto/create-user.dto.ts`

```typescript
import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
```

**File:** `src/users/dto/update-user.dto.ts`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

**Step 2: Service with Prisma**

**File:** `src/users/users.service.ts`

```typescript
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(createUserDto: CreateUserDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Create user
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: createUserDto.password, // TODO: Hash in production!
        bio: createUserDto.bio,
        avatar: createUserDto.avatar,
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        role: true,
        createdAt: true,
        // password: false  // Exclude password
      },
    });
  }

  // READ ALL
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        role: true,
        createdAt: true,
        // Don't return password
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // READ ONE
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // READ BY EMAIL
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  // UPDATE
  async update(id: number, updateUserDto: UpdateUserDto) {
    // Check if user exists
    await this.findOne(id);

    // If updating email, check if new email is unique
    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already taken');
      }
    }

    // Update user
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  // DELETE
  async remove(id: number) {
    // Check if user exists
    await this.findOne(id);

    // Delete user
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with ID ${id} has been deleted` };
  }

  // SEARCH
  async search(keyword: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { email: { contains: keyword, mode: 'insensitive' } },
          { bio: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        role: true,
      },
    });
  }
}
```

**📝 Penjelasan Prisma Client Methods:**

```typescript
// CREATE
prisma.user.create({
  data: { ... }  // Data to insert
})

// READ ALL
prisma.user.findMany({
  where: { ... },      // Filter conditions
  select: { ... },     // Fields to return
  include: { ... },    // Relations to include
  orderBy: { ... },    // Sorting
  take: 10,           // Limit
  skip: 0,            // Offset
})

// READ ONE
prisma.user.findUnique({
  where: { id: 1 }    // Must be unique field
})

prisma.user.findFirst({
  where: { ... }       // Any condition, returns first match
})

// UPDATE
prisma.user.update({
  where: { id: 1 },
  data: { name: 'New Name' }
})

// DELETE
prisma.user.delete({
  where: { id: 1 }
})

// COUNT
prisma.user.count({
  where: { role: 'admin' }
})
```

**Step 3: Controller**

**File:** `src/users/users.controller.ts`

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    if (search) {
      return this.usersService.search(search);
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
```

**Step 4: Module**

**File:** `src/users/users.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],  // Export if needed by other modules
})
export class UsersModule {}
```

---

## 🌱 Seeding dengan Prisma

### Setup Seeding

**Step 1: Create seed file**

**File:** `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Seed Users
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'admin123', // TODO: Hash in production
      role: 'admin',
      bio: 'System administrator',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      password: 'password123',
      bio: 'Software developer',
    },
  });

  console.log('✅ Users seeded:', { user1, user2 });

  // Seed Categories
  const category1 = await prisma.category.upsert({
    where: { slug: 'technology' },
    update: {},
    create: {
      name: 'Technology',
      slug: 'technology',
      description: 'Tech articles and tutorials',
    },
  });

  const category2 = await prisma.category.upsert({
    where: { slug: 'programming' },
    update: {},
    create: {
      name: 'Programming',
      slug: 'programming',
      description: 'Programming tips and tricks',
    },
  });

  console.log('✅ Categories seeded:', { category1, category2 });

  // Seed Posts (with relations)
  const post1 = await prisma.post.create({
    data: {
      title: 'Introduction to Prisma',
      content: 'Prisma is a next-generation ORM...',
      slug: 'introduction-to-prisma',
      published: true,
      author: {
        connect: { id: user1.id },
      },
      category: {
        connect: { id: category1.id },
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'NestJS Best Practices',
      content: 'Learn best practices for NestJS...',
      slug: 'nestjs-best-practices',
      published: true,
      author: {
        connect: { id: user2.id },
      },
      category: {
        connect: { id: category2.id },
      },
    },
  });

  console.log('✅ Posts seeded:', { post1, post2 });

  // Seed Tags
  const tag1 = await prisma.tag.upsert({
    where: { slug: 'typescript' },
    update: {},
    create: {
      name: 'TypeScript',
      slug: 'typescript',
    },
  });

  const tag2 = await prisma.tag.upsert({
    where: { slug: 'orm' },
    update: {},
    create: {
      name: 'ORM',
      slug: 'orm',
    },
  });

  // Connect tags to posts (many-to-many)
  await prisma.tagsOnPosts.createMany({
    data: [
      { postId: post1.id, tagId: tag1.id },
      { postId: post1.id, tagId: tag2.id },
      { postId: post2.id, tagId: tag1.id },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Tags seeded and connected to posts');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Step 2: Add seed script to package.json**

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
  "scripts": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

**Step 3: Install ts-node**

```bash
npm install -D ts-node
```

**Step 4: Run seed**

```bash
# Manual seed
npm run seed

# Or seed after migration
npx prisma migrate reset  # Reset DB + seed
npx prisma db seed        # Seed only
```

---

## 🎯 Best Practices

### 1. Always Use `select` or `include`

✅ **Good:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    email: true,
    name: true,
    // Don't return password
  },
});
```

❌ **Bad:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  // Returns ALL fields including password!
});
```

### 2. Use Transactions for Multiple Operations

```typescript
async transferFunds(fromId: number, toId: number, amount: number) {
  return this.prisma.$transaction(async (prisma) => {
    // Deduct from sender
    await prisma.account.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } },
    });

    // Add to receiver
    await prisma.account.update({
      where: { id: toId },
      data: { balance: { increment: amount } },
    });

    return { success: true };
  });
}
```

### 3. Handle Errors Properly

```typescript
async create(createUserDto: CreateUserDto) {
  try {
    return await this.prisma.user.create({
      data: createUserDto,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      throw new ConflictException('Email already exists');
    }
    throw error;
  }
}
```

**Common Prisma Error Codes:**
- `P2002`: Unique constraint failed
- `P2025`: Record not found
- `P2003`: Foreign key constraint failed
- `P2016`: Query interpretation error

### 4. Use Environment-Specific Schemas

```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// .env.development
DATABASE_URL="postgresql://localhost:5432/blog_dev"

// .env.production
DATABASE_URL="postgresql://prod-server:5432/blog_prod"
```

### 5. Enable Query Logging in Development

```typescript
// src/prisma/prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    });
  }
  
  // ...
}
```

---

## 📚 Kesimpulan

### Yang Sudah Dipelajari

✅ Setup Prisma di NestJS  
✅ Membuat Prisma schema  
✅ Generate migrations  
✅ Implement CRUD dengan Prisma Client  
✅ Seeding data  
✅ Best practices  

### Prisma Workflow Summary

```
1. Define Schema       schema.prisma
   ↓
2. Create Migration    npx prisma migrate dev
   ↓
3. Generate Client     (automatic)
   ↓
4. Use in Code         Type-safe queries
   ↓
5. Seed Data          npm run seed
```

### Key Benefits

✅ **Type Safety** - Catch errors at compile time  
✅ **Auto-completion** - IntelliSense everywhere  
✅ **Simple API** - Easy to learn and use  
✅ **Migrations** - Automatic database versioning  
✅ **Performance** - Optimized queries  

---

**🎉 Selamat! Anda sudah menguasai Prisma basics!**

**📖 Next:** Material 2 - Database Relations dengan Prisma (One-to-One, One-to-Many, Many-to-Many, JOINs)
