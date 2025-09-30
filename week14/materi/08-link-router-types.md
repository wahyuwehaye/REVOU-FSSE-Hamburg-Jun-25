# TypeScript with Next.js Link and Router

## Tujuan Pembelajaran
- Mengetik penggunaan `next/link`, `next/navigation`, dan router hooks.
- Menghindari kesalahan URL dengan helper tipe.
- Mengatur helper untuk route path yang konsisten.

## Link Component
```tsx
import Link, { LinkProps } from 'next/link';

type NavLinkProps = LinkProps & {
  label: string;
};

export function NavLink({ href, label, ...rest }: NavLinkProps) {
  return (
    <Link href={href} {...rest} className="nav-link">
      {label}
    </Link>
  );
}
```
TypeScript memastikan `href` menerima string atau `UrlObject` yang valid.

## useRouter (Client)
```tsx
'use client';
import { useRouter } from 'next/navigation';

type FilterPayload = {
  status?: 'draft' | 'published';
};

export function FilterButton({ status }: FilterPayload) {
  const router = useRouter();

  function applyFilter() {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    router.push(`/dashboard?${params.toString()}`);
  }

  return <button onClick={applyFilter}>Terapkan</button>;
}
```

## Router Helpers Type-Safe
Buat utilitas agar path konsisten:
```tsx
const routes = {
  dashboard: () => '/dashboard',
  postDetail: (slug: string) => `/posts/${slug}`,
} satisfies Record<string, (...args: any[]) => string>;

// Penggunaan
document.location.href = routes.postDetail('next-14');
```

## Latihan Mandiri
- Buat helper `buildQuery<T>` yang menerima object typed dan mengembalikan string query.
- Tambahkan tipe union pada daftar route agar tidak salah tulis.

## Rangkuman Singkat
- `Link` dan router hook sudah memiliki tipe bawaan; manfaatkan untuk menjaga konsistensi URL.
- Buat helper typed untuk path/parameters agar refactor tetap aman.
- Manfaatkan union type memilih status atau filter agar hanya value valid yang terkirim.
