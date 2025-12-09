# 🌟 Advanced PostgreSQL Features

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Working dengan JSON/JSONB data types
- ✅ Using window functions untuk advanced analytics
- ✅ Creating views dan materialized views
- ✅ Working dengan array data types
- ✅ Using PostgreSQL specific functions
- ✅ Implementing full-text search
- ✅ Understanding PostgreSQL extensions

---

## 📦 JSON and JSONB

### What is JSONB?

**JSONB** = JSON Binary format
- Faster to process than JSON
- Supports indexing
- Most commonly used

### Creating Table with JSONB

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  price DECIMAL(10,2),
  metadata JSONB,  -- Flexible data!
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Inserting JSONB Data

```sql
INSERT INTO products (name, price, metadata)
VALUES 
  ('Laptop Pro', 1200.00, '{
    "brand": "TechCorp",
    "specs": {
      "cpu": "Intel i7",
      "ram": "16GB",
      "storage": "512GB SSD"
    },
    "colors": ["silver", "gray"],
    "in_stock": true
  }'),
  ('Mouse', 25.00, '{
    "brand": "LogiTech",
    "wireless": true,
    "colors": ["black", "white"],
    "battery_life": "6 months"
  }'),
  ('Keyboard', 75.00, '{
    "brand": "MechKeys",
    "mechanical": true,
    "switch_type": "Cherry MX Blue",
    "backlit": true
  }');
```

### Querying JSONB Data

```sql
-- Get specific field with ->
SELECT 
  name,
  metadata -> 'brand' AS brand,
  metadata -> 'specs' -> 'cpu' AS cpu
FROM products;
```

**Output:**
```
┌─────────────┬────────────┬────────────┐
│ name        │ brand      │ cpu        │
├─────────────┼────────────┼────────────┤
│ Laptop Pro  │ "TechCorp" │ "Intel i7" │
│ Mouse       │ "LogiTech" │ null       │
│ Keyboard    │ "MechKeys" │ null       │
└─────────────┴────────────┴────────────┘
```

### Text Extraction with ->>

```sql
-- Get as text (not JSON) with ->>
SELECT 
  name,
  metadata ->> 'brand' AS brand,  -- Returns text
  metadata -> 'specs' ->> 'cpu' AS cpu
FROM products;
```

**Output:**
```
┌─────────────┬──────────┬──────────┐
│ name        │ brand    │ cpu      │
├─────────────┼──────────┼──────────┤
│ Laptop Pro  │ TechCorp │ Intel i7 │  ← No quotes!
│ Mouse       │ LogiTech │ null     │
│ Keyboard    │ MechKeys │ null     │
└─────────────┴──────────┴──────────┘
```

### Filtering JSONB Data

```sql
-- Find products with specific brand
SELECT name, price
FROM products
WHERE metadata ->> 'brand' = 'TechCorp';

-- Find mechanical keyboards
SELECT name, price
FROM products
WHERE metadata -> 'mechanical' = 'true';

-- Find products with CPU info
SELECT name, metadata -> 'specs' AS specs
FROM products
WHERE metadata -> 'specs' -> 'cpu' IS NOT NULL;
```

### JSONB Operators

```sql
-- Contains (@>)
SELECT name FROM products
WHERE metadata @> '{"brand": "TechCorp"}';

-- Contained by (<@)
SELECT name FROM products
WHERE '{"brand": "TechCorp"}' <@ metadata;

-- Has key (?)
SELECT name FROM products
WHERE metadata ? 'wireless';

-- Has any keys (?|)
SELECT name FROM products
WHERE metadata ?| ARRAY['wireless', 'mechanical'];

-- Has all keys (?&)
SELECT name FROM products
WHERE metadata ?& ARRAY['brand', 'colors'];
```

### Updating JSONB

```sql
-- Add/update field
UPDATE products
SET metadata = metadata || '{"warranty": "2 years"}'
WHERE id = 1;

-- Remove field
UPDATE products
SET metadata = metadata - 'warranty'
WHERE id = 1;

-- Update nested field
UPDATE products
SET metadata = jsonb_set(
  metadata,
  '{specs, ram}',
  '"32GB"'
)
WHERE id = 1;
```

### JSONB Indexing

```sql
-- GIN index for fast JSONB queries
CREATE INDEX idx_products_metadata ON products USING GIN (metadata);

-- Now queries are much faster!
SELECT * FROM products WHERE metadata @> '{"brand": "TechCorp"}';
```

---

## 📊 Window Functions

### What are Window Functions?

**Window functions** perform calculations across rows related to current row.

**Analogy:**
Like looking through a "window" at related rows without collapsing them into groups.

### Sample Data

```sql
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  salesperson VARCHAR(100),
  region VARCHAR(50),
  amount DECIMAL(10,2),
  sale_date DATE
);

INSERT INTO sales (salesperson, region, amount, sale_date)
VALUES 
  ('Alice', 'North', 1200, '2024-01-15'),
  ('Alice', 'North', 1500, '2024-02-10'),
  ('Alice', 'North', 1100, '2024-03-05'),
  ('Bob', 'North', 900, '2024-01-20'),
  ('Bob', 'North', 1300, '2024-02-15'),
  ('Carol', 'South', 1600, '2024-01-25'),
  ('Carol', 'South', 1400, '2024-02-20'),
  ('David', 'South', 1000, '2024-01-30');
```

### ROW_NUMBER()

```sql
-- Assign sequential number to each row
SELECT 
  salesperson,
  amount,
  sale_date,
  ROW_NUMBER() OVER (ORDER BY amount DESC) AS rank
FROM sales;
```

**Output:**
```
┌─────────────┬─────────┬────────────┬──────┐
│ salesperson │ amount  │ sale_date  │ rank │
├─────────────┼─────────┼────────────┼──────┤
│ Carol       │ 1600.00 │ 2024-01-25 │ 1    │
│ Alice       │ 1500.00 │ 2024-02-10 │ 2    │
│ Carol       │ 1400.00 │ 2024-02-20 │ 3    │
│ Bob         │ 1300.00 │ 2024-02-15 │ 4    │
│ Alice       │ 1200.00 │ 2024-01-15 │ 5    │
│ Alice       │ 1100.00 │ 2024-03-05 │ 6    │
│ David       │ 1000.00 │ 2024-01-30 │ 7    │
│ Bob         │ 900.00  │ 2024-01-20 │ 8    │
└─────────────┴─────────┴────────────┴──────┘
```

### PARTITION BY

```sql
-- Rank within each region
SELECT 
  salesperson,
  region,
  amount,
  ROW_NUMBER() OVER (
    PARTITION BY region 
    ORDER BY amount DESC
  ) AS rank_in_region
FROM sales;
```

**Output:**
```
┌─────────────┬────────┬─────────┬────────────────┐
│ salesperson │ region │ amount  │ rank_in_region │
├─────────────┼────────┼─────────┼────────────────┤
│ Alice       │ North  │ 1500.00 │ 1              │
│ Bob         │ North  │ 1300.00 │ 2              │
│ Alice       │ North  │ 1200.00 │ 3              │
│ Alice       │ North  │ 1100.00 │ 4              │
│ Bob         │ North  │ 900.00  │ 5              │
│ Carol       │ South  │ 1600.00 │ 1              │
│ Carol       │ South  │ 1400.00 │ 2              │
│ David       │ South  │ 1000.00 │ 3              │
└─────────────┴────────┴─────────┴────────────────┘
```

### RANK() and DENSE_RANK()

```sql
SELECT 
  salesperson,
  amount,
  ROW_NUMBER() OVER (ORDER BY amount DESC) AS row_num,
  RANK() OVER (ORDER BY amount DESC) AS rank,
  DENSE_RANK() OVER (ORDER BY amount DESC) AS dense_rank
FROM sales;
```

**Output:**
```
┌─────────────┬─────────┬─────────┬──────┬────────────┐
│ salesperson │ amount  │ row_num │ rank │ dense_rank │
├─────────────┼─────────┼─────────┼──────┼────────────┤
│ Carol       │ 1600.00 │ 1       │ 1    │ 1          │
│ Alice       │ 1500.00 │ 2       │ 2    │ 2          │
│ Carol       │ 1400.00 │ 3       │ 3    │ 3          │
│ Bob         │ 1300.00 │ 4       │ 4    │ 4          │
│ Alice       │ 1200.00 │ 5       │ 5    │ 5          │
│ Alice       │ 1100.00 │ 6       │ 6    │ 6          │
│ David       │ 1000.00 │ 7       │ 7    │ 7          │
│ Bob         │ 900.00  │ 8       │ 8    │ 8          │
└─────────────┴─────────┴─────────┴──────┴────────────┘
```

**Difference:**
- **ROW_NUMBER()**: Always unique (1, 2, 3, 4...)
- **RANK()**: Skips after ties (1, 2, 2, 4...)
- **DENSE_RANK()**: No skipping (1, 2, 2, 3...)

### Running Total with SUM()

```sql
-- Cumulative sum by salesperson
SELECT 
  salesperson,
  sale_date,
  amount,
  SUM(amount) OVER (
    PARTITION BY salesperson 
    ORDER BY sale_date
  ) AS running_total
FROM sales
ORDER BY salesperson, sale_date;
```

**Output:**
```
┌─────────────┬────────────┬─────────┬───────────────┐
│ salesperson │ sale_date  │ amount  │ running_total │
├─────────────┼────────────┼─────────┼───────────────┤
│ Alice       │ 2024-01-15 │ 1200.00 │ 1200.00       │
│ Alice       │ 2024-02-10 │ 1500.00 │ 2700.00       │
│ Alice       │ 2024-03-05 │ 1100.00 │ 3800.00       │
│ Bob         │ 2024-01-20 │ 900.00  │ 900.00        │
│ Bob         │ 2024-02-15 │ 1300.00 │ 2200.00       │
│ Carol       │ 2024-01-25 │ 1600.00 │ 1600.00       │
│ Carol       │ 2024-02-20 │ 1400.00 │ 3000.00       │
│ David       │ 2024-01-30 │ 1000.00 │ 1000.00       │
└─────────────┴────────────┴─────────┴───────────────┘
```

### LAG() and LEAD()

```sql
-- Compare with previous and next sale
SELECT 
  salesperson,
  sale_date,
  amount,
  LAG(amount) OVER (
    PARTITION BY salesperson 
    ORDER BY sale_date
  ) AS prev_sale,
  LEAD(amount) OVER (
    PARTITION BY salesperson 
    ORDER BY sale_date
  ) AS next_sale
FROM sales
ORDER BY salesperson, sale_date;
```

**Output:**
```
┌─────────────┬────────────┬─────────┬───────────┬───────────┐
│ salesperson │ sale_date  │ amount  │ prev_sale │ next_sale │
├─────────────┼────────────┼─────────┼───────────┼───────────┤
│ Alice       │ 2024-01-15 │ 1200.00 │ null      │ 1500.00   │
│ Alice       │ 2024-02-10 │ 1500.00 │ 1200.00   │ 1100.00   │
│ Alice       │ 2024-03-05 │ 1100.00 │ 1500.00   │ null      │
│ Bob         │ 2024-01-20 │ 900.00  │ null      │ 1300.00   │
│ Bob         │ 2024-02-15 │ 1300.00 │ 900.00    │ null      │
└─────────────┴────────────┴─────────┴───────────┴───────────┘
```

---

## 🔍 Views and Materialized Views

### Regular View

**View** = Saved query (virtual table)

```sql
-- Create view
CREATE VIEW active_users_summary AS
SELECT 
  u.id,
  u.username,
  u.email,
  COUNT(o.id) AS order_count,
  COALESCE(SUM(o.total), 0) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id, u.username, u.email;

-- Use view like a table
SELECT * FROM active_users_summary
WHERE order_count > 5
ORDER BY total_spent DESC;
```

**Benefits:**
- ✅ Simplify complex queries
- ✅ Security (hide sensitive columns)
- ✅ Consistency (same logic everywhere)

**Note:** View is computed on every query (no caching)

### Materialized View

**Materialized View** = Cached result (actual table)

```sql
-- Create materialized view
CREATE MATERIALIZED VIEW daily_sales_summary AS
SELECT 
  DATE(order_date) AS sale_date,
  COUNT(*) AS order_count,
  SUM(total) AS revenue,
  AVG(total) AS avg_order_value
FROM orders
GROUP BY DATE(order_date);

-- Query is FAST (data already computed!)
SELECT * FROM daily_sales_summary
WHERE sale_date > CURRENT_DATE - INTERVAL '7 days';

-- Refresh when data changes
REFRESH MATERIALIZED VIEW daily_sales_summary;
```

**Benefits:**
- ✅ Much faster queries
- ✅ Reduces database load

**Drawbacks:**
- ❌ Data can be stale (need refresh)
- ❌ Takes up storage space

### View vs Materialized View

```
Regular View:
- No storage
- Always up-to-date
- Slower queries (computed every time)

Materialized View:
- Takes storage
- Can be stale (need refresh)
- Faster queries (pre-computed)
```

---

## 📋 Array Data Type

### Creating Arrays

```sql
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  tags TEXT[],  -- Array of text
  view_counts INTEGER[]
);

INSERT INTO blog_posts (title, tags, view_counts)
VALUES 
  ('SQL Tutorial', ARRAY['sql', 'database', 'tutorial'], ARRAY[100, 150, 200]),
  ('React Guide', ARRAY['react', 'javascript', 'frontend'], ARRAY[300, 350]);
```

### Querying Arrays

```sql
-- Access element by index (1-based!)
SELECT 
  title,
  tags[1] AS first_tag,
  tags[2] AS second_tag
FROM blog_posts;

-- Check if array contains value
SELECT title FROM blog_posts
WHERE 'sql' = ANY(tags);

-- Array contains array (@>)
SELECT title FROM blog_posts
WHERE tags @> ARRAY['sql', 'database'];

-- Array overlap (&&)
SELECT title FROM blog_posts
WHERE tags && ARRAY['sql', 'javascript'];
```

### Array Functions

```sql
-- Length of array
SELECT title, array_length(tags, 1) AS tag_count
FROM blog_posts;

-- Unnest array to rows
SELECT title, unnest(tags) AS tag
FROM blog_posts;

-- Append to array
UPDATE blog_posts
SET tags = array_append(tags, 'postgresql')
WHERE id = 1;

-- Remove from array
UPDATE blog_posts
SET tags = array_remove(tags, 'tutorial')
WHERE id = 1;
```

---

## 🔤 Full-Text Search

### Basic Text Search

```sql
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT,
  content TEXT,
  search_vector tsvector  -- For full-text search
);

-- Convert text to searchable format
INSERT INTO articles (title, content, search_vector)
VALUES 
  ('PostgreSQL Tutorial', 
   'Learn PostgreSQL database management system.',
   to_tsvector('english', 'PostgreSQL Tutorial Learn PostgreSQL database management system')
  );
```

### Searching

```sql
-- Search for term
SELECT title FROM articles
WHERE search_vector @@ to_tsquery('english', 'PostgreSQL');

-- Search with multiple terms
SELECT title FROM articles
WHERE search_vector @@ to_tsquery('english', 'PostgreSQL & database');

-- Search with OR
SELECT title FROM articles
WHERE search_vector @@ to_tsquery('english', 'PostgreSQL | MySQL');
```

### Auto-Update Search Vector

```sql
-- Generate search vector automatically
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT,
  content TEXT,
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
  ) STORED
);

-- Index for fast search
CREATE INDEX idx_articles_search ON articles USING GIN (search_vector);
```

---

## 🛠️ Useful PostgreSQL Functions

### Date/Time Functions

```sql
-- Current timestamp
SELECT CURRENT_TIMESTAMP;
SELECT NOW();

-- Extract parts
SELECT 
  EXTRACT(YEAR FROM NOW()) AS year,
  EXTRACT(MONTH FROM NOW()) AS month,
  EXTRACT(DAY FROM NOW()) AS day;

-- Date arithmetic
SELECT 
  CURRENT_DATE + INTERVAL '7 days' AS next_week,
  CURRENT_DATE - INTERVAL '1 month' AS last_month;

-- Age between dates
SELECT AGE(TIMESTAMP '2024-01-01', TIMESTAMP '2023-01-01');
```

### String Functions

```sql
-- Length
SELECT LENGTH('Hello World');  -- 11

-- Concatenation
SELECT 'Hello' || ' ' || 'World';  -- Hello World
SELECT CONCAT('Hello', ' ', 'World');

-- Case conversion
SELECT UPPER('hello');  -- HELLO
SELECT LOWER('HELLO');  -- hello

-- Trim
SELECT TRIM('  hello  ');  -- 'hello'
SELECT LTRIM('  hello');   -- 'hello'
SELECT RTRIM('hello  ');   -- 'hello'

-- Substring
SELECT SUBSTRING('Hello World' FROM 1 FOR 5);  -- Hello

-- Replace
SELECT REPLACE('Hello World', 'World', 'SQL');  -- Hello SQL
```

### Aggregate Functions

```sql
-- Count
SELECT COUNT(*) FROM users;
SELECT COUNT(DISTINCT city) FROM users;

-- Sum
SELECT SUM(total) FROM orders;

-- Average
SELECT AVG(age) FROM users;

-- Min/Max
SELECT MIN(age), MAX(age) FROM users;

-- String aggregation
SELECT string_agg(name, ', ') FROM users;
-- Result: 'John, Sarah, Mike, Emily'

-- JSON aggregation
SELECT json_agg(u) FROM users u;
-- Result: [{"id":1,"name":"John"}, ...]
```

---

## 🎯 PostgreSQL Extensions

### Enable Extensions

```sql
-- UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Generate UUID
SELECT uuid_generate_v4();

-- Use in table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### pg_trgm (Fuzzy Search)

```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Similarity search
SELECT 
  name,
  similarity(name, 'John') AS score
FROM users
WHERE similarity(name, 'John') > 0.3
ORDER BY score DESC;
```

---

## 📝 Practice Exercises

### Exercise 1: JSONB
```sql
-- Create products table with JSONB
-- Insert products with nested specs
-- Query products by brand and price range


```

### Exercise 2: Window Functions
```sql
-- Rank employees by salary within each department
-- Calculate running total of sales by month


```

### Exercise 3: Arrays
```sql
-- Create table with tags array
-- Find posts with specific tags
-- Get most common tags


```

---

## 🎯 Summary

**JSONB:**
```sql
-- Store flexible data
metadata JSONB
-- Query: -> for JSON, ->> for text
metadata -> 'field'
metadata ->> 'field'
-- Index with GIN
CREATE INDEX ON table USING GIN (metadata);
```

**Window Functions:**
```sql
-- Ranking
ROW_NUMBER() OVER (ORDER BY col)
RANK() OVER (PARTITION BY col1 ORDER BY col2)

-- Running totals
SUM(col) OVER (ORDER BY date)

-- Previous/Next values
LAG(col) OVER (ORDER BY date)
LEAD(col) OVER (ORDER BY date)
```

**Views:**
```sql
-- Virtual table
CREATE VIEW name AS SELECT ...;

-- Cached result
CREATE MATERIALIZED VIEW name AS SELECT ...;
REFRESH MATERIALIZED VIEW name;
```

**Arrays:**
```sql
-- Create
column_name TEXT[]
-- Query
WHERE val = ANY(array_col)
WHERE array_col @> ARRAY['val']
```

**Full-Text Search:**
```sql
-- Search vector
search_vector tsvector
-- Query
WHERE search_vector @@ to_tsquery('term')
```

**Next Step:**
👉 Ready for NestJS + PostgreSQL integration! 🚀

---

**Happy Learning! 🚀**
