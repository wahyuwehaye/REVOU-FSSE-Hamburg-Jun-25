"use client";

import { useFetchProducts } from "@/hooks/useFetchProducts";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProductCard } from "@/components/ProductCard";
import { CartSummary } from "@/components/CartSummary";
import { CreateNoteForm } from "@/components/CreateNoteForm";

export default function ClientShell() {
  const { data: products, status, error, refetch } = useFetchProducts<{
    id: string;
    name: string;
    price: number;
    image: string;
  }>("/api/products");

  return (
    <main className="grid" style={{ gap: "2rem" }}>
      <header
        className="card"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>State & Hooks Lab</h1>
          <p style={{ margin: 0, color: "#475569" }}>
            Contoh gabungan Context API, custom hooks fetching, dan form handling.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="grid" style={{ gap: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Produk Unggulan</h2>
          <button onClick={refetch} style={{ background: "#f1f5f9" }}>
            Muat ulang data
          </button>
        </div>

        {status === "loading" && <p>Sedang memuat daftar produk…</p>}
        {status === "error" && <p style={{ color: "#ef4444" }}>Gagal memuat: {error}</p>}

        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      <section className="grid" style={{ gap: "1.5rem" }}>
        <h2 style={{ margin: 0 }}>Catatan Tim</h2>
        <CreateNoteForm />
      </section>

      <CartSummary />
    </main>
  );
}
