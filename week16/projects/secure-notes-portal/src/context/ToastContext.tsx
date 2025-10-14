"use client";

import { createContext, useCallback, useContext, useMemo, useReducer } from "react";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
};

type ToastAction =
  | { type: "ADD"; payload: Toast }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "CLEAR" };

function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];
    case "REMOVE":
      return state.filter((toast) => toast.id !== action.payload.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

type ToastContextValue = {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
  clear: () => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const push = useCallback((toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    dispatch({ type: "ADD", payload: { ...toast, id } });
    setTimeout(() => dispatch({ type: "REMOVE", payload: { id } }), 3000);
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: "REMOVE", payload: { id } });
  }, []);

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const value = useMemo(() => ({ toasts, push, dismiss, clear }), [toasts, push, dismiss, clear]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <strong>{toast.title}</strong>
            {toast.description ? <span>{toast.description}</span> : null}
            <button
              onClick={() => dismiss(toast.id)}
              style={{ background: "transparent", color: "#93c5fd", textAlign: "left", padding: 0 }}
            >
              Tutup
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast harus dipakai dalam ToastProvider");
  return context;
}
