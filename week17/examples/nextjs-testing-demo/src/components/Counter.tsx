'use client';

import { useState } from 'react';

type Props = { start?: number };

export default function Counter({ start = 0 }: Props) {
  const [count, setCount] = useState(start);

  return (
    <div>
      <h2>Simple Counter</h2>

      {/* ini yang akan kita cek di test sebagai "HTML/DOM" */}
      <p aria-live="polite">
        Count: <span data-testid="count">{count}</span>
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        <button aria-label="increment" onClick={() => setCount((c) => c + 1)}>
          +1
        </button>
        <button aria-label="decrement" onClick={() => setCount((c) => c - 1)}>
          -1
        </button>
        <button aria-label="reset" onClick={() => setCount(start)}>
          Reset
        </button>
      </div>
    </div>
  );
}
