# Week 8 – Advanced JavaScript

## 0. Roadmap

```
Algoritma → Pseudocode & Flowchart → JS Essentials (variabel & tipe data)
→ Control Flow (if/else, switch, loop, recursion, error) → DOM & Events
→ ES6+ (destructuring, arrow fn, HOF) → Asynchronous (Callback/Promise/Async)
→ Node.js & NPM → HTTP/HTTPS + Methods → Mini Project
```

---

## 1) Algorithm Fundamentals

### 1.1 Apa itu Algoritma?

Algoritma = langkah logis dan berurutan untuk menyelesaikan masalah. Kualitas algoritma terlihat dari:

**Benar** (hasil sesuai), 
**Jelas** (langkah tidak ambigu), 
**Efisien** (waktu/ruang masuk akal), 
**Terbatas** (pasti selesai).

### 1.2 Pseudocode → Before Coding

Pseudocode adalah representasi teks manusiawi dari algoritma yang mudah dibaca. Fokus ke **alur**, bukan sintaks JS.

**Contoh: Membuat Teh**

```
MULAI
Rebus air hingga mendidih
Masukkan teh ke gelas
Tuang air panas
Tambahkan gula
Aduk rata
SELESAI
```

### 1.3 Flowchart → Visual Alur

Simbol penting:

* **Oval**: Mulai/Selesai
* **Persegi**: Proses
* **Belah ketupat**: Keputusan (Yes/No)
* **Jajar genjang**: Input/Output

**Flow Membuat Teh (ASCII):**

```
 (Start)
    |
[Rebus Air]
    |
[Masukkan Teh]
    |
[Tuang Air Panas]
    |
[Tambah Gula]
    |
  [Aduk]
    |
  (End)
```

### 1.4 Translasi Pseudocode → JavaScript

```js
function buatTeh() {
  console.log("Rebus air...");
  console.log("Masukkan teh ke gelas");
  console.log("Tuang air panas");
  console.log("Tambahkan gula");
  console.log("Aduk rata");
}
buatTeh();
```

### 1.5 Sorting (Gambaran Inti + Kompleksitas)

| Algoritma   | Ide Singkat                               | Kompleksitas Rata2 |
| ----------- | ----------------------------------------- | ------------------ |
| Bubble Sort | Tukar pasangan berdekatan berulang        | O(n^2)             |
| Selection   | Pilih min lalu taruh di depan, ulangi     | O(n^2)             |
| Insertion   | Sisipkan elemen ke posisi benar           | O(n^2)             |
| Merge Sort  | Pecah dua, urutkan, gabung (divide\&conq) | O(n log n)         |
| Quick Sort  | Partisi pivot, rekursif                   | O(n log n) rata2   |

**Contoh Insertion Sort (JS, mudah dipahami):**

```js
function insertionSort(arr){
  for(let i=1; i<arr.length; i++){
    const key = arr[i];
    let j = i-1;
    while(j>=0 && arr[j] > key){
      arr[j+1] = arr[j];
      j--;
    }
    arr[j+1] = key;
  }
  return arr;
}
console.log(insertionSort([5,3,1,4,2]));
```

---

## 2) JavaScript Essentials (Variabel & Tipe Data)

### 2.1 Variabel & Scope

* `var` → function scope, **hindari untuk code modern**.
* `let` → block scope, bisa diubah.
* `const` → block scope, tidak bisa di-reassign.

**Hoisting Singkat:** deklarasi diangkat ke atas scope; `let/const` punya *temporal dead zone* sebelum deklarasi.

```js
let age = 20;        // bisa diubah
const PI = 3.14159;  // tetap
```

### 2.2 Tipe Data & Pemeriksaan

* Primitive: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`.
* Reference: `object`, `array`, `function`, `Date`, dll.

```js
const user = { name: "Ari", skills: ["JS", "HTML"] };
console.log(typeof user);      // "object"
console.log(Array.isArray(user.skills)); // true
```

### 2.3 Copy by Value vs Reference

```js
// primitive → copy by value
let a = 1, b = a; b = 2; console.log(a); // 1

// object/array → reference
const o1 = {x:1};
const o2 = o1; o2.x = 9; console.log(o1.x); // 9

// shallow copy
const o3 = {...o1}; o3.x = 7; console.log(o1.x); // 9 (berbeda)
```

### 2.4 Coercion & Perbandingan

Gunakan `===`/`!==` untuk menghindari coercion yang mengejutkan.

```js
console.log(0 == false);  // true (coercion)
console.log(0 === false); // false (strict)
```

---

## 3) Control Flow (if/else, switch, loop, recursion, error)

### 3.1 If/Else & Ternary

```js
const statusMsg = (balance >= price) ? "Payment succeed" : "Insufficient";
```

### 3.2 **Switch dengan Benar**

**Catatan penting**: `switch` *membandingkan nilai case* dengan *ekspresi di switch* menggunakan **strict comparison**. Jadi **jangan** menaruh ekspresi boolean langsung sebagai `case(amount > 10000)`. Dua pola yang benar:

**(A) Switch nilai biasa**

```js
const method = "QRIS";
switch(method){
  case "QRIS": console.log("Bayar QRIS"); break;
  case "CASH": console.log("Bayar Cash"); break;
  default: console.log("Metode lain");
}
```

**(B) Switch `true` pattern** (untuk kondisi)

```js
const amount = 11000;
switch(true){
  case (amount <= 10000):
    console.log('Pembayaran QRIS'); break;
  case (amount > 10000):
    console.log('Pembayaran CASH'); break;
  default:
    console.log('Masukkan nominal!');
}
```

> Pola `switch(true)` membuat setiap `case` menghasilkan boolean, lalu dicocokkan dengan `true`.

### 3.3 Loop

```js
// for
for(let i=1;i<=3;i++){ console.log("loop", i); }

// while
let n=3; while(n>0){ console.log(n); n--; }

// do..while (jalan dulu, cek belakangan)
let x=0; do{ x++; }while(x<3);
```

### 3.4 Recursion

```js
function factorial(n){
  if(n<=1) return 1; // base case
  return n * factorial(n-1);
}
```

### 3.5 Error Handling

```js
try {
  JSON.parse("{broken json}");
} catch (err) {
  console.error("Parsing gagal:", err.message);
} finally {
  console.log("Selesai mencoba");
}
```

---

## 4) DOM & Events – Visual & Praktik

### 4.1 Mengambil & Mengubah Elemen

```html
<h1 id="title">Hello</h1>
<button id="btn">Ubah</button>
<script>
  const title = document.getElementById('title');
  document.getElementById('btn').addEventListener('click', () => {
    title.textContent = 'Berubah!';
    title.style.color = 'crimson';
  });
</script>
```

**Gambaran Visual:**

```
DOM Tree sederhana:
Document
└── html
    └── body
        ├── h1#title (text: "Hello")
        └── button#btn (text: "Ubah")
```

### 4.2 Membuat & Menyisipkan Node

```js
const li = document.createElement('li');
li.textContent = 'Item Baru';
document.querySelector('ul').appendChild(li);
```

### 4.3 Event Delegation (skala banyak elemen)

```js
document.querySelector('ul').addEventListener('click', (e)=>{
  if(e.target.matches('li')){
    e.target.classList.toggle('selected');
  }
});
```

### 4.4 Validasi Form Sederhana (onchange/submit)

```html
<input id="email" placeholder="email" />
<button id="save">Save</button>
<script>
  const email = document.getElementById('email');
  document.getElementById('save').onclick = (e) => {
    if(!email.value.includes('@')){
       alert('Email tidak valid');
       return;
    }
    alert('Tersimpan!');
  };
</script>
```

---

## 5) ES6 & Beyond

### 5.1 Template Literals, Destructuring, Spread/Rest

```js
const person = { name:'John', age:30 };
const { name, age } = person;
console.log(`Hi ${name}, umur ${age}`);

const arr = [1,2,3,4,5];
const [first, second, ...rest] = arr; // rest = [3,4,5]

const objA = {a:1}, objB = {b:2};
const merged = { ...objA, ...objB }; // {a:1,b:2}
```

### 5.2 Arrow Function & HOF (map/filter/reduce)

```js
const doubled = [1,2,3].map(n => n*2); // [2,4,6]
const longWords = ['apel','pisang','jeruk'].filter(w => w.length>4);
const sum = [1,2,3,4].reduce((acc,cur)=>acc+cur,0);
```

### 5.3 Optional Chaining & Nullish Coalescing

```js
const city = user?.address?.city ?? 'Unknown';
```

---

## 6) Asynchronous JS – Event Loop, Promise, Async/Await

### 6.1 Event Loop (Gambaran Flow)

```
Call Stack ← sinkron dieksekusi
    |            \
    |             → (Async) Web APIs/Task Source → Callback/Microtask Queue → Event Loop → Call Stack
```

### 6.2 Callback → Promise → Async

```js
// Callback
function getDataCB(cb){ setTimeout(()=>cb('OK'),1000); }
getDataCB(console.log);

// Promise
function getDataP(){ return new Promise(res=>setTimeout(()=>res('OK'),1000)); }
getDataP().then(console.log);

// Async/Await + error handling
async function main(){
  try{
    const data = await getDataP();
    console.log(data);
  }catch(e){ console.error(e); }
}
main();
```

### 6.3 Promise Utilities (use case nyata)

```js
const p1 = fetch('/api/a');
const p2 = fetch('/api/b');
const [resA, resB] = await Promise.all([p1,p2]);
```

---

## 7) Node.js, NPM & Modules

### 7.1 Inisialisasi & Install

```bash
npm init -y
npm i axios
```

### 7.2 CommonJS vs ESM

```js
// ESM (modern)
import axios from 'axios';
// CJS
const axiosCjs = require('axios');
```

### 7.3 Scripts & Npx

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

---

## 8) HTTP/HTTPS & Methods

### 8.1 Konsep Ringkas

* **HTTP**: protokol transfer data
* **HTTPS**: HTTP + TLS (terenkripsi)
* **Status Code**: 2xx sukses, 4xx error client, 5xx error server

### 8.2 Contoh `fetch` (GET/POST)

```js
// GET
const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
const data = await res.json();

// POST
await fetch('/api/orders', {
  method:'POST',
  headers:{ 'Content-Type':'application/json' },
  body: JSON.stringify({ productId: 1, qty: 2 })
});
```

---

## 9) Debugging & Error Handling (Console Power)

```js
console.log('info', obj);
console.table(users);
console.warn('peringatan');
console.error('kesalahan');
```

Tips:

* Log input/hasil di batas fungsi (entry/exit logging).
* Tangani error dengan `try/catch` + tampilkan `error.message`.

---

## 10) Mini Project – E‑Commerce Mini

### 1 – Runtime, NPM, Modules, HTTP

**Target:** Setup Node, panggil API produk, tampilkan list di console & DOM.

1. `npm init -y`, `npm i axios` (opsional untuk Node)
2. Buat modul `api.js` (fungsi `getProducts`)
3. Panggil dari `main.js` → render ke DOM tabel.

**Struktur:**

```
src/
  api.js
  main.js
index.html
```

**api.js (browser fetch):**

```js
export async function getProducts(){
  const res = await fetch('https://fakestoreapi.com/products?limit=5');
  if(!res.ok) throw new Error('Gagal fetch');
  return res.json();
}
```

**main.js:**

```js
import { getProducts } from './api.js';

async function render(){
  try{
    const list = await getProducts();
    const tbody = document.querySelector('#products');
    tbody.innerHTML = list.map(p=>`
      <tr>
        <td>${p.id}</td>
        <td>${p.title}</td>
        <td>${p.price}</td>
      </tr>`).join('');
  }catch(e){
    console.error(e);
  }
}
render();
```

**index.html (cuplikan tabel):**

```html
<table>
  <thead><tr><th>ID</th><th>Title</th><th>Price</th></tr></thead>
  <tbody id="products"></tbody>
</table>
```

**Flow 1 (ASCII):**

```
[Load index.html]
    ↓
[main.js render()] → [getProducts()] → [HTTP GET]
    ↓                        ↓
 [Table tbody]   ←  [JSON products]
```

---

### 2 – Advanced Functions, ES6, Async, DOM Events

**Target:** Tambah fitur filter, sort, dan cart sederhana.

**Langkah:**

1. Tambah input pencarian + select sort (price asc/desc).
2. Terapkan `filter()` dan `sort()` di data.
3. Event delegation untuk tombol "Add to Cart".
4. Tampilkan total di atas tabel.

**Snippet inti:**

```js
let allProducts = [];
let keyword = '', sortBy = 'none';

function applyView(){
  let view = allProducts.filter(p => p.title.toLowerCase().includes(keyword));
  if(sortBy==='price-asc') view.sort((a,b)=>a.price-b.price);
  if(sortBy==='price-desc') view.sort((a,b)=>b.price-a.price);
  // render ulang ke DOM...
}

document.querySelector('#search').addEventListener('input', e=>{
  keyword = e.target.value.toLowerCase();
  applyView();
});

document.querySelector('#sort').addEventListener('change', e=>{
  sortBy = e.target.value; applyView();
});

// Event delegation add-to-cart
const cart = [];
document.querySelector('#products').addEventListener('click', e=>{
  if(e.target.matches('.btn-add')){
    const id = Number(e.target.dataset.id);
    const item = allProducts.find(p=>p.id===id);
    cart.push(item);
    document.querySelector('#total').textContent = cart.reduce((a,c)=>a+c.price,0);
  }
});
```

**Flow 2 (ASCII):**

```
[User Input] → [Event Handler] → [filter/sort HOF] → [DOM Update]
                   ↓
             [Add to Cart] → [Recompute Total]
```

---

## 11) FAQ

* **Kenapa `switch(amount <= 10000)` selalu default?**
  Karena `switch` *membandingkan nilai* bukan mengevaluasi ekspresi kondisi per case. Gunakan pola `switch(true)` jika ingin menaruh ekspresi kondisi di setiap case.
* **Kenapa `innerHTML` tidak berubah?** Pastikan elemen ada, `id` benar, dan script dijalankan **setelah** DOM siap (taruh `<script>` di bawah `</body>` atau pakai `DOMContentLoaded`).
* **Infinite loop?** Cek kondisi, pastikan variabel penghitung berubah.
* **`TypeError: x is undefined`?** Tambahkan guard (`if (!x) return;`) atau optional chaining (`x?.y`).

---

### Snippet Switch Pattern

```js
function getPayment(amount){
  switch(true){
    case amount === undefined || amount === null:
      return 'Masukkan nominal!';
    case amount <= 10000:
      return 'Pembayaran QRIS';
    default:
      return 'Pembayaran CASH';
  }
}
console.log(getPayment(11000));
```


---

## 📦 1. Install Package

Package dikelola dengan **npm (Node Package Manager)**.
Contoh kita pakai **axios** (untuk HTTP request) dan **lodash** (utility array & object).

```bash
# inisialisasi project
npm init -y     

# install axios dan lodash
npm install axios lodash
```

> Setelah install, package akan masuk ke folder `node_modules/` dan tercatat di `package.json`.

---

## 📥 2. Import Package

Ada dua cara umum:

1. **CommonJS (require)** → default di Node.js
2. **ESM (import)** → modern, aktifkan `"type": "module"` di `package.json`

### Contoh:

```js
// CommonJS
const axios = require('axios');
const _ = require('lodash');

// ES Module
import axios from 'axios';
import _ from 'lodash';
```

---

## 🛠️ 3. Implementasi Package

### 🔹 Contoh axios → ambil data dari API

```js
import axios from "axios";

async function getPosts() {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/posts?_limit=3");
    console.log("Data dari API:", response.data);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

getPosts();
```

**Output:**

```json
[
  { "userId": 1, "id": 1, "title": "sunt aut facere..." },
  { "userId": 1, "id": 2, "title": "qui est esse..." },
  { "userId": 1, "id": 3, "title": "ea molestias..." }
]
```

---

### 🔹 Contoh lodash → manipulasi data

```js
import _ from "lodash";

const numbers = [1, 2, 3, 4, 5, 6];

// ambil hanya angka genap
const evens = _.filter(numbers, n => n % 2 === 0);
console.log("Angka genap:", evens); // [2, 4, 6]

// kelompokkan data
const users = [
  { name: "Budi", role: "admin" },
  { name: "Siti", role: "user" },
  { name: "Andi", role: "admin" }
];

const grouped = _.groupBy(users, "role");
console.log(grouped);
// { admin: [{...}, {...}], user: [{...}] }
```

---

### 🔹 Contoh chalk → style warna di console

```bash
npm install chalk
```

```js
import chalk from "chalk";

console.log(chalk.green("Sukses!"));
console.log(chalk.red.bold("Error!"));
console.log(chalk.blue.bgYellow("Info penting"));
```

---

## 🔄 4. Alur Flow (Diagram)

```
[npm install package]
       ↓
[package.json tercatat]
       ↓
[import package di kode]
       ↓
[panggil fungsi dari package]
       ↓
[hasil ditampilkan / digunakan]
```

---

👉 Jadi, **alur penggunaan package** adalah:

1. Install dengan `npm install`.
2. Import dengan `require` atau `import`.
3. Panggil fungsi/package sesuai dokumentasi.
4. Implementasikan sesuai kebutuhan (misalnya fetch data, manipulasi array, style console, dll).

---


# 1) JavaScript Method

**Apa:** Method = fungsi yang jadi properti di dalam objek.
**Kapan:** Saat perilaku (aksi) “menempel” pada data objek.

```js
const user = {
  name: 'Ayu',
  greet() {           // method
    return `Hi, aku ${this.name}`;
  }
};
console.log(user.greet());
```

---

# 2) JavaScript Runtime

**Apa:** Lingkungan eksekusi JS. Utama: **Browser** (punya DOM, Web APIs) & **Node.js** (punya fs, path, http, dll).
**Dampak:** API yang tersedia beda. `document` hanya ada di browser; `fs` hanya di Node.

---

# 3) NPM install & usage

**Apa:** NPM = package manager untuk Node.
**Pakai:**

```bash
# inisialisasi
npm init -y
# install package produksi
npm i axios
# install package dev
npm i -D nodemon
```

**Di kode:**

```js
const axios = require('axios'); // CommonJS
// atau: import axios from 'axios'; // ESM
```

---

# 4) JavaScript Modules

**Apa:** Memecah kode ke file terpisah.
**ESM (modern):**

```js
// math.js
export function add(a, b){ return a + b; }

// main.mjs
import { add } from './math.js';
console.log(add(2,3));
```

**CommonJS (Node klasik):**

```js
// math.cjs
function add(a,b){ return a+b; }
module.exports = { add };

// main.cjs
const { add } = require('./math.cjs');
```

---

# 5) HTTP dan HTTPS

**Apa:** Protokol komunikasi web. **HTTPS** = HTTP + TLS (aman).
**Contoh (Axios):**

```js
import axios from 'axios';
const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
console.log(res.data);
```

---

# 6) HTTP Methods

**GET** (ambil), **POST** (buat), **PUT/PATCH** (ubah), **DELETE** (hapus).

```js
await axios.post('https://example.com/api/tasks', { title: 'Belajar' });
```

---

# 7) Recursion Function

**Apa:** Fungsi memanggil dirinya.
**Contoh:** Faktorial.

```js
function factorial(n){
  if(n < 0) throw new Error('negatif!');
  if(n <= 1) return 1;
  return n * factorial(n-1);
}
console.log(factorial(5)); // 120
```

---

# 8) Higher Order Functions (HOF)

**Apa:** Fungsi yang menerima/mengembalikan fungsi.
**Contoh:** `map`, `filter`, `reduce`.

```js
const nums = [1,2,3,4];
const squares = nums.map(n => n*n);
const evens = nums.filter(n => n%2===0);
const sum = nums.reduce((a,b)=>a+b, 0);
```

---

# 9) Closures

**Apa:** Fungsi “mengingat” variabel di scope luar.
**Contoh: Counter:**

```js
function createCounter(){
  let count = 0;
  return function(){ count++; return count; };
}
const next = createCounter();
console.log(next()); // 1
console.log(next()); // 2
```

---

# 10) IIFE (Immediately Invoked Function Expression)

**Apa:** Fungsi yang langsung dieksekusi.
**Gunanya:** Bikin scope tertutup.

```js
const config = (() => {
  const secret = 'ABC';
  return { appName: 'Demo', getKey: () => secret };
})();
console.log(config.appName);
```

---

# 11) Module Pattern

**Apa:** Gabungan IIFE + objek yang “mengekspor” API publik.

```js
const Store = (() => {
  const data = [];
  function add(item){ data.push(item); }
  function all(){ return [...data]; }
  return { add, all }; // public
})();
Store.add('A');
console.log(Store.all());
```

---

# 12) Rest Parameters

**Apa:** Ambil sisa argumen jadi array.

```js
function sum(...nums){ return nums.reduce((a,b)=>a+b,0); }
console.log(sum(1,2,3)); // 6
```

---

# 13) Generator Functions

**Apa:** Fungsi yang bisa “pause/resume” pakai `yield`.
**Contoh:**

```js
function* idGen(){
  let id = 1;
  while(true) yield id++;
}
const gen = idGen();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
```

---

# 14) ES6 Syntaxes (Ringkas)

## a) Working with Objects & Arrays

```js
const user = { name:'Ayu', age:20 };
const arr = [1,2,3];
```

## b) Destructuring assignment

```js
const { name, age } = user;
const [first, ...rest] = arr;
```

## c) Template Literals

```js
console.log(`Nama: ${name}, Umur: ${age}`);
```

## d) Spread & Rest

```js
const arr2 = [...arr, 4];       // spread
const obj2 = { ...user, city:'BDG' };
function maxOf(...nums){ return Math.max(...nums); } // rest + spread
```

## e) Object Enhancements

```js
const city = 'Bandung';
const person = { name, age, city, greet(){ return `Hi ${this.name}`; } };
```

## f) Classes

```js
class Student {
  constructor(name){ this.name = name; }
  greet(){ return `Halo, aku ${this.name}`; }
  static from(obj){ return new Student(obj.name); }
}
console.log(new Student('Ayu').greet());
```

---

# 15) JavaScript Variables

## `var`, `let`, `const`

* `var`: function‑scoped, **hindari** untuk kode modern.
* `let`: block‑scoped, bisa reassign.
* `const`: block‑scoped, **tidak** bisa reassign variabelnya (tapi isi objek/array masih bisa diubah).

```js
let x = 1;
x = 2;
const arr = [1]; arr.push(2); // boleh (mutasi isi), arr = [] // tidak boleh
```

## Variable Naming

* huruf/angka/\_/\$, tidak boleh mulai dengan angka.
* camelCase untuk variabel/fungsi, PascalCase untuk Kelas.

---

# 16) JavaScript Data Types

* **Number, String, Boolean, Null, Undefined, Object, Symbol, BigInt**
* **Array** adalah objek khusus.
* **Array of Objects**: umum dipakai untuk list data.

```js
const n = 42;            // Number
const s = "hello";       // String
const b = true;          // Boolean
const z = null;          // Null (kosong)
let u;                   // Undefined
const obj = { a:1 };     // Object
const arr = [1,2,3];     // Array
const students = [{id:1,name:'A'},{id:2,name:'B'}]; // Array of Objects

console.log(typeof n);   // "number"
console.log(typeof null);// "object" (quirk JS)
```

---

# 17) Pseudocode → JavaScript

**Pseudocode:**

```
SET sum TO 0
FOR each number IN numbers
  sum = sum + number
PRINT sum
```

**JavaScript:**

```js
const numbers = [1,2,3];
let sum = 0;
for(const n of numbers){ sum += n; }
console.log(sum);
```

---

# 18) Debugging / console.log

* `console.log()` untuk nilai.
* `console.error()` untuk error.
* Tambahkan label:

```js
console.log({ value: sum, step: 'after loop' });
```

---

# 19) JavaScript Function

```js
function add(a,b){ return a+b; }          // deklarasi
const mul = (a,b) => a*b;                 // arrow
```

---

# 20) JavaScript Conditional

```js
if(age >= 18) console.log('Dewasa');
else console.log('Anak');

const type = age >= 18 ? 'adult' : 'child';  // ternary
```

---

# 21) JavaScript Loop

```js
for(let i=0;i<3;i++) console.log(i);

for(const x of [10,20]) console.log(x);

['a','b'].forEach(v => console.log(v));
```

---

# 22) JavaScript Error Handling

```js
try {
  JSON.parse('{bad json}');
} catch (err) {
  console.error('Gagal parse:', err.message);
} finally {
  console.log('Selesai');
}
```

---

# 23) Synchronous vs Asynchronous

* **Sync:** baris berikutnya menunggu selesai.
* **Async:** bisa “nunggu” I/O tanpa blokir.

---

# 24) Promises & Callbacks

```js
// callback gaya lama
function fetchDataCb(cb){
  setTimeout(() => cb(null, {ok:true}), 500);
}

// Promise
function fetchData(){
  return new Promise(resolve => setTimeout(()=>resolve({ok:true}), 500));
}

fetchData().then(res => console.log(res)).catch(console.error);
```

---

# 25) Async–Await

```js
async function main(){
  try {
    const res = await fetchData();
    console.log(res);
  } catch(err) {
    console.error(err);
  }
}
main();
```

---

# MINI PROJECT: “Student Helper CLI”

> Menggabungkan: Modules, NPM (axios), HTTP/HTTPS GET, HOF, Closure, Recursion, IIFE, Module Pattern, Rest Params, Generator, ES6, Class, Variabel, Tipe Data, Debugging, Conditional, Loop, Error Handling, Sync/Async, Promises, Async‑Await.

## 1) Struktur Folder

```
student-helper/
├─ package.json
├─ index.mjs
├─ services/
│  ├─ http.mjs
│  ├─ store.mjs
│  └─ math.mjs
└─ utils/
   ├─ generator.mjs
   └─ text.mjs
```

## 2) package.json (ESM + axios)

```json
{
  "name": "student-helper",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.mjs",
    "dev": "nodemon index.mjs"
  },
  "dependencies": {
    "axios": "^1.7.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

## 3) services/http.mjs — (HTTP GET, Async‑Await, Error Handling)

```js
import axios from 'axios';

export async function fetchTodo(id){
  try {
    const res = await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
    return res.data; // { userId, id, title, completed }
  } catch (err) {
    // bungkus error agar deskriptif
    throw new Error(`Gagal ambil TODO ${id}: ${err.message}`);
  }
}
```

## 4) services/store.mjs — (Module Pattern + Closure + HOF)

```js
export const Store = (() => {
  const items = []; // private

  function add(...newItems){     // Rest Parameters
    newItems.forEach(it => items.push(it));
  }
  function all(){ return items.map(it => ({ ...it })); } // HOF + Spread
  function filterByCompleted(done){
    return items.filter(it => it.completed === done);
  }

  return { add, all, filterByCompleted }; // public API
})();
```

## 5) services/math.mjs — (Recursion)

```js
export function factorial(n){
  if(n < 0) throw new Error('n negatif');
  if(n <= 1) return 1;
  return n * factorial(n-1);
}
```

## 6) utils/generator.mjs — (Generator)

```js
export function* idGenerator(start=1){
  let id = start;
  while(true) yield id++;
}
```

## 7) utils/text.mjs — (IIFE value + Object Enhancements + Template Literals)

```js
export const Text = (() => {
  const prefix = 'StudentHelper';
  function tag(msg){ return `[${prefix}] ${msg}`; }
  function greet(name){ return `Hai, ${name}! Selamat belajar 🚀`; }
  return { tag, greet };
})();
```

## 8) index.mjs — (Semua digabung + Classes + Destructuring + Loops + Conditionals)

```js
import { fetchTodo } from './services/http.mjs';
import { Store } from './services/store.mjs';
import { factorial } from './services/math.mjs';
import { idGenerator } from './utils/generator.mjs';
import { Text } from './utils/text.mjs';

// Class
class Student {
  constructor(name, skills = []) {
    this.name = name;
    this.skills = skills;
  }
  addSkill(skill){ this.skills.push(skill); }
  info(){
    const { name, skills } = this; // Destructuring
    return `${name} punya skill: ${skills.join(', ') || '(belum ada)'}`;
  }
  static fromObject(obj){ return new Student(obj.name, obj.skills ?? []); }
}

// Debug awal
console.log(Text.tag('App mulai...'));

// Variabel & Tipe Data
const appName = 'Student Helper';  // const
let mode = 'demo';                 // let
var legacyNote = 'hindari var';    // var (untuk contoh)

// Spread & Rest
const baseSkills = ['JS', 'Git'];
const extra = ['HTTP', 'Debugging'];
const allSkills = [...baseSkills, ...extra];
function list(...items){ return items.join(', '); }

// Buat student
const s1 = new Student('Ayu', [...baseSkills]);
s1.addSkill('Node.js');
const s2 = Student.fromObject({ name: 'Budi', skills: ['HTML','CSS'] });

console.log(Text.greet(s1.name));
console.log(s1.info());
console.log(s2.info());

// Generator IDs
const gen = idGenerator(1);
const nextId = () => gen.next().value;

// Ambil beberapa TODO via HTTP (Async)
async function run(){
  try {
    // Loop ambil 3 todo (id 1..3)
    for (let i=0; i<3; i++){
      const id = nextId();
      const todo = await fetchTodo(id); // Async/Await + HTTPS
      // Destructuring object
      const { title, completed } = todo;
      // Conditional
      if (completed) {
        console.log(Text.tag(`TODO #${id} (DONE): ${title}`));
      } else {
        console.log(Text.tag(`TODO #${id} (PENDING): ${title}`));
      }
      Store.add(todo); // simpan ke module pattern store
    }

    // HOF (filter) + Array of Objects
    const doneTasks = Store.filterByCompleted(true);
    console.log(Text.tag(`Selesai: ${doneTasks.length}`));

    // Factorial (Recursion)
    console.log(Text.tag(`5! = ${factorial(5)}`));

    // Loop array
    console.log(Text.tag('Semua TODO tersimpan:'));
    for (const it of Store.all()){
      console.log(`- (#${it.id}) ${it.title} => ${it.completed ? 'DONE' : 'PENDING'}`);
    }

    // typeof
    console.log(Text.tag(`typeof null: ${typeof null}`));       // 'object' (quirk)
    console.log(Text.tag(`typeof s1: ${typeof s1}`));           // 'object'
    console.log(Text.tag(`Array? ${Array.isArray(allSkills)}`)); // true

    // Template Literals + Rest
    console.log(Text.tag(`All skills: ${list(...allSkills)}`));

  } catch(err) {
    // Error Handling
    console.error(Text.tag(`ERROR: ${err.message}`));
  } finally {
    console.log(Text.tag(`${appName} selesai dalam mode ${mode}.`));
  }
}

run();
```

## 9) Cara Menjalankan

```bash
# 1) buat folder & masuk
mkdir student-helper && cd student-helper

# 2) buat package.json & install deps
npm init -y
npm i axios
npm i -D nodemon

# 3) buat struktur & file, salin kode di atas sesuai path

# 4) jalanin
node index.mjs
# atau dengan nodemon (auto-restart saat file berubah)
npx nodemon index.mjs
```

---

