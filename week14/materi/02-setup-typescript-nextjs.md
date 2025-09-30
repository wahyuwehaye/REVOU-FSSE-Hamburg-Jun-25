# Setting Up TypeScript in Next.js Project

## Tujuan Pembelajaran
- Menginisialisasi Next.js dengan TypeScript atau menambahkan TypeScript pada proyek yang sudah ada.
- Memahami file yang dihasilkan otomatis (`tsconfig.json`, deklarasi type).
- Menjalankan validasi awal agar proyek siap dikembangkan.

## Opsi Inisialisasi
### 1. Proyek Baru (Recommended)
```bash
npx create-next-app@latest next-ts-starter \
  --ts \
  --eslint \
  --app \
  --src-dir false \
  --import-alias "@/*"
cd next-ts-starter
npm run dev
```
CLI akan membuat file `.tsx` dan `tsconfig.json` secara otomatis.

### 2. Tambahkan TypeScript ke Proyek Eksisting
1. Instal TypeScript dan tipe React/Node:
   ```bash
   npm install --save-dev typescript @types/react @types/react-dom @types/node
   ```
2. Jalankan `npm run dev` sekali; Next.js akan membuat `tsconfig.json` default.
3. Rename file `.js` atau `.jsx` penting menjadi `.ts`/`.tsx` sesuai kebutuhan.
4. Perbaiki error yang muncul satu per satu.

## File yang Dibuat Otomatis
- `tsconfig.json` – konfigurasi compiler.
- `next-env.d.ts` – mendeklarasikan tipe Next.js agar dikenali TypeScript.
- `global.d.ts` (opsional) – buat sendiri untuk deklarasi global tambahan (misal modul CSS).

## Checklist Setelah Setup
- Pastikan `npm run lint` tidak memberikan error TypeScript fatal.
- Konfigurasikan editor (VS Code) agar menggunakan TypeScript versi lokal.
- Update script `package.json` bila ingin menambahkan `tsc --noEmit` untuk CI.

## Latihan Mandiri
- Buat proyek baru menggunakan perintah di atas dan jelajahi struktur App Router TypeScript.
- Jika memigrasikan proyek lama, mulai dari halaman paling sederhana dan pastikan build berhasil.

## Rangkuman Singkat
- `create-next-app --ts` adalah cara tercepat mendapatkan template siap pakai.
- Tambahkan TypeScript manual dengan menginstal dependency dan menjalankan dev server.
- Setelah setup, gunakan `npm run lint`/`tsc --noEmit` untuk menjaga kualitas.
