# CI/CD Integration for Testing

## 🤔 What is CI/CD?

**CI (Continuous Integration)** = Automatically test code every time you push.
**CD (Continuous Deployment)** = Automatically deploy if tests pass.

**Analogi:** CI/CD = Quality control di pabrik (every product tested before shipping).

---

## 🎯 GitHub Actions for Testing

### Basic Workflow
```yaml
# .github/workflows/test.yml
name: Run Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Run coverage
        run: npm test -- --coverage
```

### Advanced Workflow with Database
```yaml
name: Test with Database

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run migrations
        run: npm run migration:run
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          
      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## 📊 Coverage Reporting

### Codecov Integration
```yaml
# Add to workflow
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
    fail_ci_if_error: true
```

### Coverage Badges
Add to README.md:
```markdown
[![Coverage](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
```

---

## 🚀 Pre-commit Hooks

### Husky Setup
```bash
npm install --save-dev husky lint-staged
npx husky install
```

### Configure
```json
// package.json
{
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "jest --findRelatedTests --passWithNoTests"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  }
}
```

---

## 📝 Summary

**CI/CD Benefits:**
- ✅ Catch bugs early
- ✅ Prevent broken code from merging
- ✅ Automated testing on every push
- ✅ Coverage tracking
- ✅ Team confidence

**Setup Checklist:**
- ✅ GitHub Actions workflow
- ✅ Test database in CI
- ✅ Coverage reporting
- ✅ Pre-commit hooks
- ✅ Branch protection rules

---

## 🎉 Congratulations!

You've completed **Week 25: Testing Fundamentals in NestJS**!

Next: Build a fully-tested project to practice all concepts.
