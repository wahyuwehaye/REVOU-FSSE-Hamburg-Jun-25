# Testing API with Postman

## Installing Postman

1. Download from: https://www.postman.com/downloads/
2. Install and create free account
3. Create new workspace

## Creating Your First Request

### 1. GET Request

**Steps:**
1. Click "New" → "Request"
2. Name: "Get All Users"
3. Select method: `GET`
4. Enter URL: `http://localhost:3000/users`
5. Click "Send"

**Expected Response:**
```json
[
  {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com"
  }
]
```

### 2. POST Request

**Steps:**
1. Create new request: "Create User"
2. Method: `POST`
3. URL: `http://localhost:3000/users`
4. Go to "Body" tab
5. Select "raw" and "JSON"
6. Enter:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "age": 25
}
```
7. Click "Send"

### 3. GET Single Resource

**Steps:**
1. Method: `GET`
2. URL: `http://localhost:3000/users/1`
3. Click "Send"

### 4. PUT Request

**Steps:**
1. Method: `PUT`
2. URL: `http://localhost:3000/users/1`
3. Body:
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "age": 30
}
```

### 5. DELETE Request

**Steps:**
1. Method: `DELETE`
2. URL: `http://localhost:3000/users/1`
3. Click "Send"

## Organizing Requests

### Create Collection

1. Click "Collections" → "Create Collection"
2. Name: "NestJS API"
3. Add folders:
   - Users
   - Products
   - Auth

### Environment Variables

1. Click "Environments" → "Create Environment"
2. Name: "Local"
3. Add variables:
   - `baseUrl`: `http://localhost:3000`
   - `token`: (empty for now)

4. Use in requests:
   ```
   {{baseUrl}}/users
   ```

## Testing Complete CRUD

### Setup Collection

```
NestJS API
├── Users
│   ├── Get All Users (GET {{baseUrl}}/users)
│   ├── Get User (GET {{baseUrl}}/users/:id)
│   ├── Create User (POST {{baseUrl}}/users)
│   ├── Update User (PUT {{baseUrl}}/users/:id)
│   └── Delete User (DELETE {{baseUrl}}/users/:id)
└── Products
    ├── Get All Products (GET {{baseUrl}}/products)
    ├── Get Product (GET {{baseUrl}}/products/:id)
    ├── Create Product (POST {{baseUrl}}/products)
    ├── Update Product (PUT {{baseUrl}}/products/:id)
    └── Delete Product (DELETE {{baseUrl}}/products/:id)
```

## Testing Validation

### Valid Request

```json
POST {{baseUrl}}/users
{
  "name": "Valid User",
  "email": "valid@example.com",
  "age": 25
}
```

### Invalid Request (Missing Required Field)

```json
POST {{baseUrl}}/users
{
  "email": "test@example.com"
}
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": [
    "name is required"
  ],
  "error": "Bad Request"
}
```

### Invalid Request (Wrong Format)

```json
POST {{baseUrl}}/users
{
  "name": "Test",
  "email": "not-an-email",
  "age": -5
}
```

## Query Parameters

```
GET {{baseUrl}}/products?category=electronics&sort=price&order=asc
```

In Postman:
1. Go to "Params" tab
2. Add:
   - `category`: `electronics`
   - `sort`: `price`
   - `order`: `asc`

## Pre-request Scripts

```javascript
// Set timestamp
pm.environment.set("timestamp", new Date().getTime());

// Generate random data
pm.environment.set("randomEmail", `user${Math.random()}@example.com`);
```

## Tests (Assertions)

```javascript
// Test status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test response time
pm.test("Response time is less than 200ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(200);
});

// Test response body
pm.test("User has name", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.name).to.exist;
});

// Save response data
pm.test("Save user ID", function () {
    var jsonData = pm.response.json();
    pm.environment.set("userId", jsonData.id);
});
```

## Complete Test Example

```javascript
// Create User Request Tests
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has id", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
});

pm.test("Response has correct name", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.name).to.eql("Jane Doe");
});

// Save ID for next requests
var jsonData = pm.response.json();
pm.environment.set("lastUserId", jsonData.id);
```

## Running Collection

1. Click "Runner"
2. Select collection
3. Select environment
4. Click "Run NestJS API"

## Export/Import Collection

### Export
1. Right-click collection
2. "Export"
3. Save JSON file

### Import
1. Click "Import"
2. Select file
3. Import collection

## Alternative: Thunder Client (VS Code)

1. Install Thunder Client extension in VS Code
2. Click Thunder Client icon in sidebar
3. Create new request
4. Similar interface to Postman

## Alternative: REST Client (VS Code)

Create `api.http` file:

```http
### Get All Users
GET http://localhost:3000/users

### Create User
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}

### Get Single User
GET http://localhost:3000/users/1

### Update User
PUT http://localhost:3000/users/1
Content-Type: application/json

{
  "name": "John Updated"
}

### Delete User
DELETE http://localhost:3000/users/1
```

Click "Send Request" above each request.

## Tips

1. ✅ Use collections to organize requests
2. ✅ Use environment variables for URLs
3. ✅ Add tests to verify responses
4. ✅ Use pre-request scripts for dynamic data
5. ✅ Save responses for debugging
6. ✅ Export collections to share with team
7. ✅ Use variables for IDs between requests

## Next Steps

- Add authentication tests
- Test error scenarios
- Create automated test suites
- Integrate with CI/CD
