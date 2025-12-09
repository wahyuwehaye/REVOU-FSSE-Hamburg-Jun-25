# 🔄 Basic CRUD Operations with TypeORM

## 🎯 Learning Objectives

Setelah mempelajari materi ini, student akan mampu:
- ✅ Implement complete CRUD operations
- ✅ Create DTOs for data validation
- ✅ Handle errors properly
- ✅ Use Query Builder for complex queries
- ✅ Implement pagination
- ✅ Soft delete vs hard delete
- ✅ Transaction management

---

## 🎯 CRUD Overview

**CRUD = Create, Read, Update, Delete**

| Operation | HTTP Method | Endpoint | Purpose |
|-----------|-------------|----------|---------|
| Create | POST | /users | Create new user |
| Read | GET | /users | Get all users |
| Read | GET | /users/:id | Get one user |
| Update | PUT/PATCH | /users/:id | Update user |
| Delete | DELETE | /users/:id | Delete user |

---

## 📦 Project Structure

```
src/
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   └── query-user.dto.ts
│   ├── user.entity.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
└── app.module.ts
```

---

## 🏗️ Step 1: Create Entity

```typescript
// src/users/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;  // For soft delete
}
```

---

## 📋 Step 2: Create DTOs

### Create User DTO

```typescript
// src/users/dto/create-user.dto.ts
import { IsEmail, IsString, IsInt, IsOptional, MinLength, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsInt()
  @Min(1)
  @Max(150)
  @IsOptional()
  age?: number;
}
```

### Update User DTO

```typescript
// src/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
```

**Note:** `PartialType` makes all fields optional

### Query DTO (for filtering)

```typescript
// src/users/dto/query-user.dto.ts
import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryUserDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
```

---

## 🔧 Step 3: Create Service

```typescript
// src/users/users.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // ========== CREATE ==========
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.usersRepository.save(user);
  }

  // ========== READ ALL ==========
  async findAll(query: QueryUserDto) {
    const { search, isActive, page = 1, limit = 10 } = query;
    
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    // Search by username or email
    if (search) {
      queryBuilder.where(
        'user.username LIKE :search OR user.email LIKE :search',
        { search: `%${search}%` },
      );
    }

    // Filter by isActive
    if (isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive });
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Order by
    queryBuilder.orderBy('user.createdAt', 'DESC');

    // Execute
    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ========== READ ONE ==========
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // ========== READ BY EMAIL ==========
  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  // ========== UPDATE ==========
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Update user
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  // ========== DELETE (Soft Delete) ==========
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.softRemove(user);
  }

  // ========== DELETE (Hard Delete) ==========
  async hardRemove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  // ========== RESTORE (After Soft Delete) ==========
  async restore(id: number): Promise<User> {
    await this.usersRepository.restore(id);
    return await this.findOne(id);
  }

  // ========== COUNT ==========
  async count(): Promise<number> {
    return await this.usersRepository.count();
  }
}
```

---

## 🎮 Step 4: Create Controller

```typescript
// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    
    // Don't return password
    const { password, ...result } = user;
    return result;
  }

  // GET /users
  @Get()
  async findAll(@Query() query: QueryUserDto) {
    return await this.usersService.findAll(query);
  }

  // GET /users/:id
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    
    // Don't return password
    const { password, ...result } = user;
    return result;
  }

  // PUT /users/:id
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    
    // Don't return password
    const { password, ...result } = user;
    return result;
  }

  // DELETE /users/:id (Soft Delete)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
  }

  // POST /users/:id/restore
  @Post(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.restore(id);
  }

  // GET /users/count
  @Get('meta/count')
  async count() {
    const total = await this.usersService.count();
    return { total };
  }
}
```

---

## 📦 Step 5: Module Setup

```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### Install Dependencies

```bash
npm install class-validator class-transformer bcrypt
npm install -D @types/bcrypt
```

### Enable Validation in main.ts

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Strip unknown properties
      forbidNonWhitelisted: true,  // Throw error for unknown properties
      transform: true,        // Auto-transform types
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

---

## 🧪 Testing with cURL

### 1. Create User

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "age": 25
  }'
```

**Response:**
```json
{
  "id": 1,
  "email": "john@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "age": 25,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Get All Users

```bash
curl http://localhost:3000/users
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "email": "john@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "age": 25,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 3. Get All Users with Pagination

```bash
curl "http://localhost:3000/users?page=1&limit=5"
```

### 4. Search Users

```bash
curl "http://localhost:3000/users?search=john"
```

### 5. Filter by isActive

```bash
curl "http://localhost:3000/users?isActive=true"
```

### 6. Get One User

```bash
curl http://localhost:3000/users/1
```

### 7. Update User

```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "age": 26
  }'
```

### 8. Delete User (Soft Delete)

```bash
curl -X DELETE http://localhost:3000/users/1
```

### 9. Restore User

```bash
curl -X POST http://localhost:3000/users/1/restore
```

### 10. Get Count

```bash
curl http://localhost:3000/users/meta/count
```

---

## 🔍 Query Builder Deep Dive

### Basic Query Builder

```typescript
const users = await this.usersRepository
  .createQueryBuilder('user')
  .getMany();
```

### WHERE Clause

```typescript
// Simple WHERE
const users = await this.usersRepository
  .createQueryBuilder('user')
  .where('user.isActive = :isActive', { isActive: true })
  .getMany();

// AND condition
const users = await this.usersRepository
  .createQueryBuilder('user')
  .where('user.isActive = :isActive', { isActive: true })
  .andWhere('user.age > :age', { age: 18 })
  .getMany();

// OR condition
const users = await this.usersRepository
  .createQueryBuilder('user')
  .where('user.firstName = :name', { name: 'John' })
  .orWhere('user.lastName = :name', { name: 'John' })
  .getMany();
```

### LIKE Query

```typescript
const users = await this.usersRepository
  .createQueryBuilder('user')
  .where('user.email LIKE :email', { email: '%@gmail.com' })
  .getMany();
```

### IN Query

```typescript
const users = await this.usersRepository
  .createQueryBuilder('user')
  .where('user.id IN (:...ids)', { ids: [1, 2, 3] })
  .getMany();
```

### ORDER BY

```typescript
const users = await this.usersRepository
  .createQueryBuilder('user')
  .orderBy('user.createdAt', 'DESC')
  .addOrderBy('user.username', 'ASC')
  .getMany();
```

### LIMIT & OFFSET

```typescript
const users = await this.usersRepository
  .createQueryBuilder('user')
  .skip(10)  // OFFSET 10
  .take(5)   // LIMIT 5
  .getMany();
```

### SELECT Specific Columns

```typescript
const users = await this.usersRepository
  .createQueryBuilder('user')
  .select(['user.id', 'user.email', 'user.username'])
  .getMany();
```

### COUNT

```typescript
const count = await this.usersRepository
  .createQueryBuilder('user')
  .where('user.isActive = :isActive', { isActive: true })
  .getCount();
```

### getManyAndCount()

```typescript
const [users, total] = await this.usersRepository
  .createQueryBuilder('user')
  .skip(0)
  .take(10)
  .getManyAndCount();
```

### getRawOne() & getRawMany()

```typescript
// Get raw data (no entity transformation)
const result = await this.usersRepository
  .createQueryBuilder('user')
  .select('COUNT(*)', 'count')
  .addSelect('AVG(user.age)', 'avgAge')
  .getRawOne();

console.log(result);
// { count: '100', avgAge: 25.5 }
```

---

## 🛡️ Error Handling

### Custom Exception Filter (Optional)

```typescript
// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

**Usage in main.ts:**
```typescript
app.useGlobalFilters(new HttpExceptionFilter());
```

---

## 🔄 Soft Delete vs Hard Delete

### Soft Delete

**Definition:** Mark record as deleted but keep in database

**Implementation:**
```typescript
@DeleteDateColumn()
deletedAt: Date;
```

**Methods:**
```typescript
// Soft delete
await repository.softRemove(user);
await repository.softDelete(id);

// Restore
await repository.restore(id);

// Find including deleted
await repository.find({ withDeleted: true });

// Find only deleted
await repository
  .createQueryBuilder('user')
  .where('user.deletedAt IS NOT NULL')
  .withDeleted()
  .getMany();
```

### Hard Delete

**Definition:** Permanently remove from database

**Methods:**
```typescript
await repository.remove(user);
await repository.delete(id);
```

**Comparison:**

| Feature | Soft Delete | Hard Delete |
|---------|-------------|-------------|
| Data Recovery | ✅ Yes | ❌ No |
| Database Space | Uses space | Frees space |
| Performance | Slower queries | Faster queries |
| Referential Integrity | Easier | Must handle cascades |
| Audit Trail | ✅ Maintained | ❌ Lost |

---

## 💾 Transaction Management

### Why Transactions?

**Problem:** Multiple database operations should succeed or fail together

**Example:**
```typescript
// Without transaction - RISKY!
await this.usersRepository.save(user);
await this.profileRepository.save(profile);
// If second fails, first already saved!

// With transaction - SAFE!
await this.connection.transaction(async (manager) => {
  await manager.save(user);
  await manager.save(profile);
  // Both succeed or both fail
});
```

### Using QueryRunner

```typescript
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}

  async createUserWithProfile(userData: any, profileData: any) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Save user
      const user = queryRunner.manager.create(User, userData);
      await queryRunner.manager.save(user);

      // Save profile
      const profile = queryRunner.manager.create(Profile, {
        ...profileData,
        userId: user.id,
      });
      await queryRunner.manager.save(profile);

      // Commit transaction
      await queryRunner.commitTransaction();

      return user;
    } catch (err) {
      // Rollback on error
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Release queryRunner
      await queryRunner.release();
    }
  }
}
```

### Using @Transaction() Decorator

```typescript
import { Transaction, TransactionManager, EntityManager } from 'typeorm';

@Injectable()
export class UsersService {
  @Transaction()
  async createUserWithProfile(
    userData: any,
    profileData: any,
    @TransactionManager() manager: EntityManager,
  ) {
    const user = manager.create(User, userData);
    await manager.save(user);

    const profile = manager.create(Profile, {
      ...profileData,
      userId: user.id,
    });
    await manager.save(profile);

    return user;
  }
}
```

---

## 📊 Pagination Helper

### Create Pagination Utility

```typescript
// src/common/utils/pagination.util.ts
export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function paginate<T>(
  data: T[],
  total: number,
  options: PaginationOptions,
): PaginationResult<T> {
  const { page, limit } = options;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
```

**Usage:**
```typescript
const [users, total] = await queryBuilder.getManyAndCount();
return paginate(users, total, { page, limit });
```

---

## 💡 Best Practices

### 1. Always Use DTOs

```typescript
// ❌ BAD
@Post()
create(@Body() body: any) { ... }

// ✅ GOOD
@Post()
create(@Body() createDto: CreateUserDto) { ... }
```

### 2. Don't Return Sensitive Data

```typescript
// ❌ BAD
return user;  // Includes password!

// ✅ GOOD
const { password, ...result } = user;
return result;
```

### 3. Use Transactions for Multiple Operations

```typescript
// ✅ GOOD
await this.connection.transaction(async (manager) => {
  await manager.save(user);
  await manager.save(profile);
});
```

### 4. Handle Errors Properly

```typescript
// ✅ GOOD
const user = await this.repository.findOne({ where: { id } });
if (!user) {
  throw new NotFoundException(`User with ID ${id} not found`);
}
```

### 5. Use Query Builder for Complex Queries

```typescript
// ✅ GOOD for complex queries
const users = await this.repository
  .createQueryBuilder('user')
  .where('user.age > :age', { age: 18 })
  .andWhere('user.isActive = :isActive', { isActive: true })
  .orderBy('user.createdAt', 'DESC')
  .getMany();
```

---

## 🎯 Summary

**CRUD Operations:**
- **Create:** `repository.save(entity)`
- **Read:** `repository.find()`, `findOne()`
- **Update:** `repository.save(entity)`, `update()`
- **Delete:** `repository.remove()`, `delete()`

**Query Builder:**
```typescript
repository.createQueryBuilder('alias')
  .where('alias.field = :value', { value })
  .orderBy('alias.field', 'DESC')
  .skip(offset)
  .take(limit)
  .getMany()
```

**Pagination:**
```typescript
const [data, total] = await queryBuilder.getManyAndCount();
```

**Transactions:**
```typescript
await connection.transaction(async (manager) => {
  await manager.save(entity1);
  await manager.save(entity2);
});
```

**Next Step:**
👉 Lanjut ke [Materi 19: Entity Relationships](./19-relationships-typeorm.md)

---

**Happy Coding! 🚀**
