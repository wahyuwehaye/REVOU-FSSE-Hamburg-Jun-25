'use client';
import { useState } from 'react';

export default function ThemeToggle() {
  const [scheme, setScheme] = useState('violet');

  const palette = {
    violet: 'from-brand-500 via-purple-500 to-fuchsia-500',
    teal: 'from-teal-500 via-emerald-500 to-lime-400',
    amber: 'from-amber-500 via-orange-500 to-rose-500',
  };

  return (
    <section className="space-y-4 rounded-3xl bg-white/5 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Ganti gradasi</h3>
          <p className="text-sm text-slate-300">Coba klik untuk mengganti warna tailwind secara dinamis.</p>
        </div>
        <span className="rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
          {scheme}
        </span>
      </header>

      <div className={`h-36 rounded-2xl bg-gradient-to-r ${palette[scheme]} shadow-inner`} />

      <div className="flex flex-wrap gap-3">
        {Object.keys(palette).map((key) => (
          <button
            key={key}
            onClick={() => setScheme(key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              scheme === key ? 'bg-brand-500 text-white' : 'bg-white/10 text-slate-200 hover:bg-white/15'
            }`}
            type="button"
          >
            {key}
          </button>
        ))}
      </div>
    </section>
  );
}
