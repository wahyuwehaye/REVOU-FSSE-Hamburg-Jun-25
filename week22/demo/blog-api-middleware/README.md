# Blog API with Middleware

Demo project focusing on **Middleware patterns, Authentication, and Logging** in NestJS.

## 🎯 Learning Focus

This project demonstrates:
- ✅ Custom middleware implementation
- ✅ Logger middleware
- ✅ API key authentication middleware
- ✅ Rate limiting middleware
- ✅ Request ID middleware
- ✅ Response time tracking
- ✅ IP whitelist middleware
- ✅ Middleware execution order

## 🚀 Features

- **Blog Post Management**
  - Create, read, update, delete posts
  - Category management
  - Comment system
  - Author tracking

- **Middleware Stack**
  - Request logging with context
  - API key authentication
  - Rate limiting (100 req/15 min)
  - Request ID generation
  - Response time tracking
  - IP whitelist for admin routes
  - Error handling middleware

- **Security**
  - API key validation
  - IP-based access control
  - Rate limiting
  - Input sanitization

## 📦 Tech Stack

- NestJS 10
- TypeORM
- PostgreSQL
- Express middleware
- UUID for request IDs

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Create PostgreSQL database:
```sql
CREATE DATABASE blog_api_db;
```

### 3. Environment Variables

Create `.env`:
```
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=blog_api_db

# API Keys
API_KEY=your-secret-api-key-here
ADMIN_API_KEY=admin-secret-key

# IP Whitelist (comma-separated)
IP_WHITELIST=127.0.0.1,::1,localhost

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### 4. Run Application

```bash
npm run start:dev
```

API available at: http://localhost:3000

## 📚 API Endpoints

### Posts

```
POST   /api/posts          Create post (requires API key)
GET    /api/posts          Get all posts
GET    /api/posts/:id      Get post by ID
PATCH  /api/posts/:id      Update post (requires API key)
DELETE /api/posts/:id      Delete post (requires admin API key)
```

### Comments

```
POST   /api/posts/:id/comments    Add comment
GET    /api/posts/:id/comments    Get post comments
```

### Categories

```
POST   /api/categories     Create category (requires API key)
GET    /api/categories     Get all categories
```

### Health & Metrics

```
GET    /health             Health check
GET    /metrics            Request metrics
```

## 🧪 Testing Endpoints

### Without API Key (Will Fail)

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "content": "Content"}'

# Response: 401 Unauthorized
```

### With API Key

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: your-secret-api-key-here" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my first blog post.",
    "category": "Technology",
    "author": "John Doe"
  }'
```

### Get All Posts (No auth required)

```bash
curl http://localhost:3000/api/posts
```

### Check Response Headers

```bash
curl -v http://localhost:3000/api/posts

# Response headers will include:
# X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
# X-Response-Time: 15ms
# X-RateLimit-Limit: 100
# X-RateLimit-Remaining: 99
```

## 📁 Project Structure

```
src/
├── main.ts
├── app.module.ts
├── middleware/
│   ├── logger.middleware.ts          # Request logging
│   ├── api-key.middleware.ts         # API key validation
│   ├── request-id.middleware.ts      # UUID generation
│   ├── response-time.middleware.ts   # Performance tracking
│   ├── rate-limit.middleware.ts      # Rate limiting
│   └── ip-whitelist.middleware.ts    # IP filtering
├── posts/
│   ├── posts.module.ts
│   ├── posts.controller.ts
│   ├── posts.service.ts
│   ├── entities/
│   │   └── post.entity.ts
│   └── dto/
│       ├── create-post.dto.ts
│       └── update-post.dto.ts
├── categories/
│   ├── categories.module.ts
│   ├── categories.controller.ts
│   └── categories.service.ts
└── health/
    └── health.controller.ts
```

## 💡 Key Learning Points

### 1. Logger Middleware

```typescript
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const requestId = req.headers['x-request-id'];
    
    console.log(`[${requestId}] ${method} ${originalUrl} - ${ip}`);
    
    next();
  }
}
```

### 2. API Key Middleware

```typescript
@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== process.env.API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }
    
    next();
  }
}
```

### 3. Middleware Registration

```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, LoggerMiddleware)
      .forRoutes('*'); // All routes
    
    consumer
      .apply(ApiKeyMiddleware)
      .forRoutes(
        { path: 'posts', method: RequestMethod.POST },
        { path: 'posts/:id', method: RequestMethod.PATCH },
      );
  }
}
```

### 4. Execution Order

```
Request
  ↓
RequestIdMiddleware    (1. Generate UUID)
  ↓
LoggerMiddleware       (2. Log request)
  ↓
ApiKeyMiddleware       (3. Validate API key)
  ↓
RateLimitMiddleware    (4. Check rate limit)
  ↓
ResponseTimeMiddleware (5. Start timer)
  ↓
Controller             (6. Handle request)
  ↓
ResponseTimeMiddleware (7. Add X-Response-Time header)
  ↓
Response
```

## 🎓 What You'll Learn

1. **Middleware Basics**
   - Creating custom middleware
   - Implementing NestMiddleware interface
   - req, res, next parameters
   - Calling next() or sending response

2. **Middleware Registration**
   - forRoutes() - specific routes
   - exclude() - exclude routes
   - RequestMethod - HTTP methods
   - Route patterns with wildcards

3. **Middleware Patterns**
   - Logging & monitoring
   - Authentication & authorization
   - Rate limiting & throttling
   - Request/response modification
   - Error handling

4. **Best Practices**
   - Middleware execution order
   - Early termination
   - Adding headers
   - Logging context
   - Performance tracking

## 🔒 Security Features

### API Key Authentication

Routes requiring API key:
- POST /api/posts
- PATCH /api/posts/:id
- POST /api/categories

### Admin Routes

Routes requiring admin API key:
- DELETE /api/posts/:id

### Rate Limiting

- 100 requests per 15 minutes per IP
- Returns 429 Too Many Requests when exceeded
- Headers: X-RateLimit-Limit, X-RateLimit-Remaining

### IP Whitelist

Admin routes only accessible from whitelisted IPs

## 📊 Monitoring

### Request Logs

```
[550e8400-e29b-41d4-a716-446655440000] GET /api/posts - 127.0.0.1
[550e8400-e29b-41d4-a716-446655440000] Response time: 15ms
```

### Metrics Endpoint

```bash
curl http://localhost:3000/metrics

{
  "totalRequests": 1523,
  "requestsByMethod": {
    "GET": 1200,
    "POST": 250,
    "PATCH": 50,
    "DELETE": 23
  },
  "averageResponseTime": "18ms",
  "uptime": 3600
}
```

## 🐛 Troubleshooting

### 401 Unauthorized

Check X-API-KEY header is present and correct

### 429 Too Many Requests

Wait for rate limit window to reset (15 minutes)

### 403 Forbidden

Check if IP is in whitelist for admin routes

## 📝 License

MIT - For educational purposes
