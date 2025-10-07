# Converting Next.js Pages to TypeScript (.tsx)

## Rencana Migrasi 4 Langkah
1. **Rename file** `.jsx` → `.tsx`.
2. **Tambah tipe minimal** untuk props (misal `{ params: { slug: string } }`).
3. **Validasi data** – gunakan guard/Zod sebelum me-return JSX.
4. **Bersihkan `any`** – ganti dengan tipe `unknown`/`Record` sementara, lalu perbaiki.

## Demo (gunakan `examples/next-ts-conversion-guide`)
- Tunjukkan file `before/BlogPost.jsx` → `after/BlogPost.tsx`.
- Soroti error yang muncul setelah rename dan cara memperbaikinya satu-satu.
- Gunakan `React.ComponentProps<typeof Button>` untuk mengambil tipe props komponen lain.

## Tips Penyampaian
- Migrasi bertahap per folder, bukan sekaligus.
- Catat error yang belum selesai di board tim.
- Gunakan `@ts-expect-error` ketimbang `@ts-ignore` bila butuh jeda.

## Latihan
- Ambil komponen list dari Week 13, rename ke `.tsx`, dan dokumentasikan error + solusi.
