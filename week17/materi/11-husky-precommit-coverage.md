# 11 - Gatekeeping dengan Husky & Coverage Threshold

## Mengapa Husky?
Husky memungkinkan kita menjalankan skrip otomatis sebelum commit/push. Kita bisa menolak commit jika test gagal atau coverage kurang dari standar.

## Instalasi Singkat
```bash
npm install husky --save-dev
npx husky init
```
Ini akan membuat folder `.husky/` dan script `prepare` di `package.json`.

## Contoh `package.json`
```json
{
  "scripts": {
    "prepare": "husky",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "next lint"
  },
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 75,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## Hook Pre-commit
```bash
npx husky add .husky/pre-commit "npm run lint && npm test"
```
Tambahkan degrade coverage check:
```bash
npx husky add .husky/pre-push "npm run test:coverage"
```

Jika coverage kurang dari threshold, Jest akan mengembalikan exit code ≠ 0 → push diblokir.

## Strategi Bertahap
- Mulai threshold rendah (mis. 60%), naikkan 5-10% per sprint.
- Buat pengecualian untuk file tertentu via `coveragePathIgnorePatterns`.
- Monitor report HTML (`coverage/lcov-report/index.html`).

## Tips Komunikasi Tim
- Share alasan gating: menjaga kualitas, bukan mempersulit.
- Sediakan panduan cepat memperbaiki test.
- Buat script `npm run test:staged` untuk hanya menjalankan test terkait (gunakan `lint-staged` jika perlu).

## Latihan
> Tambahkan Husky hook di proyek Anda: pre-commit menjalankan `npm run test:related` dan pre-push menjalankan `npm run test:coverage`. Uji dengan mencoba commit tanpa menjalankan test.

## Ringkas
Husky + coverage threshold = pagar kualitas sebelum kode mendarat di branch utama. Mulai pelan, komunikasikan, dan tingkatkan standar secara bertahap. EOF
