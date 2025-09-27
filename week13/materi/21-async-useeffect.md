# Asynchronous Programming with Next.js and useEffect

## Tujuan Pembelajaran
- Menangani operasi asynchronous di Client Component menggunakan `useEffect`.
- Mengelola state loading dan error saat fetching.
- Mengetahui alternatif async lain di Next.js (Server Components, SWR, React Query).

## Pola Async di useEffect
```jsx
'use client';
import { useEffect, useState } from 'react';

export default function GithubProfile({ username }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setStatus('loading');
      try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        if (!res.ok) throw new Error('Gagal mengambil data');
        const json = await res.json();
        if (!ignore) {
          setData(json);
          setStatus('success');
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
          setStatus('error');
        }
      }
    }
    load();
    return () => {
      ignore = true; // cegah update state setelah unmount
    };
  }, [username]);

  if (status === 'loading') return <p>Memuat...</p>;
  if (status === 'error') return <p className="text-red-500">{error}</p>;
  if (!data) return null;
  return (
    <article>
      <h2>{data.name}</h2>
      <p>{data.bio}</p>
    </article>
  );
}
```

## Alternatif Async di Next.js
- **Server Components**: `async function` yang memanggil `await fetch` langsung, data ter-render di server.
- **SWR/React Query**: mengelola cache, refetching, dan status loading secara otomatis.
- **API Routes**: buat endpoint internal untuk menggabungkan data sebelum di-fetch di client.

## Praktik yang Disarankan
- Kelola state `loading`, `success`, `error` agar UX jelas.
- Gunakan abort signal (`AbortController`) untuk membatalkan fetch jika perlu.
- Pertimbangkan caching library untuk data yang sering diakses.

## Latihan Mandiri
- Implementasikan fetch ke API publik dan tampilkan skeleton loader saat `loading`.
- Uji error handling dengan memaksa URL salah.

## Rangkuman Singkat
- `useEffect` mendukung operasi async dengan fungsi internal async.
- Selalu tangani status loading dan error agar UI informatif.
- Pertimbangkan solusi server-side atau library data fetching untuk kasus kompleks.
