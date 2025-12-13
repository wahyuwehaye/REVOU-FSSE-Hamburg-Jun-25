# 📝 Week 24 Exercises

## Overview

Exercises ini dirancang untuk memperkuat pemahaman Anda tentang materi Week 24. Setiap exercise fokus pada topik spesifik dan bisa dikerjakan secara independen.

---

## Exercise 1: Prisma Schema Design 🎯

**Difficulty:** Beginner  
**Duration:** 30 minutes  
**Topics:** Prisma Schema, Data modeling

### Task

Buat Prisma schema untuk sistem **E-commerce** dengan requirements berikut:

**Models yang dibutuhkan:**
1. **User**
   - id, email (unique), name, password, role, createdAt

2. **Product**
   - id, name, description, price, stock, categoryId, createdAt

3. **Category**
   - id, name, slug (unique)

4. **Order**
   - id, userId, status, total, createdAt

5. **OrderItem**
   - id, orderId, productId, quantity, price

**Relationships:**
- User → Orders (1:N)
- Category → Products (1:N)
- Order → OrderItems (1:N)
- Product → OrderItems (1:N)

### Deliverables

1. File `schema.prisma` lengkap
2. Generate migration
3. Screenshot Prisma Studio

### Hints

```prisma
model User {
  id     Int     @id @default(autoincrement())
  orders Order[]
  // ... complete this
}
```

---

## Exercise 2: CRUD with Relations 🔗

**Difficulty:** Intermediate  
**Duration:** 1 hour  
**Topics:** Prisma Client, Relations, CRUD

### Task

Menggunakan schema dari Exercise 1, implement service methods berikut:

**User Service:**
1. `findUserWithOrders(userId)` - Get user dengan semua orders
2. `getUserOrderHistory(userId)` - Get orders dengan items dan products

**Product Service:**
1. `findProductsWithCategory()` - Get all products dengan category info
2. `updateProductStock(productId, quantity)` - Update stock

**Order Service:**
1. `createOrder(userId, items[])` - Create order dengan multiple items
2. `calculateOrderTotal(orderId)` - Calculate total dari order items

### Deliverables

1. Complete service files
2. Test results (screenshots atau Postman collection)

### Example

```typescript
async findUserWithOrders(userId: number) {
  return this.prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      }
    }
  });
}
```

---

## Exercise 3: Authentication System 🔐

**Difficulty:** Intermediate  
**Duration:** 2 hours  
**Topics:** JWT, Passport, Guards

### Task

Implement complete authentication system dengan features:

**Auth Features:**
1. User registration
   - Email validation
   - Password hashing (min 8 chars, must have uppercase, lowercase, number)
   - Return JWT tokens

2. User login
   - Verify credentials
   - Return access token (15min) + refresh token (7d)

3. Token refresh
   - Verify refresh token
   - Return new tokens

4. Logout
   - Clear refresh token from database

5. Protected routes
   - JWT Auth Guard
   - Get current user profile

### Deliverables

1. `auth.service.ts` - Complete authentication logic
2. `auth.controller.ts` - All endpoints
3. `jwt.strategy.ts` - JWT strategy
4. `jwt-auth.guard.ts` - Auth guard
5. Test all endpoints dengan Postman

### Endpoints to Implement

```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
GET    /auth/profile (protected)
```

---

## Exercise 4: RBAC Implementation 👥

**Difficulty:** Advanced  
**Duration:** 1.5 hours  
**Topics:** Authorization, RBAC, Guards

### Task

Implement Role-Based Access Control dengan 3 roles:

**Roles & Permissions:**

1. **Admin**
   - Can create/edit/delete any post
   - Can manage users
   - Can view all analytics

2. **Author**
   - Can create own posts
   - Can edit/delete own posts
   - Can view own analytics

3. **Reader**
   - Can view published posts
   - Can comment on posts
   - Cannot create/edit/delete posts

### Implementation Steps

1. Create `roles.decorator.ts`
2. Create `roles.guard.ts`
3. Apply guards to controllers
4. Test with different user roles

### Example

```typescript
@Controller('posts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostsController {
  
  @Get()
  @Roles('admin', 'author', 'reader')
  findAll() {
    // All authenticated users can view
  }

  @Post()
  @Roles('admin', 'author')
  create(@CurrentUser() user, @Body() createDto) {
    // Only admin and author can create
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: number) {
    // Only admin can delete any post
  }

  @Delete('my/:id')
  @Roles('admin', 'author')
  deleteOwn(@Param('id') id: number, @CurrentUser() user) {
    // Author can delete own post, admin can delete any
  }
}
```

---

## Exercise 5: Security Hardening 🛡️

**Difficulty:** Advanced  
**Duration:** 2 hours  
**Topics:** Security, Rate limiting, Helmet, Validation

### Task

Apply security best practices ke existing API:

**Requirements:**

1. **Rate Limiting**
   - Login: 5 attempts per minute
   - Register: 3 attempts per minute
   - Other endpoints: 100 per minute

2. **Helmet Configuration**
   - Configure CSP
   - Enable HSTS
   - Prevent clickjacking

3. **Input Validation**
   - Validate all DTOs
   - Sanitize user inputs
   - Custom password validator

4. **CORS Setup**
   - Allow specific origins
   - Enable credentials
   - Allowed methods: GET, POST, PUT, DELETE

5. **Error Handling**
   - Never expose stack traces
   - Generic error messages for auth failures
   - Log security events

### Deliverables

1. Updated `main.ts` with security config
2. Custom validators
3. Updated DTOs with validation
4. Test security headers with curl/Postman

### Example Configuration

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }));

  // CORS
  app.enableCors({
    origin: ['http://localhost:4200'],
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}
```

---

## Exercise 6: Complete Blog API 📝

**Difficulty:** Advanced  
**Duration:** 4-5 hours  
**Topics:** Everything from Week 24

### Task

Build complete Blog API dengan semua features yang sudah dipelajari:

**Features Required:**

1. **Authentication**
   - Register, Login, Refresh, Logout
   - JWT with access + refresh tokens
   - Password hashing

2. **User Profiles**
   - One-to-One relationship
   - Update profile
   - Upload avatar (URL)

3. **Posts**
   - CRUD operations
   - Author relationship (1:N)
   - Category relationship (N:1)
   - Publish/unpublish
   - View count

4. **Comments**
   - Create comment on post
   - Nested comments (optional)
   - Author relationship

5. **Categories**
   - CRUD operations
   - Posts count

6. **Tags**
   - Many-to-Many with posts
   - Tag cloud

7. **Authorization**
   - Admin: Full access
   - Author: Can manage own posts
   - Reader: Can only read and comment

8. **Security**
   - Rate limiting
   - Helmet headers
   - Input validation
   - CORS configured

### Database Schema

```prisma
model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  name         String
  password     String
  role         String    @default("reader")
  refreshToken String?
  createdAt    DateTime  @default(now())
  
  profile      Profile?
  posts        Post[]
  comments     Comment[]
}

model Profile {
  id        Int     @id @default(autoincrement())
  bio       String?
  avatar    String?
  website   String?
  location  String?
  userId    Int     @unique
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Post {
  id          Int      @id @default(autoincrement())
  title       String
  slug        String   @unique
  content     String   @db.Text
  published   Boolean  @default(false)
  viewCount   Int      @default(0)
  authorId    Int
  categoryId  Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  author      User      @relation(fields: [authorId], references: [id])
  category    Category? @relation(fields: [categoryId], references: [id])
  comments    Comment[]
  tags        PostTag[]
  
  @@index([authorId])
  @@index([categoryId])
}

model Category {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  slug        String   @unique
  description String?
  
  posts       Post[]
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  postId    Int
  authorId  Int
  createdAt DateTime @default(now())
  
  post      Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  author    User @relation(fields: [authorId], references: [id])
  
  @@index([postId])
  @@index([authorId])
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  slug  String @unique
  
  posts PostTag[]
}

model PostTag {
  postId Int
  tagId  Int
  
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([postId, tagId])
}
```

### API Endpoints (Minimum)

```
Auth:
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
GET    /auth/profile

Users:
GET    /users
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id

Profiles:
GET    /profiles/:userId
POST   /profiles
PATCH  /profiles/:userId
DELETE /profiles/:userId

Posts:
GET    /posts
GET    /posts/:id
POST   /posts (auth required)
PATCH  /posts/:id (owner or admin)
DELETE /posts/:id (owner or admin)
POST   /posts/:id/publish (admin only)

Comments:
GET    /posts/:postId/comments
POST   /posts/:postId/comments (auth required)
DELETE /comments/:id (owner or admin)

Categories:
GET    /categories
GET    /categories/:id
POST   /categories (admin only)
PATCH  /categories/:id (admin only)
DELETE /categories/:id (admin only)

Tags:
GET    /tags
POST   /tags (admin only)
POST   /posts/:postId/tags/:tagId (add tag to post)
DELETE /posts/:postId/tags/:tagId (remove tag from post)
```

### Deliverables

1. Complete NestJS project
2. Prisma schema with migrations
3. All endpoints implemented
4. Authentication & authorization working
5. Security features applied
6. README with setup instructions
7. Postman collection for testing

### Bonus Points

- Pagination on list endpoints
- Search functionality
- Filter by category/tag
- Sort by date/views
- Seed data script
- Error handling middleware
- Logging
- Unit tests

---

## Submission Guidelines

### What to Submit

1. **Source Code**
   - Git repository (GitHub/GitLab)
   - Clean, organized code
   - Following NestJS conventions

2. **Documentation**
   - README.md with:
     - Setup instructions
     - Environment variables
     - API endpoints
     - How to test
   
3. **Database**
   - Prisma schema
   - Migrations
   - Seed script (optional)

4. **Testing**
   - Postman collection
   - Screenshots of working features
   - Test results

### Code Quality Checklist

- [ ] Code follows NestJS best practices
- [ ] DTOs have proper validation
- [ ] Services are well-structured
- [ ] Guards are applied correctly
- [ ] Error handling implemented
- [ ] No hardcoded secrets (use .env)
- [ ] Comments for complex logic
- [ ] TypeScript types used properly
- [ ] Prisma queries optimized
- [ ] Security best practices applied

---

## Evaluation Criteria

### Exercise 1-2 (Schema & CRUD)
- ✅ Schema correctness (30%)
- ✅ Relationships properly defined (30%)
- ✅ CRUD operations working (40%)

### Exercise 3 (Authentication)
- ✅ Registration working (20%)
- ✅ Login working (20%)
- ✅ JWT tokens generated (20%)
- ✅ Protected routes working (20%)
- ✅ Token refresh working (20%)

### Exercise 4 (RBAC)
- ✅ Roles defined correctly (25%)
- ✅ Guards implemented (25%)
- ✅ Authorization working (30%)
- ✅ Different roles tested (20%)

### Exercise 5 (Security)
- ✅ Rate limiting configured (20%)
- ✅ Helmet configured (20%)
- ✅ Validation working (20%)
- ✅ CORS configured (20%)
- ✅ Error handling proper (20%)

### Exercise 6 (Complete API)
- ✅ All features implemented (40%)
- ✅ Code quality (20%)
- ✅ Security applied (20%)
- ✅ Documentation complete (10%)
- ✅ Testing done (10%)

---

## Tips for Success

1. **Start Small**
   - Complete exercises in order
   - Don't skip basics
   - Test each feature before moving on

2. **Use Documentation**
   - Refer to learning materials
   - Check Visual Guide for quick reference
   - Read Prisma docs when stuck

3. **Test Frequently**
   - Test after each implementation
   - Use Prisma Studio to verify data
   - Keep Postman collection updated

4. **Ask for Help**
   - If stuck for >30 minutes
   - Compare with examples
   - Debug step by step

5. **Code Review**
   - Review your own code
   - Check for best practices
   - Refactor if needed

---

**Good luck! 🚀**

Remember: The goal is to **learn and practice**, not just to complete quickly. Take your time and understand each concept.

