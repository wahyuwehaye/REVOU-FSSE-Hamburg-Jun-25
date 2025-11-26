# 🎬 Visual Testing Guide - Screenshots & Examples

## 📸 What Good Tests Look Like

### ✅ Passing Tests
![Passing Tests Example](https://via.placeholder.com/800x400/28a745/ffffff?text=All+Tests+Passing+%E2%9C%85)

```bash
PASS  src/hooks/__tests__/useCounter.test.ts
  useCounter
    ✓ initializes with default value 0 (2 ms)
    ✓ initializes with custom value (1 ms)
    ✓ increments count (3 ms)
    ✓ decrements count (2 ms)
    ✓ resets to initial value (2 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

### ❌ Failing Tests
![Failing Tests Example](https://via.placeholder.com/800x400/dc3545/ffffff?text=Test+Failures+%E2%9D%8C)

```bash
FAIL  src/hooks/__tests__/useCounter.test.ts
  useCounter
    ✕ increments count (5 ms)

  ● useCounter › increments count

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      15 |     result.current.increment();
      16 |   });
    > 17 |   expect(result.current.count).toBe(1);
         |                                 ^
```

**Why Failed:** Forgot to wrap increment() with `act()`

### 📊 Coverage Report
![Coverage Report Example](https://via.placeholder.com/800x600/0d6efd/ffffff?text=Coverage+Report)

```bash
--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |   50.51 |    45.45 |      60 |   50.51 |
 hooks                    |     100 |      100 |     100 |     100 |
  useCounter.ts           |     100 |      100 |     100 |     100 |
  useDebounce.ts          |     100 |      100 |     100 |     100 |
  useLocalStorage.ts      |     100 |      100 |     100 |     100 |
  useTodoReducer.ts       |     100 |      100 |     100 |     100 |
 context                  |    62.5 |    33.33 |   66.67 |      60 |
  ThemeContext.tsx        |    62.5 |    33.33 |   66.67 |      60 |
--------------------------|---------|----------|---------|---------|
```

---

## 🎯 Test Development Workflow

### Step 1: Write Test (Red Phase)
```typescript
it('increments count', () => {
  const { result } = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

**Status:** ❌ Red - Test fails because hook doesn't exist yet

### Step 2: Write Minimal Code (Green Phase)
```typescript
export function useCounter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(c => c + 1);
  return { count, increment };
}
```

**Status:** ✅ Green - Test passes!

### Step 3: Refactor (Refactor Phase)
```typescript
export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return { count, increment };
}
```

**Status:** ✅ Still Green - Better code, tests still pass!

---

## 🐛 Common Error Messages & Solutions

### Error 1: "Act" Warning

```bash
Warning: An update to TestComponent inside a test was not wrapped in act(...).
```

**Problem:**
```typescript
// ❌ Missing act()
result.current.increment();
expect(result.current.count).toBe(1);
```

**Solution:**
```typescript
// ✅ Wrapped with act()
act(() => {
  result.current.increment();
});
expect(result.current.count).toBe(1);
```

### Error 2: Element Not Found

```bash
TestingLibraryElementError: Unable to find an element with the text: /submit/i
```

**Problem:**
```typescript
// ❌ Element doesn't exist or wrong query
await user.click(screen.getByText(/submit/i));
```

**Solution:**
```typescript
// ✅ Use correct role/query
await user.click(screen.getByRole('button', { name: /submit/i }));

// Or debug to see what's rendered
screen.debug();
```

### Error 3: Async Timeout

```bash
Error: Timed out in waitFor after 1000ms.
```

**Problem:**
```typescript
// ❌ Async operation takes too long
await waitFor(() => {
  expect(result.current.loading).toBe(false);
});
```

**Solution:**
```typescript
// ✅ Increase timeout or fix mock
await waitFor(() => {
  expect(result.current.loading).toBe(false);
}, { timeout: 3000 });
```

### Error 4: Cannot Read Property

```bash
TypeError: Cannot read property 'name' of undefined
```

**Problem:**
```typescript
// ❌ Data not loaded yet
expect(result.current.data.name).toBe('John');
```

**Solution:**
```typescript
// ✅ Wait for data to load
await waitFor(() => {
  expect(result.current.data).not.toBeNull();
});
expect(result.current.data.name).toBe('John');
```

---

## 🎨 VS Code Testing Extension

### Setup Jest Extension
1. Install "Jest" extension by Orta
2. See test status inline:
   - ✅ Green checkmark = passing
   - ❌ Red X = failing
   - ⚪ Gray dot = not run

### Features:
- **Inline Test Results** - See pass/fail in editor
- **Run Single Test** - Click to run specific test
- **Debug Tests** - Set breakpoints, step through
- **Coverage Gutters** - See which lines are covered

### Screenshot Placeholder:
![VS Code Jest Extension](https://via.placeholder.com/800x500/6f42c1/ffffff?text=VS+Code+Jest+Extension)

---

## 📺 Watch Mode Demo

### What is Watch Mode?
```bash
npm run test:watch
```

Watch mode automatically re-runs tests when files change.

**Features:**
- Press `a` - Run all tests
- Press `f` - Run only failed tests
- Press `p` - Filter by filename pattern
- Press `t` - Filter by test name pattern
- Press `q` - Quit watch mode

**Demo Flow:**
1. Start watch mode: `npm run test:watch`
2. Edit `useCounter.ts` - Tests auto-run ✅
3. Break code - Tests auto-fail ❌
4. Fix code - Tests auto-pass ✅

---

## 🎯 Test-Driven Development (TDD) Flow

### Visual Process:
```
1. Write Test ──┐
   (Red)        │
                ↓
2. Write Code ──┤
   (Green)      │
                ↓
3. Refactor ────┘
   (Still Green)
```

### Example: Building useToggle Hook

#### Step 1: Write Test First (Red 🔴)
```typescript
it('toggles value', () => {
  const { result } = renderHook(() => useToggle());
  
  expect(result.current.value).toBe(false);
  
  act(() => result.current.toggle());
  expect(result.current.value).toBe(true);
});
```
**Status:** ❌ Test fails - hook doesn't exist

#### Step 2: Write Minimal Code (Green 🟢)
```typescript
export function useToggle() {
  const [value, setValue] = useState(false);
  const toggle = () => setValue(!value);
  return { value, toggle };
}
```
**Status:** ✅ Test passes!

#### Step 3: Add More Tests (Red 🔴)
```typescript
it('accepts initial value', () => {
  const { result } = renderHook(() => useToggle(true));
  expect(result.current.value).toBe(true);
});
```
**Status:** ❌ Fails - hook doesn't accept param

#### Step 4: Update Code (Green 🟢)
```typescript
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(!value);
  return { value, toggle };
}
```
**Status:** ✅ All tests pass!

---

## 📊 Coverage Visualization

### HTML Coverage Report

After running `npm run test:coverage`, open:
```bash
open coverage/lcov-report/index.html
```

### What You'll See:
- 🟢 **Green lines** = Covered by tests
- 🔴 **Red lines** = Not covered
- 🟡 **Yellow lines** = Partially covered (branches)

### Example View:
```typescript
export function useCounter(initialValue = 0) {  // 🟢 Covered
  const [count, setCount] = useState(initialValue);  // 🟢
  
  const increment = () => setCount(c => c + 1);  // 🟢
  const decrement = () => setCount(c => c - 1);  // 🔴 Not covered!
  
  return { count, increment, decrement };  // 🟢
}
```

**Action:** Need to add test for `decrement()`!

---

## 🎓 Learning Path Visualization

```
Week 1: Jest Basics
├── Setup Jest
├── Write first test
└── Run tests
    ↓
Week 2: Component Testing
├── Render components
├── Query elements
└── User interactions
    ↓
Week 3: Hook Testing
├── renderHook
├── act()
└── Async testing
    ↓
Week 4: Advanced Patterns
├── Context testing
├── Mocking
└── Integration tests
    ↓
🎉 You're now a testing pro!
```

---

## 🔗 Useful Resources

### Cheat Sheets
- [Jest Cheat Sheet](https://github.com/sapegin/jest-cheat-sheet)
- [React Testing Library Cheat Sheet](https://testing-library.com/docs/react-testing-library/cheatsheet)

### Video Tutorials
- [Kent C. Dodds - Testing Workshop](https://testingjavascript.com/)
- [Fireship - Jest in 100 Seconds](https://www.youtube.com/watch?v=FgnxcUQ5vho)

### Interactive Examples
- [Testing Playground](https://testing-playground.com/)
- [Jest Playground](https://jestjs.io/docs/getting-started)

---

## 📝 Quick Reference Card

```
┌─────────────────────────────────────────────────┐
│           JEST TESTING QUICK REFERENCE           │
├─────────────────────────────────────────────────┤
│ Run Tests:                                      │
│   npm test                  All tests           │
│   npm run test:watch        Watch mode          │
│   npm run test:coverage     With coverage       │
├─────────────────────────────────────────────────┤
│ Common Matchers:                                │
│   .toBe(value)              Exact equality      │
│   .toEqual(object)          Deep equality       │
│   .toBeNull()               Is null             │
│   .toBeDefined()            Is defined          │
│   .toHaveLength(n)          Array/string length │
├─────────────────────────────────────────────────┤
│ RTL Queries (Priority Order):                   │
│   1. getByRole()            Accessibility       │
│   2. getByLabelText()       Form fields         │
│   3. getByPlaceholderText() Form fields         │
│   4. getByText()            Text content        │
│   5. getByTestId()          Last resort         │
├─────────────────────────────────────────────────┤
│ User Events:                                    │
│   await user.click(element)                     │
│   await user.type(input, 'text')                │
│   await user.clear(input)                       │
│   await user.selectOptions(select, 'value')     │
├─────────────────────────────────────────────────┤
│ Async Testing:                                  │
│   await waitFor(() => {...})                    │
│   await findBy...()                             │
│   act(() => {...})                              │
└─────────────────────────────────────────────────┘
```

---

## 🎉 Success Stories

### Before Testing:
```
❌ Deploy → Production bug → Hotfix → Stress
❌ Refactor → Break feature → Rollback
❌ New feature → Break old feature → Debug
```

### After Testing:
```
✅ Deploy → Tests pass → Confident release
✅ Refactor → Tests pass → Safe changes
✅ New feature → Tests pass → No regressions
```

---

## 💪 Testing Confidence Levels

```
Level 0: No Tests 😰
└── "Hope it works!"

Level 1: Some Tests 😅
└── "Maybe it works?"

Level 2: Good Coverage 😊
└── "Should work"

Level 3: Excellent Coverage 😎
└── "Definitely works!"

Level 4: TDD Master 🚀
└── "Can't NOT work!"
```

---

**Remember:** 
- 📸 A picture is worth 1000 words
- 🎬 A demo is worth 1000 pictures
- 🧪 A test is worth 1000 demos

Happy Testing! 🎉
