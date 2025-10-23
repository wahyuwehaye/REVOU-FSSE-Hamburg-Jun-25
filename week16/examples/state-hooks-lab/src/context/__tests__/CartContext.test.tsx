import { renderHook } from '@testing-library/react';
import { CartProvider, useCartContext, CartItem } from '../CartContext';
import { act } from 'react';
import { ReactNode } from 'react';

// Wrapper provider for testing
function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe('CartContext', () => {
  describe('useCartContext', () => {
    it('throws error when used outside CartProvider', () => {
      // Suppress console.error for this test
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useCartContext());
      }).toThrow('useCartContext harus dipakai di dalam CartProvider');

      spy.mockRestore();
    });

    it('returns context value when used inside CartProvider', () => {
      const { result } = renderHook(() => useCartContext(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.state).toBeDefined();
      expect(typeof result.current.addItem).toBe('function');
      expect(typeof result.current.removeItem).toBe('function');
      expect(typeof result.current.clear).toBe('function');
    });
  });

  describe('CartProvider', () => {
    it('initializes with empty cart', () => {
      const { result } = renderHook(() => useCartContext(), { wrapper });

      expect(result.current.state.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPrice).toBe(0);
    });

    it('adds item to cart', () => {
      const { result } = renderHook(() => useCartContext(), { wrapper });

      act(() => {
        result.current.addItem({ id: '1', name: 'Product 1', price: 100 });
      });

      expect(result.current.state.items).toHaveLength(1);
      expect(result.current.state.items[0]).toEqual({
        id: '1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      });
      expect(result.current.totalItems).toBe(1);
      expect(result.current.totalPrice).toBe(100);
    });

    it('increments quantity when adding existing item', () => {
      const { result } = renderHook(() => useCartContext(), { wrapper });

      act(() => {
        result.current.addItem({ id: '1', name: 'Product 1', price: 100 });
        result.current.addItem({ id: '1', name: 'Product 1', price: 100 });
      });

      expect(result.current.state.items).toHaveLength(1);
      expect(result.current.state.items[0].quantity).toBe(2);
      expect(result.current.totalItems).toBe(2);
      expect(result.current.totalPrice).toBe(200);
    });

    it('adds multiple different items', () => {
      const { result } = renderHook(() => useCartContext(), { wrapper });

      act(() => {
        result.current.addItem({ id: '1', name: 'Product 1', price: 100 });
        result.current.addItem({ id: '2', name: 'Product 2', price: 200 });
      });

      expect(result.current.state.items).toHaveLength(2);
      expect(result.current.totalItems).toBe(2);
      expect(result.current.totalPrice).toBe(300);
    });

    it('removes item from cart', () => {
      const { result } = renderHook(() => useCartContext(), { wrapper });

      act(() => {
        result.current.addItem({ id: '1', name: 'Product 1', price: 100 });
        result.current.addItem({ id: '2', name: 'Product 2', price: 200 });
      });

      act(() => {
        result.current.removeItem('1');
      });

      expect(result.current.state.items).toHaveLength(1);
      expect(result.current.state.items[0].id).toBe('2');
      expect(result.current.totalItems).toBe(1);
      expect(result.current.totalPrice).toBe(200);
    });

    it('clears cart', () => {
      const { result } = renderHook(() => useCartContext(), { wrapper });

      act(() => {
        result.current.addItem({ id: '1', name: 'Product 1', price: 100 });
        result.current.addItem({ id: '2', name: 'Product 2', price: 200 });
      });

      expect(result.current.state.items).toHaveLength(2);

      act(() => {
        result.current.clear();
      });

      expect(result.current.state.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPrice).toBe(0);
    });

    it('calculates total price correctly with quantities', () => {
      const { result } = renderHook(() => useCartContext(), { wrapper });

      act(() => {
        result.current.addItem({ id: '1', name: 'Product 1', price: 100 });
        result.current.addItem({ id: '1', name: 'Product 1', price: 100 });
        result.current.addItem({ id: '2', name: 'Product 2', price: 50 });
      });

      // Product 1: 100 * 2 = 200
      // Product 2: 50 * 1 = 50
      // Total: 250
      expect(result.current.totalItems).toBe(3);
      expect(result.current.totalPrice).toBe(250);
    });

    it('handles removing non-existent item gracefully', () => {
      const { result } = renderHook(() => useCartContext(), { wrapper });

      act(() => {
        result.current.addItem({ id: '1', name: 'Product 1', price: 100 });
      });

      act(() => {
        result.current.removeItem('999');
      });

      // Should still have the original item
      expect(result.current.state.items).toHaveLength(1);
      expect(result.current.state.items[0].id).toBe('1');
    });

    it('maintains referential stability of callbacks', () => {
      const { result, rerender } = renderHook(() => useCartContext(), { wrapper });

      const addItemRef1 = result.current.addItem;
      const removeItemRef1 = result.current.removeItem;
      const clearRef1 = result.current.clear;

      // Trigger a re-render
      rerender();

      const addItemRef2 = result.current.addItem;
      const removeItemRef2 = result.current.removeItem;
      const clearRef2 = result.current.clear;

      // Callbacks should maintain the same reference
      expect(addItemRef1).toBe(addItemRef2);
      expect(removeItemRef1).toBe(removeItemRef2);
      expect(clearRef1).toBe(clearRef2);
    });
  });
});
