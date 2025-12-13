# 🎬 Demo Guide untuk Instructor - Week 24

Panduan lengkap untuk melakukan demo Blog API di kelas, mencakup semua konsep Week 24.

---

## 📋 Persiapan Sebelum Demo (15 menit sebelum kelas)

### 1. Setup Environment

```bash
cd /Users/wehaye/Downloads/Revou25/TL-Session/week24/demo-project

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 2. Configure Database

Edit `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db?schema=public"
```

### 3. Setup Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed
```

### 4. Start Application

```bash
npm run start:dev
```

Verify: `http://localhost:3000/api/v1`

### 5. Import Postman Collection

1. Open Postman
2. Import `Blog-API-Demo.postman_collection.json`
3. Import `Blog-API-Demo.postman_environment.json`
4. Select "Blog API Demo - Local" environment

---

## 🎯 Demo Flow (90 menit)

---

## PART 1: Project Overview & Prisma (25 menit)

### 1.1 Perkenalan Project (5 menit)

**Talking Points:**
- "Hari ini kita akan explore complete Blog API yang sudah implement semua konsep Week 24"
- "Project ini production-ready dan bisa dijadikan template untuk project kalian"
- "Kita punya 6 modules: Auth, Users, Profiles, Posts, Categories, Comments, Tags"

**Show:**
```bash
# Show project structure
tree -L 2 src/

# Show package.json dependencies
cat package.json | grep "@nestjs\|prisma\|bcrypt\|jwt"
```

---

### 1.2 Prisma Schema - Database Design (10 menit)

**Open:** `prisma/schema.prisma`

**Explain Each Model:**

#### User Model
```prisma
model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  password     String
  role         Role      @default(READER)
  profile      Profile?  // One-to-One
  posts        Post[]    // One-to-Many
  comments     Comment[] // One-to-Many
}
```

**Talking Points:**
- "User adalah central model - semua dimulai dari sini"
- "Email unique untuk authentication"
- "Password akan di-hash dengan bcrypt"
- "Role enum untuk RBAC: ADMIN, AUTHOR, READER"

#### Profile Model (One-to-One)
```prisma
model Profile {
  userId    Int      @unique
  user      User     @relation(fields: [userId], references: [id])
}
```

**Talking Points:**
- "One-to-One relationship dengan User"
- "@unique pada userId memastikan satu user = satu profile"
- "onDelete: Cascade - kalau user dihapus, profile ikut terhapus"

#### Post Model (One-to-Many & Many-to-Many)
```prisma
model Post {
  authorId    Int
  author      User     @relation(...)      // Many-to-One
  categoryId  Int?
  category    Category? @relation(...)     // Many-to-One
  comments    Comment[]                    // One-to-Many
  tags        PostTag[]                    // Many-to-Many
}
```

**Talking Points:**
- "Post punya multiple relationships"
- "Many posts belong to one author (User)"
- "Many posts belong to one category"
- "One post has many comments"
- "Many-to-Many dengan Tags via join table PostTag"

#### PostTag (Join Table untuk M:N)
```prisma
model PostTag {
  postId    Int
  post      Post @relation(...)
  tagId     Int
  tag       Tag  @relation(...)
  
  @@unique([postId, tagId])
}
```

**Talking Points:**
- "Join table untuk Many-to-Many relationship"
- "Explicit join table gives us more control"
- "@@unique prevents duplicate tag on same post"

---

### 1.3 Prisma Studio - Visual Database (5 menit)

**Open Prisma Studio:**
```bash
npm run prisma:studio
```

**Show:**
1. **Users table** - Show 4 seeded users
2. **Profiles table** - Show one-to-one relationship
3. **Posts table** - Show authorId foreign key
4. **PostTag table** - Show join table records
5. **Click relationships** - Show how Prisma Studio displays relations

**Talking Points:**
- "Prisma Studio is like phpMyAdmin for Prisma"
- "Kita bisa see relationships visually"
- "Useful untuk debugging dan verify data"

---

### 1.4 Migrations & Seeding (5 menit)

**Show Migration Files:**
```bash
ls -la prisma/migrations/
cat prisma/migrations/*/migration.sql | head -50
```

**Talking Points:**
- "Migrations adalah version control untuk database"
- "Setiap perubahan schema = new migration"
- "Kita bisa rollback kalau ada error"

**Show Seed Script:**
```bash
cat prisma/seed.ts | head -100
```

**Talking Points:**
- "Seed script creates sample data untuk testing"
- "Kita buat 4 users dengan berbeda roles"
- "Password di-hash dengan bcrypt sebelum disimpan"
- "Seed juga create relationships automatically"

**Run Seed:**
```bash
npm run prisma:seed
```

Show output:
```
✅ Created users with profiles
✅ Created categories
✅ Created tags
✅ Created posts with tags
✅ Created comments
```

---

## PART 2: Authentication & JWT (20 menit)

### 2.1 Authentication Architecture (5 menit)

**Open:** `src/auth/auth.module.ts`

**Explain:**
```typescript
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({...}),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
  ],
})
```

**Talking Points:**
- "Authentication module menggunakan Passport.js"
- "JWT Module untuk generate dan verify tokens"
- "JwtStrategy define how to validate tokens"
- "JwtAuthGuard protect routes"

---

### 2.2 Registration Flow (5 menit)

**Show Code:** `src/auth/auth.service.ts` - `register()` method

```typescript
async register(dto: RegisterDto) {
  // 1. Hash password
  const hashedPassword = await bcrypt.hash(dto.password, 10);
  
  // 2. Create user with profile
  const user = await this.prisma.user.create({
    data: {
      ...dto,
      password: hashedPassword,
      profile: {
        create: {},  // One-to-One relationship
      },
    },
  });
  
  // 3. Generate tokens
  const tokens = await this.generateTokens(...);
  
  // 4. Save refresh token
  await this.updateRefreshToken(...);
  
  return { user, ...tokens };
}
```

**Demo in Postman:**

1. Open "Authentication > Register New User"
2. **Show body:**
```json
{
  "email": "demo@blog.com",
  "name": "Demo User",
  "password": "password123",
  "role": "AUTHOR"
}
```

3. **Click Send**

4. **Show Response:**
```json
{
  "user": {
    "id": 5,
    "email": "demo@blog.com",
    "name": "Demo User",
    "role": "AUTHOR"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Talking Points:**
- "Password tidak pernah disimpan plain text - selalu di-hash"
- "User otomatis punya profile (one-to-one)"
- "Response include access token (15 min) dan refresh token (7 days)"
- "Tokens automatically saved in Postman environment variables"

**Verify in Prisma Studio:**
- Refresh Users table - show new user
- Show Profiles table - show auto-created profile
- Click on user - show hashed password

---

### 2.3 Login & JWT Flow (5 menit)

**Show Code:** `src/auth/auth.service.ts` - `login()` method

```typescript
async login(dto: LoginDto) {
  // 1. Find user
  const user = await this.prisma.user.findUnique({...});
  
  // 2. Verify password
  const isValid = await bcrypt.compare(dto.password, user.password);
  
  // 3. Generate tokens
  const tokens = await this.generateTokens(...);
  
  return { user, ...tokens };
}
```

**Demo in Postman:**

1. Open "Authentication > Login - Author (John)"
2. **Show body:**
```json
{
  "email": "john@blog.com",
  "password": "password123"
}
```

3. **Click Send**

4. **Decode JWT** (go to jwt.io):
   - Copy access token
   - Paste in jwt.io
   - **Show payload:**
```json
{
  "sub": 2,
  "email": "john@blog.com",
  "role": "AUTHOR",
  "iat": 1702123456,
  "exp": 1702124356
}
```

**Talking Points:**
- "JWT contains user info in payload"
- "sub is user ID"
- "exp is expiration time (15 minutes)"
- "Token is signed dengan secret key"
- "Server can verify token without database query"

---

### 2.4 Protected Routes & Guards (5 menit)

**Show Code:** `src/auth/guards/jwt-auth.guard.ts`

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, ...);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}
```

**Show Code:** `src/auth/auth.controller.ts`

```typescript
@Controller('auth')
export class AuthController {
  
  @Public()  // No auth required
  @Post('login')
  async login() {...}
  
  @UseGuards(JwtAuthGuard)  // Auth required
  @Get('profile')
  async getProfile() {...}
}
```

**Demo in Postman:**

1. **Test without token:**
   - Open "Authentication > Get Profile"
   - Remove Bearer token temporarily
   - Send → Get 401 Unauthorized

2. **Test with token:**
   - Login first (or use existing token)
   - Send → Get user profile successfully

**Talking Points:**
- "Guards execute before controller methods"
- "@Public() decorator bypasses authentication"
- "JwtAuthGuard extracts token from Authorization header"
- "If valid, user info attached to request object"

---

## PART 3: Authorization & RBAC (15 menit)

### 3.1 RBAC Concept (3 menit)

**Draw Diagram on Whiteboard:**

```
ADMIN
  ├─ Full access to everything
  ├─ Can manage users
  ├─ Can delete any post
  └─ Can manage categories & tags

AUTHOR
  ├─ Can create posts
  ├─ Can edit own posts
  ├─ Can delete own posts
  └─ Can comment

READER
  ├─ Can view posts
  ├─ Can comment
  └─ Cannot create posts
```

**Talking Points:**
- "RBAC = Role-Based Access Control"
- "Setiap user punya role"
- "Role menentukan permission"
- "NestJS implements this dengan Guards dan Decorators"

---

### 3.2 Roles Guard Implementation (5 menit)

**Show Code:** `src/auth/decorators/roles.decorator.ts`

```typescript
export const Roles = (...roles: Role[]) => 
  SetMetadata(ROLES_KEY, roles);
```

**Show Code:** `src/auth/guards/roles.guard.ts`

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get(ROLES_KEY, ...);
    const { user } = context.switchToHttp().getRequest();
    
    return requiredRoles.some(role => user.role === role);
  }
}
```

**Show Code:** `src/posts/posts.controller.ts`

```typescript
@Controller('posts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostsController {
  
  @Get()
  @Public()
  findAll() {...}  // Everyone can view
  
  @Post()
  @Roles('ADMIN', 'AUTHOR')
  create() {...}  // Only Admin & Author
  
  @Delete(':id')
  @Roles('ADMIN', 'AUTHOR')
  remove() {...}  // Admin or Own Author
}
```

**Talking Points:**
- "Roles decorator sets metadata on route"
- "RolesGuard reads metadata and checks user role"
- "Multiple roles can be specified"
- "Guards execute in order: JWT → Roles"

---

### 3.3 RBAC Demo - Role-Based Access (7 menit)

#### Scenario 1: Reader Cannot Create Post

**Demo:**
1. Login as Reader
   - Use "Authentication > Login - Reader"
   - Copy access token

2. Try to Create Post
   - Open "Posts > Create Post"
   - Ensure Reader token is used
   - Send

**Expected:** 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You do not have permission to access this resource"
}
```

**Talking Points:**
- "Reader role tidak ada dalam @Roles('ADMIN', 'AUTHOR')"
- "RolesGuard blocks the request"
- "User mendapat 403 Forbidden, bukan 401"

---

#### Scenario 2: Author Can Create Post

**Demo:**
1. Login as Author (John)
   - Use "Authentication > Login - Author (John)"

2. Create Post
   - Open "Posts > Create Post"
   - Send

**Expected:** 201 Created
```json
{
  "id": 7,
  "title": "My New Blog Post",
  "slug": "my-new-blog-post",
  "authorId": 2,
  "published": true
}
```

**Verify in Prisma Studio:**
- Show new post in Posts table
- Show authorId matches John's user ID

**Talking Points:**
- "Author role allowed to create posts"
- "authorId automatically set dari JWT payload"
- "Slug auto-generated dari title"

---

#### Scenario 3: Author Cannot Delete Other's Post

**Demo:**
1. Still logged in as Author John

2. Try to Delete Jane's Post
   - Open "Posts > Delete Post"
   - Set postId to Jane's post (e.g., 3)
   - Send

**Expected:** 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You can only delete your own posts"
}
```

**Show Code:** `src/posts/posts.service.ts` - `remove()` method

```typescript
async remove(id: number, currentUserId: number, currentUserRole: string) {
  const post = await this.prisma.post.findUnique({where: {id}});
  
  // Only admin or post author can delete
  if (currentUserRole !== 'ADMIN' && post.authorId !== currentUserId) {
    throw new ForbiddenException('You can only delete your own posts');
  }
  
  await this.prisma.post.delete({where: {id}});
}
```

**Talking Points:**
- "Authorization bukan hanya role, tapi juga ownership"
- "Service layer checks if user owns the resource"
- "Admin bypass this check (full access)"

---

## PART 4: Database Relations Demo (15 menit)

### 4.1 One-to-One: User → Profile (3 menit)

**Demo in Postman:**

1. Get User Profile
   - Open "Profiles > Get User Profile"
   - Send

**Response:**
```json
{
  "id": 1,
  "userId": 2,
  "bio": "Tech enthusiast and full-stack developer...",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  "user": {
    "id": 2,
    "name": "John Doe",
    "email": "john@blog.com"
  }
}
```

**Show Prisma Query:** `src/profiles/profiles.service.ts`

```typescript
async findByUserId(userId: number) {
  return this.prisma.profile.findUnique({
    where: { userId },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  });
}
```

**Talking Points:**
- "One-to-One: User ↔ Profile"
- "`userId` is unique foreign key"
- "`include` automatically JOINs tables"
- "No manual JOIN syntax needed!"

---

### 4.2 One-to-Many: User → Posts (4 menit)

**Demo in Postman:**

1. Get User with Posts
   - Open "Users > Get User by ID"
   - Use userId = 2 (John)
   - Send

**Response:**
```json
{
  "id": 2,
  "name": "John Doe",
  "email": "john@blog.com",
  "profile": {...},
  "posts": [
    {
      "id": 1,
      "title": "Getting Started with NestJS and Prisma",
      "published": true
    },
    {
      "id": 2,
      "title": "Building Secure REST APIs with JWT",
      "published": true
    }
  ],
  "_count": {
    "posts": 2
  }
}
```

**Show Prisma Query:** `src/users/users.service.ts`

```typescript
async findOne(id: number) {
  return this.prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      posts: {
        select: {
          id: true,
          title: true,
          published: true
        }
      },
      _count: {
        select: { posts: true, comments: true }
      }
    }
  });
}
```

**Talking Points:**
- "One-to-Many: One User has Many Posts"
- "Prisma returns array of posts"
- "`_count` aggregates related records"
- "Can select specific fields from relations"

---

### 4.3 Many-to-Many: Posts ↔ Tags (4 menit)

**Demo in Postman:**

1. Get Post with Tags
   - Open "Posts > Get Post by ID"
   - Use postId = 1
   - Send

**Response:**
```json
{
  "id": 1,
  "title": "Getting Started with NestJS and Prisma",
  "author": {...},
  "category": {...},
  "tags": [
    {
      "tag": {
        "id": 1,
        "name": "NestJS",
        "slug": "nestjs"
      }
    },
    {
      "tag": {
        "id": 2,
        "name": "Prisma",
        "slug": "prisma"
      }
    },
    {
      "tag": {
        "id": 3,
        "name": "TypeScript",
        "slug": "typescript"
      }
    }
  ]
}
```

**Show Prisma Schema:**
```prisma
model Post {
  tags PostTag[]
}

model Tag {
  posts PostTag[]
}

model PostTag {
  postId Int
  post   Post @relation(...)
  tagId  Int
  tag    Tag  @relation(...)
  @@unique([postId, tagId])
}
```

**Talking Points:**
- "Many-to-Many with explicit join table"
- "PostTag stores the relationship"
- "@@unique prevents duplicate tags on same post"
- "Can add fields to join table (e.g., createdAt)"

---

### 4.4 Adding & Removing Tags (4 menit)

**Demo: Add Tag to Post**

1. Login as Author (John)
2. Add Tag to Post
   - Open "Posts > Add Tag to Post"
   - postId = 7 (John's new post)
   - tagId = 4 (JWT tag)
   - Send

**Response:**
```json
{
  "id": 10,
  "postId": 7,
  "tagId": 4,
  "tag": {
    "id": 4,
    "name": "JWT",
    "slug": "jwt"
  }
}
```

**Show Code:** `src/posts/posts.service.ts` - `addTag()`

```typescript
async addTag(postId: number, tagId: number) {
  // Check ownership first
  if (currentUserRole !== 'ADMIN' && post.authorId !== currentUserId) {
    throw new ForbiddenException(...);
  }
  
  // Create join table record
  return this.prisma.postTag.create({
    data: { postId, tagId },
    include: { tag: true }
  });
}
```

**Verify in Prisma Studio:**
- Open PostTag table
- Show new record with postId and tagId

**Talking Points:**
- "Adding tag = creating join table record"
- "Ownership still checked (author or admin)"
- "Prisma handles referential integrity"
- "If tag or post deleted, join record also deleted (CASCADE)"

---

## PART 5: Security Features (10 menit)

### 5.1 Password Hashing (2 menit)

**Show in Prisma Studio:**
- Open Users table
- Show password column - all hashed

**Show Code:** `src/auth/auth.service.ts`

```typescript
// Registration
const hashedPassword = await bcrypt.hash(dto.password, 10);

// Login
const isValid = await bcrypt.compare(dto.password, user.password);
```

**Talking Points:**
- "bcrypt one-way hash - cannot be reversed"
- "Salt round = 10 (balance security & performance)"
- "Same password = different hash (random salt)"
- "Never log or expose passwords"

---

### 5.2 Rate Limiting (2 menit)

**Show Config:** `src/app.module.ts`

```typescript
ThrottlerModule.forRoot([{
  ttl: 60000,  // 1 minute
  limit: 100,  // 100 requests
}])
```

**Show Controller:** `src/auth/auth.controller.ts`

```typescript
@Post('login')
@Throttle({ default: { limit: 5, ttl: 60000 } })
async login() {...}
```

**Demo: Rate Limit**

1. Open Postman
2. Login endpoint
3. Send 6 times rapidly

**Expected on 6th request:**
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

**Talking Points:**
- "Rate limiting prevents brute force attacks"
- "Global limit: 100 req/min"
- "Login limit: 5 req/min"
- "@nestjs/throttler handles this automatically"

---

### 5.3 Input Validation (2 menit)

**Demo: Invalid Input**

1. Register with invalid email
```json
{
  "email": "invalid-email",
  "name": "A",
  "password": "123"
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "name must be longer than or equal to 3 characters",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request"
}
```

**Show DTO:** `src/auth/dto/auth.dto.ts`

```typescript
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

**Talking Points:**
- "ValidationPipe validates all DTOs automatically"
- "class-validator decorators define rules"
- "Validation happens before reaching controller"
- "Prevents bad data from entering system"

---

### 5.4 Security Headers (2 menit)

**Demo: Check Headers**

1. Any request in Postman
2. Click "Headers" tab in response

**Show Headers:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=15552000; includeSubDomains
```

**Show Config:** `src/main.ts`

```typescript
app.use(helmet());
```

**Talking Points:**
- "Helmet adds security headers automatically"
- "Prevents XSS, clickjacking, etc."
- "HSTS enforces HTTPS"
- "Production best practice"

---

### 5.5 CORS Configuration (2 menit)

**Show Config:** `src/main.ts`

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN?.split(','),
  credentials: true,
});
```

**Show .env:**
```env
CORS_ORIGIN="http://localhost:4200,http://localhost:3001"
```

**Talking Points:**
- "CORS prevents unauthorized origins from accessing API"
- "Only specified origins allowed"
- "credentials: true allows cookies/auth headers"
- "In production, specify exact frontend domain"

---

## PART 6: Hands-on Practice (15 menit)

### Give Students Tasks:

**Task 1: Create a Post (5 min)**
- Login as Author
- Create new post
- Add tags to post
- Verify in Prisma Studio

**Task 2: Test RBAC (5 min)**
- Login as Reader
- Try to create post → Should fail
- Try to comment → Should succeed
- Login as Admin
- Delete any post → Should succeed

**Task 3: Explore Relations (5 min)**
- Get post with all relations
- Get user with posts and comments
- Get category with posts
- Observe nested includes

---

## 🎯 Summary & Key Takeaways (5 menit)

### What We Learned:

1. **Prisma ORM**
   ✅ Type-safe database access
   ✅ Auto-generated Prisma Client
   ✅ Migrations & seeding
   ✅ Prisma Studio for visualization

2. **Database Relations**
   ✅ One-to-One: User ↔ Profile
   ✅ One-to-Many: User → Posts, Post → Comments
   ✅ Many-to-Many: Posts ↔ Tags (via PostTag)
   ✅ Nested includes for complex queries

3. **Authentication**
   ✅ JWT tokens (access + refresh)
   ✅ Password hashing with bcrypt
   ✅ Passport.js integration
   ✅ JwtAuthGuard for protected routes

4. **Authorization**
   ✅ RBAC with 3 roles
   ✅ RolesGuard implementation
   ✅ Resource ownership validation
   ✅ Custom decorators (@Roles, @Public, @CurrentUser)

5. **Security**
   ✅ Rate limiting
   ✅ Helmet headers
   ✅ Input validation
   ✅ CORS configuration
   ✅ Error handling

---

## 📚 Resources untuk Students

1. **Project Repository**
   - Location: `/week24/demo-project`
   - README with full setup instructions
   - Postman collection included

2. **Learning Materials**
   - Materi 24: Prisma Introduction
   - Materi 25: Database Relations
   - Materi 26: Authentication & JWT
   - Materi 27: Authorization & Security

3. **Next Steps**
   - Try exercises in `/week24/exercises`
   - Build your own API based on this template
   - Add features: pagination, search, file upload

---

## 🐛 Troubleshooting Common Issues

### Issue 1: Database Connection Error
```bash
# Check PostgreSQL running
sudo systemctl status postgresql

# Verify DATABASE_URL in .env
```

### Issue 2: Prisma Client Not Found
```bash
npm run prisma:generate
```

### Issue 3: Migration Failed
```bash
# Reset database (WARNING: deletes all data)
npm run prisma:reset

# Then re-seed
npm run prisma:seed
```

### Issue 4: Port Already in Use
```bash
# Change PORT in .env to 3001
# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Issue 5: JWT Token Invalid
```bash
# Make sure JWT_SECRET matches in .env
# Check token expiration time
# Re-login to get new token
```

---

## 💡 Tips untuk Demo yang Efektif

1. **Preparation is Key**
   - Test everything 1 day before
   - Have backup database
   - Print important code snippets

2. **Keep it Interactive**
   - Ask questions throughout
   - Let students suggest scenarios
   - Encourage experimentation

3. **Use Visual Aids**
   - Prisma Studio untuk database
   - jwt.io untuk decode tokens
   - Draw diagrams on whiteboard

4. **Handle Errors Gracefully**
   - Show error messages are useful
   - Demonstrate debugging process
   - Turn mistakes into learning moments

5. **Time Management**
   - Stick to allocated times
   - Skip details if running late
   - Save extra material for Q&A

---

## ❓ Anticipated Questions & Answers

**Q: Kenapa pakai Prisma instead of TypeORM?**
A: Prisma lebih type-safe, easier migrations, better DX. TypeORM more flexible tapi steeper learning curve.

**Q: JWT vs Session?**
A: JWT stateless (no server storage), scalable untuk microservices. Session stateful, easier to revoke.

**Q: Kenapa refresh token?**
A: Access token short-lived (15m) untuk security. Refresh token (7d) untuk better UX - user tidak perlu login sering.

**Q: Apakah ini production-ready?**
A: Ya! Tambahkan: error logging, monitoring, testing, CI/CD, environment-specific configs.

**Q: Bagaimana handle file uploads?**
A: Tambahkan multer, upload ke S3/cloud storage, simpan URL di database.

---

**Good luck with the demo! 🚀**
