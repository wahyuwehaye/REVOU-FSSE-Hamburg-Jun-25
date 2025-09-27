# Why Use a Frontend Framework/Library?

## Tujuan Pembelajaran
- Memahami tantangan membangun aplikasi UI modern dengan JavaScript murni.
- Menjelaskan manfaat utama menggunakan framework/frontend library.
- Menyadari dampak framework terhadap skalabilitas tim dan produk.

## Konsep Utama
JavaScript murni memberi kebebasan penuh, tetapi ketika aplikasi tumbuh, kita menghadapi kompleksitas pengelolaan state, sinkronisasi DOM, modularitas, dan konsistensi antar developer. Framework/frontend library hadir untuk:
- **Menyederhanakan pembaruan UI** melalui model deklaratif; kita fokus pada state, framework mengurus DOM.
- **Memberi struktur** sehingga kode konsisten, mudah dibaca, dan scalable.
- **Menyediakan ekosistem tooling**: CLI, dev server, hot reload, testing utilitas, dsb.
- **Mendorong best practice** seperti component-based architecture, routing standar, dan manajemen asset.

## Contoh Situasi
Tanpa framework:
```html
<ul id="todo-list"></ul>
<script>
  const todos = ['Belajar DOM', 'Nge-debug event'];
  const list = document.getElementById('todo-list');
  list.innerHTML = '';
  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.textContent = todo;
    list.appendChild(li);
  });
</script>
```
Setiap perubahan `todos` wajib menulis ulang logika DOM secara manual. Framework seperti React memungkinkan kita menulis deklaratif:
```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo}>{todo}</li>
      ))}
    </ul>
  );
}
```
Framework menghitung perubahan DOM untuk kita, meminimalkan bug dan meningkatkan produktivitas.

## Praktik yang Disarankan
1. Identifikasi fitur aplikasi yang sulit dipelihara jika hanya memakai DOM API.
2. Bandingkan bagaimana framework menyelesaikan tantangan tersebut (aksesibilitas, state, routing).
3. Catat manfaat yang paling relevan bagi tim atau proyek Anda.

## Latihan Mandiri
- Pilih satu komponen di aplikasi lama (misal daftar produk) dan tulis ulang pseudo-code bagaimana Anda mengelolanya dengan vanilla JS vs framework.
- Diskusikan dengan kelompok: kapan *tidak* perlu framework? (misal landing page statis kecil).

## Rangkuman Singkat
- Framework memecahkan kompleksitas UI modern dan memberi struktur kerja tim.
- Pendekatan deklaratif membuat sinkronisasi state ↔︎ UI lebih mudah.
- Ekosistem tooling mempercepat pengembangan, pengujian, dan kolaborasi.
