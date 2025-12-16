# WEEK 25 COMPLETE GUIDE: Testing Fundamentals in NestJS 🧪

## 📋 Overview Week 25

Week 25 membahas **Testing** - skill yang membedakan developer junior dengan senior. Testing bukan hanya tentang "apakah code works", tapi tentang **confidence**, **maintainability**, dan **quality assurance**.

**Durasi:** 5 hari  
**Level:** Intermediate to Advanced  
**Prerequisites:** NestJS basics, TypeScript, Async/Await  

---

## 🎯 Learning Path

```
Day 1-2: Foundations
├─ Testing Philosophies (TDD, BDD, TAD)
├─ Testabilities (Code design for testing)
├─ Testing Fundamentals (Jest basics)
└─ Mocking Strategies

Day 3: Backend Testing
├─ Business Logic Testing
├─ Guards & Pipes Testing
├─ Database Testing
└─ Async Operations Testing

Day 4: Advanced Testing
├─ Test Fixtures & Factories
├─ Coverage & Quality
├─ Controller Testing
└─ E2E Integration Testing

Day 5: Professional Practices
├─ Testing Best Practices
├─ Debugging Tests
└─ CI/CD Integration
```

---

## 📚 Complete Material Index

| # | Topic | Key Concepts | Time |
|---|-------|--------------|------|
| 01 | [Testing Philosophies](./materi/01-testing-philosophies.md) | TDD, BDD, TAD, Testing Pyramid | 45 min |
| 02 | [Testabilities](./materi/02-testabilities.md) | SRP, DI, Pure Functions | 45 min |
| 03 | [Testing Fundamentals](./materi/03-testing-fundamentals.md) | AAA Pattern, Matchers, Setup/Teardown | 60 min |
| 04 | [Jest & Mocking](./materi/04-jest-framework-mocking.md) | Mocks, Stubs, Spies, Fakes | 60 min |
| 05 | [Backend Testing Excellence](./materi/05-backend-testing-excellence.md) | Business Logic, Service Testing | 60 min |
| 06 | [Testing Guards & Pipes](./materi/06-testing-guards-pipes.md) | Security Testing, Validation | 45 min |
| 07 | [Database Testing](./materi/07-database-testing.md) | Repository, Relationships, Isolation | 60 min |
| 08 | [Async Operations](./materi/08-testing-async-operations.md) | Promises, Timeouts, Retry Logic | 45 min |
| 09 | [Fixtures & Factories](./materi/09-test-fixtures-factories.md) | Test Data Management | 45 min |
| 10 | [Coverage & Quality](./materi/10-test-coverage-quality.md) | Metrics, Quality over Quantity | 30 min |
| 11 | [Controller Testing](./materi/11-testing-controllers.md) | HTTP Layer, Unit Tests | 45 min |
| 12 | [Integration/E2E](./materi/12-integration-testing-e2e.md) | Supertest, Full Stack Testing | 60 min |
| 13 | [Best Practices](./materi/13-testing-best-practices.md) | FIRST Principles, DO's & DON'Ts | 45 min |
| 14 | [Debugging Tests](./materi/14-debugging-tests.md) | Troubleshooting, Common Issues | 30 min |
| 15 | [CI/CD Integration](./materi/15-cicd-integration.md) | GitHub Actions, Automation | 45 min |

**Total Time:** ~12 hours (over 5 days)

---

## 🏗️ Complete Project Structure

### Todo API (Fully Tested)

```
todo-api-tested/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── auth.service.ts
│   │   ├── auth.service.spec.ts      # ✅ 15 unit tests
│   │   ├── auth.controller.ts
│   │   ├── auth.controller.spec.ts   # ✅ 10 unit tests
│   │   ├── jwt.strategy.ts
│   │   ├── jwt.strategy.spec.ts      # ✅ 5 unit tests
│   │   └── guards/
│   │       ├── jwt-auth.guard.ts
│   │       └── jwt-auth.guard.spec.ts # ✅ 8 unit tests
│   │
│   ├── users/                   # User management
│   │   ├── users.service.ts
│   │   ├── users.service.spec.ts     # ✅ 20 unit tests
│   │   ├── users.controller.ts
│   │   ├── users.controller.spec.ts  # ✅ 12 unit tests
│   │   └── entities/
│   │       └── user.entity.ts
│   │
│   ├── todos/                   # Todo CRUD
│   │   ├── todos.service.ts
│   │   ├── todos.service.spec.ts     # ✅ 25 unit tests
│   │   ├── todos.controller.ts
│   │   ├── todos.controller.spec.ts  # ✅ 15 unit tests
│   │   ├── dto/
│   │   │   ├── create-todo.dto.ts
│   │   │   └── create-todo.dto.spec.ts # ✅ 10 validation tests
│   │   └── entities/
│   │       └── todo.entity.ts
│   │
│   ├── database/                # Database config
│   │   └── database.module.ts
│   │
│   └── main.ts
│
├── test/                        # Test utilities
│   ├── factories/               # Test data factories
│   │   ├── user.factory.ts
│   │   └── todo.factory.ts
│   │
│   ├── fixtures/                # Database fixtures
│   │   └── seed.fixture.ts
│   │
│   ├── integration/             # Integration tests
│   │   ├── auth.integration.spec.ts    # ✅ 15 tests
│   │   ├── users.integration.spec.ts   # ✅ 20 tests
│   │   └── todos.integration.spec.ts   # ✅ 25 tests
│   │
│   └── e2e/                     # End-to-end tests
│       ├── auth.e2e-spec.ts            # ✅ 10 tests
│       ├── users.e2e-spec.ts           # ✅ 12 tests
│       └── todos.e2e-spec.ts           # ✅ 15 tests
│
├── .github/
│   └── workflows/
│       └── test.yml             # CI/CD pipeline
│
├── package.json
├── jest.config.js               # Jest configuration
└── README.md
```

**Test Statistics:**
- **Unit Tests:** 120+
- **Integration Tests:** 60+
- **E2E Tests:** 37+
- **Total Tests:** 217+
- **Coverage:** 85%+

---

## 🎓 Step-by-Step Implementation Guide

### Phase 1: Setup Testing Environment

#### Step 1: Install Dependencies
```bash
npm install --save-dev \
  @nestjs/testing \
  jest \
  @types/jest \
  ts-jest \
  supertest \
  @types/supertest
```

#### Step 2: Configure Jest
```javascript
// jest.config.js
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.ts',
    '!**/main.ts',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
};
```

#### Step 3: Update package.json Scripts
```json
{
  \"scripts\": {
    \"test\": \"jest\",
    \"test:watch\": \"jest --watch\",
    \"test:cov\": \"jest --coverage\",
    \"test:debug\": \"node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand\",
    \"test:e2e\": \"jest --config ./test/jest-e2e.json\",
    \"test:all\": \"npm test && npm run test:e2e\"
  }
}
```

---

### Phase 2: Write Your First Unit Test

#### Example: TodoService Test

**Service Code:**
```typescript
// src/todos/todos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: number): Promise<Todo> {
    const todo = this.todosRepository.create({
      ...createTodoDto,
      userId,
    });
    return this.todosRepository.save(todo);
  }

  async findAll(userId: number): Promise<Todo[]> {
    return this.todosRepository.find({ where: { userId } });
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    const todo = await this.todosRepository.findOne({
      where: { id, userId },
    });
    
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    
    return todo;
  }

  async update(id: number, updateData: Partial<Todo>, userId: number): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    Object.assign(todo, updateData);
    return this.todosRepository.save(todo);
  }

  async remove(id: number, userId: number): Promise<void> {
    const todo = await this.findOne(id, userId);
    await this.todosRepository.remove(todo);
  }
}
```

**Test Code:**
```typescript
// src/todos/todos.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';

describe('TodosService', () => {
  let service: TodosService;
  let mockRepository: jest.Mocked<any>;

  beforeEach(async () => {
    // Create mock repository
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      // ARRANGE
      const createDto = { title: 'Test Todo', description: 'Test Description' };
      const userId = 1;
      const createdTodo = { id: 1, ...createDto, userId, completed: false };

      mockRepository.create.mockReturnValue(createdTodo);
      mockRepository.save.mockResolvedValue(createdTodo);

      // ACT
      const result = await service.create(createDto, userId);

      // ASSERT
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        userId,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(createdTodo);
      expect(result).toEqual(createdTodo);
    });
  });

  describe('findAll', () => {
    it('should return array of todos for user', async () => {
      // ARRANGE
      const userId = 1;
      const todos = [
        { id: 1, title: 'Todo 1', userId, completed: false },
        { id: 2, title: 'Todo 2', userId, completed: true },
      ];

      mockRepository.find.mockResolvedValue(todos);

      // ACT
      const result = await service.findAll(userId);

      // ASSERT
      expect(mockRepository.find).toHaveBeenCalledWith({ where: { userId } });
      expect(result).toEqual(todos);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when user has no todos', async () => {
      // ARRANGE
      mockRepository.find.mockResolvedValue([]);

      // ACT
      const result = await service.findAll(1);

      // ASSERT
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a todo when found', async () => {
      // ARRANGE
      const todo = { id: 1, title: 'Test', userId: 1, completed: false };
      mockRepository.findOne.mockResolvedValue(todo);

      // ACT
      const result = await service.findOne(1, 1);

      // ASSERT
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual(todo);
    });

    it('should throw NotFoundException when todo not found', async () => {
      // ARRANGE
      mockRepository.findOne.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999, 1)).rejects.toThrow('Todo with ID 999 not found');
    });

    it('should not return todo from different user', async () => {
      // ARRANGE
      mockRepository.findOne.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.findOne(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update todo successfully', async () => {
      // ARRANGE
      const existingTodo = { id: 1, title: 'Old Title', userId: 1, completed: false };
      const updateData = { title: 'New Title', completed: true };
      const updatedTodo = { ...existingTodo, ...updateData };

      mockRepository.findOne.mockResolvedValue(existingTodo);
      mockRepository.save.mockResolvedValue(updatedTodo);

      // ACT
      const result = await service.update(1, updateData, 1);

      // ASSERT
      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith(updatedTodo);
      expect(result.title).toBe('New Title');
      expect(result.completed).toBe(true);
    });

    it('should throw NotFoundException when updating non-existent todo', async () => {
      // ARRANGE
      mockRepository.findOne.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.update(999, { title: 'New' }, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete todo successfully', async () => {
      // ARRANGE
      const todo = { id: 1, title: 'Test', userId: 1 };
      mockRepository.findOne.mockResolvedValue(todo);
      mockRepository.remove.mockResolvedValue(todo);

      // ACT
      await service.remove(1, 1);

      // ASSERT
      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.remove).toHaveBeenCalledWith(todo);
    });

    it('should throw NotFoundException when deleting non-existent todo', async () => {
      // ARRANGE
      mockRepository.findOne.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.remove(999, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
```

**Run Tests:**
```bash
# Run all tests
npm test

# Run with coverage
npm run test:cov

# Watch mode
npm test:watch

# Run specific test file
npm test todos.service.spec.ts
```

**Expected Output:**
```
PASS  src/todos/todos.service.spec.ts
  TodosService
    ✓ should be defined (3 ms)
    create
      ✓ should create a new todo (5 ms)
    findAll
      ✓ should return array of todos for user (2 ms)
      ✓ should return empty array when user has no todos (2 ms)
    findOne
      ✓ should return a todo when found (2 ms)
      ✓ should throw NotFoundException when todo not found (3 ms)
      ✓ should not return todo from different user (2 ms)
    update
      ✓ should update todo successfully (3 ms)
      ✓ should throw NotFoundException when updating non-existent todo (2 ms)
    remove
      ✓ should delete todo successfully (2 ms)
      ✓ should throw NotFoundException when deleting non-existent todo (2 ms)

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        2.345 s
```

---

### Phase 3: Integration Testing

**E2E Test Example:**
```typescript
// test/e2e/todos.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';

describe('Todos (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Login to get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@email.com', password: 'password' });

    authToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/todos (GET)', () => {
    it('should return array of todos', () => {
      return request(app.getHttpServer())
        .get('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should return 401 without auth token', () => {
      return request(app.getHttpServer())
        .get('/todos')
        .expect(401);
    });
  });

  describe('/todos (POST)', () => {
    it('should create a new todo', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'New Todo',
          description: 'Test Description',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('New Todo');
          expect(res.body.completed).toBe(false);
        });
    });

    it('should reject invalid data', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '', // Empty title
        })
        .expect(400);
    });
  });

  describe('/todos/:id (PATCH)', () => {
    it('should update todo', async () => {
      // First create a todo
      const createResponse = await request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'To Update', description: 'Test' });

      const todoId = createResponse.body.id;

      // Then update it
      return request(app.getHttpServer())
        .patch(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ completed: true })
        .expect(200)
        .expect((res) => {
          expect(res.body.completed).toBe(true);
        });
    });
  });

  describe('/todos/:id (DELETE)', () => {
    it('should delete todo', async () => {
      // Create a todo
      const createResponse = await request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'To Delete', description: 'Test' });

      const todoId = createResponse.body.id;

      // Delete it
      await request(app.getHttpServer())
        .delete(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify it's deleted
      return request(app.getHttpServer())
        .get(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
```

---

## 🎯 Testing Strategies Summary

### What to Test

| Layer | What to Test | Test Type | Priority |
|-------|-------------|-----------|----------|
| **Services** | Business logic, calculations, validations | Unit | ⭐⭐⭐⭐⭐ |
| **Controllers** | Request handling, parameter extraction | Unit | ⭐⭐⭐⭐ |
| **Guards** | Authentication, authorization logic | Unit | ⭐⭐⭐⭐⭐ |
| **Pipes** | Data validation, transformation | Unit | ⭐⭐⭐⭐ |
| **DTOs** | Validation rules | Unit | ⭐⭐⭐⭐ |
| **Repositories** | Database operations | Integration | ⭐⭐⭐ |
| **API Endpoints** | Complete HTTP flows | E2E | ⭐⭐⭐⭐ |

### What NOT to Test

- ❌ Framework code (NestJS internals)
- ❌ Third-party libraries
- ❌ Simple getters/setters
- ❌ Interfaces/Types (TypeScript)
- ❌ Configuration files

---

## 📊 Coverage Goals by Module

```
Recommended Coverage Targets:

📦 Overall Project:        75-85%
🧠 Business Logic:         90-100%
🎮 Controllers:            70-80%
🔐 Guards/Pipes:           85-95%
🛠️ Services:              80-90%
💾 Repositories:           70-80%
📋 DTOs:                   80-90%
🔧 Utilities:              80-90%
```

---

## 🚀 CI/CD Pipeline Setup

**GitHub Actions Workflow:**
```yaml
# .github/workflows/test.yml
name: Run Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Run unit tests
        run: npm test -- --coverage
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          
      - name: Check coverage threshold
        run: |
          npm run test:cov
```

---

## 📝 Best Practices Checklist

### Before Writing Tests:
- [ ] Understand the requirement
- [ ] Identify test cases (happy path, error cases, edge cases)
- [ ] Set up test environment

### While Writing Tests:
- [ ] Use descriptive test names
- [ ] Follow AAA pattern (Arrange, Act, Assert)
- [ ] Test behavior, not implementation
- [ ] Mock external dependencies
- [ ] Keep tests simple and focused

### After Writing Tests:
- [ ] Run all tests locally
- [ ] Check coverage report
- [ ] Review test quality
- [ ] Commit with meaningful message
- [ ] Set up CI/CD

---

## 🎓 Exercises

### Exercise 1: Unit Testing (Easy)
**Task:** Write unit tests for a `Calculator` service.
- `add(a, b)` - Addition
- `subtract(a, b)` - Subtraction
- `multiply(a, b)` - Multiplication
- `divide(a, b)` - Division (handle division by zero)

**Expected:** 10+ tests covering all operations and edge cases.

---

### Exercise 2: Mocking (Medium)
**Task:** Test a `UserService` that depends on:
- `UserRepository` (database)
- `EmailService` (external API)
- `CacheService` (Redis)

Mock all dependencies and write tests for:
- `createUser()` - Creates user, sends welcome email, caches result
- `findUser()` - Checks cache first, then database
- `updateUser()` - Updates database, invalidates cache

**Expected:** 15+ tests with proper mocking.

---

### Exercise 3: E2E Testing (Hard)
**Task:** Write E2E tests for a blog API with authentication:
- User registration and login
- Create/Read/Update/Delete blog posts
- Only author can edit/delete their posts
- Public can read all posts

**Expected:** 20+ E2E tests covering all user flows.

---

## 🎉 Summary

**Key Takeaways:**
1. ✅ Tests provide **confidence** and **safety net**
2. ✅ Follow **Testing Pyramid** (70% unit, 20% integration, 10% E2E)
3. ✅ **Mock external dependencies** for faster, reliable tests
4. ✅ Focus on **quality over quantity** (coverage is a metric, not a goal)
5. ✅ **Automate testing** with CI/CD for continuous quality assurance

**Remember:**
> \"The only way to go fast, is to go well.\" - Uncle Bob

Testing membutuhkan **time investment** di awal, tapi akan **save time** di jangka panjang dengan mengurangi bugs, mempermudah refactoring, dan meningkatkan confidence.

---

## 🔗 Additional Resources

- [NestJS Testing Docs](https://docs.nestjs.com/fundamentals/testing)
- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Test-Driven Development by Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)

---

## 📬 Need Help?

Questions? Issues? Feedback?
- Open an issue in the repository
- Ask in the class discussion
- Review materials again

**Happy Testing! 🧪✨**
