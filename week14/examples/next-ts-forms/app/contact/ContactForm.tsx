'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '../components/TextField';
import { TextArea } from '../components/TextArea';
import { SubmitOverlay } from '../components/SubmitOverlay';

const schema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Email tidak valid'),
  topic: z.enum(['partnership', 'mentoring', 'general'], { required_error: 'Pilih topik' }),
  message: z.string().min(20, 'Minimal 20 karakter'),
});

type ContactInput = z.infer<typeof schema>;

type ContactFormProps = {
  onSuccess?: (data: ContactInput) => void;
};

export function ContactForm({ onSuccess }: ContactFormProps) {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(schema) });

  async function onSubmit(values: ContactInput) {
    try {
      setShowOverlay(true);
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error('Gagal mengirim: ' + JSON.stringify(body));
      }
      onSuccess?.(values);
      router.refresh();
      reset();
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat mengirim. Coba lagi.');
    } finally {
      setShowOverlay(false);
    }
  }

  return (
    <>
      <SubmitOverlay visible={showOverlay} message="Mengirim pesan ke server..." />
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '1.25rem' }}>
        <TextField label="Nama" placeholder="Nama lengkap" error={errors.name?.message} {...register('name')} />
        <TextField label="Email" type="email" placeholder="email@domain.com" error={errors.email?.message} {...register('email')} />
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span style={{ fontWeight: 600 }}>Topik</span>
          <select
            {...register('topic')}
            style={{
              padding: '0.75rem',
              borderRadius: '0.75rem',
              border: `1px solid ${errors.topic ? '#f87171' : '#cbd5f5'}`,
            }}
          >
            <option value="">Pilih topik</option>
            <option value="partnership">Partnership</option>
            <option value="mentoring">Mentoring</option>
            <option value="general">General</option>
          </select>
          {errors.topic ? <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>{errors.topic.message}</span> : null}
        </label>
        <TextArea label="Pesan" placeholder="Ceritakan kebutuhan Anda" error={errors.message?.message} {...register('message')} />
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '0.85rem 1.5rem',
            borderRadius: '0.85rem',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            fontWeight: 600,
          }}
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
        </button>
      </form>
    </>
  );
}
