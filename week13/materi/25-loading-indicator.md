# Loading Indicator in React & Next.js

## Tujuan Pembelajaran
- Memahami kapan menampilkan indikator loading untuk UX yang lebih baik.
- Membuat berbagai tipe indikator: spinner, skeleton, dan overlay progress.
- Mengintegrasikan indikator dengan proses fetching data di React/Next.js.

## Kenapa Loading Indicator Penting?
- **Memberi konteks** bahwa aplikasi sedang memproses permintaan.
- **Menjaga user tetap engaged** sehingga tidak melakukan aksi berulang.
- **Mengurangi persepsi lambat** dengan menampilkan skeleton konten.

## Pola Umum
1. **Spinner** – tanda proses berlangsung, cocok untuk aksi singkat.
2. **Skeleton/Placeholder** – bentuk kasar konten yang akan muncul, ideal untuk daftar atau card.
3. **Overlay/Blocking** – menandai seluruh halaman/area, gunakan sparingly.

## Contoh Spinner Sederhana
```jsx
'use client';

export function Spinner() {
  return (
    <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500" />
  );
}
```

## Example: Loading State pada Fetch Client
```jsx
'use client';
import { useEffect, useState } from 'react';
import { Spinner } from './Spinner';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let ignore = false;
    async function load() {
      setStatus('loading');
      const res = await fetch('/api/users');
      const data = await res.json();
      if (!ignore) {
        setUsers(data);
        setStatus('success');
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Spinner /> Memuat pengguna...
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## Skeleton Loading
```jsx
export function CardSkeleton() {
  return (
    <div className="animate-pulse space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="h-3 w-1/3 rounded bg-slate-200" />
      <div className="h-3 w-2/3 rounded bg-slate-200" />
      <div className="h-24 rounded bg-slate-200" />
    </div>
  );
}
```
Gunakan skeleton ketika struktur konten sudah diketahui, misalnya daftar kartu atau tabel.

## Suspense di Next.js (App Router)
Next.js mendukung `loading.js` untuk setiap route:
```jsx
// app/dashboard/loading.js
export default function Loading() {
  return <p className="text-slate-500">Memuat dashboard...</p>;
}
```
File `loading.js` otomatis ditampilkan selama Server Component menunggu data.

## Praktik yang Disarankan
- Selalu tampilkan indikator sebelum proses lebih dari ~300ms.
- Gunakan skeleton untuk konten berat, spinner untuk aksi singkat.
- Hilangkan indikator segera setelah data tersedia agar UI terasa responsif.

## Latihan Mandiri
- Tambahkan skeleton pada list todo di project CRUD (`examples/crud-next-restapi`).
- Implementasikan overlay full-screen ketika melakukan submit form panjang.

## Rangkuman Singkat
- Loading indicator menjaga user trust saat aplikasi memproses data.
- Kombinasikan spinner, skeleton, atau overlay sesuai konteks.
- Next.js menyediakan `loading.js` dan Suspense bawaan untuk pengalaman loading yang mulus.

## Referensi Sample Project
Lihat folder `examples/loading-indicator-demo` untuk implementasi lengkap spinner + skeleton + overlay menggunakan Next.js App Router.
