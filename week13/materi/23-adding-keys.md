# Adding Unique Keys

## Tujuan Pembelajaran
- Mengetahui pentingnya `key` saat merender list di React/Next.js.
- Memahami bagaimana key memengaruhi proses reconciliation.
- Memilih key yang stabil dan unik.

## Mengapa Key Penting?
React menggunakan key untuk mengenali item dalam list. Tanpa key yang benar, React kesulitan menentukan elemen mana yang berubah, menyebabkan UI tidak konsisten atau performa buruk.

## Contoh Key yang Benar
```jsx
const todos = [
  { id: 't1', title: 'Belajar JSX' },
  { id: 't2', title: 'Latihan Next.js' },
];

<ul>
  {todos.map((todo) => (
    <li key={todo.id}>{todo.title}</li>
  ))}
</ul>
```

## Hindari Menggunakan Index Array
```jsx
{items.map((item, index) => (
  <li key={index}>{item}</li>
))}
```
Menggunakan index membuat React salah mengasosiasikan state internal saat item di-insert/delete. Gunakan ID unik dari data Anda.

## Key di Fragment
Gunakan `React.Fragment` dengan `key` jika perlu merender elemen kembar tanpa wrapper.
```jsx
<React.Fragment key={section.id}>
  <h2>{section.title}</h2>
  <p>{section.body}</p>
</React.Fragment>
```

## Praktik yang Disarankan
- Gunakan ID dari database atau hasil generate (UUID) yang stabil.
- Pada data sementara, buat ID sendiri (contoh: `Date.now()` + random) saat menambah item.
- Pastikan key tidak berubah antar render kecuali item berbeda.

## Latihan Mandiri
- Modifikasi todo list sehingga setiap item memiliki tombol hapus; perhatikan perilaku ketika key benar vs salah.
- Uji dengan data yang dapat di-drag & drop; key unik menjaga state setiap item.

## Rangkuman Singkat
- `key` membantu React mencocokkan elemen list antar render.
- Hindari key berbasis index kecuali list statis tanpa mutasi.
- Pilih key unik & stabil agar UI konsisten dan performa optimal.
