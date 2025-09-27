export default function Spinner({ label }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
      <span className="spinner" aria-hidden="true" />
      {label ? <span style={{ color: '#475569' }}>{label}</span> : null}
    </div>
  );
}
