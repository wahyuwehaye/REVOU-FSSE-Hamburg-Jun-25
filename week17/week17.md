# Week 17 - Testing and Deployment in Next.js

## 📋 Overview

Week 17 fokus pada testing dan deployment untuk aplikasi Next.js. Materi mencakup unit testing dengan Jest, React Testing Library, testing async operations, code coverage, dan setup CI/CD dengan Husky.

## 🎯 Learning Objectives

Setelah menyelesaikan week 17, student akan mampu:

1. **Testing Fundamentals**
   - Memahami pentingnya testing dalam web development
   - Mengenal berbagai jenis testing (unit, integration, E2E)
   - Memilih testing strategy yang tepat

2. **Jest & React Testing Library**
   - Setup Jest di Next.js project
   - Menulis unit tests untuk components
   - Menggunakan matchers dan assertions dengan benar
   - Mocking functions dan modules

3. **Testing User Interactions**
   - Simulate user events (click, type, submit)
   - Testing forms dan validation
   - Testing dynamic UI updates
   - Accessibility testing

4. **Async Operations Testing**
   - Mocking API calls
   - Testing loading dan error states
   - Using waitFor dan findBy queries
   - Testing Next.js data fetching methods

5. **Code Coverage**
   - Understanding coverage metrics
   - Reading coverage reports
   - Setting coverage thresholds
   - Improving coverage strategically

6. **CI/CD & Pre-commit Hooks**
   - Setup Husky untuk pre-commit tests
   - Enforcing code quality dengan hooks
   - Integration dengan GitHub Actions

## 📚 Materi

### Module 1-4: Testing Foundations
- [01 - Introduction to Testing](./materi/01-introduction-to-testing.md)
- [02 - Jest and React Testing Library Overview](./materi/02-jest-and-rtl-overview.md)
- [03 - Setting Up Jest in Next.js](./materi/03-setting-up-jest-nextjs.md)
- [04 - Writing Your First Test](./materi/04-writing-first-test.md)

### Module 5-7: Testing Events & Forms
- [05 - Testing Events and User Interactions](./materi/05-testing-events.md)
- [06 - Testing Form Inputs and Validation](./materi/06-testing-forms.md)
- [07 - Testing Dynamic UI Updates](./materi/07-testing-ui-updates.md)

### Module 8-9: Async Testing
- [08 - Mocking API Calls](./materi/08-mocking-api-calls.md)
- [09 - Testing Async Operations](./materi/09-testing-async.md)

### Module 10-11: Coverage & Quality
- [10 - Understanding Test Coverage](./materi/10-understanding-coverage.md)
- [11 - Implementing Coverage Reports](./materi/11-coverage-reports.md)

### Module 12-13: CI/CD & Deployment
- [12 - Gatekeeping with Husky](./materi/12-husky-setup.md)
- [13 - Advanced Coverage Strategies](./materi/13-advanced-coverage.md)

## 💻 Examples

### Basic Setup
[`examples/jest-basic-setup/`](./examples/jest-basic-setup/)
- Minimal Jest + RTL setup
- Simple component tests
- Utility function tests
- Configuration examples

### Component Testing
[`examples/component-testing-demo/`](./examples/component-testing-demo/)
- Various component patterns
- Event testing
- Form testing
- Conditional rendering

### Async Testing
[`examples/async-testing-demo/`](./examples/async-testing-demo/)
- API mocking with MSW
- Loading states
- Error handling
- Async data fetching

## 🚀 Projects

### Todo App with Tests
[`projects/todo-app-with-tests/`](./projects/todo-app-with-tests/)

**Features:**
- CRUD operations
- Filtering & sorting
- LocalStorage persistence
- 85%+ test coverage

**What you'll learn:**
- Real-world testing scenarios
- Custom hooks testing
- Integration testing
- Coverage strategies

### Shopping Cart (Advanced)
[`projects/shopping-cart-tested/`](./projects/shopping-cart-tested/)

**Features:**
- Cart management
- Product listing
- Checkout flow
- Payment integration mocking

**What you'll learn:**
- Complex state management testing
- Context testing
- E2E-like integration tests
- Husky pre-commit setup

## 📅 Week Schedule

### Day 1: Testing Foundations (Senin)
**Topics:**
- Introduction to testing
- Jest & RTL overview
- Setup Jest di Next.js
- First component test

**Activities:**
- Setup project
- Write first tests
- Run tests successfully

**Deliverable:**
- Working Jest setup
- 3-5 basic tests

### Day 2: Component & Event Testing (Selasa)
**Topics:**
- Testing user interactions
- Form testing
- Validation testing

**Activities:**
- Test button clicks
- Test form submissions
- Test input validation

**Deliverable:**
- Component test suite
- Form tests dengan validasi

### Day 3: Async & API Testing (Rabu)
**Topics:**
- Mocking API calls
- Testing loading states
- Error handling

**Activities:**
- Setup MSW (Mock Service Worker)
- Test async operations
- Test error scenarios

**Deliverable:**
- API mocking setup
- Async test suite

### Day 4: Coverage & Quality (Kamis)
**Topics:**
- Understanding coverage
- Coverage reports
- Improving coverage

**Activities:**
- Generate coverage report
- Analyze gaps
- Add missing tests

**Deliverable:**
- 70%+ coverage
- Coverage report

### Day 5: CI/CD & Review (Jumat)
**Topics:**
- Husky setup
- Pre-commit hooks
- Best practices review

**Activities:**
- Setup Husky
- Configure pre-commit tests
- Code review session

**Deliverable:**
- Husky configured
- Pre-commit tests running
- Project complete

## ✅ Assignments

### Assignment 1: Basic Testing (Individual)
**Due:** Day 2

**Tasks:**
1. Setup Jest di milestone project
2. Write tests untuk minimal 3 components
3. Achieve 60% coverage pada tested components

**Submission:**
- GitHub repository dengan tests
- Screenshot coverage report
- Brief reflection on testing experience

### Assignment 2: Comprehensive Testing (Team)
**Due:** End of week

**Tasks:**
1. Add comprehensive tests ke team project
2. Achieve 75%+ overall coverage
3. Setup Husky dengan pre-commit tests
4. Document testing strategy

**Submission:**
- Updated project repository
- Coverage report
- Testing documentation

## 🎯 Assessment Criteria

### Testing Skills (40%)
- [ ] Jest setup correctly configured
- [ ] Components tested appropriately
- [ ] Events and user interactions covered
- [ ] Async operations tested
- [ ] Edge cases considered

### Code Quality (30%)
- [ ] Tests are readable and maintainable
- [ ] Good test organization
- [ ] Descriptive test names
- [ ] Follows AAA pattern
- [ ] No implementation detail testing

### Coverage (20%)
- [ ] Meets coverage targets (70%+)
- [ ] Critical paths covered
- [ ] Meaningful tests (not just for coverage)
- [ ] Coverage report included

### Best Practices (10%)
- [ ] Husky configured
- [ ] Pre-commit hooks working
- [ ] Documentation clear
- [ ] CI/CD awareness demonstrated

## 💡 Tips for Success

### Do's ✅
- Test behavior, not implementation
- Use accessible queries (getByRole, getByLabelText)
- Keep tests simple and focused
- Test one thing per test
- Use descriptive test names
- Mock external dependencies
- Test edge cases and error states

### Don'ts ❌
- Don't test implementation details
- Don't use getByTestId as first choice
- Don't write brittle tests
- Don't aim for 100% coverage blindly
- Don't skip error scenarios
- Don't test third-party libraries
- Don't forget accessibility

## 🔧 Common Issues & Solutions

### Issue 1: Tests Running Slow
**Solution:**
```javascript
// Use --maxWorkers to limit parallel execution
"test": "jest --maxWorkers=4"
```

### Issue 2: Cannot Find Module
**Solution:**
```javascript
// Check moduleNameMapper in jest.config.js
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1'
}
```

### Issue 3: Async Tests Timeout
**Solution:**
```typescript
// Increase timeout for specific tests
test('slow operation', async () => {
  // test code
}, 10000) // 10 seconds
```

### Issue 4: False Negatives/Positives
**Solution:**
```typescript
// Use more specific queries
// Bad:
screen.getByText('Submit')
// Good:
screen.getByRole('button', { name: /submit form/i })
```

## 📚 Additional Resources

### Documentation
- [Jest Docs](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Next.js Testing](https://nextjs.org/docs/testing)

### Articles & Guides
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Write Tests. Not Too Many. Mostly Integration.](https://kentcdodds.com/blog/write-tests)

### Tools
- [Testing Playground](https://testing-playground.com/) - Find best queries
- [Jest Cheat Sheet](https://github.com/sapegin/jest-cheat-sheet)
- [RTL Cheat Sheet](https://testing-library.com/docs/react-testing-library/cheatsheet)

### Videos
- [TestingJavaScript.com](https://testingjavascript.com/) by Kent C. Dodds
- [Jest Crash Course](https://www.youtube.com/watch?v=7r4xVDI2vho)
- [React Testing Library Tutorial](https://www.youtube.com/watch?v=8Xwq35cPwYg)

## 🎓 Learning Path

### Beginner Level
1. ✅ Understand why testing matters
2. ✅ Setup Jest successfully
3. ✅ Write basic component tests
4. ✅ Use common matchers
5. ✅ Test simple user interactions

### Intermediate Level
1. ✅ Test forms with validation
2. ✅ Mock API calls
3. ✅ Test async operations
4. ✅ Understand coverage reports
5. ✅ Test custom hooks

### Advanced Level
1. ✅ Implement complex test scenarios
2. ✅ Setup CI/CD pipeline
3. ✅ Optimize test performance
4. ✅ Create reusable test utilities
5. ✅ Mentor others on testing

## 🚀 Next Steps

After completing Week 17:

1. **Apply to Milestone Projects**
   - Add tests to existing projects
   - Improve coverage incrementally
   - Setup pre-commit hooks

2. **Explore E2E Testing**
   - Learn Playwright or Cypress
   - Test complete user journeys
   - Integrate with CI/CD

3. **Performance Testing**
   - Learn React Testing Library performance utils
   - Test component render performance
   - Optimize slow tests

4. **Visual Regression Testing**
   - Explore Chromatic or Percy
   - Automated visual testing
   - Catch UI bugs early

## 📞 Support

### Getting Help
- **Office Hours:** Kamis 19:00-20:00 WIB
- **Discord:** #week17-testing channel
- **1-on-1:** Schedule via Calendly

### Peer Support
- Study groups: Form groups of 3-4
- Pair testing: Practice with partner
- Code review: Review each other's tests

---

**Remember:** Good tests give you confidence to ship quality code! 🎉

Happy Testing! 🧪✨
