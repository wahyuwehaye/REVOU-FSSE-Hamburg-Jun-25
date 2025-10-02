import Link from 'next/link';
import type { Route } from 'next';
import { fetchProducts } from '@/lib/platzi-client';
import ProductCard from '@/components/ProductCard';

type ProductsPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export const metadata = {
  title: 'Products',
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const products = await fetchProducts();
  const filtered = params?.category
    ? products.filter((product) => String(product.category.id) === params.category)
    : products;

  return (
    <section>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-2xl font-semibold">Semua Produk</h1>
          {params?.category ? (
            <p className="badge">Filter kategori ID: {params.category}</p>
          ) : (
            <p className="text-gray-600">Menampilkan {products.length} produk pertama</p>
          )}
        </div>
        <Link href={'/dashboard/orders' as Route} className="button">
          Buka Dashboard
        </Link>
      </header>

      <div className="card-grid" style={{ marginTop: '1.5rem' }}>
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
