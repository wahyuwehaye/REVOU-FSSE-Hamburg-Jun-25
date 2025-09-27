'use client';
import { useEffect, useState } from 'react';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';
import StatsBar from './components/StatsBar.jsx';

export default function TodoDashboard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setError('');
        const res = await fetch('/api/todos');
        if (!res.ok) throw new Error('Gagal mengambil data');
        const data = await res.json();
        if (!ignore) {
          setTodos(data);
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  async function addTodo(title) {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      const { error: message } = await res.json();
      throw new Error(message || 'Gagal menambah todo');
    }
    const newTodo = await res.json();
    setTodos((prev) => [newTodo, ...prev]);
  }

  async function toggleTodo(id) {
    const current = todos.find((todo) => todo.id === id);
    if (!current) return;
    const next = { ...current, done: !current.done };
    setTodos((prev) => prev.map((todo) => (todo.id === id ? next : todo)));
    await fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    });
  }

  async function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    await fetch(`/api/todos?id=${id}`, { method: 'DELETE' });
  }

  return (
    <main>
      {error && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fee2e2', borderRadius: '0.75rem', color: '#b91c1c' }}>
          {error}
        </div>
      )}
      <TodoForm onAdd={addTodo} />
      {loading ? (
        <p style={{ marginTop: '2rem', textAlign: 'center', color: '#64748b' }}>Memuat todo...</p>
      ) : (
        <>
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
          <StatsBar todos={todos} />
        </>
      )}
    </main>
  );
}
