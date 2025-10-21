# 04 - Writing Your First Test for Next.js Component

## 🎯 Tujuan Pembelajaran

Setelah mempelajari modul ini, Anda akan mampu:
- Menulis test pertama untuk React component
- Memahami struktur test yang baik
- Menggunakan queries dan assertions
- Follow best practices dalam testing

## 📝 Anatomy of a Test

Sebuah test yang baik memiliki struktur:

```typescript
describe('Component/Feature Name', () => {
  test('should do something specific', () => {
    // Arrange - Setup
    // Act - Do something
    // Assert - Verify result
  })
})
```

**3A Pattern: Arrange, Act, Assert**

```typescript
test('counter increments when button clicked', () => {
  // ARRANGE - Setup component dan dependencies
  render(<Counter initialValue={0} />)
  
  // ACT - Lakukan aksi
  const button = screen.getByRole('button', { name: /increment/i })
  fireEvent.click(button)
  
  // ASSERT - Verifikasi hasil
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

## 🧩 Example Component

Mari kita buat component sederhana dan test-nya:

### Component: Button

```typescript
// src/components/Button/Button.tsx
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({ 
  children, 
  onClick, 
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </button>
  )
}
```

### Test: Button

```typescript
// src/components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  // Test 1: Rendering
  test('renders button with text', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })
  
  // Test 2: Event handling
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  // Test 3: Props behavior
  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick} disabled>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })
  
  // Test 4: Disabled state
  test('applies disabled attribute when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
  
  // Test 5: Variants
  test('applies correct className for variant', () => {
    render(<Button variant="secondary">Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn-secondary')
  })
})
```

## 🔍 Understanding Queries

React Testing Library menyediakan berbagai query methods:

### Query Variants

```typescript
// getBy* - Returns element, throws error if not found
const button = screen.getByRole('button')

// queryBy* - Returns element or null, doesn't throw
const optional = screen.queryByText('Optional text')
if (optional) {
  // Do something
}

// findBy* - Returns promise, waits for element (async)
const async = await screen.findByText('Loaded data')

// getAllBy*, queryAllBy*, findAllBy* - For multiple elements
const items = screen.getAllByRole('listitem')
```

### Query Priority (Best to Worst)

```typescript
// 1. Accessible to everyone (BEST)
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email address')
screen.getByPlaceholderText('Enter your email')
screen.getByText('Welcome back')
screen.getByDisplayValue('John')

// 2. Semantic queries
screen.getByAltText('Company logo')
screen.getByTitle('Close dialog')

// 3. Test IDs (LAST RESORT)
screen.getByTestId('custom-element')
```

## 🎯 Example: Form Component

### Component: Login Form

```typescript
// src/components/LoginForm/LoginForm.tsx
import { useState } from 'react'

export function LoginForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('All fields are required')
      return
    }
    
    if (!email.includes('@')) {
      setError('Invalid email address')
      return
    }
    
    setError('')
    onSubmit({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} aria-label="login form">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>
      
      {error && <div role="alert">{error}</div>}
      
      <button type="submit">Login</button>
    </form>
  )
}
```

### Test: Login Form

```typescript
// src/components/LoginForm/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm Component', () => {
  // Test 1: Initial render
  test('renders login form with all fields', () => {
    render(<LoginForm onSubmit={jest.fn()} />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })
  
  // Test 2: User can type in fields
  test('allows users to type in email and password fields', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={jest.fn()} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })
  
  // Test 3: Validation - empty fields
  test('shows error when submitting empty form', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={jest.fn()} />)
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)
    
    expect(screen.getByRole('alert')).toHaveTextContent('All fields are required')
  })
  
  // Test 4: Validation - invalid email
  test('shows error for invalid email format', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={jest.fn()} />)
    
    await user.type(screen.getByLabelText(/email/i), 'invalidemail')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email address')
  })
  
  // Test 5: Successful submission
  test('calls onSubmit with form data when valid', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = jest.fn()
    render(<LoginForm onSubmit={mockOnSubmit} />)
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })
  
  // Test 6: Error clears on valid submission
  test('clears error message on successful submission', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={jest.fn()} />)
    
    // First submit empty to trigger error
    await user.click(screen.getByRole('button', { name: /login/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    
    // Then submit with valid data
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
```

## 🔥 fireEvent vs userEvent

### fireEvent (Basic)

```typescript
import { fireEvent } from '@testing-library/react'

// Basic click
fireEvent.click(button)

// Change input
fireEvent.change(input, { target: { value: 'new value' } })

// Submit form
fireEvent.submit(form)
```

### userEvent (Recommended)

```typescript
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()

// More realistic user interactions
await user.click(button)
await user.type(input, 'new value')
await user.clear(input)
await user.selectOptions(select, 'option1')
await user.upload(fileInput, file)
```

**userEvent advantages:**
- More realistic (triggers multiple events)
- Async by default (better for real scenarios)
- Follows actual user behavior

## 🧪 Common Jest Matchers for DOM

```typescript
// Presence
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()

// Visibility
expect(element).toBeVisible()
expect(element).not.toBeVisible()

// Enabled/Disabled
expect(element).toBeEnabled()
expect(element).toBeDisabled()

// Values
expect(input).toHaveValue('text')
expect(checkbox).toBeChecked()

// Text Content
expect(element).toHaveTextContent('Expected text')
expect(element).toContainHTML('<span>text</span>')

// Attributes
expect(element).toHaveAttribute('href', '/home')
expect(element).toHaveClass('btn-primary')
expect(element).toHaveStyle({ color: 'red' })

// Focus
expect(element).toHaveFocus()

// Form elements
expect(element).toHaveFormValues({ username: 'john' })
```

## 💡 Best Practices

### 1. Test User Behavior, Not Implementation

```typescript
// ❌ Bad
test('state updates correctly', () => {
  const { result } = renderHook(() => useCounter())
  act(() => result.current.increment())
  expect(result.current.count).toBe(1)
})

// ✅ Good
test('counter displays incremented value', () => {
  render(<Counter />)
  fireEvent.click(screen.getByRole('button', { name: /increment/i }))
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument()
})
```

### 2. Use Descriptive Test Names

```typescript
// ❌ Bad
test('it works', () => {})
test('test1', () => {})

// ✅ Good
test('displays error message when email is invalid', () => {})
test('disables submit button while form is submitting', () => {})
```

### 3. Keep Tests Isolated

```typescript
// ❌ Bad - Tests depend on each other
let user
beforeAll(() => {
  user = { name: 'John' }
})
test('test 1', () => {
  user.name = 'Jane' // Affects other tests!
})

// ✅ Good - Each test is independent
test('test 1', () => {
  const user = { name: 'John' }
  // Use user
})
```

### 4. Use Setup Functions When Needed

```typescript
describe('LoginForm', () => {
  function renderLoginForm(props = {}) {
    const defaultProps = {
      onSubmit: jest.fn(),
    }
    return render(<LoginForm {...defaultProps} {...props} />)
  }
  
  test('renders correctly', () => {
    renderLoginForm()
    // assertions
  })
  
  test('handles submit', () => {
    const mockSubmit = jest.fn()
    renderLoginForm({ onSubmit: mockSubmit })
    // test submit
  })
})
```

## 🎯 Exercise

Create a `Counter` component and write tests for it:

**Requirements:**
```typescript
// Counter should:
// - Display current count (starts at 0)
// - Have increment button
// - Have decrement button
// - Have reset button
// - Cannot go below 0
```

**Test Cases to Write:**
1. Renders with initial count of 0
2. Increments count when increment button clicked
3. Decrements count when decrement button clicked
4. Resets count to 0 when reset button clicked
5. Does not go below 0 when decrementing

Try it yourself before looking at the solution!

<details>
<summary>Solution</summary>

```typescript
// Counter.tsx
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  
  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => Math.max(0, c - 1))
  const reset = () => setCount(0)
  
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}

// Counter.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './Counter'

describe('Counter', () => {
  test('renders with initial count of 0', () => {
    render(<Counter />)
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })
  
  test('increments count when increment button clicked', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    
    await user.click(screen.getByRole('button', { name: /increment/i }))
    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })
  
  test('decrements count when decrement button clicked', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    
    // First increment to have something to decrement
    await user.click(screen.getByRole('button', { name: /increment/i }))
    await user.click(screen.getByRole('button', { name: /decrement/i }))
    
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })
  
  test('resets count to 0', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    
    await user.click(screen.getByRole('button', { name: /increment/i }))
    await user.click(screen.getByRole('button', { name: /increment/i }))
    await user.click(screen.getByRole('button', { name: /reset/i }))
    
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })
  
  test('does not go below 0', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    
    await user.click(screen.getByRole('button', { name: /decrement/i }))
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })
})
```
</details>

## 📚 Resources

- [React Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Jest Matchers](https://jestjs.io/docs/expect)
- [Which Query Should I Use?](https://testing-library.com/docs/queries/about#priority)

---

**Next:** [05 - Testing Events and User Interactions](./05-testing-events.md)
