export default function ProductCard({ product }) {
  return (
    <article
      style={{
        padding: '1.5rem',
        borderRadius: '1.5rem',
        border: '1px solid #e2e8f0',
        background: 'white',
        display: 'grid',
        gap: '0.75rem',
      }}
    >
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6366f1', textTransform: 'uppercase' }}>
        {product.category}
      </span>
      <h3 style={{ margin: 0 }}>{product.name}</h3>
      <strong style={{ fontSize: '1.5rem', color: '#0f172a' }}>{product.price}</strong>
    </article>
  );
}
