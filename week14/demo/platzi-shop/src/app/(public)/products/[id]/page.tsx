import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { fetchProduct } from '@/lib/platzi-client';

export const metadata = {
  title: 'Product Detail',
};

type PageProps = {
  params: { id: string };
};

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await fetchProduct(params.id);

  return (
    <article className="card">
      <header style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p className="badge">Kategori: {product.category.name}</p>
      </header>

      <Image
        src={product.images[0] ?? 'https://picsum.photos/640/400'}
        alt={product.title}
        width={640}
        height={400}
        style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '1.5rem' }}
      />

      <p>{product.description}</p>
      <strong className="text-xl">Rp {product.price.toLocaleString('id-ID')}</strong>

      <Link href={'/products' as Route} className="button secondary" style={{ width: 'fit-content' }}>
        Kembali ke produk
      </Link>
    </article>
  );
}

export async function generateStaticParams(): Promise<Array<PageProps['params']>> {
  const products = await (await import('@/lib/platzi-client')).fetchProducts(12);
  return products.map((product) => ({ id: String(product.id) }));
}
