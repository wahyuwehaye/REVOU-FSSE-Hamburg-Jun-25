# 🔀 UNIONs & Subqueries

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Menggabungkan result sets dengan UNION dan UNION ALL
- ✅ Menggunakan subqueries dalam SELECT, FROM, dan WHERE
- ✅ Membuat correlated subqueries
- ✅ Menggunakan EXISTS dan NOT EXISTS
- ✅ Menggunakan IN, ANY, dan ALL dengan subqueries
- ✅ Common Table Expressions (CTEs) dengan WITH
- ✅ Recursive CTEs untuk hierarchical data

---

## 🔀 UNION - Combining Result Sets

### What is UNION?

**UNION** menggabungkan results dari 2+ SELECT statements menjadi satu result set.

**Analogy:**
Seperti menggabungkan 2 daftar menjadi 1, tanpa duplikasi.

### UNION vs UNION ALL

```sql
-- UNION: Removes duplicates (slower)
SELECT column FROM table1
UNION
SELECT column FROM table2;

-- UNION ALL: Keeps duplicates (faster)
SELECT column FROM table1
UNION ALL
SELECT column FROM table2;
```

---

## 📊 Sample Data for UNION

```sql
-- Current customers
CREATE TABLE current_customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

INSERT INTO current_customers (name, email)
VALUES 
  ('John Doe', 'john@email.com'),
  ('Sarah Smith', 'sarah@email.com'),
  ('Mike Brown', 'mike@email.com');

-- Archive customers (old customers)
CREATE TABLE archived_customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

INSERT INTO archived_customers (name, email)
VALUES 
  ('Emily Chen', 'emily@email.com'),
  ('David Lee', 'david@email.com'),
  ('John Doe', 'john@email.com');  -- Duplicate!
```

---

## 🔗 UNION Examples

### Basic UNION

```sql
-- Get all unique customer names (no duplicates)
SELECT name FROM current_customers
UNION
SELECT name FROM archived_customers;
```

**Result:**
```
┌─────────────┐
│ name        │
├─────────────┤
│ John Doe    │  ← Appears once (deduplicated!)
│ Sarah Smith │
│ Mike Brown  │
│ Emily Chen  │
│ David Lee   │
└─────────────┘
```

### UNION ALL (Keep Duplicates)

```sql
-- Get all customer names (including duplicates)
SELECT name FROM current_customers
UNION ALL
SELECT name FROM archived_customers;
```

**Result:**
```
┌─────────────┐
│ name        │
├─────────────┤
│ John Doe    │  ← First occurrence
│ Sarah Smith │
│ Mike Brown  │
│ Emily Chen  │
│ David Lee   │
│ John Doe    │  ← Duplicate kept!
└─────────────┘
```

### UNION with Labels

```sql
-- Identify source of each record
SELECT 
  name, 
  email, 
  'Current' AS status
FROM current_customers
UNION ALL
SELECT 
  name, 
  email, 
  'Archived' AS status
FROM archived_customers
ORDER BY status, name;
```

**Result:**
```
┌─────────────┬─────────────────┬──────────┐
│ name        │ email           │ status   │
├─────────────┼─────────────────┼──────────┤
│ Emily Chen  │ emily@email.com │ Archived │
│ David Lee   │ david@email.com │ Archived │
│ John Doe    │ john@email.com  │ Archived │
│ John Doe    │ john@email.com  │ Current  │
│ Mike Brown  │ mike@email.com  │ Current  │
│ Sarah Smith │ sarah@email.com │ Current  │
└─────────────┴─────────────────┴──────────┘
```

---

## 📋 UNION Rules

### Rule 1: Same Number of Columns

```sql
-- ❌ ERROR: Different column counts
SELECT name FROM current_customers
UNION
SELECT name, email FROM archived_customers;
-- Error: each UNION query must have the same number of columns

-- ✅ CORRECT: Same column count
SELECT name, email FROM current_customers
UNION
SELECT name, email FROM archived_customers;
```

### Rule 2: Compatible Data Types

```sql
-- ❌ ERROR: Incompatible types
SELECT name, email FROM current_customers
UNION
SELECT id, name FROM archived_customers;
-- Error: UNION types text and integer cannot be matched

-- ✅ CORRECT: Cast types
SELECT name, email FROM current_customers
UNION
SELECT id::TEXT, name FROM archived_customers;
```

### Rule 3: Column Names from First Query

```sql
-- Column names come from first SELECT
SELECT 
  name AS customer_name,
  email AS customer_email
FROM current_customers
UNION
SELECT name, email  -- Uses column names from above
FROM archived_customers;
-- Result columns: customer_name, customer_email
```

---

## 🎯 UNION Use Cases

### Use Case 1: Combine Similar Tables

```sql
-- Orders from different regions
SELECT order_id, customer, 'Jakarta' AS region
FROM jakarta_orders
UNION ALL
SELECT order_id, customer, 'Bandung' AS region
FROM bandung_orders
UNION ALL
SELECT order_id, customer, 'Surabaya' AS region
FROM surabaya_orders;
```

### Use Case 2: Different Search Criteria

```sql
-- High-value customers: 
-- - VIP status OR
-- - Total orders > $5000

SELECT id, name, 'VIP Status' AS reason
FROM customers
WHERE is_vip = true
UNION
SELECT c.id, c.name, 'High Spender' AS reason
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
HAVING SUM(o.total) > 5000;
```

### Use Case 3: Generate Aggregate Report

```sql
-- Summary report with totals
SELECT 'Total Sales' AS metric, SUM(total) AS value
FROM sales
UNION ALL
SELECT 'Average Order', AVG(total)
FROM sales
UNION ALL
SELECT 'Max Order', MAX(total)
FROM sales
UNION ALL
SELECT 'Min Order', MIN(total)
FROM sales;
```

**Result:**
```
┌──────────────┬──────────┐
│ metric       │ value    │
├──────────────┼──────────┤
│ Total Sales  │ 125000   │
│ Average Order│ 450.50   │
│ Max Order    │ 5000     │
│ Min Order    │ 25       │
└──────────────┴──────────┘
```

---

## 🔍 Subqueries - Queries Inside Queries

### What is a Subquery?

A **subquery** is a query nested inside another query.

**Types:**
1. **Scalar subquery** - Returns single value
2. **Row subquery** - Returns single row
3. **Table subquery** - Returns multiple rows/columns

---

## 📊 Sample Data for Subqueries

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  price DECIMAL(10,2),
  category VARCHAR(50)
);

INSERT INTO products (name, price, category)
VALUES 
  ('Laptop Pro', 1200, 'Electronics'),
  ('Mouse', 25, 'Electronics'),
  ('Keyboard', 50, 'Electronics'),
  ('Office Desk', 300, 'Furniture'),
  ('Desk Chair', 150, 'Furniture'),
  ('Monitor', 400, 'Electronics'),
  ('Webcam', 75, 'Electronics');

CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER,
  sale_date DATE
);

INSERT INTO sales (product_id, quantity, sale_date)
VALUES 
  (1, 2, '2024-01-15'),
  (2, 5, '2024-01-16'),
  (3, 3, '2024-01-17'),
  (1, 1, '2024-01-18'),
  (4, 2, '2024-01-19'),
  (6, 1, '2024-01-20');
```

---

## 🔍 Subquery in WHERE Clause

### Scalar Subquery (Single Value)

```sql
-- Products more expensive than average
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);
```

**Result:**
```
┌─────────────┬─────────┐
│ name        │ price   │
├─────────────┼─────────┤
│ Laptop Pro  │ 1200.00 │
│ Office Desk │ 300.00  │
│ Monitor     │ 400.00  │
└─────────────┴─────────┘
```

**How it works:**
1. Inner query: `SELECT AVG(price) FROM products` → 314.29
2. Outer query: `WHERE price > 314.29`

### Subquery with IN

```sql
-- Products that have been sold
SELECT name, price
FROM products
WHERE id IN (
  SELECT DISTINCT product_id FROM sales
);
```

**Result:**
```
┌─────────────┬─────────┐
│ name        │ price   │
├─────────────┼─────────┤
│ Laptop Pro  │ 1200.00 │
│ Mouse       │ 25.00   │
│ Keyboard    │ 50.00   │
│ Office Desk │ 300.00  │
│ Monitor     │ 400.00  │
└─────────────┴─────────┘
```

### Subquery with NOT IN

```sql
-- Products that have NEVER been sold
SELECT name, price
FROM products
WHERE id NOT IN (
  SELECT DISTINCT product_id FROM sales
);
```

**Result:**
```
┌────────────┬────────┐
│ name       │ price  │
├────────────┼────────┤
│ Desk Chair │ 150.00 │
│ Webcam     │ 75.00  │
└────────────┴────────┘
```

---

## 🔍 Subquery in SELECT Clause

```sql
-- Show each product with average price comparison
SELECT 
  name,
  price,
  (SELECT AVG(price) FROM products) AS avg_price,
  price - (SELECT AVG(price) FROM products) AS price_diff
FROM products;
```

**Result:**
```
┌─────────────┬─────────┬───────────┬────────────┐
│ name        │ price   │ avg_price │ price_diff │
├─────────────┼─────────┼───────────┼────────────┤
│ Laptop Pro  │ 1200.00 │ 314.29    │ 885.71     │
│ Mouse       │ 25.00   │ 314.29    │ -289.29    │
│ Keyboard    │ 50.00   │ 314.29    │ -264.29    │
│ Office Desk │ 300.00  │ 314.29    │ -14.29     │
│ Desk Chair  │ 150.00  │ 314.29    │ -164.29    │
│ Monitor     │ 400.00  │ 314.29    │ 85.71      │
│ Webcam      │ 75.00   │ 314.29    │ -239.29    │
└─────────────┴─────────┴───────────┴────────────┘
```

### Correlated Subquery in SELECT

```sql
-- Show each product with its total quantity sold
SELECT 
  p.name,
  p.price,
  (
    SELECT COALESCE(SUM(quantity), 0)
    FROM sales s
    WHERE s.product_id = p.id
  ) AS total_sold
FROM products p;
```

**Result:**
```
┌─────────────┬─────────┬────────────┐
│ name        │ price   │ total_sold │
├─────────────┼─────────┼────────────┤
│ Laptop Pro  │ 1200.00 │ 3          │
│ Mouse       │ 25.00   │ 5          │
│ Keyboard    │ 50.00   │ 3          │
│ Office Desk │ 300.00  │ 2          │
│ Desk Chair  │ 150.00  │ 0          │
│ Monitor     │ 400.00  │ 1          │
│ Webcam      │ 75.00   │ 0          │
└─────────────┴─────────┴────────────┘
```

**Note:** Subquery runs for EACH row of outer query (can be slow!)

---

## 🔍 Subquery in FROM Clause (Derived Table)

```sql
-- Find categories with average price > $100
SELECT 
  category,
  avg_price
FROM (
  SELECT 
    category,
    AVG(price) AS avg_price
  FROM products
  GROUP BY category
) AS category_stats
WHERE avg_price > 100;
```

**Result:**
```
┌─────────────┬───────────┐
│ category    │ avg_price │
├─────────────┼───────────┤
│ Electronics │ 350.00    │
│ Furniture   │ 225.00    │
└─────────────┴───────────┘
```

**Note:** Must alias the subquery! (AS category_stats)

---

## ✅ EXISTS & NOT EXISTS

### EXISTS - Check if Subquery Returns Any Rows

```sql
-- Categories that have products
SELECT DISTINCT category
FROM products p1
WHERE EXISTS (
  SELECT 1 
  FROM products p2 
  WHERE p2.category = p1.category
);
```

**Better Example:**
```sql
-- Customers who have placed orders
SELECT c.name, c.email
FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);
```

### NOT EXISTS - Check if Subquery Returns No Rows

```sql
-- Products that have NEVER been sold
SELECT name, price
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM sales s WHERE s.product_id = p.id
);
```

**Result:**
```
┌────────────┬────────┐
│ name       │ price  │
├────────────┼────────┤
│ Desk Chair │ 150.00 │
│ Webcam     │ 75.00  │
└────────────┴────────┘
```

### EXISTS vs IN

```sql
-- These are similar:
-- Using IN
SELECT name FROM products
WHERE id IN (SELECT product_id FROM sales);

-- Using EXISTS
SELECT name FROM products p
WHERE EXISTS (
  SELECT 1 FROM sales s WHERE s.product_id = p.id
);
```

**Performance:**
- **EXISTS** - Stops at first match (faster!)
- **IN** - Evaluates entire subquery

**Rule of Thumb:**
- Use **EXISTS** for large datasets
- Use **IN** for small/simple lists

---

## 🔢 ANY, ALL Operators

### ANY - True if comparison is true for ANY subquery value

```sql
-- Products more expensive than ANY Electronics product
SELECT name, price, category
FROM products
WHERE price > ANY (
  SELECT price FROM products WHERE category = 'Electronics'
);
```

**Equivalent to:**
```sql
WHERE price > (SELECT MIN(price) FROM products WHERE category = 'Electronics')
```

### ALL - True if comparison is true for ALL subquery values

```sql
-- Products more expensive than ALL Electronics products
SELECT name, price, category
FROM products
WHERE price > ALL (
  SELECT price FROM products WHERE category = 'Electronics'
);
```

**Equivalent to:**
```sql
WHERE price > (SELECT MAX(price) FROM products WHERE category = 'Electronics')
```

---

## 📝 Common Table Expressions (CTEs)

### What is a CTE?

**CTE** (WITH clause) creates temporary named result set.

**Benefits:**
- ✅ More readable than nested subqueries
- ✅ Can be referenced multiple times
- ✅ Supports recursion

### Basic CTE Syntax

```sql
WITH cte_name AS (
  SELECT ...
)
SELECT * FROM cte_name;
```

### Example: Simple CTE

```sql
-- Without CTE (hard to read)
SELECT *
FROM (
  SELECT 
    category,
    AVG(price) AS avg_price
  FROM products
  GROUP BY category
) AS cat_avg
WHERE avg_price > 100;

-- With CTE (much clearer!)
WITH category_averages AS (
  SELECT 
    category,
    AVG(price) AS avg_price
  FROM products
  GROUP BY category
)
SELECT *
FROM category_averages
WHERE avg_price > 100;
```

### Multiple CTEs

```sql
-- Multiple CTEs separated by commas
WITH 
  sales_summary AS (
    SELECT 
      product_id,
      SUM(quantity) AS total_sold
    FROM sales
    GROUP BY product_id
  ),
  product_info AS (
    SELECT 
      id,
      name,
      price,
      category
    FROM products
  )
SELECT 
  pi.name,
  pi.price,
  pi.category,
  COALESCE(ss.total_sold, 0) AS total_sold,
  pi.price * COALESCE(ss.total_sold, 0) AS revenue
FROM product_info pi
LEFT JOIN sales_summary ss ON pi.id = ss.product_id
ORDER BY revenue DESC;
```

**Result:**
```
┌─────────────┬─────────┬─────────────┬────────────┬─────────┐
│ name        │ price   │ category    │ total_sold │ revenue │
├─────────────┼─────────┼─────────────┼────────────┼─────────┤
│ Laptop Pro  │ 1200.00 │ Electronics │ 3          │ 3600.00 │
│ Office Desk │ 300.00  │ Furniture   │ 2          │ 600.00  │
│ Monitor     │ 400.00  │ Electronics │ 1          │ 400.00  │
│ Keyboard    │ 50.00   │ Electronics │ 3          │ 150.00  │
│ Mouse       │ 25.00   │ Electronics │ 5          │ 125.00  │
│ Desk Chair  │ 150.00  │ Furniture   │ 0          │ 0.00    │
│ Webcam      │ 75.00   │ Electronics │ 0          │ 0.00    │
└─────────────┴─────────┴─────────────┴────────────┴─────────┘
```

---

## 🔄 Recursive CTEs

### What is a Recursive CTE?

A CTE that **references itself** - perfect for hierarchical data!

**Use Cases:**
- Organizational charts
- Category trees
- Bill of materials
- Social networks

### Example: Employee Hierarchy

```sql
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  manager_id INTEGER REFERENCES employees(id)
);

INSERT INTO employees (name, manager_id)
VALUES 
  ('CEO Alice', NULL),
  ('VP Bob', 1),
  ('VP Carol', 1),
  ('Manager Dave', 2),
  ('Manager Eve', 2),
  ('Employee Frank', 4),
  ('Employee Grace', 4);
```

### Recursive Query to Get All Subordinates

```sql
-- Get Alice and ALL her subordinates (entire org tree)
WITH RECURSIVE org_tree AS (
  -- Base case: Start with CEO
  SELECT id, name, manager_id, 1 AS level
  FROM employees
  WHERE id = 1  -- CEO Alice
  
  UNION ALL
  
  -- Recursive case: Get direct reports
  SELECT e.id, e.name, e.manager_id, ot.level + 1
  FROM employees e
  INNER JOIN org_tree ot ON e.manager_id = ot.id
)
SELECT 
  REPEAT('  ', level - 1) || name AS org_chart,
  level
FROM org_tree
ORDER BY level, name;
```

**Result:**
```
┌────────────────────┬───────┐
│ org_chart          │ level │
├────────────────────┼───────┤
│ CEO Alice          │ 1     │
│   VP Bob           │ 2     │
│   VP Carol         │ 2     │
│     Manager Dave   │ 3     │
│     Manager Eve    │ 3     │
│       Employee Frank│ 4     │
│       Employee Grace│ 4     │
└────────────────────┴───────┘
```

### Recursive CTE Structure

```sql
WITH RECURSIVE cte_name AS (
  -- 1. Base case (anchor)
  SELECT ... WHERE ...
  
  UNION [ALL]
  
  -- 2. Recursive case
  SELECT ... FROM cte_name ...
)
SELECT * FROM cte_name;
```

**How it works:**
1. Execute base case
2. Execute recursive case using results from step 1
3. Repeat step 2 until no more rows
4. UNION all results

### Example: Number Series

```sql
-- Generate numbers 1 to 10
WITH RECURSIVE numbers AS (
  SELECT 1 AS n  -- Base case
  UNION ALL
  SELECT n + 1   -- Recursive case
  FROM numbers
  WHERE n < 10   -- Stop condition
)
SELECT * FROM numbers;
```

**Result:**
```
┌────┐
│ n  │
├────┤
│ 1  │
│ 2  │
│ 3  │
│ 4  │
│ 5  │
│ 6  │
│ 7  │
│ 8  │
│ 9  │
│ 10 │
└────┘
```

---

## 💡 Best Practices

### 1. Use CTEs for Readability

```sql
-- ❌ HARD TO READ: Nested subqueries
SELECT *
FROM (
  SELECT *
  FROM (
    SELECT * FROM products WHERE price > 100
  ) AS expensive
  WHERE category = 'Electronics'
) AS expensive_electronics;

-- ✅ CLEAN: CTEs
WITH 
  expensive AS (
    SELECT * FROM products WHERE price > 100
  ),
  expensive_electronics AS (
    SELECT * FROM expensive WHERE category = 'Electronics'
  )
SELECT * FROM expensive_electronics;
```

### 2. Avoid Correlated Subqueries When Possible

```sql
-- ❌ SLOW: Correlated subquery (runs for each row)
SELECT 
  p.name,
  (SELECT SUM(quantity) FROM sales WHERE product_id = p.id) AS sold
FROM products p;

-- ✅ FAST: JOIN instead
SELECT 
  p.name,
  COALESCE(SUM(s.quantity), 0) AS sold
FROM products p
LEFT JOIN sales s ON p.id = s.product_id
GROUP BY p.id, p.name;
```

### 3. Use EXISTS for Existence Checks

```sql
-- ❌ SLOWER: IN with subquery
SELECT * FROM products
WHERE id IN (SELECT product_id FROM sales);

-- ✅ FASTER: EXISTS
SELECT * FROM products p
WHERE EXISTS (
  SELECT 1 FROM sales s WHERE s.product_id = p.id
);
```

### 4. Limit Recursive Depth

```sql
-- Prevent infinite recursion
WITH RECURSIVE infinite_loop AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM infinite_loop
  WHERE n < 1000  -- ← ALWAYS add stop condition!
)
SELECT * FROM infinite_loop;
```

---

## 📝 Practice Exercises

### Exercise 1: UNION
```sql
-- Combine current and archived customers
-- Add a 'status' column to distinguish them


```

### Exercise 2: Subquery in WHERE
```sql
-- Find products more expensive than the average


-- Find products in categories with average price > $200


```

### Exercise 3: Subquery in SELECT
```sql
-- Show each product with total quantity sold
-- and percentage of total sales


```

### Exercise 4: CTE
```sql
-- Use CTE to find top 3 best-selling products
-- Show product name, quantity sold, revenue


```

### Exercise 5: Recursive CTE
```sql
-- Create a categories table with parent_id
-- Write recursive query to show full category path


```

---

## 🎯 Summary

**UNION:**
```sql
-- Remove duplicates
SELECT ... UNION SELECT ...

-- Keep duplicates (faster)
SELECT ... UNION ALL SELECT ...
```

**Subquery Locations:**
```sql
-- In WHERE
WHERE column IN (SELECT ...)
WHERE column > (SELECT ...)
WHERE EXISTS (SELECT ...)

-- In SELECT
SELECT (SELECT ...) AS alias

-- In FROM
FROM (SELECT ...) AS alias
```

**CTE (WITH):**
```sql
WITH cte_name AS (
  SELECT ...
)
SELECT * FROM cte_name;
```

**Recursive CTE:**
```sql
WITH RECURSIVE cte AS (
  SELECT ... -- Base case
  UNION ALL
  SELECT ... FROM cte -- Recursive
)
SELECT * FROM cte;
```

**Key Operators:**
- **IN / NOT IN** - Value in list
- **EXISTS / NOT EXISTS** - Subquery returns rows
- **ANY** - Comparison true for any value
- **ALL** - Comparison true for all values

**Next Step:**
👉 Lanjut ke [Materi 13: Modifying Data - Advanced](./13-modifying-data-advanced.md)

---

**Happy Learning! 🚀**
