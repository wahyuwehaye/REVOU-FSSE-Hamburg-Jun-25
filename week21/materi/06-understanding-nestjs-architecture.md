# Understanding NestJS Architecture

## NestJS Architecture Overview

NestJS menggunakan **modular architecture** yang inspired by Angular. Setiap aplikasi NestJS terdiri dari modules, controllers, services, dan components lainnya yang bekerja bersama.

## Core Building Blocks

```
┌─────────────────────────────────────────┐
│         NestJS Application              │
├─────────────────────────────────────────┤
│  ┌────────────────────────────────┐    │
│  │       App Module (Root)        │    │
│  │                                 │    │
│  │  ┌──────────────────────────┐  │    │
│  │  │   Feature Modules        │  │    │
│  │  │                          │  │    │
│  │  │  ┌────────────────────┐ │  │    │
│  │  │  │   Controllers      │ │  │    │
│  │  │  │   (HTTP Layer)     │ │  │    │
│  │  │  └────────────────────┘ │  │    │
│  │  │           ↓              │  │    │
│  │  │  ┌────────────────────┐ │  │    │
│  │  │  │    Services        │ │  │    │
│  │  │  │  (Business Logic)  │ │  │    │
│  │  │  └────────────────────┘ │  │    │
│  │  │           ↓              │  │    │
│  │  │  ┌────────────────────┐ │  │    │
│  │  │  │   Repositories     │ │  │    │
│  │  │  │  (Data Access)     │ │  │    │
│  │  │  └────────────────────┘ │  │    │
│  │  └──────────────────────────┘  │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## 1. Modules (@Module)

**Module** adalah class dengan `@Module()` decorator yang mengorganize application structure.

### Root Module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [UsersModule, ProductsModule],  // Import other modules
  controllers: [AppController],             // Register controllers
  providers: [AppService],                  // Register providers (services)
  exports: [],                              // Export providers for other modules
})
export class AppModule {}
```

### Feature Module

```typescript
// users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [],                    // Dependencies from other modules
  controllers: [UsersController], // Controllers in this module
  providers: [UsersService],      // Services in this module
  exports: [UsersService],        // Export for use in other modules
})
export class UsersModule {}
```

### Module Properties

| Property | Description | Example |
|----------|-------------|---------|
| `imports` | Other modules this module depends on | `[DatabaseModule]` |
| `controllers` | Controllers defined in this module | `[UsersController]` |
| `providers` | Services/providers in this module | `[UsersService]` |
| `exports` | Providers to make available to other modules | `[UsersService]` |

## 2. Controllers (@Controller)

**Controller** menangani HTTP requests dan return responses ke client.

```typescript
// users/users.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')  // Base route: /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()  // GET /users
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')  // GET /users/:id
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()  // POST /users
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')  // PUT /users/:id
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')  // DELETE /users/:id
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

### Controller Decorators

| Decorator | Description | Example |
|-----------|-------------|---------|
| `@Controller('path')` | Define base route | `@Controller('users')` |
| `@Get()` | Handle GET requests | `@Get()` or `@Get(':id')` |
| `@Post()` | Handle POST requests | `@Post()` |
| `@Put()` | Handle PUT requests | `@Put(':id')` |
| `@Patch()` | Handle PATCH requests | `@Patch(':id')` |
| `@Delete()` | Handle DELETE requests | `@Delete(':id')` |
| `@Param()` | Extract route parameters | `@Param('id')` |
| `@Body()` | Extract request body | `@Body()` |
| `@Query()` | Extract query parameters | `@Query('search')` |

## 3. Services (@Injectable)

**Service** contains business logic dan dapat di-inject ke controllers atau services lain.

```typescript
// users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private users = []; // In-memory storage (temporary)

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  create(createUserDto: CreateUserDto) {
    const newUser = {
      id: Date.now().toString(),
      ...createUserDto,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, updateUserDto: any) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date(),
    };
    return this.users[userIndex];
  }

  remove(id: string) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(userIndex, 1);
    return { message: 'User deleted successfully' };
  }
}
```

## 4. Data Transfer Objects (DTOs)

**DTO** defines shape of data for requests.

```typescript
// users/dto/create-user.dto.ts
export class CreateUserDto {
  name: string;
  email: string;
  age?: number;
}

// users/dto/update-user.dto.ts
export class UpdateUserDto {
  name?: string;
  email?: string;
  age?: number;
}
```

## Dependency Injection

NestJS uses **Dependency Injection** pattern untuk managing dependencies.

### How It Works

```typescript
// 1. Mark service as injectable
@Injectable()
export class UsersService {
  findAll() {
    return [];
  }
}

// 2. Register in module
@Module({
  providers: [UsersService],  // Register here
})
export class UsersModule {}

// 3. Inject into controller
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // NestJS automatically injects UsersService
}
```

### Service Injecting Another Service

```typescript
@Injectable()
export class EmailService {
  sendEmail(to: string, subject: string, body: string) {
    console.log(`Sending email to ${to}`);
  }
}

@Injectable()
export class UsersService {
  constructor(private readonly emailService: EmailService) {}

  async create(createUserDto: CreateUserDto) {
    // Create user logic
    const user = { ...createUserDto, id: '1' };
    
    // Use injected service
    await this.emailService.sendEmail(
      user.email,
      'Welcome!',
      'Thank you for signing up'
    );
    
    return user;
  }
}

@Module({
  providers: [UsersService, EmailService],  // Both registered
})
export class UsersModule {}
```

## Request Lifecycle

```
1. Incoming Request
   ↓
2. Middleware (if any)
   ↓
3. Guards (authentication/authorization)
   ↓
4. Interceptors (before)
   ↓
5. Pipes (validation/transformation)
   ↓
6. Controller Handler
   ↓
7. Service (business logic)
   ↓
8. Interceptors (after)
   ↓
9. Exception Filters (if error)
   ↓
10. Response to Client
```

## Complete Example: Blog Application

### 1. Module Structure

```
src/
├── app.module.ts
├── main.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
│       └── create-user.dto.ts
└── posts/
    ├── posts.module.ts
    ├── posts.controller.ts
    ├── posts.service.ts
    └── dto/
        └── create-post.dto.ts
```

### 2. Posts Module

```typescript
// posts/posts.module.ts
@Module({
  imports: [UsersModule],  // Need users info
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
```

### 3. Posts Service

```typescript
// posts/posts.service.ts
@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}
  // Inject UsersService from UsersModule

  async create(createPostDto: CreatePostDto) {
    // Verify user exists
    const user = await this.usersService.findOne(createPostDto.userId);
    
    // Create post
    const post = {
      id: Date.now().toString(),
      ...createPostDto,
      author: user,
      createdAt: new Date(),
    };
    
    return post;
  }
}
```

### 4. Posts Controller

```typescript
// posts/posts.controller.ts
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }
}
```

## Architecture Best Practices

### 1. Single Responsibility Principle

```typescript
// ❌ Bad: Controller with business logic
@Controller('users')
export class UsersController {
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // Validation logic
    if (!createUserDto.email.includes('@')) {
      throw new Error('Invalid email');
    }
    
    // Business logic
    const user = { ...createUserDto, id: Date.now() };
    
    // Database logic
    database.save(user);
    
    return user;
  }
}

// ✅ Good: Separation of concerns
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    // Business logic here
    const user = await this.usersRepository.save(createUserDto);
    return user;
  }
}
```

### 2. Module Organization

```typescript
// ✅ Good: Feature-based modules
@Module({
  imports: [
    UsersModule,
    ProductsModule,
    OrdersModule,
    AuthModule,
  ],
})
export class AppModule {}
```

### 3. Dependency Management

```typescript
// ✅ Good: Clear dependencies
@Module({
  imports: [UsersModule],  // Import module, not service directly
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
```

## Common Patterns

### Repository Pattern

```typescript
@Injectable()
export class UsersRepository {
  private users = [];

  async findAll() {
    return this.users;
  }

  async findById(id: string) {
    return this.users.find(u => u.id === id);
  }

  async save(user: any) {
    this.users.push(user);
    return user;
  }
}

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll() {
    return this.usersRepository.findAll();
  }
}
```

### Factory Pattern

```typescript
@Injectable()
export class UsersServiceFactory {
  create(type: string) {
    if (type === 'admin') {
      return new AdminUsersService();
    }
    return new RegularUsersService();
  }
}
```

## Kesimpulan

NestJS Architecture provides:
- ✅ **Clear structure**: Modules, Controllers, Services
- ✅ **Separation of concerns**: Each component has specific role
- ✅ **Dependency Injection**: Easy to manage dependencies
- ✅ **Testability**: Easy to test each component
- ✅ **Scalability**: Easy to add new features
- ✅ **Maintainability**: Easy to understand and modify

## Next Steps

Setelah memahami architecture:
1. Create modules dengan NestJS CLI
2. Implement controllers dan services
3. Use DTOs untuk data validation
4. Build complete CRUD application

---

**Remember:**
> Controller handles requests → Service contains logic → Repository accesses data
