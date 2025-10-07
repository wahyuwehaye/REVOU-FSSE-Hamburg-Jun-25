import type { Product, ProductSummary } from "@/types/product";
import { z } from "zod";

const BASE_URL = "https://api.escuelajs.co/api/v1";

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  images: z.array(z.string().url()).nonempty(),
  category: categorySchema,
});

const productListSchema = z.array(productSchema);

export async function fetchProducts(limit = 12): Promise<ProductSummary[]> {
  const res = await fetch(`${BASE_URL}/products?offset=0&limit=${limit}`, {
    next: { revalidate: 1800 },
  });
  if (!res.ok) {
    throw new Error("Gagal memuat produk");
  }
  const data = await res.json();
  const parsed = productListSchema.parse(data);
  return parsed.map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.images[0],
    category: product.category.name,
  }));
}

export async function fetchProductDetail(id: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Produk tidak ditemukan");
  }
  const data = await res.json();
  return productSchema.parse(data);
}
