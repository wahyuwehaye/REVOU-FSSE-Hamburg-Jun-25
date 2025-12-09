# 🚀 Production Best Practices for NestJS + PostgreSQL

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Prepare NestJS app for production
- ✅ Implement security best practices
- ✅ Set up proper logging and monitoring
- ✅ Configure database for production
- ✅ Handle errors gracefully
- ✅ Implement health checks
- ✅ Deploy to production environments

---

## 🔒 Security Best Practices

### 1. Environment Variables

**❌ NEVER commit .env to Git**

```bash
# .gitignore
.env
.env.local
.env.production
```

**✅ Use separate .env files:**

```bash
.env.development
.env.staging
.env.production
```

**.env.production:**
```bash
# Database
DB_HOST=production-db.example.com
DB_PORT=5432
DB_USERNAME=prod_user
DB_PASSWORD=STRONG_PASSWORD_HERE
DB_DATABASE=prod_db
DB_SSL=true

# App
NODE_ENV=production
PORT=3000
API_URL=https://api.example.com

# JWT
JWT_SECRET=SUPER_SECRET_KEY_HERE
JWT_EXPIRES_IN=1h

# Redis
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=REDIS_PASSWORD_HERE
```

### 2. Database Security

```typescript
// src/config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  
  // ✅ Production settings
  ssl: configService.get('NODE_ENV') === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
  
  // ✅ NEVER use synchronize in production
  synchronize: false,
  
  // ✅ Use migrations
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: true,
  
  // ✅ Connection pooling
  extra: {
    max: 20,
    min: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  
  // ✅ Logging
  logging: configService.get('NODE_ENV') === 'production' 
    ? ['error', 'warn'] 
    : true,
});
```

### 3. Input Validation

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // Strip unknown properties
    forbidNonWhitelisted: true,   // Throw error for unknown properties
    transform: true,               // Auto-transform types
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

### 4. Rate Limiting

```bash
npm install @nestjs/throttler
```

```typescript
// app.module.ts
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,      // Time to live (seconds)
      limit: 10,    // Max requests per ttl
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

### 5. CORS Configuration

```typescript
// main.ts
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### 6. Helmet (Security Headers)

```bash
npm install helmet
```

```typescript
// main.ts
import helmet from 'helmet';

app.use(helmet());
```

### 7. Password Hashing

```typescript
// auth/auth.service.ts
import * as bcrypt from 'bcrypt';

async hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
```

---

## 📝 Logging Best Practices

### 1. Structured Logging

```bash
npm install winston
```

```typescript
// src/config/logger.config.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const loggerConfig = WinstonModule.createLogger({
  transports: [
    // Console logging
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
          return `${timestamp} [${level}] ${context ? `[${context}]` : ''} ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ''
          }`;
        }),
      ),
    }),
    
    // File logging
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
```

**Use in app.module.ts:**
```typescript
import { loggerConfig } from './config/logger.config';

@Module({
  imports: [
    WinstonModule.forRoot(loggerConfig),
  ],
})
export class AppModule {}
```

**Use in service:**
```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Creating user: ${createUserDto.email}`);
    
    try {
      const user = await this.userRepository.save(createUserDto);
      this.logger.log(`User created successfully: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

### 2. Request Logging

```typescript
// src/common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${responseTime}ms - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
```

**Apply globally:**
```typescript
// app.module.ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

---

## 🏥 Health Checks

```bash
npm install @nestjs/terminus
```

```typescript
// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Database check
      () => this.db.pingCheck('database'),
      
      // Memory check (heap should not exceed 150MB)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      
      // Disk check (storage should have at least 50% free)
      () => this.disk.checkStorage('storage', {
        path: '/',
        thresholdPercent: 0.5,
      }),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }

  @Get('live')
  @HealthCheck()
  live() {
    return { status: 'ok' };
  }
}
```

**Register module:**
```typescript
// health/health.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
```

---

## ❌ Error Handling

### 1. Global Exception Filter

```typescript
// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

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
      message: typeof message === 'string' ? message : (message as any).message,
    };

    // Log error
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : 'Unknown error',
    );

    response.status(status).json(errorResponse);
  }
}
```

**Apply globally:**
```typescript
// main.ts
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

app.useGlobalFilters(new AllExceptionsFilter());
```

### 2. Custom Business Exceptions

```typescript
// src/common/exceptions/user-not-found.exception.ts
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(userId: number) {
    super(`User with ID ${userId} not found`);
  }
}
```

**Usage:**
```typescript
const user = await this.userRepository.findOne({ where: { id } });
if (!user) {
  throw new UserNotFoundException(id);
}
```

---

## 🗄️ Database Best Practices

### 1. Connection Configuration

```typescript
// Production database config
{
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  
  // ✅ SSL in production
  ssl: {
    rejectUnauthorized: false,
  },
  
  // ✅ Never use synchronize in production
  synchronize: false,
  
  // ✅ Run migrations automatically
  migrationsRun: true,
  migrations: ['dist/migrations/*{.ts,.js}'],
  
  // ✅ Connection pool
  extra: {
    max: 20,
    min: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  
  // ✅ Query caching
  cache: {
    type: 'ioredis',
    options: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      password: process.env.REDIS_PASSWORD,
    },
    duration: 60000,
  },
  
  // ✅ Minimal logging in production
  logging: ['error'],
  maxQueryExecutionTime: 1000,
}
```

### 2. Backup Strategy

```bash
# Automated daily backup script
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DB_NAME="prod_db"

# Create backup
pg_dump -h localhost -U postgres $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

**Cron job:**
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

### 3. Read Replicas (Optional)

```typescript
// Multiple database connections
TypeOrmModule.forRoot({
  name: 'default',
  type: 'postgres',
  host: 'master.db.example.com',
  replication: {
    master: {
      host: 'master.db.example.com',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'mydb',
    },
    slaves: [
      {
        host: 'slave1.db.example.com',
        port: 5432,
        username: 'postgres',
        password: 'password',
        database: 'mydb',
      },
      {
        host: 'slave2.db.example.com',
        port: 5432,
        username: 'postgres',
        password: 'password',
        database: 'mydb',
      },
    ],
  },
})
```

---

## 📊 Monitoring & Metrics

### 1. Application Monitoring

```bash
npm install @willsoto/nestjs-prometheus prom-client
```

```typescript
// app.module.ts
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
})
export class AppModule {}
```

**Custom metrics:**
```typescript
// src/metrics/metrics.service.ts
import { Injectable } from '@nestjs/common';
import { Counter, Histogram } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('http_requests_total')
    public requestCounter: Counter<string>,
    
    @InjectMetric('http_request_duration_ms')
    public requestDuration: Histogram<string>,
  ) {}

  incrementRequestCounter(method: string, route: string, statusCode: number) {
    this.requestCounter.inc({ method, route, statusCode });
  }

  recordRequestDuration(method: string, route: string, duration: number) {
    this.requestDuration.observe({ method, route }, duration);
  }
}
```

### 2. Database Monitoring

```sql
-- Check active connections
SELECT 
  count(*) as active_connections,
  state
FROM pg_stat_activity
GROUP BY state;

-- Check slow queries
SELECT 
  pid,
  now() - query_start as duration,
  query,
  state
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;

-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🚀 Deployment

### 1. Build for Production

```bash
# Install dependencies
npm ci

# Run migrations
npm run migration:run

# Build
npm run build

# Start
npm run start:prod
```

### 2. Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

### 3. Docker Compose (Production)

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_DATABASE}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### 4. Kubernetes (Optional)

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nestjs-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nestjs-app
  template:
    metadata:
      labels:
        app: nestjs-app
    spec:
      containers:
      - name: nestjs-app
        image: your-registry/nestjs-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: host
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
```

---

## 🔧 Performance Tuning

### 1. Enable Compression

```bash
npm install compression
```

```typescript
// main.ts
import * as compression from 'compression';

app.use(compression());
```

### 2. Enable Caching

```typescript
// app.controller.ts
import { CacheInterceptor } from '@nestjs/cache-manager';
import { UseInterceptors } from '@nestjs/common';

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  @Get()
  findAll() {
    // Automatically cached
  }
}
```

### 3. Optimize Database Queries

```typescript
// Use indexes
@Entity()
export class User {
  @Column()
  @Index()
  email: string;
}

// Use pagination
async findAll(page: number, limit: number) {
  return await this.repository.find({
    skip: (page - 1) * limit,
    take: limit,
    cache: 60000,
  });
}

// Eager load relations
async findWithPosts(id: number) {
  return await this.repository.findOne({
    where: { id },
    relations: ['posts'],
  });
}
```

---

## ✅ Production Checklist

### Security
- [ ] Environment variables secured
- [ ] SSL/TLS enabled
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Helmet middleware added
- [ ] Input validation enabled
- [ ] Passwords properly hashed
- [ ] JWT secrets rotated

### Database
- [ ] synchronize: false
- [ ] Migrations ready
- [ ] Connection pooling configured
- [ ] Indexes added
- [ ] Backup strategy in place
- [ ] Query optimization done

### Monitoring
- [ ] Logging configured (Winston)
- [ ] Health checks implemented
- [ ] Metrics collection (Prometheus)
- [ ] Error tracking (Sentry)
- [ ] Database monitoring

### Performance
- [ ] Compression enabled
- [ ] Caching configured (Redis)
- [ ] Query optimization
- [ ] Connection pooling
- [ ] CDN for static files

### Deployment
- [ ] Dockerfile optimized
- [ ] CI/CD pipeline configured
- [ ] Rollback strategy
- [ ] Zero-downtime deployment
- [ ] Load balancer configured

---

## 🎯 Summary

**Security:**
- Use environment variables
- Enable SSL/TLS
- Configure CORS properly
- Add rate limiting
- Use Helmet for security headers

**Logging:**
- Structured logging (Winston)
- Request logging
- Error logging
- Log rotation

**Health Checks:**
- Database health
- Memory health
- Disk health
- Readiness probe
- Liveness probe

**Error Handling:**
- Global exception filter
- Custom exceptions
- Proper error messages
- Error logging

**Database:**
- Never use synchronize in production
- Use migrations
- Connection pooling
- Query caching
- Regular backups

**Deployment:**
- Build for production
- Use Docker
- Kubernetes (optional)
- CI/CD pipeline
- Monitoring & metrics

**Congratulations! 🎉**
You've completed all Week 23 materials on Database & SQL with PostgreSQL!

---

**Happy Coding! 🚀**
