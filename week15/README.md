# Week 15 – TypeScript Foundations for Next.js

Minggu ini menegaskan kembali pondasi TypeScript di Next.js dengan pendekatan bertahap: memahami alasan penggunaan, menyiapkan lingkungan, mengonfigurasi compiler, menguasai tipe dasar, dan strategi migrasi file `.jsx` ke `.tsx` secara efektif. Fokusnya agar materi mudah dipresentasikan ulang dan langsung dipraktikkan.

## Struktur Folder
- `materi/` – enam modul markdown (penjelasan teori, contoh kode, latihan)
- `examples/` – dua proyek Next.js TypeScript:
  - `next-ts-data-safety` – mencontohkan typed fetch + validasi Zod
  - `next-ts-conversion-guide` – template migrasi `.jsx` → `.tsx`
- `projects/` – milestone lengkap `revo-shop` (auth, CRUD, state, testing)

## Saran Alur Presentasi 25 Menit
| Menit | Agenda | Demo |
| --- | --- | --- |
| 0-3 | Hook: kenapa butuh TypeScript? | Cerita bug runtime & overview modul 01 |
| 3-7 | Setup & konfigurasi dasar | `examples/next-ts-conversion-guide` (`tsconfig.json`, alias) |
| 7-12 | Basic types & interface | Komponen typed + `satisfies` (modul 04) |
| 12-18 | Strategi konversi `.tsx` | Tunjukkan berkas migrasi di project conversion |
| 18-23 | Typed fetch & validasi | `examples/next-ts-data-safety` (fetch + Zod) |
| 23-25 | Rangkuman & challenge | Latihan migrasi modul tim masing-masing |

Gunakan modul materi sebagai script presentasi; setiap modul memuat langkah implementasi dan latihan singkat agar student langsung mencoba.
