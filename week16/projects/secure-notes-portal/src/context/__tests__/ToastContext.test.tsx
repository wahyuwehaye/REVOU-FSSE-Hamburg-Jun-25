import { render, screen, renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { ToastProvider, useToast, Toast } from '../ToastContext';
import { ReactNode } from 'react';

// Wrapper for hook testing
function wrapper({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}

describe('ToastContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('useToast hook', () => {
    it('should throw error when used outside ToastProvider', () => {
      // Suppress console.error for this test
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useToast());
      }).toThrow('useToast harus dipakai dalam ToastProvider');

      spy.mockRestore();
    });

    it('should return context value when used inside ToastProvider', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.toasts).toEqual([]);
      expect(typeof result.current.push).toBe('function');
      expect(typeof result.current.dismiss).toBe('function');
      expect(typeof result.current.clear).toBe('function');
    });
  });

  describe('ToastProvider', () => {
    it('should render children', () => {
      render(
        <ToastProvider>
          <div data-testid="child">Test Child</div>
        </ToastProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should initialize with empty toasts array', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      expect(result.current.toasts).toEqual([]);
    });

    it('should render toast container', () => {
      render(
        <ToastProvider>
          <div>Content</div>
        </ToastProvider>
      );

      expect(document.querySelector('.toast-container')).toBeInTheDocument();
    });
  });

  describe('push function', () => {
    it('should add toast with generated ID', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.push({ title: 'Test Toast' });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toMatchObject({
        title: 'Test Toast',
      });
      expect(result.current.toasts[0].id).toBeDefined();
      expect(typeof result.current.toasts[0].id).toBe('string');
    });

    it('should add toast with description', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.push({
          title: 'Success',
          description: 'Operation completed successfully',
        });
      });

      expect(result.current.toasts[0]).toMatchObject({
        title: 'Success',
        description: 'Operation completed successfully',
      });
    });

    it('should add toast with variant', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.push({
          title: 'Error occurred',
          variant: 'error',
        });
      });

      expect(result.current.toasts[0].variant).toBe('error');
    });

    it('should add multiple toasts', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.push({ title: 'Toast 1' });
        result.current.push({ title: 'Toast 2' });
        result.current.push({ title: 'Toast 3' });
      });

      expect(result.current.toasts).toHaveLength(3);
      expect(result.current.toasts.map((t) => t.title)).toEqual([
        'Toast 1',
        'Toast 2',
        'Toast 3',
      ]);
    });

    it('should generate unique IDs for each toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.push({ title: 'Toast 1' });
        result.current.push({ title: 'Toast 2' });
      });

      const ids = result.current.toasts.map((t) => t.id);
      expect(ids[0]).not.toBe(ids[1]);
      expect(new Set(ids).size).toBe(2); // All IDs are unique
    });

    it('should auto-dismiss toast after 3 seconds', async () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.push({ title: 'Auto dismiss' });
      });

      expect(result.current.toasts).toHaveLength(1);

      // Fast-forward time by 3 seconds
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(result.current.toasts).toHaveLength(0);
      });
    });

    it('should auto-dismiss multiple toasts independently', async () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.push({ title: 'Toast 1' });
      });

      // Advance 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      act(() => {
        result.current.push({ title: 'Toast 2' });
      });

      expect(result.current.toasts).toHaveLength(2);

      // Advance 2 more seconds (total 3 for Toast 1)
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(result.current.toasts).toHaveLength(1);
      });

      expect(result.current.toasts[0].title).toBe('Toast 2');

      // Advance 1 more second (total 3 for Toast 2)
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(result.current.toasts).toHaveLength(0);
      });
    });

    it('should maintain callback reference stability', () => {
      const { result, rerender } = renderHook(() => useToast(), { wrapper });

      const firstPush = result.current.push;
      rerender();
      const secondPush = result.current.push;

      expect(firstPush).toBe(secondPush);
    });
  });

  describe('dismiss function', () => {
    it('should remove specific toast by ID', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      let toastId: string;

      act(() => {
        result.current.push({ title: 'Toast 1' });
        result.current.push({ title: 'Toast 2' });
        toastId = result.current.toasts[0].id;
      });

      expect(result.current.toasts).toHaveLength(2);

      act(() => {
        result.current.dismiss(toastId);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Toast 2');
    });

    it('should not affect other toasts when dismissing one', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      let middleToastId: string;

      act(() => {
        result.current.push({ title: 'Toast 1' });
        result.current.push({ title: 'Toast 2' });
        result.current.push({ title: 'Toast 3' });
        middleToastId = result.current.toasts[1].id;
      });

      act(() => {
        result.current.dismiss(middleToastId);
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts.map((t) => t.title)).toEqual([
        'Toast 1',
        'Toast 3',
      ]);
    });

    it('should handle dismissing non-existent toast gracefully', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.push({ title: 'Toast 1' });
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.dismiss('non-existent-id');
      });

      // Should still have the original toast
      expect(result.current.toasts).toHaveLength(1);
    });

    it('should maintain callback reference stability', () => {
      const { result, rerender } = renderHook(() => useToast(), { wrapper });

      const firstDismiss = result.current.dismiss;
      rerender();
      const secondDismiss = result.current.dismiss;

      expect(firstDismiss).toBe(secondDismiss);
    });
  });

  describe('clear function', () => {
    it('should remove all toasts', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.push({ title: 'Toast 1' });
        result.current.push({ title: 'Toast 2' });
        result.current.push({ title: 'Toast 3' });
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.clear();
      });

      expect(result.current.toasts).toEqual([]);
    });

    it('should work when there are no toasts', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      expect(result.current.toasts).toHaveLength(0);

      act(() => {
        result.current.clear();
      });

      expect(result.current.toasts).toEqual([]);
    });

    it('should maintain callback reference stability', () => {
      const { result, rerender } = renderHook(() => useToast(), { wrapper });

      const firstClear = result.current.clear;
      rerender();
      const secondClear = result.current.clear;

      expect(firstClear).toBe(secondClear);
    });
  });

  describe('Toast UI rendering', () => {
    it('should render toast with title', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      render(<ToastProvider><div /></ToastProvider>);

      act(() => {
        result.current.push({ title: 'Test Title' });
      });

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render toast with description when provided', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      render(<ToastProvider><div /></ToastProvider>);

      act(() => {
        result.current.push({
          title: 'Success',
          description: 'Operation completed',
        });
      });

      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Operation completed')).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      const { container } = render(<ToastProvider><div /></ToastProvider>);

      act(() => {
        result.current.push({ title: 'Simple Toast' });
      });

      const descriptionElements = container.querySelectorAll('.toast span');
      // Should only have close button, no description span
      expect(descriptionElements.length).toBe(0);
    });

    it('should render close button for each toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      render(<ToastProvider><div /></ToastProvider>);

      act(() => {
        result.current.push({ title: 'Toast 1' });
        result.current.push({ title: 'Toast 2' });
      });

      const closeButtons = screen.getAllByText('Tutup');
      expect(closeButtons).toHaveLength(2);
    });

    it('should dismiss toast when close button is clicked', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      render(<ToastProvider><div /></ToastProvider>);

      act(() => {
        result.current.push({ title: 'Dismissible Toast' });
      });

      expect(screen.getByText('Dismissible Toast')).toBeInTheDocument();

      const closeButton = screen.getByText('Tutup');
      act(() => {
        closeButton.click();
      });

      expect(screen.queryByText('Dismissible Toast')).not.toBeInTheDocument();
    });

    it('should render multiple toasts simultaneously', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      render(<ToastProvider><div /></ToastProvider>);

      act(() => {
        result.current.push({ title: 'Toast 1' });
        result.current.push({ title: 'Toast 2' });
        result.current.push({ title: 'Toast 3' });
      });

      expect(screen.getByText('Toast 1')).toBeInTheDocument();
      expect(screen.getByText('Toast 2')).toBeInTheDocument();
      expect(screen.getByText('Toast 3')).toBeInTheDocument();
    });
  });

  describe('Toast variants', () => {
    it('should handle success variant', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.push({
          title: 'Success',
          variant: 'success',
        });
      });

      expect(result.current.toasts[0].variant).toBe('success');
    });

    it('should handle error variant', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.push({
          title: 'Error',
          variant: 'error',
        });
      });

      expect(result.current.toasts[0].variant).toBe('error');
    });

    it('should handle info variant', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.push({
          title: 'Info',
          variant: 'info',
        });
      });

      expect(result.current.toasts[0].variant).toBe('info');
    });

    it('should handle toast without variant', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.push({ title: 'Default' });
      });

      expect(result.current.toasts[0].variant).toBeUndefined();
    });
  });

  describe('Integration scenarios', () => {
    it('should handle rapid consecutive toasts', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.push({ title: `Toast ${i}` });
        }
      });

      expect(result.current.toasts).toHaveLength(10);
    });

    it('should handle mixed operations (push, dismiss, clear)', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      let id1: string, id2: string;

      act(() => {
        result.current.push({ title: 'Toast 1' });
        result.current.push({ title: 'Toast 2' });
        result.current.push({ title: 'Toast 3' });
        id1 = result.current.toasts[0].id;
        id2 = result.current.toasts[1].id;
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.dismiss(id1);
      });

      expect(result.current.toasts).toHaveLength(2);

      act(() => {
        result.current.push({ title: 'Toast 4' });
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.clear();
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should handle toast lifecycle with timers', async () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.push({ title: 'Auto Toast 1' });
      });

      expect(result.current.toasts).toHaveLength(1);

      // Dismiss manually before auto-dismiss
      act(() => {
        result.current.dismiss(result.current.toasts[0].id);
      });

      expect(result.current.toasts).toHaveLength(0);

      // Timer should still fire but do nothing
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });
});
