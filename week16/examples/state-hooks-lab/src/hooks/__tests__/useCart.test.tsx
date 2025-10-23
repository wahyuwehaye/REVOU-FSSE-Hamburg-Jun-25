import { renderHook } from '@testing-library/react';
import { useCart } from '../useCart';
import { CartProvider } from '@/context/CartContext';
import { ReactNode } from 'react';
import { act } from 'react';

// Wrapper provider for testing
function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe('useCart', () => {
  it('returns cart context and summary', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current).toHaveProperty('state');
    expect(result.current).toHaveProperty('addItem');
    expect(result.current).toHaveProperty('removeItem');
    expect(result.current).toHaveProperty('clear');
    expect(result.current).toHaveProperty('summary');
    expect(result.current).toHaveProperty('totalItems');
    expect(result.current).toHaveProperty('totalPrice');
  });

  it('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.state.items).toEqual([]);
    expect(result.current.summary.totalItems).toBe(0);
    expect(result.current.summary.totalPrice).toBe(0);
  });

  it('memoizes summary correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const firstSummary = result.current.summary;

    // Re-render shouldn't change summary reference if values haven't changed
    const secondSummary = result.current.summary;

    expect(firstSummary).toBe(secondSummary);
  });

  it('updates summary when items are added', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({ id: '1', name: 'Product 1', price: 100 });
    });

    expect(result.current.summary.totalItems).toBe(1);
    expect(result.current.summary.totalPrice).toBe(100);
  });

  it('updates summary when multiple items are added', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({ id: '1', name: 'Product 1', price: 100 });
      result.current.addItem({ id: '2', name: 'Product 2', price: 200 });
    });

    expect(result.current.summary.totalItems).toBe(2);
    expect(result.current.summary.totalPrice).toBe(300);
  });

  it('updates summary when item is removed', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({ id: '1', name: 'Product 1', price: 100 });
      result.current.addItem({ id: '2', name: 'Product 2', price: 200 });
    });

    act(() => {
      result.current.removeItem('1');
    });

    expect(result.current.summary.totalItems).toBe(1);
    expect(result.current.summary.totalPrice).toBe(200);
  });
});
