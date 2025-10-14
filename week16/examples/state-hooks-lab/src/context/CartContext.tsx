"use client";

import { createContext, useCallback, useContext, useMemo, useReducer } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD"; payload: CartItem }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "CLEAR" };

type CartContextValue = {
  state: CartState;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const initialState: CartState = {
  items: [],
};

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE":
      return { items: state.items.filter((item) => item.id !== action.payload.id) };
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD", payload: { ...item, quantity: 1 } });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE", payload: { id } });
  }, []);

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const totals = useMemo(() => {
    const totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return { totalItems, totalPrice };
  }, [state.items]);

  const value: CartContextValue = useMemo(
    () => ({ state, addItem, removeItem, clear, ...totals }),
    [state, addItem, removeItem, clear, totals],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCartContext harus dipakai di dalam CartProvider");
  return context;
}
