# React Fragments

## Tujuan Pembelajaran
- Mengerti kegunaan `React.Fragment` atau shorthand `<>` `</>`.
- Menghindari wrapper DOM yang tidak diperlukan dalam komponen.
- Menggunakan key pada fragment ketika merender list.

## Kenapa Fragment?
React mewajibkan komponen mengembalikan satu parent element. Fragment memungkinkan kita mengelompokkan children tanpa menambah node DOM baru.

## Contoh Penggunaan
```jsx
function Profile() {
  return (
    <>
      <h1>Profil Mentor</h1>
      <p>Berpengalaman membangun aplikasi Next.js production.</p>
    </>
  );
}
```
Pada DOM hasil render, hanya `<h1>` dan `<p>` tanpa `<div>` ekstra.

## Fragment dengan Key
Saat merender list, gunakan `React.Fragment` dengan key:
```jsx
return data.map((item) => (
  <React.Fragment key={item.id}>
    <dt>{item.label}</dt>
    <dd>{item.value}</dd>
  </React.Fragment>
));
```
Shorthand `<>` tidak menerima atribut, jadi gunakan `React.Fragment` saat butuh `key`.

## Praktik yang Disarankan
- Gunakan fragment ketika struktur semantik penting (misal `<tr>`, `<td>` di tabel).
- Hindari `<div>` bertingkat tanpa alasan; fragment menjaga DOM bersih.

## Latihan Mandiri
- Refactor komponen yang memiliki banyak `<div>` wrapper menjadi fragment.
- Coba gunakan fragment dalam list definisi (`<dl>`), tabel, atau grid.

## Rangkuman Singkat
- Fragment mengelompokkan elemen tanpa menambah node DOM.
- Shorthand `<>` mempermudah penulisan, namun gunakan `React.Fragment` saat perlu `key`.
- Menjaga DOM bersih membantu aksesibilitas dan styling.
