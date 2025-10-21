"use client";

import { FormEvent, useState } from "react";

interface TodoFormProps {
  onSubmit: (title: string) => void;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  };

  const isDisabled = value.trim().length === 0;

  return (
    <form onSubmit={handleSubmit} aria-label="todo-form" className="todo-form">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Apa yang perlu dilakukan?"
        aria-label="todo-input"
      />
      <button type="submit" disabled={isDisabled} aria-disabled={isDisabled}>
        Tambah
      </button>
    </form>
  );
}
