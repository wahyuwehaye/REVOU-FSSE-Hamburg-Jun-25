# Container Deployment Strategies

## Deployment Overview

### From Local to Production

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Local      │─────▶│   Registry   │─────▶│  Production  │
│ Development  │ Push │ Docker Hub   │ Pull │   Server     │
└──────────────┘      └──────────────┘      └──────────────┘
     ↓                      ↓                      ↓
  Build Image           Store Image            Run Container
  Test Locally          Version Control        Auto-restart
  Tag Version           Access Control         Load Balancing
```

## Deployment Strategies

### 1. Single-Host Deployment

**Apa itu?**
Deploy semua containers di satu server.

```
┌────────────────────────────────────┐
│     Single Server (Railway)        │
│                                    │
│  ┌──────────┐  ┌──────────┐      │
│  │  API     │  │  DB      │      │
│  │Container │  │Container │      │
│  │:3000     │  │:5432     │      │
│  └──────────┘  └──────────┘      │
│                                    │
│  ┌──────────┐  ┌──────────┐      │
│  │  Redis   │  │  Worker  │      │
│  │Container │  │Container │      │
│  └──────────┘  └──────────┘      │
└────────────────────────────────────┘
```

**Cocok untuk:**
- Small to medium applications
- Startups and MVPs
- Personal projects
- Limited budget

**Pros:**
- ✅ Simple setup
- ✅ Easy management
- ✅ Lower cost
- ✅ Direct control

**Cons:**
- ❌ Single point of failure
- ❌ Limited scaling
- ❌ No geographic distribution
- ❌ Downtime during updates

### 2. Multi-Host Deployment

**Apa itu?**
Deploy containers across multiple servers with orchestration.

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Server 1   │  │  Server 2   │  │  Server 3   │
│             │  │             │  │             │
│  ┌────────┐ │  │  ┌────────┐ │  │  ┌────────┐ │
│  │ API    │ │  │  │ API    │ │  │  │ DB     │ │
│  │Replica1│ │  │  │Replica2│ │  │  │Primary │ │
│  └────────┘ │  │  └────────┘ │  │  └────────┘ │
│  ┌────────┐ │  │  ┌────────┐ │  │  ┌────────┐ │
│  │ Redis  │ │  │  │ Worker │ │  │  │ DB     │ │
│  └────────┘ │  │  └────────┘ │  │  │Replica │ │
└─────────────┘  └─────────────┘  └─────────────┘
       ↑                ↑                ↑
       └────────────────┴────────────────┘
              Load Balancer
```

**Cocok untuk:**
- Large-scale applications
- High availability requirements
- Geographic distribution
- Enterprise applications

**Pros:**
- ✅ High availability
- ✅ Horizontal scaling
- ✅ Load distribution
- ✅ Zero-downtime updates
- ✅ Geographic redundancy

**Cons:**
- ❌ Complex setup
- ❌ Higher cost
- ❌ Requires orchestration (Kubernetes, Docker Swarm)
- ❌ More management overhead

## Single-Host Deployment Guide

### Option 1: Railway Deployment

#### Step 1: Prepare Repository

```bash
# Your project structure
todo-api/
├── src/
├── dist/
├── package.json
├── Dockerfile          ← Required
├── .dockerignore       ← Required
├── railway.json        ← Optional
└── .env.example        ← Document env vars
```

#### Step 2: Create Railway Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to GitHub repo (recommended)
railway link
```

#### Step 3: Configure Environment Variables

```bash
# Via CLI
railway variables set DATABASE_URL=postgresql://...
railway variables set JWT_SECRET=your-secret-key
railway variables set NODE_ENV=production

# Or via Railway Dashboard:
# 1. Go to your project
# 2. Click "Variables"
# 3. Add environment variables
```

#### Step 4: Deploy

```bash
# Deploy from local
railway up

# Or connect GitHub for automatic deployments:
# 1. Push to GitHub
# 2. Railway auto-deploys on push
```

#### railway.json Configuration

```json
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
```

### Option 2: DigitalOcean App Platform

#### Create app.yaml

```yaml
name: todo-api
region: sgp

services:
  - name: api
    github:
      repo: your-username/todo-api
      branch: main
      deploy_on_push: true
    
    dockerfile_path: Dockerfile
    
    http_port: 3000
    
    instance_count: 1
    instance_size_slug: basic-xs
    
    envs:
      - key: DATABASE_URL
        scope: RUN_AND_BUILD_TIME
        value: ${db.DATABASE_URL}
      - key: JWT_SECRET
        scope: RUN_TIME
        type: SECRET
        value: your-secret-key
      - key: NODE_ENV
        scope: RUN_TIME
        value: production
    
    health_check:
      http_path: /health
      initial_delay_seconds: 10
      period_seconds: 10
      timeout_seconds: 5
      success_threshold: 1
      failure_threshold: 3

databases:
  - name: db
    engine: PG
    version: "14"
    production: true
    num_nodes: 1
```

```bash
# Deploy with CLI
doctl apps create --spec app.yaml

# Or use web interface
# 1. Connect GitHub
# 2. Select repository
# 3. Configure build settings
# 4. Add environment variables
# 5. Deploy
```

### Option 3: Docker on VPS (Manual)

```bash
# 1. SSH to VPS
ssh root@your-server-ip

# 2. Install Docker
curl -fsSL https://get.docker.com | sh

# 3. Pull your image
docker pull yourusername/todo-api:latest

# 4. Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://...
JWT_SECRET=secret
NODE_ENV=production
PORT=3000
EOF

# 5. Run container
docker run -d \
  --name todo-api \
  --restart unless-stopped \
  -p 80:3000 \
  --env-file .env \
  yourusername/todo-api:latest

# 6. Setup reverse proxy (Nginx)
apt install nginx

cat > /etc/nginx/sites-available/api << EOF
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 7. Setup SSL with Let's Encrypt
apt install certbot python3-certbot-nginx
certbot --nginx -d api.yourdomain.com
```

## Docker Compose for Production

### docker-compose.prod.yml

```yaml
version: '3.8'

services:
  # API Service
  api:
    image: yourusername/todo-api:latest
    container_name: todo-api
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/tododb
      - JWT_SECRET=${JWT_SECRET}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s

  # Database
  db:
    image: postgres:14-alpine
    container_name: postgres
    restart: unless-stopped
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=tododb
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - api
    networks:
      - app-network

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  app-network:
    driver: bridge
```

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    upstream api {
        server api:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    server {
        listen 80;
        server_name api.yourdomain.com;

        # Redirect to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name api.yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security Headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # API Proxy
        location / {
            limit_req zone=api_limit burst=20 nodelay;
            
            proxy_pass http://api;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Health Check (no rate limit)
        location /health {
            proxy_pass http://api/health;
            access_log off;
        }
    }
}
```

### Deploy with Docker Compose

```bash
# 1. Create .env file
cat > .env << EOF
JWT_SECRET=your-secret-key
DB_PASSWORD=secure-password
REDIS_PASSWORD=redis-password
EOF

# 2. Pull latest images
docker-compose -f docker-compose.prod.yml pull

# 3. Start services
docker-compose -f docker-compose.prod.yml up -d

# 4. Check status
docker-compose -f docker-compose.prod.yml ps

# 5. View logs
docker-compose -f docker-compose.prod.yml logs -f api

# 6. Scale API service
docker-compose -f docker-compose.prod.yml up -d --scale api=3
```

## Multi-Host Deployment with Kubernetes

### Kubernetes Basics

```
┌─────────────────────────────────────────┐
│         Kubernetes Cluster              │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │      Master Node                  │ │
│  │  (Control Plane)                  │ │
│  └───────────────────────────────────┘ │
│           │                             │
│           ├────────┬─────────┬─────────┤
│           ▼        ▼         ▼         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ Worker  │ │ Worker  │ │ Worker  │  │
│  │ Node 1  │ │ Node 2  │ │ Node 3  │  │
│  │         │ │         │ │         │  │
│  │ Pods    │ │ Pods    │ │ Pods    │  │
│  └─────────┘ └─────────┘ └─────────┘  │
└─────────────────────────────────────────┘
```

### Kubernetes Deployment YAML

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-api
  labels:
    app: todo-api
spec:
  replicas: 3  # Run 3 instances
  selector:
    matchLabels:
      app: todo-api
  template:
    metadata:
      labels:
        app: todo-api
    spec:
      containers:
      - name: api
        image: yourusername/todo-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: todo-api-service
spec:
  selector:
    app: todo-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer

---
# secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  url: postgresql://user:pass@db-host:5432/tododb

---
apiVersion: v1
kind: Secret
metadata:
  name: jwt-secret
type: Opaque
stringData:
  secret: your-jwt-secret-key-here
```

```bash
# Deploy to Kubernetes
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f secrets.yaml

# Check deployment
kubectl get deployments
kubectl get pods
kubectl get services

# Scale deployment
kubectl scale deployment todo-api --replicas=5

# Update image (rolling update)
kubectl set image deployment/todo-api api=yourusername/todo-api:v2

# View logs
kubectl logs -f deployment/todo-api

# Delete deployment
kubectl delete deployment todo-api
```

## Zero-Downtime Deployment

### Rolling Update Strategy

```
Current State:          Rolling Update:         New State:
┌────────┐             ┌────────┐              ┌────────┐
│ V1     │ ──┐         │ V1     │              │ V2     │
└────────┘   │         └────────┘              └────────┘
┌────────┐   │         ┌────────┐              ┌────────┐
│ V1     │   │   ───▶  │ V1     │  ───▶        │ V2     │
└────────┘   │         └────────┘              └────────┘
┌────────┐   │         ┌────────┐              ┌────────┐
│ V1     │ ──┘         │ V2     │ ◀── Start    │ V2     │
└────────┘             └────────┘              └────────┘

All V1                 Mixed V1/V2            All V2
```

### Blue-Green Deployment

```
Blue (Current):        Switch:               Green (New):
┌────────────┐         │                    ┌────────────┐
│   Blue     │         │                    │   Green    │
│  (V1)      │◀────────┤◀────Load          │  (V2)      │◀─┐
│            │  100%   │    Balancer        │            │  │
│ Running    │         │                    │ Standby    │  │
└────────────┘         │                    └────────────┘  │
                       │                                    │
                       └────Switch traffic 100%─────────────┘
```

### Canary Deployment

```
Step 1: 10% to new version
┌────────┐ 90%
│ V1     │◀────┐
└────────┘     │
┌────────┐     │   Load
│ V1     │◀────┤   Balancer
└────────┘     │
┌────────┐ 10% │
│ V2     │◀────┘
└────────┘

Step 2: Monitor metrics

Step 3: 100% to new version if OK
┌────────┐ 100%
│ V2     │◀────┐
└────────┘     │   Load
┌────────┐     ├   Balancer
│ V2     │◀────┤
└────────┘     │
┌────────┐     │
│ V2     │◀────┘
└────────┘
```

## Monitoring Production Deployments

### Health Checks

```typescript
// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
  
  @Get('liveness')
  liveness() {
    return { status: 'ok', timestamp: new Date().toISOString() };
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

### Logging

```typescript
// src/logger/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class AppLogger implements LoggerService {
  log(message: string, context?: string) {
    console.log(JSON.stringify({
      level: 'info',
      message,
      context,
      timestamp: new Date().toISOString(),
    }));
  }

  error(message: string, trace?: string, context?: string) {
    console.error(JSON.stringify({
      level: 'error',
      message,
      trace,
      context,
      timestamp: new Date().toISOString(),
    }));
  }

  warn(message: string, context?: string) {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      context,
      timestamp: new Date().toISOString(),
    }));
  }
}
```

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code reviewed and merged
- [ ] Database migrations prepared
- [ ] Environment variables configured
- [ ] Health check endpoints working
- [ ] Logging configured
- [ ] Error tracking set up
- [ ] Security headers configured
- [ ] CORS properly set
- [ ] Rate limiting configured
- [ ] Docker image built and tested
- [ ] Backup strategy in place

### Deployment

- [ ] Backup database
- [ ] Run database migrations
- [ ] Deploy new version
- [ ] Verify health check endpoints
- [ ] Test critical user flows
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify external integrations

### Post-Deployment

- [ ] Monitor application logs
- [ ] Check error tracking service
- [ ] Verify database connections
- [ ] Test API endpoints
- [ ] Monitor resource usage
- [ ] Check response times
- [ ] Verify auto-scaling (if configured)
- [ ] Update documentation
- [ ] Notify team of deployment

### Rollback Plan

- [ ] Previous version image available
- [ ] Database rollback scripts ready
- [ ] Rollback procedure documented
- [ ] Team notified of rollback process

## Summary

**Deployment Strategies:**

| Strategy | Pros | Cons | Use Case |
|----------|------|------|----------|
| **Single-Host** | Simple, cheap | No HA, single point of failure | Small apps, MVPs |
| **Multi-Host** | High availability, scalable | Complex, expensive | Large apps, enterprise |
| **Rolling Update** | Zero downtime | Gradual rollout | Standard updates |
| **Blue-Green** | Instant rollback | Double resources | Critical updates |
| **Canary** | Risk mitigation | Complex monitoring | Testing in production |

**Key Takeaways:**

1. 🚀 **Start Simple** - Single-host for MVPs, scale when needed
2. 🐳 **Use Docker** - Consistency across environments
3. 📊 **Monitor Everything** - Logs, metrics, health checks
4. ♻️ **Zero Downtime** - Use rolling updates or blue-green
5. 🔄 **Plan Rollbacks** - Always have a way back
6. 🔒 **Security First** - HTTPS, secrets management, non-root users
7. 📈 **Scale Horizontally** - Add more containers, not bigger containers

---

**Practice Exercise:**

1. Deploy Todo API to Railway
2. Set up health check endpoints
3. Configure environment variables
4. Test deployment with Docker Compose
5. Implement rolling update strategy
6. Create rollback procedure
7. Monitor application in production

**Resources:**
- Railway: https://railway.app
- DigitalOcean: https://www.digitalocean.com
- Kubernetes: https://kubernetes.io
- Docker Hub: https://hub.docker.com
