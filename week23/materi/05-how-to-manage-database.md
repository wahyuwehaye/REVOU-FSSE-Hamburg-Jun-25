# 🛠️ How to Manage Database

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Install dan setup PostgreSQL
- ✅ Menggunakan database tools (psql, pgAdmin, DBeaver)
- ✅ Membuat dan manage databases
- ✅ Best practices database management

---

## 📥 Installing PostgreSQL

### Method 1: Direct Installation (macOS)

```bash
# Using Homebrew
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Check if running
brew services list | grep postgresql

# Create your first database
createdb mydb

# Connect to database
psql mydb
```

### Method 2: PostgreSQL.app (macOS - Easiest!)

```
1. Download from: https://postgresapp.com/
2. Drag to Applications folder
3. Click "Initialize" to create server
4. Done! PostgreSQL is running

Benefits:
✅ No terminal commands
✅ GUI for start/stop
✅ Includes pgAdmin
```

### Method 3: Official Installer (Windows/Linux)

```
1. Download from: https://www.postgresql.org/download/
2. Run installer
3. Follow setup wizard:
   - Choose password for postgres user
   - Default port: 5432
   - Select components (pgAdmin, Command Line Tools)
4. Add to PATH in environment variables
```

### Method 4: Docker (All Platforms)

```bash
# Pull PostgreSQL image
docker pull postgres:14

# Run PostgreSQL container
docker run --name my-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -d postgres:14

# Connect to database
docker exec -it my-postgres psql -U postgres -d mydb

# Stop container
docker stop my-postgres

# Start again
docker start my-postgres
```

**Why Docker?**
- ✅ Same environment on all machines
- ✅ Easy to delete and recreate
- ✅ No conflicts with other apps
- ✅ Perfect for development

### Method 5: Cloud Services (Production)

```
🌐 Free PostgreSQL Hosting:

1. Neon (neon.tech)
   - Serverless PostgreSQL
   - 1GB storage free
   - Auto-scaling

2. Supabase (supabase.com)
   - PostgreSQL + APIs
   - 500MB database free
   - Built-in dashboard

3. Railway (railway.app)
   - $5 free credit/month
   - Easy deploy
   - Auto backups

4. Render (render.com)
   - Free PostgreSQL
   - 90 days (then deleted if not accessed)
   - Easy setup

5. ElephantSQL (elephantsql.com)
   - 20MB free tier
   - Automatic backups
   - Dashboard included
```

---

## 🔧 Database Tools

### 1. **psql** (Command Line)

Built-in PostgreSQL command-line tool.

```bash
# Connect to database
psql -U username -d database_name

# Common commands:
\l              # List all databases
\c dbname       # Connect to database
\dt             # List tables
\d tablename    # Describe table structure
\q              # Quit

# Execute SQL
psql -U postgres -d mydb -c "SELECT * FROM users;"

# Execute SQL file
psql -U postgres -d mydb -f script.sql
```

**Pros:**
- ✅ Fast and lightweight
- ✅ Scriptable
- ✅ Available everywhere

**Cons:**
- ❌ Not beginner-friendly
- ❌ No visual interface

### 2. **pgAdmin** (GUI Tool)

Official PostgreSQL GUI tool.

```
Download: https://www.pgadmin.org/

Features:
✅ Visual query builder
✅ Database explorer
✅ Table data editor
✅ Query history
✅ ERD diagrams
✅ Import/Export data

Perfect for:
- Beginners
- Visual database design
- Data exploration
```

### 3. **DBeaver** (Universal Tool)

Free database tool for all databases.

```
Download: https://dbeaver.io/

Features:
✅ Supports PostgreSQL, MySQL, MongoDB, etc.
✅ SQL editor with autocomplete
✅ ER diagrams
✅ Data export (CSV, JSON, SQL)
✅ Visual query builder
✅ Dark mode 😎

Perfect for:
- Working with multiple databases
- Professional developers
- Data analysis
```

### 4. **TablePlus** (Modern GUI)

Beautiful database client (Mac/Windows).

```
Download: https://tableplus.com/

Features:
✅ Native app (fast!)
✅ Beautiful interface
✅ Multiple tabs
✅ SQL autocomplete
✅ Import/Export

Free tier limitations:
⚠️ 2 tabs only
⚠️ 2 database connections

Perfect for:
- Daily development work
- Quick database access
```

### 5. **VS Code Extensions**

```
Install in VS Code:

1. PostgreSQL (by Chris Kolkman)
   - Run queries from VS Code
   - Database explorer
   - 2M+ downloads

2. Database Client (by Weijan Chen)
   - Support all databases
   - Visual table editor
   - 1M+ downloads
```

---

## 🗄️ Database Management Basics

### Creating Databases

```sql
-- Using SQL
CREATE DATABASE mydb;

-- With encoding
CREATE DATABASE mydb 
  ENCODING 'UTF8'
  LC_COLLATE 'en_US.UTF-8'
  LC_CTYPE 'en_US.UTF-8';

-- Delete database
DROP DATABASE mydb;

-- Rename database
ALTER DATABASE mydb RENAME TO newdb;
```

```bash
# Using command line
createdb mydb
dropdb mydb
```

### Managing Users

```sql
-- Create user
CREATE USER myuser WITH PASSWORD 'mypassword';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;

-- Grant specific privileges
GRANT SELECT, INSERT ON users TO myuser;

-- Revoke privileges
REVOKE ALL ON users FROM myuser;

-- Delete user
DROP USER myuser;

-- List users
\du  -- in psql
```

### Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]

Examples:

Local:
postgresql://postgres:password@localhost:5432/mydb

Neon (Cloud):
postgresql://user:pass@ep-cool-name.us-east-2.aws.neon.tech/mydb?sslmode=require

Supabase:
postgresql://postgres:pass@db.projectid.supabase.co:5432/postgres
```

---

## 📊 Database Operations

### Backup & Restore

```bash
# Backup entire database
pg_dump mydb > backup.sql

# Backup with custom format (compressed)
pg_dump -Fc mydb > backup.dump

# Backup specific table
pg_dump -t users mydb > users_backup.sql

# Restore from backup
psql mydb < backup.sql

# Restore custom format
pg_restore -d mydb backup.dump

# Backup all databases
pg_dumpall > all_databases.sql
```

### Database Size & Statistics

```sql
-- Database size
SELECT pg_size_pretty(pg_database_size('mydb'));

-- Table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Number of connections
SELECT count(*) FROM pg_stat_activity;

-- Active queries
SELECT pid, query, state 
FROM pg_stat_activity 
WHERE state = 'active';

-- Kill query
SELECT pg_terminate_backend(pid);
```

---

## 🔐 Security Best Practices

### 1. **Strong Passwords**

```sql
-- ❌ BAD
CREATE USER admin WITH PASSWORD '123456';

-- ✅ GOOD
CREATE USER admin WITH PASSWORD 'aB3$xK9#mN2@pQ7!';
```

### 2. **Principle of Least Privilege**

```sql
-- ❌ BAD: Give all permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;

-- ✅ GOOD: Only what's needed
GRANT SELECT, INSERT, UPDATE ON users TO app_user;
GRANT SELECT ON products TO app_user;  -- Read-only for products
```

### 3. **Use Environment Variables**

```javascript
// ❌ BAD: Hardcoded credentials
const db = new Database({
  host: 'localhost',
  user: 'admin',
  password: 'secret123'  // NEVER do this!
});

// ✅ GOOD: Environment variables
const db = new Database({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});
```

### 4. **SSL/TLS Connections**

```javascript
// Production connection with SSL
const db = new Database({
  host: process.env.DB_HOST,
  ssl: {
    rejectUnauthorized: true
  }
});
```

### 5. **Regular Backups**

```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump mydb > "backup_${DATE}.sql"

# Keep only last 7 days
find ./backups -name "backup_*.sql" -mtime +7 -delete

# Run daily with cron
# 0 2 * * * /path/to/backup.sh
```

---

## 🚀 Performance Monitoring

### Key Metrics to Watch

```sql
-- 1. Cache Hit Ratio (should be >99%)
SELECT 
  round(100 * sum(heap_blks_hit) / nullif(sum(heap_blks_hit) + sum(heap_blks_read), 0), 2) AS cache_hit_ratio
FROM pg_statio_user_tables;

-- 2. Index Usage (should be >95%)
SELECT 
  schemaname,
  tablename,
  round(100 * idx_scan / nullif(seq_scan + idx_scan, 0), 2) AS index_usage_percent
FROM pg_stat_user_tables
ORDER BY seq_scan DESC;

-- 3. Table Bloat
SELECT 
  schemaname,
  tablename,
  round(100 * pg_relation_size(schemaname||'.'||tablename) / nullif(pg_total_relation_size(schemaname||'.'||tablename), 0), 2) AS bloat_percent
FROM pg_tables
WHERE schemaname = 'public';

-- 4. Slow Queries
SELECT 
  query,
  calls,
  round(mean_exec_time::numeric, 2) AS avg_time_ms
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

## 📝 Database Maintenance

### Regular Tasks

```sql
-- 1. VACUUM (Clean up dead rows)
VACUUM users;
VACUUM FULL users;  -- More aggressive, locks table

-- 2. ANALYZE (Update statistics)
ANALYZE users;

-- 3. REINDEX (Rebuild indexes)
REINDEX TABLE users;

-- 4. Combined (recommended)
VACUUM ANALYZE users;
```

### Automated Maintenance

```sql
-- Enable autovacuum (default in PostgreSQL)
ALTER TABLE users SET (autovacuum_enabled = true);

-- Adjust autovacuum settings
ALTER TABLE users SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);
```

---

## 🔧 Configuration Files

### postgresql.conf (Main Configuration)

```ini
# Location: /var/lib/postgresql/data/postgresql.conf

# Connection Settings
max_connections = 100
port = 5432

# Memory
shared_buffers = 256MB        # 25% of RAM
effective_cache_size = 1GB    # 50-75% of RAM
work_mem = 4MB

# Write-Ahead Log
wal_level = replica
max_wal_size = 1GB

# Query Planner
random_page_cost = 1.1        # For SSD
effective_io_concurrency = 200  # For SSD
```

### pg_hba.conf (Authentication)

```ini
# Location: /var/lib/postgresql/data/pg_hba.conf

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# Local connections
local   all             all                                     trust

# IPv4 local connections
host    all             all             127.0.0.1/32            md5

# IPv6 local connections
host    all             all             ::1/128                 md5

# Allow remote connections (production)
host    mydb            myuser          0.0.0.0/0               md5
```

---

## 📝 Quiz Time!

### Question 1
**Apa cara paling mudah install PostgreSQL untuk pemula?**

<details>
<summary>Jawaban</summary>

**Untuk pemula, pilih berdasarkan OS:**

**macOS:**
- ✅ PostgreSQL.app (paling mudah!)
  - GUI untuk start/stop
  - No terminal commands
  - Includes pgAdmin

**Windows:**
- ✅ Official installer dari postgresql.org
  - Setup wizard
  - Includes pgAdmin
  - Auto-configure

**All Platforms (punya Docker):**
- ✅ Docker container
  - Clean environment
  - Easy to reset
  - Same for all OS

**Production/Cloud:**
- ✅ Neon or Supabase
  - No installation
  - Free tier
  - Instant setup
</details>

### Question 2
**Tool apa yang cocok untuk berbagai use case?**

<details>
<summary>Jawaban</summary>

**psql (Command Line):**
- ✅ Scripts & automation
- ✅ SSH/remote access
- ✅ Fast operations

**pgAdmin:**
- ✅ Beginners
- ✅ Visual database design
- ✅ Official tool

**DBeaver:**
- ✅ Multiple databases
- ✅ Professional work
- ✅ Free & powerful

**TablePlus:**
- ✅ Daily development
- ✅ Beautiful UI
- ⚠️ Limited free tier

**VS Code Extension:**
- ✅ While coding
- ✅ Quick queries
- ✅ Integrated workflow
</details>

### Question 3
**Backup strategy yang baik seperti apa?**

<details>
<summary>Jawaban</summary>

**Best Practices:**

```bash
# 1. Automated daily backups
0 2 * * * /path/to/backup.sh

# 2. Multiple backup locations
- Local disk
- Cloud storage (S3, GCS)
- Different physical location

# 3. Retention policy
- Daily: Keep 7 days
- Weekly: Keep 4 weeks
- Monthly: Keep 12 months

# 4. Test restores regularly
# Backup useless if can't restore!

# 5. Monitor backup size
# Ensure backups completing successfully
```

**Cloud services (Neon, Supabase) include:**
- Automatic backups
- Point-in-time recovery
- Easy restore
</details>

---

## 🎯 Summary

**Key Takeaways:**

1. ✅ **Install:** Docker, PostgreSQL.app, atau cloud (Neon/Supabase)
2. ✅ **Tools:** psql (CLI), pgAdmin/DBeaver (GUI), VS Code extensions
3. ✅ **Security:** Strong passwords, least privilege, environment variables
4. ✅ **Backups:** Automated, multiple locations, test restores
5. ✅ **Monitoring:** Cache hit ratio, index usage, slow queries

**Quick Start Checklist:**

```
☑️ Install PostgreSQL (choose method)
☑️ Install GUI tool (pgAdmin or DBeaver)
☑️ Create first database
☑️ Create user with strong password
☑️ Setup connection string
☑️ Test connection
☑️ Setup automated backups (later)
```

**Next Step:**
👉 Lanjut ke [Materi 06: Introduction to SQL](./06-introduction-to-sql.md)

---

**Happy Learning! 🚀**
