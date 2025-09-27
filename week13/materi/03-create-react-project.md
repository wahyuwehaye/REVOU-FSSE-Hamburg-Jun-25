# How to Start Creating Project in React

## Tujuan Pembelajaran
- Menyiapkan lingkungan pengembangan React modern.
- Memahami struktur starter React dan file pentingnya.
- Membuat komponen pertama dan menjalankan aplikasi lokal.

## Langkah Setup Cepat
1. **Persiapan** – Pastikan Node.js LTS terinstal (`node -v`).
2. **Inisialisasi** – Gunakan Vite (ringan dan populer):
   ```bash
   npm create vite@latest react-basic -- --template react
   cd react-basic
   npm install
   npm run dev
   ```
3. **Struktur Folder Utama**
   - `package.json`: dependensi & scripts.
   - `src/main.jsx`: entry point, me-render `<App />`.
   - `src/App.jsx`: komponen utama.
   - `public/`: aset statis.
4. **Hot Reload** – Perubahan di `src/` otomatis terlihat di browser.

## Contoh Kode Awal
`src/App.jsx`
```jsx
import { useState } from 'react';

function App() {
  const [name, setName] = useState('React Learner');

  return (
    <main>
      <h1>Halo, {name}!</h1>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Masukkan nama"
      />
    </main>
  );
}

export default App;
```

## Praktik yang Disarankan
- Ubah isi `<h1>` dan perhatikan perubahan real-time.
- Tambahkan komponen baru (misal `<Footer />`) dan impor ke `App`.
- Jelajahi `package.json` untuk memahami script `build`, `preview`.

## Latihan Mandiri
- Buat proyek dengan folder `components/` berisi `Greeting.jsx` yang menerima props `name`.
- Tambahkan gaya sederhana menggunakan CSS module atau Tailwind (opsional).

## Rangkuman Singkat
- Vite mempermudah pembuatan React app modern dengan konfigurasi minimal.
- `App.jsx` adalah titik awal mempraktikkan konsep komponen, props, dan state.
- Struktur jelas membantu tim memperluas aplikasi secara terarah.
