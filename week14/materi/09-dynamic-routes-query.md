# Typing Dynamic Routes and Query Parameters

## Tujuan Pembelajaran
- Menggunakan TypeScript untuk memastikan parameter route dan query sesuai.
- Memanfaatkan generics Next.js (`generateStaticParams`, `Params`) pada App Router.
- Menangani query di client component dengan aman.

## Server Component: Route Params
```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function BlogDetail({ params }: PageProps) {
  const { slug } = params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <article>{post.title}</article>;
}
```
`params` otomatis bertipe object sesuai nama folder.

## generateStaticParams
```tsx
export function generateStaticParams(): Array<PageProps['params']> {
  return [{ slug: 'getting-started' }, { slug: 'advance-ts' }];
}
```
Menggunakan tipe reuse agar konsisten.

## Client Component: Search Params
```tsx
'use client';
import { useSearchParams } from 'next/navigation';

type Query = {
  page?: number;
  tag?: string;
};

function useTypedQuery(): Query {
  const params = useSearchParams();
  const page = params.get('page');
  return {
    page: page ? Number(page) || undefined : undefined,
    tag: params.get('tag') ?? undefined,
  };
}
```

## Latihan Mandiri
- Buat dynamic route `[category]/[slug]` dan ketik params-nya.
- Implementasikan helper `parseNumberParam` untuk query yang seharusnya angka.

## Rangkuman Singkat
- Folder route menentukan tipe `params`; gunakan di definisi props agar aman.
- `generateStaticParams` dapat menggunakan tipe yang sama untuk menjaga konsistensi.
- Gunakan helper untuk parsing `searchParams` agar hasil akhir tetap terketik dengan benar.
