import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { fetchProducts } from "@/lib/products";

export const revalidate = 1800; // SSG + ISR

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <section>
      <header style={{ marginBottom: "2rem" }}>
        <h1 className="text-3xl" style={{ fontWeight: 700 }}>RevoShop</h1>
        <p className="text-gray-600">Eksplor produk terbaik dengan Next.js + TypeScript.</p>
      </header>
      <div className="card-grid">
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
            <Link href={`/products/${product.id}` as Route} className="button">
              Lihat Detail
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
