# 13 - Testing Checklist & Error Handling Scenarios

Gunakan checklist ini sebelum mengatakan "testing sudah beres".

## Unit Test Checklist
- [ ] Semua utilitas utama punya test (happy path, edge case, error).
- [ ] Komponen UI kritis memiliki test rendering + props.
- [ ] Hook custom diuji (state perubahan, side effect).
- [ ] Coverage minimal sesuai threshold.

## Event & Form Checklist
- [ ] Klik, input, submit diuji dengan userEvent.
- [ ] Validasi error messages muncul sesuai kondisi.
- [ ] Tombol disabled saat proses async.
- [ ] Reset/clear state diuji.

## Async & API Checklist
- [ ] Loading, success, error state diuji.
- [ ] Mock API (MSW atau jest.mock) men-cover 200 & 500.
- [ ] `getServerSideProps` / `getStaticProps` diuji (props, redirect, notFound).
- [ ] Server Action diuji dengan mock database.

## Coverage & Quality Gate
- [ ] `branches`, `lines`, `functions` memenuhi target.
- [ ] File sensitif (utils, hooks) tidak di-ignore.
- [ ] Husky/CI memastikan test jalan sebelum merge.

## Error Handling Scenarios
- API timeout / network error.
- Form validation gagal.
- Empty state (data kosong).
- Unauthorized access (401/403).
- Fallback UI (error boundary).

Tambahkan test untuk setiap skenario di atas jika fitur Anda menyentuhnya.

## Dokumentasi
- Sertakan perintah menjalankan test di README.
- Simpan laporan coverage (HTML) sebagai artifact atau lampiran PR.
- Tambahkan komentar ringkas di PR tentang apa yang sudah di-test.

## Ringkas
Checklist membantu memastikan tidak ada area penting terlewat. Gunakan sebagai review pribadi maupun tim sebelum release. EOF
