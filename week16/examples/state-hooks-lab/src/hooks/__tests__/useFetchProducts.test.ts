import { renderHook, waitFor } from '@testing-library/react';
import { useFetchProducts } from '../useFetchProducts';
import { act } from 'react';

// Mock fetch globally
global.fetch = jest.fn();

describe('useFetchProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with idle status', () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const { result } = renderHook(() => useFetchProducts('/api/products'));

    // Initial state before useEffect runs
    expect(result.current.status).toBe('loading');
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('fetches data successfully', async () => {
    const mockData = [
      { id: '1', name: 'Product 1', price: 100 },
      { id: '2', name: 'Product 2', price: 200 },
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useFetchProducts('/api/products'));

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith('/api/products', { cache: 'no-store' });
  });

  it('handles fetch error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useFetchProducts('/api/products'));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe('HTTP 404');
  });

  it('handles network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useFetchProducts('/api/products'));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe('Network error');
  });

  it('handles unknown error', async () => {
    (global.fetch as jest.Mock).mockRejectedValue('Unknown error');

    const { result } = renderHook(() => useFetchProducts('/api/products'));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.error).toBe('Unknown error');
  });

  it('refetches data when refetch is called', async () => {
    const mockData = [{ id: '1', name: 'Product 1', price: 100 }];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useFetchProducts('/api/products'));

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Call refetch
    await act(async () => {
      await result.current.refetch();
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('refetches when endpoint changes', async () => {
    const mockData = [{ id: '1', name: 'Product 1', price: 100 }];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result, rerender } = renderHook(
      ({ endpoint }) => useFetchProducts(endpoint),
      {
        initialProps: { endpoint: '/api/products' },
      }
    );

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/products', { cache: 'no-store' });

    // Change endpoint
    rerender({ endpoint: '/api/users' });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/users', { cache: 'no-store' });
    });
  });

  it('sets loading status during fetch', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (global.fetch as jest.Mock).mockReturnValue(promise);

    const { result } = renderHook(() => useFetchProducts('/api/products'));

    // Should be loading immediately
    await waitFor(() => {
      expect(result.current.status).toBe('loading');
    });

    // Resolve the promise
    await act(async () => {
      resolvePromise!({
        ok: true,
        json: async () => [],
      });
      await promise;
    });

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });
  });
});
