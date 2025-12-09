# 🔄 Database Migrations dan Seeding

## 📋 Daftar Isi

1. [Pengantar](#pengantar)
2. [Apa itu Migrations?](#apa-itu-migrations)
3. [Setup TypeORM CLI](#setup-typeorm-cli)
4. [Creating Migrations](#creating-migrations)
5. [Running Migrations](#running-migrations)
6. [Reverting Migrations](#reverting-migrations)
7. [Apa itu Seeding?](#apa-itu-seeding)
8. [Creating Seeds](#creating-seeds)
9. [Best Practices](#best-practices)
10. [Real-World Scenarios](#real-world-scenarios)

---

## 📖 Pengantar

Bayangkan Anda punya aplikasi yang sudah jalan di production dengan 1000 user. Tiba-tiba perlu tambah kolom `email` ke table `users`. Bagaimana caranya tanpa hapus data yang ada?

**Jawabannya: Migrations!**

### 🎯 Tujuan Pembelajaran

✅ Memahami konsep database migrations  
✅ Setup TypeORM CLI untuk migrations  
✅ Membuat migration files  
✅ Menjalankan dan revert migrations  
✅ Memahami konsep seeding  
✅ Membuat seed data untuk development/testing  
✅ Version control untuk database schema  

### ⏱️ Estimasi Waktu

**Total:** 2-3 jam
- Teori: 30 menit
- Setup: 30 menit
- Praktik: 1-1.5 jam
- Exercise: 30 menit

---

## 🤔 Apa itu Migrations?

### Analogi Sederhana

**Migrations = Version Control untuk Database**

```
Git untuk Code:               Migrations untuk Database:
┌────────────────┐           ┌────────────────┐
│ commit 1       │           │ migration 1    │
│ commit 2       │           │ migration 2    │
│ commit 3       │           │ migration 3    │
└────────────────┘           └────────────────┘

git checkout v1  →  Go back   migrate:revert  →  Rollback
git pull         →  Update    migrate:run     →  Update DB
```

### Kenapa Butuh Migrations?

#### ❌ Tanpa Migrations (Problem)

```typescript
// app.module.ts
TypeOrmModule.forRoot({
  synchronize: true,  // ⚠️ BAHAYA di production!
})
```

**Problems:**
1. **Data Loss**
   ```
   Before: users table dengan 1000 user
   Change: Rename column 'name' → 'full_name'
   Result: Column 'name' hilang beserta datanya! 💥
   ```

2. **Tidak ada history**
   ```
   Siapa yang ubah schema?
   Kapan diubah?
   Kenapa diubah?
   → Tidak tahu! 😱
   ```

3. **Susah rollback**
   ```
   Migration error → Stuck!
   Tidak bisa undo changes
   ```

4. **Team collaboration nightmare**
   ```
   Developer A: Add column X
   Developer B: Add column Y
   Merge: Conflict di database! 💥
   ```

#### ✅ Dengan Migrations (Solution)

```typescript
// app.module.ts
TypeOrmModule.forRoot({
  synchronize: false,  // ✅ Use migrations
  migrations: ['dist/migrations/**/*.js'],
})
```

**Benefits:**
1. **Tracked Changes**
   ```
   migrations/
   ├── 1701234567890-CreateUsersTable.ts
   ├── 1701234598765-AddEmailToUsers.ts
   └── 1701234623456-CreateTasksTable.ts
   
   Clear history! 📜
   ```

2. **Safe Updates**
   ```sql
   -- Instead of DROP + CREATE
   ALTER TABLE users ADD COLUMN email VARCHAR(255);
   
   -- Data preserved! ✅
   ```

3. **Rollback Support**
   ```bash
   npm run migration:revert
   # Undo last migration safely
   ```

4. **Team Friendly**
   ```bash
   # Developer A
   git pull
   npm run migration:run
   # Database updated automatically!
   ```

### Migration Workflow

```
┌─────────────────────────────────────────────────────────┐
│              MIGRATION WORKFLOW                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Development                                         │
│     ├─ Create entity                                    │
│     ├─ Generate migration                               │
│     └─ Test locally                                     │
│                                                         │
│  2. Version Control                                     │
│     ├─ Commit migration file                            │
│     └─ Push to repository                               │
│                                                         │
│  3. Staging/Production                                  │
│     ├─ Pull code                                        │
│     ├─ Run migration                                    │
│     └─ Database updated! ✅                             │
│                                                         │
│  4. Rollback (if needed)                                │
│     └─ Revert migration                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Migration vs Synchronize

| Feature | synchronize: true | Migrations |
|---------|------------------|------------|
| **Development** | ✅ Fast & easy | ⚠️ Extra step |
| **Production** | ❌ Dangerous! | ✅ Safe |
| **History** | ❌ No tracking | ✅ Full history |
| **Rollback** | ❌ No way | ✅ Easy revert |
| **Team Work** | ❌ Conflicts | ✅ Smooth |
| **Data Safety** | ❌ Can lose data | ✅ Preserved |

**Recommendation:**
```typescript
// Development
synchronize: process.env.NODE_ENV === 'development',  // OK
migrations: [],

// Production
synchronize: false,  // MUST!
migrations: ['dist/migrations/**/*.js'],
```

---

## 🛠️ Setup TypeORM CLI

### Step 1: Install TypeORM CLI Dependencies

```bash
# Install ts-node untuk run TypeScript
npm install --save-dev ts-node

# Verify installation
npx ts-node --version
```

### Step 2: Create DataSource Configuration

**Buat `src/config/data-source.ts`:**

```typescript
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'todo_app',
  
  // Important: Point to source files for CLI
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  
  // Synchronize MUST be false when using migrations
  synchronize: false,
  
  logging: true,
});
```

**📝 Penjelasan:**

```typescript
// Entities: Lokasi entity files
entities: ['src/**/*.entity.ts'],
// CLI butuh .ts files (source)
// Runtime butuh .js files (compiled)

// Migrations: Lokasi migration files
migrations: ['src/migrations/*.ts'],

// Synchronize FALSE
synchronize: false,
// Wajib false! Biar pakai migrations
```

### Step 3: Update package.json Scripts

**Edit `package.json`:**

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    
    "typeorm": "typeorm-ts-node-commonjs -d src/config/data-source.ts",
    "migration:generate": "npm run typeorm -- migration:generate",
    "migration:create": "npm run typeorm -- migration:create",
    "migration:run": "npm run typeorm -- migration:run",
    "migration:revert": "npm run typeorm -- migration:revert",
    "migration:show": "npm run typeorm -- migration:show"
  }
}
```

**📝 Penjelasan Scripts:**

```bash
# migration:generate - Auto generate dari entities
npm run migration:generate src/migrations/CreateUsersTable

# migration:create - Manual create empty migration
npm run migration:create src/migrations/AddIndexes

# migration:run - Jalankan pending migrations
npm run migration:run

# migration:revert - Undo last migration
npm run migration:revert

# migration:show - Lihat status migrations
npm run migration:show
```

### Step 4: Create Migrations Folder

```bash
mkdir -p src/migrations
```

### Step 5: Update app.module.ts

**Edit `src/app.module.ts`:**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './config/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Use DataSource configuration
    TypeOrmModule.forRoot(AppDataSource.options),
  ],
})
export class AppModule {}
```

---

## 📝 Creating Migrations

### Method 1: Generate from Entity (Recommended)

**Step 1: Create Entity**

**Buat `src/users/entities/user.entity.ts`:**

```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 50, default: 'user' })
  role: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

**Step 2: Generate Migration**

```bash
# Generate migration from entity changes
npm run migration:generate src/migrations/CreateUsersTable
```

**Output:**

```
Migration /path/to/src/migrations/1701234567890-CreateUsersTable.ts has been generated successfully.
```

**Generated file `src/migrations/1701234567890-CreateUsersTable.ts`:**

```typescript
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1701234567890 implements MigrationInterface {
    name = 'CreateUsersTable1701234567890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "email" character varying(255) NOT NULL,
                "full_name" character varying(255) NOT NULL,
                "password" character varying(255) NOT NULL,
                "role" character varying(50) NOT NULL DEFAULT 'user',
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
```

**📝 Penjelasan:**

```typescript
// up() - Apply changes (go forward)
public async up(queryRunner: QueryRunner): Promise<void> {
  // SQL untuk create table
}

// down() - Revert changes (go backward)
public async down(queryRunner: QueryRunner): Promise<void> {
  // SQL untuk undo (drop table)
}
```

### Method 2: Create Manual Migration

**Step 1: Create Empty Migration**

```bash
npm run migration:create src/migrations/AddEmailVerification
```

**Step 2: Edit Generated File**

**`src/migrations/1701234598765-AddEmailVerification.ts`:**

```typescript
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddEmailVerification1701234598765 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new column
        await queryRunner.addColumn('users', new TableColumn({
            name: 'email_verified',
            type: 'boolean',
            default: false,
        }));

        // Add verification token column
        await queryRunner.addColumn('users', new TableColumn({
            name: 'verification_token',
            type: 'varchar',
            length: '255',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove columns in reverse order
        await queryRunner.dropColumn('users', 'verification_token');
        await queryRunner.dropColumn('users', 'email_verified');
    }
}
```

**📝 Penjelasan:**

```typescript
// Add column
await queryRunner.addColumn('table_name', new TableColumn({
  name: 'column_name',
  type: 'data_type',
  // ... options
}));

// Drop column
await queryRunner.dropColumn('table_name', 'column_name');
```

### Common Migration Operations

#### 1. Create Table

```typescript
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTasksTable1701234623456 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'tasks',
            columns: [
                {
                    name: 'id',
                    type: 'serial',
                    isPrimary: true,
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                },
                {
                    name: 'user_id',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['user_id'],
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('tasks');
    }
}
```

#### 2. Add/Drop Column

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', new TableColumn({
        name: 'phone',
        type: 'varchar',
        length: '20',
        isNullable: true,
    }));
}

public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'phone');
}
```

#### 3. Rename Column

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('users', 'full_name', 'name');
}

public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('users', 'name', 'full_name');
}
```

#### 4. Create Index

```typescript
import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex('users', new TableIndex({
        name: 'IDX_users_email',
        columnNames: ['email'],
    }));
}

public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'IDX_users_email');
}
```

#### 5. Modify Column

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
    // Change column type
    await queryRunner.changeColumn('users', 'role', new TableColumn({
        name: 'role',
        type: 'varchar',
        length: '100',  // Changed from 50 to 100
        default: "'user'",
    }));
}

public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn('users', 'role', new TableColumn({
        name: 'role',
        type: 'varchar',
        length: '50',  // Revert back to 50
        default: "'user'",
    }));
}
```

---

## ▶️ Running Migrations

### Check Migration Status

```bash
# Show all migrations and their status
npm run migration:show
```

**Output:**

```
[X] CreateUsersTable1701234567890    (ran)
[ ] AddEmailVerification1701234598765 (pending)
[ ] CreateTasksTable1701234623456     (pending)
```

### Run Pending Migrations

```bash
# Run all pending migrations
npm run migration:run
```

**Output:**

```
query: SELECT * FROM "migrations" ORDER BY "id" DESC
query: START TRANSACTION
Migration CreateUsersTable1701234567890 has been executed successfully.
query: INSERT INTO "migrations"("timestamp", "name") VALUES ($1, $2)
query: COMMIT

query: START TRANSACTION
Migration AddEmailVerification1701234598765 has been executed successfully.
query: INSERT INTO "migrations"("timestamp", "name") VALUES ($1, $2)
query: COMMIT
```

**📝 What Happens:**

```
1. TypeORM creates 'migrations' table (if not exists)
   └─ Tracks which migrations have been run

2. Check which migrations are pending
   └─ Compare files vs database records

3. Run each migration in order
   ├─ Execute up() method
   ├─ Record in migrations table
   └─ Commit transaction

4. If error occurs
   └─ Rollback transaction (safe!)
```

### Verify in Database

```bash
psql todo_app

-- Check migrations table
SELECT * FROM migrations;

-- Output:
--  id |     timestamp     |                name
-- ----+-------------------+-------------------------------------
--   1 | 1701234567890     | CreateUsersTable1701234567890
--   2 | 1701234598765     | AddEmailVerification1701234598765

-- Check if tables created
\dt

-- Check users table structure
\d users

\q
```

---

## ⏪ Reverting Migrations

### Revert Last Migration

```bash
# Undo the most recent migration
npm run migration:revert
```

**Output:**

```
query: SELECT * FROM "migrations" ORDER BY "id" DESC
query: START TRANSACTION
Migration AddEmailVerification1701234598765 is being reverted.
query: ALTER TABLE "users" DROP COLUMN "verification_token"
query: ALTER TABLE "users" DROP COLUMN "email_verified"
query: DELETE FROM "migrations" WHERE "timestamp" = $1 AND "name" = $2
query: COMMIT
```

**📝 What Happens:**

```
1. Find last migration in database
2. Run down() method
3. Delete record from migrations table
4. Commit changes
```

### Revert Multiple Migrations

```bash
# Revert last migration
npm run migration:revert

# Revert again (previous migration)
npm run migration:revert

# Keep reverting as needed
```

### Common Scenarios

#### Scenario 1: Fix Migration Error

```bash
# Step 1: Run migration
npm run migration:run
# ❌ Error! Typo in SQL

# Step 2: Revert
npm run migration:revert

# Step 3: Fix migration file
# Edit src/migrations/xxx.ts

# Step 4: Run again
npm run migration:run
# ✅ Success!
```

#### Scenario 2: Wrong Schema Change

```bash
# Oh no! Added wrong column
npm run migration:revert

# Edit migration or create new one
npm run migration:generate src/migrations/FixUserSchema

# Apply correct changes
npm run migration:run
```

---

## 🌱 Apa itu Seeding?

### Analogi Sederhana

**Seeding = Isi data awal ke database**

```
Empty Database:          After Seeding:
┌─────────────────┐     ┌─────────────────┐
│ users (empty)   │     │ users           │
│                 │     │ ├─ admin        │
│                 │     │ ├─ user1        │
│                 │     │ └─ user2        │
└─────────────────┘     └─────────────────┘
```

### Kenapa Butuh Seeding?

✅ **Development:**
```
- Testing dengan data realistic
- Tidak perlu manual insert berkali-kali
- Konsisten antar developer
```

✅ **Demo/Staging:**
```
- Show features dengan data
- Client presentation
- QA testing
```

✅ **Production (Initial):**
```
- Admin user default
- Master data (categories, roles, dll)
- Configuration data
```

### Seeding vs Migrations

| Aspect | Migrations | Seeding |
|--------|-----------|---------|
| **Purpose** | Schema changes | Insert data |
| **Required** | Yes (production) | No (optional) |
| **Tracking** | Tracked in DB | Not tracked |
| **Reversible** | Yes (up/down) | Manual delete |
| **When** | Schema changes | Initial/test data |

---

## 📦 Creating Seeds

### Method 1: Simple Seed Script

**Buat `src/database/seeds/user.seed.ts`:**

```typescript
import { AppDataSource } from '../../config/data-source';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedUsers() {
  const dataSource = await AppDataSource.initialize();
  const userRepository = dataSource.getRepository(User);

  // Check if users already exist
  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    console.log('Users already seeded, skipping...');
    await dataSource.destroy();
    return;
  }

  // Create seed data
  const users = [
    {
      email: 'admin@example.com',
      full_name: 'Admin User',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      is_active: true,
    },
    {
      email: 'user@example.com',
      full_name: 'Regular User',
      password: await bcrypt.hash('user123', 10),
      role: 'user',
      is_active: true,
    },
    {
      email: 'test@example.com',
      full_name: 'Test User',
      password: await bcrypt.hash('test123', 10),
      role: 'user',
      is_active: false,
    },
  ];

  // Insert users
  await userRepository.save(users);

  console.log('✅ Users seeded successfully!');
  console.log(`   - ${users.length} users created`);

  await dataSource.destroy();
}
```

**📝 Penjelasan:**

```typescript
// 1. Check if already seeded
const existingUsers = await userRepository.count();
if (existingUsers > 0) {
  return; // Skip if data exists
}

// 2. Create seed data array
const users = [{ ... }, { ... }];

// 3. Insert all at once
await userRepository.save(users);
```

### Method 2: Factory Pattern (Advanced)

**Buat `src/database/factories/user.factory.ts`:**

```typescript
import { faker } from '@faker-js/faker';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function createUser(override: Partial<User> = {}): Promise<Partial<User>> {
  return {
    email: faker.internet.email(),
    full_name: faker.person.fullName(),
    password: await bcrypt.hash('password123', 10),
    role: 'user',
    is_active: true,
    ...override,
  };
}

export async function createManyUsers(count: number): Promise<Partial<User>[]> {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(await createUser());
  }
  return users;
}
```

**Install faker:**

```bash
npm install --save-dev @faker-js/faker
```

**Buat `src/database/seeds/advanced-user.seed.ts`:**

```typescript
import { AppDataSource } from '../../config/data-source';
import { User } from '../../users/entities/user.entity';
import { createUser, createManyUsers } from '../factories/user.factory';

export async function seedUsersAdvanced() {
  const dataSource = await AppDataSource.initialize();
  const userRepository = dataSource.getRepository(User);

  // Create admin
  const admin = await createUser({
    email: 'admin@example.com',
    full_name: 'Super Admin',
    role: 'admin',
  });
  await userRepository.save(admin);

  // Create 10 random users
  const randomUsers = await createManyUsers(10);
  await userRepository.save(randomUsers);

  console.log('✅ Advanced seeding complete!');
  console.log(`   - 1 admin created`);
  console.log(`   - 10 random users created`);

  await dataSource.destroy();
}
```

### Method 3: Seed with Relations

**Buat `src/database/seeds/task.seed.ts`:**

```typescript
import { AppDataSource } from '../../config/data-source';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';

export async function seedTasks() {
  const dataSource = await AppDataSource.initialize();
  const userRepository = dataSource.getRepository(User);
  const taskRepository = dataSource.getRepository(Task);

  // Get all users
  const users = await userRepository.find();
  
  if (users.length === 0) {
    console.log('⚠️ No users found. Please seed users first.');
    await dataSource.destroy();
    return;
  }

  // Create tasks for each user
  const tasks = [];
  
  for (const user of users) {
    tasks.push(
      {
        title: `${user.full_name}'s First Task`,
        description: 'This is a sample task',
        status: 'pending',
        priority: 'high',
        user_id: user.id,
      },
      {
        title: `${user.full_name}'s Second Task`,
        description: 'Another sample task',
        status: 'in_progress',
        priority: 'medium',
        user_id: user.id,
      }
    );
  }

  await taskRepository.save(tasks);

  console.log('✅ Tasks seeded successfully!');
  console.log(`   - ${tasks.length} tasks created`);

  await dataSource.destroy();
}
```

### Create Main Seed Runner

**Buat `src/database/seeds/index.ts`:**

```typescript
import { seedUsers } from './user.seed';
import { seedTasks } from './task.seed';

async function runSeeds() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Run seeds in order
    await seedUsers();
    await seedTasks();

    console.log('\n✅ All seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeds();
```

### Add Seed Scripts to package.json

```json
{
  "scripts": {
    "seed": "ts-node src/database/seeds/index.ts",
    "seed:users": "ts-node src/database/seeds/user.seed.ts",
    "seed:tasks": "ts-node src/database/seeds/task.seed.ts"
  }
}
```

### Run Seeds

```bash
# Run all seeds
npm run seed

# Run specific seed
npm run seed:users
```

**Output:**

```
🌱 Starting database seeding...

✅ Users seeded successfully!
   - 3 users created

✅ Tasks seeded successfully!
   - 6 tasks created

✅ All seeds completed successfully!
```

---

## 🎯 Best Practices

### 1. Migration Naming

✅ **Good:**
```
1701234567890-CreateUsersTable.ts
1701234598765-AddEmailToUsers.ts
1701234623456-CreateIndexOnUserEmail.ts
```

❌ **Bad:**
```
migration1.ts
fix.ts
update.ts
```

### 2. Always Write Down() Method

✅ **Good:**
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.addColumn('users', ...);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.dropColumn('users', 'email');
}
```

❌ **Bad:**
```typescript
public async down(queryRunner: QueryRunner): Promise<void> {
  // TODO: implement later
}
```

### 3. One Purpose per Migration

✅ **Good:**
```
CreateUsersTable.ts      → Create users table only
AddEmailToUsers.ts       → Add email column only
CreateTasksTable.ts      → Create tasks table only
```

❌ **Bad:**
```
BigUpdate.ts → Create users, add columns, create tasks, add indexes...
```

### 4. Test Before Production

```bash
# Local testing
npm run migration:run
npm run migration:revert
npm run migration:run

# Verify data preserved
psql todo_app
SELECT COUNT(*) FROM users;
```

### 5. Backup Before Migration

```bash
# Production: Always backup first!
pg_dump -U postgres todo_app > backup_$(date +%Y%m%d_%H%M%S).sql

# Then run migration
npm run migration:run

# If error, restore backup
psql -U postgres todo_app < backup_20241204_103000.sql
```

### 6. Seed Data Idempotency

✅ **Good:**
```typescript
// Check before insert
const existing = await userRepository.findOne({ 
  where: { email: 'admin@example.com' } 
});

if (!existing) {
  await userRepository.save({ email: 'admin@example.com', ... });
}
```

❌ **Bad:**
```typescript
// Direct insert - error if exists
await userRepository.save({ email: 'admin@example.com', ... });
```

### 7. Environment-Specific Seeds

```typescript
// src/database/seeds/index.ts
async function runSeeds() {
  if (process.env.NODE_ENV === 'production') {
    // Only essential data
    await seedAdminUser();
    await seedMasterData();
  } else {
    // Development: All test data
    await seedUsers();
    await seedTasks();
    await seedTestData();
  }
}
```

---

## 🌍 Real-World Scenarios

### Scenario 1: Add New Column with Data Migration

**Problem:** Add `username` column to existing users

**Migration:**

```typescript
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUsernameToUsers1701234678901 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Add column (nullable first)
        await queryRunner.addColumn('users', new TableColumn({
            name: 'username',
            type: 'varchar',
            length: '50',
            isNullable: true,
        }));

        // 2. Generate usernames from existing emails
        await queryRunner.query(`
            UPDATE users 
            SET username = LOWER(SPLIT_PART(email, '@', 1))
        `);

        // 3. Make column NOT NULL
        await queryRunner.query(`
            ALTER TABLE users 
            ALTER COLUMN username SET NOT NULL
        `);

        // 4. Add unique constraint
        await queryRunner.query(`
            ALTER TABLE users 
            ADD CONSTRAINT UQ_users_username UNIQUE (username)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'username');
    }
}
```

### Scenario 2: Rename Column Safely

```typescript
export class RenameFullNameToName1701234689012 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('users', 'full_name', 'name');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('users', 'name', 'full_name');
    }
}
```

### Scenario 3: Complex Schema Change

**Problem:** Split `name` into `first_name` and `last_name`

```typescript
export class SplitUserName1701234699123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Add new columns
        await queryRunner.addColumn('users', new TableColumn({
            name: 'first_name',
            type: 'varchar',
            length: '100',
            isNullable: true,
        }));

        await queryRunner.addColumn('users', new TableColumn({
            name: 'last_name',
            type: 'varchar',
            length: '100',
            isNullable: true,
        }));

        // 2. Migrate data
        await queryRunner.query(`
            UPDATE users 
            SET 
                first_name = SPLIT_PART(name, ' ', 1),
                last_name = SPLIT_PART(name, ' ', 2)
        `);

        // 3. Make NOT NULL
        await queryRunner.query(`
            ALTER TABLE users 
            ALTER COLUMN first_name SET NOT NULL,
            ALTER COLUMN last_name SET NOT NULL
        `);

        // 4. Drop old column
        await queryRunner.dropColumn('users', 'name');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. Add name column back
        await queryRunner.addColumn('users', new TableColumn({
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: true,
        }));

        // 2. Restore data
        await queryRunner.query(`
            UPDATE users 
            SET name = CONCAT(first_name, ' ', last_name)
        `);

        await queryRunner.query(`
            ALTER TABLE users 
            ALTER COLUMN name SET NOT NULL
        `);

        // 3. Drop new columns
        await queryRunner.dropColumn('users', 'first_name');
        await queryRunner.dropColumn('users', 'last_name');
    }
}
```

### Scenario 4: Master Data Seeding

**Buat `src/database/seeds/master-data.seed.ts`:**

```typescript
import { AppDataSource } from '../../config/data-source';

export async function seedMasterData() {
  const dataSource = await AppDataSource.initialize();

  // Seed task statuses
  await dataSource.query(`
    INSERT INTO task_statuses (name, description) VALUES
    ('pending', 'Task belum dikerjakan'),
    ('in_progress', 'Task sedang dikerjakan'),
    ('completed', 'Task sudah selesai'),
    ('cancelled', 'Task dibatalkan')
    ON CONFLICT (name) DO NOTHING
  `);

  // Seed priorities
  await dataSource.query(`
    INSERT INTO priorities (name, level, color) VALUES
    ('low', 1, '#28a745'),
    ('medium', 2, '#ffc107'),
    ('high', 3, '#dc3545')
    ON CONFLICT (name) DO NOTHING
  `);

  console.log('✅ Master data seeded!');

  await dataSource.destroy();
}
```

---

## 📚 Kesimpulan

### Yang Sudah Dipelajari

✅ Konsep database migrations  
✅ Setup TypeORM CLI  
✅ Generate migrations from entities  
✅ Create manual migrations  
✅ Run and revert migrations  
✅ Migration best practices  
✅ Database seeding concepts  
✅ Create seed scripts  
✅ Factory pattern untuk test data  
✅ Real-world migration scenarios  

### Migration Workflow Checklist

```
☑️ Install TypeORM CLI dependencies
☑️ Create data-source.ts configuration
☑️ Add migration scripts to package.json
☑️ Set synchronize: false
☑️ Create entities
☑️ Generate migrations
☑️ Test locally (run + revert)
☑️ Commit migration files
☑️ Run in staging
☑️ Backup production database
☑️ Run in production
☑️ Verify success
```

### Common Commands Reference

```bash
# Migrations
npm run migration:generate src/migrations/MigrationName
npm run migration:create src/migrations/MigrationName
npm run migration:run
npm run migration:revert
npm run migration:show

# Seeding
npm run seed
npm run seed:users
npm run seed:tasks

# Development workflow
npm run migration:run && npm run seed && npm run start:dev
```

### Production Checklist

```
☑️ synchronize: false
☑️ Backup database before migration
☑️ Test migration in staging first
☑️ Have rollback plan ready
☑️ Monitor application after migration
☑️ Document schema changes
☑️ Notify team about downtime (if needed)
```

---

**🎉 Selamat! Anda sudah menguasai Migrations dan Seeding!**

Dengan migrations, Anda bisa:
- ✅ Track database schema changes
- ✅ Collaborate with team safely
- ✅ Deploy with confidence
- ✅ Rollback if needed

Dengan seeding, Anda bisa:
- ✅ Quickly setup development environment
- ✅ Create consistent test data
- ✅ Initialize production data

---

📖 **Next:** Kita akan buat complete sample project yang implement semua konsep ini!
