# 📚 SQL Basics Exercises

Practice fundamental SQL operations with these 30 exercises.

## 🎯 Setup

```sql
-- Run this first to create sample database
CREATE DATABASE bookstore_db;
\c bookstore_db;

-- Authors table
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  country VARCHAR(100),
  birth_year INTEGER
);

-- Books table
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id INTEGER REFERENCES authors(id),
  price DECIMAL(10,2),
  published_year INTEGER,
  genre VARCHAR(100),
  stock INTEGER DEFAULT 0
);

-- Customers table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) UNIQUE,
  city VARCHAR(100),
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  order_date DATE DEFAULT CURRENT_DATE,
  total_amount DECIMAL(10,2)
);

-- Order items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  book_id INTEGER REFERENCES books(id),
  quantity INTEGER,
  price DECIMAL(10,2)
);

-- Insert sample data
INSERT INTO authors (name, country, birth_year) VALUES
('J.K. Rowling', 'UK', 1965),
('George Orwell', 'UK', 1903),
('Haruki Murakami', 'Japan', 1949),
('Gabriel García Márquez', 'Colombia', 1927);

INSERT INTO books (title, author_id, price, published_year, genre, stock) VALUES
('Harry Potter', 1, 25.99, 1997, 'Fantasy', 50),
('1984', 2, 15.99, 1949, 'Dystopian', 30),
('Norwegian Wood', 3, 18.99, 1987, 'Fiction', 20),
('One Hundred Years of Solitude', 4, 22.99, 1967, 'Magical Realism', 15);
```

---

## 📖 Exercises

### Part 1: SELECT Basics (1-10)

**Exercise 1:** Select all books
<details>
<summary>Solution</summary>

```sql
SELECT * FROM books;
```
</details>

**Exercise 2:** Select only title and price from books
<details>
<summary>Solution</summary>

```sql
SELECT title, price FROM books;
```
</details>

**Exercise 3:** Find all books with price less than $20
<details>
<summary>Solution</summary>

```sql
SELECT * FROM books WHERE price < 20;
```
</details>

**Exercise 4:** Find books published after 1980
<details>
<summary>Solution</summary>

```sql
SELECT * FROM books WHERE published_year > 1980;
```
</details>

**Exercise 5:** Find all Fantasy genre books
<details>
<summary>Solution</summary>

```sql
SELECT * FROM books WHERE genre = 'Fantasy';
```
</details>

**Exercise 6:** Find books with stock between 20 and 40
<details>
<summary>Solution</summary>

```sql
SELECT * FROM books WHERE stock BETWEEN 20 AND 40;
```
</details>

**Exercise 7:** Find books with title containing "Harry"
<details>
<summary>Solution</summary>

```sql
SELECT * FROM books WHERE title LIKE '%Harry%';
```
</details>

**Exercise 8:** Find authors from UK or Japan
<details>
<summary>Solution</summary>

```sql
SELECT * FROM authors WHERE country IN ('UK', 'Japan');
```
</details>

**Exercise 9:** Find books sorted by price (descending)
<details>
<summary>Solution</summary>

```sql
SELECT * FROM books ORDER BY price DESC;
```
</details>

**Exercise 10:** Find top 3 most expensive books
<details>
<summary>Solution</summary>

```sql
SELECT * FROM books ORDER BY price DESC LIMIT 3;
```
</details>

---

### Part 2: Aggregate Functions (11-20)

**Exercise 11:** Count total number of books
<details>
<summary>Solution</summary>

```sql
SELECT COUNT(*) as total_books FROM books;
```
</details>

**Exercise 12:** Calculate average book price
<details>
<summary>Solution</summary>

```sql
SELECT AVG(price) as average_price FROM books;
```
</details>

**Exercise 13:** Find the highest book price
<details>
<summary>Solution</summary>

```sql
SELECT MAX(price) as max_price FROM books;
```
</details>

**Exercise 14:** Calculate total stock quantity
<details>
<summary>Solution</summary>

```sql
SELECT SUM(stock) as total_stock FROM books;
```
</details>

**Exercise 15:** Count books by genre
<details>
<summary>Solution</summary>

```sql
SELECT genre, COUNT(*) as book_count 
FROM books 
GROUP BY genre;
```
</details>

**Exercise 16:** Calculate average price by genre
<details>
<summary>Solution</summary>

```sql
SELECT genre, AVG(price) as avg_price 
FROM books 
GROUP BY genre;
```
</details>

**Exercise 17:** Find genres with more than 1 book
<details>
<summary>Solution</summary>

```sql
SELECT genre, COUNT(*) as book_count 
FROM books 
GROUP BY genre 
HAVING COUNT(*) > 1;
```
</details>

**Exercise 18:** Count books per author
<details>
<summary>Solution</summary>

```sql
SELECT author_id, COUNT(*) as book_count 
FROM books 
GROUP BY author_id;
```
</details>

**Exercise 19:** Find total stock value per genre
<details>
<summary>Solution</summary>

```sql
SELECT genre, SUM(price * stock) as total_value 
FROM books 
GROUP BY genre;
```
</details>

**Exercise 20:** Find oldest and newest published years
<details>
<summary>Solution</summary>

```sql
SELECT 
  MIN(published_year) as oldest,
  MAX(published_year) as newest 
FROM books;
```
</details>

---

### Part 3: JOINs (21-30)

**Exercise 21:** List books with author names
<details>
<summary>Solution</summary>

```sql
SELECT books.title, authors.name as author_name
FROM books
JOIN authors ON books.author_id = authors.id;
```
</details>

**Exercise 22:** Find all books by J.K. Rowling
<details>
<summary>Solution</summary>

```sql
SELECT books.*
FROM books
JOIN authors ON books.author_id = authors.id
WHERE authors.name = 'J.K. Rowling';
```
</details>

**Exercise 23:** Count books per author with author name
<details>
<summary>Solution</summary>

```sql
SELECT authors.name, COUNT(books.id) as book_count
FROM authors
LEFT JOIN books ON authors.id = books.author_id
GROUP BY authors.name;
```
</details>

**Exercise 24:** Find orders with customer names
<details>
<summary>Solution</summary>

```sql
SELECT orders.id, customers.name, orders.total_amount
FROM orders
JOIN customers ON orders.customer_id = customers.id;
```
</details>

**Exercise 25:** List order items with book titles
<details>
<summary>Solution</summary>

```sql
SELECT 
  order_items.order_id,
  books.title,
  order_items.quantity,
  order_items.price
FROM order_items
JOIN books ON order_items.book_id = books.id;
```
</details>

**Exercise 26:** Find total books sold per genre
<details>
<summary>Solution</summary>

```sql
SELECT books.genre, SUM(order_items.quantity) as total_sold
FROM order_items
JOIN books ON order_items.book_id = books.id
GROUP BY books.genre;
```
</details>

**Exercise 27:** Find customers who never ordered
<details>
<summary>Solution</summary>

```sql
SELECT customers.*
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id
WHERE orders.id IS NULL;
```
</details>

**Exercise 28:** Calculate total revenue per author
<details>
<summary>Solution</summary>

```sql
SELECT 
  authors.name,
  SUM(order_items.quantity * order_items.price) as total_revenue
FROM authors
JOIN books ON authors.id = books.author_id
JOIN order_items ON books.id = order_items.book_id
GROUP BY authors.name;
```
</details>

**Exercise 29:** Find books never ordered
<details>
<summary>Solution</summary>

```sql
SELECT books.*
FROM books
LEFT JOIN order_items ON books.id = order_items.book_id
WHERE order_items.id IS NULL;
```
</details>

**Exercise 30:** Complete order details (customer, books, quantities)
<details>
<summary>Solution</summary>

```sql
SELECT 
  orders.id as order_id,
  customers.name as customer_name,
  books.title as book_title,
  order_items.quantity,
  order_items.price,
  (order_items.quantity * order_items.price) as subtotal
FROM orders
JOIN customers ON orders.customer_id = customers.id
JOIN order_items ON orders.id = order_items.order_id
JOIN books ON order_items.book_id = books.id;
```
</details>

---

## 🎓 Key Concepts Covered

- SELECT, WHERE, ORDER BY, LIMIT
- Aggregate functions (COUNT, SUM, AVG, MIN, MAX)
- GROUP BY and HAVING
- INNER JOIN, LEFT JOIN
- NULL handling
- String matching (LIKE)
- Multiple conditions (AND, OR, IN)

**Master these before moving to advanced exercises!**
