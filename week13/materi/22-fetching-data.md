# Fetching Data in Next.js

## Tujuan Pembelajaran
- Mengetahui opsi pengambilan data di Next.js (Server vs Client).
- Menggunakan `fetch` di Server Component dengan caching bawaan.
- Memahami kapan memilih SSR, SSG, ISR, atau Client Fetching.

## Fetch di Server Component
Server Component bisa langsung memanggil `await fetch()`.
```jsx
// app/posts/page.jsx
export default async function PostsPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Daftar Post</h1>
      <ul className="space-y-2">
        {posts.slice(0, 5).map((post) => (
          <li key={post.id} className="border p-3 rounded">
            <h2 className="font-semibold">{post.title}</h2>
            <p className="text-sm text-slate-600">{post.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```
Secara default Next.js melakukan caching. Gunakan `cache: 'no-store'` untuk SSR.

## Pilihan Rendering
- **Static Generation (SSG)**: data diambil saat build (`fetch` default, `revalidate: false`).
- **Incremental Static Regeneration (ISR)**: gunakan `revalidate` untuk refresh periodik.
  ```jsx
  await fetch(url, { next: { revalidate: 60 } });
  ```
- **Server-Side Rendering (SSR)**: `cache: 'no-store'` atau gunakan route handler `GET`.
- **Client Fetch**: via `useEffect`/SWR untuk data user-spesifik atau setelah interaksi.

## API Routes sebagai Sumber Data
Buat endpoint internal untuk menyembunyikan API eksternal atau gabungan data.
```jsx
// app/api/posts/route.js
export async function GET() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await res.json();
  return Response.json(data.slice(0, 10));
}
```

## Praktik yang Disarankan
- Tentukan strategi rendering berdasarkan kebutuhan SEO dan freshness data.
- Manfaatkan caching Next.js agar permintaan berulang efisien.
- Tangani error dan tampilkan fallback UI.

## Latihan Mandiri
- Buat halaman yang menggunakan `revalidate: 5` dan amati bagaimana data refresh.
- Implementasikan client fetch untuk data user (misal profil) sementara data publik di server.

## Rangkuman Singkat
- Next.js memberi fleksibilitas data fetching: server, client, SSG, SSR, ISR.
- `fetch` di server component otomatis ter-cache dan bisa dikonfigurasi.
- Gabungkan strategi sesuai kebutuhan SEO, personalisasi, dan performa.
