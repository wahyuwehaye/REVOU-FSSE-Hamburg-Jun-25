# 🚀 NestJS Database Setup with TypeORM

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Setup NestJS project dengan TypeORM
- ✅ Configure PostgreSQL database connection
- ✅ Understand TypeORM configuration options
- ✅ Setup environment variables untuk database
- ✅ Test database connectivity
- ✅ Configure multiple database connections
- ✅ Setup database for different environments (dev, staging, prod)

---

## 🎯 What is TypeORM?

**TypeORM** adalah ORM (Object-Relational Mapping) untuk TypeScript dan JavaScript.

**Analogy:**
Seperti translator yang mengubah:
- JavaScript/TypeScript objects ↔️ Database tables
- Object methods ↔️ SQL queries

**Benefits:**
- ✅ Write TypeScript instead of SQL
- ✅ Type safety
- ✅ Auto-complete in IDE
- ✅ Database agnostic (PostgreSQL, MySQL, SQLite, etc.)
- ✅ Migration support
- ✅ Relationship management

---

## 🛠️ Prerequisites

### 1. Install Node.js & npm

```bash
# Check if installed
node --version  # Should be v18+ or v20+
npm --version   # Should be v9+ or v10+

# If not installed, download from nodejs.org
```

### 2. Install PostgreSQL

```bash
# macOS
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Windows
# Download installer from postgresql.org
```

### 3. Verify PostgreSQL

```bash
# Check PostgreSQL is running
psql --version

# Connect to PostgreSQL
psql -U postgres

# Create database for our project
CREATE DATABASE nestjs_tutorial;

# Exit
\q
```

---

## 🚀 Create NestJS Project

### Step 1: Install NestJS CLI

```bash
npm install -g @nestjs/cli
```

### Step 2: Create New Project

```bash
# Create project
nest new nestjs-postgres-tutorial

# Choose package manager (npm recommended)
# Wait for installation...

# Navigate to project
cd nestjs-postgres-tutorial
```

### Step 3: Project Structure

```
nestjs-postgres-tutorial/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── node_modules/
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## 📦 Install TypeORM Dependencies

### Install Required Packages

```bash
# TypeORM and PostgreSQL driver
npm install @nestjs/typeorm typeorm pg

# Configuration management
npm install @nestjs/config

# Environment variables validation (optional but recommended)
npm install joi
```

**Package Explanation:**
- `@nestjs/typeorm` - NestJS wrapper for TypeORM
- `typeorm` - TypeORM library
- `pg` - PostgreSQL client for Node.js
- `@nestjs/config` - Environment configuration
- `joi` - Schema validation for env variables

---

## 🔧 Environment Configuration

### Step 1: Create .env File

```bash
# Create .env in project root
touch .env
```

### Step 2: Add Database Configuration

```env
# .env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_DATABASE=nestjs_tutorial

# Application
PORT=3000
NODE_ENV=development
```

### Step 3: Create .env.example (Template)

```env
# .env.example (for team members)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=
DB_DATABASE=nestjs_tutorial

PORT=3000
NODE_ENV=development
```

### Step 4: Update .gitignore

```bash
# Add to .gitignore
echo ".env" >> .gitignore
```

**⚠️ IMPORTANT:** Never commit .env to Git!

---

## 🔌 Configure TypeORM in NestJS

### Step 1: Create config Directory

```bash
mkdir src/config
```

### Step 2: Create database.config.ts

```typescript
// src/config/database.config.ts
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'nestjs_tutorial',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development', // ⚠️ Never true in production!
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  }),
);
```

### Step 3: Update app.module.ts

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),

    // Setup TypeORM with async configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => 
        configService.get('database'),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**Explanation:**
- `ConfigModule.forRoot()` - Loads .env file globally
- `TypeOrmModule.forRootAsync()` - Async database setup
- `useFactory` - Function to create TypeORM config
- `inject: [ConfigService]` - Inject ConfigService

---

## ✅ Test Database Connection

### Step 1: Update main.ts

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📊 Database: ${process.env.DB_DATABASE}`);
}
bootstrap();
```

### Step 2: Run Application

```bash
npm run start:dev
```

**Expected Output:**
```
[Nest] 12345  - 12/02/2024, 10:30:45 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 12/02/2024, 10:30:45 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345  - 12/02/2024, 10:30:45 AM     LOG [InstanceLoader] ConfigModule dependencies initialized
[Nest] 12345  - 12/02/2024, 10:30:46 AM     LOG [TypeOrmModule] Mapped {/, GET} route
[Nest] 12345  - 12/02/2024, 10:30:46 AM     LOG [Bootstrap] 🚀 Application is running on: http://localhost:3000
[Nest] 12345  - 12/02/2024, 10:30:46 AM     LOG [Bootstrap] 📊 Database: nestjs_tutorial
```

✅ If you see this, database connection successful!

---

## 🔒 Environment Variables Validation

### Create env.validation.ts

```typescript
// src/config/env.validation.ts
import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),

  // Application
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
});
```

### Update app.module.ts

```typescript
// src/app.module.ts
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
      validationSchema: envValidationSchema, // ← Add validation
      validationOptions: {
        abortEarly: true, // Stop on first error
      },
    }),
    // ... rest of imports
  ],
})
export class AppModule {}
```

**Now missing env variables will throw errors on startup!**

---

## 🎯 Configuration Options Explained

### synchronize

```typescript
synchronize: true  // ⚠️ DANGER in production!
```

**What it does:**
- Automatically creates/updates database schema
- Creates tables from entities
- Adds/removes columns

**Usage:**
- ✅ Development: `true` (convenient)
- ❌ Production: `false` (use migrations!)

### logging

```typescript
logging: true
```

**What it does:**
- Logs all SQL queries to console
- Useful for debugging

**Levels:**
```typescript
logging: true,                           // All queries
logging: ['query', 'error'],            // Only queries and errors
logging: ['error', 'warn'],             // Only errors and warnings
logging: false,                          // No logging
```

### entities

```typescript
entities: [__dirname + '/../**/*.entity{.ts,.js}']
```

**What it does:**
- Auto-discover all entity files
- Pattern matches `*.entity.ts` or `*.entity.js`

**Alternative:**
```typescript
entities: [User, Product, Order]  // Explicit list
```

### migrations

```typescript
migrations: [__dirname + '/../migrations/*{.ts,.js}']
```

**For production environments**

---

## 🌍 Multiple Environments Setup

### Create Environment Files

```bash
# Development
touch .env.development

# Staging
touch .env.staging

# Production
touch .env.production
```

### .env.development

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=dev_password
DB_DATABASE=nestjs_dev

PORT=3000
NODE_ENV=development
```

### .env.production

```env
DB_HOST=production-db.example.com
DB_PORT=5432
DB_USERNAME=prod_user
DB_PASSWORD=super_secure_password
DB_DATABASE=nestjs_prod

PORT=3000
NODE_ENV=production
```

### Update package.json Scripts

```json
{
  "scripts": {
    "start": "nest start",
    "start:dev": "NODE_ENV=development nest start --watch",
    "start:staging": "NODE_ENV=staging node dist/main",
    "start:prod": "NODE_ENV=production node dist/main"
  }
}
```

### Load Correct .env File

```typescript
// src/app.module.ts
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
  load: [databaseConfig],
  validationSchema: envValidationSchema,
})
```

---

## 🔄 Multiple Database Connections

### Scenario: Separate Read and Write Databases

```typescript
// src/config/database.config.ts
export default registerAs('database', () => ({
  // Primary (write) database
  primary: {
    type: 'postgres',
    host: process.env.DB_WRITE_HOST,
    port: parseInt(process.env.DB_WRITE_PORT, 10),
    username: process.env.DB_WRITE_USERNAME,
    password: process.env.DB_WRITE_PASSWORD,
    database: process.env.DB_WRITE_DATABASE,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
  },

  // Replica (read) database
  replica: {
    type: 'postgres',
    host: process.env.DB_READ_HOST,
    port: parseInt(process.env.DB_READ_PORT, 10),
    username: process.env.DB_READ_USERNAME,
    password: process.env.DB_READ_PASSWORD,
    database: process.env.DB_READ_DATABASE,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
  },
}));
```

### app.module.ts with Multiple Connections

```typescript
@Module({
  imports: [
    // Primary connection
    TypeOrmModule.forRootAsync({
      name: 'primary',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => 
        configService.get('database.primary'),
      inject: [ConfigService],
    }),

    // Replica connection
    TypeOrmModule.forRootAsync({
      name: 'replica',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => 
        configService.get('database.replica'),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

---

## 🐛 Troubleshooting

### Error: "password authentication failed"

```bash
# Check PostgreSQL user
psql -U postgres

# Set password
ALTER USER postgres WITH PASSWORD 'your_password';
```

### Error: "database does not exist"

```bash
# Create database
psql -U postgres
CREATE DATABASE nestjs_tutorial;
```

### Error: "ECONNREFUSED"

```bash
# Check if PostgreSQL is running
# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Start PostgreSQL
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Linux
```

### Error: "could not connect to server"

```env
# Check .env file
DB_HOST=localhost  # Not 127.0.0.1
DB_PORT=5432       # Correct port
```

### Enable Debug Logging

```typescript
// app.module.ts
TypeOrmModule.forRootAsync({
  // ... config
  logging: true,  // See all SQL queries
})
```

---

## 🧪 Create Health Check Endpoint

### Install Dependencies

```bash
npm install @nestjs/terminus
```

### Create health.controller.ts

```typescript
// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
```

### Create health.module.ts

```typescript
// src/health/health.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
```

### Update app.module.ts

```typescript
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // ... existing imports
    HealthModule,
  ],
})
export class AppModule {}
```

### Test Health Check

```bash
# Start app
npm run start:dev

# Test endpoint
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    }
  }
}
```

✅ Database is connected and healthy!

---

## 📝 Best Practices

### 1. Always Use Environment Variables

```typescript
// ❌ BAD: Hardcoded values
const config = {
  host: 'localhost',
  password: 'mypassword123',
};

// ✅ GOOD: Environment variables
const config = {
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
};
```

### 2. Validate Environment Variables

```typescript
// ✅ GOOD: Validation schema
validationSchema: Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
})
```

### 3. Never Commit .env

```bash
# .gitignore
.env
.env.*
!.env.example
```

### 4. Use synchronize: false in Production

```typescript
// ✅ GOOD
synchronize: process.env.NODE_ENV === 'development',
```

### 5. Enable Logging in Development Only

```typescript
// ✅ GOOD
logging: process.env.NODE_ENV === 'development',
```

### 6. Use Connection Pooling

```typescript
// database.config.ts
export default registerAs('database', () => ({
  // ... other config
  extra: {
    max: 20,              // Maximum connections in pool
    min: 5,               // Minimum connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
}));
```

---

## 🎯 Summary

**Setup Checklist:**

✅ Install NestJS CLI  
✅ Create new project  
✅ Install TypeORM & PostgreSQL driver  
✅ Create .env file  
✅ Configure database connection  
✅ Add environment validation  
✅ Test connection with health check  
✅ Setup multiple environments  

**Key Files:**
```
project/
├── .env                          # Environment variables
├── .env.example                  # Template for team
├── src/
│   ├── config/
│   │   ├── database.config.ts   # Database configuration
│   │   └── env.validation.ts    # Env validation
│   ├── health/
│   │   ├── health.controller.ts # Health check
│   │   └── health.module.ts
│   ├── app.module.ts            # Root module
│   └── main.ts                  # Entry point
```

**Configuration Options:**
- `synchronize` - Auto-sync schema (dev only!)
- `logging` - SQL query logging
- `entities` - Entity file pattern
- `migrations` - Migration files

**Next Step:**
👉 Lanjut ke [Materi 17: Entities & Repositories](./17-entities-repositories.md)

---

**Happy Coding! 🚀**
