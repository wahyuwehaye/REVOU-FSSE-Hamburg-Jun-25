# State & Hooks Lab

Playground untuk mendemonstrasikan:
- Context API + TypeScript untuk global state (theme & cart).
- Custom hooks `useFetchProducts`, `useCart`, `useForm`, `useToggle`.
- Pembedaan local vs global state.
- Optimasi re-render dengan memo dan selector sederhana.

## Menjalankan
```bash
npm install
npm run dev
```

## Alur Demo
1. Buka beranda → fetch produk diambil via hook `useFetchProducts` (request ke `/api/products`).
2. Tambahkan produk ke cart → gunakan global state + memoized selector.
3. Ganti tema light/dark → context + hook `useTheme`.
4. Buka modal form (create note) → isi menggunakan hook `useForm`.

## File Kunci
- `src/hooks/useFetchProducts.ts` – custom hook data fetching dengan refetch & error state.
- `src/hooks/useFormState.ts` – helper form generik.
- `src/context/CartContext.tsx` – contoh global state dengan reducer dan selector.
- `src/app/api/products/route.ts` – data mock dengan delay untuk simulasi loading.

## Tantangan
- Tambahkan interval auto-refresh di `useFetchProducts` (lihat modul 13).
- Implementasikan validasi tambahan di hook form (contoh minimal panjang karakter).
- Persistenkan cart ke `localStorage` menggunakan efek di provider.
