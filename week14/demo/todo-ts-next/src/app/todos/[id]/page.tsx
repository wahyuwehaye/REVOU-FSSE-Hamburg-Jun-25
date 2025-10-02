import type { Todo } from "@/types/todo";

export default async function TodoDetail({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/todos`, {
    cache: "no-store",
  });
  const list = (await res.json()) as Todo[];
  const todo = list.find((t) => t.id === params.id);

  if (!todo) {
    return <p className="text-red-600">Todo tidak ditemukan</p>;
  }

  return (
    <article>
      <h3 className="text-lg font-semibold">Detail Todo</h3>
      <p>ID: {todo.id}</p>
      <p>Dibuat: {new Date(todo.createdAt).toLocaleString()}</p>
      <EditClient id={todo.id} title={todo.title} done={todo.done} />
    </article>
  );
}

function EditClient({ id, title, done }: { id: string; title: string; done: boolean }) {
  "use client";
  const onSave = async (formData: FormData) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: formData.get("title"), done: formData.get("done") === "on" }),
    });
    if (!res.ok) alert("Gagal simpan");
    else alert("Tersimpan");
  };

  return (
    <form action={onSave} className="mt-3 flex flex-col gap-2">
      <input name="title" defaultValue={title} className="rounded border px-3 py-2" />
      <label className="flex items-center gap-2">
        <input type="checkbox" name="done" defaultChecked={done} /> Selesai
      </label>
      <button className="w-fit rounded bg-blue-600 px-3 py-2 text-white">Simpan</button>
    </form>
  );
}
