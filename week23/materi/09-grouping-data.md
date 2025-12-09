# 📊 Grouping Data with GROUP BY

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Memahami konsep grouping dalam SQL
- ✅ Menggunakan GROUP BY untuk agregasi data
- ✅ Menggabungkan aggregate functions dengan GROUP BY
- ✅ Filtering grouped data dengan HAVING
- ✅ Grouping dengan multiple columns
- ✅ Membedakan WHERE vs HAVING
- ✅ Menulis queries untuk analytics dan reporting

---

## 🎯 What is GROUP BY?

### Konsep Dasar

**GROUP BY** mengelompokkan rows yang memiliki nilai sama menjadi summary rows.

**Analogi:** 
Bayangkan kamu punya tumpukan buku. GROUP BY seperti memisahkan buku berdasarkan kategori (Novel, Komik, Textbook), lalu menghitung berapa buku di setiap kategori.

### Syntax

```sql
SELECT column(s), aggregate_function(column)
FROM table_name
WHERE conditions           -- Filter BEFORE grouping
GROUP BY column(s)
HAVING aggregate_condition -- Filter AFTER grouping
ORDER BY column(s);
```

---

## 📚 Sample Data

Mari gunakan sample data ini untuk semua contoh:

### Sales Table

```sql
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(100),
  category VARCHAR(50),
  price DECIMAL(10,2),
  quantity INTEGER,
  sale_date DATE,
  region VARCHAR(50)
);

INSERT INTO sales 
  (product_name, category, price, quantity, sale_date, region)
VALUES
  ('Laptop Pro', 'Electronics', 1200.00, 2, '2024-01-15', 'Jakarta'),
  ('Mouse', 'Electronics', 25.00, 5, '2024-01-16', 'Jakarta'),
  ('Desk Chair', 'Furniture', 150.00, 3, '2024-01-17', 'Bandung'),
  ('Laptop Pro', 'Electronics', 1200.00, 1, '2024-01-18', 'Surabaya'),
  ('Office Desk', 'Furniture', 300.00, 2, '2024-01-19', 'Jakarta'),
  ('Keyboard', 'Electronics', 50.00, 4, '2024-01-20', 'Bandung'),
  ('Desk Chair', 'Furniture', 150.00, 2, '2024-01-21', 'Jakarta');
```

### Data View

```
┌────┬──────────────┬─────────────┬─────────┬──────────┬────────────┬───────────┐
│ id │ product_name │ category    │ price   │ quantity │ sale_date  │ region    │
├────┼──────────────┼─────────────┼─────────┼──────────┼────────────┼───────────┤
│ 1  │ Laptop Pro   │ Electronics │ 1200.00 │ 2        │ 2024-01-15 │ Jakarta   │
│ 2  │ Mouse        │ Electronics │ 25.00   │ 5        │ 2024-01-16 │ Jakarta   │
│ 3  │ Desk Chair   │ Furniture   │ 150.00  │ 3        │ 2024-01-17 │ Bandung   │
│ 4  │ Laptop Pro   │ Electronics │ 1200.00 │ 1        │ 2024-01-18 │ Surabaya  │
│ 5  │ Office Desk  │ Furniture   │ 300.00  │ 2        │ 2024-01-19 │ Jakarta   │
│ 6  │ Keyboard     │ Electronics │ 50.00   │ 4        │ 2024-01-20 │ Bandung   │
│ 7  │ Desk Chair   │ Furniture   │ 150.00  │ 2        │ 2024-01-21 │ Jakarta   │
└────┴──────────────┴─────────────┴─────────┴──────────┴────────────┴───────────┘
```

---

## 📊 Basic GROUP BY

### Group by Single Column

```sql
-- Count sales by category
SELECT 
  category,
  COUNT(*) AS total_sales
FROM sales
GROUP BY category;
```

**Result:**
```
┌─────────────┬─────────────┐
│ category    │ total_sales │
├─────────────┼─────────────┤
│ Electronics │ 4           │
│ Furniture   │ 3           │
└─────────────┴─────────────┘
```

**How it works:**
1. Semua rows dengan `category = 'Electronics'` digabung jadi 1 group
2. Semua rows dengan `category = 'Furniture'` digabung jadi 1 group
3. COUNT(*) menghitung jumlah rows di setiap group

### Group by Region

```sql
-- Count sales by region
SELECT 
  region,
  COUNT(*) AS total_sales
FROM sales
GROUP BY region;
```

**Result:**
```
┌───────────┬─────────────┐
│ region    │ total_sales │
├───────────┼─────────────┤
│ Jakarta   │ 4           │
│ Bandung   │ 2           │
│ Surabaya  │ 1           │
└───────────┴─────────────┘
```

---

## 🔢 Aggregate Functions with GROUP BY

### COUNT - Count Rows

```sql
-- Total sales per category
SELECT 
  category,
  COUNT(*) AS number_of_sales
FROM sales
GROUP BY category;
```

### SUM - Total Values

```sql
-- Total quantity sold per category
SELECT 
  category,
  SUM(quantity) AS total_quantity_sold
FROM sales
GROUP BY category;
```

**Result:**
```
┌─────────────┬─────────────────────┐
│ category    │ total_quantity_sold │
├─────────────┼─────────────────────┤
│ Electronics │ 12                  │  (2+5+1+4)
│ Furniture   │ 7                   │  (3+2+2)
└─────────────┴─────────────────────┘
```

### AVG - Average Values

```sql
-- Average price per category
SELECT 
  category,
  AVG(price) AS average_price
FROM sales
GROUP BY category;
```

**Result:**
```
┌─────────────┬───────────────┐
│ category    │ average_price │
├─────────────┼───────────────┤
│ Electronics │ 618.75        │  (1200+25+1200+50)/4
│ Furniture   │ 200.00        │  (150+300+150)/3
└─────────────┴───────────────┘
```

### MIN & MAX - Minimum & Maximum

```sql
-- Price range per category
SELECT 
  category,
  MIN(price) AS min_price,
  MAX(price) AS max_price
FROM sales
GROUP BY category;
```

**Result:**
```
┌─────────────┬───────────┬───────────┐
│ category    │ min_price │ max_price │
├─────────────┼───────────┼───────────┤
│ Electronics │ 25.00     │ 1200.00   │
│ Furniture   │ 150.00    │ 300.00    │
└─────────────┴───────────┴───────────┘
```

---

## 🎯 Multiple Aggregate Functions

You can use multiple aggregate functions in one query!

```sql
-- Complete statistics per category
SELECT 
  category,
  COUNT(*) AS number_of_sales,
  SUM(quantity) AS total_quantity,
  AVG(price) AS avg_price,
  MIN(price) AS min_price,
  MAX(price) AS max_price,
  SUM(price * quantity) AS total_revenue
FROM sales
GROUP BY category;
```

**Result:**
```
┌─────────────┬─────────────────┬────────────────┬───────────┬───────────┬───────────┬───────────────┐
│ category    │ number_of_sales │ total_quantity │ avg_price │ min_price │ max_price │ total_revenue │
├─────────────┼─────────────────┼────────────────┼───────────┼───────────┼───────────┼───────────────┤
│ Electronics │ 4               │ 12             │ 618.75    │ 25.00     │ 1200.00   │ 2725.00       │
│ Furniture   │ 3               │ 7              │ 200.00    │ 150.00    │ 300.00    │ 1050.00       │
└─────────────┴─────────────────┴────────────────┴───────────┴───────────┴───────────┴───────────────┘
```

---

## 📊 GROUP BY Multiple Columns

### Grouping by Two Columns

```sql
-- Sales statistics by category AND region
SELECT 
  category,
  region,
  COUNT(*) AS sales_count,
  SUM(quantity) AS total_quantity
FROM sales
GROUP BY category, region
ORDER BY category, region;
```

**Result:**
```
┌─────────────┬───────────┬─────────────┬────────────────┐
│ category    │ region    │ sales_count │ total_quantity │
├─────────────┼───────────┼─────────────┼────────────────┤
│ Electronics │ Bandung   │ 1           │ 4              │
│ Electronics │ Jakarta   │ 2           │ 7              │
│ Electronics │ Surabaya  │ 1           │ 1              │
│ Furniture   │ Bandung   │ 1           │ 3              │
│ Furniture   │ Jakarta   │ 2           │ 4              │
└─────────────┴───────────┴─────────────┴────────────────┘
```

**Explanation:**
- Data dikelompokkan berdasarkan KOMBINASI category + region
- Electronics di Bandung = 1 group
- Electronics di Jakarta = 1 group (berbeda dari Bandung!)
- dst...

### Real-World Example: Monthly Revenue by Product

```sql
-- Monthly revenue per product
SELECT 
  product_name,
  EXTRACT(YEAR FROM sale_date) AS year,
  EXTRACT(MONTH FROM sale_date) AS month,
  COUNT(*) AS sales_count,
  SUM(price * quantity) AS monthly_revenue
FROM sales
GROUP BY 
  product_name, 
  EXTRACT(YEAR FROM sale_date),
  EXTRACT(MONTH FROM sale_date)
ORDER BY year, month, product_name;
```

---

## 🔍 WHERE vs HAVING

### Key Differences

```
WHERE  → Filters rows BEFORE grouping
HAVING → Filters groups AFTER grouping
```

### WHERE - Filter Before Grouping

```sql
-- Sales statistics for Electronics category only
SELECT 
  region,
  COUNT(*) AS sales_count,
  SUM(quantity) AS total_quantity
FROM sales
WHERE category = 'Electronics'  -- ← Filter BEFORE grouping
GROUP BY region;
```

**Process:**
1. Filter: Keep only Electronics rows
2. Group: Group by region
3. Aggregate: Count and sum

**Result:**
```
┌───────────┬─────────────┬────────────────┐
│ region    │ sales_count │ total_quantity │
├───────────┼─────────────┼────────────────┤
│ Bandung   │ 1           │ 4              │
│ Jakarta   │ 2           │ 7              │
│ Surabaya  │ 1           │ 1              │
└───────────┴─────────────┴────────────────┘
```

### HAVING - Filter After Grouping

```sql
-- Regions with more than 2 sales
SELECT 
  region,
  COUNT(*) AS sales_count
FROM sales
GROUP BY region
HAVING COUNT(*) > 2;  -- ← Filter AFTER grouping
```

**Process:**
1. Group: Group by region
2. Aggregate: Count sales
3. Filter: Keep only groups with count > 2

**Result:**
```
┌─────────┬─────────────┐
│ region  │ sales_count │
├─────────┼─────────────┤
│ Jakarta │ 4           │
└─────────┴─────────────┘
```

### Combining WHERE and HAVING

```sql
-- Electronics sales by region, 
-- only for regions with total quantity > 2
SELECT 
  region,
  COUNT(*) AS sales_count,
  SUM(quantity) AS total_quantity
FROM sales
WHERE category = 'Electronics'    -- Filter rows first
GROUP BY region
HAVING SUM(quantity) > 2          -- Then filter groups
ORDER BY total_quantity DESC;
```

**Process:**
1. WHERE: Filter to Electronics only
2. GROUP BY: Group by region
3. HAVING: Keep only groups with total_quantity > 2
4. ORDER BY: Sort results

**Result:**
```
┌─────────┬─────────────┬────────────────┐
│ region  │ sales_count │ total_quantity │
├─────────┼─────────────┼────────────────┤
│ Jakarta │ 2           │ 7              │
│ Bandung │ 1           │ 4              │
└─────────┴─────────────┴────────────────┘
```

---

## 💡 Common Use Cases

### 1. Sales Report by Month

```sql
-- Monthly sales summary for 2024
SELECT 
  EXTRACT(MONTH FROM sale_date) AS month,
  TO_CHAR(sale_date, 'Month') AS month_name,
  COUNT(*) AS total_sales,
  SUM(quantity) AS items_sold,
  SUM(price * quantity) AS revenue
FROM sales
WHERE EXTRACT(YEAR FROM sale_date) = 2024
GROUP BY 
  EXTRACT(MONTH FROM sale_date),
  TO_CHAR(sale_date, 'Month')
ORDER BY month;
```

### 2. Top Selling Products

```sql
-- Top 5 products by quantity sold
SELECT 
  product_name,
  SUM(quantity) AS total_quantity_sold,
  COUNT(*) AS times_sold,
  SUM(price * quantity) AS total_revenue
FROM sales
GROUP BY product_name
ORDER BY total_quantity_sold DESC
LIMIT 5;
```

### 3. Regional Performance

```sql
-- Best performing regions
SELECT 
  region,
  COUNT(DISTINCT product_name) AS unique_products,
  COUNT(*) AS total_sales,
  SUM(quantity) AS items_sold,
  SUM(price * quantity) AS revenue,
  AVG(price * quantity) AS avg_sale_value
FROM sales
GROUP BY region
HAVING SUM(price * quantity) > 500  -- Revenue > $500
ORDER BY revenue DESC;
```

### 4. Category Analysis

```sql
-- Category performance with percentage
SELECT 
  category,
  COUNT(*) AS sales_count,
  SUM(price * quantity) AS revenue,
  ROUND(
    100.0 * SUM(price * quantity) / 
    (SELECT SUM(price * quantity) FROM sales),
    2
  ) AS revenue_percentage
FROM sales
GROUP BY category
ORDER BY revenue DESC;
```

### 5. Product Pricing Analysis

```sql
-- Products sold at different prices (price variations)
SELECT 
  product_name,
  COUNT(DISTINCT price) AS price_variations,
  MIN(price) AS lowest_price,
  MAX(price) AS highest_price,
  AVG(price) AS average_price
FROM sales
GROUP BY product_name
HAVING COUNT(DISTINCT price) > 1;  -- Only products with price changes
```

---

## 🎯 Advanced GROUP BY Techniques

### GROUP BY with CASE

```sql
-- Categorize sales as Small/Medium/Large
SELECT 
  CASE 
    WHEN price * quantity < 100 THEN 'Small'
    WHEN price * quantity < 500 THEN 'Medium'
    ELSE 'Large'
  END AS sale_size,
  COUNT(*) AS count,
  SUM(price * quantity) AS total_revenue
FROM sales
GROUP BY 
  CASE 
    WHEN price * quantity < 100 THEN 'Small'
    WHEN price * quantity < 500 THEN 'Medium'
    ELSE 'Large'
  END
ORDER BY 
  CASE sale_size
    WHEN 'Small' THEN 1
    WHEN 'Medium' THEN 2
    WHEN 'Large' THEN 3
  END;
```

### GROUP BY with Date Functions

```sql
-- Sales by day of week
SELECT 
  TO_CHAR(sale_date, 'Day') AS day_name,
  EXTRACT(DOW FROM sale_date) AS day_number,  -- 0=Sunday, 6=Saturday
  COUNT(*) AS sales_count,
  SUM(price * quantity) AS revenue
FROM sales
GROUP BY 
  TO_CHAR(sale_date, 'Day'),
  EXTRACT(DOW FROM sale_date)
ORDER BY day_number;
```

### GROUP BY with COALESCE

```sql
-- Handle NULL values in grouping
SELECT 
  COALESCE(region, 'Unknown') AS region,
  COUNT(*) AS sales_count
FROM sales
GROUP BY COALESCE(region, 'Unknown');
```

---

## 🔥 Common Mistakes & Solutions

### Mistake 1: Non-Aggregated Column in SELECT

```sql
-- ❌ WRONG: product_name not in GROUP BY
SELECT 
  category,
  product_name,    -- ← Error! Which product_name?
  COUNT(*) AS sales_count
FROM sales
GROUP BY category;

-- ✅ CORRECT: Include all non-aggregated columns in GROUP BY
SELECT 
  category,
  product_name,
  COUNT(*) AS sales_count
FROM sales
GROUP BY category, product_name;
```

**Why?** 
Ketika group by category, ada banyak product_name per category. SQL tidak tahu mana yang harus ditampilkan!

### Mistake 2: Using WHERE with Aggregate Functions

```sql
-- ❌ WRONG: Cannot use WHERE with aggregate
SELECT 
  category,
  COUNT(*) AS sales_count
FROM sales
WHERE COUNT(*) > 2  -- ← Error!
GROUP BY category;

-- ✅ CORRECT: Use HAVING for aggregate conditions
SELECT 
  category,
  COUNT(*) AS sales_count
FROM sales
GROUP BY category
HAVING COUNT(*) > 2;
```

### Mistake 3: Wrong ORDER BY Column

```sql
-- ❌ WRONG: Cannot ORDER BY column not in SELECT or GROUP BY
SELECT 
  category,
  COUNT(*) AS sales_count
FROM sales
GROUP BY category
ORDER BY product_name;  -- ← Error! Which product_name?

-- ✅ CORRECT: Order by aggregated or grouped columns
SELECT 
  category,
  COUNT(*) AS sales_count
FROM sales
GROUP BY category
ORDER BY sales_count DESC;
```

### Mistake 4: Forgetting GROUP BY

```sql
-- ❌ WRONG: Mixing aggregate and non-aggregate without GROUP BY
SELECT 
  category,
  COUNT(*) AS sales_count
FROM sales;
-- Error: column "category" must appear in GROUP BY

-- ✅ CORRECT: Add GROUP BY
SELECT 
  category,
  COUNT(*) AS sales_count
FROM sales
GROUP BY category;
```

---

## 📊 Query Execution Order

**Understanding the order helps write correct queries:**

```
1. FROM       → Get data from tables
2. WHERE      → Filter individual rows
3. GROUP BY   → Group rows
4. HAVING     → Filter groups
5. SELECT     → Select columns/aggregates
6. ORDER BY   → Sort results
7. LIMIT      → Limit number of rows
```

**Example:**
```sql
SELECT 
  region,                        -- 5. Select these columns
  COUNT(*) AS sales_count
FROM sales                       -- 1. From this table
WHERE category = 'Electronics'   -- 2. Filter rows
GROUP BY region                  -- 3. Group by region
HAVING COUNT(*) > 1              -- 4. Filter groups
ORDER BY sales_count DESC        -- 6. Sort results
LIMIT 3;                         -- 7. Top 3 only
```

---

## 💡 Performance Tips

### Use Indexes on Grouped Columns

```sql
-- Create indexes for better GROUP BY performance
CREATE INDEX idx_sales_category ON sales(category);
CREATE INDEX idx_sales_region ON sales(region);
CREATE INDEX idx_sales_date ON sales(sale_date);

-- Now these queries are faster:
SELECT category, COUNT(*) FROM sales GROUP BY category;
SELECT region, COUNT(*) FROM sales GROUP BY region;
```

### Filter Before Grouping

```sql
-- ✅ EFFICIENT: Filter with WHERE (before grouping)
SELECT 
  category,
  COUNT(*) AS sales_count
FROM sales
WHERE sale_date >= '2024-01-01'  -- Filter first
GROUP BY category;

-- ❌ LESS EFFICIENT: Group all, then filter
SELECT 
  category,
  COUNT(*) AS sales_count
FROM sales
GROUP BY category
HAVING MIN(sale_date) >= '2024-01-01';  -- Group all first, then filter
```

### Avoid Complex Calculations in GROUP BY

```sql
-- ❌ SLOW: Complex calculation in GROUP BY
SELECT 
  UPPER(TRIM(SUBSTRING(product_name, 1, 10))),
  COUNT(*)
FROM sales
GROUP BY UPPER(TRIM(SUBSTRING(product_name, 1, 10)));

-- ✅ FASTER: Use computed column or materialized view
ALTER TABLE sales ADD COLUMN product_short VARCHAR(10);
UPDATE sales SET product_short = UPPER(TRIM(SUBSTRING(product_name, 1, 10)));
CREATE INDEX idx_product_short ON sales(product_short);

SELECT product_short, COUNT(*)
FROM sales
GROUP BY product_short;
```

---

## 📝 Practice Exercises

Using the `sales` table, try these queries:

### Exercise 1: Basic Grouping
```sql
-- Count how many products are in each category


-- Find total revenue per region


-- Calculate average price per category
```

### Exercise 2: Multiple Aggregates
```sql
-- For each region, show:
-- - Number of sales
-- - Total quantity sold
-- - Total revenue
-- - Average sale value


```

### Exercise 3: GROUP BY Multiple Columns
```sql
-- Show sales statistics by category AND region
-- Include: count, total quantity, total revenue


```

### Exercise 4: HAVING Clause
```sql
-- Find regions with total revenue > $1000


-- Find products sold more than 2 times


```

### Exercise 5: Advanced
```sql
-- Find top 3 categories by revenue
-- Show only categories with more than 2 sales


-- Calculate revenue percentage for each category
-- compared to total revenue


```

---

## 🎯 Summary

**Key Concepts:**

1. ✅ **GROUP BY** - Groups rows with same values
2. ✅ **Aggregate Functions** - COUNT, SUM, AVG, MIN, MAX
3. ✅ **Multiple Columns** - Can group by multiple columns
4. ✅ **WHERE** - Filters BEFORE grouping
5. ✅ **HAVING** - Filters AFTER grouping
6. ✅ **ORDER BY** - Can order by aggregated values

**Query Structure:**
```sql
SELECT 
  column,
  aggregate_function(column)
FROM table
WHERE condition              -- Filter rows (optional)
GROUP BY column(s)
HAVING aggregate_condition   -- Filter groups (optional)
ORDER BY column
LIMIT number;
```

**Common Aggregate Functions:**
```sql
COUNT(*)           -- Count all rows
COUNT(column)      -- Count non-NULL values
SUM(column)        -- Sum values
AVG(column)        -- Average
MIN(column)        -- Minimum
MAX(column)        -- Maximum
```

**WHERE vs HAVING:**
```
WHERE  → Filter individual rows BEFORE grouping
HAVING → Filter groups AFTER grouping
```

**Next Step:**
👉 Lanjut ke [Materi 10: Inserting, Updating & Deleting Data](./10-inserting-updating-data.md)

---

**Happy Learning! 🚀**
