# Backend Testing Excellence - Testing Business Logic

## 🤔 Apa itu Business Logic?

**Analogi Sederhana:**
Bayangkan restoran:
- **Business Logic** 🍳 = Resep masakan, aturan harga, diskon member
- **Infrastructure** 🏢 = Dapur, meja, kasir (supporting tools)
- **UI** 🎨 = Dekorasi, menu card, plating

**Business Logic** = **Aturan bisnis** dan **core value** aplikasi. Ini yang bikin app kamu beda dari kompetitor.

---

## 🎯 Kenapa Business Logic Testing Penting?

```
Backend isn't flashy, no fancy UI, no animations.
But it runs the entire circus behind the scenes.

🧠 Enforces business rules
💾 Manages data integrity  
🔗 Coordinates inter-service communication
🔐 Guards your system with security logic
```

**Satu bug di business logic:**
- 💸 User bisa beli dengan harga $0
- 🎫 Diskon 100% bisa dipakai unlimited
- 🔓 Data leak karena validation gagal
- 💥 System crash karena logic error

---

## 🏗️ NestJS Three-Layer Architecture

```
┌─────────────────────────────────────┐
│       CONTROLLER LAYER 🎮           │  ← Handle HTTP
│  - Receives requests                │
│  - Validates input                  │
│  - Returns responses                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       SERVICE LAYER 🧠               │  ← Business Logic
│  - Core application logic           │
│  - Business rules                   │
│  - Orchestrates repositories        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      REPOSITORY LAYER 💾             │  ← Data Access
│  - Database operations              │
│  - CRUD operations                  │
│  - Query building                   │
└─────────────────────────────────────┘
```

**Testing Strategy:**
- **Controllers** = Integration tests (dengan HTTP requests)
- **Services** = Unit tests (business logic)
- **Repositories** = Integration tests (dengan real/fake database)

---

## 🧪 Testing Service Layer (Business Logic)

### Example: Order Service

**Business Rules:**
1. Order total must be > 0
2. Customer must have sufficient balance
3. Items must be in stock
4. Apply discount untuk premium members
5. Send notification after order success

**Service Code:**
```typescript
// order.service.ts
@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly customerService: CustomerService,
    private readonly inventoryService: InventoryService,
    private readonly notificationService: NotificationService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { customerId, items } = createOrderDto;

    // Rule 1: Calculate total
    const total = this.calculateTotal(items);
    if (total <= 0) {
      throw new BadRequestException('Order total must be greater than 0');
    }

    // Rule 2: Check customer balance
    const customer = await this.customerService.findOne(customerId);
    if (customer.balance < total) {
      throw new BadRequestException('Insufficient balance');
    }

    // Rule 3: Check stock availability
    for (const item of items) {
      const inStock = await this.inventoryService.checkStock(
        item.productId,
        item.quantity,
      );
      if (!inStock) {
        throw new BadRequestException(
          `Product ${item.productId} out of stock`,
        );
      }
    }

    // Rule 4: Apply discount
    const finalTotal = this.applyDiscount(total, customer.isPremium);

    // Save order
    const order = await this.orderRepository.create({
      customerId,
      items,
      total: finalTotal,
      status: 'confirmed',
    });

    // Rule 5: Send notification
    await this.notificationService.sendOrderConfirmation(
      customer.email,
      order,
    );

    return order;
  }

  private calculateTotal(items: OrderItemDto[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private applyDiscount(total: number, isPremium: boolean): number {
    return isPremium ? total * 0.9 : total; // 10% discount for premium
  }
}
```

**Test Code:**
```typescript
// order.service.spec.ts
describe('OrderService', () => {
  let service: OrderService;
  let mockOrderRepo: jest.Mocked<OrderRepository>;
  let mockCustomerService: jest.Mocked<CustomerService>;
  let mockInventoryService: jest.Mocked<InventoryService>;
  let mockNotificationService: jest.Mocked<NotificationService>;

  beforeEach(async () => {
    // Setup mocks
    mockOrderRepo = {
      create: jest.fn(),
    } as any;

    mockCustomerService = {
      findOne: jest.fn(),
    } as any;

    mockInventoryService = {
      checkStock: jest.fn(),
    } as any;

    mockNotificationService = {
      sendOrderConfirmation: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: OrderRepository, useValue: mockOrderRepo },
        { provide: CustomerService, useValue: mockCustomerService },
        { provide: InventoryService, useValue: mockInventoryService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  describe('createOrder - Happy Path', () => {
    it('should create order successfully for regular customer', async () => {
      // ARRANGE
      const orderDto = {
        customerId: 1,
        items: [
          { productId: 1, name: 'Product A', price: 100, quantity: 2 },
        ],
      };

      const mockCustomer = {
        id: 1,
        email: 'customer@email.com',
        balance: 500,
        isPremium: false,
      };

      const mockCreatedOrder = {
        id: 1,
        customerId: 1,
        items: orderDto.items,
        total: 200,
        status: 'confirmed',
      };

      mockCustomerService.findOne.mockResolvedValue(mockCustomer);
      mockInventoryService.checkStock.mockResolvedValue(true);
      mockOrderRepo.create.mockResolvedValue(mockCreatedOrder);
      mockNotificationService.sendOrderConfirmation.mockResolvedValue(undefined);

      // ACT
      const result = await service.createOrder(orderDto);

      // ASSERT
      expect(result).toEqual(mockCreatedOrder);
      expect(mockCustomerService.findOne).toHaveBeenCalledWith(1);
      expect(mockInventoryService.checkStock).toHaveBeenCalledWith(1, 2);
      expect(mockOrderRepo.create).toHaveBeenCalledWith({
        customerId: 1,
        items: orderDto.items,
        total: 200, // No discount for regular customer
        status: 'confirmed',
      });
      expect(mockNotificationService.sendOrderConfirmation).toHaveBeenCalled();
    });

    it('should apply 10% discount for premium customer', async () => {
      // ARRANGE
      const orderDto = {
        customerId: 2,
        items: [
          { productId: 1, name: 'Product A', price: 100, quantity: 1 },
        ],
      };

      const mockPremiumCustomer = {
        id: 2,
        email: 'premium@email.com',
        balance: 500,
        isPremium: true, // Premium customer
      };

      mockCustomerService.findOne.mockResolvedValue(mockPremiumCustomer);
      mockInventoryService.checkStock.mockResolvedValue(true);
      mockOrderRepo.create.mockResolvedValue({ id: 2 } as any);
      mockNotificationService.sendOrderConfirmation.mockResolvedValue(undefined);

      // ACT
      await service.createOrder(orderDto);

      // ASSERT
      expect(mockOrderRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 90, // 100 - 10% = 90
        }),
      );
    });
  });

  describe('createOrder - Error Cases', () => {
    it('should throw error when order total is 0', async () => {
      const orderDto = {
        customerId: 1,
        items: [
          { productId: 1, name: 'Free Item', price: 0, quantity: 1 },
        ],
      };

      await expect(service.createOrder(orderDto)).rejects.toThrow(
        'Order total must be greater than 0',
      );
    });

    it('should throw error when customer has insufficient balance', async () => {
      const orderDto = {
        customerId: 1,
        items: [
          { productId: 1, name: 'Product A', price: 100, quantity: 2 },
        ],
      };

      const mockCustomer = {
        id: 1,
        balance: 50, // Insufficient balance
        isPremium: false,
      };

      mockCustomerService.findOne.mockResolvedValue(mockCustomer);

      await expect(service.createOrder(orderDto)).rejects.toThrow(
        'Insufficient balance',
      );
    });

    it('should throw error when product is out of stock', async () => {
      const orderDto = {
        customerId: 1,
        items: [
          { productId: 1, name: 'Product A', price: 100, quantity: 2 },
        ],
      };

      const mockCustomer = {
        id: 1,
        balance: 500,
        isPremium: false,
      };

      mockCustomerService.findOne.mockResolvedValue(mockCustomer);
      mockInventoryService.checkStock.mockResolvedValue(false); // Out of stock

      await expect(service.createOrder(orderDto)).rejects.toThrow(
        'Product 1 out of stock',
      );
    });
  });

  describe('createOrder - Edge Cases', () => {
    it('should handle multiple items in order', async () => {
      const orderDto = {
        customerId: 1,
        items: [
          { productId: 1, name: 'Product A', price: 50, quantity: 2 },
          { productId: 2, name: 'Product B', price: 30, quantity: 3 },
        ],
      };

      const mockCustomer = {
        id: 1,
        balance: 500,
        isPremium: false,
      };

      mockCustomerService.findOne.mockResolvedValue(mockCustomer);
      mockInventoryService.checkStock.mockResolvedValue(true);
      mockOrderRepo.create.mockResolvedValue({ id: 1 } as any);
      mockNotificationService.sendOrderConfirmation.mockResolvedValue(undefined);

      await service.createOrder(orderDto);

      // Total = (50 * 2) + (30 * 3) = 100 + 90 = 190
      expect(mockOrderRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 190,
        }),
      );

      // Check stock called for each item
      expect(mockInventoryService.checkStock).toHaveBeenCalledTimes(2);
    });
  });
});
```

---

## 🧠 Testing Business Rules

### Rule 1: Calculation Logic

```typescript
describe('calculateDiscount', () => {
  it('should calculate 10% discount correctly', () => {
    expect(service.calculateDiscount(100, 10)).toBe(90);
    expect(service.calculateDiscount(50, 10)).toBe(45);
  });

  it('should handle 0% discount', () => {
    expect(service.calculateDiscount(100, 0)).toBe(100);
  });

  it('should handle 100% discount', () => {
    expect(service.calculateDiscount(100, 100)).toBe(0);
  });

  it('should round to 2 decimal places', () => {
    expect(service.calculateDiscount(33.33, 10)).toBe(30.00);
  });
});
```

### Rule 2: Validation Logic

```typescript
describe('validateAge', () => {
  it('should allow age >= 18', () => {
    expect(() => service.validateAge(18)).not.toThrow();
    expect(() => service.validateAge(25)).not.toThrow();
  });

  it('should reject age < 18', () => {
    expect(() => service.validateAge(17)).toThrow('Must be 18 or older');
    expect(() => service.validateAge(10)).toThrow('Must be 18 or older');
  });

  it('should reject negative age', () => {
    expect(() => service.validateAge(-5)).toThrow('Invalid age');
  });
});
```

### Rule 3: State Transitions

```typescript
describe('Order status transitions', () => {
  it('should transition from pending to confirmed', () => {
    const order = { status: 'pending' };
    service.confirmOrder(order);
    expect(order.status).toBe('confirmed');
  });

  it('should not allow confirmed to pending', () => {
    const order = { status: 'confirmed' };
    expect(() => service.revertToPending(order)).toThrow(
      'Cannot revert confirmed order',
    );
  });

  it('should allow confirmed to shipped', () => {
    const order = { status: 'confirmed' };
    service.shipOrder(order);
    expect(order.status).toBe('shipped');
  });
});
```

---

## ✅ Best Practices

### 1. Test All Paths

```typescript
// ✅ Good: Test both success and failure
describe('processPayment', () => {
  it('should process payment successfully', async () => {
    // Test happy path
  });

  it('should handle payment failure', async () => {
    // Test error path
  });

  it('should retry on timeout', async () => {
    // Test retry logic
  });
});
```

### 2. Test Edge Cases

```typescript
// ✅ Good: Test boundaries
describe('calculateShipping', () => {
  it('should be free for orders over $100', () => {
    expect(calculateShipping(100)).toBe(0);
    expect(calculateShipping(100.01)).toBe(0);
  });

  it('should charge $10 for orders under $100', () => {
    expect(calculateShipping(99.99)).toBe(10);
    expect(calculateShipping(50)).toBe(10);
  });

  it('should handle zero amount', () => {
    expect(calculateShipping(0)).toBe(10);
  });
});
```

### 3. Use Descriptive Test Names

```typescript
// ❌ Bad
it('test order', () => {});

// ✅ Good
it('should create order when customer has sufficient balance', () => {});
it('should throw BadRequestException when total is zero', () => {});
it('should apply 10% discount for premium members', () => {});
```

---

## 📝 Summary

**Business Logic Testing:**
- 🎯 Focus on **core application value**
- 🧠 Test **business rules** thoroughly
- ✅ Test **happy path** + **error cases** + **edge cases**
- 🚀 Use **unit tests** (fast, isolated, reliable)

**What to Test:**
- ✅ Calculations and formulas
- ✅ Validation rules
- ✅ State transitions
- ✅ Business rule enforcement
- ✅ Error handling

**What NOT to Test:**
- ❌ Framework code (NestJS internals)
- ❌ Simple getters/setters
- ❌ Third-party libraries
- ❌ Database queries (test in integration tests)

---

## 🔗 Next Steps
- **Materi 06:** Testing Guards and Pipes - Security testing
- **Materi 07:** Database Testing Strategies - Repository layer testing
