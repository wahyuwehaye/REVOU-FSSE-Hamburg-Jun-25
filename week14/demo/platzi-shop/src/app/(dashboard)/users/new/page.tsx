'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Minimal 6 karakter'),
  avatar: z
    .string()
    .url('Harus berupa URL valid')
    .default('https://picsum.photos/200/200'),
});

type NewUserForm = z.infer<typeof schema>;

export default function CreateUserPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewUserForm>({
    resolver: zodResolver(schema),
    defaultValues: { avatar: 'https://picsum.photos/200/200' },
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: NewUserForm) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const body = await res.json().catch(() => ({} as { id?: number; message?: string }));
      if (!res.ok) {
        setError(body.message ?? 'Gagal membuat user');
        return;
      }
      setResult(`Pengguna berhasil dibuat dengan ID ${body.id}`);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan tak terduga');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1 className='text-xl font-semibold'>Buat Pengguna Baru</h1>
      <p className='text-gray-600'>Form ini memanfaatkan React Hook Form + Zod dan meneruskan data ke FakeAPI Platzi.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          <span>Nama</span>
          <input placeholder='John Doe' {...register('name')} />
          <span className='error-text'>{errors.name?.message}</span>
        </label>
        <label>
          <span>Email</span>
          <input type='email' placeholder='john@mail.com' {...register('email')} />
          <span className='error-text'>{errors.email?.message}</span>
        </label>
        <label>
          <span>Password</span>
          <input type='password' {...register('password')} />
          <span className='error-text'>{errors.password?.message}</span>
        </label>
        <label>
          <span>Avatar URL</span>
          <input {...register('avatar')} />
          <span className='error-text'>{errors.avatar?.message}</span>
        </label>
        {error && <p className='error-text'>{error}</p>}
        {result && <p className='badge'>{result}</p>}
        <button type='submit' className='button' disabled={loading}>
          {loading ? 'Mengirim...' : 'Kirim ke FakeAPI'}
        </button>
      </form>
    </section>
  );
}
