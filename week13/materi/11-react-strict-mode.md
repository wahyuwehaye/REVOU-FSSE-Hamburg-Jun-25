# React Strict Mode

## Tujuan Pembelajaran
- Memahami fungsi `React.StrictMode` dalam pengembangan.
- Mengetahui dampaknya terhadap lifecycle dan rendering.
- Menggunakan Strict Mode sebagai alat deteksi potensi bug.

## Apa itu Strict Mode?
`<React.StrictMode>` adalah wrapper yang membantu mendeteksi praktik berisiko di development.
- Mengaktifkan warning tambahan (deprecated API, side effect ganda).
- Menjalankan komponen dua kali di dev untuk mendeteksi efek samping yang tidak idempotent.
- Tidak memengaruhi produksi; behavior khusus hanya saat development.

## Contoh Penggunaan
`src/main.jsx`
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Dampak Umum di Dev
- `useEffect` akan dipanggil dua kali (mount → cleanup → mount) untuk mengecek kebersihan efek.
- Side effect yang seharusnya hanya terjadi sekali (misal request ke API) akan keliatan jika tidak dibungkus guard.

## Best Practice Saat Strict Mode Aktif
- Pastikan effect membersihkan sumber daya (unsubscribe, clearInterval).
- Hindari menaruh request mahal di body komponen; gunakan effect + guard.
- Gunakan flag `useRef` untuk memastikan fetch hanya sekali bila diperlukan.

## Praktik yang Disarankan
- Amati log komponen di dev; pastikan tidak ada side effect ganda.
- Matikan Strict Mode sementara hanya jika debugging jadi sulit, tetapi nyalakan kembali setelah selesai.

## Latihan Mandiri
- Buat komponen dengan `useEffect` yang memanggil API. Tambahkan guard agar request hanya terjadi sekali.
- Uji di dev: apakah log "fetching..." hanya sekali?

## Rangkuman Singkat
- Strict Mode membantu mendeteksi bug lebih awal tanpa memengaruhi produksi.
- Efek samping ganda di dev adalah fitur, bukan bug.
- Biasakan menulis effect yang bersih agar siap menghadapi concurrent rendering.
