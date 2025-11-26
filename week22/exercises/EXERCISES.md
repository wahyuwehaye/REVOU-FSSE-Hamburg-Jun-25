# Week 22: Practice Exercises

Exercises untuk mempraktikkan konsep DTOs, Pipes, Middleware, Dependency Injection, dan Deployment.

---

## 📋 How to Use This Guide

1. **Complete exercises in order** - Setiap exercise builds on previous concepts
2. **Check solutions** after attempting - Solutions ada di folder `solutions/`
3. **Test your code** - Pastikan semua tests pass
4. **Ask for help** jika stuck - Review chapters atau tanya di Discord

---

## Exercise 1: Basic DTOs & Validation

**Difficulty:** ⭐ Easy  
**Time:** 30 minutes  
**Chapters:** 1-3

### Task

Buat Book Management API dengan CRUD operations.

### Requirements

1. Create `BookDto` dengan properties:
   - `title` (string, min 3 chars, max 100 chars)
   - `author` (string, min 2 chars)
   - `isbn` (string, must match ISBN-10 or ISBN-13 format)
   - `publishedYear` (number, between 1000 and current year)
   - `price` (number, min 0.01)
   - `genres` (array of strings, min 1 item)

2. Create `UpdateBookDto` using `PartialType`

3. Implement validation dengan class-validator decorators

### Expected Output

```typescript
// Valid request
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "978-0132350884",
  "publishedYear": 2008,
  "price": 29.99,
  "genres": ["Programming", "Software Engineering"]
}

// Should pass validation ✅

// Invalid request
{
  "title": "AB",  // Too short
  "author": "X",  // Too short
  "isbn": "123",  // Invalid format
  "publishedYear": 3000,  // Future year
  "price": -10,  // Negative price
  "genres": []  // Empty array
}

// Should fail validation ❌
```

### Acceptance Criteria

- ✅ All validation rules work correctly
- ✅ Custom error messages provided
- ✅ UpdateBookDto allows partial updates
- ✅ ISBN format validated with regex

---

## Exercise 2: Nested DTOs

**Difficulty:** ⭐⭐ Medium  
**Time:** 45 minutes  
**Chapters:** 4

### Task

Extend Book Management API dengan Author and Publisher details.

### Requirements

1. Create nested DTOs:

```typescript
// AuthorDetailsDto
- firstName (string, min 2 chars)
- lastName (string, min 2 chars)
- biography (string, optional, max 500 chars)
- birthYear (number, between 1000 and current year, optional)

// PublisherDto
- name (string, min 2 chars)
- country (string, 2-letter country code)
- website (string, valid URL, optional)
- established (number, between 1000 and current year)

// CreateBookDto (extended)
- ... previous properties
- author: AuthorDetailsDto
- publisher: PublisherDto
- metadata (object, optional)
  - pageCount (number, min 1)
  - language (string, 2-letter code)
  - edition (number, min 1)
```

2. Use `@ValidateNested()` decorator
3. Validate country code format (e.g., "US", "ID", "UK")
4. Validate URL format for website

### Expected Output

```typescript
// Valid nested request
{
  "title": "Clean Code",
  "author": {
    "firstName": "Robert",
    "lastName": "Martin",
    "biography": "Software engineer and author...",
    "birthYear": 1952
  },
  "publisher": {
    "name": "Prentice Hall",
    "country": "US",
    "website": "https://www.pearson.com",
    "established": 1913
  },
  "metadata": {
    "pageCount": 464,
    "language": "en",
    "edition": 1
  },
  // ... other properties
}
```

### Acceptance Criteria

- ✅ Nested objects validated correctly
- ✅ Optional fields work properly
- ✅ Country code format validated (2 letters)
- ✅ URL format validated
- ✅ Clear error messages for nested validation

---

## Exercise 3: Custom Transformation Pipes

**Difficulty:** ⭐⭐ Medium  
**Time:** 60 minutes  
**Chapters:** 6-7

### Task

Create custom pipes untuk Book Management API.

### Requirements

1. **SlugifyPipe** - Transform title to URL-friendly slug
   ```typescript
   // Input: "Clean Code: A Handbook"
   // Output: "clean-code-a-handbook"
   ```

2. **NormalizeIsbnPipe** - Remove hyphens and spaces from ISBN
   ```typescript
   // Input: "978-0-13-235088-4"
   // Output: "9780132350884"
   ```

3. **CapitalizePipe** - Capitalize first letter of each word
   ```typescript
   // Input: "robert martin"
   // Output: "Robert Martin"
   ```

4. **SanitizeHtmlPipe** - Remove HTML tags from strings
   ```typescript
   // Input: "<script>alert('xss')</script>Safe text"
   // Output: "Safe text"
   ```

### Implementation Example

```typescript
@Post()
async createBook(
  @Body('title', SlugifyPipe) slug: string,
  @Body('isbn', NormalizeIsbnPipe) isbn: string,
  @Body('author', CapitalizePipe) author: string,
  @Body('description', SanitizeHtmlPipe) description: string,
  @Body() bookDto: CreateBookDto,
) {
  // Use transformed values
}
```

### Acceptance Criteria

- ✅ All pipes implement `PipeTransform` interface
- ✅ Pipes handle edge cases (null, undefined, empty string)
- ✅ Pipes can be used at parameter or method level
- ✅ Tests written for each pipe

---

## Exercise 4: Async Validation Pipe

**Difficulty:** ⭐⭐⭐ Hard  
**Time:** 90 minutes  
**Chapters:** 6

### Task

Create async validation pipe yang check ISBN uniqueness di database.

### Requirements

1. **UniqueIsbnPipe** - Check if ISBN already exists
   - Query database untuk existing ISBN
   - Throw `ConflictException` jika sudah ada
   - Skip validation saat update (jika ISBN sama dengan yang lama)

2. **ValidateBookExistsPipe** - Check if book ID exists
   - Query database by ID
   - Throw `NotFoundException` jika tidak ada
   - Return book entity untuk digunakan di controller

### Implementation Example

```typescript
@Post()
async createBook(
  @Body('isbn', UniqueIsbnPipe) isbn: string,
  @Body() bookDto: CreateBookDto,
) {
  // ISBN guaranteed to be unique
}

@Patch(':id')
async updateBook(
  @Param('id', ParseIntPipe, ValidateBookExistsPipe) book: Book,
  @Body() updateDto: UpdateBookDto,
) {
  // Book guaranteed to exist
}
```

### Acceptance Criteria

- ✅ Async validation works correctly
- ✅ Database queries optimized
- ✅ Proper error messages
- ✅ Works with transactions
- ✅ Tests use mocked repository

---

## Exercise 5: Request Logging Middleware

**Difficulty:** ⭐⭐ Medium  
**Time:** 45 minutes  
**Chapters:** 8-11

### Task

Create comprehensive request logging middleware.

### Requirements

1. Log setiap incoming request dengan info:
   - Request ID (UUID)
   - Timestamp (ISO 8601)
   - HTTP method
   - URL path
   - Query parameters
   - Client IP address
   - User agent

2. Log response dengan info:
   - Response status code
   - Response time (in ms)
   - Response size (in bytes)

3. Format log untuk easy parsing:
   ```
   [2024-01-15T10:30:00.000Z] [c9d7e7c8-1234] GET /books?page=1 200 45ms 1.2KB - Mozilla/5.0... - 192.168.1.1
   ```

### Expected Output

```
[2024-01-15T10:30:00.123Z] [a1b2c3d4-5678] GET /books 200 23ms 2.5KB - PostmanRuntime/7.32 - 127.0.0.1
[2024-01-15T10:30:01.456Z] [e9f8g7h6-5432] POST /books 201 156ms 0.8KB - PostmanRuntime/7.32 - 127.0.0.1
[2024-01-15T10:30:02.789Z] [i5j4k3l2-9876] GET /books/123 404 12ms 0.3KB - PostmanRuntime/7.32 - 127.0.0.1
```

### Acceptance Criteria

- ✅ All requests logged
- ✅ Unique request ID generated
- ✅ Response time accurate
- ✅ No performance impact
- ✅ Logs can be parsed by log aggregators

---

## Exercise 6: Authentication Middleware

**Difficulty:** ⭐⭐⭐ Hard  
**Time:** 90 minutes  
**Chapters:** 8-11

### Task

Create authentication middleware dengan multiple strategies.

### Requirements

1. **API Key Authentication**
   - Check `X-API-KEY` header
   - Validate against database or env variable
   - Support multiple API keys dengan different permissions

2. **Bearer Token Authentication**
   - Check `Authorization: Bearer <token>` header
   - Validate JWT token
   - Extract user from token
   - Attach user to `request.user`

3. **Basic Authentication** (optional)
   - Check `Authorization: Basic <credentials>` header
   - Decode base64 credentials
   - Validate username and password

4. Apply middleware selectively:
   - Public routes: no auth required
   - Protected routes: API key or Bearer token
   - Admin routes: Bearer token with admin role

### Implementation Example

```typescript
// app.module.ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware)
      .forRoutes({ path: 'books', method: RequestMethod.POST })
      .apply(BearerTokenMiddleware)
      .forRoutes('admin/*');
  }
}
```

### Acceptance Criteria

- ✅ Multiple auth strategies implemented
- ✅ Middleware applied selectively
- ✅ Proper error handling (401, 403)
- ✅ User info available in controllers
- ✅ Tests for all auth scenarios

---

## Exercise 7: Rate Limiting Middleware

**Difficulty:** ⭐⭐⭐ Hard  
**Time:** 90 minutes  
**Chapters:** 8-11

### Task

Create sophisticated rate limiting middleware.

### Requirements

1. Implement multiple rate limiting strategies:
   - **By IP**: 100 requests per 15 minutes per IP
   - **By API Key**: 1000 requests per hour per API key
   - **By User**: 500 requests per hour per authenticated user

2. Store request counts:
   - Use in-memory cache (for simple cases)
   - Use Redis (for production)

3. Set response headers:
   ```
   X-RateLimit-Limit: 100
   X-RateLimit-Remaining: 87
   X-RateLimit-Reset: 1640000000
   Retry-After: 900
   ```

4. Return 429 status when limit exceeded:
   ```json
   {
     "statusCode": 429,
     "message": "Too many requests. Please try again in 15 minutes.",
     "retryAfter": 900
   }
   ```

### Bonus Features

- [ ] Different limits for different endpoints
- [ ] Whitelist certain IPs (no limits)
- [ ] Burst allowance (temporary spike)
- [ ] Custom limits per user role

### Acceptance Criteria

- ✅ Rate limiting works correctly
- ✅ Headers set properly
- ✅ Redis integration (optional)
- ✅ Configurable limits
- ✅ Tests with time mocking

---

## Exercise 8: Dependency Injection Practice

**Difficulty:** ⭐⭐ Medium  
**Time:** 60 minutes  
**Chapters:** 12-15

### Task

Refactor Book Management API dengan proper DI patterns.

### Requirements

1. **Create services:**
   - `BooksService` - Main book operations
   - `AuthorsService` - Author management
   - `PublishersService` - Publisher management
   - `InventoryService` - Stock tracking
   - `NotificationService` - Email notifications

2. **Implement dependencies:**
   ```typescript
   // BooksService depends on:
   - AuthorsService (to validate author)
   - PublishersService (to validate publisher)
   - InventoryService (to track stock)
   - NotificationService (to send email on new book)
   ```

3. **Create custom providers:**
   - `DATABASE_CONNECTION` - Database connection token
   - `CONFIG_OPTIONS` - Configuration token
   - Factory provider untuk external API client

4. **Use proper provider scopes:**
   - Singleton (default) untuk services
   - Request scope untuk user context
   - Transient scope untuk utility classes

### Implementation Example

```typescript
@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private authorsService: AuthorsService,
    private publishersService: PublishersService,
    private inventoryService: InventoryService,
    private notificationService: NotificationService,
  ) {}

  async createBook(bookDto: CreateBookDto) {
    // Validate author exists
    await this.authorsService.findOne(bookDto.authorId);
    
    // Validate publisher exists
    await this.publishersService.findOne(bookDto.publisherId);
    
    // Create book
    const book = await this.bookRepository.save(bookDto);
    
    // Initialize inventory
    await this.inventoryService.initialize(book.id, bookDto.initialStock);
    
    // Send notification
    await this.notificationService.sendNewBookEmail(book);
    
    return book;
  }
}
```

### Acceptance Criteria

- ✅ All services properly injected
- ✅ No circular dependencies
- ✅ Services testable with mocks
- ✅ Custom providers working
- ✅ Module exports/imports correct

---

## Exercise 9: Testing with DI

**Difficulty:** ⭐⭐⭐ Hard  
**Time:** 120 minutes  
**Chapters:** 15

### Task

Write comprehensive tests untuk Book Management API.

### Requirements

1. **Unit Tests** untuk BooksService:
   - Mock all dependencies
   - Test each method
   - Test error cases
   - Test edge cases

2. **Integration Tests** untuk BooksController:
   - Use TestingModule
   - Mock database
   - Test complete request/response flow

3. **E2E Tests**:
   - Test complete API endpoints
   - Use real database (in-memory)
   - Test authentication
   - Test validation

### Test Examples

```typescript
// Unit test
describe('BooksService', () => {
  let service: BooksService;
  let authorsService: jest.Mocked<AuthorsService>;
  let publishersService: jest.Mocked<PublishersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: AuthorsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: PublishersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        // ... other mocks
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    authorsService = module.get(AuthorsService);
    publishersService = module.get(PublishersService);
  });

  it('should create a book', async () => {
    // Test implementation
  });

  it('should throw error if author not found', async () => {
    // Test implementation
  });
});
```

### Acceptance Criteria

- ✅ Test coverage > 80%
- ✅ All services tested
- ✅ All controllers tested
- ✅ E2E tests pass
- ✅ Tests run fast (<10s total)

---

## Exercise 10: Deployment Project

**Difficulty:** ⭐⭐⭐ Hard  
**Time:** 120 minutes  
**Chapters:** 16-21

### Task

Deploy Book Management API to production.

### Requirements

1. **Environment Configuration**
   - Create `.env.example`
   - Setup ConfigModule
   - Validate environment variables
   - Use different configs for dev/prod

2. **Security Setup**
   - Enable CORS with specific origins
   - Add Helmet for security headers
   - Implement rate limiting
   - Add API versioning
   - Enable HTTPS

3. **Database Setup**
   - Use PostgreSQL on Render
   - Setup connection pooling
   - Enable SSL for database connection
   - Create migrations

4. **Deploy to Render**
   - Create render.yaml
   - Configure build command
   - Configure start command
   - Setup environment variables
   - Connect to database

5. **Monitoring & Logging**
   - Add health check endpoint
   - Add metrics endpoint
   - Configure logging level
   - Setup error tracking (optional: Sentry)

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connected
- [ ] CORS enabled
- [ ] Security headers added
- [ ] Rate limiting enabled
- [ ] Health check working
- [ ] Application deployed
- [ ] HTTPS working
- [ ] API accessible
- [ ] Error handling works
- [ ] Logging works
- [ ] Performance acceptable

### Acceptance Criteria

- ✅ Application deployed successfully
- ✅ Health check returns 200 OK
- ✅ All endpoints accessible
- ✅ Database connected
- ✅ Authentication works
- ✅ CORS configured correctly
- ✅ Error handling works
- ✅ Performance acceptable (response time < 200ms)

---

## Bonus Challenges

### Challenge 1: GraphQL Integration

Convert REST API to GraphQL:
- Setup @nestjs/graphql
- Create GraphQL schemas
- Implement queries and mutations
- Add subscriptions for real-time updates

### Challenge 2: Microservices

Break monolith into microservices:
- Books Service
- Authors Service
- Inventory Service
- Notification Service
- Use message broker (RabbitMQ)

### Challenge 3: Advanced Caching

Implement caching strategy:
- Redis for data caching
- Cache frequently accessed books
- Invalidate cache on updates
- Implement cache warming

### Challenge 4: Full-Text Search

Add search functionality:
- Elasticsearch integration
- Index books, authors, publishers
- Implement fuzzy search
- Add search suggestions

### Challenge 5: File Upload

Add book cover upload:
- Multer for file upload
- Validate file type (images only)
- Resize images (thumbnail, medium, large)
- Store in S3 or Cloudinary
- Add CDN for fast delivery

---

## 📊 Progress Tracking

Track your progress:

### Basic Exercises (Required)
- [ ] Exercise 1: Basic DTOs ✅
- [ ] Exercise 2: Nested DTOs ✅
- [ ] Exercise 3: Custom Pipes ✅
- [ ] Exercise 4: Async Validation ✅
- [ ] Exercise 5: Logging Middleware ✅
- [ ] Exercise 6: Authentication ✅
- [ ] Exercise 7: Rate Limiting ✅
- [ ] Exercise 8: DI Practice ✅
- [ ] Exercise 9: Testing ✅
- [ ] Exercise 10: Deployment ✅

### Bonus Challenges (Optional)
- [ ] Challenge 1: GraphQL
- [ ] Challenge 2: Microservices
- [ ] Challenge 3: Caching
- [ ] Challenge 4: Search
- [ ] Challenge 5: File Upload

---

## 💡 Tips for Success

### General Tips
1. **Read chapters first** before attempting exercises
2. **Start simple** - Get basic version working first
3. **Test frequently** - Write tests as you go
4. **Use TypeScript** - Leverage type safety
5. **Follow patterns** - Look at demo projects for examples

### Debugging Tips
1. **Check logs** - Use console.log liberally
2. **Read error messages** - They usually tell you what's wrong
3. **Use debugger** - Set breakpoints in VS Code
4. **Test in isolation** - Test one thing at a time
5. **Check documentation** - NestJS docs are excellent

### Testing Tips
1. **Write tests first** (TDD) if comfortable
2. **Mock dependencies** properly
3. **Test edge cases** not just happy path
4. **Use descriptive test names**
5. **Keep tests simple** and focused

---

## 🆘 Getting Help

### Before Asking:
1. Read the relevant chapter
2. Check demo projects for examples
3. Review error messages carefully
4. Search Stack Overflow
5. Check NestJS documentation

### Where to Ask:
- **Setup issues** → Setup Guide
- **Concept questions** → Re-read chapters
- **Code errors** → Stack Overflow with [nestjs] tag
- **General help** → NestJS Discord

---

## ✅ Submission Guidelines

### What to Submit:

1. **Source Code**
   - Complete NestJS project
   - All exercises implemented
   - Tests included

2. **Documentation**
   - README with setup instructions
   - API documentation
   - Postman collection

3. **Deployment**
   - Deployed to Render (or similar)
   - Publicly accessible URL
   - Health check working

### Evaluation Criteria:

| Criteria | Points | Description |
|----------|--------|-------------|
| Code Quality | 25 | Clean, readable, follows best practices |
| Functionality | 25 | All features work correctly |
| Testing | 20 | Good test coverage, tests pass |
| Documentation | 15 | Clear README, API docs |
| Deployment | 15 | Successfully deployed, accessible |
| **Total** | **100** | |

### Bonus Points:

- Bonus challenges completed: +10 points each
- Exceptional code quality: +5 points
- Creative features: +5 points
- Excellent documentation: +5 points

---

## 🎯 Learning Outcomes

After completing these exercises, you should be able to:

### DTOs & Validation
- ✅ Create complex DTOs with nested objects
- ✅ Implement comprehensive validation rules
- ✅ Use DTO inheritance patterns effectively
- ✅ Create custom validation decorators

### Pipes
- ✅ Create custom transformation pipes
- ✅ Implement async validation pipes
- ✅ Apply pipes at different scopes
- ✅ Handle edge cases in pipes

### Middleware
- ✅ Create various types of middleware
- ✅ Apply middleware selectively
- ✅ Implement authentication middleware
- ✅ Implement rate limiting

### Dependency Injection
- ✅ Structure applications with DI
- ✅ Create custom providers
- ✅ Use different provider scopes
- ✅ Avoid circular dependencies
- ✅ Write testable code

### Deployment
- ✅ Configure applications for production
- ✅ Deploy to cloud platforms
- ✅ Implement security best practices
- ✅ Setup monitoring and logging

---

**Good luck with your exercises! 🚀**

**Remember:** Learning by doing is the best way to master NestJS!
