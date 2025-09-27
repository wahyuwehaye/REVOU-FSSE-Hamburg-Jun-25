# Styling the React App Using Tailwind CSS

## Tujuan Pembelajaran
- Memahami konsep utility-first pada Tailwind CSS.
- Mengintegrasikan Tailwind ke proyek Next.js atau React.
- Menerapkan styling cepat dan konsisten.

## Instalasi Tailwind di Next.js (App Router)
1. Pastikan berada di root proyek.
2. Jalankan perintah:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
3. Update `tailwind.config.js`:
   ```js
   module.exports = {
     content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
     theme: { extend: {} },
     plugins: [],
   };
   ```
4. Tambahkan directif Tailwind pada `app/globals.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

## Contoh Penggunaan di Komponen
```jsx
export default function Hero() {
  return (
    <section className="min-h-[50vh] bg-slate-900 text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Build Fast with Tailwind</h1>
      <p className="text-slate-200 max-w-lg text-center">
        Utility classes memudahkan styling tanpa berpindah file dan menjaga konsistensi desain.
      </p>
      <button className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 transition">
        Mulai Sekarang
      </button>
    </section>
  );
}
```

## Tips Styling Efektif
- Gunakan `className` sebagai "lego" untuk merangkai layout.
- Manfaatkan plugin resmi (forms, typography) untuk komponen umum.
- Kombinasikan dengan CSS module jika memerlukan logika kompleks.

## Praktik yang Disarankan
- Buka `examples/next-tailwind` dan jalankan `npm run dev`.
- Modifikasi warna, ukuran font, serta spacing untuk melihat efek instan.
- Coba buat komponen `Card` dengan shadow, border, dan responsive grid.

## Latihan Mandiri
- Implementasikan navbar responsif dengan Tailwind (hamburger di mobile).
- Gunakan variant seperti `hover:`, `md:` untuk latihan breakpoint.

## Rangkuman Singkat
- Tailwind mempercepat styling melalui utility classes yang konsisten.
- Integrasi dengan Next.js membutuhkan konfigurasi content & direktif CSS.
- Latihan membuat komponen kecil membantu menghafal utilitas penting.
