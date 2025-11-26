# Chapter 10: Custom Middleware Implementation

## 🎯 Creating Custom Middlewares

Custom middleware memungkinkan kita membuat logic yang specific untuk kebutuhan aplikasi.

## 🏗️ Basic Structure

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CustomMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Your custom logic here
    next();
  }
}
```

## 📝 Real-World Examples

### 1. Request ID Middleware

Generate unique ID untuk setiap request:

```typescript
// middleware/request-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = uuidv4();
    
    // Attach to request
    req['requestId'] = requestId;
    
    // Add to response header
    res.setHeader('X-Request-ID', requestId);
    
    next();
  }
}

// Use in controller
@Get()
findAll(@Request() req) {
  console.log(`Request ID: ${req.requestId}`);
  return this.usersService.findAll();
}
```

### 2. Response Time Middleware

Measure dan log response time:

```typescript
// middleware/response-time.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ResponseTimeMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ResponseTimeMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(
        `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}

// Output:
// [ResponseTimeMiddleware] GET /users 200 - 45ms
// [ResponseTimeMiddleware] POST /users 201 - 120ms
```

### 3. API Key Validation Middleware

```typescript
// middleware/api-key.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = this.configService.get('API_KEY');

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    next();
  }
}
```

### 4. IP Whitelist Middleware

```typescript
// middleware/ip-whitelist.middleware.ts
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpWhitelistMiddleware implements NestMiddleware {
  private readonly whitelist = [
    '127.0.0.1',
    '::1',
    '192.168.1.100',
  ];

  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = req.ip || req.connection.remoteAddress;

    if (!this.whitelist.includes(clientIp)) {
      throw new ForbiddenException(
        `Access denied for IP: ${clientIp}`,
      );
    }

    next();
  }
}
```

### 5. User Agent Detection Middleware

```typescript
// middleware/user-agent.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UserAgentMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userAgent = req.headers['user-agent'] || '';
    
    req['deviceInfo'] = {
      isMobile: /mobile/i.test(userAgent),
      isTablet: /tablet/i.test(userAgent),
      isDesktop: !/mobile|tablet/i.test(userAgent),
      browser: this.detectBrowser(userAgent),
    };

    next();
  }

  private detectBrowser(ua: string): string {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }
}
```

### 6. Request Body Sanitization Middleware

```typescript
// middleware/sanitize-body.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SanitizeBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body && typeof req.body === 'object') {
      req.body = this.sanitizeObject(req.body);
    }
    next();
  }

  private sanitizeObject(obj: any): any {
    const sanitized = {};
    
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove HTML tags
        sanitized[key] = obj[key].replace(/<[^>]*>/g, '').trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitized[key] = this.sanitizeObject(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }
    
    return sanitized;
  }
}
```

### 7. Database Transaction Middleware

```typescript
// middleware/transaction.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  constructor(private readonly dataSource: DataSource) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    req['queryRunner'] = queryRunner;

    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        await queryRunner.commitTransaction();
      } else {
        await queryRunner.rollbackTransaction();
      }
      await queryRunner.release();
    });

    next();
  }
}
```

### 8. Request Logging Middleware (Advanced)

```typescript
// middleware/advanced-logger.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdvancedLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AdvancedLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const start = Date.now();

    // Log request
    this.logger.log(
      `Incoming: ${method} ${originalUrl} - IP: ${ip} - UA: ${userAgent}`,
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      const contentLength = res.get('content-length') || 0;

      this.logger.log(
        `Completed: ${method} ${originalUrl} ${statusCode} - ${duration}ms - ${contentLength}bytes`,
      );
    });

    next();
  }
}
```

### 9. Rate Limiting with Redis

```typescript
// middleware/redis-rate-limit.middleware.ts
import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Redis } from 'ioredis';

@Injectable()
export class RedisRateLimitMiddleware implements NestMiddleware {
  private redis: Redis;
  
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const key = `rate-limit:${ip}`;
    const limit = 100; // 100 requests
    const window = 60; // per minute

    const current = await this.redis.incr(key);
    
    if (current === 1) {
      await this.redis.expire(key, window);
    }

    if (current > limit) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    res.setHeader('X-RateLimit-Limit', limit.toString());
    res.setHeader('X-RateLimit-Remaining', (limit - current).toString());

    next();
  }
}
```

### 10. Content Negotiation Middleware

```typescript
// middleware/content-negotiation.middleware.ts
import { Injectable, NestMiddleware, NotAcceptableException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ContentNegotiationMiddleware implements NestMiddleware {
  private readonly supportedTypes = ['application/json', 'application/xml'];

  use(req: Request, res: Response, next: NextFunction) {
    const acceptHeader = req.headers.accept || 'application/json';
    
    const isSupported = this.supportedTypes.some(type => 
      acceptHeader.includes(type)
    );

    if (!isSupported) {
      throw new NotAcceptableException(
        `Supported content types: ${this.supportedTypes.join(', ')}`,
      );
    }

    req['acceptType'] = acceptHeader.includes('xml') ? 'xml' : 'json';
    next();
  }
}
```

## 🔧 Advanced Patterns

### Middleware with Configuration

```typescript
// middleware/configurable-logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export interface LoggerOptions {
  logBody?: boolean;
  logHeaders?: boolean;
  logQuery?: boolean;
}

@Injectable()
export class ConfigurableLoggerMiddleware implements NestMiddleware {
  constructor(private readonly options: LoggerOptions = {}) {}

  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    
    if (this.options.logBody) {
      console.log('Body:', req.body);
    }
    
    if (this.options.logHeaders) {
      console.log('Headers:', req.headers);
    }
    
    if (this.options.logQuery) {
      console.log('Query:', req.query);
    }
    
    next();
  }
}

// Usage
consumer
  .apply(new ConfigurableLoggerMiddleware({
    logBody: true,
    logHeaders: false,
    logQuery: true,
  }))
  .forRoutes('*');
```

### Async Middleware

```typescript
// middleware/async-validation.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class AsyncValidationMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }

    // Async database check
    const user = await this.usersService.findOne(+userId);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    req['user'] = user;
    next();
  }
}
```

## 🧪 Testing Custom Middleware

```typescript
// request-id.middleware.spec.ts
import { RequestIdMiddleware } from './request-id.middleware';
import { Request, Response, NextFunction } from 'express';

describe('RequestIdMiddleware', () => {
  let middleware: RequestIdMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    middleware = new RequestIdMiddleware();
    mockRequest = {};
    mockResponse = {
      setHeader: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should add request ID to request', () => {
    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockRequest['requestId']).toBeDefined();
    expect(typeof mockRequest['requestId']).toBe('string');
  });

  it('should set X-Request-ID header', () => {
    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'X-Request-ID',
      expect.any(String),
    );
  });

  it('should call next function', () => {
    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(nextFunction).toHaveBeenCalled();
  });
});
```

## 💡 Best Practices

### ✅ DO:

```typescript
// 1. Use dependency injection
@Injectable()
export class MyMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}
}

// 2. Handle errors properly
use(req, res, next) {
  try {
    // Your logic
    next();
  } catch (error) {
    next(error);
  }
}

// 3. Always call next()
use(req, res, next) {
  // Do something
  next(); // ✅ Always call
}

// 4. Use meaningful names
RequestIdMiddleware, ApiKeyMiddleware // ✅ Clear
Middleware1, MyMiddleware // ❌ Vague
```

### ❌ DON'T:

```typescript
// 1. Don't forget next()
use(req, res, next) {
  console.log('Log');
  // ❌ Missing next()!
}

// 2. Don't put business logic
use(req, res, next) {
  // ❌ Business logic!
  await this.calculateUserScore();
  next();
}

// 3. Don't modify response in middleware if interceptor exists
use(req, res, next) {
  // ❌ Use interceptor instead
  res.send({ modified: true });
}
```

## 📊 Summary

Custom middleware berguna untuk:
- ✅ Request/Response modification
- ✅ Authentication & Authorization
- ✅ Logging & Monitoring
- ✅ Rate limiting
- ✅ Security checks
- ✅ Data sanitization

Gunakan middleware untuk cross-cutting concerns yang perlu dijalankan before controller!

---

**Next Chapter:** Middleware in Request Lifecycle! 🔄
