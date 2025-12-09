# 🎓 Week 23 Demo Teaching Guide

**Complete guide for teaching PostgreSQL + NestJS integration**

## 📋 Table of Contents

1. [Session Overview](#session-overview)
2. [Teaching Flow](#teaching-flow)
3. [Demo Project](#demo-project)
4. [Live Coding Sessions](#live-coding-sessions)
5. [Q&A Preparation](#qa-preparation)
6. [Assessment Guidelines](#assessment-guidelines)

---

## 🎯 Session Overview

### Learning Objectives
By the end of this week, students will be able to:
- ✅ Install and configure PostgreSQL
- ✅ Design database schemas with relationships
- ✅ Write complex SQL queries
- ✅ Integrate TypeORM with NestJS
- ✅ Build complete CRUD APIs
- ✅ Handle migrations and seeding
- ✅ Implement authentication with JWT

### Time Allocation (Total: 8 hours)
- **Day 1 (4h):** PostgreSQL Setup + SQL Fundamentals (Materials 01-10)
- **Day 2 (4h):** TypeORM + NestJS Integration (Materials 11-22)

---

## 📚 Teaching Flow

### Day 1: PostgreSQL Fundamentals

#### Session 1 (2h): Setup & Basic SQL

**Materials Covered:** 01-06

##### 1. Introduction (15 min)
```
Topics to cover:
- Why PostgreSQL? (Material 01)
- Use cases: Web apps, analytics, geospatial
- Advantages: ACID, JSON support, extensibility
- Show real-world examples (Instagram, Spotify use PostgreSQL)
```

**🎬 Live Demo:**
```bash
# Show PostgreSQL version and features
psql --version
psql -U postgres

# Inside psql
\l          # List databases
\dt         # List tables
\d users    # Describe table
```

##### 2. Installation (30 min)
```
Materials: 02-03

For macOS:
1. Install via Homebrew
2. Start PostgreSQL service
3. Create first database

For Windows:
1. Download installer
2. pgAdmin setup
3. Connection testing

Common issues to address:
- Port 5432 already in use
- Authentication failed
- PATH not set
```

**🎬 Live Demo:**
```bash
# Installation
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb demo_db

# Connect
psql demo_db

# Show students how to exit
\q
```

**💡 Teaching Tip:**
> Have students install PostgreSQL BEFORE class. Use first 15 minutes to troubleshoot installation issues. Prepare a backup cloud PostgreSQL instance (ElephantSQL free tier) for students who can't install locally.

##### 3. SQL Basics (45 min)
```
Materials: 04-06

Concepts to demonstrate:
- CREATE TABLE with data types
- INSERT sample data
- SELECT with WHERE
- ORDER BY and LIMIT
```

**🎬 Live Demo:**
```sql
-- Create students table (type together with class)
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INTEGER,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data (ask students for sample data)
INSERT INTO students (name, email, age) VALUES
('Alice Johnson', 'alice@email.com', 20),
('Bob Smith', 'bob@email.com', 22),
('Carol White', 'carol@email.com', 19);

-- Query examples
SELECT * FROM students;
SELECT name, email FROM students WHERE age > 20;
SELECT * FROM students ORDER BY age DESC;
SELECT * FROM students LIMIT 2;
```

**💡 Teaching Tip:**
> Make it interactive! Ask students to suggest column names and data. This helps them think about schema design early.

##### 4. Break (10 min)

##### 5. Practice Exercise (20 min)
```
Give students a challenge:

"Create a 'courses' table with:
- id (auto-increment)
- title (required)
- credits (integer)
- instructor (text)

Insert 3 courses and write queries to:
1. Find courses with more than 3 credits
2. List all courses sorted by title
3. Count total courses"
```

**Solution Review:**
```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  credits INTEGER,
  instructor VARCHAR(100)
);

INSERT INTO courses (title, credits, instructor) VALUES
('Database Systems', 4, 'Dr. Smith'),
('Web Development', 3, 'Prof. Johnson'),
('Data Structures', 4, 'Dr. Lee');

-- Queries
SELECT * FROM courses WHERE credits > 3;
SELECT * FROM courses ORDER BY title;
SELECT COUNT(*) FROM courses;
```

---

#### Session 2 (2h): Relationships & Advanced SQL

**Materials Covered:** 07-10

##### 1. Table Relationships (30 min)
```
Materials: 07-08

Concepts:
- One-to-Many (students → enrollments)
- Many-to-Many (students ↔ courses via junction)
- Foreign Keys and constraints
```

**🎬 Live Demo:**
```sql
-- One-to-Many: students → enrollments
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  grade VARCHAR(2)
);

-- Insert enrollments
INSERT INTO enrollments (student_id, course_id, grade) VALUES
(1, 1, 'A'),
(1, 2, 'B'),
(2, 1, 'A'),
(3, 3, 'B+');

-- Show relationship
SELECT 
  students.name,
  courses.title,
  enrollments.grade
FROM enrollments
JOIN students ON enrollments.student_id = students.id
JOIN courses ON enrollments.course_id = courses.id;
```

**🎨 Visual Aid:**
```
Draw on whiteboard:

Students Table          Enrollments Table       Courses Table
+----+-------+         +----+------------+      +----+----------+
| id | name  |         | id | student_id |      | id | title    |
+----+-------+         |    | course_id  |      +----+----------+
| 1  | Alice | ------> |    | grade      | ---> | 1  | Database |
| 2  | Bob   |         +----+------------+      | 2  | Web Dev  |
+----+-------+                                   +----+----------+

Explain: "student_id in enrollments points to id in students"
```

##### 2. JOINs (40 min)
```
Materials: 09

Types to demonstrate:
- INNER JOIN (matching records)
- LEFT JOIN (include all from left table)
- RIGHT JOIN (rare, but show for completeness)
```

**🎬 Live Demo:**
```sql
-- INNER JOIN: Only students with enrollments
SELECT 
  students.name,
  courses.title,
  enrollments.grade
FROM students
INNER JOIN enrollments ON students.id = enrollments.student_id
INNER JOIN courses ON courses.id = enrollments.course_id;

-- LEFT JOIN: All students, even without enrollments
SELECT 
  students.name,
  COUNT(enrollments.id) as enrollment_count
FROM students
LEFT JOIN enrollments ON students.id = enrollments.student_id
GROUP BY students.id, students.name;

-- Result shows: Alice (2), Bob (1), Carol (0)
```

**💡 Teaching Tip:**
> Use Venn diagrams to explain JOINs. Draw two circles overlapping:
> - INNER JOIN = intersection
> - LEFT JOIN = left circle + intersection

##### 3. Aggregate Functions (30 min)
```
Materials: 10

Functions: COUNT, SUM, AVG, MIN, MAX
GROUP BY and HAVING
```

**🎬 Live Demo:**
```sql
-- Count enrollments per student
SELECT 
  students.name,
  COUNT(enrollments.id) as course_count
FROM students
LEFT JOIN enrollments ON students.id = enrollments.student_id
GROUP BY students.id, students.name;

-- Average age of students
SELECT AVG(age) as average_age FROM students;

-- Students with more than 1 enrollment
SELECT 
  students.name,
  COUNT(enrollments.id) as course_count
FROM students
JOIN enrollments ON students.id = enrollments.student_id
GROUP BY students.id, students.name
HAVING COUNT(enrollments.id) > 1;
```

##### 4. Break (10 min)

##### 5. Practice Exercise (10 min)
```
Challenge: "Write a query to find:
1. Total credits per student
2. Most popular course (most enrollments)
3. Average grade per course"
```

---

### Day 2: NestJS + TypeORM Integration

#### Session 3 (2h): TypeORM Setup

**Materials Covered:** 11-15

##### 1. TypeORM Introduction (20 min)
```
Materials: 11-12

Key concepts:
- ORM vs raw SQL
- TypeScript entities
- Repository pattern
- Automatic migrations
```

**🎬 Demo Project Setup:**
```bash
# Create new project
nest new school-api
cd school-api

# Install dependencies
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/config
npm install class-validator class-transformer

# Show package.json
cat package.json
```

##### 2. Configuration (30 min)
```
Materials: 13-14

Setup:
- Database connection
- Environment variables
- TypeORM config
```

**🎬 Live Coding:**

**File: `.env`**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=school_db
```

**File: `src/app.module.ts`**
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // ONLY for development!
    }),
  ],
})
export class AppModule {}
```

**💡 Teaching Tip:**
> Emphasize: "synchronize: true is DANGEROUS in production! It can drop tables. We'll learn migrations later."

##### 3. First Entity (40 min)
```
Materials: 15

Create Student entity matching our SQL table
```

**🎬 Live Coding:**
```bash
# Generate module
nest g module students
nest g service students
nest g controller students
```

**File: `src/students/entities/student.entity.ts`**
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  age: number;

  @CreateDateColumn()
  enrolledAt: Date;
}
```

**File: `src/students/students.module.ts`**
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
})
export class StudentsModule {}
```

**💡 Teaching Tip:**
> Compare entity with SQL CREATE TABLE:
> - @PrimaryGeneratedColumn() ↔ SERIAL PRIMARY KEY
> - @Column() ↔ column definition
> - @CreateDateColumn() ↔ TIMESTAMP DEFAULT CURRENT_TIMESTAMP

##### 4. Break (10 min)

##### 5. CRUD Operations (20 min)
```
Implement basic operations
```

**🎬 Live Coding:**

**File: `src/students/dto/create-student.dto.ts`**
```typescript
import { IsEmail, IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(16)
  age: number;
}
```

**File: `src/students/students.service.ts`**
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = this.studentsRepository.create(createStudentDto);
    return await this.studentsRepository.save(student);
  }

  async findAll(): Promise<Student[]> {
    return await this.studentsRepository.find();
  }

  async findOne(id: number): Promise<Student> {
    return await this.studentsRepository.findOneBy({ id });
  }
}
```

**Test with Postman/cURL:**
```bash
# Create student
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","age":20}'

# Get all students
curl http://localhost:3000/students
```

---

#### Session 4 (2h): Relationships & Advanced Features

**Materials Covered:** 16-22

##### 1. Entity Relationships (45 min)
```
Materials: 16-17

Implement enrollments with relationships
```

**🎬 Live Coding:**

**File: `src/courses/entities/course.entity.ts`**
```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  credits: number;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];
}
```

**File: `src/enrollments/entities/enrollment.entity.ts`**
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.enrollments)
  student: Student;

  @Column()
  studentId: number;

  @ManyToOne(() => Course, (course) => course.enrollments)
  course: Course;

  @Column()
  courseId: number;

  @Column({ nullable: true })
  grade: string;

  @CreateDateColumn()
  enrolledAt: Date;
}
```

**Update Student entity:**
```typescript
@OneToMany(() => Enrollment, (enrollment) => enrollment.student)
enrollments: Enrollment[];
```

**💡 Teaching Tip:**
> Draw the relationship on whiteboard:
> ```
> Student (1) ----< (Many) Enrollment >---- (1) Course
> 
> "One student has many enrollments"
> "One course has many enrollments"
> "Enrollment belongs to one student and one course"
> ```

##### 2. Querying with Relations (30 min)
```
Materials: 18-19

Show how to load related data
```

**🎬 Live Demo:**
```typescript
// Get students with their enrollments
async findAllWithEnrollments(): Promise<Student[]> {
  return await this.studentsRepository.find({
    relations: ['enrollments', 'enrollments.course'],
  });
}

// Using QueryBuilder for complex queries
async findStudentsWithCoursesCount() {
  return await this.studentsRepository
    .createQueryBuilder('student')
    .leftJoinAndSelect('student.enrollments', 'enrollment')
    .leftJoinAndSelect('enrollment.course', 'course')
    .select('student.name')
    .addSelect('COUNT(enrollment.id)', 'courseCount')
    .groupBy('student.id')
    .getRawMany();
}
```

##### 3. Migrations (20 min)
```
Materials: 20

Show proper way to handle schema changes
```

**🎬 Live Demo:**
```bash
# Generate migration
npm run typeorm migration:generate -- -n AddGradeToEnrollment

# Run migration
npm run typeorm migration:run

# Revert if needed
npm run typeorm migration:revert
```

##### 4. Authentication (25 min)
```
Materials: 21-22

Quick JWT implementation
```

**🎬 Live Coding:**
```typescript
// Auth module setup
@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AuthModule {}

// Login endpoint
async login(email: string, password: string) {
  const user = await this.validateUser(email, password);
  const payload = { email: user.email, sub: user.id };
  return {
    access_token: this.jwtService.sign(payload),
  };
}

// Protected route
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

---

## 🚀 Demo Project Showcase

### Project: School Management API

**Show the complete working project:**

```bash
# Clone demo repository
git clone [demo-repo-url]
cd school-management-api

# Install and run
npm install
npm run start:dev

# Show features:
1. Student registration
2. Course creation
3. Enrollment management
4. Grade assignment
5. Reports (students by course, course statistics)
```

**Live Demo Flow:**
1. Create students via API
2. Create courses
3. Enroll students in courses
4. Assign grades
5. Query enrolled students
6. Show course statistics

---

## 🎯 Q&A Preparation

### Common Questions & Answers

**Q: "When should I use synchronize: true?"**
> A: Only in development. In production, always use migrations for controlled schema changes.

**Q: "What's the difference between save() and insert()?"**
> A: save() checks if entity exists (update if exists), insert() always creates new record.

**Q: "How do I handle circular dependencies?"**
> A: Use lazy relations with () => Entity or forwardRef().

**Q: "Can I use raw SQL with TypeORM?"**
> A: Yes! Use query() for raw SQL when QueryBuilder is too complex.

**Q: "How to optimize N+1 query problem?"**
> A: Use relations or QueryBuilder with joins, avoid multiple queries in loop.

---

## 📊 Assessment Guidelines

### Project Evaluation Criteria

**Basic Level (60%):**
- ✅ PostgreSQL installed and running
- ✅ Database created with tables
- ✅ Basic CRUD endpoints working
- ✅ DTOs with validation
- ✅ One relationship implemented

**Intermediate (30%):**
- ✅ Multiple relationships (One-to-Many, Many-to-Many)
- ✅ Complex queries with JOINs
- ✅ Proper error handling
- ✅ Authentication implemented

**Advanced (10%):**
- ✅ Migrations setup
- ✅ Seeding data
- ✅ Query optimization
- ✅ Unit tests
- ✅ API documentation

### Red Flags (Common Mistakes)
- ❌ synchronize: true in production
- ❌ No validation on DTOs
- ❌ Passwords stored in plain text
- ❌ Missing error handling
- ❌ N+1 query problems
- ❌ No indexes on foreign keys

---

## 💡 Teaching Tips & Tricks

### Best Practices

1. **Start Simple:**
   - Begin with one entity
   - Add complexity gradually
   - Don't overwhelm with all features at once

2. **Visual Learning:**
   - Draw database schemas on whiteboard
   - Use ER diagrams
   - Show data flow in diagrams

3. **Hands-On First:**
   - Students code along during demo
   - Pause for questions every 15 minutes
   - Give 5-minute challenges between topics

4. **Error-Driven Learning:**
   - Intentionally make mistakes
   - Show how to debug errors
   - Teach reading error messages

5. **Real-World Context:**
   - Use relatable examples (school, e-commerce)
   - Show production scenarios
   - Discuss scalability considerations

### Time Management

- **Stick to schedule** but be flexible
- **Record sessions** for students to review
- **Prepare backup activities** if ahead of time
- **Have extra challenges** for fast learners

### Student Engagement

- Ask questions: "What data type should we use here?"
- Live debugging: "Why did this fail? Let's figure it out together"
- Pair programming: "Work with your neighbor for 10 minutes"
- Code review: "Let's look at Sarah's solution"

---

## 📚 Additional Resources

### For Students:
- PostgreSQL Tutorial: https://www.postgresqltutorial.com/
- TypeORM Docs: https://typeorm.io/
- NestJS Docs: https://docs.nestjs.com/
- SQL Practice: https://sqlbolt.com/

### For Instructors:
- Database Design Best Practices
- SQL Query Optimization Guide
- NestJS Architecture Patterns
- Assessment Rubrics

---

**Good luck with your teaching! 🎓**
