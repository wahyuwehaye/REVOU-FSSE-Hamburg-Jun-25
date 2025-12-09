# 🏫 School Management API - Demo Project

Complete NestJS + PostgreSQL project demonstrating all Week 23 concepts.

## 📋 Project Overview

This demo project implements a school management system with:
- 👥 Student management
- 📚 Course management  
- 📝 Enrollment system
- 🔐 Authentication (JWT)
- 📊 Reporting & analytics

## 🎯 What You'll Learn

✅ PostgreSQL setup and configuration  
✅ TypeORM entities with relationships  
✅ One-to-Many and Many-to-Many relationships  
✅ CRUD operations with validation  
✅ Complex queries with QueryBuilder  
✅ Database migrations  
✅ JWT authentication  
✅ Error handling  
✅ API documentation  

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone or download this project
cd school-api

# Install dependencies
npm install

# Setup database
createdb school_db

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migration:run

# Seed database (optional)
npm run seed

# Start development server
npm run start:dev
```

API will be available at: `http://localhost:3000`

---

## 📁 Project Structure

```
school-api/
├── src/
│   ├── app.module.ts           # Main application module
│   ├── main.ts                 # Application entry point
│   ├── auth/                   # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── students/               # Students module
│   │   ├── students.module.ts
│   │   ├── students.service.ts
│   │   ├── students.controller.ts
│   │   ├── entities/
│   │   │   └── student.entity.ts
│   │   └── dto/
│   │       ├── create-student.dto.ts
│   │       └── update-student.dto.ts
│   ├── courses/                # Courses module
│   │   ├── courses.module.ts
│   │   ├── courses.service.ts
│   │   ├── courses.controller.ts
│   │   ├── entities/
│   │   │   └── course.entity.ts
│   │   └── dto/
│   │       └── create-course.dto.ts
│   ├── enrollments/            # Enrollments module
│   │   ├── enrollments.module.ts
│   │   ├── enrollments.service.ts
│   │   ├── enrollments.controller.ts
│   │   ├── entities/
│   │   │   └── enrollment.entity.ts
│   │   └── dto/
│   │       ├── create-enrollment.dto.ts
│   │       └── update-grade.dto.ts
│   ├── database/
│   │   ├── migrations/         # Database migrations
│   │   └── seeds/              # Seed data
│   │       └── seed.ts
│   └── config/
│       └── database.config.ts  # Database configuration
├── test/                       # Test files
├── .env.example                # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐
│  Students   │
├─────────────┤
│ id          │
│ name        │
│ email       │◄───┐
│ password    │    │
│ age         │    │
│ enrolledAt  │    │
└─────────────┘    │
                   │ studentId
                   │
                   │
              ┌────┴────────┐
              │ Enrollments │
              ├─────────────┤
              │ id          │
              │ studentId   │───┐
              │ courseId    │   │
              │ grade       │   │
              │ enrolledAt  │   │
              └─────────────┘   │
                                │
                   courseId     │
                   │            │
                   │            │
                   ▼            │
              ┌─────────────┐  │
              │   Courses   │  │
              ├─────────────┤  │
              │ id          │◄─┘
              │ title       │
              │ description │
              │ credits     │
              │ instructor  │
              └─────────────┘
```

### Relationships
- **Students ↔ Enrollments:** One-to-Many (One student can enroll in many courses)
- **Courses ↔ Enrollments:** One-to-Many (One course can have many students)
- **Students ↔ Courses:** Many-to-Many (through Enrollments junction table)

---

## 🔌 API Endpoints

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 20
}

Response: 201 Created
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 20
}
```

---

### Students

#### Create Student (Admin only)
```http
POST /students
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "age": 22
}
```

#### Get All Students
```http
GET /students?page=1&limit=10&search=john

Response: 200 OK
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "age": 20,
      "enrolledAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

#### Get Student by ID
```http
GET /students/1

Response: 200 OK
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 20,
  "enrollments": [
    {
      "id": 1,
      "course": {
        "id": 1,
        "title": "Database Systems",
        "credits": 4
      },
      "grade": "A"
    }
  ]
}
```

#### Update Student
```http
PATCH /students/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "age": 21
}
```

#### Delete Student
```http
DELETE /students/1
Authorization: Bearer <admin_token>

Response: 204 No Content
```

---

### Courses

#### Create Course
```http
POST /courses
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Database Systems",
  "description": "Introduction to relational databases",
  "credits": 4,
  "instructor": "Dr. Smith"
}
```

#### Get All Courses
```http
GET /courses

Response: 200 OK
[
  {
    "id": 1,
    "title": "Database Systems",
    "description": "Introduction to relational databases",
    "credits": 4,
    "instructor": "Dr. Smith",
    "enrollmentCount": 25
  }
]
```

#### Get Course with Students
```http
GET /courses/1/students

Response: 200 OK
{
  "id": 1,
  "title": "Database Systems",
  "students": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "grade": "A"
    }
  ]
}
```

---

### Enrollments

#### Enroll in Course
```http
POST /enrollments
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": 1
}

Response: 201 Created
{
  "id": 1,
  "studentId": 1,
  "courseId": 1,
  "enrolledAt": "2024-01-15T10:00:00Z"
}
```

#### Update Grade (Instructor only)
```http
PATCH /enrollments/1/grade
Authorization: Bearer <instructor_token>
Content-Type: application/json

{
  "grade": "A"
}
```

#### Get My Enrollments
```http
GET /enrollments/my-courses
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "course": {
      "id": 1,
      "title": "Database Systems",
      "credits": 4
    },
    "grade": "A",
    "enrolledAt": "2024-01-15T10:00:00Z"
  }
]
```

#### Drop Course
```http
DELETE /enrollments/1
Authorization: Bearer <token>

Response: 204 No Content
```

---

### Reports & Statistics

#### Student Statistics
```http
GET /students/1/statistics

Response: 200 OK
{
  "totalCourses": 5,
  "completedCourses": 3,
  "inProgressCourses": 2,
  "totalCredits": 18,
  "gpa": 3.5,
  "gradeDistribution": {
    "A": 2,
    "B": 1,
    "C": 0
  }
}
```

#### Course Statistics
```http
GET /courses/1/statistics

Response: 200 OK
{
  "totalStudents": 25,
  "averageGrade": 3.4,
  "gradeDistribution": {
    "A": 10,
    "B": 12,
    "C": 3
  },
  "passRate": 96.0
}
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "age": 20
  }'

# Login
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' | jq -r '.access_token')

# Get profile
curl http://localhost:3000/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# Get courses
curl http://localhost:3000/courses

# Enroll in course
curl -X POST http://localhost:3000/enrollments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId": 1}'
```

### Using Postman

1. Import the provided `postman_collection.json`
2. Set environment variable `{{baseUrl}}` to `http://localhost:3000`
3. Login to get token
4. Token will be automatically set for subsequent requests

---

## 📚 Key Concepts Demonstrated

### 1. TypeORM Entities

**Student Entity** (`src/students/entities/student.entity.ts`):
```typescript
@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() // Don't expose password in responses
  password: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];
}
```

### 2. Relationships

**One-to-Many:**
```typescript
// Student has many Enrollments
@OneToMany(() => Enrollment, (enrollment) => enrollment.student)
enrollments: Enrollment[];

// Enrollment belongs to one Student
@ManyToOne(() => Student, (student) => student.enrollments)
student: Student;
```

### 3. DTOs with Validation

```typescript
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

### 4. Complex Queries

```typescript
// Get students with enrollment count
async findAllWithStats() {
  return await this.studentsRepository
    .createQueryBuilder('student')
    .leftJoin('student.enrollments', 'enrollment')
    .select('student.*')
    .addSelect('COUNT(enrollment.id)', 'enrollmentCount')
    .groupBy('student.id')
    .getRawMany();
}
```

### 5. Transactions

```typescript
async enrollInCourse(studentId: number, courseId: number) {
  return await this.dataSource.transaction(async (manager) => {
    // Check if already enrolled
    const existing = await manager.findOne(Enrollment, {
      where: { studentId, courseId }
    });
    
    if (existing) {
      throw new BadRequestException('Already enrolled');
    }

    // Create enrollment
    const enrollment = manager.create(Enrollment, {
      studentId,
      courseId
    });

    return await manager.save(enrollment);
  });
}
```

---

## 🔧 Configuration

### Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=school_db

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=1d

# Pagination
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=100
```

---

## 🎓 Learning Exercises

### Exercise 1: Add Department Entity
Create a Department entity with One-to-Many relationship to Courses.

### Exercise 2: Implement Search
Add full-text search for courses by title and description.

### Exercise 3: Add Validation
Prevent students from enrolling in more than 5 courses.

### Exercise 4: GPA Calculation
Implement automatic GPA calculation for students.

### Exercise 5: Soft Delete
Implement soft delete for students (keep records but mark as deleted).

---

## 🐛 Common Issues & Solutions

### Issue: "relation does not exist"
**Solution:** Run migrations: `npm run migration:run`

### Issue: "Cannot connect to database"
**Solution:** Check PostgreSQL is running: `brew services list`

### Issue: "JWT must be provided"
**Solution:** Include Authorization header: `Bearer <token>`

### Issue: "Port 3000 already in use"
**Solution:** Change PORT in .env or kill process: `lsof -ti:3000 | xargs kill`

---

## 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [JWT Best Practices](https://jwt.io/introduction)

---

## 🤝 Contributing

Feel free to submit issues or pull requests to improve this demo project!

---

**Happy Learning! 🎓**
