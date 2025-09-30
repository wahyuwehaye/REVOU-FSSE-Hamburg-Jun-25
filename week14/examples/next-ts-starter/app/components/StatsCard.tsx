export type Stats = {
  label: string;
  value: number;
  unit?: string;
  trend: 'up' | 'down' | 'flat';
};

type StatsCardProps = {
  stat: Stats;
};

const trendColor: Record<Stats['trend'], string> = {
  up: '#10b981',
  down: '#ef4444',
  flat: '#64748b',
};

export function StatsCard({ stat }: StatsCardProps) {
  const { label, value, unit, trend } = stat;
  return (
    <article
      style={{
        background: 'white',
        borderRadius: '1.5rem',
        padding: '1.75rem',
        display: 'grid',
        gap: '0.75rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 45px -35px rgba(15, 23, 42, 0.4)',
      }}
    >
      <span style={{ color: '#475569', fontSize: '0.9rem' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <strong style={{ fontSize: '2.25rem' }}>{value.toLocaleString('id-ID')}</strong>
        {unit ? <span style={{ color: '#64748b' }}>{unit}</span> : null}
      </div>
      <span style={{ color: trendColor[trend], fontWeight: 600 }}>{trend === 'up' ? '▲' : trend === 'down' ? '▼' : '▪'} {trend}</span>
    </article>
  );
}
