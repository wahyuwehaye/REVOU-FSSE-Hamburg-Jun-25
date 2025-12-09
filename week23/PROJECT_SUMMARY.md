# Week 23 Sample Project - Library Management API

## 🎉 Project Complete!

Complete working sample demonstrating **Week 23: Database & SQL with PostgreSQL** concepts.

---

## 📁 Project Location

```
week23/demo/library-api/
```

---

## ✅ What's Included

### 1. **Complete REST API Application**
- **Framework:** NestJS 10.x + TypeORM 0.3.17
- **Database:** PostgreSQL (library_db)
- **Authentication:** JWT with bcrypt password hashing
- **Modules:** 6 complete modules with 37 API endpoints
- **Status:** ✅ Built, tested, and running on port 3001

### 2. **Database Schema**
- ✅ 5 tables with proper relationships
- ✅ 3 enums (user roles, book status, borrowing status)
- ✅ 4 foreign key constraints
- ✅ Unique constraints on email, ISBN, category slug
- ✅ Auto-synchronized with TypeORM

### 3. **Key Features**
- 🔐 JWT Authentication & Authorization
- 📖 Book Management with availability tracking
- 👥 User Management with roles (Member/Librarian/Admin)
- ✍️ Author Management
- 🏷️ Category Management with auto-generated slugs
- 📋 Complete Borrowing System with late fees
- 📊 Statistics endpoints (user stats, book stats)
- 🔍 Advanced filtering and search

### 4. **Documentation**

#### ✅ DEMO_QUICK_START.md (~650 lines)
Location: `week23/DEMO_QUICK_START.md`

Contains:
- Prerequisites checklist
- 5-minute setup instructions
- 9 cURL test examples (complete workflow)
- 100+ line bash testing script
- SQL exploration queries
- Troubleshooting guide (5 common issues)
- All 37 API endpoints documented
- 10 learning objectives
- Next steps suggestions

#### ✅ README.md (~1000+ lines)
Location: `week23/demo/library-api/README.md`

Contains:
- Complete project overview
- Features list with descriptions
- ASCII database schema diagram
- All 37 endpoints with request/response examples
- Quick start guide
- Project structure breakdown
- Key implementation details (code examples)
- Learning objectives
- Security considerations
- Future enhancements suggestions

#### ✅ Postman Collection (~1000 lines)
Location: `week23/demo/library-api/postman/Library-API.postman_collection.json`

Contains:
- All 37 endpoints organized in 6 folders
- Auto-save test scripts for variables
- Sample request bodies with realistic data
- Collection-level authentication
- Pre-request scripts
- Query parameter examples
- 10 collection variables

---

## 🚀 Quick Start

### Option 1: Using Quick Start Guide

```bash
# Follow the comprehensive guide
cd week23
open DEMO_QUICK_START.md  # or use your text editor
```

### Option 2: 5-Minute Setup

```bash
# 1. Navigate to project
cd week23/demo/library-api

# 2. Install dependencies
npm install

# 3. Create database
createdb library_db

# 4. Update .env (change DATABASE_USERNAME if needed)
nano .env

# 5. Build and run
npm run build
node dist/main.js

# 6. Test API (in another terminal)
curl http://localhost:3001/api/authors
```

### Option 3: Using Postman

```bash
# 1. Import collection
Postman → Import → week23/demo/library-api/postman/Library-API.postman_collection.json

# 2. Run "Auth > Register Librarian" first
# Token will be auto-saved

# 3. Run other requests in order:
#    - Create Author
#    - Create Category
#    - Create Book
#    - Register Member
#    - Create Borrowing
#    - Return Book
```

---

## 📊 Project Statistics

- **Total Files:** 50+ TypeScript files
- **Lines of Code:** ~3,000+ lines
- **Dependencies:** 18 production packages (816 total with devDependencies)
- **API Endpoints:** 37 endpoints across 6 controllers
- **Database Tables:** 5 tables with complex relationships
- **Documentation:** 2,650+ lines across 3 files

---

## 🎓 Learning Objectives Covered

### Database Concepts
✅ Database design with normalization  
✅ Entity relationships (One-to-Many, Many-to-One)  
✅ Foreign key constraints  
✅ Unique constraints and indexes  
✅ Enums for status values  
✅ UUID primary keys  

### TypeORM Features
✅ Entity decorators (@Entity, @Column, @PrimaryGeneratedColumn)  
✅ Relationship decorators (@OneToMany, @ManyToOne, @JoinColumn)  
✅ Repository pattern  
✅ Query builder for complex queries  
✅ Eager/lazy loading  
✅ Schema synchronization  

### NestJS Architecture
✅ Modular architecture (6 modules)  
✅ Dependency injection  
✅ DTOs with class-validator  
✅ Guards for authentication  
✅ Services for business logic  
✅ Controllers for routing  

### Security & Best Practices
✅ JWT token authentication  
✅ Password hashing with bcrypt  
✅ Protected routes with guards  
✅ Input validation  
✅ Error handling  
✅ Environment configuration  

---

## 🛠️ Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| **NestJS** | 10.x | Progressive Node.js framework |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **TypeORM** | 0.3.17 | Database ORM |
| **PostgreSQL** | 14+ | Relational database |
| **JWT** | 10.x | Authentication tokens |
| **bcrypt** | 5.1.1 | Password hashing |
| **class-validator** | 0.14.0 | DTO validation |
| **slugify** | 1.6.6 | URL-friendly slugs |

---

## 📈 API Endpoints Summary

### Public Endpoints (15)
- Auth: Register, Login
- Authors: List, Get by ID
- Categories: List, Get by ID, Get by Slug
- Books: List, Get by ID, Get Stats, Get by ISBN, Filter by Status/Category/Author

### Protected Endpoints (22)
- Users: All 5 endpoints (List, Get, Stats, Update, Delete)
- Authors: Create, Update, Delete
- Categories: Create, Update, Delete
- Books: Create, Update, Delete
- Borrowings: All 7 endpoints (Create, List, Get, Return, Update, Delete, Overdue)

---

## 🧪 Testing Examples

### cURL Example
```bash
# Register librarian
TOKEN=$(curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@lib.com","fullName":"Test","password":"test123","role":"librarian"}' \
  | jq -r '.access_token')

# Create book
curl -X POST http://localhost:3001/api/books \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","isbn":"978-1234567890",...}'
```

### Postman Example
1. Import collection
2. Run "Auth > Register Librarian"
3. Token auto-saved to `{{token}}`
4. All subsequent requests automatically authenticated

---

## 🔧 Configuration

### Environment Variables (.env)
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=wehaye  # Change this to your PostgreSQL username
DATABASE_PASSWORD=
DATABASE_NAME=library_db

# Application
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

---

## 📝 Database Schema Overview

```
Users (members, librarians, admins)
  ↓ (One-to-Many)
Borrowings ← Tracks loans with due dates
  ↓ (Many-to-One)
Books ← Manages inventory with availability
  ↓ (Many-to-One)
Authors & Categories ← Book metadata
```

**Key Business Logic:**
- Borrowing a book → Decreases `availableCopies` by 1
- Returning a book → Increases `availableCopies` by 1
- Late returns → Auto-calculates fee (Rp 5,000/day)
- Overdue detection → Status changes to "overdue"
- Book status → Auto-updates based on availability

---

## ⚠️ Important Notes

### Development Mode
This project uses `synchronize: true` in TypeORM:
- ✅ Great for learning and development
- ✅ Auto-creates/updates database schema
- ⚠️ **NEVER use in production!**

For production:
- Use TypeORM migrations
- Disable synchronize
- Use proper environment configs
- Add rate limiting and CORS
- Enable HTTPS

### Port Configuration
Default port: **3001** (changed from 3000 to avoid conflicts)

Update in `.env`:
```env
PORT=3001
```

---

## 🎯 Next Steps

### For Learning:
1. ✅ Follow DEMO_QUICK_START.md to set up and test
2. ✅ Study entity relationships in `src/*/entities/`
3. ✅ Review business logic in `src/*/services/`
4. ✅ Explore SQL queries in database using provided examples
5. ✅ Test API with Postman collection

### For Extension:
1. Add pagination to list endpoints
2. Implement full-text search for books
3. Add book ratings and reviews
4. Create reservation system
5. Add email notifications for due dates
6. Implement admin dashboard
7. Add file upload for book covers
8. Create data export (CSV/PDF)
9. Add unit tests
10. Deploy to cloud platform

---

## 📞 Troubleshooting

Common issues and solutions are documented in:
- **DEMO_QUICK_START.md** - Section: "Troubleshooting"

Covers:
- Port already in use
- Database connection errors
- Missing node_modules
- JWT token expired
- Circular dependency warnings

---

## ✅ Project Checklist

### Application
- [x] NestJS project structure
- [x] 6 modules implemented
- [x] TypeORM entities with relationships
- [x] DTOs with validation
- [x] JWT authentication
- [x] Protected routes with guards
- [x] Business logic (availability, late fees)
- [x] Query filtering
- [x] 37 API endpoints
- [x] Error handling

### Database
- [x] PostgreSQL setup
- [x] 5 tables created
- [x] Relationships configured
- [x] Constraints (unique, foreign keys)
- [x] Enums for status values
- [x] Schema auto-synchronized

### Documentation
- [x] Quick start guide (650 lines)
- [x] Comprehensive README (1000+ lines)
- [x] Postman collection (1000 lines)
- [x] Code comments
- [x] API examples
- [x] SQL queries
- [x] Troubleshooting guide

### Testing
- [x] Manual testing with cURL
- [x] Complete workflow script
- [x] Postman collection ready
- [x] Application running successfully
- [x] Database schema verified

---

## 🎉 Ready to Use!

The Library Management API is **fully functional** and ready for:
- ✅ Learning database concepts
- ✅ Understanding TypeORM relationships
- ✅ Studying NestJS architecture
- ✅ Practicing API testing
- ✅ Teaching Week 23 materials
- ✅ Extending with new features

**Start with:** `week23/DEMO_QUICK_START.md`

Happy learning! 🚀📚
