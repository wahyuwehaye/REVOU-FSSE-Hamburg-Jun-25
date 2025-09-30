# Next.js TypeScript Starter

Contoh proyek App Router untuk mendemonstrasikan setup TypeScript dasar.

## Menjalankan
```bash
npm install
npm run dev
```
Buka `http://localhost:3000` untuk melihat halaman.

## Poin Demo
- `tsconfig.json` dengan `strict: true` dan alias `@/*`.
- `app/layout.tsx` menggunakan `satisfies Metadata` untuk konfigurasi SEO type-safe.
- `app/page.tsx` memanggil fungsi async `fetchStats` bertipe `Promise<Stats[]>`.
- Komponen reusable `StatsCard` dan `FocusList` menggunakan type alias & `Record` map.

## Latihan
- Tambahkan property baru pada `Stats` (misal `description`) dan lihat bagaimana TypeScript memandu perubahan.
- Ubah `focus` menjadi data yang di-fetch dari API dan buat tipe response-nya.
