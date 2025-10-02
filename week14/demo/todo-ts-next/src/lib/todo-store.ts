import type { Todo, UpdateTodoDto } from "@/types/todo";

const globalStore = globalThis as typeof globalThis & { __TODOS__?: Todo[] };

if (!globalStore.__TODOS__) {
  globalStore.__TODOS__ = [];
}

function getStore(): Todo[] {
  return globalStore.__TODOS__!;
}

export function listTodos(): Todo[] {
  return [...getStore()];
}

export function addTodo(todo: Todo): void {
  getStore().unshift(todo);
}

export function findTodo(id: string): Todo | undefined {
  return getStore().find((item) => item.id === id);
}

export function updateTodo(id: string, patch: UpdateTodoDto): Todo | undefined {
  const store = getStore();
  const index = store.findIndex((item) => item.id === id);
  if (index === -1) return undefined;
  const updated: Todo = { ...store[index], ...patch };
  store[index] = updated;
  return updated;
}

export function deleteTodo(id: string): boolean {
  const store = getStore();
  const index = store.findIndex((item) => item.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}
