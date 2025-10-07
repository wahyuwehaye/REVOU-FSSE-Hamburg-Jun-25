"use client";

import { useCartStore } from "@/stores/useCartStore";

export default function AddToCartButton({ product }: { product: { id: number; title: string; price: number } }) {
  const addItem = useCartStore((state) => state.addItem);
  return (
    <button type="button" className="button" onClick={() => addItem(product)}>
      Tambah ke Keranjang
    </button>
  );
}
