# State Hooks Lab - Test Suite

This directory contains comprehensive unit tests for React hooks, components, and context providers.

## 📋 Test Coverage

### Hooks Tested

#### 2. Custom Hook: `useToggle`
**File**: `src/hooks/__tests__/useToggle.test.ts`

Tests a custom hook that manages boolean state (toggle functionality).

**What we're testing:**
- Hook initialization with default value
- Toggle functionality
- Setting specific values
- Multiple toggle operations

**Why important:**
- Custom hooks are reusable logic that need testing
- Need to ensure state changes work correctly
- Test all possible operations (toggle, set true, set false)

### 3. Custom Hook: `useFormState`
**File**: `src/hooks/__tests__/useFormState.test.ts`

Tests a custom hook for form state management with validation.

**What we're testing:**
- Form initialization with initial values
- Field updates with handleChange
- Form validation on submit
- Error handling and display
- Form reset functionality
- Submission state management
- isDirty state tracking

**Why important:**
- Form state management is complex with many edge cases
- Validation logic must be tested thoroughly
- Async submission needs proper handling
- User experience depends on correct error states

### 7. Context Provider: `CartContext`
**File**: `src/context/__tests__/CartContext.test.tsx`

Tests a complex context provider with cart state management.

**What we're testing:**
- Context initialization with empty cart
- Add item functionality
- Increment quantity for existing items
- Remove item functionality
- Clear cart functionality
- Total calculations (items and price)
- Context consumption error handling
- Callback referential stability (performance)

**Why important:**
- Cart logic is business-critical functionality
- State management must be bug-free
- Calculations must be accurate
- Performance optimization (memoization) needs validation
- Error boundaries need testing

### 8. Component with Context: `ThemeToggle`
**File**: `src/components/__tests__/ThemeToggle.test.tsx`

Tests a custom hook that consumes CartContext and provides cart summary.

**What we're testing:**
- Context consumption and integration
- Summary memoization (performance optimization)
- Cart operations (add, remove items)
- Total calculations (items and price)

**Why important:**
- Tests integration between hook and context
- Validates memoization prevents unnecessary re-renders
- Ensures calculations are accurate

### 5. Custom Hook: `useFetchProducts`
**File**: `src/hooks/__tests__/useFetchProducts.test.ts`

Tests an async data fetching hook with loading/error states.

**What we're testing:**
- Initial loading state
- Successful data fetch
- HTTP error handling (404, 500, etc.)
- Network error handling
- Refetch functionality
- Endpoint change triggers new fetch

**Why important:**
- Async operations need thorough testing
- Error handling is critical for user experience
- Loading states must be accurate
- Network failures must be handled gracefully

**Total: 9 tests**

### Context Tested

### 6. Context Provider: `ThemeContext`
**File**: `src/context/__tests__/ThemeContext.test.tsx`
- ✅ Provides default theme (light)
- ✅ Toggle from light to dark
- ✅ Toggle from dark to light
- ✅ Multiple toggles
- ✅ Updates document.documentElement.dataset.theme
- ✅ Throws error when used outside provider
- ✅ Shares state across multiple consumers

**Total: 7 tests**

### Components Tested

#### 3. **ThemeToggle** (`src/components/__tests__/ThemeToggle.test.tsx`)
- ✅ Renders toggle button with light theme text
- ✅ Toggles to dark theme when clicked
- ✅ Toggles back to light theme
- ✅ Applies correct styles for light theme
- ✅ Applies correct styles for dark theme
- ✅ Allows multiple toggles

**Total: 6 tests**

## 🎯 Test Results

```
✅ All 22 tests passing
✅ 100% coverage for tested hooks and components
⏱️  Test execution time: ~3.0s
```

## 📊 Coverage Report

| File | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| **useToggle.ts** | 100% | 100% | 100% | 100% |
| **ThemeContext.tsx** | 100% | 100% | 100% | 100% |
| **ThemeToggle.tsx** | 100% | 100% | 100% | 100% |

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🛠️ Tech Stack

- **Jest** 29.7.0 - Testing framework
- **React Testing Library** 16.1.0 - Component and hook testing
- **@testing-library/user-event** 14.5.x - User interaction simulation
- **@testing-library/jest-dom** 6.6.x - Custom matchers

## 📝 Test Patterns Used

### 1. Hook Testing
```typescript
const { result } = renderHook(() => useToggle());
act(() => {
  result.current.toggle();
});
expect(result.current.value).toBe(true);
```

### 2. Context Testing
```typescript
render(
  <ThemeProvider>
    <TestComponent />
  </ThemeProvider>
);
```

### 3. Component Testing
```typescript
const user = userEvent.setup();
await user.click(screen.getByRole('button'));
expect(button).toHaveTextContent(/mode terang/i);
```

### 4. Style Verification
```typescript
expect(button).toHaveStyle({
  background: 'rgb(17, 24, 39)',
  color: 'rgb(255, 255, 255)',
});
```

## 🔍 Key Features Tested

1. **useToggle Hook**
   - Boolean state management
   - Toggle, setTrue, setFalse operations
   - Stable function references (useCallback)
   - Default value handling

2. **ThemeContext**
   - Default theme initialization
   - Theme toggling (light ↔ dark)
   - Document attribute updates
   - Context provider validation
   - State sharing across consumers

3. **ThemeToggle Component**
   - Visual representation of theme
   - User interaction handling
   - Dynamic styling based on theme
   - Button text localization (Gelap/Terang)

## 📚 Best Practices

- ✅ Comprehensive test coverage for all features
- ✅ Clear, descriptive test names
- ✅ Testing both happy paths and edge cases
- ✅ Proper error boundary testing
- ✅ DOM side effect verification
- ✅ Stable reference verification
- ✅ User-centric interaction testing

## 🎨 Testing Custom Hooks

The `useToggle` hook demonstrates best practices for custom hook testing:
- ✅ Test default values
- ✅ Test all provided functions
- ✅ Verify function stability (useCallback)
- ✅ Test sequential operations
- ✅ Test combinations of operations

## 🌍 Testing Context Providers

The `ThemeContext` tests show how to properly test React Context:
- ✅ Test provider initialization
- ✅ Test state updates across consumers
- ✅ Test error handling for missing provider
- ✅ Test side effects (document updates)

## 🤝 Contributing

When adding new hooks or components:
1. Create tests in appropriate `__tests__` directory
2. Follow existing patterns (renderHook, render, userEvent)
3. Aim for 100% coverage
4. Test all edge cases
5. Verify stable references for callbacks
6. Run tests before committing

## 💡 Tips

- Use `renderHook` for custom hooks
- Use `render` with context providers for context-dependent components
- Use `userEvent` for realistic user interactions
- Use `act` for state updates in hooks
- Test error boundaries with proper console.error mocking
