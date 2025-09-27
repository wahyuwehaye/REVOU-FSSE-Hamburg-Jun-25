# Virtual DOM

## Tujuan Pembelajaran
- Memahami konsep Virtual DOM (VDOM) dalam React.
- Menjelaskan bagaimana VDOM meningkatkan performa update UI.
- Mengidentifikasi situasi di mana perlu optimasi tambahan.

## Apa itu Virtual DOM?
Virtual DOM adalah representasi ringan dari DOM nyata dalam bentuk objek JavaScript. Saat state berubah, React membuat VDOM baru, membandingkannya dengan VDOM sebelumnya (**diffing**), lalu hanya memperbarui bagian DOM yang benar-benar berubah (**reconciliation**).

## Kenapa Penting?
- Menghindari manipulasi DOM manual yang mahal.
- Menjamin update UI tetap konsisten walau state berubah cepat.
- Memudahkan kita berpikir deklaratif: "State berubah → UI sinkron".

## Ilustrasi Sederhana
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Nilai: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Tambah</button>
    </div>
  );
}
```
Saat tombol diklik:
1. State `count` berubah.
2. React membuat VDOM baru untuk komponen `Counter`.
3. Diffing: hanya teks di `<h1>` yang berubah.
4. DOM nyata diperbarui minimal.

## Kapan Membutuhkan Optimasi Tambahan?
- Komponen merender list besar → gunakan `React.memo` atau windowing.
- Perhitungan berat di render → gunakan `useMemo`, `useCallback`.
- Frequent updates (misal realtime chart) → hindari re-render tidak perlu.

## Praktik yang Disarankan
- Gunakan DevTools Profiler untuk melihat re-render.
- Hindari mutasi state langsung; gunakan setter agar React mendeteksi perubahan.
- Pecah komponen besar menjadi bagian kecil untuk meminimalisir re-render.

## Latihan Mandiri
- Tambahkan `console.log('render')` di komponen, amati kapan terpanggil.
- Refactor list besar menggunakan `React.memo` dan ukur perbedaan.

## Rangkuman Singkat
- Virtual DOM adalah layer abstraksi agar update UI efisien.
- React mengelola diffing dan reconciliation otomatis.
- Optimasi manual hanya diperlukan pada kasus khusus berskala besar.
