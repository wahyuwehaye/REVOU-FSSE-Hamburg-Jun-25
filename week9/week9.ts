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

// ============ 1) INTRO & DIFFERENCE (komentar singkat) ============
// TypeScript = JavaScript + static typing (cek saat compile).
// JS: error tipe ketahuan saat runtime. TS: ketahuan lebih dini saat compile.
// Akhirnya tetap dijalankan sebagai JS setelah di-compile.

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

## Alur Demo (biar presentasinya mulus)

1. Jalankan `npx ts-node index.ts`
2. Tunjukkan output berurutan:

   * `safeDivide` (return angka / null) → **tipe union sederhana**
   * `greet` & `toArray` → **function signature & overload**
   * `printUser` → **interface & optional**
   * `Entity` → **intersection (&)**
   * `formatCurrency` → **literal types (“IDR” | …)**
   * `Task` → **discriminated union + switch aman**
   * `wrap`, `paginate` → **generics**
   * `Partial`, `Readonly` → **utility types**
   * `getTodo`, `safeGetTodo` → **async/await + Promise\<Result<T>>**
   * `search` → **intersection practice**
   * **Quick CRUD Demo** in-memory (create → toggle → list) untuk mengikat semuanya

---

## Ide Latihan Cepat (langsung edit file yang sama)

1. Ubah `paginate<T>` agar mengembalikan `hasNext: boolean`.
2. Tambahkan `assignee?: string` ke `TodoItem`, lalu buat fungsi `assign(id, name)` yang mengembalikan `Result<TodoItem>`.
3. Tambahkan event discriminated union (`"CREATED" | "UPDATED" | "DELETED"`) untuk `TodoItem`, buat `dispatch(event)` yang `console.log` pesan berbeda per event.
4. Buat `retry<T>(fn, max)` (async) dengan typing benar, dan pakai untuk `getTodo`.

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