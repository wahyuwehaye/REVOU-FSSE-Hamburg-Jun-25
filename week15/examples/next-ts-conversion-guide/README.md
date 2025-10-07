# next-ts-conversion-guide

Template kecil untuk mendemonstrasikan migrasi file `.jsx` menjadi `.tsx`.

## Isi Penting
- `migration-samples/BlogPost.jsx` – contoh komponen sebelum diubah.
- `src/components/BlogPost.tsx` – versi TypeScript setelah migrasi.
- `tsconfig.json` – `allowJs: true` agar file `.jsx` lama masih terbaca selama proses.
- `src/app/page.tsx` – halaman petunjuk demo.

## Menjalankan
```bash
npm install
npm run dev
```

Gunakan project ini saat live coding:
1. Buka file JSX asli dan jelaskan risiko.
2. Rename file ke `.tsx`, tambahkan interface/utility types.
3. Tunjukkan perbedaan error sebelum vs sesudah migrasi.
