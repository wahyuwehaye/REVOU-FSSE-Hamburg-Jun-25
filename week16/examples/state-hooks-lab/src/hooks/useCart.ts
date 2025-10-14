import { useMemo } from "react";
import { useCartContext } from "@/context/CartContext";

export function useCart() {
  const context = useCartContext();

  const summary = useMemo(
    () => ({
      totalItems: context.totalItems,
      totalPrice: context.totalPrice,
    }),
    [context.totalItems, context.totalPrice],
  );

  return {
    ...context,
    summary,
  };
}
