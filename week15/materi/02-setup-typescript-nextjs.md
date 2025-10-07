# Setting up TypeScript in Next.js Project (Week 15 Edition)

## Tujuan
- Memberikan checklist setup yang dapat dipakai ulang oleh mahasiswa.
- Menunjukkan perbedaan ketika menambahkan TypeScript ke project yang sudah berjalan.

## Langkah Setup Project Baru
```bash
npx create-next-app@latest my-ts-app   --ts   --app   --eslint   --src-dir false   --import-alias "@/*"
```
Checklist setelah setup:
- Jalankan `npm run lint` → pastikan tidak ada error.
- Cek `tsconfig.json` → pastikan `strict: true` aktif.
- Buka `app/page.tsx` dan tunjukkan bahwa file sudah `.tsx`.

## Menambahkan TypeScript ke Project Eksisting
1. Install dependensi dev: `npm install -D typescript @types/react @types/node @types/react-dom`.
2. Jalankan `npm run dev` → Next.js otomatis membuat `tsconfig.json` & `next-env.d.ts`.
3. Rename satu file sederhana (`page.jsx` → `page.tsx`) dan perbaiki error pertama yang muncul.
4. Tambahkan script `"typecheck": "tsc --noEmit"` untuk dijalankan di CI.

## Tips Penyampaian
- Tekankan pentingnya menyalakan `strict` sejak awal.
- Bawakan analogi: compiler TypeScript = QA pertama sebelum kode masuk QA manual.

## Latihan
- Berikan repo kecil tanpa TypeScript, minta student menambahkan TS dan menutup semua error.
