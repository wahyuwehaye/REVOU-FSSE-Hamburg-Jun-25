# Chapter 19: Deploy on Render

## 🎯 Apa itu Render?

**Render** adalah platform cloud modern untuk deploy aplikasi dengan mudah. Render menyediakan:
- ✅ Free tier (cocok untuk belajar)
- ✅ Auto deploy dari Git
- ✅ Built-in HTTPS
- ✅ Easy database setup
- ✅ Environment variables management
- ✅ Logs & monitoring

**Website:** https://render.com

## 📋 Prerequisites

Before deploying, pastikan:
- ✅ Code di Git repository (GitHub, GitLab, etc.)
- ✅ `.env` di `.gitignore`
- ✅ `package.json` dengan build scripts
- ✅ App berjalan di local
- ✅ Render account (free)

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Code

#### 1.1 Update package.json

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
    "node": ">=18.0.0"
  }
}
```

#### 1.2 Update main.ts

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  });

  // ✅ Use PORT from environment
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
```

#### 1.3 Check .gitignore

```bash
# .gitignore
node_modules/
dist/
.env
.env.local
.env.production
.env.development

# ✅ Make sure .env is ignored!
```

#### 1.4 Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Prepare for Render deployment"

# Push to GitHub
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

### Step 2: Create Render Account

1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### Step 3: Create Database (PostgreSQL)

#### 3.1 Create New PostgreSQL Database

1. Click **"New +"** → **"PostgreSQL"**
2. Fill in details:
   ```
   Name: my-app-db
   Database: myapp
   User: myapp_user
   Region: Singapore (or closest to you)
   Plan: Free
   ```
3. Click **"Create Database"**
4. Wait for database to provision (~2 minutes)

#### 3.2 Get Database Connection String

1. Go to your database dashboard
2. Scroll to **"Connections"**
3. Copy **"Internal Database URL"**:
   ```
   postgresql://myapp_user:password@dpg-xxx.singapore.render.com/myapp
   ```
4. Save this URL, kita akan pakai nanti

### Step 4: Create Web Service

#### 4.1 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your repository
4. Click **"Connect"**

#### 4.2 Configure Web Service

Fill in the settings:

```
Name: my-nestjs-app

Region: Singapore (same as database)

Branch: main

Root Directory: (leave empty if code at root)

Environment: Node

Build Command: npm install && npm run build

Start Command: npm run start:prod

Plan: Free
```

#### 4.3 Add Environment Variables

Click **"Add Environment Variable"** and add:

```
NODE_ENV=production

PORT=10000

DATABASE_URL=postgresql://myapp_user:password@dpg-xxx.singapore.render.com/myapp
(paste your actual database URL)

JWT_SECRET=your-super-secret-jwt-key-min-32-chars

CORS_ORIGIN=https://your-frontend.com
(atau '*' untuk development)
```

Click **"Create Web Service"**

### Step 5: Wait for Deployment

Render will:
1. Clone your repository
2. Run `npm install`
3. Run `npm run build`
4. Run `npm run start:prod`
5. Deploy your app

This takes ~5-10 minutes for first deployment.

Watch logs in real-time on the dashboard.

### Step 6: Verify Deployment

#### 6.1 Check Deployment Status

Wait until you see:
```
==> Your service is live 🎉
```

#### 6.2 Get Your URL

Your app will be available at:
```
https://my-nestjs-app.onrender.com
```

#### 6.3 Test API

```bash
# Test health endpoint
curl https://my-nestjs-app.onrender.com/health

# Test API endpoint
curl https://my-nestjs-app.onrender.com/api/users

# Or open in browser
https://my-nestjs-app.onrender.com/api/users
```

## 🔧 Complete NestJS Example

### package.json

```json
{
  "name": "nestjs-render-demo",
  "version": "1.0.0",
  "scripts": {
    "build": "nest build",
    "start": "node dist/main",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:generate": "npm run typeorm -- migration:generate",
    "migration:run": "npm run typeorm -- migration:run"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "typeorm": "^0.3.17",
    "pg": "^8.11.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  });

  // Port from environment
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
```

### app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production', // ⚠️ false in production
      ssl: {
        rejectUnauthorized: false, // ✅ Required for Render PostgreSQL
      },
    }),

    // Feature modules
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

### Health Check Endpoint

```typescript
// health.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    };
  }
}
```

## 🔄 Auto Deploy dari GitHub

### Setup Auto Deploy

1. Go to your web service settings
2. Under **"Build & Deploy"**
3. Enable **"Auto-Deploy"**
4. Select branch: **main**

Now, setiap push ke main branch akan auto-deploy!

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin main

# Render automatically:
# 1. Detects push
# 2. Rebuilds app
# 3. Redeploys
```

## 🐛 Troubleshooting

### Issue 1: Build Failed

```
Error: Cannot find module '@nestjs/core'
```

**Fix:** Check package.json dependencies

```json
{
  "dependencies": {
    "@nestjs/core": "^10.0.0",
    "@nestjs/common": "^10.0.0"
  }
}
```

### Issue 2: Port Binding Error

```
Error: Port 3000 is already in use
```

**Fix:** Use PORT from environment

```typescript
// ❌ Wrong
await app.listen(3000);

// ✅ Correct
await app.listen(process.env.PORT || 3000);
```

### Issue 3: Database Connection Failed

```
Error: connect ECONNREFUSED
```

**Fix:** Check DATABASE_URL and SSL settings

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // ✅ Add this
  },
})
```

### Issue 4: CORS Error

```
Access to fetch blocked by CORS policy
```

**Fix:** Add CORS_ORIGIN environment variable

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
});
```

## 📊 Render Dashboard Features

### 1. Logs

View real-time logs:
```
[10:30:15] Application is running on: https://my-app.onrender.com
[10:30:16] GET /api/users 200 15ms
[10:30:17] POST /api/users 201 50ms
```

### 2. Metrics

Monitor:
- CPU usage
- Memory usage
- Request count
- Response time

### 3. Environment Variables

Manage environment variables:
- Add new variables
- Update existing
- Delete unused

### 4. Deploys

View deployment history:
- Deploy time
- Commit hash
- Build logs
- Rollback option

## 💰 Render Free Tier Limits

```
✅ Unlimited web services
✅ 750 hours/month (enough for 1 service 24/7)
✅ 100 GB bandwidth/month
✅ Custom domains
✅ Auto HTTPS
✅ Auto deploys from Git

⚠️ Limitations:
- Spins down after 15 minutes of inactivity
- First request after spin down is slow (~30 seconds)
- 512 MB RAM
- 0.1 CPU
```

## 🚀 Upgrade to Paid Plan

If you need:
- No spin down
- More RAM/CPU
- More bandwidth
- Priority support

Upgrade to **Starter ($7/month)** or **Pro ($25/month)**

## 📋 Deployment Checklist

### Before Deploy:
- ✅ Code pushed to GitHub
- ✅ `.env` in `.gitignore`
- ✅ `PORT` from environment variable
- ✅ Database SSL configured
- ✅ CORS configured
- ✅ Build command correct
- ✅ Start command correct

### After Deploy:
- ✅ Check deployment logs
- ✅ Test API endpoints
- ✅ Check database connection
- ✅ Monitor errors
- ✅ Test with frontend
- ✅ Set up custom domain (optional)

## 🌐 Custom Domain

### Add Custom Domain

1. Go to web service settings
2. Click **"Custom Domain"**
3. Add your domain: `api.myapp.com`
4. Add CNAME record to your DNS:
   ```
   Type: CNAME
   Name: api
   Value: my-nestjs-app.onrender.com
   ```
5. Wait for DNS propagation (~30 minutes)
6. HTTPS automatically enabled!

## 📊 Summary

**Render Deployment Steps:**
1. ✅ Prepare code (package.json, main.ts, .gitignore)
2. ✅ Push to GitHub
3. ✅ Create Render account
4. ✅ Create PostgreSQL database
5. ✅ Create web service
6. ✅ Configure environment variables
7. ✅ Deploy and verify
8. ✅ Set up auto-deploy

**Remember:**
- Use environment variables
- Enable CORS
- Use PORT from environment
- Configure database SSL
- Monitor logs
- Free tier spins down after 15 minutes

---

**Next Chapter:** Troubleshooting - Common issues and solutions! 🔧
