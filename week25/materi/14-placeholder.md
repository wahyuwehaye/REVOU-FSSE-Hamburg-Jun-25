# Debugging Tests

## 🤔 Why Tests Fail?

**Common Reasons:**
1. ❌ Async operation not awaited
2. ❌ Mock not configured properly
3. ❌ Test data inconsistent
4. ❌ Race condition
5. ❌ External dependency not mocked

---

## 🔍 Debugging Strategies

### 1. Use console.log
```typescript
it('should process data', async () => {
  const input = { value: 10 };
  console.log('Input:', input); // Debug input
  
  const result = await service.process(input);
  console.log('Result:', result); // Debug output
  
  expect(result).toBe(20);
});
```

### 2. Run Single Test
```bash
# Run only one test file
npm test user.service.spec.ts

# Run only one test case
it.only('should work', () => {});

# Skip a test
it.skip('broken test', () => {});
```

### 3. Debug with VS Code
```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

### 4. Check Mock Calls
```typescript
it('should call service', () => {
  service.create({ name: 'John' });
  
  // Debug: Check if mock was called
  console.log('Mock called?', mockRepo.save.mock.calls.length);
  console.log('Called with:', mockRepo.save.mock.calls[0]);
  
  expect(mockRepo.save).toHaveBeenCalledWith({ name: 'John' });
});
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Test Timeout
```typescript
// ❌ Problem
it('should fetch data', async () => {
  const data = await slowFunction(); // Takes > 5 seconds
});

// ✅ Solution: Increase timeout
it('should fetch data', async () => {
  const data = await slowFunction();
}, 10000); // 10 second timeout
```

### Issue 2: Unhandled Promise Rejection
```typescript
// ❌ Problem
it('should handle error', () => {
  service.failingMethod(); // Throws async error
});

// ✅ Solution: Await the promise
it('should handle error', async () => {
  await expect(service.failingMethod()).rejects.toThrow();
});
```

### Issue 3: Mock Not Working
```typescript
// ❌ Problem
mockService.getData = jest.fn(); // After service is created

// ✅ Solution: Setup mock in beforeEach
beforeEach(() => {
  mockService = {
    getData: jest.fn().mockResolvedValue({ data: 'test' }),
  };
});
```

---

## 📝 Summary

**Debugging Tools:**
- 🖨️ console.log for quick checks
- 🎯 .only / .skip for isolation
- 🐞 VS Code debugger for step-by-step
- 📊 Mock.calls for verification

**Common Fixes:**
- ✅ Await all async operations
- ✅ Setup mocks before tests
- ✅ Increase timeout for slow operations
- ✅ Clear mocks between tests

---

## 🔗 Next Steps
- **Materi 15:** CI/CD Integration
