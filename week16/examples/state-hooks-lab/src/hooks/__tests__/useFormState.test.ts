import { renderHook, act } from '@testing-library/react';
import { useFormState, FormErrors } from '../useFormState';

// Mock form data type
interface LoginForm {
  email: string;
  password: string;
}

describe('useFormState', () => {
  const initialValues: LoginForm = {
    email: '',
    password: '',
  };

  const mockValidate = (values: LoginForm): FormErrors<LoginForm> => {
    const errors: FormErrors<LoginForm> = {};
    if (!values.email) errors.email = 'Email is required';
    if (values.email && !values.email.includes('@')) errors.email = 'Invalid email';
    if (!values.password) errors.password = 'Password is required';
    if (values.password && values.password.length < 6) errors.password = 'Password must be at least 6 characters';
    return errors;
  };

  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues,
        onSubmit: mockOnSubmit,
      })
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.submitting).toBe(false);
    expect(result.current.isDirty).toBe(false);
  });

  it('updates form values with handleChange', () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues,
        onSubmit: mockOnSubmit,
      })
    );

    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });

    expect(result.current.values.email).toBe('test@example.com');
    expect(result.current.values.password).toBe('');
  });

  it('marks form as dirty when values change', () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues,
        onSubmit: mockOnSubmit,
      })
    );

    expect(result.current.isDirty).toBe(false);

    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });

    expect(result.current.isDirty).toBe(true);
  });

  it('validates form on submit', async () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues,
        validate: mockValidate,
        onSubmit: mockOnSubmit,
      })
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors).toEqual({
      email: 'Email is required',
      password: 'Password is required',
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form when validation passes', async () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues,
        validate: mockValidate,
        onSubmit: mockOnSubmit,
      })
    );

    // Set valid values
    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors).toEqual({});
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('sets submitting state during submission', async () => {
    const slowSubmit = jest.fn((): Promise<void> => new Promise(resolve => setTimeout(resolve, 100)));

    const { result } = renderHook(() =>
      useFormState({
        initialValues: { email: 'test@example.com', password: 'password123' },
        onSubmit: slowSubmit,
      })
    );

    expect(result.current.submitting).toBe(false);

    await act(async () => {
      await result.current.handleSubmit();
    });

    // Check submitting state after submission
    expect(result.current.submitting).toBe(false);
    expect(slowSubmit).toHaveBeenCalled();
  });

  it('resets form to initial values', async () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues,
        onSubmit: mockOnSubmit,
      })
    );

    // Change values
    await act(async () => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
    });

    expect(result.current.values).toEqual({
      email: 'test@example.com',
      password: 'password123',
    });

    // Reset
    await act(async () => {
      result.current.reset();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.isDirty).toBe(false);
  });

  it('handles validation errors correctly', async () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues,
        validate: mockValidate,
        onSubmit: mockOnSubmit,
      })
    );

    // Set invalid email
    await act(async () => {
      result.current.handleChange('email', 'invalid-email');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.email).toBe('Invalid email');
    expect(result.current.errors.password).toBe('Password is required');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles submission without validation', async () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { email: 'test@example.com', password: 'password123' },
        onSubmit: mockOnSubmit,
        // No validate function
      })
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors).toEqual({});
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('clears previous errors on resubmit', async () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues,
        validate: mockValidate,
        onSubmit: mockOnSubmit,
      })
    );

    // First submit with errors
    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors).toEqual({
      email: 'Email is required',
      password: 'Password is required',
    });

    // Fix errors
    await act(async () => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
    });

    // Submit again
    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors).toEqual({});
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
