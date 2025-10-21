"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Todo, TodoFilter } from "@/types/todo";
import { clearTodos, loadTodos, saveTodos } from "@/lib/storage";

export interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
}

const defaultState: TodoState = {
  todos: [],
  filter: "all",
};

export function useTodos() {
  const [state, setState] = useState<TodoState>(() => loadTodos(defaultState));

  useEffect(() => {
    saveTodos(state);
  }, [state]);

  const addTodo = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      todos: [
        ...prev.todos,
        {
          id: crypto.randomUUID(),
          title: trimmed,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      todos: prev.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    }));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      todos: prev.todos.filter((todo) => todo.id !== id),
    }));
  }, []);

  const clearCompleted = useCallback(() => {
    setState((prev) => ({
      ...prev,
      todos: prev.todos.filter((todo) => !todo.completed),
    }));
  }, []);

  const setFilter = useCallback((filter: TodoFilter) => {
    setState((prev) => ({ ...prev, filter }));
  }, []);

  const resetAll = useCallback(() => {
    clearTodos();
    setState(defaultState);
  }, []);

  const filteredTodos = useMemo(() => {
    if (state.filter === "active") return state.todos.filter((todo) => !todo.completed);
    if (state.filter === "completed") return state.todos.filter((todo) => todo.completed);
    return state.todos;
  }, [state.todos, state.filter]);

  const activeCount = useMemo(() => state.todos.filter((todo) => !todo.completed).length, [state.todos]);
  const completedCount = state.todos.length - activeCount;

  return {
    todos: state.todos,
    filter: state.filter,
    filteredTodos,
    activeCount,
    completedCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    setFilter,
    resetAll,
  };
}
