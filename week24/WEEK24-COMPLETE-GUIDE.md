# 📚 Week 24 - Complete Guide: Backend Security & Database Management

> **Resume Lengkap**: Prisma ORM, JWT Authentication, Authorization, dan Security Best Practices

---

## 📖 Table of Contents

1. [Overview Week 24](#overview-week-24)
2. [Materi 1: Prisma ORM](#materi-1-prisma-orm)
3. [Materi 2: Database Relations](#materi-2-database-relations)
4. [Materi 3: Authentication JWT](#materi-3-authentication-jwt)
5. [Materi 4: Authorization & Security](#materi-4-authorization--security)
6. [Materi 5: Access vs Refresh Token](#materi-5-access-vs-refresh-token)
7. [Project Sederhana: Task Management API](#project-sederhana)
8. [Summary & Best Practices](#summary--best-practices)

---

## 🎯 Overview Week 24

### Apa yang Dipelajari?

Week 24 fokus pada **Backend Security & Database Management** dengan topik:

1. **Prisma ORM** - Modern database toolkit
2. **Database Relations** - One-to-One, One-to-Many, Many-to-Many
3. **JWT Authentication** - Login system
4. **Authorization** - Role-Based Access Control (RBAC)
5. **Security Best Practices** - Rate limiting, Helmet, CORS

### Mengapa Penting?

```
┌─────────────────────────────────────────────────┐
│  Setiap aplikasi modern butuh:                  │
│  ✅ Database yang terstruktur (Prisma)         │
│  ✅ User login system (Authentication)          │
│  ✅ Permission system (Authorization)           │
│  ✅ Keamanan dari hacker (Security)             │
└─────────────────────────────────────────────────┘
```

---

## 📦 Materi 1: Prisma ORM

### 🤔 Apa itu Prisma?

**Prisma** adalah toolkit database modern untuk Node.js dan TypeScript.

### Analogi: Prisma = Google Translate untuk Database

```
┌──────────────────────────────────────────────────┐
│  Kamu (JavaScript/TypeScript)                    │
│         │                                        │
│         ↓                                        │
│  🔄 PRISMA (Penerjemah)                         │
│         │                                        │
│         ↓                                        │
│  Database (MySQL/PostgreSQL/MongoDB)             │
└──────────────────────────────────────────────────┘
```

**Tanpa Prisma (Raw SQL):**
```sql
SELECT * FROM users WHERE id = 1
```

**Dengan Prisma (TypeScript):**
```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 }
});
```

### Keuntungan Prisma

| Fitur | Penjelasan |
|-------|-----------|
| 🔒 **Type-Safe** | Auto-complete, catch error sebelum runtime |
| 📝 **Schema-First** | Define struktur database di satu file |
| 🔄 **Auto Migrations** | Database schema otomatis ter-update |
| 🚀 **Performance** | Query optimizer built-in |
| 🧩 **Relations** | Mudah handle JOIN tables |

### Setup Step-by-Step

#### Step 1: Install Prisma

```bash
npm install -D prisma
npm install @prisma/client
```

#### Step 2: Initialize Prisma

```bash
npx prisma init
```

Ini akan create:
```
project/
├── prisma/
│   └── schema.prisma    ← File ini yang penting!
└── .env                 ← Database URL
```

#### Step 3: Configure Database

Edit `.env`:
```env
DATABASE_URL="mysql://user:password@localhost:3306/mydb"
```

#### Step 4: Define Schema

Edit `prisma/schema.prisma`:
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

#### Step 5: Generate Migration

```bash
npx prisma migrate dev --name init
```

Ini akan:
1. Create SQL migration file
2. Run migration ke database
3. Generate Prisma Client

#### Step 6: Use in NestJS

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async create(data: { email: string; name?: string }) {
    return this.prisma.user.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  async delete(id: number) {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}
```

### Prisma Studio (Database GUI)

```bash
npx prisma studio
```

Buka browser: `http://localhost:5555` - GUI untuk lihat dan edit data!

---

## 🔗 Materi 2: Database Relations

### 🤔 Apa itu Relations?

Relations adalah **hubungan antar tabel** di database.

### Analogi: Relations = Hubungan Keluarga

```
┌────────────────────────────────────────────┐
│  👨 AYAH (User)                            │
│    │                                       │
│    ├── 👦 Anak 1 (Post)                   │
│    ├── 👧 Anak 2 (Post)                   │
│    └── 👶 Anak 3 (Post)                   │
│                                            │
│  Relationship: One-to-Many                 │
│  (Satu ayah punya banyak anak)            │
└────────────────────────────────────────────┘
```

### 3 Jenis Relations

#### 1. One-to-One (1:1)

**Analogi**: Satu orang punya satu KTP

```
User ←→ Profile
(Satu user punya tepat satu profile)
```

**Schema:**
```prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  profile Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id])
}
```

**Usage:**
```typescript
// Create user with profile
const user = await prisma.user.create({
  data: {
    email: 'john@example.com',
    profile: {
      create: {
        bio: 'Software Developer'
      }
    }
  }
});

// Get user with profile
const userWithProfile = await prisma.user.findUnique({
  where: { id: 1 },
  include: { profile: true }
});
```

#### 2. One-to-Many (1:N)

**Analogi**: Satu author punya banyak books

```
Author ←→ Books
(Satu author bisa tulis banyak buku)
```

**Schema:**
```prisma
model Author {
  id    Int    @id @default(autoincrement())
  name  String
  books Book[]
}

model Book {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int
  author   Author @relation(fields: [authorId], references: [id])
}
```

**Usage:**
```typescript
// Create author with books
const author = await prisma.author.create({
  data: {
    name: 'J.K. Rowling',
    books: {
      create: [
        { title: 'Harry Potter 1' },
        { title: 'Harry Potter 2' }
      ]
    }
  }
});

// Get author with all books
const authorWithBooks = await prisma.author.findUnique({
  where: { id: 1 },
  include: { books: true }
});
```

#### 3. Many-to-Many (N:M)

**Analogi**: Banyak students ikut banyak courses

```
Students ←→ Courses
(Satu student bisa ikut banyak course,
 Satu course bisa diikuti banyak student)
```

**Schema:**
```prisma
model Student {
  id      Int      @id @default(autoincrement())
  name    String
  courses Course[]
}

model Course {
  id       Int       @id @default(autoincrement())
  title    String
  students Student[]
}
```

**Usage:**
```typescript
// Create student and enroll in courses
const student = await prisma.student.create({
  data: {
    name: 'John Doe',
    courses: {
      connect: [
        { id: 1 }, // Math course
        { id: 2 }  // Science course
      ]
    }
  }
});

// Get student with courses
const studentWithCourses = await prisma.student.findUnique({
  where: { id: 1 },
  include: { courses: true }
});
```

### Cascade Operations

**Analogi**: Kalau ayah pindah, semua anak ikut pindah

```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id     Int  @id @default(autoincrement())
  userId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

Kalau User dihapus, semua Post-nya ikut terhapus!

---

## 🔐 Materi 3: Authentication JWT

### 🤔 Apa itu Authentication?

**Authentication** = Membuktikan identitas (login)

### Analogi: Authentication = Menunjukkan KTP

```
┌────────────────────────────────────────┐
│  Kamu datang ke bank                   │
│  ↓                                     │
│  Teller: "Boleh lihat KTP?"           │
│  ↓                                     │
│  Kamu: "Ini KTP saya" 🆔              │
│  ↓                                     │
│  Teller: "OK, silakan masuk!"          │
└────────────────────────────────────────┘
```

### Apa itu JWT (JSON Web Token)?

**JWT** adalah "tiket masuk" digital yang berisi informasi user.

```
┌─────────────────────────────────────┐
│  JWT Token                          │
│  ─────────────────────────────────  │
│  eyJhbGciOiJIUzI1NiIsInR5cCI...   │
│                                     │
│  Berisi:                            │
│  - userId: 123                      │
│  - email: john@example.com          │
│  - role: "user"                     │
│  - expired: 15 menit dari sekarang  │
└─────────────────────────────────────┘
```

### Setup Step-by-Step

#### Step 1: Install Dependencies

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

#### Step 2: Hash Password

**❌ JANGAN pernah simpan password plain text!**

```typescript
import * as bcrypt from 'bcrypt';

// Register: Hash password sebelum simpan
const hashedPassword = await bcrypt.hash(password, 10);
await prisma.user.create({
  data: {
    email,
    password: hashedPassword
  }
});

// Login: Compare password
const isMatch = await bcrypt.compare(inputPassword, user.password);
```

#### Step 3: Create Auth Module

```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, password: hashedPassword }
    });
  }

  async login(email: string, password: string) {
    // 1. Find user
    const user = await this.prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generate JWT token
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload)
    };
  }
}
```

#### Step 4: Create JWT Strategy

```typescript
// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub }
    });
    return user;
  }
}
```

#### Step 5: Create Auth Guard

```typescript
// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

#### Step 6: Protect Routes

```typescript
// posts.controller.ts
@Controller('posts')
export class PostsController {
  // Public endpoint (tidak perlu login)
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  // Protected endpoint (harus login)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req) {
    return this.postsService.create({
      ...req.body,
      userId: req.user.id
    });
  }
}
```

### Flow Authentication

```
┌─────────────────────────────────────────────────┐
│  1. User Register                               │
│     POST /auth/register                         │
│     Body: { email, password }                   │
│     ↓                                           │
│     Password di-hash → Simpan ke database       │
│                                                 │
│  2. User Login                                  │
│     POST /auth/login                            │
│     Body: { email, password }                   │
│     ↓                                           │
│     Check password → Generate JWT token         │
│     ↓                                           │
│     Return: { accessToken: "eyJhbG..." }       │
│                                                 │
│  3. Access Protected Route                      │
│     GET /posts                                  │
│     Headers: { Authorization: "Bearer eyJh..." }│
│     ↓                                           │
│     Verify token → Allow access                 │
└─────────────────────────────────────────────────┘
```

---

## 🛡️ Materi 4: Authorization & Security

### 🤔 Apa itu Authorization?

**Authorization** = Mengatur hak akses (permission)

### Analogi: Authorization = Kartu Akses Kantor

```
┌────────────────────────────────────────┐
│  KARTU AKSES                           │
│  ─────────────────────────────────     │
│  Nama: John Doe                        │
│  Role: EMPLOYEE                        │
│                                        │
│  Akses:                                │
│  ✅ Ruang kerja                        │
│  ✅ Toilet                             │
│  ✅ Kantin                             │
│  ❌ Ruang server (tidak bisa!)        │
│  ❌ Ruang CEO (tidak bisa!)           │
└────────────────────────────────────────┘
```

### Role-Based Access Control (RBAC)

#### Step 1: Define Roles

```prisma
enum Role {
  ADMIN
  MANAGER
  USER
}

model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
  role     Role   @default(USER)
}
```

#### Step 2: Create Roles Decorator

```typescript
// roles.decorator.ts
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
```

#### Step 3: Create Roles Guard

```typescript
// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
    
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

#### Step 4: Use in Controller

```typescript
@Controller('admin')
export class AdminController {
  // Hanya ADMIN yang bisa akses
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('users')
  getAllUsers() {
    return this.usersService.findAll();
  }

  // ADMIN atau MANAGER bisa akses
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('reports')
  getReports() {
    return this.reportsService.findAll();
  }
}
```

### Security Best Practices

#### 1. Rate Limiting

**Analogi**: Batasi berapa kali orang bisa coba password

```typescript
// Install
npm install @nestjs/throttler

// app.module.ts
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,      // 60 detik
      limit: 10,    // Max 10 requests
    }),
  ]
})
```

#### 2. Helmet (Security Headers)

```typescript
npm install helmet

// main.ts
import * as helmet from 'helmet';

app.use(helmet());
```

#### 3. CORS Configuration

```typescript
// main.ts
app.enableCors({
  origin: ['http://localhost:3000'], // Frontend URL
  credentials: true
});
```

#### 4. Input Validation

```typescript
npm install class-validator class-transformer

// dto/create-user.dto.ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
```

---

## 🔑 Materi 5: Access vs Refresh Token

### 🤔 Mengapa Perlu 2 Token?

### Analogi: Kartu Kunci Hotel

#### Access Token = Kartu Kunci Kamar 🔑
```
Masa berlaku: 15 menit
Fungsi: Buka pintu kamar
Bahaya: Kalau hilang, orang bisa masuk kamar!
```

#### Refresh Token = KTP Kamu 🆔
```
Masa berlaku: 7 hari
Fungsi: Minta kartu kunci baru ke resepsionis
Aman: Harus ke resepsionis langsung, tidak bisa dipalsukan
```

### Implementasi Step-by-Step

#### Step 1: Generate 2 Tokens

```typescript
// auth.service.ts
async login(email: string, password: string) {
  // ... validate user ...

  const payload = { sub: user.id, email: user.email };

  return {
    accessToken: this.jwtService.sign(payload, {
      expiresIn: '15m'  // Access token: 15 menit
    }),
    refreshToken: this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d'   // Refresh token: 7 hari
    })
  };
}
```

#### Step 2: Store Refresh Token

```prisma
model User {
  id           Int     @id @default(autoincrement())
  email        String  @unique
  password     String
  refreshToken String?
}
```

```typescript
// Simpan refresh token (hash dulu!)
const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
await this.prisma.user.update({
  where: { id: user.id },
  data: { refreshToken: hashedRefreshToken }
});
```

#### Step 3: Refresh Token Endpoint

```typescript
// auth.controller.ts
@Post('refresh')
async refresh(@Body() { refreshToken }: RefreshTokenDto) {
  // 1. Verify refresh token
  const payload = this.jwtService.verify(refreshToken, {
    secret: process.env.JWT_REFRESH_SECRET
  });

  // 2. Find user
  const user = await this.prisma.user.findUnique({
    where: { id: payload.sub }
  });

  // 3. Check if refresh token match
  const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isMatch) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  // 4. Generate new access token
  const newPayload = { sub: user.id, email: user.email };
  return {
    accessToken: this.jwtService.sign(newPayload, {
      expiresIn: '15m'
    })
  };
}
```

### Flow Lengkap

```
┌────────────────────────────────────────────────────┐
│  1. Login                                          │
│     POST /auth/login                               │
│     ↓                                              │
│     Return: { accessToken, refreshToken }          │
│                                                    │
│  2. Access Protected Route                         │
│     GET /posts                                     │
│     Headers: { Authorization: "Bearer <access>" }  │
│     ↓                                              │
│     ✅ Success (token valid)                      │
│                                                    │
│  3. After 15 Minutes...                            │
│     GET /posts                                     │
│     ↓                                              │
│     ❌ 401 Unauthorized (access token expired)    │
│                                                    │
│  4. Get New Access Token                           │
│     POST /auth/refresh                             │
│     Body: { refreshToken }                         │
│     ↓                                              │
│     Return: { accessToken: "new_token" }          │
│                                                    │
│  5. Try Again                                      │
│     GET /posts                                     │
│     Headers: { Authorization: "Bearer <new>" }    │
│     ↓                                              │
│     ✅ Success                                     │
└────────────────────────────────────────────────────┘
```

---

## 🚀 Project Sederhana: Task Management API

Mari kita buat project sederhana yang mengimplementasikan **semua materi Week 24**!

### Fitur-Fitur

✅ User registration & login (JWT)  
✅ Role-based access (Admin, User)  
✅ CRUD Tasks with relations  
✅ Protected routes  
✅ Refresh token  
✅ Security best practices  

### Step-by-Step Implementation

#### Step 1: Setup Project

```bash
# Create project
nest new task-management-api
cd task-management-api

# Install dependencies
npm install @prisma/client @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install @nestjs/throttler helmet
npm install -D prisma @types/passport-jwt @types/bcrypt

# Initialize Prisma
npx prisma init
```

#### Step 2: Database Schema

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  ADMIN
  USER
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  password     String
  name         String
  role         Role     @default(USER)
  refreshToken String?  @db.Text
  tasks        Task[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Task {
  id          Int        @id @default(autoincrement())
  title       String
  description String?    @db.Text
  status      TaskStatus @default(TODO)
  userId      Int
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
```

#### Step 3: Environment Variables

Edit `.env`:

```env
DATABASE_URL="mysql://root:password@localhost:3306/task_management"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
```

#### Step 4: Run Migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### Step 5: Create Prisma Service

```bash
nest g module prisma
nest g service prisma
```

Edit `src/prisma/prisma.service.ts`:

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

#### Step 6: Create Auth Module

```bash
nest g module auth
nest g service auth
nest g controller auth
```

Edit `src/auth/auth.service.ts`:

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
```

Edit `src/auth/auth.controller.ts`:

```typescript
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string; name: string }) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }
}
```

#### Step 7: Create JWT Strategy & Guards

Create `src/auth/strategies/jwt.strategy.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
  }
}
```

Create `src/auth/guards/jwt-auth.guard.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Create `src/auth/decorators/roles.decorator.ts`:

```typescript
import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
```

Create `src/auth/guards/roles.guard.ts`:

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

Edit `src/auth/auth.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
```

#### Step 8: Create Tasks Module

```bash
nest g module tasks
nest g service tasks
nest g controller tasks
```

Edit `src/tasks/tasks.service.ts`:

```typescript
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus, Role } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: { title: string; description?: string }) {
    return this.prisma.task.create({
      data: {
        ...data,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(userId: number, userRole: Role) {
    // Admin can see all tasks, User only their own
    if (userRole === Role.ADMIN) {
      return this.prisma.task.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.task.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number, userRole: Role) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check permission
    if (userRole !== Role.ADMIN && task.userId !== userId) {
      throw new ForbiddenException('You can only access your own tasks');
    }

    return task;
  }

  async update(
    id: number,
    userId: number,
    userRole: Role,
    data: { title?: string; description?: string; status?: TaskStatus },
  ) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (userRole !== Role.ADMIN && task.userId !== userId) {
      throw new ForbiddenException('You can only update your own tasks');
    }

    return this.prisma.task.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: number, userId: number, userRole: Role) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (userRole !== Role.ADMIN && task.userId !== userId) {
      throw new ForbiddenException('You can only delete your own tasks');
    }

    return this.prisma.task.delete({ where: { id } });
  }
}
```

Edit `src/tasks/tasks.controller.ts`:

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskStatus } from '@prisma/client';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  create(@Request() req, @Body() body: { title: string; description?: string }) {
    return this.tasksService.create(req.user.id, body);
  }

  @Get()
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.tasksService.findOne(+id, req.user.id, req.user.role);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { title?: string; description?: string; status?: TaskStatus },
  ) {
    return this.tasksService.update(+id, req.user.id, req.user.role, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.tasksService.delete(+id, req.user.id, req.user.role);
  }
}
```

#### Step 9: Configure App Module

Edit `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    PrismaModule,
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}
```

#### Step 10: Configure Main

Edit `src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Global prefix
  app.setGlobalPrefix('api/v1');

  await app.listen(3000);
  console.log('🚀 Server running on http://localhost:3000');
}
bootstrap();
```

#### Step 11: Create Seed Data

Create `prisma/seed.ts`:

```typescript
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });

  // Create regular users
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      password: hashedPassword,
      name: 'John Doe',
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      password: hashedPassword,
      name: 'Jane Smith',
      role: Role.USER,
    },
  });

  // Create tasks for users
  await prisma.task.createMany({
    data: [
      {
        title: 'Setup project repository',
        description: 'Initialize Git and create initial commit',
        userId: user1.id,
        status: 'DONE',
      },
      {
        title: 'Design database schema',
        description: 'Create ERD and define relationships',
        userId: user1.id,
        status: 'IN_PROGRESS',
      },
      {
        title: 'Implement authentication',
        description: 'Add JWT auth with refresh tokens',
        userId: user1.id,
        status: 'TODO',
      },
      {
        title: 'Write API documentation',
        description: 'Document all endpoints with Swagger',
        userId: user2.id,
        status: 'TODO',
      },
      {
        title: 'Add unit tests',
        description: 'Write tests for all services',
        userId: user2.id,
        status: 'TODO',
      },
    ],
  });

  console.log('✅ Seed completed!');
  console.log('\n📊 Created:');
  console.log('  - 3 users (1 admin, 2 regular users)');
  console.log('  - 5 tasks');
  console.log('\n🔐 Test credentials:');
  console.log('  Admin:  admin@example.com / password123');
  console.log('  User 1: john@example.com / password123');
  console.log('  User 2: jane@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

Run seed:

```bash
npm install -D ts-node
npx prisma db seed
```

#### Step 12: Run the Application

```bash
npm run start:dev
```

Server running at: http://localhost:3000

### Testing with Postman/Thunder Client

#### 1. Register New User

```http
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User"
}
```

#### 2. Login

```http
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 2,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

**Copy the `accessToken`!**

#### 3. Get All Tasks (Protected)

```http
GET http://localhost:3000/api/v1/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### 4. Create Task

```http
POST http://localhost:3000/api/v1/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "title": "Build REST API",
  "description": "Create CRUD endpoints for all resources"
}
```

#### 5. Update Task

```http
PUT http://localhost:3000/api/v1/tasks/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

#### 6. Delete Task

```http
DELETE http://localhost:3000/api/v1/tasks/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### 7. Test Admin Access

Login as admin:

```http
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

Get all tasks (admin sees everyone's tasks):

```http
GET http://localhost:3000/api/v1/tasks
Authorization: Bearer <admin_token>
```

#### 8. Refresh Token

When access token expires (after 15 minutes):

```http
POST http://localhost:3000/api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 📝 Summary & Best Practices

### Ringkasan Materi Week 24

| Materi | Konsep Utama | Analogi |
|--------|-------------|---------|
| **Prisma ORM** | Database toolkit type-safe | Google Translate untuk database |
| **Relations** | Hubungan antar tabel | Keluarga (ayah-anak) |
| **Authentication** | Membuktikan identitas | Menunjukkan KTP |
| **Authorization** | Mengatur hak akses | Kartu akses kantor |
| **Access Token** | Token jangka pendek | Kartu kunci hotel |
| **Refresh Token** | Token jangka panjang | KTP untuk minta kartu baru |

### Key Takeaways

#### 1. Prisma Benefits

```typescript
// ✅ Type-safe
const user = await prisma.user.findUnique({ where: { id: 1 } });
// user.email ← auto-complete!

// ✅ Easy relations
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true }
});

// ✅ Transactions
await prisma.$transaction([
  prisma.user.create({ data: { ... } }),
  prisma.post.create({ data: { ... } })
]);
```

#### 2. Authentication Flow

```
Register → Hash Password → Save to DB
Login → Verify Password → Generate JWT → Return Token
Access Protected Route → Verify Token → Allow/Deny
```

#### 3. Authorization Pattern

```typescript
// Define roles
enum Role { ADMIN, MANAGER, USER }

// Protect route
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Get('admin-only')
adminOnly() { ... }
```

#### 4. Security Checklist

- ✅ Hash passwords (bcrypt)
- ✅ Use JWT with short expiration
- ✅ Implement refresh tokens
- ✅ Add rate limiting
- ✅ Use Helmet for security headers
- ✅ Configure CORS properly
- ✅ Validate all inputs
- ✅ Never expose sensitive data
- ✅ Use HTTPS in production
- ✅ Store secrets in environment variables

### Common Mistakes to Avoid

#### ❌ Don't:

```typescript
// DON'T store plain passwords
password: '12345' // ❌

// DON'T use long-lived access tokens
expiresIn: '30d' // ❌

// DON'T expose sensitive data
return user; // ❌ (contains password)

// DON'T skip input validation
@Body() data: any // ❌
```

#### ✅ Do:

```typescript
// DO hash passwords
password: await bcrypt.hash(password, 10) // ✅

// DO use short-lived tokens
expiresIn: '15m' // ✅

// DO remove sensitive data
const { password, ...result } = user; // ✅
return result;

// DO validate inputs
@Body() data: CreateUserDto // ✅
```

### Production Checklist

Before deploying to production:

1. **Environment Variables**
   ```env
   # ❌ DON'T commit these!
   JWT_SECRET=<random-256-bit-string>
   JWT_REFRESH_SECRET=<different-random-string>
   DATABASE_URL=<production-db-url>
   ```

2. **Database**
   - [ ] Use connection pooling
   - [ ] Enable SSL for database connection
   - [ ] Setup automated backups
   - [ ] Add database indexes

3. **Security**
   - [ ] Enable HTTPS
   - [ ] Configure CORS for production domains
   - [ ] Add rate limiting
   - [ ] Implement logging and monitoring
   - [ ] Set up error tracking (Sentry)

4. **Performance**
   - [ ] Enable caching (Redis)
   - [ ] Optimize database queries
   - [ ] Add pagination for list endpoints
   - [ ] Compress responses (gzip)

5. **Testing**
   - [ ] Unit tests for services
   - [ ] Integration tests for endpoints
   - [ ] E2E tests for critical flows
   - [ ] Load testing

### Next Steps

Setelah menguasai Week 24, kamu siap untuk:

1. **Week 25**: Deployment & CI/CD
2. **Advanced Topics**:
   - Microservices architecture
   - GraphQL
   - WebSockets untuk real-time
   - Message queues (RabbitMQ, Kafka)
   - Caching strategies
   - Docker & Kubernetes

### Resources

- 📚 [Prisma Documentation](https://www.prisma.io/docs)
- 📚 [NestJS Documentation](https://docs.nestjs.com)
- 📚 [JWT.io](https://jwt.io)
- 📚 [OWASP Security Guidelines](https://owasp.org)

---

## 🎓 Kesimpulan

Week 24 mengajarkan kita fondasi penting untuk membangun **secure, scalable, dan production-ready** backend application:

1. **Prisma** membuat database management jadi mudah dan type-safe
2. **Relations** mengorganisir data dengan struktur yang jelas
3. **JWT Authentication** mengamankan user identity
4. **Authorization** mengontrol akses berdasarkan role
5. **Refresh Tokens** meningkatkan security tanpa mengorbankan UX

Dengan menguasai materi ini, kamu sudah bisa membuat backend API yang **secure dan professional**! 🚀

---

**Last Updated:** December 13, 2025  
**Week:** 24 - Backend Security & Database Management  
**Difficulty:** ⭐⭐⭐⭐ (Intermediate to Advanced)
