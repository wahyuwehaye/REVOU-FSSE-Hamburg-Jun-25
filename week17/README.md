# Week 17 – Testing and Deployment in Next.js

Minggu ini membahas praktik testing yang komprehensif dan deployment untuk Next.js: unit testing dengan Jest, React Testing Library, testing async operations, coverage reports, serta setup CI/CD dengan Husky. Materi dirancang untuk sesi 30 menit dengan contoh proyek yang mudah dipahami.

## Struktur Folder
- `materi/` – modul markdown lengkap tentang testing fundamentals, Jest setup, event testing, async operations, coverage, dan deployment strategies
- `examples/`
  - `jest-basic-setup/` – contoh minimal setup Jest + React Testing Library di Next.js
  - `component-testing-demo/` – contoh event/form/list testing dengan userEvent
  - `async-testing-demo/` – mock API dengan MSW, testing async hooks & component states
- `projects/`
  - `todo-app-with-tests/` – Todo app lengkap dengan unit, event, dan coverage + Husky

## Agenda Presentasi 30 Menit
| Menit | Fokus | Demo/Referensi |
| --- | --- | --- |
| 0-5 | Pentingnya testing & overview tools (modul 01-02) | Penjelasan Jest + React Testing Library |
| 5-10 | Setup Jest di Next.js & first test (modul 03-04) | Demo `jest-basic-setup` |
| 10-15 | Testing events & user interactions (modul 05-07) | Live demo component testing |
| 15-20 | Testing async & API calls (modul 08-09) | Demo dengan mock API |
| 20-25 | Coverage reports & interpretation (modul 10-11) | Lihat coverage report di terminal |
| 25-30 | Husky setup & deployment strategies (modul 12-13) | Setup pre-commit hooks |

## Learning Objectives
Setelah menyelesaikan week 17, student mampu:
1. ✅ Setup Jest dan React Testing Library di Next.js project
2. ✅ Menulis unit test untuk React components
3. ✅ Testing user events (click, input, submit)
4. ✅ Testing async operations dan API calls dengan mocking
5. ✅ Menginterpretasi coverage reports
6. ✅ Setup Husky untuk pre-commit testing
7. ✅ Memahami deployment strategies untuk tested applications

## Challenge untuk Student
1. **Basic**: Tambahkan test coverage minimal 80% untuk salah satu component di proyek milestone
2. **Intermediate**: Setup Husky di proyek tim dan enforce test sebelum commit
3. **Advanced**: Implementasi E2E testing dengan Playwright atau Cypress untuk critical user flows

## Quick Start

### Prerequisites
```bash
Node.js >= 18.17
npm atau yarn
```

### Setup Development
```bash
# Clone atau masuk ke folder week17
cd TL-Session/week17

# Install dependencies untuk examples
cd examples/jest-basic-setup
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Resources & References
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)
- [Husky Documentation](https://typicode.github.io/husky/)

## Notes
- Semua examples sudah include TypeScript untuk type safety
- Coverage thresholds disesuaikan per project complexity
- Husky hooks dapat disesuaikan dengan workflow tim

Gunakan README di tiap contoh proyek sebagai panduan step-by-step. Happy Testing! 🧪
