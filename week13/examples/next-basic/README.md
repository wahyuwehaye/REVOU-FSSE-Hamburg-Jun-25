# Next.js Basic Example

Proyek contoh untuk mendemonstrasikan struktur App Router, perbedaan Server vs Client Component, data fetching, dan API routes. Gunakan saat menjelaskan topik "What is Next.js", "Why Next.js", "Data Fetching", hingga "useEffect".

## Menjalankan Proyek
1. Instal dependensi:
   ```bash
   npm install
   ```
2. Jalankan dev server:
   ```bash
   npm run dev
   ```
3. Buka `http://localhost:3000`.

## Sorotan Demo
- `app/page.jsx` memuat data pengguna via fetch server-side dan menampilkan **Client Component** `Counter`.
- `app/components/ServerClock.jsx` menunjukkan server component async.
- `app/api/ping/route.js` contoh API route yang bisa dipanggil dari browser (`/api/ping`).

## Alur Demo 5 Menit
1. Tunjukkan struktur `app/` (routing otomatis, layout).
2. Buka `page.jsx` untuk menjelaskan percampuran server/client.
3. Tunjukkan data fetch server (highlight caching dan `await fetch`).
4. Buka `Counter.jsx` untuk menekankan `'use client'` & state.
5. Hit API `curl localhost:3000/api/ping` atau lewat browser untuk memperlihatkan backend ringan.

## Latihan Lanjutan
- Tambahkan halaman baru `app/about/page.jsx`.
- Buat client component baru yang menampilkan data dari `/api/ping` menggunakan `useEffect`.
- Ubah `fetch` di `page.jsx` menjadi `no-store` dan jelaskan SSR.
