# 📊 What is Data?

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Memahami konsep data dan informasi
- ✅ Membedakan tipe-tipe data
- ✅ Memahami structured vs unstructured data
- ✅ Mengenal data types dalam database

---

## 🤔 Apa itu Data?

### Definisi

**Data** adalah **fakta mentah** yang belum diproses menjadi informasi yang berguna.

### Data vs Information

```
📝 Data (Raw Facts)
    ↓ Processing & Context
📊 Information (Meaningful)
    ↓ Analysis & Insight
🧠 Knowledge (Actionable)
```

### Contoh Real-World

```
❌ Data: "25, 30, 28, 32, 27"
✅ Information: "Suhu 5 hari terakhir antara 25-32°C"
✅ Knowledge: "Cuaca stabil, tidak perlu AC ekstra"
```

---

## 📋 Types of Data

### 1. **Structured Data** (Data Terstruktur)

Data yang terorganisir dalam format tertentu (tabel, rows, columns).

```
✅ Structured Data Examples:

┌─────┬──────────┬──────────────────┬─────┐
│ ID  │ Name     │ Email            │ Age │
├─────┼──────────┼──────────────────┼─────┤
│ 1   │ John     │ john@email.com   │ 25  │
│ 2   │ Sarah    │ sarah@email.com  │ 30  │
│ 3   │ Mike     │ mike@email.com   │ 28  │
└─────┴──────────┴──────────────────┴─────┘
```

**Karakteristik:**
- 📊 Fixed schema
- 🗂️ Organized in tables
- 🔍 Easy to search
- ✅ Easy to validate

**Storage:** SQL Databases (PostgreSQL, MySQL)

### 2. **Semi-Structured Data**

Data yang memiliki struktur tapi flexible.

```json
// ✅ Semi-Structured Data Example (JSON)
{
  "id": 1,
  "name": "John",
  "email": "john@email.com",
  "preferences": {
    "theme": "dark",
    "notifications": true
  },
  "tags": ["premium", "active"]
}
```

**Karakteristik:**
- 🔄 Flexible schema
- 🏷️ Self-describing (keys included)
- 📦 Nested structures allowed
- ⚡ Good for APIs

**Storage:** NoSQL Databases (MongoDB), JSON files

### 3. **Unstructured Data**

Data tanpa struktur yang jelas.

```
❌ Unstructured Data Examples:

📝 Text files
📧 Emails
📄 PDFs
🖼️ Images
🎥 Videos
🎵 Audio files
📱 Social media posts
```

**Karakteristik:**
- 🌀 No predefined format
- 🔍 Hard to search
- 💾 Large storage needed
- 🤖 Need AI/ML to analyze

**Storage:** File systems, Object storage (AWS S3)

---

## 🗂️ Data Organization Levels

### Hierarchy

```
🗄️ Database
├── 📊 Table (Users)
│   ├── 📝 Row/Record (John's data)
│   │   ├── 🔢 Field: id = 1
│   │   ├── 📝 Field: name = "John"
│   │   ├── 📧 Field: email = "john@email.com"
│   │   └── 🎂 Field: age = 25
│   └── 📝 Row/Record (Sarah's data)
└── 📊 Table (Products)
```

### Terminology Comparison

| SQL Term | NoSQL Term | Programming Term |
|----------|-----------|------------------|
| Database | Database | Database |
| Table | Collection | Array |
| Row | Document | Object |
| Column | Field | Property |
| Primary Key | _id | Unique identifier |

---

## 🎨 Data Types in Databases

### PostgreSQL Data Types

#### 1. **Numeric Types**

```sql
-- Integer types
SMALLINT    -- -32,768 to 32,767
INTEGER     -- -2 billion to 2 billion
BIGINT      -- very large numbers

-- Decimal types
DECIMAL(10, 2)   -- 10 digits, 2 after decimal: 12345678.90
NUMERIC(8, 3)    -- 8 digits, 3 after decimal: 12345.678
REAL             -- floating point
DOUBLE PRECISION -- more precise floating point

-- Example
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  price DECIMAL(10, 2),    -- $99999999.99
  stock INTEGER,            -- 1000 units
  weight REAL               -- 1.5 kg
);
```

#### 2. **String Types**

```sql
-- Fixed length
CHAR(10)        -- Always 10 characters, padded with spaces

-- Variable length
VARCHAR(255)    -- Up to 255 characters
TEXT            -- Unlimited length

-- Example
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50),     -- max 50 chars
  bio TEXT,                 -- unlimited
  country_code CHAR(2)      -- "US", "ID"
);
```

#### 3. **Date & Time Types**

```sql
DATE           -- 2024-12-01
TIME           -- 14:30:00
TIMESTAMP      -- 2024-12-01 14:30:00
TIMESTAMPTZ    -- with timezone
INTERVAL       -- duration: '3 days'

-- Example
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  expires_in INTERVAL
);
```

#### 4. **Boolean Type**

```sql
BOOLEAN  -- true or false

-- Example
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false
);
```

#### 5. **JSON Types**

```sql
JSON      -- stores as text
JSONB     -- binary, faster, indexable

-- Example
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  settings JSONB  -- {"theme": "dark", "lang": "en"}
);

-- Query JSON
SELECT * FROM user_preferences 
WHERE settings->>'theme' = 'dark';
```

#### 6. **Array Types**

```sql
INTEGER[]        -- array of integers
VARCHAR(50)[]    -- array of strings

-- Example
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  tags VARCHAR(50)[]  -- ['tech', 'tutorial', 'sql']
);

-- Query arrays
SELECT * FROM posts 
WHERE 'sql' = ANY(tags);
```

---

## 🎯 Choosing the Right Data Type

### Best Practices

```sql
-- ✅ GOOD: Appropriate types
CREATE TABLE products (
  id SERIAL PRIMARY KEY,              -- Auto-increment
  sku VARCHAR(20) UNIQUE NOT NULL,    -- Fixed format
  name VARCHAR(200) NOT NULL,         -- Reasonable limit
  description TEXT,                   -- Can be long
  price DECIMAL(10, 2) NOT NULL,      -- Money: exact precision
  stock INTEGER DEFAULT 0,            -- Whole numbers
  is_active BOOLEAN DEFAULT true,     -- Yes/No
  created_at TIMESTAMPTZ DEFAULT NOW() -- With timezone
);

-- ❌ BAD: Wrong types
CREATE TABLE products (
  id VARCHAR(50),          -- ❌ Use SERIAL instead
  sku TEXT,                -- ❌ Use VARCHAR with limit
  price REAL,              -- ❌ Use DECIMAL for money (REAL has rounding errors!)
  stock VARCHAR(10),       -- ❌ Use INTEGER
  created_at VARCHAR(50)   -- ❌ Use TIMESTAMP
);
```

### Why Data Types Matter

```sql
-- Example: Price calculation

-- ❌ Using REAL (floating point)
CREATE TABLE orders (
  total REAL  -- 10.10
);
-- Problem: 10.10 might be stored as 10.099999999
-- After calculations: $10.09 instead of $10.10

-- ✅ Using DECIMAL (exact)
CREATE TABLE orders (
  total DECIMAL(10, 2)  -- Exactly 10.10
);
-- Always precise for money calculations!
```

---

## 📊 Data Modeling Basics

### Entity-Relationship (ER) Model

```
👤 User (Entity)
├── Attributes:
│   ├── id (Primary Key)
│   ├── name
│   ├── email
│   └── created_at
└── Relationships:
    └── has many → Posts
    
📝 Post (Entity)
├── Attributes:
│   ├── id (Primary Key)
│   ├── user_id (Foreign Key)
│   ├── title
│   └── content
└── Relationships:
    └── belongs to → User
```

### Cardinality

```
1. One-to-One (1:1)
👤 User ←→ 📋 Profile
One user has one profile

2. One-to-Many (1:N)
👤 User ←→ 📝 Posts
One user has many posts

3. Many-to-Many (M:N)
👨‍🎓 Student ←→ 📚 Course
Many students enroll in many courses
(Needs junction table)
```

---

## 💾 Data Storage Concepts

### 1. **Primary Key**

Unique identifier untuk setiap row.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,  -- ✅ Auto-increment, unique
  email VARCHAR(255)
);

-- ❌ BAD: No primary key
CREATE TABLE users (
  name VARCHAR(100),  -- Can have duplicates!
  email VARCHAR(255)
);
```

### 2. **Foreign Key**

Menghubungkan data antar tabel.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),  -- Foreign key
  title VARCHAR(200)
);

-- This ensures:
-- ✅ user_id must exist in users table
-- ❌ Cannot delete user if they have posts
```

### 3. **Constraints**

Rules untuk validasi data.

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(20) UNIQUE NOT NULL,        -- Must be unique and not empty
  name VARCHAR(200) NOT NULL,             -- Cannot be empty
  price DECIMAL(10, 2) CHECK (price > 0), -- Must be positive
  stock INTEGER DEFAULT 0,                -- Default value
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔄 Data Lifecycle

### CRUD Operations

```
Create (INSERT)
  ↓
Read (SELECT)
  ↓
Update (UPDATE)
  ↓
Delete (DELETE)
```

### Example Flow

```sql
-- 1. CREATE
INSERT INTO users (name, email) 
VALUES ('John', 'john@email.com');

-- 2. READ
SELECT * FROM users WHERE email = 'john@email.com';

-- 3. UPDATE
UPDATE users 
SET name = 'John Doe' 
WHERE email = 'john@email.com';

-- 4. DELETE
DELETE FROM users 
WHERE email = 'john@email.com';
```

---

## 🎯 Data Quality

### 5 Dimensions of Data Quality

```
1. ✅ Accuracy: Is data correct?
2. ⏰ Timeliness: Is data up-to-date?
3. 📏 Consistency: Is data uniform across systems?
4. 🔍 Completeness: Is all required data present?
5. 🎯 Relevance: Is data useful for purpose?
```

### Bad Data Examples

```sql
-- ❌ Inaccurate
INSERT INTO users (name, email, age) 
VALUES ('John', 'invalid-email', -5);  -- Invalid email, negative age

-- ✅ With validation
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$'),
  age INTEGER CHECK (age >= 0 AND age <= 150)
);
```

---

## 📝 Quiz Time!

### Question 1
**Tipe data apa yang paling tepat untuk menyimpan harga produk?**

<details>
<summary>Jawaban</summary>

✅ **DECIMAL(10, 2)**

Why?
- DECIMAL adalah exact numeric (no rounding errors)
- 10 total digits, 2 after decimal
- Perfect untuk money: $12345678.90

❌ REAL atau FLOAT:
- Floating point dapat menyebabkan rounding errors
- 10.10 bisa jadi 10.099999999
- BAD for money calculations!
</details>

### Question 2
**Structured vs Unstructured data - Berikan contoh!**

<details>
<summary>Jawaban</summary>

**Structured:**
- ✅ Database tables
- ✅ CSV files
- ✅ Excel spreadsheets
- Fixed schema, easy to query

**Unstructured:**
- ✅ Emails
- ✅ Images
- ✅ Videos
- ✅ Social media posts
- No schema, hard to query
</details>

### Question 3
**Kenapa butuh Primary Key?**

<details>
<summary>Jawaban</summary>

**Primary Key ensures:**
1. ✅ Uniqueness - No duplicate rows
2. ✅ Identification - Can reference specific row
3. ✅ Relationships - Can link tables with foreign keys
4. ✅ Performance - Automatic index for fast lookups

Without Primary Key:
- ❌ Cannot guarantee unique rows
- ❌ Hard to update/delete specific row
- ❌ Cannot establish relationships
</details>

---

## 🛠️ Hands-On Example

### Real-World Schema

```sql
-- E-commerce database schema

-- 1. Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(200),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  category VARCHAR(50),
  images VARCHAR(500)[],  -- Array of image URLs
  metadata JSONB,          -- Flexible additional data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',  -- pending, paid, shipped, delivered
  shipping_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Order items (Junction table)
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL,  -- Price at time of order
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎯 Summary

**Key Takeaways:**

1. ✅ **Data** adalah raw facts, **Information** adalah meaningful data
2. ✅ **Structured data** (tables) vs **Unstructured** (images, videos)
3. ✅ Choose **appropriate data types** (DECIMAL for money, TIMESTAMP for dates)
4. ✅ Use **constraints** untuk validate data quality
5. ✅ **Primary Keys** ensure uniqueness, **Foreign Keys** establish relationships

**Next Step:**
👉 Lanjut ke [Materi 03: What is Database Management System?](./03-database-management-systems.md)

---

**Happy Learning! 🚀**
