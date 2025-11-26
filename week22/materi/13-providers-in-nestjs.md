# Chapter 13: Providers in NestJS

## 🎯 Apa itu Provider?

**Provider** adalah class yang bisa di-inject sebagai dependency. Dalam NestJS, hampir semua class adalah provider:
- Services
- Repositories
- Factories
- Helpers
- Dan lain-lain

## 🏷️ @Injectable() Decorator

Class harus di-mark dengan `@Injectable()` agar bisa menjadi provider:

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findAll() {
    return ['user1', 'user2'];
  }
}
```

**Kenapa perlu @Injectable()?**
- Memberitahu NestJS bahwa class ini bisa di-inject
- Memungkinkan NestJS mengelola lifecycle
- Memungkinkan dependency injection

## 📦 Provider Types

NestJS mendukung 5 jenis provider:

### 1. Class Provider (Standard)

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
  providers: [UsersService], // Shorthand
  // Same as:
  // providers: [
  //   {
  //     provide: UsersService,
  //     useClass: UsersService,
  //   }
  // ],
})
export class UsersModule {}
```

**Use when:** Standard service yang tidak perlu konfigurasi khusus

### 2. Value Provider

Inject value langsung (constants, configuration objects):

```typescript
// config.ts
export const DATABASE_CONFIG = {
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'password123',
};

// app.module.ts
@Module({
  providers: [
    {
      provide: 'DATABASE_CONFIG',
      useValue: DATABASE_CONFIG,
    },
  ],
})
export class AppModule {}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(@Inject('DATABASE_CONFIG') private config: any) {}
  
  getDbHost() {
    return this.config.host; // 'localhost'
  }
}
```

**Use when:** 
- Constants
- Configuration objects
- Mock values untuk testing

### 3. Class Provider dengan useClass

Inject class yang berbeda dari token:

```typescript
// logger.interface.ts
export interface Logger {
  log(message: string): void;
}

// console.logger.ts
@Injectable()
export class ConsoleLogger implements Logger {
  log(message: string) {
    console.log(`[CONSOLE] ${message}`);
  }
}

// file.logger.ts
@Injectable()
export class FileLogger implements Logger {
  log(message: string) {
    // Write to file
    console.log(`[FILE] ${message}`);
  }
}

// app.module.ts
@Module({
  providers: [
    {
      provide: 'Logger',
      useClass: process.env.NODE_ENV === 'production' 
        ? FileLogger 
        : ConsoleLogger,
    },
  ],
})
export class AppModule {}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(@Inject('Logger') private logger: Logger) {}
  
  findAll() {
    this.logger.log('Finding all users');
    return [];
  }
}
```

**Use when:**
- Conditional implementation based on environment
- Strategy pattern
- Multiple implementations of same interface

### 4. Factory Provider

Create provider menggunakan factory function:

```typescript
// database.factory.ts
export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (configService: ConfigService) => {
      const config = {
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
      };
      
      // Initialize database connection
      const connection = await createConnection(config);
      console.log('Database connected!');
      return connection;
    },
    inject: [ConfigService], // Dependencies for factory
  },
];

// database.module.ts
@Module({
  providers: [...databaseProviders],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @Inject('DATABASE_CONNECTION') 
    private connection: Connection,
  ) {}
  
  async findAll() {
    return this.connection.query('SELECT * FROM users');
  }
}
```

**Use when:**
- Async initialization
- Complex creation logic
- Need to inject other providers
- Dynamic configuration

### 5. Alias Provider (useExisting)

Create alias untuk existing provider:

```typescript
// logger.service.ts
@Injectable()
export class LoggerService {
  log(message: string) {
    console.log(message);
  }
}

// app.module.ts
@Module({
  providers: [
    LoggerService,
    {
      provide: 'Logger', // Alias
      useExisting: LoggerService, // Point to existing
    },
  ],
})
export class AppModule {}

// Usage - both inject same instance
@Injectable()
export class UsersService {
  constructor(
    private loggerService: LoggerService, // ✅
    @Inject('Logger') private logger: any, // ✅ Same instance
  ) {
    console.log(loggerService === logger); // true
  }
}
```

**Use when:**
- Multiple names for same provider
- Backward compatibility
- Share singleton instance

## 🎨 Provider Tokens

Provider bisa diidentifikasi dengan 3 jenis token:

### 1. Class Token (Type-safe)

```typescript
// ✅ Recommended - Type-safe
@Injectable()
export class UsersService {}

@Module({
  providers: [UsersService],
})
export class UsersModule {}

// Inject - No @Inject() needed
constructor(private usersService: UsersService) {}
```

### 2. String Token

```typescript
@Module({
  providers: [
    {
      provide: 'APP_NAME',
      useValue: 'My Application',
    },
  ],
})
export class AppModule {}

// Inject - Need @Inject()
constructor(@Inject('APP_NAME') private appName: string) {}
```

### 3. Symbol Token

```typescript
// constants.ts
export const DATABASE_CONNECTION = Symbol('DATABASE_CONNECTION');

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: () => createConnection(),
    },
  ],
})
export class DatabaseModule {}

// Inject
constructor(
  @Inject(DATABASE_CONNECTION) 
  private connection: Connection,
) {}
```

## 🔄 Provider Scope

### 1. DEFAULT (Singleton)

```typescript
@Injectable()
export class UsersService {
  private counter = 0;
  
  increment() {
    this.counter++;
    return this.counter;
  }
}

// Same instance shared everywhere
const service1 = app.get(UsersService);
const service2 = app.get(UsersService);
console.log(service1 === service2); // true
console.log(service1.increment()); // 1
console.log(service2.increment()); // 2 (shared state!)
```

### 2. REQUEST

New instance per HTTP request:

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  private requestId = Math.random();
  
  getRequestId() {
    return this.requestId;
  }
}

// Different instance per request
// Request 1: requestId = 0.123
// Request 2: requestId = 0.456
```

### 3. TRANSIENT

New instance every time injected:

```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {
  private instanceId = Math.random();
  
  getInstanceId() {
    return this.instanceId;
  }
}

// Different instance everywhere
const service1 = app.get(TransientService); // 0.123
const service2 = app.get(TransientService); // 0.456
```

## 🎯 Complete Example

### E-commerce System

```typescript
// interfaces/payment.interface.ts
export interface PaymentService {
  processPayment(amount: number): Promise<boolean>;
}

// services/stripe.service.ts
@Injectable()
export class StripeService implements PaymentService {
  async processPayment(amount: number) {
    console.log(`Processing $${amount} via Stripe`);
    return true;
  }
}

// services/paypal.service.ts
@Injectable()
export class PaypalService implements PaymentService {
  async processPayment(amount: number) {
    console.log(`Processing $${amount} via PayPal`);
    return true;
  }
}

// services/email.service.ts
@Injectable()
export class EmailService {
  sendOrderConfirmation(email: string, orderId: string) {
    console.log(`Sending confirmation to ${email} for order ${orderId}`);
  }
}

// services/logger.service.ts
@Injectable()
export class LoggerService {
  log(message: string) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }
}

// services/orders.service.ts
@Injectable()
export class OrdersService {
  constructor(
    @Inject('PaymentService') private paymentService: PaymentService,
    private emailService: EmailService,
    private logger: LoggerService,
  ) {}
  
  async createOrder(userId: string, amount: number, email: string) {
    this.logger.log(`Creating order for user ${userId}`);
    
    // Process payment
    const success = await this.paymentService.processPayment(amount);
    
    if (success) {
      const orderId = `ORDER-${Date.now()}`;
      this.emailService.sendOrderConfirmation(email, orderId);
      this.logger.log(`Order ${orderId} created successfully`);
      return { orderId, status: 'success' };
    }
    
    throw new Error('Payment failed');
  }
}

// orders.controller.ts
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}
  
  @Post()
  async create(@Body() body: any) {
    return this.ordersService.createOrder(
      body.userId,
      body.amount,
      body.email,
    );
  }
}

// orders.module.ts
@Module({
  providers: [
    // Standard providers
    EmailService,
    LoggerService,
    OrdersService,
    StripeService,
    PaypalService,
    
    // Factory provider - choose payment method
    {
      provide: 'PaymentService',
      useFactory: (configService: ConfigService) => {
        const method = configService.get('PAYMENT_METHOD');
        return method === 'stripe' ? new StripeService() : new PaypalService();
      },
      inject: [ConfigService],
    },
  ],
  controllers: [OrdersController],
})
export class OrdersModule {}
```

## 🧪 Testing Providers

```typescript
// users.service.spec.ts
describe('UsersService', () => {
  let service: UsersService;
  let mockDatabase: any;

  beforeEach(async () => {
    // Create mock
    mockDatabase = {
      query: jest.fn().mockResolvedValue([{ id: 1, name: 'John' }]),
    };

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'DATABASE_CONNECTION',
          useValue: mockDatabase, // ✅ Mock provider
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should find all users', async () => {
    const users = await service.findAll();
    
    expect(users).toEqual([{ id: 1, name: 'John' }]);
    expect(mockDatabase.query).toHaveBeenCalledWith('SELECT * FROM users');
  });
});
```

## 💡 Custom Provider Patterns

### 1. Configuration Provider

```typescript
export const ConfigProvider = {
  provide: 'CONFIG',
  useFactory: () => ({
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    apiKey: process.env.API_KEY || 'default-key',
    timeout: parseInt(process.env.TIMEOUT) || 5000,
  }),
};

@Module({
  providers: [ConfigProvider],
  exports: ['CONFIG'],
})
export class ConfigModule {}
```

### 2. Repository Provider

```typescript
export const UserRepositoryProvider = {
  provide: 'UserRepository',
  useFactory: (connection: Connection) => {
    return connection.getRepository(User);
  },
  inject: ['DATABASE_CONNECTION'],
};

@Module({
  providers: [UserRepositoryProvider],
  exports: ['UserRepository'],
})
export class UsersModule {}
```

### 3. Service with Options

```typescript
export interface CacheOptions {
  ttl: number;
  max: number;
}

export const CacheProvider = {
  provide: 'CacheService',
  useFactory: (options: CacheOptions) => {
    return new CacheService(options);
  },
  inject: ['CACHE_OPTIONS'],
};

@Module({
  providers: [
    {
      provide: 'CACHE_OPTIONS',
      useValue: { ttl: 3600, max: 100 },
    },
    CacheProvider,
  ],
})
export class CacheModule {}
```

## 📊 Provider Comparison

| Type | Use Case | Example |
|------|----------|---------|
| **Class** | Standard services | `UsersService` |
| **Value** | Constants, config | `{ apiKey: 'xxx' }` |
| **Factory** | Async, dynamic | Database connection |
| **useClass** | Strategy pattern | Logger implementations |
| **useExisting** | Aliases | Backward compatibility |

## 🎯 Best Practices

### ✅ DO:

```typescript
// 1. Use class tokens (type-safe)
@Module({
  providers: [UsersService],
})

// 2. Use factory for async
@Module({
  providers: [
    {
      provide: 'DB',
      useFactory: async () => await createConnection(),
    },
  ],
})

// 3. Export what other modules need
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})

// 4. Use interface for abstraction
@Injectable()
export class MyService implements ServiceInterface {}
```

### ❌ DON'T:

```typescript
// 1. Don't forget @Injectable()
export class MyService {} // ❌

// 2. Don't use global state
@Injectable()
export class MyService {
  static data = []; // ❌ Use instance properties
}

// 3. Don't register twice
@Module({
  providers: [UsersService, UsersService], // ❌
})

// 4. Don't mix concerns
@Injectable()
export class UsersService {
  sendEmail() {} // ❌ Should be in EmailService
}
```

## 📊 Summary

**Providers** dalam NestJS:
- ✅ Class yang bisa di-inject dengan `@Injectable()`
- ✅ 5 types: Class, Value, Factory, useClass, useExisting
- ✅ Dikelola oleh DI Container
- ✅ Default adalah singleton scope
- ✅ Bisa di-test dengan mock/stub
- ✅ Mendukung async initialization

---

**Next Chapter:** Provider Registration - Module system, imports/exports! 📦
