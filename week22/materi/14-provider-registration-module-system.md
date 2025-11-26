# Chapter 14: Provider Registration & Module System

## 🎯 NestJS Module System

**Module** adalah class yang di-decorate dengan `@Module()`. Setiap aplikasi NestJS memiliki minimal 1 module (root module).

```
APP MODULE (Root)
     │
     ├── UsersModule
     │     ├── UsersController
     │     ├── UsersService
     │     └── DatabaseService
     │
     ├── PostsModule
     │     ├── PostsController
     │     └── PostsService
     │
     └── AuthModule
           ├── AuthController
           ├── AuthService
           └── JwtService
```

## 📦 @Module() Decorator

```typescript
@Module({
  imports: [],      // Modules to import
  controllers: [],  // Controllers in this module
  providers: [],    // Providers in this module
  exports: [],      // Providers to export
})
export class UsersModule {}
```

## 🔧 Registering Providers

### 1. Basic Registration

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  findAll() {
    return ['user1', 'user2'];
  }
}

// users.module.ts
@Module({
  providers: [UsersService], // Register here
  controllers: [UsersController],
})
export class UsersModule {}
```

### 2. Custom Provider Registration

```typescript
@Module({
  providers: [
    // Standard
    UsersService,
    
    // Value provider
    {
      provide: 'APP_NAME',
      useValue: 'My Application',
    },
    
    // Factory provider
    {
      provide: 'DATABASE',
      useFactory: () => createConnection(),
    },
    
    // Class provider
    {
      provide: 'Logger',
      useClass: ConsoleLogger,
    },
  ],
})
export class UsersModule {}
```

## 🔄 Imports & Exports

### Sharing Providers Between Modules

#### Step 1: Export from Provider Module

```typescript
// logger.service.ts
@Injectable()
export class LoggerService {
  log(message: string) {
    console.log(`[LOG] ${message}`);
  }
}

// logger.module.ts
@Module({
  providers: [LoggerService],
  exports: [LoggerService], // ✅ Export to make available to other modules
})
export class LoggerModule {}
```

#### Step 2: Import in Consumer Module

```typescript
// users.module.ts
@Module({
  imports: [LoggerModule], // ✅ Import LoggerModule
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(private logger: LoggerService) {} // ✅ Can now inject
  
  findAll() {
    this.logger.log('Finding all users');
    return ['user1', 'user2'];
  }
}
```

### ❌ Without Export/Import

```typescript
// logger.module.ts
@Module({
  providers: [LoggerService],
  // ❌ Not exported
})
export class LoggerModule {}

// users.module.ts
@Module({
  imports: [LoggerModule],
  providers: [UsersService],
})
export class UsersModule {}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(private logger: LoggerService) {} // ❌ ERROR!
  // Nest can't find LoggerService
}
```

## 🌍 Global Modules

Module yang di-mark `@Global()` available di semua modules tanpa import:

```typescript
// logger.module.ts
@Global() // ✅ Make global
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}

// app.module.ts
@Module({
  imports: [
    LoggerModule, // Register once
    UsersModule,
    PostsModule,
  ],
})
export class AppModule {}

// users.module.ts
@Module({
  // ❌ No need to import LoggerModule!
  providers: [UsersService],
})
export class UsersModule {}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(private logger: LoggerService) {} // ✅ Works!
}
```

**⚠️ Use sparingly:** Hanya untuk utilities yang benar-benar global (Logger, Config, Database).

## 📚 Re-exporting Modules

Module bisa re-export modules lain:

```typescript
// database.module.ts
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}

// logger.module.ts
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}

// common.module.ts - Re-export multiple modules
@Module({
  imports: [DatabaseModule, LoggerModule],
  exports: [DatabaseModule, LoggerModule], // ✅ Re-export
})
export class CommonModule {}

// users.module.ts
@Module({
  imports: [CommonModule], // ✅ Get both Database & Logger
  providers: [UsersService],
})
export class UsersModule {}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    private database: DatabaseService, // ✅ Available
    private logger: LoggerService,     // ✅ Available
  ) {}
}
```

## 🎨 Dynamic Modules

Module yang bisa dikonfigurasi saat runtime:

### Basic Dynamic Module

```typescript
// database.module.ts
@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useValue: options,
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }
}

// app.module.ts
@Module({
  imports: [
    DatabaseModule.forRoot({
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password123',
    }),
  ],
})
export class AppModule {}
```

### Advanced: forRoot() and forRootAsync()

```typescript
// config.module.ts
@Module({})
export class ConfigModule {
  // Sync configuration
  static forRoot(options: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
      global: true, // Make globally available
    };
  }

  // Async configuration
  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<ConfigOptions>;
    inject?: any[];
  }): DynamicModule {
    return {
      module: ConfigModule,
      imports: options.imports || [],
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        ConfigService,
      ],
      exports: [ConfigService],
      global: true,
    };
  }
}

// Usage: forRoot (sync)
@Module({
  imports: [
    ConfigModule.forRoot({
      apiKey: 'xxx',
      apiUrl: 'https://api.example.com',
    }),
  ],
})
export class AppModule {}

// Usage: forRootAsync (async)
@Module({
  imports: [
    ConfigModule.forRootAsync({
      useFactory: async (envService: EnvService) => {
        return {
          apiKey: await envService.get('API_KEY'),
          apiUrl: await envService.get('API_URL'),
        };
      },
      inject: [EnvService],
    }),
  ],
})
export class AppModule {}
```

## 🎯 Real-World Example: Multi-Module Application

### 1. Shared Module

```typescript
// shared/logger.service.ts
@Injectable()
export class LoggerService {
  log(message: string, context?: string) {
    console.log(`[${context || 'APP'}] ${message}`);
  }
}

// shared/shared.module.ts
@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class SharedModule {}
```

### 2. Database Module

```typescript
// database/database.service.ts
@Injectable()
export class DatabaseService {
  constructor(
    @Inject('DATABASE_OPTIONS') private options: DatabaseOptions,
    private logger: LoggerService,
  ) {}
  
  async connect() {
    this.logger.log(`Connecting to ${this.options.host}`, 'Database');
    // Connection logic
  }
  
  query(sql: string) {
    this.logger.log(`Executing: ${sql}`, 'Database');
    // Query logic
  }
}

// database/database.module.ts
@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useValue: options,
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }
}
```

### 3. Users Module

```typescript
// users/users.service.ts
@Injectable()
export class UsersService {
  constructor(
    private database: DatabaseService,
    private logger: LoggerService,
  ) {}
  
  async findAll() {
    this.logger.log('Finding all users', 'UsersService');
    return this.database.query('SELECT * FROM users');
  }
  
  async create(userData: any) {
    this.logger.log('Creating user', 'UsersService');
    return this.database.query('INSERT INTO users ...');
  }
}

// users/users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  @Post()
  create(@Body() userData: any) {
    return this.usersService.create(userData);
  }
}

// users/users.module.ts
@Module({
  imports: [DatabaseModule], // Import to use DatabaseService
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Export for other modules
})
export class UsersModule {}
```

### 4. Posts Module

```typescript
// posts/posts.service.ts
@Injectable()
export class PostsService {
  constructor(
    private database: DatabaseService,
    private logger: LoggerService,
    private usersService: UsersService, // Use exported UsersService
  ) {}
  
  async findAll() {
    this.logger.log('Finding all posts', 'PostsService');
    return this.database.query('SELECT * FROM posts');
  }
  
  async findWithAuthor(postId: number) {
    const post = await this.database.query(`SELECT * FROM posts WHERE id = ${postId}`);
    const author = await this.usersService.findById(post.authorId);
    return { ...post, author };
  }
}

// posts/posts.module.ts
@Module({
  imports: [
    DatabaseModule,
    UsersModule, // Import to use UsersService
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
```

### 5. App Module (Root)

```typescript
// app.module.ts
@Module({
  imports: [
    // Global module (registered once)
    SharedModule,
    
    // Dynamic module with config
    DatabaseModule.forRoot({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'admin',
      password: process.env.DB_PASSWORD || 'password',
    }),
    
    // Feature modules
    UsersModule,
    PostsModule,
  ],
})
export class AppModule {}
```

## 🔄 Module Dependency Graph

```
AppModule
  │
  ├── SharedModule (@Global)
  │     └── LoggerService (exported)
  │
  ├── DatabaseModule (dynamic)
  │     └── DatabaseService (exported)
  │
  ├── UsersModule
  │     ├── imports: [DatabaseModule]
  │     ├── UsersService (exported)
  │     └── UsersController
  │
  └── PostsModule
        ├── imports: [DatabaseModule, UsersModule]
        ├── PostsService
        └── PostsController
```

## 🧪 Testing Module Registration

```typescript
// users.module.spec.ts
describe('UsersModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        // Mock DatabaseModule
        {
          module: DatabaseModule,
          providers: [
            {
              provide: DatabaseService,
              useValue: {
                query: jest.fn(),
              },
            },
          ],
          exports: [DatabaseService],
        },
        UsersModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have UsersService', () => {
    const service = module.get<UsersService>(UsersService);
    expect(service).toBeDefined();
  });

  it('should inject DatabaseService', () => {
    const service = module.get<UsersService>(UsersService);
    expect(service['database']).toBeDefined();
  });
});
```

## 📊 Module Organization Best Practices

### ✅ Good Structure

```
src/
├── app.module.ts
├── main.ts
├── shared/                 # Global utilities
│   ├── shared.module.ts
│   ├── logger.service.ts
│   └── config.service.ts
├── database/              # Database module
│   ├── database.module.ts
│   └── database.service.ts
├── users/                 # Feature module
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
└── posts/                 # Feature module
    ├── posts.module.ts
    ├── posts.controller.ts
    ├── posts.service.ts
    └── dto/
```

### ❌ Bad Structure

```
src/
├── app.module.ts
├── main.ts
├── services/              # ❌ All services together
│   ├── users.service.ts
│   ├── posts.service.ts
│   └── database.service.ts
├── controllers/           # ❌ All controllers together
│   ├── users.controller.ts
│   └── posts.controller.ts
└── dto/                   # ❌ All DTOs together
```

## 🎯 Best Practices

### ✅ DO:

```typescript
// 1. One module per feature
@Module({
  // Users feature
})
export class UsersModule {}

// 2. Export only what's needed
@Module({
  providers: [UsersService, InternalHelper],
  exports: [UsersService], // Only export public API
})

// 3. Use @Global() sparingly
@Global()
@Module({}) // Only for truly global utilities
export class LoggerModule {}

// 4. Use dynamic modules for config
DatabaseModule.forRoot(options)
```

### ❌ DON'T:

```typescript
// 1. Don't make everything global
@Global() // ❌ Don't do this for every module
@Module({})
export class UsersModule {}

// 2. Don't forget to export
@Module({
  providers: [UsersService],
  // ❌ Forgot to export!
})

// 3. Don't create circular dependencies
// UsersModule → PostsModule → UsersModule ❌

// 4. Don't put everything in one module
@Module({
  providers: [
    UsersService,
    PostsService,
    AuthService,
    // ... ❌ Too many responsibilities
  ],
})
```

## 📊 Summary

**Module System** di NestJS:
- ✅ Organize code by features
- ✅ Use imports/exports untuk sharing providers
- ✅ @Global() untuk utilities yang truly global
- ✅ Dynamic modules untuk runtime configuration
- ✅ Re-export modules untuk convenience
- ✅ Test module registration dengan TestingModule

---

**Next Chapter:** Benefits of Dependency Injection - Testability, flexibility, and more! 💡
