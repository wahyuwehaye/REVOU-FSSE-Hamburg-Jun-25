# Basic Types and Interfaces (with Next.js Context)

## Ringkasan
Jenis tipe dasar masih sama, tetapi konteks Next.js memberi warna baru:
- `Metadata` type dari Next.js → gunakan `satisfies Metadata` agar auto-complete tetap `readonly`.
- `Route` type dari Next.js (`import type { Route } from "next"`) untuk memastikan string path valid.
- Komponen `React.FC` vs function biasa – jelaskan kapan menggunakan `React.FC` (umumnya hindari, kecuali butuh `children` default).

## Contoh Kode
```tsx
interface ProductCardProps {
  product: {
    id: number;
    title: string;
    price: number;
    category: string;
  };
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <article>
      <h3>{product.title}</h3>
      <p>{product.category}</p>
      <strong>Rp {product.price.toLocaleString('id-ID')}</strong>
    </article>
  );
}
```
Gunakan union type untuk status async:
```ts
type Status = 'idle' | 'loading' | 'success' | 'error';
```

## Latihan
- Minta student membuat type `FetchState<T>` dengan properti `{ status: Status; data: T | null; error?: string }`.
- Implementasikan hook `useFetch<T>()` sederhana dengan type tersebut.
