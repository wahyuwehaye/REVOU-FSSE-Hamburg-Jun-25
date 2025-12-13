# 📘 Week 24: Prisma ORM, Database Relations, Authentication & Security

Welcome to Week 24! Minggu ini kita akan mempelajari Prisma ORM, database relationships, dan implementing authentication & authorization dengan security best practices.

---

## 📋 Table of Contents

- [Learning Objectives](#learning-objectives)
- [Prerequisites](#prerequisites)
- [Materials](#materials)
- [Sample Project](#sample-project)
- [Tech Stack](#tech-stack)
- [How to Use](#how-to-use)
- [Resources](#resources)

---

## 🎯 Learning Objectives

Setelah menyelesaikan Week 24, Anda akan dapat:

✅ Setup dan menggunakan Prisma ORM di NestJS  
✅ Membuat database schema dengan Prisma Schema Language  
✅ Implement database migrations  
✅ Understand dan implement database relationships:
  - One-to-One
  - One-to-Many
  - Many-to-Many
✅ Answer: "What the heck is a JOIN?"  
✅ Implement JWT authentication  
✅ Create authentication guards  
✅ Hash passwords dengan bcrypt  
✅ Implement Role-Based Access Control (RBAC)  
✅ Apply security best practices  
✅ Implement rate limiting  
✅ Configure security headers  

---

## 📚 Prerequisites

Before starting Week 24, pastikan Anda sudah:

### Knowledge Prerequisites:
- ✅ Menyelesaikan Week 23 (Database basics dengan TypeORM)
- ✅ Familiar dengan NestJS fundamentals
- ✅ Understand HTTP methods dan REST API
- ✅ Basic TypeScript knowledge
- ✅ Basic SQL knowledge

### Technical Prerequisites:
- Node.js 18+ installed
- PostgreSQL 14+ installed dan running
- Visual Studio Code atau text editor favorit
- Postman atau Thunder Client untuk testing API

---

## 📖 Materials

### Material 1: Introduction to Prisma ORM
**File:** [materi/24-introduction-to-prisma.md](./materi/24-introduction-to-prisma.md)

**Topics:**
- Apa itu Prisma?
- TypeORM vs Prisma comparison
- Setup Prisma di NestJS
- Prisma Schema Language
- Migrations workflow
- Prisma Client usage
- Basic CRUD operations
- Seeding data

**Duration:** 3-4 hours

---

### Material 2: Database Relations dengan Prisma
**File:** [materi/25-database-relations-prisma.md](./materi/25-database-relations-prisma.md)

**Topics:**
- Understanding database relationships
- **What the heck is a JOIN?** (answered!)
- One-to-One relationships
- One-to-Many relationships
- Many-to-Many relationships
- Foreign keys di Prisma
- Relation queries (include, select)
- Nested writes
- Cascade operations
- Query optimization

**Duration:** 4-5 hours

---

### Material 3: Authentication dengan JWT
**File:** [materi/26-authentication-jwt.md](./materi/26-authentication-jwt.md)

**Topics:**
- Authentication concepts
- JWT (JSON Web Token) explained
- Installing dependencies (Passport.js, JWT, bcrypt)
- Creating Auth module
- Password hashing dengan bcrypt
- User registration flow
- User login flow
- JWT token generation
- JWT strategy dengan Passport
- Auth guards
- Protecting routes
- Refresh token implementation
- Token expiration handling

**Duration:** 4-5 hours

---

### Material 4: Authorization & Security Best Practices
**File:** [materi/27-authorization-security.md](./materi/27-authorization-security.md)

**Topics:**
- Authentication vs Authorization
- Role-Based Access Control (RBAC)
- Creating custom guards (RolesGuard)
- @Roles() decorator
- Permission-based authorization
- Password security best practices
- Rate limiting dengan @nestjs/throttler
- Security headers dengan Helmet
- Content Security Policy (CSP)
- CORS configuration
- Input validation & sanitization
- SQL injection prevention
- XSS (Cross-Site Scripting) prevention
- CSRF protection

**Duration:** 3-4 hours

---

## 🚀 Sample Project

### Blog API with Authentication & Relations
**Folder:** [sample-project/blog-api/](./sample-project/blog-api/)

**Features:**
- ✅ User authentication (register, login, refresh token)
- ✅ Role-based authorization (admin, author, reader)
- ✅ Posts CRUD dengan authorization
- ✅ Comments system (nested under posts)
- ✅ Categories management
- ✅ Tags system (many-to-many)
- ✅ User profiles
- ✅ Complete Prisma schema with all relation types
- ✅ Migrations included
- ✅ Seed data
- ✅ Security best practices implemented
- ✅ Rate limiting
- ✅ Helmet security headers
- ✅ Comprehensive README

**API Endpoints:** ~30 endpoints
- Authentication: 4 endpoints
- Users: 6 endpoints
- Posts: 8 endpoints
- Comments: 6 endpoints
- Categories: 6 endpoints
- Tags: 6 endpoints

**Tech Stack:**
- NestJS 10+
- Prisma ORM (latest)
- PostgreSQL 14+
- JWT authentication
- Passport.js
- bcrypt
- class-validator
- @nestjs/throttler
- helmet

---

## 🛠️ Tech Stack

### Core Framework:
- **NestJS 10+** - Progressive Node.js framework

### Database & ORM:
- **PostgreSQL 14+** - Relational database
- **Prisma ORM** - Next-generation ORM
  - Prisma Client
  - Prisma Migrate
  - Prisma Studio

### Authentication & Security:
- **@nestjs/jwt** - JWT token handling
- **@nestjs/passport** - Authentication middleware
- **passport-jwt** - JWT strategy
- **bcrypt** - Password hashing
- **@nestjs/throttler** - Rate limiting
- **helmet** - Security headers

### Validation:
- **class-validator** - DTO validation
- **class-transformer** - Object transformation

---

## 📝 How to Use

### 1. Read Materials Sequentially

Materials dirancang untuk dipelajari berurutan:

```
Week 23 (TypeORM basics) ← Review dulu
   ↓
Material 1: Prisma Introduction ← Start here
   ↓
Material 2: Database Relations
   ↓
Material 3: Authentication & JWT
   ↓
Material 4: Authorization & Security
   ↓
Sample Project: Blog API ← Implement everything
```

### 2. Follow Step-by-Step Guides

Setiap material memiliki:
- 📖 Penjelasan konsep dengan analogies
- 💻 Step-by-step implementation
- ✅ Verification steps
- 🐛 Troubleshooting guides
- ✨ Best practices
- 🔗 Links to next material

### 3. Build Sample Project

Setelah selesai semua material:
1. Clone sample project
2. Follow README di sample-project/blog-api/
3. Setup database
4. Run migrations
5. Seed data
6. Test all endpoints
7. Understand the code

### 4. Practice with Exercises

**Exercises folder** berisi challenges untuk practice:
- Exercise 1: Simple authentication
- Exercise 2: Extend user profile
- Exercise 3: Implement comments
- Exercise 4: Add many-to-many tags
- Exercise 5: Complete RBAC

---

## 🌟 Progression from Week 23

### Week 23 (TypeORM):
```typescript
// Manual SQL queries
const result = await this.dataSource.query(
  'SELECT * FROM users WHERE id = $1',
  [id]
);
```

### Week 24 (Prisma):
```typescript
// Type-safe Prisma queries
const user = await this.prisma.user.findUnique({
  where: { id },
  include: { posts: true }  // Relations!
});
```

**Why upgrade?**
- ✅ Type safety
- ✅ Auto-completion
- ✅ Easier migrations
- ✅ Better relation handling
- ✅ Modern developer experience

---

## 📚 Resources

### Official Documentation:
- [Prisma Docs](https://www.prisma.io/docs)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
- [JWT.io](https://jwt.io/)
- [OWASP Security Guide](https://owasp.org/)

### Additional Learning:
- [Prisma YouTube Channel](https://www.youtube.com/c/PrismaData)
- [NestJS Authentication Course](https://courses.nestjs.com/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

### Tools:
- [Prisma Studio](https://www.prisma.io/studio) - Visual database browser
- [Postman](https://www.postman.com/) - API testing
- [pgAdmin](https://www.pgadmin.org/) - PostgreSQL GUI

---

## 🎯 Learning Path

```
┌─────────────────────────────────────────────────────┐
│                  WEEK 24 ROADMAP                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Day 1-2: Material 1 (Prisma Introduction)         │
│  ├─ Setup Prisma                                    │
│  ├─ Learn Prisma Schema                             │
│  └─ Basic CRUD operations                           │
│                                                     │
│  Day 3-4: Material 2 (Database Relations)          │
│  ├─ Understand relationships                        │
│  ├─ Implement One-to-One                            │
│  ├─ Implement One-to-Many                           │
│  ├─ Implement Many-to-Many                          │
│  └─ Master JOIN queries                             │
│                                                     │
│  Day 5-6: Material 3 (Authentication)              │
│  ├─ Setup Passport.js                               │
│  ├─ Implement registration                          │
│  ├─ Implement login                                 │
│  ├─ JWT tokens                                      │
│  └─ Auth guards                                     │
│                                                     │
│  Day 7: Material 4 (Authorization & Security)      │
│  ├─ RBAC implementation                             │
│  ├─ Rate limiting                                   │
│  ├─ Security headers                                │
│  └─ Best practices                                  │
│                                                     │
│  Day 8-10: Sample Project                          │
│  └─ Build complete Blog API                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Completion Checklist

Gunakan checklist ini untuk track progress:

### Material 1: Prisma Introduction
- [ ] Understand Prisma vs TypeORM
- [ ] Setup Prisma in NestJS
- [ ] Create Prisma schema
- [ ] Generate migrations
- [ ] Implement CRUD operations
- [ ] Setup seeding

### Material 2: Database Relations
- [ ] Understand relationship types
- [ ] Understand JOINs
- [ ] Implement One-to-One
- [ ] Implement One-to-Many
- [ ] Implement Many-to-Many
- [ ] Query with relations

### Material 3: Authentication
- [ ] Setup Passport.js
- [ ] Hash passwords with bcrypt
- [ ] Implement registration
- [ ] Implement login
- [ ] Generate JWT tokens
- [ ] Create auth guards
- [ ] Protect routes

### Material 4: Authorization & Security
- [ ] Implement RBAC
- [ ] Create roles guard
- [ ] Setup rate limiting
- [ ] Configure Helmet
- [ ] Apply security best practices

### Sample Project
- [ ] Setup project
- [ ] Understand code structure
- [ ] Test all endpoints
- [ ] Modify and extend features

---

## 🤝 Support

Jika ada pertanyaan atau kesulitan:

1. **Check materi** - Baca ulang section yang relevan
2. **Check troubleshooting** - Setiap material punya troubleshooting section
3. **Check sample project** - Lihat implementasi lengkap
4. **Ask for help** - Tanya ke instructor atau teman

---

## 🎉 What's Next?

Setelah menyelesaikan Week 24:

✅ Anda bisa build full-stack application dengan authentication  
✅ Anda understand database relationships  
✅ Anda bisa implement security best practices  
✅ Anda siap untuk advanced topics seperti:
  - Microservices architecture
  - Real-time features (WebSockets)
  - Caching strategies
  - Performance optimization
  - Deployment to production

---

**Happy Learning! 🚀**

_Week 24 - Prisma ORM, Database Relations, Authentication & Security_
