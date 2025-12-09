# 🔄 Database Migrations & Seeding in TypeORM

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Understand what migrations are and why they're important
- ✅ Generate and run migrations
- ✅ Create custom migrations
- ✅ Revert migrations
- ✅ Seed database with initial data
- ✅ Manage migration workflow
- ✅ Handle migration in production

---

## 🎯 What are Migrations?

### Definition

**Migration** = Version control for your database schema

**Analogy:**
```
Git for Code ↔️ Migrations for Database
Commits      ↔️ Migration Files
git log      ↔️ Migration History
git revert   ↔️ Migration Rollback
```

### Why Migrations?

**Without Migrations:**
```typescript
// Changed entity
@Entity()
class User {
  @Column()
  email: string;
  
  @Column()
  fullName: string;  // ← New field! But database still has old schema 😱
}
```

**With Migrations:**
```typescript
// 1. Change entity
@Column()
fullName: string;

// 2. Generate migration
npm run migration:generate -- -n AddFullNameToUser

// 3. Run migration
npm run migration:run

// ✅ Database updated!
```

---

## 🛠️ Setup TypeORM CLI

### Step 1: Install Dependencies

```bash
npm install -D ts-node
```

### Step 2: Create data-source.ts

```typescript
// src/config/data-source.ts
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load .env file
config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,  // ⚠️ Always false in production
  logging: true,
});
```

### Step 3: Add Scripts to package.json

```json
{
  "scripts": {
    "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli",
    "migration:generate": "npm run typeorm -- migration:generate -d src/config/data-source.ts",
    "migration:create": "npm run typeorm -- migration:create",
    "migration:run": "npm run typeorm -- migration:run -d src/config/data-source.ts",
    "migration:revert": "npm run typeorm -- migration:revert -d src/config/data-source.ts",
    "migration:show": "npm run typeorm -- migration:show -d src/config/data-source.ts"
  }
}
```

### Step 4: Update app.module.ts

```typescript
// src/app.module.ts
import { AppDataSource } from './config/data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => AppDataSource.options,
    }),
  ],
})
export class AppModule {}
```

---

## 🏗️ Creating Migrations

### Method 1: Auto-Generate (Recommended)

**Step 1:** Modify entity

```typescript
// src/users/user.entity.ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // ← NEW FIELD
  @Column({ nullable: true })
  phoneNumber: string;
}
```

**Step 2:** Generate migration

```bash
npm run migration:generate -- src/migrations/AddPhoneNumberToUser
```

**Generated File:**

```typescript
// src/migrations/1234567890123-AddPhoneNumberToUser.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhoneNumberToUser1234567890123 implements MigrationInterface {
  name = 'AddPhoneNumberToUser1234567890123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD "phoneNumber" character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN "phoneNumber"
    `);
  }
}
```

**Step 3:** Run migration

```bash
npm run migration:run
```

**Output:**
```
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = 'public' AND "table_name" = 'migrations'
query: CREATE TABLE "migrations" (...)
query: SELECT * FROM "migrations" "migrations" ORDER BY "id" DESC
query: ALTER TABLE "users" ADD "phoneNumber" character varying
Migration AddPhoneNumberToUser1234567890123 has been executed successfully.
```

---

### Method 2: Manual Creation

```bash
npm run migration:create -- src/migrations/CreateUsersTable
```

**Generated File:**

```typescript
// src/migrations/1234567890123-CreateUsersTable.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Write your migration here
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Write rollback here
  }
}
```

**Fill in manually:**

```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'username',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

---

## 📝 Migration Operations

### Create Table

```typescript
import { Table } from 'typeorm';

await queryRunner.createTable(
  new Table({
    name: 'posts',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'title',
        type: 'varchar',
      },
    ],
  }),
  true,
);
```

### Drop Table

```typescript
await queryRunner.dropTable('posts');
```

### Add Column

```typescript
import { TableColumn } from 'typeorm';

await queryRunner.addColumn(
  'users',
  new TableColumn({
    name: 'phoneNumber',
    type: 'varchar',
    isNullable: true,
  }),
);
```

### Drop Column

```typescript
await queryRunner.dropColumn('users', 'phoneNumber');
```

### Rename Column

```typescript
await queryRunner.renameColumn('users', 'phoneNumber', 'phone');
```

### Change Column Type

```typescript
await queryRunner.changeColumn(
  'users',
  'age',
  new TableColumn({
    name: 'age',
    type: 'smallint',
  }),
);
```

### Add Foreign Key

```typescript
import { TableForeignKey } from 'typeorm';

await queryRunner.createForeignKey(
  'posts',
  new TableForeignKey({
    columnNames: ['authorId'],
    referencedColumnNames: ['id'],
    referencedTableName: 'users',
    onDelete: 'CASCADE',
  }),
);
```

### Drop Foreign Key

```typescript
const table = await queryRunner.getTable('posts');
const foreignKey = table.foreignKeys.find(
  (fk) => fk.columnNames.indexOf('authorId') !== -1,
);
await queryRunner.dropForeignKey('posts', foreignKey);
```

### Add Index

```typescript
import { TableIndex } from 'typeorm';

await queryRunner.createIndex(
  'users',
  new TableIndex({
    name: 'IDX_USERS_EMAIL',
    columnNames: ['email'],
  }),
);
```

### Drop Index

```typescript
await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL');
```

### Raw SQL Query

```typescript
await queryRunner.query(`
  UPDATE users 
  SET isActive = true 
  WHERE createdAt < NOW() - INTERVAL '30 days'
`);
```

---

## 🔄 Running Migrations

### Run All Pending Migrations

```bash
npm run migration:run
```

**Output:**
```
3 migrations are already loaded in the database.
2 migrations were found in the source code.
1 migrations are new migrations need to be executed.

query: ALTER TABLE "users" ADD "phoneNumber" varchar
Migration AddPhoneNumberToUser1234567890123 has been executed successfully.
```

### Show Migration Status

```bash
npm run migration:show
```

**Output:**
```
[X] CreateUsersTable1234567890123
[X] CreatePostsTable1234567890456
[ ] AddPhoneNumberToUser1234567890789
```

### Revert Last Migration

```bash
npm run migration:revert
```

**Output:**
```
query: ALTER TABLE "users" DROP COLUMN "phoneNumber"
Migration AddPhoneNumberToUser1234567890123 has been reverted successfully.
```

### Revert Multiple Migrations

```bash
# Revert last 3 migrations
npm run migration:revert
npm run migration:revert
npm run migration:revert
```

---

## 🌱 Database Seeding

### What is Seeding?

**Seeding** = Populating database with initial/test data

### Create Seed File

```typescript
// src/seeds/users.seed.ts
import { AppDataSource } from '../config/data-source';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedUsers() {
  const userRepository = AppDataSource.getRepository(User);

  // Check if users already exist
  const count = await userRepository.count();
  if (count > 0) {
    console.log('Users already seeded');
    return;
  }

  // Create admin user
  const admin = userRepository.create({
    email: 'admin@example.com',
    username: 'admin',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin',
    isActive: true,
  });

  // Create test users
  const users = [];
  for (let i = 1; i <= 10; i++) {
    users.push(
      userRepository.create({
        email: `user${i}@example.com`,
        username: `user${i}`,
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        isActive: true,
      }),
    );
  }

  await userRepository.save([admin, ...users]);
  console.log('✅ Users seeded successfully');
}
```

### Create Main Seed Runner

```typescript
// src/seeds/index.ts
import { AppDataSource } from '../config/data-source';
import { seedUsers } from './users.seed';
import { seedPosts } from './posts.seed';
import { seedTags } from './tags.seed';

async function runSeeds() {
  try {
    // Initialize connection
    await AppDataSource.initialize();
    console.log('📦 Database connected');

    // Run seeds
    await seedUsers();
    await seedTags();
    await seedPosts();

    console.log('✅ All seeds completed');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeds();
```

### Add Seed Script to package.json

```json
{
  "scripts": {
    "seed": "ts-node src/seeds/index.ts"
  }
}
```

### Run Seeds

```bash
npm run seed
```

**Output:**
```
📦 Database connected
✅ Users seeded successfully
✅ Tags seeded successfully
✅ Posts seeded successfully
✅ All seeds completed
```

---

## 📊 Complete Seed Example

### users.seed.ts

```typescript
// src/seeds/users.seed.ts
import { AppDataSource } from '../config/data-source';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedUsers() {
  const userRepository = AppDataSource.getRepository(User);

  const users = [
    {
      email: 'admin@example.com',
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    },
    {
      email: 'john@example.com',
      username: 'johndoe',
      password: await bcrypt.hash('password123', 10),
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
    },
    {
      email: 'jane@example.com',
      username: 'janedoe',
      password: await bcrypt.hash('password123', 10),
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'user',
    },
  ];

  for (const userData of users) {
    const existing = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (!existing) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`✅ Created user: ${userData.email}`);
    } else {
      console.log(`⏭️  User already exists: ${userData.email}`);
    }
  }
}
```

### posts.seed.ts

```typescript
// src/seeds/posts.seed.ts
import { AppDataSource } from '../config/data-source';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';
import { Tag } from '../tags/tag.entity';

export async function seedPosts() {
  const postRepository = AppDataSource.getRepository(Post);
  const userRepository = AppDataSource.getRepository(User);
  const tagRepository = AppDataSource.getRepository(Tag);

  // Get users
  const users = await userRepository.find();
  if (users.length === 0) {
    console.log('⚠️  No users found. Run user seeds first.');
    return;
  }

  // Get tags
  const tags = await tagRepository.find();

  const postsData = [
    {
      title: 'Getting Started with TypeScript',
      content: 'TypeScript is a typed superset of JavaScript...',
      tags: ['typescript', 'programming'],
    },
    {
      title: 'Introduction to NestJS',
      content: 'NestJS is a progressive Node.js framework...',
      tags: ['nestjs', 'nodejs'],
    },
    {
      title: 'PostgreSQL Best Practices',
      content: 'PostgreSQL is a powerful database...',
      tags: ['postgresql', 'database'],
    },
  ];

  for (const postData of postsData) {
    const existing = await postRepository.findOne({
      where: { title: postData.title },
    });

    if (!existing) {
      // Get random user as author
      const author = users[Math.floor(Math.random() * users.length)];

      // Find tags
      const postTags = tags.filter((tag) =>
        postData.tags.includes(tag.name),
      );

      const post = postRepository.create({
        title: postData.title,
        content: postData.content,
        author,
        tags: postTags,
      });

      await postRepository.save(post);
      console.log(`✅ Created post: ${postData.title}`);
    } else {
      console.log(`⏭️  Post already exists: ${postData.title}`);
    }
  }
}
```

---

## 🔄 Migration Workflow

### Development Workflow

```bash
# 1. Modify entity
# 2. Generate migration
npm run migration:generate -- src/migrations/MyMigration

# 3. Review migration file
# 4. Run migration
npm run migration:run

# 5. Test changes
# 6. If wrong, revert
npm run migration:revert

# 7. Fix entity
# 8. Generate new migration
npm run migration:generate -- src/migrations/MyMigrationFixed

# 9. Run migration
npm run migration:run
```

### Production Workflow

```bash
# 1. Run migrations before deployment
npm run migration:run

# 2. Deploy application

# 3. If rollback needed
npm run migration:revert
```

---

## ⚙️ Migration Best Practices

### 1. Never Modify Existing Migrations

```typescript
// ❌ BAD: Modifying existing migration
export class AddEmail1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users ADD email varchar`);
    // ❌ Adding more changes later
    await queryRunner.query(`ALTER TABLE users ADD phone varchar`);
  }
}

// ✅ GOOD: Create new migration
npm run migration:generate -- src/migrations/AddPhoneToUser
```

### 2. Always Provide down() Method

```typescript
// ❌ BAD
public async down(queryRunner: QueryRunner): Promise<void> {
  // Empty - can't rollback!
}

// ✅ GOOD
public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`ALTER TABLE users DROP COLUMN email`);
}
```

### 3. Test Migrations Before Production

```bash
# Test migration
npm run migration:run

# Test rollback
npm run migration:revert

# Test re-run
npm run migration:run
```

### 4. Use Transactions

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.startTransaction();
  
  try {
    await queryRunner.query(`ALTER TABLE users ADD email varchar`);
    await queryRunner.query(`CREATE INDEX idx_email ON users(email)`);
    
    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  }
}
```

### 5. Handle Data Migration Carefully

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  // Add column with nullable first
  await queryRunner.query(`
    ALTER TABLE users 
    ADD COLUMN fullName varchar NULL
  `);

  // Populate data
  await queryRunner.query(`
    UPDATE users 
    SET fullName = CONCAT(firstName, ' ', lastName)
  `);

  // Make NOT NULL
  await queryRunner.query(`
    ALTER TABLE users 
    ALTER COLUMN fullName SET NOT NULL
  `);
}
```

### 6. Keep Migrations Small

```typescript
// ❌ BAD: One migration does everything
AddManyThings1234567890123

// ✅ GOOD: Separate migrations
AddEmailColumn1234567890123
AddPhoneColumn1234567890456
AddIndexes1234567890789
```

---

## 🚨 Common Issues

### Issue 1: Migration Already Ran

**Error:**
```
Migration AddEmail1234567890123 has already been executed
```

**Solution:**
```bash
# Either revert
npm run migration:revert

# Or manually delete from migrations table
psql -d mydb -c "DELETE FROM migrations WHERE name = 'AddEmail1234567890123'"
```

### Issue 2: Entity Out of Sync

**Error:**
```
Entity metadata differs from database
```

**Solution:**
```bash
# Generate migration to sync
npm run migration:generate -- src/migrations/SyncSchema
npm run migration:run
```

### Issue 3: Can't Connect to Database

**Error:**
```
Error: connect ECONNREFUSED
```

**Solution:**
```bash
# Check .env file
# Verify database is running
docker ps
# or
brew services list
```

---

## 🎯 Summary

**Migration Basics:**
```bash
# Generate migration (auto)
npm run migration:generate -- src/migrations/MyMigration

# Create migration (manual)
npm run migration:create -- src/migrations/MyMigration

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert

# Show status
npm run migration:show
```

**Migration Structure:**
```typescript
export class MyMigration implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Apply changes
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert changes
  }
}
```

**Seeding:**
```typescript
// Create seed file
export async function seedData() {
  const repository = AppDataSource.getRepository(Entity);
  await repository.save(data);
}

// Run seeds
npm run seed
```

**Best Practices:**
- ✅ Never modify existing migrations
- ✅ Always provide down() method
- ✅ Test migrations before production
- ✅ Use transactions for safety
- ✅ Keep migrations small and focused

**Next Step:**
👉 Lanjut ke [Materi 21: Query Optimization in NestJS](./21-query-optimization-nestjs.md)

---

**Happy Coding! 🚀**
