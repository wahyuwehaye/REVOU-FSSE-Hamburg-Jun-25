# 🔌 Menghubungkan NestJS dengan Database PostgreSQL

## 📋 Daftar Isi

1. [Pengantar](#pengantar)
2. [Apa itu Database Connection?](#apa-itu-database-connection)
3. [Persiapan Sebelum Mulai](#persiapan-sebelum-mulai)
4. [Step-by-Step Setup Connection](#step-by-step-setup-connection)
5. [Testing Connection](#testing-connection)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

---

## 📖 Pengantar

Bayangkan aplikasi NestJS Anda seperti sebuah **toko online**. Toko ini perlu tempat untuk menyimpan data produk, data pelanggan, dan transaksi. Database adalah **gudang penyimpanan** data tersebut.

**Menghubungkan NestJS dengan Database** adalah seperti membuat **jembatan** antara toko (aplikasi) dengan gudang (database). Tanpa jembatan ini, aplikasi tidak bisa menyimpan atau mengambil data.

### 🎯 Tujuan Pembelajaran

Setelah mempelajari materi ini, Anda akan bisa:

✅ Memahami konsep koneksi database  
✅ Install dan setup PostgreSQL  
✅ Menghubungkan NestJS dengan PostgreSQL menggunakan TypeORM  
✅ Konfigurasi environment variables  
✅ Test koneksi database  
✅ Handle error koneksi  

### ⏱️ Estimasi Waktu

**Total:** 2-3 jam
- Teori: 30 menit
- Praktik: 1.5-2 jam
- Troubleshooting: 30 menit

---

## 🤔 Apa itu Database Connection?

### Analogi Sederhana

**Koneksi Database = Telepon ke Gudang**

```
┌─────────────────┐                    ┌──────────────────┐
│   Aplikasi      │   Connection       │    Database      │
│   (NestJS)      │ ═════════════════► │  (PostgreSQL)    │
│                 │                    │                  │
│  "Ambil data    │                    │  "Oke, ini       │
│   user id=1"    │                    │   datanya..."    │
└─────────────────┘                    └──────────────────┘
```

**Tanpa koneksi:**
- ❌ Aplikasi tidak bisa simpan data
- ❌ Aplikasi tidak bisa baca data
- ❌ Data hilang saat restart server

**Dengan koneksi:**
- ✅ Data tersimpan permanen
- ✅ Data bisa diakses kapan saja
- ✅ Banyak user bisa akses data yang sama

### Komponen yang Dibutuhkan

```
┌──────────────────────────────────────────────────────┐
│           KONEKSI DATABASE (Connection)              │
├──────────────────────────────────────────────────────┤
│                                                      │
│  1. HOST        → Di mana database berada?          │
│                   (localhost, IP address)            │
│                                                      │
│  2. PORT        → Pintu masuk database              │
│                   (default PostgreSQL: 5432)         │
│                                                      │
│  3. USERNAME    → Siapa yang akses?                 │
│                   (postgres, myuser, dll)            │
│                                                      │
│  4. PASSWORD    → Kata sandi untuk keamanan         │
│                   (rahasia!)                         │
│                                                      │
│  5. DATABASE    → Nama gudang data yang dituju      │
│                   (myapp_db, library_db)             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Kenapa Pakai TypeORM?

**TypeORM** = Jembatan pintar yang memudahkan komunikasi

**Tanpa TypeORM (SQL Mentah):**
```typescript
// ❌ Harus tulis SQL manual
const result = await client.query(
  'SELECT * FROM users WHERE id = $1', 
  [userId]
);
```

**Dengan TypeORM:**
```typescript
// ✅ Lebih mudah dibaca dan ditulis
const user = await userRepository.findOne({ 
  where: { id: userId } 
});
```

**Keuntungan TypeORM:**
- 🎯 Type-safe (TypeScript support)
- 🔄 Auto-generate SQL queries
- 🛡️ Protection dari SQL Injection
- 📦 Support multiple databases (PostgreSQL, MySQL, etc)
- 🔧 Migration tools built-in

---

## 🛠️ Persiapan Sebelum Mulai

### 1. Install PostgreSQL

**Cek apakah sudah terinstall:**

```bash
psql --version
# Output: psql (PostgreSQL) 14.x
```

**Jika belum terinstall:**

**macOS:**
```bash
# Menggunakan Homebrew
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Verify
psql --version
```

**Linux (Ubuntu/Debian):**
```bash
# Install
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify
psql --version
```

**Windows:**
- Download dari [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
- Install dengan wizard
- Ingat password yang Anda set!

### 2. Create Database

```bash
# Login ke PostgreSQL (macOS/Linux)
psql postgres

# Atau jika ada user postgres (Linux)
sudo -u postgres psql

# Buat database baru
CREATE DATABASE todo_app;

# List semua database
\l

# Keluar
\q
```

**Alternatif: Buat database via command line**

```bash
# macOS/Linux
createdb todo_app

# Verify
psql -l | grep todo_app
```

### 3. Create NestJS Project

```bash
# Install NestJS CLI (jika belum)
npm install -g @nestjs/cli

# Buat project baru
nest new todo-app

# Pilih package manager (npm/yarn/pnpm)
# Masuk ke folder project
cd todo-app
```

### 4. Install Dependencies

```bash
# Install TypeORM dan PostgreSQL driver
npm install @nestjs/typeorm typeorm pg

# Install dotenv untuk environment variables
npm install @nestjs/config

# Install class validator dan transformer
npm install class-validator class-transformer
```

**Penjelasan packages:**

| Package | Fungsi |
|---------|--------|
| `@nestjs/typeorm` | Integrasi TypeORM dengan NestJS |
| `typeorm` | ORM library utama |
| `pg` | PostgreSQL driver (connector) |
| `@nestjs/config` | Manage environment variables |
| `class-validator` | Validasi data input |
| `class-transformer` | Transform plain object to class |

---

## 🔧 Step-by-Step Setup Connection

### Step 1: Buat File Environment Variables

**Kenapa butuh .env?**

❌ **Jangan hardcode credentials:**
```typescript
// ❌ BAHAYA! Password kelihatan!
TypeOrmModule.forRoot({
  password: 'mypassword123',  // Kelihatan semua orang!
})
```

✅ **Gunakan .env file:**
```typescript
// ✅ AMAN! Password di file terpisah
password: process.env.DATABASE_PASSWORD,
```

**Buat file `.env` di root project:**

```bash
# Create .env file
touch .env

# Edit dengan editor favorit
nano .env
# atau
code .env
```

**Isi `.env`:**

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=
DATABASE_NAME=todo_app

# Application Configuration
PORT=3000
NODE_ENV=development
```

**Penjelasan setiap variable:**

```env
# 1. Host - Di mana database berada?
DATABASE_HOST=localhost           # Local computer
# DATABASE_HOST=192.168.1.100    # Komputer lain di network
# DATABASE_HOST=db.example.com   # Remote server

# 2. Port - Pintu masuk database
DATABASE_PORT=5432                # Default PostgreSQL port

# 3. Username - Nama user database
DATABASE_USERNAME=postgres        # Default user (macOS/Windows)
# DATABASE_USERNAME=wehaye        # User sistem (Linux/macOS)

# 4. Password - Kata sandi (kosong jika tidak ada)
DATABASE_PASSWORD=                # Kosong untuk local development
# DATABASE_PASSWORD=secret123     # Isi jika ada password

# 5. Database Name - Nama database yang dibuat
DATABASE_NAME=todo_app            # Harus sama dengan CREATE DATABASE
```

**⚠️ PENTING: Add .env to .gitignore**

```bash
# Edit .gitignore
echo ".env" >> .gitignore
```

Ini mencegah password ter-upload ke GitHub!

### Step 2: Setup Config Module

**Buat `src/config/database.config.ts`:**

```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'todo_app',
  
  // Development settings
  synchronize: process.env.NODE_ENV === 'development',  // ⚠️ Only for dev!
  logging: process.env.NODE_ENV === 'development',      // Show SQL queries
  
  // Entities location
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  
  // Additional options
  autoLoadEntities: true,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
```

**📝 Penjelasan baris per baris:**

```typescript
// 1. Type database yang digunakan
type: 'postgres',
// Bisa juga: 'mysql', 'mariadb', 'sqlite', 'mongodb', dll

// 2. Host - ambil dari environment variable
host: process.env.DATABASE_HOST || 'localhost',
// Format: process.env.VARIABLE_NAME || 'default_value'
// Jika .env tidak ada, pakai 'localhost'

// 3. Port - convert string ke number
port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
// parseInt() mengubah "5432" (string) jadi 5432 (number)
// 10 = decimal system

// 4. Username dan Password
username: process.env.DATABASE_USERNAME || 'postgres',
password: process.env.DATABASE_PASSWORD || '',

// 5. Database name
database: process.env.DATABASE_NAME || 'todo_app',

// 6. Synchronize - AUTO CREATE/UPDATE TABLES
synchronize: process.env.NODE_ENV === 'development',
// ✅ Development: true  - auto buat table
// ❌ Production: false - pakai migrations (akan dibahas later)

// 7. Logging - Show SQL queries di console
logging: process.env.NODE_ENV === 'development',
// Useful untuk debugging

// 8. Entities - Di mana file entity berada?
entities: [__dirname + '/../**/*.entity{.ts,.js}'],
// Pattern: semua file yang berakhiran .entity.ts atau .entity.js
// ** = semua folder recursively
// Contoh: src/users/user.entity.ts akan otomatis ke-load

// 9. Auto load entities
autoLoadEntities: true,
// TypeORM otomatis import entities dari modules

// 10. SSL - Untuk production (cloud database)
ssl: process.env.NODE_ENV === 'production' 
  ? { rejectUnauthorized: false } 
  : false,
```

### Step 3: Update App Module

**Edit `src/app.module.ts`:**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    // 1. Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,           // Available in all modules
      envFilePath: '.env',      // Path to .env file
    }),
    
    // 2. Setup database connection
    TypeOrmModule.forRoot(databaseConfig()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**📝 Penjelasan:**

```typescript
// ConfigModule.forRoot() - Load .env file
ConfigModule.forRoot({
  isGlobal: true,
  // isGlobal: true berarti semua module bisa akses process.env
  // Tidak perlu import ConfigModule di setiap module
  
  envFilePath: '.env',
  // Lokasi file environment variables
  // Bisa juga: '.env.development', '.env.production'
})

// TypeOrmModule.forRoot() - Setup database connection
TypeOrmModule.forRoot(databaseConfig())
// Memanggil function databaseConfig() yang kita buat tadi
// Return TypeOrmModuleOptions
```

### Step 4: Update Main.ts (Optional tapi Recommended)

**Edit `src/main.ts`:**

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,              // Remove unknown properties
    forbidNonWhitelisted: true,   // Throw error on unknown properties
    transform: true,              // Auto transform to DTO types
  }));
  
  // Get port from environment or use default
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_NAME}`);
}

bootstrap();
```

### Step 5: Create Folder Structure

```bash
# Create folders
mkdir -p src/config
mkdir -p src/common
mkdir -p src/modules
```

**Final structure:**

```
todo-app/
├── src/
│   ├── config/
│   │   └── database.config.ts    ✅ Database configuration
│   ├── common/                   (untuk shared code nanti)
│   ├── modules/                  (untuk feature modules)
│   ├── app.module.ts             ✅ Updated
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts                   ✅ Updated
├── .env                          ✅ Created
├── .gitignore                    ✅ Updated
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## ✅ Testing Connection

### Test 1: Build Application

```bash
# Build TypeScript to JavaScript
npm run build

# Expected output:
# ✓ Successfully compiled
# No errors
```

**Jika ada error:**

❌ **Module not found:**
```bash
# Install ulang dependencies
rm -rf node_modules package-lock.json
npm install
```

❌ **TypeScript errors:**
```bash
# Check tsconfig.json
# Make sure "strict": false untuk belajar
```

### Test 2: Run Application

```bash
# Start development mode
npm run start:dev

# Watch for successful messages:
# [Nest] LOG [InstanceLoader] TypeOrmModule dependencies initialized
# [Nest] LOG [InstanceLoader] ConfigModule dependencies initialized
# [Nest] LOG [RoutesResolver] AppController {/}: +3ms
# 🚀 Application is running on: http://localhost:3000
```

**Penjelasan log messages:**

```
[Nest] LOG [InstanceLoader] TypeOrmModule dependencies initialized
                              ↑
                          Ini yang penting!
                    TypeORM berhasil connect ke database
```

**Jika muncul error:**

❌ **Connection refused:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432

Penyebab: PostgreSQL belum running
Solusi:
  # macOS
  brew services start postgresql@14
  
  # Linux
  sudo systemctl start postgresql
```

❌ **Authentication failed:**
```
Error: password authentication failed for user "postgres"

Penyebab: Password salah di .env
Solusi: Check DATABASE_PASSWORD di .env
```

❌ **Database does not exist:**
```
Error: database "todo_app" does not exist

Penyebab: Database belum dibuat
Solusi:
  createdb todo_app
```

### Test 3: Check Database Connection dengan Query

**Buat test endpoint di `src/app.controller.ts`:**

```typescript
import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    @InjectConnection()
    private connection: Connection,
  ) {}

  @Get()
  getHello(): string {
    return 'Todo App API is running!';
  }

  @Get('health')
  async checkHealth() {
    try {
      // Try to query database
      await this.connection.query('SELECT 1');
      
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
        error: error.message,
      };
    }
  }

  @Get('db-info')
  async getDatabaseInfo() {
    try {
      const result = await this.connection.query(`
        SELECT 
          current_database() as database_name,
          current_user as username,
          version() as postgres_version
      `);
      
      return {
        status: 'connected',
        info: result[0],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }
}
```

**Test dengan cURL atau browser:**

```bash
# Test 1: Basic health check
curl http://localhost:3000/health

# Expected response:
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-12-04T10:30:00.000Z"
}

# Test 2: Database info
curl http://localhost:3000/db-info

# Expected response:
{
  "status": "connected",
  "info": {
    "database_name": "todo_app",
    "username": "postgres",
    "postgres_version": "PostgreSQL 14.x on ..."
  }
}
```

**Atau buka di browser:**
- http://localhost:3000/health
- http://localhost:3000/db-info

### Test 4: Check di PostgreSQL CLI

```bash
# Login ke database
psql todo_app

# Check connections
SELECT * FROM pg_stat_activity WHERE datname = 'todo_app';

# Should show connection from your NestJS app

# Exit
\q
```

---

## 🔍 Troubleshooting

### Problem 1: PostgreSQL Not Running

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**

```bash
# Check if PostgreSQL is running
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Start PostgreSQL
# macOS
brew services start postgresql@14

# Linux
sudo systemctl start postgresql
sudo systemctl enable postgresql  # Auto-start on boot
```

### Problem 2: Wrong Credentials

**Symptoms:**
```
Error: password authentication failed for user "postgres"
```

**Solutions:**

1. **Check username:**
```bash
# macOS - Usually your system username
whoami

# Update .env
DATABASE_USERNAME=your_username
```

2. **Check if password needed:**
```bash
# Try connecting without password
psql -U postgres -d todo_app

# If works, leave PASSWORD empty in .env
DATABASE_PASSWORD=
```

3. **Reset PostgreSQL password (if needed):**
```bash
# macOS/Linux
psql postgres
ALTER USER postgres PASSWORD 'newpassword';
\q

# Update .env
DATABASE_PASSWORD=newpassword
```

### Problem 3: Database Not Found

**Symptoms:**
```
Error: database "todo_app" does not exist
```

**Solution:**

```bash
# Create database
createdb todo_app

# Or via psql
psql postgres
CREATE DATABASE todo_app;
\q

# Verify
psql -l | grep todo_app
```

### Problem 4: Port Already in Use

**Symptoms:**
```
Error: Port 3000 is already in use
```

**Solution:**

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port in .env
PORT=3001
```

### Problem 5: Module Not Found

**Symptoms:**
```
Error: Cannot find module '@nestjs/typeorm'
```

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Problem 6: Synchronize Not Working

**Symptoms:**
- Tables tidak otomatis terbuat
- Entity changes tidak apply

**Check:**

```typescript
// Pastikan synchronize: true di config
synchronize: process.env.NODE_ENV === 'development',

// Check NODE_ENV
console.log('Environment:', process.env.NODE_ENV);
// Should be 'development'
```

---

## 🎯 Best Practices

### 1. Environment Variables

✅ **DO:**
```env
# .env
DATABASE_PASSWORD=secret123
```

```typescript
// .gitignore
.env
.env.*
!.env.example
```

❌ **DON'T:**
```typescript
// ❌ Hardcoded password
const config = {
  password: 'secret123'
}
```

### 2. Multiple Environments

**Buat `.env.example` untuk team:**

```env
# .env.example
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=
DATABASE_NAME=todo_app
PORT=3000
NODE_ENV=development
```

**Buat config per environment:**

```bash
.env                    # Local development (gitignore)
.env.development        # Development server
.env.staging            # Staging server
.env.production         # Production server
.env.example            # Template (commit to git)
```

**Load specific env:**

```typescript
// src/app.module.ts
ConfigModule.forRoot({
  envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
  isGlobal: true,
})
```

### 3. Connection Pooling

**Default sudah optimal, tapi bisa customize:**

```typescript
// database.config.ts
export const databaseConfig = (): TypeOrmModuleOptions => ({
  // ... other config
  
  // Connection pool settings
  extra: {
    max: 10,                    // Maximum connections
    min: 2,                     // Minimum connections
    idleTimeoutMillis: 30000,   // Close idle connection after 30s
    connectionTimeoutMillis: 2000, // Wait 2s before timeout
  },
});
```

### 4. Graceful Shutdown

**Handle shutdown dengan benar:**

```typescript
// src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable shutdown hooks
  app.enableShutdownHooks();
  
  // Handle SIGTERM
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing application...');
    await app.close();
  });
  
  await app.listen(3000);
}
```

### 5. Health Checks

**Implement proper health check:**

```typescript
// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private connection: Connection) {}

  @Get()
  async check() {
    const dbHealthy = await this.checkDatabase();
    
    return {
      status: dbHealthy ? 'ok' : 'error',
      database: dbHealthy ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.connection.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}
```

### 6. Error Handling

**Wrap database operations dengan try-catch:**

```typescript
// ✅ Good
try {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
} catch (error) {
  if (error instanceof NotFoundException) {
    throw error;
  }
  throw new InternalServerErrorException('Database error');
}

// ❌ Bad
const user = await this.userRepository.findOne({ where: { id } });
// No error handling!
```

---

## 📚 Kesimpulan

### Yang Sudah Dipelajari

✅ Konsep database connection  
✅ Setup PostgreSQL  
✅ Install dependencies (TypeORM, pg, @nestjs/config)  
✅ Konfigurasi environment variables  
✅ Setup TypeORM di NestJS  
✅ Test connection  
✅ Troubleshooting common errors  
✅ Best practices  

### Checklist Setup

```
☑️ PostgreSQL terinstall dan running
☑️ Database todo_app sudah dibuat
☑️ NestJS project sudah dibuat
☑️ Dependencies terinstall
☑️ File .env sudah dibuat dan configured
☑️ database.config.ts sudah dibuat
☑️ app.module.ts sudah diupdate
☑️ Application bisa running tanpa error
☑️ Health check endpoint working
☑️ .env sudah di-gitignore
```

### Langkah Selanjutnya

Setelah koneksi berhasil, kita akan belajar:

1. ✏️ **CRUD dengan Raw Queries** - Query SQL langsung
2. 📦 **CRUD dengan TypeORM** - Menggunakan entities
3. 🔄 **Migrations** - Version control untuk database schema
4. 🌱 **Seeding** - Insert data awal

---

## 🔗 Quick Reference

### Environment Variables Template

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=
DATABASE_NAME=todo_app
PORT=3000
NODE_ENV=development
```

### Database Config Template

```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'todo_app',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
});
```

### Common Commands

```bash
# PostgreSQL
brew services start postgresql@14    # Start
brew services stop postgresql@14     # Stop
psql todo_app                        # Connect
createdb todo_app                    # Create DB
dropdb todo_app                      # Delete DB

# NestJS
npm run start:dev                    # Development
npm run build                        # Build
npm run start:prod                   # Production

# Check
lsof -i :3000                        # Port usage
psql -l                              # List databases
```

---

**🎉 Selamat! Anda sudah berhasil menghubungkan NestJS dengan PostgreSQL!**

Selanjutnya kita akan belajar cara melakukan operasi CRUD (Create, Read, Update, Delete) menggunakan raw queries dan TypeORM.

---

📖 **Next:** [24-crud-raw-queries.md](./24-crud-raw-queries.md)
