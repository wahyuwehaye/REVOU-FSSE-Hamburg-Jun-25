import Image from "next/image";
import { fetchProductDetail } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic"; // SSR

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await fetchProductDetail(params.id);

  return (
    <article className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
      <header>
        <h1 className="text-3xl" style={{ fontWeight: 700 }}>{product.title}</h1>
        <p className="badge">{product.category.name}</p>
      </header>
      <Image
        src={product.images[0]}
        alt={product.title}
        width={640}
        height={400}
        style={{ width: "100%", height: "320px", objectFit: "cover", borderRadius: "1.5rem" }}
      />
      <p>{product.description}</p>
      <strong>Rp {product.price.toLocaleString("id-ID")}</strong>
      <AddToCartButton product={{ id: product.id, title: product.title, price: product.price }} />
    </article>
  );
}
