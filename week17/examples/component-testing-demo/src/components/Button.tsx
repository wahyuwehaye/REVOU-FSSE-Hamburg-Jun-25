// Button.tsx - Simple interactive button component
import { useState } from 'react'

export interface ButtonProps {
  /** Button label text */
  label: string
  /** Click handler function */
  onClick?: () => void
  /** Whether button is disabled */
  disabled?: boolean
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'danger'
  /** Loading state */
  loading?: boolean
}

/**
 * Flexible Button component with multiple states
 * 
 * Real-world usage:
 * - Form submissions
 * - Action triggers
 * - Navigation
 */
export function Button({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
  loading = false
}: ButtonProps) {
  const [clickCount, setClickCount] = useState(0)
  
  const handleClick = () => {
    if (!disabled && !loading) {
      setClickCount(prev => prev + 1)
      onClick?.()
    }
  }
  
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600',
    secondary: 'bg-gray-500 hover:bg-gray-600',
    danger: 'bg-red-500 hover:bg-red-600'
  }
  
  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        px-4 py-2 rounded text-white font-medium
        ${variantClasses[variant]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      data-testid="custom-button"
      aria-busy={loading}
    >
      {loading ? (
        <>
          <span className="spinner" role="status" aria-label="Loading" />
          Loading...
        </>
      ) : (
        label
      )}
      {clickCount > 0 && (
        <span className="ml-2" data-testid="click-count">
          ({clickCount})
        </span>
      )}
    </button>
  )
}
