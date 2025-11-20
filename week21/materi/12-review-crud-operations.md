# Chapter 12: Review of CRUD Operations

## 📚 Daftar Isi
- [Apa itu CRUD?](#apa-itu-crud)
- [Mengapa CRUD Penting?](#mengapa-crud-penting)
- [CRUD dalam RESTful API](#crud-dalam-restful-api)
- [HTTP Methods untuk CRUD](#http-methods-untuk-crud)
- [CRUD di NestJS](#crud-di-nestjs)
- [Best Practices](#best-practices)

---

## Apa itu CRUD?

**CRUD** adalah akronim yang merepresentasikan 4 operasi dasar dalam manajemen data:

### 🔤 Kepanjangan CRUD

| Letter | Operation | Meaning | Action |
|--------|-----------|---------|--------|
| **C** | Create | Membuat | Menambah data baru |
| **R** | Read | Membaca | Mengambil/melihat data |
| **U** | Update | Mengubah | Memodifikasi data yang ada |
| **D** | Delete | Menghapus | Menghilangkan data |

---

## Mengapa CRUD Penting?

### 1. **Foundation of Data Management**
CRUD adalah dasar dari hampir semua aplikasi yang mengelola data:
- Blog systems (posts, comments)
- E-commerce (products, orders)
- Social media (users, posts, likes)
- Task management (todos, projects)

### 2. **Universal Pattern**
CRUD operations ditemukan di:
- Web applications
- Mobile apps
- Desktop software
- Database systems
- APIs

### 3. **Easy to Understand**
CRUD memberikan framework yang jelas untuk:
- Designing APIs
- Building features
- Testing applications
- Documenting systems

---

## CRUD dalam RESTful API

### Mapping CRUD ke HTTP Methods

```
CREATE  →  POST    (Membuat resource baru)
READ    →  GET     (Mengambil resource)
UPDATE  →  PUT/PATCH (Memodifikasi resource)
DELETE  →  DELETE  (Menghapus resource)
```

### Contoh Endpoint Design

#### ✅ Blog Posts API
```
POST   /posts          # Create new post
GET    /posts          # Read all posts
GET    /posts/:id      # Read one post
PUT    /posts/:id      # Update entire post
PATCH  /posts/:id      # Update partial post
DELETE /posts/:id      # Delete post
```

#### ✅ Users API
```
POST   /users          # Register new user
GET    /users          # Get all users
GET    /users/:id      # Get one user
PUT    /users/:id      # Update user
DELETE /users/:id      # Delete user
```

---

## HTTP Methods untuk CRUD

### 1. **CREATE - POST Method**

**Karakteristik:**
- Membuat resource baru
- Status code: `201 Created`
- Mengirim data di request body
- Mengembalikan resource yang baru dibuat

**Contoh Request:**
```http
POST /api/products
Content-Type: application/json

{
  "name": "Laptop",
  "price": 15000000,
  "stock": 10
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Laptop",
  "price": 15000000,
  "stock": 10,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 2. **READ - GET Method**

**Karakteristik:**
- Mengambil data
- Tidak mengubah server state (safe method)
- Status code: `200 OK`
- Dapat menerima query parameters

**Contoh - Get All:**
```http
GET /api/products
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 15000000
  },
  {
    "id": 2,
    "name": "Mouse",
    "price": 150000
  }
]
```

**Contoh - Get One:**
```http
GET /api/products/1
```

**Response:**
```json
{
  "id": 1,
  "name": "Laptop",
  "price": 15000000,
  "stock": 10
}
```

**Contoh - dengan Query Parameters:**
```http
GET /api/products?category=electronics&minPrice=100000
```

---

### 3. **UPDATE - PUT vs PATCH**

#### PUT Method - Full Update
**Karakteristik:**
- Replace seluruh resource
- Semua field harus disertakan
- Status code: `200 OK`

```http
PUT /api/products/1
Content-Type: application/json

{
  "name": "Laptop Gaming",
  "price": 20000000,
  "stock": 5,
  "category": "Electronics"
}
```

#### PATCH Method - Partial Update
**Karakteristik:**
- Update sebagian field saja
- Hanya kirim field yang berubah
- Status code: `200 OK`
- **Lebih umum digunakan**

```http
PATCH /api/products/1
Content-Type: application/json

{
  "price": 18000000,
  "stock": 8
}
```

---

### 4. **DELETE - DELETE Method**

**Karakteristik:**
- Menghapus resource
- Status code: `200 OK` atau `204 No Content`
- Bisa mengembalikan message atau resource yang dihapus

**Contoh Request:**
```http
DELETE /api/products/1
```

**Response Option 1 - With Message:**
```json
{
  "message": "Product deleted successfully"
}
```

**Response Option 2 - With Deleted Resource:**
```json
{
  "deleted": {
    "id": 1,
    "name": "Laptop"
  }
}
```

---

## CRUD di NestJS

### Architecture Overview

```
Controller  →  Service  →  Data Store
   ↓            ↓            ↓
Handle       Business     Database
Request      Logic        or Array
```

### 1. **Controller Layer**
Menangani HTTP requests dan responses

```typescript
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createDto: CreateProductDto) {
    return this.productsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
```

### 2. **Service Layer**
Mengimplementasikan business logic

```typescript
@Injectable()
export class ProductsService {
  private products = [];
  private currentId = 1;

  create(createDto: CreateProductDto) {
    const product = {
      id: this.currentId++,
      ...createDto,
      createdAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  update(id: number, updateDto: UpdateProductDto) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    
    this.products[index] = {
      ...this.products[index],
      ...updateDto,
      updatedAt: new Date(),
    };
    
    return this.products[index];
  }

  remove(id: number) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    
    const deleted = this.products[index];
    this.products.splice(index, 1);
    
    return { message: 'Product deleted successfully', deleted };
  }
}
```

### 3. **DTO Layer**
Mendefinisikan struktur dan validasi data

```typescript
// create-product.dto.ts
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;
}

// update-product.dto.ts
export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

---

## Best Practices

### 1. **Konsisten dalam URL Design**
```typescript
// ✅ GOOD - Plural nouns, kebab-case
/api/products
/api/user-profiles
/api/order-items

// ❌ BAD - Mixed singular/plural, inconsistent
/api/product
/api/getUserProfile
/api/OrderItem
```

### 2. **Gunakan Status Codes yang Tepat**
```typescript
@Post()
@HttpCode(HttpStatus.CREATED)  // 201
create() {}

@Get()
@HttpCode(HttpStatus.OK)  // 200 (default)
findAll() {}

@Delete()
@HttpCode(HttpStatus.NO_CONTENT)  // 204
remove() {}
```

### 3. **Handle Errors dengan Baik**
```typescript
findOne(id: number) {
  const item = this.items.find(i => i.id === id);
  
  if (!item) {
    throw new NotFoundException(`Item with ID ${id} not found`);
  }
  
  return item;
}
```

### 4. **Gunakan DTOs untuk Validation**
```typescript
// Selalu validate input
@Post()
create(@Body() createDto: CreateProductDto) {
  return this.service.create(createDto);
}
```

### 5. **Return Consistent Response Format**
```typescript
// ✅ GOOD - Consistent structure
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// ❌ BAD - Inconsistent
// Sometimes return object, sometimes array, sometimes string
```

### 6. **Implement Proper Error Handling**
```typescript
@Post()
async create(@Body() createDto: CreateProductDto) {
  try {
    return await this.service.create(createDto);
  } catch (error) {
    if (error instanceof ConflictException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to create product');
  }
}
```

---

## CRUD Operations Comparison Table

| Operation | HTTP Method | URL Pattern | Request Body | Success Code | Error Code |
|-----------|-------------|-------------|--------------|--------------|------------|
| **Create** | POST | /resources | Required | 201 | 400, 409 |
| **Read All** | GET | /resources | None | 200 | 500 |
| **Read One** | GET | /resources/:id | None | 200 | 404 |
| **Update Full** | PUT | /resources/:id | Required | 200 | 400, 404 |
| **Update Partial** | PATCH | /resources/:id | Optional | 200 | 400, 404 |
| **Delete** | DELETE | /resources/:id | None | 200/204 | 404 |

---

## Idempotency dalam CRUD

### Idempotent Methods
**Idempotent** = Calling multiple times gives same result

- ✅ **GET** - Idempotent (safe)
- ✅ **PUT** - Idempotent
- ✅ **DELETE** - Idempotent
- ❌ **POST** - NOT idempotent
- ⚠️ **PATCH** - May or may not be idempotent

**Contoh:**
```typescript
// DELETE idempotent
DELETE /products/1  // First call: deletes product
DELETE /products/1  // Second call: returns 404 (consistent)

// POST not idempotent
POST /products { name: "Laptop" }  // Creates product with ID 1
POST /products { name: "Laptop" }  // Creates product with ID 2 (different result)
```

---

## Common CRUD Pitfalls (Yang Harus Dihindari)

### ❌ 1. Using Wrong HTTP Methods
```typescript
// WRONG
@Get('delete/:id')  // ❌ Don't use GET for delete
delete(@Param('id') id: number) {}

// RIGHT
@Delete(':id')  // ✅
remove(@Param('id') id: number) {}
```

### ❌ 2. Not Handling 404 Errors
```typescript
// WRONG
@Get(':id')
findOne(@Param('id') id: number) {
  return this.items[id];  // ❌ Returns undefined if not found
}

// RIGHT
@Get(':id')
findOne(@Param('id') id: number) {
  const item = this.items.find(i => i.id === id);
  if (!item) {
    throw new NotFoundException();  // ✅
  }
  return item;
}
```

### ❌ 3. Not Validating Input
```typescript
// WRONG
@Post()
create(@Body() data: any) {  // ❌ No validation
  return this.service.create(data);
}

// RIGHT
@Post()
create(@Body() createDto: CreateProductDto) {  // ✅ With DTO validation
  return this.service.create(createDto);
}
```

---

## Summary

### Key Points:
1. ✅ CRUD = Create, Read, Update, Delete
2. ✅ Maps to HTTP methods: POST, GET, PUT/PATCH, DELETE
3. ✅ Foundation of most applications
4. ✅ NestJS provides clear structure: Controller → Service → Data
5. ✅ Always use DTOs for validation
6. ✅ Handle errors properly with appropriate status codes
7. ✅ Keep URLs consistent and RESTful

### Next Steps:
- Chapter 13: Service Layer Implementation in depth
- Chapter 14: Repository Pattern for data access
- Chapter 15: Building Complete CRUD API

---

## 📝 Practice Exercise

**Task:** Buat CRUD API untuk "Books" dengan fields:
- id (number)
- title (string, required, min 3 chars)
- author (string, required)
- isbn (string, required, unique)
- year (number, min 1900, max current year)
- price (number, min 0)

**Requirements:**
1. Implement all CRUD operations
2. Use DTOs with validation
3. Handle all error cases (404, 400, 409)
4. Return consistent response format
5. Use appropriate HTTP status codes

---

**Happy Coding! 🚀**
