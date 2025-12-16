# Week 25: Testing Fundamentals in NestJS 🧪

Selamat datang di Week 25! Minggu ini kita akan deep dive ke dunia **testing** di NestJS - skill yang membedakan developer biasa dengan developer professional.

---

## 📚 Table of Contents

### Part 1: Testing Fundamentals
1. **[Testing Philosophies](./materi/01-testing-philosophies.md)** - TDD, BDD, TAD
2. **[Testabilities](./materi/02-testabilities.md)** - Membuat code yang mudah di-test
3. **[Testing Fundamentals](./materi/03-testing-fundamentals.md)** - Unit testing basics dengan Jest
4. **[Jest Framework & Mocking](./materi/04-jest-framework-mocking.md)** - Advanced mocking strategies

### Part 2: Backend Testing Excellence
5. **[Backend Testing Excellence](./materi/05-backend-testing-excellence.md)** - Testing business logic
6. **[Testing Guards & Pipes](./materi/06-testing-guards-pipes.md)** - Security testing
7. **[Database Testing](./materi/07-database-testing.md)** - Repository layer testing
8. **[Testing Async Operations](./materi/08-testing-async-operations.md)** - Promises, timeouts, retry logic

### Part 3: Advanced Testing
9. **[Test Fixtures & Factories](./materi/09-test-fixtures-factories.md)** - Test data management
10. **[Test Coverage & Quality](./materi/10-test-coverage-quality.md)** - Measuring test effectiveness
11. **[Testing Controllers](./materi/11-testing-controllers.md)** - HTTP layer testing
12. **[Integration Testing (E2E)](./materi/12-integration-testing-e2e.md)** - Full stack testing

### Part 4: Best Practices & Deployment
13. **[Testing Best Practices](./materi/13-testing-best-practices.md)** - FIRST principles
14. **[Debugging Tests](./materi/14-debugging-tests.md)** - Troubleshooting strategies
15. **[CI/CD Integration](./materi/15-cicd-integration.md)** - Automated testing

---

## 🎯 Learning Objectives

Setelah menyelesaikan Week 25, kamu akan bisa:

✅ Memahami **filosofi testing** (TDD, BDD, TAD)  
✅ Menulis **unit tests** yang berkualitas dengan Jest  
✅ **Mock dependencies** dengan benar  
✅ Test **business logic**, **guards**, **pipes**, dan **controllers**  
✅ Implementasi **integration/E2E tests**  
✅ Manage **test data** dengan fixtures & factories  
✅ Measure dan improve **test coverage**  
✅ Setup **CI/CD pipeline** untuk automated testing  

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd TL-Session/week25
```

### 2. Explore Projects
```bash
# Todo API dengan comprehensive tests
cd projects/todo-api-tested
npm install
npm test
npm run test:cov

# Simple examples
cd ../examples/
```

### 3. Follow Materials
Baca materials secara berurutan (01-15) sambil practice di projects.

---

## 📂 Folder Structure

```
week25/
├── materi/                    # 📚 Learning materials (01-15)
│   ├── 01-testing-philosophies.md
│   ├── 02-testabilities.md
│   ├── ...
│   └── 15-cicd-integration.md
│
├── projects/                  # 🎯 Complete projects
│   └── todo-api-tested/       # Main project dengan full tests
│       ├── src/
│       │   ├── auth/
│       │   ├── users/
│       │   └── todos/
│       ├── test/
│       │   ├── unit/
│       │   ├── integration/
│       │   └── e2e/
│       └── package.json
│
├── examples/                  # 💡 Code examples
│   ├── mocking-examples/
│   ├── guard-testing/
│   ├── pipe-testing/
│   └── async-testing/
│
├── exercises/                 # ✏️ Practice exercises
│   ├── exercise-01-unit-tests.md
│   ├── exercise-02-mocking.md
│   └── exercise-03-e2e.md
│
└── README.md                  # 👈 You are here
```

---

## 🎓 How to Study

### Week Plan (5 Days)

#### **Day 1-2: Foundations**
- Materi 01-04 (Philosophies, Testabilities, Fundamentals, Mocking)
- Practice: Write unit tests untuk simple functions
- Project: Setup testing environment

#### **Day 3: Backend Testing**
- Materi 05-08 (Business Logic, Guards, Database, Async)
- Practice: Test services dan guards
- Project: Implement service tests

#### **Day 4: Advanced & Integration**
- Materi 09-12 (Fixtures, Coverage, Controllers, E2E)
- Practice: Write integration tests
- Project: Complete E2E tests

#### **Day 5: Best Practices & CI/CD**
- Materi 13-15 (Best Practices, Debugging, CI/CD)
- Practice: Setup GitHub Actions
- Project: Deploy with automated testing

---

## 🎯 Main Project: Todo API (Fully Tested)

**Features:**
- ✅ User authentication (JWT)
- ✅ Role-based authorization
- ✅ CRUD todos
- ✅ **100+ unit tests**
- ✅ **50+ integration tests**
- ✅ **20+ E2E tests**
- ✅ **85%+ code coverage**

**Tech Stack:**
- NestJS 10
- TypeORM
- PostgreSQL/SQLite
- Jest
- Supertest

**Run Tests:**
```bash
cd projects/todo-api-tested

# Unit tests
npm test

# Watch mode
npm test:watch

# Coverage
npm test:cov

# E2E tests
npm test:e2e

# All tests
npm run test:all
```

---

## 💡 Key Concepts Summary

### Testing Pyramid
```
        /\
       /E2E\         ← 10% (Slow, expensive)
      /------\
     /  INTEG \      ← 20% (Medium)
    /----------\
   /    UNIT    \    ← 70% (Fast, cheap)
  /--------------\
```

### AAA Pattern
```typescript
it('should work', () => {
  // ARRANGE - Setup test data
  const input = 'test';
  
  // ACT - Execute function
  const result = doSomething(input);
  
  // ASSERT - Verify result
  expect(result).toBe('expected');
});
```

### FIRST Principles
- **F**ast - Milliseconds
- **I**ndependent - No dependencies
- **R**epeatable - Same result every time
- **S**elf-validating - Clear pass/fail
- **T**imely - Written with code

---

## 📊 Testing Checklist

### Before Writing Code:
- [ ] Understand the requirement
- [ ] Think about test cases
- [ ] Consider edge cases

### While Writing Tests:
- [ ] Test happy path
- [ ] Test error cases
- [ ] Test edge cases (null, empty, large numbers)
- [ ] Mock external dependencies
- [ ] Use descriptive test names

### After Writing Tests:
- [ ] Run tests locally
- [ ] Check coverage
- [ ] Review test quality
- [ ] Setup CI/CD

---

## 🛠️ Tools & Libraries

### Core Testing
- **Jest** - Test framework & runner
- **@nestjs/testing** - NestJS testing utilities
- **supertest** - HTTP testing

### Additional Tools
- **faker-js** - Generate fake data
- **codecov** - Coverage reporting
- **husky** - Git hooks
- **lint-staged** - Pre-commit linting

---

## 📖 Additional Resources

### Official Docs
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

### Recommended Reading
- "Test-Driven Development" by Kent Beck
- "Working Effectively with Legacy Code" by Michael Feathers
- "Growing Object-Oriented Software, Guided by Tests" by Freeman & Pryce

### Video Tutorials
- [NestJS Testing Masterclass](https://www.youtube.com)
- [Jest Crash Course](https://www.youtube.com)

---

## ❓ FAQ

**Q: Berapa persen coverage yang ideal?**
A: 75-85% untuk keseluruhan project. Critical business logic harus 90%+.

**Q: Harus test semua function?**
A: Tidak. Focus pada business logic, skip simple getters/setters.

**Q: TDD atau TAD?**
A: Tergantung konteks. Critical features = TDD. Prototype = TAD.

**Q: Unit test atau E2E test?**
A: Both! Tapi prioritas unit tests (70%), integration (20%), E2E (10%).

**Q: Gimana test database operations?**
A: Pakai in-memory database (SQLite) untuk speed.

---

## 🤝 Contributing

Found a typo or want to improve materials? PRs welcome!

```bash
git checkout -b improve-testing-materials
# Make changes
git commit -m "Improve: Add more examples for mocking"
git push origin improve-testing-materials
```

---

## 📝 Summary

> "Testing is not about perfection. It's about confidence to ship and refactor without fear."

**Key Takeaways:**
- ✅ Tests = Safety net for refactoring
- ✅ Unit tests = Fast feedback loop
- ✅ Mocking = Isolated testing
- ✅ Coverage = Metric, not goal
- ✅ CI/CD = Automated quality gate

---

## 🎉 Let's Get Started!

Ready to become a testing ninja? Start with **[Materi 01: Testing Philosophies](./materi/01-testing-philosophies.md)**

**Remember:** 
> "Code without tests is legacy code the moment you write it." - Michael Feathers

Happy Testing! 🧪✨
