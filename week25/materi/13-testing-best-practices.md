# Testing Best Practices

## 🎯 The FIRST Principles

**F**ast - Tests harus cepat (milliseconds)
**I**ndependent - Tests tidak tergantung satu sama lain
**R**epeatable - Hasil yang sama setiap dijalankan
**S**elf-validating - Pass/fail jelas tanpa manual check
**T**imely - Ditulis bersamaan dengan code (tidak nanti)

---

## ✅ DO's

### 1. Write Descriptive Test Names
```typescript
// ✅ Good
it('should return 404 when user does not exist', () => {});

// ❌ Bad
it('test user', () => {});
```

### 2. Follow AAA Pattern
```typescript
it('should calculate total correctly', () => {
  // ARRANGE
  const items = [{ price: 100 }, { price: 200 }];
  
  // ACT
  const total = calculateTotal(items);
  
  // ASSERT
  expect(total).toBe(300);
});
```

### 3. Test Behavior, Not Implementation
```typescript
// ✅ Good - Testing behavior
it('should hash password before saving', async () => {
  const result = await service.createUser({ password: 'plain' });
  expect(result.password).not.toBe('plain');
});

// ❌ Bad - Testing implementation
it('should call bcrypt.hash', async () => {
  await service.createUser({ password: 'plain' });
  expect(bcrypt.hash).toHaveBeenCalled();
});
```

### 4. Keep Tests Simple
```typescript
// ✅ Good - Simple and clear
it('should add two numbers', () => {
  expect(add(2, 3)).toBe(5);
});

// ❌ Bad - Too complex
it('should do math', () => {
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const result = add(x, y);
  expect(result).toBe(x + y);
});
```

---

## ❌ DON'Ts

### 1. Don't Test Private Methods
```typescript
// ❌ Bad
it('should call private method', () => {
  expect(service['privateMethod']()).toBe(true);
});

// ✅ Good - Test through public API
it('should process data correctly', () => {
  expect(service.processData()).toBe(expectedResult);
});
```

### 2. Don't Use Real External Services
```typescript
// ❌ Bad
it('should send email', async () => {
  await service.sendEmail(); // Actually sends email!
});

// ✅ Good
it('should send email', async () => {
  mockEmailService.send.mockResolvedValue(true);
  await service.sendEmail();
  expect(mockEmailService.send).toHaveBeenCalled();
});
```

### 3. Don't Create Test Interdependencies
```typescript
// ❌ Bad - Tests depend on order
let userId;

it('should create user', () => {
  userId = service.create();
});

it('should find user', () => {
  service.find(userId); // Depends on previous test!
});

// ✅ Good - Independent tests
it('should create user', () => {
  const userId = service.create();
  expect(userId).toBeDefined();
});

it('should find user', () => {
  const userId = service.create();
  service.find(userId);
});
```

---

## 📝 Summary

**Key Principles:**
- ✅ FIRST (Fast, Independent, Repeatable, Self-validating, Timely)
- ✅ AAA Pattern (Arrange, Act, Assert)
- ✅ Test behavior, not implementation
- ✅ Keep tests simple and clear
- ❌ No test interdependencies
- ❌ No real external calls

---

## 🔗 Next Steps
- **Materi 14:** Debugging Tests
- **Materi 15:** CI/CD Integration
