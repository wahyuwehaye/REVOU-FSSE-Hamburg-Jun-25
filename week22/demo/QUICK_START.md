# Quick Start Cheat Sheet

Panduan super cepat untuk menjalankan semua demo projects.

## ⚡ TL;DR

```bash
# 1. Setup PostgreSQL databases
psql -U postgres -c "CREATE DATABASE user_management_db;"
psql -U postgres -c "CREATE DATABASE blog_middleware_db;"
psql -U postgres -c "CREATE DATABASE ecommerce_db;"

# 2. Setup Project 1
cd user-management-api
npm install
echo 'PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=user_management_db' > .env
npm run start:dev

# 3. Setup Project 2 (new terminal)
cd blog-api-middleware
npm install
echo 'PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=blog_middleware_db
API_KEY=blog-secret-key-2024
RATE_LIMIT_TTL=900
RATE_LIMIT_LIMIT=100
IP_WHITELIST=127.0.0.1,::1,::ffff:127.0.0.1' > .env
npm run start:dev

# 4. Setup Project 3 (new terminal)
cd e-commerce-api
npm install
echo 'PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce_db
JWT_SECRET=ecommerce-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10' > .env
npm run start:dev
```

---

## 🧪 Quick Test Commands

### Project 1: User Management (Port 3001)

```bash
# Health check
curl http://localhost:3001/health

# Create user
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "age": 30,
    "phone": "+1-555-123-4567",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "zipCode": "10001",
      "country": "USA"
    }
  }'

# Get all users
curl http://localhost:3001/users

# Get paginated
curl "http://localhost:3001/users?page=1&limit=10"
```

### Project 2: Blog API (Port 3002)

```bash
# Health check
curl http://localhost:3002/health

# Get metrics
curl http://localhost:3002/metrics

# Get all posts (public)
curl http://localhost:3002/posts

# Create post (requires API key)
curl -X POST http://localhost:3002/posts \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: blog-secret-key-2024" \
  -d '{
    "title": "Test Post",
    "content": "This is a test blog post with enough content to pass validation",
    "author": "John Doe",
    "category": "technology"
  }'

# Test rate limiting (run this 101 times)
for i in {1..101}; do
  curl -s http://localhost:3002/posts | jq -r '.message // empty'
done
```

### Project 3: E-commerce (Port 3000)

```bash
# Health check
curl http://localhost:3000/health

# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Customer"
  }'

# Login (save the token!)
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "SecurePass123!"
  }' | jq -r '.access_token')

# Get profile
curl http://localhost:3000/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# Browse products
curl http://localhost:3000/products

# Create order
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [
      {"productId": 1, "quantity": 2}
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }'
```

---

## 📦 Postman Collections

### Import Collections

1. Open Postman
2. Click **Import** → **File**
3. Select:
   - `user-management-api/postman-collection.json`
   - `blog-api-middleware/postman-collection.json`
   - `e-commerce-api/postman-collection.json`

### Collection Variables (Auto-configured)

| Collection | Variable | Value |
|------------|----------|-------|
| Project 1 | baseUrl | http://localhost:3001 |
| Project 2 | baseUrl | http://localhost:3002 |
| Project 2 | apiKey | blog-secret-key-2024 |
| Project 3 | baseUrl | http://localhost:3000 |
| Project 3 | accessToken | (auto-saved after login) |

---

## 🔑 Important Headers

### Project 2: Blog API

```
X-API-KEY: blog-secret-key-2024      # For POST/PATCH requests
X-Request-ID: <custom-uuid>          # Optional custom request ID
```

### Project 3: E-commerce

```
Authorization: Bearer <jwt-token>    # For authenticated requests
```

---

## 📊 Response Headers to Check

### Project 2: Middleware Headers

```
X-Request-ID: <uuid>                 # Request tracking
X-Response-Time: <ms>                # Response time in milliseconds
X-RateLimit-Limit: 100               # Max requests per window
X-RateLimit-Remaining: 99            # Remaining requests
X-RateLimit-Reset: <timestamp>       # When limit resets
Retry-After: <seconds>               # When to retry after rate limit
```

---

## 🐛 Quick Troubleshooting

### PostgreSQL Not Running

```bash
# macOS
brew services start postgresql@14

# Linux
sudo systemctl start postgresql

# Check status
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux
```

### Port Already in Use

```bash
# Find process
lsof -i :3001  # Replace with your port

# Kill process
kill -9 <PID>
```

### Database Connection Failed

```bash
# Test connection
psql -U postgres -d user_management_db -c "SELECT 1;"

# Reset password
psql -U postgres
ALTER USER postgres PASSWORD 'new_password';
\q
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Testing Sequence

### 1. User Management API

1. ✅ Health check
2. ✅ Create user (valid)
3. ✅ Create user (invalid email) → should fail
4. ✅ Create user (weak password) → should fail
5. ✅ Get all users (paginated)
6. ✅ Update user
7. ✅ Soft delete user

### 2. Blog API Middleware

1. ✅ Health & metrics
2. ✅ GET posts (no auth)
3. ✅ POST post (no API key) → should fail 401
4. ✅ POST post (with API key)
5. ✅ Check X-Request-ID header
6. ✅ Check X-Response-Time header
7. ✅ Check rate limit headers
8. ✅ Test rate limiting (100+ requests)
9. ✅ DELETE post (non-whitelisted IP) → should fail 403

### 3. E-commerce API

1. ✅ Health check
2. ✅ Register user
3. ✅ Login (save token)
4. ✅ Get profile (with token)
5. ✅ Get profile (no token) → should fail 401
6. ✅ Browse products (public)
7. ✅ Create order (with token)
8. ✅ View my orders
9. ✅ Create order (insufficient stock) → should fail

---

## 📝 Environment Variables Quick Reference

### Project 1: User Management

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=user_management_db
```

### Project 2: Blog API

```env
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=blog_middleware_db
API_KEY=blog-secret-key-2024
RATE_LIMIT_TTL=900
RATE_LIMIT_LIMIT=100
IP_WHITELIST=127.0.0.1,::1,::ffff:127.0.0.1
```

### Project 3: E-commerce

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce_db
JWT_SECRET=ecommerce-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

---

## 🚀 One-Line Startup (After Setup)

```bash
# Terminal 1
cd user-management-api && npm run start:dev

# Terminal 2
cd blog-api-middleware && npm run start:dev

# Terminal 3
cd e-commerce-api && npm run start:dev
```

---

## ✅ Success Indicators

```
✅ PostgreSQL running
✅ 3 databases created
✅ All dependencies installed
✅ All .env files configured
✅ All 3 projects running
✅ Health checks respond 200 OK
✅ Postman collections imported
```

**You're ready to test! 🎉**
