# Advanced Next.js Concepts Overview

## Kenapa Materi Ini Penting?
Setelah memahami dasar Next.js, kita masuk ke tahap lanjutan: merancang aplikasi yang aman, scalable, dan mudah di-maintain. Fokus minggu ini dibagi ke tiga blok besar:

1. **Middleware & Authentication** – memastikan request yang masuk melewati filter keamanan dan user yang tepat bisa mengakses resource yang benar.
2. **State Management Solutions** – menjaga konsistensi data antar komponen serta menentukan kapan global state diperlukan.
3. **Custom Hooks & Performance** – menulis logika reusable sambil menjaga performa lewat optimasi gambar, font, dan rendering.

## Learning Outcomes
Di akhir minggu, student diharapkan mampu:
- Menjelaskan alur middleware Next.js dan mengimplementasikan proteksi route.
- Mengonfigurasi NextAuth.js untuk autentikasi (incl. role-based access).
- Memilih solusi state management yang tepat (Context API, kombinasi local/global state).
- Membangun custom hooks untuk fetching, form, dan caching.
- Mengoptimasi asset (gambar, font) agar halaman lebih ringan.

## Flow Pembelajaran
1. Mulai dari konsep middleware → lihat diagram request lifecycle.
2. Praktik NextAuth + middleware untuk proteksi halaman admin.
3. Evaluasi kebutuhan state: kapan cukup pakai `useState`, kapan butuh Context/Redux.
4. Bangun custom hooks generik dan gunakan di proyek contoh.
5. Tutup dengan tips optimasi gambar/font di App Router.

## Practice Prompt
- Minta student menjelaskan secara singkat alur request `/admin` dari browser hingga middleware Next.js.
- Diskusikan studi kasus: dashboard SaaS dengan multi-role; apa konsekuensi jika middleware tidak dipasang?

## Ringkasan Cepat
> Advanced Next.js = (middleware + auth) + (state yang terstruktur) + (reusable hooks) + (optimasi performa). EOF
