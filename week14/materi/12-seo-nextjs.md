# SEO in Next.js

## Tujuan Pembelajaran
- Menggunakan API SEO Next.js (App Router) secara type-safe.
- Memanfaatkan `metadata` statis dan dinamis.
- Memahami `generateMetadata` dan `next/head` (Page Router legacy).

## Metadata Statis
```tsx
export const metadata = {
  title: 'Bootcamp Next.js + TypeScript',
  description: 'Pelajari best practice Next.js dengan TypeScript.',
  openGraph: {
    title: 'Bootcamp Next.js + TypeScript',
    images: ['/og-cover.png'],
  },
} satisfies import('next').Metadata;
```
Gunakan `satisfies Metadata` untuk memastikan struktur benar tanpa kehilangan inference.

## Metadata Dinamis
```tsx
type PageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: PageProps) {
  const post = await getPost(params.slug);
  return {
    title: post ? post.title : 'Artikel Tidak Ditemukan',
    description: post?.excerpt,
  } satisfies import('next').Metadata;
}
```

## Legacy Head (Page Router)
Jika masih memakai `next/head`:
```tsx
import Head from 'next/head';

export default function Page() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard admin" />
      </Head>
      <main>...</main>
    </>
  );
}
```
TypeScript membantu menulis meta tag valid.

## Latihan Mandiri
- Tambahkan metadata untuk social preview (Open Graph & Twitter) di salah satu halaman.
- Gunakan `robots` dan `alternates` di metadata dan pastikan TypeScript memvalidasinya.

## Rangkuman Singkat
- App Router menyediakan `metadata` dan `generateMetadata` yang type-safe.
- Gunakan `satisfies Metadata` agar compiler memastikan struktur SEO benar.
- Pastikan informasi SEO mengikuti best practice untuk setiap halaman penting.
