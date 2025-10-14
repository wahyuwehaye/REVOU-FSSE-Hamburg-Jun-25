# Week 16 – Advanced Next.js Concepts

Minggu ini mendalami lapisan lanjutan pengembangan Next.js: middleware untuk autentikasi, strategi state management, serta custom hooks dengan fokus performa. Materi disiapkan agar mudah diajarkan ulang dalam sesi 30 menit disertai contoh proyek siap pakai.

## Struktur Folder
- `materi/` – modul markdown (teori → langkah implementasi → latihan) mencakup middleware, NextAuth, state management, hingga custom hooks.
- `examples/`
  - `auth-middleware-sandbox/` – contoh minimal proteksi route + NextAuth + middleware.
  - `state-hooks-lab/` – playground Context API, custom hooks fetching & form.
- `projects/`
  - `secure-notes-portal/` – proyek komprehensif menggabungkan autentikasi, role-based access, global state, dan optimasi asset.

## Agenda Presentasi 30 Menit
| Menit | Fokus | Demo/Referensi |
| --- | --- | --- |
| 0-4 | Refresh alur request & middleware (modul 01-03) | Diagram + cek `src/middleware.ts` di sandbox |
| 4-12 | NextAuth + proteksi role (modul 04-06) | Jalankan flow login di `auth-middleware-sandbox` |
| 12-18 | Error handling & UX login (modul 07) | Coba kredensial salah + cek halaman `/403` |
| 18-24 | State management & Context typed (modul 08-11) | Bukti konsep di `state-hooks-lab` (toggle theme, cart) |
| 24-28 | Custom hooks reusable (modul 12-14) | Tunjukkan `useFetch` & `useForm` di proyek lab |
| 28-30 | Optimasi gambar/font + challenge | Lihat konfigurasi `next/image` & `next/font` di `secure-notes-portal` |

## Challenge untuk Student
1. Tambahkan role baru `manager` yang hanya bisa mengakses `/reports`.
2. Refactor salah satu halaman di proyek tim supaya memakai custom hook `useForm` + validasi.
3. Audit Lighthouse sebelum/sesudah menerapkan `next/image`.

Gunakan README di tiap contoh proyek sebagai panduan demo dan latihan mandiri. EOF
