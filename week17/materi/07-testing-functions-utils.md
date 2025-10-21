# 07 - Testing Functions & Utilities dengan Jest

## Kenapa Perlu?
Fungsi utilitas ibarat mesin kecil di pabrik. Kalau mesin ini rusak, produk akhir ikut bermasalah. Unit test memastikan setiap fungsi bekerja sesuai kontraknya sebelum dipakai di komponen atau API.

## Langkah Umum
1. Identifikasi input & output yang diharapkan.
2. Buat skenario normal, edge case, dan error handling.
3. Gunakan matcher Jest yang tepat (`toEqual`, `toThrow`, `toBeCloseTo`).
4. Tambahkan snapshot untuk struktur objek kompleks (opsional).

## Contoh: Kalkulator Diskon
```ts
// src/utils/price.ts
export function calculateDiscountedPrice(price: number, discountPercent: number) {
  if (price < 0) throw new Error("Harga tidak boleh negatif");
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error("Diskon harus 0-100% ");
  }
  const discount = price * (discountPercent / 100);
  return Math.round((price - discount) * 100) / 100;
}
```

```ts
// src/utils/price.test.ts
import { calculateDiscountedPrice } from "./price";

describe("calculateDiscountedPrice", () => {
  it("menghitung diskon 20% dengan benar", () => {
    expect(calculateDiscountedPrice(100_000, 20)).toBe(80_000);
  });

  it("membulatkan ke 2 desimal", () => {
    expect(calculateDiscountedPrice(199_999, 12.5)).toBe(175_000.13);
  });

  it("melempar error jika harga negatif", () => {
    expect(() => calculateDiscountedPrice(-1, 10)).toThrow("Harga tidak boleh negatif");
  });

  it("melempar error jika diskon lebih dari 100", () => {
    expect(() => calculateDiscountedPrice(100, 200)).toThrow();
  });
});
```

## Tips Matchers
| Kasus | Matcher |
| --- | --- |
| Bilangan bulat | `toBe` |
| Objek/array | `toEqual` |
| Bilangan pecahan | `toBeCloseTo` |
| Error | `toThrow` |
| Promise reject | `await expect(promise).rejects.toThrow()` |

## Mocking
Gunakan `jest.fn()` untuk mem-spy fungsi lain:
```ts
const notify = jest.fn();
processPayment({ amount: 100_000, notify });
expect(notify).toHaveBeenCalledWith(expect.objectContaining({ status: "success" }));
```

## Checklist
- [ ] Minimal 1 test untuk happy path
- [ ] Edge case (input kosong, angka ekstrem)
- [ ] Error handling
- [ ] Snapshot jika mengembalikan object besar

## Latihan
> Tuliskan test untuk fungsi `formatCurrency` yang menerima angka dan locale serta memastikan output mengikuti format lokal Indonesia.

## Ringkas
Unit test fungsi = memastikan "mesin kecil" bekerja sempurna sebelum dirangkai ke sistem besar. Gunakan matcher yang sesuai dan sertakan edge case. EOF
