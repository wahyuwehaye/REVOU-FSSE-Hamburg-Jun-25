# 🎓 Week 22 Live Demo Session Guide

**Project:** Task Management API - Complete Implementation  
**Duration:** 4 sessions × 3 hours = 12 hours  
**Approach:** Build one project incrementally, introducing concepts step-by-step

---

## 🎯 Demo Project Overview

Kita akan membangun **Task Management API** dari nol, step by step, sambil menjelaskan semua konsep Week 22:

### Final Project Features:
- ✅ User registration & authentication (JWT)
- ✅ Create, read, update, delete tasks
- ✅ Assign tasks to users
- ✅ Task categories and priorities
- ✅ File attachments for tasks
- ✅ Activity logging
- ✅ Rate limiting & security
- ✅ Complete validation with DTOs
- ✅ Custom pipes for data transformation
- ✅ Middleware for logging & auth
- ✅ Dependency Injection patterns
- ✅ Deployed to production

### Tech Stack:
- NestJS 10+
- TypeScript
- PostgreSQL + TypeORM
- JWT Authentication
- class-validator
- bcrypt
- Postman for testing

---

## 📅 Session 1: Foundation & DTOs (3 hours)

**Topics:** Project setup, Basic DTOs, Validation Pipes

### Hour 1: Project Setup & Understanding (60 min)

#### Step 1: Explain What We're Building (10 min)

**Say to Students:**
> "Hari ini kita akan mulai membangun Task Management API. Bayangkan seperti Trello atau Todoist yang simplified. Kita akan belajar semua konsep advanced NestJS sambil membangun aplikasi nyata."

**Show on Board:**
```
┌──────────────────────────────────────┐
│     Task Management API              │
├──────────────────────────────────────┤
│                                      │
│  Users                               │
│  ├── Register                        │
│  ├── Login                           │
│  └── Profile                         │
│                                      │
│  Tasks                               │
│  ├── Create task                     │
│  ├── View tasks                      │
│  ├── Update task                     │
│  ├── Delete task                     │
│  └── Assign to user                  │
│                                      │
│  Categories                          │
│  └── Organize tasks                  │
│                                      │
└──────────────────────────────────────┘
```

**Explain Key Concepts:**
> "Sepanjang demo ini, kita akan belajar:
> 1. **DTOs** - Untuk validate input dari user
> 2. **Pipes** - Untuk transform data (misalnya, lowercase email)
> 3. **Middleware** - Untuk logging setiap request
> 4. **DI** - Supaya code kita modular dan testable
> 5. **Deployment** - Deploy ke Render supaya bisa diakses publik"

#### Step 2: Create NestJS Project (15 min)

**Live Coding:**

```bash
# 1. Install NestJS CLI
npm install -g @nestjs/cli

# 2. Create new project
nest new task-management-api

# Choose npm
# Wait for installation...
```

**Explain While Installing:**
> "NestJS CLI akan generate project structure untuk kita. Ini mirip seperti `create-react-app` tapi untuk backend. Struktur foldernya sudah best practice."

**Show Generated Structure:**
```
task-management-api/
├── src/
│   ├── app.controller.ts      ← Handle HTTP requests
│   ├── app.service.ts          ← Business logic
│   ├── app.module.ts           ← Register everything
│   └── main.ts                 ← Entry point
├── test/
├── package.json
└── tsconfig.json
```

**Explain Each File:**
```typescript
// main.ts - Starting point
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
```

> "Ini seperti `index.js` di Node.js biasa. File pertama yang dijalankan."

```typescript
// app.module.ts - Module utama
@Module({
  imports: [],       // Module lain yang kita pakai
  controllers: [],   // Handle HTTP requests
  providers: [],     // Services (business logic)
})
```

> "Module ini seperti 'lemari' yang organize semua components kita. Semua controller dan service harus di-register disini."

#### Step 3: Run & Test Basic App (10 min)

**Live Coding:**
```bash
cd task-management-api
npm run start:dev
```

**Show in Browser:**
```
http://localhost:3000
# Should show: "Hello World!"
```

**Explain:**
> "Sekarang aplikasi kita sudah running! `start:dev` artinya development mode - setiap kali kita save file, akan auto-restart."

**Open Postman:**
```
GET http://localhost:3000
```

**Explain Postman:**
> "Postman adalah tool untuk testing API. Seperti browser, tapi khusus untuk API. Nanti semua endpoint kita akan ditest disini."

#### Step 4: Setup Database (25 min)

**Explain Database:**
> "Kita butuh database untuk nyimpen data tasks. Kita pakai PostgreSQL karena:
> - Production-ready
> - Support relational data
> - Free tier di Render"

**Option 1: Local PostgreSQL**

```bash
# Install PostgreSQL (if not installed)
# macOS:
brew install postgresql@14
brew services start postgresql@14

# Create database
psql -U postgres
CREATE DATABASE task_management_db;
\q
```

**Option 2: Use Render (Recommended for Students)**

> "Kalau susah install PostgreSQL locally, kita bisa pakai Render free tier. Saya akan demo pakai local dulu, tapi kalian bisa pakai Render."

**Install Dependencies:**
```bash
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/config
npm install class-validator class-transformer
```

**Explain Each Package:**
> - `@nestjs/typeorm` - Integration NestJS dengan TypeORM
> - `typeorm` - ORM untuk interact dengan database
> - `pg` - PostgreSQL driver
> - `@nestjs/config` - Untuk manage environment variables
> - `class-validator` - Untuk validasi DTOs
> - `class-transformer` - Untuk transform data

**Create .env File:**
```bash
# .env
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=task_management_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

**⚠️ Important - Create .gitignore:**
```bash
# .gitignore (should already exist, but add .env if not there)
.env
node_modules
dist
```

**Explain .env:**
> "File .env untuk nyimpen configuration yang sensitive. JANGAN PERNAH commit file ini ke Git! Setiap environment (dev, staging, production) punya .env sendiri."

---

### Hour 2: First Module - Users & DTOs (60 min)

#### Step 5: Create Users Module (15 min)

**Explain Module Concept:**
> "NestJS organize code dalam 'modules'. Satu module = satu feature. Misalnya, semua yang berhubungan dengan Users ada di Users Module."

**Generate Module:**
```bash
nest generate module users
nest generate controller users
nest generate service users
```

**Show What's Generated:**
```
src/
└── users/
    ├── users.controller.ts
    ├── users.service.ts
    └── users.module.ts
```

**Explain Each File:**

```typescript
// users.module.ts
@Module({
  controllers: [UsersController],  // Handle HTTP requests
  providers: [UsersService],        // Business logic
})
export class UsersModule {}
```

> "Module ini adalah 'package' untuk semua fitur Users. Controller handle requests, Service handle logic."

```typescript
// users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  // Endpoints will be here
}
```

> "Controller ini seperti 'receptionist'. Terima request dari client, terus kirim ke service untuk diproses."

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  // Business logic here
}
```

> "Service ini yang melakukan 'pekerjaan berat'. Semua logic bisnis ada disini. @Injectable() artinya bisa di-inject ke class lain (Dependency Injection)."

#### Step 6: Understanding DTOs (20 min)

**Explain DTO Concept:**
> "DTO = Data Transfer Object. Bayangkan DTO seperti 'form' dengan validation rules. Sebelum data masuk ke database, harus lewat form ini dulu untuk dicek valid atau tidak."

**Draw Diagram:**
```
Client (Postman)
    │
    │ { email, password, name }
    ▼
┌─────────────────┐
│   Controller    │ ← Receive request
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│      DTO        │ ← Validate data
│  - Is email valid?
│  - Is password strong?
│  - Is name provided?
└────────┬────────┘
         │
         ▼ (if valid)
┌─────────────────┐
│    Service      │ ← Process data
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Database      │ ← Save data
└─────────────────┘
```

**Create DTOs Folder:**
```bash
mkdir src/users/dto
```

**Create RegisterDto:**

```typescript
// src/users/dto/register.dto.ts
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email harus valid' })
  email: string;

  @IsString({ message: 'Password harus berupa string' })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;

  @IsString({ message: 'Name harus berupa string' })
  @MinLength(2, { message: 'Name minimal 2 karakter' })
  @MaxLength(50, { message: 'Name maksimal 50 karakter' })
  name: string;
}
```

**Explain Line by Line:**

```typescript
@IsEmail({}, { message: 'Email harus valid' })
email: string;
```
> "Decorator @IsEmail() akan check apakah email valid. Kalau tidak, muncul error message yang kita define. Ini seperti HTML input type='email' tapi di backend."

```typescript
@MinLength(8, { message: 'Password minimal 8 karakter' })
password: string;
```
> "Password harus minimal 8 karakter. Ini security basic - password pendek mudah di-hack."

**Show Without Validation:**
```typescript
// JANGAN SEPERTI INI ❌
async register(email: any, password: any, name: any) {
  // Bagaimana kalau email tidak valid?
  // Bagaimana kalau password kosong?
  // Bagaimana kalau name adalah object, bukan string?
  // Tanpa validation, database bisa rusak!
}
```

**Show With Validation:**
```typescript
// LEBIH BAIK SEPERTI INI ✅
async register(registerDto: RegisterDto) {
  // Data sudah pasti valid!
  // email: valid email format
  // password: minimal 8 karakter
  // name: string 2-50 karakter
}
```

#### Step 7: Create User Entity (15 min)

**Explain Entity:**
> "Entity adalah representasi tabel database dalam TypeScript. Setiap property adalah column di database."

**Create Entity:**
```typescript
// src/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

**Explain Each Decorator:**

```typescript
@Entity('users')
```
> "Ini akan create table dengan nama 'users' di database."

```typescript
@PrimaryGeneratedColumn()
id: number;
```
> "Primary key - unique identifier untuk setiap user. Auto-increment (1, 2, 3, ...)."

```typescript
@Column({ unique: true })
email: string;
```
> "Column untuk email. 'unique: true' artinya tidak boleh ada 2 user dengan email sama."

```typescript
@CreateDateColumn()
createdAt: Date;
```
> "Otomatis isi dengan timestamp saat user dibuat. Tidak perlu kita set manual."

**Show DTO vs Entity Comparison:**

```typescript
// DTO - Data dari client (input)
class RegisterDto {
  email: string;      // User input
  password: string;   // User input (plain text)
  name: string;       // User input
}

// Entity - Data di database (output)
class User {
  id: number;           // Auto-generated
  email: string;        // From DTO
  password: string;     // Hashed! (not plain text)
  name: string;         // From DTO
  createdAt: Date;      // Auto-generated
}
```

> "DTO adalah data yang masuk, Entity adalah data yang disimpan. Password di DTO adalah plain text, tapi di Entity harus di-hash untuk security!"

#### Step 8: Setup TypeORM Module (10 min)

**Configure Database Module:**

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make .env available everywhere
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-create tables (DEV ONLY!)
    }),
    UsersModule,
  ],
})
export class AppModule {}
```

**⚠️ Important Explanation:**

```typescript
synchronize: true, // DEV ONLY!
```
> "synchronize: true akan otomatis create/update tables setiap kali kita jalankan app. HANYA untuk development! Di production, pakai migrations."

**Update Users Module:**

```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Make available to other modules
})
export class UsersModule {}
```

**Explain:**
> "TypeOrmModule.forFeature([User]) membuat Repository untuk User entity. Repository adalah tool untuk interact dengan database (save, find, update, delete)."

---

### Hour 3: Validation Pipes & First Endpoint (60 min)

#### Step 9: Enable Global Validation Pipe (10 min)

**Explain Validation Pipe:**
> "ValidationPipe adalah 'security guard' yang check semua data yang masuk. Kalau ada data invalid, langsung ditolak sebelum masuk ke controller."

**Setup Global Pipe:**

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,              // Strip properties not in DTO
    forbidNonWhitelisted: true,   // Throw error if extra properties
    transform: true,              // Transform payloads to DTO instances
  }));
  
  await app.listen(3000);
}
bootstrap();
```

**Explain Each Option:**

```typescript
whitelist: true,
```
> "Kalau client kirim extra properties yang tidak ada di DTO, otomatis dihapus. Contoh: kalau client kirim 'isAdmin: true' tapi tidak ada di DTO, akan di-strip."

```typescript
forbidNonWhitelisted: true,
```
> "Kalau ada extra properties, throw error. Lebih strict dari whitelist. Bagus untuk security."

```typescript
transform: true,
```
> "Otomatis convert types. Contoh: '123' (string) jadi 123 (number)."

#### Step 10: Create Register Endpoint (25 min)

**Install bcrypt for Password Hashing:**
```bash
npm install bcrypt
npm install -D @types/bcrypt
```

**Explain Password Hashing:**
> "JANGAN PERNAH simpan password plain text di database! Kita harus hash dulu. Hashing adalah one-way encryption - tidak bisa di-decrypt kembali."

**Show Visual:**
```
Plain Password: "mypassword123"
                    ↓
               [bcrypt hash]
                    ↓
Hashed: "$2b$10$abcd...xyz"  ← This is stored in database
```

**Implement Users Service:**

```typescript
// src/users/users.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = this.usersRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
    });

    // Save to database
    return await this.usersRepository.save(user);
  }
}
```

**Explain Step by Step:**

```typescript
@InjectRepository(User)
private usersRepository: Repository<User>,
```
> "Ini Dependency Injection! Repository di-inject otomatis oleh NestJS. Kita tidak perlu create instance manually. Ini membuat code testable dan modular."

```typescript
const existingUser = await this.usersRepository.findOne({
  where: { email: registerDto.email },
});
```
> "Check apakah email sudah terdaftar. findOne() adalah method dari TypeORM untuk cari 1 record."

```typescript
if (existingUser) {
  throw new ConflictException('Email already registered');
}
```
> "Kalau email sudah ada, throw error dengan status code 409 (Conflict). NestJS akan otomatis format jadi JSON response."

```typescript
const hashedPassword = await bcrypt.hash(registerDto.password, 10);
```
> "Hash password dengan bcrypt. Angka 10 adalah 'salt rounds' - makin besar makin secure tapi makin lambat. 10 adalah sweet spot."

**Implement Controller:**

```typescript
// src/users/users.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.usersService.register(registerDto);
    
    // Don't send password in response!
    const { password, ...result } = user;
    return result;
  }
}
```

**Explain:**

```typescript
@Post('register')
```
> "Ini create endpoint POST /users/register"

```typescript
@Body() registerDto: RegisterDto
```
> "Ambil data dari request body. ValidationPipe akan otomatis validate sesuai RegisterDto rules!"

```typescript
const { password, ...result } = user;
```
> "Remove password dari response. JANGAN PERNAH kirim password (even hashed) ke client!"

#### Step 11: Test Register Endpoint (25 min)

**Test with Postman:**

**Test Case 1: Valid Registration**
```
POST http://localhost:3000/users/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Expected Response:**
```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Explain:**
> "Status code 201 (Created) - berhasil! Notice password tidak ada di response. Data sudah tersimpan di database."

**Test Case 2: Invalid Email**
```json
{
  "email": "not-an-email",
  "password": "password123",
  "name": "John Doe"
}
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": ["Email harus valid"],
  "error": "Bad Request"
}
```

**Explain:**
> "Validation pipe bekerja! Email tidak valid, langsung di-reject dengan error message yang kita tulis di DTO."

**Test Case 3: Password Too Short**
```json
{
  "email": "john@example.com",
  "password": "short",
  "name": "John Doe"
}
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": ["Password minimal 8 karakter"],
  "error": "Bad Request"
}
```

**Test Case 4: Missing Field**
```json
{
  "email": "john@example.com",
  "password": "password123"
  // name is missing
}
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": ["Name harus berupa string"],
  "error": "Bad Request"
}
```

**Test Case 5: Extra Field (with forbidNonWhitelisted)**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe",
  "isAdmin": true
}
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": ["property isAdmin should not exist"],
  "error": "Bad Request"
}
```

**Explain:**
> "forbidNonWhitelisted bekerja! Client coba inject 'isAdmin' tapi di-reject. Ini security feature penting!"

**Test Case 6: Duplicate Email**
```json
{
  "email": "john@example.com",  // Same email as Test Case 1
  "password": "password456",
  "name": "John Smith"
}
```

**Expected Response:**
```json
{
  "statusCode": 409,
  "message": "Email already registered",
  "error": "Conflict"
}
```

**Explain:**
> "Email sudah terdaftar, dapat error 409 Conflict. Logic di service bekerja!"

**Check Database:**
```bash
psql -U postgres -d task_management_db
SELECT * FROM users;
```

**Show Result:**
```
 id |      email        |         password          |   name    |      createdat
----+-------------------+---------------------------+-----------+---------------------
  1 | john@example.com  | $2b$10$abcd...xyz        | John Doe  | 2024-01-15 10:30:00
```

**Explain:**
> "Password ter-hash dengan aman! Tidak ada yang bisa tau password aslinya."

---

### Session 1 Recap (5 min)

**What We Learned:**

1. ✅ **Project Setup** - Install NestJS, setup structure
2. ✅ **Database Setup** - PostgreSQL + TypeORM
3. ✅ **DTOs** - Validate input data with decorators
4. ✅ **Entities** - Represent database tables
5. ✅ **Validation Pipe** - Automatic validation
6. ✅ **Service** - Business logic (check duplicates, hash password)
7. ✅ **Controller** - Handle HTTP requests
8. ✅ **Dependency Injection** - Inject repository to service
9. ✅ **Testing** - Test with Postman

**Homework for Students:**
1. Create LoginDto with email and password validation
2. Try different validation decorators (@IsString, @MaxLength, etc.)
3. Test all validation scenarios in Postman
4. Read about bcrypt and password security

**Next Session Preview:**
> "Session berikutnya kita akan tambahkan:
> - Custom Pipes untuk transform data
> - Login endpoint dengan JWT authentication
> - Tasks CRUD dengan advanced DTOs
> - Semuanya masih di project yang sama!"

---

## 📝 Session 1 Student Handout

**Summary - What We Built:**
- ✅ Task Management API project structure
- ✅ PostgreSQL database connection
- ✅ Users module with registration
- ✅ DTO validation for data security
- ✅ Password hashing with bcrypt
- ✅ Error handling for duplicates

**Key Concepts:**
- **DTO**: Validate input before processing
- **Entity**: Represent database tables
- **Validation Pipe**: Automatic input validation
- **Dependency Injection**: Services inject repositories
- **Repository Pattern**: Abstract database operations

**Commands to Remember:**
```bash
# Generate module
nest generate module <name>

# Generate controller
nest generate controller <name>

# Generate service
nest generate service <name>

# Run in dev mode
npm run start:dev
```

**Next Session:** Custom Pipes, JWT Authentication, and Tasks Module

---

## 📅 Session 2: Custom Pipes & Authentication (3 hours)

**Topics:** Custom transformation pipes, JWT authentication, Login system

### Hour 1: Understanding & Creating Custom Pipes (60 min)

#### Step 12: What Are Pipes? (10 min)

**Explain Pipe Concept:**
> "Pipes itu seperti 'conveyor belt' di pabrik. Data masuk dari satu sisi, di-transform di tengah, keluar dalam bentuk baru di sisi lain."

**Draw Diagram:**
```
Client Input          PIPE              Processed Data
    │              [Transform]              │
    ▼                  │                    ▼
"JOHN@EXAMPLE.COM" → Lowercase → "john@example.com"
"  password123  "  → Trim      → "password123"
"Hello World"      → Slugify   → "hello-world"
```

**Show Built-in Pipes vs Custom Pipes:**

```typescript
// Built-in Pipes (provided by NestJS)
ValidationPipe    // Validate DTOs
ParseIntPipe      // Convert string to number
ParseBoolPipe     // Convert string to boolean
ParseArrayPipe    // Convert string to array

// Custom Pipes (we create ourselves)
LowercasePipe     // Convert to lowercase
TrimPipe          // Remove whitespace
SlugifyPipe       // Convert to URL-friendly slug
HashPasswordPipe  // Hash passwords
```

**Real-World Examples:**

```typescript
// Example 1: Email always lowercase
Input:  "John@EXAMPLE.COM"
Pipe:   LowercasePipe
Output: "john@example.com"

// Example 2: Remove spaces from password
Input:  "  password123  "
Pipe:   TrimPipe
Output: "password123"

// Example 3: Create slug for task title
Input:  "My Important Task"
Pipe:   SlugifyPipe
Output: "my-important-task"
```

#### Step 13: Create TrimPipe (15 min)

**Create Common Pipes Folder:**
```bash
mkdir -p src/common/pipes
```

**Create TrimPipe:**

```typescript
// src/common/pipes/trim.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Only trim strings
    if (typeof value === 'string') {
      return value.trim();
    }
    
    // If object, trim all string properties
    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach(key => {
        if (typeof value[key] === 'string') {
          value[key] = value[key].trim();
        }
      });
    }
    
    return value;
  }
}
```

**Explain Line by Line:**

```typescript
@Injectable()
export class TrimPipe implements PipeTransform {
```
> "@Injectable() membuat pipe ini bisa di-inject. implements PipeTransform adalah contract yang harus diikuti semua pipes."

```typescript
transform(value: any, metadata: ArgumentMetadata) {
```
> "Method transform() dipanggil otomatis. 'value' adalah data yang masuk, 'metadata' adalah informasi tentang parameter."

```typescript
if (typeof value === 'string') {
  return value.trim();
}
```
> "Kalau value adalah string, langsung trim. Contoh: '  hello  ' jadi 'hello'"

```typescript
if (typeof value === 'object' && value !== null) {
  Object.keys(value).forEach(key => {
    if (typeof value[key] === 'string') {
      value[key] = value[key].trim();
    }
  });
}
```
> "Kalau value adalah object (seperti DTO), loop semua properties dan trim yang string."

**Test TrimPipe:**

```typescript
// src/users/users.controller.ts
import { TrimPipe } from '../common/pipes/trim.pipe';

@Post('register')
async register(@Body(TrimPipe) registerDto: RegisterDto) {
  // registerDto.email dan registerDto.name sudah di-trim!
  const user = await this.usersService.register(registerDto);
  const { password, ...result } = user;
  return result;
}
```

**Test in Postman:**
```json
POST /users/register

{
  "email": "  jane@example.com  ",
  "password": "  password123  ",
  "name": "  Jane Doe  "
}
```

**Show in Console:**
```typescript
// Before TrimPipe:
{
  email: "  jane@example.com  ",
  password: "  password123  ",
  name: "  Jane Doe  "
}

// After TrimPipe:
{
  email: "jane@example.com",
  password: "password123",
  name: "Jane Doe"
}
```

**Explain Benefit:**
> "Sekarang kita tidak perlu worry tentang extra spaces! Pipe handle semua. User bisa typo dengan space, tapi data yang masuk database sudah clean."

#### Step 14: Create LowercasePipe for Email (15 min)

**Why Lowercase Email?**
> "Email tidak case-sensitive. john@example.com = JOHN@EXAMPLE.COM = John@Example.Com. Tapi di database, mereka akan dianggap beda! Kita lowercase semua supaya konsisten."

**Create LowercasePipe:**

```typescript
// src/common/pipes/lowercase.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class LowercasePipe implements PipeTransform {
  private field: string;

  constructor(field: string) {
    this.field = field;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'object' && value !== null && this.field) {
      if (value[this.field] && typeof value[this.field] === 'string') {
        value[this.field] = value[this.field].toLowerCase();
      }
    }
    
    return value;
  }
}
```

**Explain Constructor:**
```typescript
constructor(field: string) {
  this.field = field;
}
```
> "Ini pipe yang bisa dikonfigurasi! Kita pass field name yang mau di-lowercase. Flexible!"

**Use in Controller:**

```typescript
// src/users/users.controller.ts
@Post('register')
async register(
  @Body(new TrimPipe(), new LowercasePipe('email')) registerDto: RegisterDto
) {
  const user = await this.usersService.register(registerDto);
  const { password, ...result } = user;
  return result;
}
```

**Explain Pipe Chaining:**
> "Pipes bisa di-chain! Data lewat TrimPipe dulu, terus LowercasePipe. Seperti filter air - lewat filter pertama, terus filter kedua."

**Visual Flow:**
```
Input: "  JOHN@EXAMPLE.COM  "
          ↓
      [TrimPipe]
          ↓
   "JOHN@EXAMPLE.COM"
          ↓
  [LowercasePipe]
          ↓
   "john@example.com"
```

#### Step 15: Create SlugifyPipe for Tasks (20 min)

**Explain Slug:**
> "Slug adalah versi URL-friendly dari text. Contoh: 'My Important Task' → 'my-important-task'. Dipakai untuk URL, filenames, atau IDs yang readable."

**Install slugify package:**
```bash
npm install slugify
```

**Create SlugifyPipe:**

```typescript
// src/common/pipes/slugify.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export class SlugifyPipe implements PipeTransform {
  private field: string;

  constructor(field: string) {
    this.field = field;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'object' && value !== null && this.field) {
      const originalValue = value[this.field];
      
      if (originalValue && typeof originalValue === 'string') {
        // Generate slug
        const slug = slugify(originalValue, {
          lower: true,      // Convert to lowercase
          strict: true,     // Remove special characters
          trim: true        // Trim whitespace
        });
        
        // Add slug field (keep original too)
        value[`${this.field}Slug`] = slug;
      }
    }
    
    return value;
  }
}
```

**Explain slugify options:**
```typescript
slugify(originalValue, {
  lower: true,      // "My Task" → "my-task"
  strict: true,     // Remove !@#$%^&*()
  trim: true        // Remove leading/trailing spaces
})
```

**Example Transformations:**
```typescript
"My Important Task"        → "my-important-task"
"Fix Bug #123"             → "fix-bug-123"
"User's Profile & Settings" → "users-profile-settings"
"   Extra   Spaces   "     → "extra-spaces"
```

**We'll use this later for Tasks module!**

---

### Hour 2: JWT Authentication (60 min)

#### Step 16: Understanding JWT (15 min)

**Explain Authentication Flow:**

```
┌─────────────────────────────────────────────────┐
│           Traditional Session Auth              │
├─────────────────────────────────────────────────┤
│  1. User login                                  │
│  2. Server create session, store in memory      │
│  3. Server send session ID to client (cookie)   │
│  4. Client send session ID on each request      │
│  5. Server check session in memory              │
│                                                  │
│  Problem: Hard to scale (need shared memory)    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              JWT Token Auth                     │
├─────────────────────────────────────────────────┤
│  1. User login                                  │
│  2. Server create JWT token (signed)            │
│  3. Server send token to client                 │
│  4. Client send token on each request (header)  │
│  5. Server verify token signature               │
│                                                  │
│  Benefit: Stateless! No need to store sessions  │
└─────────────────────────────────────────────────┘
```

**JWT Structure:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

├─────── Header ────────┤├──────── Payload ────────┤├──── Signature ────┤
```

**Decode JWT (show at jwt.io):**

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "1",
  "email": "john@example.com",
  "iat": 1516239022,
  "exp": 1516242622
}
```

**Signature:**
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

**Explain Each Part:**
> - **Header**: Algorithm yang dipakai (HS256 = HMAC SHA256)
> - **Payload**: Data user (ID, email, roles, etc.)
> - **Signature**: Proof bahwa token tidak di-tamper

**Security:**
> "Token bisa di-decode oleh siapa saja (it's just base64). Tapi hanya server yang bisa VERIFY signature karena hanya server yang punya secret key. Kalau ada orang ubah payload, signature akan invalid!"

#### Step 17: Install JWT Dependencies (5 min)

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install -D @types/passport-jwt
```

**Explain Packages:**
> - `@nestjs/jwt` - JWT integration untuk NestJS
> - `@nestjs/passport` - Passport integration untuk NestJS
> - `passport` - Authentication middleware
> - `passport-jwt` - Passport strategy untuk JWT

#### Step 18: Create Auth Module (40 min)

**Generate Auth Module:**
```bash
nest generate module auth
nest generate service auth
nest generate controller auth
```

**Create LoginDto:**

```typescript
// src/auth/dto/login.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email harus valid' })
  email: string;

  @IsString({ message: 'Password harus berupa string' })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;
}
```

**Configure JWT Module:**

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

**Explain JWT Configuration:**

```typescript
secret: configService.get('JWT_SECRET'),
```
> "Secret key dari .env. Ini seperti password untuk sign JWT. JANGAN PERNAH hardcode atau expose!"

```typescript
signOptions: { expiresIn: '24h' },
```
> "Token expired setelah 24 jam. User harus login lagi. Ini security measure - kalau token dicuri, maksimal cuma bisa dipakai 24 jam."

**Create Auth Service:**

```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
```

**Explain Step by Step:**

```typescript
const user = await this.usersService.findByEmail(loginDto.email);
```
> "Cari user by email. Method ini belum ada, kita harus create di UsersService."

```typescript
const isPasswordValid = await bcrypt.compare(
  loginDto.password,
  user.password,
);
```
> "bcrypt.compare() check apakah password plain text match dengan hashed password. Ini secure way untuk verify password!"

```typescript
const payload = { sub: user.id, email: user.email };
```
> "'sub' adalah standard JWT field untuk subject (user ID). Payload ini akan di-encode ke dalam token."

```typescript
return {
  access_token: this.jwtService.sign(payload),
  user: { ... }
};
```
> "Return token dan user info. Client akan save token dan send di setiap request."

**Update Users Service (add findByEmail method):**

```typescript
// src/users/users.service.ts
async findByEmail(email: string): Promise<User | null> {
  return await this.usersRepository.findOne({
    where: { email },
  });
}
```

**Create JWT Strategy:**

```typescript
// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findByEmail(payload.email);
    
    if (!user) {
      throw new UnauthorizedException();
    }
    
    return { userId: user.id, email: user.email };
  }
}
```

**Explain JWT Strategy:**

```typescript
jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
```
> "Ambil token dari header 'Authorization: Bearer <token>'. Ini adalah standard way."

```typescript
ignoreExpiration: false,
```
> "Kalau token expired, reject! Security feature."

```typescript
async validate(payload: any) {
```
> "Method ini dipanggil otomatis setelah JWT signature verified. Kita check apakah user masih exist di database."

**Create Auth Controller:**

```typescript
// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TrimPipe } from '../common/pipes/trim.pipe';
import { LowercasePipe } from '../common/pipes/lowercase.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body(new TrimPipe(), new LowercasePipe('email')) loginDto: LoginDto
  ) {
    return await this.authService.login(loginDto);
  }
}
```

**Test Login in Postman:**

**Test Case 1: Valid Login**
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Show Token in jwt.io:**
> "Copy token ke jwt.io dan decode. Lihat payload - ada user ID dan email!"

**Test Case 2: Wrong Password**
```json
{
  "email": "john@example.com",
  "password": "wrongpassword"
}
```

**Expected Response:**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

**Test Case 3: User Not Found**
```json
{
  "email": "notexist@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

**Explain Security:**
> "Notice: error message sama untuk wrong password dan user not found. Ini security practice - jangan beri hint ke attacker apakah email exist atau tidak!"

---

### Hour 3: Protected Routes & JWT Guards (60 min)

#### Step 19: Create JWT Auth Guard (15 min)

**Explain Guards:**
> "Guard adalah 'security guard' untuk routes. Check apakah request punya authorization sebelum masuk ke controller."

**Create Guard:**

```typescript
// src/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

**Explain:**
> "AuthGuard('jwt') otomatis validate JWT token pakai JwtStrategy yang kita buat. Simple!"

#### Step 20: Protect Profile Endpoint (20 min)

**Create Profile Endpoint:**

```typescript
// src/users/users.controller.ts
import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(
    @Body(new TrimPipe(), new LowercasePipe('email')) registerDto: RegisterDto
  ) {
    const user = await this.usersService.register(registerDto);
    const { password, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findByEmail(req.user.email);
    const { password, ...result } = user;
    return result;
  }
}
```

**Explain:**

```typescript
@UseGuards(JwtAuthGuard)
```
> "Route ini protected! Harus kirim valid JWT token. Kalau tidak, return 401 Unauthorized."

```typescript
@Request() req
```
> "req.user berisi data dari JWT payload yang sudah di-validate oleh JwtStrategy."

**Test in Postman:**

**Test Case 1: Without Token**
```
GET http://localhost:3000/users/profile
```

**Expected Response:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Test Case 2: With Valid Token**
```
GET http://localhost:3000/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response:**
```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Show in Postman - Save Token:**
> "Di Postman, kita bisa save token di Environment Variables supaya tidak perlu copy-paste terus."

**Create Environment:**
```
1. Click Environments
2. Create "Task Management Local"
3. Add variable: access_token
```

**Update Login Tests:**
```javascript
// In Login request → Tests tab
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Save access token", function () {
    var jsonData = pm.response.json();
    pm.environment.set("access_token", jsonData.access_token);
});
```

**Use Token Variable:**
```
GET http://localhost:3000/users/profile
Authorization: Bearer {{access_token}}
```

**Explain:**
> "Sekarang setiap kali login, token otomatis ke-save. Semua protected endpoints bisa pakai {{access_token}}. Efficient!"

#### Step 21: Create Custom Decorator for Current User (15 min)

**Why Custom Decorator?**
> "Typing '@Request() req' dan 'req.user' berulang-ulang membosankan. Kita create custom decorator supaya lebih clean!"

**Create Decorator:**

```typescript
// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

**Use in Controller:**

```typescript
// src/users/users.controller.ts
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@CurrentUser() user) {
  const fullUser = await this.usersService.findByEmail(user.email);
  const { password, ...result } = fullUser;
  return result;
}
```

**Compare:**
```typescript
// Before ❌
async getProfile(@Request() req) {
  const user = req.user;
  // ...
}

// After ✅
async getProfile(@CurrentUser() user) {
  // user is already available!
  // ...
}
```

**Explain:**
> "Jauh lebih clean! @CurrentUser() custom decorator yang kita buat sendiri. Ini showcase power of NestJS decorators!"

#### Step 22: Add Update Profile Endpoint (10 min)

**Create UpdateProfileDto:**

```typescript
// src/users/dto/update-profile.dto.ts
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Name harus berupa string' })
  @MinLength(2, { message: 'Name minimal 2 karakter' })
  @MaxLength(50, { message: 'Name maksimal 50 karakter' })
  name?: string;
}
```

**Explain @IsOptional:**
> "@IsOptional() artinya field ini tidak wajib. User bisa update name saja tanpa kirim email atau password."

**Add Method to Service:**

```typescript
// src/users/users.service.ts
async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<User> {
  await this.usersRepository.update(userId, updateProfileDto);
  return await this.usersRepository.findOne({ where: { id: userId } });
}
```

**Add Endpoint to Controller:**

```typescript
// src/users/users.controller.ts
import { Patch } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';

@UseGuards(JwtAuthGuard)
@Patch('profile')
async updateProfile(
  @CurrentUser() user,
  @Body(TrimPipe) updateProfileDto: UpdateProfileDto
) {
  const updatedUser = await this.usersService.updateProfile(
    user.userId,
    updateProfileDto
  );
  const { password, ...result } = updatedUser;
  return result;
}
```

**Test in Postman:**
```
PATCH http://localhost:3000/users/profile
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "name": "John Updated"
}
```

**Expected Response:**
```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Updated",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Session 2 Recap (5 min)

**What We Learned:**

1. ✅ **Custom Pipes** - Transform data (trim, lowercase, slugify)
2. ✅ **Pipe Chaining** - Multiple pipes in sequence
3. ✅ **JWT Authentication** - Stateless auth with tokens
4. ✅ **JWT Strategy** - Validate tokens with Passport
5. ✅ **Guards** - Protect routes with JwtAuthGuard
6. ✅ **Custom Decorators** - @CurrentUser() for cleaner code
7. ✅ **Protected Endpoints** - Profile CRUD with authentication

**Key Concepts:**
- Pipes transform data before validation
- JWT tokens are stateless - no server-side sessions
- Guards check authorization before route handler
- Custom decorators reduce boilerplate code

**Homework for Students:**
1. Create custom pipe for validating phone numbers
2. Add logout functionality (client-side token removal)
3. Implement refresh token mechanism
4. Add password change endpoint

**Next Session Preview:**
> "Session berikutnya kita akan:
> - Create Tasks module dengan full CRUD
> - Advanced DTOs dengan nested objects
> - Query parameters dan filters
> - Relations antara Users dan Tasks
> - Custom middleware untuk logging!"

---

## 📅 Session 3: Tasks Module & Middleware (3 hours)

**Topics:** CRUD operations, Relations, Query filters, Middleware logging

### Hour 1: Tasks Module with Relations (60 min)

#### Step 23: Understanding Database Relations (10 min)

**Explain Relations:**
> "Dalam aplikasi nyata, data saling berhubungan. Satu User bisa punya banyak Tasks. Ini disebut 'One-to-Many Relationship'."

**Draw ER Diagram:**
```
┌──────────────────┐              ┌──────────────────┐
│      User        │              │      Task        │
├──────────────────┤              ├──────────────────┤
│ id (PK)          │─────────────<│ id (PK)          │
│ email            │    1    N    │ title            │
│ password         │              │ description      │
│ name             │              │ status           │
│ createdAt        │              │ priority         │
└──────────────────┘              │ userId (FK)      │
                                  │ createdAt        │
                                  └──────────────────┘

One user can have MANY tasks
Each task belongs to ONE user
```

**Real-World Example:**
```
User: John (id: 1)
  ├── Task: Buy groceries (userId: 1)
  ├── Task: Finish homework (userId: 1)
  └── Task: Call dentist (userId: 1)

User: Jane (id: 2)
  ├── Task: Morning jog (userId: 2)
  └── Task: Team meeting (userId: 2)
```

#### Step 24: Create Task Entity with Relation (20 min)

**Generate Tasks Module:**
```bash
nest generate module tasks
nest generate controller tasks
nest generate service tasks
```

**Create Task Entity:**

```typescript
// src/tasks/entities/task.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Explain Enums:**

```typescript
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
```
> "Enum adalah fixed set of values. Task status hanya boleh TODO, IN_PROGRESS, atau DONE. Tidak bisa yang lain. Ini prevent typos dan maintain consistency!"

**Explain Relation Decorators:**

```typescript
@ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
```
> "ManyToOne: Banyak tasks belong to satu user. onDelete: CASCADE artinya kalau user di-delete, semua tasks-nya juga ikut terhapus otomatis."

```typescript
@JoinColumn({ name: 'userId' })
```
> "JoinColumn specify foreign key column name. Di database, column 'userId' akan reference ke users.id."

**Update User Entity (add reverse relation):**

```typescript
// src/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;
}
```

**Explain OneToMany:**
```typescript
@OneToMany(() => Task, (task) => task.user)
tasks: Task[];
```
> "OneToMany adalah reverse side of relation. Satu user bisa punya many tasks. 'tasks' adalah array of Task objects."

**Register Task Entity in Module:**

```typescript
// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

#### Step 25: Create Task DTOs (30 min)

**Create CreateTaskDto:**

```typescript
// src/tasks/dto/create-task.dto.ts
import { IsString, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString({ message: 'Title harus berupa string' })
  @MinLength(3, { message: 'Title minimal 3 karakter' })
  @MaxLength(100, { message: 'Title maksimal 100 karakter' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description harus berupa string' })
  @MaxLength(500, { message: 'Description maksimal 500 karakter' })
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status harus TODO, IN_PROGRESS, atau DONE' })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Priority harus LOW, MEDIUM, HIGH, atau URGENT' })
  priority?: TaskPriority;
}
```

**Explain @IsEnum:**
```typescript
@IsEnum(TaskStatus, { message: 'Status harus TODO, IN_PROGRESS, atau DONE' })
```
> "@IsEnum validate apakah value adalah salah satu dari enum values. Kalau client kirim 'PENDING', akan ditolak karena tidak ada di enum!"

**Create UpdateTaskDto:**

```typescript
// src/tasks/dto/update-task.dto.ts
import { IsString, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class UpdateTaskDto {
  @IsOptional()
  @IsString({ message: 'Title harus berupa string' })
  @MinLength(3, { message: 'Title minimal 3 karakter' })
  @MaxLength(100, { message: 'Title maksimal 100 karakter' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description harus berupa string' })
  @MaxLength(500, { message: 'Description maksimal 500 karakter' })
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status harus TODO, IN_PROGRESS, atau DONE' })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Priority harus LOW, MEDIUM, HIGH, atau URGENT' })
  priority?: TaskPriority;
}
```

**Explain Difference:**
```typescript
// CreateTaskDto - title is required
@IsString()
@MinLength(3)
title: string;  // No question mark

// UpdateTaskDto - all fields optional
@IsOptional()
@IsString()
@MinLength(3)
title?: string;  // Has question mark
```
> "Saat create, title wajib. Saat update, semua fields optional - user bisa update title saja, atau status saja, atau semua fields."

---

### Hour 2: Tasks CRUD Implementation (60 min)

#### Step 26: Implement Tasks Service (30 min)

**Create Tasks Service:**

```typescript
// src/tasks/tasks.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  // Create new task
  async create(userId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      userId,
      status: createTaskDto.status || TaskStatus.TODO,
      priority: createTaskDto.priority || TaskPriority.MEDIUM,
    });

    return await this.tasksRepository.save(task);
  }

  // Get all tasks for a user
  async findAll(userId: number): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Get one task by ID
  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  // Update task
  async update(id: number, userId: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id, userId);

    Object.assign(task, updateTaskDto);
    return await this.tasksRepository.save(task);
  }

  // Delete task
  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.tasksRepository.remove(task);
  }

  // Get tasks by status
  async findByStatus(userId: number, status: TaskStatus): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { userId, status },
      order: { createdAt: 'DESC' },
    });
  }

  // Get tasks by priority
  async findByPriority(userId: number, priority: TaskPriority): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { userId, priority },
      order: { createdAt: 'DESC' },
    });
  }
}
```

**Explain Key Methods:**

```typescript
async create(userId: number, createTaskDto: CreateTaskDto): Promise<Task> {
  const task = this.tasksRepository.create({
    ...createTaskDto,
    userId,
    status: createTaskDto.status || TaskStatus.TODO,
    priority: createTaskDto.priority || TaskPriority.MEDIUM,
  });
```
> "Spread operator (...createTaskDto) copy semua properties. Terus kita add userId dari JWT token. Default status adalah TODO, default priority adalah MEDIUM."

```typescript
async findOne(id: number, userId: number): Promise<Task> {
  const task = await this.tasksRepository.findOne({
    where: { id, userId },
  });
```
> "PENTING! Where clause harus include 'userId'. Ini security - user hanya bisa akses tasks miliknya sendiri! Kalau tidak check userId, user A bisa lihat task milik user B!"

```typescript
if (!task) {
  throw new NotFoundException('Task not found');
}
```
> "Kalau task tidak ditemukan (atau bukan milik user ini), throw 404. Clear feedback untuk client."

```typescript
async update(id: number, userId: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
  const task = await this.findOne(id, userId);
  Object.assign(task, updateTaskDto);
  return await this.tasksRepository.save(task);
}
```
> "Object.assign() merge updateTaskDto ke existing task. Hanya fields yang dikirim yang di-update."

#### Step 27: Implement Tasks Controller (30 min)

**Create Tasks Controller:**

```typescript
// src/tasks/tasks.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TrimPipe } from '../common/pipes/trim.pipe';
import { TaskStatus, TaskPriority } from './entities/task.entity';

@Controller('tasks')
@UseGuards(JwtAuthGuard) // All routes in this controller are protected
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  async create(
    @CurrentUser() user,
    @Body(TrimPipe) createTaskDto: CreateTaskDto,
  ) {
    return await this.tasksService.create(user.userId, createTaskDto);
  }

  @Get()
  async findAll(
    @CurrentUser() user,
    @Query('status') status?: TaskStatus,
    @Query('priority') priority?: TaskPriority,
  ) {
    // Filter by status if provided
    if (status) {
      return await this.tasksService.findByStatus(user.userId, status);
    }

    // Filter by priority if provided
    if (priority) {
      return await this.tasksService.findByPriority(user.userId, priority);
    }

    // No filter - return all tasks
    return await this.tasksService.findAll(user.userId);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.tasksService.findOne(id, user.userId);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
    @Body(TrimPipe) updateTaskDto: UpdateTaskDto,
  ) {
    return await this.tasksService.update(id, user.userId, updateTaskDto);
  }

  @Delete(':id')
  async remove(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.tasksService.remove(id, user.userId);
    return { message: 'Task deleted successfully' };
  }
}
```

**Explain Controller Features:**

```typescript
@Controller('tasks')
@UseGuards(JwtAuthGuard)
```
> "JwtAuthGuard di controller level protect SEMUA routes. Tidak perlu tambahkan per-method."

```typescript
@Query('status') status?: TaskStatus,
@Query('priority') priority?: TaskPriority,
```
> "@Query decorator ambil query parameters dari URL. Contoh: /tasks?status=TODO atau /tasks?priority=HIGH"

```typescript
@Param('id', ParseIntPipe) id: number,
```
> "ParseIntPipe otomatis convert string ID dari URL ke number. Kalau tidak bisa (misalnya /tasks/abc), return error 400."

```typescript
if (status) {
  return await this.tasksService.findByStatus(user.userId, status);
}
```
> "Conditional logic: kalau ada query parameter, filter by that. Kalau tidak, return semua."

**Test CRUD in Postman:**

**Test 1: Create Task**
```
POST http://localhost:3000/tasks
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "HIGH"
}
```

**Expected Response:**
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "TODO",
  "priority": "HIGH",
  "userId": 1,
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

**Test 2: Get All Tasks**
```
GET http://localhost:3000/tasks
Authorization: Bearer {{access_token}}
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "TODO",
    "priority": "HIGH",
    "userId": 1,
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
]
```

**Test 3: Get Tasks by Status**
```
GET http://localhost:3000/tasks?status=TODO
Authorization: Bearer {{access_token}}
```

**Test 4: Update Task**
```
PATCH http://localhost:3000/tasks/1
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

**Test 5: Delete Task**
```
DELETE http://localhost:3000/tasks/1
Authorization: Bearer {{access_token}}
```

**Expected Response:**
```json
{
  "message": "Task deleted successfully"
}
```

**Test 6: Try Access Other User's Task (Security Test)**

Login as different user, try to access task ID 1:
```
GET http://localhost:3000/tasks/1
Authorization: Bearer {{different_user_token}}
```

**Expected Response:**
```json
{
  "statusCode": 404,
  "message": "Task not found",
  "error": "Not Found"
}
```

**Explain:**
> "Security bekerja! User B tidak bisa akses task milik User A. Return 404 instead of 403 to not reveal task existence."

---

### Hour 3: Request Logging Middleware (60 min)

#### Step 28: Understanding Middleware (15 min)

**Explain Middleware Concept:**
> "Middleware adalah function yang dijalankan SEBELUM request masuk ke controller. Seperti 'checkpoint' yang dilalui setiap request."

**Draw Request Lifecycle:**
```
Client Request
      │
      ▼
┌─────────────────┐
│   Middleware    │ ← Log request
│   (Logger)      │   Check API key
│                 │   Add request ID
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Guard       │ ← Check JWT token
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Pipe        │ ← Validate DTO
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Controller    │ ← Handle request
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Service      │ ← Business logic
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Database      │
└─────────────────┘
         │
         ▼
    Response
```

**Real-World Middleware Examples:**
```
1. Logger Middleware
   - Log every request: method, URL, timestamp
   - Log response time

2. API Key Middleware
   - Check if request has valid API key
   - Useful untuk public APIs

3. CORS Middleware
   - Allow cross-origin requests
   - Security feature

4. Rate Limiting Middleware
   - Limit requests per IP/user
   - Prevent DDoS attacks

5. Request ID Middleware
   - Add unique ID to each request
   - Useful untuk tracking dan debugging
```

#### Step 29: Create Logger Middleware (25 min)

**Create Middleware Folder:**
```bash
mkdir -p src/common/middleware
```

**Create Logger Middleware:**

```typescript
// src/common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // Log request
    this.logger.log(
      `Request: ${method} ${originalUrl} - IP: ${ip} - UserAgent: ${userAgent}`
    );

    // Listen to response finish event
    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;
      
      this.logger.log(
        `Response: ${method} ${originalUrl} - Status: ${statusCode} - ${responseTime}ms`
      );
    });

    next();
  }
}
```

**Explain Line by Line:**

```typescript
private logger = new Logger('HTTP');
```
> "NestJS built-in Logger. 'HTTP' adalah context name yang akan muncul di console."

```typescript
const { method, originalUrl, ip } = req;
```
> "Destructure request info: method (GET, POST, etc.), originalUrl (/tasks), dan IP address."

```typescript
const startTime = Date.now();
```
> "Record waktu saat request masuk. Nanti kita compare dengan waktu saat response untuk hitung response time."

```typescript
res.on('finish', () => {
  const responseTime = Date.now() - startTime;
  this.logger.log(...);
});
```
> "Event listener untuk response finish. Calculate response time dan log."

```typescript
next();
```
> "PENTING! Panggil next() supaya request bisa lanjut ke Guard/Controller. Kalau tidak panggil next(), request akan stuck!"

**Apply Middleware in App Module:**

```typescript
// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  // ... existing imports
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
```

**Explain Configuration:**

```typescript
.forRoutes('*')
```
> "Apply middleware ke SEMUA routes. Bisa juga specific: .forRoutes('tasks', 'users')"

**Test Middleware:**

```
GET http://localhost:3000/tasks
```

**Check Console Output:**
```
[HTTP] Request: GET /tasks - IP: ::1 - UserAgent: PostmanRuntime/7.36.0
[HTTP] Response: GET /tasks - Status: 200 - 45ms
```

**Explain Output:**
> "Sekarang setiap request di-log dengan detail! Method, URL, IP, user agent, status code, dan response time. Sangat berguna untuk debugging dan monitoring."

#### Step 30: Create Request ID Middleware (20 min)

**Why Request ID?**
> "Request ID adalah unique identifier untuk setiap request. Berguna untuk tracking errors dan debugging, terutama di production dengan banyak requests concurrent."

**Install uuid:**
```bash
npm install uuid
npm install -D @types/uuid
```

**Create Request ID Middleware:**

```typescript
// src/common/middleware/request-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Generate unique request ID
    const requestId = uuidv4();
    
    // Add to request object
    req['requestId'] = requestId;
    
    // Add to response header (useful for client-side tracking)
    res.setHeader('X-Request-Id', requestId);
    
    next();
  }
}
```

**Explain:**
```typescript
const requestId = uuidv4();
```
> "Generate UUID v4 - guaranteed unique ID. Contoh: '123e4567-e89b-12d3-a456-426614174000'"

```typescript
req['requestId'] = requestId;
```
> "Attach request ID ke request object. Bisa diakses di controller/service untuk logging."

```typescript
res.setHeader('X-Request-Id', requestId);
```
> "Kirim request ID di response header. Client bisa save untuk error reporting. 'X-' prefix adalah convention untuk custom headers."

**Update Logger Middleware to Include Request ID:**

```typescript
// src/common/middleware/logger.middleware.ts
use(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl, ip } = req;
  const userAgent = req.get('user-agent') || '';
  const requestId = req['requestId'] || 'N/A';
  const startTime = Date.now();

  this.logger.log(
    `[${requestId}] Request: ${method} ${originalUrl} - IP: ${ip}`
  );

  res.on('finish', () => {
    const { statusCode } = res;
    const responseTime = Date.now() - startTime;
    
    this.logger.log(
      `[${requestId}] Response: ${method} ${originalUrl} - Status: ${statusCode} - ${responseTime}ms`
    );
  });

  next();
}
```

**Apply Both Middlewares:**

```typescript
// src/app.module.ts
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, LoggerMiddleware)
      .forRoutes('*');
  }
}
```

**Explain Order:**
> "Middleware dijalankan sesuai order. RequestIdMiddleware dulu (generate ID), baru LoggerMiddleware (log dengan ID). Order matters!"

**Test:**

```
GET http://localhost:3000/tasks
```

**Console Output:**
```
[123e4567-e89b-12d3-a456-426614174000] Request: GET /tasks - IP: ::1
[123e4567-e89b-12d3-a456-426614174000] Response: GET /tasks - Status: 200 - 45ms
```

**Response Header:**
```
X-Request-Id: 123e4567-e89b-12d3-a456-426614174000
```

**Explain Benefit:**
> "Sekarang setiap request punya unique ID! Kalau ada error, user bisa report dengan request ID. Developer bisa search logs by request ID untuk debugging."

---

### Session 3 Recap (5 min)

**What We Learned:**

1. ✅ **Database Relations** - One-to-Many (User has many Tasks)
2. ✅ **Task Entity** - With enums for Status and Priority
3. ✅ **CRUD Operations** - Create, Read, Update, Delete tasks
4. ✅ **Query Parameters** - Filter by status and priority
5. ✅ **Security** - Users only access their own tasks
6. ✅ **Middleware** - Logger and Request ID middleware
7. ✅ **Request Lifecycle** - Middleware → Guard → Pipe → Controller

**Key Concepts:**
- Relations connect entities in database
- Enums enforce fixed set of values
- Middleware runs before every request
- Request ID helps with debugging
- Security: always filter by userId!

**Homework for Students:**
1. Add categories for tasks (new entity)
2. Implement pagination for tasks list
3. Add search functionality (search by title)
4. Create middleware for rate limiting
5. Add task due date with reminders

**Next Session Preview:**
> "Session terakhir! Kita akan:
> - Setup environment configuration
> - Add global error handling
> - Deploy to Render
> - Setup monitoring
> - Review best practices!"

---

## 📅 Session 4: Deployment & Production (3 hours)

**Topics:** Environment config, Error handling, CORS, Deployment to Render, Monitoring

### Hour 1: Production-Ready Configuration (60 min)

#### Step 31: Environment Configuration Best Practices (15 min)

**Explain Environment Separation:**
> "Aplikasi production butuh configuration berbeda dari development. Port, database, secrets - semua berbeda!"

**Show Environment Comparison:**
```
Development Environment:
- PORT: 3000
- DATABASE: localhost
- DEBUG: enabled
- JWT_SECRET: development-secret
- CORS: allow all origins

Production Environment:
- PORT: from Render
- DATABASE: Render PostgreSQL
- DEBUG: disabled
- JWT_SECRET: strong random secret
- CORS: only specific origins
```

**Update .env File:**

```bash
# .env.development
PORT=3000
NODE_ENV=development

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=task_management_db

# JWT
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Logging
LOG_LEVEL=debug
```

**Create .env.production Template:**

```bash
# .env.production (DO NOT COMMIT!)
PORT=${PORT}
NODE_ENV=production

# Database (from Render PostgreSQL)
DATABASE_HOST=${DATABASE_HOST}
DATABASE_PORT=${DATABASE_PORT}
DATABASE_USERNAME=${DATABASE_USERNAME}
DATABASE_PASSWORD=${DATABASE_PASSWORD}
DATABASE_NAME=${DATABASE_NAME}

# JWT (use strong random secret!)
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=24h

# CORS (your frontend URL)
CORS_ORIGIN=https://yourfrontend.com

# Logging
LOG_LEVEL=info
```

**Explain Environment Variables:**
> "${PORT}" adalah placeholder yang akan di-fill oleh Render. Kita tidak hardcode values disini."

#### Step 32: Configure CORS (15 min)

**Explain CORS:**
> "CORS = Cross-Origin Resource Sharing. Kalau frontend di domain berbeda dengan backend, browser akan block requests kecuali CORS di-enable."

**Visual Explanation:**
```
Scenario 1: Same Origin (No CORS needed)
┌─────────────────────┐
│  Frontend           │
│  http://app.com     │──────┐
└─────────────────────┘      │
                             │
┌─────────────────────┐      │
│  Backend            │<─────┘
│  http://app.com/api │
└─────────────────────┘

Scenario 2: Different Origin (CORS needed!)
┌─────────────────────┐
│  Frontend           │
│  http://app.com     │──────┐
└─────────────────────┘      │ Browser blocks this!
                             │ unless CORS enabled
┌─────────────────────┐      │
│  Backend            │<─────┘
│  http://api.app.com │
└─────────────────────┘
```

**Setup CORS in main.ts:**

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get config service
  const configService = app.get(ConfigService);
  
  // Enable CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN')?.split(',') || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  });
  
  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
```

**Explain CORS Options:**

```typescript
origin: configService.get('CORS_ORIGIN')?.split(',') || '*',
```
> "Multiple origins dipisahkan comma di .env. Split jadi array. Kalau tidak ada, allow semua (*) - HANYA untuk development!"

```typescript
credentials: true,
```
> "Allow cookies dan authorization headers. Needed for JWT!"

```typescript
methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
```
> "HTTP methods yang di-allow. OPTIONS needed for preflight requests."

```typescript
allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
```
> "Headers yang di-allow dari client. Authorization untuk JWT, X-Request-Id untuk tracking."

#### Step 33: Global Error Handling (15 min)

**Explain Error Filter:**
> "Error Filter adalah 'safety net' yang catch semua errors dan format response dengan consistent. User dapat error message yang jelas, tidak ada stack trace yang expose internal details!"

**Create Global Exception Filter:**

```typescript
// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = request['requestId'] || 'N/A';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        errors = (exceptionResponse as any).errors;
      } else {
        message = exceptionResponse;
      }
    }

    // Log error
    this.logger.error(
      `[${requestId}] ${request.method} ${request.url} - Status: ${status} - Error: ${message}`,
      exception instanceof Error ? exception.stack : ''
    );

    // Send response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      requestId,
      message,
      ...(errors && { errors }),
    });
  }
}
```

**Explain Key Parts:**

```typescript
@Catch()
```
> "@Catch() without argument catch SEMUA exceptions. Kalau mau specific, bisa @Catch(HttpException)"

```typescript
if (exception instanceof HttpException) {
  status = exception.getStatus();
```
> "Check type of exception. Kalau HttpException (400, 404, etc.), ambil status code-nya."

```typescript
this.logger.error(...)
```
> "Log error ke console dengan request ID. Penting untuk debugging production issues!"

```typescript
response.status(status).json({
  statusCode: status,
  timestamp: new Date().toISOString(),
  path: request.url,
  method: request.method,
  requestId,
  message,
});
```
> "Consistent error response format. Semua errors punya struktur yang sama!"

**Apply Global Filter:**

```typescript
// src/main.ts
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ... other configs
  
  // Apply global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // ...
}
```

**Test Error Handling:**

```
GET http://localhost:3000/tasks/999999
Authorization: Bearer {{access_token}}
```

**Expected Response:**
```json
{
  "statusCode": 404,
  "timestamp": "2024-01-15T12:00:00.000Z",
  "path": "/tasks/999999",
  "method": "GET",
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "message": "Task not found"
}
```

**Explain:**
> "Nice! Consistent error format with request ID. Kalau ada issue, user bisa report dengan request ID dan timestamp."

#### Step 34: Database Configuration for Production (15 min)

**Update TypeORM Config:**

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('NODE_ENV') === 'production' ? {
          rejectUnauthorized: false
        } : false,
      }),
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

**Explain Important Changes:**

```typescript
envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
```
> "Load .env based on environment. Development: .env.development, Production: .env.production"

```typescript
synchronize: configService.get('NODE_ENV') === 'development',
```
> "⚠️ VERY IMPORTANT! synchronize ONLY di development. Di production, pakai migrations untuk update schema!"

```typescript
ssl: configService.get('NODE_ENV') === 'production' ? {
  rejectUnauthorized: false
} : false,
```
> "Render PostgreSQL butuh SSL connection. Enable di production."

---

### Hour 2: Deployment to Render (60 min)

#### Step 35: Prepare for Deployment (20 min)

**Create Procfile:**

```bash
# Procfile (no extension)
web: npm run start:prod
```

**Explain:**
> "Procfile tell Render how to start application. 'web' adalah process type, 'npm run start:prod' adalah command."

**Update package.json Scripts:**

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "prebuild": "rimraf dist",
    "postinstall": "npm run build"
  }
}
```

**Explain Scripts:**
> - `build`: Compile TypeScript to JavaScript
> - `start:prod`: Run compiled code (faster than development)
> - `prebuild`: Delete old build folder
> - `postinstall`: Auto-build after npm install (Render needs this)

**Create .dockerignore (Optional):**

```bash
# .dockerignore
node_modules
dist
.env
.env.*
.git
.gitignore
README.md
```

**Update .gitignore:**

```bash
# .gitignore
node_modules
dist
.env
.env.*
*.log
.DS_Store
```

**Explain:**
> "JANGAN commit .env files! Sensitive data harus di environment variables di Render."

#### Step 36: Push to GitHub (10 min)

**Initialize Git (if not done):**

```bash
git init
git add .
git commit -m "Initial commit - Task Management API"
```

**Create GitHub Repository:**
> "1. Go to github.com
> 2. Create new repository: task-management-api
> 3. Don't initialize with README (we already have code)"

**Push Code:**

```bash
git remote add origin https://github.com/yourusername/task-management-api.git
git branch -M main
git push -u origin main
```

**Explain:**
> "Render akan deploy dari GitHub. Setiap kali kita push, Render auto-deploy!"

#### Step 37: Deploy to Render (30 min)

**Step-by-Step Deployment:**

**1. Create Render Account**
> "Go to render.com, sign up with GitHub account."

**2. Create PostgreSQL Database**
```
1. Click "New +" → PostgreSQL
2. Name: task-management-db
3. Database: task_management_db
4. User: (auto-generated)
5. Region: Oregon (US West)
6. Plan: Free
7. Click "Create Database"
```

**Wait 2-3 minutes for database to initialize...**

**3. Copy Database Credentials**
```
After database ready, you'll see:
- Host
- Port
- Database
- Username
- Password
- Internal Database URL
- External Database URL
```

**Important: Copy "Internal Database URL" for Render app!**

**4. Create Web Service**
```
1. Click "New +" → Web Service
2. Connect your GitHub repository
3. Configure:
   - Name: task-management-api
   - Region: Oregon (US West)
   - Branch: main
   - Root Directory: (leave blank)
   - Runtime: Node
   - Build Command: npm install
   - Start Command: npm run start:prod
   - Plan: Free
```

**5. Add Environment Variables**
```
Click "Advanced" → Add Environment Variables:

PORT=3000
NODE_ENV=production
DATABASE_URL=(paste Internal Database URL)
JWT_SECRET=(generate random secret - use password generator!)
JWT_EXPIRES_IN=24h
CORS_ORIGIN=*
LOG_LEVEL=info
```

**Important: Generate strong JWT_SECRET!**
```bash
# Generate random secret (run in terminal)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**6. Deploy!**
```
Click "Create Web Service"
Wait 5-10 minutes for first deployment...
```

**Monitor Build Logs:**
```
You'll see:
==> Building...
    npm install
    Building with TypeScript...
    Build complete!

==> Starting service...
    🚀 Application is running on: http://localhost:3000

==> Deploy succeeded!
```

**7. Get Your API URL**
```
Your API will be available at:
https://task-management-api-xxxx.onrender.com
```

**Test Deployment:**

```
GET https://task-management-api-xxxx.onrender.com
```

**Expected Response:**
```
Hello World!
```

**Test Register:**
```
POST https://task-management-api-xxxx.onrender.com/users/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

**If successful:**
```json
{
  "id": 1,
  "email": "test@example.com",
  "name": "Test User",
  "createdAt": "2024-01-15T14:00:00.000Z"
}
```

**🎉 CONGRATULATIONS! Your API is live!**

---

### Hour 3: Testing, Monitoring & Best Practices (60 min)

#### Step 38: Update Postman Collection for Production (15 min)

**Create Production Environment in Postman:**

```
1. Environments → Create Environment
2. Name: "Task Management Production"
3. Add variables:
   - base_url: https://task-management-api-xxxx.onrender.com
   - access_token: (will be set automatically)
```

**Update All Requests:**

```
Before:
GET http://localhost:3000/tasks

After:
GET {{base_url}}/tasks
```

**Test All Endpoints:**
1. ✅ POST /users/register
2. ✅ POST /auth/login
3. ✅ GET /users/profile
4. ✅ POST /tasks
5. ✅ GET /tasks
6. ✅ GET /tasks/:id
7. ✅ PATCH /tasks/:id
8. ✅ DELETE /tasks/:id

**Explain:**
> "Now you can switch between Local and Production environments easily in Postman!"

#### Step 39: Monitoring and Debugging Production (20 min)

**Access Render Logs:**
```
1. Go to Render Dashboard
2. Click your web service
3. Click "Logs" tab
4. See real-time logs
```

**What to Look For:**
```
✅ Good Logs:
[HTTP] Request: GET /tasks - IP: 123.45.67.89
[HTTP] Response: GET /tasks - Status: 200 - 50ms

❌ Error Logs:
[HTTP] Request: POST /tasks - IP: 123.45.67.89
[AllExceptionsFilter] 500 Internal Server Error
Error: Connection timeout...
```

**Setup Alerts (Render Free Tier):**
> "Render free tier doesn't have alerts, but you can:
> 1. Check logs regularly
> 2. Use external monitoring (UptimeRobot, etc.)
> 3. Upgrade to paid tier for better monitoring"

**Common Production Issues:**

**1. Database Connection Timeout**
```
Error: connect ETIMEDOUT
```
**Solution:** Check DATABASE_URL, make sure using Internal URL

**2. App Crashes After Idle**
```
Free tier apps sleep after 15 minutes of inactivity
```
**Solution:** First request after sleep will be slow (cold start)

**3. Environment Variables Not Loaded**
```
Error: JWT_SECRET is undefined
```
**Solution:** Double-check environment variables in Render dashboard

**4. CORS Errors**
```
Access to fetch has been blocked by CORS policy
```
**Solution:** Update CORS_ORIGIN environment variable with frontend URL

#### Step 40: Security Best Practices Review (15 min)

**Security Checklist:**

**1. Environment Variables ✅**
```
✅ DO: Store secrets in environment variables
❌ DON'T: Hardcode secrets in code
❌ DON'T: Commit .env files to Git
```

**2. Password Security ✅**
```
✅ DO: Hash passwords with bcrypt
✅ DO: Minimum 8 characters
❌ DON'T: Store plain text passwords
❌ DON'T: Send passwords in responses
```

**3. JWT Security ✅**
```
✅ DO: Use strong random secret
✅ DO: Set expiration time
✅ DO: Validate token on protected routes
❌ DON'T: Store sensitive data in JWT payload
```

**4. Input Validation ✅**
```
✅ DO: Use DTOs with validation decorators
✅ DO: Enable ValidationPipe globally
✅ DO: Use whitelist and forbidNonWhitelisted
❌ DON'T: Trust user input without validation
```

**5. Database Security ✅**
```
✅ DO: Use parameterized queries (TypeORM handles this)
✅ DO: Check userId for resource access
✅ DO: Enable SSL in production
❌ DON'T: Use synchronize: true in production
```

**6. CORS Configuration ✅**
```
✅ DO: Whitelist specific origins in production
✅ DO: Allow credentials for JWT
❌ DON'T: Use origin: '*' in production
```

**7. Error Handling ✅**
```
✅ DO: Use global exception filter
✅ DO: Log errors with request ID
✅ DO: Return user-friendly messages
❌ DON'T: Expose stack traces to clients
```

**8. Rate Limiting (Bonus)**
```
Implement rate limiting to prevent abuse:
npm install @nestjs/throttler

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
})
```

#### Step 41: Performance Optimization Tips (10 min)

**Database Optimization:**

```typescript
// Use indexes for frequently queried fields
@Entity('tasks')
export class Task {
  @Index()
  @Column()
  userId: number;

  @Index()
  @Column()
  status: TaskStatus;
}
```

**Caching (Advanced):**

```bash
npm install @nestjs/cache-manager cache-manager
```

```typescript
@CacheKey('all_tasks')
@CacheTTL(300) // Cache for 5 minutes
async findAll(userId: number): Promise<Task[]> {
  return await this.tasksRepository.find({ where: { userId } });
}
```

**Pagination:**

```typescript
async findAll(
  userId: number,
  page: number = 1,
  limit: number = 10,
): Promise<{ data: Task[]; total: number; page: number }> {
  const [data, total] = await this.tasksRepository.findAndCount({
    where: { userId },
    skip: (page - 1) * limit,
    take: limit,
    order: { createdAt: 'DESC' },
  });

  return { data, total, page };
}
```

**Compression:**

```bash
npm install compression
```

```typescript
// main.ts
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  // ...
}
```

---

### Final Session Recap (10 min)

**What We Built - Complete Feature List:**

**Authentication & Authorization:**
- ✅ User registration with validation
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected routes with Guards
- ✅ User profile management

**Task Management:**
- ✅ Create tasks with title, description, priority
- ✅ View all user's tasks
- ✅ Filter by status and priority
- ✅ Update tasks
- ✅ Delete tasks
- ✅ One-to-Many relation with users

**Data Validation & Transformation:**
- ✅ DTOs with class-validator
- ✅ Custom pipes (Trim, Lowercase, Slugify)
- ✅ Global validation pipe
- ✅ Enum validation for status and priority

**Middleware & Logging:**
- ✅ Request logger middleware
- ✅ Request ID tracking
- ✅ Response time measurement

**Production Ready:**
- ✅ Environment configuration
- ✅ CORS setup
- ✅ Global error handling
- ✅ Database SSL connection
- ✅ Deployed to Render
- ✅ Security best practices

**📊 Project Statistics:**
```
Total Files: ~40 files
Lines of Code: ~2,500 lines
Endpoints: 10 endpoints
Database Tables: 2 (users, tasks)
Custom Pipes: 3
Middleware: 2
Guards: 1
Filters: 1
DTOs: 5
Entities: 2
```

**🎓 Key Learnings:**

1. **DTOs** - Validate and transform input data
2. **Pipes** - Custom data transformation
3. **Middleware** - Pre-process all requests
4. **Guards** - Protect routes with authentication
5. **Decorators** - Reduce boilerplate code
6. **Relations** - Connect entities in database
7. **Dependency Injection** - Modular and testable code
8. **Error Handling** - Consistent error responses
9. **Environment Config** - Different settings per environment
10. **Deployment** - From local to production

**🚀 What Students Can Do Next:**

**Immediate Improvements:**
1. Add task categories (new entity with relation)
2. Implement search functionality
3. Add pagination to task list
4. File upload for task attachments
5. Email notifications for task reminders

**Advanced Features:**
6. Real-time updates with WebSockets
7. Task sharing between users
8. Role-based access control (Admin, User)
9. API rate limiting
10. Background jobs with Bull queue

**Learning Path:**
11. Unit testing with Jest
12. E2E testing
13. GraphQL API
14. Microservices architecture
15. Docker containerization

---

## 🎯 Teaching Tips for Instructors

**Session 1 (Foundation):**
- Take time explaining DTOs - most important concept
- Live code slowly, explain every decorator
- Use console.log to show data transformation
- Test validation with many examples in Postman

**Session 2 (Authentication):**
- Draw JWT flow on whiteboard
- Show jwt.io website to decode tokens
- Explain security: why hash passwords, why use JWT
- Test protected routes without token to show guard working

**Session 3 (CRUD & Middleware):**
- Draw database relation diagram clearly
- Show how userId filtering prevents security issues
- Explain middleware order matters
- Live demo: create task, update status to DONE

**Session 4 (Deployment):**
- Walk through Render setup step-by-step
- Don't rush! Deployment can be confusing
- Have backup plan if Render has issues
- Celebrate when first production request succeeds! 🎉

**Common Student Questions:**

**Q: "What's the difference between DTO and Entity?"**
A: DTO is data coming IN from client. Entity is data stored in database. DTO validates input, Entity represents table structure.

**Q: "Why use Dependency Injection? Can't we just import?"**
A: DI makes code testable! You can mock dependencies in tests. Also, NestJS manages lifecycle - services are singleton by default.

**Q: "Do we need middleware if we have guards?"**
A: Yes! They serve different purposes. Middleware runs BEFORE routing (logging, request ID). Guards run AFTER routing (check authorization).

**Q: "Is synchronize: true dangerous?"**
A: In production, YES! It auto-alters database schema. If you accidentally change entity, it can drop columns with data! Use migrations instead.

**Q: "Why does Render app take 30 seconds on first request?"**
A: Free tier apps "sleep" after inactivity. First request "wakes up" the app (cold start). Paid tiers don't sleep.

---

## 📝 Final Assignment for Students

**Build Your Own API:**

Choose one:
1. **Blog API** - Posts, comments, categories, likes
2. **E-commerce API** - Products, cart, orders, reviews
3. **Social Media API** - Posts, followers, likes, comments
4. **Event Manager API** - Events, registrations, reminders

**Requirements:**
- [ ] User authentication with JWT
- [ ] At least 3 entities with relations
- [ ] CRUD operations for all entities
- [ ] DTOs with validation
- [ ] At least 2 custom pipes
- [ ] Middleware for logging
- [ ] Query filters
- [ ] Global error handling
- [ ] Deployed to Render
- [ ] Postman collection included

**Grading Rubric (100 points):**
- DTOs & Validation (15 points)
- Custom Pipes (10 points)
- Authentication & Guards (15 points)
- CRUD Operations (20 points)
- Database Relations (15 points)
- Middleware (10 points)
- Code Quality (10 points)
- Deployment (5 points)

**Bonus Points (+10):**
- Unit tests with >70% coverage
- Pagination implementation
- Rate limiting
- File upload functionality
- Docker configuration

---

## 🎉 Conclusion

**Congratulations!** You've built a complete, production-ready NestJS API from scratch! You've learned:

✅ Modern backend architecture with NestJS  
✅ TypeScript best practices  
✅ Database design with relations  
✅ Authentication & security  
✅ Testing APIs with Postman  
✅ Deploying to production  

**Keep Learning:**
- Official NestJS docs: docs.nestjs.com
- TypeORM docs: typeorm.io
- Join NestJS Discord community
- Build more projects!

**Remember:** The best way to learn is by building. Take this foundation and create something amazing! 🚀

---

**Good luck with your NestJS journey!** 💙
