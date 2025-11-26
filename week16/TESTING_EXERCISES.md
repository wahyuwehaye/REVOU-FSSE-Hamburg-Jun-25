# 🎯 Interactive Testing Exercises & Challenges

Latihan hands-on untuk meningkatkan skill testing! Mulai dari level beginner sampai advanced.

---

## 📚 Level 1: Beginner (Warm Up)

### Exercise 1.1: Simple Counter Test ⭐
**Goal:** Test basic useState hook

**Your Task:**
Buat tests untuk hook ini:

```typescript
// src/hooks/useCounter.ts
export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  
  return { count, increment, decrement };
}
```

**Requirements:**
- [ ] Test default initialization (0)
- [ ] Test custom initialization
- [ ] Test increment function
- [ ] Test decrement function
- [ ] Test multiple increments

**Time:** 15 minutes  
**Difficulty:** ⭐ Easy

<details>
<summary>💡 Hint</summary>

Use `renderHook` from `@testing-library/react` and wrap state updates with `act()`.

</details>

<details>
<summary>✅ Solution</summary>

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../useCounter';

describe('useCounter', () => {
  it('initializes with default value 0', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });

  it('handles multiple increments', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.increment();
    });
    
    expect(result.current.count).toBe(3);
  });
});
```

</details>

---

### Exercise 1.2: Button Component Test ⭐
**Goal:** Test simple component rendering and interaction

**Your Task:**
Buat tests untuk component ini:

```typescript
// src/components/Button.tsx
export function Button({ 
  label, 
  onClick, 
  disabled = false 
}: { 
  label: string; 
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

**Requirements:**
- [ ] Test renders with correct label
- [ ] Test calls onClick when clicked
- [ ] Test disabled state prevents click
- [ ] Test button has correct role

**Time:** 20 minutes  
**Difficulty:** ⭐ Easy

<details>
<summary>💡 Hint</summary>

Use `render`, `screen`, and `userEvent`. Check `toBeDisabled()` matcher for disabled state.

</details>

<details>
<summary>✅ Solution</summary>

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button label="Click me" onClick={mockOnClick} />);
    
    await user.click(screen.getByRole('button'));
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button label="Click me" onClick={mockOnClick} disabled />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    await user.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
```

</details>

---

## 📚 Level 2: Intermediate (Getting Serious)

### Exercise 2.1: Form Validation ⭐⭐
**Goal:** Test form with validation

**Your Task:**
Buat tests untuk component ini:

```typescript
// src/components/LoginForm.tsx
export function LoginForm({ onSubmit }: { onSubmit: (data: { email: string; password: string }) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = { email: '', password: '' };
    
    if (!email.includes('@')) {
      newErrors.email = 'Invalid email';
    }
    
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    
    if (!newErrors.email && !newErrors.password) {
      onSubmit({ email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <span role="alert">{errors.email}</span>}
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && <span role="alert">{errors.password}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
}
```

**Requirements:**
- [ ] Test renders all form fields
- [ ] Test shows email validation error
- [ ] Test shows password validation error
- [ ] Test calls onSubmit with valid data
- [ ] Test does not call onSubmit with invalid data

**Time:** 30 minutes  
**Difficulty:** ⭐⭐ Medium

<details>
<summary>💡 Hint</summary>

Use `user.type()` for input fields. Check for error messages with `getByRole('alert')`. Remember to `await` user events!

</details>

---

### Exercise 2.2: Async Data Fetching ⭐⭐
**Goal:** Test hook that fetches data

**Your Task:**
Buat tests untuk hook ini:

```typescript
// src/hooks/useFetchUser.ts
export function useFetchUser(userId: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    
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

**Requirements:**
- [ ] Test initial state (loading true, data null)
- [ ] Test successful fetch
- [ ] Test error handling
- [ ] Test loading state transitions
- [ ] Test re-fetches when userId changes

**Time:** 40 minutes  
**Difficulty:** ⭐⭐ Medium

<details>
<summary>💡 Hint</summary>

Mock `global.fetch`. Use `waitFor` for async operations. Use `rerender` to test userId changes.

</details>

---

## 📚 Level 3: Advanced (Pro Level)

### Exercise 3.1: Context with Complex State ⭐⭐⭐
**Goal:** Test context with reducer and async operations

**Your Task:**
Buat tests untuk context ini:

```typescript
// src/context/CartContext.tsx
type CartItem = { id: string; name: string; quantity: number; price: number };
type CartState = { items: CartItem[]; total: number };
type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          total: state.total + (action.payload.price * action.payload.quantity)
        };
      }
      
      return {
        items: [...state.items, action.payload],
        total: state.total + (action.payload.price * action.payload.quantity)
      };
    }
    
    case 'REMOVE_ITEM': {
      const item = state.items.find(item => item.id === action.payload);
      return {
        items: state.items.filter(item => item.id !== action.payload),
        total: item ? state.total - (item.price * item.quantity) : state.total
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.payload.id);
      if (!item) return state;
      
      const oldTotal = item.price * item.quantity;
      const newTotal = item.price * action.payload.quantity;
      
      return {
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total - oldTotal + newTotal
      };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0 };
      
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
```

**Requirements:**
- [ ] Test adding item to empty cart
- [ ] Test adding duplicate item (should increase quantity)
- [ ] Test removing item
- [ ] Test updating quantity
- [ ] Test clearing cart
- [ ] Test total calculation for all operations
- [ ] Test multiple operations in sequence

**Time:** 60 minutes  
**Difficulty:** ⭐⭐⭐ Hard

<details>
<summary>💡 Hint</summary>

Create test component to access context. Test reducer logic thoroughly. Verify both state and total after each operation.

</details>

---

### Exercise 3.2: Integration Test ⭐⭐⭐
**Goal:** Test complete user flow

**Your Task:**
Test full login → dashboard flow:

```typescript
// Scenario:
// 1. User lands on login page
// 2. Enters invalid credentials → sees error
// 3. Enters valid credentials → redirected to dashboard
// 4. Dashboard shows user name
// 5. User logs out → back to login page
```

**Requirements:**
- [ ] Mock next-auth signIn function
- [ ] Mock useRouter for navigation
- [ ] Test entire flow end-to-end
- [ ] Verify state at each step
- [ ] Test error recovery

**Time:** 90 minutes  
**Difficulty:** ⭐⭐⭐ Hard

---

## 🎯 Challenge: Bugs to Fix

### Bug Hunt 1: Missing act() Warning 🐛
**Code:**
```typescript
it('increments counter', () => {
  const { result } = renderHook(() => useCounter());
  result.current.increment();  // ⚠️ Act warning!
  expect(result.current.count).toBe(1);
});
```

**Task:** Fix the warning

<details>
<summary>✅ Solution</summary>

```typescript
it('increments counter', () => {
  const { result } = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();  // ✅ Wrapped in act()
  });
  
  expect(result.current.count).toBe(1);
});
```

</details>

---

### Bug Hunt 2: Async Test Failing 🐛
**Code:**
```typescript
it('fetches user data', () => {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({ name: 'John' })
  });
  
  const { result } = renderHook(() => useFetchUser('1'));
  
  expect(result.current.data).toEqual({ name: 'John' });  // ❌ Fails!
});
```

**Task:** Why does this fail? Fix it!

<details>
<summary>✅ Solution</summary>

```typescript
it('fetches user data', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({ name: 'John' })
  });
  
  const { result } = renderHook(() => useFetchUser('1'));
  
  // Need to wait for async operation!
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  
  expect(result.current.data).toEqual({ name: 'John' });
});
```

**Explanation:** The fetch is async, so we need to wait for it to complete before checking the data.

</details>

---

### Bug Hunt 3: Element Not Found 🐛
**Code:**
```typescript
it('shows error message', async () => {
  render(<LoginForm onSubmit={jest.fn()} />);
  
  const user = userEvent.setup();
  await user.click(screen.getByText('Login'));
  
  expect(screen.getByText('Invalid email')).toBeInTheDocument();  // ❌ Not found!
});
```

**Task:** Why can't it find the error message?

<details>
<summary>✅ Solution</summary>

```typescript
it('shows error message', async () => {
  render(<LoginForm onSubmit={jest.fn()} />);
  
  const user = userEvent.setup();
  
  // Need to submit form with invalid data first!
  await user.type(screen.getByPlaceholderText('Email'), 'invalid');
  await user.type(screen.getByPlaceholderText('Password'), 'short');
  await user.click(screen.getByRole('button', { name: /login/i }));
  
  expect(screen.getByText('Invalid email')).toBeInTheDocument();
});
```

**Explanation:** Error message only appears AFTER form submission with invalid data.

</details>

---

## 🏆 Mini Projects

### Project 1: Todo App Testing 🎯
**Goal:** Write complete test suite for Todo app

**Features to Test:**
- Add todo
- Toggle todo complete
- Delete todo
- Filter todos (all/active/completed)
- Clear completed todos
- Edit todo

**Target Coverage:** 80%+

**Time:** 2-3 hours

---

### Project 2: Shopping Cart Testing 🛒
**Goal:** Test e-commerce cart functionality

**Features to Test:**
- Add product to cart
- Update quantity
- Remove from cart
- Calculate total
- Apply discount code
- Checkout flow

**Target Coverage:** 80%+

**Time:** 3-4 hours

---

## 📊 Progress Tracker

Track your learning progress:

```markdown
## My Testing Journey 🚀

### Level 1: Beginner ⭐
- [ ] Exercise 1.1: Simple Counter Test
- [ ] Exercise 1.2: Button Component Test
- [ ] Bug Hunt 1

### Level 2: Intermediate ⭐⭐
- [ ] Exercise 2.1: Form Validation
- [ ] Exercise 2.2: Async Data Fetching
- [ ] Bug Hunt 2

### Level 3: Advanced ⭐⭐⭐
- [ ] Exercise 3.1: Complex Context
- [ ] Exercise 3.2: Integration Test
- [ ] Bug Hunt 3

### Projects 🎯
- [ ] Project 1: Todo App (Coverage: __%)
- [ ] Project 2: Shopping Cart (Coverage: __%)

### Achievements 🏆
- [ ] First passing test
- [ ] 50% coverage on a project
- [ ] 80% coverage on a project
- [ ] Fixed first bug with tests
- [ ] Wrote integration test
- [ ] Practiced TDD for a feature
```

---

## 💡 Tips for Success

1. **Start Small** - Don't try to test everything at once
2. **Read Error Messages** - They usually tell you exactly what's wrong
3. **Use screen.debug()** - When queries fail, see what's actually rendered
4. **Test Behavior** - Not implementation details
5. **Practice Daily** - Even 15 minutes helps
6. **Learn from Failures** - Failing tests teach the most

---

## 🎓 Next Steps

After completing these exercises:

1. **Write tests for your own projects**
2. **Try TDD** - Write tests before code
3. **Learn E2E testing** - Cypress or Playwright
4. **Join testing communities** - Discord, Reddit
5. **Read testing blogs** - Kent C. Dodds, Testing Library

---

## 📞 Getting Help

Stuck? Here's how to get help:

1. **Read the error message carefully**
2. **Use `screen.debug()`** to see what's rendered
3. **Check the documentation** - Jest, RTL
4. **Search GitHub issues** - Your error might be common
5. **Ask in communities** - StackOverflow, Discord

---

**Remember:** Every expert was once a beginner. Keep practicing! 🚀

**Estimated total time to complete all exercises:** 8-10 hours  
**Estimated skill improvement:** 📈 Huge!
