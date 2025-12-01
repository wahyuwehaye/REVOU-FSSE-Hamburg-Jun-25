# 🔍 Selecting Data from Database

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Menggunakan SELECT statement dengan berbagai variasi
- ✅ Memilih columns spesifik
- ✅ Menggunakan alias untuk readability
- ✅ Menghitung dan aggregate data
- ✅ Menggunakan DISTINCT untuk unique values

---

## 📖 SELECT Statement Anatomy

### Basic Structure

```sql
SELECT column1, column2, ...
FROM table_name;
```

### Full Structure (Advanced)

```sql
SELECT 
  column1,
  column2,
  aggregate_function(column3)
FROM 
  table_name
WHERE 
  condition
GROUP BY 
  column1, column2
HAVING 
  aggregate_condition
ORDER BY 
  column1 DESC
LIMIT 
  number
OFFSET 
  number;
```

---

## 🎯 SELECT Variations

### 1. Select All Columns

```sql
-- Get everything
SELECT * FROM users;

-- Output:
┌─────┬─────────────┬──────────────────┬─────┬────────────┐
│ id  │ name        │ email            │ age │ is_active  │
├─────┼─────────────┼──────────────────┼─────┼────────────┤
│ 1   │ John Doe    │ john@email.com   │ 25  │ true       │
│ 2   │ Sarah Smith │ sarah@email.com  │ 30  │ true       │
│ 3   │ Mike Brown  │ mike@email.com   │ 28  │ false      │
└─────┴─────────────┴──────────────────┴─────┴────────────┘
```

**When to use `*`:**
- ✅ During development/exploration
- ✅ When you need all columns
- ❌ Production APIs (specify columns for performance!)

### 2. Select Specific Columns

```sql
-- Only name and email
SELECT name, email FROM users;

-- Output:
┌─────────────┬──────────────────┐
│ name        │ email            │
├─────────────┼──────────────────┤
│ John Doe    │ john@email.com   │
│ Sarah Smith │ sarah@email.com  │
│ Mike Brown  │ mike@email.com   │
└─────────────┴──────────────────┘
```

**Why specific columns?**
- ⚡ Faster (less data transferred)
- 💾 Less memory usage
- 🔒 Security (hide sensitive columns)

### 3. Select with Expressions

```sql
-- Calculate on the fly
SELECT 
  name,
  age,
  age * 12 AS age_in_months,
  age + 1 AS next_year_age
FROM users;

-- Output:
┌─────────────┬─────┬────────────────┬───────────────┐
│ name        │ age │ age_in_months  │ next_year_age │
├─────────────┼─────┼────────────────┼───────────────┤
│ John Doe    │ 25  │ 300            │ 26            │
│ Sarah Smith │ 30  │ 360            │ 31            │
└─────────────┴─────┴────────────────┴───────────────┘
```

### 4. String Concatenation

```sql
-- PostgreSQL: Use ||
SELECT 
  name,
  email,
  'Hello, ' || name || '!' AS greeting
FROM users;

-- Or CONCAT function
SELECT 
  name,
  CONCAT('Hello, ', name, '!') AS greeting
FROM users;

-- Output:
┌─────────────┬────────────────────────┐
│ name        │ greeting               │
├─────────────┼────────────────────────┤
│ John Doe    │ Hello, John Doe!       │
│ Sarah Smith │ Hello, Sarah Smith!    │
└─────────────┴────────────────────────┘
```

---

## 🏷️ Column Aliases (AS)

### Why Use Aliases?

```sql
-- ❌ Unclear column names
SELECT 
  name,
  age * 12,
  EXTRACT(YEAR FROM created_at)
FROM users;

-- Output columns: name, ?column?, extract
-- What does ?column? mean?

-- ✅ Clear with aliases
SELECT 
  name AS full_name,
  age * 12 AS age_in_months,
  EXTRACT(YEAR FROM created_at) AS registration_year
FROM users;

-- Output columns: full_name, age_in_months, registration_year
```

### Alias Syntax

```sql
-- Standard (with AS)
SELECT name AS user_name FROM users;

-- Shorthand (without AS)
SELECT name user_name FROM users;

-- With spaces (use quotes)
SELECT name AS "User Full Name" FROM users;

-- Table alias
SELECT u.name, u.email 
FROM users AS u;
```

---

## 🎯 DISTINCT - Remove Duplicates

### Basic Usage

```sql
-- Table with duplicates:
SELECT city FROM users;

-- Output:
┌──────────┐
│ city     │
├──────────┤
│ Jakarta  │
│ Bandung  │
│ Jakarta  │  -- Duplicate!
│ Surabaya │
│ Jakarta  │  -- Duplicate!
└──────────┘

-- Get unique cities:
SELECT DISTINCT city FROM users;

-- Output:
┌──────────┐
│ city     │
├──────────┤
│ Jakarta  │
│ Bandung  │
│ Surabaya │
└──────────┘
```

### DISTINCT with Multiple Columns

```sql
-- Unique combinations of city + country
SELECT DISTINCT city, country FROM users;

-- Only removes exact duplicate rows
-- Jakarta, Indonesia
-- Jakarta, Malaysia   -- Different, kept
```

### Count Distinct Values

```sql
-- How many unique cities?
SELECT COUNT(DISTINCT city) AS total_cities FROM users;

-- Output:
┌──────────────┐
│ total_cities │
├──────────────┤
│ 3            │
└──────────────┘
```

---

## 📊 Aggregate Functions

### Common Aggregates

```sql
-- COUNT: Count rows
SELECT COUNT(*) AS total_users FROM users;

-- COUNT with condition
SELECT COUNT(*) AS active_users 
FROM users 
WHERE is_active = true;

-- AVG: Average
SELECT AVG(age) AS average_age FROM users;

-- SUM: Total
SELECT SUM(price) AS total_revenue FROM orders;

-- MIN: Minimum
SELECT MIN(age) AS youngest FROM users;

-- MAX: Maximum
SELECT MAX(age) AS oldest FROM users;
```

### Real-World Example

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  price DECIMAL(10, 2),
  stock INTEGER,
  category VARCHAR(50)
);

-- Summary statistics
SELECT 
  COUNT(*) AS total_products,
  AVG(price) AS avg_price,
  MIN(price) AS cheapest,
  MAX(price) AS most_expensive,
  SUM(stock) AS total_stock
FROM products;

-- Output:
┌─────────────────┬───────────┬───────────┬──────────────────┬─────────────┐
│ total_products  │ avg_price │ cheapest  │ most_expensive   │ total_stock │
├─────────────────┼───────────┼───────────┼──────────────────┼─────────────┤
│ 156             │ 499.99    │ 9.99      │ 2999.00          │ 8432        │
└─────────────────┴───────────┴───────────┴──────────────────┴─────────────┘
```

---

## 🎨 String Functions

### UPPER & LOWER

```sql
SELECT 
  name,
  UPPER(name) AS uppercase,
  LOWER(name) AS lowercase
FROM users;

-- Output:
┌─────────────┬─────────────┬─────────────┐
│ name        │ uppercase   │ lowercase   │
├─────────────┼─────────────┼─────────────┤
│ John Doe    │ JOHN DOE    │ john doe    │
└─────────────┴─────────────┴─────────────┘
```

### LENGTH

```sql
SELECT 
  name,
  LENGTH(name) AS name_length
FROM users;

-- Output:
┌─────────────┬─────────────┐
│ name        │ name_length │
├─────────────┼─────────────┤
│ John Doe    │ 8           │
│ Sarah Smith │ 11          │
└─────────────┴─────────────┘
```

### SUBSTRING

```sql
SELECT 
  email,
  SUBSTRING(email FROM 1 FOR POSITION('@' IN email) - 1) AS username
FROM users;

-- Output:
┌──────────────────┬──────────┐
│ email            │ username │
├──────────────────┼──────────┤
│ john@email.com   │ john     │
│ sarah@email.com  │ sarah    │
└──────────────────┴──────────┘
```

### TRIM, LTRIM, RTRIM

```sql
SELECT 
  '  hello  ' AS original,
  TRIM('  hello  ') AS trimmed,
  LTRIM('  hello  ') AS left_trim,
  RTRIM('  hello  ') AS right_trim;

-- Output:
┌───────────┬──────────┬────────────┬─────────────┐
│ original  │ trimmed  │ left_trim  │ right_trim  │
├───────────┼──────────┼────────────┼─────────────┤
│   hello   │ hello    │ hello      │   hello     │
└───────────┴──────────┴────────────┴─────────────┘
```

---

## 📅 Date & Time Functions

### NOW, CURRENT_DATE, CURRENT_TIME

```sql
SELECT 
  NOW() AS current_datetime,
  CURRENT_DATE AS today,
  CURRENT_TIME AS time_now;

-- Output:
┌─────────────────────────┬────────────┬──────────────┐
│ current_datetime        │ today      │ time_now     │
├─────────────────────────┼────────────┼──────────────┤
│ 2024-12-01 15:30:45     │ 2024-12-01 │ 15:30:45     │
└─────────────────────────┴────────────┴──────────────┘
```

### EXTRACT

```sql
SELECT 
  created_at,
  EXTRACT(YEAR FROM created_at) AS year,
  EXTRACT(MONTH FROM created_at) AS month,
  EXTRACT(DAY FROM created_at) AS day
FROM users;

-- Output:
┌─────────────────────────┬──────┬───────┬─────┐
│ created_at              │ year │ month │ day │
├─────────────────────────┼──────┼───────┼─────┤
│ 2024-06-15 10:30:00     │ 2024 │ 6     │ 15  │
└─────────────────────────┴──────┴───────┴─────┘
```

### AGE & INTERVAL

```sql
SELECT 
  name,
  created_at,
  AGE(NOW(), created_at) AS account_age,
  created_at + INTERVAL '1 year' AS next_anniversary
FROM users;

-- Output:
┌──────────┬─────────────────────┬────────────────────┬─────────────────────┐
│ name     │ created_at          │ account_age        │ next_anniversary    │
├──────────┼─────────────────────┼────────────────────┼─────────────────────┤
│ John Doe │ 2023-06-15 10:30:00 │ 1 year 5 months... │ 2024-06-15 10:30:00 │
└──────────┴─────────────────────┴────────────────────┴─────────────────────┘
```

---

## 🔢 Math Functions

```sql
SELECT 
  price,
  ROUND(price) AS rounded,                -- 99.99 → 100
  CEIL(price) AS ceiling,                 -- 99.01 → 100
  FLOOR(price) AS floored,                -- 99.99 → 99
  ABS(-50) AS absolute,                   -- -50 → 50
  POWER(2, 3) AS power,                   -- 2^3 = 8
  SQRT(16) AS square_root                 -- √16 = 4
FROM products;
```

---

## ⚙️ CASE Statement (Conditional Logic)

### Basic CASE

```sql
SELECT 
  name,
  age,
  CASE 
    WHEN age < 18 THEN 'Minor'
    WHEN age >= 18 AND age < 60 THEN 'Adult'
    ELSE 'Senior'
  END AS age_group
FROM users;

-- Output:
┌─────────────┬─────┬───────────┐
│ name        │ age │ age_group │
├─────────────┼─────┼───────────┤
│ John Doe    │ 25  │ Adult     │
│ Sarah Smith │ 65  │ Senior    │
│ Mike Brown  │ 16  │ Minor     │
└─────────────┴─────┴───────────┘
```

### CASE for Status

```sql
SELECT 
  order_id,
  total,
  CASE 
    WHEN total < 100 THEN 'Small'
    WHEN total >= 100 AND total < 500 THEN 'Medium'
    WHEN total >= 500 THEN 'Large'
  END AS order_size,
  CASE 
    WHEN total >= 1000 THEN total * 0.9  -- 10% discount
    WHEN total >= 500 THEN total * 0.95   -- 5% discount
    ELSE total
  END AS discounted_price
FROM orders;
```

---

## 🎯 NULL Handling

### COALESCE (Default Value)

```sql
-- Replace NULL with default
SELECT 
  name,
  age,
  COALESCE(age, 0) AS age_or_zero,
  COALESCE(city, 'Unknown') AS city_or_unknown
FROM users;

-- Output:
┌──────────┬──────┬──────────────┬─────────────────┐
│ name     │ age  │ age_or_zero  │ city_or_unknown │
├──────────┼──────┼──────────────┼─────────────────┤
│ John     │ 25   │ 25           │ Jakarta         │
│ Sarah    │ NULL │ 0            │ Unknown         │
└──────────┴──────┴──────────────┴─────────────────┘
```

### NULLIF (Convert to NULL)

```sql
-- Convert empty string to NULL
SELECT 
  name,
  NULLIF(bio, '') AS bio
FROM users;

-- If bio is '', it becomes NULL
```

---

## 📝 Practical Examples

### Example 1: User Dashboard

```sql
SELECT 
  id,
  name AS "User Name",
  email AS "Contact Email",
  CASE 
    WHEN is_active THEN 'Active'
    ELSE 'Inactive'
  END AS "Status",
  AGE(NOW(), created_at) AS "Member Since",
  COALESCE(city, 'Not specified') AS "Location"
FROM users
ORDER BY created_at DESC
LIMIT 10;
```

### Example 2: Product Catalog

```sql
SELECT 
  name AS product_name,
  '$' || CAST(price AS TEXT) AS formatted_price,
  stock AS available_stock,
  CASE 
    WHEN stock = 0 THEN 'Out of Stock'
    WHEN stock < 10 THEN 'Low Stock'
    ELSE 'In Stock'
  END AS stock_status,
  category
FROM products
WHERE price > 0
ORDER BY price ASC;
```

### Example 3: Sales Summary

```sql
SELECT 
  COUNT(*) AS total_orders,
  SUM(total) AS total_revenue,
  AVG(total) AS average_order_value,
  MIN(total) AS smallest_order,
  MAX(total) AS largest_order,
  COUNT(DISTINCT user_id) AS unique_customers
FROM orders
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
```

---

## 🔥 Common Mistakes

### Mistake 1: Aggregate with Non-Aggregate

```sql
-- ❌ WRONG: Can't mix aggregate and non-aggregate
SELECT name, COUNT(*) FROM users;

-- ✅ CORRECT: Use GROUP BY (will learn later)
SELECT name, COUNT(*) FROM users GROUP BY name;

-- OR just use aggregate
SELECT COUNT(*) FROM users;
```

### Mistake 2: DISTINCT on Expressions

```sql
-- ❌ WRONG: DISTINCT only on one column
SELECT DISTINCT name, COUNT(*) FROM users;

-- ✅ CORRECT:
SELECT name FROM users GROUP BY name;
```

### Mistake 3: NULL in Calculations

```sql
-- ❌ PROBLEM: NULL in calculation = NULL result
SELECT age + 10 FROM users;  -- If age is NULL, result is NULL

-- ✅ SOLUTION: Use COALESCE
SELECT COALESCE(age, 0) + 10 FROM users;
```

---

## 📝 Quiz Time!

### Question 1
**Kapan pakai SELECT * vs specific columns?**

<details>
<summary>Jawaban</summary>

**SELECT *:**
- ✅ During development/exploration
- ✅ When truly need all columns
- ❌ Not in production APIs (slow, security risk)

**Specific columns:**
- ✅ Production code
- ✅ API responses
- ✅ Better performance
- ✅ Hide sensitive data

**Example:**
```sql
-- Development
SELECT * FROM users WHERE id = 1;

-- Production
SELECT id, name, email FROM users WHERE id = 1;  -- Don't expose password_hash!
```
</details>

### Question 2
**Apa bedanya COUNT(*) vs COUNT(column)?**

<details>
<summary>Jawaban</summary>

**COUNT(*):**
- Counts all rows (including NULL)

**COUNT(column):**
- Counts non-NULL values only

**Example:**
```sql
-- Table:
id | name  | city
1  | John  | Jakarta
2  | Sarah | NULL
3  | Mike  | Bandung

SELECT COUNT(*) FROM users;        -- 3 (all rows)
SELECT COUNT(city) FROM users;     -- 2 (NULL excluded)
SELECT COUNT(DISTINCT city) FROM users;  -- 2 (unique, NULL excluded)
```
</details>

### Question 3
**Bagaimana handle NULL values?**

<details>
<summary>Jawaban</summary>

**Methods:**

```sql
-- 1. COALESCE: Replace NULL with default
SELECT COALESCE(age, 0) FROM users;

-- 2. NULLIF: Convert value to NULL
SELECT NULLIF(status, '') FROM users;

-- 3. IS NULL check
SELECT * FROM users WHERE age IS NULL;

-- 4. IS NOT NULL check
SELECT * FROM users WHERE age IS NOT NULL;

-- 5. CASE statement
SELECT 
  CASE 
    WHEN age IS NULL THEN 'Unknown'
    ELSE CAST(age AS TEXT)
  END
FROM users;
```
</details>

---

## 🎯 Summary

**Key Takeaways:**

1. ✅ **SELECT** - Choose columns to retrieve
2. ✅ **DISTINCT** - Remove duplicates
3. ✅ **Aliases (AS)** - Rename columns for clarity
4. ✅ **Aggregates** - COUNT, SUM, AVG, MIN, MAX
5. ✅ **Functions** - String, date, math operations
6. ✅ **CASE** - Conditional logic
7. ✅ **COALESCE** - Handle NULL values

**Next Step:**
👉 Lanjut ke [Materi 08: Filtering and Sorting Data](./08-filtering-sorting-data.md)

---

**Happy Learning! 🚀**
