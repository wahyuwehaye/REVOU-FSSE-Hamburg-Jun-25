const STORAGE_KEY = "todo-app-with-tests";

export function loadTodos<T>(fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error("Gagal membaca localStorage", error);
    return fallback;
  }
}

export function saveTodos<T>(value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function clearTodos() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
