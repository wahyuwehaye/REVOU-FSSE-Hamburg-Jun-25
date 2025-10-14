# Auth Middleware Sandbox

Contoh minimal untuk mendemonstrasikan:
- Middleware Next.js sebagai gatekeeper.
- NextAuth.js dengan Credentials Provider.
- Proteksi role-based (admin vs member).
- Penanganan error login & halaman 403.

## Menjalankan
```bash
npm install
cp .env.example .env.local
# sesuaikan NEXTAUTH_SECRET (boleh pakai `openssl rand -base64 32`)
npm run dev
```

### Kredensial Demo
| Email | Password | Role |
| --- | --- | --- |
| `admin@example.com` | `admin123` | `admin` |
| `user@example.com` | `user123` | `member` |

## Alur Demo 5 Menit
1. Buka `/login`, coba salah password → lihat pesan error.
2. Login sebagai user → diarahkan ke `/dashboard`.
3. Akses `/admin` → diarahkan ke `/403` karena bukan admin.
4. Logout, login sebagai admin → `/admin` terbuka.
5. Coba akses `/dashboard` tanpa login → middleware redirect ke `/login?redirect=/dashboard`.

## File Penting
- `src/app/api/auth/[...nextauth]/route.ts` – konfigurasi NextAuth.
- `src/lib/auth-options.ts` – credential provider + callback role.
- `src/middleware.ts` – proteksi route + role guard.
- `src/app/(protected)` – halaman yang butuh session.
- `src/components/LoginForm.tsx` – form login memakai custom hook form sederhana.

## Eksperimen Lanjutan
- Tambahkan provider OAuth (GitHub/Google) dan cek middleware tetap berjalan.
- Simpan session di database menggunakan adapter Prisma.
- Ubah middleware agar role `manager` memiliki akses terbatas.
