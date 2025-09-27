# React Basic Example

Contoh proyek ringan untuk mendemonstrasikan konsep awal React: komponen, props, state, event handling, dan list dengan key unik. Gunakan proyek ini saat menjelaskan bagian "Why React", "State vs Variable", hingga "Reusable Component".

## Menjalankan Proyek
1. Masuk ke folder ini dan install dependensi:
   ```bash
   npm install
   ```
2. Jalankan development server:
   ```bash
   npm run dev
   ```
3. Buka `http://localhost:5173` lalu coba ubah teks di `src/components/Hero.jsx` agar peserta melihat hot reload.

## Struktur Penting
```
src/
├─ App.jsx          → Menggabungkan komponen & state
├─ components/
│  ├─ Hero.jsx      → Menjelaskan props & event handler
│  └─ FeatureList.jsx → Contoh list + key unik
└─ styles.css       → Styling dasar
```

## Alur Demo yang Disarankan
- Tunjukkan `App.jsx` untuk membahas state (`useState`) dan props.
- Tunjukkan `FeatureList.jsx` untuk konsep list dan key.
- Tambahkan fitur baru lewat tombol "Tambah Fitur Dummy" saat kelas guna menunjukkan perubahan state.

## Latihan Lanjutan
- Minta peserta menambah input untuk membuat feature dari form.
- Tambahkan toggle untuk menghapus item (latihan event & state).

Proyek ini sengaja dibuat minimal agar mudah dipahami selama sesi 30 menit.
