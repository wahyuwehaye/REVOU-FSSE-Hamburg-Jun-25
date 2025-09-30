# Basic Types and Interfaces

## Tujuan Pembelajaran
- Mengingat kembali tipe dasar TypeScript dan penerapannya di Next.js.
- Menggunakan interface/type alias untuk mendeskripsikan struktur data.
- Mengenal utility types yang sering dipakai.

## Tipe Dasar
- `string`, `number`, `boolean`, `null`, `undefined`
- `array`: `string[]` atau `Array<string>`
- `tuple`: `[number, string]`
- `enum` (gunakan sparingly, prefer union)
- `union`: `type Status = 'idle' | 'loading' | 'error'`

```tsx
const statuses: Array<'idle' | 'loading' | 'error'> = ['idle'];
const user: { id: number; name: string; isAdmin?: boolean } = {
  id: 1,
  name: 'Nadia',
};
```

## Interface vs Type Alias
```tsx
interface User {
  id: string;
  name: string;
  role?: 'student' | 'mentor';
}

type Course = {
  id: string;
  title: string;
  mentor: User;
};

const course: Course = {
  id: 'c1',
  title: 'Next.js 14',
  mentor: { id: 'u1', name: 'Dimas', role: 'mentor' },
};
```

- Gunakan `interface` untuk object contract yang bisa di-`extends`.
- Gunakan `type` untuk union, primitive alias, atau mapped type.

## Utility Types Populer
- `Partial<T>`: menjadikan seluruh property optional.
- `Pick<T, K>`: memilih subset property.
- `Omit<T, K>`: kebalikan `Pick`.
- `Record<K, T>`: membuat object map.
- `ReturnType<typeof fn>`: mengambil tipe hasil fungsi.

## Practice: Typing API Response
```tsx
type Todo = {
  id: string;
  title: string;
  done: boolean;
};

type TodosResponse = {
  data: Todo[];
  lastUpdated: string;
};

async function fetchTodos(): Promise<TodosResponse> {
  const res = await fetch('/api/todos');
  if (!res.ok) throw new Error('Failed');
  return res.json();
}
```

## Latihan Mandiri
- Tulis interface untuk data produk (id, name, price, tags) dan gunakan `Pick`.
- Buat union `type Theme = 'light' | 'dark' | 'system'` dan gunakan pada state React.

## Rangkuman Singkat
- TypeScript menyediakan tipe dasar dan utilitas untuk mendeskripsikan struktur data.
- Pilih `interface` atau `type` sesuai kebutuhan extend dan union.
- Utility types mempercepat manipulasi tipe saat mengembangkan fitur.
