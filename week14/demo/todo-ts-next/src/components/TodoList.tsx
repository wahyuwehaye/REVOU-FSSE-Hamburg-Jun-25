"use client";

import type { Todo } from "@/types/todo";
import Link from "next/link";
import type { Route } from "next";

type TodoListProps = {
  todos: Todo[];
  loading: boolean;
  onToggle: (id: string, done: boolean) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
};

export default function TodoList({ todos, loading, onToggle, onDelete }: TodoListProps) {
  const toggle = async (id: string, done: boolean) => {
    try {
      await onToggle(id, done);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal memperbarui todo");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus?")) return;
    try {
      await onDelete(id);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menghapus todo");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (todos.length === 0) return <p>Belum ada todo. Tambah di atas ya.</p>;

  return (
    <ul className="mt-3 space-y-2">
      {todos.map((t) => (
        <li key={t.id} className="flex items-center gap-2 rounded border p-2">
          <button
            onClick={() => toggle(t.id, t.done)}
            className={`h-4 w-4 rounded border ${t.done ? "bg-green-600" : ""}`}
            aria-label="toggle done"
          />
          <Link href={`/todos/${t.id}` as Route} className={`flex-1 ${t.done ? "line-through text-gray-500" : ""}`}>
            {t.title}
          </Link>
          <button onClick={() => remove(t.id)} className="rounded bg-red-600 px-2 py-1 text-white">
            Hapus
          </button>
        </li>
      ))}
    </ul>
  );
}
