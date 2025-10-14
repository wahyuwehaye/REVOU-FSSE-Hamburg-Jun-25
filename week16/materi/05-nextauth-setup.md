# Implementasi NextAuth.js (App Router)

## Instalasi
```bash
npm install next-auth
```
Tambahkan juga adapter/provider sesuai kebutuhan (mis. prisma, GitHub provider).

## Struktur Minimal
```
src/
  app/api/auth/[...nextauth]/route.ts
  middleware.ts
  app/(auth)/login/page.tsx
  app/(protected)/dashboard/page.tsx
  lib/auth-options.ts
```

## auth-options.ts
```ts
// src/lib/auth-options.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const users = [
  { id: "1", email: "admin@example.com", password: "admin123", role: "admin" },
  { id: "2", email: "user@example.com", password: "user123", role: "member" },
];

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = users.find(
          (u) => u.email === credentials.email && u.password === credentials.password,
        );
        if (!user) return null;
        return user;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
```

## Route Handler
```ts
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

## Mengambil Session di Server Component
```ts
// src/app/(protected)/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <section>
      <h1>Dashboard</h1>
      <p>Welcome, {session?.user?.email}</p>
    </section>
  );
}
```

## Tips
- Simpan `NEXTAUTH_SECRET` di `.env`.
- Untuk role-based redirect, gunakan middleware (lihat modul selanjutnya).
- Gunakan `signOut({ redirect: true, callbackUrl: "/" })` untuk logout.

## Latihan
> Implementasikan provider GitHub dan tampilkan nama user GitHub di dashboard. (Hint: butuh `NEXTAUTH_URL`, `GITHUB_ID`, `GITHUB_SECRET`).

## Ringkas
NextAuth + App Router = file route handler + `authOptions`. Credentials provider cocok untuk demo, ganti dengan DB/adapter di production. EOF
