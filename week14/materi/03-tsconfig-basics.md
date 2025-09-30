# TypeScript Configuration (tsconfig.json)

## Tujuan Pembelajaran
- Memahami peran `tsconfig.json` dalam proyek Next.js.
- Mengkaji opsi penting yang sering disesuaikan.
- Mengetahui konfigurasi tambahan untuk kualitas kode.

## Struktur Dasar
Contoh `tsconfig.json` bawaan Next.js App Router:
```json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## Opsi Penting
- `strict`: Aktifkan untuk mendapatkan type checking maksimum.
- `strictNullChecks`: Termasuk dalam `strict`, memaksa penanganan `null`/`undefined`.
- `noImplicitAny`: Menolak penggunaan tipe `any` implisit.
- `baseUrl` & `paths`: Mengatur alias import seperti `@/components/Header`.
- `types`: Menambahkan tipe global (misal Jest, Cypress) bila diperlukan.
- `allowJs`: Izinkan file JS; bantu migrasi bertahap.

## Customisasi Umum
- Tambahkan `"moduleDetection": "force"` untuk mencegah module mixing.
- Aktifkan `"exactOptionalPropertyTypes": true` agar optional property lebih ketat.
- Gunakan `"verbatimModuleSyntax": true` (TS 5) untuk import yang lebih sesuai ESM.

## Tips
- Simpan preset berbeda untuk server dan client jika kompleks (menggunakan `tsconfig.server.json`).
- Gunakan `extends` untuk mewarisi konfigurasi linting internal tim.
- Integrasikan `tsconfig` dengan IDE (VS Code membaca otomatis dari root workspace).

## Latihan Mandiri
- Aktifkan `exactOptionalPropertyTypes` dan lihat error yang muncul, pahami perbaikannya.
- Tambahkan alias `@/lib/*` dan refactor import di proyek contoh.

## Rangkuman Singkat
- `tsconfig.json` mengatur cara TypeScript menganalisis kode Anda.
- Gunakan mode `strict` sebagai standar untuk menghindari bug halus.
- Sesuaikan alias dan tipe global sesuai kebutuhan proyek.
