# 06 - Testing Form Inputs and Validation

## 🎯 Tujuan Pembelajaran

Setelah mempelajari modul ini, Anda akan mampu:
- Testing form inputs dengan berbagai tipe
- Testing validation logic
- Testing error messages
- Testing form submission
- Handling async validation

## 🤔 Kenapa Form Testing Penting?

**Analogi Kehidupan Nyata:**

Bayangkan Anda mengisi formulir pendaftaran SIM. Ada petugas yang mengecek:
- KTP → Harus ada, tidak boleh kosong ✅
- Foto → Ukuran harus pas, format JPEG ✅
- Umur → Minimal 17 tahun ✅
- Formulir → Semua harus lengkap sebelum disubmit ✅

Testing form seperti menjadi "petugas QA" yang memastikan:
- User tidak bisa submit form kosong
- Error message muncul dengan jelas
- Validation berjalan dengan benar
- Data yang di-submit sesuai format

## 📝 Contoh Real-World: Registration Form

### Component Implementation

```typescript
// RegistrationForm.tsx
import { useState } from 'react'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  age: number
  terms: boolean
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  age?: string
  terms?: string
}

export function RegistrationForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: 0,
    terms: false
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return 'Name is required'
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters'
    }
    return undefined
  }
  
  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'Email is required'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email'
    }
    return undefined
  }
  
  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required'
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number'
    }
    return undefined
  }
  
  const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
    if (!confirmPassword) {
      return 'Please confirm your password'
    }
    if (confirmPassword !== password) {
      return 'Passwords do not match'
    }
    return undefined
  }
  
  const validateAge = (age: number): string | undefined => {
    if (!age || age === 0) {
      return 'Age is required'
    }
    if (age < 13) {
      return 'You must be at least 13 years old'
    }
    if (age > 120) {
      return 'Please enter a valid age'
    }
    return undefined
  }
  
  const validateTerms = (terms: boolean): string | undefined => {
    if (!terms) {
      return 'You must accept the terms and conditions'
    }
    return undefined
  }
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
      age: validateAge(formData.age),
      terms: validateTerms(formData.terms)
    }
    
    // Remove undefined errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key as keyof FormErrors]) {
        delete newErrors[key as keyof FormErrors]
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' 
      ? e.target.checked 
      : e.target.type === 'number'
      ? parseInt(e.target.value) || 0
      : e.target.value
    
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }
  
  const handleBlur = (field: keyof FormData) => () => {
    // Validate on blur
    let error: string | undefined
    
    switch (field) {
      case 'name':
        error = validateName(formData.name)
        break
      case 'email':
        error = validateEmail(formData.email)
        break
      case 'password':
        error = validatePassword(formData.password)
        break
      case 'confirmPassword':
        error = validateConfirmPassword(formData.confirmPassword, formData.password)
        break
      case 'age':
        error = validateAge(formData.age)
        break
      case 'terms':
        error = validateTerms(formData.terms)
        break
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitSuccess(false)
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      setSubmitSuccess(true)
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: 0,
        terms: false
      })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Create Account</h2>
      
      {/* Name Field */}
      <div>
        <label htmlFor="name">Full Name *</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleChange('name')}
          onBlur={handleBlur('name')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <div id="name-error" role="alert" className="error">
            {errors.name}
          </div>
        )}
      </div>
      
      {/* Email Field */}
      <div>
        <label htmlFor="email">Email Address *</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <div id="email-error" role="alert" className="error">
            {errors.email}
          </div>
        )}
      </div>
      
      {/* Password Field */}
      <div>
        <label htmlFor="password">Password *</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error password-help' : 'password-help'}
        />
        <div id="password-help" className="help-text">
          Must be at least 8 characters with 1 uppercase and 1 number
        </div>
        {errors.password && (
          <div id="password-error" role="alert" className="error">
            {errors.password}
          </div>
        )}
      </div>
      
      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
        />
        {errors.confirmPassword && (
          <div id="confirm-password-error" role="alert" className="error">
            {errors.confirmPassword}
          </div>
        )}
      </div>
      
      {/* Age Field */}
      <div>
        <label htmlFor="age">Age *</label>
        <input
          id="age"
          type="number"
          value={formData.age || ''}
          onChange={handleChange('age')}
          onBlur={handleBlur('age')}
          min="1"
          max="120"
          aria-invalid={!!errors.age}
          aria-describedby={errors.age ? 'age-error' : undefined}
        />
        {errors.age && (
          <div id="age-error" role="alert" className="error">
            {errors.age}
          </div>
        )}
      </div>
      
      {/* Terms Checkbox */}
      <div>
        <label>
          <input
            id="terms"
            type="checkbox"
            checked={formData.terms}
            onChange={handleChange('terms')}
            aria-invalid={!!errors.terms}
            aria-describedby={errors.terms ? 'terms-error' : undefined}
          />
          I agree to the Terms and Conditions *
        </label>
        {errors.terms && (
          <div id="terms-error" role="alert" className="error">
            {errors.terms}
          </div>
        )}
      </div>
      
      {/* Submit Error */}
      {submitError && (
        <div role="alert" className="submit-error">
          {submitError}
        </div>
      )}
      
      {/* Success Message */}
      {submitSuccess && (
        <div role="status" className="success">
          Registration successful! Welcome aboard!
        </div>
      )}
      
      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  )
}
```

### Comprehensive Tests

```typescript
// RegistrationForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegistrationForm } from './RegistrationForm'

describe('RegistrationForm', () => {
  const mockOnSubmit = jest.fn()
  
  beforeEach(() => {
    mockOnSubmit.mockClear()
    mockOnSubmit.mockResolvedValue(undefined)
  })
  
  describe('Initial Render', () => {
    test('renders all form fields', () => {
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/age/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/terms and conditions/i)).toBeInTheDocument()
    })
    
    test('renders submit button', () => {
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })
    
    test('all fields are initially empty', () => {
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      expect(screen.getByLabelText(/full name/i)).toHaveValue('')
      expect(screen.getByLabelText(/email/i)).toHaveValue('')
      expect(screen.getByLabelText(/^password/i)).toHaveValue('')
      expect(screen.getByLabelText(/confirm/i)).toHaveValue('')
      expect(screen.getByLabelText(/age/i)).toHaveValue(null)
      expect(screen.getByLabelText(/terms/i)).not.toBeChecked()
    })
  })
  
  describe('User Input', () => {
    test('user can type in name field', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const nameInput = screen.getByLabelText(/full name/i)
      await user.type(nameInput, 'John Doe')
      
      expect(nameInput).toHaveValue('John Doe')
    })
    
    test('user can type in email field', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'john@example.com')
      
      expect(emailInput).toHaveValue('john@example.com')
    })
    
    test('user can type in password fields', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmInput = screen.getByLabelText(/confirm password/i)
      
      await user.type(passwordInput, 'Password123')
      await user.type(confirmInput, 'Password123')
      
      expect(passwordInput).toHaveValue('Password123')
      expect(confirmInput).toHaveValue('Password123')
    })
    
    test('user can enter age', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const ageInput = screen.getByLabelText(/age/i)
      await user.type(ageInput, '25')
      
      expect(ageInput).toHaveValue(25)
    })
    
    test('user can check terms checkbox', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const termsCheckbox = screen.getByLabelText(/terms/i)
      await user.click(termsCheckbox)
      
      expect(termsCheckbox).toBeChecked()
    })
  })
  
  describe('Validation - Name Field', () => {
    test('shows error when name is empty on blur', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const nameInput = screen.getByLabelText(/full name/i)
      
      // Focus and blur without typing
      await user.click(nameInput)
      await user.tab()
      
      expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
    })
    
    test('shows error when name is too short', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const nameInput = screen.getByLabelText(/full name/i)
      
      await user.type(nameInput, 'J')
      await user.tab()
      
      expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument()
    })
    
    test('clears error when user starts typing valid name', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const nameInput = screen.getByLabelText(/full name/i)
      
      // Trigger error
      await user.click(nameInput)
      await user.tab()
      expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
      
      // Fix error
      await user.type(nameInput, 'John')
      
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument()
    })
  })
  
  describe('Validation - Email Field', () => {
    test('shows error for invalid email format', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const emailInput = screen.getByLabelText(/email/i)
      
      await user.type(emailInput, 'notanemail')
      await user.tab()
      
      expect(await screen.findByText(/valid email/i)).toBeInTheDocument()
    })
    
    test('accepts valid email', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const emailInput = screen.getByLabelText(/email/i)
      
      await user.type(emailInput, 'john@example.com')
      await user.tab()
      
      expect(screen.queryByText(/valid email/i)).not.toBeInTheDocument()
    })
  })
  
  describe('Validation - Password Field', () => {
    test('shows error when password is too short', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const passwordInput = screen.getByLabelText(/^password/i)
      
      await user.type(passwordInput, 'Pass1')
      await user.tab()
      
      expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument()
    })
    
    test('shows error when password has no uppercase', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const passwordInput = screen.getByLabelText(/^password/i)
      
      await user.type(passwordInput, 'password123')
      await user.tab()
      
      expect(await screen.findByText(/uppercase letter/i)).toBeInTheDocument()
    })
    
    test('shows error when password has no number', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const passwordInput = screen.getByLabelText(/^password/i)
      
      await user.type(passwordInput, 'Password')
      await user.tab()
      
      expect(await screen.findByText(/one number/i)).toBeInTheDocument()
    })
    
    test('accepts valid password', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const passwordInput = screen.getByLabelText(/^password/i)
      
      await user.type(passwordInput, 'Password123')
      await user.tab()
      
      // Should not show any password errors
      expect(screen.queryByText(/at least 8 characters/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/uppercase/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/number/i)).not.toBeInTheDocument()
    })
  })
  
  describe('Validation - Confirm Password', () => {
    test('shows error when passwords do not match', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmInput = screen.getByLabelText(/confirm/i)
      
      await user.type(passwordInput, 'Password123')
      await user.type(confirmInput, 'Password456')
      await user.tab()
      
      expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument()
    })
    
    test('no error when passwords match', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmInput = screen.getByLabelText(/confirm/i)
      
      await user.type(passwordInput, 'Password123')
      await user.type(confirmInput, 'Password123')
      await user.tab()
      
      expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument()
    })
  })
  
  describe('Validation - Age Field', () => {
    test('shows error when age is too young', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const ageInput = screen.getByLabelText(/age/i)
      
      await user.type(ageInput, '12')
      await user.tab()
      
      expect(await screen.findByText(/at least 13 years old/i)).toBeInTheDocument()
    })
    
    test('shows error when age is unrealistic', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const ageInput = screen.getByLabelText(/age/i)
      
      await user.type(ageInput, '150')
      await user.tab()
      
      expect(await screen.findByText(/valid age/i)).toBeInTheDocument()
    })
    
    test('accepts valid age', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const ageInput = screen.getByLabelText(/age/i)
      
      await user.type(ageInput, '25')
      await user.tab()
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })
  
  describe('Validation - Terms Checkbox', () => {
    test('shows error when trying to submit without accepting terms', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      // Fill all fields except terms
      await fillValidForm(user, { terms: false })
      
      // Try to submit
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      expect(await screen.findByText(/must accept.*terms/i)).toBeInTheDocument()
    })
  })
  
  describe('Form Submission', () => {
    test('submits form with valid data', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      // Fill form with valid data
      await fillValidForm(user)
      
      // Submit
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123',
          confirmPassword: 'Password123',
          age: 25,
          terms: true
        })
      })
    })
    
    test('shows loading state during submission', async () => {
      const user = userEvent.setup()
      const slowSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(<RegistrationForm onSubmit={slowSubmit} />)
      
      await fillValidForm(user)
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      const submitPromise = user.click(submitButton)
      
      // Should show loading text
      expect(await screen.findByRole('button', { name: /creating account/i })).toBeInTheDocument()
      
      // Button should be disabled
      expect(submitButton).toBeDisabled()
      
      await submitPromise
      
      // Back to normal after completion
      expect(screen.getByRole('button', { name: /create account/i })).toBeEnabled()
    })
    
    test('displays success message after successful submission', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      await fillValidForm(user)
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      expect(await screen.findByText(/registration successful/i)).toBeInTheDocument()
    })
    
    test('clears form after successful submission', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      await fillValidForm(user)
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
      
      // All fields should be cleared
      expect(screen.getByLabelText(/full name/i)).toHaveValue('')
      expect(screen.getByLabelText(/email/i)).toHaveValue('')
      expect(screen.getByLabelText(/^password/i)).toHaveValue('')
      expect(screen.getByLabelText(/confirm/i)).toHaveValue('')
      expect(screen.getByLabelText(/age/i)).toHaveValue(null)
      expect(screen.getByLabelText(/terms/i)).not.toBeChecked()
    })
    
    test('displays error message when submission fails', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockRejectedValueOnce(new Error('Email already exists'))
      
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      await fillValidForm(user)
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      expect(await screen.findByText(/email already exists/i)).toBeInTheDocument()
    })
    
    test('does not submit with invalid data', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      // Try to submit empty form
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      // Should not call onSubmit
      expect(mockOnSubmit).not.toHaveBeenCalled()
      
      // Should show validation errors
      expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })
  
  describe('Accessibility', () => {
    test('error messages are associated with inputs', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      const nameInput = screen.getByLabelText(/full name/i)
      
      await user.click(nameInput)
      await user.tab()
      
      const errorMessage = await screen.findByText(/name is required/i)
      const errorId = errorMessage.getAttribute('id')
      
      expect(nameInput).toHaveAttribute('aria-describedby', expect.stringContaining(errorId!))
      expect(nameInput).toHaveAttribute('aria-invalid', 'true')
    })
    
    test('form can be navigated with keyboard', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm onSubmit={mockOnSubmit} />)
      
      // Tab through form
      await user.tab()
      expect(screen.getByLabelText(/full name/i)).toHaveFocus()
      
      await user.tab()
      expect(screen.getByLabelText(/email/i)).toHaveFocus()
      
      await user.tab()
      expect(screen.getByLabelText(/^password/i)).toHaveFocus()
    })
  })
})

// Helper function
async function fillValidForm(user: ReturnType<typeof userEvent.setup>, overrides = {}) {
  const defaults = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password123',
    confirmPassword: 'Password123',
    age: '25',
    terms: true
  }
  
  const data = { ...defaults, ...overrides }
  
  await user.type(screen.getByLabelText(/full name/i), data.name)
  await user.type(screen.getByLabelText(/email/i), data.email)
  await user.type(screen.getByLabelText(/^password/i), data.password)
  await user.type(screen.getByLabelText(/confirm/i), data.confirmPassword)
  await user.type(screen.getByLabelText(/age/i), data.age)
  
  if (data.terms) {
    await user.click(screen.getByLabelText(/terms/i))
  }
}
```

## 💡 Key Takeaways

1. ✅ **Test validation pada setiap field** - Empty, format, length
2. ✅ **Test error messages** - Muncul dan hilang dengan benar
3. ✅ **Test form submission** - Happy path dan error cases
4. ✅ **Test loading states** - Disabled button, loading text
5. ✅ **Test accessibility** - ARIA attributes, keyboard navigation
6. ✅ **Use helper functions** - DRY untuk fill form
7. ✅ **Test real user flow** - Type, blur, submit

## 🎯 Practice Exercise

Buat form "Contact Us" dengan:
- Name, Email, Subject, Message fields
- All required validation
- Character limits
- Submit functionality
- Success/Error states
- Comprehensive tests

---

**Next:** [07 - Testing Dynamic UI Updates](./07-testing-ui-updates.md)
