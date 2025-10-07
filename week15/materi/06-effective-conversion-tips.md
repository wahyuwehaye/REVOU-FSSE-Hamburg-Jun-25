# Additional Tips for Effective Conversion

## Strategi Tim
- **Definisikan Definition of Done**: fitur dianggap selesai jika bebas `any` tidak terkontrol.
- **Code Review**: reviewer cek `tsconfig` tetap `strict` dan tidak ada `eslint-disable` sembarangan.
- **Library Typing**: jika library tidak punya typing, buat `types/<library>.d.ts`.

## Checklist Teknis
- Pastikan environment support TypeScript (CI jalankan `npm run typecheck`).
- Simpan snippet konversi di Wiki (contoh tipe untuk `NextRequest`, `Metadata`, `LinkProps`).
- Kombinasikan dengan ESLint rule `@typescript-eslint/no-explicit-any` (warning saja, bukan error permanen).

## Metrik Pengawasan
- Track jumlah file `.tsx` vs `.jsx` mingguan.
- Hitung error compile di pipeline sebelum dan sesudah migrasi.

## Latihan Penutup
- Buatkan plan migrasi untuk module tertentu: daftar file, resiko, estimasi waktu.
- Lakukan retro setelah modul selesai: apa error paling sulit? bagaimana TypeScript membantu?
