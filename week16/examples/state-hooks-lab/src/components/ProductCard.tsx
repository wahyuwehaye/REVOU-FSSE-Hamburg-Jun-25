"use client";

import { memo } from "react";
import { useCart } from "@/hooks/useCart";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
};

function ProductCardComponent({ id, name, price, image }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <article className="card" style={{ display: "grid", gap: "0.75rem" }}>
      <img
        src={image}
        alt={name}
        style={{ width: "100%", borderRadius: "0.75rem", aspectRatio: "4/3", objectFit: "cover" }}
      />
      <div>
        <h3 style={{ marginBottom: "0.35rem" }}>{name}</h3>
        <p style={{ margin: 0, color: "#475569" }}>Rp {price.toLocaleString("id-ID")}</p>
      </div>
      <button onClick={() => addItem({ id, name, price })} style={{ background: "#2563eb", color: "white" }}>
        Tambah ke Keranjang
      </button>
    </article>
  );
}

export const ProductCard = memo(ProductCardComponent);
