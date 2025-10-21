# 08 - Mocking API Calls with MSW

## 🎯 Tujuan Pembelajaran

Setelah mempelajari modul ini, Anda akan mampu:

- Memahami kenapa perlu mock API
- Setup Mock Service Worker (MSW)
- Mock GET, POST, PUT, DELETE requests
- Simulate loading states
- Simulate error responses
- Test retry logic

## 🤔 Kenapa Perlu Mock API?

**Analogi Kehidupan Nyata:**

Bayangkan Anda latihan presentasi di depan cermin sebelum presentasi sesungguhnya:

- **Tanpa Mock:** Harus tunggu backend ready, internet connect, server up ❌
- **Dengan Mock:** Bisa test kapan saja, cepat, reliable ✅

Mocking API seperti "latihan dengan dummy data" supaya:

- Test tidak bergantung pada server eksternal
- Test berjalan cepat (tidak ada network delay)
- Bisa simulate error scenarios dengan mudah
- Reproducible results setiap kali test

## 🛠️ Setup Mock Service Worker (MSW)

### Installation

```bash
npm install msw --save-dev
```

### Create Mock Handlers

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw'

interface User {
  id: number
  name: string
  email: string
}

interface Post {
  id: number
  title: string
  content: string
  userId: number
}

// Mock data
const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
]

const posts: Post[] = [
  { id: 1, title: 'First Post', content: 'Hello World', userId: 1 },
  { id: 2, title: 'Second Post', content: 'Testing is fun', userId: 1 }
]

// Handlers
export const handlers = [
  // GET /api/users
  http.get('/api/users', () => {
    return HttpResponse.json(users)
  }),
  
  // GET /api/users/:id
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params
    const user = users.find(u => u.id === Number(id))
    
    if (!user) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(user)
  }),
  
  // POST /api/users
  http.post('/api/users', async ({ request }) => {
    const newUser = await request.json() as Omit<User, 'id'>
    const user: User = {
      id: users.length + 1,
      ...newUser
    }
    
    users.push(user)
    
    return HttpResponse.json(user, { status: 201 })
  }),
  
  // GET /api/posts
  http.get('/api/posts', ({ request }) => {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    
    if (userId) {
      const userPosts = posts.filter(p => p.userId === Number(userId))
      return HttpResponse.json(userPosts)
    }
    
    return HttpResponse.json(posts)
  }),
  
  // POST /api/posts
  http.post('/api/posts', async ({ request }) => {
    const newPost = await request.json() as Omit<Post, 'id'>
    const post: Post = {
      id: posts.length + 1,
      ...newPost
    }
    
    posts.push(post)
    
    return HttpResponse.json(post, { status: 201 })
  }),
  
  // DELETE /api/posts/:id
  http.delete('/api/posts/:id', ({ params }) => {
    const { id } = params
    const index = posts.findIndex(p => p.id === Number(id))
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    posts.splice(index, 1)
    
    return new HttpResponse(null, { status: 204 })
  })
]
```

### Setup MSW Server

```typescript
// mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

### Configure Jest Setup

```typescript
// jest.setup.js
import '@testing-library/jest-dom'
import { server } from './mocks/server'

// Start server before all tests
beforeAll(() => server.listen())

// Reset handlers after each test
afterEach(() => server.resetHandlers())

// Clean up after all tests
afterAll(() => server.close())
```

## 📝 Contoh: User List Component

### Component Implementation

```typescript
// UserList.tsx
import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/users')
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchUsers()
  }, [])
  
  if (loading) {
    return <div role="status">Loading users...</div>
  }
  
  if (error) {
    return (
      <div>
        <div role="alert" className="error">
          {error}
        </div>
        <button onClick={fetchUsers}>Retry</button>
      </div>
    )
  }
  
  if (users.length === 0) {
    return <div>No users found</div>
  }
  
  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Tests with Mocked API

```typescript
// UserList.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { UserList } from './UserList'

describe('UserList - Mocked API', () => {
  test('shows loading state initially', () => {
    render(<UserList />)
    
    expect(screen.getByText(/loading users/i)).toBeInTheDocument()
  })
  
  test('displays users after successful fetch', async () => {
    render(<UserList />)
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })
    
    // Users are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
  })
  
  test('displays error message when fetch fails', async () => {
    // Override handler to return error
    server.use(
      http.get('/api/users', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )
    
    render(<UserList />)
    
    // Wait for error to appear
    expect(await screen.findByRole('alert')).toHaveTextContent(/failed to fetch/i)
    
    // Loading gone
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    
    // Retry button appears
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })
  
  test('retry button fetches users again', async () => {
    const user = userEvent.setup()
    
    // First request fails
    server.use(
      http.get('/api/users', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )
    
    render(<UserList />)
    
    // Wait for error
    await screen.findByRole('alert')
    
    // Reset to successful handler
    server.resetHandlers()
    
    // Click retry
    await user.click(screen.getByRole('button', { name: /retry/i }))
    
    // Should show loading again
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    
    // Then show users
    expect(await screen.findByText('John Doe')).toBeInTheDocument()
  })
  
  test('displays empty state when no users', async () => {
    // Override to return empty array
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json([])
      })
    )
    
    render(<UserList />)
    
    expect(await screen.findByText(/no users found/i)).toBeInTheDocument()
  })
})
```

## 📝 Contoh: Create Post Form

### Component with POST Request

```typescript
// CreatePostForm.tsx
import { useState } from 'react'

interface PostFormData {
  title: string
  content: string
}

interface CreatePostFormProps {
  userId: number
  onSuccess: (post: any) => void
}

export function CreatePostForm({ userId, onSuccess }: CreatePostFormProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          userId
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create post')
      }
      
      const post = await response.json()
      
      // Reset form
      setFormData({ title: '', content: '' })
      
      // Call success callback
      onSuccess(post)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <h3>Create New Post</h3>
      
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={formData.content}
          onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
          required
          rows={5}
        />
      </div>
      
      {error && (
        <div role="alert" className="error">
          {error}
        </div>
      )}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  )
}
```

### Tests for POST Requests

```typescript
// CreatePostForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { CreatePostForm } from './CreatePostForm'

describe('CreatePostForm - POST Requests', () => {
  const mockOnSuccess = jest.fn()
  
  beforeEach(() => {
    mockOnSuccess.mockClear()
  })
  
  test('submits form with correct data', async () => {
    const user = userEvent.setup()
    
    // Spy on POST request
    let capturedBody: any
    server.use(
      http.post('/api/posts', async ({ request }) => {
        capturedBody = await request.json()
        return HttpResponse.json({
          id: 999,
          ...capturedBody
        }, { status: 201 })
      })
    )
    
    render(<CreatePostForm userId={1} onSuccess={mockOnSuccess} />)
    
    // Fill form
    await user.type(screen.getByLabelText(/title/i), 'My New Post')
    await user.type(screen.getByLabelText(/content/i), 'This is great content')
    
    // Submit
    await user.click(screen.getByRole('button', { name: /create post/i }))
    
    // Check request body
    await waitFor(() => {
      expect(capturedBody).toEqual({
        title: 'My New Post',
        content: 'This is great content',
        userId: 1
      })
    })
  })
  
  test('shows loading state during submission', async () => {
    const user = userEvent.setup()
    
    // Slow response
    server.use(
      http.post('/api/posts', async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        return HttpResponse.json({ id: 1 }, { status: 201 })
      })
    )
    
    render(<CreatePostForm userId={1} onSuccess={mockOnSuccess} />)
    
    // Fill and submit
    await user.type(screen.getByLabelText(/title/i), 'Test')
    await user.type(screen.getByLabelText(/content/i), 'Content')
    
    const submitButton = screen.getByRole('button')
    const submitPromise = user.click(submitButton)
    
    // Should show loading
    expect(await screen.findByText(/creating/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    
    await submitPromise
  })
  
  test('calls onSuccess callback after successful submission', async () => {
    const user = userEvent.setup()
    render(<CreatePostForm userId={1} onSuccess={mockOnSuccess} />)
    
    // Fill and submit
    await user.type(screen.getByLabelText(/title/i), 'Success Post')
    await user.type(screen.getByLabelText(/content/i), 'Content here')
    await user.click(screen.getByRole('button', { name: /create/i }))
    
    // Wait for success
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Success Post',
          content: 'Content here',
          userId: 1
        })
      )
    })
  })
  
  test('clears form after successful submission', async () => {
    const user = userEvent.setup()
    render(<CreatePostForm userId={1} onSuccess={mockOnSuccess} />)
    
    const titleInput = screen.getByLabelText(/title/i)
    const contentInput = screen.getByLabelText(/content/i)
    
    // Fill and submit
    await user.type(titleInput, 'Test Title')
    await user.type(contentInput, 'Test Content')
    await user.click(screen.getByRole('button', { name: /create/i }))
    
    // Wait for form to clear
    await waitFor(() => {
      expect(titleInput).toHaveValue('')
      expect(contentInput).toHaveValue('')
    })
  })
  
  test('displays error when submission fails', async () => {
    const user = userEvent.setup()
    
    // Override to return error
    server.use(
      http.post('/api/posts', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )
    
    render(<CreatePostForm userId={1} onSuccess={mockOnSuccess} />)
    
    // Fill and submit
    await user.type(screen.getByLabelText(/title/i), 'Test')
    await user.type(screen.getByLabelText(/content/i), 'Content')
    await user.click(screen.getByRole('button', { name: /create/i }))
    
    // Error appears
    expect(await screen.findByRole('alert')).toHaveTextContent(/failed to create/i)
    
    // Callback not called
    expect(mockOnSuccess).not.toHaveBeenCalled()
    
    // Form not cleared
    expect(screen.getByLabelText(/title/i)).toHaveValue('Test')
  })
  
  test('can retry after error', async () => {
    const user = userEvent.setup()
    
    // First request fails
    let requestCount = 0
    server.use(
      http.post('/api/posts', () => {
        requestCount++
        if (requestCount === 1) {
          return new HttpResponse(null, { status: 500 })
        }
        return HttpResponse.json({ id: 1 }, { status: 201 })
      })
    )
    
    render(<CreatePostForm userId={1} onSuccess={mockOnSuccess} />)
    
    // Fill and submit (fails)
    await user.type(screen.getByLabelText(/title/i), 'Retry Test')
    await user.type(screen.getByLabelText(/content/i), 'Content')
    await user.click(screen.getByRole('button', { name: /create/i }))
    
    // Error appears
    await screen.findByRole('alert')
    
    // Submit again (succeeds)
    await user.click(screen.getByRole('button', { name: /create/i }))
    
    // Success
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })
})
```

## 💡 Advanced MSW Patterns

### Simulate Network Delay

```typescript
http.get('/api/users', async () => {
  // Add 1 second delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return HttpResponse.json(users)
})
```

### Simulate Different Error Types

```typescript
// 404 Not Found
http.get('/api/users/:id', () => {
  return new HttpResponse(null, { status: 404 })
})

// 401 Unauthorized
http.get('/api/protected', () => {
  return new HttpResponse(null, { status: 401 })
})

// 500 Server Error
http.get('/api/users', () => {
  return new HttpResponse(null, { status: 500 })
})

// Network Error
http.get('/api/users', () => {
  return HttpResponse.error()
})
```

### Dynamic Responses Based on Request

```typescript
http.get('/api/users', ({ request }) => {
  const url = new URL(request.url)
  const page = url.searchParams.get('page')
  const limit = url.searchParams.get('limit')
  
  // Return paginated data based on params
  return HttpResponse.json({
    users: users.slice(0, Number(limit)),
    page: Number(page),
    total: users.length
  })
})
```

## 💡 Key Takeaways

1. ✅ **MSW intercepts network requests** - No real API calls in tests
2. ✅ **Test loading states** - Use delays to test loading UI
3. ✅ **Test error handling** - Override handlers for error scenarios
4. ✅ **Test retry logic** - Reset handlers between attempts
5. ✅ **Verify request data** - Capture and assert request body
6. ✅ **Test success flows** - Callbacks, form resets, UI updates
7. ✅ **Use server.use() for overrides** - Per-test customization

## 🎯 Practice Exercise

Buat component "Product Search" dengan:

- Search input yang fetch dari API
- Debounced search (wait 300ms)
- Loading indicator
- Error handling with retry
- Empty state
- Display results
- Mock all API scenarios dengan MSW

---

**Next:** [09 - Testing Async Operations](./09-testing-async.md)
