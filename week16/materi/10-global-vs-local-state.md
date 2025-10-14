# Global vs Local State

## Pertanyaan Kunci
1. **Siapa yang butuh state ini?**
   - Hanya satu komponen → local.
   - Banyak komponen tidak berhubungan → global.
2. **Seberapa sering state berubah?**
   - Sangat sering → pertimbangkan local agar re-render tidak menyebar.
3. **Apakah state perlu disimpan/persisten?**
   - Ya → global atau server state dengan caching.

## Contoh Studi Kasus
| Fitur | Rekomendasi |
| --- | --- |
| Toggle modal untuk komponen tertentu | Local state (`useState`) |
| Keranjang belanja | Global (Context/Zustand) |
| Filter pencarian di halaman | Local, jika hanya dipakai di halaman itu |
| Data profile user (nama, role) | Global (karena digunakan di navbar, sidebar, dsb) |

## Pattern Hybrid
- Gabungkan: Local state untuk input form, global state untuk ringkasan order.
- Gunakan custom hook untuk membungkus share logic (mis. `useFilters`).

## Practice Prompt
> Beri list fitur (dark mode, pagination, snackbar, user profile). Suruh student menentukan local/global + alasannya.

## Ringkas
Tidak ada solusi tunggal. Evaluasi audience state, frekuensi update, dan kebutuhan share. Gunakan global state secukupnya agar aplikasi tetap ringan. EOF
