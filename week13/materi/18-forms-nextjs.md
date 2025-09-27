# Next.js Forms

## Tujuan Pembelajaran
- Mengelola form di Next.js menggunakan state dan handler React.
- Menangani submit, validasi dasar, dan feedback UI.
- Memahami opsi server actions (Next 13+) untuk pemrosesan form.

## Form Klien dengan State
```jsx
'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStatus('success');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Nama" className="input" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="input" />
      <textarea name="message" value={form.message} onChange={handleChange} placeholder="Pesan" className="input" rows={4} />
      <button type="submit" className="btn" disabled={status === 'loading'}>
        {status === 'loading' ? 'Mengirim...' : 'Kirim'}
      </button>
      {status === 'success' && <p className="text-green-600">Pesan terkirim!</p>}
    </form>
  );
}
```
## Server Actions (Opsional)
Gunakan server actions untuk memproses form tanpa API tambahan.
```jsx
// app/contact/page.jsx
import ContactForm from './ContactForm';

export default function ContactPage() {
  async function submitAction(formData) {
    'use server';
    const name = formData.get('name');
    console.log('Data server:', name);
  }
  return <ContactForm action={submitAction} />;
}
```

## Praktik yang Disarankan
- Gunakan komponen input reusable agar styling konsisten.
- Sertakan feedback loading/error agar UX jelas.
- Untuk form panjang, pertimbangkan library seperti React Hook Form.

## Latihan Mandiri
- Tambahkan validasi sederhana (misal email wajib format benar).
- Simulasikan kirim data ke API Next.js (`fetch('/api/contact')`).

## Rangkuman Singkat
- Forms di Next.js mengikuti pola React dengan state dan handler.
- Server actions memberi opsi memproses di server tanpa API terpisah.
- Feedback UX (loading, sukses, error) krusial untuk form yang ramah pengguna.
