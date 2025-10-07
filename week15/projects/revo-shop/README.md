# RevoShop – Next.js Milestone Demo

Project ini memenuhi requirement milestone: routing dinamis, strategi data fetching berbeda, autentikasi, state management, CRUD, dan unit test.

## Fitur Utama
- **Routing & Navigation**: file-based routing (`/products/[id]`, `/admin/products`, `/cart`).
- **Data Fetching**:
  - Home (`/`) menggunakan ISR/SSG (revalidate 30 menit).
  - Detail produk (`/products/[id]`) dijalankan secara SSR (`dynamic = "force-dynamic"`).
  - Halaman `/products` memakai CSR dengan `useEffect`.
- **Autentikasi**: NextAuth credentials (akun demo `admin@revoshop.dev / revoshop123`).
- **State Management**: Zustand store mengelola cart.
- **CRUD Full-stack**: API in-memory (`/api/admin/products`) + UI di `/admin/products` (create/update/delete produk internal).
- **Testing**: Vitest + Testing Library (`npm run test`).

## Menjalankan
```bash
npm install
npm run dev
```
Login admin di `/auth/login` bila akses halaman admin.

## Scripts
- `npm run dev` – development server
- `npm run build` – production build
- `npm run test` – unit test dengan Vitest
- `npm run typecheck` – `tsc --noEmit`

## Struktur Singkat
```
src/
├─ app/
│  ├─ page.tsx                → List produk (ISR)
│  ├─ products/[id]/page.tsx  → SSR detail produk
│  ├─ products/page.tsx       → CSR list + cart
│  ├─ admin/products/page.tsx → Dashboard CRUD + autentikasi
│  ├─ cart/page.tsx           → Cart dari Zustand
│  └─ api/...                 → NextAuth & CRUD routes
├─ components/                → UI & form admin
├─ stores/useCartStore.ts     → Zustand store
├─ lib/                       → Fetch data + auth config
└─ __tests__/                 → Unit test contoh
```

> Catatan: API FakeStore digunakan untuk data publik; data admin disimpan in-memory untuk demo sehingga akan reset ketika server restart.
