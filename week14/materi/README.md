# Week 14 – TypeScript & Advanced Next.js Practices

## Overview Materi
- **Why Use TypeScript with Next.js?** Manfaat utama TypeScript untuk produktivitas dan reliabilitas kode.
- **Setup & Konfigurasi** Konversi proyek Next.js ke TypeScript, memahami `tsconfig.json` dan opsi umum.
- **Fundamental Typing** Tipe dasar, interface, utility types, dan praktik umum di komponen Next.js.
- **Migrasi Bertahap** Strategi mengubah file `.jsx` ke `.tsx` beserta tips efektif.
- **Routing & Data** Pengetikan props, `Link`, router, dynamic routes, query params, nested routes, dan private routing sederhana.
- **Image & SEO** Penanganan `next/image` dan alat SEO (`metadata`, `next/head`) secara type-safe.
- **Forms & CRUD** Pengenalan React Hook Form, integrasi dengan API route TypeScript, dan penanganan error.


## Peta Materi ke File
| Topik | File Materi | Contoh Project |
| --- | --- | --- |
| Alasan TypeScript & Setup | `01-why-typescript-nextjs.md`, `02-setup-typescript-nextjs.md`, `03-tsconfig-basics.md` | `examples/next-ts-starter` |
| Typing Fundamentals | `04-basic-types-interfaces.md`, `05-convert-pages-tsx.md`, `06-effective-conversion-tips.md` | `examples/next-ts-starter` |
| Props & Routing | `07-type-safe-props.md`, `08-link-router-types.md`, `09-dynamic-routes-query.md`, `10-nested-routes-private.md` | `examples/next-ts-routing` |
| Media & SEO | `11-working-with-images.md`, `12-seo-nextjs.md` | `examples/next-ts-starter` |
| Forms & CRUD | `13-intro-forms-react.md`, `14-react-hook-form.md`, `15-crud-api-typescript.md` | `examples/next-ts-forms` |
| Error Handling | `16-error-handling-best-practices.md` | `examples/next-ts-forms` |
| Demo Projects | — | `demo/todo-ts-next`, `demo/platzi-shop`, `demo/simple-crud` |

## Struktur Folder
| Folder | Konten |
| --- | --- |
| `materi/` | Modul teori & latihan dalam bentuk markdown |
| `examples/` | Beberapa proyek Next.js (TypeScript) siap jalan untuk demonstrasi |
| `projects/` | Slot tugas/mini project mingguan (kosong sementara) |
| `exercises/` | Template latihan tambahan (opsional) |

## Rekomendasi Alur 30 Menit
| Menit | Agenda | Highlight |
| --- | --- | --- |
| 0-3 | Opening & Hook | Tanyakan pengalaman bug runtime yang sulit dideteksi |
| 3-8 | Why TypeScript + Setup | Tunjukkan manfaat & langkah migrasi (demo `examples/next-ts-starter`) |
| 8-15 | Typing Components & Routing | Bahas props, `Link`, dynamic routes (demo `examples/next-ts-routing`) |
| 15-22 | Forms & CRUD | React Hook Form + API typed (demo `examples/next-ts-forms`) |
| 22-27 | Error Handling & Best Practice | Tunjukkan pattern try/catch, Zod, custom error type |
| 27-30 | Rangkuman & QnA | Rekap manfaat, ajak diskusi tantangan migrasi |

## Script Singkat
1. **Opening** – Sambut peserta, tanyakan pengalaman bug runtime, kaitkan dengan pentingnya type safety.
2. **Manfaat TypeScript** – Jelaskan deteksi bug awal, tooling, dokumentasi otomatis.
3. **Setup** – Tunjukkan konversi `npm run lint`/`tsconfig`, cara rename file ke `.tsx`.
4. **Typing Props & Routing** – Demo `Link`, dynamic params, nested route, guard sederhana.
5. **Forms & CRUD** – Perlihatkan React Hook Form typed, validasi Zod, API typed.
6. **Error Handling** – Bahas pattern `Result` atau custom error map.
7. **Closing** – Rangkuman 3 poin utama, tugas lanjutan, Q&A.

## Latihan Disarankan
- Ikuti latihan di akhir setiap modul materi.
- Buka folder `examples/` dan jalankan masing-masing proyek untuk eksplorasi typying.
- Migrasikan salah satu komponen dari proyek minggu 13 ke `.tsx` sebagai latihan.

## Referensi Cepat
- Next.js dengan TypeScript: https://nextjs.org/docs/app/building-your-application/configuring/typescript
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- React Hook Form: https://react-hook-form.com/
- Zod: https://zod.dev/

Gunakan materi ini sebagai panduan sesi live selama 30 menit dengan fokus pada praktek dan interaktivitas.
