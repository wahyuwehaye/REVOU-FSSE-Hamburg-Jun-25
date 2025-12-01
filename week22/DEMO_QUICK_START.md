# 🎓 Week 22 Demo Session Materials - Quick Start Guide

## 📦 What's Included?

Ini adalah **complete teaching package** untuk Week 22 NestJS Advanced Topics:

### 1. **DEMO_SESSION_GUIDE.md** (Main Teaching Guide)
   - 📖 **4 Session × 3 hours = 12 jam materi**
   - Step-by-step live coding instructions
   - Penjelasan konsep untuk students
   - Test cases dengan Postman
   - Common student questions & answers
   
### 2. **DEMO_PROJECT_CODE.md** (Complete Source Code)
   - 📝 **Semua source code lengkap**
   - Organized by module
   - Configuration files
   - Quick start commands
   
### 3. **Task_Management_API_Demo.postman_collection.json**
   - 🧪 **Ready-to-use Postman collection**
   - 30+ test requests
   - Auto-save tokens
   - Test scripts included

---

## 🚀 Quick Start - Untuk Instructor

### Option A: Teach Using the Guide

**Recommended untuk live demo sessions!**

1. **Buka DEMO_SESSION_GUIDE.md**
   - Follow step-by-step dari Session 1
   - Live code sambil explain konsep
   - Test setiap endpoint dengan Postman
   - Duration: 12 hours (4 sessions)

2. **Siapkan Environment:**
   ```bash
   # Install NestJS CLI
   npm install -g @nestjs/cli
   
   # Install PostgreSQL (local atau pakai Render)
   brew install postgresql@14  # macOS
   ```

3. **Import Postman Collection:**
   - Open Postman
   - Import `Task_Management_API_Demo.postman_collection.json`
   - Create environment dengan `base_url`

4. **Start Teaching:**
   - Session 1: Foundation & DTOs (3 hours)
   - Session 2: Custom Pipes & Auth (3 hours)
   - Session 3: Tasks & Middleware (3 hours)
   - Session 4: Deployment (3 hours)

### Option B: Give Students Complete Code

**Untuk self-study atau homework:**

1. **Share DEMO_PROJECT_CODE.md**
   - Students bisa copy-paste semua code
   - Build project sendiri
   - Reference saat stuck

2. **Share Postman Collection**
   - Students bisa test API mereka
   - Learn by testing

---

## 📚 Detailed Session Breakdown

### Session 1: Foundation & DTOs (3 hours)

**What Students Will Learn:**
- ✅ NestJS project structure
- ✅ Database setup dengan TypeORM
- ✅ DTOs dengan class-validator
- ✅ Password hashing dengan bcrypt
- ✅ ValidationPipe

**What You'll Build:**
- Users module dengan registration
- PostgreSQL database connection
- DTOs dengan validation decorators
- First endpoint: POST /users/register

**Files Created (9 files):**
```
src/users/
├── dto/
│   └── register.dto.ts
├── entities/
│   └── user.entity.ts
├── users.controller.ts
├── users.service.ts
└── users.module.ts

.env.development
src/app.module.ts (updated)
src/main.ts (updated)
```

**Postman Tests:**
1. Register valid user
2. Invalid email validation
3. Password too short validation
4. Missing field validation
5. Extra field forbidden
6. Duplicate email check

---

### Session 2: Custom Pipes & Authentication (3 hours)

**What Students Will Learn:**
- ✅ Custom transformation pipes
- ✅ Pipe chaining
- ✅ JWT authentication
- ✅ Passport strategies
- ✅ Guards untuk protect routes
- ✅ Custom decorators

**What You'll Build:**
- TrimPipe, LowercasePipe, SlugifyPipe
- JWT authentication dengan login
- Protected profile endpoints
- Custom @CurrentUser() decorator

**Files Created (11 files):**
```
src/common/
├── pipes/
│   ├── trim.pipe.ts
│   ├── lowercase.pipe.ts
│   └── slugify.pipe.ts
└── decorators/
    └── current-user.decorator.ts

src/auth/
├── dto/
│   └── login.dto.ts
├── guards/
│   └── jwt-auth.guard.ts
├── strategies/
│   └── jwt.strategy.ts
├── auth.controller.ts
├── auth.service.ts
└── auth.module.ts
```

**Postman Tests:**
1. Login dengan valid credentials
2. Login dengan wrong password
3. Get profile dengan token
4. Get profile tanpa token
5. Update profile

---

### Session 3: Tasks Module & Middleware (3 hours)

**What Students Will Learn:**
- ✅ Database relations (One-to-Many)
- ✅ Enums untuk fixed values
- ✅ CRUD operations
- ✅ Query parameters untuk filter
- ✅ Middleware untuk logging
- ✅ Request ID tracking

**What You'll Build:**
- Tasks module dengan full CRUD
- Relations antara Users dan Tasks
- Filter by status dan priority
- Logger middleware dengan request ID

**Files Created (10 files):**
```
src/tasks/
├── dto/
│   ├── create-task.dto.ts
│   └── update-task.dto.ts
├── entities/
│   └── task.entity.ts
├── tasks.controller.ts
├── tasks.service.ts
└── tasks.module.ts

src/common/
└── middleware/
    ├── logger.middleware.ts
    └── request-id.middleware.ts

src/users/entities/
└── user.entity.ts (updated with relation)
```

**Postman Tests:**
1. Create task
2. Get all tasks
3. Get task by ID
4. Update task status
5. Delete task
6. Filter by status (TODO, IN_PROGRESS, DONE)
7. Filter by priority (LOW, MEDIUM, HIGH, URGENT)
8. Security test: access other user's task

---

### Session 4: Deployment & Production (3 hours)

**What Students Will Learn:**
- ✅ Environment configuration
- ✅ CORS setup
- ✅ Global error handling
- ✅ Deploy to Render
- ✅ Production best practices
- ✅ Security checklist

**What You'll Build:**
- Production-ready configuration
- Global exception filter
- Deploy to Render dengan PostgreSQL
- Production environment setup

**Files Created (5 files):**
```
src/common/
└── filters/
    └── http-exception.filter.ts

.env.production (template)
Procfile
.gitignore (updated)
src/main.ts (updated with CORS & filters)
```

**Deployment Steps:**
1. Create Render account
2. Setup PostgreSQL database
3. Configure environment variables
4. Deploy web service
5. Test production API

---

## 🎯 Project Statistics

**Final Project:**
- **Files:** ~40 TypeScript files
- **Lines of Code:** ~2,500 lines
- **Endpoints:** 10 API endpoints
- **Database Tables:** 2 (users, tasks)
- **Custom Pipes:** 3
- **Middleware:** 2
- **Guards:** 1
- **Filters:** 1
- **DTOs:** 5
- **Entities:** 2

---

## 📖 How to Use Each File

### For Live Teaching:

**1. DEMO_SESSION_GUIDE.md**
   - Open in VS Code atau browser
   - Split screen: Guide on left, coding on right
   - Follow step-by-step instructions
   - Read "Explain" sections to students
   - Show "Visual" diagrams on board/screen
   - Run test cases in Postman

**2. DEMO_PROJECT_CODE.md**
   - Reference jika lupa syntax
   - Copy configuration files
   - Check complete implementations
   - Share with students after sessions

**3. Postman Collection**
   - Import before Session 1
   - Use throughout all sessions
   - Show auto-save token feature
   - Demonstrate test scripts

### For Student Self-Study:

**Give students access to:**
1. ✅ DEMO_SESSION_GUIDE.md - untuk understand concepts
2. ✅ DEMO_PROJECT_CODE.md - untuk reference code
3. ✅ Postman Collection - untuk test their API

**Students can:**
- Read guide untuk understand flow
- Copy code dari DEMO_PROJECT_CODE.md
- Build project step-by-step
- Test dengan Postman collection
- Debug dengan detailed explanations

---

## 💡 Teaching Tips

### Session 1 (Foundation):
- ⏰ **Take your time!** DTOs adalah most important concept
- 🎨 Draw DTO flow diagram on board
- 🧪 Test MANY validation scenarios
- 💬 Encourage questions about decorators
- ⚠️ Emphasize: "NEVER commit .env files!"

### Session 2 (Authentication):
- 🔐 Explain JWT thoroughly with jwt.io
- 🎯 Show token in Postman Auth tab
- ✨ Demo auto-save token feature
- 🚫 Test protected routes WITHOUT token
- 📝 Compare DTO vs Entity for password

### Session 3 (CRUD):
- 📊 Draw entity relationship diagram
- 🔒 Emphasize userId filtering for security
- 🧪 Test access other user's task (should fail!)
- 📝 Show middleware logs in console
- 🆔 Explain UUID and request tracking

### Session 4 (Deployment):
- 🐌 **Go SLOW!** Deployment can be confusing
- 📸 Show each Render screen step-by-step
- ⏳ Warn about cold start on free tier
- 🎉 **CELEBRATE** first production request!
- 📋 Review security checklist together

---

## 🎓 Learning Outcomes

**After completing all 4 sessions, students will be able to:**

1. ✅ Build production-ready NestJS APIs
2. ✅ Implement JWT authentication
3. ✅ Create custom pipes for data transformation
4. ✅ Design database relations with TypeORM
5. ✅ Write middleware for logging and tracking
6. ✅ Handle errors consistently
7. ✅ Validate input data with DTOs
8. ✅ Protect routes with guards
9. ✅ Deploy to production (Render)
10. ✅ Follow security best practices

---

## 📝 Student Assignment Idea

**After demo sessions, give students:**

### Mini Project: "Blog API"

**Requirements:**
- Users module (register, login, profile)
- Posts module (CRUD with author relation)
- Comments module (CRUD with post & author relations)
- Categories for posts
- Filter posts by category
- JWT authentication
- All DTOs with validation
- At least 2 custom pipes
- Logging middleware
- Deployed to Render

**Grading:**
- DTOs & Validation: 20 points
- Authentication: 15 points
- CRUD Operations: 20 points
- Relations: 15 points
- Middleware & Pipes: 15 points
- Code Quality: 10 points
- Deployment: 5 points
- **Total: 100 points**

---

## 🔧 Troubleshooting

### Common Issues:

**1. "Cannot connect to database"**
```
Solution:
- Check PostgreSQL is running
- Verify DATABASE_HOST, DATABASE_PORT in .env
- Try DATABASE_HOST=localhost or 127.0.0.1
```

**2. "Module not found: @nestjs/jwt"**
```
Solution:
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
```

**3. "ValidationPipe not working"**
```
Solution:
- Check you installed class-validator class-transformer
- Verify useGlobalPipes in main.ts
- Check DTO has decorators
```

**4. "401 Unauthorized on protected routes"**
```
Solution:
- Check token is sent in Authorization header
- Format: "Bearer <token>"
- Verify token not expired (24h)
- Try login again to get new token
```

**5. "Render app is slow on first request"**
```
This is normal!
- Free tier apps sleep after 15min inactivity
- First request after sleep takes ~30 seconds (cold start)
- Subsequent requests are fast
```

---

## 🎉 Success Metrics

**You know teaching was successful when students:**

✅ Can explain what DTOs are and why we use them  
✅ Understand JWT token flow without looking at notes  
✅ Can create new endpoints with validation independently  
✅ Know when to use pipes vs guards vs middleware  
✅ Can debug validation errors by reading error messages  
✅ Successfully deploy their own project to production  
✅ Ask advanced questions about optimization and scaling  

---

## 📚 Additional Resources

**Share with students after sessions:**

1. **Official Docs:**
   - NestJS: https://docs.nestjs.com
   - TypeORM: https://typeorm.io
   - class-validator: https://github.com/typestack/class-validator

2. **Video Tutorials:**
   - NestJS Official YouTube
   - Traversy Media - NestJS Crash Course
   - Academind - NestJS Complete Guide

3. **Practice Projects:**
   - Build Todo API
   - Build E-commerce API
   - Build Social Media API
   - Clone existing APIs (Twitter, Instagram basic features)

4. **Next Steps:**
   - Unit testing dengan Jest
   - E2E testing
   - GraphQL API
   - Microservices
   - Docker & Kubernetes

---

## 🙋 FAQ

**Q: How long does it take to teach all 4 sessions?**  
A: 12 hours total (4 sessions × 3 hours). Can be done in 4 days atau 2 intensive days.

**Q: Can students skip sessions?**  
A: Not recommended! Each session builds on previous. Session 4 needs code from Sessions 1-3.

**Q: What if students get stuck?**  
A: DEMO_PROJECT_CODE.md has complete working code. They can compare with their code.

**Q: Do I need to teach exactly as written?**  
A: No! Guide adalah framework. Feel free to adjust pace, add examples, or skip advanced parts if needed.

**Q: Can this be taught online?**  
A: Yes! Share screen for live coding. Use breakout rooms for exercises. Record sessions for replay.

**Q: What prerequisites do students need?**  
A: Basic JavaScript/TypeScript, understand REST APIs, comfortable with terminal, Git basics.

---

## ✅ Pre-Session Checklist

**Before Session 1:**
- [ ] PostgreSQL installed and running
- [ ] NestJS CLI installed globally
- [ ] VS Code dengan extensions (ESLint, Prettier)
- [ ] Postman installed
- [ ] Demo project starter ready
- [ ] Test database connection
- [ ] Prepare .env.development file
- [ ] Open DEMO_SESSION_GUIDE.md
- [ ] Import Postman collection
- [ ] Test all Postman requests work

**Before Session 4:**
- [ ] Render account created
- [ ] GitHub account ready
- [ ] Test local deployment first
- [ ] Prepare strong JWT_SECRET
- [ ] Review deployment checklist
- [ ] Test production database connection

---

## 🎊 Final Notes

**This teaching package is designed to be:**

✨ **Beginner-Friendly** - Detailed explanations, visual diagrams, step-by-step  
🔄 **Reusable** - Use for multiple cohorts, adapt as needed  
📦 **Complete** - Everything needed from zero to deployment  
🧪 **Tested** - All code and tests verified working  
🎯 **Practical** - Build real project, not just theory  
🚀 **Production-Ready** - Deploy actual working API  

**Happy Teaching! 🎓**

If you have questions or find issues, please update this README with solutions to help future instructors!

---

**Version:** 1.0  
**Last Updated:** 2024  
**Author:** Week 22 NestJS Advanced Materials  
**Compatible with:** NestJS 10+, TypeScript 5+, PostgreSQL 14+
