# Chapter 16: What is Deployment?

## 🎯 Apa itu Deployment?

**Deployment** adalah proses memindahkan aplikasi dari development environment ke production environment, agar aplikasi bisa diakses oleh users.

```
Development                Production
(Your Computer)           (Server/Cloud)
     │                          │
     │  npm run start:dev       │  npm run start:prod
     │  localhost:3000          │  yourapp.com
     │  Hot reload ✅            │  Optimized code ✅
     │  Debug mode ✅            │  Error handling ✅
     │  Test data ✅             │  Real data ✅
     └──────────────────────────┘
           DEPLOYMENT
```

## 🌍 Deployment Environment

### Development Environment

```typescript
// .env.development
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=password123
DEBUG=true
LOG_LEVEL=debug

// Characteristics:
// - Run on localhost
// - Hot reload enabled
// - Detailed error messages
// - Debug tools enabled
// - Test database
// - Relaxed security
```

### Production Environment

```typescript
// .env.production
NODE_ENV=production
PORT=80
DB_HOST=prod-db.example.com
DB_PORT=5432
DB_USERNAME=prod_user
DB_PASSWORD=super-secure-password
DEBUG=false
LOG_LEVEL=error

// Characteristics:
// - Run on public server
// - No hot reload
// - Generic error messages
// - Optimized code
// - Real database
// - Strict security
// - Performance monitoring
// - Automatic scaling
```

## 📊 Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| **URL** | localhost:3000 | yourapp.com |
| **Database** | Local/Test DB | Production DB |
| **Errors** | Detailed stack trace | Generic message |
| **Logging** | All logs | Error logs only |
| **Performance** | Not optimized | Highly optimized |
| **Security** | Relaxed | Strict |
| **Hot Reload** | ✅ Yes | ❌ No |
| **Debug Mode** | ✅ Enabled | ❌ Disabled |

## 🚀 Deployment Platforms

### 1. Platform as a Service (PaaS)

Easy deployment, managed infrastructure:

```typescript
// Render
// ✅ Easy to use
// ✅ Free tier available
// ✅ Auto deploy from Git
// ✅ Built-in HTTPS

// Heroku
// ✅ Very popular
// ✅ Easy scaling
// ✅ Many add-ons
// ⚠️ Paid plans

// Railway
// ✅ Modern UI
// ✅ GitHub integration
// ✅ Fast deployment

// Fly.io
// ✅ Global deployment
// ✅ Edge computing
// ✅ Docker-based
```

### 2. Infrastructure as a Service (IaaS)

More control, more setup:

```typescript
// AWS EC2
// ✅ Full control
// ✅ Scalable
// ⚠️ Complex setup
// ⚠️ More expensive

// DigitalOcean
// ✅ Simple VPS
// ✅ Good docs
// ✅ Affordable

// Google Cloud
// ✅ Global network
// ✅ Many services
// ⚠️ Complex pricing
```

### 3. Serverless

Function as a Service:

```typescript
// AWS Lambda
// ✅ Pay per execution
// ✅ Auto scaling
// ⚠️ Cold start issues

// Vercel
// ✅ Great for Next.js
// ✅ Edge functions
// ⚠️ Limited for NestJS

// Netlify Functions
// ✅ Easy to use
// ⚠️ Limited runtime
```

## 📋 Pre-Deployment Checklist

### 1. Code Quality

```typescript
// ✅ Run linter
npm run lint

// ✅ Run tests
npm run test

// ✅ Build successfully
npm run build

// ✅ Check for security issues
npm audit

// ✅ Update dependencies
npm outdated
npm update
```

### 2. Environment Variables

```typescript
// ✅ Create .env.production
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=super-secret-key
API_KEY=xxx

// ✅ Add to .gitignore
// .gitignore
.env
.env.local
.env.production
.env.development
```

### 3. Database

```typescript
// ✅ Run migrations
npm run migration:run

// ✅ Seed initial data (if needed)
npm run seed

// ✅ Backup strategy
// - Automated backups
// - Backup retention policy
// - Restore procedure

// ✅ Connection pooling
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      // ✅ Connection pool settings
      extra: {
        max: 20, // Maximum pool size
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      },
    }),
  ],
})
```

### 4. Security

```typescript
// ✅ Enable CORS
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
});

// ✅ Enable Helmet (security headers)
import helmet from 'helmet';
app.use(helmet());

// ✅ Rate limiting
import rateLimit from 'express-rate-limit';
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
);

// ✅ Validate environment variables
import { ConfigService } from '@nestjs/config';

const configService = app.get(ConfigService);
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'API_KEY',
];

requiredEnvVars.forEach((key) => {
  if (!configService.get(key)) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
```

### 5. Performance

```typescript
// ✅ Enable compression
import compression from 'compression';
app.use(compression());

// ✅ Enable caching
@Injectable()
export class CacheService {
  private cache = new Map();
  
  set(key: string, value: any, ttl: number = 3600) {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl * 1000,
    });
  }
  
  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
}

// ✅ Database indexes
// Add indexes to frequently queried columns
@Entity()
export class User {
  @Index() // ✅ Index email for fast lookup
  @Column({ unique: true })
  email: string;

  @Index() // ✅ Index for user search
  @Column()
  username: string;
}
```

### 6. Logging & Monitoring

```typescript
// ✅ Structured logging
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  async findAll() {
    this.logger.log('Finding all users'); // ✅ Info logs
    
    try {
      return await this.userRepository.find();
    } catch (error) {
      this.logger.error('Failed to find users', error.stack); // ✅ Error logs
      throw error;
    }
  }
}

// ✅ Health check endpoint
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('db')
  async checkDatabase(@Inject('DATABASE') private db: any) {
    try {
      await this.db.query('SELECT 1');
      return { status: 'ok', database: 'connected' };
    } catch (error) {
      return { status: 'error', database: 'disconnected' };
    }
  }
}
```

## 🔧 Build Process

### 1. Development Build

```bash
# Run in development mode
npm run start:dev

# - Uses ts-node
# - Hot reload
# - Source maps
# - Debug info
```

### 2. Production Build

```bash
# Build for production
npm run build

# Output:
# dist/
#   ├── main.js          # Compiled JavaScript
#   ├── main.js.map      # Source maps
#   └── ...

# - Transpile TypeScript to JavaScript
# - Minify code
# - Tree shaking (remove unused code)
# - Optimized for production
```

### 3. Start Production

```bash
# Start production server
npm run start:prod

# Or use PM2 for process management
pm2 start dist/main.js --name "my-app"
pm2 startup
pm2 save
```

## 📦 Deployment Files

### package.json

```json
{
  "name": "my-nestjs-app",
  "version": "1.0.0",
  "scripts": {
    "build": "nest build",
    "start": "node dist/main",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### Procfile (Heroku/Render)

```
web: npm run start:prod
```

### Dockerfile

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
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## 🎯 Deployment Steps Overview

```
1. Code Ready
   └─> Lint ✅
   └─> Test ✅
   └─> Build ✅

2. Prepare Server
   └─> Choose platform
   └─> Create account
   └─> Configure settings

3. Environment Variables
   └─> Set DATABASE_URL
   └─> Set JWT_SECRET
   └─> Set API_KEYS

4. Database Setup
   └─> Create database
   └─> Run migrations
   └─> Seed data (if needed)

5. Deploy
   └─> Push to Git
   └─> Auto-deploy
   └─> Or manual deploy

6. Verify
   └─> Check health endpoint
   └─> Test API
   └─> Monitor logs
   └─> Check performance

7. Monitor
   └─> Set up alerts
   └─> Track errors
   └─> Monitor uptime
   └─> Analyze performance
```

## ⚠️ Common Deployment Issues

### 1. Port Binding

```typescript
// ❌ Hardcoded port
await app.listen(3000);

// ✅ Use environment variable
await app.listen(process.env.PORT || 3000);
```

### 2. Database Connection

```typescript
// ❌ Hardcoded localhost
const db = new Database('localhost:5432');

// ✅ Use environment variable
const db = new Database(process.env.DATABASE_URL);
```

### 3. CORS Issues

```typescript
// ❌ Allow all origins in production
app.enableCors({ origin: '*' });

// ✅ Whitelist specific origins
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
});
```

## 📊 Summary

**Deployment Checklist:**
- ✅ Code quality (lint, test, build)
- ✅ Environment variables configured
- ✅ Database setup (migrations, backups)
- ✅ Security enabled (CORS, Helmet, rate limiting)
- ✅ Performance optimized (compression, caching)
- ✅ Logging & monitoring setup
- ✅ Health check endpoint
- ✅ Choose deployment platform
- ✅ Deploy and verify

**Remember:**
- Development ≠ Production
- Always use environment variables
- Enable security features
- Monitor your application
- Have rollback plan

---

**Next Chapter:** Environment Configuration - Managing config for different environments! ⚙️
