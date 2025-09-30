type FocusItem = {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
};

type FocusListProps = {
  items: FocusItem[];
};

const badgeColor: Record<FocusItem['priority'], string> = {
  high: '#f97316',
  medium: '#14b8a6',
  low: '#6366f1',
};

export function FocusList({ items }: FocusListProps) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
      {items.map((item) => (
        <li
          key={item.title}
          style={{
            background: 'white',
            borderRadius: '1.25rem',
            padding: '1.25rem 1.5rem',
            border: '1px solid #e2e8f0',
            display: 'grid',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{item.title}</h3>
            <span
              style={{
                background: badgeColor[item.priority],
                color: 'white',
                fontSize: '0.75rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
              }}
            >
              {item.priority}
            </span>
          </div>
          <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>{item.description}</p>
        </li>
      ))}
    </ul>
  );
}
