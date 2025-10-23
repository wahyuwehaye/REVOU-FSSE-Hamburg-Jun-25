import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { useSecureFetch } from '../useSecureFetch';
import { z } from 'zod';

// Mock fetch globally
global.fetch = jest.fn();

describe('useSecureFetch Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with null data and start loading', () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ message: 'success' }),
      });

      const { result } = renderHook(() => useSecureFetch('/api/test'));

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should provide refetch function', () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      const { result } = renderHook(() => useSecureFetch('/api/test'));

      expect(typeof result.current.refetch).toBe('function');
    });
  });

  describe('Successful data fetching', () => {
    it('should fetch data successfully without schema', async () => {
      const mockData = { id: 1, name: 'Test' };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() => useSecureFetch('/api/test'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        credentials: 'include',
        cache: 'no-store',
      });
    });

    it('should fetch and validate data with Zod schema', async () => {
      const schema = z.object({
        id: z.number(),
        email: z.string().email(),
      });

      const mockData = { id: 1, email: 'test@example.com' };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() =>
        useSecureFetch('/api/user', schema)
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    it('should fetch array data', async () => {
      const mockData = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() => useSecureFetch<Array<{ id: number; name: string }>>('/api/items'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(Array.isArray(result.current.data)).toBe(true);
      expect(result.current.data).toHaveLength(2);
    });
  });

  describe('Error handling', () => {
    it('should handle HTTP errors (404)', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
      });

      const { result } = renderHook(() => useSecureFetch('/api/notfound'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe('HTTP 404');
    });

    it('should handle HTTP errors (500)', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      });

      const { result } = renderHook(() => useSecureFetch('/api/server-error'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('HTTP 500');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useSecureFetch('/api/test'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe('Network error');
    });

    it('should handle unknown errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue('Unknown error string');

      const { result } = renderHook(() => useSecureFetch('/api/test'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Unknown error');
    });

    it('should handle Zod validation errors', async () => {
      const schema = z.object({
        id: z.number(),
        email: z.string().email(),
      });

      const invalidData = { id: 'not-a-number', email: 'invalid-email' };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => invalidData,
      });

      const { result } = renderHook(() =>
        useSecureFetch('/api/user', schema)
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toContain('Expected number');
    });
  });

  describe('Loading state', () => {
    it('should set loading to true during fetch', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      (global.fetch as jest.Mock).mockReturnValue(promise);

      const { result } = renderHook(() => useSecureFetch('/api/test'));

      // Should be loading immediately
      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      // Resolve the promise
      await act(async () => {
        resolvePromise!({
          ok: true,
          json: async () => ({ success: true }),
        });
        await promise;
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should reset loading state after fetch completes', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test' }),
      });

      const { result } = renderHook(() => useSecureFetch('/api/test'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual({ data: 'test' });
    });

    it('should reset loading state even when fetch fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Failed'));

      const { result } = renderHook(() => useSecureFetch('/api/test'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Failed');
    });
  });

  describe('refetch functionality', () => {
    it('should refetch data when refetch is called', async () => {
      const mockData1 = { count: 1 };
      const mockData2 = { count: 2 };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData2,
        });

      const { result } = renderHook(() => useSecureFetch('/api/counter'));

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData1);
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Call refetch
      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData2);
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should clear previous error on refetch', async () => {
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

      const { result } = renderHook(() => useSecureFetch('/api/test'));

      await waitFor(() => {
        expect(result.current.error).toBe('First error');
      });

      // Refetch should clear error
      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.data).toEqual({ success: true });
      });
    });

    it('should set loading state during refetch', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test' }),
      });

      const { result } = renderHook(() => useSecureFetch('/api/test'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Start refetch
      let refetchPromise: Promise<void>;
      await act(async () => {
        refetchPromise = result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await refetchPromise!;
    });
  });

  describe('Endpoint changes', () => {
    it('should refetch when endpoint changes', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test' }),
      });

      const { result, rerender } = renderHook(
        ({ endpoint }) => useSecureFetch(endpoint),
        {
          initialProps: { endpoint: '/api/endpoint1' },
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/endpoint1', {
        credentials: 'include',
        cache: 'no-store',
      });

      // Change endpoint
      rerender({ endpoint: '/api/endpoint2' });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/endpoint2', {
          credentials: 'include',
          cache: 'no-store',
        });
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Fetch options', () => {
    it('should include credentials in fetch request', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      renderHook(() => useSecureFetch('/api/test'));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/test', {
          credentials: 'include',
          cache: 'no-store',
        });
      });
    });

    it('should disable caching in fetch request', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      renderHook(() => useSecureFetch('/api/test'));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            cache: 'no-store',
          })
        );
      });
    });
  });

  describe('Complex data scenarios', () => {
    it('should handle nested object responses', async () => {
      const complexData = {
        user: {
          id: 1,
          profile: {
            name: 'Test User',
            settings: {
              theme: 'dark',
              notifications: true,
            },
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => complexData,
      });

      const { result } = renderHook(() => useSecureFetch('/api/user'));

      await waitFor(() => {
        expect(result.current.data).toEqual(complexData);
      });

      expect(result.current.data).toHaveProperty('user.profile.settings.theme', 'dark');
    });

    it('should handle empty responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => null,
      });

      const { result } = renderHook(() => useSecureFetch('/api/empty'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should handle array with schema validation', async () => {
      const itemSchema = z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          completed: z.boolean(),
        })
      );

      const mockData = [
        { id: '1', title: 'Task 1', completed: true },
        { id: '2', title: 'Task 2', completed: false },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() =>
        useSecureFetch('/api/tasks', itemSchema)
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      expect(result.current.data).toHaveLength(2);
    });
  });
});
