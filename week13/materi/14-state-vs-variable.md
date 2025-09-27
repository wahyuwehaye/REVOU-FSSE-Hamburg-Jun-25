# State vs Variable

## Tujuan Pembelajaran
- Membedakan state React dengan variabel biasa.
- Memahami kapan menggunakan `useState` versus variabel lokal.
- Mengetahui dampak perubahan state terhadap render ulang.

## Perbedaan Utama
| Aspek | State (`useState`) | Variabel Biasa |
| --- | --- | --- |
| Persistensi | Tersimpan antar render | Hilang saat render selesai |
| Trigger Render | Menggunakan `setState` memicu render ulang | Perubahan tidak memicu render |
| Tempat Simpan | Dikelola React (component state) | Scope fungsi/biasa |
| Penggunaan | Data UI, interaksi, input user | Helper sementara, perhitungan sementara |

## Contoh Perbandingan
```jsx
'use client';
import { useState } from 'react';

export default function Example() {
  let counter = 0; // variabel biasa
  const [count, setCount] = useState(0); // state

  return (
    <div className="space-y-2">
      <p>Variabel biasa: {counter}</p>
      <p>State: {count}</p>
      <button onClick={() => {
        counter += 1; // tidak terlihat di UI
      }}>Tambah Variabel</button>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Tambah State
      </button>
    </div>
  );
}
```
Klik tombol "Tambah Variabel" tidak mengubah UI karena `counter` direset tiap render.

## Kapan Menggunakan Variabel Biasa?
- Menyimpan nilai sementara (misal `const fullName = first + last`).
- Variabel referensi di luar komponen (konstanta, konfigurasi).
- Menggunakan `useRef` jika butuh nilai persisten tanpa trigger render.

## Praktik yang Disarankan
- Gunakan state untuk data yang memengaruhi UI dan berubah seiring waktu.
- Gunakan variabel/konstanta untuk perhitungan cepat di dalam render.
- Pertimbangkan `useReducer` ketika state kompleks.

## Latihan Mandiri
- Refactor komponen di latihan sebelumnya: mana yang sebaiknya state? mana yang cukup variabel?
- Gunakan `useRef` untuk menyimpan jumlah klik tanpa merender ulang.

## Rangkuman Singkat
- State terhubung langsung dengan UI dan bertahan antar render.
- Variabel biasa cocok untuk perhitungan satu kali di dalam fungsi.
- Pilih struktur penyimpanan sesuai kebutuhan reaktivitas dan performa.
