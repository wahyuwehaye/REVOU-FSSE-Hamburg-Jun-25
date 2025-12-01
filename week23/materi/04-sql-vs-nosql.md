# ⚔️ SQL vs NoSQL Databases

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Memahami perbedaan fundamental SQL vs NoSQL
- ✅ Mengetahui kelebihan dan kekurangan masing-masing
- ✅ Memilih database yang tepat untuk use case tertentu
- ✅ Memahami kapan menggunakan hybrid approach

---

## 🥊 The Great Debate: SQL vs NoSQL

### Quick Overview

```
📊 SQL (Relational)              🗂️ NoSQL (Non-Relational)
├─ Tables, Rows, Columns         ├─ Documents, Key-Value, Graph
├─ Fixed Schema                  ├─ Flexible Schema
├─ ACID Transactions             ├─ BASE (Eventually Consistent)
├─ Vertical Scaling              ├─ Horizontal Scaling
└─ Joins, Relations              └─ Denormalization, Embedding
```

---

## 📊 SQL Databases (Relational)

### Characteristics

**Structure:** Data organized in **tables** with **rows** and **columns**

```sql
-- Users Table
┌─────┬──────────┬──────────────────┬─────┐
│ ID  │ Name     │ Email            │ Age │
├─────┼──────────┼──────────────────┼─────┤
│ 1   │ John     │ john@email.com   │ 25  │
│ 2   │ Sarah    │ sarah@email.com  │ 30  │
└─────┴──────────┴──────────────────┴─────┘

-- Posts Table
┌─────┬─────────┬───────────────────┬────────┐
│ ID  │ UserID  │ Title             │ Likes  │
├─────┼─────────┼───────────────────┼────────┤
│ 1   │ 1       │ My First Post     │ 10     │
│ 2   │ 1       │ Second Post       │ 5      │
│ 3   │ 2       │ Sarah's Post      │ 20     │
└─────┴─────────┴───────────────────┴────────┘
```

### Key Features

#### 1. **Fixed Schema**

```sql
-- Schema must be defined upfront
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INTEGER CHECK (age >= 0)
);

-- ❌ Cannot insert data with different structure
INSERT INTO users (name, email, phone) VALUES (...);  -- Error! No phone column
```

#### 2. **ACID Transactions**

```sql
-- All or nothing
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Deduct
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Add
COMMIT;  -- Both succeed or both fail
```

#### 3. **Relationships with JOINs**

```sql
-- Get user posts with JOIN
SELECT 
  users.name,
  posts.title,
  posts.likes
FROM users
JOIN posts ON users.id = posts.user_id
WHERE users.id = 1;
```

#### 4. **Normalization**

```sql
-- Data stored once, referenced multiple times
-- Avoids duplication

Users Table: [id, name, email]
Posts Table: [id, user_id, title]  -- user_id references Users
```

### ✅ SQL Pros

```
✅ Data integrity (ACID)
✅ Complex queries (JOINs, subqueries)
✅ Mature ecosystem
✅ Standardized (SQL language)
✅ Strong consistency
✅ Avoid data duplication
```

### ❌ SQL Cons

```
❌ Fixed schema (migrations needed)
❌ Vertical scaling (expensive)
❌ Complex for hierarchical data
❌ Slower for simple lookups
❌ Rigid structure
```

---

## 🗂️ NoSQL Databases

### Characteristics

**Structure:** Flexible, various models (documents, key-value, graph)

```javascript
// MongoDB Document
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John",
  "email": "john@email.com",
  "age": 25,
  "posts": [  // Embedded documents
    {
      "title": "My First Post",
      "likes": 10,
      "comments": [
        { "user": "Sarah", "text": "Great post!" }
      ]
    }
  ],
  "preferences": {  // Nested object
    "theme": "dark",
    "notifications": true
  }
}
```

### Key Features

#### 1. **Flexible Schema**

```javascript
// Can insert documents with different structures
db.users.insertOne({
  name: "John",
  email: "john@email.com"
});

db.users.insertOne({
  name: "Sarah",
  email: "sarah@email.com",
  phone: "123-456",  // Extra field OK!
  address: {         // Nested object OK!
    city: "Jakarta"
  }
});
```

#### 2. **Denormalization**

```javascript
// Data embedded together (duplicated but faster)
{
  "_id": 1,
  "title": "My Post",
  "author": {  // Author data embedded
    "name": "John",
    "email": "john@email.com"
  },
  "comments": [
    {
      "user": "Sarah",
      "text": "Great!"
    }
  ]
}

// No JOIN needed! Everything in one query
```

#### 3. **Horizontal Scaling**

```
Single Server (SQL - Vertical Scaling)
┌──────────────┐
│ PostgreSQL   │  Add more RAM/CPU
│ 16GB RAM     │  (expensive!)
└──────────────┘

Multiple Servers (NoSQL - Horizontal Scaling)
┌──────────┐  ┌──────────┐  ┌──────────┐
│ MongoDB  │  │ MongoDB  │  │ MongoDB  │  Add more servers
│ Node 1   │  │ Node 2   │  │ Node 3   │  (cheaper!)
└──────────┘  └──────────┘  └──────────┘
```

#### 4. **BASE (vs ACID)**

```
BASE Properties:
├─ Basically Available: System always responds
├─ Soft state: Data may be inconsistent temporarily
└─ Eventually consistent: Data becomes consistent over time

Example:
- User updates profile
- Change propagates to replicas
- Short delay OK (eventual consistency)
```

### ✅ NoSQL Pros

```
✅ Flexible schema (no migrations)
✅ Horizontal scaling (cheap)
✅ Fast for simple queries
✅ Good for hierarchical data
✅ Rapid development
✅ High write throughput
```

### ❌ NoSQL Cons

```
❌ No ACID (before MongoDB 4.0)
❌ No standard query language
❌ Data duplication
❌ Complex queries harder
❌ Less mature tooling
❌ Eventual consistency issues
```

---

## 📊 Detailed Comparison

### 1. Data Structure

| Aspect | SQL | NoSQL |
|--------|-----|-------|
| **Model** | Tables (rows/columns) | Documents, Key-Value, Graph |
| **Schema** | Fixed, predefined | Dynamic, flexible |
| **Relationships** | Foreign keys, JOINs | Embedding, references |
| **Example** | PostgreSQL, MySQL | MongoDB, Redis, Neo4j |

```sql
-- SQL: Separate tables
Users: [id, name, email]
Posts: [id, user_id, title]

-- Query needs JOIN
SELECT * FROM users 
JOIN posts ON users.id = posts.user_id;
```

```javascript
// NoSQL: Embedded documents
{
  name: "John",
  email: "john@email.com",
  posts: [  // Embedded!
    { title: "Post 1" },
    { title: "Post 2" }
  ]
}

// Single query, no JOIN!
db.users.findOne({ name: "John" });
```

### 2. Schema Changes

```sql
-- SQL: Migration required
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
-- Must update ALL rows
-- Downtime possible
```

```javascript
// NoSQL: Just insert
db.users.insertOne({
  name: "New User",
  phone: "123-456"  // New field! No migration needed
});
```

### 3. Scaling

```
SQL (Vertical Scaling):
┌──────────────────┐
│  Single Server   │
│  ⬆️ Add RAM       │  $$$
│  ⬆️ Add CPU       │  Expensive
│  ⬆️ Add SSD       │  Limited
└──────────────────┘

NoSQL (Horizontal Scaling):
┌─────┐ ┌─────┐ ┌─────┐
│Node1│ │Node2│ │Node3│
└─────┘ └─────┘ └─────┘
➕ Add more nodes       $
```

### 4. Consistency vs Availability

```
SQL (ACID - Strong Consistency):
User 1 updates → All users see update immediately
├─ Pros: Always consistent
└─ Cons: May be slow, downtime if server down

NoSQL (BASE - Eventual Consistency):
User 1 updates → Other users see update after short delay
├─ Pros: Fast, always available
└─ Cons: Temporary inconsistency
```

---

## 🎯 When to Use Each?

### Use SQL When:

```
✅ Need ACID transactions
   Example: Banking, E-commerce payments

✅ Complex relationships
   Example: Social network, ERP systems

✅ Need complex queries (JOINs, aggregations)
   Example: Analytics, Reporting

✅ Data integrity critical
   Example: Healthcare, Finance

✅ Structured data
   Example: User accounts, Orders

Real-World Examples:
- Banking systems
- E-commerce (orders, payments)
- Booking systems
- Inventory management
```

### Use NoSQL When:

```
✅ Flexible/changing schema
   Example: Product catalogs, User profiles

✅ High write throughput
   Example: Logging, IoT sensors

✅ Hierarchical data
   Example: Comments threads, Categories

✅ Need horizontal scaling
   Example: Social media, Real-time apps

✅ Rapid prototyping
   Example: Startups, MVPs

Real-World Examples:
- Social media feeds
- Real-time analytics
- IoT data collection
- Content management
- Caching layers
```

---

## 💡 Real-World Use Cases

### E-Commerce Platform

```javascript
// Hybrid Approach!

// SQL (PostgreSQL) for critical data:
orders: {
  id, user_id, total, payment_status  // ACID required
}

payments: {
  id, order_id, amount, stripe_id     // Must be consistent
}

// NoSQL (MongoDB) for flexible data:
products: {
  name, description, images, reviews,
  customAttributes: { ... }  // Different per product
}

sessions: {
  user_id, cart, preferences  // Temporary, OK if lost
}
```

### Social Media App

```javascript
// SQL for users & relationships:
users: [id, email, password_hash]
friendships: [user_id, friend_id, status]

// NoSQL for posts & feeds:
posts: {
  author, content, likes, comments: [...]  // Embedded
}

notifications: {
  user_id, type, data, read  // High write volume
}
```

---

## 🔄 Hybrid Approach (Polyglot Persistence)

### Using Multiple Databases

```
Modern applications often use BOTH!

📊 PostgreSQL
├─ Users, Orders, Payments
└─ Anything needing ACID

🗂️ MongoDB
├─ Product catalogs, Logs
└─ Flexible schema data

💾 Redis (In-Memory)
├─ Sessions, Cache
└─ Real-time data

🔍 Elasticsearch
├─ Full-text search
└─ Analytics

Example Architecture:
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
┌──────▼──────┐
│   NestJS    │
└──────┬──────┘
       ├─────────┬─────────┬─────────┐
       ▼         ▼         ▼         ▼
┌────────┐ ┌────────┐ ┌───────┐ ┌──────────┐
│Postgres│ │MongoDB │ │ Redis │ │Elasticsearch│
└────────┘ └────────┘ └───────┘ └──────────┘
```

---

## 📊 Migration Example

### From SQL to NoSQL

```sql
-- SQL: Normalized (multiple tables)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255)
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(200),
  content TEXT
);

-- Query needs JOIN
SELECT users.name, posts.title 
FROM users 
JOIN posts ON users.id = posts.user_id;
```

```javascript
// NoSQL: Denormalized (embedded)
{
  _id: ObjectId("..."),
  name: "John",
  email: "john@email.com",
  posts: [  // Embedded!
    {
      title: "My Post",
      content: "Content here..."
    }
  ]
}

// Single query, no JOIN
db.users.findOne({ name: "John" });
```

### Trade-offs

```
SQL (Normalized):
✅ No data duplication
✅ Easy to update (one place)
❌ Need JOINs (slower)

NoSQL (Denormalized):
✅ Fast queries (no JOIN)
❌ Data duplication
❌ Updates complex (many places)
```

---

## 📝 Quiz Time!

### Question 1
**Kapan harus pakai SQL vs NoSQL?**

<details>
<summary>Jawaban</summary>

**Use SQL when:**
- ✅ Need ACID transactions (banking, payments)
- ✅ Complex relationships (social network)
- ✅ Data integrity critical
- ✅ Fixed schema OK

**Use NoSQL when:**
- ✅ Flexible schema needed
- ✅ High write throughput (logs, IoT)
- ✅ Hierarchical data
- ✅ Horizontal scaling needed
- ✅ Eventual consistency OK
</details>

### Question 2
**Apa itu ACID vs BASE?**

<details>
<summary>Jawaban</summary>

**ACID (SQL):**
- **A**tomic: All or nothing
- **C**onsistent: Data follows rules
- **I**solated: Transactions don't interfere
- **D**urable: Data persists

Example: Bank transfer (both accounts update or none)

**BASE (NoSQL):**
- **B**asically Available: Always responds
- **S**oft state: May be inconsistent temporarily
- **E**ventually consistent: Becomes consistent over time

Example: Social media likes (count may be off briefly)
</details>

### Question 3
**Kenapa NoSQL bisa scale horizontal tapi SQL susah?**

<details>
<summary>Jawaban</summary>

**SQL Challenge:**
- Data normalized across tables
- JOINs need data from multiple tables
- Hard to split across servers (sharding complex)
- Need strong consistency (ACID)

**NoSQL Advantage:**
- Data denormalized (embedded)
- No JOINs needed
- Easy to split data across servers
- OK with eventual consistency

Example:
```javascript
// NoSQL: Complete document on one server
{
  user: "John",
  posts: [...],  // All data together
  comments: [...]
}

// SQL: Data spread across tables
// Need to coordinate across servers (complex!)
```
</details>

---

## 🎯 Summary

**Key Takeaways:**

1. ✅ **SQL** - Fixed schema, ACID, complex queries, vertical scaling
2. ✅ **NoSQL** - Flexible schema, BASE, simple queries, horizontal scaling
3. ✅ **Use SQL** for transactions, integrity, complex relationships
4. ✅ **Use NoSQL** for flexibility, scale, high throughput
5. ✅ **Hybrid approach** often best (polyglot persistence)

**Decision Framework:**

```
Need ACID? → SQL
Need flexible schema? → NoSQL
Need complex queries? → SQL
Need horizontal scaling? → NoSQL
Need both? → Hybrid (both!)
```

**Next Step:**
👉 Lanjut ke [Materi 05: How to Manage Database](./05-how-to-manage-database.md)

---

**Happy Learning! 🚀**
