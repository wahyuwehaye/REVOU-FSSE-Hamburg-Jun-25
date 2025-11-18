# Basic NestJS API Demo

## 📖 Description

This is a basic NestJS API project untuk memahami fundamental concepts:
- Basic project structure
- Modules, Controllers, Services
- Simple CRUD operations
- In-memory data storage (no database)

## 🎯 What You'll Learn

- ✅ NestJS project structure
- ✅ Creating modules, controllers, and services
- ✅ Handling HTTP requests (GET, POST, PUT, DELETE)
- ✅ Request parameters and body
- ✅ Response formatting

## 🚀 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev
```

Server akan running di: `http://localhost:3000`

## 📡 API Endpoints

### Root Endpoint

```http
GET http://localhost:3000
Response: "Hello from Basic NestJS API!"
```

### Products API

#### Get All Products
```http
GET http://localhost:3000/products
```

**Response:**
```json
[
  {
    "id": "1",
    "name": "Laptop",
    "price": 15000000,
    "category": "Electronics",
    "stock": 10
  },
  {
    "id": "2",
    "name": "Mouse",
    "price": 150000,
    "category": "Electronics",
    "stock": 50
  }
]
```

#### Get Product by ID
```http
GET http://localhost:3000/products/1
```

**Response:**
```json
{
  "id": "1",
  "name": "Laptop",
  "price": 15000000,
  "category": "Electronics",
  "stock": 10
}
```

#### Create Product
```http
POST http://localhost:3000/products
Content-Type: application/json

{
  "name": "Keyboard",
  "price": 500000,
  "category": "Electronics",
  "stock": 30
}
```

**Response:** (201 Created)
```json
{
  "id": "3",
  "name": "Keyboard",
  "price": 500000,
  "category": "Electronics",
  "stock": 30
}
```

#### Update Product
```http
PUT http://localhost:3000/products/1
Content-Type: application/json

{
  "name": "Laptop Updated",
  "price": 16000000,
  "category": "Electronics",
  "stock": 8
}
```

**Response:**
```json
{
  "id": "1",
  "name": "Laptop Updated",
  "price": 16000000,
  "category": "Electronics",
  "stock": 8
}
```

#### Delete Product
```http
DELETE http://localhost:3000/products/1
```

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

## 📁 Project Structure

```
src/
├── app.module.ts          # Root module
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
├── main.ts                # Entry point
└── products/
    ├── products.module.ts      # Products module
    ├── products.controller.ts  # Products controller
    ├── products.service.ts     # Products service
    └── dto/
        ├── create-product.dto.ts
        └── update-product.dto.ts
```

## 📝 Code Explanation

### main.ts
Entry point aplikasi. Initialize NestJS application.

### app.module.ts
Root module yang import semua feature modules.

### products.module.ts
Feature module untuk products functionality.

### products.controller.ts
Handle HTTP requests untuk products endpoints.

### products.service.ts
Business logic untuk products operations.

### DTOs
Data Transfer Objects untuk define shape of request data.

## 🧪 Testing with curl

```bash
# Get all products
curl http://localhost:3000/products

# Get one product
curl http://localhost:3000/products/1

# Create product
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Monitor","price":2500000,"category":"Electronics","stock":15}'

# Update product
curl -X PUT http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":16000000}'

# Delete product
curl -X DELETE http://localhost:3000/products/1
```

## 🧪 Testing with Postman

1. Import collection dari `postman_collection.json`
2. Set environment variable:
   - `baseUrl`: `http://localhost:3000`
3. Run requests in collection

## 💡 Key Concepts

### 1. Dependency Injection

```typescript
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  // ProductsService automatically injected
}
```

### 2. Decorators

```typescript
@Controller('products')  // Route prefix
export class ProductsController {
  @Get()              // HTTP method
  @Post()
  @Put(':id')         // With parameter
  @Delete(':id')
}
```

### 3. Request Handling

```typescript
@Get(':id')
findOne(@Param('id') id: string) {
  // Extract route parameter
}

@Post()
create(@Body() createProductDto: CreateProductDto) {
  // Extract request body
}
```

## 🎓 Learning Tasks

1. **Understanding Code**
   - Read through all files
   - Understand flow: Controller → Service
   - See how data is passed

2. **Testing**
   - Test all endpoints dengan Postman
   - Try invalid requests
   - See what happens

3. **Modification**
   - Add new field (e.g., `description`)
   - Add new endpoint (e.g., search by name)
   - Add filter (e.g., by category)

4. **Challenges**
   - Add `categories` endpoint
   - Implement search functionality
   - Add pagination

## 📚 Next Steps

After understanding this basic API:
1. Move to `todo-api-nestjs` for validation
2. Learn about DTOs and validation
3. Implement error handling
4. Add database integration

## ⚠️ Notes

- This uses **in-memory storage** (data resets on restart)
- No validation yet (see todo-api for validation)
- No error handling yet
- No database connection

## 🤝 Need Help?

- Review the code comments
- Check NestJS documentation
- Ask questions in class
- Try modifying the code

---

**Happy Learning!** 🚀
