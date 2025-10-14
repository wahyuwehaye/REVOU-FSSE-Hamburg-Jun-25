# Protected Routes & Role-Based Access

## Konsep Utama
- **Role** disisipkan ke token/session saat login (lihat modul NextAuth).
- **Middleware** mengevaluasi role sebelum request diteruskan.
- **Server Component** tetap melakukan pengecekan agar tidak bergantung pada middleware saja.

## Middleware dengan `withAuth`
```ts
// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (req.nextUrl.pathname.startsWith("/admin") && token.role !== "admin") {
      return NextResponse.redirect(new URL("/403", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
```

## Double Guard di Server Component
```ts
// src/app/(protected)/admin/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    redirect("/403");
  }

  return <div>Only admin can see this</div>;
}
```

## Tips Praktis
- Simpan daftar role + izin di konfigurasi terpisah (`roleConfig.ts`).
- Untuk project besar, gunakan *permission matrix* (role → list of capabilities).
- Halaman 403 custom membantu pengalaman user.

## Latihan
> Tambahkan role baru `manager` yang hanya boleh mengakses `/dashboard/reports` tapi bukan `/admin/users`.

## Ringkas
Role-based access = tanam role di token, cek di middleware + server component. Jangan bergantung pada satu lapisan saja untuk keamanan. EOF
