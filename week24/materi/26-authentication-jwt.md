# 🔐 Authentication dengan JWT

## 📋 Daftar Isi

1. [Pengantar](#pengantar)
2. [Authentication Concepts](#authentication-concepts)
3. [What is JWT?](#what-is-jwt)
4. [Setup Authentication](#setup-authentication)
5. [Password Hashing](#password-hashing)
6. [User Registration](#user-registration)
7. [User Login](#user-login)
8. [JWT Strategy](#jwt-strategy)
9. [Auth Guards](#auth-guards)
10. [Protecting Routes](#protecting-routes)
11. [Refresh Tokens](#refresh-tokens)
12. [Best Practices](#best-practices)

---

## 📖 Pengantar

Authentication adalah proses memverifikasi identitas user. Di material ini, kita akan implement complete authentication system menggunakan **JWT (JSON Web Token)** di NestJS dengan Prisma.

### 🎯 Tujuan Pembelajaran

✅ Understand authentication concepts  
✅ Implement password hashing dengan bcrypt  
✅ Create user registration flow  
✅ Create user login flow  
✅ Generate JWT tokens  
✅ Implement JWT strategy dengan Passport.js  
✅ Create authentication guards  
✅ Protect routes dengan guards  
✅ Implement refresh token  

### ⏱️ Estimasi Waktu

**Total:** 4-5 jam
- Teori & Setup: 1 jam
- Password Hashing: 30 menit
- Registration & Login: 1.5 jam
- JWT Strategy & Guards: 1.5 jam
- Refresh Token: 30 menit

---

## 🔐 Authentication Concepts

### What is Authentication?

**Authentication = Membuktikan siapa Anda**

```
Real-world analogy:
┌─────────────────────────────────────────────────────────┐
│                    AIRPORT SECURITY                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  You:       "Saya John Doe"                             │
│  Security:  "Tolong tunjukkan passport"                 │
│  You:       *shows passport*                            │
│  Security:  *verifies* "OK, confirmed"                  │
│                                                         │
│  Passport = Credentials (username + password)           │
│  Boarding pass = Token (JWT)                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
1. User provides credentials
   ├─ Email
   └─ Password
   
2. Server verifies credentials
   ├─ Check if user exists
   ├─ Verify password
   └─ If valid, generate token
   
3. Server returns token
   └─ JWT token
   
4. Client stores token
   ├─ localStorage
   ├─ sessionStorage
   └─ Cookies
   
5. Client sends token with requests
   └─ Authorization: Bearer <token>
   
6. Server validates token
   ├─ Verify signature
   ├─ Check expiration
   └─ Extract user info
```

### Visual Flow

```
┌──────────┐                          ┌──────────┐
│          │  1. Login (email+pass)   │          │
│  Client  │ ──────────────────────>  │  Server  │
│          │                          │          │
│          │  2. JWT Token            │          │
│          │ <──────────────────────  │          │
│          │                          │          │
│          │  3. Request + Token      │          │
│          │ ──────────────────────>  │          │
│          │                          │          │
│          │  4. Protected Data       │          │
│          │ <──────────────────────  │          │
└──────────┘                          └──────────┘
```

---

## 🎫 What is JWT?

### JWT Explained

**JWT = JSON Web Token**

Token yang contains:
- User information
- Signature untuk verification
- Expiration time

### JWT Structure

```
JWT = Header.Payload.Signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

┌─────────────────────────────────────────────────────────┐
│                    JWT COMPONENTS                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. HEADER                                              │
│     {                                                   │
│       "alg": "HS256",    // Algorithm                   │
│       "typ": "JWT"       // Token type                  │
│     }                                                   │
│                                                         │
│  2. PAYLOAD (Claims)                                    │
│     {                                                   │
│       "sub": "1",        // Subject (user ID)           │
│       "email": "john@example.com",                      │
│       "role": "user",                                   │
│       "iat": 1516239022, // Issued at                   │
│       "exp": 1516242622  // Expiration                  │
│     }                                                   │
│                                                         │
│  3. SIGNATURE                                           │
│     HMACSHA256(                                         │
│       base64UrlEncode(header) + "." +                   │
│       base64UrlEncode(payload),                         │
│       secret                                            │
│     )                                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Why JWT?

✅ **Stateless** - Server tidak perlu store sessions  
✅ **Scalable** - Works across multiple servers  
✅ **Self-contained** - Token contains all needed info  
✅ **Secure** - Cryptographically signed  
✅ **Portable** - Can be used across different domains  

### JWT vs Session

```
┌─────────────────────────────────────────────────────────┐
│                  SESSION-BASED AUTH                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Client                          Server                 │
│  ├─ Send credentials ───────>   ├─ Verify               │
│  │                              ├─ Create session       │
│  │                              └─ Store in DB/Redis    │
│  ├─ Receive session ID <────    └─ Return session ID    │
│  │                                                       │
│  ├─ Send session ID ────────>   ├─ Lookup session       │
│  └─ Get data <──────────────    └─ Verify & respond     │
│                                                         │
│  ❌ Server must store sessions (stateful)               │
│  ❌ Hard to scale horizontally                          │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     JWT-BASED AUTH                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Client                          Server                 │
│  ├─ Send credentials ───────>   ├─ Verify               │
│  │                              └─ Generate JWT         │
│  ├─ Receive JWT <───────────    └─ Return JWT           │
│  │                                                       │
│  ├─ Send JWT ───────────────>   ├─ Verify signature     │
│  └─ Get data <──────────────    └─ Extract & respond    │
│                                                         │
│  ✅ No server-side storage (stateless)                  │
│  ✅ Easy to scale horizontally                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Setup Authentication

### Install Dependencies

```bash
# JWT & Passport
npm install @nestjs/jwt @nestjs/passport passport passport-jwt

# Password hashing
npm install bcrypt

# Types
npm install -D @types/passport-jwt @types/bcrypt
```

### Update User Schema

Add fields for authentication:

```prisma
// prisma/schema.prisma

model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  name         String
  password     String    // ← Store hashed password
  role         String    @default("user")  // ← For authorization later
  refreshToken String?   // ← For refresh token (optional)
  
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  // Relations
  profile      Profile?
  posts        Post[]
  comments     Comment[]
  
  @@map("users")
}
```

**Run migration:**

```bash
npx prisma migrate dev --name add_auth_fields
```

### Create Auth Module

```bash
# Generate auth module
nest g module auth
nest g service auth
nest g controller auth

# Generate JWT strategy
nest g class auth/strategies/jwt.strategy --no-spec
```

### Configure JWT Module

**Edit `src/auth/auth.module.ts`:**

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', // ← Use env variable!
      signOptions: {
        expiresIn: '1h', // Token expires in 1 hour
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

**Add to `.env`:**

```env
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRATION=1h

# For refresh token
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRATION=7d
```

**⚠️ Important:** Use strong, random secret in production!

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🔒 Password Hashing

### Why Hash Passwords?

**❌ NEVER store plain passwords!**

```typescript
// ❌ BAD - Plain password
{
  email: 'john@example.com',
  password: 'password123'  // ← Anyone with DB access can see!
}

// ✅ GOOD - Hashed password
{
  email: 'john@example.com',
  password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXe...'  // ← Hashed!
}
```

### bcrypt Explained

**bcrypt = Hashing algorithm for passwords**

```
Plain Password: "password123"
       ↓
  bcrypt.hash()
       ↓
Hashed: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36..."

Properties:
✅ One-way (can't reverse)
✅ Same password → different hash (salt)
✅ Slow by design (prevents brute force)
```

### Hash Helper Service

**Create `src/auth/auth.service.ts`:**

```typescript
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Hash password
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Generate salt
    return bcrypt.hash(password, salt);    // Hash with salt
  }

  // Compare password
  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // ... more methods below
}
```

**📝 Penjelasan:**

```typescript
genSalt(10)
// Generate "salt" - random string
// 10 = work factor (higher = slower but more secure)
// Recommended: 10-12

hash(password, salt)
// Combine password + salt → hash
// Same password + different salt = different hash

compare(plainPassword, hashedPassword)
// Verify password without knowing original
// Returns true/false
```

---

## 📝 User Registration

### Registration DTO

**Create `src/auth/dto/register.dto.ts`:**

```typescript
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(50)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain uppercase, lowercase, number, and special character',
    },
  )
  password: string;
}
```

**📝 Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Register Method

**Add to `src/auth/auth.service.ts`:**

```typescript
async register(registerDto: RegisterDto) {
  // 1. Check if email already exists
  const existingUser = await this.prisma.user.findUnique({
    where: { email: registerDto.email },
  });

  if (existingUser) {
    throw new ConflictException('Email already registered');
  }

  // 2. Hash password
  const hashedPassword = await this.hashPassword(registerDto.password);

  // 3. Create user
  const user = await this.prisma.user.create({
    data: {
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: 'user', // Default role
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      // Don't return password!
    },
  });

  // 4. Generate tokens
  const tokens = await this.generateTokens(user.id, user.email, user.role);

  return {
    user,
    ...tokens,
  };
}
```

### Register Controller

**Add to `src/auth/auth.controller.ts`:**

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // ... more endpoints below
}
```

### Test Registration

**Request:**
```bash
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "name": "John Doe",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-12-09T10:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🔑 User Login

### Login DTO

**Create `src/auth/dto/login.dto.ts`:**

```typescript
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

### Login Method

**Add to `src/auth/auth.service.ts`:**

```typescript
async login(loginDto: LoginDto) {
  // 1. Find user by email
  const user = await this.prisma.user.findUnique({
    where: { email: loginDto.email },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // 2. Verify password
  const isPasswordValid = await this.comparePasswords(
    loginDto.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // 3. Generate tokens
  const tokens = await this.generateTokens(user.id, user.email, user.role);

  // 4. Update refresh token in database (optional)
  await this.updateRefreshToken(user.id, tokens.refreshToken);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    ...tokens,
  };
}
```

### Generate Tokens Method

```typescript
async generateTokens(userId: number, email: string, role: string) {
  const payload = {
    sub: userId,      // Subject (user ID)
    email: email,
    role: role,
  };

  const [accessToken, refreshToken] = await Promise.all([
    // Access token (short-lived)
    this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION || '1h',
    }),
    
    // Refresh token (long-lived)
    this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    }),
  ]);

  return {
    accessToken,
    refreshToken,
  };
}
```

### Update Refresh Token

```typescript
async updateRefreshToken(userId: number, refreshToken: string) {
  const hashedRefreshToken = await this.hashPassword(refreshToken);
  
  await this.prisma.user.update({
    where: { id: userId },
    data: { refreshToken: hashedRefreshToken },
  });
}
```

### Login Controller

**Add to `src/auth/auth.controller.ts`:**

```typescript
@Post('login')
@HttpCode(HttpStatus.OK)
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

### Test Login

**Request:**
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🛡️ JWT Strategy

### What is Strategy?

**Strategy = How Passport.js validates JWT**

```
Request with JWT
     ↓
JWT Strategy
     ├─ Extract token from header
     ├─ Verify signature
     ├─ Check expiration
     └─ Return user payload
     ↓
Attach user to request
     ↓
Route handler can access req.user
```

### Create JWT Strategy

**Edit `src/auth/strategies/jwt.strategy.ts`:**

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ↑ Extract JWT from "Authorization: Bearer <token>" header
      
      ignoreExpiration: false,
      // ↑ Reject expired tokens
      
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
      // ↑ Secret to verify signature
    });
  }

  async validate(payload: any) {
    // This method is called after JWT is verified
    // payload = decoded JWT payload
    
    // Optional: Check if user still exists
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return value will be attached to request as req.user
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
```

**📝 Penjelasan:**

```typescript
ExtractJwt.fromAuthHeaderAsBearerToken()
// Extract token from header:
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

ignoreExpiration: false
// Reject expired tokens automatically

secretOrKey: process.env.JWT_SECRET
// Secret to verify token signature

validate(payload)
// Called AFTER token verified
// Return value = req.user in route handler
```

---

## 🚪 Auth Guards

### What are Guards?

**Guards = Gatekeepers for routes**

```
Request → Guard → Route Handler
           ↓
        Allow or Deny?
```

### Create JWT Auth Guard

**Create `src/auth/guards/jwt-auth.guard.ts`:**

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // This guard uses 'jwt' strategy we created
}
```

That's it! Simple but powerful.

### How Guard Works

```
1. Client sends request with JWT
   Authorization: Bearer <token>

2. JwtAuthGuard intercepts request
   
3. Guard calls JwtStrategy
   ├─ Extract token
   ├─ Verify signature
   ├─ Check expiration
   └─ Call validate()
   
4. If valid:
   ├─ Attach user to request (req.user)
   └─ Allow request to proceed
   
5. If invalid:
   └─ Return 401 Unauthorized
```

---

## 🔐 Protecting Routes

### Use Guard on Route

**Example: Protected profile endpoint**

**Edit `src/users/users.controller.ts`:**

```typescript
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Public route (no guard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // Protected route (with guard)
  @Get('profile')
  @UseGuards(JwtAuthGuard)  // ← Apply guard
  getProfile(@Req() req) {
    // req.user is available (from JwtStrategy.validate())
    return req.user;
  }

  // Protected route with user from guard
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Req() req) {
    const userId = req.user.userId;
    return this.usersService.findOne(userId);
  }
}
```

### Test Protected Route

**Without token (❌ Unauthorized):**
```bash
GET http://localhost:3000/users/profile

Response: 401 Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**With token (✅ Success):**
```bash
GET http://localhost:3000/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response: 200 OK
{
  "userId": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "role": "user"
}
```

### Custom Decorator for User

Create custom decorator untuk cleaner code:

**Create `src/auth/decorators/current-user.decorator.ts`:**

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

**Usage:**

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user) {
  // user = req.user dari JwtStrategy
  return user;
}

@Get('me')
@UseGuards(JwtAuthGuard)
async getMyProfile(@CurrentUser() user) {
  return this.usersService.findOne(user.userId);
}
```

**Much cleaner!** ✨

### Protect Entire Controller

```typescript
@Controller('posts')
@UseGuards(JwtAuthGuard)  // ← Apply to all routes
export class PostsController {
  // All routes in this controller are protected
  
  @Get()
  findAll() {
    // Protected
  }

  @Post()
  create() {
    // Protected
  }
  
  // To make a route public:
  @Get('public')
  @Public()  // ← Custom decorator (we'll create)
  findPublic() {
    // Public
  }
}
```

### Public Decorator

**Create `src/auth/decorators/public.decorator.ts`:**

```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

**Update guard to respect @Public():**

**Edit `src/auth/guards/jwt-auth.guard.ts`:**

```typescript
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if route has @Public() decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;  // Skip authentication
    }

    return super.canActivate(context);
  }
}
```

---

## 🔄 Refresh Tokens

### Why Refresh Tokens?

```
Problem:
- Access token short-lived (1 hour)
- User has to login again every hour
- Bad user experience

Solution:
- Access token: Short-lived (1 hour)
- Refresh token: Long-lived (7 days)
- Use refresh token to get new access token
```

### Refresh Token Flow

```
1. User logs in
   ↓
2. Receive access token (1h) + refresh token (7d)
   ↓
3. Use access token for requests
   ↓
4. Access token expires
   ↓
5. Send refresh token to /auth/refresh
   ↓
6. Receive new access token + refresh token
   ↓
7. Continue using app
```

### Refresh Token DTO

**Create `src/auth/dto/refresh-token.dto.ts`:**

```typescript
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
```

### Refresh Method

**Add to `src/auth/auth.service.ts`:**

```typescript
async refreshTokens(refreshTokenDto: RefreshTokenDto) {
  try {
    // 1. Verify refresh token
    const payload = await this.jwtService.verifyAsync(
      refreshTokenDto.refreshToken,
      {
        secret: process.env.JWT_REFRESH_SECRET,
      },
    );

    // 2. Get user
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 3. Verify refresh token matches stored one
    const refreshTokenMatches = await this.comparePasswords(
      refreshTokenDto.refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 4. Generate new tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // 5. Update stored refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  } catch (error) {
    throw new UnauthorizedException('Invalid refresh token');
  }
}
```

### Refresh Controller

**Add to `src/auth/auth.controller.ts`:**

```typescript
@Post('refresh')
@HttpCode(HttpStatus.OK)
async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
  return this.authService.refreshTokens(refreshTokenDto);
}
```

### Logout Method

**Add to `src/auth/auth.service.ts`:**

```typescript
async logout(userId: number) {
  // Clear refresh token from database
  await this.prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  return { message: 'Logged out successfully' };
}
```

**Add to controller:**

```typescript
@Post('logout')
@UseGuards(JwtAuthGuard)
@HttpCode(HttpStatus.OK)
async logout(@CurrentUser() user) {
  return this.authService.logout(user.userId);
}
```

---

## 🎯 Best Practices

### 1. Use Strong Secrets

✅ **Good:**
```env
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=8f4e7d3c2b1a0987654321fedcba9876543210fedcba987654321fedcba9876
```

❌ **Bad:**
```env
JWT_SECRET=secret
JWT_SECRET=mysecret123
```

### 2. Short Access Token Expiration

✅ **Good:**
```typescript
expiresIn: '15m'  // 15 minutes
expiresIn: '1h'   // 1 hour
```

❌ **Bad:**
```typescript
expiresIn: '30d'  // 30 days (too long!)
```

### 3. Never Expose Password

✅ **Good:**
```typescript
const user = await prisma.user.create({
  data: { ... },
  select: {
    id: true,
    email: true,
    name: true,
    // password NOT selected
  },
});
```

❌ **Bad:**
```typescript
const user = await prisma.user.create({
  data: { ... },
  // Returns ALL fields including password!
});
```

### 4. Validate Token on Important Actions

```typescript
// For sensitive operations, verify token is still valid
@Delete('account')
@UseGuards(JwtAuthGuard)
async deleteAccount(@CurrentUser() user) {
  // Re-verify user before deletion
  const currentUser = await this.prisma.user.findUnique({
    where: { id: user.userId }
  });
  
  if (!currentUser) {
    throw new UnauthorizedException();
  }
  
  // Proceed with deletion
}
```

### 5. Implement Rate Limiting

```typescript
// Prevent brute force attacks
@Post('login')
@Throttle(5, 60)  // 5 attempts per 60 seconds
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

(We'll implement this in Material 4!)

### 6. Use HTTPS in Production

```
❌ HTTP: Token can be intercepted
✅ HTTPS: Token encrypted in transit
```

### 7. Store Tokens Securely in Client

```typescript
// ✅ Good options:
// 1. Memory (most secure, lost on refresh)
// 2. httpOnly cookie (secure, can't access via JS)

// ❌ Bad:
// 1. localStorage (vulnerable to XSS)
// 2. sessionStorage (vulnerable to XSS)
```

---

## 📚 Kesimpulan

### Yang Sudah Dipelajari

✅ **Authentication concepts** - Login, tokens, credentials  
✅ **JWT explained** - Structure, benefits, usage  
✅ **Password hashing** - bcrypt, salt, verification  
✅ **User registration** - Validation, creation, tokens  
✅ **User login** - Verification, token generation  
✅ **JWT Strategy** - Passport.js integration  
✅ **Auth guards** - Protecting routes  
✅ **Refresh tokens** - Long-lived sessions  
✅ **Best practices** - Security, validation  

### Complete Auth Flow

```
┌─────────────────────────────────────────────────────────┐
│                  COMPLETE AUTH FLOW                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. REGISTRATION                                        │
│     Client → POST /auth/register                        │
│     Server → Hash password → Create user → Return tokens│
│                                                         │
│  2. LOGIN                                               │
│     Client → POST /auth/login                           │
│     Server → Verify credentials → Return tokens         │
│                                                         │
│  3. PROTECTED REQUEST                                   │
│     Client → GET /users/profile (+ Bearer token)        │
│     Server → JwtStrategy → Verify → Return data         │
│                                                         │
│  4. TOKEN EXPIRED                                       │
│     Client → POST /auth/refresh (+ refresh token)       │
│     Server → Verify refresh → Return new tokens         │
│                                                         │
│  5. LOGOUT                                              │
│     Client → POST /auth/logout                          │
│     Server → Clear refresh token                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Key Components

```typescript
// 1. Hash passwords
bcrypt.hash(password, salt)

// 2. Verify passwords
bcrypt.compare(plain, hashed)

// 3. Generate JWT
jwtService.signAsync(payload, { secret, expiresIn })

// 4. Verify JWT (automatic via Strategy)
PassportStrategy(Strategy, 'jwt')

// 5. Protect routes
@UseGuards(JwtAuthGuard)

// 6. Get current user
@CurrentUser() user
```

---

**🎉 Selamat! Anda sudah menguasai Authentication dengan JWT!**

**📖 Next:** Material 4 - Authorization (RBAC), Security Best Practices, Rate Limiting

