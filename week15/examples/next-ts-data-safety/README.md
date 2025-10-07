# next-ts-data-safety

Contoh bagaimana memadukan TypeScript + Zod untuk memastikan data dari API eksternal valid sebelum dipakai di UI.

## Highlight
- `src/lib/platzi-client.ts` – wrapper fetch yang mem-parse data dengan schema.
- `src/lib/platzi-schemas.ts` – definisi schema Zod untuk produk/kategori.
- `app/products/page.tsx` – server component yang mengambil data bertipe.
- `tsconfig.json` – alias `@/*` dan mode strict.

## Menjalankan
```bash
npm install
npm run dev
```

> API yang digunakan: https://api.escuelajs.co/api/v1/products
