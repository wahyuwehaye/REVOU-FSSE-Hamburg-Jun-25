# 📝 Instructor Notes & Teaching Tips

Essential notes for teaching Week 23 effectively.

---

## 🎯 Session Objectives Reminder

**Students should be able to:**
1. Set up PostgreSQL locally
2. Write SQL queries (SELECT, JOIN, aggregate functions)
3. Design database schemas with relationships
4. Build NestJS API with TypeORM
5. Implement authentication with JWT

---

## ⚠️ Common Student Pitfalls

### 1. PostgreSQL Installation Issues

**Problem:** Students can't connect to database

**Solutions:**
```bash
# Check if PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Restart PostgreSQL
brew services restart postgresql@14

# Test connection
psql -U postgres -c "SELECT version();"
```

**Backup Plan:** Provide cloud database (ElephantSQL free tier) for students who can't install locally.

---

### 2. Forgetting to Hash Passwords

**Bad:**
```typescript
const user = this.repository.create({ password: dto.password });
```

**Good:**
```typescript
const hashedPassword = await bcrypt.hash(dto.password, 10);
const user = this.repository.create({ password: hashedPassword });
```

**Teaching Tip:** Show security breach example - demonstrate why plain text passwords are dangerous.

---

### 3. Using `synchronize: true` in Production

**Common Mistake:**
```typescript
TypeOrmModule.forRoot({
  synchronize: true,  // ❌ DANGEROUS in production!
})
```

**Correct:**
```typescript
TypeOrmModule.forRoot({
  synchronize: process.env.NODE_ENV === 'development',
  // Use migrations in production
})
```

**Analogy:** "synchronize: true is like giving your database amnesia - it can drop and recreate tables, losing all data!"

---

### 4. Circular Dependencies

**Problem:**
```
Error: Nest can't resolve dependencies
```

**Common Cause:**
- Module A imports Module B
- Module B imports Module A

**Solution:**
```typescript
// Use forwardRef()
imports: [forwardRef(() => ModuleName)]
```

---

### 5. Forgetting Relations in Queries

**Problem:** Relations return `undefined`

**Bad:**
```typescript
const student = await this.repository.findOne({ where: { id } });
console.log(student.enrollments); // undefined!
```

**Good:**
```typescript
const student = await this.repository.findOne({
  where: { id },
  relations: ['enrollments', 'enrollments.course'],
});
```

**Visual Aid:** Draw entity relationship diagram showing that relations must be explicitly loaded.

---

### 6. N+1 Query Problem

**Inefficient:**
```typescript
const students = await this.studentsRepo.find();

for (const student of students) {
  // Each iteration = 1 query! (1 + N queries total)
  const enrollments = await this.enrollmentsRepo.find({
    where: { studentId: student.id }
  });
}
```

**Efficient:**
```typescript
// Single query with JOIN
const students = await this.studentsRepo.find({
  relations: ['enrollments'],
});
```

**Demo:** Show query logs to prove the difference.

---

### 7. DTO Validation Not Working

**Problem:** Validation decorators ignored

**Missing:**
```typescript
// main.ts - forgot to enable validation!
app.useGlobalPipes(new ValidationPipe());
```

**Demo:** Show request without validation pipe vs with validation pipe.

---

### 8. JWT Token Not Sent

**Problem:** `401 Unauthorized` on protected routes

**Common Cause:**
```bash
# Missing Authorization header
curl http://localhost:3000/api/profile

# Correct
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer eyJhbGc..."
```

**Teaching Tip:** Use Postman to show how Authorization header works visually.

---

## 🎨 Teaching Techniques

### 1. Code-Along Sessions

**Structure:**
1. Explain concept (5 min)
2. Demo live coding (10 min)
3. Students code along (10 min)
4. Q&A and debugging (5 min)

**Don't:**
- Type too fast
- Skip explaining imports
- Use shortcuts without explaining

**Do:**
- Read code aloud as you type
- Explain WHY, not just WHAT
- Make intentional mistakes to show debugging

---

### 2. Visual Learning

**Database Schemas:**
```
Draw on whiteboard:

Students          Enrollments          Courses
┌─────┐          ┌──────────┐         ┌────────┐
│ id  │◄─────────│studentId │         │ id     │
│name │          │courseId  │────────►│ title  │
└─────┘          │ grade    │         │credits │
                 └──────────┘         └────────┘

"One student can have MANY enrollments"
"Each enrollment belongs to ONE student"
```

---

### 3. Analogies

**Entities = Blueprint**
"Entity is like a house blueprint. Repository is the construction company that builds houses using that blueprint."

**DTOs = Security Check**
"DTOs are like airport security - they check every property coming in and reject anything suspicious."

**Guards = Bouncers**
"Guards are like club bouncers - they check your ID (token) before letting you in."

**Transactions = All or Nothing**
"Transactions are like online shopping - either all items are added to cart, or none are. No half-way."

---

### 4. Interactive Challenges

**5-Minute Challenges:**
```
"Add a new column 'phone' to Student entity"
"Create an endpoint GET /courses/:id/students"
"Write a query to find students with GPA > 3.5"
```

**Pair Programming:**
- Pair students up
- One types, one navigates
- Switch every 10 minutes

---

### 5. Error-Driven Learning

**Intentional Mistakes:**

1. Forget `@Column()` decorator
   - Show error: "Column not created"
   - Fix together

2. Wrong data type in DTO
   - Send string where number expected
   - Show validation error
   - Explain fix

3. Missing JWT_SECRET
   - Show generic error
   - Teach how to read error messages
   - Find root cause

---

## 📊 Assessment Strategies

### Quick Checks (During Session)

**Ask:**
- "What does @ManyToOne mean?"
- "Why do we hash passwords?"
- "What's the difference between save() and insert()?"

**Show me:**
- "Create a query to find all courses with > 3 credits"
- "Add validation to ensure age is between 16 and 100"

---

### Project Evaluation

**Basic (Pass):**
- ✅ Database connected
- ✅ CRUD endpoints work
- ✅ One relationship implemented
- ✅ Basic validation

**Good:**
- ✅ All relationships work
- ✅ Authentication implemented
- ✅ Complex queries
- ✅ Proper error handling

**Excellent:**
- ✅ Transactions used correctly
- ✅ Query optimization
- ✅ Comprehensive validation
- ✅ Clean code structure
- ✅ API documentation

---

## 🔥 Troubleshooting Guide

### Port Already in Use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)
```

---

### Database Connection Failed

```bash
# Check PostgreSQL status
brew services list

# Check credentials
psql -U postgres -d school_db

# Reset password
ALTER USER postgres PASSWORD 'newpassword';
```

---

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

### TypeORM Sync Issues

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE school_db;"
psql -U postgres -c "CREATE DATABASE school_db;"

# Restart server (synchronize will recreate tables)
npm run start:dev
```

---

## 💡 Pro Tips

### 1. Use PostgreSQL GUI

Recommend **pgAdmin** or **DBeaver** for students who prefer visual tools.

---

### 2. Enable Query Logging

```typescript
TypeOrmModule.forRoot({
  logging: true,  // Show all SQL queries
})
```

Students can see exactly what queries are running!

---

### 3. Use Thunder Client / REST Client

Instead of cURL, use VS Code extensions for easier API testing.

---

### 4. Git Workflow

Teach students to commit after each module:
```bash
git add .
git commit -m "feat: add student module"
```

---

### 5. Code Snippets

Create VS Code snippets for common patterns:

```json
{
  "NestJS Entity": {
    "prefix": "nest-entity",
    "body": [
      "@Entity('${1:tableName}')",
      "export class ${2:EntityName} {",
      "  @PrimaryGeneratedColumn()",
      "  id: number;",
      "",
      "  @Column()",
      "  ${3:fieldName}: ${4:string};",
      "}"
    ]
  }
}
```

---

## 📅 Session Timeline (8 hours)

### Day 1: SQL & PostgreSQL (4h)

**Hour 1:**
- Introduction (15min)
- PostgreSQL installation (30min)
- SQL basics (15min)

**Hour 2:**
- CREATE TABLE practice
- INSERT, SELECT queries
- WHERE, ORDER BY

**Hour 3:**
- Table relationships
- Foreign keys
- JOIN queries

**Hour 4:**
- Aggregate functions
- GROUP BY, HAVING
- Practice exercises

---

### Day 2: NestJS & TypeORM (4h)

**Hour 1:**
- NestJS setup
- Database connection
- First entity

**Hour 2:**
- Student module complete
- DTOs and validation
- Testing endpoints

**Hour 3:**
- Course & Enrollment modules
- Relationships in TypeORM
- Complex queries

**Hour 4:**
- Authentication
- JWT implementation
- Protected routes
- Final project showcase

---

## 🎁 Bonus Content

### Optional Topics (if time allows):

1. **Migrations**
   ```bash
   npm run typeorm migration:generate
   ```

2. **Seeding**
   ```typescript
   // Create seed script
   ```

3. **Soft Delete**
   ```typescript
   @DeleteDateColumn()
   deletedAt: Date;
   ```

4. **Custom Repositories**
   ```typescript
   class CustomStudentRepository extends Repository<Student>
   ```

---

## 📚 Additional Resources for Students

**Documentation:**
- [NestJS Docs](https://docs.nestjs.com/)
- [TypeORM Docs](https://typeorm.io/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

**Practice:**
- [SQL Bolt](https://sqlbolt.com/)
- [LeetCode SQL](https://leetcode.com/problemset/database/)

**Videos:**
- NestJS Crash Course
- PostgreSQL for Beginners

---

## ✅ Pre-Session Checklist

**Before teaching:**
- [ ] PostgreSQL installed and tested
- [ ] Demo project working
- [ ] Postman collection ready
- [ ] Backup cloud database ready
- [ ] Code examples prepared
- [ ] Whiteboard markers ready
- [ ] Record session (if applicable)

---

**Good luck with your teaching! 🚀**
