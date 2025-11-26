# Week 22: Advanced NestJS - DTOs, Pipes, Middleware, DI & Deployment

Selamat datang di **Week 22**! Minggu ini kita akan mempelajari topik-topik advanced dalam NestJS yang sangat penting untuk membangun production-ready applications.

## 📚 Course Overview

Week 22 terdiri dari **21 comprehensive chapters** yang dibagi menjadi 4 bagian utama:

### 🎯 Part 1: DTOs & Pipes (Chapters 1-7)
Mempelajari Data Transfer Objects, validation, dan transformation

### 🔧 Part 2: Middleware (Chapters 8-11)
Memahami middleware, types, custom implementation, dan request lifecycle

### 💉 Part 3: Dependency Injection (Chapters 12-15)
Deep dive ke DI pattern, providers, module system, dan benefits

### 🚀 Part 4: Deployment (Chapters 16-21)
Deployment process, configuration, CORS, troubleshooting, dan recap

---

## 📖 Table of Contents

### Part 1: Understanding DTOs & Pipes

| Chapter | Topic | Key Concepts |
|---------|-------|--------------|
| [01](./materi/01-understanding-dtos.md) | Understanding DTOs | DTO basics, structure, decorators, validation |
| [02](./materi/02-why-use-dtos.md) | Why Use DTOs | Security, validation, type safety, documentation |
| [03](./materi/03-dto-vs-entity.md) | DTO vs Entity | Differences, lifecycle, when to use, mapping |
| [04](./materi/04-deep-dive-dtos.md) | Deep Dive into DTOs | Nested DTOs, arrays, inheritance, custom decorators |
| [05](./materi/05-validation-pipes.md) | Validation Pipes | Built-in pipes, scopes, options, error messages |
| [06](./materi/06-custom-pipes.md) | Custom Pipes | Creating pipes, PipeTransform, async validation |
| [07](./materi/07-transformation-pipes.md) | Transformation Pipes | Type conversion, string/array transforms |

### Part 2: Middleware

| Chapter | Topic | Key Concepts |
|---------|-------|--------------|
| [08](./materi/08-what-are-middlewares.md) | What are Middlewares | Definition, lifecycle, use cases, registration |
| [09](./materi/09-types-of-middlewares.md) | Types of Middlewares | Global, module, route-specific, functional |
| [10](./materi/10-custom-middleware-implementation.md) | Custom Middleware | Real-world examples, patterns, testing |
| [11](./materi/11-middleware-in-request-lifecycle.md) | Request Lifecycle | Complete flow, execution order, early termination |

### Part 3: Dependency Injection

| Chapter | Topic | Key Concepts |
|---------|-------|--------------|
| [12](./materi/12-dependency-injection-fundamentals.md) | DI Fundamentals | What is DI, IoC container, benefits, circular deps |
| [13](./materi/13-providers-in-nestjs.md) | Providers in NestJS | @Injectable, provider types, tokens, scopes |
| [14](./materi/14-provider-registration-module-system.md) | Module System | Registration, imports/exports, global/dynamic modules |
| [15](./materi/15-benefits-of-dependency-injection.md) | Benefits of DI | Testability, flexibility, reusability, maintainability |

### Part 4: Simple Deployment

| Chapter | Topic | Key Concepts |
|---------|-------|--------------|
| [16](./materi/16-what-is-deployment.md) | What is Deployment | Environments, platforms, checklist, preparation |
| [17](./materi/17-environment-configuration.md) | Environment Config | .env files, ConfigModule, validation, secrets |
| [18](./materi/18-cors-configuration.md) | CORS Configuration | CORS setup, origins, credentials, troubleshooting |
| [19](./materi/19-deploy-on-render.md) | Deploy on Render | Step-by-step guide, database setup, auto-deploy |
| [20](./materi/20-troubleshooting-debugging.md) | Troubleshooting | Common issues, debugging, monitoring |
| [21](./materi/21-course-recap.md) | Course Recap | Complete summary, best practices, next steps |

---

## 🚀 Quick Start

### Prerequisites

Before starting Week 22, pastikan Anda sudah:
- ✅ Familiar dengan NestJS basics
- ✅ Node.js 18+ installed
- ✅ PostgreSQL installed (atau gunakan Render free tier)
- ✅ Git & GitHub account
- ✅ Code editor (VS Code recommended)

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/your-repo.git
cd your-repo/week22

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run start:dev
```

---

## 📁 Week 22 Structure

```
week22/
├── README.md                    # This file
├── materi/                      # 21 comprehensive chapters
│   ├── 01-understanding-dtos.md
│   ├── 02-why-use-dtos.md
│   ├── ...
│   └── 21-course-recap.md
├── demo/                        # Demo projects
│   ├── user-management-api/     # CRUD with DTOs & Pipes
│   ├── blog-api-middleware/     # Middleware patterns
│   └── e-commerce-api/          # Full implementation
├── examples/                    # Code examples from chapters
│   ├── dto-examples/
│   ├── pipe-examples/
│   ├── middleware-examples/
│   └── di-examples/
├── exercises/                   # Practice exercises
│   ├── EXERCISES.md
│   └── solutions/
└── projects/                    # Student projects
    └── (your projects here)
```

---

## 🎯 Learning Outcomes

After completing Week 22, you will be able to:

### DTOs & Validation
- ✅ Create type-safe DTOs with class-validator
- ✅ Implement nested and array validation
- ✅ Use DTO inheritance patterns
- ✅ Create custom validation decorators

### Pipes
- ✅ Use built-in NestJS pipes effectively
- ✅ Create custom transformation pipes
- ✅ Implement async validation pipes
- ✅ Apply pipes at different scopes

### Middleware
- ✅ Understand middleware in request lifecycle
- ✅ Create custom middleware for various purposes
- ✅ Apply middleware at different levels
- ✅ Implement authentication & logging middleware

### Dependency Injection
- ✅ Understand DI pattern and IoC container
- ✅ Create and register providers
- ✅ Structure code with modules
- ✅ Share services across modules
- ✅ Test code with DI

### Deployment
- ✅ Configure environment variables
- ✅ Set up CORS properly
- ✅ Deploy to Render (free tier)
- ✅ Troubleshoot common issues
- ✅ Monitor production applications

---

## 💻 Demo Projects

### 🚀 Quick Start: [Setup Guide](./demo/SETUP_GUIDE.md) | [Quick Reference](./demo/QUICK_START.md)

### 1. User Management API
**Focus:** DTOs, Pipes, Validation  
**Port:** 3001  
📦 [Postman Collection](./demo/user-management-api/postman-collection.json)

**Features:**
- ✅ CRUD operations for users
- ✅ Email validation with custom pipe
- ✅ Password hashing pipe
- ✅ Nested address DTO validation
- ✅ Partial update with PartialType
- ✅ Pagination with query params

**Tech Stack:** NestJS, TypeORM, PostgreSQL, class-validator

**Testing:**
- 20+ Postman requests
- DTO validation tests
- Custom pipe transformations
- Error handling examples

### 2. Blog API with Middleware
**Focus:** Middleware patterns, Authentication, Logging  
**Port:** 3002  
📦 [Postman Collection](./demo/blog-api-middleware/postman-collection.json)

**Features:**
- ✅ 6 types of middleware (RequestId, Logger, ApiKey, ResponseTime, RateLimit, IpWhitelist)
- ✅ API key authentication (X-API-KEY header)
- ✅ Rate limiting (100 requests/15 min)
- ✅ Response time tracking
- ✅ IP whitelist for admin routes
- ✅ Request UUID tracking

**Tech Stack:** NestJS, Express middleware, custom decorators

**Testing:**
- 20+ Postman requests
- Middleware test scenarios
- Public vs Protected routes
- Rate limit demonstrations

### 3. E-commerce API
**Focus:** Complete implementation with DI & Deployment  
**Port:** 3000  
📦 [Postman Collection](./demo/e-commerce-api/postman-collection.json)

**Features:**
- ✅ JWT authentication flow (register, login, profile)
- ✅ Product catalog with CRUD
- ✅ Order management system
- ✅ Role-based access control (admin vs customer)
- ✅ Dependency Injection patterns
- ✅ Production-ready security (Helmet, CORS)

**Tech Stack:** NestJS, TypeORM, PostgreSQL, JWT, Passport, bcrypt

**Testing:**
- Complete shopping flow
- Authentication tests
- Protected endpoints
- Validation scenarios

---

## 📝 Exercises

Exercises are provided in [`exercises/EXERCISES.md`](./exercises/EXERCISES.md)

### Exercise Topics:
1. **DTO Practice** - Create DTOs for various scenarios
2. **Custom Pipes** - Build pipes for validation & transformation
3. **Middleware Implementation** - Create middleware for logging, auth, etc.
4. **DI Patterns** - Practice provider registration and module organization
5. **Deployment** - Deploy your own app to Render

---

## 🎓 Teaching Guide

For instructors, see [`exercises/TEACHING_GUIDE.md`](./exercises/TEACHING_GUIDE.md)

Contents:
- Session plans for each topic
- Live coding examples
- Common student questions
- Assessment criteria
- Additional resources

---

## 🔧 Tools & Technologies

### Required:
- **Node.js** 18+ - JavaScript runtime
- **NestJS** 10+ - Progressive Node.js framework
- **TypeScript** 5+ - Typed JavaScript
- **PostgreSQL** - Database

### Packages:
- `@nestjs/config` - Configuration management
- `@nestjs/typeorm` - Database ORM
- `class-validator` - DTO validation
- `class-transformer` - Data transformation
- `pg` - PostgreSQL driver

### Deployment:
- **Render** - Cloud platform (free tier)
- **GitHub** - Version control
- **Git** - Source control

---

## 📊 Progress Tracking

Track your progress through Week 22:

### Part 1: DTOs & Pipes (7 chapters)
- [ ] Chapter 1: Understanding DTOs
- [ ] Chapter 2: Why Use DTOs
- [ ] Chapter 3: DTO vs Entity
- [ ] Chapter 4: Deep Dive into DTOs
- [ ] Chapter 5: Validation Pipes
- [ ] Chapter 6: Custom Pipes
- [ ] Chapter 7: Transformation Pipes

### Part 2: Middleware (4 chapters)
- [ ] Chapter 8: What are Middlewares
- [ ] Chapter 9: Types of Middlewares
- [ ] Chapter 10: Custom Middleware Implementation
- [ ] Chapter 11: Middleware in Request Lifecycle

### Part 3: Dependency Injection (4 chapters)
- [ ] Chapter 12: DI Fundamentals
- [ ] Chapter 13: Providers in NestJS
- [ ] Chapter 14: Module System
- [ ] Chapter 15: Benefits of DI

### Part 4: Deployment (6 chapters)
- [ ] Chapter 16: What is Deployment
- [ ] Chapter 17: Environment Configuration
- [ ] Chapter 18: CORS Configuration
- [ ] Chapter 19: Deploy on Render
- [ ] Chapter 20: Troubleshooting
- [ ] Chapter 21: Course Recap

### Projects
- [ ] Complete User Management API
- [ ] Complete Blog API with Middleware
- [ ] Complete E-commerce API
- [ ] Deploy to Render

---

## 🌟 Best Practices

### Code Quality
- ✅ Always use DTOs for request validation
- ✅ Keep controllers thin, services thick
- ✅ Use dependency injection
- ✅ Write tests for critical functionality
- ✅ Follow TypeScript strict mode

### Security
- ✅ Validate all user input with DTOs
- ✅ Use whitelist: true in ValidationPipe
- ✅ Enable CORS with specific origins
- ✅ Never commit .env files
- ✅ Use environment variables for secrets

### Performance
- ✅ Use caching where appropriate
- ✅ Optimize database queries
- ✅ Enable compression
- ✅ Use connection pooling
- ✅ Monitor application metrics

### Deployment
- ✅ Test locally before deploying
- ✅ Use environment-specific configs
- ✅ Enable proper logging
- ✅ Set up health checks
- ✅ Monitor errors and performance

---

## 🔗 Useful Resources

### Official Documentation
- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [class-validator](https://github.com/typestack/class-validator)
- [Render Documentation](https://render.com/docs)

### Community
- [NestJS Discord](https://discord.gg/nestjs)
- [NestJS Reddit](https://reddit.com/r/nestjs)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/nestjs)

### Learning
- [NestJS Official Course](https://courses.nestjs.com)
- [NestJS YouTube Channel](https://www.youtube.com/nestjs)
- [Awesome NestJS](https://github.com/nestjs/awesome-nestjs)

---

## 💬 Support & Feedback

If you have questions or feedback:
1. Check the FAQ in each chapter
2. Search in chapter comments
3. Ask in NestJS Discord
4. Create an issue on GitHub

---

## 📜 License

This course material is provided for educational purposes.

---

## 🙏 Acknowledgments

Special thanks to:
- NestJS team for the amazing framework
- Community contributors
- All students and instructors

---

## 🚀 Let's Get Started!

Ready to learn advanced NestJS? Start with [Chapter 1: Understanding DTOs](./materi/01-understanding-dtos.md)

**Happy Learning!** 🎉💻

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Maintainer:** Your Name
