# Deployment Exercises - Week 25

Latihan praktis untuk menguasai deployment fundamentals, Docker, dan production best practices.

---

## Exercise 1: Environment Configuration ⚙️

### Objective
Membuat dan mengelola environment variables untuk development dan production.

### Tasks

#### 1.1 Create Environment Files

Buat 3 environment files untuk aplikasi Todo API:

```bash
# .env.development
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost:5432/todo_dev
DATABASE_SSL=false
DATABASE_POOL_SIZE=10

JWT_SECRET=dev-secret-key-for-testing-only
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3001
CORS_ORIGINS=http://localhost:3001,http://localhost:3000

ENABLE_SWAGGER=true
LOG_LEVEL=debug
```

```bash
# .env.production
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@railway.app:5432/todo_prod?ssl=true
DATABASE_SSL=true
DATABASE_POOL_SIZE=20

# Generate secure 32+ character secret
JWT_SECRET=???  # Your generated secret here
JWT_EXPIRES_IN=1h

FRONTEND_URL=https://myapp.com
CORS_ORIGINS=https://myapp.com

ENABLE_SWAGGER=false
LOG_LEVEL=error
```

```bash
# .env.example (template untuk tim)
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost:5432/database_name
DATABASE_SSL=false
DATABASE_POOL_SIZE=10

JWT_SECRET=your-secret-key-minimum-32-characters
JWT_EXPIRES_IN=1h

FRONTEND_URL=http://localhost:3001
CORS_ORIGINS=http://localhost:3001

ENABLE_SWAGGER=true
LOG_LEVEL=debug
```

#### 1.2 Update .gitignore

```bash
# Add to .gitignore
.env
.env.local
.env.development
.env.test
.env.production

# Keep only example
!.env.example
```

#### 1.3 Generate Secure Secrets

```bash
# Generate JWT secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online generator (recommended)
# https://generate-secret.vercel.app/32
```

#### 1.4 Validation Task

Create validation function:

```typescript
// src/config/validation.ts
export function validateEnvironment() {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'PORT',
    'NODE_ENV'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate JWT secret length
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }

  console.log('✅ Environment variables validated');
}
```

Add to `main.ts`:

```typescript
import { validateEnvironment } from './config/validation';

async function bootstrap() {
  // Validate before creating app
  validateEnvironment();
  
  const app = await NestFactory.create(AppModule);
  // ... rest of bootstrap
}
```

### Expected Outcome
- ✅ Three environment files created
- ✅ Secure JWT secret generated (32+ chars)
- ✅ .gitignore updated
- ✅ Validation function working
- ✅ App fails fast if env vars missing

---

## Exercise 2: Dockerfile Creation 🐳

### Objective
Create production-ready Dockerfile dengan multi-stage build.

### Tasks

#### 2.1 Create .dockerignore

```bash
# .dockerignore
node_modules
npm-debug.log
dist
coverage
.env
.env.*
!.env.example
.git
.gitignore
README.md
.vscode
.idea
*.test.ts
*.spec.ts
test/
__tests__/
.DS_Store
```

#### 2.2 Create Dockerfile

```dockerfile
# Dockerfile
# ======================
# Stage 1: Builder
# ======================
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# ======================
# Stage 2: Production
# ======================
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# Copy from builder
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
```

#### 2.3 Build and Test

```bash
# Build image
docker build -t todo-api:v1 .

# Check image size
docker images todo-api:v1

# Run container
docker run -d \
  --name todo-api \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://localhost:5432/todo \
  -e JWT_SECRET=test-secret-key-32-characters-long \
  todo-api:v1

# Check logs
docker logs -f todo-api

# Test API
curl http://localhost:3000/health

# Stop and remove
docker stop todo-api
docker rm todo-api
```

#### 2.4 Optimize Image Size

Challenge: Reduce image size as much as possible!

**Current size**: ~250MB  
**Target**: <200MB

Tips:
- Remove unnecessary files in builder stage
- Use `npm ci --only=production`
- Clean npm cache
- Remove build tools after build

### Expected Outcome
- ✅ Docker image builds successfully
- ✅ Image size < 200MB
- ✅ Container runs and passes health check
- ✅ API endpoints accessible
- ✅ Runs as non-root user

---

## Exercise 3: Docker Compose Setup 🐋

### Objective
Create docker-compose.yml untuk local development dengan multiple services.

### Tasks

#### 3.1 Create docker-compose.yml

```yaml
version: '3.8'

services:
  # API Service
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: todo-api
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://todouser:todopass@postgres:5432/tododb
      - JWT_SECRET=dev-secret-key-for-docker-compose-testing-32-chars
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - app-network
    volumes:
      - ./logs:/app/logs

  # PostgreSQL Database
  postgres:
    image: postgres:14-alpine
    container_name: todo-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_USER=todouser
      - POSTGRES_PASSWORD=todopass
      - POSTGRES_DB=tododb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U todouser"]
      interval: 5s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: todo-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network

  # Adminer (Database UI)
  adminer:
    image: adminer:latest
    container_name: adminer
    restart: unless-stopped
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

#### 3.2 Test Docker Compose

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api

# Test API
curl http://localhost:3000/health

# Access Adminer
open http://localhost:8080
# Server: postgres
# Username: todouser
# Password: todopass
# Database: tododb

# Stop all services
docker-compose down

# Remove volumes (clean start)
docker-compose down -v
```

### Expected Outcome
- ✅ All 4 services start successfully
- ✅ API connects to PostgreSQL
- ✅ Health check returns OK
- ✅ Adminer accessible at localhost:8080
- ✅ Data persists in volumes

---

## Exercise 4: Railway Deployment 🚂

### Objective
Deploy Todo API ke Railway dengan proper configuration.

### Tasks

#### 4.1 Install Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login
```

#### 4.2 Prepare Project

```bash
# Create railway.json
cat > railway.json << EOF
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF
```

#### 4.3 Initialize and Deploy

```bash
# Initialize Railway project
railway init

# Link to GitHub (optional but recommended)
railway link

# Add PostgreSQL service
railway add postgresql

# Deploy
railway up
```

#### 4.4 Configure Environment Variables

Via Railway Dashboard or CLI:

```bash
# Set environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=<your-32-char-secret>
railway variables set JWT_EXPIRES_IN=1h
railway variables set PORT=3000
```

#### 4.5 Verify Deployment

```bash
# Get deployment URL
railway domain

# View logs
railway logs

# Test health endpoint
curl https://your-app.railway.app/health

# Test API
curl https://your-app.railway.app/api/todos
```

### Expected Outcome
- ✅ Project deployed to Railway
- ✅ PostgreSQL database connected
- ✅ Environment variables configured
- ✅ Health check passes
- ✅ API endpoints accessible via HTTPS

---

## Exercise 5: Production Monitoring 📊

### Objective
Implement health checks, logging, dan monitoring untuk production.

### Tasks

#### 5.1 Health Check Controller

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
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      () => this.disk.checkStorage('disk', { threshold: 250 * 1024 * 1024 * 1024, path: '/' }), // 250GB
    ]);
  }

  @Get('liveness')
  liveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('readiness')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 300 }),
    ]);
  }
}
```

#### 5.2 Install Dependencies

```bash
npm install @nestjs/terminus
```

#### 5.3 Configure Health Module

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

Import in AppModule:

```typescript
@Module({
  imports: [
    HealthModule,
    // ... other modules
  ],
})
export class AppModule {}
```

#### 5.4 Test Health Checks

```bash
# Start application
npm run start:dev

# Test health endpoints
curl http://localhost:3000/health
curl http://localhost:3000/health/liveness
curl http://localhost:3000/health/readiness

# Expected response:
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" },
    "memory_rss": { "status": "up" },
    "disk": { "status": "up" }
  }
}
```

### Expected Outcome
- ✅ Health check endpoints working
- ✅ Database health checked
- ✅ Memory usage monitored
- ✅ Disk space monitored
- ✅ Liveness and readiness probes separate

---

## Exercise 6: CI/CD Pipeline 🔄

### Objective
Setup GitHub Actions untuk automated testing dan deployment.

### Tasks

#### 6.1 Create GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Railway

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Run test coverage
        run: npm run test:cov

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Build Docker image
        run: docker build -t todo-api:${{ github.sha }} .

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install Railway CLI
        run: npm install -g @railway/cli

      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: railway up --service todo-api
```

#### 6.2 Add Railway Token

1. Get Railway token:
```bash
railway login
railway whoami --token
```

2. Add to GitHub Secrets:
   - Go to repository Settings → Secrets → Actions
   - Add new secret: `RAILWAY_TOKEN`
   - Paste your Railway token

#### 6.3 Test Workflow

```bash
# Make a change
echo "# Test deployment" >> README.md

# Commit and push
git add .
git commit -m "test: CI/CD pipeline"
git push origin main

# Check GitHub Actions tab
# Should see workflow running
```

### Expected Outcome
- ✅ Workflow runs on every push
- ✅ Tests run automatically
- ✅ Docker image builds
- ✅ Deploys to Railway on main branch
- ✅ Notifications on failure

---

## Bonus Exercise: Load Testing 🚀

### Objective
Test aplikasi under load untuk measure performance.

### Tasks

#### Install Artillery

```bash
npm install -g artillery
```

#### Create Load Test

```yaml
# load-test.yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Load test"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"
  http:
    timeout: 10

scenarios:
  - name: "Health check"
    weight: 30
    flow:
      - get:
          url: "/health"

  - name: "Get todos"
    weight: 50
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
          capture:
            - json: "$.access_token"
              as: "token"
      - get:
          url: "/api/todos"
          headers:
            Authorization: "Bearer {{ token }}"

  - name: "Create todo"
    weight: 20
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
          capture:
            - json: "$.access_token"
              as: "token"
      - post:
          url: "/api/todos"
          headers:
            Authorization: "Bearer {{ token }}"
          json:
            title: "Load test todo"
            description: "Created during load test"
```

#### Run Load Test

```bash
# Start application
npm run start:dev

# Run load test
artillery run load-test.yml

# View results
# - Request rate
# - Response times (min, max, median, p95, p99)
# - Error rate
```

### Expected Outcome
- ✅ Application handles 50 req/s
- ✅ P95 response time < 500ms
- ✅ Error rate < 1%
- ✅ No memory leaks during test

---

## 📝 Submission Checklist

Mark completed exercises:

- [ ] **Exercise 1**: Environment configuration complete
- [ ] **Exercise 2**: Dockerfile created and optimized
- [ ] **Exercise 3**: Docker Compose working
- [ ] **Exercise 4**: Deployed to Railway
- [ ] **Exercise 5**: Health checks implemented
- [ ] **Exercise 6**: CI/CD pipeline working
- [ ] **Bonus**: Load testing completed

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ Application runs in Docker container  
✅ Environment variables properly configured  
✅ Health checks return 200 OK  
✅ Deployed to Railway with HTTPS  
✅ CI/CD pipeline passes all tests  
✅ Handles 50+ requests per second  
✅ No security vulnerabilities  
✅ Proper error handling and logging  

---

## 📚 Resources

- Docker Documentation: https://docs.docker.com/
- Railway Docs: https://docs.railway.app/
- GitHub Actions: https://docs.github.com/en/actions
- Artillery Load Testing: https://artillery.io/docs/

Good luck! 🚀
