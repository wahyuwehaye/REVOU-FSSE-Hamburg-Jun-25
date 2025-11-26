# Chapter 9: Types of Middlewares (Global, Module, Route)

## 🎯 Overview

NestJS mendukung beberapa level middleware application:
1. **Global Middleware** - Apply ke semua routes
2. **Module Middleware** - Apply ke routes dalam module tertentu  
3. **Route Middleware** - Apply ke specific routes
4. **Functional Middleware** - Simple function-based middleware

## 🌍 1. Global Middleware

Apply ke **semua routes** di aplikasi.

### Method 1: Using `app.use()` (Express-style)

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global middleware - applies to ALL routes
  app.use(logger);
  
  await app.listen(3000);
}
bootstrap();

// middleware/logger.middleware.ts (Functional)
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`[Global] ${req.method} ${req.url}`);
  next();
}
```

### Method 2: Using Module Configuration

```typescript
// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // '*' = all routes
  }
}
```

### Multiple Global Middlewares

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Apply multiple middlewares in order
  app.use(logger);
  app.use(cors());
  app.use(requestId);
  app.use(rateLimit);
  
  await app.listen(3000);
}
```

## 📦 2. Module Middleware

Apply ke routes yang didefinisikan dalam **specific module**.

### Basic Module Middleware

```typescript
// users/users.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(UsersController); // Only for UsersController
  }
}
```

### Module Middleware for Multiple Controllers

```typescript
// users/users.module.ts
@Module({
  controllers: [UsersController, ProfileController, SettingsController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        UsersController,
        ProfileController,
        SettingsController,
      );
  }
}
```

### Module Middleware with Exclusions

```typescript
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'users/register', method: RequestMethod.POST },
        { path: 'users/login', method: RequestMethod.POST },
        'users/public/(.*)', // Regex pattern
      )
      .forRoutes(UsersController);
  }
}
```

## 🎯 3. Route-Specific Middleware

Apply ke **specific routes** atau **HTTP methods**.

### Specific Path

```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users'); // Only /users/*
  }
}
```

### Specific Path + Method

```typescript
import { RequestMethod } from '@nestjs/common';

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.POST },
        { path: 'users/:id', method: RequestMethod.PATCH },
        { path: 'users/:id', method: RequestMethod.DELETE },
      );
  }
}
```

### Wildcard Routes

```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        'users/*',      // All routes under /users
        'products/*',   // All routes under /products
        'api/v1/*',     // All routes under /api/v1
      );
  }
}
```

### Regex Pattern Matching

```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        { path: 'ab*cd', method: RequestMethod.ALL }, // abcd, ab_cd, abecd, etc.
        { path: 'users/(.*)', method: RequestMethod.GET }, // All GET under /users
      );
  }
}
```

## 🔧 4. Functional Middleware

Simple function-based middleware tanpa class.

### Basic Functional Middleware

```typescript
// middleware/simple-logger.ts
import { Request, Response, NextFunction } from 'express';

export function simpleLogger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
}

// Use in module
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(simpleLogger)
      .forRoutes('*');
  }
}
```

### Functional Middleware with Parameters

```typescript
// middleware/logger-factory.ts
import { Request, Response, NextFunction } from 'express';

export function loggerFactory(prefix: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${prefix}] ${req.method} ${req.url}`);
    next();
  };
}

// Use in main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(loggerFactory('API'));
  
  await app.listen(3000);
}
```

## 🔄 Middleware Execution Order

### Order Matters!

```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        LoggerMiddleware,      // 1st - Log request
        CorsMiddleware,        // 2nd - Handle CORS
        AuthMiddleware,        // 3rd - Authenticate
        RateLimitMiddleware,   // 4th - Check rate limit
      )
      .forRoutes('*');
  }
}

// Execution flow:
// Request → Logger → CORS → Auth → RateLimit → Controller
```

### Global + Module Middlewares Order

```typescript
// main.ts
app.use(globalLogger);        // 1st

// app.module.ts
consumer
  .apply(moduleLogger)        // 2nd
  .forRoutes('*');

// users.module.ts
consumer
  .apply(userLogger)          // 3rd
  .forRoutes(UsersController);

// Execution for /users request:
// globalLogger → moduleLogger → userLogger → Controller
```

## 🎨 Advanced Patterns

### Conditional Middleware

```typescript
// middleware/conditional-logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ConditionalLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Only log non-health-check requests
    if (!req.url.includes('/health')) {
      console.log(`${req.method} ${req.url}`);
    }
    next();
  }
}
```

### Dynamic Middleware Loading

```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const middlewares = [LoggerMiddleware];
    
    // Add auth middleware only in production
    if (process.env.NODE_ENV === 'production') {
      middlewares.push(AuthMiddleware);
    }
    
    consumer
      .apply(...middlewares)
      .forRoutes('*');
  }
}
```

### Middleware with Dependency Injection

```typescript
// middleware/auth-with-service.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthWithServiceMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Use injected service
    const user = await this.usersService.validateToken(token);
    
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    req['user'] = user;
    next();
  }
}
```

## 📊 Comparison Table

| Type | Scope | Use Case | Configuration |
|------|-------|----------|---------------|
| **Global** | All routes | CORS, logging, compression | `main.ts` or `AppModule` |
| **Module** | Module routes | Module-specific auth, logging | Module's `configure()` |
| **Route** | Specific routes | Route-specific validation | `forRoutes()` with path |
| **Functional** | Any scope | Simple transformations | Function export |

## 💡 Best Practices

### ✅ DO:

```typescript
// 1. Use Global for cross-cutting concerns
app.use(logger);
app.use(cors());

// 2. Use Module for module-specific logic
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes(UsersController);
  }
}

// 3. Use Route for specific endpoint protection
consumer
  .apply(AdminMiddleware)
  .forRoutes({ path: 'admin/*', method: RequestMethod.ALL });

// 4. Exclude public routes from auth
consumer
  .apply(AuthMiddleware)
  .exclude('auth/login', 'auth/register')
  .forRoutes('*');
```

### ❌ DON'T:

```typescript
// 1. Don't apply expensive operations globally
app.use(expensiveDatabaseCheckMiddleware); // ❌ Slow for ALL routes!

// 2. Don't forget to call next()
use(req, res, next) {
  console.log('Log');
  // ❌ Missing next()! Request hangs!
}

// 3. Don't put business logic in middleware
use(req, res, next) {
  // ❌ Business logic should be in service!
  await this.calculateComplexStuff();
  next();
}
```

## 🧪 Testing Different Middleware Types

```typescript
// global-middleware.spec.ts
describe('Global Middleware', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.use(logger); // Apply global middleware
    await app.init();
  });

  it('should apply to all routes', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200);
  });
});
```

## 🎯 Practical Example: Complete App Setup

```typescript
// main.ts - Global middlewares
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global middlewares
  app.use(helmet());              // Security
  app.use(compression());         // Compression
  app.use(morgan('combined'));    // Logging
  
  await app.listen(3000);
}

// app.module.ts - App-level middlewares
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, LoggerMiddleware)
      .forRoutes('*');
      
    consumer
      .apply(RateLimitMiddleware)
      .exclude('health', 'metrics')
      .forRoutes('*');
  }
}

// users.module.ts - Module-level middlewares
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'users/register', method: RequestMethod.POST },
        { path: 'users/login', method: RequestMethod.POST },
      )
      .forRoutes(UsersController);
  }
}
```

## 📊 Summary

- **Global**: Cross-cutting concerns (CORS, compression, logging)
- **Module**: Module-specific logic (module auth, module logging)
- **Route**: Specific route protection (admin routes, specific methods)
- **Functional**: Simple, reusable functions

Choose the right level based on scope and reusability needs!

---

**Next Chapter:** Custom Middleware Implementation! 🎨
