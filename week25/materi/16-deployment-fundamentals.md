# Deployment Fundamental

## Pengantar

Setelah mempelajari testing di materi sebelumnya, saatnya kita membahas tahap terakhir dalam development cycle: **Deployment**. Deployment adalah proses membawa aplikasi dari lingkungan development ke production agar dapat diakses oleh user.

## Mengapa Deployment Penting?

### Analogi: Dari Dapur ke Restoran

Bayangkan Anda adalah seorang chef yang baru saja menyempurnakan resep baru di dapur rumah:

- **Development Environment** = Dapur Rumah Anda
  - Anda punya semua peralatan yang Anda butuhkan
  - Bisa eksperimen tanpa tekanan
  - Hanya Anda yang makan hasilnya
  - Error? Tidak masalah, bisa langsung diperbaiki

- **Production Environment** = Restoran Komersial
  - Banyak pelanggan mengantre
  - Harus konsisten setiap kali
  - Hygiene dan safety standards ketat
  - Error = pelanggan kecewa dan review buruk

**Deploy = Membawa resep Anda dari dapur rumah ke restoran komersial**

## The Reality Gap: Local vs Production

### Masalah Umum yang Terjadi

#### 1. "Works on My Machine" Syndrome

```typescript
// Di local development - Works perfectly! ✅
const app = await NestFactory.create(AppModule);
await app.listen(3000);
console.log('App running on http://localhost:3000');
```

```typescript
// Di production - Crashes! ❌
// Error: Port 3000 already in use
// Error: Database connection failed
// Error: Memory limit exceeded
```

**Mengapa terjadi?**
- Local: Unlimited memory, single user, fast network
- Production: Limited memory (512MB), concurrent users, network latency

#### 2. Database Connection Issues

```typescript
// Local Development - Simple connection ✅
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

```typescript
// Production - Requires SSL ❌
DATABASE_URL="postgresql://user:password@production.db.com:5432/mydb"
// Error: Connection requires SSL
```

**Solution:**
```typescript
// Production-ready connection
DATABASE_URL="postgresql://user:password@production.db.com:5432/mydb?ssl=true"
```

#### 3. CORS Configuration

```typescript
// Development - Allow all origins ✅
app.enableCors();
```

```typescript
// Production - Blocks frontend! ❌
// Frontend at https://myapp.com trying to access API
// Error: CORS policy blocked
```

**Solution:**
```typescript
// Production-ready CORS
app.enableCors({
  origin: process.env.FRONTEND_URL, // https://myapp.com
  credentials: true,
});
```

## Common Deployment Challenges

### 1. Environment Configuration

**Challenge:**
```typescript
// Hardcoded values - BAD! ❌
const jwtSecret = 'my-secret-key';
const databaseUrl = 'postgresql://localhost:5432/mydb';
```

**Solution:**
```typescript
// Environment variables - GOOD! ✅
const jwtSecret = process.env.JWT_SECRET;
const databaseUrl = process.env.DATABASE_URL;
```

### 2. Missing Dependencies

**Local:**
```bash
# Works because you have Node.js installed
npm start
```

**Production:**
```bash
# Crashes because production server might have different Node version
Error: This application requires Node.js 18.x or higher
```

**Solution:**
```dockerfile
# Dockerfile - Specify exact Node version
FROM node:18-alpine
```

### 3. File Paths

```typescript
// Local - Works ✅
const filePath = 'C:/Users/myname/projects/app/uploads/file.jpg';
```

```typescript
// Production - Breaks! ❌
// Error: Cannot access C:/Users/myname/...
```

**Solution:**
```typescript
// Use relative paths
const filePath = path.join(__dirname, '../uploads/file.jpg');
```

## Deployment Workflow Overview

### The Complete Journey

```
┌─────────────────┐
│   Development   │
│   (Your PC)     │
└────────┬────────┘
         │ 1. Write Code
         │ 2. Test Locally
         ▼
┌─────────────────┐
│   Version       │
│   Control       │
│   (GitHub)      │
└────────┬────────┘
         │ 3. Push Code
         │ 4. CI/CD Pipeline
         ▼
┌─────────────────┐
│   Build         │
│   Process       │
│   (Docker)      │
└────────┬────────┘
         │ 5. Build Image
         │ 6. Run Tests
         ▼
┌─────────────────┐
│   Production    │
│   Server        │
│   (Railway)     │
└─────────────────┘
```

### Step-by-Step Process

#### 1. Development Phase
```bash
# Local development
npm run start:dev

# Test your changes
npm test

# Commit changes
git commit -m "Add new feature"
```

#### 2. Version Control
```bash
# Push to GitHub
git push origin main

# GitHub Actions automatically triggered
```

#### 3. Build Phase
```bash
# Automated by CI/CD
docker build -t myapp:latest .

# Run tests in container
docker run myapp:latest npm test
```

#### 4. Deployment Phase
```bash
# Deploy to production
docker push myapp:latest

# Production server pulls and runs
docker run -d -p 80:3000 myapp:latest
```

## Key Concepts to Understand

### 1. Environment

**Development Environment:**
- Your local machine
- Fast feedback loop
- Detailed error messages
- Hot reload enabled
- Debug tools available

**Production Environment:**
- Cloud server (Railway, AWS, etc.)
- Optimized for performance
- Minimal error information (security)
- No hot reload
- Monitoring tools

### 2. Configuration

**Apa itu Configuration?**
Settings dan credentials yang berbeda per environment:

```typescript
// config/app.config.ts
export default {
  development: {
    port: 3000,
    database: 'localhost:5432',
    logLevel: 'debug',
    cors: '*', // Allow all origins
  },
  production: {
    port: process.env.PORT,
    database: process.env.DATABASE_URL,
    logLevel: 'error',
    cors: process.env.FRONTEND_URL, // Specific origin
  }
}
```

### 3. Build Process

**Development:**
```bash
# No build needed, direct TypeScript execution
npm run start:dev
```

**Production:**
```bash
# Build step: TypeScript → JavaScript
npm run build

# Run compiled code
node dist/main.js
```

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code reviewed and merged
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Security headers set
- [ ] CORS properly configured

### During Deployment

- [ ] Backup database (if needed)
- [ ] Run migrations
- [ ] Deploy new version
- [ ] Run smoke tests
- [ ] Monitor error logs
- [ ] Check health endpoints

### Post-Deployment

- [ ] Verify application health
- [ ] Test critical user flows
- [ ] Monitor performance metrics
- [ ] Check error rates
- [ ] Validate external integrations
- [ ] Update documentation

## Real-World Example: Todo API Deployment

### Local Development
```bash
# Clone repository
git clone https://github.com/your-repo/todo-api.git

# Install dependencies
npm install

# Run locally
npm run start:dev
```

### Prepare for Production
```bash
# Create .env.production
DATABASE_URL=postgresql://prod-db.railway.app/todoapi?ssl=true
JWT_SECRET=super-secret-production-key-32-chars
PORT=3000
NODE_ENV=production
```

### Build and Test
```bash
# Build production bundle
npm run build

# Test production build locally
node dist/main.js
```

### Deploy to Railway
```bash
# Railway CLI deployment
railway up

# Or push to GitHub (automatic deployment)
git push origin main
```

## Common Mistakes to Avoid

### ❌ DON'T DO THIS:

```typescript
// 1. Hardcoded credentials
const dbPassword = 'mypassword123';

// 2. Commit .env file
// .env file in Git repository

// 3. Same config for all environments
const config = { debug: true };

// 4. Ignore error handling
app.get('/users', () => {
  return db.query('SELECT * FROM users'); // No error handling
});

// 5. Log sensitive data
console.log('User password:', password);
```

### ✅ DO THIS INSTEAD:

```typescript
// 1. Use environment variables
const dbPassword = process.env.DB_PASSWORD;

// 2. Add .env to .gitignore
// Only commit .env.example

// 3. Environment-specific configs
const config = {
  debug: process.env.NODE_ENV === 'development',
};

// 4. Proper error handling
app.get('/users', async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users');
    return res.json(users);
  } catch (error) {
    logger.error('Failed to fetch users', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Log safely
logger.info('User login attempt', { userId: user.id }); // No password
```

## Next Steps

Sekarang kita sudah memahami fundamental deployment, di materi selanjutnya kita akan membahas:

1. **Production vs Development** - Perbedaan detail dan best practices
2. **Environment Variables** - Cara manage configuration dengan aman
3. **Docker & Containerization** - Package aplikasi untuk deployment
4. **Deployment Platforms** - Railway, AWS, dan lainnya
5. **Monitoring & Logging** - Track aplikasi di production

## Summary

**Key Takeaways:**

1. 🏠 **Local ≠ Production** - Environment berbeda, preparation penting
2. 🔧 **Configuration Management** - Use environment variables, never hardcode
3. 🧪 **Test Before Deploy** - All tests must pass
4. 📦 **Build Process** - TypeScript → JavaScript for production
5. 🚨 **Error Handling** - Production requires robust error handling
6. 📊 **Monitoring** - Track application health and performance

**Quote to Remember:**
> "It works on my machine" is not a valid excuse in production. Proper deployment preparation ensures your application works everywhere.

---

**Latihan:**

1. Identify 3 differences between your local environment and production
2. List all configuration values your application needs
3. Create a deployment checklist for your project
4. Document potential failure scenarios and solutions
