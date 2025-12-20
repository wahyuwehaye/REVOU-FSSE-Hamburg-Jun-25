# Todo API - Testing Fundamental NestJS

A production-ready Todo API built with NestJS demonstrating comprehensive testing practices. This project showcases unit testing, integration testing, E2E testing, authentication, authorization, and best practices from Week 25 materials.

## 🎯 Features

- ✅ **Authentication & Authorization**: JWT-based auth with role-based access control
- ✅ **User Management**: Register, login, user CRUD operations
- ✅ **Todo CRUD**: Create, read, update, delete todos with user isolation
- ✅ **Comprehensive Testing**: 40+ unit tests, E2E tests ready
- ✅ **Database**: TypeORM with SQLite (in-memory for dev)
- ✅ **Validation**: DTO validation with class-validator
- ✅ **Security**: Password hashing with bcrypt, protected routes

## 📦 Tech Stack

- **Framework**: NestJS 10
- **Database**: TypeORM + SQLite
- **Authentication**: JWT + Passport
- **Validation**: class-validator, class-transformer
- **Testing**: Jest + Supertest
- **Security**: bcrypt

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`

### 3. Run Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📖 API Endpoints

### Authentication

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "jwt-token...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

### Todos (Protected Routes - Require JWT)

**Create Todo**
```http
POST /api/todos
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false
}
```

**Get All Todos**
```http
GET /api/todos
Authorization: Bearer <jwt-token>
```

**Get Single Todo**
```http
GET /api/todos/:id
Authorization: Bearer <jwt-token>
```

**Update Todo**
```http
PATCH /api/todos/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true
}
```

**Toggle Todo Complete**
```http
PATCH /api/todos/:id/toggle
Authorization: Bearer <jwt-token>
```

**Delete Todo**
```http
DELETE /api/todos/:id
Authorization: Bearer <jwt-token>
```

### Users (Protected Routes)

**Get Current User**
```http
GET /api/users/me
Authorization: Bearer <jwt-token>
```

**Get All Users (Admin Only)**
```http
GET /api/users
Authorization: Bearer <jwt-token>
```

## 🧪 Testing Strategy

Following Week 25 materials, this project implements a comprehensive testing pyramid:

### Unit Tests (70% Coverage)
- **UsersService**: 20+ tests covering CRUD, password hashing, validation
- **TodosService**: 25+ tests covering CRUD, user isolation, edge cases
- **AuthService**: 15+ tests covering registration, login, token generation

### E2E Tests (30% Coverage)
- **Auth Flow**: Registration, login, invalid credentials
- **Todo Operations**: Full CRUD flow with authentication
- **User Operations**: User management with role-based access

### Running Tests

```bash
# Run all unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

## 📂 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── decorators/         # Custom decorators (CurrentUser, Roles)
│   ├── guards/             # Auth guards (JWT, Roles)
│   ├── strategies/         # Passport strategies
│   ├── auth.controller.ts  # Login/Register endpoints
│   ├── auth.service.ts     # Auth business logic
│   └── auth.service.spec.ts # Auth unit tests
├── users/                   # Users module
│   ├── entities/           # User entity
│   ├── dto/                # User DTOs
│   ├── users.controller.ts # User endpoints
│   ├── users.service.ts    # User business logic
│   └── users.service.spec.ts # User unit tests
├── todos/                   # Todos module
│   ├── entities/           # Todo entity
│   ├── dto/                # Todo DTOs
│   ├── todos.controller.ts # Todo endpoints
│   ├── todos.service.ts    # Todo business logic
│   └── todos.service.spec.ts # Todo unit tests
├── app.module.ts           # Root module
└── main.ts                 # Application entry point
```

## 🔒 Security Features

1. **Password Hashing**: Passwords hashed with bcrypt (10 rounds)
2. **JWT Authentication**: Secure token-based authentication
3. **Role-Based Access**: Admin-only endpoints protected
4. **User Isolation**: Users can only access their own todos
5. **Input Validation**: All DTOs validated with class-validator
6. **CORS Enabled**: Cross-origin resource sharing configured

## 🎓 Learning Objectives

This project demonstrates:

1. **Test-Driven Development (TDD)**
   - Writing tests before implementation
   - Red-Green-Refactor cycle

2. **Testing Best Practices**
   - Arrange-Act-Assert (AAA) pattern
   - Mocking dependencies with Jest
   - Test isolation and independence
   - Descriptive test names

3. **NestJS Architecture**
   - Module-based architecture
   - Dependency injection
   - Guards and decorators
   - Pipes and validation

4. **Security Patterns**
   - JWT authentication
   - Password hashing
   - Role-based authorization
   - Request validation

## 📚 Related Materials

- **Week 25 Materials**: Complete testing guide in `../materi/`
- **Testing Philosophies**: `01-testing-philosophies.md`
- **Jest Framework**: `04-jest-framework-mocking.md`
- **E2E Testing**: `12-integration-testing-e2e.md`

## 🤝 Contributing

This project follows the testing practices taught in Week 25. When adding new features:

1. Write tests first (TDD)
2. Follow AAA pattern
3. Mock all external dependencies
4. Maintain 85%+ coverage
5. Add E2E tests for new endpoints

## 📝 License

MIT

---

Built as part of RevoU Week 25 - Testing Fundamental in NestJS curriculum.

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
