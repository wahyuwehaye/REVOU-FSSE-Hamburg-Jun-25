# useEffect in Next.js

## Tujuan Pembelajaran
- Memahami kapan dan bagaimana menggunakan `useEffect` di Next.js.
- Menangani side effect seperti event listener, timers, dan sinkronisasi state.
- Mengetahui perbedaan antara data fetching client vs server.

## Kapan Menggunakan useEffect?
- Interaksi dengan API browser (`window`, `document`).
- Menyimpan data ke localStorage, mensubscribe event.
- Menjalankan efek setelah render pertama atau saat dependency berubah.

## Contoh Dasar useEffect
```jsx
'use client';
import { useEffect, useState } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval); // cleanup penting!
  }, []);

  return <p>Sekarang: {time.toLocaleTimeString()}</p>;
}
```

## Dependency Array
- Kosong `[]`: effect dijalankan sekali (setelah mount) + cleanup saat unmount.
- Tanpa array: jalan setiap render (jarang dibutuhkan).
- Dengan dependency `[value]`: effect jalan ketika `value` berubah.

## useEffect vs Data Fetching Server
- Untuk data publik yang butuh SEO, gunakan data fetching server (`fetch` di Server Component, `getStaticProps`, `getServerSideProps`).
- gunakan `useEffect` untuk data khusus user, setelah halaman render di client.

## Praktik yang Disarankan
- Selalu tulis fungsi cleanup jika effect membuat subscription.
- Hindari menaruh effect yang berat atau bergantung pada state yang sering berubah.
- Pertimbangkan `useEffect` hanya jika tidak bisa dilakukan di server.

## Latihan Mandiri
- Buat komponen yang membaca `localStorage` saat mount dan menyimpan perubahan state ke `localStorage`.
- Tambahkan event listener resize dan tampilkan ukuran layar secara real-time.

## Rangkuman Singkat
- `useEffect` menjalankan side effect setelah render di client component.
- Gunakan dependency array untuk mengendalikan kapan effect berjalan.
- Pilih data fetching server jika konten harus siap pada render awal.
