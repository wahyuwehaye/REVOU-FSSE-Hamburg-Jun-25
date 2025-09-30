# Working with Images in Next.js

## Tujuan Pembelajaran
- Memanfaatkan komponen `next/image` dengan TypeScript.
- Mengelola static import image dan remote loader.
- Mengatur tipografi `ImageProps` agar lebih aman.

## Penggunaan Dasar
```tsx
import Image from 'next/image';
import heroIllustration from '@/assets/hero.png';

type HeroImageProps = {
  alt: string;
  priority?: boolean;
};

export function HeroImage({ alt, priority = false }: HeroImageProps) {
  return (
    <Image
      src={heroIllustration}
      alt={alt}
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
      className="rounded-3xl"
    />
  );
}
```
Static import otomatis memberi tipe `StaticImageData`.

## Remote Image Loader
Tambahkan domain di `next.config.js`:
```js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};
```

Gunakan di komponen:
```tsx
import Image, { ImageProps } from 'next/image';

type AvatarProps = Omit<ImageProps, 'src' | 'alt'> & {
  src: string;
  alt?: string;
};

export function Avatar({ src, alt = 'User avatar', ...rest }: AvatarProps) {
  return <Image src={src} alt={alt} width={48} height={48} {...rest} />;
}
```

## Latihan Mandiri
- Buat komponen `ResponsiveImage` yang menerima `aspectRatio` dan menghitung ukuran otomatis.
- Tambahkan fallback `blurDataURL` untuk pengalaman loading lebih baik.

## Rangkuman Singkat
- `next/image` menyediakan tipe spesifik; manfaatkan `ImageProps` untuk menurunkan ke komponen custom.
- Konfigurasikan domain remote agar penggunaan aman & sesuai TypeScript.
- Sediakan default alt text/fallback untuk memastikan aksesibilitas.
