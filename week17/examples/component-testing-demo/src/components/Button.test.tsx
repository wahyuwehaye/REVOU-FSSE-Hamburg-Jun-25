// Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button Component', () => {
  describe('Rendering', () => {
    test('renders button with label', () => {
      render(<Button label="Click me" />)
      
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })
    
    test('renders with correct variant styles', () => {
      const { rerender } = render(<Button label="Primary" variant="primary" />)
      let button = screen.getByTestId('custom-button')
      expect(button).toHaveClass('bg-blue-500')
      
      rerender(<Button label="Danger" variant="danger" />)
      button = screen.getByTestId('custom-button')
      expect(button).toHaveClass('bg-red-500')
    })
  })
  
  describe('Interactions', () => {
    test('calls onClick when clicked', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(<Button label="Click me" onClick={handleClick} />)
      
      await user.click(screen.getByRole('button'))
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
    
    test('increments click count on each click', async () => {
      const user = userEvent.setup()
      render(<Button label="Click me" />)
      
      const button = screen.getByRole('button')
      
      // Initially no count
      expect(screen.queryByTestId('click-count')).not.toBeInTheDocument()
      
      // Click once
      await user.click(button)
      expect(screen.getByTestId('click-count')).toHaveTextContent('(1)')
      
      // Click again
      await user.click(button)
      expect(screen.getByTestId('click-count')).toHaveTextContent('(2)')
      
      // Click third time
      await user.click(button)
      expect(screen.getByTestId('click-count')).toHaveTextContent('(3)')
    })
    
    test('does not call onClick when disabled', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(<Button label="Disabled" onClick={handleClick} disabled />)
      
      const button = screen.getByRole('button')
      
      await user.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })
    
    test('does not increment count when disabled', async () => {
      const user = userEvent.setup()
      render(<Button label="Disabled" disabled />)
      
      await user.click(screen.getByRole('button'))
      
      expect(screen.queryByTestId('click-count')).not.toBeInTheDocument()
    })
  })
  
  describe('Loading State', () => {
    test('shows loading text when loading', () => {
      render(<Button label="Submit" loading />)
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
      expect(screen.queryByText('Submit')).not.toBeInTheDocument()
    })
    
    test('shows loading spinner', () => {
      render(<Button label="Submit" loading />)
      
      expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
    })
    
    test('does not call onClick when loading', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(<Button label="Submit" onClick={handleClick} loading />)
      
      await user.click(screen.getByRole('button'))
      
      expect(handleClick).not.toHaveBeenCalled()
    })
    
    test('button is disabled when loading', () => {
      render(<Button label="Submit" loading />)
      
      expect(screen.getByRole('button')).toBeDisabled()
    })
    
    test('has aria-busy attribute when loading', () => {
      render(<Button label="Submit" loading />)
      
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
    })
  })
  
  describe('Disabled State', () => {
    test('button is disabled', () => {
      render(<Button label="Disabled" disabled />)
      
      expect(screen.getByRole('button')).toBeDisabled()
    })
    
    test('has disabled styles', () => {
      render(<Button label="Disabled" disabled />)
      
      const button = screen.getByTestId('custom-button')
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
    })
  })
  
  describe('Accessibility', () => {
    test('button is keyboard accessible', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(<Button label="Press me" onClick={handleClick} />)
      
      // Tab to button
      await user.tab()
      expect(screen.getByRole('button')).toHaveFocus()
      
      // Press Enter
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalled()
    })
    
    test('has proper aria attributes', () => {
      render(<Button label="Test" />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'false')
    })
  })
})
