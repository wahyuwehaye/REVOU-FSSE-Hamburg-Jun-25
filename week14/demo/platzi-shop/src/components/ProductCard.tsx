import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { Product } from '@/types/platzi';

export interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="card">
      <Image
        src={product.images[0] ?? 'https://picsum.photos/320/220'}
        alt={product.title}
        width={320}
        height={220}
        style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '1rem' }}
      />
      <h3>{product.title}</h3>
      <p className="text-gray-600">{product.category.name}</p>
      <p className="text-lg font-semibold">Rp {product.price.toLocaleString('id-ID')}</p>
      <Link href={`/products/${product.id}` as Route} className="button secondary">
        Detail produk
      </Link>
    </article>
  );
}
