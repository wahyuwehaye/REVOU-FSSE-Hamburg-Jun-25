# Understanding JSX/TSX & Curly Braces

## Tujuan Pembelajaran
- Memahami JSX sebagai ekstensi sintaks JavaScript untuk UI.
- Menggunakan kurung kurawal `{}` untuk ekspresi, interpolasi, dan kondisi.
- Mengetahui perbedaan JSX dan TSX ketika menggunakan TypeScript.

## Apa itu JSX?
JSX memungkinkan kita menulis struktur UI mirip HTML langsung di JavaScript. Browser tidak membaca JSX; bundler akan mengompilasinya menjadi `React.createElement()`.

## Aturan Dasar JSX
- Harus mengembalikan satu elemen induk.
- Gunakan `className` bukan `class`.
- Ekspresi JavaScript ditulis di dalam `{}`.

## Contoh JSX Dasar
```jsx
const name = 'Nadia';
const isOnline = true;

function Header() {
  return (
    <header className="flex items-center gap-2">
      <h1>Halo, {name}!</h1>
      {isOnline ? <span className="text-green-500">● Online</span> : null}
    </header>
  );
}
```

## Kurung Kurawal `{}` dalam JSX
- **Interpolasi nilai**: `{name}`
- **Ekspresi**: `{isOnline ? 'Online' : 'Offline'}`
- **Pemetaan array**: `{todos.map(...)}`
- **Menjalankan fungsi**: `{formatDate(date)}`

## TSX Singkat
Saat menggunakan TypeScript, JSX menjadi TSX. Contoh:
```tsx
type BadgeProps = {
  status: 'success' | 'error';
};

const Badge: React.FC<BadgeProps> = ({ status }) => {
  return (
    <span className={`px-2 rounded ${status === 'success' ? 'bg-green-200' : 'bg-red-200'}`}>
      {status.toUpperCase()}
    </span>
  );
};
```
TypeScript membantu memvalidasi props dan mencegah bug saat komponen berkembang.

## Praktik yang Disarankan
- Ganti ekspresi di contoh agar menampilkan waktu saat ini.
- Latih menggunakan array `.map()` untuk merender list.
- Coba tulis komponen TSX sederhana jika memakai TypeScript.

## Latihan Mandiri
- Buat komponen `<PriceTag amount={150000} currency="IDR" />` yang memformat angka dan menambah simbol mata uang.
- Implementasikan render kondisional untuk menampilkan badge diskon ketika `amount` di bawah harga tertentu.

## Rangkuman Singkat
- JSX adalah cara deklaratif menulis UI, dikompilasi menjadi JavaScript biasa.
- `{}` digunakan untuk mengeksekusi ekspresi di dalam markup.
- TSX memperkuat JSX dengan type checking untuk proyek berskala besar.
