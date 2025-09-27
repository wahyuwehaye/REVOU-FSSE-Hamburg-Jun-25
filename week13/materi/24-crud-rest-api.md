# CRUD Operations with a REST API in Next.js

## Tujuan Pembelajaran
- Membangun API REST sederhana menggunakan Next.js route handlers.
- Mengonsumsi API tersebut dari Client Component.
- Mengelola state dan update UI setelah operasi CRUD.

## Struktur Contoh
```
app/
├─ api/
│  └─ todos/
│     └─ route.js
├─ todos/
│  └─ page.jsx
└─ components/
   └─ TodoList.jsx
```

## API Route CRUD
`app/api/todos/route.js`
```jsx
let todos = [
  { id: '1', title: 'Pelajari Next.js', done: false },
  { id: '2', title: 'Build API Routes', done: true },
];

export async function GET() {
  return Response.json(todos);
}

export async function POST(request) {
  const body = await request.json();
  const newTodo = { id: crypto.randomUUID(), ...body };
  todos.push(newTodo);
  return Response.json(newTodo, { status: 201 });
}

export async function PUT(request) {
  const body = await request.json();
  todos = todos.map((todo) => (todo.id === body.id ? { ...todo, ...body } : todo));
  return Response.json({ success: true });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  todos = todos.filter((todo) => todo.id !== id);
  return Response.json({ success: true });
}
```

## Konsumsi di Client Component
`app/todos/page.jsx`
```jsx
'use client';
import { useEffect, useState } from 'react';
import TodoList from '../components/TodoList';

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/todos')
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
        setLoading(false);
      });
  }, []);

  async function addTodo(event) {
    event.preventDefault();
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, done: false }),
    });
    const newTodo = await res.json();
    setTodos((prev) => [newTodo, ...prev]);
    setTitle('');
  }

  async function toggleTodo(id) {
    const target = todos.find((todo) => todo.id === id);
    await fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...target, done: !target.done }),
    });
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)));
  }

  async function deleteTodo(id) {
    await fetch(`/api/todos?id=${id}`, { method: 'DELETE' });
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  if (loading) return <p>Memuat...</p>;

  return (
    <main className="space-y-4">
      <form onSubmit={addTodo} className="flex gap-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Judul todo"
          className="flex-1 border p-2"
        />
        <button className="bg-indigo-500 text-white px-4 py-2">Tambah</button>
      </form>
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </main>
  );
}
```

`app/components/TodoList.jsx`
```jsx
'use client';

export default function TodoList({ todos, onToggle, onDelete }) {
  if (!todos.length) {
    return <p>Belum ada todo, yuk tambahkan!</p>;
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center justify-between border p-3 rounded">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => onToggle(todo.id)}
            />
            <span className={todo.done ? 'line-through text-slate-400' : ''}>{todo.title}</span>
          </label>
          <button onClick={() => onDelete(todo.id)} className="text-red-500 text-sm">
            Hapus
          </button>
        </li>
      ))}
    </ul>
  );
}
```

## Praktik yang Disarankan
- Gunakan state optimistic update agar UI terasa responsif.
- Tambahkan loading/error state untuk tiap operasi.
- Simpan data di database nyata (Prisma, Supabase) untuk produksi.

## Latihan Mandiri
- Tambahkan filter (All/Done/Active) di halaman todo.
- Implementasikan validasi server agar judul tidak kosong.
- Simpan data ke persistent storage (contoh: file JSON atau DB) bila memungkinkan.

## Rangkuman Singkat
- Next.js mempermudah pembuatan API REST berdampingan dengan UI.
- Client component dapat memanggil API menggunakan `fetch` standar.
- Gunakan state dan handler untuk mengelola create, read, update, delete secara reaktif.
