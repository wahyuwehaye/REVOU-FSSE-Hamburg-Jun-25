# 🔍 Filtering and Sorting Data

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Menggunakan WHERE clause untuk filter data
- ✅ Menggabungkan multiple conditions dengan AND, OR, NOT
- ✅ Menggunakan comparison operators (<, >, <=, >=, =, !=)
- ✅ Pattern matching dengan LIKE dan ILIKE
- ✅ Filtering dengan IN, BETWEEN, IS NULL
- ✅ Sorting data dengan ORDER BY
- ✅ Pagination dengan LIMIT dan OFFSET

---

## 🎯 WHERE Clause - Basic Filtering

### Syntax

```sql
SELECT columns
FROM table_name
WHERE condition;
```

### Comparison Operators

```sql
-- Equal to
SELECT * FROM users WHERE age = 25;

-- Not equal to
SELECT * FROM users WHERE age != 25;
-- OR
SELECT * FROM users WHERE age <> 25;

-- Greater than
SELECT * FROM users WHERE age > 25;

-- Less than
SELECT * FROM users WHERE age < 25;

-- Greater than or equal
SELECT * FROM users WHERE age >= 25;

-- Less than or equal
SELECT * FROM users WHERE age <= 25;
```

### Example Table

```sql
-- Sample users table
┌────┬─────────────┬──────────────────┬─────┬──────────┬────────────┐
│ id │ name        │ email            │ age │ city     │ is_active  │
├────┼─────────────┼──────────────────┼─────┼──────────┼────────────┤
│ 1  │ John Doe    │ john@email.com   │ 25  │ Jakarta  │ true       │
│ 2  │ Sarah Smith │ sarah@email.com  │ 30  │ Bandung  │ true       │
│ 3  │ Mike Brown  │ mike@email.com   │ 28  │ Jakarta  │ false      │
│ 4  │ Emily Chen  │ emily@email.com  │ 35  │ Surabaya │ true       │
│ 5  │ David Lee   │ david@email.com  │ 22  │ Jakarta  │ true       │
└────┴─────────────┴──────────────────┴─────┴──────────┴────────────┘
```

### Practical Examples

```sql
-- Find users older than 25
SELECT name, age FROM users WHERE age > 25;
-- Returns: Sarah (30), Mike (28), Emily (35)

-- Find active users
SELECT name, is_active FROM users WHERE is_active = true;
-- Returns: John, Sarah, Emily, David

-- Find users from Jakarta
SELECT name, city FROM users WHERE city = 'Jakarta';
-- Returns: John, Mike, David

-- Find users NOT from Jakarta
SELECT name, city FROM users WHERE city != 'Jakarta';
-- Returns: Sarah (Bandung), Emily (Surabaya)
```

---

## 🔗 Combining Conditions

### AND Operator

**Both conditions must be true**

```sql
-- Syntax
SELECT * FROM table_name 
WHERE condition1 AND condition2;

-- Example: Users over 25 AND from Jakarta
SELECT name, age, city FROM users 
WHERE age > 25 AND city = 'Jakarta';
-- Returns: Mike (28, Jakarta)

-- Example: Active users over 25
SELECT name, age, is_active FROM users 
WHERE is_active = true AND age > 25;
-- Returns: Sarah (30), Emily (35)

-- Multiple AND conditions
SELECT * FROM users 
WHERE age > 25 
  AND city = 'Jakarta' 
  AND is_active = true;
-- Returns: No one (Mike is from Jakarta but not active)
```

### OR Operator

**At least one condition must be true**

```sql
-- Syntax
SELECT * FROM table_name 
WHERE condition1 OR condition2;

-- Example: Users from Jakarta OR Bandung
SELECT name, city FROM users 
WHERE city = 'Jakarta' OR city = 'Bandung';
-- Returns: John, Sarah, Mike, David

-- Example: Users under 25 OR over 30
SELECT name, age FROM users 
WHERE age < 25 OR age > 30;
-- Returns: David (22), Sarah (30), Emily (35)

-- Multiple OR conditions
SELECT * FROM users 
WHERE city = 'Jakarta' 
   OR city = 'Bandung' 
   OR city = 'Surabaya';
-- Returns: All users
```

### Combining AND & OR

**Use parentheses for clarity!**

```sql
-- Example: (Over 25 AND from Jakarta) OR from Bandung
SELECT name, age, city FROM users 
WHERE (age > 25 AND city = 'Jakarta') 
   OR city = 'Bandung';
-- Returns: Mike (28, Jakarta), Sarah (30, Bandung)

-- Example: Active AND (from Jakarta OR Bandung)
SELECT name, is_active, city FROM users 
WHERE is_active = true 
  AND (city = 'Jakarta' OR city = 'Bandung');
-- Returns: John (Jakarta), Sarah (Bandung), David (Jakarta)

-- Complex: (Age 25-30 OR over 35) AND Active
SELECT name, age, is_active FROM users 
WHERE (age BETWEEN 25 AND 30 OR age > 35) 
  AND is_active = true;
-- Returns: John (25), Sarah (30)
```

### NOT Operator

**Negates a condition**

```sql
-- NOT with single condition
SELECT * FROM users WHERE NOT is_active;
-- Same as: WHERE is_active = false

-- NOT with comparison
SELECT * FROM users WHERE NOT age > 25;
-- Same as: WHERE age <= 25

-- NOT with complex condition
SELECT * FROM users 
WHERE NOT (city = 'Jakarta' OR city = 'Bandung');
-- Same as: WHERE city != 'Jakarta' AND city != 'Bandung'

-- NOT IN (covered later)
SELECT * FROM users 
WHERE city NOT IN ('Jakarta', 'Bandung');
```

---

## 📋 IN Operator

**Check if value is in a list**

```sql
-- Syntax
SELECT * FROM table_name 
WHERE column IN (value1, value2, value3);

-- Example: Users from specific cities
SELECT name, city FROM users 
WHERE city IN ('Jakarta', 'Bandung', 'Surabaya');
-- Much cleaner than:
-- WHERE city = 'Jakarta' OR city = 'Bandung' OR city = 'Surabaya'

-- Example: Users with specific ages
SELECT name, age FROM users 
WHERE age IN (25, 30, 35);
-- Returns: John (25), Sarah (30), Emily (35)

-- NOT IN
SELECT name, city FROM users 
WHERE city NOT IN ('Jakarta', 'Bandung');
-- Returns: Emily (Surabaya)

-- IN with numbers
SELECT * FROM products 
WHERE id IN (1, 5, 10, 15);

-- IN with strings
SELECT * FROM users 
WHERE email IN ('john@email.com', 'sarah@email.com');
```

### IN vs OR Performance

```sql
-- ❌ Slow for many values
WHERE city = 'Jakarta' 
   OR city = 'Bandung' 
   OR city = 'Surabaya' 
   OR city = 'Yogyakarta'
   ... (50 more cities)

-- ✅ Better
WHERE city IN ('Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', ...)
```

---

## 📏 BETWEEN Operator

**Check if value is within a range (inclusive)**

```sql
-- Syntax
SELECT * FROM table_name 
WHERE column BETWEEN min_value AND max_value;

-- Example: Users aged 25-30
SELECT name, age FROM users 
WHERE age BETWEEN 25 AND 30;
-- Returns: John (25), Mike (28), Sarah (30)
-- Same as: WHERE age >= 25 AND age <= 30

-- NOT BETWEEN
SELECT name, age FROM users 
WHERE age NOT BETWEEN 25 AND 30;
-- Returns: David (22), Emily (35)

-- BETWEEN with dates
SELECT * FROM orders 
WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';

-- BETWEEN with decimals
SELECT * FROM products 
WHERE price BETWEEN 100.00 AND 500.00;
```

### BETWEEN vs Comparison Operators

```sql
-- These are equivalent:
WHERE age BETWEEN 25 AND 30
WHERE age >= 25 AND age <= 30

-- But BETWEEN is more readable!
```

---

## 🔤 LIKE Operator - Pattern Matching

**Search for patterns in strings**

### Wildcards

```
% - Matches any sequence of characters (0 or more)
_ - Matches exactly one character
```

### Examples with %

```sql
-- Starts with 'J'
SELECT * FROM users WHERE name LIKE 'J%';
-- Matches: John Doe, Jane Smith
-- Not: Sarah Smith, Mike Brown

-- Ends with 'Smith'
SELECT * FROM users WHERE name LIKE '%Smith';
-- Matches: Sarah Smith, John Smith
-- Not: John Doe, Mike Brown

-- Contains 'ar'
SELECT * FROM users WHERE name LIKE '%ar%';
-- Matches: Sarah Smith, Mary Johnson
-- Not: John Doe, Mike Brown

-- Starts with 'S' and ends with 'h'
SELECT * FROM users WHERE name LIKE 'S%h';
-- Matches: Sarah Smith
-- Not: Sarah Lee, Sam Brown
```

### Examples with _

```sql
-- Exactly 4 characters
SELECT * FROM users WHERE name LIKE '____';
-- Matches: John, Mike, Anna
-- Not: Sarah (5 chars), Jo (2 chars)

-- Starts with 'J', then any char, then 'hn'
SELECT * FROM users WHERE name LIKE 'J_hn';
-- Matches: John
-- Not: Jane, Jennifer

-- Pattern: 3 chars, then 'ar'
SELECT * FROM users WHERE name LIKE '___ar';
-- Matches: Oscar
-- Not: Sarah (5 chars before ar)
```

### Combining Wildcards

```sql
-- Email ending with @gmail.com
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- Phone starting with 08 (Indonesia)
SELECT * FROM users WHERE phone LIKE '08%';

-- Product code: XX-####-XX (XX=letters, #=numbers)
SELECT * FROM products WHERE sku LIKE '__-____-__';
```

### Case Sensitivity

```sql
-- LIKE is case-sensitive
SELECT * FROM users WHERE name LIKE 'john%';
-- Matches: john, johnny
-- NOT: John, JOHN

-- ILIKE is case-insensitive (PostgreSQL only)
SELECT * FROM users WHERE name ILIKE 'john%';
-- Matches: john, John, JOHN, Johnny, JOHNNY
```

### Escaping Special Characters

```sql
-- What if value contains % or _?
-- Use backslash to escape

-- Find products with _ in name
SELECT * FROM products WHERE name LIKE '%\_%';
-- Matches: "Product_123", "Item_ABC"

-- Find records with % in description
SELECT * FROM items WHERE description LIKE '%\%%';
-- Matches: "50% off", "100% cotton"
```

---

## ❓ IS NULL / IS NOT NULL

**Check for NULL values**

### Understanding NULL

```
NULL ≠ empty string ''
NULL ≠ 0
NULL ≠ false
NULL = unknown/missing value
```

### Checking for NULL

```sql
-- Find users without age
SELECT * FROM users WHERE age IS NULL;

-- Find users with age
SELECT * FROM users WHERE age IS NOT NULL;

-- ❌ WRONG: Cannot use = or != with NULL
SELECT * FROM users WHERE age = NULL;    -- Returns nothing!
SELECT * FROM users WHERE age != NULL;   -- Returns nothing!

-- ✅ CORRECT: Use IS NULL or IS NOT NULL
SELECT * FROM users WHERE age IS NULL;
SELECT * FROM users WHERE age IS NOT NULL;
```

### Practical Examples

```sql
-- Users without email
SELECT name FROM users WHERE email IS NULL;

-- Products with price set
SELECT name, price FROM products WHERE price IS NOT NULL;

-- Orders without shipping date (not yet shipped)
SELECT * FROM orders WHERE shipped_at IS NULL;

-- Posts without publish date (drafts)
SELECT title FROM posts WHERE published_at IS NULL;

-- Combining with other conditions
SELECT * FROM users 
WHERE age IS NOT NULL 
  AND age > 25 
  AND city = 'Jakarta';
```

### NULL in Calculations

```sql
-- NULL in any operation results in NULL
SELECT 10 + NULL;     -- Result: NULL
SELECT 5 * NULL;      -- Result: NULL
SELECT NULL = NULL;   -- Result: NULL (not true!)

-- Use COALESCE to handle NULL
SELECT 
  name,
  age,
  COALESCE(age, 0) AS age_or_zero
FROM users;
```

---

## 📊 ORDER BY - Sorting Results

### Basic Sorting

```sql
-- Syntax
SELECT * FROM table_name 
ORDER BY column [ASC|DESC];

-- ASC = Ascending (A-Z, 0-9) - default
-- DESC = Descending (Z-A, 9-0)
```

### Sort by Single Column

```sql
-- Sort by name (A-Z)
SELECT * FROM users ORDER BY name;
-- Same as:
SELECT * FROM users ORDER BY name ASC;

-- Sort by name (Z-A)
SELECT * FROM users ORDER BY name DESC;

-- Sort by age (youngest first)
SELECT * FROM users ORDER BY age ASC;

-- Sort by age (oldest first)
SELECT * FROM users ORDER BY age DESC;
```

### Sort by Multiple Columns

```sql
-- First by city, then by age within each city
SELECT name, city, age FROM users 
ORDER BY city ASC, age DESC;

-- Output:
┌─────────────┬──────────┬─────┐
│ name        │ city     │ age │
├─────────────┼──────────┼─────┤
│ Sarah Smith │ Bandung  │ 30  │  -- Bandung group
│ Mike Brown  │ Jakarta  │ 28  │  -- Jakarta group, oldest first
│ John Doe    │ Jakarta  │ 25  │
│ David Lee   │ Jakarta  │ 22  │  -- youngest
│ Emily Chen  │ Surabaya │ 35  │  -- Surabaya group
└─────────────┴──────────┴─────┘

-- First by is_active, then by age
SELECT name, is_active, age FROM users 
ORDER BY is_active DESC, age ASC;
-- Shows active users first, then inactive, each sorted by age
```

### Sort by Expression

```sql
-- Sort by length of name
SELECT name, LENGTH(name) AS name_length 
FROM users 
ORDER BY LENGTH(name);

-- Sort by year of creation
SELECT name, created_at 
FROM users 
ORDER BY EXTRACT(YEAR FROM created_at);

-- Sort by calculated field
SELECT name, price, price * 0.9 AS discounted_price 
FROM products 
ORDER BY price * 0.9 DESC;
```

### Sort with NULL Values

```sql
-- NULL values in sorting
SELECT name, age FROM users ORDER BY age;
-- PostgreSQL: NULLs appear last by default in ASC

-- Control NULL position
SELECT name, age FROM users 
ORDER BY age NULLS FIRST;  -- NULLs at beginning

SELECT name, age FROM users 
ORDER BY age NULLS LAST;   -- NULLs at end
```

### Sort by Column Position

```sql
-- Can use column number (not recommended)
SELECT name, age, city FROM users 
ORDER BY 2;  -- Sort by 2nd column (age)

-- ❌ BAD: Hard to read, breaks if columns change
-- ✅ GOOD: Use column names
SELECT name, age, city FROM users 
ORDER BY age;
```

---

## 📄 LIMIT and OFFSET - Pagination

### LIMIT - Restrict Number of Rows

```sql
-- Syntax
SELECT * FROM table_name 
LIMIT number;

-- Get first 5 users
SELECT * FROM users LIMIT 5;

-- Get top 3 oldest users
SELECT name, age FROM users 
ORDER BY age DESC 
LIMIT 3;

-- Get cheapest product
SELECT name, price FROM products 
ORDER BY price ASC 
LIMIT 1;
```

### OFFSET - Skip Rows

```sql
-- Syntax
SELECT * FROM table_name 
LIMIT number OFFSET number;

-- Skip first 5, get next 5
SELECT * FROM users 
LIMIT 5 OFFSET 5;

-- Skip first 10, get next 10
SELECT * FROM users 
LIMIT 10 OFFSET 10;
```

### Pagination Pattern

```sql
-- Page 1: First 10 items
SELECT * FROM products 
ORDER BY id 
LIMIT 10 OFFSET 0;

-- Page 2: Next 10 items
SELECT * FROM products 
ORDER BY id 
LIMIT 10 OFFSET 10;

-- Page 3: Next 10 items
SELECT * FROM products 
ORDER BY id 
LIMIT 10 OFFSET 20;

-- Formula: OFFSET = (page - 1) * page_size
-- Page 5 with page_size 10: OFFSET = (5-1) * 10 = 40
SELECT * FROM products 
ORDER BY id 
LIMIT 10 OFFSET 40;
```

### Best Practices

```sql
-- ✅ ALWAYS use ORDER BY with LIMIT/OFFSET
-- Without ORDER BY, results are unpredictable!
SELECT * FROM users 
ORDER BY id 
LIMIT 10 OFFSET 0;

-- ❌ BAD: No ORDER BY (non-deterministic)
SELECT * FROM users 
LIMIT 10 OFFSET 0;  -- Might return different rows each time!
```

---

## 🎯 Combining Everything

### Complex Filtering Example

```sql
-- Find active users from Jakarta or Bandung,
-- aged 25-35, with gmail accounts,
-- sorted by age descending,
-- show first 10 results

SELECT 
  id,
  name,
  email,
  age,
  city
FROM users
WHERE 
  is_active = true
  AND city IN ('Jakarta', 'Bandung')
  AND age BETWEEN 25 AND 35
  AND email LIKE '%@gmail.com'
ORDER BY 
  age DESC
LIMIT 10;
```

### E-commerce Query Example

```sql
-- Find available products in Electronics or Computers category,
-- priced between $100-$500,
-- with stock > 0,
-- name contains 'laptop' or 'computer' (case-insensitive),
-- sorted by price (cheapest first),
-- show 20 items per page, page 2

SELECT 
  name,
  category,
  price,
  stock,
  rating
FROM products
WHERE 
  status = 'available'
  AND category IN ('Electronics', 'Computers')
  AND price BETWEEN 100 AND 500
  AND stock > 0
  AND (name ILIKE '%laptop%' OR name ILIKE '%computer%')
ORDER BY 
  price ASC,
  rating DESC
LIMIT 20 OFFSET 20;  -- Page 2
```

---

## 🔥 Common Mistakes & Solutions

### Mistake 1: Forgetting Quotes

```sql
-- ❌ WRONG: No quotes around string
SELECT * FROM users WHERE city = Jakarta;

-- ✅ CORRECT: Use single quotes
SELECT * FROM users WHERE city = 'Jakarta';
```

### Mistake 2: Wrong NULL Comparison

```sql
-- ❌ WRONG: Cannot use = with NULL
SELECT * FROM users WHERE age = NULL;

-- ✅ CORRECT: Use IS NULL
SELECT * FROM users WHERE age IS NULL;
```

### Mistake 3: Case Sensitivity in LIKE

```sql
-- ❌ WRONG: LIKE is case-sensitive
SELECT * FROM users WHERE name LIKE 'john%';  -- Won't match 'John'

-- ✅ CORRECT: Use ILIKE (PostgreSQL)
SELECT * FROM users WHERE name ILIKE 'john%';  -- Matches 'John', 'JOHN'
```

### Mistake 4: Wrong Parentheses

```sql
-- ❌ WRONG: Ambiguous logic
SELECT * FROM users 
WHERE age > 25 AND city = 'Jakarta' OR city = 'Bandung';
-- Is it: (age > 25 AND Jakarta) OR Bandung?
-- Or: age > 25 AND (Jakarta OR Bandung)?

-- ✅ CORRECT: Use parentheses
SELECT * FROM users 
WHERE age > 25 AND (city = 'Jakarta' OR city = 'Bandung');
```

### Mistake 5: LIMIT without ORDER BY

```sql
-- ❌ BAD: Unpredictable results
SELECT * FROM users LIMIT 10;
-- Might return different rows each time!

-- ✅ GOOD: Always use ORDER BY
SELECT * FROM users ORDER BY id LIMIT 10;
```

---

## 💡 Performance Tips

### Use Indexes for Frequently Filtered Columns

```sql
-- Create index on frequently searched columns
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_users_age ON users(age);
CREATE INDEX idx_products_price ON products(price);

-- Now these queries are much faster:
SELECT * FROM users WHERE city = 'Jakarta';
SELECT * FROM users WHERE age > 25;
SELECT * FROM products WHERE price BETWEEN 100 AND 500;
```

### LIKE Performance

```sql
-- ✅ FAST: Leading wildcard
SELECT * FROM users WHERE name LIKE 'John%';  -- Can use index

-- ❌ SLOW: Trailing wildcard
SELECT * FROM users WHERE name LIKE '%John';  -- Cannot use index
SELECT * FROM users WHERE name LIKE '%John%'; -- Cannot use index

-- For full-text search, use:
-- - Full-text search indexes
-- - PostgreSQL's to_tsvector/to_tsquery
-- - External search engines (Elasticsearch)
```

---

## 📝 Practice Exercises

Try these queries yourself:

```sql
-- 1. Find users aged exactly 25 or 30


-- 2. Find users from Jakarta who are NOT active


-- 3. Find users whose names start with 'J' or 'S'


-- 4. Find users aged between 20-30 from Jakarta or Bandung


-- 5. Find users with NULL city, sorted by name


-- 6. Get 5 oldest users


-- 7. Get page 3 of users (10 per page), sorted by id


-- 8. Find users with email ending in @gmail.com or @yahoo.com


-- 9. Find active users over 25, sorted by age descending, city ascending


-- 10. Complex: Find users aged 22-35 from Jakarta/Bandung/Surabaya,
--     with gmail accounts, active status, sorted by age, limit 5
```

---

## 🎯 Summary

**Key Takeaways:**

1. ✅ **WHERE** - Filter rows based on conditions
2. ✅ **AND/OR/NOT** - Combine multiple conditions
3. ✅ **IN** - Check if value in list
4. ✅ **BETWEEN** - Check if value in range (inclusive)
5. ✅ **LIKE/ILIKE** - Pattern matching (%, _)
6. ✅ **IS NULL/IS NOT NULL** - Check for NULL values
7. ✅ **ORDER BY** - Sort results (ASC/DESC)
8. ✅ **LIMIT/OFFSET** - Pagination

**Comparison Operators:**
```
=   Equal
!=  Not equal (<> also works)
>   Greater than
<   Less than
>=  Greater than or equal
<=  Less than or equal
```

**Wildcards:**
```
%   Matches any sequence of characters
_   Matches exactly one character
```

**Query Order:**
```sql
SELECT columns
FROM table
WHERE conditions          -- Filter rows
ORDER BY columns         -- Sort results
LIMIT number OFFSET num  -- Paginate
```

**Next Step:**
👉 Lanjut ke [Materi 09: Grouping Data](./09-grouping-data.md)

---

**Happy Learning! 🚀**
