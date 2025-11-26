# Chapter 17: Environment Configuration

## 🎯 Apa itu Environment Configuration?

**Environment Configuration** adalah cara mengelola settings yang berbeda untuk setiap environment (development, staging, production).

## 🌍 Why Use Environment Variables?

### ❌ Hardcoded Configuration (Bad)

```typescript
// ❌ DON'T DO THIS!
const config = {
  database: {
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'password123', // ❌ Password exposed!
  },
  jwt: {
    secret: 'super-secret-key', // ❌ Secret in code!
  },
  apiKey: 'sk_test_123456', // ❌ API key in code!
};

// Problems:
// 1. Secrets exposed in code
// 2. Same config for all environments
// 3. Hard to change without redeploying
// 4. Security risk if pushed to Git
```

### ✅ Environment Variables (Good)

```typescript
// ✅ DO THIS!
const config = {
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  apiKey: process.env.API_KEY,
};

// Benefits:
// 1. Secrets not in code
// 2. Different config per environment
// 3. Easy to change without redeploying
// 4. Safe to push to Git (.env in .gitignore)
```

## 📁 .env Files

### Create .env File

```bash
# .env (for development)
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=password123
DB_DATABASE=myapp_dev

# JWT
JWT_SECRET=dev-secret-key-not-for-production
JWT_EXPIRES_IN=1d

# API Keys
STRIPE_API_KEY=sk_test_xxxxxx
SENDGRID_API_KEY=SG.xxxxxx

# External APIs
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:4200
```

### Add to .gitignore

```bash
# .gitignore
.env
.env.local
.env.*.local
.env.production
.env.development
.env.test

# ✅ Never commit .env files!
```

### Create .env.example

```bash
# .env.example (template for other developers)
NODE_ENV=development
PORT=3000

# Database
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=

# API Keys
STRIPE_API_KEY=
SENDGRID_API_KEY=

# ✅ Commit this to Git (no secrets)
```

## 📦 Using @nestjs/config

### 1. Install Package

```bash
npm install @nestjs/config
```

### 2. Configure Module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ Available everywhere
      envFilePath: '.env', // ✅ Path to .env file
      cache: true, // ✅ Cache for performance
    }),
  ],
})
export class AppModule {}
```

### 3. Use ConfigService

```typescript
// users.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(private configService: ConfigService) {}

  getApiUrl() {
    // ✅ Type-safe way to get env vars
    return this.configService.get<string>('API_URL');
  }

  getPort() {
    // ✅ With default value
    return this.configService.get<number>('PORT', 3000);
  }

  getConfig() {
    return {
      apiUrl: this.configService.get('API_URL'),
      dbHost: this.configService.get('DB_HOST'),
      jwtSecret: this.configService.get('JWT_SECRET'),
    };
  }
}
```

## 🎨 Configuration Schema & Validation

### Using Joi for Validation

```bash
npm install joi
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // ✅ Validate environment variables
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        
        // Database
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        
        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('1d'),
        
        // API Keys
        STRIPE_API_KEY: Joi.string().when('NODE_ENV', {
          is: 'production',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      }),
    }),
  ],
})
export class AppModule {}

// ✅ If validation fails, app won't start!
// Error: Config validation error: "DB_HOST" is required
```

## 🔧 Custom Configuration Files

### 1. Create Config Files

```typescript
// config/database.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}));

// config/jwt.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
}));

// config/app.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  apiUrl: process.env.API_URL,
  frontendUrl: process.env.FRONTEND_URL,
}));
```

### 2. Load Config Files

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, appConfig], // ✅ Load config files
    }),
  ],
})
export class AppModule {}
```

### 3. Use Namespaced Config

```typescript
// database.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {}

  getConnection() {
    // ✅ Access namespaced config
    const dbConfig = this.configService.get('database');
    
    return {
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
    };
  }

  // ✅ Or access individual values
  getHost() {
    return this.configService.get('database.host');
  }
}
```

## 🌍 Multiple Environments

### Environment-Specific Files

```bash
# .env.development
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_DATABASE=myapp_dev
DEBUG=true

# .env.production
NODE_ENV=production
PORT=80
DB_HOST=prod-db.example.com
DB_DATABASE=myapp_prod
DEBUG=false

# .env.test
NODE_ENV=test
PORT=3001
DB_HOST=localhost
DB_DATABASE=myapp_test
DEBUG=true
```

### Load Based on Environment

```typescript
// app.module.ts
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath, // ✅ Load environment-specific file
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

### Multiple .env Files

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env.local', // ✅ Highest priority
        `.env.${process.env.NODE_ENV}`,
        '.env', // ✅ Lowest priority
      ],
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

## 🔒 Secrets Management

### Development (Local)

```bash
# .env
JWT_SECRET=dev-secret-not-for-production
API_KEY=test-api-key
```

### Production (Cloud)

```bash
# ✅ Use platform's secret management

# Render
# Dashboard → Environment → Add Environment Variable
JWT_SECRET=prod-secret-very-long-random-string
API_KEY=prod-api-key-xxx

# Heroku
heroku config:set JWT_SECRET=prod-secret
heroku config:set API_KEY=prod-api-key

# AWS
# Use AWS Secrets Manager or Parameter Store

# Docker
docker run -e JWT_SECRET=xxx -e API_KEY=yyy myapp
```

## 💡 Type-Safe Configuration

### Create Interface

```typescript
// config/configuration.interface.ts
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiUrl: string;
  frontendUrl: string;
}

export interface Configuration {
  database: DatabaseConfig;
  jwt: JwtConfig;
  app: AppConfig;
}
```

### Type-Safe Config Service

```typescript
// config/configuration.ts
import { Configuration } from './configuration.interface';

export default (): Configuration => ({
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    apiUrl: process.env.API_URL,
    frontendUrl: process.env.FRONTEND_URL,
  },
});

// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration], // ✅ Load typed config
      isGlobal: true,
    }),
  ],
})
export class AppModule {}

// Usage with type safety
@Injectable()
export class UsersService {
  constructor(private configService: ConfigService<Configuration>) {}

  getJwtSecret() {
    // ✅ Type-safe!
    return this.configService.get('jwt.secret', { infer: true });
  }
}
```

## 🎯 Real-World Example

```typescript
// config/configuration.ts
export default () => ({
  // App
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,

  // Database
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.NODE_ENV !== 'production', // ⚠️ Never in production!
    logging: process.env.NODE_ENV === 'development',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },

  // Email
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM,
  },

  // External APIs
  stripe: {
    apiKey: process.env.STRIPE_API_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET,
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:4200'],
    credentials: true,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
});

// app.module.ts
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        STRIPE_API_KEY: Joi.string().required(),
      }),
    }),
  ],
})
export class AppModule {}
```

## 📊 Summary

**Environment Configuration Best Practices:**
- ✅ Use environment variables for all config
- ✅ Never commit .env files
- ✅ Validate environment variables on startup
- ✅ Use ConfigService for type-safe access
- ✅ Create namespaced configurations
- ✅ Provide .env.example for team
- ✅ Use different .env files per environment
- ✅ Store secrets securely in production

**Remember:**
- Development settings ≠ Production settings
- Validate early, fail fast
- Type-safe configuration prevents bugs
- Use platform secret management in production

---

**Next Chapter:** CORS Configuration - Enable cross-origin requests! 🌐
