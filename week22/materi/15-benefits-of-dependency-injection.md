# Chapter 15: Benefits of Dependency Injection

## 🎯 Why Use Dependency Injection?

Dependency Injection memberikan banyak keuntungan dalam software development. Mari kita lihat satu per satu dengan contoh praktis.

## 1️⃣ Testability

### ❌ Without DI - Hard to Test

```typescript
// users.service.ts
export class UsersService {
  constructor() {
    // ❌ Creates real database connection
    this.database = new Database({
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password123',
    });
  }

  async findAll() {
    // ❌ Will hit real database!
    return this.database.query('SELECT * FROM users');
  }

  async create(userData: any) {
    // ❌ Will insert into real database!
    return this.database.query('INSERT INTO users VALUES ...');
  }
}

// users.service.spec.ts
describe('UsersService', () => {
  it('should find all users', async () => {
    const service = new UsersService();
    
    // ❌ Problems:
    // - Hits real database
    // - Need database running
    // - Tests are slow
    // - Tests affect each other
    // - Can't test error cases
    const users = await service.findAll();
    expect(users).toBeDefined();
  });
});
```

### ✅ With DI - Easy to Test

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  constructor(private database: Database) {}

  async findAll() {
    return this.database.query('SELECT * FROM users');
  }

  async create(userData: any) {
    return this.database.query('INSERT INTO users VALUES ...');
  }
}

// users.service.spec.ts
describe('UsersService', () => {
  let service: UsersService;
  let mockDatabase: any;

  beforeEach(() => {
    // ✅ Create mock database
    mockDatabase = {
      query: jest.fn(),
    };

    // ✅ Inject mock
    service = new UsersService(mockDatabase);
  });

  it('should find all users', async () => {
    // ✅ Setup mock response
    mockDatabase.query.mockResolvedValue([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ]);

    const users = await service.findAll();

    // ✅ Verify behavior
    expect(users).toHaveLength(2);
    expect(mockDatabase.query).toHaveBeenCalledWith('SELECT * FROM users');
  });

  it('should handle database errors', async () => {
    // ✅ Easy to test error cases
    mockDatabase.query.mockRejectedValue(new Error('Connection failed'));

    await expect(service.findAll()).rejects.toThrow('Connection failed');
  });

  it('should create user', async () => {
    mockDatabase.query.mockResolvedValue({ id: 3, name: 'Bob' });

    const user = await service.create({ name: 'Bob' });

    expect(user.name).toBe('Bob');
    expect(mockDatabase.query).toHaveBeenCalled();
  });
});
```

**Benefits:**
- ✅ No real database needed
- ✅ Tests run fast (no I/O)
- ✅ Tests are isolated
- ✅ Easy to test error cases
- ✅ Predictable results

## 2️⃣ Loose Coupling

### ❌ Tight Coupling

```typescript
// payment.service.ts - Tightly coupled to Stripe
export class PaymentService {
  processPayment(amount: number) {
    // ❌ Hardcoded to Stripe
    const stripe = new Stripe(process.env.STRIPE_KEY);
    return stripe.charges.create({
      amount: amount * 100,
      currency: 'usd',
    });
  }
}

// ❌ Problems:
// - Can't switch to PayPal
// - Can't test without Stripe key
// - Stripe logic mixed with business logic
```

### ✅ Loose Coupling with DI

```typescript
// payment.interface.ts
export interface PaymentProvider {
  processPayment(amount: number): Promise<any>;
}

// stripe.provider.ts
@Injectable()
export class StripeProvider implements PaymentProvider {
  async processPayment(amount: number) {
    const stripe = new Stripe(process.env.STRIPE_KEY);
    return stripe.charges.create({
      amount: amount * 100,
      currency: 'usd',
    });
  }
}

// paypal.provider.ts
@Injectable()
export class PaypalProvider implements PaymentProvider {
  async processPayment(amount: number) {
    const paypal = new PayPal(process.env.PAYPAL_KEY);
    return paypal.payment.create({
      amount: amount,
      currency: 'USD',
    });
  }
}

// payment.service.ts - Loosely coupled
@Injectable()
export class PaymentService {
  constructor(
    @Inject('PaymentProvider') 
    private provider: PaymentProvider,
  ) {}

  async processPayment(amount: number) {
    // ✅ Works with any provider!
    return this.provider.processPayment(amount);
  }
}

// app.module.ts - Easy to switch
@Module({
  providers: [
    PaymentService,
    {
      provide: 'PaymentProvider',
      // ✅ Change provider here only!
      useClass: process.env.PAYMENT === 'paypal' 
        ? PaypalProvider 
        : StripeProvider,
    },
  ],
})
export class AppModule {}
```

**Benefits:**
- ✅ Easy to switch implementations
- ✅ Business logic separated from implementation
- ✅ Can use multiple providers
- ✅ Easy to add new providers

## 3️⃣ Flexibility

### Example: Environment-based Configuration

```typescript
// logger.interface.ts
export interface Logger {
  log(message: string): void;
  error(message: string): void;
}

// console.logger.ts - Development
@Injectable()
export class ConsoleLogger implements Logger {
  log(message: string) {
    console.log(`[LOG] ${message}`);
  }

  error(message: string) {
    console.error(`[ERROR] ${message}`);
  }
}

// file.logger.ts - Production
@Injectable()
export class FileLogger implements Logger {
  private fs = require('fs');

  log(message: string) {
    this.fs.appendFileSync('app.log', `[LOG] ${message}\n`);
  }

  error(message: string) {
    this.fs.appendFileSync('error.log', `[ERROR] ${message}\n`);
  }
}

// cloudwatch.logger.ts - AWS Production
@Injectable()
export class CloudWatchLogger implements Logger {
  private cloudwatch = new AWS.CloudWatchLogs();

  async log(message: string) {
    await this.cloudwatch.putLogEvents({
      logGroupName: 'my-app',
      logStreamName: 'app-logs',
      logEvents: [{ message, timestamp: Date.now() }],
    });
  }

  async error(message: string) {
    await this.cloudwatch.putLogEvents({
      logGroupName: 'my-app',
      logStreamName: 'error-logs',
      logEvents: [{ message, timestamp: Date.now() }],
    });
  }
}

// app.module.ts - Dynamic logger selection
@Module({
  providers: [
    {
      provide: 'Logger',
      useClass: 
        process.env.NODE_ENV === 'production'
          ? process.env.PLATFORM === 'aws'
            ? CloudWatchLogger
            : FileLogger
          : ConsoleLogger,
    },
  ],
})
export class AppModule {}

// users.service.ts - Uses any logger
@Injectable()
export class UsersService {
  constructor(@Inject('Logger') private logger: Logger) {}

  findAll() {
    this.logger.log('Finding all users'); // ✅ Works with any logger!
    return [];
  }
}
```

**Benefits:**
- ✅ Different behavior per environment
- ✅ No code changes needed
- ✅ Easy to add new implementations

## 4️⃣ Reusability

### Shared Services

```typescript
// logger.service.ts - Shared utility
@Injectable()
export class LoggerService {
  log(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${context}] ${message}`);
  }
}

// logger.module.ts
@Global() // ✅ Available everywhere
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(private logger: LoggerService) {} // ✅ Reused instance

  findAll() {
    this.logger.log('Finding all users', 'UsersService');
    return [];
  }
}

// posts.service.ts
@Injectable()
export class PostsService {
  constructor(private logger: LoggerService) {} // ✅ Same instance!

  findAll() {
    this.logger.log('Finding all posts', 'PostsService');
    return [];
  }
}

// auth.service.ts
@Injectable()
export class AuthService {
  constructor(private logger: LoggerService) {} // ✅ Same instance!

  login(email: string) {
    this.logger.log(`User ${email} logged in`, 'AuthService');
  }
}
```

**Benefits:**
- ✅ Single instance shared (singleton)
- ✅ Consistent behavior across app
- ✅ Easy to maintain
- ✅ No duplication

## 5️⃣ Maintainability

### Centralized Configuration

```typescript
// database.config.ts
export const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'password',
};

// database.module.ts
@Module({
  providers: [
    {
      provide: 'DATABASE_CONFIG',
      useValue: databaseConfig, // ✅ Centralized config
    },
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}

// database.service.ts
@Injectable()
export class DatabaseService {
  constructor(@Inject('DATABASE_CONFIG') private config: any) {
    this.connection = createConnection(this.config);
  }

  query(sql: string) {
    return this.connection.query(sql);
  }
}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(private database: DatabaseService) {} // ✅ No config needed

  findAll() {
    return this.database.query('SELECT * FROM users');
  }
}

// posts.service.ts
@Injectable()
export class PostsService {
  constructor(private database: DatabaseService) {} // ✅ No config needed

  findAll() {
    return this.database.query('SELECT * FROM posts');
  }
}
```

**Benefits:**
- ✅ Config in one place
- ✅ Easy to change
- ✅ No duplication
- ✅ Consistent across services

## 6️⃣ Composability

### Building Complex Services

```typescript
// email.service.ts
@Injectable()
export class EmailService {
  sendEmail(to: string, subject: string, body: string) {
    console.log(`Sending email to ${to}: ${subject}`);
  }
}

// sms.service.ts
@Injectable()
export class SmsService {
  sendSms(phone: string, message: string) {
    console.log(`Sending SMS to ${phone}: ${message}`);
  }
}

// push.service.ts
@Injectable()
export class PushService {
  sendPush(userId: string, title: string, body: string) {
    console.log(`Sending push to ${userId}: ${title}`);
  }
}

// notification.service.ts - Composes multiple services
@Injectable()
export class NotificationService {
  constructor(
    private emailService: EmailService,
    private smsService: SmsService,
    private pushService: PushService,
  ) {}

  async notifyUser(userId: string, message: string) {
    // ✅ Uses all three services
    const user = await this.getUser(userId);
    
    await this.emailService.sendEmail(user.email, 'Notification', message);
    await this.smsService.sendSms(user.phone, message);
    await this.pushService.sendPush(userId, 'Notification', message);
  }

  async notifyEmail(email: string, subject: string, body: string) {
    // ✅ Uses only email service
    await this.emailService.sendEmail(email, subject, body);
  }
}

// orders.service.ts - Uses notification service
@Injectable()
export class OrdersService {
  constructor(
    private database: DatabaseService,
    private notificationService: NotificationService,
  ) {}

  async createOrder(userId: string, items: any[]) {
    const order = await this.database.query('INSERT INTO orders ...');
    
    // ✅ Easy to use composed service
    await this.notificationService.notifyUser(
      userId,
      `Order ${order.id} created successfully!`,
    );
    
    return order;
  }
}
```

**Benefits:**
- ✅ Build complex services from simple ones
- ✅ Each service has single responsibility
- ✅ Easy to test each part
- ✅ Easy to reuse in different combinations

## 7️⃣ Lifecycle Management

```typescript
// cache.service.ts
@Injectable()
export class CacheService {
  private cache = new Map();

  constructor() {
    console.log('CacheService initialized');
  }

  set(key: string, value: any) {
    this.cache.set(key, value);
  }

  get(key: string) {
    return this.cache.get(key);
  }

  onModuleDestroy() {
    // ✅ NestJS calls this automatically
    console.log('Clearing cache before shutdown');
    this.cache.clear();
  }
}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(private cache: CacheService) {}

  async findById(id: string) {
    // Check cache first
    const cached = this.cache.get(`user:${id}`);
    if (cached) return cached;

    // Fetch from database
    const user = await this.database.query(`SELECT * FROM users WHERE id = ${id}`);
    
    // Cache result
    this.cache.set(`user:${id}`, user);
    return user;
  }
}
```

**Benefits:**
- ✅ NestJS manages lifecycle
- ✅ Automatic initialization
- ✅ Proper cleanup
- ✅ Hooks for lifecycle events

## 📊 Comparison Table

| Without DI | With DI |
|-----------|---------|
| Hard to test | ✅ Easy to test with mocks |
| Tight coupling | ✅ Loose coupling |
| Hardcoded dependencies | ✅ Flexible dependencies |
| Duplicate code | ✅ Reusable services |
| Config everywhere | ✅ Centralized config |
| Manual management | ✅ Automatic lifecycle |
| Hard to change | ✅ Easy to maintain |

## 🎯 Real-World Example: E-commerce System

```typescript
// interfaces/payment.interface.ts
export interface PaymentProvider {
  charge(amount: number, token: string): Promise<any>;
}

// interfaces/shipping.interface.ts
export interface ShippingProvider {
  calculateShipping(weight: number, distance: number): number;
  createShipment(orderId: string): Promise<any>;
}

// providers/stripe.provider.ts
@Injectable()
export class StripeProvider implements PaymentProvider {
  async charge(amount: number, token: string) {
    // Stripe implementation
    return { success: true, transactionId: 'stripe-123' };
  }
}

// providers/fedex.provider.ts
@Injectable()
export class FedexProvider implements ShippingProvider {
  calculateShipping(weight: number, distance: number) {
    return weight * distance * 0.5;
  }

  async createShipment(orderId: string) {
    return { trackingNumber: 'FEDEX-123' };
  }
}

// services/orders.service.ts
@Injectable()
export class OrdersService {
  constructor(
    @Inject('PaymentProvider') private payment: PaymentProvider,
    @Inject('ShippingProvider') private shipping: ShippingProvider,
    private database: DatabaseService,
    private notification: NotificationService,
    private logger: LoggerService,
  ) {}

  async createOrder(userId: string, items: any[], paymentToken: string) {
    try {
      this.logger.log('Creating order', 'OrdersService');

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + item.price, 0);
      const shippingCost = this.shipping.calculateShipping(10, 100);
      const total = subtotal + shippingCost;

      // Process payment
      const payment = await this.payment.charge(total, paymentToken);
      if (!payment.success) {
        throw new Error('Payment failed');
      }

      // Create order in database
      const order = await this.database.query(
        'INSERT INTO orders (user_id, total, status) VALUES ...',
      );

      // Create shipment
      const shipment = await this.shipping.createShipment(order.id);

      // Send notifications
      await this.notification.notifyUser(
        userId,
        `Order ${order.id} created! Tracking: ${shipment.trackingNumber}`,
      );

      this.logger.log(`Order ${order.id} created successfully`, 'OrdersService');

      return {
        order,
        payment,
        shipment,
      };
    } catch (error) {
      this.logger.error(`Order creation failed: ${error.message}`, 'OrdersService');
      throw error;
    }
  }
}

// app.module.ts - Easy to configure
@Module({
  providers: [
    // Services
    OrdersService,
    DatabaseService,
    NotificationService,
    LoggerService,

    // Payment providers
    StripeProvider,
    PaypalProvider,
    {
      provide: 'PaymentProvider',
      useClass: process.env.PAYMENT === 'paypal' ? PaypalProvider : StripeProvider,
    },

    // Shipping providers
    FedexProvider,
    UpsProvider,
    {
      provide: 'ShippingProvider',
      useClass: process.env.SHIPPING === 'ups' ? UpsProvider : FedexProvider,
    },
  ],
})
export class AppModule {}
```

## 🎯 Summary

**Benefits of Dependency Injection:**

1. **Testability** - Easy to mock dependencies
2. **Loose Coupling** - Services independent from implementations
3. **Flexibility** - Easy to swap implementations
4. **Reusability** - Share services across modules
5. **Maintainability** - Centralized configuration
6. **Composability** - Build complex from simple services
7. **Lifecycle Management** - Automatic initialization & cleanup

**Key Takeaways:**
- ✅ Makes code testable
- ✅ Reduces coupling
- ✅ Increases flexibility
- ✅ Improves maintainability
- ✅ Enables reusability
- ✅ Simplifies composition

---

**Next Chapter:** What is Deployment - Preparing your NestJS app for production! 🚀
