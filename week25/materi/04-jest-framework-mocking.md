# Jest Framework dan Mocking Strategies

## 🤔 Apa itu Mocking?

**Analogi Sederhana:**
Bayangkan kamu lagi shooting film action:
- **Real stunt** 🔥 = Aktor beneran loncat dari gedung (berbahaya!)
- **Mock/Stunt double** 🎬 = Pakai boneka atau CGI (aman, controlled)

**Mocking** = Bikin **fake version** dari dependencies supaya tests:
- ✅ Cepat (no database, no network)
- ✅ Reliable (no external failures)
- ✅ Isolated (test only your code)

---

## 🎯 Kenapa Perlu Mocking?

### Scenario 1: Testing tanpa Mock (❌ Bad)

```typescript
class PaymentService {
  async processPayment(amount: number) {
    // Real Stripe API call!
    const result = await stripe.charges.create({
      amount: amount * 100,
      currency: 'usd',
    });
    return result;
  }
}

// Test
it('should process payment', async () => {
  const service = new PaymentService();
  const result = await service.processPayment(100);
  // 😱 This test will:
  // - Actually charge $100 to real credit card
  // - Depend on internet connection
  // - Be slow (network latency)
  // - Fail if Stripe is down
  expect(result.status).toBe('succeeded');
});
```

### Scenario 2: Testing dengan Mock (✅ Good)

```typescript
// Mock Stripe API
const mockStripe = {
  charges: {
    create: jest.fn().mockResolvedValue({
      id: 'ch_123',
      status: 'succeeded',
      amount: 10000,
    }),
  },
};

it('should process payment', async () => {
  const service = new PaymentService(mockStripe);
  const result = await service.processPayment(100);
  
  // 😎 This test:
  // - Runs in milliseconds
  // - Never hits real API
  // - Always reliable
  // - Fully controlled
  expect(result.status).toBe('succeeded');
  expect(mockStripe.charges.create).toHaveBeenCalledWith({
    amount: 10000,
    currency: 'usd',
  });
});
```

---

## 🧪 Types of Test Doubles

### 1. Mock 🎭
Fake object yang **tracks calls** (how many times, with what arguments).

```typescript
const mockEmailService = {
  sendEmail: jest.fn(), // Mock function
};

mockEmailService.sendEmail('test@email.com', 'Hello');

// Verify mock was called
expect(mockEmailService.sendEmail).toHaveBeenCalledWith('test@email.com', 'Hello');
expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1);
```

### 2. Stub 📝
Fake object dengan **predefined responses**.

```typescript
const stubUserRepository = {
  findById: jest.fn().mockResolvedValue({
    id: 1,
    name: 'John Doe',
    email: 'john@email.com',
  }),
};

// Always returns the same user
const user = await stubUserRepository.findById(1);
expect(user.name).toBe('John Doe');
```

### 3. Spy 🕵️
Real object tapi bisa **track calls** (untuk verify).

```typescript
const realService = new EmailService();
const spy = jest.spyOn(realService, 'sendEmail');

realService.sendEmail('test@email.com', 'Hello');

// Verify the real method was called
expect(spy).toHaveBeenCalledWith('test@email.com', 'Hello');

spy.mockRestore(); // Restore original implementation
```

### 4. Fake 🎨
Working implementation tapi **simplified** (e.g., in-memory database).

```typescript
class FakeDatabase {
  private data: any[] = [];

  save(item: any) {
    this.data.push(item);
  }

  findAll() {
    return this.data;
  }
}

// Real database behavior, but in-memory
const fakeDb = new FakeDatabase();
fakeDb.save({ id: 1, name: 'Test' });
expect(fakeDb.findAll()).toHaveLength(1);
```

---

## 🎬 Jest Mock Functions

### Creating Mock Functions

```typescript
// 1. Simple mock
const mockFn = jest.fn();

// 2. Mock with return value
const mockFn = jest.fn().mockReturnValue(42);

// 3. Mock with resolved Promise
const mockFn = jest.fn().mockResolvedValue({ id: 1, name: 'John' });

// 4. Mock with rejected Promise
const mockFn = jest.fn().mockRejectedValue(new Error('Failed'));

// 5. Mock with different implementations
const mockFn = jest.fn()
  .mockReturnValueOnce(1)   // First call returns 1
  .mockReturnValueOnce(2)   // Second call returns 2
  .mockReturnValue(3);      // Subsequent calls return 3
```

### Mock Assertions

```typescript
const mockFn = jest.fn();

mockFn('hello', 42);
mockFn('world', 100);

// Was called?
expect(mockFn).toHaveBeenCalled();

// How many times?
expect(mockFn).toHaveBeenCalledTimes(2);

// With specific arguments?
expect(mockFn).toHaveBeenCalledWith('hello', 42);
expect(mockFn).toHaveBeenLastCalledWith('world', 100);

// With arguments matching pattern?
expect(mockFn).toHaveBeenCalledWith(
  expect.any(String),  // Any string
  expect.any(Number),  // Any number
);
```

---

## 🏗️ Mocking in NestJS

### Pattern 1: Mock Repository

```typescript
describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    // Create mock repository
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;

    // Create testing module with mock
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockRepository, // Inject mock instead of real repo
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should find all users', async () => {
    const mockUsers = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ];
    
    mockRepository.find.mockResolvedValue(mockUsers);

    const result = await service.findAll();

    expect(result).toEqual(mockUsers);
    expect(mockRepository.find).toHaveBeenCalledTimes(1);
  });
});
```

### Pattern 2: Mock External Service

```typescript
describe('OrderService', () => {
  let service: OrderService;
  let mockPaymentService: jest.Mocked<PaymentService>;

  beforeEach(async () => {
    mockPaymentService = {
      charge: jest.fn(),
      refund: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should process order and charge payment', async () => {
    mockPaymentService.charge.mockResolvedValue({
      id: 'payment_123',
      status: 'succeeded',
    });

    const order = await service.createOrder({
      items: [{ id: 1, price: 100 }],
      customerId: 1,
    });

    expect(order.status).toBe('confirmed');
    expect(mockPaymentService.charge).toHaveBeenCalledWith({
      amount: 100,
      customerId: 1,
    });
  });

  it('should handle payment failure', async () => {
    mockPaymentService.charge.mockRejectedValue(
      new Error('Insufficient funds'),
    );

    await expect(
      service.createOrder({
        items: [{ id: 1, price: 100 }],
        customerId: 1,
      }),
    ).rejects.toThrow('Payment failed');
  });
});
```

### Pattern 3: Mock HTTP Calls

```typescript
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';

describe('WeatherService', () => {
  let service: WeatherService;
  let mockHttpService: jest.Mocked<HttpService>;

  beforeEach(async () => {
    mockHttpService = {
      get: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  it('should fetch weather data', async () => {
    const mockResponse = {
      data: {
        temperature: 25,
        condition: 'sunny',
      },
    };

    mockHttpService.get.mockReturnValue(of(mockResponse) as any);

    const result = await service.getWeather('Jakarta');

    expect(result.temperature).toBe(25);
    expect(mockHttpService.get).toHaveBeenCalledWith(
      expect.stringContaining('Jakarta'),
    );
  });
});
```

---

## 🎯 Advanced Mocking Techniques

### Partial Mocks

```typescript
// Mock only specific methods, keep rest real
const realService = new UserService();
jest.spyOn(realService, 'sendEmail').mockResolvedValue(true);

// sendEmail is mocked, but other methods are real
await realService.sendEmail('test@email.com'); // Mocked
const user = await realService.findUser(1);     // Real method
```

### Mock Modules

```typescript
// Mock entire module
jest.mock('./email.service', () => ({
  EmailService: jest.fn().mockImplementation(() => ({
    sendEmail: jest.fn().mockResolvedValue(true),
  })),
}));

// Mock specific exports
jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({ data: 'mocked' }),
}));
```

### Mock Timers

```typescript
describe('Delayed operations', () => {
  beforeEach(() => {
    jest.useFakeTimers(); // Use fake timers
  });

  afterEach(() => {
    jest.useRealTimers(); // Restore real timers
  });

  it('should execute after delay', () => {
    const callback = jest.fn();

    setTimeout(callback, 1000);

    // Fast-forward time by 1000ms
    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🧠 Best Practices for Mocking

### ✅ DO:

1. **Mock external dependencies**
   ```typescript
   // ✅ Mock database, API, file system
   mockRepository.find = jest.fn();
   ```

2. **Use meaningful mock data**
   ```typescript
   // ✅ Realistic test data
   const mockUser = {
     id: 1,
     email: 'john@example.com',
     name: 'John Doe',
   };
   ```

3. **Verify mock calls**
   ```typescript
   // ✅ Assert that methods were called correctly
   expect(mockService.send).toHaveBeenCalledWith(expectedData);
   ```

4. **Clear mocks between tests**
   ```typescript
   afterEach(() => {
     jest.clearAllMocks();
   });
   ```

### ❌ DON'T:

1. **Don't mock everything**
   ```typescript
   // ❌ Over-mocking = testing nothing
   const mockService = {
     calculate: jest.fn().mockReturnValue(42),
   };
   expect(mockService.calculate()).toBe(42); // Duh, of course!
   ```

2. **Don't mock what you're testing**
   ```typescript
   // ❌ Bad: Mocking the subject under test
   const mockUserService = { findUser: jest.fn() };
   // How are you testing UserService if it's mocked?
   ```

3. **Don't create brittle tests**
   ```typescript
   // ❌ Too specific - will break easily
   expect(mockFn).toHaveBeenCalledWith(
     'exact string',
     42,
     { exact: 'object' },
   );

   // ✅ Better - use matchers
   expect(mockFn).toHaveBeenCalledWith(
     expect.any(String),
     expect.any(Number),
     expect.objectContaining({ exact: 'object' }),
   );
   ```

---

## 📊 Mocking Decision Tree

```
Need to test a component?
│
├─ Does it have dependencies?
│  │
│  ├─ YES → Mock them!
│  │  │
│  │  ├─ External API/Database? → Mock 100%
│  │  ├─ Internal service? → Mock it
│  │  └─ Simple utility? → Consider using real one
│  │
│  └─ NO → No mocking needed
│
└─ Is the test slow?
   │
   ├─ YES → Mock slow operations
   └─ NO → Keep it as is
```

---

## 📝 Summary

**Key Concepts:**
- **Mock** = Fake object that tracks calls
- **Stub** = Fake object with predefined responses
- **Spy** = Real object with call tracking
- **Fake** = Simplified working implementation

**Jest Mock Functions:**
- `jest.fn()` - Create mock function
- `mockReturnValue()` - Return specific value
- `mockResolvedValue()` - Return Promise
- `toHaveBeenCalled()` - Verify calls

**Best Practices:**
- ✅ Mock external dependencies
- ✅ Use meaningful test data
- ✅ Verify mock interactions
- ✅ Clear mocks between tests
- ❌ Don't over-mock
- ❌ Don't mock what you're testing

---

## 🔗 Next Steps
- **Materi 05:** Backend Testing Excellence - Testing business logic
- **Materi 06:** Testing Guards and Pipes - Security testing
