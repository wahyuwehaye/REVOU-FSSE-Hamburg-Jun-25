# Custom Hooks Overview

## Apa Itu Custom Hook?
Custom hook = fungsi yang memakai hook React (`useState`, `useEffect`, dll.) untuk membungkus logika reusable. Naming convention selalu diawali `use`.

## Manfaat
- Kode lebih bersih dan reusable.
- Abstraksi logika kompleks (fetching, event, form) dari komponen UI.
- Memudahkan testing.

## Template
```ts
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = useCallback(() => setCount((c) => c + 1), []);
  const reset = useCallback(() => setCount(initial), [initial]);

  return { count, increment, reset };
}
```

## Guidelines
- Pakai prefix `use` agar React bisa validasi rules of hooks.
- Boleh memanggil hook lain di dalamnya.
- Return bisa berupa value tunggal, objek, atau array tuple.

## Practice Prompt
> Refactor logic timer di komponen agar memakai custom hook `useCountDown`.

## Ringkas
Custom hooks = cara standar React untuk membagi logika. Fokus pada reuse, bukan sekadar memindahkan kode. EOF
