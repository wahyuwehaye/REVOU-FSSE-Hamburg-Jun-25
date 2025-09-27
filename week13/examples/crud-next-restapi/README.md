# Next.js CRUD REST API Example

Proyek demo untuk materi fetching data, `useEffect`, key unik, dan operasi CRUD melalui API Routes.

## Menjalankan
```bash
npm install
npm run dev
```
Buka `http://localhost:3000`.

## Arsitektur Singkat
- `app/api/todos/route.js` → Endpoint REST in-memory yang menangani **GET/POST/PUT/DELETE**.
- `app/page.jsx` → Client component yang memakai `useEffect` untuk fetch awal dan mengelola state lokal.
- `app/components/TodoForm.jsx` → Form dengan validasi sederhana dan feedback loading/error.
- `app/components/TodoList.jsx` → Menampilkan list dengan key unik, toggle status, dan hapus.
- `app/components/StatsBar.jsx` → Menampilkan metrik sederhana sebagai latihan derived state.

## Flow Demo
1. Tunjukkan API route dan jelaskan bagaimana Next.js menyimpan data in-memory.
2. Buka `page.jsx` untuk mengaitkan `useEffect`, optimistic update, dan handler CRUD.
3. Tambah todo baru, toggle status, lalu hapus — tunjukkan UI tetap responsif.
4. Diskusikan pentingnya `key` pada list di `TodoList.jsx`.

## Latihan Peserta
- Tambah filter (All/Done/Active) dengan state tambahan.
- Implementasikan validasi server lebih ketat (minimal 3 karakter).
- Ganti storage dengan array di `cookies` atau Supabase (lanjutan).
