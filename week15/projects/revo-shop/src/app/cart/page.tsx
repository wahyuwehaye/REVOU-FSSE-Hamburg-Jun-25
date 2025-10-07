"use client";

import { useCartStore } from "@/stores/useCartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const remove = useCartStore((state) => state.removeItem);
  const total = useCartStore((state) => state.total());
  const clear = useCartStore((state) => state.clear);

  return (
    <section style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1 className="text-2xl" style={{ fontWeight: 600 }}>Keranjang</h1>
      {items.length === 0 ? (
        <p className="text-gray-600">Belum ada item. Tambahkan dari halaman produk.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
            {items.map((item) => (
              <li key={item.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0 }}>{item.title}</h3>
                  <small>{item.quantity} × Rp {item.price.toLocaleString("id-ID")}</small>
                </div>
                <button type="button" className="button" style={{ background: "#ef4444" }} onClick={() => remove(item.id)}>
                  Hapus
                </button>
              </li>
            ))}
          </ul>
          <footer style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>Total: Rp {total.toLocaleString("id-ID")}</strong>
            <button type="button" className="button" onClick={clear}>
              Bersihkan Keranjang
            </button>
          </footer>
        </>
      )}
    </section>
  );
}
