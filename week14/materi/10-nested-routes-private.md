# Nested Routes and Simple Private Routing

## Tujuan Pembelajaran
- Memahami struktur nested routes di Next.js App Router.
- Membuat guard sederhana untuk halaman private menggunakan TypeScript.
- Mengelola tipe user/session agar akses terkontrol.

## Nested Layout Structure
```
app/
├─ (marketing)/
│  ├─ layout.tsx
│  └─ page.tsx
├─ (dashboard)/
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ settings/
│     └─ page.tsx
└─ layout.tsx
```
Setiap folder dapat memiliki `layout.tsx` yang menerima `children` typed:
```tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <section>{children}</section>;
}
```

## Private Route Guard
Gunakan server component untuk memeriksa session:
```tsx
// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

type Session = {
  user: {
    id: string;
    role: 'admin' | 'member';
  } | null;
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session: Session = await getSession();
  if (!session.user) {
    redirect('/login');
  }
  return <>{children}</>;
}
```

## Client-Side Guard (Optional)
```tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ClientGuardProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

export function ClientGuard({ isAuthenticated, children }: ClientGuardProps) {
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);
  return <>{children}</>;
}
```

## Latihan Mandiri
- Buat layout `(auth)` yang redirect ke `/dashboard` kalau user sudah login.
- Buat type `Role = 'admin' | 'manager' | 'viewer'` dan gunakan untuk conditional UI.

## Rangkuman Singkat
- Nested routes di App Router diatur lewat folder dan layout typed.
- Gunakan `redirect()` di server layout untuk guard sederhana yang type-safe.
- Definisikan tipe session/user jelas agar akses halaman mudah diatur.
