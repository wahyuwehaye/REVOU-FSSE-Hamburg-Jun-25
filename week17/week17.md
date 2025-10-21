# Week 17 - Testing and Deployment in Next.js

## 📋 Overview

Week 17 fokus pada testing dan deployment untuk aplikasi Next.js. Materi mencakup unit testing dengan Jest, React Testing Library, pengujian async operations, interpretasi coverage, serta pengamanan pipeline dengan Husky sebelum akhirnya dibawa ke deployment.

## 🎯 Learning Objectives

1. **Testing Fundamentals** – memahami kenapa testing penting dan jenis-jenis testing.
2. **Jest & React Testing Library** – setup, menulis test pertama, memilih matcher yang tepat.
3. **User Interaction Testing** – mensimulasikan click, input, submit, dan validasi.
4. **Async & Data Fetching** – mocking API, menunggu loading/error state, mengetes `getServerSideProps`.
5. **Coverage & Quality Gate** – membaca report, menentukan target, menerapkan threshold.
6. **Automation & Deployment** – Husky pre-commit, workflow CI, dan strategi deployment yang aman.

## 📚 Modul Materi

| Modul | Link | Highlight |
| --- | --- | --- |
| 01 | [Introduction to Testing](./materi/01-introduction-to-testing.md) | alasan & analogi testing |
| 02 | [Jest & RTL Overview](./materi/02-jest-and-rtl-overview.md) | tools yang dipakai |
| 03 | [Setting up Jest di Next.js](./materi/03-setting-up-jest-nextjs.md) | konfigurasi awal |
| 04 | [Writing Your First Test](./materi/04-writing-first-test.md) | langkah test pertama |
| 05 | [Testing Events & Interactions](./materi/05-testing-events.md) | klik, keyboard, loading |
| 06 | [Testing Forms & Validation](./materi/06-testing-forms.md) | input, error message |
| 07 | [Testing Functions & Utilities](./materi/07-testing-functions-utils.md) | unit test helper/logika |
| 08 | [Testing Next.js Data Fetching](./materi/08-testing-next-data-fetching.md) | `getServerSideProps`, server action |
| 09 | [Testing API Calls with MSW](./materi/09-testing-api-and-msw.md) | mocking API realistis |
| 10 | [Understanding Test Coverage](./materi/10-understanding-coverage.md) | membaca report |
| 11 | [Gatekeeping dengan Husky](./materi/11-husky-precommit-coverage.md) | threshold & hooks |
| 12 | [Testing & Deployment Strategy](./materi/12-testing-deployment-strategy.md) | integrasi CI/CD |
| 13 | [Testing Checklist](./materi/13-testing-checklist.md) | ringkasan sebelum release |

## 💻 Examples

| Folder | Fokus | Cocok Untuk |
| --- | --- | --- |
| [`examples/jest-basic-setup`](./examples/jest-basic-setup/) | Setup minimal Jest + RTL | Modul 03-04 |
| [`examples/component-testing-demo`](./examples/component-testing-demo/) | Event, form, list testing | Modul 05-06 |
| [`examples/async-testing-demo`](./examples/async-testing-demo/) | MSW, async hooks, error state | Modul 08-09 |

## 🚀 Project Latihan

| Project | Highlight | Fokus Belajar |
| --- | --- | --- |
| [`projects/todo-app-with-tests`](./projects/todo-app-with-tests/) | Todo app Next.js + 80% coverage + Husky | Menyatukan seluruh materi minggu ini |

## 🧭 Saran Flow Sesi 30 Menit

1. **5 menit** – Kenapa testing penting + overview tools (modul 01-02).
2. **5 menit** – Live setup + test pertama (modul 03-04, pakai `jest-basic-setup`).
3. **7 menit** – Testing event/form di `component-testing-demo` (modul 05-06).
4. **7 menit** – Async & API mocking dengan MSW (`async-testing-demo`, modul 08-09).
5. **4 menit** – Laporan coverage + Husky (modul 10-11).
6. **2 menit** – Checklist & next steps (modul 12-13).

## ✅ Checklist Sebelum Deploy
- Test lokal & coverage lulus.
- Husky hooks terpasang dan berjalan.
- Workflow CI menjalankan lint + test.
- Preview build diverifikasi manual.
- Coverage report dilampirkan di PR.

Gunakan dokumen ini sebagai kompas sesi. Detail implementasi, analogi, dan latihan dapat diambil langsung dari modul serta contoh proyek. EOF
