# Route Protection with Middleware

## Kenapa Perlu Proteksi?
Tanpa proteksi, semua halaman bisa diakses siapapun yang mengetahui URL. Proteksi route memastikan user sudah login dan/atau punya izin yang sesuai sebelum halaman diload.

## Pola Umum
1. **Cek token atau session** (dari cookie/JWT).
2. Jika tidak valid → redirect ke `/login` atau `/403`.
3. Jika valid → lanjutkan request.

## Contoh Implementasi
```ts
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("app-session")?.value;
  const isAuthPage = request.nextUrl.pathname === "/login";

  if (!token && !isAuthPage) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(dashboard|settings|profile)/:path*", "/login"],
};
```

## Langkah Demo
1. Simulasikan cookie session (`document.cookie = "app-session=demo"`).
2. Buka `/dashboard` → terlihat.
3. Hapus cookie → `/dashboard` otomatis redirect ke `/login`.
4. Setelah login, middleware bisa membawa user kembali ke halaman awal via `redirect` query.

## Tips Tambahan
- `matcher` mendukung regex sederhana (`/((?!api|_next).*)`).
- Untuk NextAuth, gunakan `withAuth` helper agar token parsing lebih mudah.
- Simpan daftar route sensitif di array agar mudah di-maintain.

## Challenge
> Modifikasi middleware agar user dengan cookie `role=guest` tidak bisa mengakses `/admin`, sedangkan role lain boleh.

## Ringkasan
Proteksi route = cek kredensial di middleware + redirect sesuai skenario. Selalu sertakan informasi `redirect` agar UX login lebih mulus. EOF
