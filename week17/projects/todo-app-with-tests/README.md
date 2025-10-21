# Todo App with Comprehensive Testing

Project lengkap Todo Application dengan comprehensive test coverage, demonstrating real-world testing scenarios.

## 🎯 Features

- ✅ Add new todos
- ✅ Mark todos as complete/incomplete
- ✅ Delete todos
- ✅ Filter todos (All/Active/Completed)
- ✅ Clear completed todos
- ✅ Persist todos to localStorage
- ✅ 85%+ test coverage

## 📁 Project Structure

```
todo-app-with-tests/
├── src/
│   ├── components/
│   │   ├── TodoApp/
│   │   │   ├── TodoApp.tsx
│   │   │   └── TodoApp.test.tsx
│   │   ├── TodoItem/
│   │   │   ├── TodoItem.tsx
│   │   │   └── TodoItem.test.tsx
│   │   └── TodoForm/
│   │       ├── TodoForm.tsx
│   │       └── TodoForm.test.tsx
│   ├── hooks/
│   │   └── useTodos.ts
│   ├── lib/
│   │   ├── storage.ts
│   │   └── storage.test.ts
│   └── types/
│       └── todo.ts
├── jest.config.mjs
├── jest.setup.js
├── next.config.mjs
├── tsconfig.json
├── .husky/
└── package.json
```

## 🚀 Getting Started

### Installation

```bash
npm install
npx husky install
```

### Run Development

```bash
npm run dev
```

### Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Husky Hooks

Pastikan hook aktif setelah install dependencies:

```bash
npx husky install
```

Default hook `pre-commit` akan menjalankan `npm run lint` dan `npm test`. Ubah skrip di `.husky/pre-commit` bila ingin menambahkan pengecekan lain (misalnya `npm run test:coverage`).

## 🧪 Testing Coverage

### What's Tested

#### 1. Components
- **TodoApp** (Main component)
  - Renders initial empty state
  - Adding new todos
  - Filtering todos
  - Clearing completed todos
  - Persisting state

- **TodoItem**
  - Displays todo text
  - Toggle complete status
  - Delete todo
  - Accessibility features

- **TodoForm**
  - Input validation
  - Form submission
  - Clear input after submit
  - Disabled state handling

#### 2. Custom Hooks
- **useTodos**
  - Add todo
  - Toggle todo
  - Delete todo
  - Filter todos
  - Clear completed
  - LocalStorage integration

#### 3. Utilities (`lib`)
- **storage**
  - Save to localStorage
  - Load from localStorage
  - Handle errors gracefully
  - Clear storage

### Coverage Report

```bash
npm run test:coverage

# Expected output:
---------------------------|---------|----------|---------|---------|
File                       | % Stmts | % Branch | % Funcs | % Lines |
---------------------------|---------|----------|---------|---------|
All files                  |   87.5  |    85.71 |   90.47 |   87.5  |
 components/TodoApp        |   92.85 |    91.66 |   95.23 |   92.85 |
 components/TodoItem       |   88.23 |    87.5  |   90.0  |   88.23 |
 components/TodoForm       |   94.11 |    93.75 |   100   |   94.11 |
 hooks                     |   85.0  |    80.0  |   88.88 |   85.0  |
 lib                       |   75.0  |    70.83 |   80.0  |   75.0  |
---------------------------|---------|----------|---------|---------|
```

## 📚 Key Learning Points

### 1. Component Testing

```typescript
// Testing user interactions
test('adds new todo when form is submitted', async () => {
  const user = userEvent.setup()
  render(<TodoApp />)
  
  const input = screen.getByPlaceholderText('What needs to be done?')
  await user.type(input, 'Buy groceries')
  await user.keyboard('{Enter}')
  
  expect(screen.getByText('Buy groceries')).toBeInTheDocument()
})
```

### 2. Custom Hook Testing

```typescript
// Testing custom hooks with renderHook
test('toggles todo completion status', () => {
  const { result } = renderHook(() => useTodos())
  
  act(() => {
    result.current.addTodo('Test todo')
  })
  
  const todoId = result.current.todos[0].id
  
  act(() => {
    result.current.toggleTodo(todoId)
  })
  
  expect(result.current.todos[0].completed).toBe(true)
})
```

### 3. LocalStorage Mocking

```typescript
// Mocking localStorage for tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}

global.localStorage = localStorageMock as any
```

### 4. Async Operations Testing

```typescript
// Testing async state updates
test('filters todos correctly', async () => {
  render(<TodoApp />)
  
  // Add todos
  await addTodo('Active todo')
  await addTodo('Completed todo')
  
  // Toggle one
  const checkbox = screen.getAllByRole('checkbox')[1]
  await user.click(checkbox)
  
  // Filter
  await user.click(screen.getByText('Active'))
  
  await waitFor(() => {
    expect(screen.getByText('Active todo')).toBeInTheDocument()
    expect(screen.queryByText('Completed todo')).not.toBeInTheDocument()
  })
})
```

## 🎯 Test Scenarios Covered

### Happy Paths
- ✅ User can add todos
- ✅ User can complete todos
- ✅ User can delete todos
- ✅ User can filter todos
- ✅ User can clear completed todos

### Edge Cases
- ✅ Empty input validation
- ✅ Duplicate todo handling
- ✅ LocalStorage unavailable
- ✅ Maximum todo length
- ✅ Special characters in todo text

### Error Handling
- ✅ localStorage quota exceeded
- ✅ Invalid JSON in localStorage
- ✅ Missing required props
- ✅ Invalid todo ID

### Accessibility
- ✅ Keyboard navigation
- ✅ Screen reader labels
- ✅ Focus management
- ✅ ARIA attributes

## 🏆 Best Practices Demonstrated

### 1. Test Organization
```typescript
describe('TodoApp', () => {
  describe('Adding Todos', () => {
    test('adds todo with valid input', () => {})
    test('prevents adding empty todos', () => {})
  })
  
  describe('Filtering Todos', () => {
    test('filters active todos', () => {})
    test('filters completed todos', () => {})
  })
})
```

### 2. Setup Functions
```typescript
function renderTodoApp(props = {}) {
  return render(<TodoApp {...props} />)
}

async function addTodo(text: string) {
  const user = userEvent.setup()
  const input = screen.getByPlaceholderText('What needs to be done?')
  await user.type(input, text)
  await user.keyboard('{Enter}')
}
```

### 3. Test Data Factories
```typescript
const createMockTodo = (overrides = {}): Todo => ({
  id: '1',
  text: 'Test todo',
  completed: false,
  createdAt: new Date().toISOString(),
  ...overrides,
})
```

### 4. Descriptive Test Names
```typescript
test('displays error message when trying to add empty todo', () => {})
test('persists todos to localStorage after each change', () => {})
test('clears input field after successfully adding todo', () => {})
```

## 🔍 Running Specific Tests

```bash
# Run tests for specific file
npm test TodoApp.test

# Run tests matching pattern
npm test --testNamePattern="adds todo"

# Run only changed tests
npm test --onlyChanged

# Update snapshots
npm test -- -u
```

## 📖 Learning Exercises

### Exercise 1: Add Edit Functionality
1. Add edit button to TodoItem
2. Implement edit mode with input
3. Save changes or cancel
4. Write tests for all scenarios

### Exercise 2: Add Due Dates
1. Add optional due date to todos
2. Display due date in TodoItem
3. Highlight overdue todos
4. Test date formatting and sorting

### Exercise 3: Add Categories
1. Add category/tag system
2. Filter by category
3. Display category badges
4. Test category functionality

## 🎓 Key Takeaways

1. ✅ **Component testing** - Test user behavior, not implementation
2. ✅ **Hook testing** - Use `renderHook` and `act` properly
3. ✅ **Mocking** - Mock external dependencies (localStorage, APIs)
4. ✅ **Async testing** - Use `waitFor` for async updates
5. ✅ **Coverage** - Aim for 80%+ on critical paths
6. ✅ **Organization** - Group related tests logically
7. ✅ **Accessibility** - Test keyboard and screen reader support

## 📚 Resources

- [Testing React Components](https://react.dev/learn/testing)
- [React Testing Library Examples](https://testing-library.com/docs/react-testing-library/example-intro)
- [Jest Mock Functions](https://jestjs.io/docs/mock-functions)

---

**Happy Testing!** 🎉
