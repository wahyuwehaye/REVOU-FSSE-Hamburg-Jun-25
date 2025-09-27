# Concept Event in Next.js

## Tujuan Pembelajaran
- Memahami konsep event di React/Next.js dan mengapa disebut Synthetic Event.
- Menerapkan penanganan event dasar (click, submit, change).
- Mengatur beberapa event sekaligus untuk interaksi kaya.

## Event di Next.js
Next.js memanfaatkan React di sisi client sehingga semua event yang digunakan adalah **SyntheticEvent**—lapisan abstraksi yang menormalkan perilaku event lintas browser. Tulis nama event dalam camelCase (`onClick`, `onMouseEnter`), dan gunakan handler berupa fungsi.

## Basic Event Handling
Contoh menangani click dan submit:
```jsx
'use client';

export default function EventBasics() {
  function handleClick() {
    alert('Tombol diklik!');
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log('Form disubmit oleh', event.target.elements.name.value);
  }

  return (
    <section className="space-y-4">
      <button onClick={handleClick} className="px-4 py-2 bg-slate-900 text-white rounded">
        Klik aku
      </button>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="name" placeholder="Nama" className="border p-2" />
        <button className="bg-indigo-500 text-white px-3 py-2 rounded">Submit</button>
      </form>
    </section>
  );
}
```

## Synthetic Events
SyntheticEvent menormalkan interface event sehingga Anda dapat memakai properti seperti `event.target`, `event.type`, `event.preventDefault()`, dan `event.stopPropagation()` tanpa khawatir perbedaan browser.
```jsx
'use client';

export default function FormLogger() {
  function handleSubmit(event) {
    event.preventDefault();
    console.log('Tipe event:', event.type);
    console.log('Target field:', event.target.elements.email.value);
    // event.persist() tidak diperlukan lagi sejak React 17+
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 max-w-sm">
      <input name="email" placeholder="Email" className="border p-2 w-full" />
      <textarea name="message" placeholder="Pesan" className="border p-2 w-full" rows={3} />
      <button className="bg-green-500 text-white px-3 py-2 rounded">Kirim</button>
    </form>
  );
}
```

## Multiple Events
Satu elemen bisa menangani beberapa event untuk UX lebih interaktif.
```jsx
'use client';

export default function InteractiveButton() {
  function handleClick() {
    console.log('Button diklik');
  }

  function handleMouseEnter() {
    console.log('Pointer masuk');
  }

  function handleFocus() {
    console.log('Button fokus via keyboard');
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      className="px-4 py-2 rounded bg-indigo-500 text-white"
    >
      Interaktif
    </button>
  );
}
```

## Praktik yang Disarankan
- Simpan handler sedekat mungkin dengan komponen yang membutuhkan.
- Gunakan nama handler deskriptif (`handleSubmit`, `handleToggle`).
- Pertimbangkan `useCallback` ketika handler diberikan ke banyak child.

## Latihan Mandiri
- Buat komponen `LikeButton` dengan handler klik utama dan klik kanan (`onContextMenu`) untuk menampilkan menu.
- Implementasikan `onBlur` dan `onFocus` pada input untuk memberi highlight.

## Rangkuman Singkat
- Event di Next.js berjalan di atas SyntheticEvent yang konsisten lintas browser.
- Penanganan dasar meliputi klik, submit, dan change dengan `event.preventDefault()` ketika diperlukan.
- Anda dapat menggabungkan banyak event untuk menciptakan pengalaman interaktif yang kaya.
