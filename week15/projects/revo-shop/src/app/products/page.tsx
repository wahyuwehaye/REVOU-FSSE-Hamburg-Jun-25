"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ProductSummary } from "@/types/product";
import { useCartStore } from "@/stores/useCartStore";

export default function ProductsCSRPage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/products", { cache: "no-store" });
        if (res.ok) {
          const fromAdmin = (await res.json()) as ProductSummary[];
          if (fromAdmin.length) {
            setProducts(fromAdmin);
            return;
          }
        }
        const fallback = await fetch("https://api.escuelajs.co/api/v1/products?offset=0&limit=12");
        const data = (await fallback.json()) as Array<{
          id: number;
          title: string;
          price: number;
          images: string[];
          category: { name: string };
        }>;
        setProducts(
          data.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.images[0],
            category: item.category.name,
          })),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  if (loading) return <p>Memuat produk...</p>;
  if (error) return <p className="badge">{error}</p>;

  return (
    <section>
      <h2 className="text-2xl font-semibold">Produk (CSR)</h2>
      <div className="card-grid" style={{ marginTop: "1.5rem" }}>
        {products.map((product) => (
          <article key={product.id} className="card">
            <Image
              src={product.image}
              alt={product.title}
              width={320}
              height={220}
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "1rem" }}
            />
            <h3>{product.title}</h3>
            <p className="badge">{product.category}</p>
            <strong>Rp {product.price.toLocaleString("id-ID")}</strong>
            <button
              type="button"
              className="button"
              onClick={() => addItem({ id: product.id, title: product.title, price: product.price })}
            >
              Tambah ke Keranjang
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
