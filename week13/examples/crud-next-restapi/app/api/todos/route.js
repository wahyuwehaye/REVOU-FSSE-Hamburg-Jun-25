let todos = [
  { id: 't1', title: 'Pelajari useEffect', done: false },
  { id: 't2', title: 'Membuat API Route', done: true },
];

export async function GET() {
  return Response.json(todos);
}

export async function POST(request) {
  const body = await request.json();
  if (!body.title || !body.title.trim()) {
    return Response.json({ error: 'Judul wajib diisi.' }, { status: 400 });
  }
  const newTodo = { id: crypto.randomUUID(), title: body.title.trim(), done: false };
  todos = [newTodo, ...todos];
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
