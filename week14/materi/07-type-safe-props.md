# Type-Safe Props in Next.js Components

## Tujuan Pembelajaran
- Memahami bagaimana mendefinisikan props component secara type-safe.
- Membagi props untuk Server Component dan Client Component.
- Menggunakan generics untuk reusable component kompleks.

## Server Component Props
Server component menerima props dari parent atau loader (App Router). Contoh:
```tsx
// app/(marketing)/components/Hero.tsx
interface HeroProps {
  title: string;
  description?: string;
  ctaLabel?: string;
}

export default function Hero({ title, description, ctaLabel = 'Mulai' }: HeroProps) {
  return (
    <section>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      <a href="#signup">{ctaLabel}</a>
    </section>
  );
}
```

## Client Component Props
Tambahkan `'use client'` bila memerlukan hook.
```tsx
'use client';
import { useState } from 'react';

type CounterProps = {
  initial?: number;
  onChange?: (value: number) => void;
};

export function Counter({ initial = 0, onChange }: CounterProps) {
  const [value, setValue] = useState(initial);
  function increment() {
    const next = value + 1;
    setValue(next);
    onChange?.(next);
  }
  return <button onClick={increment}>Hitung: {value}</button>;
}
```

## Props dengan Generics
```tsx
type TableProps<T> = {
  items: T[];
  renderRow: (item: T) => React.ReactNode;
};

export function Table<T>({ items, renderRow }: TableProps<T>) {
  return <tbody>{items.map((item, index) => <tr key={index}>{renderRow(item)}</tr>)}</tbody>;
}
```

## Menggunakan `React.ComponentProps` & `Pick`
```tsx
import Link from 'next/link';

type LinkProps = React.ComponentProps<typeof Link>;

function ButtonLink(props: LinkProps) {
  return <Link {...props} className="btn" />;
}
```

## Latihan Mandiri
- Ketik ulang komponen favorit Anda dengan interface/alias props.
- Buat komponen `Pagination` generik yang menerima callback typed.

## Rangkuman Singkat
- Definisikan props menggunakan interface/type alias agar error tertangkap awal.
- Gunakan generics dan helper type bawaan React untuk komponen reusable.
- Pastikan client component menggunakan tipe fungsi/event yang tepat.
