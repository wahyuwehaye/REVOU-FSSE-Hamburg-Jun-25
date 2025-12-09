# 🚀 Indexing & Query Optimization

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Memahami bagaimana database indexes bekerja
- ✅ Membuat dan mengelola different types of indexes
- ✅ Menggunakan EXPLAIN dan EXPLAIN ANALYZE
- ✅ Mengidentifikasi slow queries
- ✅ Optimize queries untuk better performance
- ✅ Memahami query execution plans
- ✅ Best practices untuk indexing dan optimization

---

## 🎯 What are Indexes?

### Analogy: Book Index

**Without Index:**
- Finding "SQL" in a 1000-page book
- Must read every page (Page 1, 2, 3, ..., 1000)
- Time: 30 minutes ⏰

**With Index:**
- Check index at back: "SQL - Page 458"
- Turn directly to page 458
- Time: 30 seconds ⚡

**Database indexes work the same way!**

### How Indexes Work

```
Table without index:          Table with index:
┌──────┬───────────┐          ┌──────┬───────────┐
│ ID   │ Email     │          │ Email│ Row Ptr   │
├──────┼───────────┤          ├──────┼───────────┤
│ 1    │ john@...  │          │ ali@ │ → Row 5   │
│ 2    │ sarah@... │          │ bob@ │ → Row 3   │
│ 3    │ bob@...   │          │ john@│ → Row 1   │
│ 4    │ mike@...  │          │ mike@│ → Row 4   │
│ 5    │ ali@...   │          │ sara@│ → Row 2   │
└──────┴───────────┘          └──────┴───────────┘
                              (Sorted for fast search!)

Find 'mike@...'              Find 'mike@...'
→ Scan all 5 rows            → Binary search in index
→ Time: O(n)                 → Jump to row 4
                             → Time: O(log n)
```

**For 1 million rows:**
- No index: Check 1,000,000 rows 😱
- With index: Check ~20 rows ⚡ (50,000x faster!)

---

## 📊 Sample Data

```sql
-- Create test table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE,
  username VARCHAR(100),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  age INTEGER,
  city VARCHAR(100),
  country VARCHAR(100),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total DECIMAL(10,2),
  status VARCHAR(20),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data (10000 users)
INSERT INTO users (email, username, first_name, last_name, age, city, country, status)
SELECT 
  'user' || id || '@example.com',
  'user' || id,
  'First' || id,
  'Last' || id,
  (random() * 50 + 18)::INTEGER,
  CASE (random() * 4)::INTEGER
    WHEN 0 THEN 'Jakarta'
    WHEN 1 THEN 'Bandung'
    WHEN 2 THEN 'Surabaya'
    ELSE 'Yogyakarta'
  END,
  'Indonesia',
  CASE (random() * 2)::INTEGER
    WHEN 0 THEN 'active'
    ELSE 'inactive'
  END
FROM generate_series(1, 10000) AS id;

-- Insert orders (50000 orders)
INSERT INTO orders (user_id, total, status, order_date)
SELECT 
  (random() * 9999 + 1)::INTEGER,
  (random() * 1000)::DECIMAL(10,2),
  CASE (random() * 3)::INTEGER
    WHEN 0 THEN 'pending'
    WHEN 1 THEN 'completed'
    ELSE 'cancelled'
  END,
  CURRENT_TIMESTAMP - (random() * 365 || ' days')::INTERVAL
FROM generate_series(1, 50000);
```

---

## 🔍 EXPLAIN - Understanding Query Plans

### What is EXPLAIN?

**EXPLAIN** shows you how PostgreSQL will execute your query.

### Basic EXPLAIN

```sql
EXPLAIN
SELECT * FROM users WHERE email = 'user1000@example.com';
```

**Output:**
```
Seq Scan on users  (cost=0.00..180.00 rows=1 width=100)
  Filter: (email = 'user1000@example.com'::text)
```

**Translation:**
- **Seq Scan**: Sequential scan (reads every row! 😱)
- **cost=0.00..180.00**: Estimated cost (higher = slower)
- **rows=1**: Expected to find 1 row
- **width=100**: Average row size in bytes

### EXPLAIN ANALYZE (Actually Runs Query!)

```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'user1000@example.com';
```

**Output:**
```
Seq Scan on users  (cost=0.00..180.00 rows=1 width=100) 
                   (actual time=5.234..15.847 rows=1 loops=1)
  Filter: (email = 'user1000@example.com'::text)
  Rows Removed by Filter: 9999
Planning Time: 0.123 ms
Execution Time: 15.892 ms  ← ACTUAL time taken!
```

**Key Metrics:**
- **actual time**: Real execution time
- **rows**: Actual rows returned
- **Rows Removed by Filter**: Wasted work!
- **Execution Time**: Total time

---

## 🏗️ Creating Indexes

### B-Tree Index (Default, Most Common)

```sql
-- Create index on email
CREATE INDEX idx_users_email ON users(email);

-- Now query again
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'user1000@example.com';
```

**Output:**
```
Index Scan using idx_users_email on users  
  (cost=0.29..8.30 rows=1 width=100) 
  (actual time=0.034..0.036 rows=1 loops=1)
  Index Cond: (email = 'user1000@example.com'::text)
Planning Time: 0.142 ms
Execution Time: 0.068 ms  ← 230x faster! (15.892ms → 0.068ms)
```

**Notice:**
- ✅ **Seq Scan** → **Index Scan**
- ✅ **15.892ms** → **0.068ms** (230x faster!)
- ✅ **Rows Removed: 9999** → **0** (no waste!)

### Creating Indexes on Multiple Columns

```sql
-- Index for common query patterns
CREATE INDEX idx_users_status_city ON users(status, city);

-- This query now uses index
EXPLAIN ANALYZE
SELECT * FROM users 
WHERE status = 'active' AND city = 'Jakarta';
```

**Output:**
```
Index Scan using idx_users_status_city on users
  (cost=0.29..45.23 rows=250 width=100)
  (actual time=0.142..1.234 rows=243 loops=1)
  Index Cond: ((status = 'active') AND (city = 'Jakarta'))
Execution Time: 1.456 ms
```

### Partial Index (Conditional)

```sql
-- Index only for active users
CREATE INDEX idx_users_active ON users(city)
WHERE status = 'active';

-- Smaller index, faster queries!
```

**Use Case:** When queries focus on specific subset

### Unique Index

```sql
-- Ensure uniqueness + speed up lookups
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- Equivalent to:
ALTER TABLE users ADD CONSTRAINT users_username_unique UNIQUE (username);
```

---

## 📚 Index Types

### 1. B-Tree Index (Default)

**Best for:**
- Equality: `WHERE col = value`
- Range: `WHERE col > value`, `WHERE col BETWEEN x AND y`
- Sorting: `ORDER BY col`
- Pattern start: `WHERE col LIKE 'abc%'`

```sql
CREATE INDEX idx_users_age ON users(age);

-- Uses index
SELECT * FROM users WHERE age = 25;
SELECT * FROM users WHERE age > 25;
SELECT * FROM users WHERE age BETWEEN 20 AND 30;
SELECT * FROM users ORDER BY age;
```

### 2. Hash Index

**Best for:**
- Equality only: `WHERE col = value`

**Cannot be used for:**
- Range queries
- Sorting
- Pattern matching

```sql
CREATE INDEX idx_users_email_hash ON users USING HASH (email);

-- Uses index
SELECT * FROM users WHERE email = 'user@example.com';

-- Does NOT use index
SELECT * FROM users WHERE email LIKE 'user%';
```

**Note:** Rarely needed. B-Tree handles equality well.

### 3. GIN Index (Generalized Inverted Index)

**Best for:**
- Array operations
- Full-text search
- JSONB queries

```sql
-- For array columns
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  tags TEXT[]
);

CREATE INDEX idx_posts_tags ON posts USING GIN (tags);

-- Fast array queries
SELECT * FROM posts WHERE tags @> ARRAY['sql', 'database'];
```

### 4. GiST Index (Generalized Search Tree)

**Best for:**
- Geometric data
- Range types
- Full-text search

```sql
-- For location queries
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  coords POINT
);

CREATE INDEX idx_locations_coords ON locations USING GIST (coords);
```

### 5. Expression Index

**Index on calculated values**

```sql
-- Index on LOWER(email)
CREATE INDEX idx_users_email_lower ON users(LOWER(email));

-- Now case-insensitive search uses index
SELECT * FROM users WHERE LOWER(email) = 'user@example.com';
```

---

## 🎯 When to Use Indexes

### ✅ Good Candidates for Indexing

```sql
-- 1. Primary keys (automatic)
CREATE TABLE users (id SERIAL PRIMARY KEY);

-- 2. Foreign keys
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- 3. Columns in WHERE clauses
CREATE INDEX idx_users_status ON users(status);

-- 4. Columns in JOIN conditions
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- 5. Columns in ORDER BY
CREATE INDEX idx_users_created_at ON users(created_at);

-- 6. Columns in GROUP BY
CREATE INDEX idx_orders_status ON orders(status);
```

### ❌ Bad Candidates for Indexing

```sql
-- 1. Small tables (< 1000 rows)
-- Sequential scan is faster!

-- 2. Columns with low cardinality
CREATE INDEX idx_users_is_active ON users(is_active);
-- Only 2 values (true/false) - not useful!

-- 3. Frequently updated columns
-- Index maintenance slows down writes

-- 4. Columns rarely used in queries
-- Waste of space and maintenance overhead
```

---

## 📊 Query Optimization Techniques

### 1. Use LIMIT for Pagination

```sql
-- ❌ BAD: Fetch all, paginate in app
SELECT * FROM users ORDER BY created_at DESC;
-- Returns 10,000 rows!

-- ✅ GOOD: Paginate in database
SELECT * FROM users ORDER BY created_at DESC LIMIT 20 OFFSET 0;
-- Returns 20 rows only
```

### 2. Avoid SELECT *

```sql
-- ❌ BAD: Fetch all columns
SELECT * FROM users WHERE id = 1;
-- Loads 100+ bytes per row

-- ✅ GOOD: Only needed columns
SELECT id, email, username FROM users WHERE id = 1;
-- Loads 30 bytes per row
```

### 3. Use EXISTS Instead of COUNT

```sql
-- ❌ SLOW: Count all rows
SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END
FROM orders WHERE user_id = 123;

-- ✅ FAST: Stop at first match
SELECT EXISTS (SELECT 1 FROM orders WHERE user_id = 123);
```

### 4. Avoid Functions on Indexed Columns

```sql
-- ❌ BAD: Function prevents index use
SELECT * FROM users WHERE LOWER(email) = 'user@example.com';

-- ✅ GOOD: Create expression index
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
-- Now index is used!

-- ✅ ALTERNATIVE: Store lowercase in column
UPDATE users SET email_lower = LOWER(email);
CREATE INDEX idx_users_email_lower ON users(email_lower);
```

### 5. Use Covering Indexes

```sql
-- Query: SELECT id, email FROM users WHERE username = 'john';

-- ❌ OKAY: Index on username
CREATE INDEX idx_users_username ON users(username);
-- Uses index for WHERE, then fetches row for id and email

-- ✅ BETTER: Covering index (includes all needed columns)
CREATE INDEX idx_users_username_covering ON users(username) 
INCLUDE (id, email);
-- All data in index, no row fetch needed!
```

### 6. Optimize JOINs

```sql
-- ❌ BAD: No indexes on join columns
SELECT u.*, o.*
FROM users u
JOIN orders o ON u.id = o.user_id;

-- ✅ GOOD: Index join columns
CREATE INDEX idx_orders_user_id ON orders(user_id);
-- Join is now much faster!
```

### 7. Use WHERE Instead of HAVING When Possible

```sql
-- ❌ SLOW: Filter after grouping
SELECT city, COUNT(*)
FROM users
GROUP BY city
HAVING city = 'Jakarta';

-- ✅ FAST: Filter before grouping
SELECT city, COUNT(*)
FROM users
WHERE city = 'Jakarta'
GROUP BY city;
```

---

## 📊 Analyzing Query Performance

### Find Slow Queries

```sql
-- Enable slow query logging
ALTER DATABASE mydb SET log_min_duration_statement = 1000;
-- Logs queries taking > 1 second

-- Or check current session
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders o
JOIN users u ON o.user_id = u.id
WHERE u.city = 'Jakarta';
```

### Identify Missing Indexes

```sql
-- Check table without indexes
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE tablename = 'orders';

-- Check which indexes are actually used
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan;
-- idx_scan = 0 means index never used!
```

### Find Unused Indexes

```sql
-- Indexes that are never used (consider dropping)
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexname NOT LIKE 'pg_%'
ORDER BY tablename, indexname;
```

---

## 🔧 Index Maintenance

### REINDEX - Rebuild Index

```sql
-- Rebuild single index
REINDEX INDEX idx_users_email;

-- Rebuild all indexes on table
REINDEX TABLE users;

-- Rebuild all indexes in database
REINDEX DATABASE mydb;
```

**When to reindex:**
- After large data changes
- Index bloat (performance degradation)
- Regular maintenance (monthly/quarterly)

### VACUUM - Clean Up Dead Rows

```sql
-- Standard vacuum
VACUUM users;

-- Full vacuum (locks table, but better cleanup)
VACUUM FULL users;

-- Analyze statistics (helps query planner)
ANALYZE users;

-- Both together
VACUUM ANALYZE users;
```

### Drop Unused Indexes

```sql
-- Drop index
DROP INDEX idx_users_old_column;

-- Drop if exists
DROP INDEX IF EXISTS idx_users_old_column;
```

---

## 💡 Best Practices

### 1. Index Strategy

```sql
-- ✅ DO:
-- - Index foreign keys
-- - Index columns in WHERE/JOIN/ORDER BY
-- - Use composite indexes for common query patterns
-- - Monitor and remove unused indexes

-- ❌ DON'T:
-- - Index everything (slows writes!)
-- - Index small tables
-- - Index low-cardinality columns
-- - Ignore index maintenance
```

### 2. Query Writing

```sql
-- ✅ DO:
-- - Select only needed columns
-- - Use LIMIT for large results
-- - Filter early with WHERE
-- - Use EXISTS for existence checks

-- ❌ DON'T:
-- - Use SELECT *
-- - Use functions on indexed columns (without expression index)
-- - Use LIKE '%pattern' (can't use index)
-- - Use OR extensively (consider UNION)
```

### 3. Monitoring

```sql
-- Check table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index sizes
SELECT 
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(schemaname||'.'||indexname)) AS size
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(schemaname||'.'||indexname) DESC;
```

---

## 📝 Practice Exercises

### Exercise 1: Basic Indexing
```sql
-- Create index on orders.status
-- Compare EXPLAIN before and after


```

### Exercise 2: Composite Index
```sql
-- Find optimal index for:
-- SELECT * FROM orders WHERE status = 'completed' AND user_id = 123


```

### Exercise 3: Query Optimization
```sql
-- Optimize this query:
-- SELECT u.*, COUNT(o.id) 
-- FROM users u 
-- LEFT JOIN orders o ON u.id = o.user_id 
-- GROUP BY u.id


```

### Exercise 4: Identify Slow Query
```sql
-- Use EXPLAIN ANALYZE to find why this is slow:
-- SELECT * FROM orders WHERE EXTRACT(YEAR FROM order_date) = 2024


```

---

## 🎯 Summary

**Index Types:**
- **B-Tree** - Default, most common (equality, range, sorting)
- **Hash** - Equality only
- **GIN** - Arrays, JSONB, full-text
- **GiST** - Geometric, range types

**Creating Indexes:**
```sql
CREATE INDEX idx_name ON table(column);
CREATE INDEX idx_name ON table(col1, col2);
CREATE INDEX idx_name ON table(expression);
CREATE INDEX idx_name ON table(column) WHERE condition;
```

**Optimization Checklist:**
- ✅ Index foreign keys
- ✅ Index WHERE/JOIN/ORDER BY columns
- ✅ Use EXPLAIN ANALYZE
- ✅ Select only needed columns
- ✅ Use LIMIT for pagination
- ✅ Filter with WHERE before GROUP BY
- ✅ Monitor and maintain indexes
- ✅ Drop unused indexes

**Tools:**
```sql
EXPLAIN -- Show query plan
EXPLAIN ANALYZE -- Run and show actual time
VACUUM -- Clean up
ANALYZE -- Update statistics
REINDEX -- Rebuild indexes
```

**Next Step:**
👉 Lanjut ke [Materi 15: Advanced PostgreSQL Features](./15-advanced-features.md)

---

**Happy Learning! 🚀**
