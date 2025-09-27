# State in Next.js

## Tujuan Pembelajaran
- Memahami cara menggunakan state di Next.js (App Router).
- Menentukan kapan komponen perlu menjadi Client Component.
- Menerapkan state lokal dan berbagi state antar komponen.

## State & Client Component
State React (`useState`, `useReducer`) hanya bisa digunakan di Client Component. Tambahkan `'use client';` di file komponen.

```jsx
'use client';
import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="flex flex-col gap-2"
    >
      <input
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Masukkan email"
        className="border p-2"
      />
      <button type="submit" className="bg-indigo-500 text-white px-4 py-2">
        Daftar
      </button>
      {submitted && <p>Terima kasih sudah mendaftar!</p>}
    </form>
  );
}
```

## Mengangkat State (Lifting State Up)
Ketika dua komponen client perlu berbagi state, simpan state di parent dan oper lewat props.

```jsx
'use client';
import { useState } from 'react';
import ColorPicker from './ColorPicker';
import Preview from './Preview';

export default function ThemePlayground() {
  const [color, setColor] = useState('#6366f1');
  return (
    <div className="space-y-4">
      <ColorPicker color={color} onChange={setColor} />
      <Preview color={color} />
    </div>
  );
}
```

## Praktik yang Disarankan
- Identifikasi komponen yang membutuhkan state, jadikan client component.
- Gunakan state lokal untuk interaksi sederhana; pertimbangkan state global (Context, Zustand) untuk kebutuhan lintas halaman.
- Hindari mem-blokir server component dengan state yang dapat ditangani di client.

## Latihan Mandiri
- Buat komponen `TodoList` dengan state array dan form untuk menambah todo.
- Tambahkan filter (All, Done, Undone) menggunakan `useState` dan state turunan.

## Rangkuman Singkat
- State hanya tersedia di Client Component; gunakan `'use client'` di bagian atas file.
- Lifting state membantu berbagi data antar komponen.
- Kombinasikan state client dengan data server (props) untuk aplikasi lengkap.
