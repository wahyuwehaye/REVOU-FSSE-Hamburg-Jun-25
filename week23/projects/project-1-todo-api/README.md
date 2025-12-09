# ✅ Project 1: Todo API (Beginner Level)

Build a complete Todo List API with user authentication using NestJS, PostgreSQL, and TypeORM.

## 🎯 Project Overview

**Difficulty:** Beginner  
**Estimated Time:** 4-6 hours  
**Technologies:** NestJS, PostgreSQL, TypeORM, JWT

### Learning Objectives
- ✅ Build RESTful API with CRUD operations
- ✅ Implement user authentication (JWT)
- ✅ Work with One-to-Many relationships
- ✅ Handle user-specific data
- ✅ Implement basic validation
- ✅ Set up database migrations

---

## 📋 Requirements

### Functional Requirements

#### 1. User Management
- [ ] User registration
- [ ] User login (JWT authentication)
- [ ] Get user profile
- [ ] Update user profile

#### 2. Todo Management
- [ ] Create todo (authenticated users only)
- [ ] Get all todos (user's own todos)
- [ ] Get single todo by ID
- [ ] Update todo
- [ ] Delete todo
- [ ] Mark todo as completed/incomplete
- [ ] Filter todos by status (all, completed, active)
- [ ] Search todos by title

### Technical Requirements
- [ ] Use TypeORM for database operations
- [ ] Implement JWT authentication
- [ ] Use DTOs for validation
- [ ] Proper error handling
- [ ] API documentation (README)
- [ ] Environment variables for configuration

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(200) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Todos Table
```sql
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  isCompleted BOOLEAN DEFAULT false,
  dueDate TIMESTAMP,
  userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### ER Diagram
```
User (1) ----< (N) Todo
```

---

## 📂 Project Structure

```
project-1-todo-api/
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── user.entity.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── todos/
│   │   ├── dto/
│   │   │   ├── create-todo.dto.ts
│   │   │   ├── update-todo.dto.ts
│   │   │   └── query-todo.dto.ts
│   │   ├── todo.entity.ts
│   │   ├── todos.controller.ts
│   │   ├── todos.service.ts
│   │   └── todos.module.ts
│   ├── config/
│   │   └── database.config.ts
│   ├── app.module.ts
│   └── main.ts
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Setup Instructions

### Step 1: Create Project

```bash
# Create NestJS project
nest new project-1-todo-api
cd project-1-todo-api
```

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/config
npm install class-validator class-transformer

# Authentication
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install bcrypt
npm install -D @types/bcrypt @types/passport-jwt
```

### Step 3: Setup Environment

Create `.env`:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=todo_db

# App
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=1d
```

### Step 4: Create Database

```bash
createdb todo_db
```

---

## 💻 Implementation Guide

### Part 1: Entities

#### User Entity
```typescript
// src/users/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { Todo } from '../todos/todo.entity';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}
```

#### Todo Entity
```typescript
// src/todos/todo.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  @Index()
  isCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column()
  @Index()
  userId: number;

  @ManyToOne(() => User, (user) => user.todos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Part 2: Authentication

#### Auth Service
```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    const { password, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user || !(await user.comparePassword(loginDto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async validateUser(userId: number) {
    return await this.usersService.findOne(userId);
  }
}
```

#### JWT Strategy
```typescript
// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

#### JWT Auth Guard
```typescript
// src/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### Part 3: Todos Service & Controller

#### Todos Service
```typescript
// src/todos/todos.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  async create(userId: number, createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todosRepository.create({
      ...createTodoDto,
      userId,
    });
    return await this.todosRepository.save(todo);
  }

  async findAll(userId: number, query: QueryTodoDto) {
    const { search, status, page = 1, limit = 10 } = query;

    const queryBuilder = this.todosRepository
      .createQueryBuilder('todo')
      .where('todo.userId = :userId', { userId });

    // Search by title
    if (search) {
      queryBuilder.andWhere('todo.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    // Filter by status
    if (status === 'completed') {
      queryBuilder.andWhere('todo.isCompleted = :isCompleted', {
        isCompleted: true,
      });
    } else if (status === 'active') {
      queryBuilder.andWhere('todo.isCompleted = :isCompleted', {
        isCompleted: false,
      });
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Order by creation date
    queryBuilder.orderBy('todo.createdAt', 'DESC');

    const [todos, total] = await queryBuilder.getManyAndCount();

    return {
      data: todos,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: number, id: number): Promise<Todo> {
    const todo = await this.todosRepository.findOne({
      where: { id, userId },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async update(
    userId: number,
    id: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    const todo = await this.findOne(userId, id);
    Object.assign(todo, updateTodoDto);
    return await this.todosRepository.save(todo);
  }

  async remove(userId: number, id: number): Promise<void> {
    const todo = await this.findOne(userId, id);
    await this.todosRepository.remove(todo);
  }

  async toggleComplete(userId: number, id: number): Promise<Todo> {
    const todo = await this.findOne(userId, id);
    todo.isCompleted = !todo.isCompleted;
    return await this.todosRepository.save(todo);
  }

  async getStatistics(userId: number) {
    const total = await this.todosRepository.count({ where: { userId } });
    const completed = await this.todosRepository.count({
      where: { userId, isCompleted: true },
    });
    const active = total - completed;

    return {
      total,
      completed,
      active,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}
```

#### Todos Controller
```typescript
// src/todos/todos.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req, @Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(req.user.id, createTodoDto);
  }

  @Get()
  findAll(@Request() req, @Query() query: QueryTodoDto) {
    return this.todosService.findAll(req.user.id, query);
  }

  @Get('statistics')
  getStatistics(@Request() req) {
    return this.todosService.getStatistics(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(req.user.id, id);
  }

  @Put(':id')
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(req.user.id, id, updateTodoDto);
  }

  @Patch(':id/toggle')
  toggleComplete(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.todosService.toggleComplete(req.user.id, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(req.user.id, id);
  }
}
```

---

## 📋 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/profile` | Get user profile | Yes |

### Todos

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/todos` | Create todo | Yes |
| GET | `/todos` | Get all todos | Yes |
| GET | `/todos/statistics` | Get statistics | Yes |
| GET | `/todos/:id` | Get todo by ID | Yes |
| PUT | `/todos/:id` | Update todo | Yes |
| PATCH | `/todos/:id/toggle` | Toggle completed | Yes |
| DELETE | `/todos/:id` | Delete todo | Yes |

---

## 🧪 Testing Examples

### 1. Register User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### 3. Create Todo (with JWT)
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Learn NestJS",
    "description": "Complete the tutorial",
    "dueDate": "2024-02-01"
  }'
```

### 4. Get All Todos
```bash
curl http://localhost:3000/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Search Todos
```bash
curl "http://localhost:3000/todos?search=learn&status=active" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Toggle Todo Complete
```bash
curl -X PATCH http://localhost:3000/todos/1/toggle \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Get Statistics
```bash
curl http://localhost:3000/todos/statistics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## ✅ Evaluation Criteria

### Basic Requirements (60%)
- [ ] User registration & login working
- [ ] JWT authentication implemented
- [ ] CRUD operations for todos
- [ ] Todos are user-specific
- [ ] Basic validation with DTOs

### Intermediate Requirements (30%)
- [ ] Search functionality
- [ ] Filter by status (all/completed/active)
- [ ] Toggle complete/incomplete
- [ ] Statistics endpoint
- [ ] Proper error handling

### Advanced Requirements (10%)
- [ ] Due date tracking
- [ ] Pagination
- [ ] Update user profile
- [ ] Soft delete for todos
- [ ] Unit tests

---

## 🎓 Learning Exercises

1. **Add Categories:** Implement todo categories/tags
2. **Priority Levels:** Add priority field (low, medium, high)
3. **Subtasks:** Implement nested todos (parent-child relationship)
4. **Shared Todos:** Allow users to share todos with others
5. **Email Notifications:** Send reminders for due todos
6. **Sorting:** Add sorting by title, date, priority

---

## 📚 Resources

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [TypeORM Relations](https://typeorm.io/relations)
- [JWT Best Practices](https://jwt.io/introduction)
- [REST API Best Practices](https://restfulapi.net/)

---

**Good luck with your project! 🚀**
