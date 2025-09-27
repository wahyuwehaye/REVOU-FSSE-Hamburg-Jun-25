# Component in Next.js

## Tujuan Pembelajaran
- Memahami cara membuat dan mengorganisasi komponen di Next.js.
- Mengetahui perbedaan Client Component vs Server Component.
- Mengimport dan menggunakan komponen lintas halaman.

## Komponen Dasar
Komponen adalah fungsi yang mengembalikan JSX. Di Next.js (App Router), secara default komponen di `app/` adalah **Server Component**, sedangkan komponen yang menggunakan state/hook harus diberi direktif `'use client';`.

## Contoh Komponen Server
`app/page.jsx`
```jsx
import Hero from './Hero';

export default function Home() {
  const talks = ['SSR', 'API Routes', 'Optimasi'];
  return (
    <main>
      <Hero />
      <section>
        <h2>Topik Hari Ini</h2>
        <ul>
          {talks.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
```
`app/Hero.jsx`
```jsx
export default function Hero() {
  return (
    <header className="py-12">
      <h1 className="text-4xl font-bold">Belajar Next.js</h1>
      <p>Gabungan kekuatan React + fitur full-stack.</p>
    </header>
  );
}
```

## Client Component
Gunakan jika memerlukan interaktivitas (state, event handler).
`app/components/Counter.jsx`
```jsx
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount((prev) => prev + 1)}>
      Klik {count} kali
    </button>
  );
}
```
Lalu impor ke halaman server:
```jsx
import Counter from './components/Counter';

export default function Home() {
  return (
    <main>
      <Counter />
    </main>
  );
}
```

## Praktik yang Disarankan
- Pisahkan komponen ke folder `components/` agar rapi.
- Identifikasi komponen yang hanya tampil (`Server`) versus interaktif (`Client`).
- Gunakan `export default` atau `named export` sesuai kebutuhan reuse.

## Latihan Mandiri
- Buat komponen `Testimonials` (server) yang menerima data array dari halaman.
- Buat komponen `ThemeSwitcher` (client) yang mengubah tema lewat `useState`.

## Rangkuman Singkat
- Next.js mendukung komponen server dan client dalam satu proyek.
- Gunakan `'use client'` saat memerlukan state, event, atau browser API.
- Struktur komponen yang rapi mempermudah reuse dan pemeliharaan.
