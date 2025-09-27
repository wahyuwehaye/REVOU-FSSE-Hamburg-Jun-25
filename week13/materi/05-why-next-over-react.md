# Why Next.js Over Plain React?

## Tujuan Pembelajaran
- Mengetahui value proposition Next.js dibanding React murni.
- Mengaitkan fitur Next.js dengan kebutuhan aplikasi nyata.
- Menentukan kapan saat tepat migrasi atau memulai dengan Next.js.

## Masalah yang Diselesaikan Next.js
- **Routing Otomatis**: Tidak perlu konfigurasi eksternal seperti React Router.
- **Rendering di Server**: SEO lebih baik, first paint lebih cepat.
- **Optimasi Built-in**: Bundling cerdas, image optimization, font, script priority.
- **Full-stack Development**: API routes dan server actions untuk kebutuhan backend ringan.
- **Konvensi Konsisten**: Struktur folder dan pattern layout memudahkan kolaborasi.

## Studi Kasus Singkat
| Kebutuhan | React Murni | Next.js |
| --- | --- | --- |
| Blog SEO | Perlu setup SSR manual (Next SSR, Remix) | SSR/SSG otomatis |
| Dashboard Internal | Router + bundler tambahan | Masih cocok, bisa pilih CSR penuh |
| Landing Page Cepat | Setup bundler, file splitting manual | Gunakan Next + ISR/SSG |
| API Ringan | Perlu server terpisah | API route built-in |

## Kutipan untuk Presentasi
"Next.js memanjang-kan React dari sekadar library view menjadi framework aplikatif penuh. Kita fokus bangun fitur, Next mengurus build pipeline, routing, dan optimasi performa."

## Praktik yang Disarankan
1. Identifikasi fitur produksi (SEO, caching, image) yang sulit dilakukan pada React murni.
2. Jalankan `npm run build` di Next.js untuk melihat output optimized.
3. Bandingkan waktu load dan ukuran bundle antara CRA vs Next (opsional).

## Latihan Mandiri
- Buat daftar modul yang akan Anda migrasikan jika berpindah dari React ke Next.
- Diskusikan risiko migrasi (perbedaan environment, SSR) dan siapkan mitigasinya.

## Rangkuman Singkat
- Next.js memberikan solusi menyeluruh untuk routing, rendering, dan optimasi.
- Cocok untuk aplikasi yang menuntut SEO, performa, dan developer experience tinggi.
- React tetap relevan; gunakan Next.js ketika kebutuhan produksi semakin kompleks.
