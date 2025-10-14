# Error Handling di Alur Autentikasi

## Kenapa Penting?
Login gagal, token kedaluwarsa, atau provider error bisa membuat UX buruk bila tidak ditangani. Student harus mampu:
- Memberi feedback jelas di UI.
- Menghindari redirect loop.
- Mencatat error penting.

## Titik Error yang Umum
1. **Credentials salah** – tampilkan pesan human-friendly.
2. **Token expired** – paksa user re-login, hapus cookie.
3. **Provider OAuth gagal** – log error server + tampilkan toast.
4. **Middleware** – hindari redirect tak berujung.

## Contoh Handling di Client
```tsx
// src/app/(auth)/login/page.tsx
"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: params.get("redirect") ?? "/dashboard",
    });

    if (result?.error) {
      setError("Email atau password salah");
      return;
    }

    window.location.href = result?.url ?? "/dashboard";
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <p className="text-red-500">{error}</p>}
      {/* input */}
    </form>
  );
}
```

## Error Boundary pada Server
Gunakan `app/(auth)/error/page.tsx` dan atur `pages.error` di NextAuth atau gunakan `not-found.tsx` untuk 404.

## Logging
- Gunakan `console.error` hanya saat dev. Di production, pakai logger (pino/winston) atau kirim ke APM.
- Simpan detail minimal (tanpa password) untuk debugging.

## Challenge
> Buat halaman `/auth/error` yang menampilkan pesan berbeda tergantung query `?type=Expired` atau `?type=OAuthCallback`.

## Ringkas
Penanganan error harus jelas dan aman. Selalu beritahu user apa yang terjadi dan berikan jalur untuk mencoba lagi. EOF
