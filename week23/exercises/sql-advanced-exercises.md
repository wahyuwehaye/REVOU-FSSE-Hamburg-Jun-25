# 🚀 Advanced SQL Exercises

Master complex SQL queries with these 20 exercises covering subqueries, CTEs, window functions, and optimization.

## 🎯 Setup

Use the same `bookstore_db` from SQL Basics, or run this enhanced version:

```sql
-- Add more sample data for advanced queries
INSERT INTO customers (name, email, city) VALUES
('Alice Johnson', 'alice@email.com', 'New York'),
('Bob Smith', 'bob@email.com', 'London'),
('Carol White', 'carol@email.com', 'Tokyo');

INSERT INTO orders (customer_id, order_date, total_amount) VALUES
(1, '2024-01-15', 51.98),
(1, '2024-02-20', 25.99),
(2, '2024-01-18', 15.99),
(3, '2024-03-10', 41.98);

INSERT INTO order_items (order_id, book_id, quantity, price) VALUES
(1, 1, 2, 25.99),
(2, 1, 1, 25.99),
(3, 2, 1, 15.99),
(4, 3, 2, 18.99);
```

---

## 📖 Exercises

### Part 1: Subqueries (1-5)

**Exercise 1:** Find books more expensive than average
<details>
<summary>Solution</summary>

```sql
SELECT title, price
FROM books
WHERE price > (SELECT AVG(price) FROM books);
```
</details>

**Exercise 2:** Find customers who spent more than $50 total
<details>
<summary>Solution</summary>

```sql
SELECT customers.name, SUM(orders.total_amount) as total_spent
FROM customers
JOIN orders ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name
HAVING SUM(orders.total_amount) > 50;
```
</details>

**Exercise 3:** Find the most expensive book per genre
<details>
<summary>Solution</summary>

```sql
SELECT b1.*
FROM books b1
WHERE b1.price = (
  SELECT MAX(b2.price)
  FROM books b2
  WHERE b2.genre = b1.genre
);
```
</details>

**Exercise 4:** Find authors with more books than average
<details>
<summary>Solution</summary>

```sql
SELECT authors.name, COUNT(books.id) as book_count
FROM authors
JOIN books ON authors.id = books.author_id
GROUP BY authors.id, authors.name
HAVING COUNT(books.id) > (
  SELECT AVG(book_count)
  FROM (
    SELECT COUNT(*) as book_count
    FROM books
    GROUP BY author_id
  ) sub
);
```
</details>

**Exercise 5:** Find customers who ordered the same book more than once
<details>
<summary>Solution</summary>

```sql
SELECT 
  customers.name,
  books.title,
  COUNT(DISTINCT orders.id) as order_count
FROM customers
JOIN orders ON customers.id = orders.customer_id
JOIN order_items ON orders.id = order_items.order_id
JOIN books ON order_items.book_id = books.id
GROUP BY customers.id, customers.name, books.id, books.title
HAVING COUNT(DISTINCT orders.id) > 1;
```
</details>

---

### Part 2: CTEs (Common Table Expressions) (6-10)

**Exercise 6:** Use CTE to calculate average order value
<details>
<summary>Solution</summary>

```sql
WITH order_stats AS (
  SELECT 
    customer_id,
    AVG(total_amount) as avg_order_value,
    COUNT(*) as order_count
  FROM orders
  GROUP BY customer_id
)
SELECT 
  customers.name,
  order_stats.avg_order_value,
  order_stats.order_count
FROM customers
JOIN order_stats ON customers.id = order_stats.customer_id;
```
</details>

**Exercise 7:** Recursive CTE for category hierarchy (if you have categories table)
<details>
<summary>Solution</summary>

```sql
-- First create a categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  parent_id INTEGER REFERENCES categories(id)
);

-- Recursive query
WITH RECURSIVE category_tree AS (
  -- Base case: root categories
  SELECT id, name, parent_id, 0 as level
  FROM categories
  WHERE parent_id IS NULL
  
  UNION ALL
  
  -- Recursive case
  SELECT c.id, c.name, c.parent_id, ct.level + 1
  FROM categories c
  JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree;
```
</details>

**Exercise 8:** Find top 3 customers by total spending
<details>
<summary>Solution</summary>

```sql
WITH customer_spending AS (
  SELECT 
    customer_id,
    SUM(total_amount) as total_spent
  FROM orders
  GROUP BY customer_id
)
SELECT 
  customers.name,
  customer_spending.total_spent
FROM customers
JOIN customer_spending ON customers.id = customer_spending.customer_id
ORDER BY customer_spending.total_spent DESC
LIMIT 3;
```
</details>

**Exercise 9:** Calculate running total of orders by date
<details>
<summary>Solution</summary>

```sql
WITH daily_orders AS (
  SELECT 
    order_date,
    SUM(total_amount) as daily_total
  FROM orders
  GROUP BY order_date
)
SELECT 
  order_date,
  daily_total,
  SUM(daily_total) OVER (ORDER BY order_date) as running_total
FROM daily_orders;
```
</details>

**Exercise 10:** Find month-over-month growth
<details>
<summary>Solution</summary>

```sql
WITH monthly_sales AS (
  SELECT 
    DATE_TRUNC('month', order_date) as month,
    SUM(total_amount) as total_sales
  FROM orders
  GROUP BY DATE_TRUNC('month', order_date)
)
SELECT 
  month,
  total_sales,
  LAG(total_sales) OVER (ORDER BY month) as prev_month_sales,
  total_sales - LAG(total_sales) OVER (ORDER BY month) as growth
FROM monthly_sales;
```
</details>

---

### Part 3: Window Functions (11-15)

**Exercise 11:** Rank books by price within each genre
<details>
<summary>Solution</summary>

```sql
SELECT 
  title,
  genre,
  price,
  RANK() OVER (PARTITION BY genre ORDER BY price DESC) as price_rank
FROM books;
```
</details>

**Exercise 12:** Calculate percentage of total sales per customer
<details>
<summary>Solution</summary>

```sql
SELECT 
  customers.name,
  SUM(orders.total_amount) as customer_total,
  ROUND(
    100.0 * SUM(orders.total_amount) / SUM(SUM(orders.total_amount)) OVER (),
    2
  ) as percentage_of_total
FROM customers
JOIN orders ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```
</details>

**Exercise 13:** Find customers who made consecutive orders
<details>
<summary>Solution</summary>

```sql
WITH order_sequences AS (
  SELECT 
    customer_id,
    order_date,
    LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) as prev_order_date
  FROM orders
)
SELECT DISTINCT customer_id
FROM order_sequences
WHERE order_date - prev_order_date <= 30; -- within 30 days
```
</details>

**Exercise 14:** Calculate moving average of order amounts
<details>
<summary>Solution</summary>

```sql
SELECT 
  order_date,
  total_amount,
  AVG(total_amount) OVER (
    ORDER BY order_date 
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) as moving_avg_3orders
FROM orders
ORDER BY order_date;
```
</details>

**Exercise 15:** Find books with stock below average in their genre
<details>
<summary>Solution</summary>

```sql
SELECT 
  title,
  genre,
  stock,
  AVG(stock) OVER (PARTITION BY genre) as avg_genre_stock
FROM books
WHERE stock < (
  SELECT AVG(stock)
  FROM books b2
  WHERE b2.genre = books.genre
);
```
</details>

---

### Part 4: Query Optimization (16-20)

**Exercise 16:** Create indexes for common queries
<details>
<summary>Solution</summary>

```sql
-- Index for looking up books by genre
CREATE INDEX idx_books_genre ON books(genre);

-- Index for customer email lookups
CREATE INDEX idx_customers_email ON customers(email);

-- Composite index for order queries
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);

-- Index for JOIN operations
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_book_id ON order_items(book_id);
```
</details>

**Exercise 17:** Analyze query performance with EXPLAIN
<details>
<summary>Solution</summary>

```sql
EXPLAIN ANALYZE
SELECT 
  customers.name,
  COUNT(orders.id) as order_count,
  SUM(orders.total_amount) as total_spent
FROM customers
JOIN orders ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```
</details>

**Exercise 18:** Optimize slow query with EXISTS instead of IN
<details>
<summary>Solution</summary>

```sql
-- Slow: using IN with subquery
SELECT * FROM customers
WHERE id IN (SELECT customer_id FROM orders);

-- Optimized: using EXISTS
SELECT * FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);
```
</details>

**Exercise 19:** Use materialized view for complex reporting
<details>
<summary>Solution</summary>

```sql
-- Create materialized view
CREATE MATERIALIZED VIEW customer_stats AS
SELECT 
  customers.id,
  customers.name,
  COUNT(orders.id) as order_count,
  SUM(orders.total_amount) as total_spent,
  AVG(orders.total_amount) as avg_order_value
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;

-- Query the view (much faster)
SELECT * FROM customer_stats WHERE order_count > 5;

-- Refresh when data changes
REFRESH MATERIALIZED VIEW customer_stats;
```
</details>

**Exercise 20:** Complex analytical query (sales report)
<details>
<summary>Solution</summary>

```sql
WITH monthly_metrics AS (
  SELECT 
    DATE_TRUNC('month', order_date) as month,
    COUNT(DISTINCT customer_id) as unique_customers,
    COUNT(*) as total_orders,
    SUM(total_amount) as revenue,
    AVG(total_amount) as avg_order_value
  FROM orders
  GROUP BY DATE_TRUNC('month', order_date)
),
ranked_metrics AS (
  SELECT 
    month,
    unique_customers,
    total_orders,
    revenue,
    avg_order_value,
    LAG(revenue) OVER (ORDER BY month) as prev_month_revenue,
    RANK() OVER (ORDER BY revenue DESC) as revenue_rank
  FROM monthly_metrics
)
SELECT 
  TO_CHAR(month, 'YYYY-MM') as month,
  unique_customers,
  total_orders,
  ROUND(revenue, 2) as revenue,
  ROUND(avg_order_value, 2) as avg_order_value,
  ROUND(
    100.0 * (revenue - prev_month_revenue) / NULLIF(prev_month_revenue, 0),
    2
  ) as growth_percentage,
  revenue_rank
FROM ranked_metrics
ORDER BY month;
```
</details>

---

## 🎓 Key Concepts Covered

- **Subqueries:** Nested SELECT statements
- **CTEs:** Readable, reusable query components
- **Window Functions:** RANK, ROW_NUMBER, LAG, LEAD, SUM OVER
- **Indexes:** B-tree, composite indexes for performance
- **Query Plans:** EXPLAIN ANALYZE
- **Materialized Views:** Pre-computed results
- **Advanced JOINs:** LATERAL, self-joins
- **Date Functions:** DATE_TRUNC, date arithmetic

**These advanced techniques are essential for production databases!**
