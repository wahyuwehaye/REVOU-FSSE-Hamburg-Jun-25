# 🔗 SQL JOINs - Combining Tables

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Memahami konsep relational database dan foreign keys
- ✅ Menggunakan INNER JOIN untuk menggabungkan tables
- ✅ Menggunakan LEFT, RIGHT, dan FULL OUTER JOINs
- ✅ Self-joins untuk hierarchical data
- ✅ Cross joins untuk cartesian products
- ✅ Multiple joins dalam satu query
- ✅ Join optimization dan best practices

---

## 🎯 Why JOINs?

### The Problem: Duplicated Data

**❌ BAD: All data in one table**
```sql
CREATE TABLE orders_bad (
  id SERIAL PRIMARY KEY,
  order_date DATE,
  customer_name VARCHAR(100),      -- Repeated!
  customer_email VARCHAR(100),     -- Repeated!
  customer_phone VARCHAR(20),      -- Repeated!
  customer_address TEXT,           -- Repeated!
  product_name VARCHAR(100),       -- Repeated!
  product_price DECIMAL(10,2),     -- Repeated!
  quantity INTEGER
);
```

**Problems:**
- 🔴 Data redundancy (customer info repeated for each order)
- 🔴 Update anomalies (change email → update 100 rows!)
- 🔴 Storage waste
- 🔴 Data inconsistency risks

### The Solution: Normalized Tables + JOINs

**✅ GOOD: Separate tables with relationships**

```sql
-- Customers table (customer info stored once!)
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT
);

-- Products table (product info stored once!)
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  price DECIMAL(10,2),
  stock INTEGER
);

-- Orders table (only references!)
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),  -- Foreign Key
  product_id INTEGER REFERENCES products(id),    -- Foreign Key
  quantity INTEGER,
  order_date DATE
);
```

**Benefits:**
- ✅ No redundancy
- ✅ Easy updates (change email once!)
- ✅ Data integrity
- ✅ Storage efficient

---

## 📊 Sample Data

Let's create sample data for all examples:

```sql
-- Customers
INSERT INTO customers (name, email, phone, address)
VALUES 
  ('John Doe', 'john@email.com', '08111111', 'Jakarta'),
  ('Sarah Smith', 'sarah@email.com', '08222222', 'Bandung'),
  ('Mike Brown', 'mike@email.com', '08333333', 'Surabaya'),
  ('Emily Chen', 'emily@email.com', '08444444', 'Jakarta'),
  ('David Lee', 'david@email.com', '08555555', 'Bandung');

-- Products
INSERT INTO products (name, price, stock)
VALUES 
  ('Laptop Pro', 1200.00, 10),
  ('Mouse', 25.00, 100),
  ('Keyboard', 50.00, 50),
  ('Monitor', 300.00, 20),
  ('Webcam', 75.00, 30);

-- Orders
INSERT INTO orders (customer_id, product_id, quantity, order_date)
VALUES 
  (1, 1, 1, '2024-01-15'),  -- John ordered Laptop
  (1, 2, 2, '2024-01-16'),  -- John ordered Mouse x2
  (2, 3, 1, '2024-01-17'),  -- Sarah ordered Keyboard
  (2, 4, 2, '2024-01-18'),  -- Sarah ordered Monitor x2
  (3, 1, 1, '2024-01-19'),  -- Mike ordered Laptop
  (4, 2, 5, '2024-01-20');  -- Emily ordered Mouse x5
  -- Note: David (customer 5) has no orders
  -- Note: Webcam (product 5) has no orders
```

**Data Overview:**
```
Customers:           Products:            Orders:
┌────┬────────┐      ┌────┬────────┐      ┌────┬──────────┬──────────┐
│ id │ name   │      │ id │ name   │      │ id │ cust_id  │ prod_id  │
├────┼────────┤      ├────┼────────┤      ├────┼──────────┼──────────┤
│ 1  │ John   │      │ 1  │ Laptop │      │ 1  │ 1        │ 1        │
│ 2  │ Sarah  │      │ 2  │ Mouse  │      │ 2  │ 1        │ 2        │
│ 3  │ Mike   │      │ 3  │ Keybrd │      │ 3  │ 2        │ 3        │
│ 4  │ Emily  │      │ 4  │ Monitr │      │ 4  │ 2        │ 4        │
│ 5  │ David  │      │ 5  │ Webcam │      │ 5  │ 3        │ 1        │
└────┴────────┘      └────┴────────┘      │ 6  │ 4        │ 2        │
                                           └────┴──────────┴──────────┘
```

---

## 🔗 INNER JOIN

**Returns only matching rows from both tables**

### Syntax

```sql
SELECT columns
FROM table1
INNER JOIN table2
  ON table1.column = table2.column;
```

### Basic Example

```sql
-- Get orders with customer names
SELECT 
  orders.id,
  customers.name,
  orders.order_date
FROM orders
INNER JOIN customers
  ON orders.customer_id = customers.id;
```

**Result:**
```
┌────┬────────────┬────────────┐
│ id │ name       │ order_date │
├────┼────────────┼────────────┤
│ 1  │ John Doe   │ 2024-01-15 │
│ 2  │ John Doe   │ 2024-01-16 │
│ 3  │ Sarah Smith│ 2024-01-17 │
│ 4  │ Sarah Smith│ 2024-01-18 │
│ 5  │ Mike Brown │ 2024-01-19 │
│ 6  │ Emily Chen │ 2024-01-20 │
└────┴────────────┴────────────┘
```

**Note:** David (customer 5) not shown because he has no orders!

### Using Table Aliases

```sql
-- Same query with aliases (shorter, cleaner!)
SELECT 
  o.id,
  c.name,
  o.order_date
FROM orders o
INNER JOIN customers c
  ON o.customer_id = c.id;
```

**Best Practice:** Always use aliases for readability!

### Multiple JOINs

```sql
-- Get orders with customer AND product info
SELECT 
  o.id AS order_id,
  c.name AS customer_name,
  p.name AS product_name,
  o.quantity,
  p.price,
  (o.quantity * p.price) AS total_price
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
INNER JOIN products p ON o.product_id = p.id;
```

**Result:**
```
┌──────────┬───────────────┬──────────────┬──────────┬─────────┬─────────────┐
│ order_id │ customer_name │ product_name │ quantity │ price   │ total_price │
├──────────┼───────────────┼──────────────┼──────────┼─────────┼─────────────┤
│ 1        │ John Doe      │ Laptop Pro   │ 1        │ 1200.00 │ 1200.00     │
│ 2        │ John Doe      │ Mouse        │ 2        │ 25.00   │ 50.00       │
│ 3        │ Sarah Smith   │ Keyboard     │ 1        │ 50.00   │ 50.00       │
│ 4        │ Sarah Smith   │ Monitor      │ 2        │ 300.00  │ 600.00      │
│ 5        │ Mike Brown    │ Laptop Pro   │ 1        │ 1200.00 │ 1200.00     │
│ 6        │ Emily Chen    │ Mouse        │ 5        │ 25.00   │ 125.00      │
└──────────┴───────────────┴──────────────┴──────────┴─────────┴─────────────┘
```

---

## ⬅️ LEFT JOIN (LEFT OUTER JOIN)

**Returns ALL rows from left table + matching rows from right table**

### Syntax

```sql
SELECT columns
FROM table1
LEFT JOIN table2
  ON table1.column = table2.column;
```

### Example: All Customers (Even Without Orders)

```sql
-- Show all customers and their orders (if any)
SELECT 
  c.name AS customer_name,
  o.id AS order_id,
  o.order_date
FROM customers c
LEFT JOIN orders o
  ON c.id = o.customer_id
ORDER BY c.name;
```

**Result:**
```
┌───────────────┬──────────┬────────────┐
│ customer_name │ order_id │ order_date │
├───────────────┼──────────┼────────────┤
│ David Lee     │ NULL     │ NULL       │  ← No orders!
│ Emily Chen    │ 6        │ 2024-01-20 │
│ John Doe      │ 1        │ 2024-01-15 │
│ John Doe      │ 2        │ 2024-01-16 │
│ Mike Brown    │ 5        │ 2024-01-19 │
│ Sarah Smith   │ 3        │ 2024-01-17 │
│ Sarah Smith   │ 4        │ 2024-01-18 │
└───────────────┴──────────┴────────────┘
```

**Key Point:** David appears with NULL because LEFT JOIN includes ALL left table rows!

### Find Customers Without Orders

```sql
-- Customers who never ordered
SELECT 
  c.id,
  c.name,
  c.email
FROM customers c
LEFT JOIN orders o
  ON c.id = o.customer_id
WHERE o.id IS NULL;  -- No matching order!
```

**Result:**
```
┌────┬───────────┬─────────────────┐
│ id │ name      │ email           │
├────┼───────────┼─────────────────┤
│ 5  │ David Lee │ david@email.com │
└────┴───────────┴─────────────────┘
```

**Use Case:** Find inactive customers, unused products, etc.

### Count Orders Per Customer

```sql
-- All customers with order count
SELECT 
  c.name,
  COUNT(o.id) AS order_count,
  COALESCE(SUM(o.quantity * p.price), 0) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
LEFT JOIN products p ON o.product_id = p.id
GROUP BY c.id, c.name
ORDER BY total_spent DESC;
```

**Result:**
```
┌─────────────┬─────────────┬─────────────┐
│ name        │ order_count │ total_spent │
├─────────────┼─────────────┼─────────────┤
│ John Doe    │ 2           │ 1250.00     │
│ Mike Brown  │ 1           │ 1200.00     │
│ Sarah Smith │ 2           │ 650.00      │
│ Emily Chen  │ 1           │ 125.00      │
│ David Lee   │ 0           │ 0.00        │  ← Included!
└─────────────┴─────────────┴─────────────┘
```

---

## ➡️ RIGHT JOIN (RIGHT OUTER JOIN)

**Returns ALL rows from right table + matching rows from left table**

### Syntax

```sql
SELECT columns
FROM table1
RIGHT JOIN table2
  ON table1.column = table2.column;
```

### Example: All Products (Even Without Orders)

```sql
-- Show all products and their orders (if any)
SELECT 
  p.name AS product_name,
  COUNT(o.id) AS times_ordered,
  COALESCE(SUM(o.quantity), 0) AS total_quantity_sold
FROM orders o
RIGHT JOIN products p
  ON o.product_id = p.id
GROUP BY p.id, p.name
ORDER BY times_ordered DESC;
```

**Result:**
```
┌──────────────┬──────────────┬─────────────────────┐
│ product_name │ times_ordered│ total_quantity_sold │
├──────────────┼──────────────┼─────────────────────┤
│ Laptop Pro   │ 2            │ 2                   │
│ Mouse        │ 2            │ 7                   │
│ Monitor      │ 1            │ 2                   │
│ Keyboard     │ 1            │ 1                   │
│ Webcam       │ 0            │ 0                   │  ← Never ordered!
└──────────────┴──────────────┴─────────────────────┘
```

### LEFT JOIN vs RIGHT JOIN

```sql
-- These are equivalent:
SELECT * FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;

-- Same as:
SELECT * FROM orders o
RIGHT JOIN customers c ON o.customer_id = c.id;
```

**Convention:** Most developers prefer LEFT JOIN (easier to read)

---

## 🔄 FULL OUTER JOIN

**Returns ALL rows from both tables (with NULLs for non-matches)**

### Syntax

```sql
SELECT columns
FROM table1
FULL OUTER JOIN table2
  ON table1.column = table2.column;
```

### Example: All Customers AND All Products

```sql
-- Show everyone and everything (matched or not)
SELECT 
  c.name AS customer,
  p.name AS product,
  o.quantity
FROM customers c
FULL OUTER JOIN orders o ON c.id = o.customer_id
FULL OUTER JOIN products p ON o.product_id = p.id;
```

**Use Case:** Find gaps in data, complete inventory checks

---

## ❌ CROSS JOIN

**Cartesian product - every row from table1 with every row from table2**

### Syntax

```sql
SELECT columns
FROM table1
CROSS JOIN table2;
```

### Example: All Possible Combinations

```sql
-- All possible customer-product combinations
SELECT 
  c.name AS customer,
  p.name AS product
FROM customers
CROSS JOIN products
ORDER BY c.name, p.name;
```

**Result:** 5 customers × 5 products = 25 rows!
```
┌─────────────┬──────────────┐
│ customer    │ product      │
├─────────────┼──────────────┤
│ David Lee   │ Keyboard     │
│ David Lee   │ Laptop Pro   │
│ David Lee   │ Monitor      │
│ David Lee   │ Mouse        │
│ David Lee   │ Webcam       │
│ Emily Chen  │ Keyboard     │
│ Emily Chen  │ Laptop Pro   │
... (25 total rows)
```

**Use Case:**
- Generate all combinations for reports
- Create product recommendation matrices
- Testing/seeding data

**⚠️ Warning:** Can create HUGE result sets! 1000 × 1000 = 1,000,000 rows!

---

## 🔄 SELF JOIN

**Join a table to itself (useful for hierarchical data)**

### Example: Employee-Manager Relationship

```sql
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  manager_id INTEGER REFERENCES employees(id)
);

INSERT INTO employees (name, manager_id)
VALUES 
  ('CEO Alice', NULL),           -- No manager
  ('VP Bob', 1),                 -- Reports to Alice
  ('VP Carol', 1),               -- Reports to Alice
  ('Manager Dave', 2),           -- Reports to Bob
  ('Manager Eve', 2),            -- Reports to Bob
  ('Employee Frank', 4),         -- Reports to Dave
  ('Employee Grace', 5);         -- Reports to Eve
```

**Self-Join to Show Manager Names:**

```sql
-- Show each employee with their manager's name
SELECT 
  e.name AS employee,
  m.name AS manager
FROM employees e
LEFT JOIN employees m
  ON e.manager_id = m.id;
```

**Result:**
```
┌────────────────┬───────────┐
│ employee       │ manager   │
├────────────────┼───────────┤
│ CEO Alice      │ NULL      │  ← Top of hierarchy
│ VP Bob         │ CEO Alice │
│ VP Carol       │ CEO Alice │
│ Manager Dave   │ VP Bob    │
│ Manager Eve    │ VP Bob    │
│ Employee Frank │ Manager Dave │
│ Employee Grace │ Manager Eve │
└────────────────┴───────────┘
```

### Use Cases for Self-Joins:
- Organizational hierarchies
- Category trees (parent categories)
- Social networks (user friends)
- Comparison queries (find similar items)

---

## 🎯 JOIN Best Practices

### 1. Always Use Table Aliases

```sql
-- ❌ BAD: Hard to read
SELECT customers.name, orders.order_date
FROM customers
INNER JOIN orders ON customers.id = orders.customer_id;

-- ✅ GOOD: Clear and concise
SELECT c.name, o.order_date
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id;
```

### 2. Be Explicit with Column Names

```sql
-- ❌ BAD: Ambiguous
SELECT id, name
FROM customers c
JOIN orders o ON c.id = o.customer_id;
-- Error: column "id" is ambiguous!

-- ✅ GOOD: Specify table
SELECT c.id, c.name, o.order_date
FROM customers c
JOIN orders o ON c.id = o.customer_id;
```

### 3. Choose the Right JOIN Type

```sql
-- Need all customers? Use LEFT JOIN
SELECT c.*, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id;

-- Only customers with orders? Use INNER JOIN
SELECT c.*, COUNT(o.id) AS order_count
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
GROUP BY c.id;
```

### 4. Index Foreign Keys

```sql
-- Create indexes for JOIN performance
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);

-- Now JOINs are much faster!
```

### 5. Filter Early with WHERE

```sql
-- ✅ GOOD: Filter before JOIN (faster)
SELECT o.*, c.name
FROM orders o
JOIN (
  SELECT * FROM customers WHERE city = 'Jakarta'
) c ON o.customer_id = c.id;

-- Or use WHERE after JOIN
SELECT o.*, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE c.city = 'Jakarta';
```

---

## 💡 Real-World Examples

### E-commerce Order Report

```sql
-- Complete order report with all details
SELECT 
  o.id AS order_id,
  o.order_date,
  c.name AS customer_name,
  c.email AS customer_email,
  c.address AS shipping_address,
  p.name AS product_name,
  o.quantity,
  p.price AS unit_price,
  (o.quantity * p.price) AS subtotal,
  CASE 
    WHEN (o.quantity * p.price) > 1000 THEN 'Free Shipping'
    ELSE 'Standard Shipping'
  END AS shipping_type
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
INNER JOIN products p ON o.product_id = p.id
ORDER BY o.order_date DESC;
```

### Customer Lifetime Value

```sql
-- Calculate total value per customer
SELECT 
  c.id,
  c.name,
  c.email,
  COUNT(o.id) AS total_orders,
  COALESCE(SUM(o.quantity), 0) AS total_items,
  COALESCE(SUM(o.quantity * p.price), 0) AS lifetime_value,
  CASE 
    WHEN COUNT(o.id) = 0 THEN 'Inactive'
    WHEN COUNT(o.id) < 3 THEN 'New'
    WHEN COUNT(o.id) < 10 THEN 'Regular'
    ELSE 'VIP'
  END AS customer_segment
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
LEFT JOIN products p ON o.product_id = p.id
GROUP BY c.id, c.name, c.email
ORDER BY lifetime_value DESC;
```

### Product Performance Analysis

```sql
-- Analyze product sales performance
SELECT 
  p.id,
  p.name AS product_name,
  p.price,
  p.stock AS current_stock,
  COUNT(o.id) AS times_sold,
  COALESCE(SUM(o.quantity), 0) AS units_sold,
  COALESCE(SUM(o.quantity * p.price), 0) AS revenue,
  ROUND(
    COALESCE(SUM(o.quantity * p.price), 0) * 100.0 / 
    NULLIF((SELECT SUM(o2.quantity * p2.price) 
            FROM orders o2 
            JOIN products p2 ON o2.product_id = p2.id), 0),
    2
  ) AS revenue_percentage,
  MAX(o.order_date) AS last_sold_date,
  CASE 
    WHEN COUNT(o.id) = 0 THEN 'Not Selling'
    WHEN COUNT(o.id) < 3 THEN 'Slow Moving'
    WHEN COUNT(o.id) < 10 THEN 'Moderate'
    ELSE 'Best Seller'
  END AS performance_category
FROM products p
LEFT JOIN orders o ON p.id = o.product_id
GROUP BY p.id, p.name, p.price, p.stock
ORDER BY revenue DESC;
```

---

## 🔥 Common Mistakes

### Mistake 1: Forgetting JOIN Condition

```sql
-- ❌ WRONG: Creates cartesian product!
SELECT c.name, o.order_date
FROM customers c, orders o;
-- Returns 5 customers × 6 orders = 30 rows (wrong!)

-- ✅ CORRECT: Add JOIN condition
SELECT c.name, o.order_date
FROM customers c
JOIN orders o ON c.id = o.customer_id;
-- Returns 6 rows (correct!)
```

### Mistake 2: Using INNER JOIN Instead of LEFT JOIN

```sql
-- ❌ WRONG: Excludes customers without orders
SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
GROUP BY c.name;
-- David Lee not shown!

-- ✅ CORRECT: Use LEFT JOIN to include all
SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.name;
-- David Lee shown with 0 orders
```

### Mistake 3: Ambiguous Column Names

```sql
-- ❌ ERROR: Which 'id'?
SELECT id, name
FROM customers c
JOIN orders o ON c.id = o.customer_id;
-- Error: column "id" is ambiguous

-- ✅ CORRECT: Specify table
SELECT c.id, c.name
FROM customers c
JOIN orders o ON c.id = o.customer_id;
```

### Mistake 4: Wrong JOIN Order

```sql
-- Be careful with multiple JOINs!
-- This might not work as expected:
SELECT *
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
INNER JOIN products p ON o.product_id = p.id;
-- INNER JOIN after LEFT JOIN can turn it into INNER JOIN!

-- ✅ BETTER: All LEFT JOINs or proper order
SELECT *
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
LEFT JOIN products p ON o.product_id = p.id;
```

---

## 📝 Practice Exercises

### Exercise 1: Basic INNER JOIN
```sql
-- List all orders with customer names and product names


-- Calculate total revenue by customer


```

### Exercise 2: LEFT JOIN
```sql
-- Find all customers and their order count (including 0)


-- Find products that have never been ordered


```

### Exercise 3: Multiple JOINs
```sql
-- Create a complete sales report with:
-- - Order ID, date
-- - Customer name, email
-- - Product name, price
-- - Quantity, subtotal


```

### Exercise 4: Self-Join
```sql
-- Create a categories table with parent_id
-- Then find all categories with their parent names


```

### Exercise 5: Advanced
```sql
-- Find customers who ordered both 'Laptop Pro' AND 'Mouse'


-- Calculate average order value by customer segment
-- (segment based on total orders)


```

---

## 🎯 Summary

**JOIN Types:**

| JOIN Type        | Returns                                      | Use When                    |
|------------------|----------------------------------------------|-----------------------------|
| INNER JOIN       | Only matching rows from both tables          | Need exact matches          |
| LEFT JOIN        | All from left + matching from right          | Need all left rows          |
| RIGHT JOIN       | All from right + matching from left          | Need all right rows         |
| FULL OUTER JOIN  | All rows from both tables                    | Need everything             |
| CROSS JOIN       | Cartesian product (all combinations)         | Generate combinations       |
| SELF JOIN        | Table joined to itself                       | Hierarchical/tree data      |

**Syntax:**
```sql
SELECT columns
FROM table1 alias1
[INNER|LEFT|RIGHT|FULL|CROSS] JOIN table2 alias2
  ON alias1.column = alias2.column
WHERE conditions
GROUP BY columns
ORDER BY columns;
```

**Best Practices:**
- ✅ Always use table aliases
- ✅ Be explicit with column names
- ✅ Index foreign key columns
- ✅ Choose appropriate JOIN type
- ✅ Filter early with WHERE
- ✅ Use LEFT JOIN to find missing data

**Next Step:**
👉 Lanjut ke [Materi 12: UNIONs & Subqueries](./12-unions-subqueries.md)

---

**Happy Learning! 🚀**
