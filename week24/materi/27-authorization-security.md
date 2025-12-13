# 🛡️ Authorization & Security Best Practices

## 📋 Daftar Isi

1. [Pengantar](#pengantar)
2. [Authentication vs Authorization](#auth-vs-authz)
3. [Role-Based Access Control (RBAC)](#rbac)
4. [Roles Guard](#roles-guard)
5. [Permission-Based Authorization](#permissions)
6. [Rate Limiting](#rate-limiting)
7. [Security Headers (Helmet)](#security-headers)
8. [Input Validation & Sanitization](#input-validation)
9. [CORS Configuration](#cors)
10. [Security Best Practices](#best-practices)

---

## 📖 Pengantar

Di Material 3, kita sudah implement **Authentication** (who you are). Sekarang kita akan implement **Authorization** (what you can do) dan security best practices.

### 🎯 Tujuan Pembelajaran

✅ Understand authentication vs authorization  
✅ Implement Role-Based Access Control (RBAC)  
✅ Create custom guards untuk roles  
✅ Implement permission-based authorization  
✅ Setup rate limiting  
✅ Configure security headers dengan Helmet  
✅ Implement input validation  
✅ Setup CORS properly  
✅ Apply security best practices  

### ⏱️ Estimasi Waktu

**Total:** 3-4 jam
- RBAC: 1.5 jam
- Rate Limiting: 30 menit
- Security Headers: 30 menit
- Best Practices: 1 jam

---

## 🔐 Authentication vs Authorization

### The Difference

```
┌─────────────────────────────────────────────────────────┐
│              AUTHENTICATION (Who you are)               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Question: "Who are you?"                               │
│  Answer:   "I am John Doe"                              │
│  Proof:    Email + Password                             │
│  Result:   JWT Token                                    │
│                                                         │
│  Example:  Login ke sistem                              │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           AUTHORIZATION (What you can do)               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Question: "What are you allowed to do?"                │
│  Answer:   "I can read/write/delete posts"              │
│  Proof:    Role/Permissions                             │
│  Result:   Access granted/denied                        │
│                                                         │
│  Example:  Admin can delete any post                    │
│            User can only delete own posts               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Real-World Analogy

```
🏢 Office Building:

AUTHENTICATION:
├─ Security guard checks your ID badge
├─ Verifies you're an employee
└─ Lets you enter building

AUTHORIZATION:
├─ Your badge determines which floors you can access
├─ CEO: All floors (admin role)
├─ Engineer: Office floors only (user role)
└─ Visitor: Lobby only (guest role)
```

### In Code

```typescript
// AUTHENTICATION (Material 3)
@Post('login')
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
  // Result: JWT token (proves WHO you are)
}

// AUTHORIZATION (Material 4)
@Delete('posts/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')  // ← Only admin can delete any post
async delete(@Param('id') id: number) {
  return this.postsService.delete(id);
  // Checks WHAT you can do
}
```

---

## 👥 Role-Based Access Control (RBAC)

### What is RBAC?

**RBAC = Assign permissions based on user roles**

```
Roles:
├─ Admin    → Can do everything
├─ Author   → Can create/edit/delete own posts
├─ Editor   → Can create/edit any post
└─ Reader   → Can only read posts
```

### Setup Roles in Database

Already done in Material 3! Our User model has `role` field:

```prisma
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  name     String
  password String
  role     String @default("user")  // ← Role field
  // ...
}
```

**Common roles:**
- `admin` - Full access
- `user` - Limited access
- `moderator` - Medium access
- `guest` - Read-only access

### Create Roles Decorator

**Create `src/auth/decorators/roles.decorator.ts`:**

```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

**Usage:**

```typescript
@Roles('admin')          // Only admin
@Roles('admin', 'editor') // Admin or editor
@Roles('user')           // Only user
```

---

## 🚪 Roles Guard

### Create Roles Guard

**Create `src/auth/guards/roles.guard.ts`:**

```typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get required roles from @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. If no roles required, allow access
    if (!requiredRoles) {
      return true;
    }

    // 3. Get user from request (set by JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // 4. Check if user has required role
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
```

**📝 How it works:**

```
1. @Roles('admin') decorator → stores metadata
   ↓
2. RolesGuard reads metadata
   ↓
3. Gets user.role from request
   ↓
4. Compares user.role with required roles
   ↓
5. Allow or Deny
```

### Using Roles Guard

**Combine with JwtAuthGuard:**

```typescript
import { Controller, Get, Post, Delete, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('posts')
@UseGuards(JwtAuthGuard)  // ← All routes require authentication
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Public read (any authenticated user)
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  // Only authenticated users can create
  @Post()
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user) {
    return this.postsService.create(createPostDto, user.userId);
  }

  // Only admin can delete ANY post
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')  // ← Only admin
  deleteAny(@Param('id') id: number) {
    return this.postsService.delete(id);
  }

  // Admin or post owner can delete
  @Delete('my/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'user')  // ← Admin or user
  async deleteOwn(
    @Param('id') id: number,
    @CurrentUser() user,
  ) {
    // Check if user owns the post
    const post = await this.postsService.findOne(id);
    
    if (post.authorId !== user.userId && user.role !== 'admin') {
      throw new ForbiddenException('You can only delete your own posts');
    }
    
    return this.postsService.delete(id);
  }
}
```

### Multiple Roles

```typescript
// Only admin or editor
@Post('publish/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'editor')
publishPost(@Param('id') id: number) {
  return this.postsService.publish(id);
}

// Only moderator or admin
@Post('moderate/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'moderator')
moderatePost(@Param('id') id: number) {
  return this.postsService.moderate(id);
}
```

---

## 🔑 Permission-Based Authorization

### Beyond Roles

Sometimes roles aren't enough. You need **granular permissions**:

```
User has role: "editor"
Editor has permissions:
├─ post:create
├─ post:update
├─ post:delete
└─ comment:moderate
```

### Permission System

**Update User model:**

```prisma
model User {
  id          Int       @id @default(autoincrement())
  email       String    @unique
  name        String
  password    String
  role        String    @default("user")
  permissions String[]  // ← Array of permissions
  // ...
}
```

**Migration:**

```bash
npx prisma migrate dev --name add_user_permissions
```

### Permission Decorator

**Create `src/auth/decorators/permissions.decorator.ts`:**

```typescript
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
```

### Permissions Guard

**Create `src/auth/guards/permissions.guard.ts`:**

```typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      user.permissions?.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Missing permissions: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
```

### Usage

```typescript
@Post()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('post:create')
create(@Body() createPostDto: CreatePostDto) {
  return this.postsService.create(createPostDto);
}

@Delete(':id')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('post:delete')
delete(@Param('id') id: number) {
  return this.postsService.delete(id);
}

@Post('moderate/:id')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('post:moderate', 'comment:moderate')
moderate(@Param('id') id: number) {
  return this.postsService.moderate(id);
}
```

### Permission Management Service

**Create `src/auth/permissions.service.ts`:**

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  // Define permissions by role
  private rolePermissions = {
    admin: [
      'post:create',
      'post:read',
      'post:update',
      'post:delete',
      'user:create',
      'user:read',
      'user:update',
      'user:delete',
      'comment:moderate',
    ],
    editor: [
      'post:create',
      'post:read',
      'post:update',
      'post:delete',
      'comment:moderate',
    ],
    author: ['post:create', 'post:read', 'post:update'],
    user: ['post:read', 'comment:create'],
  };

  async assignRolePermissions(userId: number, role: string) {
    const permissions = this.rolePermissions[role] || [];
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { permissions },
    });

    return permissions;
  }

  async addPermission(userId: number, permission: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const permissions = user.permissions || [];
    
    if (!permissions.includes(permission)) {
      permissions.push(permission);
      
      await this.prisma.user.update({
        where: { id: userId },
        data: { permissions },
      });
    }

    return permissions;
  }

  async removePermission(userId: number, permission: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const permissions = (user.permissions || []).filter((p) => p !== permission);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { permissions },
    });

    return permissions;
  }
}
```

---

## 🚦 Rate Limiting

### Why Rate Limiting?

**Prevent abuse:**
- Brute force attacks
- DDoS attacks
- API spam
- Resource exhaustion

```
Without rate limiting:
Attacker → 1000 login attempts per second → Server crash

With rate limiting:
Attacker → 5 attempts per minute → Blocked after 5 attempts
```

### Install Throttler

```bash
npm install @nestjs/throttler
```

### Setup Throttler

**Edit `src/app.module.ts`:**

```typescript
import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,  // Time window: 60 seconds
        limit: 10,   // Max requests: 10 per window
      },
    ]),
    // ... other modules
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,  // ← Apply globally
    },
  ],
})
export class AppModule {}
```

**📝 Configuration:**

```typescript
ttl: 60000   // 60 seconds
limit: 10    // 10 requests per 60 seconds

// Example: Max 10 requests per minute
```

### Custom Rate Limits

**Different limits for different routes:**

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  // Login: Strict rate limit (prevent brute force)
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })  // 5 per minute
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Register: Moderate rate limit
  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } })  // 3 per minute
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // Refresh: Lenient rate limit
  @Post('refresh')
  @Throttle({ default: { limit: 20, ttl: 60000 } })  // 20 per minute
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshDto);
  }
}
```

### Skip Rate Limiting

```typescript
import { SkipThrottle } from '@nestjs/throttler';

@Controller('public')
export class PublicController {
  // Skip throttling for this route
  @Get('health')
  @SkipThrottle()
  healthCheck() {
    return { status: 'ok' };
  }

  // Skip throttling for entire controller
  @SkipThrottle()
  @Get('data')
  getData() {
    return { data: [] };
  }
}
```

### Rate Limit Response

When rate limit exceeded:

```
HTTP 429 Too Many Requests
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

---

## 🪖 Security Headers (Helmet)

### What is Helmet?

**Helmet = Sets HTTP security headers**

Protects against:
- XSS (Cross-Site Scripting)
- Clickjacking
- MIME type sniffing
- And more...

### Install Helmet

```bash
npm install helmet
```

### Setup Helmet

**Edit `src/main.ts`:**

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply Helmet security headers
  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
```

### What Helmet Does

```
Security Headers Added:
├─ Content-Security-Policy (CSP)
├─ X-DNS-Prefetch-Control
├─ X-Frame-Options (prevent clickjacking)
├─ X-Content-Type-Options (prevent MIME sniffing)
├─ X-XSS-Protection
├─ Strict-Transport-Security (HSTS)
└─ And more...
```

### Custom Helmet Configuration

```typescript
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000,  // 1 year
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: 'deny',  // Prevent embedding in iframe
    },
  }),
);
```

### Content Security Policy (CSP)

**CSP = Whitelist allowed content sources**

```typescript
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    // Only load resources from same origin
    
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    // Styles from self, inline, and Google Fonts
    
    scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
    // Scripts from self and CDN
    
    imgSrc: ["'self'", "data:", "https:"],
    // Images from self, data URIs, and HTTPS
    
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    // Fonts from self and Google Fonts
    
    connectSrc: ["'self'", "https://api.example.com"],
    // API calls to self and specific domain
  },
}
```

---

## 🔍 Input Validation & Sanitization

### Already Implemented!

We're using `class-validator` from Material 1-3:

```typescript
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
```

### Additional Validation

**Sanitize input (prevent XSS):**

```bash
npm install class-sanitizer
```

**Usage:**

```typescript
import { Trim, Sanitize } from 'class-sanitizer';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @Trim()  // ← Remove whitespace
  title: string;

  @IsString()
  @Sanitize()  // ← Remove HTML tags
  content: string;
}
```

### Custom Validation

**Create custom validator:**

```typescript
// src/common/validators/is-strong-password.validator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isStrongPassword', async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string) {
    // At least 8 characters
    if (password.length < 8) return false;
    
    // Contains uppercase
    if (!/[A-Z]/.test(password)) return false;
    
    // Contains lowercase
    if (!/[a-z]/.test(password)) return false;
    
    // Contains number
    if (!/\d/.test(password)) return false;
    
    // Contains special character
    if (!/[@$!%*?&]/.test(password)) return false;
    
    return true;
  }

  defaultMessage() {
    return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}
```

**Usage:**

```typescript
export class RegisterDto {
  @IsStrongPassword()
  password: string;
}
```

---

## 🌐 CORS Configuration

### What is CORS?

**CORS = Cross-Origin Resource Sharing**

Allows frontend (different domain) to call your API.

```
Frontend:    http://localhost:4200 (Angular)
Backend:     http://localhost:3000 (NestJS)
             ↑
         Different origins → CORS needed
```

### Enable CORS

**Edit `src/main.ts`:**

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Simple CORS (allow all origins)
  app.enableCors();

  // Or with options:
  app.enableCors({
    origin: 'http://localhost:4200',  // Allow this origin
    credentials: true,                 // Allow cookies
  });

  await app.listen(3000);
}
```

### Production CORS

```typescript
app.enableCors({
  origin: [
    'https://myapp.com',
    'https://www.myapp.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 3600,  // Cache preflight for 1 hour
});
```

### Dynamic CORS

```typescript
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:4200',
      'https://myapp.com',
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});
```

---

## 🎯 Security Best Practices

### 1. Environment Variables

✅ **Good:**
```typescript
// Use dotenv
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}

// Access secrets
process.env.JWT_SECRET
process.env.DATABASE_URL
```

❌ **Bad:**
```typescript
// Hardcoded secrets
const secret = 'my-secret-key';  // ❌
```

### 2. SQL Injection Prevention

✅ **Good (Prisma):**
```typescript
// Prisma uses parameterized queries by default
await prisma.user.findMany({
  where: { email: userInput }  // ✅ Safe
});
```

❌ **Bad (Raw SQL):**
```typescript
// String concatenation
const query = `SELECT * FROM users WHERE email = '${userInput}'`;
// ❌ Vulnerable to SQL injection!
```

### 3. XSS Prevention

✅ **Good:**
```typescript
// Validate and sanitize input
@IsString()
@Sanitize()  // Remove HTML tags
content: string;

// Escape output in frontend
{{ content | sanitize }}  // Angular
{DOMPurify.sanitize(content)}  // React
```

❌ **Bad:**
```typescript
// Directly rendering user input
<div innerHTML={userInput}></div>  // ❌ XSS vulnerability
```

### 4. Password Security

✅ **Good:**
```typescript
// Hash with bcrypt
const hashed = await bcrypt.hash(password, 10);

// Strong password requirements
@MinLength(8)
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
password: string;
```

❌ **Bad:**
```typescript
// Plain text passwords
password: 'password123'  // ❌

// Weak hashing
md5(password)  // ❌ Too fast, easily cracked
```

### 5. Token Management

✅ **Good:**
```typescript
// Short-lived access token
expiresIn: '15m'

// Long-lived refresh token
expiresIn: '7d'

// Store refresh token hashed
const hashed = await bcrypt.hash(refreshToken, 10);
```

❌ **Bad:**
```typescript
// Long-lived access token
expiresIn: '30d'  // ❌ Too long

// Store refresh token plain
refreshToken: token  // ❌ Not hashed
```

### 6. Error Messages

✅ **Good:**
```typescript
throw new UnauthorizedException('Invalid credentials');
// Generic message, doesn't reveal if email exists
```

❌ **Bad:**
```typescript
throw new UnauthorizedException('Email not found');
// ❌ Reveals email doesn't exist (helps attackers)

throw new UnauthorizedException('Wrong password');
// ❌ Reveals email exists (helps attackers)
```

### 7. Logging

✅ **Good:**
```typescript
// Log events, not sensitive data
logger.log(`User ${userId} logged in`);
logger.warn(`Failed login attempt for email: ${email}`);
```

❌ **Bad:**
```typescript
// Don't log passwords or tokens
logger.log(`Password: ${password}`);  // ❌
logger.log(`Token: ${token}`);  // ❌
```

### 8. HTTPS Only

```typescript
// Production only
if (process.env.NODE_ENV === 'production') {
  app.use(
    helmet({
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
      },
    }),
  );
}
```

### 9. Dependency Security

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Keep dependencies updated
npm update
```

### 10. Security Checklist

```
✅ Use HTTPS in production
✅ Hash passwords with bcrypt
✅ Use JWT for authentication
✅ Implement rate limiting
✅ Set security headers (Helmet)
✅ Enable CORS properly
✅ Validate all inputs
✅ Sanitize user content
✅ Use environment variables
✅ Implement RBAC/permissions
✅ Log security events
✅ Keep dependencies updated
✅ Use parameterized queries (Prisma)
✅ Implement refresh tokens
✅ Short access token expiration
```

---

## 📚 Kesimpulan

### Yang Sudah Dipelajari

✅ **Authentication vs Authorization** - Who vs What  
✅ **RBAC** - Role-based access control  
✅ **Roles Guard** - Protect routes by role  
✅ **Permission-based** - Granular permissions  
✅ **Rate limiting** - Prevent abuse  
✅ **Security headers** - Helmet configuration  
✅ **Input validation** - Prevent injection  
✅ **CORS** - Cross-origin requests  
✅ **Best practices** - Production security  

### Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. HTTPS                                               │
│     └─ Encrypt data in transit                          │
│                                                         │
│  2. Rate Limiting                                       │
│     └─ Prevent brute force / DDoS                       │
│                                                         │
│  3. Security Headers (Helmet)                           │
│     └─ Prevent XSS, clickjacking, etc.                  │
│                                                         │
│  4. CORS                                                │
│     └─ Control cross-origin access                      │
│                                                         │
│  5. Authentication (JWT)                                │
│     └─ Verify user identity                             │
│                                                         │
│  6. Authorization (RBAC)                                │
│     └─ Control user permissions                         │
│                                                         │
│  7. Input Validation                                    │
│     └─ Prevent injection attacks                        │
│                                                         │
│  8. Password Hashing                                    │
│     └─ Protect user credentials                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Complete Setup

```typescript
// main.ts - Production-ready setup
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Security headers
  app.use(helmet());

  // 2. CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  // 3. Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 4. Rate limiting (in AppModule)

  await app.listen(3000);
}
bootstrap();
```

---

**🎉 Selamat! Anda sudah menguasai Authorization & Security!**

**📖 Next:** Sample Project - Complete Blog API dengan semua features yang sudah dipelajari!
