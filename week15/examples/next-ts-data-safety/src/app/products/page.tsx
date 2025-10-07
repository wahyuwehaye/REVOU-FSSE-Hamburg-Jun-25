import Image from "next/image";
import { getProducts } from "@/lib/platzi-client";

export const metadata = {
  title: "Products",
};

export default async function ProductsPage() {
  const products = await getProducts(9);

  return (
    <section>
      <h2 className="text-2xl font-semibold">Daftar produk (divalidasi Zod)</h2>
      <p className="text-gray-600">Ambil data dari FakeAPI Platzi lalu disaring ke bentuk ringkas.</p>
      <div className="grid" style={{ marginTop: "1.5rem" }}>
        {products.map((product) => (
          <article key={product.id} className="card">
            <Image
              src={product.image}
              alt={product.title}
              width={320}
              height={220}
              style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "1rem" }}
            />
            <h3>{product.title}</h3>
            <p className="badge">{product.category}</p>
            <strong>Rp {product.price.toLocaleString("id-ID")}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
