# How to Start Using Next.js

## Tujuan Pembelajaran
- Menginisialisasi proyek Next.js dengan App Router.
- Memahami konfigurasi awal dan script development.
- Menjalankan halaman dan API sederhana.

## Langkah Setup Next.js
1. **Persiapan** – Node.js >= 18.
2. **Inisialisasi** – Gunakan `create-next-app`:
   ```bash
   npx create-next-app@latest next-basic \
     --typescript false \
     --eslint true \
     --app \
     --src-dir false \
     --tailwind false \
     --import-alias "@/*"
   cd next-basic
   npm run dev
   ```
3. **Script Penting**
   - `npm run dev`: development server dengan HMR.
   - `npm run build`: produksi.
   - `npm run start`: menjalankan build produksi.

## File Penting Setelah Setup
- `app/layout.jsx`: kerangka utama (HTML, metadata, font, provider).
- `app/page.jsx`: landing page default.
- `next.config.js`: konfigurasi lanjutan (image domain, environment).
- `package.json`: script dan dependensi.

## Contoh API Route
Buat `app/api/ping/route.js`:
```jsx
export async function GET() {
  return Response.json({ message: 'pong', time: Date.now() });
}
```
Akses di `/api/ping` untuk memastikan backend ringan bekerja.

## Praktik yang Disarankan
- Ubah teks di `app/page.jsx`, perhatikan HMR.
- Tambahkan halaman `app/about/page.jsx` dan link-kan dari halaman utama.
- Uji API route dengan `fetch('/api/ping')` dari halaman.

## Latihan Mandiri
- Konfigurasikan metadata global di `layout.jsx`.
- Tambahkan file CSS global `app/globals.css` dengan gaya sederhana.

## Rangkuman Singkat
- `create-next-app` menyiapkan proyek App Router lengkap dengan linting.
- Struktur `app/` memisahkan layout, halaman, dan API dengan konvensi jelas.
- Langkah kecil menambah halaman/API membantu memahami alur Next.js.
