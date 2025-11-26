# Week 22 Demo Projects - Setup Guide

Panduan lengkap untuk menjalankan ketiga demo projects dan menggunakan Postman collections.

## 📋 Prerequisites

Sebelum memulai, pastikan sudah terinstall:

- **Node.js** (v18 atau lebih baru)
- **npm** atau **yarn**
- **PostgreSQL** (v14 atau lebih baru)
- **Postman** (untuk testing API)

---

## 🗄️ Database Setup

### 1. Install PostgreSQL

**macOS (dengan Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download installer dari [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Create Databases

Masuk ke PostgreSQL:
```bash
psql -U postgres
```

Buat tiga database untuk demo projects:
```sql
-- Database untuk Project 1: User Management API
CREATE DATABASE user_management_db;

-- Database untuk Project 2: Blog API Middleware
CREATE DATABASE blog_middleware_db;

-- Database untuk Project 3: E-commerce API
CREATE DATABASE ecommerce_db;

-- Keluar dari psql
\q
```

### 3. Verify Database Connection

Test koneksi ke setiap database:
```bash
psql -U postgres -d user_management_db -c "SELECT version();"
psql -U postgres -d blog_middleware_db -c "SELECT version();"
psql -U postgres -d ecommerce_db -c "SELECT version();"
```

---

## 🚀 Project 1: User Management API

Demonstrasi **DTOs, Pipes, dan Validation**.

### Setup

```bash
cd user-management-api
npm install
```

### Environment Variables

Buat file `.env`:
```env
# Server
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=user_management_db
```

⚠️ **Sesuaikan `DB_USERNAME` dan `DB_PASSWORD` dengan PostgreSQL credentials Anda!**

### Run Development Mode

```bash
npm run start:dev
```

API akan berjalan di: **http://localhost:3001**

### Verify

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": "connected",
  "uptime": 123
}
```

### Key Features

- ✅ **DTO Validation** dengan class-validator
- ✅ **Custom Pipes**: TrimPipe, LowercaseEmailPipe, HashPasswordPipe
- ✅ **Nested DTO validation** (Address object)
- ✅ **Pagination** dengan query parameters
- ✅ **Soft Delete** dengan deletedAt timestamp

### Testing with Postman

Import: `user-management-api/postman-collection.json`

**Test Flow:**
1. Health Check
2. Create User dengan validation
3. Get All Users (paginated)
4. Update User
5. Soft Delete User
6. Test validation errors
7. Test pipe transformations

---

## 🔒 Project 2: Blog API Middleware

Demonstrasi **6 jenis Middleware** dan request/response processing.

### Setup

```bash
cd blog-api-middleware
npm install
```

### Environment Variables

Buat file `.env`:
```env
# Server
PORT=3002

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=blog_middleware_db

# Middleware
API_KEY=blog-secret-key-2024
RATE_LIMIT_TTL=900
RATE_LIMIT_LIMIT=100

# IP Whitelist (comma-separated)
IP_WHITELIST=127.0.0.1,::1,::ffff:127.0.0.1
```

### Run Development Mode

```bash
npm run start:dev
```

API akan berjalan di: **http://localhost:3002**

### Verify

```bash
curl http://localhost:3002/health
```

### Key Features

- ✅ **RequestIdMiddleware**: Auto-generate UUID untuk setiap request
- ✅ **LoggerMiddleware**: Log semua requests dengan timestamps
- ✅ **ApiKeyMiddleware**: Authentication dengan X-API-KEY header
- ✅ **ResponseTimeMiddleware**: Track response time dalam ms
- ✅ **RateLimitMiddleware**: Limit 100 requests per 15 menit
- ✅ **IpWhitelistMiddleware**: Restrict admin operations by IP

### Testing with Postman

Import: `blog-api-middleware/postman-collection.json`

**Test Flow:**
1. Health & Metrics
2. Public Access (GET tanpa auth)
3. Protected Access (POST/PATCH dengan API Key)
4. Admin Access (DELETE dengan IP whitelist)
5. Test RequestID generation
6. Test Rate Limiting
7. Test Invalid API Key
8. Test IP Whitelist

**Important Headers:**
- `X-API-KEY`: blog-secret-key-2024 (untuk protected endpoints)
- `X-Request-ID`: Custom request ID (optional)

**Response Headers to Check:**
- `X-Request-ID`: UUID untuk tracking
- `X-Response-Time`: Response time dalam ms
- `X-RateLimit-Limit`: Max requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp
- `Retry-After`: Seconds until rate limit reset

---

## 🛒 Project 3: E-commerce API

Demonstrasi **Dependency Injection**, **JWT Authentication**, dan **Production Features**.

### Setup

```bash
cd e-commerce-api
npm install
```

### Environment Variables

Buat file `.env`:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce_db

# JWT
JWT_SECRET=ecommerce-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=10
```

### Run Development Mode

```bash
npm run start:dev
```

API akan berjalan di: **http://localhost:3000**

### Verify

```bash
curl http://localhost:3000/health
```

### Key Features

- ✅ **JWT Authentication** dengan @nestjs/passport
- ✅ **Dependency Injection** - OrdersService uses ProductsService
- ✅ **Guards**: JwtAuthGuard untuk protected routes
- ✅ **Business Logic**: Stock management, order calculations
- ✅ **TypeORM Relations**: Users, Products, Orders, OrderItems
- ✅ **Production Ready**: Helmet, CORS, Rate Limiting

### Testing with Postman

Import: `e-commerce-api/postman-collection.json`

**Test Flow:**

**Authentication:**
1. Register new user
2. Login (auto-saves JWT token)
3. Get profile (with Bearer token)

**Products:**
4. Browse products (public)
5. Create product (admin only)
6. Update/Delete product (admin only)

**Orders:**
7. Create order (authenticated)
8. View my orders
9. View order details
10. Update order status (admin only)

**Complete Shopping Flow:**
1. Register customer
2. Browse products
3. Create order
4. View order confirmation

**Validation Tests:**
- Invalid registration (weak password, invalid email)
- Invalid product (negative price)
- Invalid order (insufficient stock)

**Authentication Tests:**
- Access without token (401 Unauthorized)
- Access with invalid token (401 Unauthorized)

---

## 📮 Postman Setup

### Import Collections

1. Open Postman
2. Click **Import**
3. Select JSON files:
   - `user-management-api/postman-collection.json`
   - `blog-api-middleware/postman-collection.json`
   - `e-commerce-api/postman-collection.json`

### Environment Variables

Setiap collection sudah include collection variables:

**Project 1:**
- `baseUrl`: http://localhost:3001

**Project 2:**
- `baseUrl`: http://localhost:3002
- `apiKey`: blog-secret-key-2024

**Project 3:**
- `baseUrl`: http://localhost:3000
- `accessToken`: (auto-saved after login)
- `userId`, `productId`, `orderId`: (auto-saved)

### Auto-Save Tokens

Collections sudah configured dengan **test scripts** untuk auto-save:

```javascript
// After successful login/register
if (pm.response.code === 200 || pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.collectionVariables.set('accessToken', jsonData.access_token);
}
```

Anda tidak perlu manual copy-paste tokens! 🎉

---

## 🔍 Troubleshooting

### Database Connection Error

**Error:** `ECONNREFUSED localhost:5432`

**Solution:**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# Start PostgreSQL
brew services start postgresql@14     # macOS
sudo systemctl start postgresql       # Linux
```

### Authentication Failed

**Error:** `password authentication failed for user "postgres"`

**Solution:**
```bash
# Reset PostgreSQL password
psql -U postgres
ALTER USER postgres PASSWORD 'new_password';
\q

# Update .env file dengan password baru
```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3001`

**Solution:**
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>

# Or change PORT in .env file
```

### TypeORM Synchronize Warning

Jika melihat warning tentang `synchronize: true`:

⚠️ **NEVER use in production!** Only for development.

Untuk production:
```typescript
// src/database/database.module.ts
TypeOrmModule.forRoot({
  // ...
  synchronize: process.env.NODE_ENV !== 'production',
  // Or better: use migrations
  migrationsRun: true,
})
```

### Module Not Found

**Error:** `Cannot find module '@nestjs/...'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

**Error:** `tsc: command not found`

**Solution:**
```bash
# Install TypeScript globally
npm install -g typescript

# Or use local TypeScript
npx tsc --version
```

---

## 📚 Learning Objectives

### Project 1: DTOs & Pipes
- ✅ DTO validation dengan class-validator
- ✅ Custom transformation pipes
- ✅ Nested object validation
- ✅ Whitelist dan forbidNonWhitelisted
- ✅ Custom validation messages

### Project 2: Middleware
- ✅ Request/Response interceptors
- ✅ Logging dan monitoring
- ✅ API Key authentication
- ✅ Rate limiting
- ✅ IP whitelisting
- ✅ Request tracking dengan UUID

### Project 3: Dependency Injection
- ✅ Service dependencies (@Injectable)
- ✅ JWT authentication flow
- ✅ Guards dan strategies
- ✅ Business logic coordination
- ✅ Production best practices

---

## 🎯 Testing Checklist

### Project 1: User Management
- [ ] Health check responds with database status
- [ ] Create user with valid data succeeds
- [ ] Create user with invalid email fails
- [ ] Create user with weak password fails
- [ ] Email is lowercased automatically
- [ ] Whitespace is trimmed automatically
- [ ] Password is hashed (not plain text)
- [ ] Pagination works with page/limit
- [ ] Update user succeeds
- [ ] Soft delete sets deletedAt timestamp

### Project 2: Blog API
- [ ] Health and metrics endpoints work
- [ ] GET posts without API key succeeds
- [ ] POST post without API key fails (401)
- [ ] POST post with valid API key succeeds
- [ ] DELETE post from non-whitelisted IP fails (403)
- [ ] X-Request-ID header is present in all responses
- [ ] X-Response-Time header shows timing
- [ ] Rate limit headers are correct
- [ ] Rate limit triggers after 100 requests
- [ ] Custom Request-ID is preserved

### Project 3: E-commerce
- [ ] Register new user succeeds
- [ ] Login returns JWT token
- [ ] Get profile with token succeeds
- [ ] Get profile without token fails (401)
- [ ] Browse products (public) succeeds
- [ ] Create product without admin fails
- [ ] Create order with valid items succeeds
- [ ] Create order with insufficient stock fails
- [ ] Order calculates totals correctly
- [ ] Stock is reduced after order creation

---

## 🔐 Security Notes

### Never Commit These to Git

Add to `.gitignore`:
```
.env
.env.*
!.env.example
```

### Production Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS only
- [ ] Set `NODE_ENV=production`
- [ ] Disable TypeORM `synchronize`
- [ ] Enable Helmet security headers
- [ ] Configure CORS properly
- [ ] Use rate limiting
- [ ] Enable request validation
- [ ] Log security events
- [ ] Use environment-specific configs
- [ ] Rotate API keys regularly

---

## 📖 Additional Resources

### NestJS Documentation
- [DTOs & Validation](https://docs.nestjs.com/techniques/validation)
- [Pipes](https://docs.nestjs.com/pipes)
- [Middleware](https://docs.nestjs.com/middleware)
- [Guards](https://docs.nestjs.com/guards)
- [Dependency Injection](https://docs.nestjs.com/fundamentals/custom-providers)

### TypeORM Documentation
- [TypeORM Relations](https://typeorm.io/relations)
- [TypeORM Migrations](https://typeorm.io/migrations)

### Security Best Practices
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js](https://helmetjs.github.io/)

---

## 🆘 Need Help?

1. **Check logs**: Semua projects log detailed errors
2. **Verify .env**: Pastikan semua environment variables benar
3. **Test database**: Gunakan `psql` untuk verify koneksi
4. **Check ports**: Pastikan tidak ada conflict
5. **Restart everything**: Kadang helps! 😄

---

## ✅ Success!

Jika semua berjalan dengan baik:

```
✅ Project 1 running on http://localhost:3001
✅ Project 2 running on http://localhost:3002
✅ Project 3 running on http://localhost:3000
✅ All Postman collections imported
✅ Database connections working
```

**Happy Testing! 🚀**
