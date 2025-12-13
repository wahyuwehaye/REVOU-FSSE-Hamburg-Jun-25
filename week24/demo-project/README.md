# 📚 Blog API Demo Project - Week 24

Complete NestJS Blog API demonstrating all Week 24 concepts: **Prisma ORM**, **Database Relations**, **JWT Authentication**, **RBAC Authorization**, and **Security Best Practices**.

## 🎯 Learning Objectives

This project demonstrates:

- ✅ **Prisma ORM**: Schema, migrations, CRUD operations, seeding
- ✅ **Database Relations**: 1:1, 1:N, M:N relationships
- ✅ **Authentication**: JWT tokens, password hashing, refresh tokens
- ✅ **Authorization**: RBAC with 3 roles (Admin, Author, Reader)
- ✅ **Security**: Helmet, Rate Limiting, CORS, Input Validation
- ✅ **Best Practices**: Error handling, clean architecture, TypeScript

---

## 📋 Table of Contents

1. [Project Structure](#-project-structure)
2. [Prerequisites](#-prerequisites)
3. [Installation](#-installation)
4. [Configuration](#️-configuration)
5. [Running the Application](#-running-the-application)
6. [API Documentation](#-api-documentation)
7. [Testing with Postman](#-testing-with-postman)
8. [Demo Scenarios](#-demo-scenarios)

---

## 📁 Project Structure

```
blog-api-demo/
├── prisma/
│   ├── schema.prisma          # Database schema with all relations
│   └── seed.ts                # Seed data with sample users & posts
├── src/
│   ├── auth/                  # Authentication module (JWT, Guards)
│   │   ├── decorators/        # Custom decorators (@CurrentUser, @Roles, @Public)
│   │   ├── guards/            # Auth guards (JWT, Roles)
│   │   ├── strategies/        # Passport strategies
│   │   ├── dto/               # Auth DTOs
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.module.ts
│   ├── users/                 # Users CRUD module
│   ├── profiles/              # Profiles module (1:1 with Users)
│   ├── posts/                 # Posts module (1:N with Users, M:N with Tags)
│   ├── categories/            # Categories module (1:N with Posts)
│   ├── comments/              # Comments module (1:N with Posts & Users)
│   ├── tags/                  # Tags module (M:N with Posts)
│   ├── prisma/                # Prisma service
│   ├── app.module.ts          # Main app module
│   └── main.ts                # Application entry point
├── .env.example               # Environment variables template
├── package.json
└── README.md
```

---

## 🔧 Prerequisites

Before starting, ensure you have:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**
- **Postman** (for API testing)

---

## 📦 Installation

### Step 1: Clone or Navigate to Project

```bash
cd /Users/wehaye/Downloads/Revou25/TL-Session/week24/demo-project
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- NestJS framework
- Prisma ORM
- JWT authentication
- Bcrypt for password hashing
- Security packages (Helmet, Throttler)
- Validation packages

---

## ⚙️ Configuration

### Step 1: Create Environment File

```bash
cp .env.example .env
```

### Step 2: Configure Database

Edit `.env` file with your PostgreSQL credentials:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
JWT_REFRESH_EXPIRES_IN="7d"

# App
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:4200,http://localhost:3001"
```

**Important:** Replace the following:
- `username` - Your PostgreSQL username
- `password` - Your PostgreSQL password
- `blog_db` - Database name (will be created automatically)
- JWT secrets - Generate strong random strings

### Step 3: Generate Strong Secrets

Generate secure JWT secrets:

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -base64 64
```

---

## 🗄️ Database Setup

### Step 1: Generate Prisma Client

```bash
npm run prisma:generate
```

### Step 2: Run Migrations

This creates all database tables:

```bash
npm run prisma:migrate
```

When prompted, enter migration name: `init`

### Step 3: Seed Database

Populate database with sample data:

```bash
npm run prisma:seed
```

This creates:
- 4 users (1 admin, 2 authors, 1 reader)
- 4 profiles (one for each user)
- 4 categories
- 7 tags
- 6 posts (5 published, 1 draft)
- 5 comments

### Step 4: Open Prisma Studio (Optional)

View database in GUI:

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

---

## 🚀 Running the Application

### Development Mode

```bash
npm run start:dev
```

Application runs at: `http://localhost:3000`

API base URL: `http://localhost:3000/api/v1`

### Production Build

```bash
# Build
npm run build

# Start production server
npm run start:prod
```

---

## 📖 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/refresh` | Refresh tokens | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/profile` | Get current user profile | Yes |

### Users Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/users` | Get all users | All |
| GET | `/users/:id` | Get user by ID | All |
| POST | `/users` | Create user | Admin |
| PATCH | `/users/:id` | Update user | Admin, Own |
| DELETE | `/users/:id` | Delete user | Admin, Own |

### Profiles Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/profiles/user/:userId` | Get user profile | All |
| POST | `/profiles` | Create profile | All |
| PATCH | `/profiles/:userId` | Update profile | Admin, Own |
| DELETE | `/profiles/:userId` | Delete profile | Admin, Own |

### Posts Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/posts` | Get all posts | Public |
| GET | `/posts/:id` | Get post by ID | Public |
| GET | `/posts/slug/:slug` | Get post by slug | Public |
| POST | `/posts` | Create post | Admin, Author |
| PATCH | `/posts/:id` | Update post | Admin, Own Author |
| DELETE | `/posts/:id` | Delete post | Admin, Own Author |
| POST | `/posts/:postId/tags/:tagId` | Add tag to post | Admin, Own Author |
| DELETE | `/posts/:postId/tags/:tagId` | Remove tag from post | Admin, Own Author |

### Categories Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/categories` | Get all categories | Public |
| GET | `/categories/:id` | Get category by ID | Public |
| POST | `/categories` | Create category | Admin |
| PATCH | `/categories/:id` | Update category | Admin |
| DELETE | `/categories/:id` | Delete category | Admin |

### Comments Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/posts/:postId/comments` | Get post comments | Public |
| POST | `/posts/:postId/comments` | Create comment | All Authenticated |
| PATCH | `/comments/:id` | Update comment | Admin, Own |
| DELETE | `/comments/:id` | Delete comment | Admin, Own |

### Tags Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/tags` | Get all tags | Public |
| GET | `/tags/:id` | Get tag by ID | Public |
| POST | `/tags` | Create tag | Admin |
| PATCH | `/tags/:id` | Update tag | Admin |
| DELETE | `/tags/:id` | Delete tag | Admin |

---

## 🧪 Testing with Postman

### Import Collection

1. Open Postman
2. Click "Import"
3. Select `Blog-API-Demo.postman_collection.json`
4. Select `Blog-API-Demo.postman_environment.json`

### Test Credentials

```
Admin:
  Email: admin@blog.com
  Password: password123

Author 1:
  Email: john@blog.com
  Password: password123

Author 2:
  Email: jane@blog.com
  Password: password123

Reader:
  Email: reader@blog.com
  Password: password123
```

### Quick Test Flow

1. **Login** → Get access token
2. **Get Posts** → View all posts (public)
3. **Create Post** → As Author (requires token)
4. **Add Comment** → On any post
5. **Update Profile** → Update your profile

---

## 🎬 Demo Scenarios

### Scenario 1: User Registration & Authentication

**Steps:**
1. Register new user
2. Login to get JWT tokens
3. Access protected profile endpoint
4. Refresh access token
5. Logout

**Learning Points:**
- Password hashing with bcrypt
- JWT token generation
- Token refresh flow
- Secure logout

### Scenario 2: RBAC Authorization

**Steps:**
1. Login as Reader → Try to create post (FORBIDDEN)
2. Login as Author → Create post (SUCCESS)
3. Login as Admin → Delete any post (SUCCESS)
4. Author tries to delete other author's post (FORBIDDEN)

**Learning Points:**
- Role-based access control
- Resource ownership validation
- Guard execution order
- Error handling

### Scenario 3: Database Relations

**Steps:**
1. Create user (automatic profile creation - 1:1)
2. Create post by user (1:N relationship)
3. Add tags to post (M:N relationship)
4. Add comment to post (1:N relationship)
5. Get post with all relations included

**Learning Points:**
- One-to-One: User ↔ Profile
- One-to-Many: User → Posts, Post → Comments
- Many-to-Many: Post ↔ Tags
- Nested includes with Prisma

### Scenario 4: Security Features

**Steps:**
1. Try login with wrong password → Generic error message
2. Make 6 rapid login requests → Rate limited
3. Check response headers → Helmet security headers
4. Try sending invalid data → Validation errors

**Learning Points:**
- Input validation with class-validator
- Rate limiting with @nestjs/throttler
- Security headers with Helmet
- Error handling best practices

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection string in .env
DATABASE_URL="postgresql://user:password@localhost:5432/blog_db"
```

### Prisma Client Not Generated

```bash
npm run prisma:generate
```

### Port Already in Use

Change port in `.env`:
```env
PORT=3001
```

### Migration Failed

Reset database:
```bash
npm run prisma:reset
```

**Warning:** This deletes all data!

---

## 📚 Additional Resources

### Prisma Documentation
- [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client)
- [Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)

### NestJS Documentation
- [Authentication](https://docs.nestjs.com/security/authentication)
- [Authorization](https://docs.nestjs.com/security/authorization)
- [Guards](https://docs.nestjs.com/guards)

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 🎓 Learning Path

### Beginner
1. Understand project structure
2. Run migrations and seed data
3. Test authentication flow
4. Explore database with Prisma Studio

### Intermediate
1. Create new endpoints
2. Add new database relations
3. Implement additional guards
4. Customize validation rules

### Advanced
1. Add pagination to list endpoints
2. Implement search functionality
3. Add file upload for avatars
4. Write unit tests

---

## 📝 Notes for Instructors

### Demo Flow (60 minutes)

**Part 1: Project Overview (10 min)**
- Show project structure
- Explain tech stack
- Review Prisma schema

**Part 2: Database & Prisma (15 min)**
- Run migrations
- Execute seed script
- Open Prisma Studio
- Show relationships visually

**Part 3: Authentication (15 min)**
- Test registration
- Test login
- Show JWT payload
- Demonstrate guards

**Part 4: Authorization & RBAC (10 min)**
- Test different roles
- Show forbidden access
- Explain guard logic

**Part 5: API Testing (10 min)**
- Import Postman collection
- Run through CRUD operations
- Show security features

---

## 🤝 Contributing

This is a learning project. Feel free to:
- Add new features
- Improve documentation
- Report bugs
- Suggest enhancements

---

## 📄 License

MIT License - Free for educational use

---

## 👨‍💻 Author

**RevoU Week 24 - NestJS, Prisma & Security**

For questions or support, contact your instructor.

---

**Happy Coding! 🚀**
