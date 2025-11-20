# Chapter 13: Service Layer Implementation

## 📚 Daftar Isi
- [Apa itu Service Layer?](#apa-itu-service-layer)
- [Mengapa Perlu Service Layer?](#mengapa-perlu-service-layer)
- [Service Layer di NestJS](#service-layer-di-nestjs)
- [Dependency Injection](#dependency-injection)
- [Best Practices](#best-practices)
- [Advanced Patterns](#advanced-patterns)

---

## Apa itu Service Layer?

**Service Layer** adalah lapisan dalam aplikasi yang berisi **business logic** dan berinteraksi dengan data storage.

### Visualisasi Architecture

```
┌─────────────────┐
│   Controller    │  ← Handle HTTP requests/responses
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│    Service      │  ← Business logic & data operations
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Data Store    │  ← Database or In-memory array
└─────────────────┘
```

### Separation of Concerns

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Controller** | HTTP handling, routing | `@Get()`, `@Post()`, validation |
| **Service** | Business logic, data operations | Calculate, filter, transform |
| **Repository** | Data access | CRUD operations, queries |

---

## Mengapa Perlu Service Layer?

### 1. **Separation of Concerns** ✅
```typescript
// ❌ BAD - Business logic in controller
@Controller('orders')
export class OrdersController {
  @Post()
  create(@Body() orderDto: CreateOrderDto) {
    // ❌ Controller contains business logic
    const total = orderDto.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    
    if (total < 0) {
      throw new BadRequestException('Invalid total');
    }
    
    const discount = total > 100000 ? total * 0.1 : 0;
    const finalTotal = total - discount;
    
    // Save to database...
    return { total: finalTotal };
  }
}

// ✅ GOOD - Business logic in service
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}
  
  @Post()
  create(@Body() orderDto: CreateOrderDto) {
    return this.ordersService.create(orderDto);
  }
}

@Injectable()
export class OrdersService {
  create(orderDto: CreateOrderDto) {
    const total = this.calculateTotal(orderDto.items);
    const discount = this.calculateDiscount(total);
    const finalTotal = total - discount;
    
    // Save to database...
    return { total: finalTotal };
  }
  
  private calculateTotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
  }
  
  private calculateDiscount(total: number): number {
    return total > 100000 ? total * 0.1 : 0;
  }
}
```

### 2. **Reusability** 🔄
Service dapat digunakan di berbagai controller

```typescript
@Injectable()
export class UsersService {
  findByEmail(email: string) {
    // Business logic here
  }
}

// Service dapat digunakan di banyak tempat
@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}
  
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const user = this.usersService.findByEmail(loginDto.email);
    // ...
  }
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  
  @Get('search')
  search(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
```

### 3. **Testability** 🧪
Lebih mudah untuk unit test

```typescript
describe('UsersService', () => {
  let service: UsersService;
  
  beforeEach(() => {
    service = new UsersService();
  });
  
  it('should find user by email', () => {
    const user = service.findByEmail('test@example.com');
    expect(user).toBeDefined();
  });
});
```

### 4. **Maintainability** 🔧
Kode lebih terorganisir dan mudah di-maintain

---

## Service Layer di NestJS

### Creating a Service

#### Step 1: Generate Service
```bash
nest generate service users
# atau
nest g s users
```

**Output:**
```
CREATE src/users/users.service.ts
CREATE src/users/users.service.spec.ts
UPDATE src/users/users.module.ts
```

#### Step 2: Basic Service Structure
```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  // Service methods here
}
```

### @Injectable() Decorator

**@Injectable()** membuat class dapat di-inject sebagai dependency

```typescript
@Injectable()
export class UsersService {
  // NestJS dapat inject service ini ke class lain
}

@Controller('users')
export class UsersController {
  // Service di-inject melalui constructor
  constructor(private readonly usersService: UsersService) {}
}
```

---

## Complete Service Implementation

### Example: Products Service

```typescript
import { 
  Injectable, 
  NotFoundException,
  ConflictException,
  BadRequestException 
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private currentId = 1;

  constructor() {
    // Seed initial data
    this.seedData();
  }

  /**
   * CREATE - Membuat product baru
   */
  create(createProductDto: CreateProductDto): Product {
    // 1. Validate business rules
    this.validateProductName(createProductDto.name);
    
    // 2. Check for duplicates
    const exists = this.products.find(
      p => p.name.toLowerCase() === createProductDto.name.toLowerCase()
    );
    
    if (exists) {
      throw new ConflictException(
        `Product with name "${createProductDto.name}" already exists`
      );
    }

    // 3. Create product
    const product: Product = {
      id: this.currentId++,
      ...createProductDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 4. Save to storage
    this.products.push(product);

    // 5. Return created product
    return product;
  }

  /**
   * READ - Get all products dengan filtering & sorting
   */
  findAll(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }): Product[] {
    let filtered = [...this.products];

    // Apply filters
    if (filters) {
      if (filters.category) {
        filtered = filtered.filter(
          p => p.category.toLowerCase() === filters.category!.toLowerCase()
        );
      }

      if (filters.minPrice !== undefined) {
        filtered = filtered.filter(p => p.price >= filters.minPrice!);
      }

      if (filters.maxPrice !== undefined) {
        filtered = filtered.filter(p => p.price <= filters.maxPrice!);
      }

      if (filters.inStock !== undefined) {
        filtered = filtered.filter(p => 
          filters.inStock ? p.stock > 0 : p.stock === 0
        );
      }
    }

    return filtered;
  }

  /**
   * READ - Get one product by ID
   */
  findOne(id: number): Product {
    const product = this.products.find(p => p.id === id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  /**
   * READ - Find by category
   */
  findByCategory(category: string): Product[] {
    return this.products.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * UPDATE - Update product
   */
  update(id: number, updateProductDto: UpdateProductDto): Product {
    // 1. Find product
    const index = this.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // 2. Validate if name is being changed
    if (updateProductDto.name) {
      this.validateProductName(updateProductDto.name);
      
      // Check for duplicate name (excluding current product)
      const duplicate = this.products.find(
        p => p.id !== id && 
        p.name.toLowerCase() === updateProductDto.name!.toLowerCase()
      );
      
      if (duplicate) {
        throw new ConflictException(
          `Product with name "${updateProductDto.name}" already exists`
        );
      }
    }

    // 3. Update product
    const existingProduct = this.products[index];
    const updatedProduct: Product = {
      ...existingProduct,
      ...updateProductDto,
      updatedAt: new Date(),
    };

    this.products[index] = updatedProduct;

    return updatedProduct;
  }

  /**
   * DELETE - Remove product
   */
  remove(id: number): { message: string; deleted: Product } {
    const index = this.products.findIndex(p => p.id === id);

    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const deleted = this.products[index];
    this.products.splice(index, 1);

    return {
      message: `Product "${deleted.name}" has been deleted successfully`,
      deleted,
    };
  }

  /**
   * BUSINESS LOGIC - Update stock
   */
  updateStock(id: number, quantity: number): Product {
    const product = this.findOne(id);

    if (quantity < 0 && Math.abs(quantity) > product.stock) {
      throw new BadRequestException(
        `Cannot remove ${Math.abs(quantity)} items. Only ${product.stock} in stock.`
      );
    }

    product.stock += quantity;
    product.updatedAt = new Date();

    return product;
  }

  /**
   * BUSINESS LOGIC - Calculate total value
   */
  calculateInventoryValue(): {
    totalProducts: number;
    totalValue: number;
    byCategory: Record<string, number>;
  } {
    const totalProducts = this.products.length;
    const totalValue = this.products.reduce(
      (sum, p) => sum + (p.price * p.stock), 
      0
    );

    const byCategory: Record<string, number> = {};
    this.products.forEach(p => {
      if (!byCategory[p.category]) {
        byCategory[p.category] = 0;
      }
      byCategory[p.category] += p.price * p.stock;
    });

    return {
      totalProducts,
      totalValue,
      byCategory,
    };
  }

  /**
   * BUSINESS LOGIC - Get low stock products
   */
  getLowStockProducts(threshold: number = 5): Product[] {
    return this.products.filter(p => p.stock <= threshold);
  }

  /**
   * PRIVATE HELPER - Validate product name
   */
  private validateProductName(name: string): void {
    if (name.length < 3) {
      throw new BadRequestException('Product name must be at least 3 characters');
    }

    if (name.length > 100) {
      throw new BadRequestException('Product name must not exceed 100 characters');
    }

    // Check for special characters
    const validNamePattern = /^[a-zA-Z0-9\s\-]+$/;
    if (!validNamePattern.test(name)) {
      throw new BadRequestException(
        'Product name can only contain letters, numbers, spaces, and hyphens'
      );
    }
  }

  /**
   * PRIVATE HELPER - Seed initial data
   */
  private seedData(): void {
    const sampleProducts = [
      {
        name: 'Laptop',
        price: 15000000,
        stock: 10,
        category: 'Electronics',
      },
      {
        name: 'Mouse',
        price: 150000,
        stock: 50,
        category: 'Electronics',
      },
      {
        name: 'Keyboard',
        price: 500000,
        stock: 30,
        category: 'Electronics',
      },
    ];

    sampleProducts.forEach(product => {
      this.products.push({
        id: this.currentId++,
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }
}
```

---

## Dependency Injection

### What is Dependency Injection?

**Dependency Injection (DI)** adalah design pattern dimana dependencies (services) di-inject ke dalam class, bukan dibuat di dalam class itu sendiri.

### Without DI (❌ Bad)
```typescript
export class OrdersController {
  private ordersService: OrdersService;
  
  constructor() {
    // ❌ Tightly coupled - hard to test
    this.ordersService = new OrdersService();
  }
}
```

### With DI (✅ Good)
```typescript
@Controller('orders')
export class OrdersController {
  // ✅ Loosely coupled - easy to test & maintain
  constructor(private readonly ordersService: OrdersService) {}
}
```

### How DI Works in NestJS

```typescript
// 1. Service marked as @Injectable()
@Injectable()
export class UsersService {
  // ...
}

// 2. Service registered in module
@Module({
  providers: [UsersService],  // ← Register here
  exports: [UsersService],     // ← Export if used by other modules
})
export class UsersModule {}

// 3. Service injected in controller
@Controller('users')
export class UsersController {
  // ✅ NestJS automatically injects UsersService
  constructor(private readonly usersService: UsersService) {}
}
```

### Injecting Multiple Services

```typescript
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}
  
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    // Can use all injected services
    const user = await this.usersService.findOne(createOrderDto.userId);
    const product = await this.productsService.findOne(createOrderDto.productId);
    return this.ordersService.create(createOrderDto);
  }
}
```

---

## Best Practices

### 1. **Keep Services Focused** (Single Responsibility)

```typescript
// ❌ BAD - Service doing too much
@Injectable()
export class AppService {
  createUser() {}
  createProduct() {}
  sendEmail() {}
  generatePDF() {}
}

// ✅ GOOD - Separate services
@Injectable()
export class UsersService {
  createUser() {}
}

@Injectable()
export class ProductsService {
  createProduct() {}
}

@Injectable()
export class EmailService {
  sendEmail() {}
}
```

### 2. **Use Interfaces for Type Safety**

```typescript
// Define interface
export interface Product {
  id: number;
  name: string;
  price: number;
}

// Use in service
@Injectable()
export class ProductsService {
  findAll(): Product[] {
    // TypeScript will enforce Product interface
    return this.products;
  }
}
```

### 3. **Handle Errors Properly**

```typescript
@Injectable()
export class UsersService {
  findOne(id: number): User {
    const user = this.users.find(u => u.id === id);
    
    if (!user) {
      // ✅ Throw appropriate HTTP exception
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }
}
```

### 4. **Use Private Methods for Helpers**

```typescript
@Injectable()
export class ProductsService {
  // Public method
  create(createDto: CreateProductDto): Product {
    this.validatePrice(createDto.price);
    // ...
  }
  
  // Private helper method
  private validatePrice(price: number): void {
    if (price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }
  }
}
```

### 5. **Document Complex Business Logic**

```typescript
@Injectable()
export class OrdersService {
  /**
   * Calculate order total with discounts
   * 
   * Business rules:
   * - Orders > 100000: 10% discount
   * - Orders > 500000: 15% discount
   * - First-time customers: Additional 5% discount
   * 
   * @param items - Order items
   * @param isFirstOrder - Is customer's first order
   * @returns Calculated total with discounts applied
   */
  calculateTotal(items: OrderItem[], isFirstOrder: boolean): number {
    const subtotal = items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );
    
    let discount = 0;
    if (subtotal > 500000) {
      discount = 0.15;
    } else if (subtotal > 100000) {
      discount = 0.10;
    }
    
    if (isFirstOrder) {
      discount += 0.05;
    }
    
    return subtotal * (1 - discount);
  }
}
```

### 6. **Avoid Business Logic in Controllers**

```typescript
// ❌ BAD
@Controller('products')
export class ProductsController {
  @Post()
  create(@Body() createDto: CreateProductDto) {
    // ❌ Business logic in controller
    if (createDto.price < 0) {
      throw new BadRequestException('Price must be positive');
    }
    
    const product = {
      ...createDto,
      createdAt: new Date(),
    };
    
    // Save product...
  }
}

// ✅ GOOD
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  
  @Post()
  create(@Body() createDto: CreateProductDto) {
    // ✅ Delegate to service
    return this.productsService.create(createDto);
  }
}

@Injectable()
export class ProductsService {
  create(createDto: CreateProductDto): Product {
    // ✅ Business logic in service
    this.validatePrice(createDto.price);
    
    const product = {
      ...createDto,
      createdAt: new Date(),
    };
    
    return this.saveProduct(product);
  }
  
  private validatePrice(price: number): void {
    if (price < 0) {
      throw new BadRequestException('Price must be positive');
    }
  }
}
```

---

## Advanced Patterns

### 1. **Service Composition**

Services dapat menggunakan services lain:

```typescript
@Injectable()
export class OrdersService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}
  
  async createOrder(createOrderDto: CreateOrderDto) {
    // Use other services
    const user = await this.usersService.findOne(createOrderDto.userId);
    const product = await this.productsService.findOne(createOrderDto.productId);
    
    // Business logic
    const order = this.processOrder(user, product, createOrderDto);
    
    // Send notification
    await this.emailService.sendOrderConfirmation(user.email, order);
    
    return order;
  }
}
```

### 2. **Transaction-like Operations**

```typescript
@Injectable()
export class OrdersService {
  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      // Step 1: Reduce product stock
      await this.productsService.updateStock(
        createOrderDto.productId,
        -createOrderDto.quantity
      );
      
      // Step 2: Create order
      const order = await this.createOrderRecord(createOrderDto);
      
      // Step 3: Send notification
      await this.emailService.sendConfirmation(order);
      
      return order;
    } catch (error) {
      // Rollback if any step fails
      await this.rollbackOrder(createOrderDto);
      throw error;
    }
  }
}
```

### 3. **Factory Pattern**

```typescript
@Injectable()
export class NotificationFactory {
  createNotification(type: 'email' | 'sms' | 'push'): NotificationService {
    switch (type) {
      case 'email':
        return new EmailService();
      case 'sms':
        return new SmsService();
      case 'push':
        return new PushService();
      default:
        throw new Error('Unknown notification type');
    }
  }
}
```

---

## Summary

### Key Takeaways:
1. ✅ Service Layer contains business logic
2. ✅ Separates concerns from controllers
3. ✅ Makes code reusable and testable
4. ✅ Use `@Injectable()` decorator
5. ✅ Inject via constructor (Dependency Injection)
6. ✅ Keep services focused (Single Responsibility)
7. ✅ Handle errors with HTTP exceptions
8. ✅ Use private methods for helpers

### Service Responsibilities:
- ✅ Business logic
- ✅ Data validation
- ✅ CRUD operations
- ✅ Calculations
- ✅ Data transformation
- ✅ External API calls

### NOT Service Responsibilities:
- ❌ HTTP request/response handling
- ❌ Route definitions
- ❌ Query parameter parsing
- ❌ Request body validation (use DTOs)

---

**Next Chapter:** Repository Pattern untuk data access layer yang lebih terstruktur! 🚀
