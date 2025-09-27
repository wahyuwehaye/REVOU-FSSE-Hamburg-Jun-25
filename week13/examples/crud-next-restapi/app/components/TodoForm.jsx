'use client';
import { useState } from 'react';

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      await onAdd(title);
      setTitle('');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow">
      <label htmlFor="title" className="font-semibold text-slate-700">Tambah Todo</label>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Belajar Next.js"
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '0.75rem',
            border: '1px solid #cbd5f5',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: '#6366f1',
            color: 'white',
            fontWeight: 600,
          }}
        >
          {loading ? 'Menyimpan...' : 'Tambah'}
        </button>
      </div>
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
    </form>
  );
}
