"use client";

import { TodoForm } from "@/components/TodoForm/TodoForm";
import { TodoItem } from "@/components/TodoItem/TodoItem";
import { useTodos } from "@/hooks/useTodos";
import type { TodoFilter } from "@/types/todo";

const filters: TodoFilter[] = ["all", "active", "completed"];

export function TodoApp() {
  const {
    filteredTodos,
    filter,
    activeCount,
    completedCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
    clearCompleted,
    resetAll,
  } = useTodos();

  return (
    <section className="card" style={{ width: "min(640px, 100%)", display: "grid", gap: "1.5rem" }}>
      <header style={{ display: "grid", gap: "0.5rem" }}>
        <h1 style={{ margin: 0 }}>Todo App dengan Testing</h1>
        <p style={{ margin: 0, color: "#475569" }}>Aktif: {activeCount} • Selesai: {completedCount}</p>
      </header>

      <TodoForm onSubmit={addTodo} />

      <div role="tablist" aria-label="Filter todo" style={{ display: "flex", gap: "0.75rem" }}>
        {filters.map((option) => (
          <button
            key={option}
            role="tab"
            aria-selected={filter === option}
            onClick={() => setFilter(option)}
            style={{
              background: filter === option ? "#2563eb" : "#e2e8f0",
              color: filter === option ? "white" : "#1f2937",
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {filteredTodos.length === 0 ? (
        <p role="status" style={{ color: "#64748b" }}>
          Belum ada todo sesuai filter.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem" }}>
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
          ))}
        </ul>
      )}

      <footer style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={clearCompleted}
          disabled={completedCount === 0}
          style={{ background: "#cbd5f5", color: "#1e293b" }}
        >
          Hapus selesai
        </button>
        <button
          type="button"
          onClick={resetAll}
          style={{ background: "#ef4444", color: "white" }}
        >
          Reset semua
        </button>
      </footer>
    </section>
  );
}
