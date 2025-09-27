# Next.js + Tailwind Example

Contoh proyek untuk menunjukkan integrasi Tailwind CSS di Next.js App Router. Gunakan ketika menjelaskan "Styling dengan Tailwind", event handler, dan komponen client yang mengubah class secara dinamis.

## Menjalankan
```bash
npm install
npm run dev
```
Buka `http://localhost:3000`.

## Hal yang Ditonjolkan
- `app/page.jsx` berisi layout dengan class Tailwind nyata.
- `app/components/ThemeToggle.jsx` menunjukkan perpindahan warna menggunakan state.
- `tailwind.config.js` menyorot konfigurasi `content` dan tema kustom.

## Poin Diskusi Saat Mengajar
- Tunjukkan bagaimana class didefinisikan (misal `bg-gradient-to-r` atau `md:grid-cols-3`).
- Jelaskan plugin `@tailwindcss/forms` untuk styling elemen form.
- Bandingkan pendekatan utility-first vs CSS tradisional.

## Latihan Peserta
1. Ubah warna gradien default menjadi palette favorit siswa.
2. Tambah badge baru di `PricingCard` menggunakan variant `hover:`.
3. Modifikasi `ThemeToggle` agar menyimpan pilihan warna ke `localStorage`.
