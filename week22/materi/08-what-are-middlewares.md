# Chapter 8: What are Middlewares?

## 🎯 Definisi Middleware

**Middleware** adalah function yang dipanggil **sebelum route handler** (controller method). Middleware memiliki akses ke:
- Request object (`req`)
- Response object (`res`) 
- Next middleware function (`next`)

## 📊 Middleware dalam Request Flow

```
CLIENT REQUEST
      ↓
┌──────────────────┐
│   MIDDLEWARE 1   │ ← Logger
│   (Global)       │
└────────┬─────────┘
         ↓
┌──────────────────┐
│   MIDDLEWARE 2   │ ← Authentication
│   (Route-level)  │
└────────┬─────────┘
         ↓
┌──────────────────┐
│   GUARD          │ ← Authorization
└────────┬─────────┘
         ↓
┌──────────────────┐
│   INTERCEPTOR    │ ← Transform Request
└────────┬─────────┘
         ↓
┌──────────────────┐
│   PIPE           │ ← Validate
└────────┬─────────┘
         ↓
┌──────────────────┐
│   CONTROLLER     │ ← Route Handler
└────────┬─────────┘
         ↓
┌──────────────────┐
│   SERVICE        │ ← Business Logic
└────────┬─────────┘
         ↓
    RESPONSE
```

## 🎭 Middleware Use Cases

### 1. Logging

Log semua incoming requests

```typescript
// middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Pass control to next middleware
  }
}
```

### 2. Authentication

Verify user authentication

```typescript
// middleware/auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req['user'] = decoded; // Attach user to request
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```

### 3. CORS

Handle Cross-Origin Resource Sharing

```typescript
// middleware/cors.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  }
}
```

### 4. Request Body Parsing

Parse dan validate request body

```typescript
// middleware/body-parser.middleware.ts
import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class BodyParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new BadRequestException('Request body is required');
      }
    }
    next();
  }
}
```

### 5. Rate Limiting

Limit request rate per IP

```typescript
// middleware/rate-limit.middleware.ts
import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requests = new Map<string, { count: number; resetTime: number }>();

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 100; // 100 requests per minute

    if (!this.requests.has(ip)) {
      this.requests.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const requestData = this.requests.get(ip);

    if (now > requestData.resetTime) {
      // Reset window
      this.requests.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (requestData.count >= maxRequests) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    requestData.count++;
    next();
  }
}
```

## 🔄 Middleware Lifecycle

### request → middleware → next() → controller

```typescript
@Injectable()
export class ExampleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Before request handler');
    
    // Do something with request
    req['timestamp'] = Date.now();
    
    next(); // IMPORTANT: Call next() to pass control
    
    console.log('After request handler'); // This won't execute!
  }
}
```

### ⚠️ Important: Always Call `next()`

```typescript
// ❌ BAD: Forgot to call next()
@Injectable()
export class BadMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Logging request');
    // Missing next()! Request will hang!
  }
}

// ✅ GOOD: Always call next()
@Injectable()
export class GoodMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Logging request');
    next(); // ✅ Pass control to next middleware
  }
}
```

## 🎨 Functional Middleware

Selain class-based, bisa juga menggunakan functional middleware:

```typescript
// middleware/simple-logger.middleware.ts
import { Request, Response, NextFunction } from 'express';

export function simpleLogger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
}
```

## 📝 Registering Middleware

### 1. Module-level Registration

```typescript
// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
```

### 2. Specific Routes

```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users'); // Only /users routes
  }
}
```

### 3. Multiple Middlewares

```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, CorsMiddleware, AuthMiddleware)
      .forRoutes('users');
  }
}
```

### 4. Exclude Routes

```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'users/login', method: RequestMethod.POST },
        { path: 'users/register', method: RequestMethod.POST },
      )
      .forRoutes('users');
  }
}
```

### 5. Controller-specific

```typescript
import { UsersController } from './users/users.controller';

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(UsersController); // Only for UsersController
  }
}
```

### 6. Method-specific

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

## 🔍 Middleware vs Guards vs Interceptors

| Feature | Middleware | Guard | Interceptor |
|---------|-----------|-------|-------------|
| **Execution Time** | Before request | After middleware | Before & after handler |
| **Purpose** | General processing | Authorization | Transform request/response |
| **Can stop request?** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Access to ExecutionContext?** | ❌ No | ✅ Yes | ✅ Yes |
| **Can transform response?** | ✅ Yes (manually) | ❌ No | ✅ Yes (easy) |
| **DI Support** | ✅ Yes | ✅ Yes | ✅ Yes |

## 💡 When to Use Middleware?

### ✅ Use Middleware for:

1. **Logging** - Log all requests
2. **CORS** - Handle cross-origin requests  
3. **Body Parsing** - Parse request bodies
4. **Session Management** - Handle sessions
5. **Rate Limiting** - Limit request rates
6. **Request ID** - Attach unique ID to requests
7. **Compression** - Compress responses

### ❌ Don't Use Middleware for:

1. **Route-specific logic** → Use Guards or Interceptors
2. **Response transformation** → Use Interceptors
3. **Validation** → Use Pipes
4. **Authorization** → Use Guards

## 🧪 Testing Middleware

```typescript
// logger.middleware.spec.ts
import { LoggerMiddleware } from './logger.middleware';
import { Request, Response, NextFunction } from 'express';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    middleware = new LoggerMiddleware();
    mockRequest = {
      method: 'GET',
      url: '/users',
    };
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should call next function', () => {
    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should log request', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );
    expect(consoleSpy).toHaveBeenCalled();
  });
});
```

## 🎯 Practical Example: Complete Request Tracking

```typescript
// middleware/request-tracking.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestTrackingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Generate unique request ID
    const requestId = uuidv4();
    req['requestId'] = requestId;

    // Log request start
    const start = Date.now();
    console.log(`[${requestId}] --> ${req.method} ${req.url}`);

    // Log response when finished
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(
        `[${requestId}] <-- ${req.method} ${req.url} ${res.statusCode} ${duration}ms`,
      );
    });

    next();
  }
}

// Output:
// [abc-123] --> GET /users
// [abc-123] <-- GET /users 200 45ms
```

## 📊 Summary

Middleware adalah:
- ✅ Function yang dipanggil sebelum route handler
- ✅ Memiliki akses ke req, res, next
- ✅ Bisa memodifikasi request/response
- ✅ Harus memanggil `next()` untuk melanjutkan
- ✅ Ideal untuk cross-cutting concerns (logging, CORS, auth)

---

**Next Chapter:** Types of Middlewares (Global, Module, Route)! 🔄
