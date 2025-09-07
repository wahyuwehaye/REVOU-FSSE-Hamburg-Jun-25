import { Status, Priority } from "@core/enum";
import type { Todo, Result, SearchParams } from "@core/models";
import { add, nextStatus, idAsString, paginate } from "@core/logic";
import { capitalize } from "@utils/string";
import { getTodoTitle } from "@utils/async";

// Introduction + Diff TS vs JS (narasi): TS = JS + static types (compile-time safety).

// Simple in-memory "repo" (pisah logic dan I/O = best practice)
const db: Todo[] = [];
const now = () => new Date();

function createTodo(title: string, priority: Priority = Priority.MEDIUM): Todo {
  const t: Todo = {
    id: Date.now().toString(),
    title: capitalize(title),
    status: Status.NEW,
    priority,
    createdAt: now()
  };
  db.push(t);
  return t;
}

function updateStatus(id: string, status: Status): Result<Todo> {
  const i = db.findIndex(t => t.id === id);
  if (i < 0) return { ok: false, error: "Not found" };
  db[i] = { ...db[i], status };
  return { ok: true, data: db[i] };
}

function search(params: SearchParams): Todo[] {
  const { query, page = 1, size = 5 } = params; // inference + annotation
  const filtered = db.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
  return paginate(filtered, page, size).data;
}

// ——— Demo ringkas di console ———
const t1 = createTodo("belajar typescript", Priority.HIGH);
const t2 = createTodo("setup jest");
console.log("[created]", db.map(t => `${t.title}[${t.status}]`));

const ns = nextStatus(t1.status);
const upd = updateStatus(t1.id, ns);
console.log("[update]", upd);

console.log("[idAsString for number]", idAsString(12345));
console.log("[search 'belajar']", search({ query: "belajar" }).length);

getTodoTitle(1).then(ttl => console.log("[async]", ttl));
console.log("[add(2,3)]", add(2, 3));
