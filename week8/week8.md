# 📚 Week 8 - JavaScript Fundamentals

## 🎯 Tujuan Pembelajaran
Pada week ini, kita akan mempelajari dasar-dasar JavaScript yang merupakan fondasi penting untuk menjadi software engineer. Setelah menyelesaikan week ini, Anda akan mampu:

- ✅ Memahami konsep dasar JavaScript
- ✅ Menggunakan variabel dan tipe data
- ✅ Mengimplementasikan fungsi dan kontrol alur
- ✅ Bekerja dengan array dan object
- ✅ Memahami ES6+ features

## 📖 Materi Pembelajaran

### 1. Pengenalan JavaScript
JavaScript adalah bahasa pemrograman yang digunakan untuk membuat website interaktif. Berbeda dengan HTML (struktur) dan CSS (styling), JavaScript memberikan "kehidupan" pada website.

**Contoh Sederhana:**
```javascript
// Menampilkan pesan ke console
console.log("Hello, World!");

// Menampilkan alert ke user
alert("Selamat datang di website kami!");
```

### 2. Variabel dan Tipe Data

#### Variabel
Variabel adalah tempat untuk menyimpan data. Ada 3 cara mendeklarasikan variabel:

```javascript
// var (cara lama, tidak disarankan)
var namaLama = "John";

// let (untuk variabel yang bisa diubah)
let nama = "Wahyuwehaye";
nama = "Wahyu"; // Bisa diubah

// const (untuk variabel yang tidak bisa diubah)
const umur = 25;
// umur = 26; // Error! Tidak bisa diubah
```

#### Tipe Data
JavaScript memiliki beberapa tipe data:

```javascript
// String (teks)
let nama = "Wahyuwehaye";
let alamat = 'Jakarta';

// Number (angka)
let umur = 25;
let tinggi = 175.5;

// Boolean (true/false)
let sudahMenikah = false;
let aktif = true;

// Array (kumpulan data)
let hobbies = ["coding", "gaming", "reading"];
let angka = [1, 2, 3, 4, 5];

// Object (kumpulan data dengan key-value)
let person = {
    nama: "Wahyuwehaye",
    umur: 25,
    pekerjaan: "Software Engineer"
};
```

### 3. Fungsi (Functions)
Fungsi adalah blok kode yang dapat dipanggil berulang kali.

```javascript
// Fungsi sederhana
function sapa(nama) {
    return "Halo, " + nama + "!";
}

// Arrow function (ES6+)
const sapaArrow = (nama) => {
    return `Halo, ${nama}!`;
};

// Arrow function sederhana
const tambah = (a, b) => a + b;

// Penggunaan fungsi
console.log(sapa("Wahyuwehaye")); // Halo, Wahyuwehaye!
console.log(tambah(5, 3)); // 8
```

### 4. Kontrol Alur (Control Flow)

#### If-Else Statement
```javascript
let nilai = 85;

if (nilai >= 90) {
    console.log("Grade A");
} else if (nilai >= 80) {
    console.log("Grade B");
} else if (nilai >= 70) {
    console.log("Grade C");
} else {
    console.log("Grade D");
}
```

#### Loop (Perulangan)
```javascript
// For loop
for (let i = 0; i < 5; i++) {
    console.log("Iterasi ke-" + i);
}

// For...of loop (untuk array)
let fruits = ["apple", "banana", "orange"];
for (let fruit of fruits) {
    console.log(fruit);
}

// While loop
let counter = 0;
while (counter < 3) {
    console.log("Counter: " + counter);
    counter++;
}
```

### 5. Array Methods
Array memiliki banyak method yang berguna:

```javascript
let numbers = [1, 2, 3, 4, 5];

// map() - mengubah setiap elemen
let doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter() - menyaring elemen
let evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4]

// reduce() - mengurangi array menjadi satu nilai
let sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum); // 15

// find() - mencari elemen pertama yang memenuhi kondisi
let found = numbers.find(num => num > 3);
console.log(found); // 4
```

### 6. Object dan Destructuring
```javascript
let person = {
    nama: "Wahyuwehaye",
    umur: 25,
    pekerjaan: "Software Engineer",
    skills: ["JavaScript", "React", "Node.js"]
};

// Destructuring
let { nama, umur, pekerjaan } = person;
console.log(nama); // Wahyuwehaye

// Destructuring dengan alias
let { nama: fullName } = person;
console.log(fullName); // Wahyuwehaye
```

## 🛠️ Praktik Langsung

### Latihan 1: Kalkulator Sederhana
Buatlah fungsi untuk melakukan operasi matematika dasar.

```javascript
function kalkulator(operasi, a, b) {
    switch(operasi) {
        case 'tambah':
            return a + b;
        case 'kurang':
            return a - b;
        case 'kali':
            return a * b;
        case 'bagi':
            return b !== 0 ? a / b : "Tidak bisa dibagi nol";
        default:
            return "Operasi tidak valid";
    }
}

// Test
console.log(kalkulator('tambah', 5, 3)); // 8
console.log(kalkulator('bagi', 10, 2)); // 5
```

### Latihan 2: Filter Data Mahasiswa
Buatlah fungsi untuk memfilter mahasiswa berdasarkan kriteria.

```javascript
let mahasiswa = [
    { nama: "Wahyuwehaye", nilai: 85, jurusan: "Informatika" },
    { nama: "Alice", nilai: 92, jurusan: "Informatika" },
    { nama: "Bob", nilai: 78, jurusan: "Sistem Informasi" },
    { nama: "Charlie", nilai: 88, jurusan: "Informatika" }
];

function filterMahasiswa(data, kriteria) {
    return data.filter(mhs => {
        if (kriteria.jurusan && mhs.jurusan !== kriteria.jurusan) {
            return false;
        }
        if (kriteria.nilaiMin && mhs.nilai < kriteria.nilaiMin) {
            return false;
        }
        return true;
    });
}

// Test
let hasil = filterMahasiswa(mahasiswa, { 
    jurusan: "Informatika", 
    nilaiMin: 80 
});
console.log(hasil);
```

## 🎯 Tips Belajar

1. **Praktik Setiap Hari**: Cobalah menulis kode JavaScript setiap hari, meskipun hanya 30 menit.

2. **Gunakan Console Browser**: Buka Developer Tools (F12) dan coba kode di console.

3. **Baca Error Message**: Jangan takut dengan error, baca pesannya dan cari solusinya.

4. **Break Down Problems**: Pecah masalah besar menjadi masalah kecil.

5. **Use Online Resources**: 
   - MDN Web Docs
   - JavaScript.info
   - FreeCodeCamp

## 🔗 Referensi Tambahan

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [JavaScript.info](https://javascript.info/)
- [ES6 Features](https://es6-features.org/)

## ❓ Pertanyaan Umum

**Q: Kapan menggunakan let vs const?**
A: Gunakan `const` untuk nilai yang tidak akan berubah, `let` untuk nilai yang bisa berubah.

**Q: Apa perbedaan function biasa dan arrow function?**
A: Arrow function lebih singkat dan tidak memiliki `this` binding sendiri.

**Q: Bagaimana cara debug JavaScript?**
A: Gunakan `console.log()`, `debugger` statement, atau browser DevTools.

---

*Selamat belajar JavaScript! Ingat, setiap expert dulunya adalah pemula. Keep coding! 🚀*
