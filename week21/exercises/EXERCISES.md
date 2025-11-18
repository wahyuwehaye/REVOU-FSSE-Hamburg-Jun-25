# Week 21 Exercises

## Exercise 1: Basic GET Endpoint

**Objective:** Create a simple endpoint that returns a list of books.

**Tasks:**
1. Create a `books` module using NestJS CLI
2. Add a `GET /books` endpoint
3. Return an array of book objects with properties: id, title, author, price
4. Test with Postman

**Expected Response:**
```json
[
  { "id": "1", "title": "Clean Code", "author": "Robert Martin", "price": 250000 },
  { "id": "2", "title": "Design Patterns", "author": "Gang of Four", "price": 300000 }
]
```

## Exercise 2: CRUD Operations

**Objective:** Implement complete CRUD for a categories resource.

**Tasks:**
1. Generate categories resource with CLI
2. Implement all CRUD operations:
   - GET /categories (get all)
   - GET /categories/:id (get one)
   - POST /categories (create)
   - PUT /categories/:id (update)
   - DELETE /categories/:id (delete)
3. Use in-memory storage
4. Test all endpoints

**Category Structure:**
```typescript
{
  id: string;
  name: string;
  description: string;
}
```

## Exercise 3: Query Parameters

**Objective:** Add filtering and sorting to products API.

**Tasks:**
1. Add query parameter support to GET /products
2. Filter by category: `/products?category=Electronics`
3. Sort by price: `/products?sort=price&order=asc`
4. Combine filters: `/products?category=Electronics&sort=price&order=desc`

**Example:**
```typescript
@Get()
findAll(
  @Query('category') category?: string,
  @Query('sort') sort?: string,
  @Query('order') order?: string,
) {
  // Implement filtering and sorting logic
}
```

## Exercise 4: Validation

**Objective:** Add validation to CreateProductDto.

**Tasks:**
1. Install `class-validator` and `class-transformer`
2. Add validation decorators to CreateProductDto:
   - name: required, min 3 characters
   - price: required, positive number
   - category: required string
   - stock: required, non-negative integer
3. Enable global validation in main.ts
4. Test with invalid data

**Example:**
```typescript
import { IsString, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
  
  // Add more validators...
}
```

## Exercise 5: Error Handling

**Objective:** Add proper error handling to products service.

**Tasks:**
1. Import HTTP exceptions from @nestjs/common
2. Throw NotFoundException when product not found
3. Throw ConflictException if trying to create duplicate
4. Add try-catch blocks for operations
5. Test error scenarios

**Example:**
```typescript
findOne(id: string): Product {
  const product = this.products.find(p => p.id === id);
  if (!product) {
    throw new NotFoundException(`Product with ID ${id} not found`);
  }
  return product;
}
```

## Exercise 6: Nested Resources

**Objective:** Create relationship between categories and products.

**Tasks:**
1. Create endpoint: GET /categories/:id/products
2. Return all products in specific category
3. Create endpoint: POST /categories/:id/products
4. Add product to specific category

**Example:**
```typescript
@Get(':id/products')
getCategoryProducts(@Param('id') categoryId: string) {
  return this.categoriesService.getProducts(categoryId);
}
```

## Exercise 7: Custom Response Format

**Objective:** Standardize API responses.

**Tasks:**
1. Create a response interceptor
2. Wrap all responses in standard format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success"
}
```
3. Apply to all endpoints
4. Test various endpoints

## Exercise 8: Pagination

**Objective:** Add pagination to products list.

**Tasks:**
1. Add query parameters: `page` and `limit`
2. Implement pagination logic
3. Return paginated response:
```json
{
  "data": [...],
  "page": 1,
  "limit": 10,
  "total": 50,
  "totalPages": 5
}
```

**Example:**
```typescript
@Get()
findAll(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
) {
  // Implement pagination
}
```

## Exercise 9: Search Functionality

**Objective:** Add search capability to products.

**Tasks:**
1. Add search query parameter
2. Search by product name (case-insensitive)
3. Return matching products
4. Test with various search terms

**Example:**
```
GET /products?search=laptop
```

## Exercise 10: Multiple Modules

**Objective:** Build multi-module application.

**Tasks:**
1. Create 3 modules: Users, Products, Orders
2. Users module: basic user CRUD
3. Products module: existing products functionality
4. Orders module: create orders with user and products
5. Link modules properly

**Structure:**
```
src/
├── users/
├── products/
└── orders/
```

## Bonus Challenges

### Challenge 1: Soft Delete
Implement soft delete (mark as deleted instead of removing).

### Challenge 2: Timestamps
Add createdAt and updatedAt to all resources.

### Challenge 3: Bulk Operations
Implement bulk create/update/delete endpoints.

### Challenge 4: Advanced Filtering
Support multiple filters with AND/OR logic.

### Challenge 5: Rate Limiting
Add rate limiting to protect API.

## Tips

1. Use NestJS CLI to generate resources quickly
2. Test each endpoint after creating it
3. Read error messages carefully
4. Use Postman collections to organize tests
5. Comment your code for better understanding
6. Commit your code frequently

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [class-validator Documentation](https://github.com/typestack/class-validator)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

**Good luck with the exercises!** 🚀
