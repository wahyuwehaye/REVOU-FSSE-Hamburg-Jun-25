'use client';
import { useState } from 'react';
import Spinner from './Spinner.jsx';

export default function OverlayAction() {
  const [busy, setBusy] = useState(false);

  async function handleGenerate() {
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setBusy(false);
    alert('Data berhasil digenerate!');
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleGenerate}
        style={{
          background: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '1rem',
          padding: '1rem 1.75rem',
          fontWeight: 600,
          boxShadow: '0 18px 36px -28px rgba(99, 102, 241, 0.8)',
        }}
        type="button"
      >
        Generate Laporan Panjang
      </button>

      {busy && (
        <div className="overlay">
          <div style={{ display: 'grid', gap: '1rem', justifyItems: 'center' }}>
            <span className="spinner" />
            <p style={{ margin: 0 }}>Memproses laporan dalam 2-3 detik...</p>
          </div>
        </div>
      )}
    </div>
  );
}
