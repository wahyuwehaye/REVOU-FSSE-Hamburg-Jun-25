# Test Fixtures and Factories

## 🤔 What are Test Fixtures?

**Analogi:** 
- **Fixture** = Seperti template furniture IKEA (sudah ada structure)
- **Factory** = Pabrik furniture (bisa customize sesuai kebutuhan)

**Purpose:** Menghindari **duplicate test data setup** dan membuat tests lebih **readable**.

---

## 🏭 Factory Pattern

### Basic Factory

\`\`\`typescript
// test/factories/user.factory.ts
export class UserFactory {
  static create(overrides: Partial<User> = {}): User {
    return {
      id: 1,
      email: 'test@email.com',
      name: 'Test User',
      role: 'user',
      createdAt: new Date(),
      ...overrides,
    };
  }

  static createMany(count: number): User[] {
    return Array.from({ length: count }, (_, i) =>
      this.create({ id: i + 1, email: \`user\${i + 1}@email.com\` }),
    );
  }

  static createAdmin(): User {
    return this.create({ role: 'admin' });
  }
}
\`\`\`

### Usage in Tests

\`\`\`typescript
describe('UserService', () => {
  it('should find user by email', () => {
    const user = UserFactory.create({ email: 'john@email.com' });
    mockRepository.findOne.mockResolvedValue(user);

    const result = await service.findByEmail('john@email.com');

    expect(result).toEqual(user);
  });

  it('should list all users', () => {
    const users = UserFactory.createMany(10);
    mockRepository.find.mockResolvedValue(users);

    const result = await service.findAll();

    expect(result).toHaveLength(10);
  });
});
\`\`\`

---

## 📦 Fixture Pattern

### Database Fixtures

\`\`\`typescript
// test/fixtures/database.fixture.ts
export const seedUsers = async (repository: Repository<User>) => {
  return repository.save([
    { email: 'admin@email.com', role: 'admin' },
    { email: 'user1@email.com', role: 'user' },
    { email: 'user2@email.com', role: 'user' },
  ]);
};

export const seedTodos = async (
  repository: Repository<Todo>,
  userId: number,
) => {
  return repository.save([
    { title: 'Todo 1', userId, completed: false },
    { title: 'Todo 2', userId, completed: true },
  ]);
};
\`\`\`

### Usage in Integration Tests

\`\`\`typescript
describe('UserController (Integration)', () => {
  beforeEach(async () => {
    await seedUsers(userRepository);
  });

  it('should list all users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(response.body).toHaveLength(3);
  });
});
\`\`\`

---

## 🎨 Builder Pattern

\`\`\`typescript
// test/builders/user.builder.ts
export class UserBuilder {
  private user: Partial<User> = {
    email: 'test@email.com',
    name: 'Test User',
    role: 'user',
  };

  withEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  withName(name: string): this {
    this.user.name = name;
    return this;
  }

  asAdmin(): this {
    this.user.role = 'admin';
    return this;
  }

  build(): User {
    return this.user as User;
  }
}

// Usage
const user = new UserBuilder()
  .withEmail('john@email.com')
  .withName('John Doe')
  .asAdmin()
  .build();
\`\`\`

---

## 📝 Summary

**Test Data Patterns:**
- **Factory** = Quick creation with defaults
- **Fixture** = Pre-seeded database state
- **Builder** = Fluent API for complex objects

**Benefits:**
- ✅ DRY (Don't Repeat Yourself)
- ✅ Readable tests
- ✅ Easy to maintain
- ✅ Consistent test data

---

## 🔗 Next Steps
- **Materi 10:** Test Coverage and Quality
- **Materi 11:** Controller Testing
