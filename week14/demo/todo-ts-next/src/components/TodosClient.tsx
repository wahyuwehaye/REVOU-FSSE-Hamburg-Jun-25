"use client";

import { useCallback, useEffect, useState } from "react";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import type { Todo, CreateTodoDto } from "@/types/todo";

type TodosClientProps = {
  initialFilter?: string;
};

function parseJson<T>(value: Response): Promise<T | null> {
  return value
    .json()
    .then((data) => data as T)
    .catch(() => null);
}

export default function TodosClient({ initialFilter }: TodosClientProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/todos", { cache: "no-store" });
      const data = await parseJson<Todo[]>(res);
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat todos", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const createTodo = async (payload: CreateTodoDto) => {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await parseJson<Todo & { message?: string }>(res);
    if (!res.ok || !body || Array.isArray(body)) {
      const message =
        body && typeof body === "object" && "message" in body
          ? (body.message as string | undefined)
          : undefined;
      throw new Error(message ?? res.statusText);
    }

    setTodos((prev) => [body, ...prev]);
  };

  const toggleTodo = async (id: string, done: boolean) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !done }),
    });

    const body = await parseJson<Todo & { message?: string }>(res);
    if (!res.ok || !body || Array.isArray(body)) {
      throw new Error("Gagal memperbarui todo");
    }

    setTodos((prev) => prev.map((item) => (item.id === id ? body : item)));
  };

  const deleteTodo = async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (!res.ok) {
      throw new Error("Gagal menghapus todo");
    }
    setTodos((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold">Todos</h2>
      <TodoForm onCreate={createTodo} />
      <TodoList
        todos={todos}
        loading={loading}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
      {initialFilter && (
        <p className="mt-2 text-sm text-gray-600">Filter (dummy): {initialFilter}</p>
      )}
    </section>
  );
}
