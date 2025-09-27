# Make Simple Reusable Component

## Tujuan Pembelajaran
- Mendesain komponen yang mudah digunakan ulang di berbagai konteks.
- Menerapkan prinsip single responsibility dan props yang fleksibel.
- Menambahkan variasi gaya melalui props atau _slot_ (children).

## Prinsip Reusability
- **Generic**: Hindari logika spesifik halaman di komponen dasar.
- **Composable**: Gunakan `children` untuk konten dinamis.
- **Configurable**: Sediakan props untuk variasi (warna, ukuran, icon).

## Contoh Komponen Reusable
`components/Button.jsx`
```jsx
'use client';
import clsx from 'clsx';

const styles = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...rest
}) {
  const padding = size === 'lg' ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm';
  return (
    <button
      className={clsx('rounded-md font-medium transition', styles[variant], padding, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
```
Penggunaan:
```jsx
<Button onClick={handleSave}>Simpan</Button>
<Button variant="secondary" size="lg">Batal</Button>
```

## Praktik yang Disarankan
- Taruh komponen reusable di folder `components/ui` atau serupa.
- Dokumentasikan props utama agar tim mudah memakai.
- Tambahkan test snapshot atau Storybook untuk menjaga konsistensi.

## Latihan Mandiri
- Buat komponen `Card` yang menerima `title`, `description`, `actions` (React node).
- Buat `InputField` reusable dengan label, helper text, dan error message.

## Rangkuman Singkat
- Komponen reusable menghemat waktu dan menjaga konsistensi UI.
- Sediakan props untuk variasi, gunakan `children` untuk konten dinamis.
- Gunakan utilitas seperti `clsx` untuk mengelola kombinasi class dengan rapi.
