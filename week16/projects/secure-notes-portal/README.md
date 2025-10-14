# Secure Notes Portal

Proyek demonstrasi Advanced Next.js Concepts:
- Middleware + NextAuth untuk proteksi route & role-based access.
- Context API (toast & sidebar state) + custom hooks reusable (`useSecureFetch`, `useFormState`).
- API route notes dengan validasi Zod.
- Optimasi asset via `next/image` & `next/font`.

## Fitur Utama
- Login credentials dengan role (`admin` & `member`).
- Halaman `/workspace` menampilkan daftar catatan (fetch via custom hook, ada refetch & loading state).
- Halaman `/admin/audit` hanya untuk admin.
- Form pembuatan catatan memakai hook `useFormState` + validasi server.
- Global toast menggunakan Context + reducer.
- Middleware mencegah akses tanpa session dan memblokir role yang salah.

## Setup
```bash
npm install
cp .env.example .env.local
# isi NEXTAUTH_SECRET (openssl rand -base64 32)
npm run dev
```

### Demo Accounts
| Email | Password | Role |
| --- | --- | --- |
| admin@revonotes.dev | admin123 | admin |
| member@revonotes.dev | member123 | member |

## Struktur Penting
- `src/lib/auth-options.ts` – konfigurasi NextAuth + role.
- `src/middleware.ts` – proteksi `/workspace` dan `/admin`.
- `src/app/api/notes/route.ts` – API CRUD sederhana + validasi Zod.
- `src/hooks/useSecureFetch.ts` – custom hook data fetching.
- `src/hooks/useFormState.ts` – custom hook form reusable.
- `src/context/ToastContext.tsx` – global state untuk notifikasi.
- `src/app/(protected)/workspace/page.tsx` – menggabungkan semua.

## Eksperimen Lanjutan
- Tambahkan provider OAuth (mis. Google) untuk login.
- Simpan catatan di database (Prisma + SQLite) alih-alih in-memory.
- Implementasikan caching dengan SWR/React Query di `useSecureFetch`.
