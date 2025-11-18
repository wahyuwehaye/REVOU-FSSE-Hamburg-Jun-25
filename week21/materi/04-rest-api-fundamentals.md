# REST API Fundamentals

## Apa itu REST API?

**REST (Representational State Transfer)** adalah architectural style untuk designing networked applications. **REST API** adalah interface yang memungkinkan komunikasi antara client dan server menggunakan HTTP protocol.

## REST API Principles

### 1. **Client-Server Architecture**

Pemisahan antara client dan server:

```
┌─────────────┐                 ┌─────────────┐
│   CLIENT    │    HTTP         │   SERVER    │
│  (Browser)  │ ←──────────→    │   (API)     │
│   Mobile    │   Request       │  Database   │
└─────────────┘   Response      └─────────────┘
```

**Benefits:**
- Client dan server dapat develop secara independent
- Client tidak perlu tahu database structure
- Server tidak perlu tahu UI implementation

### 2. **Stateless**

Setiap request harus contain semua information yang dibutuhkan:

```typescript
// ❌ Stateful (BAD)
// Request 1: Login
POST /login
{ "email": "user@example.com", "password": "123456" }
// Server stores: currentUser = user1

// Request 2: Get profile (relies on server memory)
GET /profile
// Server uses stored currentUser

// ✅ Stateless (GOOD)
// Request 1: Login
POST /login
{ "email": "user@example.com", "password": "123456" }
Response: { "token": "jwt_token_here" }

// Request 2: Get profile (includes auth)
GET /profile
Headers: { "Authorization": "Bearer jwt_token_here" }
```

**Benefits:**
- Easier to scale (any server can handle any request)
- More reliable
- Easier to cache

### 3. **Uniform Interface**

Consistent way to interact with resources:

```
Resource: /users

GET    /users      - Get all users
GET    /users/1    - Get user with id 1
POST   /users      - Create new user
PUT    /users/1    - Update user with id 1
DELETE /users/1    - Delete user with id 1
```

### 4. **Resource-Based**

Everything is a resource with unique identifier:

```
Resources:
- /users
- /products
- /orders
- /categories

Resource with ID:
- /users/123
- /products/456
- /orders/789
```

### 5. **Cacheable**

Responses should indicate if they can be cached:

```typescript
// Cacheable response
@Get('products')
@Header('Cache-Control', 'max-age=3600')
findAll() {
  return this.productsService.findAll();
}
```

## HTTP Methods (CRUD Operations)

### 1. **GET - Read/Retrieve**

Mengambil data dari server.

```typescript
// Get all users
GET /api/users
Response: 200 OK
[
  { "id": 1, "name": "John", "email": "john@example.com" },
  { "id": 2, "name": "Jane", "email": "jane@example.com" }
]

// Get single user
GET /api/users/1
Response: 200 OK
{ "id": 1, "name": "John", "email": "john@example.com" }

// Get with query parameters
GET /api/users?page=1&limit=10&sort=name
Response: 200 OK
{
  "data": [...],
  "page": 1,
  "totalPages": 5
}
```

**Characteristics:**
- Safe: Tidak mengubah data
- Idempotent: Multiple requests return same result
- Cacheable: Bisa di-cache

### 2. **POST - Create**

Membuat resource baru.

```typescript
POST /api/users
Headers: { "Content-Type": "application/json" }
Body: {
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123"
}

Response: 201 Created
{
  "id": 3,
  "name": "Alice",
  "email": "alice@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Characteristics:**
- Not safe: Mengubah data
- Not idempotent: Multiple requests create multiple resources
- Returns 201 Created

### 3. **PUT - Update (Full Replace)**

Meng-update resource secara keseluruhan.

```typescript
PUT /api/users/1
Headers: { "Content-Type": "application/json" }
Body: {
  "name": "John Updated",
  "email": "john.updated@example.com",
  "age": 30
}

Response: 200 OK
{
  "id": 1,
  "name": "John Updated",
  "email": "john.updated@example.com",
  "age": 30,
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

**Characteristics:**
- Not safe: Mengubah data
- Idempotent: Multiple identical requests have same effect
- Replace entire resource

### 4. **PATCH - Partial Update**

Meng-update sebagian field dari resource.

```typescript
PATCH /api/users/1
Headers: { "Content-Type": "application/json" }
Body: {
  "name": "John Modified"
}

Response: 200 OK
{
  "id": 1,
  "name": "John Modified",
  "email": "john@example.com", // unchanged
  "age": 30,                     // unchanged
  "updatedAt": "2024-01-15T11:15:00Z"
}
```

### 5. **DELETE - Delete**

Menghapus resource.

```typescript
DELETE /api/users/1

Response: 204 No Content
// or
Response: 200 OK
{
  "message": "User deleted successfully"
}
```

**Characteristics:**
- Not safe: Mengubah data
- Idempotent: Multiple requests have same effect (resource deleted)

## HTTP Status Codes

### Success Codes (2xx)

```typescript
200 OK              // Request successful
201 Created         // Resource created successfully
204 No Content      // Success, no content to return
```

### Client Error Codes (4xx)

```typescript
400 Bad Request     // Invalid request data
401 Unauthorized    // Authentication required
403 Forbidden       // No permission
404 Not Found       // Resource not found
409 Conflict        // Conflict with current state
422 Unprocessable   // Validation error
```

### Server Error Codes (5xx)

```typescript
500 Internal Error  // Server error
502 Bad Gateway     // Invalid response from upstream
503 Service Unavailable // Server overloaded
```

## REST API Design Best Practices

### 1. **Use Nouns, Not Verbs**

```typescript
// ❌ BAD
GET  /getAllUsers
POST /createUser
PUT  /updateUser/1
DELETE /deleteUser/1

// ✅ GOOD
GET    /users
POST   /users
PUT    /users/1
DELETE /users/1
```

### 2. **Use Plural Nouns**

```typescript
// ❌ BAD
GET /user/1
GET /product/123

// ✅ GOOD
GET /users/1
GET /products/123
```

### 3. **Use Nested Resources for Relationships**

```typescript
// Get all posts by user 1
GET /users/1/posts

// Get specific post by user 1
GET /users/1/posts/5

// Get comments on post 5
GET /posts/5/comments

// Add comment to post 5
POST /posts/5/comments
```

### 4. **Use Query Parameters for Filtering, Sorting, Pagination**

```typescript
// Filtering
GET /products?category=electronics&price_min=100&price_max=500

// Sorting
GET /products?sort=price&order=desc

// Pagination
GET /products?page=2&limit=20

// Search
GET /products?search=laptop

// Combined
GET /products?category=electronics&sort=price&order=asc&page=1&limit=10
```

### 5. **Versioning**

```typescript
// URL versioning
GET /api/v1/users
GET /api/v2/users

// Header versioning
GET /api/users
Headers: { "Accept": "application/vnd.myapi.v1+json" }

// Query parameter
GET /api/users?version=1
```

### 6. **Consistent Response Format**

```typescript
// Success response
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John"
  },
  "message": "User retrieved successfully"
}

// Error response
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with id 999 not found",
    "details": []
  }
}

// List response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 7. **Use Proper Status Codes**

```typescript
@Controller('users')
export class UsersController {
  @Post()
  @HttpCode(201) // Created
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found'); // 404
    }
    return user; // 200
  }

  @Delete(':id')
  @HttpCode(204) // No Content
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

## Request & Response Examples

### GET Request

```typescript
// Request
GET /api/products/123
Headers: {
  "Authorization": "Bearer token_here",
  "Accept": "application/json"
}

// Response
Status: 200 OK
Headers: {
  "Content-Type": "application/json",
  "Cache-Control": "max-age=3600"
}
Body: {
  "id": 123,
  "name": "Laptop",
  "price": 15000000,
  "category": "Electronics",
  "stock": 50
}
```

### POST Request

```typescript
// Request
POST /api/products
Headers: {
  "Authorization": "Bearer token_here",
  "Content-Type": "application/json"
}
Body: {
  "name": "New Laptop",
  "price": 18000000,
  "category": "Electronics",
  "stock": 30
}

// Response
Status: 201 Created
Headers: {
  "Content-Type": "application/json",
  "Location": "/api/products/124"
}
Body: {
  "id": 124,
  "name": "New Laptop",
  "price": 18000000,
  "category": "Electronics",
  "stock": 30,
  "createdAt": "2024-01-15T12:00:00Z"
}
```

### PUT Request

```typescript
// Request
PUT /api/products/123
Headers: {
  "Authorization": "Bearer token_here",
  "Content-Type": "application/json"
}
Body: {
  "name": "Updated Laptop",
  "price": 16000000,
  "category": "Electronics",
  "stock": 45
}

// Response
Status: 200 OK
Body: {
  "id": 123,
  "name": "Updated Laptop",
  "price": 16000000,
  "category": "Electronics",
  "stock": 45,
  "updatedAt": "2024-01-15T12:30:00Z"
}
```

### DELETE Request

```typescript
// Request
DELETE /api/products/123
Headers: {
  "Authorization": "Bearer token_here"
}

// Response
Status: 204 No Content
// No body
```

## API Endpoint Patterns

### Complete CRUD Example

```typescript
// Products API
GET    /api/products          // Get all products
GET    /api/products/:id      // Get one product
POST   /api/products          // Create product
PUT    /api/products/:id      // Update product (full)
PATCH  /api/products/:id      // Update product (partial)
DELETE /api/products/:id      // Delete product

// With relationships
GET    /api/categories/:id/products  // Get products by category
GET    /api/users/:id/orders         // Get user's orders
POST   /api/orders/:id/items         // Add item to order

// With actions
POST   /api/orders/:id/cancel        // Cancel order
POST   /api/users/:id/activate       // Activate user
POST   /api/products/:id/publish     // Publish product
```

## Authentication & Authorization

### Bearer Token (JWT)

```typescript
// Login endpoint
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "secret123"
}
Response: {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John"
  }
}

// Protected endpoint
GET /api/profile
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Response: {
  "id": 1,
  "email": "user@example.com",
  "name": "John"
}
```

## Error Handling

### Standard Error Response

```typescript
// Validation error (400)
{
  "statusCode": 400,
  "message": [
    "email must be a valid email",
    "password must be at least 8 characters"
  ],
  "error": "Bad Request"
}

// Not found (404)
{
  "statusCode": 404,
  "message": "Product with id 999 not found",
  "error": "Not Found"
}

// Unauthorized (401)
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}

// Server error (500)
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## HATEOAS (Optional)

Hypermedia As The Engine Of Application State - menyertakan links ke related resources:

```typescript
{
  "id": 1,
  "name": "John",
  "email": "john@example.com",
  "_links": {
    "self": { "href": "/api/users/1" },
    "posts": { "href": "/api/users/1/posts" },
    "orders": { "href": "/api/users/1/orders" },
    "update": { "href": "/api/users/1", "method": "PUT" },
    "delete": { "href": "/api/users/1", "method": "DELETE" }
  }
}
```

## REST API Design Checklist

- ✅ Use HTTP methods correctly (GET, POST, PUT, PATCH, DELETE)
- ✅ Use proper status codes
- ✅ Use nouns for resources, not verbs
- ✅ Use plural nouns
- ✅ Use nested resources for relationships
- ✅ Use query params for filtering/sorting/pagination
- ✅ Implement proper error handling
- ✅ Provide consistent response format
- ✅ Use authentication/authorization
- ✅ Version your API
- ✅ Document your API
- ✅ Implement rate limiting
- ✅ Use HTTPS in production

## Kesimpulan

REST API adalah standard yang widely-adopted untuk building web APIs karena:
- **Simple**: Easy to understand dan implement
- **Scalable**: Stateless nature makes it easy to scale
- **Flexible**: Works dengan any programming language
- **Standard**: HTTP methods dan status codes are universal

## Next Steps

Setelah memahami REST API fundamentals, selanjutnya:
1. Setup development environment
2. Install NestJS
3. Create first REST API endpoint
4. Test dengan Postman

---

**Key Takeaway:**
> REST API uses HTTP methods to perform CRUD operations on resources, dengan consistent structure dan proper status codes.
