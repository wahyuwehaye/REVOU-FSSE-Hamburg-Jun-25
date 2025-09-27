# Introduction to Next.js

## Tujuan Pembelajaran
- Memahami Next.js sebagai framework React full-stack.
- Mengenali fitur inti: routing, pre-rendering, dan API routes.
- Memahami struktur proyek Next.js terkini.

## What is Next.js?
Next.js adalah framework React yang memberikan fasilitas out-of-the-box:
- **File-based Routing**: struktur folder menentukan URL.
- **Rendering Fleksibel**: Static Generation (SSG), Server-Side Rendering (SSR), dan Client Components.
- **Optimasi Performa**: Image Optimization, Font Optimization, Incremental Static Regeneration.
- **API Routes**: Membuat endpoint backend langsung dalam proyek yang sama.

## Struktur Proyek Next 13+ (App Router)
```
my-next-app/
├─ app/
│  ├─ page.jsx        → Halaman utama
│  ├─ layout.jsx      → Layout global
│  └─ api/            → API routes
├─ public/            → Asset statis
├─ next.config.js     → Konfigurasi Next.js
├─ package.json       → Script & dependensi
```

## Contoh Halaman Sederhana
`app/page.jsx`
```jsx
export default function Home() {
  return (
    <main>
      <h1>Selamat datang di Next.js!</h1>
      <p>Halaman ini dirender di server secara default.</p>
    </main>
  );
}
```

## Praktik yang Disarankan
- Buka proyek `examples/next-basic` untuk melihat struktur nyata.
- Tambahkan file `app/about/page.jsx` dan akses `/about` di browser.
- Ubah `layout.jsx` untuk menambahkan header global.

## Latihan Mandiri
- Buat halaman `app/blog/page.jsx` yang menampilkan daftar artikel dummy.
- Tambahkan metadata sederhana menggunakan `export const metadata = { title: 'Blog' }`.

## Rangkuman Singkat
- Next.js memadukan kekuatan React dengan fitur production-ready.
- Routing berbasis file mempercepat pembuatan halaman tanpa konfigurasi tambahan.
- App Router memberi pengalaman komposisi layout yang lebih baik.
