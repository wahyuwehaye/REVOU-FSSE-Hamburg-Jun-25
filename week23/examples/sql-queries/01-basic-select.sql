-- ============================================
-- Week 23: Basic SQL Queries Examples
-- ============================================
-- This file contains basic SQL examples for learning
-- Run these in psql or your favorite SQL tool

-- ============================================
-- SETUP: Create Sample Database
-- ============================================

-- Create database
CREATE DATABASE sql_learning;

-- Connect to database (in psql: \c sql_learning)

-- ============================================
-- CREATE TABLES
-- ============================================

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INTEGER CHECK (age >= 0),
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Indonesia',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Posts table (for later JOIN examples)
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  likes INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert users
INSERT INTO users (name, email, age, city, country) VALUES 
  ('John Doe', 'john@email.com', 25, 'Jakarta', 'Indonesia'),
  ('Sarah Smith', 'sarah@email.com', 30, 'Bandung', 'Indonesia'),
  ('Mike Johnson', 'mike@email.com', 28, 'Surabaya', 'Indonesia'),
  ('Emily Brown', 'emily@email.com', 35, 'Singapore', 'Singapore'),
  ('David Lee', 'david@email.com', 22, 'Jakarta', 'Indonesia'),
  ('Lisa Chen', 'lisa@email.com', 27, 'Bali', 'Indonesia'),
  ('Tom Wilson', 'tom@email.com', 33, 'Jakarta', 'Indonesia'),
  ('Anna Garcia', 'anna@email.com', 29, 'Yogyakarta', 'Indonesia');

-- Insert posts
INSERT INTO posts (user_id, title, content, likes, status) VALUES 
  (1, 'My First Post', 'Hello World!', 10, 'published'),
  (1, 'Learning SQL', 'SQL is awesome!', 5, 'published'),
  (2, 'Travel Blog', 'My trip to Bali', 20, 'published'),
  (2, 'Draft Post', 'Work in progress', 0, 'draft'),
  (3, 'Tech Review', 'Latest gadgets', 15, 'published'),
  (4, 'Food Guide', 'Best restaurants', 30, 'published'),
  (5, 'Study Tips', 'How to learn programming', 8, 'published');

-- ============================================
-- EXAMPLE 1: SELECT ALL
-- ============================================

-- Get all columns, all rows
SELECT * FROM users;

-- Get all posts
SELECT * FROM posts;

-- ============================================
-- EXAMPLE 2: SELECT SPECIFIC COLUMNS
-- ============================================

-- Only name and email
SELECT name, email FROM users;

-- Only published posts
SELECT title, likes FROM posts WHERE status = 'published';

-- ============================================
-- EXAMPLE 3: SELECT WITH ALIASES
-- ============================================

-- Rename columns for clarity
SELECT 
  name AS "User Name",
  email AS "Contact Email",
  age AS "Age (years)"
FROM users;

-- With calculations
SELECT 
  name,
  age,
  age * 12 AS age_in_months,
  age + 1 AS next_year_age
FROM users;

-- ============================================
-- EXAMPLE 4: WHERE CLAUSE (Basic Filtering)
-- ============================================

-- Users over 25
SELECT * FROM users WHERE age > 25;

-- Users exactly 30 years old
SELECT * FROM users WHERE age = 30;

-- Users from Jakarta
SELECT * FROM users WHERE city = 'Jakarta';

-- Active users only
SELECT * FROM users WHERE is_active = true;

-- ============================================
-- EXAMPLE 5: MULTIPLE CONDITIONS (AND, OR)
-- ============================================

-- Users over 25 AND from Jakarta
SELECT * FROM users 
WHERE age > 25 AND city = 'Jakarta';

-- Users from Jakarta OR Bandung
SELECT * FROM users 
WHERE city = 'Jakarta' OR city = 'Bandung';

-- Users over 25 OR from Singapore
SELECT * FROM users 
WHERE age > 25 OR country = 'Singapore';

-- Combined: (Age > 25) AND (Jakarta OR Bandung)
SELECT * FROM users 
WHERE age > 25 AND (city = 'Jakarta' OR city = 'Bandung');

-- ============================================
-- EXAMPLE 6: NOT CONDITION
-- ============================================

-- Users NOT from Jakarta
SELECT * FROM users WHERE NOT city = 'Jakarta';

-- Same as:
SELECT * FROM users WHERE city != 'Jakarta';
-- OR:
SELECT * FROM users WHERE city <> 'Jakarta';

-- Inactive users
SELECT * FROM users WHERE NOT is_active;
-- Same as:
SELECT * FROM users WHERE is_active = false;

-- ============================================
-- EXAMPLE 7: IN CLAUSE (Multiple Values)
-- ============================================

-- Users from specific cities
SELECT * FROM users 
WHERE city IN ('Jakarta', 'Bandung', 'Surabaya');

-- Users NOT from these cities
SELECT * FROM users 
WHERE city NOT IN ('Jakarta', 'Bandung');

-- Posts with specific statuses
SELECT * FROM posts 
WHERE status IN ('published', 'archived');

-- ============================================
-- EXAMPLE 8: BETWEEN (Range)
-- ============================================

-- Users age between 25 and 30
SELECT * FROM users 
WHERE age BETWEEN 25 AND 30;

-- Same as:
SELECT * FROM users 
WHERE age >= 25 AND age <= 30;

-- Posts with 10-20 likes
SELECT * FROM posts 
WHERE likes BETWEEN 10 AND 20;

-- ============================================
-- EXAMPLE 9: LIKE (Pattern Matching)
-- ============================================

-- Names starting with 'J'
SELECT * FROM users WHERE name LIKE 'J%';

-- Emails ending with '@email.com'
SELECT * FROM users WHERE email LIKE '%@email.com';

-- Names containing 'a' (case-sensitive)
SELECT * FROM users WHERE name LIKE '%a%';

-- Names containing 'a' (case-insensitive)
SELECT * FROM users WHERE name ILIKE '%a%';

-- Names with exactly 4 letters
SELECT * FROM users WHERE name LIKE '____';  -- 4 underscores

-- ============================================
-- EXAMPLE 10: NULL HANDLING
-- ============================================

-- First, let's add a row with NULL
INSERT INTO users (name, email, age, city) 
VALUES ('Test User', 'test@email.com', NULL, NULL);

-- Find users without age
SELECT * FROM users WHERE age IS NULL;

-- Find users with age
SELECT * FROM users WHERE age IS NOT NULL;

-- Find users without city
SELECT * FROM users WHERE city IS NULL;

-- Replace NULL with default
SELECT 
  name,
  COALESCE(age, 0) AS age,
  COALESCE(city, 'Unknown') AS city
FROM users;

-- ============================================
-- EXAMPLE 11: ORDER BY (Sorting)
-- ============================================

-- Sort by name (A-Z)
SELECT * FROM users ORDER BY name ASC;

-- Sort by name (Z-A)
SELECT * FROM users ORDER BY name DESC;

-- Sort by age (youngest first)
SELECT * FROM users ORDER BY age ASC;

-- Sort by age (oldest first)
SELECT * FROM users ORDER BY age DESC;

-- Sort by multiple columns
SELECT * FROM users 
ORDER BY city ASC, age DESC;
-- First by city (A-Z), then by age (oldest first) within same city

-- ============================================
-- EXAMPLE 12: LIMIT and OFFSET (Pagination)
-- ============================================

-- Get first 3 users
SELECT * FROM users LIMIT 3;

-- Get users 4-6 (skip first 3)
SELECT * FROM users OFFSET 3 LIMIT 3;

-- Pagination: Page 1 (first 5)
SELECT * FROM users LIMIT 5 OFFSET 0;

-- Pagination: Page 2 (next 5)
SELECT * FROM users LIMIT 5 OFFSET 5;

-- Pagination: Page 3 (next 5)
SELECT * FROM users LIMIT 5 OFFSET 10;

-- ============================================
-- EXAMPLE 13: COUNT (Aggregate Function)
-- ============================================

-- Count all users
SELECT COUNT(*) FROM users;

-- Count users from Jakarta
SELECT COUNT(*) FROM users WHERE city = 'Jakarta';

-- Count published posts
SELECT COUNT(*) FROM posts WHERE status = 'published';

-- Count non-NULL ages
SELECT COUNT(age) FROM users;  -- Excludes NULL

-- Count DISTINCT cities
SELECT COUNT(DISTINCT city) FROM users;

-- ============================================
-- EXAMPLE 14: AVG, MIN, MAX, SUM
-- ============================================

-- Average age
SELECT AVG(age) AS average_age FROM users;

-- Youngest user
SELECT MIN(age) AS youngest FROM users;

-- Oldest user
SELECT MAX(age) AS oldest FROM users;

-- Total likes across all posts
SELECT SUM(likes) AS total_likes FROM posts;

-- All stats together
SELECT 
  COUNT(*) AS total_users,
  AVG(age) AS avg_age,
  MIN(age) AS youngest,
  MAX(age) AS oldest
FROM users;

-- ============================================
-- EXAMPLE 15: STRING FUNCTIONS
-- ============================================

-- Uppercase
SELECT 
  name,
  UPPER(name) AS uppercase_name
FROM users;

-- Lowercase
SELECT 
  email,
  LOWER(email) AS lowercase_email
FROM users;

-- String length
SELECT 
  name,
  LENGTH(name) AS name_length
FROM users;

-- Concatenation
SELECT 
  name,
  email,
  name || ' (' || email || ')' AS full_info
FROM users;

-- Extract username from email
SELECT 
  email,
  SUBSTRING(email FROM 1 FOR POSITION('@' IN email) - 1) AS username
FROM users;

-- ============================================
-- EXAMPLE 16: DATE FUNCTIONS
-- ============================================

-- Current date and time
SELECT NOW() AS current_datetime;
SELECT CURRENT_DATE AS today;
SELECT CURRENT_TIME AS time_now;

-- Extract year, month, day
SELECT 
  created_at,
  EXTRACT(YEAR FROM created_at) AS year,
  EXTRACT(MONTH FROM created_at) AS month,
  EXTRACT(DAY FROM created_at) AS day
FROM users;

-- Account age
SELECT 
  name,
  created_at,
  AGE(NOW(), created_at) AS account_age
FROM users;

-- Users created today
SELECT * FROM users 
WHERE DATE(created_at) = CURRENT_DATE;

-- Users created in last 7 days
SELECT * FROM users 
WHERE created_at >= NOW() - INTERVAL '7 days';

-- ============================================
-- EXAMPLE 17: CASE STATEMENT
-- ============================================

-- Categorize users by age
SELECT 
  name,
  age,
  CASE 
    WHEN age < 18 THEN 'Minor'
    WHEN age >= 18 AND age < 60 THEN 'Adult'
    ELSE 'Senior'
  END AS age_group
FROM users;

-- Status indicator
SELECT 
  title,
  status,
  CASE status
    WHEN 'draft' THEN '📝 Draft'
    WHEN 'published' THEN '✅ Published'
    WHEN 'archived' THEN '📦 Archived'
    ELSE '❓ Unknown'
  END AS status_icon
FROM posts;

-- ============================================
-- EXAMPLE 18: DISTINCT (Unique Values)
-- ============================================

-- Get all unique cities
SELECT DISTINCT city FROM users;

-- Get all unique countries
SELECT DISTINCT country FROM users;

-- Count unique cities
SELECT COUNT(DISTINCT city) AS total_cities FROM users;

-- ============================================
-- EXAMPLE 19: COMBINING TECHNIQUES
-- ============================================

-- Complex query: Active users from Jakarta or Bandung, age 25+, sorted
SELECT 
  name AS "Full Name",
  email AS "Email Address",
  age AS "Age",
  city AS "Location",
  CASE 
    WHEN age < 30 THEN 'Young'
    ELSE 'Experienced'
  END AS "Category"
FROM users
WHERE 
  is_active = true 
  AND city IN ('Jakarta', 'Bandung')
  AND age >= 25
ORDER BY age DESC
LIMIT 5;

-- ============================================
-- PRACTICE EXERCISES
-- ============================================

-- Try these queries yourself:

-- 1. Find all users with 'John' in their name (case-insensitive)


-- 2. Get users who are either from Jakarta and over 25, or from Singapore


-- 3. Find posts with more than 10 likes, ordered by likes descending


-- 4. Count how many users are from each city


-- 5. Find the average number of likes for published posts


-- 6. Get the 3 most popular posts (highest likes)


-- 7. Find users whose email ends with '.com'


-- 8. Get all users, showing 'N/A' for NULL ages


-- 9. Find posts created in the last 30 days


-- 10. List all cities with their user count (hint: will need GROUP BY - next topic!)


-- ============================================
-- CLEANUP (Optional)
-- ============================================

-- Drop tables
-- DROP TABLE posts;
-- DROP TABLE users;

-- Drop database
-- DROP DATABASE sql_learning;
