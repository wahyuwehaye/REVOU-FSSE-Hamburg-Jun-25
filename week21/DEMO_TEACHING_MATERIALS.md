# Week 21 - Complete Teaching Demo Materials

## 📋 Table of Contents
- [Demo Session Plan](#demo-session-plan)
- [Live Coding Scripts](#live-coding-scripts)
- [Student Q&A](#student-qa)
- [Troubleshooting](#troubleshooting)

---

## Demo Session Plan

### 🎯 Session 1: Introduction & Setup (2 hours)

**Learning Objectives:**
- Understand what NestJS is and why use it
- Set up development environment
- Create first NestJS project
- Understand basic structure

**Demo Outline:**

**Part 1: Theory (30 min)**
```markdown
1. Show slide: What is Backend Development?
   - Server handles requests
   - Database stores data
   - API connects frontend to backend

2. Show slide: Why NestJS?
   - TypeScript support
   - Built-in features
   - Scalable architecture
   - Great documentation

3. Show real-world example:
   - Open Instagram/Twitter
   - Explain what backend does:
     * Login → Backend verifies credentials
     * Post photo → Backend saves to database
     * See feed → Backend fetches data
```

**Part 2: Setup Live Demo (30 min)**
```bash
# 1. Check prerequisites
node --version  # Should be 16+
npm --version   # Should be 8+

# 2. Install NestJS CLI
npm install -g @nestjs/cli

# 3. Create new project
nest new student-api

# Choose npm as package manager
# Wait for installation

# 4. Navigate and explore
cd student-api
ls -la

# 5. Show key files
cat src/main.ts         # Entry point
cat src/app.module.ts   # Root module
cat src/app.controller.ts # Example controller

# 6. Start server
npm run start:dev

# 7. Test in browser
# Open: http://localhost:3000
# Should see: "Hello World!"
```

**Part 3: Modify Hello World (30 min)**
```typescript
// Step 1: Open app.controller.ts
// Show current code

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

// Step 2: Add new endpoint
@Get('about')
getAbout(): string {
  return 'This is a NestJS API for learning';
}

// Step 3: Test new endpoint
// Open: http://localhost:3000/about

// Step 4: Return JSON
@Get('info')
getInfo() {
  return {
    name: 'Student API',
    version: '1.0.0',
    author: 'Your Name',
    description: 'Learning NestJS'
  };
}

// Step 5: Test JSON endpoint
// Open: http://localhost:3000/info
```

**Part 4: Hands-on Practice (30 min)**
```
Students do:
1. Create their own NestJS project
2. Change "Hello World" message
3. Add 2 new endpoints:
   - /student → Return their name
   - /course → Return course info
4. Test all endpoints

Instructor: Walk around, help students
```

---

### 🎯 Session 2: Building First CRUD API (3 hours)

**Part 1: Generate Resource (15 min)**
```bash
# In terminal
nest g resource tasks

# Questions:
# Transport layer? REST API
# Generate CRUD entry points? Yes

# Show generated files:
# src/tasks/
#   ├── dto/
#   ├── entities/
#   ├── tasks.controller.ts
#   ├── tasks.service.ts
#   └── tasks.module.ts
```

**Part 2: Define Data Structure (20 min)**
```typescript
// interfaces/task.interface.ts
export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}

// Explain each field:
// - id: unique identifier (number)
// - title: task name (required)
// - description: details (optional - see ?)
// - completed: done or not (boolean)
// - createdAt: when created (Date)
```

**Part 3: Create DTO with Validation (25 min)**
```bash
# Install validation packages
npm install class-validator class-transformer
```

```typescript
// dto/create-task.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}

// Explain decorators:
// @IsString() - must be text
// @IsNotEmpty() - cannot be empty
// @IsOptional() - field is optional
```

**Part 4: Implement Repository (30 min)**
```typescript
// tasks.repository.ts
import { Injectable } from '@nestjs/common';
import { Task } from './interfaces/task.interface';

@Injectable()
export class TasksRepository {
  private tasks: Task[] = [];
  private currentId = 1;

  // CREATE
  create(taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>): Task {
    const task: Task = {
      id: this.currentId++,
      ...taskData,
      completed: false,
      createdAt: new Date(),
    };
    
    this.tasks.push(task);
    return task;
  }

  // READ ALL
  findAll(): Task[] {
    return [...this.tasks];  // Return copy, not original
  }

  // READ ONE
  findById(id: number): Task | undefined {
    return this.tasks.find(t => t.id === id);
  }

  // UPDATE
  update(id: number, taskData: Partial<Task>): Task | undefined {
    const index = this.tasks.findIndex(t => t.id === id);
    
    if (index === -1) {
      return undefined;  // Not found
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...taskData,
    };
    
    return this.tasks[index];
  }

  // DELETE
  delete(id: number): boolean {
    const index = this.tasks.findIndex(t => t.id === id);
    
    if (index === -1) {
      return false;  // Not found
    }
    
    this.tasks.splice(index, 1);
    return true;
  }
}

// Explain:
// - @Injectable() - can be injected
// - private tasks - in-memory storage
// - currentId - auto-increment
// - Omit<> - exclude certain fields
// - Partial<> - all fields optional
// - ...spread operator
```

**Part 5: Implement Service (20 min)**
```typescript
// tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private repository: TasksRepository) {}

  create(dto: CreateTaskDto): Task {
    return this.repository.create(dto);
  }

  findAll(): Task[] {
    return this.repository.findAll();
  }

  findOne(id: number): Task {
    const task = this.repository.findById(id);
    
    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }
    
    return task;
  }

  update(id: number, dto: UpdateTaskDto): Task {
    const task = this.repository.update(id, dto);
    
    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }
    
    return task;
  }

  remove(id: number): { message: string } {
    const success = this.repository.delete(id);
    
    if (!success) {
      throw new NotFoundException(`Task #${id} not found`);
    }
    
    return { message: 'Task deleted successfully' };
  }

  // Custom business logic
  completeTask(id: number): Task {
    const task = this.findOne(id);
    
    if (task.completed) {
      throw new BadRequestException('Task already completed');
    }
    
    return this.repository.update(id, { completed: true })!;
  }
}

// Explain:
// - Service uses Repository
// - Service handles business logic
// - Service throws exceptions
// - NotFoundException for 404
// - BadRequestException for 400
```

**Part 6: Implement Controller (20 min)**
```typescript
// tasks.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto
  ) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }

  @Post(':id/complete')
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.completeTask(id);
  }
}

// Explain:
// - @Controller('tasks') - base path /tasks
// - @Post() - HTTP POST method
// - @Get() - HTTP GET method
// - @Body() - request body
// - @Param() - URL parameter
// - ParseIntPipe - convert string to number
```

**Part 7: Enable Validation (10 min)**
```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  await app.listen(3000);
}
```

**Part 8: Testing with Postman (30 min)**

```markdown
# Demo Testing Script

1. CREATE TASK
POST http://localhost:3000/tasks
Body (JSON):
{
  "title": "Learn NestJS",
  "description": "Complete all tutorials"
}

Expected: 201 Created
Response: Task object with id, createdAt, completed: false

2. CREATE INVALID TASK
POST http://localhost:3000/tasks
Body (JSON):
{
  "title": ""
}

Expected: 400 Bad Request
Response: Validation error message

3. GET ALL TASKS
GET http://localhost:3000/tasks

Expected: 200 OK
Response: Array of tasks

4. GET ONE TASK
GET http://localhost:3000/tasks/1

Expected: 200 OK
Response: Single task object

5. GET NON-EXISTENT TASK
GET http://localhost:3000/tasks/999

Expected: 404 Not Found
Response: Error message

6. UPDATE TASK
PATCH http://localhost:3000/tasks/1
Body (JSON):
{
  "title": "Learn NestJS (Updated)"
}

Expected: 200 OK
Response: Updated task

7. COMPLETE TASK
POST http://localhost:3000/tasks/1/complete

Expected: 200 OK
Response: Task with completed: true

8. DELETE TASK
DELETE http://localhost:3000/tasks/1

Expected: 200 OK
Response: Success message
```

**Part 9: Hands-on Exercise (30 min)**
```
Students create their own resource:

Option 1: Products API
- Create product (name, price, description)
- Get all products
- Get product by ID
- Update product
- Delete product

Option 2: Notes API
- Create note (title, content, tags)
- Get all notes
- Get note by ID
- Update note
- Delete note

Requirements:
✅ Use Repository pattern
✅ Add validation to DTO
✅ Handle errors properly
✅ Test all endpoints
```

---

### 🎯 Session 3: Documentation with Swagger & Postman (2 hours)

**Part 1: Setup Swagger (20 min)**
```bash
# Install dependencies
npm install @nestjs/swagger swagger-ui-express
```

```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Tasks API')
  .setDescription('Complete CRUD API for task management')
  .setVersion('1.0')
  .addTag('tasks')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);

console.log('Swagger docs: http://localhost:3000/api/docs');
```

**Part 2: Add Swagger Decorators (30 min)**
```typescript
// tasks.controller.ts
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks' })
  findAll() {
    return this.tasksService.findAll();
  }
}

// dto/create-task.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Learn NestJS',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Complete all NestJS tutorials',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
```

**Part 3: Test Swagger UI (10 min)**
```
1. Open: http://localhost:3000/api/docs
2. Show all endpoints
3. Click "Try it out"
4. Execute requests
5. See responses
```

**Part 4: Create Postman Collection (30 min)**
```
Live demo:

1. Open Postman
2. Create new collection: "Tasks API"
3. Add environment variables:
   - baseUrl: http://localhost:3000

4. Create requests:
   - POST /tasks → Create Task
   - GET /tasks → Get All Tasks
   - GET /tasks/:id → Get Task
   - PATCH /tasks/:id → Update Task
   - DELETE /tasks/:id → Delete Task

5. Add tests to each request
6. Save collection
7. Export collection.json
```

**Part 5: Add Postman Tests (20 min)**
```javascript
// Test: Create Task
pm.test("Status is 201", function() {
  pm.response.to.have.status(201);
});

pm.test("Task created", function() {
  const json = pm.response.json();
  pm.expect(json).to.have.property('id');
  pm.expect(json.completed).to.be.false;
  
  // Save task ID
  pm.environment.set("taskId", json.id);
});

// Test: Get All Tasks
pm.test("Status is 200", function() {
  pm.response.to.have.status(200);
});

pm.test("Returns array", function() {
  const json = pm.response.json();
  pm.expect(json).to.be.an('array');
});

// Test: Get Task by ID
pm.test("Returns correct task", function() {
  const json = pm.response.json();
  const taskId = pm.environment.get("taskId");
  pm.expect(json.id).to.equal(parseInt(taskId));
});
```

**Part 6: Hands-on Practice (20 min)**
```
Students:
1. Add Swagger to their API
2. Add all decorators
3. Test in Swagger UI
4. Create Postman collection
5. Add tests
6. Share collection with partner
```

---

## Student Q&A

### Common Questions & Answers

**Q1: "Why use NestJS instead of Express?"**
```
A: Express is great for simple apps, but as your app grows:
- Express: You need to organize code yourself
- NestJS: Structure is built-in

Think of it like:
- Express: Building with LEGO (flexible but need to plan)
- NestJS: Building with pre-made building blocks (faster, organized)

Use NestJS for:
✅ Large applications
✅ Team projects
✅ Long-term maintenance

Use Express for:
✅ Small APIs
✅ Prototypes
✅ Simple projects
```

**Q2: "What is Dependency Injection?"**
```
A: Instead of creating dependencies yourself, NestJS provides them.

Without DI:
class TasksService {
  constructor() {
    this.repository = new TasksRepository();  // Bad: hard to test
  }
}

With DI:
class TasksService {
  constructor(private repository: TasksRepository) {}  // Good: testable
}

Benefits:
✅ Easy to test (can mock repository)
✅ Loose coupling
✅ Easy to change implementation
```

**Q3: "When to use Service vs Repository?"**
```
A: Think of it like a restaurant:

Repository = Kitchen (data storage)
- Knows how to store/retrieve data
- Methods: create(), findAll(), findById()
- No business logic

Service = Chef (business logic)
- Uses Repository to get/save data
- Adds business rules
- Example: "Discount if order > $100"
- Methods: createOrder(), calculateDiscount()

Controller = Waiter (HTTP handler)
- Takes orders (requests)
- Delivers food (responses)
- No business logic

Never put business logic in Controller or Repository!
```

**Q4: "Why so many decorators?"**
```
A: Decorators add functionality without cluttering code.

@Controller('tasks')  → Makes class handle /tasks routes
@Get()               → Handle GET requests
@Post()              → Handle POST requests
@Body()              → Extract request body
@Param('id')         → Extract URL parameter
@IsString()          → Validate is string
@ApiTags('tasks')    → Group in Swagger

Think of decorators as:
- Instructions to NestJS
- Metadata about your code
- Configuration without config files

You'll learn them by using them!
```

**Q5: "Do I need to memorize all this?"**
```
A: No! You need to understand concepts:

Understand:
✅ Controller → Service → Repository flow
✅ Why separate concerns
✅ How DI works
✅ CRUD operations

Reference:
📚 Decorator syntax (@Get, @Post, etc.)
📚 Validation decorators (@IsString, @IsEmail)
📚 Exact method signatures

Tip: Keep NestJS docs open while coding!
```

---

## Troubleshooting

### Setup Issues

**Issue 1: nest command not found**
```bash
# Check if installed
nest --version

# If not working, install globally
npm install -g @nestjs/cli

# Mac/Linux might need sudo
sudo npm install -g @nestjs/cli

# Verify
nest --version
```

**Issue 2: Port 3000 already in use**
```bash
# Find what's using port 3000
# Mac/Linux:
lsof -i :3000

# Windows:
netstat -ano | findstr :3000

# Kill the process
kill -9 <PID>

# Or change port in main.ts
await app.listen(3001);
```

**Issue 3: Module not found**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install

# Or
npm ci
```

### Runtime Issues

**Issue 1: Validation not working**
```typescript
// Check ValidationPipe is enabled in main.ts
app.useGlobalPipes(new ValidationPipe());

// Check decorators are imported from correct package
import { IsString } from 'class-validator';  // ✅ Correct
import { IsString } from '@nestjs/common';   // ❌ Wrong
```

**Issue 2: Dependency injection error**
```typescript
// Error: "Nest can't resolve dependencies"

// Solution 1: Register in module providers
@Module({
  providers: [TasksService, TasksRepository],  // Add TasksRepository
})

// Solution 2: Check @Injectable() decorator
@Injectable()  // Must have this
export class TasksRepository {}
```

**Issue 3: Routes not working**
```typescript
// Check controller is registered in module
@Module({
  controllers: [TasksController],  // Must be here
  providers: [TasksService],
})

// Check server is running
npm run start:dev

// Check correct HTTP method
@Get()   // For GET requests
@Post()  // For POST requests
```

### Common Mistakes

**Mistake 1: Business logic in controller**
```typescript
// ❌ Bad
@Controller('orders')
export class OrdersController {
  @Post()
  create(@Body() dto: CreateOrderDto) {
    const total = dto.items.reduce((sum, item) => sum + item.price, 0);
    const discount = total > 100 ? total * 0.1 : 0;
    // ... more logic
  }
}

// ✅ Good
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}
  
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);  // Delegate to service
  }
}
```

**Mistake 2: Not handling errors**
```typescript
// ❌ Bad
findOne(id: number): Task {
  return this.repository.findById(id);  // Could be undefined!
}

// ✅ Good
findOne(id: number): Task {
  const task = this.repository.findById(id);
  
  if (!task) {
    throw new NotFoundException(`Task #${id} not found`);
  }
  
  return task;
}
```

**Mistake 3: Mutation of data**
```typescript
// ❌ Bad
findAll(): Task[] {
  return this.tasks;  // Returns reference, can be mutated!
}

// ✅ Good
findAll(): Task[] {
  return [...this.tasks];  // Returns copy
}
```

---

## Summary

✅ **Session 1:** Setup & Hello World
✅ **Session 2:** Complete CRUD API
✅ **Session 3:** Documentation

**Key Takeaways:**
- NestJS provides structure
- Controller → Service → Repository
- Validation with DTOs
- Error handling
- Documentation with Swagger
- Testing with Postman

**Students can now:**
- Create NestJS projects
- Build CRUD APIs
- Validate data
- Handle errors
- Document APIs
- Test with Postman

**Next Steps:**
- Database integration
- Authentication
- Deployment

🚀 **Happy Teaching!**
