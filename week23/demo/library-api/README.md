# 📚 Library Management API

Complete REST API for managing a library system with books, authors, members, and borrowings. Built with NestJS, TypeORM, and PostgreSQL.

![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?logo=postgresql)
![TypeORM](https://img.shields.io/badge/TypeORM-0.3.x-FE0803)

---

## 🎯 Overview

This is a **production-ready Library Management API** demonstrating Week 23 concepts:
- Database design with proper relationships
- TypeORM entities and repositories
- JWT authentication & authorization
- Complex business logic (borrowing system with availability tracking)
- Query optimization and filtering
- Data validation and error handling

**Perfect for learning:**
- How to build REST APIs with NestJS + PostgreSQL
- Database relationships (One-to-Many, Many-to-One)
- TypeORM in real-world scenarios
- Authentication with JWT
- Best practices for API development

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration with role-based access (Member, Librarian, Admin)
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes with Guards
- Token expiration and refresh

### 📖 Book Management
- Complete CRUD operations
- Book categorization
- Author association
- ISBN validation (unique constraint)
- Availability tracking
- Book statistics (total borrowings, active borrowings)
- Filter by status, category, or author
- Search by ISBN

### 👥 User Management
- User profiles with contact information
- Membership expiry dates
- Role-based permissions
- User statistics (borrowing history)
- Account activation/deactivation

### ✍️ Author Management
- Author profiles with biography
- Multiple books per author (One-to-Many)
- Country and birth date tracking
- Photo URL and website links

### 🏷️ Category Management
- Book categorization with slugs
- Auto-generated slugs from names
- Category descriptions
- Books per category

### 📋 Borrowing System
- Borrow and return books
- Due date tracking
- Automatic late fee calculation (Rp 5,000/day)
- Status management (Borrowed, Returned, Overdue)
- Availability sync (auto-update book copies)
- Overdue borrowings report
- Filter by user, book, or status

---

## 🗄️ Database Schema

```
┌─────────────┐
│   Users     │
├─────────────┤
│ id          │◄──────┐
│ email       │       │
│ fullName    │       │
│ password    │       │
│ role        │       │
│ phoneNumber │       │
│ address     │       │
│ isActive    │       │
│ membership  │       │
└─────────────┘       │
                      │
                      │ One User
                      │ Many Borrowings
                      │
┌─────────────┐       │
│ Borrowings  │       │
├─────────────┤       │
│ id          │       │
│ userId      │───────┘
│ bookId      │───────┐
│ borrowDate  │       │
│ dueDate     │       │
│ returnDate  │       │
│ status      │       │
│ lateFee     │       │
│ notes       │       │
└─────────────┘       │
                      │
                      │ One Book
                      │ Many Borrowings
                      │
┌─────────────┐       │
│   Books     │       │
├─────────────┤       │
│ id          │◄──────┘
│ title       │
│ isbn        │ (unique)
│ description │
│ publisher   │
│ publishedDate│
│ totalCopies │
│ availableCopies│
│ status      │
│ coverImage  │
│ pageCount   │
│ language    │
│ authorId    │───────┐
│ categoryId  │───────┼───┐
└─────────────┘       │   │
                      │   │
                      │   │ Many Books
                      │   │ One Category
                      │   │
                      │   └───►┌─────────────┐
                      │        │ Categories  │
                      │        ├─────────────┤
                      │        │ id          │
                      │        │ name        │
                      │        │ slug        │
                      │        │ description │
                      │        └─────────────┘
                      │
                      │ Many Books
                      │ One Author
                      │
                      └───►┌─────────────┐
                           │  Authors    │
                           ├─────────────┤
                           │ id          │
                           │ name        │
                           │ biography   │
                           │ birthDate   │
                           │ country     │
                           │ website     │
                           │ photoUrl    │
                           └─────────────┘
```

### Relationships

- **Users → Borrowings**: One-to-Many
- **Books → Borrowings**: One-to-Many
- **Authors → Books**: One-to-Many
- **Categories → Books**: One-to-Many

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create database
createdb library_db

# 3. Configure environment
cp .env.example .env
# Update DATABASE_USERNAME in .env

# 4. Build application
npm run build

# 5. Run application
node dist/main.js
```

**API URL:** `http://localhost:3001/api`

---

## 📖 API Documentation

### Base URL

```
http://localhost:3001/api
```

### Authentication

Most endpoints require JWT authentication. Include token in header:

```
Authorization: Bearer <your_jwt_token>
```

---

### 🔑 Auth Endpoints

#### Register User

```http
POST /api/auth/register
```

**Body:**

```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "password": "password123",
  "role": "member", // optional: member | librarian | admin
  "phoneNumber": "08123456789", // optional
  "address": "123 Street", // optional
  "membershipExpiryDate": "2025-12-31" // optional
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "member",
    "isActive": true
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login

```http
POST /api/auth/login
```

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

### 👥 Users Endpoints (Protected)

#### Get All Users

```http
GET /api/users
```

#### Get User by ID

```http
GET /api/users/:id
```

#### Get User Statistics

```http
GET /api/users/:id/stats
```

**Response:**

```json
{
  "user": { ... },
  "statistics": {
    "totalBorrowings": 10,
    "activeBorrowings": 2
  }
}
```

#### Update User

```http
PATCH /api/users/:id
```

#### Delete User

```http
DELETE /api/users/:id
```

---

### ✍️ Authors Endpoints

#### Create Author (Protected)

```http
POST /api/authors
```

**Body:**

```json
{
  "name": "J.K. Rowling",
  "biography": "British author, best known for Harry Potter series",
  "birthDate": "1965-07-31", // optional
  "country": "United Kingdom", // optional
  "website": "https://jkrowling.com", // optional
  "photoUrl": "https://..." // optional
}
```

#### Get All Authors (Public)

```http
GET /api/authors
```

#### Get Author by ID (Public)

```http
GET /api/authors/:id
```

#### Update Author (Protected)

```http
PATCH /api/authors/:id
```

#### Delete Author (Protected)

```http
DELETE /api/authors/:id
```

---

### 🏷️ Categories Endpoints

#### Create Category (Protected)

```http
POST /api/categories
```

**Body:**

```json
{
  "name": "Science Fiction",
  "description": "Sci-fi and futuristic novels" // optional
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Science Fiction",
  "slug": "science-fiction", // auto-generated
  "description": "Sci-fi and futuristic novels"
}
```

#### Get All Categories (Public)

```http
GET /api/categories
```

#### Get Category by ID (Public)

```http
GET /api/categories/:id
```

#### Get Category by Slug (Public)

```http
GET /api/categories/slug/:slug
```

Example: `/api/categories/slug/science-fiction`

#### Update Category (Protected)

```http
PATCH /api/categories/:id
```

#### Delete Category (Protected)

```http
DELETE /api/categories/:id
```

---

### 📖 Books Endpoints

#### Create Book (Protected)

```http
POST /api/books
```

**Body:**

```json
{
  "title": "Harry Potter and the Philosopher's Stone",
  "isbn": "978-0747532743",
  "description": "The first book in the Harry Potter series",
  "publisher": "Bloomsbury",
  "publishedDate": "1997-06-26",
  "totalCopies": 5,
  "availableCopies": 5, // optional, defaults to totalCopies
  "status": "available", // optional: available | borrowed | maintenance | lost
  "coverImageUrl": "https://...", // optional
  "pageCount": 223, // optional
  "language": "English", // optional
  "authorId": "uuid",
  "categoryId": "uuid"
}
```

#### Get All Books (Public)

```http
GET /api/books
GET /api/books?status=available
GET /api/books?categoryId=uuid
GET /api/books?authorId=uuid
```

**Query Parameters:**

- `status`: available | borrowed | maintenance | lost
- `categoryId`: Filter by category UUID
- `authorId`: Filter by author UUID

#### Get Book by ID (Public)

```http
GET /api/books/:id
```

#### Get Book Statistics (Public)

```http
GET /api/books/:id/stats
```

**Response:**

```json
{
  "book": { ... },
  "statistics": {
    "totalBorrowings": 50,
    "activeBorrowings": 3,
    "availableCopies": 2,
    "totalCopies": 5
  }
}
```

#### Get Book by ISBN (Public)

```http
GET /api/books/isbn/:isbn
```

Example: `/api/books/isbn/978-0747532743`

#### Update Book (Protected)

```http
PATCH /api/books/:id
```

#### Delete Book (Protected)

```http
DELETE /api/books/:id
```

---

### 📋 Borrowings Endpoints (All Protected)

#### Create Borrowing

```http
POST /api/borrowings
```

**Body:**

```json
{
  "userId": "uuid",
  "bookId": "uuid",
  "borrowDate": "2024-12-02",
  "dueDate": "2024-12-16",
  "notes": "First borrowing" // optional
}
```

**What happens:**
- Borrowing record created with status "borrowed"
- Book's `availableCopies` decreased by 1
- Book's `status` updated to "borrowed" if no copies left

#### Get All Borrowings

```http
GET /api/borrowings
GET /api/borrowings?status=borrowed
GET /api/borrowings?userId=uuid
GET /api/borrowings?bookId=uuid
```

**Query Parameters:**

- `status`: borrowed | returned | overdue
- `userId`: Filter by user UUID
- `bookId`: Filter by book UUID

#### Get Borrowing by ID

```http
GET /api/borrowings/:id
```

#### Get Overdue Borrowings

```http
GET /api/borrowings/overdue
```

Returns all borrowings that are past due date and not yet returned.

#### Return Book

```http
POST /api/borrowings/:id/return
```

**Body:**

```json
{
  "returnDate": "2024-12-15",
  "lateFee": 10000 // optional, auto-calculated if not provided
}
```

**What happens:**
- Borrowing status updated to "returned" or "overdue"
- Late fee calculated automatically (Rp 5,000/day)
- Book's `availableCopies` increased by 1
- Book's `status` updated to "available"

#### Update Borrowing

```http
PATCH /api/borrowings/:id
```

#### Delete Borrowing

```http
DELETE /api/borrowings/:id
```

**What happens:**
- If status is "borrowed", book availability is restored
- Borrowing record deleted

---

## 🔧 Project Structure

```
src/
├── config/
│   └── database.config.ts    # TypeORM configuration
├── auth/
│   ├── dto/
│   │   └── login.dto.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── local-auth.guard.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── dto/
│   │   ├── register.dto.ts
│   │   └── update-user.dto.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── authors/
│   ├── entities/
│   │   └── author.entity.ts
│   ├── dto/
│   ├── authors.controller.ts
│   ├── authors.service.ts
│   └── authors.module.ts
├── categories/
│   ├── entities/
│   │   └── category.entity.ts
│   ├── dto/
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── categories.module.ts
├── books/
│   ├── entities/
│   │   └── book.entity.ts
│   ├── dto/
│   ├── books.controller.ts
│   ├── books.service.ts
│   └── books.module.ts
├── borrowings/
│   ├── entities/
│   │   └── borrowing.entity.ts
│   ├── dto/
│   ├── borrowings.controller.ts
│   ├── borrowings.service.ts
│   └── borrowings.module.ts
├── app.module.ts
└── main.ts
```

---

## 🎓 Key Implementation Details

### 1. Entity Relationships

**One-to-Many: Author → Books**

```typescript
// Author Entity
@OneToMany(() => Book, (book) => book.author)
books: Book[];

// Book Entity
@ManyToOne(() => Author, (author) => author.books, { eager: true })
@JoinColumn({ name: 'authorId' })
author: Author;
```

### 2. Auto-Generated Slugs

Categories use slugify for URL-friendly identifiers:

```typescript
const slug = slugify(name, { lower: true, strict: true });
// "Science Fiction" → "science-fiction"
```

### 3. JWT Authentication

```typescript
// Generate token
const payload = { sub: userId, email };
const token = this.jwtService.sign(payload);

// Validate token with Guard
@UseGuards(JwtAuthGuard)
```

### 4. Password Hashing

```typescript
// Hash on register
const hashedPassword = await bcrypt.hash(password, 10);

// Compare on login
const isValid = await bcrypt.compare(password, user.password);
```

### 5. Availability Tracking

```typescript
// When book is borrowed
await this.booksService.updateAvailability(bookId, -1);

// When book is returned
await this.booksService.updateAvailability(bookId, +1);
```

### 6. Late Fee Calculation

```typescript
if (returnDate > dueDate) {
  const daysLate = Math.ceil(
    (returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  lateFee = daysLate * 5000; // Rp 5,000 per day
}
```

### 7. Query Builder for Complex Queries

```typescript
const books = await this.booksRepository
  .createQueryBuilder('book')
  .leftJoinAndSelect('book.author', 'author')
  .leftJoinAndSelect('book.category', 'category')
  .where('book.status = :status', { status: 'available' })
  .orderBy('book.title', 'ASC')
  .getMany();
```

---

## 🎯 Learning Objectives

This project demonstrates:

✅ **TypeORM Entities** - Entity decorators, column types, constraints  
✅ **Relationships** - One-to-Many, Many-to-One, eager/lazy loading  
✅ **DTOs & Validation** - class-validator decorators, PartialType  
✅ **JWT Authentication** - Token generation, verification, guards  
✅ **Password Security** - Bcrypt hashing, password exclusion  
✅ **Business Logic** - Availability tracking, late fees, status management  
✅ **Query Optimization** - Query builder, filtering, eager loading  
✅ **Error Handling** - Custom exceptions, validation errors  
✅ **Database Design** - Normalized schema, foreign keys, indexes  
✅ **RESTful API** - Proper HTTP methods, status codes, resources  

---

## ⚠️ Important Notes

### Development vs Production

This setup is for **development/learning**:

- `synchronize: true` - Auto-creates/updates tables (⚠️ NEVER use in production!)
- Logging enabled - See all SQL queries
- Simple .env configuration

**For production:**

- Use migrations instead of synchronize
- Disable query logging
- Use environment-specific configs
- Add rate limiting
- Enable CORS properly
- Use HTTPS
- Add request validation
- Implement caching

### Security Considerations

- Passwords are hashed with bcrypt (salt rounds: 10)
- JWT tokens expire after 7 days
- Protected routes require valid token
- Password field excluded from responses using `@Exclude()`
- Input validation on all DTOs

---

## 📊 Database Statistics

- **Tables:** 5 (users, authors, categories, books, borrowings)
- **Enums:** 3 (user_role, book_status, borrowing_status)
- **Foreign Keys:** 4 (books→authors, books→categories, borrowings→users, borrowings→books)
- **Unique Constraints:** 3 (user.email, book.isbn, category.slug)

---

## 🧪 Testing

### Manual Testing with cURL

See [DEMO_QUICK_START.md](../DEMO_QUICK_START.md) for complete testing guide.

### Postman Collection

Import `postman/Library-API.postman_collection.json` for ready-to-use requests with auto-variable saving.

---

## 🚀 Future Enhancements

Ideas for extending this project:

1. **Pagination** - Add pagination to list endpoints
2. **Search** - Full-text search for books by title/author
3. **Ratings & Reviews** - Add book ratings and reviews
4. **Reservations** - Allow users to reserve books
5. **Email Notifications** - Send reminders for due dates
6. **File Upload** - Upload book covers and author photos
7. **Admin Dashboard** - Statistics and reports
8. **Fines Management** - Track and manage late fees
9. **Book Recommendations** - Suggest books based on history
10. **Export Data** - Export reports to CSV/PDF

---

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- Week 23 Materials - Database & SQL fundamentals

---

## 📝 License

MIT

---

## 🎉 Acknowledgments

Created for **Week 23: Database & SQL with PostgreSQL** course materials.

Demonstrates practical application of:
- Database design principles
- TypeORM best practices
- NestJS architecture
- RESTful API development
- Authentication & authorization

---

**Happy Learning! 🚀**
