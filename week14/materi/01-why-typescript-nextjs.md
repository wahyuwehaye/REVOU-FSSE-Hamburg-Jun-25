# Why Use TypeScript with Next.js?

## Tujuan Pembelajaran
- Memahami nilai tambah TypeScript untuk proyek Next.js.
- Menjelaskan dampak type safety terhadap pengalaman developer dan user.
- Mengidentifikasi studi kasus nyata di mana TypeScript menyelamatkan waktu.

## Manfaat Utama
- **Deteksi Bug Dini**: Kesalahan tipe (misal API mengembalikan `null`) terdeteksi sebelum runtime.
- **Autocompletion Kuat**: Editor memberikan referensi props, route params, dan API helper.
- **Dokumentasi Hidup**: Type definition menjadi sumber dokumentasi resmi untuk tim.
- **Refactor Aman**: Mengubah struktur data besar lebih percaya diri karena compiler memberi peringatan.
- **Kolaborasi Tim**: Konsistensi kontrak fungsi dan komponen mempermudah onboarding anggota baru.

## Contoh Kasus
Tanpa TypeScript:
```jsx
export default function Profile({ user }) {
  return <h1>Hai {user.fullName.toUpperCase()}</h1>;
}
// Kalau `user` undefined, akan error runtime.
```
Dengan TypeScript:
```tsx
type User = {
  fullName: string;
};

export default function Profile({ user }: { user: User | null }) {
  if (!user) return <p>User belum login</p>;
  return <h1>Hai {user.fullName.toUpperCase()}</h1>;
}
```
Compiler memaksa kita menangani kasus `null` sehingga UI lebih stabil.

## Praktik Terbaik
- Gunakan TypeScript untuk boundary penting: API response, props, utilitas.
- Mulai dengan penambahan ringan (`// @ts-check` atau file `.d.ts`) sebelum full adoption.
- Integrasikan linting (`eslint-config-next`) yang siap untuk TypeScript.

## Latihan Mandiri
- Catat bug runtime terakhir yang pernah terjadi; analisa bagaimana TypeScript mencegahnya.
- Diskusikan dengan tim: bagian mana dari aplikasi yang paling membutuhkan type safety?

## Rangkuman Singkat
- TypeScript mengurangi bug, meningkatkan DX, dan memberi dokumentasi otomatis.
- Ketika dipadukan dengan Next.js, kita mendapatkan auto routing + intellisense route.
- Mulai dari area kritis, lalu kembangkan coverage secara bertahap.
