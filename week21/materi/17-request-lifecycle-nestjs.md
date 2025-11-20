# Chapter 17: Request Lifecycle in NestJS

## 📚 Daftar Isi
- [Overview](#overview)
- [Request Flow](#request-flow)
- [Components in Lifecycle](#components-in-lifecycle)
- [Practical Examples](#practical-examples)

---

## Overview

**Request Lifecycle** adalah urutan proses yang dilalui sebuah HTTP request dari masuk ke aplikasi NestJS sampai response dikirim kembali ke client.

### Why Important?
- ✅ Memahami dimana kode kita dijalankan
- ✅ Tahu kapan menggunakan Middleware vs Guard vs Interceptor
- ✅ Debugging lebih mudah
- ✅ Implementasi cross-cutting concerns (logging, auth, etc.)

---

## Request Flow

```
Incoming Request
      ↓
1. Middleware (Global → Module → Route)
      ↓
2. Guards (Global → Controller → Route)
      ↓
3. Interceptors (BEFORE - Global → Controller → Route)
      ↓
4. Pipes (Global → Controller → Route → Param)
      ↓
5. Controller Method (Route Handler)
      ↓
6. Service Logic
      ↓
7. Interceptors (AFTER - Route → Controller → Global)
      ↓
8. Exception Filters (if error occurs)
      ↓
Response to Client
```

---

## Components in Lifecycle

### 1. Middleware
**Purpose:** General request processing (logging, CORS, authentication)

```typescript
// logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    // Execute after response
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`
      );
    });

    next(); // Pass to next middleware/handler
  }
}

// Apply in module
@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
```

### 2. Guards
**Purpose:** Authorization & Authentication

```typescript
// auth.guard.ts
import { 
  Injectable, 
  CanActivate, 
  ExecutionContext,
  UnauthorizedException 
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Verify token
    const isValid = this.verifyToken(token);
    
    if (!isValid) {
      throw new UnauthorizedException('Invalid token');
    }

    // Add user to request
    request.user = this.decodeToken(token);
    
    return true; // Allow access
  }

  private verifyToken(token: string): boolean {
    // Token verification logic
    return token === 'valid-token';
  }

  private decodeToken(token: string): any {
    return { id: 1, username: 'john' };
  }
}

// Usage
@Controller('profile')
@UseGuards(AuthGuard) // Apply to all routes in controller
export class ProfileController {
  @Get()
  getProfile(@Request() req) {
    return req.user; // User injected by guard
  }
}
```

### 3. Interceptors
**Purpose:** Transform request/response, logging, caching

```typescript
// logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    console.log(`Before: ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        console.log(`After: ${method} ${url} - ${Date.now() - now}ms`);
      }),
    );
  }
}

// Transform response interceptor
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}

// Usage
@Controller('users')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UsersController {
  @Get()
  findAll() {
    return [{ id: 1, name: 'John' }];
  }
}

// Response:
// {
//   "success": true,
//   "data": [{ "id": 1, "name": "John" }],
//   "timestamp": "2024-01-01T00:00:00.000Z"
// }
```

### 4. Pipes
**Purpose:** Validation & Transformation

```typescript
// validation.pipe.ts (built-in)
import { ValidationPipe } from '@nestjs/common';

// Global usage
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove unknown properties
    forbidNonWhitelisted: true, // Throw error on unknown properties
    transform: true, // Auto-transform to DTO types
  }));

  await app.listen(3000);
}

// Custom pipe
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10);
    
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed. Expected number.');
    }
    
    return val;
  }
}

// Usage
@Controller('users')
export class UsersController {
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    // id is guaranteed to be a number
    return `User #${id}`;
  }
}
```

### 5. Exception Filters
**Purpose:** Handle errors

```typescript
// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    };

    console.error('Exception occurred:', exception);

    response.status(status).json(errorResponse);
  }
}

// Usage
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalFilters(new AllExceptionsFilter());
  
  await app.listen(3000);
}
```

---

## Practical Examples

### Example 1: Complete Request Flow

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global middleware (runs first)
  app.use((req, res, next) => {
    console.log('1. Global Middleware');
    next();
  });

  // Global pipes
  app.useGlobalPipes(new ValidationPipe());
  console.log('4. Global Pipe will validate');

  // Global guards
  app.useGlobalGuards(new AuthGuard());
  console.log('2. Global Guard will check auth');

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());
  console.log('3. Global Interceptor (before) will log');

  // Global exception filters
  app.useGlobalFilters(new AllExceptionsFilter());
  console.log('8. Exception Filter (if error)');

  await app.listen(3000);
}

// users.controller.ts
@Controller('users')
@UseInterceptors(TransformInterceptor) // 3b. Controller interceptor
@UseGuards(RolesGuard) // 2b. Controller guard
export class UsersController {
  @Post()
  @UseGuards(AdminGuard) // 2c. Route guard
  create(@Body() dto: CreateUserDto) { // 4. Pipe validates this
    console.log('5. Controller method executed');
    return this.usersService.create(dto);
  }
}

// users.service.ts
@Injectable()
export class UsersService {
  create(dto: CreateUserDto) {
    console.log('6. Service method executed');
    return { id: 1, ...dto };
  }
}

// Request flow:
// 1. Global Middleware
// 2. Global Guard
// 2b. Controller Guard (RolesGuard)
// 2c. Route Guard (AdminGuard)
// 3. Global Interceptor (before)
// 3b. Controller Interceptor (before)
// 4. Global Pipe (ValidationPipe)
// 5. Controller method
// 6. Service method
// 7. Controller Interceptor (after)
// 7b. Global Interceptor (after)
// 8. Response sent (or Exception Filter if error)
```

### Example 2: Authentication & Authorization Flow

```typescript
// Step 1: Authentication Middleware
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      req['user'] = this.decodeToken(token);
    }
    
    next();
  }

  private decodeToken(token: string) {
    return { id: 1, username: 'john', role: 'user' };
  }
}

// Step 2: Authentication Guard
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    if (!request.user) {
      throw new UnauthorizedException('Please login');
    }
    
    return true;
  }
}

// Step 3: Authorization Guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    
    if (!requiredRoles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    const hasRole = requiredRoles.includes(user.role);
    
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }
    
    return true;
  }
}

// Custom decorator
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Usage
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('users')
  @Roles('admin')
  getAllUsers() {
    return 'List of all users';
  }

  @Delete('users/:id')
  @Roles('admin', 'superadmin')
  deleteUser(@Param('id') id: string) {
    return `User ${id} deleted`;
  }
}
```

### Example 3: Response Transformation

```typescript
// timeout.interceptor.ts
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000), // 5 seconds timeout
      catchError(err => {
        if (err.name === 'TimeoutError') {
          throw new RequestTimeoutException('Request took too long');
        }
        throw err;
      }),
    );
  }
}

// cache.interceptor.ts
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = `${request.method}:${request.url}`;

    // Check cache
    if (this.cache.has(key)) {
      console.log('Returning cached response');
      return of(this.cache.get(key));
    }

    // Call handler and cache result
    return next.handle().pipe(
      tap(response => {
        console.log('Caching response');
        this.cache.set(key, response);
        
        // Clear cache after 60 seconds
        setTimeout(() => this.cache.delete(key), 60000);
      }),
    );
  }
}

// Usage
@Controller('products')
@UseInterceptors(TimeoutInterceptor, CacheInterceptor)
export class ProductsController {
  @Get()
  findAll() {
    // This response will be cached
    return ['Product 1', 'Product 2'];
  }
}
```

### Example 4: Error Handling Flow

```typescript
// Custom exception
export class BusinessException extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message,
        error: 'Business Rule Violation',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

// Custom filter
@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    response.status(status).json({
      success: false,
      timestamp: new Date().toISOString(),
      ...exceptionResponse,
      details: 'Please check your input and try again',
    });
  }
}

// Usage in service
@Injectable()
export class OrdersService {
  create(dto: CreateOrderDto) {
    // Business validation
    if (dto.quantity <= 0) {
      throw new BusinessException('Quantity must be greater than 0');
    }

    if (dto.total < 10) {
      throw new BusinessException('Minimum order is $10');
    }

    return this.repository.create(dto);
  }
}

// Apply filter
@Controller('orders')
@UseFilters(BusinessExceptionFilter)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }
}
```

---

## Summary

### Request Lifecycle Order:
1. **Middleware** - General processing, runs first
2. **Guards** - Authentication & Authorization
3. **Interceptors (Before)** - Pre-processing
4. **Pipes** - Validation & Transformation
5. **Route Handler** - Controller method
6. **Service** - Business logic
7. **Interceptors (After)** - Post-processing
8. **Exception Filters** - Error handling

### When to Use Each:
- **Middleware**: Logging, CORS, Request parsing
- **Guards**: Authentication, Authorization
- **Interceptors**: Transform response, Logging, Caching, Timeout
- **Pipes**: Validation, Type conversion
- **Exception Filters**: Error formatting, Logging errors

✅ Memahami lifecycle = Bisa implement cross-cutting concerns dengan benar
✅ Setiap component punya purpose yang spesifik
✅ Order matters!

**Next:** Documentation API with Postman! 🚀
