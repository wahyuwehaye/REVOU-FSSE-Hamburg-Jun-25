# 🏗️ Entities & Repositories in TypeORM

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Membuat TypeORM entities
- ✅ Understand decorators (@Entity, @Column, @PrimaryGeneratedColumn)
- ✅ Define column types dan constraints
- ✅ Working dengan repositories
- ✅ Custom repository methods
- ✅ Entity lifecycle hooks
- ✅ Best practices untuk entity design

---

## 🎯 What is an Entity?

**Entity** = Class yang maps ke database table

**Analogy:**
```
TypeScript Class ↔️ Database Table
Class Property  ↔️ Table Column
Class Instance  ↔️ Table Row
```

**Example:**
```typescript
// TypeScript Entity
class User {
  id: number;
  email: string;
  name: string;
}

// Database Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  name VARCHAR(255)
);
```

---

## 📊 Creating Your First Entity

### Step 1: Create users Directory

```bash
# Inside src/
mkdir src/users
```

### Step 2: Create user.entity.ts

```typescript
// src/users/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')  // Table name
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  age: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Generated SQL:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🎨 TypeORM Decorators

### @Entity()

```typescript
@Entity()              // Table name = class name (User → user)
@Entity('users')       // Explicit table name
@Entity({ name: 'users', schema: 'public' })  // With schema
```

### @PrimaryGeneratedColumn()

```typescript
@PrimaryGeneratedColumn()           // Auto-increment integer
@PrimaryGeneratedColumn('uuid')     // UUID primary key
@PrimaryGeneratedColumn('increment') // Same as default
```

### @Column()

```typescript
// Basic
@Column()
name: string;

// With type
@Column('varchar')
@Column('text')
@Column('int')
@Column('decimal', { precision: 10, scale: 2 })

// With options
@Column({ 
  type: 'varchar',
  length: 200,
  nullable: true,
  unique: true,
  default: 'default value',
})
email: string;

// Common types
@Column('text')           // TEXT
@Column('int')            // INTEGER
@Column('float')          // FLOAT
@Column('boolean')        // BOOLEAN
@Column('date')           // DATE
@Column('timestamp')      // TIMESTAMP
@Column('json')           // JSON
@Column('jsonb')          // JSONB (PostgreSQL)
```

### Timestamp Decorators

```typescript
@CreateDateColumn()    // Auto-set on insert
createdAt: Date;

@UpdateDateColumn()    // Auto-update on update
updatedAt: Date;

@DeleteDateColumn()    // For soft deletes
deletedAt: Date;
```

### @Generated()

```typescript
@Column()
@Generated('uuid')
uuid: string;

@Column()
@Generated('increment')
order: number;
```

---

## 🏗️ Complete Entity Example

### user.entity.ts

```typescript
// src/users/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
@Index(['email'])  // Create index on email
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'varchar', 
    length: 255, 
    unique: true 
  })
  @Index()  // Additional index
  email: string;

  @Column({ 
    type: 'varchar', 
    length: 100 
  })
  username: string;

  @Column({ 
    type: 'varchar', 
    length: 255 
  })
  password: string;

  @Column({ 
    type: 'varchar', 
    length: 100,
    nullable: true 
  })
  firstName: string;

  @Column({ 
    type: 'varchar', 
    length: 100,
    nullable: true 
  })
  lastName: string;

  @Column({ 
    type: 'int',
    nullable: true 
  })
  age: number;

  @Column({ 
    type: 'varchar', 
    length: 100,
    nullable: true 
  })
  city: string;

  @Column({ 
    type: 'boolean', 
    default: true 
  })
  isActive: boolean;

  @Column({ 
    type: 'enum',
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  })
  role: string;

  @CreateDateColumn({ 
    type: 'timestamp' 
  })
  createdAt: Date;

  @UpdateDateColumn({ 
    type: 'timestamp' 
  })
  updatedAt: Date;

  @Column({ 
    type: 'timestamp',
    nullable: true 
  })
  lastLoginAt: Date;
}
```

---

## 📦 Register Entity in Module

### Step 1: Create users.module.ts

```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // Register entity
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],  // Export if used in other modules
})
export class UsersModule {}
```

### Step 2: Import in app.module.ts

```typescript
// src/app.module.ts
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ /* ... */ }),
    TypeOrmModule.forRootAsync({ /* ... */ }),
    UsersModule,  // ← Add here
  ],
})
export class AppModule {}
```

---

## 🗄️ Working with Repositories

### What is a Repository?

**Repository** = Interface to interact with database

**Methods:**
- `save()` - Insert or update
- `find()` - Get all records
- `findOne()` - Get one record
- `update()` - Update records
- `delete()` - Delete records
- `remove()` - Delete entity

### Create users.service.ts

```typescript
// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Create user
  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return await this.usersRepository.save(user);
  }

  // Find all users
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  // Find one by ID
  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne({ 
      where: { id } 
    });
  }

  // Find by email
  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ 
      where: { email } 
    });
  }

  // Update user
  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, userData);
    return await this.findOne(id);
  }

  // Delete user
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  // Count users
  async count(): Promise<number> {
    return await this.usersRepository.count();
  }
}
```

---

## 🎮 Repository Methods Deep Dive

### save()

```typescript
// Insert new user
const user = new User();
user.email = 'john@example.com';
user.name = 'John Doe';
await repository.save(user);

// Or using create()
const user = repository.create({
  email: 'john@example.com',
  name: 'John Doe',
});
await repository.save(user);

// Save multiple
await repository.save([user1, user2, user3]);

// Update existing (if id exists)
const user = await repository.findOne({ where: { id: 1 } });
user.name = 'Jane Doe';
await repository.save(user);  // Updates!
```

### find()

```typescript
// Find all
const users = await repository.find();

// With conditions
const users = await repository.find({
  where: { isActive: true }
});

// With select
const users = await repository.find({
  select: ['id', 'email', 'name']
});

// With order
const users = await repository.find({
  order: { createdAt: 'DESC' }
});

// With pagination
const users = await repository.find({
  skip: 0,
  take: 10
});

// Complex example
const users = await repository.find({
  where: { 
    isActive: true,
    role: 'user'
  },
  select: ['id', 'email', 'name'],
  order: { createdAt: 'DESC' },
  skip: 0,
  take: 10,
});
```

### findOne()

```typescript
// By ID (old syntax - deprecated)
const user = await repository.findOne(1);

// New syntax
const user = await repository.findOne({
  where: { id: 1 }
});

// By email
const user = await repository.findOne({
  where: { email: 'john@example.com' }
});

// With select
const user = await repository.findOne({
  where: { id: 1 },
  select: ['id', 'email', 'name']
});
```

### findOneBy()

```typescript
// Shorter syntax
const user = await repository.findOneBy({ id: 1 });
const user = await repository.findOneBy({ email: 'john@example.com' });
```

### update()

```typescript
// Update by ID
await repository.update(1, { 
  name: 'Jane Doe',
  age: 30 
});

// Update by condition
await repository.update(
  { isActive: false },
  { isActive: true }
);

// Update multiple
await repository.update(
  { city: 'Jakarta' },
  { city: 'Jakarta Selatan' }
);
```

### delete()

```typescript
// Delete by ID
await repository.delete(1);

// Delete by condition
await repository.delete({ isActive: false });

// Delete multiple
await repository.delete([1, 2, 3]);
```

### remove()

```typescript
// remove() requires entity instance
const user = await repository.findOne({ where: { id: 1 } });
await repository.remove(user);

// Remove multiple
const users = await repository.find({ where: { isActive: false } });
await repository.remove(users);
```

**Difference: delete() vs remove()**
- `delete()` - Raw SQL DELETE (faster, no hooks)
- `remove()` - Loads entity first (slower, triggers hooks)

### count()

```typescript
// Count all
const count = await repository.count();

// Count with condition
const count = await repository.count({
  where: { isActive: true }
});
```

### findAndCount()

```typescript
// Get results + total count (for pagination)
const [users, total] = await repository.findAndCount({
  where: { isActive: true },
  skip: 0,
  take: 10,
});

console.log(`Found ${users.length} users out of ${total} total`);
```

---

## 🔧 Custom Repository Methods

### Extend Service with Custom Queries

```typescript
// src/users/users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Custom: Find active users
  async findActiveUsers(): Promise<User[]> {
    return await this.usersRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  // Custom: Find by age range
  async findByAgeRange(minAge: number, maxAge: number): Promise<User[]> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.age >= :minAge', { minAge })
      .andWhere('user.age <= :maxAge', { maxAge })
      .getMany();
  }

  // Custom: Search by name (case-insensitive)
  async searchByName(searchTerm: string): Promise<User[]> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.firstName) LIKE LOWER(:term)', {
        term: `%${searchTerm}%`,
      })
      .orWhere('LOWER(user.lastName) LIKE LOWER(:term)', {
        term: `%${searchTerm}%`,
      })
      .getMany();
  }

  // Custom: Get user statistics
  async getUserStats() {
    const total = await this.usersRepository.count();
    const active = await this.usersRepository.count({ 
      where: { isActive: true } 
    });
    const inactive = total - active;

    const avgAge = await this.usersRepository
      .createQueryBuilder('user')
      .select('AVG(user.age)', 'avgAge')
      .getRawOne();

    return {
      total,
      active,
      inactive,
      averageAge: Math.round(avgAge.avgAge),
    };
  }

  // Custom: Bulk update
  async deactivateOldUsers(): Promise<void> {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ isActive: false })
      .where('lastLoginAt < :date', { date: oneYearAgo })
      .execute();
  }
}
```

---

## 🪝 Entity Lifecycle Hooks

### Available Hooks

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterInsert,
  AfterUpdate,
  AfterLoad,
  BeforeRemove,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  // Runs before insert
  @BeforeInsert()
  async hashPassword() {
    // Hash password before saving
    // this.password = await bcrypt.hash(this.password, 10);
    console.log('BeforeInsert: Hashing password...');
  }

  // Runs after insert
  @AfterInsert()
  logInsert() {
    console.log(`Inserted user with id: ${this.id}`);
  }

  // Runs before update
  @BeforeUpdate()
  updateTimestamp() {
    console.log('BeforeUpdate: Updating timestamp...');
  }

  // Runs after update
  @AfterUpdate()
  logUpdate() {
    console.log(`Updated user with id: ${this.id}`);
  }

  // Runs after entity is loaded from database
  @AfterLoad()
  logLoad() {
    console.log(`Loaded user with id: ${this.id}`);
  }

  // Runs before remove
  @BeforeRemove()
  async cleanupBeforeRemove() {
    console.log('BeforeRemove: Cleaning up...');
  }

  // Runs after remove
  @AfterRemove()
  logRemove() {
    console.log('AfterRemove: User removed');
  }
}
```

### Real-World Example: Password Hashing

```typescript
import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  // Method to verify password
  async comparePassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}
```

---

## 🎯 Column Types Reference

### String Types

```typescript
@Column('varchar', { length: 255 })
@Column('text')
@Column('char', { length: 10 })
```

### Number Types

```typescript
@Column('int')
@Column('bigint')
@Column('smallint')
@Column('decimal', { precision: 10, scale: 2 })
@Column('float')
@Column('double')
```

### Boolean

```typescript
@Column('boolean')
@Column({ type: 'boolean', default: false })
```

### Date/Time

```typescript
@Column('date')
@Column('time')
@Column('timestamp')
@Column('timestamptz')  // PostgreSQL with timezone
```

### JSON

```typescript
@Column('json')
@Column('jsonb')  // PostgreSQL binary JSON
```

### Arrays (PostgreSQL)

```typescript
@Column('text', { array: true })
tags: string[];

@Column('int', { array: true })
numbers: number[];
```

### Enum

```typescript
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

@Column({
  type: 'enum',
  enum: UserRole,
  default: UserRole.USER,
})
role: UserRole;
```

---

## 💡 Best Practices

### 1. Use Proper Column Types

```typescript
// ❌ BAD
@Column()
price: number;  // What precision?

// ✅ GOOD
@Column('decimal', { precision: 10, scale: 2 })
price: number;
```

### 2. Set Appropriate Lengths

```typescript
// ❌ BAD
@Column()
email: string;  // Unlimited length!

// ✅ GOOD
@Column({ type: 'varchar', length: 255 })
email: string;
```

### 3. Use nullable for Optional Fields

```typescript
// ✅ GOOD
@Column({ nullable: true })
middleName: string;
```

### 4. Add Indexes for Frequently Queried Fields

```typescript
@Column()
@Index()
email: string;

@Column()
@Index()
username: string;
```

### 5. Use Enums for Fixed Values

```typescript
// ✅ GOOD
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Column({
  type: 'enum',
  enum: UserStatus,
  default: UserStatus.ACTIVE,
})
status: UserStatus;
```

### 6. Separate DTOs from Entities

```typescript
// ❌ BAD: Using entity in controller
@Post()
create(@Body() user: User) { ... }

// ✅ GOOD: Use DTO
@Post()
create(@Body() createUserDto: CreateUserDto) { ... }
```

---

## 📝 Practice Exercise

Create a Product entity with:
- id (auto-increment)
- name (required, max 200 chars)
- description (text, optional)
- price (decimal, 2 decimal places)
- stock (integer, default 0)
- category (enum: electronics, clothing, food)
- isAvailable (boolean, default true)
- tags (array of strings)
- createdAt, updatedAt timestamps

<details>
<summary>Solution</summary>

```typescript
// src/products/product.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  FOOD = 'food',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  @Index()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({
    type: 'enum',
    enum: ProductCategory,
  })
  category: ProductCategory;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

</details>

---

## 🎯 Summary

**Entity Basics:**
```typescript
@Entity('table_name')
export class EntityName {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  field: string;
  
  @CreateDateColumn()
  createdAt: Date;
}
```

**Register Entity:**
```typescript
TypeOrmModule.forFeature([Entity])
```

**Repository Injection:**
```typescript
constructor(
  @InjectRepository(Entity)
  private repository: Repository<Entity>,
) {}
```

**Common Methods:**
- `save()` - Insert/update
- `find()` - Get multiple
- `findOne()` - Get one
- `update()` - Update by condition
- `delete()` - Delete by condition
- `remove()` - Delete entity with hooks

**Next Step:**
👉 Lanjut ke [Materi 18: Basic CRUD with TypeORM](./18-basic-crud-typeorm.md)

---

**Happy Coding! 🚀**
