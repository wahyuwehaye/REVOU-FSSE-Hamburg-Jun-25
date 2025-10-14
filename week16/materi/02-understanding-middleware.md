# Understanding Next.js Middleware

## Konsep Inti
Middleware adalah fungsi yang dieksekusi **sebelum** request mencapai route handler atau page. Ia bekerja di edge runtime, sehingga sangat cepat dan cocok untuk:
- Mengecek autentikasi/otorisasi.
- Redirect berdasarkan kondisi tertentu.
- Menyuntik header khusus (mis. keamanan).

Lifecycle sederhananya:
1. Browser melakukan request ke `/some-path`.
2. Middleware (jika `matcher` cocok) dieksekusi di edge.
3. Middleware bisa `return NextResponse.next()` (lanjut), `redirect`, atau `rewrite`.
4. Baru setelah itu request diteruskan ke route handler/page.

## Template Dasar
```ts
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-powered-by", "middleware-lab");
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
```

## Step-by-Step
1. Buat file `src/middleware.ts`.
2. Tentukan `matcher` – array path yang harus melewati middleware.
3. Di body middleware, gunakan objek `request` untuk membaca cookies, header, atau URL.
4. Putuskan responnya: lanjut (`NextResponse.next()`), redirect (`NextResponse.redirect()`), atau rewrite.
5. Test dengan membuka URL yang diproteksi.

## Checklist Penggunaan
- Butuh cek token/cookie? Letakkan logika di middleware.
- Butuh memblokir user tertentu? Lakukan `redirect` ke `/login`.
- Butuh merapikan trailing slash? Gunakan middleware untuk rewrite.

## Latihan Kilat
> Implementasikan middleware yang menolak akses ke `/beta/*` jika query `?key=` tidak sama dengan nilai rahasia (mis. `.env`).

## Ringkasan
Middleware = gatekeeper. Ia berjalan di edge, cepat, dan jadi layer pertama sebelum request menyentuh handler Next.js. EOF
