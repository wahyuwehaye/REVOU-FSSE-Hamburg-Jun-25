'use client';

export default function TodoList({ todos, onToggle, onDelete }) {
  if (!todos.length) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', background: 'white', borderRadius: '1.25rem' }}>
        <p style={{ color: '#475569' }}>Belum ada todo. Tambahkan lewat form di atas.</p>
      </div>
    );
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
      {todos.map((todo) => (
        <li
          key={todo.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 15px 35px -25px rgba(15, 23, 42, 0.4)',
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => onToggle(todo.id)}
            />
            <span style={{
              color: todo.done ? '#94a3b8' : '#0f172a',
              textDecoration: todo.done ? 'line-through' : 'none',
            }}>
              {todo.title}
            </span>
          </label>
          <button
            onClick={() => onDelete(todo.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#dc2626',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            type="button"
          >
            Hapus
          </button>
        </li>
      ))}
    </ul>
  );
}
