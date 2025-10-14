"use client";

import { useCart } from "@/hooks/useCart";

export function CartSummary() {
  const { summary, state, removeItem, clear } = useCart();

  return (
    <aside className="card" style={{ position: "sticky", top: "2rem" }}>
      <h2>Ringkasan Keranjang</h2>
      <p>Total item: {summary.totalItems}</p>
      <p>Total harga: Rp {summary.totalPrice.toLocaleString("id-ID")}</p>

      <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
        {state.items.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>Belum ada item.</p>
        ) : (
          state.items.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid rgba(148,163,184,0.3)",
                borderRadius: "0.75rem",
                padding: "0.75rem",
                display: "grid",
                gap: "0.35rem",
              }}
            >
              <strong>{item.name}</strong>
              <span>
                {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                style={{ background: "#f1f5f9", color: "#0f172a" }}
              >
                Hapus
              </button>
            </div>
          ))
        )}
      </div>

      <button onClick={clear} style={{ background: "#ef4444", color: "white", marginTop: "1rem" }}>
        Bersihkan Keranjang
      </button>
    </aside>
  );
}
