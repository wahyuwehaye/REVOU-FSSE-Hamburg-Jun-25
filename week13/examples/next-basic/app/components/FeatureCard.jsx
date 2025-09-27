export default function FeatureCard({ title, description, highlight }) {
  return (
    <article
      style={{
        borderRadius: '1rem',
        background: 'white',
        padding: '1.75rem',
        boxShadow: '0 20px 45px -30px rgba(59, 130, 246, 0.6)',
        border: highlight ? '1px solid #6366f1' : '1px solid transparent',
      }}
    >
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p style={{ marginBottom: 0, color: '#475569', lineHeight: 1.6 }}>{description}</p>
    </article>
  );
}
