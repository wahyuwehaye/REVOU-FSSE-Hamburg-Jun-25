# Custom Hooks untuk Data Fetching

## Pola Umum
1. Terima parameter URL / opsi fetch.
2. Simpan state `data`, `error`, `loading`.
3. Gunakan `useEffect` untuk fetch data saat dependency berubah.
4. Opsional: expose fungsi `refetch`.

## Contoh Hook
```ts
import { useCallback, useEffect, useState } from "react";

type FetchState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
  refetch: () => Promise<void>;
};

export function useFetch<T>(url: string, options?: RequestInit): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { cache: "no-store", ...options });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as T;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
}
```

## Penggunaan di Komponen
```tsx
const { data: todos, loading, error, refetch } = useFetch<Todo[]>("/api/todos");
```

## Tips
- Untuk kebutuhan lanjutan (cache, dedupe), gunakan SWR/React Query.
- Pastikan dependency `options` distabilkan (`useMemo`) agar fetch tidak loop.
- Sertakan abort controller jika perlu membatalkan request.

## Challenge
> Tambahkan parameter `autoRefresh` (ms). Jika diset, hook harus melakukan refetch secara interval.

## Ringkas
Custom hook fetching = satu tempat untuk handle loading/error dan reusable di banyak komponen. EOF
