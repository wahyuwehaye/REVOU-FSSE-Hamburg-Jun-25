# 🔧 Modifying Data - Advanced Techniques

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Bulk insert dengan COPY dan INSERT INTO SELECT
- ✅ Multi-table updates dan deletes
- ✅ Conditional updates dengan CASE
- ✅ Update dengan JOINs
- ✅ Soft deletes vs hard deletes
- ✅ Audit trails dan triggers
- ✅ Data migration strategies
- ✅ Performance optimization untuk bulk operations

---

## 📊 Sample Schema

```sql
-- Main tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(200),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL  -- For soft deletes
);

CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  avatar_url VARCHAR(500),
  location VARCHAR(100),
  website VARCHAR(200)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'pending',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_name VARCHAR(200),
  quantity INTEGER,
  price DECIMAL(10,2)
);

-- Audit table
CREATE TABLE user_audit (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  action VARCHAR(50),
  old_data JSONB,
  new_data JSONB,
  changed_by VARCHAR(100),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📥 Bulk INSERT Operations

### INSERT INTO ... SELECT

**Copy data from one table to another**

```sql
-- Backup active users
CREATE TABLE users_backup (LIKE users INCLUDING ALL);

INSERT INTO users_backup
SELECT * FROM users
WHERE status = 'active';
```

### INSERT with Calculated Values

```sql
-- Create summary table
CREATE TABLE daily_sales (
  sale_date DATE PRIMARY KEY,
  total_orders INTEGER,
  total_revenue DECIMAL(10,2)
);

-- Populate with aggregated data
INSERT INTO daily_sales (sale_date, total_orders, total_revenue)
SELECT 
  DATE(order_date) AS sale_date,
  COUNT(*) AS total_orders,
  SUM(total) AS total_revenue
FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(order_date)
ON CONFLICT (sale_date) 
DO UPDATE SET
  total_orders = EXCLUDED.total_orders,
  total_revenue = EXCLUDED.total_revenue;
```

### INSERT Multiple Rows Efficiently

```sql
-- Generate test users
INSERT INTO users (username, email, full_name)
SELECT 
  'user' || id AS username,
  'user' || id || '@example.com' AS email,
  'Test User ' || id AS full_name
FROM generate_series(1, 1000) AS id;
```

### COPY for Bulk Loading (Fastest!)

```sql
-- Export to CSV
COPY users TO '/tmp/users.csv' WITH CSV HEADER;

-- Import from CSV (MUCH faster than INSERT)
COPY users (username, email, full_name)
FROM '/tmp/users.csv' WITH CSV HEADER;
```

**Performance:**
```
INSERT (1000 rows, one by one): ~5 seconds
INSERT (1000 rows, single query): ~0.2 seconds
COPY (1000 rows): ~0.05 seconds ← 100x faster!
```

---

## 🔄 Advanced UPDATE Techniques

### Conditional UPDATE with CASE

```sql
-- Update status based on order total
UPDATE orders
SET status = CASE
  WHEN total > 1000 THEN 'high_value'
  WHEN total > 500 THEN 'medium_value'
  WHEN total > 0 THEN 'low_value'
  ELSE 'invalid'
END
WHERE status = 'pending';
```

### UPDATE with Multiple Conditions

```sql
-- Complex status update
UPDATE users
SET 
  status = CASE
    WHEN deleted_at IS NOT NULL THEN 'deleted'
    WHEN created_at < CURRENT_DATE - INTERVAL '365 days' 
         AND NOT EXISTS (
           SELECT 1 FROM orders WHERE user_id = users.id
         ) THEN 'inactive'
    WHEN EXISTS (
           SELECT 1 FROM orders 
           WHERE user_id = users.id 
           AND order_date > CURRENT_DATE - INTERVAL '30 days'
         ) THEN 'active'
    ELSE 'dormant'
  END,
  updated_at = CURRENT_TIMESTAMP
WHERE status != 'deleted';
```

### UPDATE with JOIN (Using FROM)

```sql
-- Update order status based on payment status
CREATE TABLE payments (
  order_id INTEGER PRIMARY KEY,
  status VARCHAR(20),
  paid_at TIMESTAMP
);

-- Update orders based on payment status
UPDATE orders o
SET 
  status = CASE
    WHEN p.status = 'completed' THEN 'paid'
    WHEN p.status = 'failed' THEN 'payment_failed'
    ELSE 'pending'
  END,
  updated_at = CURRENT_TIMESTAMP
FROM payments p
WHERE o.id = p.order_id
  AND o.status IN ('pending', 'processing');
```

### UPDATE with Subquery

```sql
-- Set user status to VIP if total orders > $5000
UPDATE users
SET status = 'vip'
WHERE id IN (
  SELECT user_id
  FROM orders
  GROUP BY user_id
  HAVING SUM(total) > 5000
)
AND status != 'vip';
```

### Increment/Decrement Operations

```sql
-- Update stock after order
UPDATE products
SET 
  stock = stock - order_quantity,
  updated_at = CURRENT_TIMESTAMP
FROM (
  SELECT product_id, SUM(quantity) AS order_quantity
  FROM order_items
  WHERE order_id = 123
  GROUP BY product_id
) AS ordered
WHERE products.id = ordered.product_id
  AND products.stock >= ordered.order_quantity;
```

### UPDATE All Related Records

```sql
-- Update user and all related data
BEGIN;

-- Update user
UPDATE users
SET status = 'suspended', updated_at = CURRENT_TIMESTAMP
WHERE id = 42;

-- Update user's orders
UPDATE orders
SET status = 'on_hold'
WHERE user_id = 42 AND status = 'pending';

-- Log audit
INSERT INTO user_audit (user_id, action, changed_by)
VALUES (42, 'suspended', 'admin');

COMMIT;
```

---

## 🗑️ Advanced DELETE Techniques

### Soft Delete vs Hard Delete

#### Hard Delete (Permanent!)
```sql
-- Permanently remove data
DELETE FROM users WHERE id = 5;
-- Data is GONE forever! ⚠️
```

#### Soft Delete (Mark as deleted)
```sql
-- Just mark as deleted
UPDATE users
SET 
  deleted_at = CURRENT_TIMESTAMP,
  status = 'deleted'
WHERE id = 5;

-- Data still exists in database! ✅
-- Can be restored later
```

### Implementing Soft Delete System

```sql
-- Create view for active users only
CREATE VIEW active_users AS
SELECT * FROM users
WHERE deleted_at IS NULL;

-- Use view in queries
SELECT * FROM active_users;

-- Restore soft-deleted user
UPDATE users
SET deleted_at = NULL, status = 'active'
WHERE id = 5;

-- Permanently delete old soft-deleted users
DELETE FROM users
WHERE deleted_at < CURRENT_DATE - INTERVAL '1 year';
```

### DELETE with JOIN

```sql
-- Delete orders from inactive users
DELETE FROM orders
WHERE user_id IN (
  SELECT id FROM users WHERE status = 'inactive'
);

-- Or using USING clause (PostgreSQL specific)
DELETE FROM orders o
USING users u
WHERE o.user_id = u.id
  AND u.status = 'inactive';
```

### Cascade Delete

```sql
-- When user is deleted, also delete related data
-- (defined by ON DELETE CASCADE in foreign key)

DELETE FROM users WHERE id = 42;
-- Automatically deletes:
-- - user_profiles (cascade)
-- - orders (cascade)
-- - order_items (cascade via orders)
```

### DELETE with RETURNING (Audit)

```sql
-- Delete and keep record
WITH deleted_users AS (
  DELETE FROM users
  WHERE status = 'inactive'
  AND created_at < CURRENT_DATE - INTERVAL '2 years'
  RETURNING *
)
INSERT INTO users_archive
SELECT * FROM deleted_users;
```

---

## 📝 Audit Trail Implementation

### Basic Audit Trigger

```sql
-- Function to log changes
CREATE OR REPLACE FUNCTION audit_user_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    INSERT INTO user_audit (user_id, action, old_data, new_data)
    VALUES (
      NEW.id,
      'UPDATE',
      row_to_json(OLD),
      row_to_json(NEW)
    );
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO user_audit (user_id, action, old_data)
    VALUES (
      OLD.id,
      'DELETE',
      row_to_json(OLD)
    );
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER user_changes_audit
AFTER UPDATE OR DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION audit_user_changes();
```

**Now all UPDATE/DELETE operations are automatically logged!**

```sql
-- Test it
UPDATE users SET email = 'newemail@test.com' WHERE id = 1;

-- Check audit log
SELECT 
  action,
  old_data->>'email' AS old_email,
  new_data->>'email' AS new_email,
  changed_at
FROM user_audit
WHERE user_id = 1
ORDER BY changed_at DESC;
```

---

## 🔄 Data Migration Strategies

### Strategy 1: Migrate in Batches

```sql
-- Bad: Migrate 1 million rows at once (locks table!)
UPDATE users SET status = 'active' WHERE status IS NULL;

-- Good: Migrate in batches of 1000
DO $$
DECLARE
  batch_size INT := 1000;
  rows_affected INT;
BEGIN
  LOOP
    UPDATE users
    SET status = 'active'
    WHERE id IN (
      SELECT id FROM users
      WHERE status IS NULL
      LIMIT batch_size
    );
    
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    EXIT WHEN rows_affected = 0;
    
    -- Small delay to reduce load
    PERFORM pg_sleep(0.1);
    
    RAISE NOTICE 'Migrated % rows', rows_affected;
  END LOOP;
END $$;
```

### Strategy 2: Create New Column, Migrate, Swap

```sql
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN email_new VARCHAR(100);

-- Step 2: Populate new column (can run in batches)
UPDATE users
SET email_new = LOWER(TRIM(email))
WHERE email_new IS NULL;

-- Step 3: Verify data
SELECT 
  COUNT(*) AS total,
  COUNT(email_new) AS migrated,
  COUNT(*) - COUNT(email_new) AS remaining
FROM users;

-- Step 4: Swap columns
BEGIN;
ALTER TABLE users DROP COLUMN email;
ALTER TABLE users RENAME COLUMN email_new TO email;
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
COMMIT;
```

### Strategy 3: Dual Write Pattern

```sql
-- When migrating to new schema:

-- Phase 1: Write to both old and new
BEGIN;
-- Old format
INSERT INTO users_old (name, email) VALUES ('John', 'john@test.com');
-- New format
INSERT INTO users_new (full_name, email) VALUES ('John', 'john@test.com');
COMMIT;

-- Phase 2: Backfill historical data
INSERT INTO users_new (full_name, email)
SELECT name, email FROM users_old
WHERE id NOT IN (SELECT id FROM users_new)
ON CONFLICT DO NOTHING;

-- Phase 3: Read from new, write to new
-- Drop users_old when confident
```

---

## 🎯 UPSERT Advanced Patterns

### Bulk UPSERT

```sql
-- Insert or update multiple rows
INSERT INTO daily_sales (sale_date, total_orders, total_revenue)
VALUES 
  ('2024-01-01', 100, 5000.00),
  ('2024-01-02', 150, 7500.00),
  ('2024-01-03', 120, 6000.00)
ON CONFLICT (sale_date)
DO UPDATE SET
  total_orders = EXCLUDED.total_orders,
  total_revenue = EXCLUDED.total_revenue;
```

### Conditional UPSERT

```sql
-- Only update if new value is better
INSERT INTO products (id, name, price, stock)
VALUES (1, 'Laptop', 1200, 10)
ON CONFLICT (id)
DO UPDATE SET
  price = EXCLUDED.price,
  stock = products.stock + EXCLUDED.stock
WHERE products.price != EXCLUDED.price;
-- Only updates if price changed
```

### UPSERT with Timestamps

```sql
-- Track when record was created vs updated
CREATE TABLE user_settings (
  user_id INTEGER PRIMARY KEY,
  theme VARCHAR(20),
  language VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO user_settings (user_id, theme, language)
VALUES (1, 'dark', 'en')
ON CONFLICT (user_id)
DO UPDATE SET
  theme = EXCLUDED.theme,
  language = EXCLUDED.language,
  updated_at = CURRENT_TIMESTAMP;
  -- created_at stays the same!
```

---

## ⚡ Performance Optimization

### Use Indexes for Bulk Operations

```sql
-- Create indexes BEFORE bulk update
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Now bulk updates are faster
UPDATE orders
SET status = 'completed'
WHERE status = 'pending'
  AND user_id IN (SELECT id FROM users WHERE status = 'vip');
```

### Disable Triggers During Bulk Load

```sql
-- Disable triggers (faster bulk insert)
ALTER TABLE users DISABLE TRIGGER ALL;

-- Bulk insert
COPY users FROM '/tmp/users.csv' WITH CSV;

-- Re-enable triggers
ALTER TABLE users ENABLE TRIGGER ALL;
```

### Use UNLOGGED Tables for Temporary Data

```sql
-- Create unlogged table (faster, but not crash-safe)
CREATE UNLOGGED TABLE temp_imports (
  id SERIAL,
  data JSONB
);

-- Import data
COPY temp_imports FROM '/tmp/data.csv';

-- Process and move to permanent table
INSERT INTO permanent_table
SELECT * FROM temp_imports;

-- Clean up
DROP TABLE temp_imports;
```

### Batch Commits

```sql
DO $$
DECLARE
  batch_size INT := 10000;
  offset_val INT := 0;
  total INT;
BEGIN
  SELECT COUNT(*) INTO total FROM old_table;
  
  WHILE offset_val < total LOOP
    -- Insert batch
    INSERT INTO new_table
    SELECT * FROM old_table
    LIMIT batch_size OFFSET offset_val;
    
    -- Commit batch
    COMMIT;
    
    offset_val := offset_val + batch_size;
    RAISE NOTICE 'Processed % of % rows', offset_val, total;
  END LOOP;
END $$;
```

---

## 🔐 Safe Data Modification Practices

### 1. Always Use Transactions

```sql
-- ❌ BAD: No transaction
UPDATE orders SET status = 'shipped' WHERE id = 123;
UPDATE shipments SET status = 'in_transit' WHERE order_id = 123;
-- What if second update fails?

-- ✅ GOOD: Use transaction
BEGIN;
UPDATE orders SET status = 'shipped' WHERE id = 123;
UPDATE shipments SET status = 'in_transit' WHERE order_id = 123;
COMMIT;
-- Both succeed or both fail
```

### 2. Test with SELECT First

```sql
-- 1. Test with SELECT
SELECT * FROM users WHERE status = 'inactive';

-- 2. If looks correct, change to UPDATE
UPDATE users SET status = 'deleted' WHERE status = 'inactive';

-- 3. Verify
SELECT COUNT(*) FROM users WHERE status = 'deleted';
```

### 3. Use LIMIT for Testing

```sql
-- Test update on 10 rows first
UPDATE users
SET status = 'active'
WHERE status IS NULL
LIMIT 10;

-- Check if correct
SELECT * FROM users WHERE status = 'active' ORDER BY updated_at DESC LIMIT 10;

-- If OK, run full update
UPDATE users SET status = 'active' WHERE status IS NULL;
```

### 4. Create Backup Before Major Changes

```sql
-- Backup table
CREATE TABLE users_backup_20240120 AS
SELECT * FROM users;

-- Make changes
UPDATE users SET status = 'migrated';

-- If something wrong, restore:
TRUNCATE users;
INSERT INTO users SELECT * FROM users_backup_20240120;
```

### 5. Use WHERE with DELETE (Always!)

```sql
-- ❌ DANGER: Deletes everything!
DELETE FROM users;

-- ✅ SAFE: Use WHERE
DELETE FROM users WHERE status = 'deleted';

-- ✅ EXTRA SAFE: Use LIMIT first
DELETE FROM users WHERE status = 'deleted' LIMIT 1;
-- Check if correct, then remove LIMIT
```

---

## 📝 Practice Exercises

### Exercise 1: Bulk Insert
```sql
-- Generate 1000 test users with profiles


```

### Exercise 2: Conditional Update
```sql
-- Update order status based on total:
-- > $1000: premium
-- $500-$1000: standard
-- < $500: basic


```

### Exercise 3: Soft Delete
```sql
-- Implement soft delete for orders
-- Add deleted_at column
-- Create view for active orders


```

### Exercise 4: Audit Trail
```sql
-- Create audit table and trigger for orders


```

### Exercise 5: Data Migration
```sql
-- Migrate emails to lowercase in batches of 100


```

---

## 🎯 Summary

**Bulk Operations:**
```sql
-- Fastest: COPY
COPY table FROM 'file.csv';

-- Fast: INSERT INTO SELECT
INSERT INTO table SELECT * FROM source;

-- Moderate: Multi-row INSERT
INSERT INTO table VALUES (...), (...), (...);
```

**Advanced UPDATE:**
```sql
-- With CASE
UPDATE table SET col = CASE WHEN ... END;

-- With JOIN
UPDATE t1 SET col = t2.col FROM t2 WHERE t1.id = t2.id;

-- Conditional
UPDATE table SET col = val WHERE col IN (SELECT ...);
```

**Delete Strategies:**
```sql
-- Soft delete (reversible)
UPDATE table SET deleted_at = NOW() WHERE ...;

-- Hard delete (permanent)
DELETE FROM table WHERE ...;

-- With cleanup
DELETE FROM table WHERE deleted_at < NOW() - INTERVAL '1 year';
```

**Best Practices:**
- ✅ Use transactions for multi-step operations
- ✅ Test with SELECT before UPDATE/DELETE
- ✅ Use LIMIT for testing
- ✅ Create backups before major changes
- ✅ Implement audit trails
- ✅ Use indexes for bulk operations
- ✅ Process large datasets in batches

**Next Step:**
👉 Lanjut ke [Materi 14: Indexing & Query Optimization](./14-indexing-optimization.md)

---

**Happy Learning! 🚀**
