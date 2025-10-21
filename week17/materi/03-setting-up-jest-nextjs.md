# 03 - Setting Up Jest in Next.js Project

## 🎯 Tujuan Pembelajaran

Setelah mempelajari modul ini, Anda akan mampu:
- Setup Jest di Next.js project dari scratch
- Konfigurasi Jest untuk TypeScript
- Setup React Testing Library
- Menjalankan test pertama kali

## 📦 Prerequisites

Pastikan Anda sudah memiliki:
- Node.js >= 18.17
- Next.js project (jika belum, buat dengan `npx create-next-app@latest`)
- Package manager (npm, yarn, atau pnpm)

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies

```bash
# Core testing dependencies
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom

# TypeScript support (jika menggunakan TypeScript)
npm install --save-dev @types/jest

# User event utilities (optional tapi recommended)
npm install --save-dev @testing-library/user-event
```

**Penjelasan packages:**
- `jest` - Testing framework utama
- `jest-environment-jsdom` - Simulasi browser environment untuk testing
- `@testing-library/react` - Utilities untuk testing React components
- `@testing-library/jest-dom` - Custom matchers untuk DOM testing
- `@testing-library/user-event` - Advanced user interaction simulation
- `@types/jest` - TypeScript definitions untuk Jest

### Step 2: Create Jest Configuration

Buat file `jest.config.js` atau `jest.config.mjs` di root project:

```javascript
// jest.config.mjs
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases (jika ada di tsconfig.json)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/_*.{js,jsx,ts,tsx}',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
```

**Penjelasan konfigurasi:**
- `coverageProvider: 'v8'` - Engine untuk code coverage (lebih cepat)
- `testEnvironment: 'jsdom'` - Simulasi browser environment
- `setupFilesAfterEnv` - File yang dijalankan sebelum tests
- `moduleNameMapper` - Mapping untuk path aliases
- `testMatch` - Pattern untuk file test
- `collectCoverageFrom` - Files yang di-include dalam coverage

### Step 3: Create Jest Setup File

Buat file `jest.setup.js` di root project:

```javascript
// jest.setup.js
import '@testing-library/jest-dom'

// Global test setup (jika diperlukan)
global.console = {
  ...console,
  // Uncomment to ignore specific console methods in tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
}

// Mock IntersectionObserver jika diperlukan
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
```

**Penjelasan setup:**
- Import jest-dom matchers
- Mock global APIs yang tidak ada di jsdom
- Setup global console untuk test environment

### Step 4: Add Test Scripts to package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Script commands:**
- `npm test` - Run all tests once
- `npm run test:watch` - Watch mode (re-run on file changes)
- `npm run test:coverage` - Run tests dengan coverage report

### Step 5: Update TypeScript Config (Jika menggunakan TypeScript)

Tambahkan di `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["jest", "@testing-library/jest-dom"],
    "jsx": "preserve"
  },
  "include": ["**/*.ts", "**/*.tsx", "jest.setup.js"],
  "exclude": ["node_modules"]
}
```

### Step 6: Folder Structure untuk Tests

Ada beberapa convention yang bisa digunakan:

#### Option 1: Co-located Tests (Recommended)
```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   └── Card/
│       ├── Card.tsx
│       ├── Card.test.tsx
│       └── index.ts
├── utils/
│   ├── formatDate.ts
│   └── formatDate.test.ts
```

**Keuntungan:**
- Tests dekat dengan code yang ditest
- Mudah menemukan tests
- Refactoring lebih mudah

#### Option 2: __tests__ Folder
```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── __tests__/
│   │   │   └── Button.test.tsx
│   │   └── index.ts
```

#### Option 3: Separate tests Folder
```
src/
├── components/
│   ├── Button.tsx
│   └── Card.tsx
tests/
├── components/
│   ├── Button.test.tsx
│   └── Card.test.tsx
```

## ✅ Verification: Test Your Setup

### Create a Simple Component

```typescript
// src/components/Welcome.tsx
export function Welcome({ name }: { name: string }) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>This is your first tested component.</p>
    </div>
  )
}
```

### Create Your First Test

```typescript
// src/components/Welcome.test.tsx
import { render, screen } from '@testing-library/react'
import { Welcome } from './Welcome'

describe('Welcome Component', () => {
  test('renders welcome message with name', () => {
    render(<Welcome name="John" />)
    
    expect(screen.getByText('Welcome, John!')).toBeInTheDocument()
  })
  
  test('renders description paragraph', () => {
    render(<Welcome name="John" />)
    
    expect(screen.getByText('This is your first tested component.'))
      .toBeInTheDocument()
  })
})
```

### Run Your Test

```bash
npm test
```

**Expected Output:**
```
 PASS  src/components/Welcome.test.tsx
  Welcome Component
    ✓ renders welcome message with name (23 ms)
    ✓ renders description paragraph (5 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        2.456 s
```

## 🔧 Troubleshooting Common Issues

### Issue 1: Cannot find module '@testing-library/jest-dom'

**Solution:**
```bash
npm install --save-dev @testing-library/jest-dom
```

Pastikan `jest.setup.js` sudah ada dan di-import di `jest.config.js`.

### Issue 2: SyntaxError: Cannot use import statement outside a module

**Solution:**
Pastikan `jest.config.js` menggunakan `next/jest`:

```javascript
import nextJest from 'next/jest.js'
const createJestConfig = nextJest({ dir: './' })
```

### Issue 3: Module path aliases not working

**Solution:**
Update `moduleNameMapper` di `jest.config.js`:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
  '^@/components/(.*)$': '<rootDir>/src/components/$1',
}
```

### Issue 4: Cannot find Next.js image component

**Solution:**
Mock Next.js components dalam `jest.setup.js`:

```javascript
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />
  },
}))
```

## 🎨 Advanced Configuration (Optional)

### Custom Test Matchers

```javascript
// jest.setup.js
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      }
    }
  },
})
```

### Global Test Utilities

```typescript
// src/utils/test-utils.tsx
import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Add providers here if needed (e.g., Redux, Context)
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

## 💡 Best Practices

1. ✅ **Nama file test:** Gunakan `.test.tsx` atau `.spec.tsx`
2. ✅ **Co-locate tests:** Simpan test dekat dengan component
3. ✅ **Import dari test-utils:** Jika ada custom render
4. ✅ **Use TypeScript:** Untuk type safety di tests
5. ✅ **Setup once:** Buat reusable test utilities

## 🎯 Quick Checklist

Sebelum melanjutkan ke modul berikutnya, pastikan:

- [ ] Jest dan RTL terinstall
- [ ] `jest.config.js` sudah dibuat dan dikonfigurasi
- [ ] `jest.setup.js` sudah dibuat
- [ ] Test scripts sudah ditambahkan di `package.json`
- [ ] Test pertama berhasil dijalankan dengan `npm test`
- [ ] Coverage report bisa di-generate dengan `npm run test:coverage`

## 📚 Resources

- [Next.js Testing Documentation](https://nextjs.org/docs/testing#jest-and-react-testing-library)
- [Jest Configuration Options](https://jestjs.io/docs/configuration)
- [Setting up Jest with Next.js](https://nextjs.org/docs/pages/building-your-application/testing/jest)

---

**Next:** [04 - Writing Your First Test](./04-writing-first-test.md)
