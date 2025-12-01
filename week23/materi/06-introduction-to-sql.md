# 🎓 Introduction to SQL

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Memahami apa itu SQL dan kegunaannya
- ✅ Mengenal SQL syntax dasar
- ✅ Menulis query sederhana
- ✅ Memahami SQL statement categories

---

## 🤔 What is SQL?

### Definisi

**SQL** = **Structured Query Language**

SQL adalah **bahasa standar** untuk berkomunikasi dengan relational databases.

```
You (Developer)
    ↓ SQL Query
Database (PostgreSQL)
    ↓ Result
You (Developer)
```

### Analogi Sederhana

```
SQL is like giving instructions to a librarian:

👨‍💻 You: "Show me all books by John"
📚 Librarian: *searches catalog*
📚 Librarian: "Here are 5 books by John"

SQL: SELECT * FROM books WHERE author = 'John';
```

---

## 📝 SQL History & Versions

### Timeline

```
1970s: SQL invented at IBM
1986:  SQL-86 (ANSI standard)
1992:  SQL-92 (widely used)
1999:  SQL:1999 (triggers, recursion)
2003:  SQL:2003 (XML)
2011:  SQL:2011 (temporal data)
2016:  SQL:2016 (JSON)
```

### Database-Specific SQL

Different databases have slightly different SQL:

```sql
-- Auto-increment PRIMARY KEY

PostgreSQL:  SERIAL
MySQL:       AUTO_INCREMENT
SQL Server:  IDENTITY
SQLite:      AUTOINCREMENT

-- String concatenation

PostgreSQL:  'Hello' || ' World'
MySQL:       CONCAT('Hello', ' World')
SQL Server:  'Hello' + ' World'
```

**Good news:** 90% of SQL is the same across all databases!

---

## 📊 SQL Statement Categories

### 1. **DDL** (Data Definition Language)

Define database structure (tables, schemas).

```sql
-- CREATE: Create new objects
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

-- ALTER: Modify existing objects
ALTER TABLE users ADD COLUMN email VARCHAR(255);

-- DROP: Delete objects
DROP TABLE users;

-- TRUNCATE: Delete all data (keep structure)
TRUNCATE TABLE users;
```

### 2. **DML** (Data Manipulation Language)

Manipulate data in tables.

```sql
-- INSERT: Add new rows
INSERT INTO users (name, email) VALUES ('John', 'john@email.com');

-- SELECT: Read data
SELECT * FROM users;

-- UPDATE: Modify existing rows
UPDATE users SET name = 'John Doe' WHERE id = 1;

-- DELETE: Remove rows
DELETE FROM users WHERE id = 1;
```

### 3. **DCL** (Data Control Language)

Control access to data.

```sql
-- GRANT: Give permissions
GRANT SELECT ON users TO public;

-- REVOKE: Remove permissions
REVOKE SELECT ON users FROM public;
```

### 4. **TCL** (Transaction Control Language)

Manage transactions.

```sql
-- BEGIN: Start transaction
BEGIN;

-- COMMIT: Save changes
COMMIT;

-- ROLLBACK: Undo changes
ROLLBACK;

-- SAVEPOINT: Create restore point
SAVEPOINT my_savepoint;
```

---

## 🔤 SQL Syntax Basics

### Case Sensitivity

```sql
-- SQL keywords are NOT case-sensitive
SELECT * FROM users;  -- ✅
select * from users;  -- ✅
SeLeCt * FrOm users;  -- ✅ (but ugly)

-- CONVENTION: Use UPPERCASE for keywords
SELECT name FROM users WHERE age > 18;
```

### Comments

```sql
-- Single line comment
SELECT * FROM users; -- Get all users

/* 
  Multi-line comment
  Can span multiple lines
*/
SELECT 
  name,  -- user name
  email  -- user email
FROM users;
```

### Semicolons

```sql
-- Semicolon ends a statement
SELECT * FROM users;
SELECT * FROM products;

-- Can write multiple statements
INSERT INTO users (name) VALUES ('John');
INSERT INTO users (name) VALUES ('Sarah');
```

### Whitespace

```sql
-- Whitespace doesn't matter
SELECT * FROM users;

-- Same as:
SELECT 
  * 
FROM 
  users;

-- Same as:
SELECT * FROM users WHERE age > 18;
SELECT *
FROM users
WHERE age > 18;
```

---

## 📋 Basic SQL Query Structure

### The SELECT Statement

```sql
SELECT column1, column2
FROM table_name
WHERE condition
ORDER BY column1
LIMIT number;
```

### Example: Complete Query

```sql
SELECT 
  name,           -- Column to select
  email,          -- Another column
  age             -- And another
FROM 
  users           -- Table name
WHERE 
  age >= 18       -- Filter condition
ORDER BY 
  name ASC        -- Sort by name ascending
LIMIT 
  10;             -- Only first 10 results
```

### Order of Execution (What DB Does)

```
1. FROM:   Get data from table
2. WHERE:  Filter rows
3. SELECT: Pick columns
4. ORDER:  Sort results
5. LIMIT:  Take only N rows

Note: This is different from order you write!
```

---

## 🎨 Data Types Reference

### Numeric Types

```sql
-- Integers
SMALLINT    -- -32,768 to 32,767
INTEGER     -- -2 billion to 2 billion  
BIGINT      -- Very large numbers

-- Auto-incrementing
SERIAL      -- Auto-increment INTEGER
BIGSERIAL   -- Auto-increment BIGINT

-- Decimals
DECIMAL(10, 2)   -- Exact: 12345678.90
NUMERIC(8, 3)    -- Exact: 12345.678
REAL             -- Floating point (approximate)
DOUBLE PRECISION -- More precise floating point
```

### String Types

```sql
CHAR(10)         -- Fixed length, padded with spaces
VARCHAR(255)     -- Variable length, up to 255 chars
TEXT             -- Unlimited length
```

### Date & Time Types

```sql
DATE             -- 2024-12-01
TIME             -- 14:30:00
TIMESTAMP        -- 2024-12-01 14:30:00
TIMESTAMPTZ      -- With timezone
INTERVAL         -- Duration: '3 days', '2 hours'
```

### Boolean Type

```sql
BOOLEAN          -- TRUE, FALSE, NULL
```

### Special Types

```sql
JSON             -- JSON data as text
JSONB            -- Binary JSON (faster, indexable)
UUID             -- Universally unique identifier
ARRAY            -- Arrays: INTEGER[], VARCHAR[]
```

---

## 🛠️ Creating Your First Table

### Step-by-Step

```sql
-- Step 1: Create database
CREATE DATABASE myapp;

-- Step 2: Connect to database (in psql)
\c myapp

-- Step 3: Create table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INTEGER CHECK (age >= 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Step 4: Verify table created
\d users  -- Describe table
```

### Explanation

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  -- id: Auto-incrementing integer
  -- SERIAL = INTEGER + AUTO INCREMENT
  -- PRIMARY KEY = UNIQUE + NOT NULL + indexed
  
  name VARCHAR(100) NOT NULL,
  -- name: String up to 100 characters
  -- NOT NULL = cannot be empty
  
  email VARCHAR(255) UNIQUE NOT NULL,
  -- email: String up to 255 characters
  -- UNIQUE = no duplicates allowed
  -- NOT NULL = cannot be empty
  
  age INTEGER CHECK (age >= 0),
  -- age: Integer number
  -- CHECK = validation rule (age must be >= 0)
  
  is_active BOOLEAN DEFAULT true,
  -- is_active: true/false
  -- DEFAULT = value if not provided
  
  created_at TIMESTAMP DEFAULT NOW()
  -- created_at: Date and time
  -- NOW() = current timestamp
);
```

---

## 🎯 Your First Queries

### 1. Insert Data

```sql
-- Insert single row
INSERT INTO users (name, email, age) 
VALUES ('John Doe', 'john@email.com', 25);

-- Insert multiple rows
INSERT INTO users (name, email, age) VALUES 
  ('Sarah Smith', 'sarah@email.com', 30),
  ('Mike Johnson', 'mike@email.com', 28),
  ('Emily Brown', 'emily@email.com', 35);

-- Insert with DEFAULT values
INSERT INTO users (name, email) 
VALUES ('Tom Wilson', 'tom@email.com');
-- age = NULL, is_active = true, created_at = NOW()
```

### 2. Select Data

```sql
-- Select all columns, all rows
SELECT * FROM users;

-- Select specific columns
SELECT name, email FROM users;

-- Select with alias (rename column)
SELECT name AS full_name, email AS contact FROM users;
```

### 3. Filter Data

```sql
-- WHERE clause
SELECT * FROM users WHERE age > 25;

-- Multiple conditions (AND)
SELECT * FROM users WHERE age > 25 AND is_active = true;

-- Multiple conditions (OR)
SELECT * FROM users WHERE age < 20 OR age > 60;

-- NOT
SELECT * FROM users WHERE NOT is_active;
```

### 4. Sort Data

```sql
-- Sort ascending (A-Z, 0-9)
SELECT * FROM users ORDER BY name ASC;

-- Sort descending (Z-A, 9-0)
SELECT * FROM users ORDER BY age DESC;

-- Sort by multiple columns
SELECT * FROM users ORDER BY age DESC, name ASC;
```

### 5. Limit Results

```sql
-- Get first 5 users
SELECT * FROM users LIMIT 5;

-- Skip first 10, get next 5 (pagination)
SELECT * FROM users OFFSET 10 LIMIT 5;
```

---

## 🎨 Common Patterns

### Pattern 1: Find Specific Record

```sql
-- By ID
SELECT * FROM users WHERE id = 1;

-- By email
SELECT * FROM users WHERE email = 'john@email.com';
```

### Pattern 2: Count Records

```sql
-- Count all users
SELECT COUNT(*) FROM users;

-- Count active users
SELECT COUNT(*) FROM users WHERE is_active = true;
```

### Pattern 3: Find Min/Max

```sql
-- Youngest user
SELECT MIN(age) FROM users;

-- Oldest user
SELECT MAX(age) FROM users;

-- Average age
SELECT AVG(age) FROM users;
```

### Pattern 4: Search Text

```sql
-- Exact match
SELECT * FROM users WHERE name = 'John Doe';

-- Contains (case-insensitive)
SELECT * FROM users WHERE name ILIKE '%john%';

-- Starts with
SELECT * FROM users WHERE email LIKE 'john%';

-- Ends with
SELECT * FROM users WHERE email LIKE '%@gmail.com';
```

### Pattern 5: Check NULL

```sql
-- Find users without age
SELECT * FROM users WHERE age IS NULL;

-- Find users with age
SELECT * FROM users WHERE age IS NOT NULL;
```

---

## 🔥 Common Mistakes & How to Avoid

### Mistake 1: Forgetting Quotes

```sql
-- ❌ WRONG: No quotes around string
SELECT * FROM users WHERE name = John;

-- ✅ CORRECT: Use single quotes for strings
SELECT * FROM users WHERE name = 'John';

-- Note: Numbers don't need quotes
SELECT * FROM users WHERE age = 25;  -- ✅
```

### Mistake 2: Using = NULL

```sql
-- ❌ WRONG: Cannot use = with NULL
SELECT * FROM users WHERE age = NULL;

-- ✅ CORRECT: Use IS NULL
SELECT * FROM users WHERE age IS NULL;
```

### Mistake 3: Case Sensitivity in Strings

```sql
-- ❌ WRONG: LIKE is case-sensitive
SELECT * FROM users WHERE name LIKE '%john%';  -- Won't match 'John'

-- ✅ CORRECT: Use ILIKE for case-insensitive
SELECT * FROM users WHERE name ILIKE '%john%';  -- Matches 'John', 'JOHN', 'john'
```

### Mistake 4: SQL Injection (Security!)

```javascript
// ❌ DANGEROUS: SQL Injection vulnerability
const name = req.body.name;
const query = `SELECT * FROM users WHERE name = '${name}'`;
// If name = "'; DROP TABLE users; --"
// Query becomes: SELECT * FROM users WHERE name = ''; DROP TABLE users; --'

// ✅ SAFE: Use parameterized queries
const query = 'SELECT * FROM users WHERE name = $1';
const result = await db.query(query, [name]);
```

---

## 📝 Quiz Time!

### Question 1
**Apa perbedaan DDL vs DML?**

<details>
<summary>Jawaban</summary>

**DDL (Data Definition Language):**
- Define structure (tables, columns)
- Commands: CREATE, ALTER, DROP, TRUNCATE
- Example: CREATE TABLE users (...)

**DML (Data Manipulation Language):**
- Manipulate data (rows)
- Commands: SELECT, INSERT, UPDATE, DELETE
- Example: INSERT INTO users VALUES (...)

**Analogy:**
- DDL = Build the bookshelf
- DML = Put books on the shelf
</details>

### Question 2
**Kenapa harus pakai PRIMARY KEY?**

<details>
<summary>Jawaban</summary>

**Primary Key ensures:**
1. ✅ Uniqueness - No duplicate rows
2. ✅ Identification - Can reference specific row
3. ✅ Performance - Automatically indexed (fast lookups)
4. ✅ Relationships - Can link tables with foreign keys

**Example:**
```sql
-- Without primary key
SELECT * FROM users WHERE name = 'John';  -- Might return multiple Johns!

-- With primary key
SELECT * FROM users WHERE id = 1;  -- Always returns ONE specific user
```
</details>

### Question 3
**Apa bedanya WHERE vs HAVING?**

<details>
<summary>Jawaban</summary>

**WHERE:**
- Filters rows BEFORE grouping
- Cannot use aggregate functions
- Example: WHERE age > 18

**HAVING:**
- Filters groups AFTER grouping
- Can use aggregate functions
- Example: HAVING COUNT(*) > 5

**Example:**
```sql
-- WHERE: Filter individual rows
SELECT * FROM users WHERE age > 18;

-- HAVING: Filter grouped results
SELECT 
  city,
  COUNT(*) as total_users
FROM users
GROUP BY city
HAVING COUNT(*) > 10;  -- Only cities with >10 users
```

Will cover HAVING in GROUP BY section!
</details>

---

## 🎯 Summary

**Key Takeaways:**

1. ✅ **SQL** - Standard language for relational databases
2. ✅ **DDL** - Structure (CREATE, ALTER, DROP)
3. ✅ **DML** - Data (SELECT, INSERT, UPDATE, DELETE)
4. ✅ **Basic Query** - SELECT columns FROM table WHERE condition
5. ✅ **Security** - Always use parameterized queries!

**SQL Cheat Sheet:**

```sql
-- Create
CREATE TABLE table_name (...);

-- Read
SELECT * FROM table_name WHERE condition;

-- Insert
INSERT INTO table_name (columns) VALUES (values);

-- Update
UPDATE table_name SET column = value WHERE condition;

-- Delete
DELETE FROM table_name WHERE condition;

-- Sort
ORDER BY column ASC|DESC

-- Limit
LIMIT number
```

**Next Step:**
👉 Lanjut ke [Materi 07: SQL Basic Queries](./07-sql-basic-queries.md)

---

**Happy Learning! 🚀**
