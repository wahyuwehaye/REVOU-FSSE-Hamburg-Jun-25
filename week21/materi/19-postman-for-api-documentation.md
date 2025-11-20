# Chapter 19: Postman for API Documentation

## 📚 Daftar Isi
- [What is Postman](#what-is-postman)
- [Why Use Postman](#why-use-postman)
- [Postman Features](#postman-features)
- [Getting Started with Postman](#getting-started-with-postman)

---

## What is Postman?

**Postman** adalah platform untuk API development yang memudahkan kita untuk:
- 📤 Test API endpoints
- 📝 Document APIs
- 🔄 Share collections dengan team
- ✅ Automate testing
- 🌍 Manage environments

### Postman vs Browser vs cURL

**Browser:**
```
❌ Only GET requests
❌ Hard to set headers
❌ Can't save requests
❌ No environment variables
```

**cURL:**
```bash
# Complex and hard to remember
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token123" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

**Postman:**
```
✅ All HTTP methods (GET, POST, PUT, DELETE, etc.)
✅ Easy interface to set headers, body, params
✅ Save and organize requests
✅ Environment variables
✅ Auto-generate documentation
✅ Team collaboration
```

---

## Why Use Postman?

### 1. Testing Made Easy

**Before Postman:**
```typescript
// Need to write test code
async function testCreateUser() {
  const response = await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'pass123'
    })
  });
  
  const data = await response.json();
  console.log(data);
}
```

**With Postman:**
- Click "New Request"
- Set method to POST
- Enter URL
- Add body
- Click "Send"
- ✅ Done!

### 2. Documentation as You Test

Every request you test becomes documentation:
- ✅ Request examples
- ✅ Response examples
- ✅ Descriptions
- ✅ Sharable with team

### 3. Environment Management

```javascript
// Development
BASE_URL = http://localhost:3000
API_KEY = dev_key_123

// Production
BASE_URL = https://api.yourapp.com
API_KEY = prod_key_xyz
```

Switch environments with one click!

### 4. Team Collaboration

```
Share collections:
  → Team members get all requests
  → Everyone stays in sync
  → New members onboard faster
```

---

## Postman Features

### 1. **Collections**
Organize related requests together.

```
📁 My App API
  📁 Authentication
    📄 Register
    📄 Login
    📄 Logout
  📁 Users
    📄 Get All Users
    📄 Get User by ID
    📄 Create User
    📄 Update User
    📄 Delete User
  📁 Products
    📄 Get All Products
    📄 Create Product
    ...
```

### 2. **Environment Variables**
Reuse values across requests.

```javascript
// Instead of:
http://localhost:3000/users
http://localhost:3000/products
http://localhost:3000/orders

// Use:
{{BASE_URL}}/users
{{BASE_URL}}/products
{{BASE_URL}}/orders

// Define in environment:
BASE_URL = http://localhost:3000
```

### 3. **Pre-request Scripts**
Run code before sending request.

```javascript
// Auto-add timestamp
pm.environment.set("timestamp", new Date().toISOString());

// Generate random data
pm.environment.set("randomEmail", `user${Math.random()}@test.com`);
```

### 4. **Tests**
Verify responses automatically.

```javascript
// Test status code
pm.test("Status is 201", function() {
  pm.response.to.have.status(201);
});

// Test response structure
pm.test("Response has id", function() {
  const json = pm.response.json();
  pm.expect(json).to.have.property('id');
});

// Save response data
const response = pm.response.json();
pm.environment.set("userId", response.id);
```

### 5. **Auto-generated Documentation**
Postman creates beautiful docs from your collections.

**Features:**
- ✅ Automatic from requests
- ✅ Add descriptions
- ✅ Include examples
- ✅ Publish publicly or privately
- ✅ Always up-to-date

---

## Getting Started with Postman

### Step 1: Install Postman

**Option 1: Desktop App** (Recommended)
```
1. Go to https://www.postman.com/downloads/
2. Download for your OS (Windows/Mac/Linux)
3. Install and launch
```

**Option 2: Web Version**
```
1. Go to https://web.postman.co/
2. Sign up / Login
3. Use in browser
```

### Step 2: Create Workspace

```
1. Open Postman
2. Click "Workspaces" → "Create Workspace"
3. Name: "My NestJS API"
4. Type: Personal/Team
5. Click "Create"
```

### Step 3: Create Collection

```
1. Click "New" → "Collection"
2. Name: "NestJS CRUD API"
3. Description: "Complete CRUD operations for NestJS tutorial"
4. Click "Create"
```

### Step 4: Add Environment

```
1. Click "Environments" (left sidebar)
2. Click "+" to create new
3. Name: "Development"
4. Add variables:
   - BASE_URL = http://localhost:3000
   - API_VERSION = v1
5. Click "Save"
```

### Step 5: Create Your First Request

```
1. Click collection → "Add request"
2. Name: "Get All Users"
3. Method: GET
4. URL: {{BASE_URL}}/users
5. Click "Save"
6. Click "Send" to test
```

---

## Postman Interface Overview

### Main Areas

```
┌─────────────────────────────────────────────────┐
│  [Workspace] [Import] [Runner] [New]            │
├──────────┬──────────────────────────────────────┤
│          │  GET  {{BASE_URL}}/users       [Send]│
│          ├──────────────────────────────────────┤
│          │ Params | Auth | Headers | Body       │
│ Sidebar  │                                       │
│          │ Response:                             │
│ - Colls  │ ┌──────────────────────────────────┐ │
│ - Envs   │ │ {                                │ │
│ - Mock   │ │   "users": [...]                 │ │
│ - Monitor│ │ }                                │ │
│          │ └──────────────────────────────────┘ │
└──────────┴──────────────────────────────────────┘
```

### Request Tabs

**1. Params**
- Query parameters: `?page=1&limit=10`
- Path variables: `/users/:id`

**2. Authorization**
- No Auth
- API Key
- Bearer Token
- Basic Auth
- OAuth 2.0

**3. Headers**
```
Content-Type: application/json
Authorization: Bearer {{TOKEN}}
Accept: application/json
```

**4. Body**
- none
- form-data
- x-www-form-urlencoded
- raw (JSON, XML, Text)
- binary
- GraphQL

**5. Pre-request Script**
JavaScript to run before request

**6. Tests**
JavaScript to verify response

---

## Creating Complete Collection

### Example: Users CRUD

**1. Create User**
```
POST {{BASE_URL}}/users

Headers:
  Content-Type: application/json

Body (raw, JSON):
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

Tests:
pm.test("Status is 201", function() {
  pm.response.to.have.status(201);
});

pm.test("User created", function() {
  const json = pm.response.json();
  pm.expect(json).to.have.property('id');
  pm.environment.set("userId", json.id);
});
```

**2. Get All Users**
```
GET {{BASE_URL}}/users

Tests:
pm.test("Status is 200", function() {
  pm.response.to.have.status(200);
});

pm.test("Returns array", function() {
  const json = pm.response.json();
  pm.expect(json).to.be.an('array');
});
```

**3. Get User by ID**
```
GET {{BASE_URL}}/users/{{userId}}

Tests:
pm.test("Status is 200", function() {
  pm.response.to.have.status(200);
});

pm.test("Returns correct user", function() {
  const json = pm.response.json();
  pm.expect(json.id).to.equal(parseInt(pm.environment.get("userId")));
});
```

**4. Update User**
```
PATCH {{BASE_URL}}/users/{{userId}}

Headers:
  Content-Type: application/json

Body (raw, JSON):
{
  "name": "John Updated"
}

Tests:
pm.test("Status is 200", function() {
  pm.response.to.have.status(200);
});

pm.test("Name updated", function() {
  const json = pm.response.json();
  pm.expect(json.name).to.equal("John Updated");
});
```

**5. Delete User**
```
DELETE {{BASE_URL}}/users/{{userId}}

Tests:
pm.test("Status is 200", function() {
  pm.response.to.have.status(200);
});
```

---

## Postman Tips & Tricks

### 1. Use Variables Everywhere
```javascript
// Bad
POST http://localhost:3000/api/v1/users

// Good
POST {{BASE_URL}}/{{API_VERSION}}/users
```

### 2. Chain Requests
```javascript
// In "Create User" test:
const response = pm.response.json();
pm.environment.set("userId", response.id);

// In "Get User" request:
GET {{BASE_URL}}/users/{{userId}}
```

### 3. Organize with Folders
```
📁 API Collection
  📁 01-Authentication
  📁 02-Users (Requires Auth)
  📁 03-Products (Requires Auth)
  📁 04-Admin (Requires Admin Role)
```

### 4. Add Descriptions
```markdown
# Get User by ID

Retrieves a single user by their unique ID.

## Authentication
Requires Bearer token in Authorization header.

## Path Parameters
- `id` (integer) - User ID

## Response
Returns user object with all fields.

## Example
```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe"
}
```
```

### 5. Use Examples
Save multiple response examples:
- Success response
- Validation error
- Not found error
- Unauthorized error

---

## Summary

✅ **Postman** = Testing + Documentation + Collaboration
✅ **Collections** organize your requests
✅ **Environments** manage different configs
✅ **Tests** verify responses automatically
✅ **Variables** make requests reusable
✅ **Documentation** auto-generated from requests

**Next:** Documenting Endpoints with Decorators! 🚀
