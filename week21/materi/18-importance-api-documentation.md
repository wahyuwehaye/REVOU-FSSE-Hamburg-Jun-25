# Chapter 18: Importance of API Documentation

## 📚 Daftar Isi
- [Why Document Your API](#why-document-your-api)
- [Types of Documentation](#types-of-documentation)
- [Good vs Bad Documentation](#good-vs-bad-documentation)
- [Documentation Best Practices](#documentation-best-practices)

---

## Why Document Your API?

### 1. For Other Developers
API documentation adalah **kontrak** antara backend dan frontend/client developers.

**Without Documentation:**
```
Frontend Dev: "What's the endpoint for creating a user?"
Backend Dev: "Check the code..."
Frontend Dev: "What fields are required?"
Backend Dev: "I think email and password..."
Frontend Dev: "What format for phone number?"
Backend Dev: "Not sure, let me check..."
```

**With Documentation:**
```markdown
## Create User
POST /api/users

Required fields:
- email (string, must be valid email)
- password (string, min 8 chars)
- phone (string, format: +62xxxxxxxxxx)

Returns: User object with id
```

### 2. For Your Future Self
Setelah 3 bulan, kamu sendiri akan lupa:
- ❓ Endpoint apa saja yang tersedia?
- ❓ Parameter apa yang required?
- ❓ Response format seperti apa?
- ❓ Error codes apa yang bisa muncul?

### 3. For Testing
Documentation yang baik bisa langsung digunakan untuk testing.

### 4. For Onboarding
New team members bisa langsung productive dengan documentation yang lengkap.

---

## Types of Documentation

### 1. **Code Comments**
Documentation langsung di code.

```typescript
/**
 * Create a new user account
 * 
 * @param createUserDto - User registration data
 * @returns Created user object with generated ID
 * @throws ConflictException if email already exists
 * @throws BadRequestException if validation fails
 * 
 * @example
 * const user = await usersService.create({
 *   email: 'john@example.com',
 *   password: 'SecurePass123!',
 *   name: 'John Doe'
 * });
 */
async create(createUserDto: CreateUserDto): Promise<User> {
  // Implementation
}
```

### 2. **README / Wiki Documentation**
High-level overview dan getting started guide.

```markdown
# Users API

## Endpoints

### Authentication
- POST /auth/register - Create new account
- POST /auth/login - Login to account
- POST /auth/logout - Logout from account

### User Management
- GET /users - Get all users (Admin only)
- GET /users/:id - Get user by ID
- PATCH /users/:id - Update user
- DELETE /users/:id - Delete user

## Setup
1. Clone repository
2. Run `npm install`
3. Copy `.env.example` to `.env`
4. Run `npm run start:dev`

## Testing
```bash
npm run test
```
```

### 3. **Interactive API Documentation**
Documentation yang bisa di-test langsung (Swagger, Postman).

**Swagger UI Example:**
- Bisa langsung test endpoint
- Lihat request/response format
- Try it out button
- Auto-generated dari code

**Postman Collection:**
- Collection of all endpoints
- Pre-configured requests
- Environment variables
- Tests included

### 4. **OpenAPI Specification**
Standard format untuk API documentation (JSON/YAML).

```yaml
openapi: 3.0.0
info:
  title: Users API
  version: 1.0.0
paths:
  /users:
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 8
      responses:
        '201':
          description: User created successfully
```

---

## Good vs Bad Documentation

### ❌ Bad Documentation

```markdown
## Create User
POST /users

Body: user data

Returns: user
```

**Problems:**
- ❌ No example
- ❌ Tidak jelas field apa saja
- ❌ Tidak ada validation rules
- ❌ Tidak ada error handling
- ❌ Tidak ada response format

### ✅ Good Documentation

```markdown
## Create User
Create a new user account.

**Endpoint:** `POST /api/users`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",      // Required, must be valid email
  "password": "SecurePass123!",     // Required, min 8 chars, must contain uppercase, lowercase, number
  "name": "John Doe",               // Required, 2-50 characters
  "phone": "+6281234567890",        // Optional, format: +62xxxxxxxxxx
  "dateOfBirth": "1990-01-15"       // Optional, format: YYYY-MM-DD
}
```

**Success Response (201 Created):**
```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "phone": "+6281234567890",
  "dateOfBirth": "1990-01-15",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

400 Bad Request - Validation failed
```json
{
  "statusCode": 400,
  "message": [
    "email must be a valid email",
    "password must be at least 8 characters"
  ],
  "error": "Bad Request"
}
```

409 Conflict - Email already exists
```json
{
  "statusCode": 409,
  "message": "Email already registered",
  "error": "Conflict"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

**Example JavaScript:**
```javascript
const response = await fetch('http://localhost:3000/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePass123!',
    name: 'John Doe',
  }),
});

const user = await response.json();
```
```

**Why Better:**
- ✅ Clear endpoint path
- ✅ Shows authentication requirements
- ✅ Complete request example with comments
- ✅ All possible responses documented
- ✅ Error cases explained
- ✅ Code examples in multiple languages
- ✅ Easy to copy-paste

---

## Documentation Best Practices

### 1. **Be Complete**
Document everything:
- ✅ All endpoints
- ✅ All parameters (path, query, body)
- ✅ All responses (success and errors)
- ✅ Authentication requirements
- ✅ Rate limits
- ✅ Deprecation warnings

### 2. **Be Clear**
```markdown
❌ Bad: "Returns user data"
✅ Good: "Returns user object with id, email, name, and createdAt fields"

❌ Bad: "id: number"
✅ Good: "id: integer, auto-generated, unique identifier"

❌ Bad: "Must be valid"
✅ Good: "Must be valid email format (example: user@domain.com)"
```

### 3. **Use Examples**
Always provide working examples:

```markdown
## Update User
PATCH /users/:id

Example Request:
```json
{
  "name": "Jane Doe",
  "phone": "+6281234567890"
}
```

Example Response:
```json
{
  "id": 1,
  "name": "Jane Doe",
  "phone": "+6281234567890",
  "email": "jane@example.com",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```
```

### 4. **Keep It Updated**
```markdown
⚠️ Documentation that's wrong is worse than no documentation!

When you change code:
1. Update the documentation
2. Update examples
3. Update tests
4. Notify team members
```

### 5. **Use Standard Formats**

**HTTP Status Codes:**
- 200 OK - Request succeeded
- 201 Created - Resource created
- 400 Bad Request - Invalid input
- 401 Unauthorized - Not authenticated
- 403 Forbidden - Not authorized
- 404 Not Found - Resource not found
- 409 Conflict - Resource already exists
- 500 Internal Server Error - Server error

**Date Format:**
- Use ISO 8601: `2024-01-01T12:00:00.000Z`

**Pagination:**
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 6. **Organize Logically**

```markdown
# API Documentation

## 1. Introduction
- Overview
- Base URL
- Authentication

## 2. Authentication
- POST /auth/register
- POST /auth/login
- POST /auth/logout

## 3. Users
- GET /users
- GET /users/:id
- POST /users
- PATCH /users/:id
- DELETE /users/:id

## 4. Products
- ... similar structure

## 5. Error Handling
- Error format
- Common errors
- Error codes

## 6. Rate Limiting
- Limits
- Headers
- Retry policy
```

### 7. **Make It Searchable**

```markdown
Use descriptive titles:
❌ "EP-001"
✅ "Get User by ID"

Use tags/keywords:
Tags: user, profile, authentication, GET

Add table of contents with links:
- [Authentication](#authentication)
  - [Register](#register)
  - [Login](#login)
```

---

## Tools for Documentation

### 1. **Swagger / OpenAPI**
Auto-generate interactive docs from NestJS decorators.

```typescript
@ApiTags('users')
@Controller('users')
export class UsersController {
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
```

### 2. **Postman**
- Create collections
- Write descriptions
- Add examples
- Share with team
- Generate documentation

### 3. **README.md**
- Getting started guide
- High-level overview
- Setup instructions

### 4. **Wiki / Notion / Confluence**
- Detailed guides
- Architecture diagrams
- Business logic explanations

---

## Documentation Checklist

Before releasing API:

- [ ] All endpoints documented
- [ ] Request/response examples provided
- [ ] Authentication explained
- [ ] Error responses documented
- [ ] Rate limits specified
- [ ] Code examples in multiple languages
- [ ] Postman collection created
- [ ] README updated
- [ ] Team notified
- [ ] Documentation tested (examples actually work)

---

## Summary

✅ **Documentation is NOT optional** - It's part of the API
✅ **Write for others**, not just yourself
✅ **Keep it updated** - Wrong docs are worse than no docs
✅ **Use examples** - They're worth 1000 words
✅ **Make it interactive** - Use tools like Swagger/Postman
✅ **Test your examples** - Make sure they actually work

> "Code tells you how, documentation tells you why"

**Next:** Documentation API with Postman! 🚀
