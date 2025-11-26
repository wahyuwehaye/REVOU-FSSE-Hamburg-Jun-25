# Chapter 11: Middleware in NestJS Request Lifecycle

## 🔄 Complete Request Lifecycle

```
HTTP REQUEST arrives
        ↓
┌───────────────────┐
│   MIDDLEWARE      │ ← Cross-cutting concerns
│   • Logging       │
│   • CORS          │
│   • Auth Check    │
└────────┬──────────┘
         ↓
┌───────────────────┐
│   GUARDS          │ ← Authorization
│   • RolesGuard    │
│   • AuthGuard     │
└────────┬──────────┘
         ↓
┌───────────────────┐
│   INTERCEPTORS    │ ← Pre-processing
│   (Before)        │
└────────┬──────────┘
         ↓
┌───────────────────┐
│   PIPES           │ ← Validation & Transform
│   • ValidationPipe│
│   • ParseIntPipe  │
└────────┬──────────┘
         ↓
┌───────────────────┐
│   CONTROLLER      │ ← Route Handler
│   @Get()          │
│   @Post()         │
└────────┬──────────┘
         ↓
┌───────────────────┐
│   SERVICE         │ ← Business Logic
└────────┬──────────┘
         ↓
┌───────────────────┐
│   INTERCEPTORS    │ ← Post-processing
│   (After)         │
└────────┬──────────┘
         ↓
┌───────────────────┐
│   EXCEPTION       │ ← Error Handling
│   FILTERS         │
└────────┬──────────┘
         ↓
    HTTP RESPONSE
```

## 🎯 Middleware Position in Lifecycle

Middleware adalah **PERTAMA** yang dieksekusi dalam request lifecycle!

### Why Middleware First?

1. **Cross-cutting concerns** - Apply ke semua requests
2. **Early termination** - Bisa stop request sebelum masuk controller
3. **Request modification** - Modify request before guards/pipes
4. **Performance** - Filter requests early untuk efficiency

## 📊 Execution Order Example

```typescript
// 1. Global Middleware (main.ts)
app.use(globalLogger);

// 2. Module Middleware (app.module.ts)
consumer.apply(CorsMiddleware).forRoutes('*');

// 3. Route Middleware (users.module.ts)
consumer.apply(AuthMiddleware).forRoutes(UsersController);

// 4. Guards
@UseGuards(RolesGuard)

// 5. Interceptors (Before)
@UseInterceptors(LoggingInterceptor)

// 6. Pipes
@Body(ValidationPipe)

// 7. Controller Method
@Get()
findAll() { }

// 8. Service
usersService.findAll()

// 9. Interceptors (After)
transform response

// 10. Exception Filters (if error occurs)
```

## 🎨 Practical Example: Complete Flow

### Setup All Layers

```typescript
// 1. MIDDLEWARE - Log all requests
// middleware/logger.middleware.ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('1. [Middleware] Request received');
    next();
  }
}

// 2. GUARD - Check authentication
// guards/auth.guard.ts
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log('2. [Guard] Checking authentication');
    return true; // Allow request
  }
}

// 3. INTERCEPTOR - Transform request
// interceptors/transform.interceptor.ts
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('3. [Interceptor Before] Pre-processing');
    
    return next.handle().pipe(
      map(data => {
        console.log('7. [Interceptor After] Post-processing');
        return { data, timestamp: new Date() };
      }),
    );
  }
}

// 4. PIPE - Validate input
// pipes/validation.pipe.ts
@Injectable()
export class CustomValidationPipe implements PipeTransform {
  transform(value: any) {
    console.log('4. [Pipe] Validating input');
    return value;
  }
}

// 5. CONTROLLER
@Controller('users')
@UseGuards(AuthGuard)
@UseInterceptors(TransformInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query(CustomValidationPipe) query: any) {
    console.log('5. [Controller] Handling request');
    return this.usersService.findAll();
  }
}

// 6. SERVICE
@Injectable()
export class UsersService {
  findAll() {
    console.log('6. [Service] Executing business logic');
    return [{ id: 1, name: 'John' }];
  }
}

// Register middleware
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

### Output When Request is Made

```
GET /users

Console output:
1. [Middleware] Request received
2. [Guard] Checking authentication
3. [Interceptor Before] Pre-processing
4. [Pipe] Validating input
5. [Controller] Handling request
6. [Service] Executing business logic
7. [Interceptor After] Post-processing

Response:
{
  "data": [{ "id": 1, "name": "John" }],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## ⚡ Early Termination

Middleware dapat menghentikan request sebelum mencapai controller:

```typescript
// middleware/maintenance.middleware.ts
@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
    
    if (isMaintenanceMode) {
      // Stop request here! Don't call next()
      res.status(503).json({
        message: 'Service under maintenance',
        retryAfter: '2024-01-15T12:00:00Z',
      });
      return; // Request stops here
    }
    
    next(); // Continue to next layer
  }
}
```

## 🔒 Authentication Flow

### Complete Auth Flow with Middleware

```typescript
// 1. Auth Middleware - Verify JWT token
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('[Middleware] Checking JWT token');
    
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = jwt.verify(token, 'secret');
      req['user'] = decoded; // Attach user to request
      console.log('[Middleware] Token valid, user attached');
      next();
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

// 2. Roles Guard - Check user role
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log('[Guard] Checking user role');
    
    const request = context.switchToHttp().getRequest();
    const user = request.user; // From middleware!
    
    return user.role === 'admin';
  }
}

// 3. Controller - Use both
@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  @Get()
  getDashboard(@Request() req) {
    console.log('[Controller] User:', req.user);
    return { message: 'Admin dashboard' };
  }
}

// Flow:
// Request → Middleware (attach user) → Guard (check role) → Controller
```

## 🎭 Multiple Middlewares Order

```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Order matters!
    consumer
      .apply(
        RequestIdMiddleware,     // 1. Add request ID
        LoggerMiddleware,        // 2. Log request (with ID)
        CorsMiddleware,          // 3. Handle CORS
        AuthMiddleware,          // 4. Authenticate
        RateLimitMiddleware,     // 5. Check rate limit
      )
      .forRoutes('*');
  }
}

// Execution:
// Request → RequestId → Logger → CORS → Auth → RateLimit → Guards → ...
```

## 📊 Error Handling in Middleware

```typescript
@Injectable()
export class ErrorHandlingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      // Some validation
      if (!req.headers['x-api-key']) {
        throw new UnauthorizedException('API key required');
      }
      
      next();
    } catch (error) {
      // Error caught here stops the request
      console.log('[Middleware] Error caught, request stopped');
      
      // Send error response
      res.status(error.status || 500).json({
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
```

## 🔄 Middleware vs Guards vs Interceptors

### When to Use What?

| Layer | Use For | Example |
|-------|---------|---------|
| **Middleware** | Request-level logic, early termination | Logging, CORS, IP filtering |
| **Guards** | Authorization logic | Role checking, permissions |
| **Interceptors** | Transform request/response, AOP | Logging, caching, timeout |
| **Pipes** | Validation & transformation | DTO validation, type conversion |

### Middleware - For All Routes

```typescript
// ✅ Use middleware for cross-cutting concerns
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
  }
}
```

### Guard - For Authorization

```typescript
// ✅ Use guard for route-specific authorization
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user?.role === 'admin';
  }
}
```

### Interceptor - For Transformation

```typescript
// ✅ Use interceptor for response transformation
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(data => ({ data, timestamp: new Date() })),
    );
  }
}
```

## 💡 Best Practices

### ✅ DO:

```typescript
// 1. Use middleware for early filtering
@Injectable()
export class IpFilterMiddleware implements NestMiddleware {
  use(req, res, next) {
    if (this.isBlacklisted(req.ip)) {
      res.status(403).json({ message: 'Forbidden' });
      return; // Stop here
    }
    next();
  }
}

// 2. Attach data to request for later use
@Injectable()
export class UserMiddleware implements NestMiddleware {
  async use(req, res, next) {
    req['user'] = await this.findUser(req.headers.token);
    next(); // Guards can use req.user
  }
}

// 3. Keep middleware focused
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
  }
}
```

### ❌ DON'T:

```typescript
// 1. Don't use middleware for route-specific logic
@Injectable()
export class BadMiddleware implements NestMiddleware {
  use(req, res, next) {
    // ❌ Route-specific logic should be in guard/interceptor
    if (req.url === '/admin' && req.user.role !== 'admin') {
      throw new ForbiddenException();
    }
    next();
  }
}

// 2. Don't forget to call next()
@Injectable()
export class ForgetfulMiddleware implements NestMiddleware {
  use(req, res, next) {
    console.log('Log');
    // ❌ Forgot next()! Request hangs!
  }
}

// 3. Don't put business logic in middleware
@Injectable()
export class BusinessMiddleware implements NestMiddleware {
  async use(req, res, next) {
    // ❌ Business logic should be in service!
    await this.calculateSomething();
    await this.updateDatabase();
    next();
  }
}
```

## 🎯 Real-World Example: Complete API Setup

```typescript
// Complete layered setup
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Layer 1: Global concerns
    consumer
      .apply(
        RequestIdMiddleware,
        LoggerMiddleware,
        CorsMiddleware,
      )
      .forRoutes('*');
    
    // Layer 2: Authentication
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/login', 'auth/register')
      .forRoutes('*');
    
    // Layer 3: Rate limiting for public endpoints
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes('public/*');
  }
}

// Then Guards check roles, Interceptors transform, Pipes validate!
```

## 📊 Summary

- **Middleware** adalah layer **pertama** dalam request lifecycle
- Ideal untuk **cross-cutting concerns** (logging, CORS, auth check)
- Bisa **menghentikan request** sebelum mencapai controller
- Dieksekusi **sebelum** Guards, Interceptors, dan Pipes
- **Always call `next()`** kecuali ingin stop request

---

**Next Chapter:** Dependency Injection Fundamentals! 💉
