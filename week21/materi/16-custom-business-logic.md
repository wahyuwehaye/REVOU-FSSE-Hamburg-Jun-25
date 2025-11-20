# Chapter 16: Custom Business Logic

## 📚 Daftar Isi
- [What is Business Logic](#what-is-business-logic)
- [Where to Put Business Logic](#where-to-put-business-logic)
- [Common Business Logic Patterns](#common-business-logic-patterns)
- [Real-World Examples](#real-world-examples)

---

## What is Business Logic?

**Business Logic** adalah aturan dan logika yang menentukan bagaimana data bisa dibuat, ditampilkan, disimpan, dan diubah dalam aplikasi.

### Contoh Business Logic:
- ✅ Validasi data (email format, password strength)
- ✅ Perhitungan (diskon, pajak, total harga)
- ✅ Status transitions (pending → approved → shipped)
- ✅ Authorization rules (only owner can delete)
- ✅ Data transformations
- ✅ Integration dengan sistem lain

---

## Where to Put Business Logic?

### ❌ DON'T: Business Logic in Controller
```typescript
@Controller('orders')
export class OrdersController {
  @Post()
  createOrder(@Body() dto: CreateOrderDto) {
    // ❌ BAD: Business logic in controller
    const total = dto.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const discount = total > 100 ? total * 0.1 : 0;
    const tax = (total - discount) * 0.15;
    const finalTotal = total - discount + tax;

    // Create order...
  }
}
```

### ✅ DO: Business Logic in Service
```typescript
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() dto: CreateOrderDto) {
    // ✅ GOOD: Delegate to service
    return this.ordersService.createOrder(dto);
  }
}

@Injectable()
export class OrdersService {
  createOrder(dto: CreateOrderDto): Order {
    // ✅ Business logic in service
    const subtotal = this.calculateSubtotal(dto.items);
    const discount = this.calculateDiscount(subtotal);
    const tax = this.calculateTax(subtotal - discount);
    const total = subtotal - discount + tax;

    return this.repository.create({
      ...dto,
      subtotal,
      discount,
      tax,
      total,
    });
  }

  private calculateSubtotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  private calculateDiscount(subtotal: number): number {
    if (subtotal > 100) return subtotal * 0.1;
    if (subtotal > 50) return subtotal * 0.05;
    return 0;
  }

  private calculateTax(amount: number): number {
    return amount * 0.15;
  }
}
```

---

## Common Business Logic Patterns

### Pattern 1: Validation Logic

```typescript
@Injectable()
export class UsersService {
  async register(dto: RegisterDto): Promise<User> {
    // Validate business rules
    await this.validateEmail(dto.email);
    await this.validatePassword(dto.password);
    await this.validateAge(dto.dateOfBirth);

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.repository.create({
      ...dto,
      password: hashedPassword,
    });
  }

  private async validateEmail(email: string): Promise<void> {
    const exists = await this.repository.findByEmail(email);
    if (exists) {
      throw new ConflictException('Email already registered');
    }

    // Business rule: Only company emails allowed
    if (!email.endsWith('@company.com')) {
      throw new BadRequestException('Only company emails allowed');
    }
  }

  private validatePassword(password: string): void {
    // Business rule: Strong password
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*]/.test(password);
    const isLongEnough = password.length >= 8;

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol || !isLongEnough) {
      throw new BadRequestException(
        'Password must contain uppercase, lowercase, number, symbol, and be at least 8 characters'
      );
    }
  }

  private validateAge(dateOfBirth: Date): void {
    const age = new Date().getFullYear() - dateOfBirth.getFullYear();
    
    // Business rule: Must be 18+
    if (age < 18) {
      throw new BadRequestException('Must be 18 years or older');
    }
  }
}
```

### Pattern 2: Calculation Logic

```typescript
interface CartItem {
  productId: number;
  quantity: number;
  price: number;
}

interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
}

@Injectable()
export class CartService {
  calculateTotal(items: CartItem[], coupon?: Coupon): OrderSummary {
    // Calculate subtotal
    const subtotal = items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    // Calculate discount
    let discount = 0;
    if (coupon) {
      discount = this.applyDiscount(subtotal, coupon);
    }

    // Calculate shipping
    const shipping = this.calculateShipping(subtotal, items);

    // Calculate tax (after discount, before shipping)
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * 0.15;

    // Final total
    const total = taxableAmount + tax + shipping;

    return {
      subtotal,
      discount,
      tax,
      shipping,
      total,
    };
  }

  private applyDiscount(subtotal: number, coupon: Coupon): number {
    // Business rule: Check minimum purchase
    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      throw new BadRequestException(
        `Minimum purchase of $${coupon.minPurchase} required for this coupon`
      );
    }

    if (coupon.type === 'percentage') {
      return subtotal * (coupon.value / 100);
    } else {
      return coupon.value;
    }
  }

  private calculateShipping(subtotal: number, items: CartItem[]): number {
    // Business rule: Free shipping over $100
    if (subtotal >= 100) {
      return 0;
    }

    // Business rule: Heavy items charge more
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 10) {
      return 20;
    }

    return 10;
  }
}
```

### Pattern 3: State Transition Logic

```typescript
enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Injectable()
export class OrdersService {
  async updateStatus(orderId: number, newStatus: OrderStatus): Promise<Order> {
    const order = await this.findOne(orderId);

    // Validate state transition
    this.validateTransition(order.status, newStatus);

    // Perform business logic based on new status
    switch (newStatus) {
      case OrderStatus.CONFIRMED:
        await this.confirmOrder(order);
        break;
      case OrderStatus.SHIPPED:
        await this.shipOrder(order);
        break;
      case OrderStatus.CANCELLED:
        await this.cancelOrder(order);
        break;
    }

    return this.repository.update(orderId, { status: newStatus });
  }

  private validateTransition(current: OrderStatus, next: OrderStatus): void {
    const validTransitions = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    const allowed = validTransitions[current];
    
    if (!allowed.includes(next)) {
      throw new BadRequestException(
        `Cannot transition from ${current} to ${next}`
      );
    }
  }

  private async confirmOrder(order: Order): Promise<void> {
    // Business logic: Check inventory
    for (const item of order.items) {
      const inStock = await this.inventoryService.checkStock(
        item.productId,
        item.quantity
      );

      if (!inStock) {
        throw new BadRequestException(
          `Product ${item.productId} out of stock`
        );
      }
    }

    // Reserve inventory
    await this.inventoryService.reserveStock(order.items);

    // Send confirmation email
    await this.emailService.sendOrderConfirmation(order);
  }

  private async shipOrder(order: Order): Promise<void> {
    // Generate tracking number
    const trackingNumber = await this.shippingService.createShipment(order);

    // Update order with tracking
    await this.repository.update(order.id, { trackingNumber });

    // Send shipping notification
    await this.emailService.sendShippingNotification(order, trackingNumber);
  }

  private async cancelOrder(order: Order): Promise<void> {
    // Business rule: Can't cancel if already shipped
    if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot cancel shipped/delivered orders');
    }

    // Release inventory
    if (order.status === OrderStatus.CONFIRMED || order.status === OrderStatus.PROCESSING) {
      await this.inventoryService.releaseStock(order.items);
    }

    // Process refund if paid
    if (order.isPaid) {
      await this.paymentService.refund(order.paymentId);
    }

    // Send cancellation email
    await this.emailService.sendOrderCancellation(order);
  }
}
```

### Pattern 4: Authorization Logic

```typescript
@Injectable()
export class PostsService {
  async update(
    postId: number,
    userId: number,
    dto: UpdatePostDto
  ): Promise<Post> {
    const post = await this.findOne(postId);

    // Business rule: Only author or admin can edit
    await this.checkPermission(post, userId);

    return this.repository.update(postId, dto);
  }

  async delete(postId: number, userId: number): Promise<void> {
    const post = await this.findOne(postId);

    // Business rule: Only author can delete (not even admin)
    if (post.authorId !== userId) {
      throw new ForbiddenException('Only the author can delete this post');
    }

    await this.repository.delete(postId);
  }

  private async checkPermission(post: Post, userId: number): Promise<void> {
    const user = await this.usersService.findOne(userId);

    const isAuthor = post.authorId === userId;
    const isAdmin = user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException('Not authorized to edit this post');
    }
  }

  async publish(postId: number, userId: number): Promise<Post> {
    const post = await this.findOne(postId);

    // Business rule: Only admin can publish
    const user = await this.usersService.findOne(userId);
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admins can publish posts');
    }

    // Business rule: Post must have at least 100 words
    const wordCount = post.content.split(/\s+/).length;
    if (wordCount < 100) {
      throw new BadRequestException('Post must have at least 100 words');
    }

    return this.repository.update(postId, {
      status: 'published',
      publishedAt: new Date(),
    });
  }
}
```

### Pattern 5: Data Transformation Logic

```typescript
@Injectable()
export class ReportsService {
  async generateSalesReport(startDate: Date, endDate: Date): Promise<SalesReport> {
    // Get raw data
    const orders = await this.ordersRepository.findByDateRange(startDate, endDate);

    // Transform to report format
    const report = this.transformToReport(orders);

    return report;
  }

  private transformToReport(orders: Order[]): SalesReport {
    // Group by date
    const salesByDate = this.groupByDate(orders);

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalRevenue / totalOrders;

    // Get top products
    const topProducts = this.getTopProducts(orders);

    // Get top customers
    const topCustomers = this.getTopCustomers(orders);

    return {
      period: {
        start: orders[0]?.createdAt,
        end: orders[orders.length - 1]?.createdAt,
      },
      metrics: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
      },
      salesByDate,
      topProducts,
      topCustomers,
    };
  }

  private groupByDate(orders: Order[]): Record<string, DailySales> {
    const grouped: Record<string, DailySales> = {};

    for (const order of orders) {
      const dateKey = order.createdAt.toISOString().split('T')[0];

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          orders: 0,
          revenue: 0,
        };
      }

      grouped[dateKey].orders++;
      grouped[dateKey].revenue += order.total;
    }

    return grouped;
  }

  private getTopProducts(orders: Order[]): ProductSales[] {
    const productSales: Record<number, ProductSales> = {};

    for (const order of orders) {
      for (const item of order.items) {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            productId: item.productId,
            productName: item.productName,
            quantity: 0,
            revenue: 0,
          };
        }

        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      }
    }

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }

  private getTopCustomers(orders: Order[]): CustomerSales[] {
    const customerSales: Record<number, CustomerSales> = {};

    for (const order of orders) {
      if (!customerSales[order.customerId]) {
        customerSales[order.customerId] = {
          customerId: order.customerId,
          customerName: order.customerName,
          orders: 0,
          revenue: 0,
        };
      }

      customerSales[order.customerId].orders++;
      customerSales[order.customerId].revenue += order.total;
    }

    return Object.values(customerSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }
}
```

---

## Real-World Examples

### Example 1: E-commerce Inventory Management

```typescript
@Injectable()
export class InventoryService {
  async reserveStock(items: OrderItem[]): Promise<void> {
    for (const item of items) {
      const product = await this.productsRepository.findById(item.productId);

      // Business rule: Check availability
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.stock}`
        );
      }

      // Business rule: Check if product is active
      if (!product.isActive) {
        throw new BadRequestException(`Product ${product.name} is not available`);
      }

      // Reserve stock
      await this.productsRepository.update(product.id, {
        stock: product.stock - item.quantity,
        reserved: product.reserved + item.quantity,
      });

      // Log inventory movement
      await this.inventoryLogsRepository.create({
        productId: product.id,
        type: 'reserved',
        quantity: item.quantity,
        before: product.stock,
        after: product.stock - item.quantity,
      });
    }
  }

  async releaseStock(items: OrderItem[]): Promise<void> {
    for (const item of items) {
      const product = await this.productsRepository.findById(item.productId);

      // Release reserved stock
      await this.productsRepository.update(product.id, {
        stock: product.stock + item.quantity,
        reserved: product.reserved - item.quantity,
      });

      // Log inventory movement
      await this.inventoryLogsRepository.create({
        productId: product.id,
        type: 'released',
        quantity: item.quantity,
        before: product.stock,
        after: product.stock + item.quantity,
      });
    }
  }

  async checkLowStock(): Promise<Product[]> {
    const products = await this.productsRepository.findAll();

    // Business rule: Alert when stock below threshold
    return products.filter(p => {
      const available = p.stock - p.reserved;
      return available < p.minStockLevel;
    });
  }
}
```

### Example 2: Subscription Management

```typescript
@Injectable()
export class SubscriptionsService {
  async subscribe(userId: number, planId: number): Promise<Subscription> {
    const user = await this.usersService.findOne(userId);
    const plan = await this.plansService.findOne(planId);

    // Business rule: Check if already subscribed
    const existing = await this.repository.findActiveByUser(userId);
    if (existing) {
      throw new ConflictException('Already have an active subscription');
    }

    // Business rule: Validate payment method
    if (!user.paymentMethodId) {
      throw new BadRequestException('Please add a payment method first');
    }

    // Calculate billing
    const startDate = new Date();
    const endDate = this.calculateEndDate(startDate, plan.interval);
    const nextBillingDate = endDate;

    // Charge first payment
    const payment = await this.paymentsService.charge({
      userId,
      amount: plan.price,
      paymentMethodId: user.paymentMethodId,
      description: `${plan.name} subscription`,
    });

    // Create subscription
    const subscription = await this.repository.create({
      userId,
      planId,
      status: 'active',
      startDate,
      endDate,
      nextBillingDate,
      lastPaymentId: payment.id,
    });

    // Grant access
    await this.usersService.grantPlanFeatures(userId, plan.features);

    // Send welcome email
    await this.emailService.sendSubscriptionWelcome(user, subscription);

    return subscription;
  }

  async cancel(subscriptionId: number, userId: number): Promise<Subscription> {
    const subscription = await this.findOne(subscriptionId);

    // Business rule: Only owner can cancel
    if (subscription.userId !== userId) {
      throw new ForbiddenException('Not your subscription');
    }

    // Business rule: Can't cancel already cancelled
    if (subscription.status === 'cancelled') {
      throw new BadRequestException('Subscription already cancelled');
    }

    // Cancel at period end (no refund)
    return this.repository.update(subscriptionId, {
      status: 'cancelled',
      cancelledAt: new Date(),
      endsAt: subscription.endDate,
    });
  }

  async processRenewal(subscriptionId: number): Promise<void> {
    const subscription = await this.findOne(subscriptionId);

    // Business rule: Only renew active subscriptions
    if (subscription.status !== 'active') {
      return;
    }

    const user = await this.usersService.findOne(subscription.userId);
    const plan = await this.plansService.findOne(subscription.planId);

    try {
      // Charge renewal
      const payment = await this.paymentsService.charge({
        userId: user.id,
        amount: plan.price,
        paymentMethodId: user.paymentMethodId,
        description: `${plan.name} renewal`,
      });

      // Extend subscription
      const newEndDate = this.calculateEndDate(
        subscription.endDate,
        plan.interval
      );

      await this.repository.update(subscriptionId, {
        endDate: newEndDate,
        nextBillingDate: newEndDate,
        lastPaymentId: payment.id,
      });

      // Send receipt
      await this.emailService.sendRenewalReceipt(user, subscription, payment);
    } catch (error) {
      // Payment failed
      await this.handlePaymentFailure(subscription, user);
    }
  }

  private async handlePaymentFailure(
    subscription: Subscription,
    user: User
  ): Promise<void> {
    // Business rule: 3 retry attempts
    const retryCount = subscription.paymentRetries + 1;

    if (retryCount >= 3) {
      // Cancel subscription after 3 failures
      await this.repository.update(subscription.id, {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancellationReason: 'payment_failed',
      });

      // Revoke access
      await this.usersService.revokePlanFeatures(user.id);

      // Send cancellation notice
      await this.emailService.sendPaymentFailedCancellation(user, subscription);
    } else {
      // Update retry count
      await this.repository.update(subscription.id, {
        paymentRetries: retryCount,
        status: 'past_due',
      });

      // Send payment failure notice
      await this.emailService.sendPaymentFailedRetry(user, subscription, retryCount);
    }
  }

  private calculateEndDate(startDate: Date, interval: string): Date {
    const date = new Date(startDate);

    switch (interval) {
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }

    return date;
  }
}
```

---

## Summary

✅ Business logic belongs in **Service Layer**
✅ Controller hanya handle HTTP, delegate ke Service
✅ Common patterns: Validation, Calculation, State Transition, Authorization, Transformation
✅ Always validate business rules before data changes
✅ Use private methods untuk break down complex logic

**Next:** Request Lifecycle in NestJS! 🚀
