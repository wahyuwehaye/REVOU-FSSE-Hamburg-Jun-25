'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Gunakan email valid'),
});

type LoginInput = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(schema) });
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: LoginInput) => {
    try {
      setLoading(true);
      setServerError(null);
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({} as { message?: string }));
        setServerError(body.message ?? 'Gagal masuk');
        return;
      }
      router.replace(next);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Gagal login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='card'>
      <h1 className='text-xl font-semibold'>Login (Validasi ke FakeAPI)</h1>
      <p className='text-gray-600'>Masukkan email salah satu pengguna di FakeAPI. Contoh: <code>john@mail.com</code></p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          <span>Email</span>
          <input type='email' placeholder='john@mail.com' {...register('email')} />
          <span className='error-text'>{errors.email?.message}</span>
        </label>
        {serverError && <p className='error-text'>{serverError}</p>}
        <button type='submit' className='button' disabled={loading}>
          {loading ? 'Memeriksa...' : 'Masuk'}
        </button>
      </form>
    </section>
  );
}
