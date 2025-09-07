# 1) Introduction to TypeScript

**Apa itu TypeScript?**
TypeScript (TS) adalah *superset* dari JavaScript (JS) yang menambahkan **static typing**. Artinya: kamu bisa memberi tipe data pada variabel, parameter, return function, dsb. TS dikompilasi menjadi JS sebelum dijalankan (di browser atau Node.js).

**Kenapa pakai TS?**

* *Early error detection*: kesalahan tipe terdeteksi saat compile, bukan pas runtime.
* *Auto-complete & refactor lebih aman*: DX (developer experience) jauh lebih enak.
* *Skalabilitas*: codebase besar, tim, dan arsitektur bertumbuh lebih tertata.

**Cara kerja singkat**
`kode.ts` ➜ (TypeScript compiler `tsc`) ➜ `kode.js` ➜ dijalankan oleh JS runtime.

**Latihan singkat**

* Instalasi minimal (di folder kosong):

  ```bash
  npm init -y
  npm i -D typescript ts-node @types/node
  npx tsc --init
  ```
* Buat `hello.ts`:

  ```ts
  const name: string = "Wahyu";
  console.log(`Hello, ${name}!`);
  ```
* Jalankan cepat:

  ```bash
  npx ts-node hello.ts
  ```

  (Untuk produksi, biasanya `npx tsc` dulu ➜ jalankan output `.js`)

---

# 2) Difference between TypeScript and JavaScript

| Aspek      | JavaScript                      | TypeScript                           |
| ---------- | ------------------------------- | ------------------------------------ |
| Tipe data  | Dinamis (dicek saat runtime)    | Statis (dicek saat compile)          |
| Error tipe | Baru ketahuan ketika dijalankan | Ketahuan lebih dini saat compile     |
| Tooling    | Bagus                           | Lebih bagus (intellisense, refactor) |
| Sintaks    | ESNext                          | ESNext + anotasi tipe & fitur TS     |
| Eksekusi   | Langsung oleh JS engine         | Perlu compile ke JS                  |

**Contoh perbedaan**

```js
// JavaScript (boleh-boleh saja, error ketahuan saat runtime)
function add(a, b) {
  return a + b;
}
console.log(add("1", 2)); // "12" (bukan 3)
```

```ts
// TypeScript (akan warning di compile-time)
function add(a: number, b: number): number {
  return a + b;
}
// console.log(add("1", 2)); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
console.log(add(1, 2)); // 3
```

**Practice**

* Ubah fungsi `add` TS di atas agar menerima number **atau** string angka, dan tetap mengembalikan *number* (hint: union type + type narrowing).

---

# 3) Understanding TypeScript Nature and Syntax

**Nature**: TS menambah *type annotations* & pemeriksaan tipe tanpa mengubah cara JS bekerja. Hasil akhirnya tetap JS yang kompatibel.

**Sintaks inti**:

* Anotasi variabel: `const age: number = 18;`
* Anotasi parameter & return:
  `function greet(name: string): string { return "Hi " + name }`
* Interface & type alias
* Generic: `function wrap<T>(value: T): T[] { return [value]; }`

**Practice**

* Buat fungsi `safeDivide(a,b)` yang:

  * `a` dan `b` bertipe number
  * return `number | null` (null jika `b === 0`)

---

# 4) Overview of TypeScript features and paradigms

Fitur penting (yang sering dipakai):

* **Basic & advanced types** (union, intersection, literal, tuple, enum)
* **Type inference** (TS “menebak” tipe)
* **Interfaces & type aliases**
* **Generics**
* **Type narrowing** (refine tipe saat runtime check)
* **Utility & mapped types** (`Partial<T>`, `Pick<T>`, `Readonly<T>`, dsb.)
* **Declaration merging** (khusus interface)
* **Module system** (ES modules, `import`/`export`)

Paradigma umum:

* **Type-driven design**: desain tipe dulu supaya domain jelas.
* **Immutability & purity** (didukung tooling, bukan dipaksa).
* **Progressive adoption**: bisa adopsi bertahap di proyek JS eksisting.

**Practice**

* Buat *type alias* `Result<T>`: `{ ok: true; data: T } | { ok: false; error: string }` dan pakai di fungsi `fetchUser()` (mock) yang bisa sukses/gagal.

---

# 5) TypeScript Data Types

**Primitif**: `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`
**Lainnya**: `object`, `any`, `unknown`, `never`, `void`, `array`, `tuple`, `enum`, `literal types`.

Contoh:

```ts
let s: string = "text";
let n: number = 42;
let b: boolean = true;
let arr: number[] = [1, 2, 3];
let tup: [string, number] = ["age", 18];

enum Role { Admin = "ADMIN", User = "USER" }
let r: Role = Role.Admin;

let u: unknown = JSON.parse('{"a":1}');
let v: void = undefined;
```

**unknown vs any**

* `any`: mematikan pemeriksaan tipe.
* `unknown`: harus di-*narrow* sebelum dipakai.

**Practice**

* Buat tuple `[id: string, isActive: boolean, scores: number[]]` dan fungsi yang memvalidasi tuple tersebut.

---

# 6) Type Inference and Annotation

TS sering bisa menebak tipe:

```ts
let x = "hello"; // inferred string
const y = 10;    // inferred 10 (literal type) untuk const
```

Tambahkan anotasi saat:

* Parameter fungsi dan return type
* API publik (ekspor modul)
* Saat inference membuat bingung (union kompleks)

**Practice**

* Tulis fungsi `sum(arr)` tanpa anotasi parameter → lihat inference.
  Lalu tambahkan anotasi yang lebih ketat `number[]`.

---

# 7) Functions and Function Signatures

**Dasar**

```ts
function greet(name: string, title?: string): string {
  return `Hello, ${title ? title + " " : ""}${name}`;
}
const arrow = (x: number, y: number): number => x + y;
```

**Signature (type alias)**

```ts
type BinaryOp = (a: number, b: number) => number;

const add: BinaryOp = (a, b) => a + b;
const mul: BinaryOp = (a, b) => a * b;
```

**Overloads**

```ts
function toArray(x: string): string[];
function toArray(x: number): number[];
function toArray(x: string | number) {
  return typeof x === "string" ? x.split("") : [x];
}
```

**Practice**

* Buat `formatCurrency(amount, currency?)` dengan default `"IDR"`, kembalikan string terformat. Tulis *signature*-nya sebagai type alias.

---

# 8) Advanced Type System (yang paling kepake)

### a) Union & Narrowing

```ts
type Id = number | string;

function getIdLen(id: Id): number {
  if (typeof id === "string") return id.length; // narrowing
  return id.toString().length;
}
```

### b) Literal Types & Discriminated Union

```ts
type Status = "NEW" | "IN_PROGRESS" | "DONE";

type NewTask = { type: "NEW"; title: string };
type InProgress = { type: "IN_PROGRESS"; title: string; assignee: string };
type Done = { type: "DONE"; title: string; finishedAt: Date };

type Task = NewTask | InProgress | Done;

function printTask(t: Task) {
  switch (t.type) {
    case "NEW": /* ... */ break;
    case "IN_PROGRESS": /* ... */ break;
    case "DONE": /* ... */ break;
  }
}
```

### c) Generics

```ts
function wrap<T>(value: T): T[] { return [value]; }

interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
```

### d) Keyof, Indexed Access, Mapped, Utility

```ts
type Person = { id: string; name: string; age?: number };
type PersonKeys = keyof Person; // "id" | "name" | "age"
type NameType = Person["name"]; // string

type ReadonlyPerson = Readonly<Person>;
type PartialPerson = Partial<Person>;
type PickPerson = Pick<Person, "id" | "name">;

type Optional<T> = { [K in keyof T]?: T[K] };
```

### e) Conditional Types (sekilas)

```ts
type NonNull<T> = T extends null | undefined ? never : T;
type ResultData<R> = R extends { ok: true; data: infer D } ? D : never;
```

**Practice**

* Buat generic `paginate<T>(items: T[], page: number, size: number): { data: T[]; total: number; page: number; size: number }`.

---

# 9) Async Programming with TypeScript

**Promise & async/await**

```ts
function delay(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}

async function run() {
  await delay(500);
  console.log("done");
}
```

**Typing fetch (Node 18+ sudah ada `fetch`)**

```ts
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

async function getTodo(id: number): Promise<Todo> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  if (!res.ok) throw new Error("Network error");
  return res.json() as Promise<Todo>;
}

(async () => {
  const todo = await getTodo(1);
  console.log(todo.title);
})();
```

**Error handling terketik**

```ts
async function safeGetTodo(id: number): Promise<{ ok: true; data: Todo } | { ok: false; error: string }> {
  try {
    const data = await getTodo(id);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
```

**Practice**

* Buat fungsi `getUsers()` (pakai placeholder API manapun), tipenya `Promise<User[]>`, lalu buat versi aman `safeGetUsers()` mengembalikan *Result*.

---

# 10) Interface

**Interface** mendeskripsikan bentuk objek & bisa di-*merge*.

```ts
interface User {
  id: string;
  name: string;
  email?: string;
}

function printUser(u: User) {
  console.log(`${u.id} - ${u.name}`);
}
```

**Extends & merging**

```ts
interface Timestamped { createdAt: Date; updatedAt: Date; }
interface Employee extends User, Timestamped {
  role: "ADMIN" | "STAFF";
}
```

**Declaration merging (khusus interface)**

```ts
interface Box { content: string; }
// di file lain:
interface Box { fragile?: boolean; }
// hasil: Box punya content & fragile
```

**Practice**

* Buat `interface Product` dan `interface WithAudit` lalu `interface AuditedProduct extends Product, WithAudit`.

---

# 11) Intersection and Type (Type Aliases)

**Type alias**: memberi nama pada tipe:

```ts
type ID = string | number;
type Point = { x: number; y: number };
```

**Intersection (`&`)**: gabungkan tipe (harus memenuhi semua).

```ts
type WithId = { id: string };
type WithTimestamps = { createdAt: Date; updatedAt: Date };
type Entity = WithId & WithTimestamps;

const e: Entity = { id: "1", createdAt: new Date(), updatedAt: new Date() };
```

**Interface vs Type**

* `interface`: bisa *extends*, *declaration merging*.
* `type`: bisa pakai union/intersection, conditional types.
* Untuk object shape yang mungkin akan di-extend: **interface**.
* Untuk kombinasi kompleks (union/intersection): **type**.

**Practice**

* Buat `type Searchable = { query: string } & { page?: number; size?: number }`, lalu fungsi `search(params: Searchable)`.

---

# 12) Contoh Program Sederhana (Mini-Project)

Kita buat **Todo CLI** kecil di Node.js + TypeScript yang mempraktikkan:

* tipe dasar, interface, type alias, union/intersection,
* fungsi & signature, generics, utility types,
* async/await (simulasi I/O), dan
* modul & struktur project.

## 12.1 Setup Project

```bash
mkdir ts-todo-cli && cd ts-todo-cli
npm init -y
npm i -D typescript ts-node @types/node
npx tsc --init
```

Edit `tsconfig.json` (bagian penting):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

Tambahkan script di `package.json`:

```json
{
  "type": "module",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## 12.2 Struktur Folder

```
src/
  types.ts
  storage.ts
  todo.ts
  index.ts
```

### `src/types.ts`

```ts
export type ID = string;

export type Status = "NEW" | "IN_PROGRESS" | "DONE";

export interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

export interface Todo extends Timestamped {
  id: ID;
  title: string;
  description?: string;
  status: Status;
  tags?: string[];
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// Utility generic
export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  size: number;
};

// Intersection sample
export type Searchable = { query?: string } & { page?: number; size?: number };
```

### `src/storage.ts` (simulasi storage in-memory + async)

```ts
import { Todo, ID, Result, Paginated } from "./types.js";

let todos: Todo[] = [];

function now(): Date { return new Date(); }
function delay(ms = 200) { return new Promise(res => setTimeout(res, ms)); }

export async function createTodo(
  title: string,
  description?: string
): Promise<Result<Todo>> {
  await delay();
  const t: Todo = {
    id: crypto.randomUUID(),
    title,
    description,
    status: "NEW",
    createdAt: now(),
    updatedAt: now()
  };
  todos.push(t);
  return { ok: true, data: t };
}

export async function listTodos(page = 1, size = 10): Promise<Result<Paginated<Todo>>> {
  await delay();
  const start = (page - 1) * size;
  const data = todos.slice(start, start + size);
  return { ok: true, data: { data, total: todos.length, page, size } };
}

export async function findTodo(id: ID): Promise<Result<Todo>> {
  await delay();
  const found = todos.find(t => t.id === id);
  return found ? { ok: true, data: found } : { ok: false, error: "Not found" };
}

export async function updateTodo(
  id: ID,
  patch: Partial<Omit<Todo, "id" | "createdAt">>
): Promise<Result<Todo>> {
  await delay();
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return { ok: false, error: "Not found" };
  const updated: Todo = { ...todos[idx], ...patch, updatedAt: now() };
  todos[idx] = updated;
  return { ok: true, data: updated };
}

export async function removeTodo(id: ID): Promise<Result<ID>> {
  await delay();
  const before = todos.length;
  todos = todos.filter(t => t.id !== id);
  return todos.length < before
    ? { ok: true, data: id }
    : { ok: false, error: "Not found" };
}
```

> Catatan: Node 18+ sudah punya `crypto.randomUUID()`. Jika belum, bisa pakai paket `uuid`.

### `src/todo.ts` (fungsi domain + type narrowing)

```ts
import { Todo, Status } from "./types.js";

export function isDone(t: Todo): boolean {
  return t.status === "DONE";
}

export function nextStatus(s: Status): Status {
  switch (s) {
    case "NEW": return "IN_PROGRESS";
    case "IN_PROGRESS": return "DONE";
    case "DONE": return "DONE";
  }
}
```

### `src/index.ts` (CLI sederhana)

```ts
import { createTodo, listTodos, updateTodo, removeTodo } from "./storage.js";
import { nextStatus } from "./todo.js";

async function main() {
  console.log("== Todo CLI ==");

  // Create
  const t1 = await createTodo("Belajar TypeScript", "Materi dasar & latihan");
  const t2 = await createTodo("Implement mini project");
  if (t1.ok && t2.ok) {
    console.log("Created:", t1.data.title, "|", t2.data.title);
  }

  // List
  const list1 = await listTodos(1, 10);
  if (list1.ok) {
    console.log("Total todos:", list1.data.total);
    for (const t of list1.data.data) {
      console.log(`- [${t.status}] ${t.title} (${t.id})`);
    }
  }

  // Update status todo pertama
  if (t1.ok) {
    const next = nextStatus(t1.data.status);
    const updated = await updateTodo(t1.data.id, { status: next });
    if (updated.ok) {
      console.log("Updated:", updated.data.title, "->", updated.data.status);
    }
  }

  // Remove todo kedua
  if (t2.ok) {
    const removed = await removeTodo(t2.data.id);
    console.log("Remove result:", removed.ok ? "OK" : removed.error);
  }

  // List lagi
  const list2 = await listTodos(1, 10);
  if (list2.ok) {
    console.log("After ops, total:", list2.data.total);
  }
}

main().catch(e => console.error(e));
```

**Jalankan**

```bash
npm run dev
# atau produksi
npm run build && npm start
```

---

# 13) Paket Latihan (Practice Set)

Latihan disusun dari mudah → sedang:

### Level Dasar

1. Buat fungsi `capitalize(s: string): string` (pakai TS). Tambahkan tes kecil di file ts yang sama.
2. Definisikan `interface Student { id: string; name: string; gpa?: number }` dan fungsi `printStudent(stu: Student)`.
3. Buat `type Currency = "IDR" | "USD" | "EUR"` dan fungsi `format(amount: number, cur: Currency): string`.

### Level Menengah

4. Generic `pluck<T, K extends keyof T>(obj: T, keys: K[]): T[K][]`.
5. Utility: buat `type DeepReadonly<T>` (cukup untuk object 1 level).
6. Buat `Result<T>` dan pakai di `parseJSON<T>(text: string): Result<T>` (gunakan `unknown` lalu *narrow*).

### Level Lanjutan

7. Implement `paginate<T>` seperti di bagian advanced.
8. Buat *discriminated union* `Event` (misal: `"USER_CREATED"`, `"USER_DELETED"`, `"USER_UPDATED"`) dan fungsi `handleEvent(e: Event)` dengan `switch`.
9. Buat *intersection type* `Searchable & Sortable` lalu fungsi `query(params)` yang memvalidasi kombinasi param.

### Level Async

10. `getPosts(): Promise<Post[]>` (API bebas/placeholder), lalu `safeGetPosts(): Promise<Result<Post[]>>`.
11. Buat `retry<T>(fn: () => Promise<T>, max: number): Promise<T>` dengan pengetikan yang benar.

---

# 14) Tips adopsi TypeScript (buat tim & proyek berjalan)

* Mulai dari file penting dulu (progressive).
* Aktifkan `strict: true` di `tsconfig.json` (best practice).
* Gunakan type tepat pada API boundary (controller/service/repo).
* Hindari `any`. Jika perlu, pakai `unknown` + *narrowing*.
* Tulis tipe untuk data kontrak (DTO), bukan hanya implementasi.

---

# Cara Menjalankan (3 langkah)

```bash
mkdir ts-demo && cd ts-demo
npm init -y
npm i -D typescript ts-node @types/node
```

Buat file `index.ts` (isi di bawah). Lalu jalankan:

```bash
npx ts-node index.ts
```

> (Opsional) kalau mau build ke JS: `npx tsc --init && npx tsc && node dist/index.js`

---

# index.ts — “Kitchen-Sink” TypeScript Demo (lengkap & mudah)

```ts
/*************************************************
 * DEMO TYPECRIPT SEDERHANA — satu file mencakup:
 * - Intro & perbedaan dengan JavaScript
 * - Data types, inference & annotation
 * - Functions & signatures (overload sekilas)
 * - Interface, type alias, intersection (&)
 * - Advanced types (union, narrowing, generics)
 * - Utility types (Partial, Readonly)
 * - Async/await + pengetikan Promise
 * - Discriminated union untuk flow aman
 *************************************************/



// ============ 2) DATA TYPES, INFERENCE, ANNOTATION ============
const appName = "TS Demo";          // inference -> string
let counter: number = 0;            // explicit annotation
let isActive = true;                // inference -> boolean
const labels: string[] = ["new", "urgent"]; // array of string
const point: [number, number] = [10, 20];   // tuple

enum Role { Admin = "ADMIN", Staff = "STAFF" }
const role: Role = Role.Admin;

// unknown vs any
let mystery: unknown = JSON.parse('{"x":1}');
// console.log(mystery.x)           // ❌ harus dinarrow
if (typeof mystery === "object" && mystery !== null) {
  // sekarang aman kalau mau read property dengan pemeriksaan lebih lanjut
}

/** Latihan ide: ubah 'point' jadi tuple [x, y, label?] dan log kondisional label jika ada. */


// ============ 3) TYPE INFERENCE & ANNOTATION ============
function safeDivide(a: number, b: number): number | null {
  return b === 0 ? null : a / b;
}
console.log("[safeDivide] 10/2 =", safeDivide(10, 2));
console.log("[safeDivide] 10/0 =", safeDivide(10, 0));


// ============ 4) FUNCTIONS & FUNCTION SIGNATURES ============
type BinaryOp = (a: number, b: number) => number;

const add: BinaryOp = (a, b) => a + b;
const mul: BinaryOp = (a, b) => a * b;

function greet(name: string, title?: string): string {
  return `Hello, ${title ? title + " " : ""}${name}`;
}
console.log("[greet]", greet("Wahyu"));
console.log("[greet]", greet("Wahyu", "Mr."));

/** Overload sederhana untuk toArray */
function toArray(x: string): string[];
function toArray(x: number): number[];
function toArray(x: string | number) {
  return typeof x === "string" ? x.split("") : [x];
}
console.log("[toArray:string]", toArray("TS"));
console.log("[toArray:number]", toArray(42));


// ============ 5) INTERFACE ============
// Interface untuk mendeskripsikan bentuk objek
interface User {
  id: string;
  name: string;
  email?: string; // optional
}

// Interface bisa extend:
interface Timestamped { createdAt: Date; updatedAt: Date; }
interface Employee extends User, Timestamped {
  role: Role;
}

function printUser(u: User) {
  console.log(`[User] ${u.id} - ${u.name}${u.email ? " <" + u.email + ">" : ""}`);
}

const u1: User = { id: "U-1", name: "Wahyu" };
printUser(u1);


// ============ 6) TYPE ALIAS & INTERSECTION (&) ============
type ID = string | number;
type WithId = { id: ID };
type WithAudit = { createdAt: Date; updatedAt: Date };
type Entity = WithId & WithAudit; // intersection: harus punya semua field

const e1: Entity = { id: "E-1", createdAt: new Date(), updatedAt: new Date() };
console.log("[Entity]", e1);

// Type alias untuk bentuk yang fleksibel
type Currency = "IDR" | "USD" | "EUR";

function formatCurrency(amount: number, cur: Currency = "IDR"): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: cur }).format(amount);
}
console.log("[formatCurrency]", formatCurrency(125000));


// ============ 7) ADVANCED TYPES: UNION & NARROWING ============
type Id = string | number;

function idToLength(id: Id): number {
  // Narrowing via typeof
  return typeof id === "string" ? id.length : id.toString().length;
}
console.log("[idToLength] 'ABC' ->", idToLength("ABC"));
console.log("[idToLength] 12345 ->", idToLength(12345));

// Discriminated union — aman untuk flow melalui switch case
type NewTask = { type: "NEW"; title: string };
type InProgress = { type: "IN_PROGRESS"; title: string; assignee: string };
type Done = { type: "DONE"; title: string; finishedAt: Date };
type Task = NewTask | InProgress | Done;

function printTask(t: Task) {
  switch (t.type) {
    case "NEW":
      console.log(`🆕 NEW: ${t.title}`);
      break;
    case "IN_PROGRESS":
      console.log(`🏃 IN_PROGRESS: ${t.title} by ${t.assignee}`);
      break;
    case "DONE":
      console.log(`✅ DONE: ${t.title} at ${t.finishedAt.toISOString()}`);
      break;
  }
}

printTask({ type: "NEW", title: "Belajar TS" });
printTask({ type: "IN_PROGRESS", title: "Implement Demo", assignee: "Wahyu" });
printTask({ type: "DONE", title: "Presentasi", finishedAt: new Date() });


// ============ 8) GENERICS (dasar yang sering dipakai) ============
function wrap<T>(value: T): T[] { return [value]; }
console.log("[wrap<number>]", wrap(7));
console.log("[wrap<User>]", wrap<User>({ id: "U-2", name: "Student" }));

interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

// Contoh generic utility: paginate
type Page<T> = { data: T[]; total: number; page: number; size: number };
function paginate<T>(items: T[], page: number, size: number): Page<T> {
  const start = (page - 1) * size;
  return { data: items.slice(start, start + size), total: items.length, page, size };
}
console.log("[paginate]", paginate([1,2,3,4,5], 2, 2)); // page 2, size 2 => [3,4]


// ============ 9) UTILITY TYPES (built-in) ============
interface Product { id: string; name: string; stock: number; price: number; }
type PartialProduct = Partial<Product>;     // semua optional
type ReadonlyProduct = Readonly<Product>;   // tidak bisa dimutasi

const p1: ReadonlyProduct = { id: "P-1", name: "Kaos Ringer", stock: 10, price: 100000 };
// p1.price = 120000; // ❌ error: Readonly

const patch: PartialProduct = { stock: 12 }; // boleh hanya sebagian


// ============ 10) ASYNC PROGRAMMING with TypeScript ============
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// Simulasi "fetch" tanpa jaringan: delay + data dummy
function delay(ms: number) {
  return new Promise<void>(res => setTimeout(res, ms));
}

async function getTodo(id: number): Promise<Todo> {
  await delay(200);
  // data dummy
  return { id, title: `Todo #${id}`, completed: id % 2 === 0 };
}

// Versi aman (Result)
type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function safeGetTodo(id: number): Promise<Result<Todo>> {
  try {
    const data = await getTodo(id);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

(async () => {
  console.log("\n=== ASYNC DEMO ===");
  const t1 = await getTodo(1);
  console.log("[getTodo]", t1);

  const r1 = await safeGetTodo(2);
  console.log("[safeGetTodo]", r1.ok ? r1.data : r1.error);
})();


// ============ 11) INTERSECTION & TYPE PRAKTIK CEPAT ============
type Searchable = { query: string } & { page?: number; size?: number };
function search(params: Searchable): string {
  const page = params.page ?? 1;
  const size = params.size ?? 10;
  return `Searching "${params.query}" (page=${page}, size=${size})`;
}
console.log("[search]", search({ query: "typescript tutorial", page: 2 }));


// ============ 12) MINI DEMO TERAKHIR: CRUD IN-MEMORY RINGKAS ============
interface TodoItem extends Timestamped {
  id: string;
  title: string;
  status: "NEW" | "DONE";
}

const db: TodoItem[] = [];

function now() { return new Date(); }

function createTodo(title: string): TodoItem {
  const item: TodoItem = { id: crypto.randomUUID(), title, status: "NEW", createdAt: now(), updatedAt: now() };
  db.push(item);
  return item;
}

function listTodo(): Readonly<TodoItem[]> {
  return db; // Readonly pada signature memberi sinyal "jangan mutate dari luar"
}

function toggleDone(id: string): Result<TodoItem> {
  const idx = db.findIndex(i => i.id === id);
  if (idx < 0) return { ok: false, error: "Not found" };
  const cur = db[idx];
  const next: TodoItem = { ...cur, status: cur.status === "NEW" ? "DONE" : "NEW", updatedAt: now() };
  db[idx] = next;
  return { ok: true, data: next };
}

(function quickCrudDemo() {
  console.log("\n=== QUICK CRUD DEMO ===");
  const a = createTodo("Belajar TS");
  const b = createTodo("Siapkan Materi TL");
  console.log("Created:", listTodo().map(t => `${t.title}[${t.status}]`).join(", "));

  const tgl = toggleDone(a.id);
  if (tgl.ok) console.log("Toggled:", tgl.data.title, "->", tgl.data.status);

  console.log("All:", listTodo().map(t => `${t.title}[${t.status}]`).join(", "));
})();
```

---

## src/01-intro.ts — Introduction to TypeScript

```ts
/**
 * INTRO: TypeScript = JavaScript + static typing.
 * Compile: .ts -> tsc -> .js -> run di Node/browser
 */

const name: string = "Wahyu";
const msg = `Hello, ${name}!`; // inference: string
console.log(msg);

// Latihan: ubah "name" ke number dan lihat error compile.
// Lalu perbaiki lagi jadi string.
```

Jalankan: `npx ts-node src/01-intro.ts` atau `npm run run:01`

---

## src/02-diff-ts-vs-js.ts — Difference TS vs JS

```ts
/**
 * Perbedaan umum:
 * - JS: dynamic typing (error ketahuan saat runtime)
 * - TS: static typing (error ketahuan saat compile)
 */

function add(a: number, b: number): number {
  return a + b;
}

console.log("[OK]", add(1, 2));
// console.log("[ERROR]", add("1" as any, 2)); // coba: hapus "as any" -> error compile

// Latihan: buat versi "addSmart" yang menerima number | string angka, return number.
```

---

## src/03-nature-syntax.ts — Understanding Nature & Syntax

```ts
/**
 * Nature: TS menambah anotasi tipe tanpa mengubah cara kerja JS.
 * Syntax dasar: anotasi variabel, parameter, return type, generic sederhana.
 */

const age: number = 20;
function greet(name: string): string {
  return `Hi, ${name}!`;
}
console.log(greet("Student"));

function wrap<T>(value: T): T[] {
  return [value];
}
console.log(wrap<number>(7), wrap("TS"));

// Latihan: buat "safeDivide(a:number,b:number): number|null" (null jika b=0).
```

---

## src/04-features-paradigms.ts — Overview Features & Paradigms

```ts
/**
 * Fitur ringkas: union/intersection, interface/type alias, generics, utility types, narrowing, enum.
 * Paradigma: type-driven design, progressive adoption, strict mode.
 */

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

function parseJSON<T>(text: string): Result<T> {
  try {
    return { ok: true, data: JSON.parse(text) as T };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
console.log(parseJSON<{ x: number }>('{"x":1}'));
console.log(parseJSON("not-json"));

// Latihan: buat "fetchUserMock(): Result<{id:string;name:string}>" (tanpa async).
```

---

## src/05-data-types.ts — TypeScript Data Types

```ts
/**
 * Primitif: string, number, boolean, null/undefined, bigint, symbol
 * Struktur: array, tuple, enum, object
 * Spesial: any (hindari), unknown (narrow dulu), void, never
 */

enum Role { Admin="ADMIN", User="USER" }

let s: string = "text";
let n: number = 42;
let b: boolean = true;
let arr: number[] = [1, 2, 3];
let tup: [string, number] = ["age", 18];
let r: Role = Role.Admin;

let u: unknown = JSON.parse('{"a":1}');
if (typeof u === "object" && u !== null) {
  console.log("unknown sudah di-narrow:", u);
}

// Latihan: buat tuple [id:string, active:boolean, scores:number[]] dan fungsi validator.
```

---

## src/06-inference-annotation.ts — Type Inference & Annotation

```ts
/**
 * Inference: TS menebak tipe otomatis.
 * Anotasi: wajib untuk API boundary / param / return / kompleks.
 */

let title = "TS";          // string
const v = 10;              // literal 10 (const)
function sum(arr: number[]): number {
  return arr.reduce((a, c) => a + c, 0);
}
console.log(sum([1, 2, 3]));

// Latihan: tulis fungsi "avg(numbers)" tanpa anotasi param, lihat inference.
// Lalu tambahkan anotasi number[] dan return number.
```

---

## src/07-functions-signatures.ts — Functions & Signatures

```ts
/**
 * Function signature via type alias + optional/default param + overload.
 */

type BinaryOp = (a: number, b: number) => number;
const add: BinaryOp = (a, b) => a + b;
const mul: BinaryOp = (a, b) => a * b;

function formatCurrency(amount: number, currency: "IDR"|"USD" = "IDR"): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency }).format(amount);
}
console.log(add(2, 3), mul(2, 3), formatCurrency(125000));

function toArray(x: string): string[];
function toArray(x: number): number[];
function toArray(x: string | number) {
  return typeof x === "string" ? x.split("") : [x];
}
console.log(toArray("TS"), toArray(7));

// Latihan: buat alias type "Formatter" untuk (v:number, locale?:string)=>string dan implementasinya.
```

---

## src/08-advanced-types.ts — Advanced Type System

```ts
/**
 * Union + narrowing, literal types, discriminated union, generics, utility & mapped types.
 */

// Union + narrowing
type Id = string | number;
function idAsString(id: Id): string {
  return typeof id === "string" ? id : String(id);
}
console.log(idAsString("ABC"), idAsString(123));

// Discriminated union
type NewTask = { type: "NEW"; title: string };
type DoingTask = { type: "DOING"; title: string; assignee: string };
type DoneTask = { type: "DONE"; title: string; finishedAt: Date };
type Task = NewTask | DoingTask | DoneTask;

function printTask(t: Task) {
  switch (t.type) {
    case "NEW":   return console.log("🆕", t.title);
    case "DOING": return console.log("🏃", t.title, "-", t.assignee);
    case "DONE":  return console.log("✅", t.title, "@", t.finishedAt.toISOString());
  }
}
printTask({ type: "NEW", title: "Belajar TS" });

// Generics + paginate
type Page<T> = { data: T[]; total: number; page: number; size: number };
function paginate<T>(items: T[], page: number, size: number): Page<T> {
  const start = (page - 1) * size;
  return { data: items.slice(start, start + size), total: items.length, page, size };
}
console.log(paginate([1,2,3,4], 2, 2));

// Utility types
interface Product { id: string; name: string; price: number; stock?: number }
type ReadonlyProduct = Readonly<Product>;
type PartialProduct = Partial<Product>;
const rp: ReadonlyProduct = { id:"P1", name:"Kaos", price:100000 };
const pp: PartialProduct = { stock: 10 };

// Latihan: buat generic "pick<T,K extends keyof T>(obj:T, keys:K[]): Pick<T,K>"
```

---

## src/09-async.ts — Async Programming with TypeScript

```ts
/**
 * Promise + async/await + pengetikan return.
 */

function delay(ms: number) { return new Promise<void>(res => setTimeout(res, ms)); }

interface Todo { id: number; title: string; completed: boolean }

async function getTodo(id: number): Promise<Todo> {
  await delay(150);
  return { id, title: `Todo #${id}`, completed: id % 2 === 0 };
}

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function safeGetTodo(id: number): Promise<Result<Todo>> {
  try {
    const data = await getTodo(id);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

(async () => {
  console.log(await getTodo(1));
  console.log(await safeGetTodo(2));
})();

// Latihan: buat "retry<T>(fn:()=>Promise<T>, max:number):Promise<T>" ketikannya benar.
```

---

## src/10-interface.ts — Interface

```ts
/**
 * Interface untuk shape object, optional field, extends, dan fungsi yang menerima interface.
 */

enum Role { Admin="ADMIN", Staff="STAFF" }

interface User {
  id: string;
  name: string;
  email?: string;
}

interface Timestamped { createdAt: Date; updatedAt: Date; }
interface Employee extends User, Timestamped { role: Role; }

function printUser(u: User) {
  console.log(`${u.id} - ${u.name}${u.email ? " <"+u.email+">" : ""}`);
}

const e: Employee = {
  id: "E1", name: "Wahyu", role: Role.Admin,
  createdAt: new Date(), updatedAt: new Date()
};
printUser(e);

// Latihan: buat "interface Product" dan "interface Audited extends Product, Timestamped".
```

---

## src/11-intersection-type.ts — Intersection & Type (type alias)

```ts
/**
 * Type alias, union, intersection (&) untuk menggabungkan tipe.
 */

type WithId = { id: string };
type WithAudit = { createdAt: Date; updatedAt: Date };
type Entity = WithId & WithAudit;

const ent: Entity = { id: "X1", createdAt: new Date(), updatedAt: new Date() };
console.log(ent);

type Searchable = { query: string } & { page?: number; size?: number };
function search(params: Searchable) {
  const page = params.page ?? 1;
  const size = params.size ?? 10;
  console.log(`Searching "${params.query}" (page=${page}, size=${size})`);
}
search({ query: "typescript basics", page: 2 });

// Latihan: buat "type Currency='IDR'|'USD'|'EUR'" + fungsi "format(amount:number,c?:Currency)".
```

---

## Cara Demo (urutan rekomendasi)

1. `npm run run:01` → konsep dasar (compile-time typing).
2. `npm run run:02` → bedanya TS vs JS (error tipe lebih dini).
3. `npm run run:03` → syntax dasar + generic simpel.
4. `npm run run:04` → gambaran fitur & Result pattern.
5. `npm run run:05` → data types (tuple, enum, unknown).
6. `npm run run:06` → inference vs annotation.
7. `npm run run:07` → function signatures, overload.
8. `npm run run:08` → union, narrowing, DU, generics, utility.
9. `npm run run:09` → async/await + Promise<Result>.
10. `npm run run:10` → interface, extends.
11. `npm run run:11` → intersection & type alias.


---

# Setup 1x (sekali saja)

```bash
mkdir ts-sim && cd ts-sim
npm init -y
npm i -D typescript ts-node @types/node
npx tsc --init
```

Di `tsconfig.json`, minimal pastikan:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

Buat folder:

```bash
mkdir src
```

(Optional) Tambahkan scripts di `package.json` agar ringkas:

```json
{
  "type": "module",
  "scripts": {
    "run:01": "ts-node src/01-intro.ts",
    "run:02": "ts-node src/02-diff-ts-vs-js.ts",
    "run:03": "ts-node src/03-nature-syntax.ts",
    "run:04": "ts-node src/04-features-paradigms.ts",
    "run:05": "ts-node src/05-data-types.ts",
    "run:06": "ts-node src/06-inference-annotation.ts",
    "run:07": "ts-node src/07-functions-signatures.ts",
    "run:08": "ts-node src/08-advanced-types.ts",
    "run:09": "ts-node src/09-async.ts",
    "run:10": "ts-node src/10-interface.ts",
    "run:11": "ts-node src/11-intersection-type.ts"
  }
}
```

---

## src/01-intro.ts — Introduction to TypeScript

```ts
/**
 * INTRO: TypeScript = JavaScript + static typing.
 * Compile: .ts -> tsc -> .js -> run di Node/browser
 */

const name: string = "Wahyu";
const msg = `Hello, ${name}!`; // inference: string
console.log(msg);

// Latihan: ubah "name" ke number dan lihat error compile.
// Lalu perbaiki lagi jadi string.
```

Jalankan: `npx ts-node src/01-intro.ts` atau `npm run run:01`

---

## src/02-diff-ts-vs-js.ts — Difference TS vs JS

```ts
/**
 * Perbedaan umum:
 * - JS: dynamic typing (error ketahuan saat runtime)
 * - TS: static typing (error ketahuan saat compile)
 */

function add(a: number, b: number): number {
  return a + b;
}

console.log("[OK]", add(1, 2));
// console.log("[ERROR]", add("1" as any, 2)); // coba: hapus "as any" -> error compile

// Latihan: buat versi "addSmart" yang menerima number | string angka, return number.
```

---

## src/03-nature-syntax.ts — Understanding Nature & Syntax

```ts
/**
 * Nature: TS menambah anotasi tipe tanpa mengubah cara kerja JS.
 * Syntax dasar: anotasi variabel, parameter, return type, generic sederhana.
 */

const age: number = 20;
function greet(name: string): string {
  return `Hi, ${name}!`;
}
console.log(greet("Student"));

function wrap<T>(value: T): T[] {
  return [value];
}
console.log(wrap<number>(7), wrap("TS"));

// Latihan: buat "safeDivide(a:number,b:number): number|null" (null jika b=0).
```

---

## src/04-features-paradigms.ts — Overview Features & Paradigms

```ts
/**
 * Fitur ringkas: union/intersection, interface/type alias, generics, utility types, narrowing, enum.
 * Paradigma: type-driven design, progressive adoption, strict mode.
 */

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

function parseJSON<T>(text: string): Result<T> {
  try {
    return { ok: true, data: JSON.parse(text) as T };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
console.log(parseJSON<{ x: number }>('{"x":1}'));
console.log(parseJSON("not-json"));

// Latihan: buat "fetchUserMock(): Result<{id:string;name:string}>" (tanpa async).
```

---

## src/05-data-types.ts — TypeScript Data Types

```ts
/**
 * Primitif: string, number, boolean, null/undefined, bigint, symbol
 * Struktur: array, tuple, enum, object
 * Spesial: any (hindari), unknown (narrow dulu), void, never
 */

enum Role { Admin="ADMIN", User="USER" }

let s: string = "text";
let n: number = 42;
let b: boolean = true;
let arr: number[] = [1, 2, 3];
let tup: [string, number] = ["age", 18];
let r: Role = Role.Admin;

let u: unknown = JSON.parse('{"a":1}');
if (typeof u === "object" && u !== null) {
  console.log("unknown sudah di-narrow:", u);
}

// Latihan: buat tuple [id:string, active:boolean, scores:number[]] dan fungsi validator.
```

---

## src/06-inference-annotation.ts — Type Inference & Annotation

```ts
/**
 * Inference: TS menebak tipe otomatis.
 * Anotasi: wajib untuk API boundary / param / return / kompleks.
 */

let title = "TS";          // string
const v = 10;              // literal 10 (const)
function sum(arr: number[]): number {
  return arr.reduce((a, c) => a + c, 0);
}
console.log(sum([1, 2, 3]));

// Latihan: tulis fungsi "avg(numbers)" tanpa anotasi param, lihat inference.
// Lalu tambahkan anotasi number[] dan return number.
```

---

## src/07-functions-signatures.ts — Functions & Signatures

```ts
/**
 * Function signature via type alias + optional/default param + overload.
 */

type BinaryOp = (a: number, b: number) => number;
const add: BinaryOp = (a, b) => a + b;
const mul: BinaryOp = (a, b) => a * b;

function formatCurrency(amount: number, currency: "IDR"|"USD" = "IDR"): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency }).format(amount);
}
console.log(add(2, 3), mul(2, 3), formatCurrency(125000));

function toArray(x: string): string[];
function toArray(x: number): number[];
function toArray(x: string | number) {
  return typeof x === "string" ? x.split("") : [x];
}
console.log(toArray("TS"), toArray(7));

// Latihan: buat alias type "Formatter" untuk (v:number, locale?:string)=>string dan implementasinya.
```

---

## src/08-advanced-types.ts — Advanced Type System

```ts
/**
 * Union + narrowing, literal types, discriminated union, generics, utility & mapped types.
 */

// Union + narrowing
type Id = string | number;
function idAsString(id: Id): string {
  return typeof id === "string" ? id : String(id);
}
console.log(idAsString("ABC"), idAsString(123));

// Discriminated union
type NewTask = { type: "NEW"; title: string };
type DoingTask = { type: "DOING"; title: string; assignee: string };
type DoneTask = { type: "DONE"; title: string; finishedAt: Date };
type Task = NewTask | DoingTask | DoneTask;

function printTask(t: Task) {
  switch (t.type) {
    case "NEW":   return console.log("🆕", t.title);
    case "DOING": return console.log("🏃", t.title, "-", t.assignee);
    case "DONE":  return console.log("✅", t.title, "@", t.finishedAt.toISOString());
  }
}
printTask({ type: "NEW", title: "Belajar TS" });

// Generics + paginate
type Page<T> = { data: T[]; total: number; page: number; size: number };
function paginate<T>(items: T[], page: number, size: number): Page<T> {
  const start = (page - 1) * size;
  return { data: items.slice(start, start + size), total: items.length, page, size };
}
console.log(paginate([1,2,3,4], 2, 2));

// Utility types
interface Product { id: string; name: string; price: number; stock?: number }
type ReadonlyProduct = Readonly<Product>;
type PartialProduct = Partial<Product>;
const rp: ReadonlyProduct = { id:"P1", name:"Kaos", price:100000 };
const pp: PartialProduct = { stock: 10 };

// Latihan: buat generic "pick<T,K extends keyof T>(obj:T, keys:K[]): Pick<T,K>"
```

---

## src/09-async.ts — Async Programming with TypeScript

```ts
/**
 * Promise + async/await + pengetikan return.
 */

function delay(ms: number) { return new Promise<void>(res => setTimeout(res, ms)); }

interface Todo { id: number; title: string; completed: boolean }

async function getTodo(id: number): Promise<Todo> {
  await delay(150);
  return { id, title: `Todo #${id}`, completed: id % 2 === 0 };
}

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function safeGetTodo(id: number): Promise<Result<Todo>> {
  try {
    const data = await getTodo(id);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

(async () => {
  console.log(await getTodo(1));
  console.log(await safeGetTodo(2));
})();

// Latihan: buat "retry<T>(fn:()=>Promise<T>, max:number):Promise<T>" ketikannya benar.
```

---

## src/10-interface.ts — Interface

```ts
/**
 * Interface untuk shape object, optional field, extends, dan fungsi yang menerima interface.
 */

enum Role { Admin="ADMIN", Staff="STAFF" }

interface User {
  id: string;
  name: string;
  email?: string;
}

interface Timestamped { createdAt: Date; updatedAt: Date; }
interface Employee extends User, Timestamped { role: Role; }

function printUser(u: User) {
  console.log(`${u.id} - ${u.name}${u.email ? " <"+u.email+">" : ""}`);
}

const e: Employee = {
  id: "E1", name: "Wahyu", role: Role.Admin,
  createdAt: new Date(), updatedAt: new Date()
};
printUser(e);

// Latihan: buat "interface Product" dan "interface Audited extends Product, Timestamped".
```

---

## src/11-intersection-type.ts — Intersection & Type (type alias)

```ts
/**
 * Type alias, union, intersection (&) untuk menggabungkan tipe.
 */

type WithId = { id: string };
type WithAudit = { createdAt: Date; updatedAt: Date };
type Entity = WithId & WithAudit;

const ent: Entity = { id: "X1", createdAt: new Date(), updatedAt: new Date() };
console.log(ent);

type Searchable = { query: string } & { page?: number; size?: number };
function search(params: Searchable) {
  const page = params.page ?? 1;
  const size = params.size ?? 10;
  console.log(`Searching "${params.query}" (page=${page}, size=${size})`);
}
search({ query: "typescript basics", page: 2 });

// Latihan: buat "type Currency='IDR'|'USD'|'EUR'" + fungsi "format(amount:number,c?:Currency)".
```

---

Berikut paket materi **lengkap + contoh kode + practice** untuk:

1. Module Resolution & Module System
2. Enums
3. TypeScript Best Practices
4. Unit Testing Overview & Importance
5. Setup Testing in TS
6. Testing TS with Jest + Jest Matchers

Di akhir, ada **mini-project** (Todo Service) yang menggabungkan semuanya: path alias + enum + best practices + test Jest (sync/async/mock).

---

# 0) Satu Kali Setup Project (siap demo)

```bash
mkdir ts-testing-demo && cd ts-testing-demo
npm init -y
npm i typescript
npm i -D ts-node @types/node
npm i -D jest @types/jest ts-jest
# (opsional) jika ingin ESM murni:
# npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npx tsc --init
npx ts-jest config:init
```

**tsconfig.json** (fokus ke resolusi modul & strict)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",               // gunakan "NodeNext" bila ESM modern
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "baseUrl": "./src",                 // utk path alias
    "paths": {
      "@core/*": ["core/*"],            // contoh alias
      "@utils/*": ["utils/*"]
    },
    "strict": true,
    "noImplicitAny": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

**jest.config.ts** (hasil `ts-jest config:init` — sedikit dirapikan)

```ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1'
  }
};

export default config;
```

**package.json** (script cepat)

```json
{
  "type": "module",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watchAll"
  }
}
```

Buat struktur:

```
src/
  index.ts
  core/
    enums.ts
    todo.ts
  utils/
    string.ts
  __tests__/
    todo.spec.ts
    utils.spec.ts
```

---

# 1) Module Resolution & Module System

## Konsep singkat

* **Module System**: cara file saling `import`/`export`. Di TS modern: **ES Modules** (import/export).
* **Module Resolution**: algoritma TS mencari modul saat `import`. Umum: `"Node"`, `"NodeNext"`.
* **NodeNext** sinkron dengan cara Node ESM/CJS modern (ekstensi `.ts` → compile ke `.js`).
* **Path alias** dengan `baseUrl` + `paths` agar import lebih rapi (mis. `@core/todo`).

### Contoh

**src/utils/string.ts**

```ts
export function capitalize(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}
```

**src/core/enums.ts**

```ts
export enum Status {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE"
}
```

**src/core/todo.ts**

```ts
import { Status } from "@core/enums";
import { capitalize } from "@utils/string";

export interface Todo {
  id: string;
  title: string;
  status: Status;
}

export interface TodoRepo {
  create(title: string): Todo;
  list(): ReadonlyArray<Todo>;
  update(id: string, patch: Partial<Omit<Todo, "id">>): Todo | null;
}

export class InMemoryTodoRepo implements TodoRepo {
  private store: Todo[] = [];
  create(title: string): Todo {
    const t: Todo = { id: crypto.randomUUID(), title: capitalize(title), status: Status.NEW };
    this.store.push(t);
    return t;
  }
  list(): ReadonlyArray<Todo> {
    return this.store;
  }
  update(id: string, patch: Partial<Omit<Todo, "id">>): Todo | null {
    const i = this.store.findIndex(t => t.id === id);
    if (i < 0) return null;
    const cur = this.store[i];
    const next = { ...cur, ...patch };
    this.store[i] = next;
    return next;
  }
}
```

**src/index.ts**

```ts
import { InMemoryTodoRepo } from "@core/todo";
import { Status } from "@core/enums";

const repo = new InMemoryTodoRepo();
const a = repo.create("belajar typescript");
const b = repo.create("setup jest");
console.log("List awal:", repo.list().map(t => `${t.title}[${t.status}]`));

repo.update(a.id, { status: Status.IN_PROGRESS });
console.log("List update:", repo.list().map(t => `${t.title}[${t.status}]`));
```

### Practice

* Tambahkan alias `@models/*` dan buat file `models/user.ts`, lalu import di `index.ts`.

---

# 2) Enums

## Konsep

* **Number Enums**: `enum X { A, B }` → A=0, B=1 (dapat reverse mapping).
* **String Enums**: `enum Status { NEW="NEW" }` (lebih eksplisit—umumnya disarankan).
* **const enum**: di-inline saat compile (hemat), tapi **hati-hati** jika butuh runtime reflection atau di library publik.
* Alternatif: **union literal type** (`type Status = "NEW" | "DONE"`) lebih ringan dan aman untuk type checking, tanpa fitur runtime enum.

### Contoh

```ts
export enum Priority { LOW=1, MEDIUM=2, HIGH=3 }

export function priorityLabel(p: Priority): string {
  switch (p) {
    case Priority.LOW: return "Low";
    case Priority.MEDIUM: return "Medium";
    case Priority.HIGH: return "High";
  }
}
```

### Practice

* Ubah `Status` dari string enum menjadi union literal (`type Status = "NEW" | "IN_PROGRESS" | "DONE"`). Sesuaikan kode & test—diskusikan pro/kontra.

---

# 3) TypeScript Best Practices

**Compiler & Config**

* `strict: true`, `noImplicitAny: true`, `exactOptionalPropertyTypes: true`.
* Pakai `NodeNext`/`ESNext` sesuai target runtime.
* Gunakan **path alias** secukupnya (hindari spaghetti alias).

**Penulisan Kode**

* Tipekan **API boundaries** (public functions, DTO).
* Hindari `any`. Jika ragu, gunakan `unknown` + **type narrowing**.
* Pakai **union literal** daripada enum jika tidak butuh runtime.
* **Pure functions** untuk logic → mudah di-test.
* **Immutability**: jangan mutasi parameter; return salinan.
* Pisahkan **domain logic** dari **I/O** (repo, HTTP, DB) → mudah mock.
* Gunakan **type alias** untuk union/intersection, **interface** untuk object shape yang di-extend.
* Manfaatkan **utility types**: `Partial<T>`, `Readonly<T>`, `Pick<T, K>`.

**Testing**

* Satu file test per unit yang berarti.
* Test **happy path** + **edge case**.
* Mock dependensi eksternal (I/O, time, random) → deterministik.

### Practice

* Tambah fungsi pure `nextStatus(s: Status)` dan test semua cabang.

---

# 4) Unit Testing Overview & Importance

**Overview**

* Unit test = menguji unit kecil (fungsi/kelas) **terisolasi** dari external I/O.
* Framework populer: **Jest** untuk JS/TS.

**Kenapa penting**

* **Early bug detection** (sebelum integrasi/production).
* **Refactor aman**: confidence saat mengubah kode.
* **Living documentation**: test menjelaskan perilaku.
* **Support TDD** & desain modular.

### Practice

* Identifikasi 3 unit yang layak di-test pada app Todo ini (contoh: `capitalize`, `create`, `update`).

---

# 5) Setup Testing in TS (dengan Jest)

Kita sudah buat `jest.config.ts` via `ts-jest`. Kunci:

* `preset: 'ts-jest'` → compile TS saat test.
* `moduleNameMapper` sinkron dengan path alias TS.
* Jalankan: `npm test`.

> Tips: pakai `--watchAll` saat live coding demo.

---

# 6) Testing TS with Jest + Matchers

## Contoh Test (sync + path alias)

**src/**tests**/utils.spec.ts**

```ts
import { capitalize } from "@utils/string";

describe("utils/string.capitalize", () => {
  it("capitalizes first letter", () => {
    expect(capitalize("wahyu")).toBe("Wahyu");     // toBe = strict equality (primitive)
  });

  it("handles empty string", () => {
    expect(capitalize("")).toBe("");
  });
});
```

## Contoh Test untuk Repo (menggunakan enum, partial update)

**src/**tests**/todo.spec.ts**

```ts
import { InMemoryTodoRepo } from "@core/todo";
import { Status } from "@core/enums";

describe("InMemoryTodoRepo", () => {
  it("creates todo with capitalized title & NEW status", () => {
    const repo = new InMemoryTodoRepo();
    const t = repo.create("belajar ts");
    expect(t.title).toBe("Belajar ts");
    expect(t.status).toBe(Status.NEW);
    expect(repo.list()).toHaveLength(1);          // matcher array length
  });

  it("updates todo status", () => {
    const repo = new InMemoryTodoRepo();
    const t = repo.create("setup jest");
    const updated = repo.update(t.id, { status: Status.DONE });
    expect(updated).not.toBeNull();
    expect(updated!.status).toBe(Status.DONE);
  });

  it("returns null when updating non-existing id", () => {
    const repo = new InMemoryTodoRepo();
    expect(repo.update("not-found", { status: Status.DONE })).toBeNull();
  });
});
```

## Async Test (contoh pola)

Misal kita punya fungsi async (dummy) di `utils/delay.ts`:

```ts
export function delay(ms: number) {
  return new Promise<void>(res => setTimeout(res, ms));
}
```

Test:

```ts
import { delay } from "@utils/delay";

it("waits at least given ms", async () => {
  const start = Date.now();
  await delay(50);
  const elapsed = Date.now() - start;
  expect(elapsed).toBeGreaterThanOrEqual(45); // toleransi
});
```

## Mocking & Spies

* `jest.fn()` membuat fungsi palsu untuk inspeksi pemanggilan.
* `jest.spyOn(obj, 'method')` memata-matai/mengganti method.

Contoh:

```ts
const send = jest.fn((msg: string) => true);
send("hello");
expect(send).toHaveBeenCalledWith("hello");
expect(send).toHaveReturnedWith(true);
```

---

# 7) Jest Matchers (yang sering dipakai)

* **Nilai primitif / referensi**:
  `toBe`, `toEqual`, `toStrictEqual`, `not`
* **Number**:
  `toBeGreaterThan`, `toBeLessThanOrEqual`, `toBeCloseTo`
* **String/Array**:
  `toContain`, `toHaveLength`, `toMatch` (regex)
* **Object**:
  `toMatchObject`, `toHaveProperty`
* **Error**:
  `toThrow`, `rejects.toThrow`
* **Promise/Async**:
  `resolves.toEqual`, `rejects.toEqual`
* **Mock/Spy**:
  `toHaveBeenCalled`, `toHaveBeenCalledWith`, `toHaveReturnedWith`

Contoh ringkas:

```ts
expect([1,2,3]).toContain(2);
expect({a:1,b:2}).toHaveProperty('a', 1);
await expect(Promise.resolve(42)).resolves.toBe(42);
expect(() => { throw new Error("X"); }).toThrow("X");
```

### Practice

* Tambahkan test untuk memverifikasi `update` **tidak** mengubah `id` & tetap mempertahankan properti lain (gunakan `toMatchObject`).

---

# 8) Mini-Project: Todo Service (menggabungkan semua)

🧩 **Sudah terpasang** di folder `src/core` & `src/utils` dengan enum `Status`, path alias, best practices (strict, pure-ish), dan test Jest.

**Cara Jalankan Demo App**

```bash
npm run dev         # menjalankan src/index.ts (ts-node)
npm test            # menjalankan unit test
npm run build && npm start
```

**Output yang bisa Anda demokan:**

* `npm run dev` → terlihat list todo dibuat, lalu update status.
* `npm test` → semua test `utils.spec.ts` & `todo.spec.ts` hijau.
* Tunjukkan **path alias** bekerja (import `@core/*`, `@utils/*`).
* Tunjukkan **enum Status** dipakai di domain & test.
* Diskusikan **best practices** yang diterapkan (strict mode, repo in-memory terpisah dari I/O, fungsi pure `capitalize`, partial update, readonly list).

---

## Paket Practice (ringkas & fokus)

1. **Module Resolution**

   * Tambah alias `@services/*`, buat `services/report.ts` yang menghasilkan ringkasan jumlah todo by `Status`. Buat test-nya.

2. **Enums / Literal Union**

   * Ganti `Status` jadi union literal. Pastikan test tetap hijau. Apa keuntungan-rugiannya?

3. **Best Practices**

   * Tambahkan fungsi pure `nextStatus(s: Status): Status` dan test 100% cabang.

4. **Async & Mock**

   * Buat modul `services/notifier.ts` dengan `sendNotification(todo)` (simulasi async). Test dengan **mock** agar tak ada delay/network.

5. **Matchers**

   * Perkaya test: gunakan `toMatchObject`, `toHaveBeenCalledWith`, `resolves`, `rejects`, `toThrow`.

---

## Troubleshooting singkat

* **ESM vs CJS**: kalau error import/export, pastikan `"type": "module"` dan `module: "NodeNext"`. Atau pindah ke CJS (`"type": "commonjs"`, `module:"commonjs"`).
* **Path alias Jest**: pastikan `moduleNameMapper` sinkron dengan `paths`.
* **crypto.randomUUID**: tersedia di Node 18+. Jika lebih rendah, pakai `uuid`:

  ```bash
  npm i uuid
  ```

  ```ts
  import { v4 as uuid } from 'uuid';
  const id = uuid();
  ```

---

# 📘 Materi & Contoh

## 1. Module Resolution & System

**Penjelasan singkat:**

* **Module System**: cara file saling berbicara lewat `import` & `export`.
* **Module Resolution**: cara TypeScript mencari modul saat di-import.
* Umum: `Node` (untuk CJS) atau `NodeNext` (untuk ESM modern).
* Bisa gunakan **path alias** (`@core/`, `@utils/`) agar lebih rapi.

**Contoh kode:**

```ts
// utils/string.ts
export function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}

// core/todo.ts
import { capitalize } from "../utils/string";

export class Todo {
  constructor(public id: number, public title: string) {
    this.title = capitalize(title);
  }
}
```

**Practice:**

* Buat alias `@utils/*` di `tsconfig.json` lalu coba import dengan alias.

---

## 2. Enums

**Penjelasan:**

* Enum = kumpulan nilai tetap (constant).
* Ada **number enum** & **string enum**.
* Sering dipakai untuk status, role, priority.

**Contoh kode:**

```ts
enum Status {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE"
}

function printStatus(s: Status) {
  console.log("Task status:", s);
}

printStatus(Status.NEW);
```

**Practice:**

* Buat enum `Priority { LOW, MEDIUM, HIGH }` dan tampilkan labelnya.

---

## 3. TypeScript Best Practices

**Ringkasan:**

* Aktifkan `strict: true` di `tsconfig.json`.
* Hindari `any`, gunakan `unknown` lalu lakukan type check.
* Pisahkan **business logic** dari I/O (mudah di-test).
* Gunakan interface/type alias dengan jelas.
* Gunakan utility types (`Partial`, `Readonly`).

**Contoh kode:**

```ts
interface User {
  id: string;
  name: string;
  email?: string; // optional
}

type ReadonlyUser = Readonly<User>;
```

**Practice:**

* Buat `interface Product` dengan `id, name, price`, lalu buat `Partial<Product>`.

---

## 4. Overview of Unit Testing

**Penjelasan:**

* Unit test = menguji bagian terkecil kode (fungsi, class).
* Fokusnya **isolasi** (tanpa DB/Network).
* Framework populer: Jest.

---

## 5. Importance of Unit Testing

**Kenapa penting:**

* Deteksi bug lebih dini.
* Membantu refactor lebih aman.
* Jadi dokumentasi hidup (test = contoh penggunaan).
* Meningkatkan confidence tim.

---

## 6. Setup Testing in TS

1. Install jest: `npm i -D jest ts-jest @types/jest`
2. Init config: `npx ts-jest config:init`
3. Tambah script `"test": "jest"` di `package.json`.

---

## 7. Testing TS with Jest

**Contoh file:**

`src/utils/string.ts`

```ts
export function capitalize(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}
```

`src/__tests__/string.spec.ts`

```ts
import { capitalize } from "../utils/string";

test("capitalize works", () => {
  expect(capitalize("wahyu")).toBe("Wahyu");
});
```

---

## 8. Jest Matchers

**Yang sering dipakai:**

* `toBe` (===)
* `toEqual` (deep equality)
* `toContain` (array/string)
* `toHaveLength`
* `toThrow`
* `resolves` / `rejects` (promise)
* `toHaveBeenCalledWith` (mock/spy)

**Practice:**

* Tambah test `expect([1,2,3]).toContain(2)`.

---

# 📂 Mini Project Demo (Todo Service)

`src/core/todo.ts`

```ts
import { Status } from "./enums";

export interface Todo {
  id: string;
  title: string;
  status: Status;
}

export class TodoRepo {
  private store: Todo[] = [];

  create(title: string): Todo {
    const todo: Todo = { id: Date.now().toString(), title, status: Status.NEW };
    this.store.push(todo);
    return todo;
  }

  list(): Todo[] {
    return this.store;
  }

  update(id: string, status: Status): Todo | null {
    const todo = this.store.find(t => t.id === id);
    if (!todo) return null;
    todo.status = status;
    return todo;
  }
}
```

`src/core/enums.ts`

```ts
export enum Status {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE"
}
```

`src/__tests__/todo.spec.ts`

```ts
import { TodoRepo } from "../core/todo";
import { Status } from "../core/enums";

describe("TodoRepo", () => {
  it("creates todo with NEW status", () => {
    const repo = new TodoRepo();
    const t = repo.create("Belajar Jest");
    expect(t.status).toBe(Status.NEW);
  });

  it("updates status", () => {
    const repo = new TodoRepo();
    const t = repo.create("Belajar TS");
    const updated = repo.update(t.id, Status.DONE);
    expect(updated!.status).toBe(Status.DONE);
  });
});
```

---