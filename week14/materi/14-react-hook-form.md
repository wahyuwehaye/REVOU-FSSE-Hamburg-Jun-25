# Using React Hook Form for Form Management

## Tujuan Pembelajaran
- Menggunakan React Hook Form (RHF) untuk mengelola form kompleks secara type-safe.
- Menghubungkan RHF dengan schema validator seperti Zod.
- Mengintegrasikan form dengan Next.js (client component).

## Instalasi
```bash
npm install react-hook-form zod @hookform/resolvers
```

## Contoh Form Dasar
```tsx
'use client';
import { useForm } from 'react-hook-form';

type SignupInput = {
  name: string;
  email: string;
  password: string;
};

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>();

  async function onSubmit(values: SignupInput) {
    console.log(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Nama</label>
        <input {...register('name', { required: 'Nama wajib diisi' })} />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <label>Email</label>
        <input type="email" {...register('email', { required: 'Email wajib', pattern: /.+@.+\..+/ })} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register('password', { minLength: { value: 6, message: 'Minimal 6 karakter' } })} />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Mengirim...' : 'Daftar'}
      </button>
    </form>
  );
}
```

## Integrasi Zod
```tsx
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

type SignupInput = z.infer<typeof schema>;

const form = useForm<SignupInput>({ resolver: zodResolver(schema) });
```

## Latihan Mandiri
- Tambahkan field `confirmPassword` dengan validasi kecocokan.
- Gunakan `Controller` untuk menghubungkan RHF dengan komponen UI pihak ketiga (misal `Select`).

## Rangkuman Singkat
- React Hook Form memberi performa lebih baik dengan API deklaratif.
- Type generics memastikan nilai `register`, `errors`, dan `handleSubmit` konsisten.
- Integrasi Zod membuat validasi deklaratif dan type inference otomatis.
