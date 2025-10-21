# 02 - Overview of Jest and React Testing Library

## 🎯 Tujuan Pembelajaran

Setelah mempelajari modul ini, Anda akan mampu:
- Memahami apa itu Jest dan kegunaannya
- Memahami apa itu React Testing Library
- Mengerti perbedaan dan kapan menggunakan masing-masing tool
- Memahami philosophy testing yang benar

## 🃏 Apa itu Jest?

**Jest** adalah JavaScript testing framework yang fokus pada simplicity. Jest dikembangkan oleh Meta (Facebook) dan digunakan secara luas di industri.

### Mengapa Jest?

```
✅ Zero Configuration - Setup minimal
✅ Fast & Parallel - Running tests secara parallel
✅ Built-in Coverage - Code coverage tanpa tool tambahan
✅ Mocking Support - Built-in mocking untuk dependencies
✅ Snapshot Testing - Test UI components dengan mudah
✅ Great Error Messages - Error messages yang jelas
```

### Fitur Utama Jest

#### 1. **Test Runner**
Jest menjalankan test files dan melaporkan hasilnya.

```typescript
// math.test.ts
describe('Calculator', () => {
  test('menambahkan dua angka', () => {
    expect(2 + 2).toBe(4);
  });
  
  test('mengalikan dua angka', () => {
    expect(3 * 4).toBe(12);
  });
});
```

#### 2. **Matchers**
Jest menyediakan berbagai matchers untuk assertions.

```typescript
// Equality
expect(value).toBe(4);           // ===
expect(value).toEqual({ a: 1 }); // deep equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3); // floating point

// Strings
expect('Hello World').toMatch(/World/);
expect('Hello World').toContain('Hello');

// Arrays
expect(['apple', 'banana']).toContain('apple');
expect(array).toHaveLength(3);

// Objects
expect(obj).toHaveProperty('name');
expect(obj).toMatchObject({ name: 'John' });
```

#### 3. **Mocking**
Jest memudahkan mocking functions, modules, dan timers.

```typescript
// Mock function
const mockFn = jest.fn();
mockFn('hello');
expect(mockFn).toHaveBeenCalledWith('hello');

// Mock module
jest.mock('./api', () => ({
  fetchUser: jest.fn(() => Promise.resolve({ id: 1, name: 'John' }))
}));

// Mock timer
jest.useFakeTimers();
setTimeout(() => console.log('delayed'), 1000);
jest.advanceTimersByTime(1000);
```

#### 4. **Code Coverage**
Jest dapat generate coverage reports.

```bash
# Run dengan coverage
npm test -- --coverage

# Output:
---------------------------|---------|----------|---------|---------|
File                       | % Stmts | % Branch | % Funcs | % Lines |
---------------------------|---------|----------|---------|---------|
All files                  |   85.71 |       75 |      80 |   84.61 |
 calculator.ts             |     100 |      100 |     100 |     100 |
 userService.ts            |   71.42 |       50 |      60 |   69.23 |
---------------------------|---------|----------|---------|---------|
```

## 🧪 Apa itu React Testing Library?

**React Testing Library** adalah library untuk testing React components dengan cara yang mirip dengan bagaimana users menggunakan aplikasi Anda.

### Philosophy

> **"The more your tests resemble the way your software is used, the more confidence they can give you."**
> — Kent C. Dodds (Creator of React Testing Library)

### Prinsip Utama

#### 1. **Test User Behavior, Not Implementation**

❌ **Bad Practice:**
```typescript
// Testing implementation details
test('button has correct className', () => {
  const { container } = render(<Button />);
  expect(container.firstChild).toHaveClass('btn-primary');
});
```

✅ **Good Practice:**
```typescript
// Testing user behavior
test('user can click button to submit form', () => {
  render(<Form />);
  const submitButton = screen.getByRole('button', { name: /submit/i });
  
  fireEvent.click(submitButton);
  
  expect(screen.getByText('Form submitted!')).toBeInTheDocument();
});
```

#### 2. **Use Accessible Queries**

React Testing Library mendorong Anda menggunakan queries yang accessible:

**Priority Order:**
```typescript
// 1. Queries accessible to everyone
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email')
screen.getByPlaceholderText('Enter email')
screen.getByText('Welcome')

// 2. Semantic queries
screen.getByAltText('Profile picture')
screen.getByTitle('Close')

// 3. Test IDs (last resort)
screen.getByTestId('custom-element')
```

### Fitur Utama React Testing Library

#### 1. **Queries**
Mencari elements di DOM.

```typescript
import { render, screen } from '@testing-library/react';

render(<LoginForm />);

// Single element (throws error if not found)
const button = screen.getByRole('button');
const input = screen.getByLabelText('Email');

// Single element (returns null if not found)
const optional = screen.queryByText('Optional text');

// Multiple elements
const items = screen.getAllByRole('listitem');

// Async queries (wait for element)
const async = await screen.findByText('Loaded data');
```

#### 2. **User Events**
Simulate user interactions.

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

test('user can type in input', () => {
  render(<SearchBox />);
  
  const input = screen.getByRole('textbox');
  
  // Type in input
  fireEvent.change(input, { target: { value: 'React' } });
  
  expect(input).toHaveValue('React');
});
```

#### 3. **Waiting for Changes**
Handle async updates.

```typescript
import { render, screen, waitFor } from '@testing-library/react';

test('loads and displays data', async () => {
  render(<UserProfile userId={1} />);
  
  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

## 🔄 Jest vs React Testing Library

| Aspek | Jest | React Testing Library |
|-------|------|----------------------|
| **Tujuan** | Testing framework (runner, assertions) | Testing library untuk React |
| **Fungsi** | Runs tests, assertions, mocking | DOM queries, user interactions |
| **Scope** | Universal (bisa untuk apapun) | Specific untuk React |
| **Digunakan untuk** | Test logic, functions, async | Test components, UI, interactions |

### Mereka Bekerja Bersama!

```typescript
import { render, screen } from '@testing-library/react'; // RTL
import '@testing-library/jest-dom'; // Jest matchers for DOM

describe('LoginForm', () => { // Jest describe
  test('displays error for invalid email', () => { // Jest test
    render(<LoginForm />); // RTL render
    
    const input = screen.getByLabelText('Email'); // RTL query
    fireEvent.change(input, { target: { value: 'invalid' } }); // RTL interaction
    
    expect(screen.getByText('Invalid email')).toBeInTheDocument(); // Jest + Jest-DOM
  });
});
```

## 📦 Setup Tools yang Diperlukan

### 1. Core Dependencies

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  }
}
```

### 2. TypeScript Support (Optional)

```json
{
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "ts-jest": "^29.1.0"
  }
}
```

## 🎨 Testing Philosophy Comparison

### Traditional Testing (Enzyme)

```typescript
// Focus pada implementation
test('button component', () => {
  const wrapper = shallow(<Button />);
  
  expect(wrapper.find('.button')).toHaveLength(1);
  expect(wrapper.state('clicked')).toBe(false);
  wrapper.instance().handleClick();
  expect(wrapper.state('clicked')).toBe(true);
});
```

**Problems:**
- Testing internal state
- Testing implementation details
- Brittle tests (break when refactoring)

### Modern Testing (RTL)

```typescript
// Focus pada user behavior
test('button component', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick} />);
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  expect(handleClick).toHaveBeenCalled();
});
```

**Benefits:**
- Testing actual behavior
- Tests don't break on refactor
- More confidence in user experience

## 💡 Best Practices

### 1. Use Semantic Queries

```typescript
// ❌ Avoid
screen.getByTestId('submit-button')

// ✅ Prefer
screen.getByRole('button', { name: /submit/i })
```

### 2. Test from User Perspective

```typescript
// ❌ Avoid testing state
expect(component.state.isLoggedIn).toBe(true)

// ✅ Test visible outcome
expect(screen.getByText('Welcome back!')).toBeInTheDocument()
```

### 3. Keep Tests Isolated

```typescript
// ❌ Avoid shared state
let user;
beforeAll(() => { user = { name: 'John' } });

// ✅ Create fresh data per test
test('displays user name', () => {
  const user = { name: 'John' };
  render(<UserProfile user={user} />);
});
```

## 🚀 Quick Example

```typescript
// Button.tsx
export function Button({ onClick, children }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="btn-primary"
    >
      {children}
    </button>
  );
}

// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByRole('button', { name: 'Click me' }))
      .toBeInTheDocument();
  });
  
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 💡 Key Takeaways

1. ✅ Jest adalah testing framework, RTL adalah testing library untuk React
2. ✅ Mereka bekerja bersama untuk comprehensive testing
3. ✅ Test behavior, bukan implementation
4. ✅ Gunakan queries yang accessible
5. ✅ Write tests dari perspektif user
6. ✅ Tests yang baik memberikan confidence dan tidak brittle

## 🎯 Exercise

Pikirkan component yang sedang Anda kerjakan:

1. Identifikasi user interactions yang penting
2. Tuliskan test cases dalam bahasa natural (belum kode)
3. Untuk setiap test case, tentukan:
   - Query apa yang akan digunakan?
   - Event apa yang akan di-simulate?
   - Apa expected outcome-nya?

**Contoh:**

```
Component: SearchBox
User Interaction: User mengetik query dan menekan Enter

Test Case 1: "User dapat mengetik di search box"
- Query: getByRole('textbox')
- Event: fireEvent.change dengan value 'React'
- Expected: input.value === 'React'

Test Case 2: "Form submit saat Enter ditekan"
- Query: getByRole('textbox')
- Event: fireEvent.keyDown dengan key 'Enter'
- Expected: onSearch function dipanggil dengan 'React'
```

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library Documentation](https://testing-library.com/react)
- [Common Mistakes with RTL](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Playground](https://testing-playground.com/)

---

**Next:** [03 - Setting Up Jest in Next.js](./03-setting-up-jest-nextjs.md)
