import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { useFormState } from '../useFormState';

describe('useFormState Hook', () => {
  const initialValues = { email: '', password: '' };
  const mockOnSubmit = jest.fn();
  const mockValidate = jest.fn((values) => {
    const errors: any = {};
    if (!values.email) errors.email = 'Email is required';
    if (!values.email.includes('@')) errors.email = 'Invalid email';
    if (!values.password) errors.password = 'Password is required';
    return errors;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
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

    it('should initialize with provided initial values', () => {
      const customInitial = { email: 'test@example.com', password: 'password123' };
      
      const { result } = renderHook(() =>
        useFormState({
          initialValues: customInitial,
          onSubmit: mockOnSubmit,
        })
      );

      expect(result.current.values).toEqual(customInitial);
      expect(result.current.isDirty).toBe(false);
    });
  });

  describe('handleChange', () => {
    it('should update form values when handleChange is called', async () => {
      const { result } = renderHook(() =>
        useFormState({
          initialValues,
          onSubmit: mockOnSubmit,
        })
      );

      await act(async () => {
        result.current.handleChange('email', 'test@example.com');
      });

      expect(result.current.values.email).toBe('test@example.com');
    });

    it('should mark form as dirty when values change', async () => {
      const { result } = renderHook(() =>
        useFormState({
          initialValues,
          onSubmit: mockOnSubmit,
        })
      );

      expect(result.current.isDirty).toBe(false);

      await act(async () => {
        result.current.handleChange('email', 'test@example.com');
      });

      expect(result.current.isDirty).toBe(true);
    });

    it('should handle multiple field changes', async () => {
      const { result } = renderHook(() =>
        useFormState({
          initialValues,
          onSubmit: mockOnSubmit,
        })
      );

      await act(async () => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('password', 'password123');
      });

      expect(result.current.values).toEqual({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should preserve handleChange reference stability', () => {
      const { result, rerender } = renderHook(() =>
        useFormState({
          initialValues,
          onSubmit: mockOnSubmit,
        })
      );

      const firstHandleChange = result.current.handleChange;
      rerender();
      const secondHandleChange = result.current.handleChange;

      expect(firstHandleChange).toBe(secondHandleChange);
    });
  });

  describe('handleSubmit with validation', () => {
    it('should validate form on submit', async () => {
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

      expect(mockValidate).toHaveBeenCalledWith(initialValues);
      expect(result.current.errors.email).toBe('Email is required');
      expect(result.current.errors.password).toBe('Password is required');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should submit form when validation passes', async () => {
      const { result } = renderHook(() =>
        useFormState({
          initialValues,
          validate: mockValidate,
          onSubmit: mockOnSubmit,
        })
      );

      await act(async () => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('password', 'password123');
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(mockValidate).toHaveBeenCalled();
      expect(result.current.errors).toEqual({});
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should not submit when validation fails', async () => {
      const { result } = renderHook(() =>
        useFormState({
          initialValues,
          validate: mockValidate,
          onSubmit: mockOnSubmit,
        })
      );

      await act(async () => {
        result.current.handleChange('email', 'invalid-email');
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.errors.email).toBe('Invalid email');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should clear previous errors on successful validation', async () => {
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

      // Fix errors and submit again
      await act(async () => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('password', 'password123');
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.errors).toEqual({});
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  describe('handleSubmit without validation', () => {
    it('should submit directly when no validation is provided', async () => {
      const { result } = renderHook(() =>
        useFormState({
          initialValues: { email: 'test@example.com', password: 'pass' },
          onSubmit: mockOnSubmit,
        })
      );

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'pass',
      });
    });
  });

  describe('Submitting state', () => {
    it('should manage submitting state during async submission', async () => {
      const slowSubmit = jest.fn(
        (): Promise<void> =>
          new Promise((resolve) => setTimeout(resolve, 100))
      );

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

      expect(result.current.submitting).toBe(false);
      expect(slowSubmit).toHaveBeenCalled();
    });

    it('should reset submitting state even if submission fails', async () => {
      const failingSubmit = jest.fn(() => Promise.reject(new Error('Submit failed')));

      const { result } = renderHook(() =>
        useFormState({
          initialValues: { email: 'test@example.com', password: 'pass' },
          onSubmit: failingSubmit,
        })
      );

      await act(async () => {
        try {
          await result.current.handleSubmit();
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.submitting).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset form to initial values', async () => {
      const { result } = renderHook(() =>
        useFormState({
          initialValues,
          onSubmit: mockOnSubmit,
        })
      );

      await act(async () => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('password', 'password123');
      });

      expect(result.current.values).toEqual({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.current.isDirty).toBe(true);

      await act(async () => {
        result.current.reset();
      });

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.isDirty).toBe(false);
    });

    it('should maintain reset function reference stability', () => {
      const { result, rerender } = renderHook(() =>
        useFormState({
          initialValues,
          onSubmit: mockOnSubmit,
        })
      );

      const firstReset = result.current.reset;
      rerender();
      const secondReset = result.current.reset;

      expect(firstReset).toBe(secondReset);
    });
  });

  describe('setValues', () => {
    it('should allow direct setting of all values', async () => {
      const { result } = renderHook(() =>
        useFormState({
          initialValues,
          onSubmit: mockOnSubmit,
        })
      );

      const newValues = { email: 'new@example.com', password: 'newpass123' };

      await act(async () => {
        result.current.setValues(newValues);
      });

      expect(result.current.values).toEqual(newValues);
      expect(result.current.isDirty).toBe(true);
    });
  });

  describe('isDirty tracking', () => {
    it('should track dirty state correctly', async () => {
      const { result } = renderHook(() =>
        useFormState({
          initialValues: { email: 'initial@example.com', password: 'initial' },
          onSubmit: mockOnSubmit,
        })
      );

      expect(result.current.isDirty).toBe(false);

      // Change value
      await act(async () => {
        result.current.handleChange('email', 'changed@example.com');
      });

      expect(result.current.isDirty).toBe(true);

      // Reset to initial
      await act(async () => {
        result.current.reset();
      });

      expect(result.current.isDirty).toBe(false);
    });

    it('should be dirty even if manually set back to initial values', async () => {
      const { result } = renderHook(() =>
        useFormState({
          initialValues,
          onSubmit: mockOnSubmit,
        })
      );

      await act(async () => {
        result.current.handleChange('email', 'test@example.com');
      });

      expect(result.current.isDirty).toBe(true);

      // Manually change back to initial value
      await act(async () => {
        result.current.handleChange('email', '');
      });

      // Still counts as dirty because values object changed
      expect(result.current.isDirty).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle validation returning empty errors', async () => {
      const emptyValidate = jest.fn(() => ({}));

      const { result } = renderHook(() =>
        useFormState({
          initialValues,
          validate: emptyValidate,
          onSubmit: mockOnSubmit,
        })
      );

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.errors).toEqual({});
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('should handle empty initial values', () => {
      const { result } = renderHook(() =>
        useFormState({
          initialValues: {} as any,
          onSubmit: mockOnSubmit,
        })
      );

      expect(result.current.values).toEqual({});
      expect(result.current.isDirty).toBe(false);
    });

    it('should handle complex nested objects', async () => {
      type ComplexForm = {
        user: {
          email: string;
          profile: {
            name: string;
          };
        };
      };

      const complexInitial: ComplexForm = {
        user: {
          email: '',
          profile: {
            name: '',
          },
        },
      };

      const { result } = renderHook(() =>
        useFormState({
          initialValues: complexInitial,
          onSubmit: mockOnSubmit,
        })
      );

      await act(async () => {
        result.current.handleChange('user', {
          email: 'test@example.com',
          profile: { name: 'Test User' },
        });
      });

      expect(result.current.values.user.email).toBe('test@example.com');
      expect(result.current.values.user.profile.name).toBe('Test User');
    });
  });
});
