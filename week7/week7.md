

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