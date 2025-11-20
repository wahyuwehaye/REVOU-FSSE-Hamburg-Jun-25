# Chapter 14: Repository Pattern

## 📚 Daftar Isi
- [Apa itu Repository Pattern?](#apa-itu-repository-pattern)
- [Mengapa Menggunakan Repository Pattern?](#mengapa-menggunakan-repository-pattern)
- [Implementation di NestJS](#implementation-di-nestjs)
- [Complete Example](#complete-example)
- [Best Practices](#best-practices)

---

## Apa itu Repository Pattern?

**Repository Pattern** adalah design pattern yang memisahkan **logic data access** dari **business logic**. Repository bertindak sebagai "middleman" antara application dan data source.

### Traditional Architecture (Without Repository)

```
Controller → Service → Direct Data Access (Array/Database)
```

### With Repository Pattern

```
Controller → Service → Repository → Data Source
```

### Visualisasi

```
┌──────────────┐
│  Controller  │  ← HTTP Layer
└──────┬───────┘
       │
       ↓
┌──────────────┐
│   Service    │  ← Business Logic Layer
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  Repository  │  ← Data Access Layer
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  Data Source │  ← Database / Array / API
└──────────────┘
```

---

## Mengapa Menggunakan Repository Pattern?

### 1. **Separation of Concerns** ✅

```typescript
// ❌ WITHOUT Repository - Service has data access logic
@Injectable()
export class ProductsService {
  private products = [];
  
  findAll() {
    // ❌ Service directly manages data
    return this.products.filter(p => p.isActive);
  }
  
  findOne(id: number) {
    // ❌ Data access mixed with business logic
    return this.products.find(p => p.id === id);
  }
}

// ✅ WITH Repository - Separated concerns
@Injectable()
export class ProductsRepository {
  private products = [];
  
  findAll() {
    return this.products;
  }
  
  findById(id: number) {
    return this.products.find(p => p.id === id);
  }
}

@Injectable()
export class ProductsService {
  constructor(private repository: ProductsRepository) {}
  
  findAll() {
    // ✅ Service focuses on business logic
    const products = this.repository.findAll();
    return products.filter(p => p.isActive);
  }
  
  findOne(id: number) {
    // ✅ Clean separation
    const product = this.repository.findById(id);
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }
}
```

### 2. **Easier to Test** 🧪

```typescript
// Easy to mock repository in tests
describe('ProductsService', () => {
  let service: ProductsService;
  let repository: ProductsRepository;
  
  beforeEach(() => {
    // Create mock repository
    repository = {
      findById: jest.fn().mockReturnValue({ id: 1, name: 'Test' }),
      findAll: jest.fn().mockReturnValue([]),
    } as any;
    
    service = new ProductsService(repository);
  });
  
  it('should find product by id', () => {
    const product = service.findOne(1);
    expect(product).toBeDefined();
    expect(repository.findById).toHaveBeenCalledWith(1);
  });
});
```

### 3. **Easy to Switch Data Sources** 🔄

```typescript
// Can easily switch from in-memory to database
// Just change the repository implementation

// In-memory repository
@Injectable()
export class InMemoryProductsRepository {
  private products = [];
  findAll() { return this.products; }
}

// Database repository
@Injectable()
export class DatabaseProductsRepository {
  findAll() { return this.database.products.findMany(); }
}

// Service code remains the same!
@Injectable()
export class ProductsService {
  constructor(private repository: ProductsRepository) {}
  // No changes needed when switching repositories
}
```

### 4. **Reusability** 🔁

```typescript
// Repository can be used by multiple services
@Injectable()
export class ProductsRepository {
  findAll() { /* ... */ }
  findById(id: number) { /* ... */ }
}

// Used by ProductsService
@Injectable()
export class ProductsService {
  constructor(private repository: ProductsRepository) {}
}

// Also used by ReportsService
@Injectable()
export class ReportsService {
  constructor(private productsRepository: ProductsRepository) {}
  
  generateProductReport() {
    const products = this.productsRepository.findAll();
    // Generate report...
  }
}
```

---

## Implementation di NestJS

### Step 1: Define Repository Interface

```typescript
// products.repository.interface.ts
export interface IProductsRepository {
  findAll(): Product[];
  findById(id: number): Product | undefined;
  create(product: Product): Product;
  update(id: number, product: Partial<Product>): Product;
  delete(id: number): void;
}
```

### Step 2: Implement Repository

```typescript
// products.repository.ts
import { Injectable } from '@nestjs/common';
import { IProductsRepository } from './products.repository.interface';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductsRepository implements IProductsRepository {
  private products: Product[] = [];
  private currentId = 1;

  findAll(): Product[] {
    return this.products;
  }

  findById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  create(product: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      id: this.currentId++,
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, productData: Partial<Product>): Product | undefined {
    const index = this.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    this.products[index] = {
      ...this.products[index],
      ...productData,
      updatedAt: new Date(),
    };
    
    return this.products[index];
  }

  delete(id: number): boolean {
    const index = this.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return false;
    }
    
    this.products.splice(index, 1);
    return true;
  }

  // Additional query methods
  findByCategory(category: string): Product[] {
    return this.products.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  findByPriceRange(minPrice: number, maxPrice: number): Product[] {
    return this.products.filter(
      p => p.price >= minPrice && p.price <= maxPrice
    );
  }

  exists(id: number): boolean {
    return this.products.some(p => p.id === id);
  }

  count(): number {
    return this.products.length;
  }
}
```

### Step 3: Use Repository in Service

```typescript
// products.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly repository: ProductsRepository
  ) {}

  create(createProductDto: CreateProductDto) {
    // Business logic: Check for duplicates
    const existing = this.repository.findAll().find(
      p => p.name.toLowerCase() === createProductDto.name.toLowerCase()
    );
    
    if (existing) {
      throw new ConflictException('Product already exists');
    }

    // Delegate data access to repository
    return this.repository.create(createProductDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    const product = this.repository.findById(id);
    
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    // Ensure product exists
    this.findOne(id);
    
    // Delegate to repository
    const updated = this.repository.update(id, updateProductDto);
    
    if (!updated) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    
    return updated;
  }

  remove(id: number) {
    const success = this.repository.delete(id);
    
    if (!success) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    
    return { message: 'Product deleted successfully' };
  }

  // Business logic methods
  getProductsByCategory(category: string) {
    return this.repository.findByCategory(category);
  }

  getProductsInPriceRange(minPrice: number, maxPrice: number) {
    return this.repository.findByPriceRange(minPrice, maxPrice);
  }

  getExpensiveProducts(threshold: number = 1000000) {
    const products = this.repository.findAll();
    return products.filter(p => p.price > threshold);
  }
}
```

### Step 4: Register in Module

```typescript
// products.module.ts
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRepository,  // ← Register repository
  ],
  exports: [ProductsRepository],  // ← Export if used by other modules
})
export class ProductsModule {}
```

---

## Complete Example

### Full Implementation: Library Management System

#### 1. Entity Interface
```typescript
// interfaces/book.interface.ts
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  availableCopies: number;
  totalCopies: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2. Repository
```typescript
// books.repository.ts
import { Injectable } from '@nestjs/common';
import { Book } from './interfaces/book.interface';

@Injectable()
export class BooksRepository {
  private books: Book[] = [];
  private currentId = 1;

  // CREATE
  create(bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Book {
    const book: Book = {
      id: this.currentId++,
      ...bookData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.books.push(book);
    return book;
  }

  // READ
  findAll(): Book[] {
    return [...this.books];
  }

  findById(id: number): Book | undefined {
    return this.books.find(b => b.id === id);
  }

  findByIsbn(isbn: string): Book | undefined {
    return this.books.find(b => b.isbn === isbn);
  }

  findByAuthor(author: string): Book[] {
    return this.books.filter(b => 
      b.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  findByCategory(category: string): Book[] {
    return this.books.filter(b => 
      b.category.toLowerCase() === category.toLowerCase()
    );
  }

  findAvailableBooks(): Book[] {
    return this.books.filter(b => b.availableCopies > 0);
  }

  // UPDATE
  update(id: number, bookData: Partial<Book>): Book | undefined {
    const index = this.books.findIndex(b => b.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    this.books[index] = {
      ...this.books[index],
      ...bookData,
      updatedAt: new Date(),
    };
    
    return this.books[index];
  }

  updateAvailableCopies(id: number, change: number): Book | undefined {
    const book = this.findById(id);
    
    if (!book) {
      return undefined;
    }
    
    book.availableCopies += change;
    book.updatedAt = new Date();
    
    return book;
  }

  // DELETE
  delete(id: number): boolean {
    const index = this.books.findIndex(b => b.id === id);
    
    if (index === -1) {
      return false;
    }
    
    this.books.splice(index, 1);
    return true;
  }

  // UTILITY
  exists(id: number): boolean {
    return this.books.some(b => b.id === id);
  }

  isbnExists(isbn: string): boolean {
    return this.books.some(b => b.isbn === isbn);
  }

  count(): number {
    return this.books.length;
  }

  countByCategory(category: string): number {
    return this.books.filter(b => 
      b.category.toLowerCase() === category.toLowerCase()
    ).length;
  }
}
```

#### 3. Service with Business Logic
```typescript
// books.service.ts
import { 
  Injectable, 
  NotFoundException, 
  ConflictException,
  BadRequestException 
} from '@nestjs/common';
import { BooksRepository } from './books.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly repository: BooksRepository) {}

  create(createBookDto: CreateBookDto) {
    // Business Rule: ISBN must be unique
    if (this.repository.isbnExists(createBookDto.isbn)) {
      throw new ConflictException(
        `Book with ISBN ${createBookDto.isbn} already exists`
      );
    }

    // Business Rule: Available copies cannot exceed total copies
    if (createBookDto.availableCopies > createBookDto.totalCopies) {
      throw new BadRequestException(
        'Available copies cannot exceed total copies'
      );
    }

    return this.repository.create(createBookDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    const book = this.repository.findById(id);
    
    if (!book) {
      throw new NotFoundException(`Book #${id} not found`);
    }
    
    return book;
  }

  findByAuthor(author: string) {
    const books = this.repository.findByAuthor(author);
    
    if (books.length === 0) {
      throw new NotFoundException(`No books found by author "${author}"`);
    }
    
    return books;
  }

  findAvailable() {
    return this.repository.findAvailableBooks();
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    this.findOne(id); // Ensure exists
    
    const updated = this.repository.update(id, updateBookDto);
    
    if (!updated) {
      throw new NotFoundException(`Book #${id} not found`);
    }
    
    return updated;
  }

  remove(id: number) {
    const book = this.findOne(id);
    
    // Business Rule: Cannot delete if books are currently borrowed
    if (book.availableCopies < book.totalCopies) {
      throw new BadRequestException(
        `Cannot delete book "${book.title}" because copies are currently borrowed`
      );
    }
    
    const success = this.repository.delete(id);
    
    if (!success) {
      throw new NotFoundException(`Book #${id} not found`);
    }
    
    return { message: 'Book deleted successfully' };
  }

  // Business Logic: Borrow book
  borrowBook(id: number) {
    const book = this.findOne(id);
    
    if (book.availableCopies === 0) {
      throw new BadRequestException(
        `Book "${book.title}" is currently unavailable`
      );
    }
    
    const updated = this.repository.updateAvailableCopies(id, -1);
    
    return {
      message: 'Book borrowed successfully',
      book: updated,
    };
  }

  // Business Logic: Return book
  returnBook(id: number) {
    const book = this.findOne(id);
    
    if (book.availableCopies >= book.totalCopies) {
      throw new BadRequestException(
        'All copies of this book are already in the library'
      );
    }
    
    const updated = this.repository.updateAvailableCopies(id, 1);
    
    return {
      message: 'Book returned successfully',
      book: updated,
    };
  }

  // Business Logic: Statistics
  getStatistics() {
    const books = this.repository.findAll();
    
    const totalBooks = books.length;
    const totalCopies = books.reduce((sum, b) => sum + b.totalCopies, 0);
    const availableCopies = books.reduce((sum, b) => sum + b.availableCopies, 0);
    const borrowedCopies = totalCopies - availableCopies;
    
    return {
      totalBooks,
      totalCopies,
      availableCopies,
      borrowedCopies,
      utilizationRate: ((borrowedCopies / totalCopies) * 100).toFixed(2) + '%',
    };
  }
}
```

#### 4. Controller
```typescript
// books.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query,
  ParseIntPipe 
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.booksService.findAvailable();
  }

  @Get('statistics')
  getStatistics() {
    return this.booksService.getStatistics();
  }

  @Get('author/:author')
  findByAuthor(@Param('author') author: string) {
    return this.booksService.findByAuthor(author);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  @Post(':id/borrow')
  borrowBook(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.borrowBook(id);
  }

  @Post(':id/return')
  returnBook(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.returnBook(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}
```

---

## Best Practices

### 1. **Keep Repository Methods Simple**

```typescript
// ✅ GOOD - Simple data access
@Injectable()
export class ProductsRepository {
  findById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }
}

// ❌ BAD - Business logic in repository
@Injectable()
export class ProductsRepository {
  findById(id: number): Product {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new NotFoundException(); // ❌ Business logic
    }
    return product;
  }
}
```

### 2. **Return Raw Data from Repository**

```typescript
// ✅ GOOD - Return raw data
findAll(): Product[] {
  return this.products;
}

// ❌ BAD - Transform data in repository
findAll(): ProductDto[] {
  return this.products.map(p => new ProductDto(p)); // ❌ Transformation
}
```

### 3. **Use Descriptive Method Names**

```typescript
// ✅ GOOD
findByCategory(category: string)
findAvailableProducts()
findExpensiveProducts(minPrice: number)

// ❌ BAD
getStuff()
getData()
find()
```

### 4. **Single Responsibility**

```typescript
// ✅ GOOD - Each method does one thing
findById(id: number)
create(product: Product)
update(id: number, data: Partial<Product>)

// ❌ BAD - Method doing too much
findAndUpdateAndNotify(id: number, data: any) // ❌
```

---

## Summary

### Key Points:
1. ✅ Repository = Data Access Layer
2. ✅ Separates data access from business logic
3. ✅ Makes testing easier
4. ✅ Allows switching data sources
5. ✅ Provides reusability

### Layers Comparison:

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Controller** | HTTP, routing | `@Get()`, `@Post()` |
| **Service** | Business logic | Validation, calculations |
| **Repository** | Data access | CRUD, queries |
| **Data Source** | Storage | Array, database |

### When to Use Repository Pattern:
- ✅ When you want clean separation
- ✅ When you plan to switch data sources
- ✅ When you need testability
- ✅ When building complex applications

### When You Might Skip It:
- ⚠️ Very simple CRUD apps
- ⚠️ Prototypes/demos
- ⚠️ When using ORM with active record pattern

---

**Next Chapter:** Building Complete CRUD API with all patterns combined! 🚀
