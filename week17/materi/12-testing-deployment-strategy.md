# 12 - Testing & Deployment Strategy di Next.js

## Tujuan
Menyambungkan hasil testing ke pipeline deployment agar aplikasi yang rilis sudah terjamin kualitasnya.

## Workflow Ideal
1. **Local** – Developer menjalankan `npm test`, `npm run test:coverage` sebelum commit.
2. **Git Hooks** – Husky menolak commit/push jika test gagal.
3. **CI Pipeline** – GitHub Actions / GitLab CI menjalankan lint, test, coverage.
4. **Preview Deployment** – Vercel/Netlify membuat preview URL jika test lulus.
5. **Production Deployment** – Branch utama/production otomatis deploy setelah CI hijau.

## Contoh GitHub Actions
`.github/workflows/ci.yml`
```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm install
      - run: npm run lint
      - run: npm test -- --runInBand
      - run: npm run test:coverage
```

## Integrasi dengan Vercel
- Aktifkan “Require GitHub Checks” di Vercel → deploy hanya jika CI lulus.
- Gunakan environment variables `NEXT_PUBLIC_APP_ENV` untuk membedakan config preview vs production.
- Tambahkan summary test di PR (gunakan `jest-junit` + GitHub summary).

## Deployment Checklist
- [ ] Tests pass (unit, integration) di local & CI.
- [ ] Coverage memenuhi threshold.
- [ ] Preview URL dicek manual oleh QA/TL.
- [ ] Monitoring/logging siap (Sentry, Logtail).
- [ ] Rencana rollback (redeploy commit sebelumnya).

## Latihan
> Buat workflow GitHub Actions yang menjalankan `npm run test:coverage` dan upload HTML report sebagai artifact.

## Ringkas
Testing tanpa pipeline = tidak konsisten. Hubungkan lint + test ke Git hooks, CI, dan platform deployment agar setiap release terverifikasi. EOF
