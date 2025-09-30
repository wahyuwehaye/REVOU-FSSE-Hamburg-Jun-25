# Converting Next.js Pages to TypeScript (.tsx)

## Tujuan Pembelajaran
- Mengetahui langkah migrasi file `.jsx` ke `.tsx` secara bertahap.
- Memahami error umum setelah rename file.
- Menggunakan type inference untuk mempercepat konversi.

## Langkah Migrasi
1. **Rename file** – Ubah `page.jsx` menjadi `page.tsx`.
2. **Perbaiki import** – Pastikan semua file relative yang diimport sudah TypeScript-friendly.
3. **Tambahkan tipe props** – Mulai dari props sederhana, gunakan inference jika memungkinkan.
4. **Tangani data fetching** – Ketik return `Promise` dari `fetch`, `getStaticProps`, atau `getServerSideProps` (App Router: gunakan `type` untuk data).
5. **Lint & Build** – Jalankan `npm run lint` untuk memastikan tidak ada error.

## Contoh Sebelum & Sesudah
Sebelum (`page.jsx`):
```jsx
export default function Dashboard({ user }) {
  return <h1>Hi {user.name}</h1>;
}
```
Sesudah (`page.tsx`):
```tsx
type DashboardProps = {
  user: {
    name: string;
  };
};

export default function Dashboard({ user }: DashboardProps) {
  return <h1>Hi {user.name}</h1>;
}
```

## Menangani Server Component Async
```tsx
import { fetchSummary } from '@/lib/api';

type Summary = {
  revenue: number;
  growth: number;
};

export default async function Page() {
  const summary: Summary = await fetchSummary();
  return <pre>{JSON.stringify(summary, null, 2)}</pre>;
}
```

## Error Umum Setelah Rename
- **Implicit any**: tambahkan tipe parameter.
- **JSX namespace**: pastikan file berekstensi `.tsx`, bukan `.ts`.
- **Modul tanpa deklarasi**: buat `global.d.ts` untuk modul CSS/SVG.

## Tips Migrasi Bertahap
- Migrasikan komponen tanpa state dulu (pure UI) untuk quick win.
- Gunakan `// @ts-expect-error` sementara jika membutuhkan jeda, lalu jadwalkan perbaikan.
- Simpan catatan error yang belum selesai agar tidak lupa.

## Latihan Mandiri
- Ambil salah satu file `*.jsx` di proyek lama, rename ke `.tsx`, dan dokumentasikan error yang muncul serta solusinya.
- Coba gunakan `React.FC<Props>` vs function biasa; pahami perbedaannya.

## Rangkuman Singkat
- Migrasi ke TypeScript dimulai dari rename file dan pengisian tipe props.
- Selesaikan error satu per satu, gunakan inference TypeScript untuk mempercepat.
- Dokumentasikan area yang butuh penanganan lebih lanjut agar migrasi konsisten.
