# Week 22 Architecture Diagrams

Visual representation of the demo projects architecture.

---

## Project 1: User Management API Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Postman)                        │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP Requests
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    NestJS Application                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              ValidationPipe (Global)                   │  │
│  │  • Transform: true                                     │  │
│  │  • Whitelist: true                                     │  │
│  │  • ForbidNonWhitelisted: true                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                     │                                        │
│  ┌─────────────────▼─────────────────────────────────────┐  │
│  │           UsersController                              │  │
│  │  @Post()   createUser(@Body() dto: CreateUserDto)    │  │
│  │  @Get()    findAll(@Query() pagination)              │  │
│  │  @Get(':id') findOne(@Param('id') id)               │  │
│  │  @Patch(':id') update(@Body() dto: UpdateUserDto)   │  │
│  │  @Delete(':id') remove(@Param('id') id)             │  │
│  └─────────────────┬─────────────────────────────────────┘  │
│                    │                                         │
│  ┌─────────────────▼─────────────────────────────────────┐  │
│  │              Custom Pipes                              │  │
│  │  • TrimPipe - Remove whitespace                       │  │
│  │  • LowercaseEmailPipe - Normalize email              │  │
│  │  • HashPasswordPipe - Bcrypt hashing                 │  │
│  └─────────────────┬─────────────────────────────────────┘  │
│                    │                                         │
│  ┌─────────────────▼─────────────────────────────────────┐  │
│  │              DTOs (Validation)                         │  │
│  │  • CreateUserDto                                       │  │
│  │    - @IsEmail() email                                 │  │
│  │    - @IsStrongPassword() password                     │  │
│  │    - @Min(18) @Max(120) age                          │  │
│  │    - @ValidateNested() address                        │  │
│  │  • UpdateUserDto extends PartialType(CreateUserDto)  │  │
│  └─────────────────┬─────────────────────────────────────┘  │
│                    │                                         │
│  ┌─────────────────▼─────────────────────────────────────┐  │
│  │              UsersService                              │  │
│  │  @Injectable()                                         │  │
│  │  • Business logic                                      │  │
│  │  • Data transformation                                 │  │
│  │  • Repository interaction                              │  │
│  └─────────────────┬─────────────────────────────────────┘  │
│                    │                                         │
│  ┌─────────────────▼─────────────────────────────────────┐  │
│  │              TypeORM Repository                        │  │
│  │  Repository<User>                                      │  │
│  │  • save(), find(), findOne()                          │  │
│  │  • update(), softDelete()                             │  │
│  └─────────────────┬─────────────────────────────────────┘  │
└────────────────────┼─────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   PostgreSQL Database   │
        │   user_management_db    │
        │                         │
        │  Table: users           │
        │  - id (PK)              │
        │  - email (unique)       │
        │  - password (hashed)    │
        │  - firstName            │
        │  - lastName             │
        │  - age                  │
        │  - phone                │
        │  - address (JSONB)      │
        │  - deletedAt (nullable) │
        └────────────────────────┘
```

---

## Project 2: Blog API Middleware Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Postman)                        │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP Request
                     │ Headers: X-API-KEY, X-Request-ID
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    NestJS Application                        │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Middleware Chain (Executed in Order)          │  │
│  │                                                        │  │
│  │  1️⃣ RequestIdMiddleware                               │  │
│  │     • Generate UUID if not provided                   │  │
│  │     • Set X-Request-ID header                         │  │
│  │                                                        │  │
│  │  2️⃣ LoggerMiddleware                                  │  │
│  │     • Log request method, URL, timestamp              │  │
│  │     • Log response status code                        │  │
│  │                                                        │  │
│  │  3️⃣ ResponseTimeMiddleware                            │  │
│  │     • Record start time                               │  │
│  │     • Calculate duration                              │  │
│  │     • Set X-Response-Time header                      │  │
│  │                                                        │  │
│  │  4️⃣ RateLimitMiddleware                               │  │
│  │     • Check request count per IP                      │  │
│  │     • Set X-RateLimit-* headers                       │  │
│  │     • Return 429 if limit exceeded                    │  │
│  │                                                        │  │
│  │  5️⃣ ApiKeyMiddleware (POST/PATCH/DELETE only)        │  │
│  │     • Check X-API-KEY header                          │  │
│  │     • Return 401 if invalid                           │  │
│  │                                                        │  │
│  │  6️⃣ IpWhitelistMiddleware (DELETE only)              │  │
│  │     • Check client IP against whitelist               │  │
│  │     • Return 403 if not whitelisted                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                     │                                        │
│                     │ All middleware passed                  │
│                     ▼                                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              PostsController                           │  │
│  │  @Get()      findAll(@Query() filter)                │  │
│  │  @Get(':id') findOne(@Param('id') id)               │  │
│  │  @Post()     create(@Body() dto: CreatePostDto)     │  │
│  │  @Patch(':id') update(@Body() dto: UpdatePostDto)   │  │
│  │  @Delete(':id') remove(@Param('id') id)             │  │
│  └─────────────────┬─────────────────────────────────────┘  │
│                    │                                         │
│  ┌─────────────────▼─────────────────────────────────────┐  │
│  │              PostsService                              │  │
│  │  @Injectable()                                         │  │
│  │  • CRUD operations                                     │  │
│  │  • Filtering by category                              │  │
│  └─────────────────┬─────────────────────────────────────┘  │
│                    │                                         │
│  ┌─────────────────▼─────────────────────────────────────┐  │
│  │              TypeORM Repository                        │  │
│  │  Repository<Post>                                      │  │
│  └─────────────────┬─────────────────────────────────────┘  │
└────────────────────┼─────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   PostgreSQL Database   │
        │   blog_middleware_db    │
        │                         │
        │  Table: posts           │
        │  - id (PK)              │
        │  - title                │
        │  - content              │
        │  - author               │
        │  - category             │
        │  - published            │
        │  - createdAt            │
        └────────────────────────┘


Response Headers:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
X-Request-ID: c9d7e7c8-1234-5678-9abc-def012345678
X-Response-Time: 45ms
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640000000
```

---

## Project 3: E-commerce API Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Postman)                        │
│             Authorization: Bearer <JWT-TOKEN>                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    NestJS Application                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Security Layer                            │  │
│  │  • Helmet (Security headers)                          │  │
│  │  • CORS (Cross-origin config)                         │  │
│  │  • ValidationPipe (Global)                            │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Auth Module                               │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  AuthController                                  │  │  │
│  │  │  @Post('register') - Public                     │  │  │
│  │  │  @Post('login')    - Public                     │  │  │
│  │  │  @Get('profile')   - @UseGuards(JwtAuthGuard)  │  │  │
│  │  └─────────────────┬───────────────────────────────┘  │  │
│  │                    │                                   │  │
│  │  ┌─────────────────▼───────────────────────────────┐  │  │
│  │  │  AuthService                                     │  │  │
│  │  │  • register(): hash password, create user       │  │  │
│  │  │  • login(): validate, generate JWT              │  │  │
│  │  │  • Uses UsersService (DI)                       │  │  │
│  │  └─────────────────┬───────────────────────────────┘  │  │
│  │                    │                                   │  │
│  │  ┌─────────────────▼───────────────────────────────┐  │  │
│  │  │  JwtStrategy                                     │  │  │
│  │  │  • Validate JWT token                           │  │  │
│  │  │  • Extract user from payload                    │  │  │
│  │  │  • Attach to request.user                       │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Products Module                           │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  ProductsController                              │  │  │
│  │  │  @Get()        - Public                         │  │  │
│  │  │  @Get(':id')   - Public                         │  │  │
│  │  │  @Post()       - @UseGuards(JwtAuthGuard)      │  │  │
│  │  │  @Patch(':id') - @UseGuards(JwtAuthGuard)      │  │  │
│  │  │  @Delete(':id')- @UseGuards(JwtAuthGuard)      │  │  │
│  │  └─────────────────┬───────────────────────────────┘  │  │
│  │                    │                                   │  │
│  │  ┌─────────────────▼───────────────────────────────┐  │  │
│  │  │  ProductsService                                 │  │  │
│  │  │  @Injectable()                                   │  │  │
│  │  │  • CRUD operations                               │  │  │
│  │  │  • Stock management                              │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Orders Module                             │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  OrdersController                                │  │  │
│  │  │  All routes: @UseGuards(JwtAuthGuard)          │  │  │
│  │  │  @Post()       - Create order                   │  │  │
│  │  │  @Get()        - Get my orders                  │  │  │
│  │  │  @Get(':id')   - Get order details             │  │  │
│  │  │  @Patch(':id') - Update status (admin)         │  │  │
│  │  └─────────────────┬───────────────────────────────┘  │  │
│  │                    │                                   │  │
│  │  ┌─────────────────▼───────────────────────────────┐  │  │
│  │  │  OrdersService (Dependency Injection)           │  │  │
│  │  │  @Injectable()                                   │  │  │
│  │  │  constructor(                                    │  │  │
│  │  │    private productsService: ProductsService,   │  │  │
│  │  │    @InjectRepository(Order) orderRepo,         │  │  │
│  │  │    @InjectRepository(OrderItem) itemRepo       │  │  │
│  │  │  )                                               │  │  │
│  │  │                                                   │  │  │
│  │  │  • Validate product availability                │  │  │
│  │  │  • Check stock via ProductsService             │  │  │
│  │  │  • Calculate totals                             │  │  │
│  │  │  • Create order + order items                   │  │  │
│  │  │  • Reduce stock via ProductsService            │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
        ┌────────────────────────────────────┐
        │   PostgreSQL Database (ecommerce_db)│
        │                                     │
        │  ┌──────────┐    ┌──────────┐     │
        │  │  users   │    │ products │     │
        │  │  - id    │    │  - id    │     │
        │  │  - email │    │  - name  │     │
        │  │  - pass  │    │  - price │     │
        │  │  - role  │    │  - stock │     │
        │  └──────────┘    └──────────┘     │
        │       │               │            │
        │       │               │            │
        │  ┌────▼─────┐    ┌───▼────────┐  │
        │  │  orders  │    │order_items │  │
        │  │  - id    │◄───┤  - id      │  │
        │  │  - userId│    │  - orderId │  │
        │  │  - status│    │  - productId│ │
        │  │  - total │    │  - quantity│  │
        │  └──────────┘    └────────────┘  │
        └────────────────────────────────────┘
```

---

## Request Flow Comparison

### Project 1: Simple Flow (DTOs & Pipes)
```
Request
  ↓
ValidationPipe (Global)
  ↓
Custom Pipes (Trim, Lowercase, Hash)
  ↓
Controller
  ↓
DTO Validation
  ↓
Service
  ↓
Repository
  ↓
Database
  ↓
Response
```

### Project 2: Middleware Chain
```
Request
  ↓
RequestIdMiddleware
  ↓
LoggerMiddleware
  ↓
ResponseTimeMiddleware
  ↓
RateLimitMiddleware
  ↓
ApiKeyMiddleware (conditional)
  ↓
IpWhitelistMiddleware (conditional)
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database
  ↓
Response (with headers)
```

### Project 3: Authentication Flow
```
Request (with JWT)
  ↓
JwtAuthGuard
  ↓
JwtStrategy.validate()
  ↓
Extract user from token
  ↓
Attach to request.user
  ↓
Controller (@UseGuards(JwtAuthGuard))
  ↓
Service (with DI)
  ↓
Repository
  ↓
Database
  ↓
Response
```

---

## Dependency Injection Graph (Project 3)

```
AppModule
├── ConfigModule (Global)
│   └── Environment variables
│
├── DatabaseModule (Global)
│   └── TypeORM Connection
│
├── AuthModule
│   ├── AuthController
│   ├── AuthService
│   │   └── depends on: UsersService ⬅️ DI
│   ├── JwtStrategy
│   ├── JwtModule
│   └── PassportModule
│
├── UsersModule
│   ├── UsersService
│   │   └── depends on: User Repository ⬅️ DI
│   └── exports: UsersService ➡️ Available to other modules
│
├── ProductsModule
│   ├── ProductsController
│   ├── ProductsService
│   │   └── depends on: Product Repository ⬅️ DI
│   └── exports: ProductsService ➡️ Available to OrdersModule
│
└── OrdersModule
    ├── OrdersController
    └── OrdersService
        ├── depends on: ProductsService ⬅️ DI (from ProductsModule)
        ├── depends on: Order Repository ⬅️ DI
        └── depends on: OrderItem Repository ⬅️ DI


Legend:
⬅️ Dependency Injected
➡️ Exported for other modules
```

---

## Data Flow: Create Order (Project 3)

```
1. Client Request
   POST /orders
   Authorization: Bearer <JWT>
   Body: { items: [...], shippingAddress: {...} }
        │
        ▼
2. JwtAuthGuard
   • Validate JWT token
   • Extract user ID: 123
   • Attach to request.user
        │
        ▼
3. OrdersController.create()
   • Receives CreateOrderDto
   • Passes to OrdersService
        │
        ▼
4. OrdersService.create()
   ┌─────────────────────────────┐
   │ For each item in order:     │
   │                              │
   │ 4.1. Call ProductsService    │◄─── DI: ProductsService
   │      product = await         │
   │      productsService         │
   │      .findOne(productId)     │
   │                              │
   │ 4.2. Validate availability   │
   │      if (!product.isActive)  │
   │        throw error           │
   │                              │
   │ 4.3. Check stock             │
   │      if (product.stock <     │
   │          quantity)           │
   │        throw error           │
   │                              │
   │ 4.4. Calculate item total    │
   │      itemTotal =             │
   │        product.price * qty   │
   └─────────────────────────────┘
        │
        ▼
5. Calculate Order Totals
   subtotal = sum(item totals)
   tax = subtotal * 0.1 (10%)
   shipping = 10.00 (flat rate)
   total = subtotal + tax + shipping
        │
        ▼
6. Database Transaction
   ┌─────────────────────────────┐
   │ BEGIN TRANSACTION           │
   │                              │
   │ 6.1. Create Order            │
   │      INSERT INTO orders      │
   │                              │
   │ 6.2. Create Order Items      │
   │      INSERT INTO order_items │
   │                              │
   │ 6.3. Reduce Product Stock    │◄─── DI: ProductsService
   │      await productsService   │
   │      .updateStock()          │
   │                              │
   │ COMMIT TRANSACTION           │
   └─────────────────────────────┘
        │
        ▼
7. Response
   {
     "id": 456,
     "userId": 123,
     "status": "pending",
     "subtotal": 100.00,
     "tax": 10.00,
     "shipping": 10.00,
     "total": 120.00,
     "items": [...],
     "createdAt": "2024-01-15T10:30:00Z"
   }


Key DI Benefits Demonstrated:
✅ OrdersService doesn't know HOW to fetch products
✅ ProductsService handles all product logic
✅ Easy to test (mock ProductsService)
✅ Single Responsibility Principle
✅ Loose coupling between modules
```

---

## Module Dependencies

```
                    ┌─────────────┐
                    │  AppModule  │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌────▼────┐      ┌────▼────┐
    │  Auth   │      │Products │      │ Orders  │
    │ Module  │      │ Module  │      │ Module  │
    └────┬────┘      └────┬────┘      └────┬────┘
         │                │                 │
    ┌────▼────┐           │            ┌────▼────────────┐
    │  Users  │◄──────────┘            │ Imports:        │
    │ Module  │                        │ • UsersModule   │
    └─────────┘                        │ • ProductsModule│
                                       └─────────────────┘

Dependencies:
• AuthModule imports UsersModule (to create/find users)
• OrdersModule imports ProductsModule (to validate products)
• OrdersModule imports UsersModule (to validate users)
```

---

**Created:** December 2024  
**Purpose:** Visual learning aid for Week 22 demo projects
