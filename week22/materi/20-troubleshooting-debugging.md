# Chapter 20: Troubleshooting & Debugging

## 🎯 Common Deployment Issues

Setelah deploy, ada beberapa masalah yang sering terjadi. Mari kita bahas satu per satu dengan solusinya.

## 🐛 Build & Deployment Errors

### Error 1: Build Failed - Module Not Found

```bash
Error: Cannot find module '@nestjs/core'
Error: Cannot find module 'typeorm'
Error: Cannot find module 'pg'
```

**Cause:** Missing dependencies in `package.json`

**Solution:**

```bash
# ✅ Check if package is in dependencies (not devDependencies)
npm install @nestjs/core @nestjs/common typeorm pg

# ✅ Verify package.json
{
  "dependencies": {
    "@nestjs/core": "^10.0.0",
    "@nestjs/common": "^10.0.0",
    "typeorm": "^0.3.17",
    "pg": "^8.11.0"
  }
}

# ✅ Commit and push
git add package.json package-lock.json
git commit -m "Fix dependencies"
git push origin main
```

### Error 2: Build Command Failed

```bash
Error: nest: command not found
```

**Cause:** @nestjs/cli not installed

**Solution:**

```json
// package.json
{
  "scripts": {
    "build": "nest build", // ❌ Requires @nestjs/cli
    "build": "tsc -p tsconfig.build.json" // ✅ Alternative without CLI
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0" // ✅ Or install CLI
  }
}
```

### Error 3: TypeScript Compilation Errors

```bash
Error: TS2304: Cannot find name 'Promise'
Error: TS2339: Property 'map' does not exist on type
```

**Solution:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "lib": ["ES2021"], // ✅ Add ES2021 lib
    "target": "ES2021",
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
```

## 🔌 Database Connection Issues

### Error 4: Database Connection Failed

```bash
Error: connect ECONNREFUSED
Error: Connection terminated unexpectedly
Error: password authentication failed
```

**Solution 1:** Check DATABASE_URL

```typescript
// ✅ Correct format
DATABASE_URL=postgresql://username:password@host:5432/database

// Example
DATABASE_URL=postgresql://myapp_user:pass123@dpg-xxx.singapore.render.com/myapp
```

**Solution 2:** Enable SSL

```typescript
// app.module.ts
TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // ✅ Required for most cloud databases
  },
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== 'production',
})
```

**Solution 3:** Connection Pool Settings

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  extra: {
    max: 5, // ✅ Limit connections for free tier
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
})
```

### Error 5: Database Migrations Not Run

```bash
Error: relation "users" does not exist
```

**Solution:**

```bash
# Option 1: Enable synchronize (development only!)
TypeOrmModule.forRoot({
  synchronize: true, // ⚠️ Only for development!
})

# Option 2: Run migrations
npm run migration:generate -- src/migrations/init
npm run migration:run

# Option 3: Manual SQL in Render database console
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🌐 CORS Issues

### Error 6: CORS Policy Blocked

```bash
Access to fetch at 'https://api.example.com' from origin 'https://app.example.com'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solution:**

```typescript
// main.ts
app.enableCors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});

// .env.production
CORS_ORIGIN=https://app.example.com,https://www.app.example.com
```

### Error 7: Credentials Flag Issue

```bash
Access to fetch blocked: The value of the 'Access-Control-Allow-Credentials' 
header is '' when credentials are included
```

**Solution:**

```typescript
// Backend
app.enableCors({
  origin: 'https://app.example.com', // ✅ Specific origin (not *)
  credentials: true, // ✅ Must be true
});

// Frontend
fetch('https://api.example.com/users', {
  credentials: 'include', // ✅ Must send credentials
});
```

## 🔧 Runtime Errors

### Error 8: Port Already in Use

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

```typescript
// ❌ Wrong
await app.listen(3000);

// ✅ Correct - Use PORT from environment
const port = process.env.PORT || 3000;
await app.listen(port);
console.log(`App running on port ${port}`);
```

### Error 9: Environment Variables Not Found

```bash
TypeError: Cannot read property 'split' of undefined
```

**Solution:**

```typescript
// ❌ Wrong - Will crash if not defined
const origins = process.env.CORS_ORIGIN.split(',');

// ✅ Correct - Provide defaults
const origins = process.env.CORS_ORIGIN?.split(',') || ['*'];

// ✅ Or validate on startup
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

// ✅ Or use ConfigModule validation
import * as Joi from 'joi';

ConfigModule.forRoot({
  validationSchema: Joi.object({
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    PORT: Joi.number().default(3000),
  }),
})
```

### Error 10: Memory Limit Exceeded

```bash
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solution:**

```json
// package.json
{
  "scripts": {
    "start:prod": "node --max-old-space-size=512 dist/main"
  }
}
```

Or optimize code:
```typescript
// ❌ Loading all data at once
const users = await this.userRepository.find(); // Can be millions!

// ✅ Use pagination
const users = await this.userRepository.find({
  take: 100,
  skip: page * 100,
});

// ✅ Use streaming for large datasets
const stream = await this.userRepository
  .createQueryBuilder('user')
  .stream();
```

## 📊 Performance Issues

### Issue 11: Slow First Request (Cold Start)

**Cause:** Free tier spins down after 15 minutes

**Solutions:**

```typescript
// Solution 1: Upgrade to paid plan ($7/month)
// No cold starts on paid plans

// Solution 2: Keep-alive ping
// Create a cron job to ping your API every 10 minutes
// Use services like cron-job.org or UptimeRobot

// Solution 3: Optimize startup
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production' 
      ? ['error', 'warn'] // ✅ Less logging in production
      : ['log', 'debug', 'error', 'warn'],
  });
  
  // ... rest of config
}
```

### Issue 12: Slow Database Queries

```typescript
// ❌ N+1 Problem
const users = await this.userRepository.find();
for (const user of users) {
  user.posts = await this.postRepository.find({ userId: user.id });
}

// ✅ Use relations/joins
const users = await this.userRepository.find({
  relations: ['posts'],
});

// ✅ Or use query builder
const users = await this.userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.posts', 'posts')
  .getMany();

// ✅ Add indexes
@Entity()
export class User {
  @Index() // ✅ Index frequently queried fields
  @Column()
  email: string;
}
```

## 🔍 Debugging Techniques

### 1. Enable Detailed Logging

```typescript
// main.ts
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  
  // ... rest
}

// In services
@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  async findAll() {
    this.logger.log('Finding all users');
    try {
      const users = await this.userRepository.find();
      this.logger.log(`Found ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error('Failed to find users', error.stack);
      throw error;
    }
  }
}
```

### 2. Add Health Checks

```typescript
// health.controller.ts
@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private connection: Connection,
  ) {}

  @Get()
  async check() {
    const dbHealth = await this.checkDatabase();
    const memoryUsage = process.memoryUsage();

    return {
      status: dbHealth ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealth ? 'connected' : 'disconnected',
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      },
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.connection.query('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }
}
```

### 3. Monitor Logs in Real-time

```bash
# Render dashboard → Your service → Logs

# Or use Render CLI
npm install -g @render/cli
render login
render logs <service-id>
```

### 4. Test Locally with Production Config

```bash
# Create .env.production.local
NODE_ENV=production
PORT=3000
DATABASE_URL=your-render-db-url

# Build and run
npm run build
NODE_ENV=production npm run start:prod

# Test endpoints
curl http://localhost:3000/health
```

## 🛠️ Debugging Checklist

### When Deployment Fails:

1. ✅ Check Render logs
2. ✅ Verify build command
3. ✅ Verify start command
4. ✅ Check all dependencies in package.json
5. ✅ Test build locally: `npm run build`
6. ✅ Check Node.js version matches

### When App Crashes:

1. ✅ Check Render logs for errors
2. ✅ Verify environment variables
3. ✅ Check database connection
4. ✅ Test health endpoint
5. ✅ Check memory usage
6. ✅ Verify CORS configuration

### When Requests Fail:

1. ✅ Check CORS configuration
2. ✅ Verify API endpoint URL
3. ✅ Check authentication/authorization
4. ✅ Test with Postman/cURL
5. ✅ Check request/response logs
6. ✅ Verify content-type headers

## 📊 Monitoring Tools

### 1. Render Built-in Monitoring

- CPU usage
- Memory usage
- Request count
- Error rate
- Response time

### 2. External Monitoring

```typescript
// Integrate with monitoring services
// Sentry for error tracking
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// New Relic for performance
import * as newrelic from 'newrelic';

// Custom metrics
@Injectable()
export class MetricsService {
  private requestCount = 0;
  private errorCount = 0;

  incrementRequests() {
    this.requestCount++;
  }

  incrementErrors() {
    this.errorCount++;
  }

  getMetrics() {
    return {
      requests: this.requestCount,
      errors: this.errorCount,
      uptime: process.uptime(),
    };
  }
}
```

## 📊 Summary

**Common Issues & Solutions:**

1. **Build Fails** → Check dependencies & build commands
2. **Database Connection** → Verify URL, enable SSL, check pool settings
3. **CORS Errors** → Configure origins, credentials, headers
4. **Port Binding** → Use PORT from environment
5. **Environment Variables** → Provide defaults, validate on startup
6. **Memory Issues** → Optimize queries, use pagination
7. **Cold Starts** → Upgrade plan or use keep-alive
8. **Slow Queries** → Add indexes, use relations, avoid N+1

**Debugging Steps:**
1. ✅ Check Render logs
2. ✅ Enable detailed logging
3. ✅ Add health checks
4. ✅ Test locally with production config
5. ✅ Monitor metrics
6. ✅ Use error tracking services

---

**Next Chapter:** Course Recap - Complete Week 22 summary! 🎓
