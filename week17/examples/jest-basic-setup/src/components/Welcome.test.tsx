import { render, screen } from '@testing-library/react'
import { Welcome } from './Welcome'

describe('Welcome Component', () => {
  test('renders welcome message with name', () => {
    // Arrange & Act
    render(<Welcome name="John" />)
    
    // Assert
    expect(screen.getByRole('heading')).toHaveTextContent('Welcome, John!')
  })
  
  test('renders description paragraph', () => {
    render(<Welcome name="John" />)
    
    expect(screen.getByText('This is your first tested component.'))
      .toBeInTheDocument()
  })
  
  test('displays custom title when provided', () => {
    render(<Welcome name="Jane" title="Hello" />)
    
    expect(screen.getByRole('heading')).toHaveTextContent('Hello, Jane!')
  })
  
  test('uses default title when not provided', () => {
    render(<Welcome name="Bob" />)
    
    expect(screen.getByRole('heading')).toHaveTextContent('Welcome, Bob!')
  })
})
