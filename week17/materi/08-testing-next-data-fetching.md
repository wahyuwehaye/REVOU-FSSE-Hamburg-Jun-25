# 08 - Testing Data Fetching di Next.js

## Kenapa Penting?
`getServerSideProps`, `getStaticProps`, dan Server Actions menentukan data awal halaman. Kalau logika di sini salah, seluruh halaman ikut bermasalah. Kita dapat mengetesnya seperti fungsi biasa.

## Strategi Umum
1. **Pisahkan logika fetch** ke helper agar mudah di-mock.
2. **Gunakan mock** untuk dependensi eksternal (`fetch`, database client).
3. **Uji skenario sukses & gagal** (data kosong, error API).

## Contoh: `getServerSideProps`
```ts
// src/lib/products.ts
export async function fetchProducts() {
  const res = await fetch("https://api.example.com/products");
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

// src/app/products/page.tsx
export const getServerSideProps: GetServerSideProps = async () => {
  const products = await fetchProducts();
  return { props: { products } };
};
```

### Test dengan Jest
```ts
import { fetchProducts } from "@/lib/products";
import { getServerSideProps } from "@/app/products/page";

jest.mock("@/lib/products");
const mockFetchProducts = fetchProducts as jest.MockedFunction<typeof fetchProducts>;

describe("getServerSideProps", () => {
  it("mengembalikan props ketika fetch sukses", async () => {
    mockFetchProducts.mockResolvedValueOnce([{ id: "p1", name: "Keyboard" }]);

    const result = await getServerSideProps({} as any);

    expect(result).toEqual({
      props: {
        products: [{ id: "p1", name: "Keyboard" }],
      },
    });
  });

  it("melempar error untuk kegagalan fetch", async () => {
    mockFetchProducts.mockRejectedValueOnce(new Error("API down"));

    await expect(getServerSideProps({} as any)).rejects.toThrow("API down");
  });
});
```

## Testing `getStaticProps`
Mirip dengan `getServerSideProps`, hanya saja fokus pada data build-time. Tambahkan test untuk revalidate value.

## Testing Server Actions
Server Action adalah fungsi async yang bisa di-import. Treat as biasa.
```ts
import { createAction } from "@/app/actions";

describe("createAction", () => {
  it("menyimpan data dan mengembalikan id", async () => {
    const result = await createAction({ title: "Note" });
    expect(result?.id).toBeDefined();
  });
});
```
Gunakan mock untuk prisma/database agar tidak memukul DB nyata.

## Mocking `fetch`
```ts
global.fetch = jest.fn();
const mockFetch = fetch as jest.Mock;

mockFetch.mockResolvedValueOnce({
  ok: true,
  json: async () => [{ id: "1" }],
});
```

## Checklist
- [ ] Skenario sukses
- [ ] Error (API down, data kosong)
- [ ] Nilai kembalian sesuai kontrak (props, redirect, notFound)
- [ ] Revalidate (untuk `getStaticProps`)

## Latihan
> Tulis test untuk `getStaticProps` yang mengembalikan `{ notFound: true }` ketika API mengembalikan 404.

## Ringkas
Untuk mengetes data fetching Next.js, treat seperti fungsi biasa. Mock dependensi eksternal dan uji semua cabang (sukses, error, fallback). EOF
