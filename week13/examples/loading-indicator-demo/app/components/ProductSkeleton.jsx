export default function ProductSkeleton() {
  return (
    <div
      style={{
        padding: '1.5rem',
        borderRadius: '1.5rem',
        border: '1px solid #e2e8f0',
        display: 'grid',
        gap: '0.75rem',
      }}
    >
      <div className="skeleton" style={{ height: '1rem', width: '60%', borderRadius: '999px' }} />
      <div className="skeleton" style={{ height: '2.5rem', borderRadius: '1rem' }} />
      <div className="skeleton" style={{ height: '1rem', width: '40%', borderRadius: '999px' }} />
    </div>
  );
}
