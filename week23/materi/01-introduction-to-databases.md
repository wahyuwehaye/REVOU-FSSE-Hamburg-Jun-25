# 📚 Introduction to Databases

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Memahami konsep database dan pentingnya dalam aplikasi web modern
- ✅ Membedakan tipe-tipe database yang ada
- ✅ Menjelaskan kapan menggunakan database tertentu
- ✅ Memahami peran database dalam arsitektur aplikasi

---

## 🤔 Apa itu Database?

### Definisi Sederhana

**Database** adalah **tempat penyimpanan data yang terorganisir** sehingga data dapat dengan mudah:
- 📥 **Disimpan** (Create)
- 📖 **Dibaca** (Read)
- ✏️ **Diubah** (Update)
- 🗑️ **Dihapus** (Delete)

### Analogi Real-World

Bayangkan database seperti **perpustakaan**:

```
🏛️ Perpustakaan (Database)
├── 📚 Rak Buku (Tables)
│   ├── 📖 Buku 1 (Row/Record)
│   ├── 📖 Buku 2 (Row/Record)
│   └── 📖 Buku 3 (Row/Record)
├── 🗂️ Katalog (Index)
└── 👨‍💼 Pustakawan (Database Management System)
```

**Tanpa database:**
- Data tersimpan di file terpisah
- Sulit mencari data tertentu
- Mudah terjadi duplikasi
- Tidak ada validasi
- Tidak bisa concurrent access

**Dengan database:**
- Data terstruktur rapi
- Pencarian cepat dengan query
- Mencegah duplikasi
- Validasi otomatis
- Banyak user bisa akses bersamaan

---

## 🌟 Kenapa Database Penting?

### 1. **Data Persistence** (Data Tetap Tersimpan)

```javascript
// ❌ TANPA Database - Data hilang saat restart
let users = [];

app.post('/register', (req, res) => {
  users.push(req.body); // Data hilang saat server restart!
});
```

```javascript
// ✅ DENGAN Database - Data permanen
app.post('/register', async (req, res) => {
  await database.users.create(req.body); // Data tersimpan permanen
});
```

### 2. **Data Integrity** (Integritas Data)

Database memastikan data valid:

```sql
-- Contoh constraint
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,  -- Email wajib & unik
  age INTEGER CHECK (age >= 13),        -- Umur minimal 13
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. **Concurrent Access** (Banyak User Bersamaan)

Database handle ribuan request bersamaan:

```
User 1: SELECT * FROM products WHERE id = 1
User 2: UPDATE products SET stock = stock - 1 WHERE id = 1
User 3: DELETE FROM products WHERE id = 2
```

Database mengatur **transaction** agar tidak ada konflik!

### 4. **Query & Search** (Pencarian Cepat)
```sql
-- Cari semua user dengan email gmail yang register tahun 2024
SELECT * FROM users 
WHERE email LIKE '%@gmail.com' 
AND EXTRACT(YEAR FROM created_at) = 2024;
```

### 5. **Relationships** (Relasi Antar Data)

Database bisa menyimpan relasi antar data:

```
👤 User
├── 📝 Post 1
│   ├── 💬 Comment 1
│   └── 💬 Comment 2
└── 📝 Post 2
    └── 💬 Comment 3
```

---

## 🏗️ Database dalam Arsitektur Aplikasi

### Traditional Architecture (3-Tier)

```
┌─────────────────┐
│   Client        │  (Browser, Mobile App)
│   (Frontend)    │
└────────┬────────┘
         │ HTTP Requests
         ▼
┌─────────────────┐
│   Server        │  (NestJS, Express)
│   (Backend)     │
└────────┬────────┘
         │ SQL Queries
         ▼
┌─────────────────┐
│   Database      │  (PostgreSQL, MySQL)
│   (Data Layer)  │
└─────────────────┘
```

### Real Example Flow

```
User clicks "Show Products"
         │
         ▼
Frontend sends GET /products
         │
         ▼
Backend receives request
         │
         ▼
Backend queries database:
SELECT * FROM products WHERE available = true
         │
         ▼
Database returns data
         │
         ▼
Backend formats response
         │
         ▼
Frontend displays products
```

---

## 📊 Database Statistics (Why They Matter)

### Performance Numbers

| Operation | Without DB | With DB (PostgreSQL) |
|-----------|-----------|---------------------|
| Store 1M records | 🐌 Minutes | ⚡ Seconds |
| Search in 1M records | 🐌 Linear scan | ⚡ Index lookup |
| Concurrent users | ❌ Conflicts | ✅ Transactions |
| Data loss risk | ⚠️ High | 🛡️ Low (ACID) |

### Industry Usage

```
🌐 Top Websites Use Databases:
├── Facebook: MySQL, Cassandra
├── Twitter: MySQL, Manhattan
├── Netflix: PostgreSQL, Cassandra
├── Spotify: PostgreSQL, Cassandra
└── Instagram: PostgreSQL
```

---

## 🎯 Use Cases - Kapan Butuh Database?

### ✅ PERLU Database

1. **E-commerce** 🛒
   - Products, Orders, Users, Payments
   - Need: Transactions, consistency

2. **Social Media** 📱
   - Users, Posts, Comments, Likes
   - Need: Relationships, fast queries

3. **Banking** 🏦
   - Accounts, Transactions, Balances
   - Need: ACID, integrity

4. **Blog/CMS** 📝
   - Posts, Authors, Categories
   - Need: Search, relationships

5. **SaaS Applications** 💼
   - Tenants, Users, Subscriptions
   - Need: Multi-tenancy, security

### ❌ TIDAK Perlu Database (Bisa pakai file)

1. **Static Website** 🌐
   - Just HTML/CSS/JS
   - No dynamic data

2. **Configuration Files** ⚙️
   - Settings, environment variables
   - Rarely change

3. **Temporary Cache** 💾
   - Session data, tokens
   - Can use Redis (in-memory)

---

## 🔍 Behind The Scenes: How Database Works

### Storage Layer

```
File System
├── data/
│   ├── users.dat       (actual data)
│   ├── products.dat
│   └── orders.dat
├── indexes/
│   ├── users_email.idx (for fast lookup)
│   └── products_sku.idx
└── logs/
    └── transaction.log (for recovery)
```

### Query Processing

```
1. Parser: "SELECT * FROM users WHERE id = 1"
           ↓
2. Planner: "Use index on id column"
           ↓
3. Executor: Fetch data from disk
           ↓
4. Result: Return to client
```

### ACID Properties

```
🔒 Atomicity    : All or nothing (transfer uang berhasil semua atau gagal semua)
✅ Consistency  : Data valid sesuai rules (balance tidak negatif)
🔐 Isolation    : Transactions tidak saling ganggu
💾 Durability   : Data tersimpan permanen (crash-safe)
```

---

## 🚀 Database Evolution

### Timeline

```
1960s: Flat Files
       └─ Sequential access, no relationships

1970s: Relational Databases (SQL)
       └─ Tables, joins, ACID
       └─ Oracle, MySQL, PostgreSQL

2000s: NoSQL
       └─ Flexible schema, horizontal scaling
       └─ MongoDB, Cassandra, Redis

2010s: NewSQL
       └─ SQL semantics + NoSQL scale
       └─ CockroachDB, Google Spanner

2020s: Cloud-Native Databases
       └─ Serverless, auto-scaling
       └─ PlanetScale, Supabase, Neon
```

---

## 💡 Key Concepts to Remember

### 1. **Schema**
Blueprint struktur database:
```sql
-- Schema definition
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255)
);
```

### 2. **CRUD Operations**
Basic operations semua database:
```
Create  → INSERT
Read    → SELECT
Update  → UPDATE
Delete  → DELETE
```

### 3. **Indexing**
Mempercepat pencarian:
```sql
-- Without index: scan 1 million rows
-- With index: jump directly to result

CREATE INDEX idx_email ON users(email);
```

### 4. **Transactions**
Group operations jadi satu unit:
```sql
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; -- Both succeed or both fail
```

---

## 🎓 Learning Path

```
Week 23 Journey:
├── Day 1-2: Database Fundamentals (You are here! 📍)
│   ├── What is database?
│   ├── Why important?
│   └── Types overview
│
├── Day 3-4: SQL Basics
│   ├── SELECT queries
│   ├── Filtering & Sorting
│   └── Basic operations
│
├── Day 5-7: Advanced SQL
│   ├── JOINs
│   ├── Subqueries
│   └── Optimization
│
└── Day 8-10: NestJS + Database
    ├── TypeORM setup
    ├── CRUD operations
    └── Real project
```

---

## 📝 Quiz Time!

Test pemahaman Anda:

### Question 1
**Kenapa tidak bisa pakai array JavaScript untuk menyimpan data user?**

<details>
<summary>Jawaban</summary>

❌ **Masalah dengan array:**
- Data hilang saat server restart
- Tidak ada validation
- Tidak bisa concurrent access
- Tidak bisa search complex queries
- Tidak bisa handle relationships

✅ **Database solves all of these!**
</details>

### Question 2
**Apa yang terjadi jika 2 user membeli produk terakhir di stock bersamaan?**

<details>
<summary>Jawaban</summary>

**Without database transaction:**
```javascript
// ❌ Race condition!
const stock = getStock(); // Both get stock = 1
if (stock > 0) {
  decreaseStock(); // Both succeed! Stock becomes -1
}
```

**With database transaction:**
```sql
-- ✅ Database handles locking
BEGIN;
SELECT stock FROM products WHERE id = 1 FOR UPDATE; -- Lock row
-- Only first user succeeds, second gets stock = 0
UPDATE products SET stock = stock - 1 WHERE id = 1;
COMMIT;
```
</details>

### Question 3
**Kapan sebaiknya pakai file vs database?**

<details>
<summary>Jawaban</summary>

**Pakai FILE jika:**
- Static content (HTML, images)
- Configuration (app settings)
- Temporary data (cache)
- Small amount of data

**Pakai DATABASE jika:**
- Dynamic data
- Need search & filter
- Multiple users
- Data relationships
- Need transactions
</details>

---

## 🛠️ Hands-On Preview

Di materi selanjutnya, kita akan belajar:

### Materi 02: What is Data?
- Tipe-tipe data
- Structured vs Unstructured
- Data modeling

### Materi 03: Database Management Systems
- PostgreSQL
- MySQL
- MongoDB
- Comparison

### Materi 04: SQL vs NoSQL
- Kapan pakai SQL?
- Kapan pakai NoSQL?
- Hybrid approach

---

## 📚 Additional Resources

### Recommended Reading
1. [PostgreSQL Documentation](https://www.postgresql.org/docs/)
2. [Database Design for Mere Mortals](https://www.amazon.com/Database-Design-Mere-Mortals-Hands/dp/0321884493)
3. [SQL Performance Explained](https://sql-performance-explained.com/)

### Video Tutorials
1. [Database Design Course - freeCodeCamp](https://www.youtube.com/watch?v=ztHopE5Wnpc)
2. [PostgreSQL Tutorial](https://www.youtube.com/watch?v=qw--VYLpxG4)

### Practice Platforms
1. [SQLBolt](https://sqlbolt.com/) - Interactive SQL lessons
2. [LeetCode Database](https://leetcode.com/problemset/database/) - SQL practice
3. [DB Fiddle](https://www.db-fiddle.com/) - Online SQL playground

---

## 🎯 Summary

**Key Takeaways:**

1. ✅ Database adalah **storage terorganisir** untuk aplikasi
2. ✅ Penting untuk **persistence, integrity, concurrent access**
3. ✅ Database handle **CRUD operations** dengan efficient
4. ✅ Provide **ACID properties** untuk data consistency
5. ✅ Essential untuk **modern web applications**

**Next Step:**
👉 Lanjut ke [Materi 02: What is Data?](./02-what-is-data.md)

---

**Happy Learning! 🚀**

Jika ada pertanyaan, jangan ragu untuk bertanya!
