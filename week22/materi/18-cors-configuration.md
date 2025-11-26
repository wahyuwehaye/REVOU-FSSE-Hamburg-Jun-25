# Chapter 18: CORS Configuration

## 🎯 Apa itu CORS?

**CORS (Cross-Origin Resource Sharing)** adalah security mechanism yang mengontrol akses API dari domain yang berbeda.

```
Browser               Server
(localhost:4200)     (localhost:3000)
     │                    │
     │───── GET /api ────>│
     │                    │ ❌ Blocked by CORS!
     │<──── 403 ──────────│
     │                    │
     
Without CORS:
Frontend di localhost:4200 TIDAK BISA akses API di localhost:3000
```

## 🤔 Mengapa Perlu CORS?

### Same-Origin Policy

Browser memblokir requests ke domain yang berbeda:

```typescript
// Frontend: http://localhost:4200
fetch('http://localhost:3000/api/users')
  .then(res => res.json())
  .then(data => console.log(data));

// ❌ Error: CORS policy blocked
// Access to fetch at 'http://localhost:3000/api/users' from origin 
// 'http://localhost:4200' has been blocked by CORS policy
```

### Origin Components

```
https://www.example.com:443/path
└───┘   └──────────────┘ └┘
  │            │         │
Protocol     Domain    Port

Same Origin:
✅ https://www.example.com:443/api
✅ https://www.example.com:443/users

Different Origin:
❌ http://www.example.com (different protocol)
❌ https://api.example.com (different subdomain)
❌ https://www.example.com:8080 (different port)
```

## 🔧 Enable CORS in NestJS

### 1. Simple CORS (Allow All - Development Only)

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ⚠️ Allow all origins - ONLY for development!
  app.enableCors();
  
  await app.listen(3000);
}
bootstrap();
```

### 2. CORS with Options (Recommended)

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ Configure CORS properly
  app.enableCors({
    origin: 'http://localhost:4200', // ✅ Specific origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // ✅ Allow cookies
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  
  await app.listen(3000);
}
bootstrap();
```

### 3. Multiple Origins

```typescript
app.enableCors({
  origin: [
    'http://localhost:4200',
    'http://localhost:4201',
    'https://myapp.com',
    'https://www.myapp.com',
  ],
  credentials: true,
});
```

### 4. Dynamic Origin (From Environment)

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ Get allowed origins from environment
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:4200',
  ];
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

// .env
CORS_ORIGIN=http://localhost:4200,http://localhost:4201,https://myapp.com
```

### 5. Function-based Origin (Advanced)

```typescript
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:4200',
      'https://myapp.com',
    ];
    
    // ✅ Allow requests with no origin (mobile apps, Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // ✅ Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});
```

## 🎨 CORS Options

### Complete Configuration

```typescript
app.enableCors({
  // Origins that can access the API
  origin: 'http://localhost:4200',
  
  // HTTP methods allowed
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  
  // Allow cookies/authentication
  credentials: true,
  
  // Headers that can be sent
  allowedHeaders: [
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Requested-With',
    'X-API-KEY',
  ],
  
  // Headers exposed to client
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Number',
    'X-Per-Page',
  ],
  
  // Preflight cache duration (seconds)
  maxAge: 3600,
  
  // Include OPTIONS responses
  preflightContinue: false,
  
  // Provide a status code for OPTIONS requests
  optionsSuccessStatus: 204,
});
```

## 🔄 Preflight Requests

Browser mengirim **OPTIONS** request sebelum actual request:

```
Client                  Server
  │                       │
  │──── OPTIONS /api ────>│ Preflight request
  │                       │ (Check if allowed)
  │<──── 204 OK ──────────│
  │                       │
  │──── GET /api ────────>│ Actual request
  │<──── 200 OK ──────────│
  │                       │
```

### Preflight Request Headers

```typescript
// Browser sends:
OPTIONS /api/users HTTP/1.1
Origin: http://localhost:4200
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

// Server responds:
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:4200
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 3600
```

## 🔒 CORS with Authentication

### Sending Cookies

```typescript
// Backend (NestJS)
app.enableCors({
  origin: 'http://localhost:4200',
  credentials: true, // ✅ Must be true for cookies
});

// Frontend (Angular/React)
// Angular HttpClient
this.http.get('http://localhost:3000/api/users', {
  withCredentials: true, // ✅ Send cookies
}).subscribe();

// Fetch API
fetch('http://localhost:3000/api/users', {
  credentials: 'include', // ✅ Send cookies
});

// Axios
axios.get('http://localhost:3000/api/users', {
  withCredentials: true, // ✅ Send cookies
});
```

### Sending Authorization Headers

```typescript
// Backend - Allow Authorization header
app.enableCors({
  origin: 'http://localhost:4200',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

// Frontend - Send Authorization header
fetch('http://localhost:3000/api/users', {
  headers: {
    'Authorization': 'Bearer eyJhbGc...',
  },
});
```

## 🌍 Environment-based CORS

```typescript
// config/cors.config.ts
export const corsConfig = () => {
  const nodeEnv = process.env.NODE_ENV;
  
  if (nodeEnv === 'development') {
    // ✅ Allow localhost in development
    return {
      origin: [
        'http://localhost:4200',
        'http://localhost:4201',
        'http://localhost:3001',
      ],
      credentials: true,
    };
  }
  
  if (nodeEnv === 'production') {
    // ✅ Strict in production
    return {
      origin: process.env.CORS_ORIGIN?.split(',') || [],
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept, Authorization',
    };
  }
  
  // Test environment
  return {
    origin: '*', // Allow all in tests
    credentials: true,
  };
};

// main.ts
import { corsConfig } from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsConfig());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
```

## 🎯 Real-World Examples

### Example 1: E-commerce API

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    // ✅ Multiple frontend origins
    origin: [
      'https://shop.example.com', // Main shop
      'https://admin.example.com', // Admin panel
      'https://mobile.example.com', // Mobile web
    ],
    
    // ✅ Standard methods
    methods: 'GET,POST,PUT,PATCH,DELETE',
    
    // ✅ Allow cookies for sessions
    credentials: true,
    
    // ✅ Common headers
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-API-KEY',
    ],
    
    // ✅ Expose custom headers
    exposedHeaders: [
      'X-Total-Count',
      'X-Page-Number',
    ],
    
    // ✅ Cache preflight for 1 hour
    maxAge: 3600,
  });
  
  await app.listen(3000);
}
bootstrap();
```

### Example 2: Public API with Rate Limiting

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    // ✅ Allow all origins for public API
    origin: true,
    
    // ✅ Read-only methods
    methods: 'GET,HEAD',
    
    // ✅ No credentials for public API
    credentials: false,
    
    // ✅ Basic headers only
    allowedHeaders: ['Content-Type', 'X-API-KEY'],
    
    // ✅ Expose rate limit headers
    exposedHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
    ],
  });
  
  await app.listen(3000);
}
bootstrap();
```

### Example 3: Microservices with Service-to-Service Auth

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: (origin, callback) => {
      // ✅ Allow specific services
      const allowedServices = [
        'https://service-a.internal',
        'https://service-b.internal',
        'https://frontend.example.com',
      ];
      
      // ✅ Allow no origin (service-to-service)
      if (!origin) {
        return callback(null, true);
      }
      
      if (allowedServices.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Service-Token', // Custom service auth header
    ],
  });
  
  await app.listen(3000);
}
bootstrap();
```

## 🧪 Testing CORS

### Test CORS with cURL

```bash
# Test preflight request
curl -X OPTIONS http://localhost:3000/api/users \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Expected response headers:
# Access-Control-Allow-Origin: http://localhost:4200
# Access-Control-Allow-Methods: GET,POST,PUT,DELETE
# Access-Control-Allow-Headers: Content-Type
```

### Test CORS with Postman

```
1. Open Postman
2. Create new request
3. Set URL: http://localhost:3000/api/users
4. Add header: Origin: http://localhost:4200
5. Send request
6. Check response headers for Access-Control-Allow-Origin
```

## ⚠️ Common CORS Errors

### Error 1: No 'Access-Control-Allow-Origin' header

```typescript
// ❌ CORS not enabled
const app = await NestFactory.create(AppModule);
// Missing: app.enableCors()
await app.listen(3000);

// ✅ Fix: Enable CORS
app.enableCors({
  origin: 'http://localhost:4200',
});
```

### Error 2: Origin not allowed

```typescript
// ❌ Wrong origin
app.enableCors({
  origin: 'http://localhost:4200',
});

// Frontend tries from: http://localhost:3001
// Error: Origin not allowed

// ✅ Fix: Add all origins
app.enableCors({
  origin: [
    'http://localhost:4200',
    'http://localhost:3001', // ✅ Add missing origin
  ],
});
```

### Error 3: Credentials flag mismatch

```typescript
// ❌ Backend allows credentials but frontend doesn't send
app.enableCors({
  origin: 'http://localhost:4200',
  credentials: true,
});

// Frontend
fetch('http://localhost:3000/api/users');
// Missing: credentials: 'include'

// ✅ Fix: Send credentials from frontend
fetch('http://localhost:3000/api/users', {
  credentials: 'include', // ✅ Add this
});
```

## 📊 CORS Checklist

### Development

- ✅ Enable CORS with localhost origins
- ✅ Allow credentials if using cookies/sessions
- ✅ Allow common headers (Content-Type, Authorization)
- ✅ Test with actual frontend

### Production

- ✅ Whitelist specific origins only
- ✅ Use environment variables for origins
- ✅ Enable credentials only if needed
- ✅ Set maxAge for preflight cache
- ✅ Use HTTPS for all origins
- ✅ Monitor CORS errors

## 🎯 Best Practices

### ✅ DO:

```typescript
// 1. Use specific origins
app.enableCors({
  origin: ['https://myapp.com'],
});

// 2. Use environment variables
app.enableCors({
  origin: process.env.CORS_ORIGIN.split(','),
});

// 3. Enable credentials when needed
app.enableCors({
  origin: 'https://myapp.com',
  credentials: true,
});

// 4. Expose only needed headers
app.enableCors({
  exposedHeaders: ['X-Total-Count'],
});
```

### ❌ DON'T:

```typescript
// 1. Don't allow all origins in production
app.enableCors({
  origin: '*', // ❌ Security risk!
});

// 2. Don't hardcode origins
app.enableCors({
  origin: 'http://localhost:4200', // ❌ Won't work in production
});

// 3. Don't allow credentials with wildcard
app.enableCors({
  origin: '*',
  credentials: true, // ❌ Won't work!
});
```

## 📊 Summary

**CORS Configuration:**
- ✅ Enable CORS with specific origins
- ✅ Use environment variables
- ✅ Enable credentials for cookies/auth
- ✅ Allow necessary headers
- ✅ Set appropriate maxAge
- ✅ Test thoroughly

**Remember:**
- CORS is a browser security feature
- Configure differently per environment
- Be strict in production
- Monitor CORS errors
- Test with actual frontend

---

**Next Chapter:** Deploy on Render - Step-by-step deployment guide! 🚀
