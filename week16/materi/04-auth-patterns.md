# Authentication Patterns in Next.js

## Tiga Pola Populer
1. **Session/Cookie-based** – gunakan cookie httpOnly, cocok untuk NextAuth.
2. **JWT (stateless)** – token disimpan di cookie atau header Authorization; fleksibel untuk mobile.
3. **Third-party OAuth** – delegasikan login ke Google/GitHub dll.

## Kapan Memilih Apa?
| Skenario | Cocok Menggunakan |
| --- | --- |
| Dashboard internal, login klasik | Session-based (NextAuth) |
| SPA + mobile + microservices | JWT |
| Butuh login sosial | NextAuth (OAuth provider) |

## Komponen Autentikasi di Next.js
- **Route Handler** (`/api/auth/*`) untuk login/logout.
- **Middleware** untuk proteksi halaman.
- **Client helper** (`useSession`, `signIn`, `signOut`).
- **Server helper** (`getServerSession`, `auth()`).

## Checklist Implementasi
1. Tentukan penyimpanan user (in-memory, database).
2. Pilih method (credentials, OAuth, magic link).
3. Konfigurasikan provider + secret.
4. Atur callback untuk menyisipkan `role / permission` ke token & session.
5. Pasang middleware untuk proteksi.
6. Sediakan UI login/logout.

## Practice Prompt
> Diskusikan: apa perbedaan keamanan antara menyimpan JWT di localStorage vs httpOnly cookie di Next.js?

## Ringkas
Next.js fleksibel: bisa session-based (dengan NextAuth) atau JWT custom. Pastikan token diperkaya (role, expiry) dan middleware siap memprosesnya. EOF
