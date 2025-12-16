# Testing Fundamentals - Dasar-Dasar Testing dengan Jest

## 🤔 Apa itu Unit Testing?

**Analogi Sederhana:**
Bayangkan kamu bikin Lego spaceship:
- **Unit Test** 🧱 = Test setiap brick Lego individual (kokoh gak? warnanya bener gak?)
- **Integration Test** 🚀 = Test setelah bricks di-rakit jadi wings (bisa terbang gak?)
- **E2E Test** 🌌 = Test spaceship lengkap dari start to finish (bisa ke bulan gak?)

**Unit Testing** = Testing **satu unit code** (function/method/class) secara **isolated** (terpisah dari dependencies).

---

## 🎯 Kenapa Unit Testing Penting?

1. **Catch bugs early** 🐛
   - Bug ketemu waktu develop, bukan waktu production
   - Cheaper to fix (gak perlu rollback deployment)

2. **Safety net for refactoring** 🛡️
   - Berani ubah code tanpa takut break existing features
   - Tests akan kasih tahu kalau ada yang rusak

3. **Living documentation** 📚
   - Tests menjelaskan gimana code seharusnya behave
   - Lebih reliable daripada comment yang bisa outdated

4. **Faster development in long run** 🚀
   - Awalnya terasa slower, tapi saves time debugging later

---

## 🧪 Anatomy of a Test

### Basic Test Structure (AAA Pattern)

```typescript
describe('Calculator', () => {
  it('should add two numbers correctly', () => {
    // 1. ARRANGE - Setup test data
    const calculator = new Calculator();
    const num1 = 2;
    const num2 = 3;

    // 2. ACT - Execute the function being tested
    const result = calculator.add(num1, num2);

    // 3. ASSERT - Verify the result
    expect(result).toBe(5);
  });
});
```

**Penjelasan:**
- `describe()` = Group related tests (test suite)
- `it()` = Individual test case
- `expect()` = Assertion - what you expect to be true
- `toBe()` = Matcher - how to compare values

---

## 📦 Jest Matchers - Cara Compare Values

### 1. Equality Matchers

```typescript
// Strict equality (===)
expect(2 + 2).toBe(4);
expect('hello').toBe('hello');

// Deep equality (untuk objects/arrays)
expect({ name: 'John' }).toEqual({ name: 'John' });
expect([1, 2, 3]).toEqual([1, 2, 3]);

// toBe vs toEqual
expect({ a: 1 }).toBe({ a: 1 });     // ❌ Fail (different object references)
expect({ a: 1 }).toEqual({ a: 1 });  // ✅ Pass (same values)
```

### 2. Truthiness Matchers

```typescript
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect(true).toBeTruthy();
expect(false).toBeFalsy();
expect(0).toBeFalsy();          // 0 is falsy
expect('').toBeFalsy();         // empty string is falsy
expect('hello').toBeTruthy();   // non-empty string is truthy
```

### 3. Number Matchers

```typescript
expect(2 + 2).toBe(4);
expect(2 + 2).toBeGreaterThan(3);
expect(2 + 2).toBeGreaterThanOrEqual(4);
expect(2 + 2).toBeLessThan(5);
expect(2 + 2).toBeLessThanOrEqual(4);

// Floating point comparison
expect(0.1 + 0.2).toBeCloseTo(0.3); // ✅ Better than toBe
expect(0.1 + 0.2).toBe(0.3);        // ❌ Might fail due to floating point
```

### 4. String Matchers

```typescript
expect('Hello World').toMatch(/World/);
expect('hello@example.com').toMatch(/.*@.*\..*/); // Email regex
expect('NestJS is awesome').toContain('awesome');
```

### 5. Array/Iterable Matchers

```typescript
const shoppingList = ['milk', 'eggs', 'bread'];

expect(shoppingList).toContain('milk');
expect(shoppingList).toHaveLength(3);
expect(shoppingList).toEqual(['milk', 'eggs', 'bread']);
```

### 6. Exception Matchers

```typescript
function throwError() {
  throw new Error('Oops!');
}

expect(() => throwError()).toThrow();
expect(() => throwError()).toThrow('Oops!');
expect(() => throwError()).toThrow(Error);
```

---

## 🏗️ Test Structure Best Practices

### 1. Descriptive Test Names

```typescript
// ❌ Bad - Not descriptive
it('test1', () => {});
it('works', () => {});

// ✅ Good - Clear and specific
it('should return user when valid ID is provided', () => {});
it('should throw NotFoundException when user does not exist', () => {});
it('should calculate discount correctly for premium users', () => {});
```

### 2. One Assertion Per Test (Guideline, not rule)

```typescript
// ❌ Avoid - Testing multiple things
it('should create user', () => {
  const user = createUser({ name: 'John' });
  expect(user).toBeDefined();
  expect(user.name).toBe('John');
  expect(user.createdAt).toBeDefined();
  expect(user.email).toContain('@');
  // If first assertion fails, you won't know about the rest!
});

// ✅ Better - Focused tests
it('should return user object', () => {
  const user = createUser({ name: 'John' });
  expect(user).toBeDefined();
});

it('should set user name correctly', () => {
  const user = createUser({ name: 'John' });
  expect(user.name).toBe('John');
});

it('should set createdAt timestamp', () => {
  const user = createUser({ name: 'John' });
  expect(user.createdAt).toBeDefined();
});
```

### 3. Group Related Tests with `describe`

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', () => {});
    it('should hash password before saving', () => {});
    it('should throw error if email already exists', () => {});
  });

  describe('findUser', () => {
    it('should return user by ID', () => {});
    it('should return null if user not found', () => {});
  });
});
```

---

## ⚙️ Setup and Teardown

### `beforeEach` and `afterEach`

```typescript
describe('TodoService', () => {
  let service: TodoService;
  let mockRepository: jest.Mocked<TodoRepository>;

  // Run BEFORE each test
  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      create: jest.fn(),
    } as any;

    service = new TodoService(mockRepository);
  });

  // Run AFTER each test
  afterEach(() => {
    jest.clearAllMocks(); // Clean up mocks
  });

  it('should fetch all todos', async () => {
    mockRepository.find.mockResolvedValue([{ id: 1, title: 'Test' }]);
    
    const todos = await service.findAll();
    
    expect(todos).toHaveLength(1);
  });

  it('should create new todo', async () => {
    const newTodo = { title: 'New Todo' };
    mockRepository.create.mockResolvedValue({ id: 2, ...newTodo });

    const result = await service.create(newTodo);

    expect(result.id).toBe(2);
    expect(mockRepository.create).toHaveBeenCalledWith(newTodo);
  });
});
```

### `beforeAll` and `afterAll`

```typescript
describe('Database Tests', () => {
  // Run ONCE before all tests in this suite
  beforeAll(async () => {
    await connectDatabase();
  });

  // Run ONCE after all tests in this suite
  afterAll(async () => {
    await disconnectDatabase();
  });

  it('should query database', async () => {
    // Test implementation
  });
});
```

---

## 🎭 Testing NestJS Services

### Example: TodoService

**Service Code:**
```typescript
// todo.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoRepository } from './todo.repository';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    
    return todo;
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todoRepository.create(createTodoDto);
  }
}
```

**Test Code:**
```typescript
// todo.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoRepository } from './todo.repository';

describe('TodoService', () => {
  let service: TodoService;
  let repository: jest.Mocked<TodoRepository>;

  // Setup before each test
  beforeEach(async () => {
    // Create mock repository
    const mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };

    // Create testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: TodoRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repository = module.get(TodoRepository);
  });

  // Test 1: Service should be defined
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test 2: findAll should return array of todos
  describe('findAll', () => {
    it('should return array of todos', async () => {
      const mockTodos = [
        { id: 1, title: 'Test Todo 1', completed: false },
        { id: 2, title: 'Test Todo 2', completed: true },
      ];

      repository.findAll.mockResolvedValue(mockTodos);

      const result = await service.findAll();

      expect(result).toEqual(mockTodos);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // Test 3: findOne success case
  describe('findOne', () => {
    it('should return a todo when found', async () => {
      const mockTodo = { id: 1, title: 'Test Todo', completed: false };
      repository.findById.mockResolvedValue(mockTodo);

      const result = await service.findOne(1);

      expect(result).toEqual(mockTodo);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });

    // Test 4: findOne error case
    it('should throw NotFoundException when todo not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Todo with ID 999 not found');
    });
  });

  // Test 5: create should call repository
  describe('create', () => {
    it('should create and return new todo', async () => {
      const createDto = { title: 'New Todo', completed: false };
      const createdTodo = { id: 3, ...createDto };

      repository.create.mockResolvedValue(createdTodo);

      const result = await service.create(createDto);

      expect(result).toEqual(createdTodo);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });
  });
});
```

---

## 🧠 Common Testing Patterns

### Pattern 1: Testing with Multiple Scenarios

```typescript
describe('calculateDiscount', () => {
  it.each([
    [100, 10, 90],      // price, discount%, expected
    [50, 20, 40],
    [200, 50, 100],
    [75, 0, 75],
  ])('should calculate %i with %i% discount = %i', (price, discount, expected) => {
    expect(calculateDiscount(price, discount)).toBe(expected);
  });
});
```

### Pattern 2: Testing Async Code

```typescript
describe('fetchUser', () => {
  it('should fetch user from API', async () => {
    const user = await fetchUser(1);
    expect(user).toHaveProperty('id', 1);
  });

  it('should handle errors', async () => {
    await expect(fetchUser(999)).rejects.toThrow('User not found');
  });
});
```

### Pattern 3: Testing with Spies

```typescript
describe('Logger', () => {
  it('should log message', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    logger.info('Test message');
    
    expect(consoleSpy).toHaveBeenCalledWith('[INFO]', 'Test message');
    
    consoleSpy.mockRestore(); // Clean up
  });
});
```

---

## ✅ Testing Checklist

Before writing tests, ask:
- [ ] What is the **expected behavior**?
- [ ] What are the **edge cases**? (null, undefined, empty, large numbers)
- [ ] What are the **error scenarios**?
- [ ] What **dependencies** need to be mocked?

---

## 📝 Summary

**Key Concepts:**
- **Unit Test** = Test satu function/method secara isolated
- **AAA Pattern** = Arrange, Act, Assert
- **Matchers** = `toBe`, `toEqual`, `toThrow`, etc.
- **Setup/Teardown** = `beforeEach`, `afterEach`, `beforeAll`, `afterAll`

**NestJS Testing:**
- Use `Test.createTestingModule()` to create test modules
- Mock dependencies dengan `useValue`
- Test services in isolation

**Best Practices:**
- ✅ Descriptive test names
- ✅ One concept per test
- ✅ Test both success and error cases
- ✅ Use AAA pattern
- ✅ Clean up after tests

---

## 🔗 Next Steps
- **Materi 04:** Jest Framework Deep Dive - Advanced mocking strategies
- **Materi 05:** Backend Testing Excellence - Testing controllers and business logic
