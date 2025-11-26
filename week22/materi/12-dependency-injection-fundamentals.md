# Chapter 12: Dependency Injection Fundamentals

## 🎯 Apa itu Dependency Injection (DI)?

**Dependency Injection** adalah design pattern dimana sebuah class **tidak membuat** dependencies-nya sendiri, tetapi **menerima** dependencies dari luar (di-inject).

## 🤔 Masalah Tanpa DI

### ❌ Tight Coupling (Bad)

```typescript
// users.service.ts - Tanpa DI
export class UsersService {
  private database: Database;

  constructor() {
    // ❌ Service creates its own dependency!
    this.database = new Database({
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password123',
    });
  }

  async findAll() {
    return this.database.query('SELECT * FROM users');
  }
}
```

**Masalah:**
1. **Hard to test** - Tidak bisa mock database
2. **Hard to change** - Harus ubah code kalau ganti database
3. **Tight coupling** - Service tahu detail implementasi database
4. **Not flexible** - Config database hardcoded
5. **Hard to reuse** - Tidak bisa share database instance

### ✅ Dengan DI (Good)

```typescript
// users.service.ts - Dengan DI
import { Injectable } from '@nestjs/common';
import { Database } from './database';

@Injectable()
export class UsersService {
  // ✅ Dependency di-inject via constructor
  constructor(private readonly database: Database) {}

  async findAll() {
    return this.database.query('SELECT * FROM users');
  }
}
```

**Keuntungan:**
1. **Easy to test** - Bisa mock database
2. **Flexible** - Ganti implementation tanpa ubah service
3. **Loose coupling** - Service tidak tahu detail database
4. **Reusable** - Database instance bisa di-share
5. **Centralized config** - Config di satu tempat

## 🏗️ How DI Works in NestJS

### 1. Mark as Injectable

```typescript
@Injectable()
export class UsersService {
  // This class can be injected
}
```

### 2. Register in Module

```typescript
@Module({
  providers: [UsersService], // Register here
  controllers: [UsersController],
})
export class UsersModule {}
```

### 3. Inject in Constructor

```typescript
@Controller('users')
export class UsersController {
  // ✅ NestJS automatically injects UsersService
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
```

## 🎨 DI Container

NestJS memiliki **IoC (Inversion of Control) Container** yang:
1. **Creates** instances dari classes
2. **Manages** lifecycle (singleton, transient, etc.)
3. **Injects** dependencies automatically
4. **Resolves** dependency tree

```
DI CONTAINER
     │
     ├── UsersService (singleton)
     ├── PostsService (singleton)
     ├── AuthService (singleton)
     │     └─requires→ UsersService ✅
     │     └─requires→ JwtService ✅
     └── DatabaseService (singleton)
           └─used by→ UsersService ✅
           └─used by→ PostsService ✅
```

## 💉 Dependency Injection Patterns

### 1. Constructor Injection (Recommended)

```typescript
@Injectable()
export class UsersService {
  constructor(
    private readonly database: Database,
    private readonly logger: Logger,
    private readonly cache: Cache,
  ) {}
}
```

### 2. Property Injection (Not Recommended)

```typescript
@Injectable()
export class UsersService {
  @Inject()
  private database: Database;
  
  // ❌ Properties may be undefined during construction
}
```

### 3. Method Injection (Rare)

```typescript
@Injectable()
export class UsersService {
  doSomething(@Inject(Database) database: Database) {
    // database injected as method parameter
  }
}
```

## 🔄 Dependency Resolution

### Simple Dependency

```typescript
// 1. Define service
@Injectable()
export class UsersService {
  findAll() {
    return ['user1', 'user2'];
  }
}

// 2. Register in module
@Module({
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

// 3. Inject in controller
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}

// NestJS Resolution Process:
// 1. UsersController needs UsersService
// 2. Container looks for UsersService in providers
// 3. Container creates UsersService instance
// 4. Container injects UsersService into UsersController
```

### Nested Dependencies

```typescript
// DatabaseService - no dependencies
@Injectable()
export class DatabaseService {
  query(sql: string) {
    console.log('Querying:', sql);
  }
}

// UsersService - depends on DatabaseService
@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}
  
  findAll() {
    return this.db.query('SELECT * FROM users');
  }
}

// UsersController - depends on UsersService
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}

// Module
@Module({
  providers: [DatabaseService, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

// Resolution Process:
// 1. UsersController needs UsersService
// 2. UsersService needs DatabaseService
// 3. Container creates DatabaseService (no deps)
// 4. Container creates UsersService with DatabaseService
// 5. Container creates UsersController with UsersService
```

## 🎯 Circular Dependencies

### ⚠️ Problem

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  constructor(private readonly postsService: PostsService) {}
}

// posts.service.ts
@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}
}

// ❌ ERROR: Circular dependency!
// UsersService → PostsService → UsersService → ...
```

### ✅ Solution: forwardRef

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) {}
}

// posts.service.ts
@Injectable()
export class PostsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
}
```

### ✅ Better Solution: Refactor

```typescript
// Create shared service
@Injectable()
export class SharedDataService {
  getUserPosts(userId: number) {
    // Shared logic
  }
}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(private readonly sharedData: SharedDataService) {}
}

// posts.service.ts
@Injectable()
export class PostsService {
  constructor(private readonly sharedData: SharedDataService) {}
}
```

## 🧪 Testing with DI

### Without DI - Hard to Test

```typescript
// ❌ Hard to test
class UsersService {
  constructor() {
    this.database = new Database(); // Real database!
  }
  
  async findAll() {
    return this.database.query('SELECT * FROM users');
  }
}

// Test
it('should find users', async () => {
  const service = new UsersService();
  // ❌ Will hit real database!
  const users = await service.findAll();
});
```

### With DI - Easy to Test

```typescript
// ✅ Easy to test
@Injectable()
class UsersService {
  constructor(private readonly database: Database) {}
  
  async findAll() {
    return this.database.query('SELECT * FROM users');
  }
}

// Test
it('should find users', async () => {
  const mockDatabase = {
    query: jest.fn().mockResolvedValue([{ id: 1, name: 'John' }]),
  };
  
  const service = new UsersService(mockDatabase as any);
  const users = await service.findAll();
  
  expect(users).toEqual([{ id: 1, name: 'John' }]);
  expect(mockDatabase.query).toHaveBeenCalledWith('SELECT * FROM users');
});
```

## 🎨 Real-World Example

### Complete DI Setup

```typescript
// database.service.ts
@Injectable()
export class DatabaseService {
  constructor(@Inject('DATABASE_CONFIG') private config: any) {}
  
  query(sql: string) {
    console.log(`Connecting to ${this.config.host}:${this.config.port}`);
    // Execute query
  }
}

// logger.service.ts
@Injectable()
export class LoggerService {
  log(message: string) {
    console.log(`[LOG] ${message}`);
  }
}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    private readonly database: DatabaseService,
    private readonly logger: LoggerService,
  ) {}
  
  async findAll() {
    this.logger.log('Finding all users');
    return this.database.query('SELECT * FROM users');
  }
  
  async create(userData: any) {
    this.logger.log('Creating user');
    return this.database.query('INSERT INTO users ...');
  }
}

// users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  @Post()
  create(@Body() userData: any) {
    return this.usersService.create(userData);
  }
}

// users.module.ts
@Module({
  providers: [
    DatabaseService,
    LoggerService,
    UsersService,
    {
      provide: 'DATABASE_CONFIG',
      useValue: {
        host: 'localhost',
        port: 5432,
      },
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
```

## 💡 Benefits of DI

### 1. Testability

```typescript
// Easy to mock dependencies
const mockDb = { query: jest.fn() };
const service = new UsersService(mockDb);
```

### 2. Flexibility

```typescript
// Easy to swap implementations
@Module({
  providers: [
    {
      provide: Database,
      useClass: process.env.DB === 'mongo' ? MongoDatabase : PostgresDatabase,
    },
  ],
})
```

### 3. Reusability

```typescript
// Share instance across modules
@Module({
  providers: [LoggerService],
  exports: [LoggerService], // ✅ Other modules can use
})
```

### 4. Maintainability

```typescript
// Change dependency in one place
@Module({
  providers: [
    {
      provide: 'API_URL',
      useValue: 'https://api.example.com',
    },
  ],
})
```

## 📊 DI vs Manual Instantiation

| Aspect | Manual | DI |
|--------|--------|-----|
| **Creation** | `new Service()` | Automatic |
| **Lifecycle** | Manual management | Managed by container |
| **Testing** | Hard | Easy |
| **Coupling** | Tight | Loose |
| **Reusability** | Low | High |
| **Flexibility** | Low | High |

## 🎯 Best Practices

### ✅ DO:

```typescript
// 1. Use constructor injection
@Injectable()
export class UsersService {
  constructor(private readonly database: Database) {}
}

// 2. Mark injectable with @Injectable()
@Injectable()
export class MyService {}

// 3. Use private readonly for dependencies
constructor(private readonly service: MyService) {}

// 4. Register in module
@Module({
  providers: [MyService],
})
```

### ❌ DON'T:

```typescript
// 1. Don't create dependencies manually
constructor() {
  this.database = new Database(); // ❌
}

// 2. Don't use property injection
@Inject()
private service: MyService; // ❌ Prefer constructor

// 3. Don't forget @Injectable()
export class MyService {} // ❌ Missing @Injectable()

// 4. Don't forget to register
@Module({
  // providers: [MyService], // ❌ Forgot to register!
})
```

## 📊 Summary

**Dependency Injection** adalah:
- ✅ Pattern untuk inject dependencies dari luar
- ✅ Mengurangi coupling antar classes
- ✅ Membuat code lebih testable dan maintainable
- ✅ Dikelola otomatis oleh NestJS DI Container
- ✅ Menggunakan constructor injection (recommended)

---

**Next Chapter:** Providers in NestJS - Deep dive into provider types! 💉
