# Next.js TypeScript Forms Demo

Proyek ini menunjukkan cara menggunakan React Hook Form, Zod, dan API Route typed di Next.js App Router.

## Menjalankan
```bash
npm install
npm run dev
```
Pastikan membuka `http://localhost:3000` lalu kirim pesan pada form.

## Sorotan
- `app/contact/ContactForm.tsx` menggunakan `useForm<Schema>` dengan resolver Zod.
- `app/components/TextField.tsx` dan `TextArea.tsx` memperlihatkan komponen controlled bertipe generik.
- `app/api/contacts/route.ts` memvalidasi payload menggunakan schema Zod dan mengembalikan tipe konsisten.
- `app/page.tsx` menampilkan daftar pesan hasil fetch server dengan tiped `MessageList`.
- Overlay loading (`SubmitOverlay`) menunjukkan integrasi UX saat submit.

## Latihan
- Tambahkan checkbox persetujuan dengan tipe boolean di schema.
- Simpan data ke database nyata (misal Prisma) dan perbarui type definition-nya.
- Tangani error 422 di client dengan menampilkan pesan Zod ke user.
