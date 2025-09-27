'use client';

export default function StatsBar({ todos }) {
  const total = todos.length;
  const done = todos.filter((todo) => todo.done).length;

  return (
    <div
      style={{
        marginTop: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        background: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '1rem',
        color: '#334155',
      }}
    >
      <span>Total: {total}</span>
      <span>Selesai: {done}</span>
      <span>Progress: {total ? Math.round((done / total) * 100) : 0}%</span>
    </div>
  );
}
