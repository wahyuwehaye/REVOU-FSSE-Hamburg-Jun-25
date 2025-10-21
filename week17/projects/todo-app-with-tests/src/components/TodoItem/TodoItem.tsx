"use client";

import type { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="todo-item">
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`Tandai ${todo.title}`}
        />
        <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>{todo.title}</span>
      </label>
      <button type="button" onClick={() => onDelete(todo.id)} aria-label={`Hapus ${todo.title}`}>
        Hapus
      </button>
    </li>
  );
}
