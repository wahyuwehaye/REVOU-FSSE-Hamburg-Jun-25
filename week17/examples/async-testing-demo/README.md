# Async Testing Demo

Contoh fokus untuk mengetes operasi asynchronous di Next.js menggunakan Jest + React Testing Library + Mock Service Worker (MSW).

## 🎯 Yang Dicontohkan
- Mocking API dengan MSW (GET & POST)
- Testing helper fetch (`fetchUsers`, `createNote`)
- Testing hook `useUsers` (loading, success, error)
- Testing komponen `UserDirectory` lengkap dengan loading, error, empty state
- Menimpa (override) handler per test untuk mensimulasikan skenario berbeda

## 📁 Struktur
```
async-testing-demo/
├── src/
│   ├── components/
│   │   ├── UserDirectory.tsx
│   │   └── UserDirectory.test.tsx
│   ├── hooks/
│   │   └── useUsers.ts
│   ├── lib/
│   │   ├── api.ts
│   │   └── api.test.ts
│   └── tests/
│       └── server/
│           ├── handlers.ts
│           └── index.ts
├── jest.config.mjs
├── jest.setup.js
├── package.json
└── tsconfig.json
```

## 🚀 Cara Menjalankan
```bash
npm install
npm test            # menjalankan seluruh test
npm run test:watch  # watch mode
npm run test:coverage
```

## 🧩 Flow Testing
1. **Handlers** di `src/tests/server/handlers.ts` mendefinisikan response default untuk `/api/users` dan `/api/notes`.
2. `jest.setup.js` menyalakan server MSW sebelum test dan mematikannya setelah test.
3. Test dapat `server.use(...)` untuk override handler sehingga mudah menguji error state.

## 💡 Tips Pengajaran
- Tunjukkan bedanya `waitForElementToBeRemoved` vs `findBy...` untuk menunggu loading hilang.
- Jelaskan kapan memakai `jest.mock('fetch')` vs MSW (MSW lebih realistis karena network layer tetap ada).
- Gunakan file ini sebagai referensi ketika menjelaskan modul 08 & 09.

Selamat bereksperimen! EOF
