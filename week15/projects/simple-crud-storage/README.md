# Simple CRUD Storage Demo

Demo Next.js + TypeScript project yang memperlihatkan:

- **CRUD catatan** yang disimpan di `localStorage` (
  create/update/delete otomatis mempertahankan urutan terbaru).
- **Cookie** untuk menyimpan preferensi tema (`/api/theme` route handler).
- **Cache memori ringan** di sisi klien untuk menghindari pembacaan berulang dari `localStorage`, lengkap dengan metrik hit/miss.

## Menjalankan proyek

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` untuk mencoba.

## Apa yang bisa didemokan kepada siswa

- Tambah catatan baru, edit, hapus, dan bersihkan semuanya. Perubahan akan langsung tersimpan di browser.
- Tombol **Muat dari Cache** vs **Sinkron dari localStorage** memperlihatkan perbedaan akses data cache vs storage, dan metrik akan ikut berubah.
- Ganti tema **Light/Dark** dari toolbar; pilihan akan disimpan sebagai cookie dan terbaca ulang saat refresh.

## Struktur penting

- `src/components/NotesApp.tsx` – komponen utama dengan form CRUD, toolbar interaktif, dan tampilan catatan.
- `src/lib/note-store.ts` – utilitas localStorage + cache memori dan metrik diagnostik.
- `src/lib/server-flags.ts` & `src/app/api/theme/route.ts` – helper cookie + API untuk menyimpan tema.
- `src/app/page.tsx` – halaman awal yang meneruskan tema awal dari cookie ke komponen klien.
- `src/app/globals.css` – styling sederhana untuk tema, grid metrik, dan kartu catatan.

Seluruh kode sudah diberi tipe menggunakan TypeScript dan lolos `npm run typecheck` serta `npm run lint`.
