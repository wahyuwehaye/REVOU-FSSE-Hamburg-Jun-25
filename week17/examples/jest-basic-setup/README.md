# Jest Basic Setup - Example Project

Contoh minimal setup Jest + React Testing Library di Next.js project.

## 🎯 Tujuan

Project ini mendemonstrasikan:
- Setup Jest dari scratch
- Konfigurasi minimal yang diperlukan
- Test pertama untuk simple component
- Running tests dan melihat results

## 📁 Struktur Project

```
jest-basic-setup/
├── src/
│   ├── components/
│   │   ├── Welcome.tsx
│   │   └── Welcome.test.tsx
│   └── utils/
│       ├── math.ts
│       └── math.test.ts
├── jest.config.mjs
├── jest.setup.js
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

## 📚 What's Included

### Component Test Example

`src/components/Welcome.tsx` - Simple welcome component

`src/components/Welcome.test.tsx` - Basic component test dengan:
- Rendering test
- Props handling test
- Text content verification

### Utility Function Test Example

`src/utils/math.ts` - Simple math utilities

`src/utils/math.test.ts` - Unit tests untuk pure functions:
- Addition
- Multiplication
- Division dengan edge cases

## 🔍 Key Files Explained

### jest.config.mjs

```javascript
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}

export default createJestConfig(config)
```

**Key points:**
- Uses `next/jest` for Next.js compatibility
- jsdom environment for React testing
- Setup file for jest-dom matchers

### jest.setup.js

```javascript
import '@testing-library/jest-dom'
```

**Purpose:**
- Adds custom matchers like `toBeInTheDocument()`
- Setup runs before each test file

### package.json scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## ✅ Expected Test Results

```bash
npm test

# Output:
 PASS  src/components/Welcome.test.tsx
  Welcome Component
    ✓ renders welcome message (20ms)
    ✓ displays user name (5ms)

 PASS  src/utils/math.test.ts
  Math Utilities
    ✓ adds two numbers (2ms)
    ✓ multiplies two numbers (1ms)
    ✓ divides two numbers (1ms)
    ✓ handles division by zero (2ms)

Test Suites: 2 passed, 2 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        2.5s
```

## 🎓 Learning Points

### 1. Component Testing Pattern

```typescript
// Arrange
render(<Component />)

// Act
const element = screen.getByRole('heading')

// Assert
expect(element).toHaveTextContent('Expected text')
```

### 2. Testing Pure Functions

```typescript
test('function name describes behavior', () => {
  expect(add(2, 3)).toBe(5)
})
```

### 3. Edge Cases

```typescript
test('handles edge case properly', () => {
  expect(divide(10, 0)).toBe(Infinity)
})
```

## 🔧 Troubleshooting

### Tests not running?

```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Cannot find module errors?

Check `tsconfig.json` includes test files:
```json
{
  "include": ["**/*.ts", "**/*.tsx", "jest.setup.js"]
}
```

## 📖 Next Steps

After understanding this basic setup:

1. ✅ Run tests successfully
2. ✅ Understand jest.config.mjs settings
3. ✅ Modify tests and see them pass/fail
4. ✅ Add your own component and test

**Continue to:**
- `component-testing-demo/` - More complex component examples
- `async-testing-demo/` - Testing async operations

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)

---

Happy Testing! 🎉
