# Next.js Forms Validation

## Tujuan Pembelajaran
- Menangani validasi form di client dan/atau server.
- Menggunakan state untuk menyimpan error dan feedback.
- Mengenalkan library pendukung validasi.

## Validasi Client Sederhana
```jsx
'use client';
import { useState } from 'react';

export default function SignupForm() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  function validate() {
    const nextErrors = {};
    if (!values.email.includes('@')) {
      nextErrors.email = 'Email tidak valid';
    }
    if (values.password.length < 6) {
      nextErrors.password = 'Minimal 6 karakter';
    }
    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      console.log('Submit data', values);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          name="email"
          value={values.email}
          onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
          placeholder="Email"
          className="input"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
      <div>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
          placeholder="Password"
          className="input"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>
      <button className="btn">Daftar</button>
    </form>
  );
}
```

## Validasi Server
Tambahkan pemeriksaan tambahan di server action atau API route untuk keamanan.
```jsx
export async function POST(request) {
  const body = await request.json();
  if (!body.email || !body.email.includes('@')) {
    return Response.json({ error: 'Email invalid' }, { status: 400 });
  }
  // simpan ke database...
  return Response.json({ success: true });
}
```

## Library Populer
- **React Hook Form**: efisien, integrasi mudah dengan schema (Yup, Zod).
- **Formik**: API deklaratif, cocok untuk form kompleks.
- **Zod/Yup**: validasi schema untuk client & server.

## Praktik yang Disarankan
- Selalu validasi di server untuk keamanan.
- Tampilkan pesan error dekat input agar mudah dibaca.
- Gunakan state terpisah untuk `errors` dan `isSubmitting`.

## Latihan Mandiri
- Implementasikan validasi password kuat (huruf besar, angka).
- Gunakan React Hook Form + Zod di project contoh untuk form lebih kompleks.

## Rangkuman Singkat
- Validasi client meningkatkan UX, validasi server memastikan data terpercaya.
- Simpan error dalam state agar UI responsif.
- Library validasi membantu menjaga konsistensi aturan lintas form.
