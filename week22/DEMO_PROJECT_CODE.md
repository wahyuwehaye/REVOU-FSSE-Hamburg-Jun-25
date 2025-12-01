# 📦 Task Management API - Complete Source Code

**Companion to:** DEMO_SESSION_GUIDE.md  
**Purpose:** Reference untuk semua code yang dibuat dalam demo sessions

---

## 📁 Project Structure

```
task-management-api/
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── middleware/
│   │   │   ├── logger.middleware.ts
│   │   │   └── request-id.middleware.ts
│   │   └── pipes/
│   │       ├── lowercase.pipe.ts
│   │       ├── slugify.pipe.ts
│   │       └── trim.pipe.ts
│   ├── auth/
│   │   ├── dto/
│   │   │   └── login.dto.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── users/
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   └── update-profile.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── tasks/
│   │   ├── dto/
│   │   │   ├── create-task.dto.ts
│   │   │   └── update-task.dto.ts
│   │   ├── entities/
│   │   │   └── task.entity.ts
│   │   ├── tasks.controller.ts
│   │   ├── tasks.module.ts
│   │   └── tasks.service.ts
│   ├── app.module.ts
│   └── main.ts
├── .env.development
├── .env.production (template)
├── .gitignore
├── Procfile
├── package.json
└── tsconfig.json
```

---

## 🔧 Configuration Files

### package.json

```json
{
  "name": "task-management-api",
  "version": "1.0.0",
  "description": "Task Management API with NestJS",
  "author": "Your Name",
  "license": "MIT",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "prebuild": "rimraf dist",
    "postinstall": "npm run build"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/core": "^10.0.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/typeorm": "^10.0.1",
    "bcrypt": "^5.1.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "pg": "^8.11.3",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1",
    "slugify": "^1.6.6",
    "typeorm": "^0.3.17",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@types/bcrypt": "^5.0.2",
    "@types/express": "^4.17.17",
    "@types/node": "^20.3.1",
    "@types/passport-jwt": "^4.0.0",
    "@types/uuid": "^9.0.7",
    "rimraf": "^5.0.5",
    "ts-node": "^10.9.1",
    "typescript": "^5.1.3"
  }
}
```

### .env.development

```bash
# Application
PORT=3000
NODE_ENV=development

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=task_management_db

# JWT
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Logging
LOG_LEVEL=debug
```

### .env.production (template)

```bash
# Application
PORT=${PORT}
NODE_ENV=production

# Database (from Render PostgreSQL)
DATABASE_HOST=${DATABASE_HOST}
DATABASE_PORT=${DATABASE_PORT}
DATABASE_USERNAME=${DATABASE_USERNAME}
DATABASE_PASSWORD=${DATABASE_PASSWORD}
DATABASE_NAME=${DATABASE_NAME}

# JWT (generate strong random secret!)
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=24h

# CORS (your frontend URL)
CORS_ORIGIN=https://yourfrontend.com

# Logging
LOG_LEVEL=info
```

### .gitignore

```bash
# Dependencies
node_modules

# Build
dist

# Environment
.env
.env.*

# Logs
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.idea
.vscode
*.swp
*.swo
```

### Procfile

```
web: npm run start:prod
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
```

---

## 🎯 Main Application Files

### src/main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get config service
  const configService = app.get(ConfigService);
  
  // Enable CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN')?.split(',') || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  });
  
  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Apply global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
  
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
```

### src/app.module.ts

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('NODE_ENV') === 'production' 
          ? { rejectUnauthorized: false } 
          : false,
      }),
    }),
    UsersModule,
    AuthModule,
    TasksModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, LoggerMiddleware)
      .forRoutes('*');
  }
}
```

---

## 👤 Users Module

### src/users/entities/user.entity.ts

```typescript
import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn,
  OneToMany 
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

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

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;
}
```

### src/users/dto/register.dto.ts

```typescript
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email harus valid' })
  email: string;

  @IsString({ message: 'Password harus berupa string' })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;

  @IsString({ message: 'Name harus berupa string' })
  @MinLength(2, { message: 'Name minimal 2 karakter' })
  @MaxLength(50, { message: 'Name maksimal 50 karakter' })
  name: string;
}
```

### src/users/dto/update-profile.dto.ts

```typescript
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Name harus berupa string' })
  @MinLength(2, { message: 'Name minimal 2 karakter' })
  @MaxLength(50, { message: 'Name maksimal 50 karakter' })
  name?: string;
}
```

### src/users/users.service.ts

```typescript
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = this.usersRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
    });

    // Save to database
    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async updateProfile(
    userId: number, 
    updateProfileDto: UpdateProfileDto
  ): Promise<User> {
    await this.usersRepository.update(userId, updateProfileDto);
    return await this.usersRepository.findOne({ where: { id: userId } });
  }
}
```

### src/users/users.controller.ts

```typescript
import { 
  Controller, 
  Post, 
  Get, 
  Patch,
  Body, 
  UseGuards 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { TrimPipe } from '../common/pipes/trim.pipe';
import { LowercasePipe } from '../common/pipes/lowercase.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(
    @Body(new TrimPipe(), new LowercasePipe('email')) registerDto: RegisterDto
  ) {
    const user = await this.usersService.register(registerDto);
    const { password, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user) {
    const fullUser = await this.usersService.findByEmail(user.email);
    const { password, ...result } = fullUser;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user,
    @Body(TrimPipe) updateProfileDto: UpdateProfileDto
  ) {
    const updatedUser = await this.usersService.updateProfile(
      user.userId,
      updateProfileDto
    );
    const { password, ...result } = updatedUser;
    return result;
  }
}
```

### src/users/users.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

---

## 🔐 Auth Module

### src/auth/dto/login.dto.ts

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email harus valid' })
  email: string;

  @IsString({ message: 'Password harus berupa string' })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;
}
```

### src/auth/strategies/jwt.strategy.ts

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findByEmail(payload.email);
    
    if (!user) {
      throw new UnauthorizedException();
    }
    
    return { userId: user.id, email: user.email };
  }
}
```

### src/auth/guards/jwt-auth.guard.ts

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### src/auth/auth.service.ts

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
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
}
```

### src/auth/auth.controller.ts

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TrimPipe } from '../common/pipes/trim.pipe';
import { LowercasePipe } from '../common/pipes/lowercase.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body(new TrimPipe(), new LowercasePipe('email')) loginDto: LoginDto
  ) {
    return await this.authService.login(loginDto);
  }
}
```

### src/auth/auth.module.ts

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

---

## ✅ Tasks Module

### src/tasks/entities/task.entity.ts

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  @Index()
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column()
  @Index()
  userId: number;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### src/tasks/dto/create-task.dto.ts

```typescript
import { 
  IsString, 
  IsEnum, 
  IsOptional, 
  MinLength, 
  MaxLength 
} from 'class-validator';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString({ message: 'Title harus berupa string' })
  @MinLength(3, { message: 'Title minimal 3 karakter' })
  @MaxLength(100, { message: 'Title maksimal 100 karakter' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description harus berupa string' })
  @MaxLength(500, { message: 'Description maksimal 500 karakter' })
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { 
    message: 'Status harus TODO, IN_PROGRESS, atau DONE' 
  })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority, { 
    message: 'Priority harus LOW, MEDIUM, HIGH, atau URGENT' 
  })
  priority?: TaskPriority;
}
```

### src/tasks/dto/update-task.dto.ts

```typescript
import { 
  IsString, 
  IsEnum, 
  IsOptional, 
  MinLength, 
  MaxLength 
} from 'class-validator';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class UpdateTaskDto {
  @IsOptional()
  @IsString({ message: 'Title harus berupa string' })
  @MinLength(3, { message: 'Title minimal 3 karakter' })
  @MaxLength(100, { message: 'Title maksimal 100 karakter' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description harus berupa string' })
  @MaxLength(500, { message: 'Description maksimal 500 karakter' })
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { 
    message: 'Status harus TODO, IN_PROGRESS, atau DONE' 
  })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority, { 
    message: 'Priority harus LOW, MEDIUM, HIGH, atau URGENT' 
  })
  priority?: TaskPriority;
}
```

### src/tasks/tasks.service.ts

```typescript
import { 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(userId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      userId,
      status: createTaskDto.status || TaskStatus.TODO,
      priority: createTaskDto.priority || TaskPriority.MEDIUM,
    });

    return await this.tasksRepository.save(task);
  }

  async findAll(userId: number): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(
    id: number, 
    userId: number, 
    updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    const task = await this.findOne(id, userId);
    Object.assign(task, updateTaskDto);
    return await this.tasksRepository.save(task);
  }

  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.tasksRepository.remove(task);
  }

  async findByStatus(userId: number, status: TaskStatus): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { userId, status },
      order: { createdAt: 'DESC' },
    });
  }

  async findByPriority(
    userId: number, 
    priority: TaskPriority
  ): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { userId, priority },
      order: { createdAt: 'DESC' },
    });
  }
}
```

### src/tasks/tasks.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TrimPipe } from '../common/pipes/trim.pipe';
import { TaskStatus, TaskPriority } from './entities/task.entity';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  async create(
    @CurrentUser() user,
    @Body(TrimPipe) createTaskDto: CreateTaskDto,
  ) {
    return await this.tasksService.create(user.userId, createTaskDto);
  }

  @Get()
  async findAll(
    @CurrentUser() user,
    @Query('status') status?: TaskStatus,
    @Query('priority') priority?: TaskPriority,
  ) {
    if (status) {
      return await this.tasksService.findByStatus(user.userId, status);
    }

    if (priority) {
      return await this.tasksService.findByPriority(user.userId, priority);
    }

    return await this.tasksService.findAll(user.userId);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.tasksService.findOne(id, user.userId);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
    @Body(TrimPipe) updateTaskDto: UpdateTaskDto,
  ) {
    return await this.tasksService.update(id, user.userId, updateTaskDto);
  }

  @Delete(':id')
  async remove(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.tasksService.remove(id, user.userId);
    return { message: 'Task deleted successfully' };
  }
}
```

### src/tasks/tasks.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

---

## 🛠️ Common Utilities

### src/common/pipes/trim.pipe.ts

```typescript
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return value.trim();
    }
    
    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach(key => {
        if (typeof value[key] === 'string') {
          value[key] = value[key].trim();
        }
      });
    }
    
    return value;
  }
}
```

### src/common/pipes/lowercase.pipe.ts

```typescript
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class LowercasePipe implements PipeTransform {
  private field: string;

  constructor(field: string) {
    this.field = field;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'object' && value !== null && this.field) {
      if (value[this.field] && typeof value[this.field] === 'string') {
        value[this.field] = value[this.field].toLowerCase();
      }
    }
    
    return value;
  }
}
```

### src/common/pipes/slugify.pipe.ts

```typescript
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export class SlugifyPipe implements PipeTransform {
  private field: string;

  constructor(field: string) {
    this.field = field;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'object' && value !== null && this.field) {
      const originalValue = value[this.field];
      
      if (originalValue && typeof originalValue === 'string') {
        const slug = slugify(originalValue, {
          lower: true,
          strict: true,
          trim: true
        });
        
        value[`${this.field}Slug`] = slug;
      }
    }
    
    return value;
  }
}
```

### src/common/decorators/current-user.decorator.ts

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

### src/common/middleware/logger.middleware.ts

```typescript
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const requestId = req['requestId'] || 'N/A';
    const startTime = Date.now();

    this.logger.log(
      `[${requestId}] Request: ${method} ${originalUrl} - IP: ${ip}`
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;
      
      this.logger.log(
        `[${requestId}] Response: ${method} ${originalUrl} - Status: ${statusCode} - ${responseTime}ms`
      );
    });

    next();
  }
}
```

### src/common/middleware/request-id.middleware.ts

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = uuidv4();
    req['requestId'] = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
  }
}
```

### src/common/filters/http-exception.filter.ts

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = request['requestId'] || 'N/A';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        errors = (exceptionResponse as any).errors;
      } else {
        message = exceptionResponse;
      }
    }

    this.logger.error(
      `[${requestId}] ${request.method} ${request.url} - Status: ${status} - Error: ${message}`,
      exception instanceof Error ? exception.stack : ''
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      requestId,
      message,
      ...(errors && { errors }),
    });
  }
}
```

---

## 🚀 Quick Start Commands

### Initial Setup

```bash
# Install NestJS CLI
npm install -g @nestjs/cli

# Create project
nest new task-management-api

# Navigate to project
cd task-management-api

# Install dependencies
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/config
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install class-validator class-transformer
npm install bcrypt slugify uuid
npm install -D @types/bcrypt @types/passport-jwt @types/uuid
```

### Generate Modules

```bash
# Users module
nest generate module users
nest generate controller users
nest generate service users

# Auth module
nest generate module auth
nest generate controller auth
nest generate service auth

# Tasks module
nest generate module tasks
nest generate controller tasks
nest generate service tasks
```

### Development

```bash
# Run in development mode
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod
```

### Database

```bash
# Create PostgreSQL database (if using local)
psql -U postgres
CREATE DATABASE task_management_db;
\q
```

---

## 📝 API Endpoints Summary

### Authentication
- `POST /users/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### User Profile
- `GET /users/profile` - Get current user profile (protected)
- `PATCH /users/profile` - Update user profile (protected)

### Tasks
- `POST /tasks` - Create new task (protected)
- `GET /tasks` - Get all user tasks (protected)
- `GET /tasks?status=TODO` - Filter by status (protected)
- `GET /tasks?priority=HIGH` - Filter by priority (protected)
- `GET /tasks/:id` - Get single task (protected)
- `PATCH /tasks/:id` - Update task (protected)
- `DELETE /tasks/:id` - Delete task (protected)

---

## 🎯 Testing with Postman

### 1. Register User
```http
POST http://localhost:3000/users/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### 2. Login
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Save the `access_token` from response!**

### 3. Create Task
```http
POST http://localhost:3000/tasks
Authorization: Bearer <your_access_token>
Content-Type: application/json

{
  "title": "Complete NestJS tutorial",
  "description": "Learn all advanced concepts",
  "priority": "HIGH"
}
```

### 4. Get All Tasks
```http
GET http://localhost:3000/tasks
Authorization: Bearer <your_access_token>
```

### 5. Update Task
```http
PATCH http://localhost:3000/tasks/1
Authorization: Bearer <your_access_token>
Content-Type: application/json

{
  "status": "DONE"
}
```

---

## 🎓 Key Learnings

**This complete code demonstrates:**

✅ **DTOs & Validation** - Type-safe input validation with decorators  
✅ **Custom Pipes** - Data transformation (trim, lowercase, slugify)  
✅ **JWT Authentication** - Secure token-based auth with Passport  
✅ **Guards** - Route protection with JwtAuthGuard  
✅ **Middleware** - Logging and request tracking  
✅ **TypeORM Relations** - One-to-Many between Users and Tasks  
✅ **Enums** - Type-safe status and priority values  
✅ **Global Error Handling** - Consistent error responses  
✅ **Environment Configuration** - Separate configs for dev/prod  
✅ **Production Ready** - Deployed to Render with PostgreSQL  

---

**Use this as reference when following the DEMO_SESSION_GUIDE.md!** 🚀
