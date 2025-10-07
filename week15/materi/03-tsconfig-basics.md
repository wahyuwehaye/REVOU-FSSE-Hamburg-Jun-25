# TypeScript Configuration (tsconfig.json) – Panduan Praktis

## Tujuan
- Memahami opsi inti pada `tsconfig.json` dan bagaimana menjelaskannya ke tim.

## Opsi Wajib Dibahas
- `strict: true` – payung utama (aktifkan `noImplicitAny`, `strictNullChecks`, dsb).
- `paths` + `baseUrl` – alias import (`@/components/Button`).
- `jsx: "preserve"` – penting untuk Next.js agar Babel memproses JSX.
- `moduleResolution: "node"` (atau `"bundler"` untuk Next 13+) – memberi tahu compiler cara mencari modul.
- `incremental` – mempercepat karena menyimpan cache `.tsbuildinfo`.

## Demo Sederhana
Di project `examples/next-ts-conversion-guide`:
1. Tampilkan `tsconfig.json` dan jelaskan setiap blok.
2. Ubah `strict` ke `false` untuk menunjukkan efek (compiler tidak mengeluh). Kembalikan lagi ke `true` dan perlihatkan error muncul.

## Tips Tambahan
- Gunakan `extends` jika tim memiliki base config.
- Untuk proyek besar, buat `tsconfig.server.json` + `tsconfig.client.json` jika diperlukan (opsional, advanced).

## Latihan
- Suruh student mengaktifkan opsi tambahan (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`) dan perbaiki error yang timbul.
