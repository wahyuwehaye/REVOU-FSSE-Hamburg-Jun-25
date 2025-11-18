# Week 21 - NestJS & REST API Learning Materials
## Summary & Guide

## ✅ Apa yang Sudah Dibuat

### 📚 Learning Materials (Materi)

Saya telah membuat **11 chapter** materi pembelajaran yang comprehensive:

1. **[What is Backend Development?](./materi/01-what-is-backend-development.md)**
   - Pengertian backend development
   - Perbedaan frontend vs backend
   - Komponen utama backend (Server, Database, API)
   - Tanggung jawab backend developer
   - Backend architecture patterns
   - Real-world examples

2. **[Why Use a Backend Framework?](./materi/02-why-use-backend-framework.md)**
   - Comparison: dengan vs tanpa framework
   - 8 keuntungan utama menggunakan framework
   - Framework comparison (Express, Django, Spring Boot)
   - When to use/not use framework

3. **[Why NestJS Over Other Frameworks?](./materi/03-why-nestjs-over-others.md)**
   - NestJS vs Express, Fastify, Koa, Adonis
   - 12 keunggulan utama NestJS
   - TypeScript first approach
   - Dependency Injection
   - Built-in features (validation, testing, documentation)
   - When to choose NestJS

4. **[REST API Fundamentals](./materi/04-rest-api-fundamentals.md)**
   - REST principles (Client-Server, Stateless, etc.)
   - HTTP Methods (GET, POST, PUT, PATCH, DELETE)
   - HTTP Status Codes
   - REST API design best practices
   - Request & Response examples
   - Authentication & Authorization basics

5. **[Setting Up Development Environment](./materi/05-setting-up-development-environment.md)**
   - Install Node.js, npm, NestJS CLI
   - VS Code setup & extensions
   - Git configuration
   - API testing tools (Postman, Thunder Client)
   - Creating first NestJS project
   - Troubleshooting common issues

6. **[Understanding NestJS Architecture](./materi/06-understanding-nestjs-architecture.md)**
   - Core building blocks
   - Modules explained
   - Controllers explained
   - Services explained
   - DTOs (Data Transfer Objects)
   - Dependency Injection pattern
   - Request lifecycle
   - Architecture best practices

7. **[Modules, Controllers, and Services](./materi/07-modules-controllers-services.md)**
   - Creating modules with CLI
   - Creating controllers with CLI
   - Creating services with CLI
   - Complete CRUD example
   - Using nest generate resource
   - Testing with curl

8. **[Creating Your First Endpoint](./materi/08-creating-first-endpoint.md)**
   - Step-by-step guide
   - Create custom endpoints
   - Test endpoints
   - Add GET and POST methods
   - Hands-on practice

9. **[DTO & Input Validation](./materi/09-dto-and-validation.md)**
   - What is DTO and why use it
   - Installing class-validator
   - Validation decorators (IsString, IsEmail, IsNumber, etc.)
   - Creating DTOs with validation
   - Testing validation
   - Custom validators
   - Best practices

10. **[Error Handling](./materi/10-error-handling.md)**
    - Built-in HTTP exceptions
    - NotFoundException, BadRequestException, etc.
    - Custom exception filters
    - Try-catch patterns
    - Complete service with error handling
    - Testing error scenarios

11. **[Testing API with Postman](./materi/11-testing-with-postman.md)**
    - Installing Postman
    - Creating requests (GET, POST, PUT, DELETE)
    - Organizing with collections
    - Environment variables
    - Testing validation
    - Query parameters
    - Pre-request scripts and tests

### 🛠️ Demo Project

**[Basic NestJS API](./demo/basic-nestjs-api/)**

Demo project lengkap dengan:
- ✅ Complete project structure
- ✅ Products CRUD API
- ✅ In-memory storage
- ✅ DTOs for request/response
- ✅ Detailed code comments (dalam Bahasa Indonesia & English)
- ✅ README with API documentation
- ✅ Testing examples

**File Structure:**
```
basic-nestjs-api/
├── src/
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── main.ts
│   └── products/
│       ├── products.module.ts
│       ├── products.controller.ts
│       ├── products.service.ts
│       └── dto/
│           ├── create-product.dto.ts
│           └── update-product.dto.ts
├── package.json
├── tsconfig.json
└── README.md
```

**API Endpoints:**
- `GET /products` - Get all products
- `GET /products/:id` - Get single product
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### ✏️ Exercises

**[EXERCISES.md](./exercises/EXERCISES.md)** berisi 10 exercises + 5 bonus challenges:

1. Basic GET Endpoint
2. CRUD Operations
3. Query Parameters
4. Validation
5. Error Handling
6. Nested Resources
7. Custom Response Format
8. Pagination
9. Search Functionality
10. Multiple Modules

**Bonus Challenges:**
- Soft Delete
- Timestamps
- Bulk Operations
- Advanced Filtering
- Rate Limiting

### 🎯 Assignments

**[ASSIGNMENTS.md](./projects/ASSIGNMENTS.md)** berisi 3 level assignments:

**Assignment 1: Blog API (Basic)**
- Simple blog with posts CRUD
- Basic validation
- Error handling

**Assignment 2: E-commerce API (Intermediate)**
- Products, Categories, Cart modules
- Relationships between entities
- Filtering, sorting, search
- Input validation
- Query parameters

**Assignment 3: Task Management API (Advanced)**
- Projects, Tasks, Tags, Users modules
- Complex relationships
- Advanced filtering, sorting, pagination
- Search functionality
- Statistics endpoints
- Comprehensive validation

### 📖 Main README

**[README.md](./README.md)** berisi:
- 📚 Overview materi
- 🎯 Learning objectives
- 📖 Table of contents dengan links
- 🚀 Getting started guide
- 📅 5-day learning schedule
- 💡 Tips for success
- ✅ Completion checklist
- 📚 Resources dan documentation links

## 🎓 Cara Menggunakan Materi Ini

### Untuk Teaching Leader (TL):

#### Day 1: Introduction to Backend & NestJS
**Materi:** Chapter 01-05
**Topics:**
- What is backend development
- Why use framework
- Why NestJS
- REST API fundamentals
- Setup environment

**Demo:**
- Show project structure
- Create simple endpoint
- Test with Postman

**Activities:**
- Students setup environment
- Create first NestJS project
- Test Hello World endpoint

**Duration:** 2-3 hours

#### Day 2: Architecture & First API
**Materi:** Chapter 06-08
**Topics:**
- NestJS architecture
- Modules, Controllers, Services
- Creating endpoints

**Demo:**
- Walk through basic-nestjs-api
- Explain each file
- Show CRUD operations
- Test all endpoints

**Activities:**
- Students clone demo project
- Run and test locally
- Modify and add features
- Exercise 1 & 2

**Duration:** 2-3 hours

#### Day 3: DTOs & Validation
**Materi:** Chapter 09
**Topics:**
- What is DTO
- class-validator
- Validation decorators

**Demo:**
- Add validation to demo project
- Test invalid data
- Show error messages

**Activities:**
- Students add validation
- Test various scenarios
- Exercise 3 & 4

**Duration:** 2-3 hours

#### Day 4: Error Handling & Testing
**Materi:** Chapter 10-11
**Topics:**
- HTTP exceptions
- Custom error handling
- Testing with Postman

**Demo:**
- Add error handling
- Create Postman collection
- Show testing workflow

**Activities:**
- Students implement error handling
- Create Postman collections
- Exercise 5-7

**Duration:** 2-3 hours

#### Day 5: Project Work
**Activities:**
- Students choose assignment
- Start implementation
- Q&A and troubleshooting
- Review best practices

**Duration:** 3-4 hours

### Untuk Students:

#### Self-Paced Learning:

**Week 1:**
1. Read Chapter 01-03 (30 min)
2. Setup environment - Chapter 05 (1 hour)
3. Create first project (30 min)
4. Read Chapter 04 (30 min)

**Week 2:**
1. Read Chapter 06-07 (1 hour)
2. Study demo project (1 hour)
3. Run and test demo (30 min)
4. Do Exercise 1-2 (2 hours)

**Week 3:**
1. Read Chapter 08-09 (1 hour)
2. Add validation to demo (1 hour)
3. Do Exercise 3-4 (2 hours)

**Week 4:**
1. Read Chapter 10-11 (1 hour)
2. Add error handling (1 hour)
3. Do Exercise 5-7 (2 hours)

**Week 5:**
1. Choose assignment (30 min)
2. Plan implementation (1 hour)
3. Build project (8-10 hours)
4. Test and document (2 hours)

## 📝 Tips untuk Mengajar

### 1. Hands-On Approach
- ✅ Live coding during demos
- ✅ Students code along
- ✅ Test immediately after creating

### 2. Progressive Learning
- ✅ Start simple (no database, no auth)
- ✅ Add complexity gradually
- ✅ Build on previous knowledge

### 3. Real Examples
- ✅ Use real-world scenarios
- ✅ Relate to familiar apps (e-commerce, social media)
- ✅ Show production patterns

### 4. Common Mistakes
Prepare untuk explain:
- Forgetting decorators
- Wrong import paths
- Not starting dev server
- Typos in route paths
- Missing DTOs

### 5. Q&A Topics
Be ready untuk pertanyaan tentang:
- When to create new module
- Service vs Controller logic
- DTO vs Entity
- Error handling strategies
- Best practices

## 📊 Assessment Criteria

### Exercises (40%)
- [ ] Completion of exercises
- [ ] Code quality
- [ ] Working endpoints
- [ ] Proper validation

### Assignment (60%)
- [ ] Functionality (40%)
- [ ] Code quality (25%)
- [ ] Validation (15%)
- [ ] Error handling (10%)
- [ ] Documentation (10%)

## 🔗 Quick Links

**Materi:**
- [01 - Backend Development](./materi/01-what-is-backend-development.md)
- [02 - Why Framework](./materi/02-why-use-backend-framework.md)
- [03 - Why NestJS](./materi/03-why-nestjs-over-others.md)
- [04 - REST API](./materi/04-rest-api-fundamentals.md)
- [05 - Setup](./materi/05-setting-up-development-environment.md)
- [06 - Architecture](./materi/06-understanding-nestjs-architecture.md)
- [07 - Modules, Controllers, Services](./materi/07-modules-controllers-services.md)
- [08 - First Endpoint](./materi/08-creating-first-endpoint.md)
- [09 - DTO & Validation](./materi/09-dto-and-validation.md)
- [10 - Error Handling](./materi/10-error-handling.md)
- [11 - Testing with Postman](./materi/11-testing-with-postman.md)

**Practice:**
- [Demo Project](./demo/basic-nestjs-api/)
- [Exercises](./exercises/EXERCISES.md)
- [Assignments](./projects/ASSIGNMENTS.md)

## 📚 External Resources

- [NestJS Official Docs](https://docs.nestjs.com)
- [NestJS GitHub](https://github.com/nestjs/nest)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)

## ✅ Status

- ✅ 11 Learning materials created
- ✅ 1 Complete demo project
- ✅ 10 Exercises + 5 bonus challenges
- ✅ 3 Assignment projects (Basic, Intermediate, Advanced)
- ✅ Main README with learning path
- ✅ Pushed to GitHub

## 🎉 Selesai!

Semua materi Week 21 sudah complete dan di-push ke GitHub repository:
**wahyuwehaye/REVOU-FSSE-Hamburg-Jun-25**

Folder: `week21/`

### Students dapat mulai belajar dengan:
1. Baca README.md untuk overview
2. Follow 5-day learning schedule
3. Study materi chapter by chapter
4. Run demo project
5. Complete exercises
6. Build assignment project

### Teaching Leaders dapat:
1. Use materi as teaching guide
2. Demo dengan live coding
3. Assign exercises progressively
4. Review student submissions
5. Provide feedback

---

**Good luck with teaching NestJS!** 🚀

Jika ada pertanyaan atau perlu additional materials, feel free to ask!
