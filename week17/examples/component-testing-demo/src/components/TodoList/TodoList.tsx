import { FormEvent, useMemo, useState } from "react";

type Filter = "all" | "active" | "completed";

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
}

export function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const visibleTodos = useMemo(() => {
    if (filter === "active") return todos.filter((todo) => !todo.completed);
    if (filter === "completed") return todos.filter((todo) => todo.completed);
    return todos;
  }, [todos, filter]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: title.trim(), completed: false },
    ]);
    setTitle("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <section>
      <form onSubmit={handleSubmit} aria-label="form todo">
        <input
          placeholder="Tambah todo"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit">Tambah</button>
      </form>

      <div role="tablist" aria-label="Filter">
        {(["all", "active", "completed"] as Filter[]).map((option) => (
          <button
            key={option}
            role="tab"
            aria-selected={filter === option}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {visibleTodos.length === 0 ? (
        <p role="status">Belum ada todo</p>
      ) : (
        <ul>
          {visibleTodos.map((todo) => (
            <li key={todo.id}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span>{todo.title}</span>
              </label>
              <button type="button" onClick={() => removeTodo(todo.id)}>
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
