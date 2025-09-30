# Introduction to Forms in React

## Tujuan Pembelajaran
- Mengelola form dengan state kontrol manual (controlled component).
- Menangani event `onChange`, `onSubmit` dengan TypeScript.
- Mempersiapkan dasar untuk integrasi dengan React Hook Form.

## Controlled Form Dasar
```tsx
'use client';
import { FormEvent, useState } from 'react';

type ContactFormState = {
  name: string;
  email: string;
  message: string;
};

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormState>({ name: '', email: '', message: '' });

  function handleChange<T extends HTMLInputElement | HTMLTextAreaElement>(event: React.ChangeEvent<T>) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Nama" />
      <input name="email" value={form.email} type="email" onChange={handleChange} placeholder="Email" />
      <textarea name="message" value={form.message} onChange={handleChange} placeholder="Pesan" />
      <button type="submit">Kirim</button>
    </form>
  );
}
```

## Validasi Sederhana
```tsx
const isEmailValid = (value: string) => /.+@.+\..+/.test(value);

if (!isEmailValid(form.email)) {
  // tampilkan error
}
```

## Latihan Mandiri
- Tambahkan feedback error per field menggunakan state `errors: Partial<Record<keyof ContactFormState, string>>`.
- Buat komponen input reusable dengan props `label`, `error`, dan `helperText` yang terketik.

## Rangkuman Singkat
- Forms React memerlukan state untuk menyimpan nilai input.
- TypeScript membantu memastikan nama field dan event sesuai.
- Dasar ini mempermudah transisi ke library seperti React Hook Form.
