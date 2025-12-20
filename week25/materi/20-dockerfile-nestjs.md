# Creating Dockerfile for NestJS Applications

## Apa itu Dockerfile?

### Analogi: Resep Masakan

**Dockerfile** = Resep lengkap untuk membuat container:

```
Resep Nasi Goreng:             Dockerfile:
1. Siapkan wajan              FROM node:18-alpine
2. Panaskan minyak            WORKDIR /app
3. Tumis bumbu                COPY package*.json ./
4. Masukkan nasi              RUN npm ci
5. Aduk rata                  COPY . .
6. Sajikan                    RUN npm run build
                               CMD ["node", "dist/main.js"]

Siapa pun yang ikuti resep    Siapa pun yang build Dockerfile
→ Dapat nasi goreng sama      → Dapat container yang sama
```

## Basic Dockerfile Structure

### Simple Example

```dockerfile
# 1. Base Image - Dasar/Foundation
FROM node:18-alpine

# 2. Working Directory - Folder kerja di dalam container
WORKDIR /app

# 3. Copy Dependencies - Copy file package.json
COPY package*.json ./

# 4. Install Dependencies
RUN npm ci --only=production

# 5. Copy Application Code
COPY . .

# 6. Build TypeScript
RUN npm run build

# 7. Expose Port - Dokumentasi port yang digunakan
EXPOSE 3000

# 8. Start Command - Perintah saat container start
CMD ["node", "dist/main.js"]
```

## Dockerfile Instructions Explained

### FROM - Base Image

```dockerfile
# Format: FROM <image>:<tag>

# ✅ Alpine Linux - Smallest (~5MB base)
FROM node:18-alpine

# Standard Debian - Larger (~150MB base)
FROM node:18

# Specific version - Best for production
FROM node:18.17.1-alpine3.18
```

**Choosing Base Image:**
- `alpine` → Smallest, fastest, production-ready
- `slim` → Medium size, good balance
- Default → Full features, largest size

### WORKDIR - Set Working Directory

```dockerfile
# Sets working directory inside container
WORKDIR /app

# All subsequent commands run from /app
# Like doing: cd /app
```

```
Container Filesystem:
/
├── app/                    ← WORKDIR /app points here
│   ├── node_modules/
│   ├── dist/
│   ├── src/
│   └── package.json
├── usr/
├── etc/
└── var/
```

### COPY - Copy Files

```dockerfile
# Format: COPY <source> <destination>

# Copy package files only
COPY package*.json ./

# Copy all files (respects .dockerignore)
COPY . .

# Copy specific folder
COPY src/ ./src/

# Copy and rename
COPY .env.production .env
```

**Why copy package.json first?**
```dockerfile
# ✅ Good - Leverage Docker cache
COPY package*.json ./      # Only re-run if package.json changes
RUN npm ci
COPY . .                   # Code changes don't reinstall npm

# ❌ Bad - Reinstall every time code changes
COPY . .
RUN npm ci                 # Runs every build (slow!)
```

### RUN - Execute Commands

```dockerfile
# Install dependencies
RUN npm ci --only=production

# Build TypeScript
RUN npm run build

# Multiple commands in one RUN (single layer)
RUN npm ci && \
    npm run build && \
    npm prune --production

# Install system packages (Alpine)
RUN apk add --no-cache python3 make g++
```

### EXPOSE - Document Ports

```dockerfile
# Document that app uses port 3000
EXPOSE 3000

# Multiple ports
EXPOSE 3000 9229
```

⚠️ **Important:** `EXPOSE` is only documentation. You must use `-p` flag when running:
```bash
docker run -p 3000:3000 my-app
```

### CMD - Default Command

```dockerfile
# JSON array format (recommended)
CMD ["node", "dist/main.js"]

# Shell format
CMD node dist/main.js

# With npm
CMD ["npm", "run", "start:prod"]
```

### ENTRYPOINT vs CMD

```dockerfile
# ENTRYPOINT - Fixed command
ENTRYPOINT ["node"]

# CMD - Arguments to ENTRYPOINT
CMD ["dist/main.js"]

# Result: node dist/main.js

# Override CMD at runtime:
docker run my-app dist/other.js
# Result: node dist/other.js
```

## Production Dockerfile for Todo API

### Complete Production-Ready Dockerfile

```dockerfile
# ================================
# Stage 1: Build Stage
# ================================
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# ================================
# Stage 2: Production Stage
# ================================
FROM node:18-alpine AS production

# Install dumb-init (proper signal handling)
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder stage
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

# Start application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
```

### Multi-Stage Build Explained

```
Stage 1: Builder                    Stage 2: Production
┌────────────────────┐              ┌────────────────────┐
│ node:18-alpine     │              │ node:18-alpine     │
│                    │              │                    │
│ + Build tools      │              │ Only runtime       │
│ + All dependencies │  ──────────▶ │ + Built app        │
│ + Source code      │   Copy       │ + Prod deps        │
│ + Dev dependencies │   artifacts  │                    │
│                    │              │                    │
│ Size: ~500MB       │              │ Size: ~200MB       │
└────────────────────┘              └────────────────────┘
                                    ↓
                                Final Image (200MB)
```

**Benefits:**
1. Smaller final image (no build tools)
2. Faster deployments
3. More secure (less attack surface)
4. Cleaner production environment

## .dockerignore File

### Why .dockerignore?

```
Without .dockerignore:          With .dockerignore:
COPY . .                        COPY . .
                                
Copies:                         Copies only:
✓ src/                          ✓ src/
✓ dist/                         ✓ package.json
✓ package.json                  ✓ tsconfig.json
✗ node_modules/ (500MB!)        
✗ .git/ (100MB)                 Skip:
✗ coverage/                     ✗ node_modules/
✗ *.test.ts                     ✗ .git/
✗ .env                          ✗ tests/
                                ✗ *.test.ts
Total: 650MB                    Total: 5MB
Build time: 5 minutes           Build time: 30 seconds
```

### Complete .dockerignore

```bash
# .dockerignore

# Dependencies
node_modules
npm-debug.log
yarn-error.log

# Testing
coverage
*.test.ts
*.spec.ts
test/
__tests__/

# Build outputs
dist
build

# Environment files
.env
.env.local
.env.*.local

# Git
.git
.gitignore
.gitattributes

# IDE
.vscode
.idea
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Documentation
README.md
CHANGELOG.md
LICENSE
docs/

# CI/CD
.github
.gitlab-ci.yml
.travis.yml

# Docker
Dockerfile
docker-compose.yml
.dockerignore
```

## Building and Running

### Build Image

```bash
# Basic build
docker build -t todo-api .

# Build with tag
docker build -t todo-api:v1.0.0 .

# Build with build arguments
docker build \
  --build-arg NODE_ENV=production \
  -t todo-api:prod .

# View build progress
docker build -t todo-api . --progress=plain

# Build without cache (fresh build)
docker build -t todo-api . --no-cache
```

### Run Container

```bash
# Basic run
docker run todo-api

# Run with port mapping
docker run -p 3000:3000 todo-api

# Run in background (detached)
docker run -d -p 3000:3000 --name my-api todo-api

# Run with environment variables
docker run -d -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=secret \
  todo-api

# Run with .env file
docker run -d -p 3000:3000 \
  --env-file .env.production \
  todo-api

# Run with volume (for logs)
docker run -d -p 3000:3000 \
  -v $(pwd)/logs:/app/logs \
  todo-api

# Run with restart policy
docker run -d -p 3000:3000 \
  --restart unless-stopped \
  todo-api
```

### Test Container

```bash
# Check if container is running
docker ps

# View logs
docker logs my-api

# Follow logs
docker logs -f my-api

# Test API
curl http://localhost:3000/health

# Execute command inside container
docker exec -it my-api sh

# Inside container:
$ ls
$ pwd
$ ps aux
$ exit
```

## Optimization Techniques

### 1. Layer Caching

```dockerfile
# ❌ Bad - Full rebuild every code change
COPY . .
RUN npm ci
RUN npm run build

# ✅ Good - Cache dependencies
COPY package*.json ./
RUN npm ci               # Cached if package.json unchanged
COPY . .
RUN npm run build        # Only rebuilds app code
```

### 2. Multi-Stage Build

```dockerfile
# ❌ Single stage - Large image
FROM node:18
COPY . .
RUN npm ci && npm run build
CMD ["node", "dist/main.js"]
# Result: ~500MB

# ✅ Multi-stage - Small image
FROM node:18 AS builder
COPY . .
RUN npm ci && npm run build

FROM node:18-alpine
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]
# Result: ~200MB
```

### 3. Use Alpine Linux

```dockerfile
# ❌ Large base image
FROM node:18              # ~150MB base

# ✅ Minimal base image
FROM node:18-alpine       # ~5MB base
```

### 4. Combine RUN Commands

```dockerfile
# ❌ Multiple layers
RUN npm install express
RUN npm install bcrypt
RUN npm install jsonwebtoken

# ✅ Single layer
RUN npm install express bcrypt jsonwebtoken
```

### 5. Clean Up in Same Layer

```dockerfile
# ❌ Cleanup in separate layer (doesn't reduce size)
RUN npm ci
RUN rm -rf /tmp/*

# ✅ Cleanup in same layer
RUN npm ci && \
    rm -rf /tmp/* && \
    npm cache clean --force
```

## Environment-Specific Dockerfiles

### Development Dockerfile

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Hot reload dependencies
RUN npm install -g nodemon

COPY package*.json ./
RUN npm install  # Include devDependencies

COPY . .

# Development port
EXPOSE 3000

# Development mode with hot reload
CMD ["npm", "run", "start:dev"]
```

```bash
# Build dev image
docker build -f Dockerfile.dev -t todo-api:dev .

# Run with volume for hot reload
docker run -d -p 3000:3000 \
  -v $(pwd)/src:/app/src \
  todo-api:dev
```

### Production Dockerfile

Already shown above with multi-stage build.

## Docker Compose for Development

### docker-compose.yml

```yaml
version: '3.8'

services:
  # Application
  api:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@db:5432/todo_dev
      - JWT_SECRET=dev-secret
    volumes:
      - ./src:/app/src
    depends_on:
      - db
    command: npm run start:dev

  # Database
  db:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=todo_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Database Admin (optional)
  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db

volumes:
  postgres_data:
```

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build
```

## Common Dockerfile Patterns

### Pattern 1: Health Check

```dockerfile
# Built-in health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Using Node.js
HEALTHCHECK CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

### Pattern 2: Build Arguments

```dockerfile
# Accept build argument
ARG NODE_ENV=production

# Use build argument
ENV NODE_ENV=$NODE_ENV

# Install based on environment
RUN if [ "$NODE_ENV" = "production" ]; then \
      npm ci --only=production; \
    else \
      npm ci; \
    fi
```

```bash
# Build with argument
docker build --build-arg NODE_ENV=development -t api:dev .
```

### Pattern 3: Non-Root User

```dockerfile
# Create user and group
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Set ownership
COPY --chown=nestjs:nodejs . .

# Switch to user
USER nestjs

# Now all commands run as nestjs user
CMD ["node", "dist/main.js"]
```

## Troubleshooting

### Issue 1: Build Fails

```bash
# View detailed build output
docker build -t api . --progress=plain --no-cache

# Check build context size
du -sh .
# If > 100MB, check .dockerignore
```

### Issue 2: Container Exits Immediately

```bash
# Check logs
docker logs <container-id>

# Run interactively to see errors
docker run -it api sh

# Override CMD to debug
docker run -it api /bin/sh
```

### Issue 3: "Cannot find module"

```dockerfile
# Make sure you copy node_modules
COPY --from=builder /app/node_modules ./node_modules

# Or install in production stage
RUN npm ci --only=production
```

### Issue 4: Environment Variables Not Working

```bash
# Check if ENV is set
docker exec api env

# Pass ENV at runtime
docker run -e DATABASE_URL=... api

# Or use --env-file
docker run --env-file .env.production api
```

## Best Practices Summary

### ✅ DO:

1. Use multi-stage builds
2. Use specific image tags (not `latest`)
3. Create .dockerignore file
4. Use Alpine Linux for smaller images
5. Copy package.json before source code
6. Run as non-root user
7. Add health checks
8. Combine RUN commands
9. Clean up in the same layer
10. Use build cache effectively

### ❌ DON'T:

1. Use `latest` tag in production
2. Install unnecessary dependencies
3. Copy node_modules from host
4. Run as root user
5. Include secrets in Dockerfile
6. Create too many layers
7. Forget .dockerignore
8. Use development dependencies in production

## Summary

**Key Concepts:**

1. **Dockerfile** - Recipe for building Docker images
2. **Multi-stage build** - Smaller, more secure production images
3. **.dockerignore** - Exclude unnecessary files from build context
4. **Layer caching** - Speed up builds by caching unchanged layers
5. **Alpine Linux** - Minimal base image for smaller containers

**Image Size Comparison:**

| Approach | Image Size |
|----------|------------|
| Default Node image, single stage | ~800MB |
| Alpine, single stage | ~500MB |
| Multi-stage with Alpine | ~200MB |
| Optimized multi-stage | ~150MB |

---

**Practice Exercise:**

1. Create a Dockerfile for your Todo API
2. Create .dockerignore file
3. Build the Docker image
4. Run container locally
5. Test the API endpoints
6. Optimize Dockerfile for smaller image size
7. Create docker-compose.yml for local development

**Next:** Deployment strategies and container orchestration!
