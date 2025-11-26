# E-commerce API - Complete Production Application

A comprehensive e-commerce REST API demonstrating **Dependency Injection**, **Production Best Practices**, and **Deployment** to cloud platforms. This project showcases a real-world application architecture with proper separation of concerns, service layers, and production-ready features.

## 🎯 Learning Focus

This project demonstrates:
- **Dependency Injection**: Service providers, injectable classes, module organization
- **Layered Architecture**: Controllers → Services → Repositories pattern
- **Production Features**: Authentication, authorization, logging, monitoring
- **Database Relations**: TypeORM with complex relationships
- **Business Logic**: Order processing, inventory management, payment flow
- **Deployment**: Environment configuration, Docker, cloud deployment

## ✨ Features

### Core Functionality
- **Product Management**: CRUD operations with categories, search, filters
- **Shopping Cart**: Session-based cart management
- **Order Processing**: Complete order workflow from cart to payment
- **User Management**: Authentication with JWT, user profiles
- **Payment Integration**: Mock payment gateway (Stripe-like)
- **Email Notifications**: Order confirmations, shipping updates

### Production Features
- **Authentication & Authorization**: JWT tokens, role-based access (Admin/User)
- **Input Validation**: Comprehensive DTO validation with class-validator
- **Error Handling**: Global exception filters with proper error responses
- **Logging**: Request logging, error tracking, audit logs
- **Rate Limiting**: Protect against abuse
- **CORS Configuration**: Secure cross-origin requests
- **Health Checks**: Monitor application status
- **Database Migrations**: Track schema changes
- **Docker Support**: Containerized deployment
- **Environment Config**: Separate configs for dev/prod

## 🛠️ Tech Stack

- **Framework**: NestJS 10.x
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Email**: Nodemailer
- **Caching**: Redis (optional)
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- Docker (optional, for containerized deployment)

## 🚀 Quick Start

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

\`\`\`bash
cp .env.example .env
\`\`\`

### 3. Setup Database

\`\`\`bash
# Create PostgreSQL database
createdb ecommerce_db

# Run migrations
npm run migration:run
\`\`\`

### 4. Start the Application

\`\`\`bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
\`\`\`

The API will be available at `http://localhost:3000`

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/health`

### Authentication

Most endpoints require authentication. First register and login:

\`\`\`bash
# Register new user
curl -X POST http://localhost:3000/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'

# Response includes access_token
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {...}
}
\`\`\`

Use the token in subsequent requests:

\`\`\`bash
curl -X GET http://localhost:3000/profile \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
\`\`\`

### API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **Authentication** |
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login and get JWT | No |
| GET | `/auth/profile` | Get current user | Yes |
| **Products** |
| GET | `/products` | List all products | No |
| GET | `/products/:id` | Get single product | No |
| POST | `/products` | Create product | Admin |
| PATCH | `/products/:id` | Update product | Admin |
| DELETE | `/products/:id` | Delete product | Admin |
| **Categories** |
| GET | `/categories` | List categories | No |
| POST | `/categories` | Create category | Admin |
| **Cart** |
| GET | `/cart` | View cart | Yes |
| POST | `/cart/items` | Add item to cart | Yes |
| PATCH | `/cart/items/:id` | Update quantity | Yes |
| DELETE | `/cart/items/:id` | Remove from cart | Yes |
| DELETE | `/cart` | Clear cart | Yes |
| **Orders** |
| GET | `/orders` | List user's orders | Yes |
| GET | `/orders/:id` | Get order details | Yes |
| POST | `/orders` | Create order from cart | Yes |
| GET | `/admin/orders` | List all orders | Admin |
| PATCH | `/admin/orders/:id/status` | Update order status | Admin |
| **Payment** |
| POST | `/payments/process` | Process payment | Yes |
| GET | `/payments/:id` | Get payment status | Yes |

## 🔍 Example Usage

### Complete Shopping Flow

\`\`\`bash
# 1. Browse products
curl http://localhost:3000/products

# 2. Add to cart (requires authentication)
curl -X POST http://localhost:3000/cart/items \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "productId": 1,
    "quantity": 2
  }'

# 3. View cart
curl http://localhost:3000/cart \\
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Create order
curl -X POST http://localhost:3000/orders \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }'

# 5. Process payment
curl -X POST http://localhost:3000/payments/process \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "orderId": 1,
    "paymentMethod": "credit_card",
    "cardNumber": "4242424242424242",
    "expiryMonth": "12",
    "expiryYear": "2025",
    "cvv": "123"
  }'
\`\`\`

### Admin Operations

\`\`\`bash
# Create product (admin only)
curl -X POST http://localhost:3000/products \\
  -H "Authorization: Bearer ADMIN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Premium Laptop",
    "description": "High-performance laptop for professionals",
    "price": 1299.99,
    "stock": 50,
    "categoryId": 1,
    "images": ["laptop1.jpg", "laptop2.jpg"]
  }'

# Update order status
curl -X PATCH http://localhost:3000/admin/orders/1/status \\
  -H "Authorization: Bearer ADMIN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "status": "shipped",
    "trackingNumber": "TRACK123456"
  }'
\`\`\`

## 🏗️ Project Structure

\`\`\`
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
├── config/                # Configuration files
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── email.config.ts
├── auth/                  # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   └── decorators/
│       └── roles.decorator.ts
├── users/                 # User management
│   ├── users.module.ts
│   ├── users.service.ts
│   ├── entities/
│   │   └── user.entity.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
├── products/             # Product catalog
│   ├── products.module.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   ├── entities/
│   │   └── product.entity.ts
│   └── dto/
│       ├── create-product.dto.ts
│       ├── update-product.dto.ts
│       └── filter-product.dto.ts
├── categories/           # Product categories
│   ├── categories.module.ts
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── entities/
│       └── category.entity.ts
├── cart/                 # Shopping cart
│   ├── cart.module.ts
│   ├── cart.controller.ts
│   ├── cart.service.ts
│   └── entities/
│       ├── cart.entity.ts
│       └── cart-item.entity.ts
├── orders/               # Order processing
│   ├── orders.module.ts
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── entities/
│       ├── order.entity.ts
│       └── order-item.entity.ts
├── payments/             # Payment processing
│   ├── payments.module.ts
│   ├── payments.controller.ts
│   ├── payments.service.ts
│   ├── payment-gateway.service.ts
│   └── entities/
│       └── payment.entity.ts
├── notifications/        # Email notifications
│   ├── notifications.module.ts
│   └── notifications.service.ts
└── common/              # Shared utilities
    ├── filters/
    │   └── http-exception.filter.ts
    ├── interceptors/
    │   └── logging.interceptor.ts
    └── decorators/
        └── current-user.decorator.ts
\`\`\`

## 💡 Key Learning Points

### 1. Dependency Injection

**Services as Providers:**

\`\`\`typescript
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private productsService: ProductsService,  // DI
    private cartService: CartService,          // DI
    private paymentsService: PaymentsService,  // DI
    private notificationsService: NotificationsService, // DI
  ) {}
}
\`\`\`

**Module Configuration:**

\`\`\`typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ProductsModule,  // Import other modules
    CartModule,
    PaymentsModule,
    NotificationsModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],  // Export for other modules
})
export class OrdersModule {}
\`\`\`

### 2. Layered Architecture

- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Repositories**: Handle data persistence
- **DTOs**: Define data transfer objects
- **Entities**: Define database models

### 3. Business Logic Example

Order creation involves multiple services working together:

\`\`\`typescript
async createOrder(userId: number, dto: CreateOrderDto): Promise<Order> {
  // 1. Get user's cart (CartService)
  const cart = await this.cartService.getCart(userId);
  
  // 2. Validate product availability (ProductsService)
  await this.productsService.validateStock(cart.items);
  
  // 3. Create order
  const order = await this.ordersRepository.save({
    user: { id: userId },
    items: cart.items,
    total: cart.total,
    shippingAddress: dto.shippingAddress,
  });
  
  // 4. Update inventory (ProductsService)
  await this.productsService.reduceStock(cart.items);
  
  // 5. Clear cart (CartService)
  await this.cartService.clearCart(userId);
  
  // 6. Send confirmation email (NotificationsService)
  await this.notificationsService.sendOrderConfirmation(order);
  
  return order;
}
\`\`\`

### 4. Authentication & Authorization

\`\`\`typescript
// JWT Strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,  // DI
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
}

// Role-based access control
@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminOrdersController {
  // Only admins can access
}
\`\`\`

### 5. Error Handling

\`\`\`typescript
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
\`\`\`

## 🚢 Deployment

### Docker Deployment

\`\`\`bash
# Build image
docker build -t ecommerce-api .

# Run container
docker run -p 3000:3000 --env-file .env ecommerce-api
\`\`\`

### Deploy to Render

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
4. Add environment variables
5. Deploy!

### Environment Variables for Production

\`\`\`bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://yourfrontend.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
\`\`\`

## 🧪 Testing

\`\`\`bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
\`\`\`

## 📊 Monitoring

The application includes:
- **Health checks**: `/health` endpoint
- **Metrics**: Memory usage, uptime
- **Logging**: Request/response logging
- **Error tracking**: Centralized error handling

## 🔒 Security Features

- **Password hashing**: bcrypt with salt rounds
- **JWT authentication**: Secure token-based auth
- **Input validation**: Prevent injection attacks
- **Rate limiting**: Protect against abuse
- **CORS**: Controlled cross-origin access
- **Helmet**: Security headers
- **SQL injection protection**: TypeORM parameterized queries

## 🎓 Learning Outcomes

After completing this project, you'll understand:
- How to structure a production NestJS application
- Dependency Injection and IoC (Inversion of Control)
- Building scalable service-oriented architecture
- Implementing authentication and authorization
- Handling complex business logic and workflows
- Preparing applications for production deployment
- Best practices for error handling and logging
- Database relationships and transactions
- Testing strategies for NestJS applications

## 📝 Next Steps

1. **Add Redis Caching**: Cache frequently accessed data
2. **Implement Pagination**: Handle large datasets efficiently
3. **Add Search**: Full-text search with Elasticsearch
4. **File Uploads**: Handle product images
5. **Webhooks**: Payment provider webhooks
6. **Admin Dashboard**: Frontend for admins
7. **Real Payments**: Integrate Stripe/PayPal
8. **Microservices**: Split into separate services

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check connection credentials in `.env`
- Ensure database exists

### JWT Authentication Fails
- Verify JWT_SECRET is set
- Check token expiry time
- Ensure Bearer token format in header

### Email Not Sending
- Verify SMTP credentials
- Check firewall settings
- For Gmail, use App Password

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Built with ❤️ using NestJS**
