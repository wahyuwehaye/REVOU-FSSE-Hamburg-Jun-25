import { productSchema, productsSchema } from "@/lib/platzi-schemas";
import type { ProductSummary } from "@/types/product";

const BASE_URL = "https://api.escuelajs.co/api/v1";

async function fetchJson(input: RequestInfo | URL, init?: RequestInit) {
  const res = await fetch(input, init);
  if (!res.ok) {
    throw new Error(`Request gagal (${res.status})`);
  }
  return res.json();
}

export async function getProducts(limit = 12): Promise<ProductSummary[]> {
  const data = await fetchJson(`${BASE_URL}/products?offset=0&limit=${limit}`);
  const parsed = productsSchema.parse(data);
  return parsed.map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.images[0],
    category: product.category.name,
  }));
}

export async function getProduct(id: string) {
  const data = await fetchJson(`${BASE_URL}/products/${id}`);
  return productSchema.parse(data);
}
