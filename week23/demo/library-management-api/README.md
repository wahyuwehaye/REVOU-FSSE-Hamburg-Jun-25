# 📚 Library Management API

Complete demo project showcasing NestJS + PostgreSQL + TypeORM integration for a library management system.

## 🎯 Features

### Entities & Relationships
- **Books** - Library book inventory
- **Authors** - Book authors (Many-to-Many with Books)
- **Members** - Library members
- **Borrowings** - Book borrowing records (relationships with Books and Members)

### Implemented Features
- ✅ Complete CRUD operations for all entities
- ✅ Entity relationships (One-to-Many, Many-to-Many)
- ✅ Advanced queries (search, filter, pagination)
- ✅ Database migrations
- ✅ Data seeding
- ✅ Input validation with DTOs
- ✅ Error handling
- ✅ Query optimization
- ✅ API documentation

## 🏗️ Project Structure

```
library-management-api/
├── src/
│   ├── config/
│   │   └── database.config.ts
│   ├── authors/
│   │   ├── dto/
│   │   │   ├── create-author.dto.ts
│   │   │   └── update-author.dto.ts
│   │   ├── author.entity.ts
│   │   ├── authors.controller.ts
│   │   ├── authors.service.ts
│   │   └── authors.module.ts
│   ├── books/
│   │   ├── dto/
│   │   │   ├── create-book.dto.ts
│   │   │   ├── update-book.dto.ts
│   │   │   └── query-book.dto.ts
│   │   ├── book.entity.ts
│   │   ├── books.controller.ts
│   │   ├── books.service.ts
│   │   └── books.module.ts
│   ├── members/
│   │   ├── dto/
│   │   ├── member.entity.ts
│   │   ├── members.controller.ts
│   │   ├── members.service.ts
│   │   └── members.module.ts
│   ├── borrowings/
│   │   ├── dto/
│   │   ├── borrowing.entity.ts
│   │   ├── borrowings.controller.ts
│   │   ├── borrowings.service.ts
│   │   └── borrowings.module.ts
│   ├── migrations/
│   ├── seeds/
│   │   ├── authors.seed.ts
│   │   ├── books.seed.ts
│   │   ├── members.seed.ts
│   │   └── index.ts
│   ├── app.module.ts
│   └── main.ts
├── .env.example
├── package.json
└── README.md
```

## 📊 Database Schema

```sql
-- Authors Table
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  bio TEXT,
  country VARCHAR(100),
  birthDate DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books Table
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  isbn VARCHAR(13) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  publishedYear INTEGER,
  totalCopies INTEGER DEFAULT 1,
  availableCopies INTEGER DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Members Table
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  membershipType VARCHAR(50) DEFAULT 'basic',
  joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isActive BOOLEAN DEFAULT true
);

-- Borrowings Table
CREATE TABLE borrowings (
  id SERIAL PRIMARY KEY,
  bookId INTEGER REFERENCES books(id),
  memberId INTEGER REFERENCES members(id),
  borrowedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dueDate TIMESTAMP NOT NULL,
  returnedAt TIMESTAMP,
  status VARCHAR(50) DEFAULT 'borrowed',
  fineAmount DECIMAL(10, 2) DEFAULT 0
);

-- Books_Authors Junction Table (Many-to-Many)
CREATE TABLE books_authors (
  bookId INTEGER REFERENCES books(id) ON DELETE CASCADE,
  authorId INTEGER REFERENCES authors(id) ON DELETE CASCADE,
  PRIMARY KEY (bookId, authorId)
);
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone and navigate to project:**
```bash
cd week23/demo/library-management-api
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=library_db
```

4. **Create database:**
```bash
psql -U postgres -c "CREATE DATABASE library_db;"
```

5. **Run migrations:**
```bash
npm run migration:run
```

6. **Seed database (optional):**
```bash
npm run seed
```

7. **Start application:**
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📋 API Endpoints

### Authors

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/authors` | Create new author |
| GET | `/authors` | Get all authors |
| GET | `/authors/:id` | Get author by ID |
| GET | `/authors/:id/books` | Get author's books |
| PUT | `/authors/:id` | Update author |
| DELETE | `/authors/:id` | Delete author |

### Books

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/books` | Create new book |
| GET | `/books` | Get all books (with search/filter) |
| GET | `/books/:id` | Get book by ID |
| GET | `/books/isbn/:isbn` | Get book by ISBN |
| PUT | `/books/:id` | Update book |
| DELETE | `/books/:id` | Delete book |

### Members

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/members` | Register new member |
| GET | `/members` | Get all members |
| GET | `/members/:id` | Get member by ID |
| GET | `/members/:id/borrowings` | Get member's borrowing history |
| PUT | `/members/:id` | Update member |
| DELETE | `/members/:id` | Delete member |

### Borrowings

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/borrowings` | Borrow a book |
| GET | `/borrowings` | Get all borrowings |
| GET | `/borrowings/active` | Get active borrowings |
| GET | `/borrowings/overdue` | Get overdue borrowings |
| PUT | `/borrowings/:id/return` | Return a book |
| GET | `/borrowings/:id` | Get borrowing by ID |

## 📝 Example API Calls

### Create Author
```bash
curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "J.K. Rowling",
    "bio": "British author, best known for Harry Potter series",
    "country": "United Kingdom",
    "birthDate": "1965-07-31"
  }'
```

### Create Book
```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "9780747532743",
    "title": "Harry Potter and the Philosophers Stone",
    "description": "First book in the Harry Potter series",
    "publishedYear": 1997,
    "totalCopies": 5,
    "availableCopies": 5,
    "authorIds": [1]
  }'
```

### Search Books
```bash
# Search by title
curl "http://localhost:3000/books?search=Harry"

# Filter by year
curl "http://localhost:3000/books?publishedYear=1997"

# Pagination
curl "http://localhost:3000/books?page=1&limit=10"
```

### Register Member
```bash
curl -X POST http://localhost:3000/members \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "membershipType": "premium"
  }'
```

### Borrow Book
```bash
curl -X POST http://localhost:3000/borrowings \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": 1,
    "memberId": 1,
    "dueDate": "2024-02-01"
  }'
```

### Return Book
```bash
curl -X PUT http://localhost:3000/borrowings/1/return
```

## 🔍 Advanced Features

### Search & Filter
```bash
# Search books by title/description
GET /books?search=potter

# Filter by published year
GET /books?publishedYear=1997

# Get available books only
GET /books?available=true

# Combined filters
GET /books?search=harry&publishedYear=1997&page=1&limit=10
```

### Statistics
```bash
# Get borrowing statistics
GET /borrowings/stats

Response:
{
  "totalBorrowings": 150,
  "activeBorrowings": 45,
  "overdueBorrowings": 5,
  "totalFines": 125.50
}
```

### Overdue Books
```bash
GET /borrowings/overdue

Response:
[
  {
    "id": 1,
    "book": {
      "title": "Harry Potter",
      "isbn": "9780747532743"
    },
    "member": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "dueDate": "2024-01-15",
    "daysOverdue": 5,
    "fineAmount": 5.00
  }
]
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Coverage
```bash
npm run test:cov
```

## 📚 Key Learning Points

### 1. Entity Relationships
- **One-to-Many:** Member → Borrowings
- **Many-to-One:** Borrowing → Book
- **Many-to-Many:** Books ↔ Authors

### 2. Advanced Queries
```typescript
// Find books with authors
const books = await this.bookRepository.find({
  relations: ['authors'],
  where: { availableCopies: MoreThan(0) },
});

// Search with Query Builder
const books = await this.bookRepository
  .createQueryBuilder('book')
  .leftJoinAndSelect('book.authors', 'author')
  .where('book.title ILIKE :search', { search: `%${search}%` })
  .orWhere('book.description ILIKE :search', { search: `%${search}%` })
  .getMany();
```

### 3. Business Logic
- **Availability Check:** Prevent borrowing when no copies available
- **Fine Calculation:** Automatic fine for overdue books
- **Status Management:** Track borrowing status (borrowed, returned, overdue)

### 4. Data Validation
```typescript
// DTOs with validation
export class CreateBookDto {
  @IsISBN()
  isbn: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @IsInt()
  @Min(1)
  totalCopies: number;
}
```

## 🚨 Common Issues & Solutions

### Issue 1: Book not available
**Error:** "Book is not available for borrowing"

**Solution:** Check `availableCopies` > 0 before borrowing

### Issue 2: Member has overdue books
**Solution:** Implement fine payment before allowing new borrowings

### Issue 3: Duplicate ISBN
**Error:** "Book with ISBN already exists"

**Solution:** Use unique constraint on ISBN column

## 🎓 Exercises

1. **Add book categories/genres** (Many-to-Many)
2. **Implement reservation system** (members can reserve borrowed books)
3. **Add late fee calculation** (dynamic based on membership type)
4. **Implement book ratings and reviews**
5. **Add email notifications** (due date reminders)
6. **Generate borrowing reports** (monthly statistics)

## 📖 Further Reading

- [TypeORM Relations](https://typeorm.io/relations)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don%27t_Do_This)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Happy Coding! 🚀**
