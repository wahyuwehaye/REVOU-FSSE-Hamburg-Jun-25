# 📘 Panduan Lengkap Unit Testing untuk Beginner

## 🎯 Apa itu Unit Testing?

**Unit Testing** adalah proses untuk menguji bagian kecil (unit) dari kode Anda secara terpisah. Analoginya seperti menguji setiap komponen mobil (mesin, rem, lampu) sebelum mobil jadi lengkap.

### Mengapa Unit Testing Penting?

✅ **Mencegah bug** - Menangkap error sebelum sampai ke production  
✅ **Dokumentasi hidup** - Test menjelaskan cara kerja code  
✅ **Refactoring aman** - Bisa ubah code tanpa takut merusak  
✅ **Confidence** - Yakin code berfungsi seperti yang diharapkan

---

## 🛠️ Tools yang Digunakan

### 1. **Jest** - Testing Framework
Framework utama untuk menjalankan tests.

```bash
npm install -D jest @types/jest
```

### 2. **React Testing Library (RTL)** - Component Testing
Library untuk test React components.

```bash
npm install -D @testing-library/react @testing-library/jest-dom
```

### 3. **@testing-library/user-event** - User Interaction
Simulasi interaksi user (click, type, dll).

```bash
npm install -D @testing-library/user-event
```

### 4. **ts-node** - TypeScript Support
Untuk menjalankan Jest config dengan TypeScript.

```bash
npm install -D ts-node
```

---

## 📁 Struktur Project

```
src/
├── components/
│   ├── LoginForm.tsx              ← Component yang mau di-test
│   └── __tests__/                 ← Folder untuk tests
│       └── LoginForm.test.tsx     ← Test file
├── hooks/
│   ├── useToggle.ts               ← Hook yang mau di-test
│   └── __tests__/
│       └── useToggle.test.ts      ← Test file untuk hook
jest.config.ts                      ← Konfigurasi Jest
jest.setup.ts                       ← Setup sebelum test run
package.json                        ← Tambahkan test scripts
```

**Aturan Penamaan:**
- Test file: `[NamaFile].test.tsx` atau `[NamaFile].spec.tsx`
- Folder: `__tests__` di sebelah file yang di-test

---

## ⚙️ Setup Jest

### Step 1: Buat `jest.config.ts`

```typescript
import type { Config } from 'jest';
import nextJest from 'next/jest';

// Membuat config untuk Next.js
const createJestConfig = nextJest({
  dir: './',  // Path ke Next.js app
});

const config: Config = {
  // Gunakan jsdom untuk simulate browser environment
  testEnvironment: 'jsdom',
  
  // File setup yang dijalankan sebelum tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Path mapping (sesuai tsconfig.json)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Pattern file test
  testMatch: [
    '**/__tests__/**/*.{ts,tsx}',
    '**/*.{spec,test}.{ts,tsx}'
  ],
  
  // Files untuk coverage report
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
};

export default createJestConfig(config);
```

**Penjelasan:**
- `testEnvironment: 'jsdom'` - Simulasi browser environment
- `setupFilesAfterEnv` - Import @testing-library/jest-dom
- `moduleNameMapper` - Resolve `@/` imports
- `testMatch` - Pattern untuk mencari test files
- `collectCoverageFrom` - Files yang di-track untuk coverage

### Step 2: Buat `jest.setup.ts`

```typescript
import '@testing-library/jest-dom';
```

File ini extends Jest dengan matchers seperti `toBeInTheDocument()`, `toHaveTextContent()`, dll.

### Step 3: Update `package.json`

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 📝 Cara Membuat Test

### Pattern 1: Test Component

#### File: `src/components/Button.tsx`

```typescript
export function Button({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick}>{label}</button>;
}
```

#### File: `src/components/__tests__/Button.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct label', () => {
    // 1. ARRANGE - Setup
    render(<Button label="Click me" onClick={() => {}} />);
    
    // 2. ACT - (tidak ada action di test ini)
    
    // 3. ASSERT - Verify
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', async () => {
    // 1. ARRANGE
    const mockOnClick = jest.fn();  // Mock function
    const user = userEvent.setup();  // Setup user event
    render(<Button label="Click me" onClick={mockOnClick} />);
    
    // 2. ACT
    await user.click(screen.getByRole('button'));
    
    // 3. ASSERT
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
```

**Penjelasan Step by Step:**

1. **Import yang diperlukan**
   - `render` - Untuk render component
   - `screen` - Untuk query DOM elements
   - `userEvent` - Untuk simulasi user interaction

2. **`describe('Button', () => {})`**
   - Grouping tests untuk component Button
   - Membuat test suite

3. **`it('renders with correct label', () => {})`**
   - Satu test case
   - Nama harus jelas describe apa yang di-test

4. **AAA Pattern:**
   - **Arrange** - Setup (render component, prepare data)
   - **Act** - Action (click, type, dll)
   - **Assert** - Verify (expect...)

5. **Queries:**
   - `screen.getByRole('button')` - Cari element by role
   - `screen.getByText('text')` - Cari by text content
   - `screen.getByLabelText('label')` - Cari by label

6. **Matchers:**
   - `toHaveTextContent('text')` - Check text content
   - `toBeInTheDocument()` - Check element exists
   - `toHaveBeenCalledTimes(n)` - Check function call count

---

### Pattern 2: Test Custom Hook

#### File: `src/hooks/useCounter.ts`

```typescript
import { useState } from 'react';

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}
```

#### File: `src/hooks/__tests__/useCounter.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../useCounter';

describe('useCounter', () => {
  it('initializes with default value 0', () => {
    // 1. ARRANGE & ACT
    const { result } = renderHook(() => useCounter());
    
    // 2. ASSERT
    expect(result.current.count).toBe(0);
  });

  it('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());
    
    // ACT - Gunakan act() untuk state updates
    act(() => {
      result.current.increment();
    });
    
    // ASSERT
    expect(result.current.count).toBe(1);
  });

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });

  it('resets to initial value', () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.increment();
      result.current.increment();
    });
    expect(result.current.count).toBe(12);
    
    act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(10);
  });
});
```

**Penjelasan:**

1. **`renderHook(() => useCounter())`**
   - Render hook di test environment
   - Return `result` object yang berisi hook values

2. **`result.current`**
   - Akses return value dari hook
   - `result.current.count` - Akses state
   - `result.current.increment()` - Call function

3. **`act(() => {})`**
   - Wrap function calls yang update state
   - Ensures React updates are processed
   - **PENTING:** Tanpa `act()`, test bisa fail

4. **Why `act()`?**
   ```typescript
   // ❌ SALAH - State update tidak ter-process
   result.current.increment();
   expect(result.current.count).toBe(1);  // Mungkin masih 0!
   
   // ✅ BENAR - State update ter-process dengan act()
   act(() => {
     result.current.increment();
   });
   expect(result.current.count).toBe(1);  // Pasti 1
   ```

---

### Pattern 3: Test dengan Context Provider

#### File: `src/context/AuthContext.tsx`

```typescript
"use client";

import { createContext, useContext, useState } from 'react';

type User = { id: string; name: string } | null;

const AuthContext = createContext<{
  user: User;
  login: (name: string) => void;
  logout: () => void;
} | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  
  const login = (name: string) => {
    setUser({ id: '1', name });
  };
  
  const logout = () => {
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

#### File: `src/context/__tests__/AuthContext.test.tsx`

```typescript
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthContext';

// Test component yang menggunakan useAuth
function TestComponent() {
  const { user, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="user-status">
        {user ? `Logged in as ${user.name}` : 'Not logged in'}
      </div>
      <button onClick={() => login('John')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  it('provides default state (not logged in)', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
  });

  it('allows user to login', async () => {
    const user = userEvent.setup();
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as John');
  });

  it('allows user to logout', async () => {
    const user = userEvent.setup();
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Login first
    await user.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as John');
    
    // Then logout
    await user.click(screen.getByRole('button', { name: /logout/i }));
    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
  });

  it('throws error when useAuth used outside provider', () => {
    // Suppress console.error untuk test ini
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    function ComponentWithoutProvider() {
      useAuth();  // Ini harus throw error
      return null;
    }
    
    expect(() => {
      render(<ComponentWithoutProvider />);
    }).toThrow('useAuth must be used within AuthProvider');
    
    consoleError.mockRestore();
  });
});
```

**Penjelasan:**

1. **Wrap dengan Provider**
   ```typescript
   render(
     <AuthProvider>      {/* ← Wrap dengan provider */}
       <TestComponent />
     </AuthProvider>
   );
   ```

2. **Test Component**
   - Buat component khusus untuk test
   - Component ini consume context

3. **Test Error Boundary**
   ```typescript
   jest.spyOn(console, 'error').mockImplementation(() => {});
   ```
   - Suppress console.error biar tidak muncul di test output
   - **Penting:** Restore dengan `mockRestore()` setelah test

---

### Pattern 4: Test Async Operations

#### File: `src/hooks/useFetchUser.ts`

```typescript
import { useState, useEffect } from 'react';

export function useFetchUser(userId: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);
  
  return { data, loading, error };
}
```

#### File: `src/hooks/__tests__/useFetchUser.test.ts`

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useFetchUser } from '../useFetchUser';

// Mock global fetch
global.fetch = jest.fn();

describe('useFetchUser', () => {
  beforeEach(() => {
    // Reset mock sebelum setiap test
    jest.clearAllMocks();
  });

  it('fetches user data successfully', async () => {
    // Setup mock response
    const mockUser = { id: '1', name: 'John' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockUser,
    });
    
    const { result } = renderHook(() => useFetchUser('1'));
    
    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    
    // Wait for async operation
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Check final state
    expect(result.current.data).toEqual(mockUser);
    expect(result.current.error).toBe(null);
  });

  it('handles fetch error', async () => {
    // Setup mock error
    const mockError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);
    
    const { result } = renderHook(() => useFetchUser('1'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBe(null);
  });
});
```

**Penjelasan:**

1. **Mock `fetch`**
   ```typescript
   global.fetch = jest.fn();
   ```
   - Mock global fetch function
   - Kontrol response yang dikembalikan

2. **`mockResolvedValueOnce()`**
   ```typescript
   (global.fetch as jest.Mock).mockResolvedValueOnce({
     json: async () => mockUser,
   });
   ```
   - Mock successful response
   - `Once` = hanya untuk 1 call berikutnya

3. **`mockRejectedValueOnce()`**
   ```typescript
   (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);
   ```
   - Mock error response

4. **`waitFor(() => {})`**
   ```typescript
   await waitFor(() => {
     expect(result.current.loading).toBe(false);
   });
   ```
   - Wait until condition is true
   - Untuk async operations
   - Retry sampai timeout (default 1s)

5. **`beforeEach(() => {})`**
   ```typescript
   beforeEach(() => {
     jest.clearAllMocks();
   });
   ```
   - Run sebelum setiap test
   - Reset mocks biar tidak interfere antar tests

---

## 🎨 Best Practices

### 1. **Test Naming**

```typescript
// ❌ BURUK - Tidak jelas
it('test 1', () => {});

// ✅ BAGUS - Descriptive
it('displays error message when login fails', () => {});
it('disables submit button when form is invalid', () => {});
```

### 2. **AAA Pattern**

```typescript
it('increments counter', () => {
  // ARRANGE - Setup
  const { result } = renderHook(() => useCounter());
  
  // ACT - Do something
  act(() => {
    result.current.increment();
  });
  
  // ASSERT - Verify result
  expect(result.current.count).toBe(1);
});
```

### 3. **Test One Thing**

```typescript
// ❌ BURUK - Test banyak hal sekaligus
it('handles login and logout and profile update', async () => {
  // ... terlalu banyak
});

// ✅ BAGUS - Satu test, satu hal
it('logs in user with valid credentials', async () => {});
it('logs out user', async () => {});
it('updates user profile', async () => {});
```

### 4. **Isolasi Tests**

```typescript
// ❌ BURUK - Tests depend on each other
let user;
it('creates user', () => {
  user = { id: 1, name: 'John' };
});
it('uses user', () => {
  expect(user.name).toBe('John');  // Depends on previous test!
});

// ✅ BAGUS - Independent tests
it('creates user', () => {
  const user = { id: 1, name: 'John' };
  expect(user).toBeDefined();
});
it('validates user name', () => {
  const user = { id: 1, name: 'John' };  // Create fresh data
  expect(user.name).toBe('John');
});
```

### 5. **Mock External Dependencies**

```typescript
// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  useSession: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));
```

---

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Watch mode (re-run on file changes)
npm run test:watch

# Coverage report
npm run test:coverage

# Run specific file
npm test LoginForm.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="login"
```

---

## 📊 Coverage Report

Setelah run `npm run test:coverage`, akan muncul tabel coverage:

```
File                  | % Stmts | % Branch | % Funcs | % Lines
----------------------|---------|----------|---------|--------
LoginForm.tsx         |     100 |      100 |     100 |     100
useToggle.ts          |     100 |      100 |     100 |     100
```

**Target Coverage:**
- ✅ **Minimal 50%** untuk production code
- ✅ **80-90%** untuk best practice
- ❌ **100%** tidak selalu necessary (diminishing returns)

---

## 🐛 Common Pitfalls

### 1. **Lupa `act()` untuk State Updates**

```typescript
// ❌ SALAH
const { result } = renderHook(() => useCounter());
result.current.increment();
expect(result.current.count).toBe(1);  // Might fail!

// ✅ BENAR
const { result } = renderHook(() => useCounter());
act(() => {
  result.current.increment();
});
expect(result.current.count).toBe(1);
```

### 2. **Lupa `async/await` untuk User Events**

```typescript
// ❌ SALAH
const user = userEvent.setup();
user.click(button);  // Lupa await!
expect(mockFn).toHaveBeenCalled();

// ✅ BENAR
const user = userEvent.setup();
await user.click(button);
expect(mockFn).toHaveBeenCalled();
```

### 3. **Lupa Clear Mocks**

```typescript
beforeEach(() => {
  jest.clearAllMocks();  // ✅ Always clear mocks
});
```

---

## ✅ Checklist

Sebelum commit code, pastikan:

- [ ] Semua tests passing (`npm test`)
- [ ] Coverage minimal 50% (`npm run test:coverage`)
- [ ] Test names descriptive
- [ ] No console errors (kecuali yang dimock)
- [ ] Mocks di-clear dengan `beforeEach`
- [ ] Async operations pakai `await`
- [ ] State updates wrapped dengan `act()`

---

## 🎓 Kesimpulan

**Unit testing itu seperti:**
- 🔍 Menguji setiap komponen mobil sebelum dirakit
- 📝 Dokumentasi yang bisa di-execute
- 🛡️ Safety net saat refactoring

**Remember:**
1. **Test behavior, not implementation** - Test apa yang user lihat/lakukan
2. **Keep tests simple** - Test harus mudah dibaca
3. **Test one thing** - Satu test, satu konsep
4. **Mock external dependencies** - Jangan hit real API/database

**Next Steps:**
- Practice dengan menulis tests untuk existing components
- Start dengan simple tests dulu
- Gradually increase coverage
- Learn from test failures

Happy Testing! 🚀
