# Simple Notes CRUD

Demo Next.js + TypeScript paling sederhana untuk menampilkan operasi CRUD:

- **API Routes**: `/api/items` dan `/api/items/[id]` menggunakan store in-memory (lihat `src/lib/store.ts`).
- **Client Component**: `NotesClient` mengelola form, daftar, dan memanggil API dengan TypeScript.
- **Type Definitions**: tipe `Note` berada di `src/types/note.ts`.
- **Server + Client**: halaman `src/app/page.tsx` memuat data awal secara server-side dan meneruskan ke client component.

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`:
1. Tambahkan catatan baru melalui form.
2. Edit catatan (tombol **Edit**) → form terisi data.
3. Hapus catatan (tombol **Hapus**).

Data disimpan di memori selama server berjalan sehingga ideal untuk demo singkat tanpa setup tambahan.
