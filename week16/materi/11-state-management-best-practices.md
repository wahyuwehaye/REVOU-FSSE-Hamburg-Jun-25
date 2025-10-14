# State Management Best Practices

## 1. Jaga State Tetap Sederhana
- Gunakan tipe primitif/objek kecil.
- Hindari nested state terlalu dalam; pertimbangkan `useReducer`.

## 2. Batasi Scope
- Tempatkan state sedekat mungkin dengan komponen yang membutuhkan.
- Naikkan (lift state up) hanya ketika dibutuhkan.

## 3. Memoization
- Gunakan `useMemo` dan `useCallback` untuk fungsi/value yang dipassing ke child.
- Ingat: hanya memoisasi jika mahal atau memicu re-render besar.

## 4. Derive Data
- Jangan duplikasi state (contoh: simpan `items` saja, hitung `totalPrice` via `useMemo`).

## 5. Immutable Update
- Gunakan spread atau helper agar update state tetap pure.
- Untuk array kompleks, pertimbangkan `immer`.

## 6. Global Store Checklist
Sebelum menambah global store, pastikan:
- Ada >3 komponen tidak terkait yang butuh data.
- Butuh sync antar tab/halaman.
- Mempercepat developer experience (mis. devtools).

## 7. Server State
- Gunakan SWR/React Query untuk caching, refetch, pagination.
- Pisahkan antara server state vs client state agar tidak tercampur.

## Practice
> Analisis komponen `CartPage`: tunjukkan state mana yang bisa di-derive + cara memoisasi event handler agar tidak bikin `ProductItem` re-render.

## Ringkas
State management yang baik = minimalis, terstruktur, dan memoisasi secukupnya. Hindari over-engineering, mulai dari sederhana, kemudian skalakan. EOF
