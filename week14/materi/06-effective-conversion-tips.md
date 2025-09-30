# Additional Tips for Effective Conversion

## Tujuan Pembelajaran
- Mengetahui strategi praktis saat mengonversi proyek besar ke TypeScript.
- Mengatur prioritas migrasi berdasarkan risiko bisnis.
- Menggunakan alat bantu otomatis agar proses lebih cepat.

## Strategi Prioritas
- **Mulai dari Domain Inti**: Ketik data model (User, Order, Product) lebih dulu.
- **Grenakan per Modul**: Fokus satu folder per sprint untuk menjaga konsistensi.
- **Tetapkan Definition of Done**: Fitur selesai bila tipe dan tes telah diperbarui.

## Tools & Teknik
- Gunakan `ts-migrate` atau `typescript-eslint` dengan rule ketat untuk membantu.
- Tambah skrip `"typecheck": "tsc --noEmit"` di `package.json` dan jalankan di CI.
- Pakai `@ts-expect-error` (bukan `@ts-ignore`) agar compiler memastikan error diperbaiki nanti.

## Dokumentasi & Komunikasi
- Buat panduan singkat (wiki) tentang konvensi tipe di tim.
- Tandai PR migrasi dengan label khusus; gabungkan secara berkala.
- Rutin lakukan knowledge sharing apa yang baru dipelajari.

## Checklist Migrasi Modul
1. Rename file `.tsx`.
2. Ketik props, state, dan hook.
3. Pastikan data fetching memiliki tipe jelas.
4. Tambahkan test unit/integration jika belum ada.
5. Jalankan `npm run lint` dan `npm run typecheck`.

## Latihan Mandiri
- Buat backlog area kode yang perlu migrasi, urutkan berdasarkan risiko.
- Siapkan template PR migrasi agar reviewer fokus pada penambahan tipe.

## Rangkuman Singkat
- Migrasi efektif memerlukan prioritas, alat bantu, dan komunikasi jelas.
- Pertahankan standar mutu dengan skrip `typecheck` di CI.
- Dokumentasikan praktik terbaik agar proses konsisten di seluruh tim.
