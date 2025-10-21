# 05 - Testing Events and User Interactions

## 🎯 Tujuan Pembelajaran

Setelah mempelajari modul ini, Anda akan mampu:
- Simulate user interactions seperti clicks, typing, keyboard events
- Testing berbagai jenis events di React components
- Memahami perbedaan fireEvent vs userEvent
- Testing event handlers dengan benar

## 🤔 Kenapa Testing Events Itu Penting?

**Analogi Sederhana:**

Bayangkan Anda punya remote TV. Testing events itu seperti memastikan:
- Ketika Anda pencet tombol power → TV nyala ✅
- Ketika Anda pencet tombol volume up → Volume naik ✅
- Ketika Anda pencet channel → Channel berganti ✅

Kalau remote-nya tidak ditest, bisa jadi:
- Pencet power malah ganti channel ❌
- Pencet volume malah TV mati ❌
- Tombol tidak respond sama sekali ❌

Di aplikasi web, events adalah cara user berinteraksi dengan aplikasi kita!

## 🖱️ Jenis-Jenis User Events

### 1. Click Events

**Contoh Real-World:** Tombol "Add to Cart" di online shop

```typescript
// Component: AddToCartButton.tsx
interface AddToCartButtonProps {
  productId: string
  productName: string
  onAddToCart: (id: string) => void
}

export function AddToCartButton({ 
  productId, 
  productName, 
  onAddToCart 
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  
  const handleClick = async () => {
    setIsAdding(true)
    await onAddToCart(productId)
    setIsAdding(false)
  }
  
  return (
    <button 
      onClick={handleClick}
      disabled={isAdding}
      aria-label={`Add ${productName} to cart`}
    >
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}
```

**Test yang Comprehensive:**

```typescript
// AddToCartButton.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddToCartButton } from './AddToCartButton'

describe('AddToCartButton', () => {
  // Setup reusable mock
  const mockAddToCart = jest.fn()
  
  // Setup reusable props
  const defaultProps = {
    productId: 'shoe-123',
    productName: 'Running Shoes',
    onAddToCart: mockAddToCart
  }
  
  // Clear mocks sebelum setiap test
  beforeEach(() => {
    mockAddToCart.mockClear()
  })
  
  test('renders button dengan text yang benar', () => {
    render(<AddToCartButton {...defaultProps} />)
    
    const button = screen.getByRole('button', { name: /add running shoes to cart/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Add to Cart')
  })
  
  test('memanggil onAddToCart dengan productId yang benar saat diklik', async () => {
    const user = userEvent.setup()
    render(<AddToCartButton {...defaultProps} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(mockAddToCart).toHaveBeenCalledTimes(1)
    expect(mockAddToCart).toHaveBeenCalledWith('shoe-123')
  })
  
  test('menampilkan "Adding..." saat proses add to cart', async () => {
    const user = userEvent.setup()
    // Mock function yang delayed
    const slowAddToCart = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<AddToCartButton {...defaultProps} onAddToCart={slowAddToCart} />)
    
    const button = screen.getByRole('button')
    
    // Before click
    expect(button).toHaveTextContent('Add to Cart')
    
    // During click
    const clickPromise = user.click(button)
    expect(await screen.findByText('Adding...')).toBeInTheDocument()
    
    // Wait for completion
    await clickPromise
    expect(screen.getByText('Add to Cart')).toBeInTheDocument()
  })
  
  test('button disabled saat sedang menambahkan', async () => {
    const user = userEvent.setup()
    const slowAddToCart = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<AddToCartButton {...defaultProps} onAddToCart={slowAddToCart} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeEnabled()
    
    const clickPromise = user.click(button)
    
    // Button harus disabled saat processing
    expect(button).toBeDisabled()
    
    await clickPromise
    
    // Button enabled lagi setelah selesai
    expect(button).toBeEnabled()
  })
  
  test('tidak memanggil onAddToCart multiple times untuk double clicks', async () => {
    const user = userEvent.setup()
    render(<AddToCartButton {...defaultProps} />)
    
    const button = screen.getByRole('button')
    
    // Double click cepat
    await user.click(button)
    await user.click(button)
    
    // Seharusnya hanya dipanggil sekali karena button disabled
    expect(mockAddToCart).toHaveBeenCalledTimes(1)
  })
})
```

### 2. Typing Events

**Contoh Real-World:** Search box untuk cari produk

```typescript
// Component: SearchBox.tsx
interface SearchBoxProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchBox({ onSearch, placeholder = 'Search...' }: SearchBoxProps) {
  const [query, setQuery] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }
  
  const handleClear = () => {
    setQuery('')
    onSearch('')
  }
  
  return (
    <form onSubmit={handleSubmit} role="search">
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>
      <input
        id="search-input"
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search input"
      />
      {query && (
        <button 
          type="button" 
          onClick={handleClear}
          aria-label="Clear search"
        >
          Clear
        </button>
      )}
      <button type="submit">Search</button>
    </form>
  )
}
```

**Test dengan User Typing:**

```typescript
// SearchBox.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBox } from './SearchBox'

describe('SearchBox', () => {
  const mockOnSearch = jest.fn()
  
  beforeEach(() => {
    mockOnSearch.mockClear()
  })
  
  test('user dapat mengetik di search box', async () => {
    const user = userEvent.setup()
    render(<SearchBox onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox')
    
    // User mengetik
    await user.type(input, 'running shoes')
    
    // Verify value
    expect(input).toHaveValue('running shoes')
  })
  
  test('submit search saat user menekan Enter', async () => {
    const user = userEvent.setup()
    render(<SearchBox onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox')
    
    // Ketik dan tekan Enter
    await user.type(input, 'laptop{Enter}')
    
    // Verify onSearch dipanggil dengan query yang benar
    expect(mockOnSearch).toHaveBeenCalledWith('laptop')
  })
  
  test('submit search saat user klik tombol Search', async () => {
    const user = userEvent.setup()
    render(<SearchBox onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox')
    const searchButton = screen.getByRole('button', { name: /search/i })
    
    // Ketik query
    await user.type(input, 'smartphone')
    
    // Klik search button
    await user.click(searchButton)
    
    expect(mockOnSearch).toHaveBeenCalledWith('smartphone')
  })
  
  test('tidak submit jika query kosong', async () => {
    const user = userEvent.setup()
    render(<SearchBox onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox')
    
    // Ketik spasi dan Enter
    await user.type(input, '   {Enter}')
    
    // onSearch tidak boleh dipanggil
    expect(mockOnSearch).not.toHaveBeenCalled()
  })
  
  test('clear button muncul saat ada text', async () => {
    const user = userEvent.setup()
    render(<SearchBox onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox')
    
    // Awalnya tidak ada clear button
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument()
    
    // Setelah ketik, clear button muncul
    await user.type(input, 'test')
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
  })
  
  test('clear button menghapus text dan memanggil onSearch dengan empty string', async () => {
    const user = userEvent.setup()
    render(<SearchBox onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox')
    
    // Ketik sesuatu
    await user.type(input, 'test query')
    expect(input).toHaveValue('test query')
    
    // Klik clear
    const clearButton = screen.getByRole('button', { name: /clear/i })
    await user.click(clearButton)
    
    // Verify
    expect(input).toHaveValue('')
    expect(mockOnSearch).toHaveBeenCalledWith('')
  })
  
  test('menampilkan custom placeholder', () => {
    render(<SearchBox onSearch={mockOnSearch} placeholder="Find products..." />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('placeholder', 'Find products...')
  })
})
```

### 3. Keyboard Events

**Contoh Real-World:** Dropdown menu dengan keyboard navigation

```typescript
// Component: Dropdown.tsx
interface DropdownProps {
  options: string[]
  onSelect: (option: string) => void
  label: string
}

export function Dropdown({ options, onSelect, label }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          onSelect(options[selectedIndex])
          setIsOpen(false)
          setSelectedIndex(-1)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }
  
  return (
    <div className="dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {label}
      </button>
      
      {isOpen && (
        <ul role="listbox">
          {options.map((option, index) => (
            <li
              key={option}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => {
                onSelect(option)
                setIsOpen(false)
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

**Test Keyboard Navigation:**

```typescript
// Dropdown.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown } from './Dropdown'

describe('Dropdown Keyboard Navigation', () => {
  const options = ['Option 1', 'Option 2', 'Option 3']
  const mockOnSelect = jest.fn()
  
  beforeEach(() => {
    mockOnSelect.mockClear()
  })
  
  test('membuka dropdown dengan Enter key', async () => {
    const user = userEvent.setup()
    render(<Dropdown options={options} onSelect={mockOnSelect} label="Select" />)
    
    const button = screen.getByRole('button')
    
    // Focus dan tekan Enter
    button.focus()
    await user.keyboard('{Enter}')
    
    // Dropdown harus terbuka
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })
  
  test('membuka dropdown dengan Space key', async () => {
    const user = userEvent.setup()
    render(<Dropdown options={options} onSelect={mockOnSelect} label="Select" />)
    
    const button = screen.getByRole('button')
    
    button.focus()
    await user.keyboard(' ')
    
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })
  
  test('navigasi dengan ArrowDown', async () => {
    const user = userEvent.setup()
    render(<Dropdown options={options} onSelect={mockOnSelect} label="Select" />)
    
    const button = screen.getByRole('button')
    
    // Buka dropdown
    await user.click(button)
    
    // Tekan ArrowDown 2 kali
    await user.keyboard('{ArrowDown}{ArrowDown}')
    
    // Option kedua (index 1) harus selected
    const secondOption = screen.getByRole('option', { name: 'Option 2' })
    expect(secondOption).toHaveAttribute('aria-selected', 'true')
  })
  
  test('navigasi dengan ArrowUp', async () => {
    const user = userEvent.setup()
    render(<Dropdown options={options} onSelect={mockOnSelect} label="Select" />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    // Go down dulu
    await user.keyboard('{ArrowDown}{ArrowDown}')
    // Kemudian naik
    await user.keyboard('{ArrowUp}')
    
    const firstOption = screen.getByRole('option', { name: 'Option 1' })
    expect(firstOption).toHaveAttribute('aria-selected', 'true')
  })
  
  test('select option dengan Enter key', async () => {
    const user = userEvent.setup()
    render(<Dropdown options={options} onSelect={mockOnSelect} label="Select" />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    // Navigate dan select
    await user.keyboard('{ArrowDown}{Enter}')
    
    expect(mockOnSelect).toHaveBeenCalledWith('Option 1')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
  
  test('menutup dropdown dengan Escape key', async () => {
    const user = userEvent.setup()
    render(<Dropdown options={options} onSelect={mockOnSelect} label="Select" />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    
    // Tekan Escape
    await user.keyboard('{Escape}')
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(mockOnSelect).not.toHaveBeenCalled()
  })
})
```

## 🔄 fireEvent vs userEvent

**Analogi:**

- **fireEvent** = Seperti menekan tombol dengan robot: cepat tapi tidak natural
- **userEvent** = Seperti manusia sungguhan: lebih lambat tapi realistic

### Perbedaan Detail

```typescript
// ========================================
// EXAMPLE 1: Click
// ========================================

// fireEvent - Single event
fireEvent.click(button)
// Hanya trigger: click event

// userEvent - Multiple events (more realistic)
await user.click(button)
// Trigger sequence: mousedown → mouseup → click
```

```typescript
// ========================================
// EXAMPLE 2: Type
// ========================================

// fireEvent - Instant text
fireEvent.change(input, { target: { value: 'hello' } })
// Text langsung muncul semua

// userEvent - Realistic typing
await user.type(input, 'hello')
// Trigger untuk setiap karakter:
// h → he → hel → hell → hello
// Seperti orang betulan ngetik!
```

### Kapan Menggunakan Mana?

```typescript
// ✅ Gunakan userEvent (RECOMMENDED)
// - Testing interaksi user yang realistic
// - Saat test perlu simulate real behavior
// - Default choice untuk most cases

test('user types in input', async () => {
  const user = userEvent.setup()
  await user.type(input, 'test')
})

// ⚠️ Gunakan fireEvent (EDGE CASES)
// - Saat perlu trigger specific event
// - Testing event handlers langsung
// - Performance critical tests (banyak sekali tests)

test('input change handler', () => {
  fireEvent.change(input, { target: { value: 'test' } })
})
```

## 🎯 Testing Best Practices

### 1. Setup User Event di Awal

```typescript
describe('MyComponent', () => {
  test('user interaction', async () => {
    // ✅ GOOD: Setup user di awal
    const user = userEvent.setup()
    render(<MyComponent />)
    
    await user.click(button)
    await user.type(input, 'test')
  })
  
  test('another test', async () => {
    // ❌ BAD: Jangan reuse user dari test lain
    // Setup baru untuk setiap test
    const user = userEvent.setup()
  })
})
```

### 2. Gunakan Descriptive Queries

```typescript
// ❌ BAD
const button = screen.getByText('Click')

// ✅ GOOD: Lebih specific
const submitButton = screen.getByRole('button', { name: /submit form/i })
```

### 3. Test User Flow, Bukan Implementation

```typescript
// ❌ BAD: Testing internal state
test('clicks increment counter state', () => {
  const { result } = renderHook(() => useCounter())
  act(() => result.current.increment())
  expect(result.current.count).toBe(1)
})

// ✅ GOOD: Testing apa yang user lihat
test('displays incremented count after button click', async () => {
  const user = userEvent.setup()
  render(<Counter />)
  
  await user.click(screen.getByRole('button', { name: /increment/i }))
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

## 💪 Practice Exercise

### Exercise: Like Button Component

Buat component dan test untuk Like Button:

**Requirements:**
- Button tampilkan count likes
- Click untuk toggle like/unlike
- Show different icon untuk liked/unliked state
- Disable button saat API call
- Show notification setelah successfully liked

**Starter Code:**

```typescript
// LikeButton.tsx
interface LikeButtonProps {
  initialLikes: number
  postId: string
  onLike: (postId: string, isLiked: boolean) => Promise<void>
}

export function LikeButton({ initialLikes, postId, onLike }: LikeButtonProps) {
  // Your implementation here
}
```

**Test Cases yang Harus Dibuat:**
1. Render initial state dengan benar
2. User dapat klik untuk like
3. Count likes bertambah setelah like
4. Icon berubah setelah like
5. User dapat unlike
6. Button disabled saat proses API call
7. Show notification setelah success
8. Handle error dengan graceful

<details>
<summary>💡 Solution</summary>

```typescript
// LikeButton.tsx
import { useState } from 'react'

interface LikeButtonProps {
  initialLikes: number
  postId: string
  onLike: (postId: string, isLiked: boolean) => Promise<void>
}

export function LikeButton({ initialLikes, postId, onLike }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const handleClick = async () => {
    const newLikedState = !isLiked
    
    setIsLoading(true)
    setMessage('')
    
    try {
      await onLike(postId, newLikedState)
      
      setIsLiked(newLikedState)
      setLikes(prev => newLikedState ? prev + 1 : prev - 1)
      setMessage(newLikedState ? 'Liked!' : 'Unliked')
      
      // Clear message after 2 seconds
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage('Failed to update like')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
        aria-pressed={isLiked}
      >
        <span role="img" aria-label={isLiked ? 'liked' : 'not liked'}>
          {isLiked ? '❤️' : '🤍'}
        </span>
        <span>{likes} {likes === 1 ? 'like' : 'likes'}</span>
      </button>
      
      {message && (
        <div role="status" aria-live="polite">
          {message}
        </div>
      )}
    </div>
  )
}

// LikeButton.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LikeButton } from './LikeButton'

describe('LikeButton', () => {
  const mockOnLike = jest.fn()
  
  beforeEach(() => {
    mockOnLike.mockClear()
    mockOnLike.mockResolvedValue(undefined)
  })
  
  test('renders dengan initial likes count', () => {
    render(<LikeButton initialLikes={42} postId="post-1" onLike={mockOnLike} />)
    
    expect(screen.getByText('42 likes')).toBeInTheDocument()
  })
  
  test('singular "like" untuk 1 like', () => {
    render(<LikeButton initialLikes={1} postId="post-1" onLike={mockOnLike} />)
    
    expect(screen.getByText('1 like')).toBeInTheDocument()
  })
  
  test('user dapat like post', async () => {
    const user = userEvent.setup()
    render(<LikeButton initialLikes={10} postId="post-1" onLike={mockOnLike} />)
    
    const button = screen.getByRole('button', { name: /like this post/i })
    await user.click(button)
    
    expect(mockOnLike).toHaveBeenCalledWith('post-1', true)
  })
  
  test('like count bertambah setelah like', async () => {
    const user = userEvent.setup()
    render(<LikeButton initialLikes={10} postId="post-1" onLike={mockOnLike} />)
    
    await user.click(screen.getByRole('button'))
    
    await waitFor(() => {
      expect(screen.getByText('11 likes')).toBeInTheDocument()
    })
  })
  
  test('icon berubah setelah like', async () => {
    const user = userEvent.setup()
    render(<LikeButton initialLikes={10} postId="post-1" onLike={mockOnLike} />)
    
    // Before like
    expect(screen.getByLabelText('not liked')).toHaveTextContent('🤍')
    
    // After like
    await user.click(screen.getByRole('button'))
    
    await waitFor(() => {
      expect(screen.getByLabelText('liked')).toHaveTextContent('❤️')
    })
  })
  
  test('user dapat unlike post', async () => {
    const user = userEvent.setup()
    render(<LikeButton initialLikes={10} postId="post-1" onLike={mockOnLike} />)
    
    // Like first
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByText('11 likes')).toBeInTheDocument()
    })
    
    // Unlike
    await user.click(screen.getByRole('button', { name: /unlike/i }))
    
    await waitFor(() => {
      expect(screen.getByText('10 likes')).toBeInTheDocument()
      expect(mockOnLike).toHaveBeenCalledWith('post-1', false)
    })
  })
  
  test('button disabled saat loading', async () => {
    const user = userEvent.setup()
    const slowOnLike = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<LikeButton initialLikes={10} postId="post-1" onLike={slowOnLike} />)
    
    const button = screen.getByRole('button')
    const clickPromise = user.click(button)
    
    // Should be disabled during API call
    expect(button).toBeDisabled()
    
    await clickPromise
    
    // Should be enabled after
    expect(button).toBeEnabled()
  })
  
  test('menampilkan "Liked!" notification setelah success', async () => {
    const user = userEvent.setup()
    render(<LikeButton initialLikes={10} postId="post-1" onLike={mockOnLike} />)
    
    await user.click(screen.getByRole('button'))
    
    expect(await screen.findByRole('status')).toHaveTextContent('Liked!')
  })
  
  test('menampilkan error message saat API gagal', async () => {
    const user = userEvent.setup()
    mockOnLike.mockRejectedValue(new Error('API Error'))
    
    render(<LikeButton initialLikes={10} postId="post-1" onLike={mockOnLike} />)
    
    await user.click(screen.getByRole('button'))
    
    expect(await screen.findByText('Failed to update like')).toBeInTheDocument()
    
    // Count should not change on error
    expect(screen.getByText('10 likes')).toBeInTheDocument()
  })
})
```

</details>

## 📚 Key Takeaways

1. ✅ **userEvent > fireEvent** untuk realistic testing
2. ✅ **Test dari perspektif user**, bukan implementation
3. ✅ **Gunakan accessible queries** (getByRole, getByLabelText)
4. ✅ **Test happy path dan error cases**
5. ✅ **Verify disabled states dan loading states**
6. ✅ **Clean up side effects** (timers, async operations)

## 🎯 Mini Challenge

Coba implement dan test component berikut:

**Toggle Switch Component**
- On/Off state dengan visual indicator
- Click to toggle
- Keyboard support (Space/Enter to toggle)
- Disabled state
- onChange callback
- Accessibility labels

Good luck! 🚀

---

**Next:** [06 - Testing Form Inputs and Validation](./06-testing-forms.md)
