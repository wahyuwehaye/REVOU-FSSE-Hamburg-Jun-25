# Chapter 21: API Documentation Best Practices

## 📚 Daftar Isi
- [Naming Conventions](#naming-conventions)
- [Writing Descriptions](#writing-descriptions)
- [Providing Examples](#providing-examples)
- [Versioning](#versioning)
- [Error Documentation](#error-documentation)

---

## Naming Conventions

### 1. Endpoint URLs

**✅ DO:**
```
GET    /users           # Get all users
GET    /users/:id       # Get specific user
POST   /users           # Create user
PATCH  /users/:id       # Update user (partial)
PUT    /users/:id       # Update user (full replace)
DELETE /users/:id       # Delete user

# Nested resources
GET    /users/:id/posts          # Get user's posts
GET    /users/:id/posts/:postId  # Get specific post
```

**❌ DON'T:**
```
GET    /getAllUsers
GET    /getUserById/:id
POST   /createUser
POST   /user/update/:id
DELETE /removeUser/:id

# Inconsistent
GET    /user/:id    # Singular
GET    /users       # Plural
```

### 2. Use Plural Nouns

```
✅ /users
✅ /products
✅ /orders

❌ /user
❌ /product
❌ /order
```

### 3. Use Kebab-case for Multi-word

```
✅ /order-items
✅ /user-profiles
✅ /product-categories

❌ /orderItems       # camelCase
❌ /order_items      # snake_case
❌ /OrderItems       # PascalCase
```

### 4. Actions as Sub-resources

```
✅ POST   /orders/:id/cancel
✅ POST   /users/:id/activate
✅ POST   /posts/:id/publish

❌ POST   /cancelOrder/:id
❌ GET    /activateUser/:id
❌ PUT    /publishPost/:id
```

### 5. Query Parameters

```
✅ Good naming:
GET /users?page=1&limit=10&sort=name&order=asc
GET /products?category=electronics&min_price=100
GET /orders?status=pending&date_from=2024-01-01

❌ Bad naming:
GET /users?p=1&l=10&s=name
GET /products?cat=elec&mp=100
```

---

## Writing Descriptions

### 1. Endpoint Descriptions

**❌ Bad:**
```typescript
@ApiOperation({ summary: 'Create user' })
```

**✅ Good:**
```typescript
@ApiOperation({ 
  summary: 'Create a new user account',
  description: `
    Creates a new user account with the provided email and password.
    
    Requirements:
    - Email must be unique
    - Password must be at least 8 characters
    - Password must contain uppercase, lowercase, and numbers
    
    Returns the created user object with auto-generated ID.
  `
})
```

### 2. Parameter Descriptions

**❌ Bad:**
```typescript
@ApiParam({ name: 'id', type: Number })
```

**✅ Good:**
```typescript
@ApiParam({
  name: 'id',
  description: 'Unique user identifier (auto-generated upon creation)',
  type: Number,
  example: 123
})
```

### 3. Response Descriptions

**❌ Bad:**
```typescript
@ApiResponse({ status: 200, description: 'OK' })
```

**✅ Good:**
```typescript
@ApiResponse({ 
  status: 200, 
  description: 'User found and returned successfully. Includes all user fields except password.',
  type: User,
  example: {
    id: 1,
    email: 'john@example.com',
    name: 'John Doe',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
})
```

### 4. Error Descriptions

**✅ Be specific about errors:**
```typescript
@ApiResponse({ 
  status: 400,
  description: 'Validation failed. Check the error message for specific field errors.',
  schema: {
    example: {
      statusCode: 400,
      message: [
        'email must be a valid email',
        'password must be at least 8 characters'
      ],
      error: 'Bad Request'
    }
  }
})
@ApiResponse({ 
  status: 404,
  description: 'User with the specified ID does not exist',
  schema: {
    example: {
      statusCode: 404,
      message: 'User #123 not found',
      error: 'Not Found'
    }
  }
})
@ApiResponse({ 
  status: 409,
  description: 'A user with this email already exists. Email must be unique.',
  schema: {
    example: {
      statusCode: 409,
      message: 'Email already registered',
      error: 'Conflict'
    }
  }
})
```

---

## Providing Examples

### 1. Request Examples

```typescript
@ApiBody({
  type: CreateUserDto,
  description: 'User registration data',
  examples: {
    minimal: {
      summary: 'Minimal required fields',
      description: 'Only email and password',
      value: {
        email: 'john@example.com',
        password: 'SecurePass123!'
      }
    },
    complete: {
      summary: 'Complete user profile',
      description: 'All available fields',
      value: {
        email: 'john@example.com',
        password: 'SecurePass123!',
        name: 'John Doe',
        phone: '+6281234567890',
        dateOfBirth: '1990-01-15',
        address: {
          street: '123 Main St',
          city: 'Jakarta',
          country: 'Indonesia'
        }
      }
    },
    invalid: {
      summary: 'Invalid data (will fail)',
      description: 'Example of validation errors',
      value: {
        email: 'invalid-email',
        password: '123'
      }
    }
  }
})
```

### 2. Response Examples

```typescript
@ApiProperty({
  description: 'User unique identifier',
  example: 1,
  type: Number
})
id: number;

@ApiProperty({
  description: 'User email address',
  example: 'john@example.com',
  type: String
})
email: string;

@ApiProperty({
  description: 'User status',
  enum: ['active', 'inactive', 'suspended'],
  example: 'active'
})
status: string;

@ApiProperty({
  description: 'User roles',
  type: [String],
  example: ['user', 'editor']
})
roles: string[];
```

### 3. Realistic Examples

**❌ Bad:**
```typescript
example: {
  name: 'string',
  email: 'email@email.com',
  age: 0
}
```

**✅ Good:**
```typescript
example: {
  name: 'Jane Smith',
  email: 'jane.smith@company.com',
  age: 28,
  department: 'Engineering',
  joinDate: '2023-06-15'
}
```

---

## Versioning

### 1. URL Versioning (Recommended)

```typescript
// main.ts
app.setGlobalPrefix('api/v1');

// Results in:
// /api/v1/users
// /api/v1/products
```

### 2. Header Versioning

```typescript
// main.ts
app.enableVersioning({
  type: VersioningType.HEADER,
  header: 'API-Version',
});

// Usage
@Controller('users')
@Version('1')
export class UsersV1Controller { }

@Controller('users')
@Version('2')
export class UsersV2Controller { }
```

### 3. Document Multiple Versions

```typescript
const configV1 = new DocumentBuilder()
  .setTitle('API v1')
  .setVersion('1.0')
  .build();

const configV2 = new DocumentBuilder()
  .setTitle('API v2')
  .setVersion('2.0')
  .build();

const documentV1 = SwaggerModule.createDocument(app, configV1);
const documentV2 = SwaggerModule.createDocument(app, configV2);

SwaggerModule.setup('api/v1/docs', app, documentV1);
SwaggerModule.setup('api/v2/docs', app, documentV2);
```

### 4. Deprecation Notices

```typescript
@ApiOperation({
  summary: 'Get user (deprecated)',
  deprecated: true,
  description: `
    ⚠️ DEPRECATED: This endpoint will be removed in v2.0
    Please use GET /api/v2/users/:id instead
    
    Migration guide: https://docs.example.com/migration/v1-to-v2
  `
})
@Get(':id')
findOne(@Param('id') id: string) {
  return this.usersService.findOne(+id);
}
```

---

## Error Documentation

### 1. Standard Error Format

```typescript
// common/dto/error-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Validation failed' })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  timestamp?: string;

  @ApiProperty({ example: '/api/users' })
  path?: string;
}
```

### 2. Document All Error Cases

```typescript
@Controller('users')
export class UsersController {
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User found',
    type: User 
  })
  @ApiResponse({ 
    status: 400,
    description: 'Invalid ID format (must be a number)',
    type: ErrorResponse
  })
  @ApiResponse({ 
    status: 401,
    description: 'Not authenticated (missing or invalid token)',
    type: ErrorResponse
  })
  @ApiResponse({ 
    status: 403,
    description: 'Not authorized to view this user',
    type: ErrorResponse
  })
  @ApiResponse({ 
    status: 404,
    description: 'User not found',
    type: ErrorResponse
  })
  @ApiResponse({ 
    status: 429,
    description: 'Too many requests (rate limit exceeded)',
    type: ErrorResponse
  })
  @ApiResponse({ 
    status: 500,
    description: 'Internal server error',
    type: ErrorResponse
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
```

### 3. Error Code Reference

```typescript
/**
 * Common HTTP Status Codes
 * 
 * 2xx Success
 * - 200 OK: Request succeeded
 * - 201 Created: Resource created
 * - 204 No Content: Success but no content to return
 * 
 * 4xx Client Errors
 * - 400 Bad Request: Invalid input/validation failed
 * - 401 Unauthorized: Not authenticated
 * - 403 Forbidden: Not authorized
 * - 404 Not Found: Resource doesn't exist
 * - 409 Conflict: Resource already exists
 * - 422 Unprocessable Entity: Semantic error
 * - 429 Too Many Requests: Rate limit exceeded
 * 
 * 5xx Server Errors
 * - 500 Internal Server Error: Unexpected error
 * - 503 Service Unavailable: Service temporarily down
 */
```

---

## Additional Best Practices

### 1. Authentication Documentation

```typescript
const config = new DocumentBuilder()
  .setTitle('My API')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .build();

// Usage
@ApiBearerAuth('JWT-auth')
@Controller('protected')
export class ProtectedController {
  @Get()
  @ApiOperation({
    summary: 'Protected endpoint',
    description: 'Requires valid JWT token in Authorization header'
  })
  getData() {
    return 'Protected data';
  }
}
```

### 2. Pagination Documentation

```typescript
export class PaginationDto {
  @ApiProperty({
    description: 'Page number (starts from 1)',
    minimum: 1,
    default: 1,
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10
  })
  limit: number;
}

export class PaginatedResponse<T> {
  @ApiProperty({ description: 'Array of items' })
  data: T[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
      hasNextPage: true,
      hasPreviousPage: false
    }
  })
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
```

### 3. Rate Limiting Documentation

```typescript
@ApiHeader({
  name: 'X-RateLimit-Limit',
  description: 'Maximum requests per window',
  schema: { type: 'integer', example: 100 }
})
@ApiHeader({
  name: 'X-RateLimit-Remaining',
  description: 'Remaining requests in window',
  schema: { type: 'integer', example: 95 }
})
@ApiHeader({
  name: 'X-RateLimit-Reset',
  description: 'Time when rate limit resets (Unix timestamp)',
  schema: { type: 'integer', example: 1640000000 }
})
@ApiResponse({
  status: 429,
  description: 'Rate limit exceeded. Check X-RateLimit-* headers for details.'
})
```

---

## Documentation Checklist

Before releasing API:

- [ ] All endpoints have @ApiOperation with summary
- [ ] All DTOs have @ApiProperty with examples
- [ ] All responses documented (success + errors)
- [ ] Authentication requirements specified
- [ ] Rate limits documented
- [ ] Pagination format documented
- [ ] Examples are realistic and working
- [ ] Error responses include all possible codes
- [ ] Deprecation warnings for old endpoints
- [ ] Version documented
- [ ] Contact/support info provided

---

## Summary

✅ **Naming:** Use plural nouns, kebab-case, REST conventions
✅ **Descriptions:** Be clear, specific, and helpful
✅ **Examples:** Provide realistic, working examples
✅ **Versioning:** Use URL versioning, document all versions
✅ **Errors:** Document all possible error cases
✅ **Complete:** Document everything (auth, pagination, rate limits)

> "Good documentation is like a good UI - it makes the complex simple"

**Next:** Creating Postman Collections! 🚀
