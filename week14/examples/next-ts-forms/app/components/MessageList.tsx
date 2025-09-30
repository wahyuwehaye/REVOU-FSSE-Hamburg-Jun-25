type Message = {
  id: string;
  name: string;
  email: string;
  topic: 'partnership' | 'mentoring' | 'general';
  message: string;
};

type MessageListProps = {
  items: Message[];
};

export function MessageList({ items }: MessageListProps) {
  if (items.length === 0) {
    return <p style={{ color: '#64748b' }}>Belum ada pesan masuk.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
      {items.map((item) => (
        <li key={item.id} style={{ background: 'white', borderRadius: '1.5rem', padding: '1.25rem 1.5rem', border: '1px solid #e2e8f0' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div>
              <strong>{item.name}</strong>
              <p style={{ margin: 0, color: '#475569' }}>{item.email}</p>
            </div>
            <span style={{
              background: '#ede9fe',
              color: '#5b21b6',
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
            }}>
              {item.topic}
            </span>
          </header>
          <p style={{ marginTop: '0.75rem', color: '#334155', lineHeight: 1.6 }}>{item.message}</p>
        </li>
      ))}
    </ul>
  );
}
