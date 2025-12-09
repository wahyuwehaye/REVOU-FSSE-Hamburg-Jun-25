# ✏️ Inserting, Updating & Deleting Data

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Insert data ke dalam database (single & multiple rows)
- ✅ Update existing data dengan WHERE clause
- ✅ Delete data dengan aman
- ✅ Menggunakan RETURNING clause untuk mendapatkan data yang di-modify
- ✅ Memahami transaction basics (COMMIT & ROLLBACK)
- ✅ Bulk operations untuk efficiency
- ✅ Best practices untuk data manipulation

---

## 📊 Sample Table

Mari buat table untuk practice:

```sql
-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  age INTEGER CHECK (age >= 0),
  city VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ➕ INSERT - Adding Data

### INSERT Single Row

**Basic Syntax:**
```sql
INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);
```

**Example:**
```sql
-- Insert one user
INSERT INTO users (name, email, age, city)
VALUES ('John Doe', 'john@email.com', 25, 'Jakarta');
```

**Result:**
```
INSERT 0 1  -- 1 row inserted
```

### INSERT with All Columns

```sql
-- Specify all columns (except SERIAL and DEFAULT)
INSERT INTO users (name, email, age, city, is_active)
VALUES ('Sarah Smith', 'sarah@email.com', 30, 'Bandung', true);
```

### INSERT without Column Names

```sql
-- ⚠️ Must match ALL columns in order (not recommended)
INSERT INTO users 
VALUES (DEFAULT, 'Mike Brown', 'mike@email.com', 28, 'Jakarta', true, DEFAULT);
--      ↑ id     ↑ name       ↑ email           ↑ age  ↑ city    ↑ active ↑ created_at
```

**❌ Not Recommended:**
- Hard to read
- Breaks if table structure changes
- Easy to make mistakes

**✅ Recommended:**
```sql
-- Always specify column names
INSERT INTO users (name, email, age, city)
VALUES ('Mike Brown', 'mike@email.com', 28, 'Jakarta');
```

### INSERT with DEFAULT Values

```sql
-- Use DEFAULT keyword for default values
INSERT INTO users (name, email, age, city, is_active)
VALUES ('Emily Chen', 'emily@email.com', 35, 'Surabaya', DEFAULT);
-- is_active will be true (from DEFAULT true)

-- Or omit columns with defaults
INSERT INTO users (name, email, age, city)
VALUES ('David Lee', 'david@email.com', 22, 'Jakarta');
-- is_active = true, created_at = CURRENT_TIMESTAMP (automatically)
```

---

## 📦 INSERT Multiple Rows

**Much faster than multiple single INSERTs!**

### Syntax

```sql
INSERT INTO table_name (column1, column2, ...)
VALUES 
  (value1a, value2a, ...),
  (value1b, value2b, ...),
  (value1c, value2c, ...);
```

### Example

```sql
INSERT INTO users (name, email, age, city)
VALUES 
  ('Alice Johnson', 'alice@email.com', 27, 'Jakarta'),
  ('Bob Wilson', 'bob@email.com', 32, 'Bandung'),
  ('Carol Martinez', 'carol@email.com', 29, 'Surabaya'),
  ('Daniel Kim', 'daniel@email.com', 24, 'Jakarta');
```

**Result:**
```
INSERT 0 4  -- 4 rows inserted
```

### Performance Comparison

```sql
-- ❌ SLOW: 1000 separate INSERTs
INSERT INTO users (name, email) VALUES ('User 1', 'user1@email.com');
INSERT INTO users (name, email) VALUES ('User 2', 'user2@email.com');
-- ... 998 more times
-- Time: ~5 seconds

-- ✅ FAST: 1 INSERT with 1000 rows
INSERT INTO users (name, email)
VALUES 
  ('User 1', 'user1@email.com'),
  ('User 2', 'user2@email.com'),
  -- ... 998 more rows
  ('User 1000', 'user1000@email.com');
-- Time: ~0.2 seconds (25x faster!)
```

---

## 🔄 RETURNING Clause

**Get back the inserted data immediately!**

### Get Inserted ID

```sql
INSERT INTO users (name, email, age, city)
VALUES ('Test User', 'test@email.com', 25, 'Jakarta')
RETURNING id;
```

**Result:**
```
┌────┐
│ id │
├────┤
│ 8  │
└────┘
```

### Get Multiple Columns

```sql
INSERT INTO users (name, email, age, city)
VALUES ('New User', 'new@email.com', 30, 'Bandung')
RETURNING id, name, email, created_at;
```

**Result:**
```
┌────┬──────────┬─────────────────┬─────────────────────┐
│ id │ name     │ email           │ created_at          │
├────┼──────────┼─────────────────┼─────────────────────┤
│ 9  │ New User │ new@email.com   │ 2024-01-20 10:30:45 │
└────┴──────────┴─────────────────┴─────────────────────┘
```

### Get All Columns

```sql
INSERT INTO users (name, email, age, city)
VALUES ('Another User', 'another@email.com', 28, 'Jakarta')
RETURNING *;
```

### RETURNING with Multiple Inserts

```sql
INSERT INTO users (name, email, age, city)
VALUES 
  ('User A', 'usera@email.com', 25, 'Jakarta'),
  ('User B', 'userb@email.com', 30, 'Bandung'),
  ('User C', 'userc@email.com', 27, 'Surabaya')
RETURNING id, name;
```

**Result:**
```
┌────┬────────┐
│ id │ name   │
├────┼────────┤
│ 10 │ User A │
│ 11 │ User B │
│ 12 │ User C │
└────┴────────┘
```

**Use Case:**
Perfect for API responses! Insert data and immediately return it to the client.

---

## 🔄 UPDATE - Modifying Data

### UPDATE Single Column

**Syntax:**
```sql
UPDATE table_name
SET column = value
WHERE condition;
```

**Example:**
```sql
-- Update user's age
UPDATE users
SET age = 26
WHERE id = 1;
```

**⚠️ WARNING: Always use WHERE!**
```sql
-- ❌ DANGER: Updates ALL rows!
UPDATE users
SET age = 26;

-- ✅ SAFE: Updates only specific row
UPDATE users
SET age = 26
WHERE id = 1;
```

### UPDATE Multiple Columns

```sql
-- Update multiple columns at once
UPDATE users
SET 
  age = 31,
  city = 'Jakarta',
  is_active = false
WHERE id = 2;
```

### UPDATE with Calculations

```sql
-- Increment age by 1
UPDATE users
SET age = age + 1
WHERE id = 3;

-- Double the age (why would you? 😄)
UPDATE users
SET age = age * 2
WHERE id = 4;

-- Concatenate strings
UPDATE users
SET name = name || ' (VIP)'
WHERE age > 30;
```

### UPDATE Multiple Rows

```sql
-- Update all users from Jakarta
UPDATE users
SET city = 'Jakarta Selatan'
WHERE city = 'Jakarta';

-- Update all inactive users
UPDATE users
SET is_active = true
WHERE is_active = false;

-- Update users over 30
UPDATE users
SET city = 'Senior City'
WHERE age > 30;
```

### UPDATE with RETURNING

```sql
-- Update and see what changed
UPDATE users
SET age = age + 1
WHERE city = 'Jakarta'
RETURNING id, name, age;
```

**Result:**
```
┌────┬──────────────┬─────┐
│ id │ name         │ age │
├────┼──────────────┼─────┤
│ 1  │ John Doe     │ 26  │
│ 3  │ Mike Brown   │ 29  │
│ 5  │ David Lee    │ 23  │
└────┴──────────────┴─────┘
```

---

## 🗑️ DELETE - Removing Data

### DELETE Specific Rows

**Syntax:**
```sql
DELETE FROM table_name
WHERE condition;
```

**Example:**
```sql
-- Delete user with id = 5
DELETE FROM users
WHERE id = 5;
```

**Result:**
```
DELETE 1  -- 1 row deleted
```

### DELETE Multiple Rows

```sql
-- Delete all inactive users
DELETE FROM users
WHERE is_active = false;

-- Delete users under 18
DELETE FROM users
WHERE age < 18;

-- Delete users from specific cities
DELETE FROM users
WHERE city IN ('Bandung', 'Surabaya');
```

### DELETE with RETURNING

```sql
-- Delete and see what was deleted
DELETE FROM users
WHERE age < 25
RETURNING id, name, age;
```

**Result:**
```
┌────┬────────────┬─────┐
│ id │ name       │ age │
├────┼────────────┼─────┤
│ 5  │ David Lee  │ 22  │
│ 9  │ Daniel Kim │ 24  │
└────┴────────────┴─────┘
```

### ⚠️ DELETE ALL Rows (DANGER!)

```sql
-- ❌ EXTREMELY DANGEROUS: Deletes EVERYTHING!
DELETE FROM users;

-- ✅ Use TRUNCATE instead (faster + resets sequences)
TRUNCATE TABLE users;

-- ✅ Or add WHERE clause
DELETE FROM users WHERE is_active = false;
```

**TRUNCATE vs DELETE:**
```sql
-- DELETE: Slower, can use WHERE, can ROLLBACK
DELETE FROM users WHERE city = 'Jakarta';

-- TRUNCATE: Much faster, deletes all, resets SERIAL, harder to ROLLBACK
TRUNCATE TABLE users;
-- Better for "empty the table" scenarios
```

---

## 🔄 UPSERT - INSERT or UPDATE

**PostgreSQL's ON CONFLICT clause**

### Problem

```sql
-- What if email already exists?
INSERT INTO users (name, email, age)
VALUES ('John Doe', 'john@email.com', 25);
-- Error: duplicate key value violates unique constraint "users_email_key"
```

### Solution: ON CONFLICT DO NOTHING

```sql
-- If conflict, do nothing (skip insert)
INSERT INTO users (name, email, age)
VALUES ('John Doe', 'john@email.com', 25)
ON CONFLICT (email) DO NOTHING;
-- No error! Just skips if email exists
```

### Solution: ON CONFLICT DO UPDATE

```sql
-- If conflict, update instead
INSERT INTO users (name, email, age, city)
VALUES ('John Doe', 'john@email.com', 26, 'Bandung')
ON CONFLICT (email) 
DO UPDATE SET 
  name = EXCLUDED.name,
  age = EXCLUDED.age,
  city = EXCLUDED.city;
```

**How it works:**
1. Try to insert
2. If `email` already exists (conflict)
3. Instead of error, UPDATE the existing row
4. `EXCLUDED` refers to the values you tried to insert

### Real-World Example: User Profile Update

```sql
-- Update if exists, insert if not
INSERT INTO users (name, email, age, city, is_active)
VALUES ('Sarah Smith', 'sarah@email.com', 31, 'Jakarta', true)
ON CONFLICT (email)
DO UPDATE SET
  name = EXCLUDED.name,
  age = EXCLUDED.age,
  city = EXCLUDED.city,
  is_active = EXCLUDED.is_active
RETURNING id, name, email, age;
```

### ON CONFLICT with WHERE

```sql
-- Only update if certain conditions met
INSERT INTO users (name, email, age)
VALUES ('John Doe', 'john@email.com', 26)
ON CONFLICT (email)
DO UPDATE SET age = EXCLUDED.age
WHERE users.age < EXCLUDED.age;  -- Only if new age is higher
```

---

## 🔄 Transactions

**Transactions ensure data integrity!**

### What is a Transaction?

**Analogy:**
Bayangkan transfer uang:
1. Kurangi saldo dari Account A (-$100)
2. Tambah saldo ke Account B (+$100)

Kalau step 1 berhasil tapi step 2 gagal? Uang hilang! 😱

**Solution: Transaction**
- Semua berhasil (COMMIT) atau semua gagal (ROLLBACK)
- No in-between state!

### COMMIT & ROLLBACK

```sql
-- Start transaction
BEGIN;

-- Do some operations
UPDATE users SET age = 30 WHERE id = 1;
UPDATE users SET city = 'Jakarta' WHERE id = 2;
DELETE FROM users WHERE id = 3;

-- If everything OK, save changes
COMMIT;

-- If something wrong, undo everything
-- ROLLBACK;
```

### Example: Bank Transfer

```sql
BEGIN;

-- Deduct from Account A
UPDATE accounts 
SET balance = balance - 100 
WHERE id = 1;

-- Add to Account B
UPDATE accounts 
SET balance = balance + 100 
WHERE id = 2;

-- Check if both succeeded
SELECT balance FROM accounts WHERE id IN (1, 2);

-- If all good:
COMMIT;

-- If something wrong:
-- ROLLBACK;
```

### Transaction with Error Handling

```sql
BEGIN;

-- Try to insert user
INSERT INTO users (name, email, age)
VALUES ('Test User', 'test@email.com', 25);

-- Try to update related data
UPDATE user_profiles 
SET bio = 'New bio' 
WHERE user_id = (SELECT id FROM users WHERE email = 'test@email.com');

-- If any error occurs, rollback
-- Otherwise commit
COMMIT;
```

### Isolation Levels (Advanced)

```sql
-- Default: READ COMMITTED
BEGIN;
-- Your transaction

-- Read Uncommitted (can read uncommitted changes from other transactions)
BEGIN TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

-- Repeatable Read (same read within transaction)
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- Serializable (highest isolation, like transactions run one by one)
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

---

## 📊 Bulk Operations

### Bulk INSERT with SELECT

```sql
-- Copy data from one table to another
INSERT INTO users_backup (name, email, age, city)
SELECT name, email, age, city
FROM users
WHERE created_at < '2024-01-01';
```

### Bulk UPDATE with JOIN

```sql
-- Update based on another table
UPDATE users u
SET city = r.new_city
FROM relocations r
WHERE u.id = r.user_id;
```

### Bulk DELETE with Subquery

```sql
-- Delete users who have no orders
DELETE FROM users
WHERE id NOT IN (
  SELECT DISTINCT user_id FROM orders
);
```

---

## 💡 Best Practices

### 1. Always Use WHERE in UPDATE/DELETE

```sql
-- ❌ DANGER: Updates all rows
UPDATE users SET age = 30;

-- ✅ SAFE: Updates specific rows
UPDATE users SET age = 30 WHERE id = 1;
```

### 2. Use Transactions for Multiple Operations

```sql
-- ❌ BAD: Separate operations
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
-- What if second fails?

-- ✅ GOOD: Use transaction
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

### 3. Use RETURNING to Get Modified Data

```sql
-- ❌ BAD: Two queries
INSERT INTO users (name, email) VALUES ('John', 'john@email.com');
SELECT id FROM users WHERE email = 'john@email.com';

-- ✅ GOOD: One query with RETURNING
INSERT INTO users (name, email) 
VALUES ('John', 'john@email.com')
RETURNING id;
```

### 4. Validate Data Before INSERT

```sql
-- ✅ GOOD: Check constraints
INSERT INTO users (name, email, age)
VALUES ('John', 'john@email.com', 25)
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'john@email.com'
);

-- Or use ON CONFLICT
INSERT INTO users (name, email, age)
VALUES ('John', 'john@email.com', 25)
ON CONFLICT (email) DO NOTHING;
```

### 5. Bulk Operations Over Loops

```sql
-- ❌ BAD: Loop in application code
for user in users:
    db.execute("INSERT INTO users (name) VALUES (?)", user.name)

-- ✅ GOOD: Single bulk insert
INSERT INTO users (name)
VALUES ('User1'), ('User2'), ('User3'), ...;
```

---

## 🔥 Common Mistakes

### Mistake 1: Forgetting WHERE

```sql
-- ❌ DISASTER: Updates all users!
UPDATE users SET age = 30;

-- ✅ CORRECT
UPDATE users SET age = 30 WHERE id = 1;
```

**Tip:** Test with SELECT first!
```sql
-- 1. Test with SELECT
SELECT * FROM users WHERE id = 1;

-- 2. If correct, change to UPDATE
UPDATE users SET age = 30 WHERE id = 1;
```

### Mistake 2: Duplicate Keys

```sql
-- ❌ ERROR: Email already exists
INSERT INTO users (name, email)
VALUES ('John', 'john@email.com');
-- Error: duplicate key value violates unique constraint

-- ✅ SOLUTION: Use ON CONFLICT
INSERT INTO users (name, email)
VALUES ('John', 'john@email.com')
ON CONFLICT (email) DO NOTHING;
```

### Mistake 3: NULL in UPDATE

```sql
-- ❌ BAD: Sets city to NULL unintentionally
UPDATE users SET city = NULL WHERE id = 1;

-- ✅ GOOD: Be explicit
UPDATE users 
SET city = COALESCE(new_city, city)  -- Keep old if new is NULL
WHERE id = 1;
```

### Mistake 4: Cascading Deletes

```sql
-- ❌ DANGER: Might delete related data!
DELETE FROM users WHERE id = 1;
-- If you have orders, profiles, etc. with FOREIGN KEY CASCADE,
-- they will also be deleted!

-- ✅ SAFE: Check first
SELECT * FROM orders WHERE user_id = 1;
SELECT * FROM user_profiles WHERE user_id = 1;
-- Then decide if you really want to delete
```

---

## 📝 Practice Exercises

### Exercise 1: INSERT

```sql
-- 1. Insert a new user with your info


-- 2. Insert 3 users at once with RETURNING


-- 3. Insert user with DEFAULT values for is_active and created_at


```

### Exercise 2: UPDATE

```sql
-- 4. Update your age


-- 5. Update city for all users from Jakarta to Jakarta Pusat


-- 6. Increase age by 1 for users over 30


```

### Exercise 3: DELETE

```sql
-- 7. Delete users younger than 18


-- 8. Delete inactive users with RETURNING


-- 9. Delete users from Bandung who are inactive


```

### Exercise 4: UPSERT

```sql
-- 10. Insert or update user with email 'test@email.com'


-- 11. Insert multiple users with ON CONFLICT


```

### Exercise 5: Transactions

```sql
-- 12. Create a transaction that:
--     - Inserts a new user
--     - Updates another user
--     - Deletes an inactive user
--     - Commits if all succeed


```

---

## 🎯 Summary

**Key Operations:**

1. ✅ **INSERT** - Add new data
   ```sql
   INSERT INTO table (col1, col2) VALUES (val1, val2);
   ```

2. ✅ **UPDATE** - Modify existing data
   ```sql
   UPDATE table SET col = val WHERE condition;
   ```

3. ✅ **DELETE** - Remove data
   ```sql
   DELETE FROM table WHERE condition;
   ```

4. ✅ **RETURNING** - Get modified data back
   ```sql
   INSERT ... RETURNING id;
   UPDATE ... RETURNING *;
   DELETE ... RETURNING id, name;
   ```

5. ✅ **UPSERT** - Insert or Update
   ```sql
   INSERT ... ON CONFLICT (column) DO UPDATE SET ...;
   ```

6. ✅ **Transactions** - Ensure data integrity
   ```sql
   BEGIN;
   -- operations
   COMMIT;  -- or ROLLBACK;
   ```

**Critical Rules:**

⚠️ Always use WHERE with UPDATE/DELETE  
⚠️ Use transactions for related operations  
⚠️ Test SELECT before UPDATE/DELETE  
⚠️ Use RETURNING to avoid extra queries  
⚠️ Bulk operations are much faster  

**Next Step:**
👉 Lanjut ke [Materi 11: JOINs - Combining Tables](./11-joins-combining-tables.md)

---

**Happy Learning! 🚀**
