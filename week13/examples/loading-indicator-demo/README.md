# Loading Indicator Demo

Proyek Next.js App Router yang mendemonstrasikan empat pola loading: spinner, skeleton server-side dengan Suspense, skeleton pada client component, dan overlay blocking action.

## Menjalankan
```bash
npm install
npm run dev
```
Buka `http://localhost:3000` lalu perhatikan:
- Spinner dengan label pada section pertama.
- Skeleton card yang tampil dulu sebelum produk muncul (fetch via API route dengan delay 1.2s).
- Panel testimoni yang melakukan fetch di client dan menampilkan skeleton/error state.
- Tombol overlay yang memblokir layar selama 2.5 detik sambil menampilkan spinner.

## Struktur Penting
```
app/
├─ loading.js                 → Fallback global saat route pertama kali di-load
├─ page.jsx                   → Menggabungkan empat pola loading
├─ components/
│  ├─ Spinner.jsx             → Spinner reusable
│  ├─ ProductShelf.jsx        → Server Component + fetch + Suspense
│  ├─ ProductSkeleton*.jsx    → Skeleton reusable untuk fallback
│  ├─ ReviewsPanel.jsx        → Client Component dengan state loading/error
│  └─ OverlayAction.jsx       → Tombol dengan overlay blocking
└─ api/
   ├─ products/route.js       → API dengan delay 1.2s
   └─ reviews/route.js        → API dengan delay 1.8s
```

## Poin Demo Saat Mengajar
1. **Spinner** – Tekankan pentingnya label teks.
2. **Skeleton (Server)** – Tunjukkan integrasi `Suspense` dan fallback `ProductSkeletonGrid`.
3. **Skeleton (Client)** – Buka `ReviewsPanel.jsx` untuk menyoroti state `status` dan `error`.
4. **Overlay** – Perlihatkan bagaimana `OverlayAction` menggunakan state untuk menampilkan overlay full-screen.

## Latihan Lanjutan
- Tambahkan progress bar horizontal untuk loading lebih panjang.
- Simpan state loading di Context agar bisa ditampilkan global (misal di layout).
- Kombinasikan dengan notifikasi toast setelah aksi selesai.
