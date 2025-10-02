import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { fetchCategories } from "@/lib/platzi-client";

export default async function HomePage() {
  const categories = await fetchCategories();

  return (
    <section>
      <h1 className="text-3xl font-bold">Platzi Shop (TypeScript Demo)</h1>
      <p className="text-gray-600">Contoh penggunaan TypeScript + Next.js dengan FakeAPI Platzi.</p>

      <section className="card" style={{ marginTop: "2rem" }}>
        <h2 className="text-xl font-semibold">Kategori Populer</h2>
        <div className="card-grid">
          {categories.map((category) => (
            <article key={category.id} className="card">
              <Image
                src={category.image}
                alt={category.name}
                width={320}
                height={220}
                style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "1rem" }}
              />
              <h3>{category.name}</h3>
              <Link href={`/products?category=${category.id}` as Route} className="button secondary">
                Lihat produk
              </Link>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
