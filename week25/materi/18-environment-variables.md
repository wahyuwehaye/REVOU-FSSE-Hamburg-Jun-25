# Environment Variables and Configuration Management

## Apa itu Environment Variables?

### Analogi: Kunci Rumah yang Berbeda

Bayangkan Anda punya 3 rumah:
- **Rumah Latihan** (Development) - Kunci biasa, boleh dipinjam teman
- **Rumah Kantor** (Staging) - Kunci dengan pin code
- **Rumah Emas** (Production) - Kunci super secure + biometric

**Environment Variables = Sistem kunci yang berbeda untuk setiap "rumah"**

Anda tidak ingin:
- Menaruh kunci rumah emas di tempat umum (Git repository)
- Menggunakan kunci yang sama untuk semua rumah
- Memberitahu semua orang kombinasi kunci Anda

## Why Environment Variables Matter

### The Problem with Hardcoded Values

```typescript
// ❌ SANGAT BERBAHAYA - Jangan lakukan ini!
export class AuthService {
  async login(user: User) {
    const token = jwt.sign(
      { id: user.id }, 
      'my-super-secret-key', // Hardcoded secret
      { expiresIn: '1h' }
    );
    return token;
  }
}

// Masalah:
// 1. Secret key terlihat di source code
// 2. Commit ke Git = semua orang bisa lihat
// 3. Tidak bisa beda per environment
// 4. Harus edit code untuk ganti secret
// 5. Security nightmare!
```

### The Solution with Environment Variables

```typescript
// ✅ AMAN - Menggunakan environment variables
export class AuthService {
  constructor(private configService: ConfigService) {}
  
  async login(user: User) {
    const token = jwt.sign(
      { id: user.id },
      this.configService.get('JWT_SECRET'), // Dari .env
      { expiresIn: this.configService.get('JWT_EXPIRES_IN') }
    );
    return token;
  }
}

// Keuntungan:
// 1. Secret tidak di source code
// 2. Tidak di-commit ke Git
// 3. Beda value per environment
// 4. Ganti value tanpa edit code
// 5. Secure dan flexible
```

## Setting Up Environment Variables

### 1. Create .env Files

```bash
# Project structure
project/
├── .env                    # Current environment (auto-loaded)
├── .env.development        # Development settings
├── .env.test              # Test settings
├── .env.production        # Production settings (NEVER commit!)
├── .env.example           # Template (safe to commit)
└── .gitignore             # Must include .env files
```

### 2. .gitignore Configuration

```bash
# .gitignore
# Environment variables
.env
.env.local
.env.development
.env.test
.env.production

# Keep only example
!.env.example
```

### 3. Example Environment File

```bash
# .env.example
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DATABASE_POOL_SIZE=10

# Authentication
JWT_SECRET=your-secret-key-here-minimum-32-characters
JWT_EXPIRES_IN=1h

# Application
PORT=3000
NODE_ENV=development

# External Services
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password

# Frontend
FRONTEND_URL=http://localhost:3001
```

## Essential Environment Variables

### 1. Database Configuration

```bash
# .env.development
DATABASE_URL=postgresql://localhost:5432/todo_dev
DATABASE_SSL=false
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20
DATABASE_CONNECTION_TIMEOUT=30000
```

```bash
# .env.production
DATABASE_URL=postgresql://user:pass@railway.app:5432/todo_prod?ssl=true
DATABASE_SSL=true
DATABASE_POOL_MIN=10
DATABASE_POOL_MAX=50
DATABASE_CONNECTION_TIMEOUT=60000
```

**Usage in NestJS:**

```typescript
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        ssl: config.get('DATABASE_SSL') === 'true' ? {
          rejectUnauthorized: false
        } : false,
        extra: {
          max: parseInt(config.get('DATABASE_POOL_MAX')),
          min: parseInt(config.get('DATABASE_POOL_MIN')),
          connectionTimeoutMillis: parseInt(config.get('DATABASE_CONNECTION_TIMEOUT')),
        },
        autoLoadEntities: true,
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
    }),
  ],
})
export class AppModule {}
```

### 2. JWT Configuration

```bash
# .env.development
JWT_SECRET=dev-secret-key-for-testing-only
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=dev-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d
```

```bash
# .env.production
JWT_SECRET=aVeryLongAndComplexProductionSecretKey123456789ABCDEF
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=anotherVeryLongRefreshSecretKey987654321FEDCBA
JWT_REFRESH_EXPIRES_IN=7d
```

**Usage:**

```typescript
// auth.module.ts
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
})
export class AuthModule {}
```

### 3. Application Configuration

```bash
# .env
# Server
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3001
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000

# Features
ENABLE_SWAGGER=true
ENABLE_DEBUG_LOGGING=true
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

**Usage:**

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  
  // CORS
  const allowedOrigins = config.get('ALLOWED_ORIGINS').split(',');
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  
  // Swagger (only in development)
  if (config.get('ENABLE_SWAGGER') === 'true') {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }
  
  // Port
  const port = config.get('PORT') || 3000;
  await app.listen(port);
  
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📝 Environment: ${config.get('NODE_ENV')}`);
}
```

### 4. External Services

```bash
# .env
# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@yourapp.com
SMTP_PASS=your-app-password

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=my-app-uploads

# Payment Gateway
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Analytics
GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
```

## Configuration Module Setup

### 1. Install Dependencies

```bash
npm install @nestjs/config
npm install --save-dev @types/node
```

### 2. Create Configuration Schema

```typescript
// config/configuration.ts
export default () => ({
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  
  // Database
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true',
    poolMin: parseInt(process.env.DATABASE_POOL_MIN, 10) || 5,
    poolMax: parseInt(process.env.DATABASE_POOL_MAX, 10) || 20,
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // CORS
  cors: {
    origins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
    enabled: process.env.CORS_ENABLED !== 'false',
  },
  
  // Features
  features: {
    swagger: process.env.ENABLE_SWAGGER === 'true',
    debugLogging: process.env.ENABLE_DEBUG_LOGGING === 'true',
  },
  
  // Rate Limiting
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
});
```

### 3. Validation Schema (Optional but Recommended)

```typescript
// config/validation.schema.ts
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Required variables
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .required(),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  
  // Optional with defaults
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  DATABASE_SSL: Joi.string().default('false'),
  
  // Conditional validation
  FRONTEND_URL: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});
```

### 4. Register Configuration Module

```typescript
// app.module.ts
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Available in all modules
      load: [configuration],
      validationSchema: validationSchema,
      validationOptions: {
        abortEarly: false, // Show all errors
      },
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      cache: true, // Cache config for performance
    }),
  ],
})
export class AppModule {}
```

## Using Configuration in Services

### Method 1: Constructor Injection

```typescript
// todos.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TodosService {
  private readonly maxTodos: number;
  
  constructor(private configService: ConfigService) {
    // Get configuration values in constructor
    this.maxTodos = this.configService.get<number>('features.maxTodosPerUser', 100);
  }
  
  async create(createTodoDto: CreateTodoDto, userId: number) {
    const currentCount = await this.countUserTodos(userId);
    
    if (currentCount >= this.maxTodos) {
      throw new BadRequestException(
        `Maximum ${this.maxTodos} todos per user reached`
      );
    }
    
    // Create todo...
  }
}
```

### Method 2: Direct Access

```typescript
// auth.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  
  async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    
    // Access token
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.expiresIn'),
    });
    
    // Refresh token
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    });
    
    return { accessToken, refreshToken };
  }
}
```

## Environment Variable Best Practices

### 1. Security

```bash
# ❌ DON'T - Weak secrets
JWT_SECRET=secret123
DATABASE_URL=postgresql://admin:admin@localhost/db

# ✅ DO - Strong, random secrets
JWT_SECRET=9k2j4h5g6f7d8s9a0p1o2i3u4y5t6r7e8w9q0
DATABASE_URL=postgresql://db_user_1x9k:Zx$9mK!p2Qw@db.railway.app/prod_db
```

### 2. Naming Conventions

```bash
# ✅ DO - Clear, consistent naming
DATABASE_URL=...
DATABASE_POOL_SIZE=20
DATABASE_POOL_MIN=5
DATABASE_SSL_ENABLED=true

JWT_SECRET=...
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=...

# ❌ DON'T - Inconsistent naming
DB=...
databasePoolSize=20
DBSSL=true
jwtExp=1h
```

### 3. Default Values

```typescript
// ✅ DO - Provide sensible defaults
const port = parseInt(process.env.PORT, 10) || 3000;
const logLevel = process.env.LOG_LEVEL || 'info';
const maxRetries = parseInt(process.env.MAX_RETRIES, 10) || 3;

// ❌ DON'T - Fail without defaults for optional values
const port = parseInt(process.env.PORT, 10); // undefined if not set
```

### 4. Type Conversion

```typescript
// ✅ DO - Proper type conversion
const poolSize = parseInt(process.env.DATABASE_POOL_SIZE, 10) || 20;
const sslEnabled = process.env.DATABASE_SSL === 'true';
const timeout = parseFloat(process.env.REQUEST_TIMEOUT) || 30.0;

// ❌ DON'T - Use strings for numbers/booleans
const poolSize = process.env.DATABASE_POOL_SIZE; // String "20"
const sslEnabled = process.env.DATABASE_SSL; // String "true", always truthy
```

### 5. Validation

```typescript
// ✅ DO - Validate required variables at startup
function validateEnv() {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
  
  // Validate JWT secret length
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }
}

// Call in main.ts before bootstrap
validateEnv();
bootstrap();
```

## Platform-Specific Configuration

### Railway

```bash
# Railway automatically provides:
# - DATABASE_URL (if Postgres plugin added)
# - PORT (assigned by Railway)

# Add manually in Railway dashboard:
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Vercel

```bash
# Add in Vercel project settings → Environment Variables
DATABASE_URL=postgresql://...
JWT_SECRET=...
FRONTEND_URL=https://your-app.vercel.app
```

### Docker

```dockerfile
# Dockerfile - Use ARG for build-time variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# docker-compose.yml - Use environment section
services:
  api:
    build: .
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    env_file:
      - .env.production
```

## Debugging Environment Variables

### Log Configuration at Startup

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  
  // Log configuration (hide sensitive values)
  console.log('🔧 Configuration loaded:');
  console.log('   Environment:', config.get('NODE_ENV'));
  console.log('   Port:', config.get('PORT'));
  console.log('   Database:', config.get('DATABASE_URL').replace(/:[^:@]+@/, ':***@'));
  console.log('   JWT Secret:', config.get('JWT_SECRET') ? '✓ Set' : '✗ Missing');
  console.log('   CORS Origins:', config.get('ALLOWED_ORIGINS'));
  
  await app.listen(config.get('PORT'));
}
```

### Health Check Endpoint

```typescript
// app.controller.ts
@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}
  
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      environment: this.configService.get('NODE_ENV'),
      timestamp: new Date().toISOString(),
      config: {
        database: !!this.configService.get('DATABASE_URL'),
        jwt: !!this.configService.get('JWT_SECRET'),
        cors: !!this.configService.get('ALLOWED_ORIGINS'),
      },
    };
  }
}
```

## Common Mistakes

### ❌ Mistake 1: Committing .env Files

```bash
# .gitignore - Make sure this is present!
.env
.env.local
.env.*.local
```

### ❌ Mistake 2: Not Validating Required Variables

```typescript
// App crashes at runtime when variable is accessed
const secret = process.env.JWT_SECRET; // undefined!
jwt.sign(payload, secret); // Error!

// ✅ Validate at startup instead
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}
```

### ❌ Mistake 3: Using Wrong Environment File

```bash
# Development uses production database!
npm run start:dev

# Check which env file is loaded
# .env.development should be used, not .env.production
```

### ❌ Mistake 4: Hardcoding Fallbacks for Secrets

```typescript
// ❌ Never do this
const secret = process.env.JWT_SECRET || 'default-secret';

// ✅ Fail fast instead
const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET must be provided');
}
```

## Summary

**Key Takeaways:**

1. 🔐 **Security First** - Never commit secrets, use strong random values
2. 📝 **Clear Naming** - Consistent, descriptive variable names
3. ✅ **Validation** - Validate required variables at startup
4. 🔄 **Different Environments** - Separate configs for dev/test/prod
5. 📚 **Documentation** - Maintain .env.example with all variables
6. 🎯 **Type Safety** - Convert strings to appropriate types
7. 🛡️ **Defaults** - Provide sensible defaults for optional values

**Checklist:**

- [ ] .env files in .gitignore
- [ ] .env.example committed with documentation
- [ ] All secrets are 32+ characters
- [ ] Required variables validated at startup
- [ ] Type conversion for numbers/booleans
- [ ] Different configs per environment
- [ ] No hardcoded secrets in code
- [ ] Health check endpoint includes config status

---

**Practice Exercise:**

1. Create .env.development, .env.test, and .env.example files
2. Set up ConfigModule with validation schema
3. Convert all hardcoded values to environment variables
4. Add validation for required variables
5. Create health check endpoint showing config status
6. Test with different environment files
