'use client';
import { useEffect, useState } from 'react';
import Spinner from './Spinner.jsx';

function ReviewSkeleton() {
  return (
    <li
      style={{
        padding: '1.25rem 1.5rem',
        borderRadius: '1.25rem',
        background: 'white',
        border: '1px solid #e2e8f0',
        display: 'grid',
        gap: '0.5rem',
      }}
    >
      <div className="skeleton" style={{ width: '30%', height: '0.75rem', borderRadius: '999px' }} />
      <div className="skeleton" style={{ width: '100%', height: '0.9rem', borderRadius: '0.75rem' }} />
      <div className="skeleton" style={{ width: '80%', height: '0.9rem', borderRadius: '0.75rem' }} />
    </li>
  );
}

export default function ReviewsPanel() {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setStatus('loading');
        setError('');
        const res = await fetch('/api/reviews');
        if (!res.ok) throw new Error('Gagal memuat testimoni');
        const data = await res.json();
        if (!ignore) {
          setReviews(data);
          setStatus('success');
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
          setStatus('error');
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  if (status === 'loading') {
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '1rem' }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <ReviewSkeleton key={index} />
        ))}
      </ul>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#dc2626' }}>
        <Spinner />
        {error}
      </div>
    );
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '1rem' }}>
      {reviews.map((review) => (
        <li
          key={review.id}
          style={{
            padding: '1.25rem 1.5rem',
            borderRadius: '1.25rem',
            background: 'white',
            border: '1px solid #e2e8f0',
          }}
        >
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>{review.author}</strong>
          <p style={{ margin: 0, color: '#475569' }}>{review.message}</p>
        </li>
      ))}
    </ul>
  );
}
