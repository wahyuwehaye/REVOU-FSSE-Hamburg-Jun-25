# Database Testing Strategies

## 🤔 Apa itu Database Testing?

**Analogi Sederhana:**
- **Unit Test** 🧪 = Test komponen individual (tanpa database)
- **Database Test** 💾 = Test interaksi dengan database (real or fake)

**Database Testing** = Memastikan **data access layer** bekerja dengan benar (CRUD operations, queries, relationships).

---

## 🎯 Repository Layer Testing

### What is Repository Pattern?

Repository = Layer yang handle semua **database operations**.

```
Controller → Service → Repository → Database
                ↑
         (Business Logic)
```

**Benefits:**
- ✅ Separation of concerns
- ✅ Easy to mock in tests
- ✅ Swappable data source

---

## 🧪 Testing with In-Memory Database

### Setup In-Memory SQLite

```typescript
// test/test-database.module.ts
@Module({})
export class TestDatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: TestDatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:', // In-memory database
          entities: [User, Todo],
          synchronize: true,
          dropSchema: true,
        }),
      ],
    };
  }
}
```

### Repository Test Example

```typescript
// user.repository.spec.ts
describe('UserRepository (Integration)', () => {
  let repository: Repository<User>;
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TestDatabaseModule.forRoot(),
        TypeOrmModule.forFeature([User]),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    repository = module.get('UserRepository');
  });

  afterEach(async () => {
    await repository.clear(); // Clean database after each test
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a user', async () => {
    const user = repository.create({
      email: 'test@email.com',
      name: 'Test User',
    });

    const saved = await repository.save(user);

    expect(saved.id).toBeDefined();
    expect(saved.email).toBe('test@email.com');
  });

  it('should find user by email', async () => {
    await repository.save({
      email: 'john@email.com',
      name: 'John',
    });

    const found = await repository.findOne({
      where: { email: 'john@email.com' },
    });

    expect(found).toBeDefined();
    expect(found.name).toBe('John');
  });

  it('should return null when user not found', async () => {
    const found = await repository.findOne({
      where: { email: 'nonexistent@email.com' },
    });

    expect(found).toBeNull();
  });

  it('should update user', async () => {
    const user = await repository.save({
      email: 'test@email.com',
      name: 'Original Name',
    });

    user.name = 'Updated Name';
    await repository.save(user);

    const updated = await repository.findOne({ where: { id: user.id } });
    expect(updated.name).toBe('Updated Name');
  });

  it('should delete user', async () => {
    const user = await repository.save({
      email: 'test@email.com',
      name: 'Test',
    });

    await repository.delete(user.id);

    const found = await repository.findOne({ where: { id: user.id } });
    expect(found).toBeNull();
  });
});
```

---

## 🔗 Testing Relationships

### One-to-Many Relationship Test

```typescript
describe('User-Todo Relationship', () => {
  let userRepo: Repository<User>;
  let todoRepo: Repository<Todo>;

  beforeEach(async () => {
    // Setup repositories
  });

  it('should load user with todos', async () => {
    const user = await userRepo.save({
      email: 'test@email.com',
      name: 'Test User',
    });

    await todoRepo.save([
      { title: 'Todo 1', userId: user.id },
      { title: 'Todo 2', userId: user.id },
    ]);

    const userWithTodos = await userRepo.findOne({
      where: { id: user.id },
      relations: ['todos'],
    });

    expect(userWithTodos.todos).toHaveLength(2);
  });

  it('should cascade delete todos when user is deleted', async () => {
    const user = await userRepo.save({
      email: 'test@email.com',
      name: 'Test User',
    });

    await todoRepo.save({
      title: 'Todo 1',
      userId: user.id,
    });

    await userRepo.delete(user.id);

    const todos = await todoRepo.find({ where: { userId: user.id } });
    expect(todos).toHaveLength(0);
  });
});
```

---

## 🧠 Test Data Isolation

### Pattern 1: Clean Database After Each Test

```typescript
afterEach(async () => {
  await repository.clear();
});
```

### Pattern 2: Use Transactions (Rollback)

```typescript
describe('UserService', () => {
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  it('should create user', async () => {
    // Test code - changes will be rolled back
  });
});
```

### Pattern 3: Test Fixtures

```typescript
// test/fixtures/user.fixture.ts
export const createTestUser = (overrides = {}) => {
  return {
    email: 'test@email.com',
    name: 'Test User',
    password: 'hashedPassword',
    ...overrides,
  };
};

// Usage in tests
it('should create user', async () => {
  const userData = createTestUser({ email: 'custom@email.com' });
  const user = await repository.save(userData);
  expect(user.email).toBe('custom@email.com');
});
```

---

## 🎯 Testing Query Performance

```typescript
describe('User Query Performance', () => {
  beforeEach(async () => {
    // Seed 1000 users
    const users = Array.from({ length: 1000 }, (_, i) => ({
      email: `user${i}@email.com`,
      name: `User ${i}`,
    }));
    await repository.save(users);
  });

  it('should find users efficiently with pagination', async () => {
    const startTime = Date.now();

    const users = await repository.find({
      take: 10,
      skip: 0,
      order: { createdAt: 'DESC' },
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(users).toHaveLength(10);
    expect(duration).toBeLessThan(100); // Should complete in < 100ms
  });
});
```

---

## 📝 Summary

**Database Testing:**
- 💾 Test repository layer with real or in-memory database
- 🔗 Test relationships (One-to-Many, Many-to-Many)
- 🧪 Use test isolation (clear DB, transactions, fixtures)
- ⚡ Test query performance

**Best Practices:**
- ✅ Use in-memory database for fast tests
- ✅ Clean database after each test
- ✅ Test CRUD operations
- ✅ Test edge cases (null, duplicates, constraints)
- ❌ Don't test ORM framework itself

---

## 🔗 Next Steps
- **Materi 08:** Testing Async Operations
- **Materi 09:** Test Fixtures and Factories
