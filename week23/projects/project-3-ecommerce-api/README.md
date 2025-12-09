# 🛒 Project 3: E-commerce API (Advanced Level)

Build a complete e-commerce backend with products, cart, orders, and payment integration.

## 🎯 Project Overview

**Difficulty:** Advanced  
**Est. Time:** 10-12 hours  
**Tech Stack:** NestJS, PostgreSQL, TypeORM, JWT, Stripe

## 📊 Database Schema

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(200) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  parentId INTEGER REFERENCES categories(id)
);

-- Products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  comparePrice DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  categoryId INTEGER REFERENCES categories(id),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Images
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  productId INTEGER REFERENCES products(id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  isPrimary BOOLEAN DEFAULT false
);

-- Cart
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Items
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cartId INTEGER REFERENCES carts(id) ON DELETE CASCADE,
  productId INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  orderNumber VARCHAR(50) UNIQUE NOT NULL,
  userId INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  shippingCost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  shippingAddress TEXT NOT NULL,
  paymentMethod VARCHAR(50),
  paymentStatus VARCHAR(50) DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  orderId INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  productId INTEGER REFERENCES products(id),
  productName VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Reviews
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  productId INTEGER REFERENCES products(id) ON DELETE CASCADE,
  userId INTEGER REFERENCES users(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Requirements

### Core Features
- [ ] User authentication & authorization
- [ ] Product catalog with categories
- [ ] Product search & filtering
- [ ] Shopping cart management
- [ ] Checkout process
- [ ] Order management
- [ ] Inventory tracking
- [ ] Product reviews & ratings

### Advanced Features
- [ ] Payment integration (Stripe)
- [ ] Order status tracking
- [ ] Stock management (auto-decrement)
- [ ] Product variants (size, color)
- [ ] Wishlist
- [ ] Discount codes
- [ ] Admin dashboard
- [ ] Sales analytics

## 📋 API Endpoints

### Products
- GET `/products` - List products (pagination, filters)
- GET `/products/:slug` - Get product details
- POST `/products` - Create product (admin)
- PUT `/products/:id` - Update product (admin)
- DELETE `/products/:id` - Delete product (admin)
- GET `/products/:id/reviews` - Get reviews

### Cart
- GET `/cart` - Get user's cart
- POST `/cart/items` - Add item to cart
- PUT `/cart/items/:id` - Update cart item quantity
- DELETE `/cart/items/:id` - Remove from cart
- DELETE `/cart` - Clear cart

### Orders
- POST `/orders` - Create order (checkout)
- GET `/orders` - Get user's orders
- GET `/orders/:id` - Get order details
- PATCH `/orders/:id/status` - Update status (admin)
- POST `/orders/:id/cancel` - Cancel order

### Payments
- POST `/payments/create-intent` - Create payment intent
- POST `/payments/webhook` - Stripe webhook

### Reviews
- POST `/products/:id/reviews` - Add review
- PUT `/reviews/:id` - Update review
- DELETE `/reviews/:id` - Delete review

## 💻 Key Implementation Points

### 1. Stock Management
```typescript
async createOrder(userId: number, cartItems: CartItem[]) {
  return await this.dataSource.transaction(async (manager) => {
    // Check stock
    for (const item of cartItems) {
      const product = await manager.findOne(Product, { where: { id: item.productId } });
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }
    }

    // Create order
    const order = await manager.save(Order, orderData);

    // Decrement stock
    for (const item of cartItems) {
      await manager.decrement(Product, { id: item.productId }, 'stock', item.quantity);
    }

    return order;
  });
}
```

### 2. Order Number Generation
```typescript
generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}
```

### 3. Calculate Order Total
```typescript
calculateOrderTotal(items: OrderItem[]): {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
}
```

### 4. Product Rating Calculation
```typescript
async updateProductRating(productId: number) {
  const result = await this.reviewsRepository
    .createQueryBuilder('review')
    .select('AVG(review.rating)', 'avgRating')
    .addSelect('COUNT(review.id)', 'reviewCount')
    .where('review.productId = :productId', { productId })
    .getRawOne();

  await this.productsRepository.update(productId, {
    averageRating: parseFloat(result.avgRating) || 0,
    reviewCount: parseInt(result.reviewCount) || 0,
  });
}
```

## 🧪 Testing

```bash
# Add to cart
curl -X POST http://localhost:3000/cart/items \
  -H "Authorization: Bearer TOKEN" \
  -d '{"productId":1,"quantity":2}'

# Get cart
curl http://localhost:3000/cart \
  -H "Authorization: Bearer TOKEN"

# Create order
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "shippingAddress":"123 Main St",
    "paymentMethod":"credit_card"
  }'

# Get orders
curl http://localhost:3000/orders \
  -H "Authorization: Bearer TOKEN"
```

## 🎓 Learning Points

- **Transactions:** Ensure data consistency (stock, orders)
- **Complex calculations:** Totals, tax, shipping
- **Business logic:** Stock management, order workflow
- **Payment integration:** Stripe API
- **Analytics:** Sales reports, popular products
- **Performance:** Optimize product queries with indexes

## 🚨 Challenges

1. **Race conditions:** Multiple users ordering same product
2. **Payment handling:** Webhook processing
3. **Inventory sync:** Real-time stock updates
4. **Order cancellation:** Restore stock
5. **Complex filters:** Price range, categories, ratings

---

**Good luck with your advanced project! 🚀**
