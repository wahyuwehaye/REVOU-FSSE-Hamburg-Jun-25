# 🗄️ Database Management Systems (DBMS)

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Memahami apa itu DBMS dan fungsinya
- ✅ Mengenal jenis-jenis DBMS popular
- ✅ Membandingkan PostgreSQL, MySQL, MongoDB
- ✅ Memilih DBMS yang tepat untuk project

---

## 🤔 What is DBMS?

### Definisi

**Database Management System (DBMS)** adalah **software yang mengelola database**.

Think of it as the **"librarian"** of your data library!

```
📚 Your Data
    ↕️
🗄️ DBMS (PostgreSQL, MySQL, MongoDB)
    ↕️
💻 Your Application (NestJS)
```

### Tanpa DBMS vs Dengan DBMS

#### ❌ Without DBMS (Manual File Management)

```javascript
// Reading data from file
const fs = require('fs');
const data = fs.readFileSync('users.txt', 'utf8');

Problems:
- 🐌 Slow for large files
- ❌ No concurrent access (file lock)
- 🚫 No validation
- 💣 No transaction support
- 😓 Manual search implementation
```

#### ✅ With DBMS

```javascript
// Using DBMS
const users = await database.query('SELECT * FROM users WHERE age > 18');

Benefits:
- ⚡ Fast with indexing
- 👥 Concurrent access supported
- ✅ Automatic validation
- 🔒 ACID transactions
- 🔍 Built-in query optimization
```

---

## 🛠️ DBMS Functions

### 1. **Data Storage & Retrieval**

```sql
-- Store data
INSERT INTO users (name, email) VALUES ('John', 'john@email.com');

-- Retrieve data
SELECT * FROM users WHERE name = 'John';
```

### 2. **Data Security**

```sql
-- User permissions
GRANT SELECT ON users TO read_only_user;
GRANT ALL ON users TO admin_user;

-- Row-level security
CREATE POLICY user_policy ON users
  USING (user_id = current_user_id());
```

### 3. **Data Integrity**

```sql
-- Constraints ensure data validity
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),  -- Foreign key
  total DECIMAL(10, 2) CHECK (total > 0), -- Must be positive
  status VARCHAR(20) NOT NULL             -- Cannot be empty
);
```

### 4. **Concurrent Access**

```sql
-- Multiple users can access simultaneously
User 1: SELECT * FROM products WHERE id = 1;
User 2: UPDATE products SET stock = 10 WHERE id = 1;
User 3: INSERT INTO products (name) VALUES ('New Product');

-- DBMS handles locks and conflicts automatically!
```

### 5. **Backup & Recovery**

```bash
# PostgreSQL backup
pg_dump mydb > backup.sql

# Restore
psql mydb < backup.sql

# Point-in-time recovery
# Can restore to specific timestamp!
```

### 6. **Query Optimization**

```sql
-- DBMS automatically optimizes queries
EXPLAIN SELECT * FROM users WHERE email = 'john@email.com';

-- Output shows execution plan:
-- Seq Scan vs Index Scan
-- DBMS chooses best strategy!
```

---

## 🏆 Popular DBMS Comparison

### 1. PostgreSQL 🐘

**Type:** Relational (SQL)  
**License:** Open Source (Free)  
**Best For:** Complex queries, data integrity, JSON support

```sql
-- PostgreSQL example
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  preferences JSONB,  -- JSON support!
  tags VARCHAR(50)[], -- Array support!
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Advanced features
SELECT * FROM users 
WHERE preferences->>'theme' = 'dark'  -- Query JSON
AND 'premium' = ANY(tags);             -- Query array
```

**Pros:**
- ✅ ACID compliant (very reliable)
- ✅ Advanced features (JSON, arrays, full-text search)
- ✅ Excellent for complex queries
- ✅ Strong data integrity
- ✅ Great documentation

**Cons:**
- ⚠️ Slightly more complex setup
- ⚠️ Heavier than MySQL
- ⚠️ Less popular (fewer tutorials)

**Used By:** Instagram, Spotify, Uber, Reddit

---

### 2. MySQL 🐬

**Type:** Relational (SQL)  
**License:** Open Source (Free) + Commercial  
**Best For:** Web applications, read-heavy workloads

```sql
-- MySQL example
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Simple and fast
SELECT * FROM users WHERE id = 1;
```

**Pros:**
- ✅ Very popular (lots of tutorials)
- ✅ Fast for simple queries
- ✅ Easy to setup
- ✅ Great for WordPress, PHP apps
- ✅ Lightweight

**Cons:**
- ⚠️ Less advanced features than PostgreSQL
- ⚠️ No native JSON support (before 5.7)
- ⚠️ Weaker data integrity in some storage engines

**Used By:** Facebook, Twitter, YouTube, WordPress

---

### 3. MongoDB 🍃

**Type:** NoSQL (Document)  
**License:** Open Source + Commercial  
**Best For:** Flexible schemas, rapid development

```javascript
// MongoDB example (JavaScript syntax)
db.users.insertOne({
  email: "john@email.com",
  name: "John Doe",
  preferences: {
    theme: "dark",
    notifications: true
  },
  tags: ["premium", "active"],
  metadata: {
    // Any structure allowed!
    customField: "value"
  }
});

// Query
db.users.find({ "preferences.theme": "dark" });
```

**Pros:**
- ✅ Flexible schema (no migrations needed)
- ✅ Fast development
- ✅ Native JSON/BSON
- ✅ Horizontal scaling
- ✅ Great for prototyping

**Cons:**
- ⚠️ No ACID transactions (before v4.0)
- ⚠️ No joins (need manual lookups)
- ⚠️ Can lead to data duplication
- ⚠️ Less mature than SQL databases

**Used By:** eBay, Adobe, Google

---

### 4. SQLite 🪶

**Type:** Relational (SQL)  
**License:** Public Domain (Free)  
**Best For:** Mobile apps, embedded systems, testing

```sql
-- SQLite example
-- Single file database: mydb.sqlite

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE
);
```

**Pros:**
- ✅ No server needed (serverless)
- ✅ Single file database
- ✅ Very lightweight
- ✅ Perfect for mobile apps
- ✅ Great for testing

**Cons:**
- ⚠️ No concurrent writes
- ⚠️ Not for production web apps
- ⚠️ Limited scalability
- ⚠️ No user management

**Used By:** Mobile apps (Android, iOS), browsers

---

## 📊 DBMS Comparison Table

| Feature | PostgreSQL | MySQL | MongoDB | SQLite |
|---------|-----------|--------|---------|---------|
| **Type** | SQL | SQL | NoSQL | SQL |
| **ACID** | ✅ Yes | ✅ Yes | ⚠️ v4.0+ | ✅ Yes |
| **Schema** | Strict | Strict | Flexible | Strict |
| **JSON Support** | ✅ Native | ⚠️ Limited | ✅ Native | ⚠️ Text |
| **Joins** | ✅ Advanced | ✅ Yes | ❌ No | ✅ Yes |
| **Scalability** | Vertical | Both | Horizontal | Limited |
| **Setup** | Medium | Easy | Easy | Very Easy |
| **Use Case** | Complex apps | Web apps | Rapid dev | Mobile/Test |

---

## 🎯 Choosing the Right DBMS

### Decision Tree

```
Need ACID transactions & data integrity?
├─ Yes → SQL Database
│   │
│   ├─ Need advanced features (JSON, arrays, full-text)?
│   │   └─ Yes → PostgreSQL ✅
│   │
│   └─ Need simplicity & popularity?
│       └─ Yes → MySQL ✅
│
└─ No → NoSQL Database
    │
    └─ Need flexible schema & fast development?
        └─ Yes → MongoDB ✅
```

### Use Case Guide

#### 🎯 Use PostgreSQL When:

```
✅ E-commerce platforms
✅ Financial applications
✅ Data analytics
✅ Complex relationships
✅ Need JSON + SQL
✅ Strong data integrity required

Example: Booking system, Banking app
```

#### 🎯 Use MySQL When:

```
✅ WordPress/PHP applications
✅ Read-heavy workloads
✅ Simple CRUD operations
✅ Need wide adoption/support
✅ Lightweight requirements

Example: Blog, CMS, Forums
```

#### 🎯 Use MongoDB When:

```
✅ Rapid prototyping
✅ Flexible/changing schemas
✅ Real-time applications
✅ Hierarchical data
✅ High write throughput

Example: IoT data, Catalogs, Logs
```

#### 🎯 Use SQLite When:

```
✅ Mobile applications
✅ Embedded systems
✅ Testing environments
✅ Small projects
✅ No network needed

Example: Mobile app, Desktop app
```

---

## 🚀 PostgreSQL Deep Dive

Why we use PostgreSQL in this course:

### 1. **Feature-Rich**

```sql
-- JSON/JSONB support
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  data JSONB
);

INSERT INTO events (data) VALUES 
  ('{"type": "click", "user": 1, "timestamp": "2024-12-01"}');

-- Query JSON fields
SELECT * FROM events WHERE data->>'type' = 'click';
```

### 2. **Array Support**

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  tags VARCHAR(50)[]
);

INSERT INTO posts (tags) VALUES 
  (ARRAY['tech', 'sql', 'tutorial']);

-- Query arrays
SELECT * FROM posts WHERE 'sql' = ANY(tags);
```

### 3. **Full-Text Search**

```sql
-- Add search column
ALTER TABLE posts ADD COLUMN search_vector tsvector;

-- Populate search vector
UPDATE posts SET search_vector = 
  to_tsvector('english', title || ' ' || content);

-- Search
SELECT * FROM posts 
WHERE search_vector @@ to_tsquery('english', 'postgresql & tutorial');
```

### 4. **Advanced Indexing**

```sql
-- B-tree index (default)
CREATE INDEX idx_email ON users(email);

-- Partial index
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;

-- GIN index for JSON/Arrays
CREATE INDEX idx_tags ON posts USING GIN(tags);

-- Full-text search index
CREATE INDEX idx_search ON posts USING GIN(search_vector);
```

### 5. **Window Functions**

```sql
-- Rank users by score
SELECT 
  name,
  score,
  RANK() OVER (ORDER BY score DESC) as rank
FROM users;

-- Running total
SELECT 
  date,
  amount,
  SUM(amount) OVER (ORDER BY date) as running_total
FROM transactions;
```

---

## 🛠️ PostgreSQL Installation

### macOS

```bash
# Using Homebrew
brew install postgresql@14

# Start service
brew services start postgresql@14

# Create database
createdb mydb

# Connect
psql mydb
```

### Windows

```bash
# Download installer from postgresql.org
# Or use Docker:

docker run --name postgres \
  -e POSTGRES_PASSWORD=mysecret \
  -p 5432:5432 \
  -d postgres:14
```

### Linux (Ubuntu)

```bash
# Install
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Connect
sudo -u postgres psql
```

### Cloud Options

```
🌐 Managed PostgreSQL Services:

1. Neon (neon.tech)
   - Serverless PostgreSQL
   - Free tier available
   - Automatic scaling

2. Supabase (supabase.com)
   - PostgreSQL + APIs
   - Free tier generous
   - Built-in auth

3. Railway (railway.app)
   - Easy deployment
   - Free $5 credit/month

4. Render (render.com)
   - Free PostgreSQL databases
   - Easy to setup
```

---

## 📝 Quiz Time!

### Question 1
**Kenapa butuh DBMS? Kenapa tidak pakai files saja?**

<details>
<summary>Jawaban</summary>

**Files Problems:**
- ❌ No concurrent access (locks)
- ❌ No validation
- ❌ No transactions
- ❌ Manual indexing
- ❌ No optimization
- ❌ No backup/recovery tools

**DBMS Solutions:**
- ✅ Concurrent access with locks
- ✅ Automatic validation (constraints)
- ✅ ACID transactions
- ✅ Automatic indexing
- ✅ Query optimization
- ✅ Built-in backup tools
</details>

### Question 2
**PostgreSQL vs MongoDB - Kapan pakai yang mana?**

<details>
<summary>Jawaban</summary>

**PostgreSQL (SQL):**
- ✅ Need data integrity (e-commerce, banking)
- ✅ Complex relationships (joins)
- ✅ ACID transactions
- ✅ Structured data
- Example: Order system, User management

**MongoDB (NoSQL):**
- ✅ Flexible schema (frequent changes)
- ✅ Rapid development
- ✅ Hierarchical data
- ✅ High write throughput
- Example: Logging, Catalogs, IoT
</details>

### Question 3
**Apa itu ACID? Kenapa penting?**

<details>
<summary>Jawaban</summary>

**ACID Properties:**

**A - Atomicity**
- All or nothing
- Example: Transfer uang - deduct from A AND add to B, both or none

**C - Consistency**
- Data follows rules
- Example: Balance cannot be negative

**I - Isolation**
- Transactions don't interfere
- Example: Two people buying last item - only one succeeds

**D - Durability**
- Data persists after commit
- Example: After commit, data survives crash

**Why Important?**
Critical for financial apps, e-commerce, any app where data integrity matters!
</details>

---

## 🎯 Summary

**Key Takeaways:**

1. ✅ **DBMS** manages database (storage, security, integrity)
2. ✅ **PostgreSQL** - Advanced SQL, JSON, arrays, full-text search
3. ✅ **MySQL** - Popular, simple, fast for web apps
4. ✅ **MongoDB** - Flexible schema, NoSQL, rapid development
5. ✅ **Choose based on requirements** (ACID, schema, scalability)

**Next Step:**
👉 Lanjut ke [Materi 04: SQL vs NoSQL Databases](./04-sql-vs-nosql.md)

---

**Happy Learning! 🚀**
