# Test Coverage and Quality

## 🤔 What is Test Coverage?

**Analogi:** Test coverage = Seberapa banyak code kamu yang sudah "dilindungi" oleh tests.

- 100% Coverage ≠ Bug-free code
- 80% Coverage dengan tests yang bagus > 100% Coverage dengan tests asal-asalan

---

## 📊 Types of Coverage

### 1. Line Coverage
Persentase **lines of code** yang dijalankan saat tests.

### 2. Branch Coverage
Persentase **if/else branches** yang di-test.

### 3. Function Coverage
Persentase **functions** yang dipanggil saat tests.

### 4. Statement Coverage
Persentase **statements** yang dieksekusi.

---

## 🎯 Running Coverage with Jest

```bash
# Run tests with coverage
npm test -- --coverage

# Generate HTML report
npm test -- --coverage --coverageDirectory=coverage
```

**Coverage Report Example:**
```
------------------------|---------|----------|---------|---------|-------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------|---------|----------|---------|---------|-------------------
All files               |   85.71 |    75.00 |   83.33 |   85.71 |
user.service.ts         |   90.00 |    80.00 |  100.00 |   90.00 | 25-27
todo.service.ts         |   80.00 |    70.00 |   66.67 |   80.00 | 15,42-45
------------------------|---------|----------|---------|---------|-------------------
```

---

## ✅ Coverage Goals

**Recommended Targets:**
- Critical business logic: **90-100%**
- Services: **80-90%**
- Controllers: **70-80%**
- Utils/Helpers: **80-90%**
- Overall project: **75-85%**

**What NOT to cover:**
- ❌ Interfaces/Types (TypeScript)
- ❌ Simple DTOs
- ❌ Framework boilerplate
- ❌ Third-party library code

---

## 🧠 Quality > Quantity

```typescript
// ❌ Bad: 100% coverage but useless test
it('should exist', () => {
  expect(service).toBeDefined(); // This adds coverage but tests nothing
});

// ✅ Good: Tests actual behavior
it('should create user with hashed password', async () => {
  const result = await service.createUser({ password: 'plain' });
  expect(result.password).not.toBe('plain');
  expect(result.password).toMatch(/^\$2[ab]\$/);
});
```

---

## 📝 Summary

**Key Points:**
- Coverage is a **metric**, not a **goal**
- Focus on **quality of tests**, not just numbers
- Test **critical paths** thoroughly
- Don't chase 100% coverage

---

## 🔗 Next Steps
- **Materi 11:** Testing Controllers
- **Materi 12:** Integration Testing
