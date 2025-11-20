# Chapter 22: Creating Postman Collections

## 📚 Daftar Isi
- [What are Collections](#what-are-collections)
- [Creating Collections](#creating-collections)
- [Organizing Requests](#organizing-requests)
- [Adding Tests](#adding-tests)
- [Using Variables](#using-variables)

---

## What are Collections?

**Collections** adalah grup dari API requests yang di-organize bersama.

### Benefits:
- ✅ Organize related endpoints together
- ✅ Share with team members
- ✅ Run all tests at once
- ✅ Generate documentation
- ✅ Version control

### Example Structure:
```
📁 My NestJS API Collection
  📁 Authentication
    📄 Register
    📄 Login
    📄 Logout
    📄 Refresh Token
  📁 Users
    📄 Get All Users
    📄 Get User by ID
    📄 Create User
    📄 Update User
    📄 Delete User
  📁 Products
    📄 Get All Products
    📄 Get Product by ID
    📄 Create Product
    📄 Update Product
    📄 Delete Product
```

---

## Creating Collections

### Method 1: Manual Creation

```
Step 1: Create Collection
1. Click "New" button
2. Select "Collection"
3. Name: "NestJS Complete API"
4. Description: "Complete CRUD API for learning NestJS"
5. Click "Create"

Step 2: Add Authorization
1. Click collection
2. Go to "Authorization" tab
3. Select type: "Bearer Token"
4. Token: {{authToken}}
5. Save

Step 3: Add Variables
1. Click collection
2. Go to "Variables" tab
3. Add variables:
   - baseUrl: http://localhost:3000
   - apiVersion: v1
4. Save
```

### Method 2: Import from Swagger

```
Step 1: Generate OpenAPI JSON
// In NestJS main.ts
const document = SwaggerModule.createDocument(app, config);
writeFileSync('./swagger.json', JSON.stringify(document, null, 2));

Step 2: Import to Postman
1. Open Postman
2. Click "Import"
3. Select "swagger.json"
4. Click "Import"
5. ✅ All endpoints imported!
```

---

## Organizing Requests

### 1. Use Folders

```
📁 API Collection
  📁 01. Setup
    📄 Health Check
    📄 Get API Version
  📁 02. Authentication (No Auth Required)
    📄 Register
    📄 Login
  📁 03. Users (Requires Auth)
    📁 CRUD Operations
      📄 Get All Users
      📄 Get User by ID
      📄 Create User
      📄 Update User
      📄 Delete User
    📁 User Actions
      📄 Change Password
      📄 Update Profile
      📄 Upload Avatar
  📁 04. Admin (Requires Admin Role)
    📄 Get All Users (Admin)
    📄 Delete Any User
    📄 Ban User
```

**Tips:**
- ✅ Number folders for ordering (01, 02, 03)
- ✅ Group by feature, not HTTP method
- ✅ Indicate auth requirements in folder name

### 2. Naming Requests

**❌ Bad:**
```
Request 1
GET users
user-create
delUser
```

**✅ Good:**
```
Get All Users
Get User by ID
Create User
Update User
Delete User
```

### 3. Add Descriptions

```markdown
# Get User by ID

Retrieves a single user by their unique identifier.

## Authentication
Requires Bearer token.

## Path Parameters
- `id` (number) - User ID

## Success Response (200)
Returns user object with all fields.

## Error Responses
- 401: Not authenticated
- 403: Not authorized
- 404: User not found

## Example Usage
1. Make sure you're logged in (run "Login" request first)
2. Replace :id with actual user ID
3. Send request
```

---

## Adding Tests

### 1. Basic Tests

```javascript
// Test: Get All Users

// Check status code
pm.test("Status is 200", function() {
  pm.response.to.have.status(200);
});

// Check response time
pm.test("Response time < 500ms", function() {
  pm.expect(pm.response.responseTime).to.be.below(500);
});

// Check response is array
pm.test("Returns array", function() {
  const json = pm.response.json();
  pm.expect(json).to.be.an('array');
});

// Check array is not empty
pm.test("Array is not empty", function() {
  const json = pm.response.json();
  pm.expect(json.length).to.be.above(0);
});
```

### 2. Test Response Structure

```javascript
// Test: Get User by ID

pm.test("Status is 200", function() {
  pm.response.to.have.status(200);
});

pm.test("Response has correct structure", function() {
  const json = pm.response.json();
  
  // Check required fields exist
  pm.expect(json).to.have.property('id');
  pm.expect(json).to.have.property('email');
  pm.expect(json).to.have.property('name');
  pm.expect(json).to.have.property('createdAt');
  
  // Check field types
  pm.expect(json.id).to.be.a('number');
  pm.expect(json.email).to.be.a('string');
  pm.expect(json.name).to.be.a('string');
  
  // Check email format
  pm.expect(json.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  
  // Password should NOT be in response
  pm.expect(json).to.not.have.property('password');
});
```

### 3. Save Response Data

```javascript
// Test: Create User

pm.test("Status is 201", function() {
  pm.response.to.have.status(201);
});

pm.test("User created successfully", function() {
  const json = pm.response.json();
  
  // Verify user was created
  pm.expect(json).to.have.property('id');
  
  // Save user ID for later use
  pm.environment.set("userId", json.id);
  console.log("Saved user ID:", json.id);
});
```

### 4. Test Error Responses

```javascript
// Test: Get User by ID (Invalid ID)

pm.test("Status is 400 for invalid ID", function() {
  pm.response.to.have.status(400);
});

pm.test("Error message is clear", function() {
  const json = pm.response.json();
  
  pm.expect(json).to.have.property('statusCode', 400);
  pm.expect(json).to.have.property('message');
  pm.expect(json).to.have.property('error', 'Bad Request');
});
```

### 5. Chain Requests

```javascript
// Test: Login

pm.test("Login successful", function() {
  pm.response.to.have.status(200);
  
  const json = pm.response.json();
  
  // Save token for authenticated requests
  pm.environment.set("authToken", json.access_token);
  
  // Save user info
  pm.environment.set("currentUserId", json.user.id);
  pm.environment.set("currentUserEmail", json.user.email);
  
  console.log("Logged in as:", json.user.email);
});
```

---

## Using Variables

### 1. Collection Variables

```javascript
// Set at collection level
baseUrl = http://localhost:3000
apiVersion = v1

// Use in requests
{{baseUrl}}/{{apiVersion}}/users
```

### 2. Environment Variables

```javascript
// Development Environment
baseUrl = http://localhost:3000
authToken = 
userId = 

// Production Environment
baseUrl = https://api.production.com
authToken = 
userId = 
```

### 3. Dynamic Variables

```javascript
// Pre-request Script
pm.environment.set("timestamp", new Date().toISOString());
pm.environment.set("randomEmail", `user${Date.now()}@test.com`);
pm.environment.set("randomPassword", `Pass${Math.random().toString(36).slice(2)}`);

// Use in request body
{
  "email": "{{randomEmail}}",
  "password": "{{randomPassword}}",
  "createdAt": "{{timestamp}}"
}
```

### 4. Global Scripts

**Collection Pre-request Script:**
```javascript
// Run before every request in collection

// Log request info
console.log(`Making ${pm.request.method} request to ${pm.request.url}`);

// Add timestamp to all requests
pm.request.headers.add({
  key: 'X-Request-Time',
  value: new Date().toISOString()
});

// Check if authenticated endpoints have token
const requiresAuth = pm.request.url.path.includes('users');
if (requiresAuth && !pm.environment.get("authToken")) {
  throw new Error("Auth token missing. Please login first.");
}
```

**Collection Test Script:**
```javascript
// Run after every request in collection

// Log response info
console.log(`Response status: ${pm.response.code}`);
console.log(`Response time: ${pm.response.responseTime}ms`);

// Common tests for all requests
pm.test("Response time is acceptable", function() {
  pm.expect(pm.response.responseTime).to.be.below(1000);
});

pm.test("Response has Content-Type header", function() {
  pm.response.to.have.header("Content-Type");
});
```

---

## Complete Example: CRUD Collection

### Setup Folder

**1. Health Check**
```
GET {{baseUrl}}/health

Tests:
pm.test("API is running", function() {
  pm.response.to.have.status(200);
});
```

### Authentication Folder

**2. Register**
```
POST {{baseUrl}}/auth/register

Body (JSON):
{
  "email": "{{randomEmail}}",
  "password": "Test123!@#",
  "name": "Test User"
}

Pre-request Script:
pm.environment.set("randomEmail", `test${Date.now()}@example.com`);

Tests:
pm.test("Registration successful", function() {
  pm.response.to.have.status(201);
  const json = pm.response.json();
  pm.environment.set("testUserId", json.id);
  pm.environment.set("testUserEmail", json.email);
});
```

**3. Login**
```
POST {{baseUrl}}/auth/login

Body (JSON):
{
  "email": "{{testUserEmail}}",
  "password": "Test123!@#"
}

Tests:
pm.test("Login successful", function() {
  pm.response.to.have.status(200);
  const json = pm.response.json();
  pm.environment.set("authToken", json.access_token);
});
```

### Users Folder

**4. Get All Users**
```
GET {{baseUrl}}/users

Authorization: Bearer {{authToken}}

Tests:
pm.test("Status is 200", function() {
  pm.response.to.have.status(200);
});

pm.test("Returns users array", function() {
  const json = pm.response.json();
  pm.expect(json).to.be.an('array');
  pm.expect(json.length).to.be.above(0);
});
```

**5. Get User by ID**
```
GET {{baseUrl}}/users/{{testUserId}}

Authorization: Bearer {{authToken}}

Tests:
pm.test("Status is 200", function() {
  pm.response.to.have.status(200);
});

pm.test("Returns correct user", function() {
  const json = pm.response.json();
  pm.expect(json.id).to.equal(parseInt(pm.environment.get("testUserId")));
  pm.expect(json.email).to.equal(pm.environment.get("testUserEmail"));
});
```

**6. Update User**
```
PATCH {{baseUrl}}/users/{{testUserId}}

Authorization: Bearer {{authToken}}

Body (JSON):
{
  "name": "Updated Name"
}

Tests:
pm.test("Status is 200", function() {
  pm.response.to.have.status(200);
});

pm.test("User updated", function() {
  const json = pm.response.json();
  pm.expect(json.name).to.equal("Updated Name");
});
```

**7. Delete User**
```
DELETE {{baseUrl}}/users/{{testUserId}}

Authorization: Bearer {{authToken}}

Tests:
pm.test("Status is 200", function() {
  pm.response.to.have.status(200);
});

// Cleanup
pm.environment.unset("testUserId");
pm.environment.unset("testUserEmail");
```

---

## Running Collections

### 1. Run Manually
```
Click collection → Click "Run"
Select requests to run
Click "Run [Collection Name]"
```

### 2. Run from Command Line
```bash
# Install Newman (Postman CLI)
npm install -g newman

# Export collection & environment from Postman

# Run collection
newman run collection.json -e environment.json

# With reporters
newman run collection.json -e environment.json \
  --reporters cli,html \
  --reporter-html-export report.html
```

---

## Summary

✅ **Collections** organize related requests
✅ **Folders** group requests logically
✅ **Tests** verify responses automatically
✅ **Variables** make requests reusable
✅ **Scripts** add dynamic behavior
✅ **Newman** runs collections from CLI

**Workflow:**
1. Create collection & folders
2. Add requests with descriptions
3. Add tests to verify responses
4. Use variables for flexibility
5. Share with team

**Next:** Sharing Documentation with Team! 🚀
