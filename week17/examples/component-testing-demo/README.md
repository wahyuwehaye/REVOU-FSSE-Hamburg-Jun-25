# Component Testing Demo

Contoh proyek ringan yang berfokus ke tiga skenario umum testing komponen Next.js/React menggunakan Jest + React Testing Library:

1. **Button** – state loading, disabled, dan event async
2. **SearchBox** – input, validation, dan clear action
3. **TodoList** – CRUD sederhana, filter, dan conditional rendering

## 📁 Struktur Project
```
component-testing-demo/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.test.tsx
│   │   ├── SearchBox/
│   │   │   ├── SearchBox.tsx
│   │   │   └── SearchBox.test.tsx
│   │   └── TodoList/
│   │       ├── TodoList.tsx
│   │       └── TodoList.test.tsx
│   └── utils/
│       └── test-utils.tsx
├── jest.config.mjs
├── jest.setup.js
├── package.json
└── tsconfig.json
```

## 🚀 Menjalankan
```bash
npm install
npm test               # menjalankan seluruh test
npm run test:watch     # mode watch
npm run test:coverage  # melihat laporan coverage
```

## 🎓 Apa yang Dibahas?

### 1. Button Component
- Memastikan label tampil sesuai props
- Menguji event click & loading state async
- Memastikan tombol tidak bisa ditekan saat disabled

### 2. SearchBox Component
- Simulasi user mengetik & submit
- Validasi input kosong tidak men-trigger search
- Tombol reset menghapus nilai input

### 3. TodoList Component
- Menambah todo baru lewat form
- Menandai todo selesai & menghapus todo
- Filtering (all, active, completed)
- Empty state messaging

## 🧪 Pola Testing yang Dicontohkan
- Arrange ➜ Act ➜ Assert
- Menggunakan `userEvent` untuk interaksi realistik
- Reusable helper (`render` custom di `src/utils/test-utils.tsx`)
- Testing state async menggunakan `await screen.findByText`

## 🔄 Ide Pengembangan Selanjutnya
- Tambahkan komponen Modal atau ProductCard untuk latihan lanjutan
- Gunakan MSW untuk memalsukan API call pada TodoList
- Tambahkan snapshot testing untuk komponen presentasional

Proyek ini dirancang sebagai playground. Silakan duplikasi ke folder lain dan kembangkan sesuai kebutuhan sesi kelas. EOF
