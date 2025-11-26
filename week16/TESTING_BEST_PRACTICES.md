# 🎓 Testing Best Practices & Cheat Sheet

Quick reference untuk testing patterns, anti-patterns, dan best practices.

---

## 📋 Quick Reference Table

| Category | Do ✅ | Don't ❌ |
|----------|-------|---------|
| **Test Names** | `it('displays error when email is invalid')` | `it('test 1')` |
| **Queries** | `getByRole('button')` | `querySelector('.button')` |
| **State Updates** | `act(() => increment())` | `increment()` without act |
| **Async** | `await waitFor(() => ...)` | Check immediately |
| **Mocks** | `beforeEach(() => jest.clearAllMocks())` | Reuse dirty mocks |
| **Isolation** | Fresh data per test | Share state between tests |
| **Coverage** | 50-80% meaningful tests | 100% for the sake of it |

---

## 🎯 Query Priority Order

Use queries in this order (most accessible → least accessible):

```typescript
// 1️⃣ BEST - Accessible to everyone
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email/i)

// 2️⃣ GOOD - Semantic queries
screen.getByPlaceholderText(/enter email/i)
screen.getByText(/welcome back/i)
screen.getByDisplayValue('John')

// 3️⃣ OKAY - Test IDs (last resort)
screen.getByTestId('submit-button')

// ❌ AVOID - Implementation details
document.querySelector('.submit-btn')
wrapper.find('button').at(0)
```

**Why?** Tests should reflect how users interact with your app!

---

## 🔄 Query Variants

| Variant | Single | Multiple | Async |
|---------|--------|----------|-------|
| **get** | `getBy...` | `getAllBy...` | ❌ |
| **query** | `queryBy...` | `queryAllBy...` | ❌ |
| **find** | `findBy...` | `findAllBy...` | ✅ |

### When to Use:

```typescript
// getBy - Element MUST exist (throws if not found)
const button = screen.getByRole('button');

// queryBy - Element might NOT exist (returns null)
const error = screen.queryByText('Error');
expect(error).not.toBeInTheDocument();

// findBy - Element will appear ASYNC (waits up to 1s)
const data = await screen.findByText('Loaded!');
```

---

## 🎨 Common Testing Patterns

### Pattern 1: AAA (Arrange-Act-Assert)

```typescript
it('increments counter', () => {
  // 🔧 ARRANGE - Setup
  const { result } = renderHook(() => useCounter());
  
  // ⚡ ACT - Do something
  act(() => {
    result.current.increment();
  });
  
  // ✅ ASSERT - Verify
  expect(result.current.count).toBe(1);
});
```

### Pattern 2: Test User Behavior

```typescript
// ✅ GOOD - Test what user sees/does
it('shows error message when login fails', async () => {
  render(<LoginForm />);
  
  await user.type(screen.getByLabelText(/email/i), 'invalid@email');
  await user.click(screen.getByRole('button', { name: /login/i }));
  
  expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
});

// ❌ BAD - Test implementation details
it('sets error state to true', () => {
  const { result } = renderHook(() => useLogin());
  act(() => result.current.login('invalid'));
  expect(result.current.error).toBe(true); // User doesn't care about "error state"
});
```

### Pattern 3: Test Edge Cases

```typescript
describe('useCounter', () => {
  // ✅ Happy path
  it('increments normally', () => {
    // ...
  });
  
  // ✅ Edge cases
  it('handles negative numbers', () => {
    const { result } = renderHook(() => useCounter(-5));
    expect(result.current.count).toBe(-5);
  });
  
  it('handles very large numbers', () => {
    const { result } = renderHook(() => useCounter(Number.MAX_SAFE_INTEGER));
    expect(result.current.count).toBe(Number.MAX_SAFE_INTEGER);
  });
  
  it('handles zero', () => {
    const { result } = renderHook(() => useCounter(0));
    expect(result.current.count).toBe(0);
  });
});
```

### Pattern 4: Mock External Dependencies

```typescript
// ✅ Mock at the top level
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
}));

describe('LoginButton', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('shows login button when not authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
    
    render(<LoginButton />);
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
```

### Pattern 5: Test Async Operations

```typescript
// ✅ GOOD - Wait for async operations
it('loads user data', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({ name: 'John' }),
  });
  
  render(<UserProfile userId="1" />);
  
  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
  
  expect(screen.getByText('John')).toBeInTheDocument();
});

// ❌ BAD - Check immediately (will fail!)
it('loads user data', () => {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({ name: 'John' }),
  });
  
  render(<UserProfile userId="1" />);
  
  // ❌ Data not loaded yet!
  expect(screen.getByText('John')).toBeInTheDocument();
});
```

---

## 🚫 Anti-Patterns to Avoid

### ❌ 1. Testing Implementation Details

```typescript
// ❌ BAD - Testing state variable names
it('sets isLoading to true', () => {
  const { result } = renderHook(() => useFetch());
  expect(result.current.isLoading).toBe(true);
});

// ✅ GOOD - Testing user-visible behavior
it('shows loading spinner', () => {
  render(<UserList />);
  expect(screen.getByRole('status')).toBeInTheDocument();
});
```

### ❌ 2. Testing Too Much in One Test

```typescript
// ❌ BAD - Too many things
it('handles complete user flow', async () => {
  // Login
  // Create post
  // Edit post
  // Delete post
  // Logout
  // 100 lines of test code...
});

// ✅ GOOD - One concept per test
it('logs in user', async () => { /* ... */ });
it('creates new post', async () => { /* ... */ });
it('edits existing post', async () => { /* ... */ });
```

### ❌ 3. Sharing State Between Tests

```typescript
// ❌ BAD - Tests depend on each other
let user;

it('creates user', () => {
  user = createUser();
});

it('updates user', () => {
  updateUser(user); // Depends on previous test!
});

// ✅ GOOD - Each test independent
it('creates user', () => {
  const user = createUser();
  expect(user).toBeDefined();
});

it('updates user', () => {
  const user = createUser(); // Fresh data
  updateUser(user);
  expect(user.updated).toBe(true);
});
```

### ❌ 4. Not Cleaning Up

```typescript
// ❌ BAD - Mocks pollute other tests
it('test 1', () => {
  global.fetch = jest.fn();
  // No cleanup!
});

it('test 2', () => {
  // fetch still mocked from test 1!
});

// ✅ GOOD - Clean up
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});
```

### ❌ 5. Snapshots for Everything

```typescript
// ❌ BAD - Brittle snapshot tests
it('renders correctly', () => {
  const { container } = render(<Button />);
  expect(container).toMatchSnapshot();
  // Breaks on any UI change, even spacing!
});

// ✅ GOOD - Test specific behavior
it('renders with correct label', () => {
  render(<Button label="Submit" />);
  expect(screen.getByRole('button')).toHaveTextContent('Submit');
});
```

---

## 🎯 Matchers Cheat Sheet

### Common Matchers

```typescript
// Equality
expect(value).toBe(5)                    // Strict equality (===)
expect(object).toEqual({ a: 1 })         // Deep equality
expect(value).not.toBe(null)             // Negation

// Truthiness
expect(value).toBeTruthy()               // Boolean true
expect(value).toBeFalsy()                // Boolean false
expect(value).toBeNull()                 // null
expect(value).toBeUndefined()            // undefined
expect(value).toBeDefined()              // not undefined

// Numbers
expect(value).toBeGreaterThan(3)         // > 3
expect(value).toBeGreaterThanOrEqual(3)  // >= 3
expect(value).toBeLessThan(5)            // < 5
expect(value).toBeCloseTo(0.3)           // Floating point

// Strings
expect(str).toMatch(/pattern/)           // Regex match
expect(str).toContain('substring')       // Contains

// Arrays
expect(arr).toContain('item')            // Array contains
expect(arr).toHaveLength(3)              // Array length
expect(arr).toEqual([1, 2, 3])           // Array equality

// Objects
expect(obj).toHaveProperty('key')        // Has property
expect(obj).toMatchObject({ a: 1 })      // Partial match

// Functions
expect(fn).toHaveBeenCalled()            // Called at least once
expect(fn).toHaveBeenCalledTimes(2)      // Called exactly n times
expect(fn).toHaveBeenCalledWith('arg')   // Called with args
expect(() => fn()).toThrow()             // Throws error
```

### DOM Matchers (from jest-dom)

```typescript
// Visibility
expect(element).toBeInTheDocument()      // Exists in DOM
expect(element).toBeVisible()            // Visible to user
expect(element).toBeEmptyDOMElement()    // No children

// Form elements
expect(input).toHaveValue('text')        // Input value
expect(input).toBeDisabled()             // Disabled
expect(input).toBeEnabled()              // Enabled
expect(checkbox).toBeChecked()           // Checked
expect(input).toHaveFocus()              // Has focus

// Text content
expect(element).toHaveTextContent('text') // Text content
expect(element).toContainHTML('<div>')    // HTML content

// Attributes
expect(element).toHaveAttribute('role')   // Has attribute
expect(element).toHaveClass('active')     // Has CSS class
expect(element).toHaveStyle({ color: 'red' }) // Has styles
```

---

## 🔧 Setup Helpers

### Custom Render with Providers

```typescript
// test-utils.tsx
import { render as rtlRender } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

export function render(ui: React.ReactElement, options = {}) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <AuthProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </AuthProvider>
    );
  }
  
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';
```

**Usage:**
```typescript
import { render, screen } from './test-utils'; // Custom render!

it('works with providers', () => {
  render(<MyComponent />); // Automatically wrapped!
});
```

### Custom Hooks Testing Helper

```typescript
// test-utils.tsx
export function renderHookWithProviders<T>(
  hook: () => T,
  options = {}
) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
  
  return renderHook(hook, { wrapper, ...options });
}
```

---

## 📊 Coverage Goals

```
┌─────────────────────────┬──────────┬──────────┐
│ Coverage Type           │ Target   │ Priority │
├─────────────────────────┼──────────┼──────────┤
│ Critical Business Logic │  80-100% │ 🔥 HIGH  │
│ UI Components           │  60-80%  │ ⚡ MED   │
│ Utility Functions       │  80-100% │ 🔥 HIGH  │
│ Hooks                   │  80-100% │ 🔥 HIGH  │
│ Config Files            │  0-20%   │ 💤 LOW   │
│ Types/Interfaces        │  0%      │ 💤 SKIP  │
└─────────────────────────┴──────────┴──────────┘
```

**Remember:** Coverage is a tool, not a goal. 80% meaningful tests > 100% superficial tests.

---

## 🎓 Testing Pyramid

```
        /\
       /  \
      / E2E \         ← Few (slow, expensive)
     /______\
    /        \
   / Integr.  \       ← Some (medium speed)
  /____________\
 /              \
/  Unit  Tests  \     ← Many (fast, cheap)
\________________/
```

**Focus:** Lots of unit tests, some integration tests, few E2E tests.

---

## 🚀 Performance Tips

### 1. Run Tests in Parallel
```json
{
  "scripts": {
    "test": "jest --maxWorkers=4"
  }
}
```

### 2. Only Run Changed Tests
```bash
npm test -- --onlyChanged
```

### 3. Skip Slow Tests During Development
```typescript
it.skip('slow integration test', () => {
  // Skipped in watch mode
});
```

### 4. Use Test Timeouts Wisely
```typescript
it('fast test', () => {
  // ...
}, 1000); // 1s timeout

it('slow test', () => {
  // ...
}, 10000); // 10s timeout
```

---

## 🐛 Debugging Tips

### 1. Use screen.debug()
```typescript
it('finds element', () => {
  render(<MyComponent />);
  
  screen.debug(); // Prints entire DOM
  screen.debug(screen.getByRole('button')); // Prints specific element
});
```

### 2. Pause Test Execution
```typescript
it('debugging test', async () => {
  render(<MyComponent />);
  
  await new Promise(resolve => setTimeout(resolve, 10000)); // Pause 10s
  // Inspect browser during pause
});
```

### 3. Check Available Queries
```typescript
render(<MyComponent />);

// Shows all available queries
screen.logTestingPlaygroundURL();
```

### 4. VS Code Debugging
```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

---

## ✅ Pre-Commit Checklist

Before committing code with tests:

- [ ] All tests passing locally (`npm test`)
- [ ] Coverage meets minimum threshold (`npm run test:coverage`)
- [ ] No `console.log` in tests
- [ ] No `it.only` or `describe.only` (runs only that test)
- [ ] No `it.skip` (skips tests)
- [ ] Mocks are cleared in `beforeEach`
- [ ] Test names are descriptive
- [ ] Tests are isolated (don't depend on each other)
- [ ] Async operations use `await`
- [ ] State updates wrapped in `act()`

---

## 📚 Further Reading

### Documentation
- [Jest Docs](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Books
- "Test-Driven Development" by Kent Beck
- "Growing Object-Oriented Software, Guided by Tests"

### Courses
- [Testing JavaScript](https://testingjavascript.com/) by Kent C. Dodds
- [Epic React - Testing](https://epicreact.dev/testing)

---

## 🎯 Quick Decision Tree

**"Should I test this?"**

```
Is it critical business logic?
    ├─ YES → ✅ Test it (80%+ coverage)
    └─ NO
        Is it complex?
            ├─ YES → ✅ Test it
            └─ NO
                Will it change often?
                    ├─ YES → ✅ Test it
                    └─ NO
                        Is it easy to test?
                            ├─ YES → ✅ Test it
                            └─ NO → ⚠️  Consider refactoring
```

---

## 💪 Testing Mantras

1. **"Test behavior, not implementation"**
2. **"The more your tests resemble how users use your software, the more confidence they give you"**
3. **"Write tests that make you confident, not tests that make you feel good about coverage numbers"**
4. **"If testing is hard, your code might be poorly designed"**
5. **"A failing test is better than no test"**

---

**Remember:** Good tests are:
- ✅ **Fast** - Run quickly
- ✅ **Isolated** - Don't depend on each other
- ✅ **Repeatable** - Same result every time
- ✅ **Self-validating** - Pass or fail, no manual checking
- ✅ **Timely** - Written close to the code

Happy Testing! 🚀
