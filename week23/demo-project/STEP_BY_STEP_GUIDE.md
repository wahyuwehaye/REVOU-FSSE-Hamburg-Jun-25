# 🛠️ Step-by-Step Implementation Guide

Complete walkthrough for building the School Management API from scratch.

---

## 📚 Table of Contents

1. [Project Setup](#step-1-project-setup)
2. [Database Configuration](#step-2-database-configuration)
3. [Create Student Module](#step-3-create-student-module)
4. [Create Course Module](#step-4-create-course-module)
5. [Create Enrollment Module](#step-5-create-enrollment-module)
6. [Implement Authentication](#step-6-implement-authentication)
7. [Testing](#step-7-testing)
8. [Deployment](#step-8-deployment)

---

## Step 1: Project Setup

### 1.1 Install NestJS CLI

```bash
npm install -g @nestjs/cli
```

### 1.2 Create New Project

```bash
nest new school-api
cd school-api
```

**Choose:** `npm` as package manager

### 1.3 Install Dependencies

```bash
# Database & ORM
npm install @nestjs/typeorm typeorm pg

# Configuration
npm install @nestjs/config

# Validation
npm install class-validator class-transformer

# Authentication
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install bcrypt

# Dev dependencies
npm install -D @types/passport-jwt @types/bcrypt
```

### 1.4 Project Structure

Your project should look like this:

```
school-api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   └── ...
├── test/
├── package.json
├── tsconfig.json
└── README.md
```

---

## Step 2: Database Configuration

### 2.1 Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE school_db;

# Exit psql
\q
```

### 2.2 Environment Configuration

Create `.env` file in project root:

```env
# .env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=school_db

JWT_SECRET=your-secret-key-change-this
JWT_EXPIRES_IN=1d
```

### 2.3 Update `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Only for development!
      logging: true,
    }),
  ],
})
export class AppModule {}
```

### 2.4 Update `main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  // API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}/api`);
}

bootstrap();
```

---

## Step 3: Create Student Module

### 3.1 Generate Module

```bash
nest g module students
nest g service students
nest g controller students
```

### 3.2 Create Entity

Create `src/students/entities/student.entity.ts`:

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  age: number;

  @Column({ default: 'student' })
  role: string;

  @CreateDateColumn()
  enrolledAt: Date;
}
```

**Key Concepts:**
- `@Entity()` - Marks class as database table
- `@PrimaryGeneratedColumn()` - Auto-increment ID
- `@Column()` - Table column
- `@Exclude()` - Don't expose in API responses
- `@CreateDateColumn()` - Auto-set timestamp

### 3.3 Create DTOs

**Create Student DTO** (`src/students/dto/create-student.dto.ts`):

```typescript
import { IsEmail, IsInt, IsString, Min, MinLength, Max } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsInt()
  @Min(16)
  @Max(100)
  age: number;
}
```

**Update Student DTO** (`src/students/dto/update-student.dto.ts`):

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
```

### 3.4 Implement Service

`src/students/students.service.ts`:

```typescript
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Check email exists
    const existing = await this.studentsRepository.findOne({
      where: { email: createStudentDto.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

    // Create student
    const student = this.studentsRepository.create({
      ...createStudentDto,
      password: hashedPassword,
    });

    return await this.studentsRepository.save(student);
  }

  async findAll(): Promise<Student[]> {
    return await this.studentsRepository.find();
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.studentsRepository.findOneBy({ id });
    
    if (!student) {
      throw new NotFoundException(`Student #${id} not found`);
    }
    
    return student;
  }

  async findByEmail(email: string): Promise<Student> {
    return await this.studentsRepository.findOne({ where: { email } });
  }
}
```

**Key Concepts:**
- `@InjectRepository()` - Inject TypeORM repository
- `Repository<Student>` - Provides CRUD methods
- `bcrypt.hash()` - Password hashing
- Error handling with exceptions

### 3.5 Implement Controller

`src/students/students.controller.ts`:

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Controller('students')
@UseInterceptors(ClassSerializerInterceptor) // Auto-apply @Exclude()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }
}
```

### 3.6 Update Module

`src/students/students.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService], // Export for use in other modules
})
export class StudentsModule {}
```

### 3.7 Test Student Module

```bash
# Start server
npm run start:dev

# Test in another terminal
# Create student
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "age": 20
  }'

# Get all students
curl http://localhost:3000/api/students

# Get one student
curl http://localhost:3000/api/students/1
```

---

## Step 4: Create Course Module

### 4.1 Generate Module

```bash
nest g module courses
nest g service courses
nest g controller courses
```

### 4.2 Create Entity

`src/courses/entities/course.entity.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  credits: number;

  @Column()
  instructor: string;
}
```

### 4.3 Create DTO

`src/courses/dto/create-course.dto.ts`:

```typescript
import { IsString, IsInt, Min, Max, MinLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsInt()
  @Min(1)
  @Max(6)
  credits: number;

  @IsString()
  instructor: string;
}
```

### 4.4 Implement Service & Controller

Similar to Students module - implement CRUD operations.

---

## Step 5: Create Enrollment Module

### 5.1 Create Entity with Relationships

`src/enrollments/entities/enrollment.entity.ts`:

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'student_id' })
  studentId: number;

  @ManyToOne(() => Course, (course) => course.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column({ nullable: true })
  grade: string;

  @CreateDateColumn()
  enrolledAt: Date;
}
```

**Key Concepts:**
- `@ManyToOne()` - Many enrollments belong to one student/course
- `@JoinColumn()` - Specifies foreign key column
- `onDelete: 'CASCADE'` - Delete enrollments when student/course deleted

### 5.2 Update Student & Course Entities

Add relationship in `student.entity.ts`:

```typescript
import { OneToMany } from 'typeorm';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';

// Add to Student class:
@OneToMany(() => Enrollment, (enrollment) => enrollment.student)
enrollments: Enrollment[];
```

Same for `course.entity.ts`.

### 5.3 Implement Service with Transaction

```typescript
async create(studentId: number, courseId: number): Promise<Enrollment> {
  return await this.dataSource.transaction(async (manager) => {
    // Check if already enrolled
    const existing = await manager.findOne(Enrollment, {
      where: { studentId, courseId },
    });

    if (existing) {
      throw new BadRequestException('Already enrolled');
    }

    // Create enrollment
    const enrollment = manager.create(Enrollment, {
      studentId,
      courseId,
    });

    return await manager.save(enrollment);
  });
}
```

---

## Step 6: Implement Authentication

### 6.1 Create Auth Module

```bash
nest g module auth
nest g service auth
nest g controller auth
```

### 6.2 Install JWT Dependencies

Already installed in Step 1!

### 6.3 Create JWT Strategy

`src/auth/strategies/jwt.strategy.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
```

### 6.4 Create Auth Guard

`src/auth/guards/jwt-auth.guard.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### 6.5 Implement Auth Service

```typescript
async login(email: string, password: string) {
  const student = await this.studentsService.findByEmail(email);
  
  const isValid = await bcrypt.compare(password, student.password);
  
  if (!isValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const payload = { email: student.email, sub: student.id };
  const token = this.jwtService.sign(payload);

  return { access_token: token };
}
```

### 6.6 Protect Routes

```typescript
@Controller('students')
export class StudentsController {
  
  @UseGuards(JwtAuthGuard) // Protected route
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
```

---

## Step 7: Testing

### 7.1 Test Authentication Flow

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "email": "alice@test.com",
    "password": "pass123",
    "age": 20
  }'

# Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@test.com",
    "password": "pass123"
  }' | jq -r '.access_token')

# Use token
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### 7.2 Test Complete Flow

```bash
# 1. Create course
curl -X POST http://localhost:3000/api/courses \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Database","description":"Learn DB","credits":4,"instructor":"Dr. Smith"}'

# 2. Enroll in course
curl -X POST http://localhost:3000/api/enrollments \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"courseId":1}'

# 3. Get my courses
curl http://localhost:3000/api/enrollments/my-courses \
  -H "Authorization: Bearer $TOKEN"
```

---

## Step 8: Deployment

### 8.1 Prepare for Production

Update `app.module.ts`:

```typescript
synchronize: process.env.NODE_ENV !== 'production', // Disable in prod
```

### 8.2 Build Project

```bash
npm run build
```

### 8.3 Start Production

```bash
NODE_ENV=production npm run start:prod
```

---

## 🎓 Key Takeaways

1. **Entities** define database structure
2. **DTOs** validate input data
3. **Services** contain business logic
4. **Controllers** handle HTTP requests
5. **Modules** organize code
6. **Guards** protect routes
7. **Transactions** ensure data consistency

---

## 📚 Next Steps

- Add unit tests
- Implement soft delete
- Add database migrations
- Create API documentation (Swagger)
- Implement rate limiting
- Add logging

**Congratulations! 🎉 You've built a complete NestJS + PostgreSQL API!**
