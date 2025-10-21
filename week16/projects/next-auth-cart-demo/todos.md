# Next.js Auth + Cart Demo — Step‑by‑Step (App Router)

> **Tujuan:** Demo mini e‑commerce yang menunjukkan **authentication, authorization (role‑based), middleware, session (NextAuth), cookies, dan localStorage**. Plus praktik **Context API (TypeScript), custom hooks, error handling, dan optimasi gambar/font**.

> **Stack:** Next.js (App Router), TypeScript, NextAuth.js (credentials), Prisma + SQLite, bcryptjs, SWR (opsional), Tailwind (opsional).

---

## 0) Hasil Akhir (Fitur)

* ✅ Register / Login / Logout (NextAuth Credentials, session via cookies)
* ✅ Middleware proteksi route (`/checkout` hanya user login, `/admin` khusus role **ADMIN**)
* ✅ Cart with **Context API + localStorage** (persist di browser)
* ✅ Cookie demo: menyimpan preferensi tampilan & kunjungan pertama
* ✅ Protected routes & role‑based access
* ✅ Error handling di form auth & middleware redirect
* ✅ Custom hooks: `useLocalStorage`, `useCart`, `useProducts`
* ✅ Optimasi gambar (`next/image`) & font (`next/font`)

---

## 1) Persiapan & Inisialisasi Project

```bash
# 1) Buat project Next.js + TS (App Router)
npx create-next-app@latest next-auth-cart-demo --ts
cd next-auth-cart-demo

# 2) Install deps utama
npm i next-auth bcryptjs @prisma/client
npm i -D prisma

# (Opsional) SWR untuk data fetching di client
npm i swr
```

**Aktifkan App Router:** gunakan folder `app/` (default ketika create-next-app terbaru).

---

## 2) Konfigurasi Prisma + SQLite

### 2.1 Init Prisma

```bash
npx prisma init --datasource-provider sqlite
```

Ini membuat `.env` dan `prisma/schema.prisma`.

### 2.2 `.env`

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ganti_dengan_string_acak_panjang"
```

> **Catatan:** `NEXTAUTH_SECRET` wajib. Bisa pakai `openssl rand -base64 32` untuk generate.

### 2.3 `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id           Int     @id @default(autoincrement())
  name         String
  email        String  @unique
  passwordHash String
  role         Role    @default(USER)
  createdAt    DateTime @default(now())
}

enum Role {
  USER
  ADMIN
}

model Product {
  id       Int     @id @default(autoincrement())
  name     String
  price    Int     // simpan dalam satuan "cents" biar aman (mis. 199900)
  imageUrl String
  stock    Int     @default(100)
  createdAt DateTime @default(now())
}
```

### 2.4 Migrasi & Seed

Buat file seed sederhana.

**`prisma/seed.ts`**

```ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordAdmin = await bcrypt.hash('admin123', 10);
  const passwordUser = await bcrypt.hash('user123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash: passwordAdmin,
      role: 'ADMIN'
    }
  });

  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'User Demo',
      email: 'user@example.com',
      passwordHash: passwordUser,
      role: 'USER'
    }
  });

  await prisma.product.createMany({
    data: [
      { name: 'Kaos Next.js', price: 149900, imageUrl: '/images/shirt.jpg' },
      { name: 'Mug RevoU',    price:  79900, imageUrl: '/images/mug.jpg' },
      { name: 'Sticker Pack', price:  29900, imageUrl: '/images/stickers.jpg' }
    ],
    skipDuplicates: true
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
```

**`package.json`** – tambahkan script seed:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
  "devDependencies": {
    "ts-node": "^10.9.2"
  }
}
```

Lalu jalankan:

```bash
npx prisma migrate dev --name init
npm run prisma:seed # jika tidak ada, jalankan: npx ts-node prisma/seed.ts
```

> Tambahkan gambar sample ke `public/images/` (shirt.jpg, mug.jpg, stickers.jpg) untuk demo `next/image`.

---

## 3) Utilitas Prisma & Auth

**`lib/prisma.ts`**

```ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**`lib/auth.ts`** (helper untuk NextAuth callbacks)

```ts
import type { DefaultSession, NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: number;
      role: 'USER' | 'ADMIN';
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    role: 'USER' | 'ADMIN';
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return { id: String(user.id), name: user.name, email: user.email, role: user.role } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number((user as any).id);
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as number;
        session.user.role = token.role as 'USER' | 'ADMIN';
      }
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};
```

**`app/api/auth/[...nextauth]/route.ts`**

```ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## 4) Middleware: Proteksi Route & Role‑Based Access

**`middleware.ts`**

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;

  // Proteksi umum: halaman checkout & dashboard harus login
  if (pathname.startsWith('/checkout') || pathname.startsWith('/dashboard')) {
    if (!isAuth) {
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', pathname + search);
      return NextResponse.redirect(url);
    }
  }

  // Role-based: /admin hanya ADMIN
  if (pathname.startsWith('/admin')) {
    if (!isAuth || token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/403', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout/:path*', '/dashboard/:path*', '/admin/:path*']
};
```

> **Error handling flow:** pengguna tidak login diarahkan ke `/login?callbackUrl=...`. Pengguna non‑admin ke `/403`.

---

## 5) API Routes (Products, Register)

**`app/api/register/route.ts`**

```ts
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { name, email, passwordHash, role: 'USER' } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
```

**`app/api/products/route.ts`**

```ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(products);
}
```

---

## 6) Providers & Layout Global

**`app/providers.tsx`**

```tsx
'use client';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/features/cart/CartContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
```

**`app/layout.tsx`** – font & image optimization + navbar

```tsx
import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next Auth Cart Demo',
  description: 'Demo auth, middleware, cart, cookies, localStorage'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>
          <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee' }}>
            <Link href="/">Home</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/checkout">Checkout</Link>
            <Link href="/admin">Admin</Link>
            <Link href="/dashboard">Dashboard</Link>
            <span style={{ marginLeft: 'auto' }}><AuthStatus /></span>
          </nav>
          <main style={{ padding: 16 }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}

function AuthStatus() {
  // Client component kecil di file yang sama (biar ringkas):
  // akan dirender sebagai bagian dari layout
  return (
    <span suppressHydrationWarning>
      {/* Placeholder, tombol Login/Logout ada di halaman khusus */}
    </span>
  );
}
```

---

## 7) Custom Hooks (Local Storage, Products) & Context (Cart)

**`features/common/useLocalStorage.ts`**

```ts
'use client';
import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue] as const;
}
```

**`features/products/useProducts.ts`** (SWR opsional)

```ts
'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR('/api/products', fetcher);
  return { products: data ?? [], error, isLoading, mutate };
}
```

**`features/cart/CartContext.tsx`**

```tsx
'use client';
import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '@/features/common/useLocalStorage';

export type CartItem = { id: number; name: string; price: number; qty: number; imageUrl: string };

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  totalQty: number;
  totalPrice: number; // in cents
};

const CartCtx = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>('cart:v1', []);

  const api: CartState = useMemo(() => {
    const add: CartState['add'] = (item, qty = 1) => {
      setItems(prev => {
        const found = prev.find(p => p.id === item.id);
        if (found) return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + qty } : p);
        return [...prev, { ...item, qty }];
      });
      // Simulasi cookies non-HTTPOnly: total item
      try { document.cookie = `lastCartCount=${items.length + 1}; path=/; max-age=2592000`; } catch {}
    };

    const remove: CartState['remove'] = (id) => setItems(prev => prev.filter(p => p.id !== id));
    const clear: CartState['clear'] = () => setItems([]);

    const totalQty = items.reduce((a, b) => a + b.qty, 0);
    const totalPrice = items.reduce((a, b) => a + b.qty * b.price, 0);

    return { items, add, remove, clear, totalQty, totalPrice };
  }, [items, setItems]);

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
```

---

## 8) Halaman Publik: Home (List Produk) & Cart

**`app/page.tsx`** – SSR + client add to cart

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
  return (
    <div>
      <h1>Produk</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {products.map(p => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}

function AddButton({ p }: { p: { id: number; name: string; price: number; imageUrl: string } }) {
  'use client';
  const { add } = require('@/features/cart/CartContext') as typeof import('@/features/cart/CartContext');
  const cart = (add as any) ? (require('@/features/cart/CartContext').useCart() as any) : null; // bundling trick untuk contoh ringkas
  const { add: addToCart } = cart || { add: () => {} };
  return <button onClick={() => addToCart(p)}>Tambah ke Keranjang</button>;
}

function ProductCard({ p }: any) {
  return (
    <div style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
      <Image src={p.imageUrl} alt={p.name} width={320} height={200} style={{ width: '100%', height: 'auto' }} />
      <h3>{p.name}</h3>
      <p>Rp {(p.price/100).toLocaleString('id-ID')}</p>
      <AddButton p={p} />
    </div>
  );
}
```

**`app/cart/page.tsx`**

```tsx
'use client';
import { useCart } from '@/features/cart/CartContext';

export default function CartPage() {
  const { items, remove, clear, totalPrice, totalQty } = useCart();
  return (
    <div>
      <h1>Keranjang</h1>
      {items.length === 0 ? (
        <p>Keranjang kosong.</p>
      ) : (
        <>
          <ul>
            {items.map(i => (
              <li key={i.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <span>{i.name}</span>
                <span>x{i.qty}</span>
                <span>Rp {(i.price * i.qty / 100).toLocaleString('id-ID')}</span>
                <button onClick={() => remove(i.id)}>Hapus</button>
              </li>
            ))}
          </ul>
          <hr />
          <p>Total Item: {totalQty}</p>
          <p>Total Harga: <b>Rp {(totalPrice/100).toLocaleString('id-ID')}</b></p>
          <button onClick={clear}>Kosongkan</button>
        </>
      )}
    </div>
  );
}
```

---

## 9) Auth Pages (Login, Register) + Logout

**`app/login/page.tsx`**

```tsx
'use client';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/dashboard';
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('user123');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await signIn('credentials', { email, password, redirect: false, callbackUrl });
    if (res?.error) setError('Email atau password salah');
    else router.push(callbackUrl);
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 360, display: 'grid', gap: 8 }}>
      <h1>Login</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Masuk</button>
      <p>Belum punya akun? <a href="/register">Daftar</a></p>
    </form>
  );
}
```

**`app/register/page.tsx`**

```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('User Baru');
  const [email, setEmail] = useState('baru@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Gagal daftar');
      return;
    }
    router.push('/login');
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 360, display: 'grid', gap: 8 }}>
      <h1>Register</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Daftar</button>
    </form>
  );
}
```

**Logout button (contoh di `app/dashboard/page.tsx`)**

```tsx
'use client';
import { signOut } from 'next-auth/react';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => signOut({ callbackUrl: '/' })}>Logout</button>
    </div>
  );
}
```

---

## 10) Halaman Terproteksi & Role

**`app/checkout/page.tsx`** (harus login – dicegat oleh middleware)

```tsx
export default function CheckoutPage() {
  return (
    <div>
      <h1>Checkout (Protected)</h1>
      <p>Hanya bisa diakses saat login. Middleware akan redirect ke /login bila belum login.</p>
    </div>
  );
}
```

**`app/admin/page.tsx`** (khusus ADMIN)

```tsx
export default function AdminPage() {
  return (
    <div>
      <h1>Admin Only</h1>
      <p>Hanya role ADMIN yang boleh akses. Non-admin diarahkan ke /403.</p>
    </div>
  );
}
```

**`app/403/page.tsx`**

```tsx
export default function ForbiddenPage() {
  return <h1>403 – Tidak punya akses</h1>;
}
```

---

## 11) Cookies (Contoh Server & Client)

### 11.1 Baca cookies di Server Component

**`app/cookies-demo/page.tsx`**

```tsx
import { cookies } from 'next/headers';

export default function CookiesDemo() {
  const cookieStore = cookies();
  const lastCartCount = cookieStore.get('lastCartCount')?.value ?? '0';
  return (
    <div>
      <h1>Cookie Demo</h1>
      <p>Jumlah item terakhir di keranjang (cookie non-HTTPOnly): {lastCartCount}</p>
    </div>
  );
}
```

### 11.2 Set cookie di Client

(kita sudah set di `CartContext` via `document.cookie`). Untuk **HTTPOnly session cookie** dikelola otomatis oleh **NextAuth** sehingga aman dari JS.

---

## 12) Error Handling di Flow Auth

* **Login gagal** → tampilkan pesan di form (`res.error` dari `signIn`).
* **Middleware** → pengguna tidak login diarahkan ke `/login?callbackUrl=...`.
* **Non‑ADMIN ke /admin** → redirect ke `/403`.
* **API** → balas status code jelas (`400/500`) + JSON `{ error }`.

Best practices:

* Validasi input (mis. Zod/Yup) di register/login
* Jangan bocorkan info sensitif (contoh: “email tidak ditemukan” vs “password salah”, pilih pesan generik)

---

## 13) State Management – Kapan Global vs Lokal?

* **Local state**: UI kecil (modal open, tab aktif)
* **Global state**: data lintas halaman / komponen (cart, auth user – tapi auth sudah dihandle NextAuth)
* **Context**: untuk data global sederhana (cart). Hindari overuse; untuk data asinkron kompleks pakai SWR/React Query.

**Best Practices**:

* Hindari menyimpan data sensitif di localStorage (pakai session cookie HTTPOnly).
* Normalisasi angka uang dalam **cents** (integer) di state.
* Gunakan selector saat context besar (atau memoization) untuk kinerja.

---

## 14) Custom Hooks & Performance

* **`useLocalStorage`**: persist sederhana tanpa library
* **`useProducts`** (SWR): cache, revalidate
* **`useCart`**: expose API kecil (add/remove/clear)

**Optimasi**:

* `next/image` untuk gambar produk (lazy, responsive)
* `next/font` untuk loading font efisien
* Memoization & lazy load komponen berat (dynamic import jika perlu)

---

## 15) Menjalankan Project

```bash
# 1) Jalankan migrasi & seed (jika belum)
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts

# 2) Start dev server
npm run dev
# Buka http://localhost:3000
```

**Akun demo:**

* Admin → `admin@example.com` / `admin123`
* User  → `user@example.com` / `user123`

---

## 16) Skenario Demo

1. **Home**: tampil list produk (SSR). Tambah 2–3 item ke cart → buka **Cart** (localStorage persist).
2. **Cookies**: buka `/cookies-demo` dan tunjukkan `lastCartCount` ter-update.
3. **Checkout** (tanpa login) → otomatis redirect ke **Login** (middleware). Login sebagai **user** → kembali ke **Checkout**.
4. **Admin** (login sebagai user) → redirect ke **403**. Login sebagai **admin** → akses **Admin** sukses.
5. **Logout** di Dashboard → cookie session dihapus oleh NextAuth. Kembali akses **Checkout** → diminta login lagi.

---

## 17) Ekstensi (Opsional)

* Simpan cart ke server setelah login (sync dari localStorage → DB) via endpoint `/api/cart/sync`
* Tambah kuantitas & stok validasi
* Tambah halaman **/profile** untuk ubah password
* Tambah rate limiting (middleware) untuk endpoint auth

---

## 18) Ringkasan Kaitan ke Materi "Advanced Next.js Concepts"

* **Middleware & Authentication**: file `middleware.ts` + NextAuth di `app/api/auth` + protected routes `/checkout`, `/admin` (role‑based)
* **Authentication patterns**: Credentials Provider; session JWT (cookie HTTPOnly); halaman custom `login`/`register`
* **NextAuth.js**: `authOptions`, `callbacks.jwt/session` untuk inject `id/role`
* **Protected routes & RBAC**: cek `token.role` di middleware
* **Error handling**: redirect, status code API, pesan form
* **State Management**: Context API (Cart), kapan pakai global vs lokal
* **Custom Hooks**: `useLocalStorage`, `useProducts`
* **Performance**: `next/image`, `next/font`, memoization

---

## 19) FAQ & Gotchas

* **Hydration mismatch saat baca localStorage** → pastikan akses `window` hanya di client (`'use client'`, `useEffect`).
* **NEXTAUTH_SECRET salah** → middleware `getToken` gagal baca token → pastikan `.env` benar & restart dev server.
* **Import prisma ganda** → gunakan singleton pattern (`lib/prisma.ts`).
* **Jangan simpan password plain** → selalu hash (bcrypt) & batasi info error.

> Kalau butuh, kita bisa tambah contoh **server actions** untuk set cookie HTTPOnly kustom dan contoh **image optimization** dengan ukuran berbeda per breakpoint.
