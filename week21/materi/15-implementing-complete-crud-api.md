# Chapter 15: Implementing Complete CRUD API

## 📚 Daftar Isi
- [Project Overview](#project-overview)
- [Step-by-Step Implementation](#step-by-step-implementation)
- [Testing the API](#testing-the-api)
- [Common Patterns](#common-patterns)

---

## Project Overview

Kita akan membuat **Task Management API** lengkap dengan semua best practices:
- ✅ Complete CRUD operations
- ✅ Repository Pattern
- ✅ Service Layer
- ✅ DTOs with Validation
- ✅ Error Handling
- ✅ Custom Business Logic

### API Endpoints

```
POST   /tasks              # Create task
GET    /tasks              # Get all tasks (with filters)
GET    /tasks/:id          # Get task by ID
PATCH  /tasks/:id          # Update task
DELETE /tasks/:id          # Delete task
POST   /tasks/:id/complete # Mark as complete
GET    /tasks/stats        # Get statistics
```

---

## Step-by-Step Implementation

### Step 1: Generate Module, Service, Controller

```bash
# Generate complete feature module
nest g resource tasks

# Select: REST API
# Generate CRUD entry points? Yes
```

This creates:
```
src/tasks/
  ├── dto/
  │   ├── create-task.dto.ts
  │   └── update-task.dto.ts
  ├── entities/
  │   └── task.entity.ts
  ├── tasks.controller.ts
  ├── tasks.service.ts
  └── tasks.module.ts
```

### Step 2: Define Entity/Interface

```typescript
// interfaces/task.interface.ts
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  assignee?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}
```

### Step 3: Create DTOs with Validation

```typescript
// dto/create-task.dto.ts
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum,
  IsDateString,
  IsArray,
  MinLength,
  MaxLength 
} from 'class-validator';
import { TaskPriority, TaskStatus } from '../interfaces/task.interface';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  assignee?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

// dto/update-task.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

// dto/query-task.dto.ts
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../interfaces/task.interface';

export class QueryTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsString()
  assignee?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
```

### Step 4: Implement Repository

```typescript
// tasks.repository.ts
import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './interfaces/task.interface';

@Injectable()
export class TasksRepository {
  private tasks: Task[] = [];
  private currentId = 1;

  create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const task: Task = {
      id: this.currentId++,
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.tasks.push(task);
    return task;
  }

  findAll(): Task[] {
    return [...this.tasks];
  }

  findById(id: number): Task | undefined {
    return this.tasks.find(t => t.id === id);
  }

  findByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter(t => t.status === status);
  }

  findByAssignee(assignee: string): Task[] {
    return this.tasks.filter(t => 
      t.assignee?.toLowerCase() === assignee.toLowerCase()
    );
  }

  update(id: number, taskData: Partial<Task>): Task | undefined {
    const index = this.tasks.findIndex(t => t.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...taskData,
      updatedAt: new Date(),
    };
    
    return this.tasks[index];
  }

  delete(id: number): boolean {
    const index = this.tasks.findIndex(t => t.id === id);
    
    if (index === -1) {
      return false;
    }
    
    this.tasks.splice(index, 1);
    return true;
  }

  search(query: string): Task[] {
    const lowerQuery = query.toLowerCase();
    return this.tasks.filter(t =>
      t.title.toLowerCase().includes(lowerQuery) ||
      t.description?.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  count(): number {
    return this.tasks.length;
  }

  countByStatus(status: TaskStatus): number {
    return this.tasks.filter(t => t.status === status).length;
  }
}
```

### Step 5: Implement Service with Business Logic

```typescript
// tasks.service.ts
import { 
  Injectable, 
  NotFoundException,
  BadRequestException 
} from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { Task, TaskStatus, TaskPriority } from './interfaces/task.interface';

@Injectable()
export class TasksService {
  constructor(private readonly repository: TasksRepository) {}

  create(createTaskDto: CreateTaskDto): Task {
    // Set defaults
    const taskData = {
      ...createTaskDto,
      status: createTaskDto.status || TaskStatus.TODO,
      priority: createTaskDto.priority || TaskPriority.MEDIUM,
      tags: createTaskDto.tags || [],
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined,
    };

    // Business rule: Validate due date
    if (taskData.dueDate && taskData.dueDate < new Date()) {
      throw new BadRequestException('Due date cannot be in the past');
    }

    return this.repository.create(taskData);
  }

  findAll(query?: QueryTaskDto): Task[] {
    let tasks = this.repository.findAll();

    // Apply filters
    if (query) {
      if (query.status) {
        tasks = tasks.filter(t => t.status === query.status);
      }

      if (query.priority) {
        tasks = tasks.filter(t => t.priority === query.priority);
      }

      if (query.assignee) {
        tasks = tasks.filter(t => 
          t.assignee?.toLowerCase() === query.assignee!.toLowerCase()
        );
      }

      if (query.search) {
        tasks = this.repository.search(query.search);
      }
    }

    return tasks;
  }

  findOne(id: number): Task {
    const task = this.repository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }

    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    // Ensure task exists
    this.findOne(id);

    // Business rule: Cannot update completed task
    const task = this.repository.findById(id);
    if (task!.status === TaskStatus.COMPLETED) {
      throw new BadRequestException('Cannot update completed task');
    }

    // Validate due date if being updated
    if (updateTaskDto.dueDate) {
      const dueDate = new Date(updateTaskDto.dueDate);
      if (dueDate < new Date()) {
        throw new BadRequestException('Due date cannot be in the past');
      }
    }

    const updated = this.repository.update(id, updateTaskDto);

    if (!updated) {
      throw new NotFoundException(`Task #${id} not found`);
    }

    return updated;
  }

  remove(id: number): { message: string } {
    // Ensure task exists
    this.findOne(id);

    const success = this.repository.delete(id);

    if (!success) {
      throw new NotFoundException(`Task #${id} not found`);
    }

    return { message: 'Task deleted successfully' };
  }

  // Custom business logic
  completeTask(id: number): Task {
    const task = this.findOne(id);

    if (task.status === TaskStatus.COMPLETED) {
      throw new BadRequestException('Task is already completed');
    }

    const updated = this.repository.update(id, {
      status: TaskStatus.COMPLETED,
      completedAt: new Date(),
    });

    return updated!;
  }

  startTask(id: number): Task {
    const task = this.findOne(id);

    if (task.status !== TaskStatus.TODO) {
      throw new BadRequestException(
        `Cannot start task with status "${task.status}"`
      );
    }

    const updated = this.repository.update(id, {
      status: TaskStatus.IN_PROGRESS,
    });

    return updated!;
  }

  cancelTask(id: number): Task {
    const task = this.findOne(id);

    if (task.status === TaskStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed task');
    }

    const updated = this.repository.update(id, {
      status: TaskStatus.CANCELLED,
    });

    return updated!;
  }

  getStatistics() {
    const tasks = this.repository.findAll();
    
    const total = tasks.length;
    const completed = this.repository.countByStatus(TaskStatus.COMPLETED);
    const inProgress = this.repository.countByStatus(TaskStatus.IN_PROGRESS);
    const todo = this.repository.countByStatus(TaskStatus.TODO);
    const cancelled = this.repository.countByStatus(TaskStatus.CANCELLED);

    const byPriority = {
      low: tasks.filter(t => t.priority === TaskPriority.LOW).length,
      medium: tasks.filter(t => t.priority === TaskPriority.MEDIUM).length,
      high: tasks.filter(t => t.priority === TaskPriority.HIGH).length,
      urgent: tasks.filter(t => t.priority === TaskPriority.URGENT).length,
    };

    const overdue = tasks.filter(t => 
      t.dueDate && 
      t.dueDate < new Date() && 
      t.status !== TaskStatus.COMPLETED
    ).length;

    return {
      total,
      byStatus: {
        todo,
        inProgress,
        completed,
        cancelled,
      },
      byPriority,
      overdue,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(2) + '%' : '0%',
    };
  }

  getOverdueTasks(): Task[] {
    const tasks = this.repository.findAll();
    return tasks.filter(t =>
      t.dueDate &&
      t.dueDate < new Date() &&
      t.status !== TaskStatus.COMPLETED
    );
  }

  getTasksByAssignee(assignee: string): Task[] {
    const tasks = this.repository.findByAssignee(assignee);
    
    if (tasks.length === 0) {
      throw new NotFoundException(`No tasks found for assignee "${assignee}"`);
    }
    
    return tasks;
  }
}
```

### Step 6: Implement Controller

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
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Query() query: QueryTaskDto) {
    return this.tasksService.findAll(query);
  }

  @Get('statistics')
  getStatistics() {
    return this.tasksService.getStatistics();
  }

  @Get('overdue')
  getOverdueTasks() {
    return this.tasksService.getOverdueTasks();
  }

  @Get('assignee/:assignee')
  getTasksByAssignee(@Param('assignee') assignee: string) {
    return this.tasksService.getTasksByAssignee(assignee);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Post(':id/complete')
  completeTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.completeTask(id);
  }

  @Post(':id/start')
  startTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.startTask(id);
  }

  @Post(':id/cancel')
  cancelTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.cancelTask(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
```

### Step 7: Register in Module

```typescript
// tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
  exports: [TasksService, TasksRepository],
})
export class TasksModule {}
```

---

## Testing the API

### 1. Create Task
```http
POST http://localhost:3000/tasks
Content-Type: application/json

{
  "title": "Complete NestJS Tutorial",
  "description": "Learn CRUD operations",
  "priority": "high",
  "assignee": "John Doe",
  "dueDate": "2024-12-31",
  "tags": ["learning", "nestjs"]
}
```

### 2. Get All Tasks with Filters
```http
# Get all tasks
GET http://localhost:3000/tasks

# Filter by status
GET http://localhost:3000/tasks?status=todo

# Filter by priority
GET http://localhost:3000/tasks?priority=high

# Search
GET http://localhost:3000/tasks?search=tutorial
```

### 3. Complete Task
```http
POST http://localhost:3000/tasks/1/complete
```

### 4. Get Statistics
```http
GET http://localhost:3000/tasks/statistics
```

---

## Common Patterns

### Pattern 1: Validation in DTOs
```typescript
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;
}
```

### Pattern 2: Business Logic in Service
```typescript
completeTask(id: number): Task {
  // Validate state
  if (task.status === TaskStatus.COMPLETED) {
    throw new BadRequestException('Already completed');
  }
  // Update
  return this.repository.update(id, { status: TaskStatus.COMPLETED });
}
```

### Pattern 3: Error Handling
```typescript
findOne(id: number): Task {
  const task = this.repository.findById(id);
  if (!task) {
    throw new NotFoundException(`Task #${id} not found`);
  }
  return task;
}
```

---

## Summary

✅ Complete CRUD implementation
✅ Repository pattern for data access
✅ Service layer for business logic
✅ DTOs with validation
✅ Error handling
✅ Custom endpoints for business operations

**Next:** Custom Business Logic & Request Lifecycle! 🚀
