import { BASE_URL } from "@/tests/server/handlers";

export async function fetchUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) {
    throw new Error("Gagal memuat users");
  }
  return res.json();
}

export async function createNote(payload: { title: string; content?: string }) {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? "Gagal membuat note");
  }
  return res.json();
}
