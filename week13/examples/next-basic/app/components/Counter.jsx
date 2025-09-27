'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem' }}>
      <button
        type="button"
        onClick={() => setCount((prev) => prev - 1)}
        style={{
          borderRadius: '9999px',
          padding: '0.5rem 1rem',
          border: '1px solid #6366f1',
          background: 'white',
        }}
      >
        -
      </button>
      <strong style={{ fontSize: '1.5rem' }}>{count}</strong>
      <button
        type="button"
        onClick={() => setCount((prev) => prev + 1)}
        style={{
          borderRadius: '9999px',
          padding: '0.5rem 1rem',
          border: 'none',
          background: '#6366f1',
          color: 'white',
        }}
      >
        +
      </button>
    </div>
  );
}
