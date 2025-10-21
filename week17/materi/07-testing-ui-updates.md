# 07 - Testing Dynamic UI Updates

## 🎯 Tujuan Pembelajaran

Setelah mempelajari modul ini, Anda akan mampu:

- Testing conditional rendering
- Testing state changes
- Testing list updates (add, edit, delete)
- Testing UI animations/transitions
- Testing real-time updates

## 🤔 Kenapa Testing UI Updates Penting?

**Analogi Kehidupan Nyata:**

Bayangkan Anda memesan makanan online lewat aplikasi:

- Status "Sedang Dimasak" → "Sedang Dikirim" → "Sampai" 🍕
- Notifikasi badge angka merah bertambah ⭕ 
- Loading spinner muncul saat mengambil data ⏳
- Modal popup muncul/hilang saat konfirmasi ✨

Testing UI updates memastikan:
- Element muncul/hilang sesuai kondisi
- State changes tercermin di UI
- Animation/transition berjalan dengan baik
- Data updates ditampilkan dengan benar

## 📝 Contoh 1: Conditional Rendering - Status Badge

### Component Implementation

```typescript
// OrderStatus.tsx
import { useMemo } from 'react'

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

interface OrderStatusBadgeProps {
  status: OrderStatus
  orderNumber: string
  estimatedDelivery?: string
}

export function OrderStatusBadge({ 
  status, 
  orderNumber, 
  estimatedDelivery 
}: OrderStatusBadgeProps) {
  const statusConfig = useMemo(() => {
    const configs = {
      pending: {
        label: 'Pending',
        color: 'gray',
        icon: '⏳',
        description: 'Your order is being confirmed'
      },
      processing: {
        label: 'Processing',
        color: 'blue',
        icon: '📦',
        description: 'Your order is being prepared'
      },
      shipped: {
        label: 'Shipped',
        color: 'purple',
        icon: '🚚',
        description: 'Your order is on the way'
      },
      delivered: {
        label: 'Delivered',
        color: 'green',
        icon: '✅',
        description: 'Your order has been delivered'
      },
      cancelled: {
        label: 'Cancelled',
        color: 'red',
        icon: '❌',
        description: 'Your order has been cancelled'
      }
    }
    
    return configs[status]
  }, [status])
  
  return (
    <div className="order-status">
      <div className={`badge badge-${statusConfig.color}`}>
        <span role="img" aria-label={statusConfig.label}>
          {statusConfig.icon}
        </span>
        <span>{statusConfig.label}</span>
      </div>
      
      <div className="order-info">
        <p className="order-number">Order #{orderNumber}</p>
        <p className="status-description">{statusConfig.description}</p>
        
        {/* Conditional: Show estimated delivery only for shipped status */}
        {status === 'shipped' && estimatedDelivery && (
          <p className="estimated-delivery">
            Estimated delivery: {estimatedDelivery}
          </p>
        )}
        
        {/* Conditional: Show success message for delivered */}
        {status === 'delivered' && (
          <div className="success-message" role="status">
            Thank you for your order!
          </div>
        )}
        
        {/* Conditional: Show cancel reason for cancelled */}
        {status === 'cancelled' && (
          <div className="error-message" role="alert">
            If you have questions, please contact support.
          </div>
        )}
      </div>
    </div>
  )
}
```

### Tests for Conditional Rendering

```typescript
// OrderStatus.test.tsx
import { render, screen } from '@testing-library/react'
import { OrderStatusBadge } from './OrderStatus'

describe('OrderStatusBadge - Conditional Rendering', () => {
  const defaultProps = {
    orderNumber: '12345'
  }
  
  test('renders pending status correctly', () => {
    render(<OrderStatusBadge {...defaultProps} status="pending" />)
    
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText(/being confirmed/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Pending')).toHaveTextContent('⏳')
  })
  
  test('renders processing status correctly', () => {
    render(<OrderStatusBadge {...defaultProps} status="processing" />)
    
    expect(screen.getByText('Processing')).toBeInTheDocument()
    expect(screen.getByText(/being prepared/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Processing')).toHaveTextContent('📦')
  })
  
  test('shows estimated delivery only when status is shipped', () => {
    const { rerender } = render(
      <OrderStatusBadge 
        {...defaultProps} 
        status="pending" 
        estimatedDelivery="Dec 25, 2024"
      />
    )
    
    // Should NOT show for pending
    expect(screen.queryByText(/estimated delivery/i)).not.toBeInTheDocument()
    
    // Re-render with shipped status
    rerender(
      <OrderStatusBadge 
        {...defaultProps} 
        status="shipped" 
        estimatedDelivery="Dec 25, 2024"
      />
    )
    
    // NOW it should show
    expect(screen.getByText(/estimated delivery.*dec 25/i)).toBeInTheDocument()
  })
  
  test('shows thank you message only when delivered', () => {
    const { rerender } = render(
      <OrderStatusBadge {...defaultProps} status="shipped" />
    )
    
    // Should NOT show for shipped
    expect(screen.queryByText(/thank you/i)).not.toBeInTheDocument()
    
    // Re-render with delivered status
    rerender(<OrderStatusBadge {...defaultProps} status="delivered" />)
    
    // NOW it should show
    expect(screen.getByText(/thank you for your order/i)).toBeInTheDocument()
  })
  
  test('shows support message only when cancelled', () => {
    const { rerender } = render(
      <OrderStatusBadge {...defaultProps} status="pending" />
    )
    
    // Should NOT show for pending
    expect(screen.queryByText(/contact support/i)).not.toBeInTheDocument()
    
    // Re-render with cancelled status
    rerender(<OrderStatusBadge {...defaultProps} status="cancelled" />)
    
    // NOW it should show
    expect(screen.getByText(/contact support/i)).toBeInTheDocument()
  })
  
  test('applies correct CSS class based on status', () => {
    const { rerender } = render(
      <OrderStatusBadge {...defaultProps} status="pending" />
    )
    
    expect(document.querySelector('.badge-gray')).toBeInTheDocument()
    
    rerender(<OrderStatusBadge {...defaultProps} status="delivered" />)
    expect(document.querySelector('.badge-green')).toBeInTheDocument()
  })
})
```

## 📝 Contoh 2: State Changes - Todo List

### Component with State Updates

```typescript
// TodoList.tsx
import { useState } from 'react'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  
  const addTodo = () => {
    if (!inputValue.trim()) return
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date()
    }
    
    setTodos(prev => [...prev, newTodo])
    setInputValue('')
  }
  
  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }
  
  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }
  
  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed))
  }
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })
  
  const activeCount = todos.filter(todo => !todo.completed).length
  const completedCount = todos.filter(todo => todo.completed).length
  
  return (
    <div className="todo-list">
      <h2>My Tasks</h2>
      
      {/* Input Section */}
      <div className="todo-input">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          aria-label="New todo"
        />
        <button onClick={addTodo} disabled={!inputValue.trim()}>
          Add
        </button>
      </div>
      
      {/* Filter Buttons */}
      {todos.length > 0 && (
        <div className="filters" role="group" aria-label="Filter todos">
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'active' : ''}
          >
            All ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={filter === 'active' ? 'active' : ''}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? 'active' : ''}
          >
            Completed ({completedCount})
          </button>
        </div>
      )}
      
      {/* Todo Items */}
      {filteredTodos.length === 0 ? (
        <div className="empty-state">
          {todos.length === 0 
            ? 'No tasks yet. Add one above!' 
            : `No ${filter} tasks`}
        </div>
      ) : (
        <ul className="todo-items">
          {filteredTodos.map(todo => (
            <li 
              key={todo.id} 
              className={todo.completed ? 'completed' : ''}
              data-testid={`todo-${todo.id}`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
              />
              <span className="todo-text">{todo.text}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                aria-label={`Delete "${todo.text}"`}
                className="delete-btn"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {/* Action Bar */}
      {completedCount > 0 && (
        <div className="action-bar">
          <button onClick={clearCompleted}>
            Clear Completed ({completedCount})
          </button>
        </div>
      )}
    </div>
  )
}
```

### Tests for State Changes

```typescript
// TodoList.test.tsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoList } from './TodoList'

describe('TodoList - State Updates', () => {
  test('initially shows empty state', () => {
    render(<TodoList />)
    
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
  })
  
  test('adds new todo and updates UI', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    
    const input = screen.getByLabelText(/new todo/i)
    const addButton = screen.getByRole('button', { name: /add/i })
    
    // Initially disabled
    expect(addButton).toBeDisabled()
    
    // Type todo
    await user.type(input, 'Buy groceries')
    
    // Button now enabled
    expect(addButton).toBeEnabled()
    
    // Add todo
    await user.click(addButton)
    
    // Todo appears in list
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    
    // Input cleared
    expect(input).toHaveValue('')
    
    // Empty state gone
    expect(screen.queryByText(/no tasks yet/i)).not.toBeInTheDocument()
  })
  
  test('adds todo with Enter key', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    
    const input = screen.getByLabelText(/new todo/i)
    
    await user.type(input, 'Write tests{Enter}')
    
    expect(screen.getByText('Write tests')).toBeInTheDocument()
  })
  
  test('does not add empty todos', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    
    const addButton = screen.getByRole('button', { name: /add/i })
    
    // Try to add without typing
    await user.click(addButton)
    
    // Still shows empty state
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
  })
  
  test('toggles todo completion', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    
    // Add todo
    await user.type(screen.getByLabelText(/new todo/i), 'Test task{Enter}')
    
    const checkbox = screen.getByRole('checkbox', { name: /mark.*as complete/i })
    const todoItem = checkbox.closest('li')
    
    // Initially not completed
    expect(checkbox).not.toBeChecked()
    expect(todoItem).not.toHaveClass('completed')
    
    // Toggle to completed
    await user.click(checkbox)
    
    expect(checkbox).toBeChecked()
    expect(todoItem).toHaveClass('completed')
    
    // Toggle back to incomplete
    await user.click(checkbox)
    
    expect(checkbox).not.toBeChecked()
    expect(todoItem).not.toHaveClass('completed')
  })
  
  test('deletes todo and updates UI', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    
    // Add todo
    await user.type(screen.getByLabelText(/new todo/i), 'Delete me{Enter}')
    
    expect(screen.getByText('Delete me')).toBeInTheDocument()
    
    // Delete todo
    const deleteButton = screen.getByRole('button', { name: /delete.*delete me/i })
    await user.click(deleteButton)
    
    // Todo removed
    expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
    
    // Empty state returns
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
  })
  
  test('filters show/hide based on todo presence', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    
    // No filters initially
    expect(screen.queryByRole('group', { name: /filter/i })).not.toBeInTheDocument()
    
    // Add todo
    await user.type(screen.getByLabelText(/new todo/i), 'Task 1{Enter}')
    
    // Filters appear
    expect(screen.getByRole('group', { name: /filter/i })).toBeInTheDocument()
  })
  
  test('filter buttons update counts correctly', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    
    // Add 3 todos
    const input = screen.getByLabelText(/new todo/i)
    await user.type(input, 'Task 1{Enter}')
    await user.type(input, 'Task 2{Enter}')
    await user.type(input, 'Task 3{Enter}')
    
    // Check initial counts
    expect(screen.getByRole('button', { name: /all.*3/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /active.*3/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /completed.*0/i })).toBeInTheDocument()
    
    // Complete one todo
    const firstCheckbox = screen.getAllByRole('checkbox')[0]
    await user.click(firstCheckbox)
    
    // Counts updated
    expect(screen.getByRole('button', { name: /all.*3/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /active.*2/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /completed.*1/i })).toBeInTheDocument()
  })
  
  test('filtering changes visible todos', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    
    // Add 2 todos
    const input = screen.getByLabelText(/new todo/i)
    await user.type(input, 'Active task{Enter}')
    await user.type(input, 'Completed task{Enter}')
    
    // Complete second todo
    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[1])
    
    // All filter (default) - shows both
    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.getByText('Completed task')).toBeInTheDocument()
    
    // Click Active filter
    await user.click(screen.getByRole('button', { name: /active/i }))
    
    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.queryByText('Completed task')).not.toBeInTheDocument()
    
    // Click Completed filter
    await user.click(screen.getByRole('button', { name: /completed/i }))
    
    expect(screen.queryByText('Active task')).not.toBeInTheDocument()
    expect(screen.getByText('Completed task')).toBeInTheDocument()
    
    // Back to All
    await user.click(screen.getByRole('button', { name: /all/i }))
    
    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.getByText('Completed task')).toBeInTheDocument()
  })
  
  test('clear completed button appears when there are completed todos', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    
    // Add todo
    await user.type(screen.getByLabelText(/new todo/i), 'Task{Enter}')
    
    // No clear button yet
    expect(screen.queryByRole('button', { name: /clear completed/i })).not.toBeInTheDocument()
    
    // Complete todo
    await user.click(screen.getByRole('checkbox'))
    
    // Clear button appears
    expect(screen.getByRole('button', { name: /clear completed/i })).toBeInTheDocument()
  })
  
  test('clear completed removes all completed todos', async () => {
    const user = userEvent.setup()
    render(<TodoList />)
    
    // Add 3 todos
    const input = screen.getByLabelText(/new todo/i)
    await user.type(input, 'Task 1{Enter}')
    await user.type(input, 'Task 2{Enter}')
    await user.type(input, 'Task 3{Enter}')
    
    // Complete first and third
    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[0])
    await user.click(checkboxes[2])
    
    // Clear completed
    await user.click(screen.getByRole('button', { name: /clear completed/i }))
    
    // Only Task 2 remains
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
    expect(screen.queryByText('Task 3')).not.toBeInTheDocument()
    
    // Clear button gone
    expect(screen.queryByRole('button', { name: /clear completed/i })).not.toBeInTheDocument()
  })
})
```

## 💡 Key Testing Patterns

### 1. Test UI Before and After State Change

```typescript
// Before
expect(element).not.toBeInTheDocument()

// Trigger change
await user.click(button)

// After
expect(element).toBeInTheDocument()
```

### 2. Use rerender untuk Test Prop Changes

```typescript
const { rerender } = render(<Component status="pending" />)

// Test initial render
expect(screen.getByText('Pending')).toBeInTheDocument()

// Re-render with new props
rerender(<Component status="completed" />)

// Test updated render
expect(screen.getByText('Completed')).toBeInTheDocument()
```

### 3. Test Conditional Elements dengan queryBy

```typescript
// Should NOT be present - use queryBy
expect(screen.queryByText('Hidden')).not.toBeInTheDocument()

// Should be present - use getBy
expect(screen.getByText('Visible')).toBeInTheDocument()
```

## 💡 Key Takeaways

1. ✅ **Test conditional rendering** - Element muncul/hilang sesuai kondisi
2. ✅ **Test state changes** - UI updates after interactions
3. ✅ **Test list operations** - Add, edit, delete, filter
4. ✅ **Test counts and stats** - Numbers update correctly
5. ✅ **Use queryBy untuk absent elements** - Avoid false positives
6. ✅ **Test complete user flows** - Multi-step interactions
7. ✅ **Verify cleanup** - Inputs cleared, states reset

## 🎯 Practice Exercise

Buat component "Shopping Cart" dengan:

- Add items to cart
- Update quantities
- Remove items
- Calculate total
- Show/hide empty state
- Filter by category
- Complete tests for all state changes

---

**Next:** [08 - Mocking API Calls](./08-mocking-api.md)
