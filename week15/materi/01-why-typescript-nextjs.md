# Why Use TypeScript with Next.js (Revisited)

## Tujuan
- Mengaitkan kembali manfaat TypeScript dengan konteks Next.js modern (App Router, Server Components).
- Menyediakan narasi yang mudah dibawakan saat live mentoring.

## Kenapa Sangat Relevan di Next.js?
1. **Server + Client Awareness** – TypeScript membantu membedakan kode server/client melalui `"use client"`, memastikan API browser tidak bocor ke server component.
2. **Data Fetch Reliability** – get request ke API eksternal (REST/GraphQL) membutuhkan shape data pasti; TypeScript + schema validator menutup celah runtime.
3. **Developer Experience** – Autocomplete untuk route, metadata, layout, serta komponen generik meningkatkan kecepatan tim.
4. **Refactoring Tanpa Takut** – Perubahan struktur data global (misal `Product`) akan diberi tahu compiler.

## Cerita untuk Dibawakan
- Ceritakan bug runtime yang baru diketahui setelah deployment (misal backend kirim `null`).
- Tunjukkan bagaimana TypeScript memaksa developer menangani `null` di compile time.

## Langkah Praktik Cepat
1. Buat type `User` dan `Product` dari contoh API (lihat contoh di project `next-ts-data-safety`).
2. Tulis fungsi `formatUser(user?: User)` dan lihat bagaimana compiler menolak akses `user.name` tanpa guard.

## Latihan
- Minta student mengidentifikasi modul mana di project lama yang paling sering error dan analisis bagaimana TypeScript bisa membantu.
