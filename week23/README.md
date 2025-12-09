# 🗄️ Week 23: Database & SQL with PostgreSQL

## 📚 Overview

Week 23 membahas **Database fundamentals, SQL, dan integration dengan NestJS**. Student akan belajar dari zero hingga mampu membuat full-stack application dengan PostgreSQL database.

### 🎯 Learning Goals

Setelah menyelesaikan Week 23, students akan mampu:

✅ Memahami database fundamentals dan pentingnya  
✅ Membedakan SQL vs NoSQL databases  
✅ Menulis SQL queries (SELECT, INSERT, UPDATE, DELETE)  
✅ Menggunakan JOINs, subqueries, dan advanced SQL  
✅ Optimize database performance dengan indexing  
✅ Integrate PostgreSQL dengan NestJS menggunakan TypeORM  
✅ Implement migrations dan seeding  
✅ Build complete API dengan database CRUD operations  

---

## 📖 Course Structure

### 🌟 Part 1: Introduction to Databases (Day 1-2)

**Learning Time:** 4-6 hours

| Material | Topics | Time |
|----------|--------|------|
| [01-introduction-to-databases.md](./materi/01-introduction-to-databases.md) | What is database, Why important, Use cases | 1h |
| [02-what-is-data.md](./materi/02-what-is-data.md) | Data types, Structured vs Unstructured, Data modeling | 1h |
| [03-database-management-systems.md](./materi/03-database-management-systems.md) | PostgreSQL, MySQL, MongoDB, Comparison | 1.5h |
| [04-sql-vs-nosql.md](./materi/04-sql-vs-nosql.md) | Relational vs NoSQL, When to use each, Trade-offs | 1.5h |
| [05-how-to-manage-database.md](./materi/05-how-to-manage-database.md) | Installation, Tools (psql, pgAdmin, DBeaver), Best practices | 1.5h |

**🎯 Outcomes:**
- Understand what databases are and why we need them
- Know the difference between SQL and NoSQL
- Can install and manage PostgreSQL
- Familiar with database tools

---

### 📊 Part 2: SQL Fundamentals (Day 3-5)

**Learning Time:** 8-10 hours

| Material | Topics | Time |
|----------|--------|------|
| [06-introduction-to-sql.md](./materi/06-introduction-to-sql.md) | SQL basics, Syntax, Statement categories (DDL, DML, DCL, TCL) | 1.5h |
| [07-selecting-data.md](./materi/07-selecting-data.md) | SELECT queries, Columns, Aliases, Aggregates, Functions | 2h |
| 08-filtering-sorting-data.md | WHERE, AND/OR/NOT, LIKE, IN, BETWEEN, ORDER BY, LIMIT | 2h |
| 09-grouping-data.md | GROUP BY, HAVING, Aggregate functions with grouping | 1.5h |
| 10-inserting-updating-data.md | INSERT, UPDATE, DELETE, RETURNING, Bulk operations | 1.5h |

**🎯 Outcomes:**
- Write basic SQL queries
- Filter and sort data effectively
- Use aggregate functions
- Manipulate data (CRUD)

**📝 Practice:**
- Complete SQL exercises in `/exercises/sql-basics/`
- Try examples in `/examples/sql-queries/`

---

### 🔥 Part 3: Advanced SQL (Day 6-8)

**Learning Time:** 10-12 hours

| Material | Topics | Time |
|----------|--------|------|
| 11-sql-joins.md | INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN, Self JOIN | 2.5h |
| 12-unions-subqueries.md | UNION, UNION ALL, Subqueries, EXISTS, IN with subquery | 2h |
| 13-modifying-data-advanced.md | Transactions, ACID, CASCADE, ON DELETE/UPDATE | 2h |
| 14-indexing-optimization.md | Indexes, B-tree, Query optimization, EXPLAIN ANALYZE | 2.5h |
| 15-advanced-features.md | Views, CTEs (WITH), Window functions, Full-text search | 2h |

**🎯 Outcomes:**
- Combine data from multiple tables with JOINs
- Write complex queries with subqueries
- Understand transactions and data integrity
- Optimize queries with indexing

**📝 Practice:**
- Complete exercises in `/exercises/advanced-sql/`
- Analyze query performance

---

### 🚀 Part 4: NestJS + PostgreSQL Integration (Day 9-12)

**Learning Time:** 12-15 hours

| Material | Topics | Time |
|----------|--------|------|
| 16-nestjs-database-setup.md | TypeORM setup, Configuration, Database connection | 2h |
| 17-entities-repositories.md | Define entities, Decorators, Repository pattern | 2.5h |
| 18-basic-crud-typeorm.md | Create, Read, Update, Delete with TypeORM | 2.5h |
| 19-relationships-typeorm.md | One-to-One, One-to-Many, Many-to-Many relations | 3h |
| 20-migrations-seeding.md | Database migrations, Seeding data, Version control | 2h |
| 21-query-optimization-nestjs.md | Query builder, Raw queries, Indexes, Caching | 2h |
| 22-production-best-practices.md | Connection pooling, Error handling, Security, Backups | 2h |

**🎯 Outcomes:**
- Connect NestJS to PostgreSQL
- Define entities and relationships
- Implement full CRUD operations
- Manage database schema with migrations
- Deploy production-ready database

**📝 Practice:**
- Build complete API with database
- Implement all CRUD operations
- Create migrations and seeds

---

## 🎓 Learning Path & Timeline

### Recommended Schedule (12 Days)

```
Week 1: Fundamentals
├── Day 1-2: Database Introduction (Part 1)
│   ├── Morning: Read materials 01-03
│   ├── Afternoon: Install PostgreSQL, Setup tools
│   └── Evening: Practice basic queries
│
├── Day 3-4: SQL Basics (Part 2, first half)
│   ├── Morning: Read materials 06-07
│   ├── Afternoon: Practice SELECT queries
│   └── Evening: Exercises + Examples
│
└── Day 5-6: SQL Fundamentals (Part 2, second half)
    ├── Morning: Read materials 08-10
    ├── Afternoon: Practice filtering, grouping
    └── Evening: Complete SQL basics exercises

Week 2: Advanced & Integration
├── Day 7-8: Advanced SQL (Part 3, first half)
│   ├── Morning: Read materials 11-12 (JOINs, Subqueries)
│   ├── Afternoon: Practice complex queries
│   └── Evening: Join exercises
│
├── Day 9-10: Advanced SQL (Part 3, second half)
│   ├── Morning: Read materials 13-15 (Optimization)
│   ├── Afternoon: Practice indexing, transactions
│   └── Evening: Performance exercises
│
└── Day 11-12: NestJS Integration (Part 4)
    ├── Morning: Setup TypeORM, Define entities
    ├── Afternoon: Implement CRUD operations
    └── Evening: Complete demo project
```

### Intensive Schedule (6 Days)

```
Day 1: Database Fundamentals (All Part 1)
Day 2: SQL Basics (All Part 2)
Day 3: SQL Advanced - Queries (Part 3: Materials 11-13)
Day 4: SQL Advanced - Optimization (Part 3: Materials 14-15)
Day 5: NestJS Setup & CRUD (Part 4: Materials 16-18)
Day 6: Relations, Migrations & Production (Part 4: Materials 19-22)
```

---

## 🛠️ Prerequisites

### Required Knowledge
- ✅ JavaScript/TypeScript basics
- ✅ Node.js fundamentals
- ✅ Basic terminal/command line usage
- ✅ Understanding of REST APIs
- ✅ NestJS basics (from Week 22)

### Required Software

```bash
# 1. PostgreSQL 14+
# macOS:
brew install postgresql@14

# Or use Docker:
docker pull postgres:14

# 2. Database Tool (choose one):
# - pgAdmin (https://www.pgadmin.org/)
# - DBeaver (https://dbeaver.io/)
# - TablePlus (https://tableplus.com/)
# - VS Code PostgreSQL extension

# 3. Node.js & npm
node --version  # v18+
npm --version

# 4. NestJS CLI
npm install -g @nestjs/cli
```

### Optional (Recommended)
- Git for version control
- Postman for API testing
- Docker for containerization

---

## 📁 Project Structure

```
week23/
├── README.md                     # This file
├── materi/                       # Learning materials
│   ├── 01-introduction-to-databases.md
│   ├── 02-what-is-data.md
│   ├── 03-database-management-systems.md
│   ├── 04-sql-vs-nosql.md
│   ├── 05-how-to-manage-database.md
│   ├── 06-introduction-to-sql.md
│   ├── 07-selecting-data.md
│   ├── 08-filtering-sorting-data.md   # TODO
│   ├── 09-grouping-data.md            # TODO
│   ├── 10-inserting-updating-data.md  # TODO
│   ├── 11-sql-joins.md                # TODO
│   ├── 12-unions-subqueries.md        # TODO
│   ├── 13-modifying-data-advanced.md  # TODO
│   ├── 14-indexing-optimization.md    # TODO
│   ├── 15-advanced-features.md        # TODO
│   ├── 16-nestjs-database-setup.md    # TODO
│   ├── 17-entities-repositories.md    # TODO
│   ├── 18-basic-crud-typeorm.md       # TODO
│   ├── 19-relationships-typeorm.md    # TODO
│   ├── 20-migrations-seeding.md       # TODO
│   ├── 21-query-optimization-nestjs.md # TODO
│   └── 22-production-best-practices.md # TODO
│
├── examples/                     # Code examples
│   ├── sql-queries/              # Pure SQL examples
│   │   ├── 01-basic-select.sql
│   │   ├── 02-joins.sql
│   │   └── 03-subqueries.sql
│   ├── nestjs-typeorm/           # NestJS + TypeORM examples
│   │   ├── simple-crud/
│   │   ├── with-relations/
│   │   └── advanced-queries/
│   └── README.md
│
├── exercises/                    # Practice exercises
│   ├── sql-basics/               # SQL fundamentals
│   │   ├── exercises.md
│   │   └── solutions.sql
│   ├── advanced-sql/             # Complex queries
│   │   ├── exercises.md
│   │   └── solutions.sql
│   └── nestjs-integration/       # Full-stack exercises
│       ├── exercises.md
│       └── solution/
│
├── demo/                         # Main demo project
│   └── library-api/              # ✅ Complete NestJS + PostgreSQL app
│       ├── README.md             # ✅ Comprehensive documentation
│       ├── src/                  # ✅ 6 modules, 37 endpoints
│       ├── postman/              # ✅ Complete Postman collection
│       ├── .env                  # ✅ Configuration
│       └── package.json          # ✅ Dependencies installed
│
└── projects/                     # Student project templates
    ├── todo-api/                 # Beginner project
    ├── blog-api/                 # Intermediate project
    └── ecommerce-api/            # Advanced project
```

---

## 🎯 Demo Project: Library Management API

✅ **COMPLETE & READY TO USE!** 

Full-featured NestJS application demonstrating all Week 23 concepts.

📍 **Location:** `week23/demo/library-api/`  
📖 **Quick Start:** See [DEMO_QUICK_START.md](./DEMO_QUICK_START.md) for 5-minute setup  
📚 **Full Documentation:** See [README.md](./demo/library-api/README.md) for architecture details  

### Features

- ✅ User authentication (JWT + bcrypt)
- ✅ Books CRUD with categories & authors
- ✅ Complete borrowing system with late fees
- ✅ Advanced relationships (One-to-Many, Many-to-One)
- ✅ Search and filtering (status, category, author)
- ✅ Query optimization with TypeORM
- ✅ Auto-generated slugs for categories
- ✅ Availability tracking (auto-updates)
- ✅ 37 API endpoints (15 public, 22 protected)
- ✅ Production-ready setup with Docker

### Tech Stack

- **NestJS 10+** - Progressive Node.js framework
- **PostgreSQL 14+** - Relational database
- **TypeORM 0.3.17** - Database ORM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **class-validator** - DTO validation
- **slugify** - URL-friendly slugs
- **Docker** - PostgreSQL + pgAdmin containers

### Database Schema

5 tables with complex relationships:
- **Users** (with roles: member/librarian/admin)
- **Authors** (biography, country, website)
- **Categories** (with auto-generated slugs)
- **Books** (ISBN, availability tracking, status)
- **Borrowings** (due dates, late fees, status)

### Quick Start

```bash
cd demo/library-api

# Install dependencies
npm install

# Create database
createdb library_db

# Update .env (change DATABASE_USERNAME if needed)
nano .env

# Build and run
npm run build
node dist/main.js

# API available at: http://localhost:3001/api
```

### Testing

**Option 1: cURL** (See DEMO_QUICK_START.md)
```bash
# Complete workflow with 9 cURL examples
# Register → Author → Category → Book → Borrow → Return
```

**Option 2: Postman**
```bash
# Import collection
postman/Library-API.postman_collection.json

# Auto-saved variables for seamless testing
```

### Documentation Files

- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Project overview & checklist
- **[DEMO_QUICK_START.md](./DEMO_QUICK_START.md)** - 5-minute setup guide with cURL examples
- **[demo/library-api/README.md](./demo/library-api/README.md)** - Full API documentation
- **Postman Collection** - 37 endpoints with test scripts

### Learning Objectives Covered

✅ TypeORM entities with decorators  
✅ Entity relationships (One-to-Many, Many-to-One)  
✅ Repository pattern  
✅ Query builder for complex queries  
✅ JWT authentication & guards  
✅ Password hashing with bcrypt  
✅ Business logic (availability, late fees)  
✅ Database design & normalization  
✅ Foreign keys & constraints  
✅ Enums for status values

---

## 💡 Teaching Guide for Instructors

### Session 1: Database Fundamentals (3 hours)

**Hour 1: What & Why Databases**
```
1. Start with analogy: Library vs File Cabinet
2. Show real app WITHOUT database (data in memory)
3. Restart server → data gone! 😱
4. Explain: Persistence, Integrity, Concurrent access
5. Show database statistics (performance numbers)
```

**Hour 2: Data & DBMS**
```
1. Explain data types with real examples
2. Show structured vs unstructured data
3. Compare PostgreSQL, MySQL, MongoDB
4. Live demo: pgAdmin vs DBeaver
5. Interactive: Students identify data types in real app
```

**Hour 3: SQL vs NoSQL**
```
1. Draw comparison table on board
2. Use case analysis: E-commerce, Social media
3. Show same data in SQL tables vs MongoDB documents
4. Discuss: "Why we use PostgreSQL in this course?"
5. Q&A session
```

### Session 2: SQL Basics (3 hours)

**Hour 1: SELECT Queries**
```
1. Live code: Create users table
2. INSERT sample data together
3. SELECT variations (*, columns, aliases)
4. Aggregate functions (COUNT, AVG, SUM)
5. Students follow along in their own database
```

**Hour 2: Filtering & Sorting**
```
1. WHERE clause with conditions
2. AND, OR, NOT combinations
3. LIKE patterns (%, _)
4. IN, BETWEEN, IS NULL
5. ORDER BY and LIMIT
6. Practice exercises (10 queries)
```

**Hour 3: Grouping & Functions**
```
1. GROUP BY concept with visual diagram
2. HAVING vs WHERE
3. String functions (UPPER, CONCAT, SUBSTRING)
4. Date functions (NOW, EXTRACT, AGE)
5. CASE statements for conditional logic
6. Real-world example: Sales report query
```

### Session 3: Advanced SQL (4 hours)

**Hour 1-2: JOINs**
```
1. Draw Venn diagrams for JOIN types
2. Start with 2 tables: users, posts
3. INNER JOIN (intersection)
4. LEFT JOIN (all from left)
5. RIGHT JOIN (all from right)
6. FULL OUTER JOIN (everything)
7. Practice: 3-table JOIN (users, posts, comments)
```

**Hour 3: Subqueries & Unions**
```
1. Subquery in WHERE clause
2. Subquery in SELECT (correlated)
3. EXISTS vs IN performance
4. UNION vs UNION ALL
5. Complex example: Find users with no posts
```

**Hour 4: Optimization**
```
1. EXPLAIN ANALYZE demonstration
2. Create index on email column
3. Compare query speed before/after index
4. When to use indexes (and when not to)
5. Transactions demo (transfer money example)
```

### Session 4-5: NestJS Integration (6 hours)

**Hour 1-2: TypeORM Setup**
```
1. Install TypeORM and pg
2. Configure database connection
3. Create first entity (User)
4. Decorators explanation: @Entity, @Column, @PrimaryGeneratedColumn
5. Generate migration
6. Run migration
7. Verify in pgAdmin
```

**Hour 3-4: CRUD Operations**
```
1. Generate users module
2. Inject repository
3. Implement Create (POST /users)
4. Implement Read (GET /users, GET /users/:id)
5. Implement Update (PATCH /users/:id)
6. Implement Delete (DELETE /users/:id)
7. Test all endpoints in Postman
```

**Hour 5-6: Relations & Advanced**
```
1. Create Posts entity
2. Define @ManyToOne relation
3. Update User entity with @OneToMany
4. Query with relations (find with posts)
5. Eager vs Lazy loading
6. Create migration
7. Test nested routes
8. Seeds data
9. Production considerations
```

---

## 📝 Assessment & Grading

### Quizzes (20 points)
- SQL Basics Quiz: 10 points
- Advanced SQL Quiz: 10 points

### Exercises (30 points)
- SQL Basics Exercises: 10 points
- Advanced SQL Exercises: 10 points
- NestJS Integration Exercises: 10 points

### Final Project (50 points)
Choose one project to build:

#### Option 1: Todo API (Beginner)
```
Requirements:
✅ Users (register, login)
✅ Tasks CRUD
✅ Categories
✅ Filter by status/priority
✅ Migrations & seeds
```

#### Option 2: Blog API (Intermediate)
```
Requirements:
✅ Users with authentication
✅ Posts CRUD with author
✅ Comments (nested)
✅ Categories & Tags (many-to-many)
✅ Search posts
✅ Pagination
✅ Migrations & seeds
```

#### Option 3: E-commerce API (Advanced)
```
Requirements:
✅ Users & authentication
✅ Products with categories
✅ Shopping cart
✅ Orders & Order items
✅ Inventory management
✅ Transaction handling
✅ Query optimization
✅ Migrations & seeds
```

### Grading Rubric (50 points)

| Category | Points | Criteria |
|----------|--------|----------|
| **Database Design** | 10 | Schema design, Normalization, Relationships |
| **CRUD Operations** | 10 | All operations working, DTOs, Validation |
| **Relations** | 10 | Proper relations, Cascade, Eager/Lazy loading |
| **Migrations & Seeds** | 5 | Migrations working, Seeds populated |
| **Query Optimization** | 5 | Indexes, Efficient queries |
| **Code Quality** | 5 | Clean code, Comments, Best practices |
| **API Testing** | 5 | All endpoints tested, Postman collection |

---

## 🔗 Resources

### Official Documentation
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [TypeORM Docs](https://typeorm.io/)
- [NestJS Database Docs](https://docs.nestjs.com/techniques/database)

### Interactive Learning
- [SQLBolt](https://sqlbolt.com/) - Interactive SQL tutorial
- [PostgreSQL Exercises](https://pgexercises.com/)
- [LeetCode Database](https://leetcode.com/problemset/database/)

### Tools
- [DB Fiddle](https://www.db-fiddle.com/) - Online SQL playground
- [SQL Formatter](https://sqlformat.org/) - Format SQL queries
- [DB Diagram](https://dbdiagram.io/) - Database design tool

### Video Tutorials
- [PostgreSQL Tutorial - freeCodeCamp](https://www.youtube.com/watch?v=qw--VYLpxG4)
- [SQL Full Course - Mosh](https://www.youtube.com/watch?v=7S_tz1z_5bA)
- [NestJS + TypeORM - Ben Awad](https://www.youtube.com/watch?v=F_oOtaxb0L8)

### Books
- "PostgreSQL: Up and Running" by Regina Obe & Leo Hsu
- "SQL Performance Explained" by Markus Winand
- "Database Design for Mere Mortals" by Michael J. Hernandez

---

## 🎉 Success Metrics

Students successfully completed Week 23 when they can:

✅ **Explain** database concepts and why we need them  
✅ **Write** SQL queries from basic to advanced  
✅ **Design** database schemas with proper relationships  
✅ **Optimize** queries with indexes and EXPLAIN ANALYZE  
✅ **Integrate** PostgreSQL with NestJS using TypeORM  
✅ **Create** migrations and seed data  
✅ **Build** complete CRUD API with database  
✅ **Deploy** production-ready database setup  

---

## 💬 Support & Community

**Questions?**
- Open an issue in this repository
- Ask in class/cohort Discord channel
- Check FAQ section in materials

**Found a bug or typo?**
- Create a pull request
- Report in issues

---

## 📅 Version History

- **v1.0.0** (2024-12-01): Initial release
  - Part 1: Database Introduction (5 materials) ✅
  - Part 2: SQL Fundamentals (7 materials) - In Progress (2/7 done)
  - Part 3: Advanced SQL (5 materials) - TODO
  - Part 4: NestJS Integration (7 materials) - TODO
  - Demo project: Library Management API - TODO
  - Sample projects: 3 projects - TODO

---

## 🚀 Quick Start for Students

### Day 1: Get Started

```bash
# 1. Install PostgreSQL
brew install postgresql@14

# 2. Start PostgreSQL
brew services start postgresql@14

# 3. Create database
createdb week23_learning

# 4. Connect
psql week23_learning

# 5. Start learning!
# Open materi/01-introduction-to-databases.md
```

### Practice Workflow

```bash
# 1. Read material
# 2. Try examples in psql or pgAdmin
# 3. Complete exercises
# 4. Build demo project
# 5. Create your own project
```

---

**Happy Learning! 🎓🚀**

Questions or need help? Don't hesitate to ask!

---

**Author:** Week 23 Database & SQL Materials  
**Last Updated:** December 2024  
**Course Level:** Intermediate  
**Estimated Time:** 40-50 hours (12 days recommended)
