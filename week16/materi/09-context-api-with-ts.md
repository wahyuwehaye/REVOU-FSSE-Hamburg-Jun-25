# Context API dengan TypeScript

## Tujuan
Context API menghindari prop drilling dengan menyediakan store global berbasis React. Dengan TypeScript, kita dapat mengetik value dan action dari context secara aman.

## Langkah Implementasi
1. Tentukan bentuk state dan action.
2. Buat context dengan tipe default.
3. Bungkus aplikasi dengan provider.
4. Buat custom hook `useXxxContext()` agar konsumsi context lebih rapi.

## Contoh: Theme Context
```ts
// src/context/ThemeContext.tsx
"use client";
import { createContext, useContext, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme harus dipakai di dalam ThemeProvider");
  }
  return context;
}
```

## Pemakaian di Layout
```tsx
// src/app/layout.tsx
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

## Tips
- Selalu buat custom hook untuk konsumsi context (menghindari `undefined`).
- Gunakan `useMemo` untuk mencegah re-render tidak perlu.
- Untuk state kompleks, gunakan `useReducer` di dalam provider.

## Latihan
> Buat `UserContext` yang menyimpan `user` dan `logout()`. Tampilkan email user di navbar dan tombol logout yang memanggil `logout`.

## Ringkas
Context API + TypeScript = kontrol penuh atas tipe state dan action. Pastikan provider membungkus komponen yang membutuhkan context. EOF
