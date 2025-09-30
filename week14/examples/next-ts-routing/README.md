# Next.js TypeScript Routing Demo

Contoh proyek untuk materi routing TypeScript: dynamic params, nested layout, helper path, dan guard sederhana.

## Menjalankan
```bash
npm install
npm run dev
```

## Highlight
- `app/routes.ts` menyediakan helper route typed.
- `app/teams/[team]/page.tsx` menunjukkan `PageProps` dengan `params` dan `searchParams` typed.
- `generateStaticParams` menggunakan tipe yang sama untuk menjaga konsistensi slug.
- `app/(dashboard)/layout.tsx` memeriksa autentikasi dan melakukan `redirect()` jika tidak valid.
- Contoh nested route analytics di `app/(dashboard)/[team]/analytics/page.tsx`.

## Latihan
- Tambahkan role guard di layout `(dashboard)` menggunakan union type `Role`.
- Perluas helper `routes` untuk mendukung query builder typed.
