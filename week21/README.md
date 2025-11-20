# Week 21: Introduction to NestJS & REST API

## 📚 Overview

Week 21 membahas fundamental backend development dengan NestJS framework dan REST API concepts. Students akan belajar bagaimana membuat API backend yang scalable dan maintainable.

## 🎯 Learning Objectives

Setelah menyelesaikan week ini, students akan mampu:
- ✅ Memahami konsep backend development
- ✅ Memahami mengapa menggunakan framework backend
- ✅ Membuat project NestJS dari awal
- ✅ Memahami architecture NestJS (Modules, Controllers, Services)
- ✅ Membuat REST API endpoints (GET, POST, PUT, DELETE)
- ✅ Implement validation dengan DTOs
- ✅ Handle errors dengan baik
- ✅ Test API dengan Postman

## 📖 Materi Pembelajaran

### Part 1: Introduction to Backend & NestJS

1. **[What is Backend Development?](./materi/01-what-is-backend-development.md)**
   - Pengertian backend development
   - Perbedaan frontend vs backend
   - Komponen utama backend
   - Tanggung jawab backend developer

2. **[Why Use a Backend Framework?](./materi/02-why-use-backend-framework.md)**
   - Perbandingan dengan dan tanpa framework
   - Keuntungan menggunakan framework
   - Framework comparison

3. **[Why NestJS Over Other Frameworks?](./materi/03-why-nestjs-over-others.md)**
   - NestJS vs Express, Fastify, Koa, Adonis
   - Keunggulan NestJS
   - When to use NestJS

4. **[REST API Fundamentals](./materi/04-rest-api-fundamentals.md)**
   - REST principles
   - HTTP methods (GET, POST, PUT, DELETE)
   - Status codes
   - API design best practices

5. **[Setting Up Development Environment](./materi/05-setting-up-development-environment.md)**
   - Install Node.js, npm, NestJS CLI
   - Setup VS Code
   - Install Postman
   - Create first project

### Part 2: NestJS Architecture & Basic Development

6. **[Understanding NestJS Architecture](./materi/06-understanding-nestjs-architecture.md)**
   - Modules, Controllers, Services
   - Dependency Injection
   - Request lifecycle
   - Architecture patterns

7. **[Modules, Controllers, and Services](./materi/07-modules-controllers-services.md)**
   - Creating modules
   - Creating controllers
   - Creating services
   - Generate resources with CLI

8. **[Creating Your First Endpoint](./materi/08-creating-first-endpoint.md)**
   - Step-by-step guide
   - Test endpoints
   - Handle requests and responses

9. **[DTO & Input Validation](./materi/09-dto-and-validation.md)**
   - What is DTO?
   - class-validator decorators
   - Validation examples
   - Custom validators

10. **[Error Handling](./materi/10-error-handling.md)**
    - Built-in HTTP exceptions
    - Custom exception filters
    - Try-catch patterns
    - Best practices

11. **[Testing API with Postman](./materi/11-testing-with-postman.md)**
    - Postman basics
    - Testing CRUD operations
    - Collections and environments
    - Testing validation

### Part 3: Building CRUD API with Best Practices

12. **[Review of CRUD Operations](./materi/12-review-crud-operations.md)**
    - CRUD fundamentals
    - HTTP methods mapping
    - RESTful conventions
    - Best practices

13. **[Service Layer Implementation](./materi/13-service-layer-implementation.md)**
    - Service layer pattern
    - Business logic separation
    - Dependency injection
    - Complete examples

14. **[Repository Pattern](./materi/14-repository-pattern.md)**
    - Repository pattern explained
    - Data access layer
    - Architecture layers
    - Library management example

15. **[Implementing Complete CRUD API](./materi/15-implementing-complete-crud-api.md)**
    - Task Management API
    - Complete implementation
    - All patterns combined
    - Testing guide

16. **[Custom Business Logic](./materi/16-custom-business-logic.md)**
    - Business logic patterns
    - Validation logic
    - Calculation logic
    - State transitions
    - Authorization logic

17. **[Request Lifecycle in NestJS](./materi/17-request-lifecycle-nestjs.md)**
    - Request flow
    - Middleware
    - Guards
    - Interceptors
    - Pipes
    - Exception filters

### Part 4: API Documentation

18. **[Importance of API Documentation](./materi/18-importance-api-documentation.md)**
    - Why document APIs
    - Types of documentation
    - Good vs bad documentation
    - Best practices

19. **[Postman for API Documentation](./materi/19-postman-for-api-documentation.md)**
    - Postman features
    - Collections
    - Environment variables
    - Tests and scripts

20. **[Documenting Endpoints with Decorators](./materi/20-documenting-endpoints-decorators.md)**
    - Swagger/OpenAPI setup
    - Common decorators
    - Complete examples
    - Export to Postman

21. **[API Documentation Best Practices](./materi/21-api-documentation-best-practices.md)**
    - Naming conventions
    - Writing descriptions
    - Providing examples
    - Versioning
    - Error documentation

22. **[Creating Postman Collections](./materi/22-creating-postman-collections.md)**
    - Collection structure
    - Organizing requests
    - Adding tests
    - Using variables
    - Running collections

23. **[Sharing Documentation with Team](./materi/23-sharing-documentation-team.md)**
    - Export/Import workflows
    - Team workspaces
    - Publishing documentation
    - Collaboration best practices

24. **[Export and Import Collections; Course Recap](./materi/24-export-import-collections-course-recap.md)**
    - Export/Import detailed guide
    - Week 21 complete recap
    - What you've learned
    - Next steps

## 🛠️ Demo Projects

### 1. [Basic NestJS API](./demo/basic-nestjs-api/)
Simple API untuk memahami struktur dasar NestJS.
- Basic CRUD operations
- No database (in-memory)
- Simple validation

### 2. [Todo API with Validation](./demo/todo-api-nestjs/)
Complete Todo API dengan validation dan error handling.
- Full CRUD for todos
- Input validation
- Error handling
- Query parameters (filtering, sorting)

### 3. [User Management API](./demo/user-management-api/)
Complete user management system.
- User CRUD operations
- Advanced validation
- Custom exceptions
- Nested resources

## 💻 Examples

Folder `examples/` berisi code snippets untuk:
- Route parameters dan query parameters
- Request body handling
- Validation examples
- Error handling patterns
- Custom decorators

## ✏️ Exercises

File `exercises/EXERCISES.md` berisi latihan-latihan untuk practice:
1. Create Products API
2. Add validation to Products API
3. Implement error handling
4. Create Books API with categories
5. Build complete E-commerce API structure

## 🎯 Projects (Assignments)

File `projects/ASSIGNMENTS.md` berisi project assignments:
1. **Basic:** Simple Blog API (Posts CRUD)
2. **Intermediate:** E-commerce API (Products, Categories, Cart)
3. **Advanced:** Complete REST API with authentication

## 📝 Prerequisites

- JavaScript fundamentals
- Basic TypeScript knowledge
- Understanding of HTTP protocol
- Node.js installed

## 🚀 Getting Started

### 1. Install Dependencies

```bash
# Install Node.js (if not installed)
# Download from: https://nodejs.org/

# Install NestJS CLI globally
npm install -g @nestjs/cli

# Verify installation
nest --version
```

### 2. Create Your First Project

```bash
# Create new project
nest new my-first-api

# Navigate to project
cd my-first-api

# Start development server
npm run start:dev
```

### 3. Test Your API

Open browser: `http://localhost:3000`

You should see: "Hello World!"

### 4. Explore Demo Projects

```bash
# Navigate to demo folder
cd demo/basic-nestjs-api

# Install dependencies
npm install

# Start server
npm run start:dev
```

## 📚 Resources

### Documentation
- [NestJS Official Docs](https://docs.nestjs.com)
- [NestJS GitHub](https://github.com/nestjs/nest)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tools
- [Postman](https://www.postman.com/)
- [VS Code](https://code.visualstudio.com/)
- [Thunder Client (VS Code Extension)](https://www.thunderclient.com/)

### Learning Resources
- [NestJS Crash Course - YouTube](https://www.youtube.com/results?search_query=nestjs+crash+course)
- [REST API Best Practices](https://restfulapi.net/)

## 🎓 Learning Path

### Day 1: Introduction & Setup
- Read materi 01-05
- Setup development environment
- Create first NestJS project
- Test Hello World endpoint

### Day 2: Architecture & Basic CRUD
- Read materi 06-07
- Understand NestJS architecture
- Create your first module, controller, service
- Run demo/basic-nestjs-api

### Day 3: Endpoints & DTOs
- Read materi 08-09
- Create CRUD endpoints
- Implement DTOs and validation
- Run demo/todo-api-nestjs

### Day 4: Error Handling & Testing
- Read materi 10-11
- Implement error handling
- Test API with Postman
- Complete exercises

### Day 5: Project Work
- Choose assignment project
- Implement complete API
- Test all endpoints
- Document your API

## 💡 Tips for Success

1. **Practice Daily**: Code every day, even for 30 minutes
2. **Test Immediately**: Test every endpoint you create
3. **Read Errors**: Error messages provide valuable information
4. **Use Postman**: Create collections for all your endpoints
5. **Ask Questions**: Don't hesitate to ask when stuck
6. **Read Documentation**: NestJS docs are comprehensive
7. **Debug with console.log**: See what's happening in your code
8. **Version Control**: Commit your code regularly

## 🤝 Support

Jika ada pertanyaan:
1. Check materi dan documentation
2. Review demo projects
3. Search in NestJS documentation
4. Ask in class discussion
5. Contact instructor

## 📅 Schedule

| Day | Topics | Activities |
|-----|--------|------------|
| **Day 1** | Backend & NestJS Intro | Setup, First Project |
| **Day 2** | Architecture & Modules | Create CRUD API |
| **Day 3** | Validation & DTOs | Add Validation |
| **Day 4** | Error Handling | Complete Todo API |
| **Day 5** | Testing & Project | Build Assignment Project |

## ✅ Checklist

Before moving to next week, make sure you can:
- [ ] Explain what backend development is
- [ ] Create new NestJS project
- [ ] Create modules, controllers, and services
- [ ] Implement CRUD operations
- [ ] Add DTOs with validation
- [ ] Handle errors properly
- [ ] Test API with Postman
- [ ] Understand HTTP methods and status codes

## 🎉 Let's Start Learning!

Ready to become a backend developer? Start with [What is Backend Development](./materi/01-what-is-backend-development.md)!

---

**Remember:** 
> "The best way to learn programming is by doing. Don't just read, code along!"

Good luck! 🚀
