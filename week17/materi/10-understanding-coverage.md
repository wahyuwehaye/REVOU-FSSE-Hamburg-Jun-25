# 10 - Understanding Test Coverage

## 🎯 Tujuan Pembelajaran

Setelah mempelajari modul ini, Anda akan mampu:
- Memahami apa itu test coverage
- Membaca dan menginterpretasi coverage reports
- Menentukan target coverage yang realistis
- Mengidentifikasi area yang perlu testing

## 📊 Apa itu Test Coverage?

**Test Coverage** adalah metric yang mengukur seberapa banyak code Anda yang dijalankan ketika tests berjalan.

### Analogi Sederhana

Bayangkan rumah Anda sebagai codebase:
- **100% coverage** = Semua ruangan sudah dicek
- **80% coverage** = 8 dari 10 ruangan sudah dicek, 2 belum
- **50% coverage** = Setengah rumah belum dicek sama sekali

### 4 Metrics Coverage

```typescript
// Example function
function calculateDiscount(price: number, coupon?: string): number {
  if (coupon === 'SAVE10') {           // Line 2
    return price * 0.9                  // Line 3
  } else if (coupon === 'SAVE20') {     // Line 4
    return price * 0.8                  // Line 5
  }
  return price                          // Line 7
}
```

#### 1. **Line Coverage (Statement Coverage)**
Berapa % lines yang dieksekusi?

```typescript
// Test 1: No coupon
test('no discount without coupon', () => {
  expect(calculateDiscount(100)).toBe(100)
})

// Lines executed: 2, 4, 7
// Line coverage: 3/5 = 60%
```

#### 2. **Branch Coverage**
Berapa % decision branches yang ditest?

```typescript
// Branches:
// 1. coupon === 'SAVE10' (true)
// 2. coupon === 'SAVE10' (false)
// 3. coupon === 'SAVE20' (true)
// 4. coupon === 'SAVE20' (false)

// Test 1 covers: branch 2, 4
// Branch coverage: 2/4 = 50%
```

#### 3. **Function Coverage**
Berapa % functions yang dipanggil?

```typescript
// If calculateDiscount is called at least once = 100% function coverage
```

#### 4. **Lines Coverage**
Mirip dengan statement coverage tapi lebih fokus pada physical lines.

## 🔍 Membaca Coverage Report

### Generate Coverage Report

```bash
npm run test:coverage
```

### Output Example

```
---------------------------|---------|----------|---------|---------|-------------------
File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------------|---------|----------|---------|---------|-------------------
All files                  |   78.26 |    68.75 |   83.33 |   78.26 |
 src/components            |   85.71 |       75 |     100 |   85.71 |
  Button.tsx               |     100 |      100 |     100 |     100 |
  Card.tsx                 |      80 |       75 |     100 |      80 | 15-17
 src/utils                 |   66.66 |    62.5  |   66.66 |   66.66 |
  formatDate.ts            |      50 |       50 |      50 |      50 | 8-12
  validation.ts            |      80 |       75 |      80 |      80 | 25-30
---------------------------|---------|----------|---------|---------|-------------------
```

### Interpretasi

**Button.tsx (100% coverage)** ✅
- Sempurna! Semua code paths sudah ditest

**Card.tsx (80% coverage)** ⚠️
- Lines 15-17 belum ditest
- Perlu test tambahan untuk cover lines tersebut

**formatDate.ts (50% coverage)** ❌
- Hanya setengah yang ditest
- Lines 8-12 belum covered
- High priority untuk ditambah tests

## 🎨 Visual Coverage Report

Jest juga generate HTML report:

```bash
npm run test:coverage
# Opens: coverage/lcov-report/index.html
```

**HTML Report Features:**
- Interactive file browser
- Line-by-line coverage visualization
- Red = Uncovered
- Green = Covered
- Yellow = Partially covered (branches)

## 🎯 Berapa Coverage yang "Baik"?

### Industry Standards

```
🔴 <60%  - Poor (High risk)
🟡 60-80% - Acceptable (Medium risk)
🟢 80-90% - Good (Low risk)
🔵 >90%  - Excellent (Very low risk)
```

### Context Matters!

**Critical Code → Higher Coverage**
```typescript
// Payment processing - Aim for 95%+
function processPayment(amount: number, cardInfo: CardInfo) {
  // Must be thoroughly tested!
}
```

**UI Presentation → Lower Coverage OK**
```typescript
// Simple presentational component - 70% might be OK
function UserAvatar({ url, name }: AvatarProps) {
  return <img src={url} alt={name} />
}
```

### Recommended Targets by Code Type

| Code Type | Target Coverage | Reason |
|-----------|----------------|---------|
| Business Logic | 90-100% | Critical, complex |
| API Integrations | 85-95% | Many edge cases |
| Utils/Helpers | 80-90% | Reused everywhere |
| React Components | 70-85% | Balance effort/value |
| UI Styling | 50-70% | Visual, less logic |

## ⚠️ Coverage Bukan Segalanya!

### 100% Coverage ≠ Bug Free

```typescript
// 100% coverage, tapi test buruk!
function divide(a: number, b: number): number {
  return a / b
}

test('divide works', () => {
  expect(divide(10, 2)).toBe(5) // ✅ Passes
  // Missing: divide by zero case! ❌
})

// Coverage: 100%
// Bug: divide(10, 0) = Infinity (not handled!)
```

### Quality > Quantity

```typescript
// ❌ High coverage, low value
test('button exists', () => {
  render(<Button />)
  expect(screen.getByRole('button')).toBeInTheDocument()
})

// ✅ Lower coverage, high value
test('clicking button submits form with correct data', async () => {
  render(<Form />)
  await userEvent.type(screen.getByLabelText('Email'), 'test@test.com')
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))
  expect(mockApi).toHaveBeenCalledWith({ email: 'test@test.com' })
})
```

## 🔧 Improving Coverage

### Step 1: Identify Uncovered Code

```bash
npm run test:coverage

# Look for:
# - Low % Branch (missing if/else cases)
# - Low % Lines (uncovered code paths)
# - Uncovered Line #s (specific lines to test)
```

### Step 2: Analyze Why It's Uncovered

```typescript
// src/utils/validation.ts
export function validateEmail(email: string): boolean {
  if (!email) return false                    // Line 2 ✅ Covered
  if (!email.includes('@')) return false      // Line 3 ⚠️ Partially covered
  if (!email.includes('.')) return false      // Line 4 ❌ Not covered
  return true                                 // Line 5 ✅ Covered
}

// Current test
test('validates email', () => {
  expect(validateEmail('test@example.com')).toBe(true)   // Covers: 2, 3, 5
  expect(validateEmail('')).toBe(false)                  // Covers: 2
})

// Line 3 false branch not covered
// Line 4 never reached
```

### Step 3: Add Missing Tests

```typescript
// Add tests for uncovered paths
test('rejects email without @', () => {
  expect(validateEmail('testexample.com')).toBe(false)  // Covers line 3 false
})

test('rejects email without dot', () => {
  expect(validateEmail('test@examplecom')).toBe(false)  // Covers line 4
})
```

### Step 4: Verify Improvement

```bash
npm run test:coverage

# Before:
# validateEmail.ts | 60% | 50% | 100% | 60% | 4
# After:
# validateEmail.ts | 100% | 100% | 100% | 100% |
```

## 📈 Coverage Strategies

### Strategy 1: Start with Critical Paths

```typescript
// 1. Test happy path first
test('user can complete checkout', async () => {
  // Main flow
})

// 2. Then test error cases
test('shows error when payment fails', async () => {
  // Error handling
})

// 3. Finally edge cases
test('handles network timeout during checkout', async () => {
  // Edge cases
})
```

### Strategy 2: Test Complex Logic First

Focus on code with:
- Multiple conditions
- Loops
- Nested logic
- Complex calculations

```typescript
// High priority for testing
function calculateShippingCost(
  weight: number,
  distance: number,
  isPriority: boolean,
  coupon?: string
): number {
  // Multiple conditions = high priority
  let cost = weight * distance * 0.1
  
  if (isPriority) {
    cost *= 1.5
  }
  
  if (coupon === 'FREESHIP') {
    cost = 0
  } else if (coupon === 'HALF') {
    cost *= 0.5
  }
  
  return cost
}
```

### Strategy 3: Incremental Improvement

```bash
# Set realistic incremental goals
Week 1: 60% → 65%
Week 2: 65% → 70%
Week 3: 70% → 75%
Week 4: 75% → 80%
```

## 🎯 Configuration: Coverage Thresholds

Enforce minimum coverage dalam `jest.config.js`:

```javascript
// jest.config.js
export default {
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80
    },
    './src/utils/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    './src/components/Button/': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}
```

**Test akan FAIL jika threshold tidak tercapai!**

```bash
npm test

# Output jika gagal:
❌ Jest: "global" coverage threshold for branches (70%) not met: 65%
```

## 💡 Best Practices

### 1. Focus on Behavior, Not Coverage

```typescript
// ❌ Testing just for coverage
test('function exists', () => {
  expect(myFunction).toBeDefined()
})

// ✅ Testing actual behavior
test('function returns correct result for valid input', () => {
  expect(myFunction('valid')).toBe('expected')
})
```

### 2. Don't Ignore Low-Hanging Fruit

```typescript
// Easy wins: Pure functions, utils
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

// Quick to test, high value
test('formats currency correctly', () => {
  expect(formatCurrency(10)).toBe('$10.00')
  expect(formatCurrency(10.5)).toBe('$10.50')
  expect(formatCurrency(10.999)).toBe('$11.00')
})
```

### 3. Review Coverage Regularly

```bash
# Add to CI/CD pipeline
npm run test:coverage

# Review in PR reviews
# Track trends over time
# Discuss as a team
```

### 4. Balance Cost vs Benefit

```typescript
// High cost, low benefit (skip)
test('renders with exact CSS classes', () => {
  // Implementation detail, brittle
})

// Low cost, high benefit (prioritize)
test('form submits with correct data', () => {
  // User behavior, valuable
})
```

## 🎯 Exercise

1. Generate coverage report untuk project Anda:
   ```bash
   npm run test:coverage
   ```

2. Analisis hasil:
   - File mana yang coverage-nya < 70%?
   - Lines mana yang belum covered?
   - Branch mana yang missing?

3. Tambahkan 2-3 tests untuk improve coverage

4. Re-run coverage dan compare sebelum/sesudah

## 📚 Resources

- [Jest Coverage Configuration](https://jestjs.io/docs/configuration#collectcoverage-boolean)
- [Istanbul Coverage Tool](https://istanbul.js.org/)
- [Code Coverage Best Practices](https://martinfowler.com/bliki/TestCoverage.html)

---

**Next:** [11 - Implementing Coverage Reports](./11-coverage-reports.md)
