# Platzi Shop Demo

Demo Next.js + TypeScript yang memanfaatkan [FakeAPI Platzi](https://fakeapi.platzi.com/) untuk mendemonstrasikan seluruh topik Week 14:

- **TypeScript strict setup** (`tsconfig.json` + alias `@/*`)
- **Type-safe props & component** (`src/components/ProductCard.tsx`)
- **Routing lanjutan**: dynamic params `products/[id]`, nested segment `(dashboard)` + guard (middleware)
- **Type-safe Link & Router** (`src/app/layout.tsx`)
- **Form management**: React Hook Form + Zod pada login & create user
- **CRUD / API Routes**: `/api/products`, `/api/users`, `/api/session` memanggil FakeAPI Platzi
- **Error handling** di API routes & client feedback
- **SEO & Images**: metadata per halaman + `next/image` untuk gambar remote

## Menjalankan

```bash
npm install
npm run dev
```

> Gunakan email contoh dari FakeAPI (misal `john@mail.com`) ketika login agar cookie sesi dibuat.

## Alur Demo yang Disarankan
1. **Home** (`/`) – server component fetch kategori, tampilkan Next Image.
2. **Products** (`/products`) – filter via `searchParams`, penggunaan component typed.
3. **Detail** (`/products/[id]`) – `generateStaticParams` dan tipe params.
4. **Login** (`/login`) – React Hook Form + Zod memanggil `/api/session`.
5. **Dashboard Orders** (`/dashboard/orders`) – layout privat + middleware.
6. **Create User** (`/dashboard/users/new`) – form typed yang meneruskan data ke FakeAPI melalui API route.
7. **Logout** (`/logout`) – hapus cookie, kembali ke home.

Setiap bagian dikaitkan dengan materi di `week14/materi` untuk memperlihatkan praktik nyata TypeScript di Next.js.
