# Image & Font Optimization

## Optimasi Gambar
- Gunakan komponen `next/image` untuk otomatisasi resizing dan lazy loading.
- Simpan gambar di folder `public` atau CDN; hindari base64 besar di kode.
- Atur `sizes` untuk responsive, misalnya `sizes="(max-width: 768px) 100vw, 33vw"`.

### Contoh
```tsx
import Image from "next/image";

<Image
  src="/products/shoes-1.jpg"
  alt="Sepatu favorit"
  width={400}
  height={400}
  priority
  quality={85}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
/>
```

## Optimasi Font
- Gunakan `next/font` untuk menghindari FOIT/FOUT.
- Pilih subset yang diperlukan saja.

```ts
// src/app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

## Strategi Tambahan
- Gunakan `loading="lazy"` untuk `<iframe>` atau `<img>` non `next/image`.
- Cek bundle menggunakan `next build && next analyze` (butuh plugin).
- Terapkan middleware untuk menambahkan header caching pada asset (opsional).

## Practice Prompt
> Ukur LCP halaman sebelum dan sesudah mengganti `<img>` biasa ke `next/image`. Catat perbedaannya di Lighthouse.

## Ringkas
Optimasi asset = gunakan `next/image` + `next/font`, atur ukuran sesuai breakpoint, dan aktifkan lazy loading agar halaman terasa ringan. EOF
