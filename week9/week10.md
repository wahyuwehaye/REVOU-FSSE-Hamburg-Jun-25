---

# Rangkuman singkat

## 1) Complexity & Big-O (kenapa penting?)

* **Tujuan:** menebak performa saat data membesar.
* **Time vs Space:** waktu jalan vs memori ekstra.
* **Kasus:** Best / Average / Worst.
* **Big-O:** laju pertumbuhan (abaikan konstanta) → `O(1)`, `O(log n)`, `O(n)`, `O(n log n)`, `O(n²)`, …
* **Amortized:** biaya rata-rata banyak operasi (contoh: `Array.push` biasanya O(1) rata-rata).

**Contoh cepat:**

* Loop 1 kali keliling → `O(n)`.
* 2 loop bersarang → `O(n²)`.
* Bagi dua terus (binary search) → `O(log n)`.

## 2) Searching (mencari data)

* **Linear Search**: cek satu-satu → `O(n)` (data *tidak perlu* terurut).
* **Binary Search**: belah dua → `O(log n)` (data **harus terurut**).

**Kapan pakai apa?**
Kalau data kecil / sekali pakai → linear oke. Kalau sering cari berulang, **urutkan dulu** lalu binary search.

## 3) Sorting (mengurutkan data)

* **Tujuan:** mempermudah cari, ranking, laporan, dsb.
* **Garis besar pilihan:**

  * **Bubble / Selection / Insertion:** mudah dimengerti; umumnya `O(n²)`.
  * **Merge / Quick / Heap:** `O(n log n)` (lebih cepat untuk besar).
* **Heuristik praktis:**

  * Data kecil / hampir terurut → **Insertion**.
  * Umum (praktis cepat) → **Quick** (hati-hati worst-case).
  * Stabil & konsisten → **Merge**.
  * Minim memori tambahan → **Heap**.

**Tabel singkat:**

| Algoritma |       Best |        Avg |      Worst |    Space | Stabil? | Catatan singkat          |
| --------- | ---------: | ---------: | ---------: | -------: | ------- | ------------------------ |
| Bubble    |       O(n) |      O(n²) |      O(n²) |     O(1) | Ya      | Sederhana, lambat        |
| Insertion |       O(n) |      O(n²) |      O(n²) |     O(1) | Ya      | Bagus utk hampir terurut |
| Selection |      O(n²) |      O(n²) |      O(n²) |     O(1) | Tidak   | Swap sedikit             |
| Merge     | O(n log n) | O(n log n) | O(n log n) |     O(n) | Ya      | Stabil, bukan in-place   |
| Quick     | O(n log n) | O(n log n) |      O(n²) | O(log n) | Tidak   | Praktis cepat            |
| Heap      | O(n log n) | O(n log n) | O(n log n) |     O(1) | Tidak   | Konsisten, in-place      |

## 4) Recursion (cara pikir memecah masalah)

* **Tiga pilar:** base case, progress ke base case, gabungkan hasil.
* **Tail recursion:** pemanggilan rekursif di akhir (optimal di beberapa bahasa).
* **Indirect recursion:** fungsi saling panggil (A → B → A).

**Contoh use-case:** factorial, fibonacci, DFS tree/menu, traversal folder.

---

# Contoh singkat (JS) – super ringkas

### Linear vs Binary Search

```js
function linearSearch(arr, t) {
  for (let i = 0; i < arr.length; i++) if (arr[i] === t) return i;
  return -1;
}
// butuh array terurut:
function binarySearch(arr, t) {
  let l = 0, r = arr.length - 1;
  while (l <= r) {
    const m = (l + r) >> 1;
    if (arr[m] === t) return m;
    if (arr[m] < t) l = m + 1; else r = m - 1;
  }
  return -1;
}
```

### Bubble Sort (versi mudah diikuti pemula)

```js
function bubbleSort(a) {
  a = [...a];
  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j+1]) { [a[j], a[j+1]] = [a[j+1], a[j]]; swapped = true; }
    }
    if (!swapped) break;
  }
  return a;
}
```

### Recursion (factorial & fibonacci memo)

```js
function factorial(n){ return n===0 ? 1 : n*factorial(n-1) }
function fibMemo(n, memo={}) {
  if (n<=1) return n;
  if (memo[n]) return memo[n];
  memo[n] = fibMemo(n-1,memo) + fibMemo(n-2,memo);
  return memo[n];
}
```

> **Catatan:** Versi **lengkap** semua algoritma (bubble, insertion, selection, merge, quick, heap), searching, recursion, plus penghitung perbandingan & swap, sudah ada di file `algorithms.js` (lihat ZIP di atas).

---

# Implementasi praktis (agar nyambung ke proyek)

* **Searching:** cari userId dalam array hasil API → kalau sering query, **urutkan** dan pakai binary search atau langsung gunakan struktur `Map` (O(1) lookup).
* **Sorting:** leaderboard, transaksi terbaru, sort by tanggal/nilai → pilih **quick/merge**; untuk data kecil/hampir terurut → **insertion** lebih simpel.
* **Recursion:** telusur struktur pohon (menu, kategori), DFS node anak; atau proses folder & subfolder.

---

# Alur & speaking script (30 menit, interaktif)

**Peralatan:** Node.js. Jalankan `node algorithms.js`.

**0–2’ Opening**

* “Halo semua 👋. Hari ini kita belajar *kenapa kode bisa cepat/lambat* lewat **Complexity**, lanjut **Searching**, **Sorting**, dan **Recursion**. Targetnya: ngerti intuisi, bisa pilih algoritma, dan lihat kodenya langsung.”
* Icebreaker: “Kalau cari nama di daftar 1 juta data, **acak** vs **sudah terurut** — mana lebih cepat? (angkat tangan).”

**2–8’ Complexity (demo dulu, teori tipis)**

* “Time vs Space, Big-O = laju pertumbuhan.”
* Tunjukkan di `algorithms.js`: `opsLinear(1000)` vs `opsQuadratic(100)` → “Lihat, kuadrat meledak lebih cepat dari linear.”
* “Rules cepat: loop bersarang → `O(n²)`, bagi dua terus → `O(log n)`.”

**8–13’ Searching**

* “Belum terurut → **linear** (O(n)). Terurut → **binary** (O(log n)).”
* Live: jalankan `linearSearch` (lihat steps), lalu urutkan → `binarySearch`.
* Tanya cepat: “Kapan worth mengurutkan dulu?” (biar diskusi singkat).

**13–23’ Sorting**

* Tunjukkan tabel perbandingan (pakai cheatsheet).
* Live kecil:

  * Jalankan `bubbleSort`, `insertionSort`, `selectionSort` → perhatikan `comparisons`/`swaps`.
  * Tunjukkan `mergeSort`, `quickSort`, `heapSort` outputnya.
* Heuristik praktis: “Data kecil/hampir terurut → Insertion. Umum → Quick. Stabil pasti → Merge. Minim memori → Heap.”

**23–28’ Recursion**

* “Tiga pilar: **base case**, **progress**, **combine**.”
* Live: `factorial(5)`, `fib(10)` vs `fibMemo(40)` (kontraskan performa).
* Indirect recursion `isEven/isOdd` → “Kalau lupa base case? Infinite recursion.”

**28–30’ Quiz & Closing**

* 3 pertanyaan cepat (angkat tangan/chat):

  1. Kompleksitas binary search? (**O(log n)**)
  2. Sorting stabil O(n log n)? (**Merge**)
  3. Data hampir terurut → pilih? (**Insertion**)
* “Ambil **cheatsheet.md** & **exercises.md**. Coba modifikasi `algorithms.js` di rumah dan share temuan kalian.”

> Versi detail script & poin bicara sudah saya tulis di `slides-outline.md` (ada di ZIP).

---

# Latihan (ready to use di kelas)

* **Big-O cepat (5’):** tebak kompleksitas beberapa snippet (sudah ada di `exercises.md`).
* **Searching (5’):** cari angka di array acak pakai linear vs binary.
* **Sorting (5–10’):** ubah input & amati `comparisons/swaps` untuk bubble vs insertion.
* **Recursion (5’):** `factorial(5)`, `fibMemo(40)`, diskusi base case.

---

# Cara pakai paket materi

1. Download → ekstrak → buka terminal di folder itu.
2. Jalankan:

```bash
node algorithms.js
```

3. Baca:

* `cheatsheet.md` → ringkasan Big-O + tabel perbandingan.
* `slides-outline.md` → flow + script 30 menit.
* `exercises.md` → latihan.
