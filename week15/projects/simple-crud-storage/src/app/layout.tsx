import "./globals.css";
import type { Metadata } from "next";
import { getThemeFlag } from "@/lib/server-flags";

export const metadata: Metadata = {
  title: "Simple CRUD Storage Demo",
  description: "Catatan sederhana dengan localStorage, cookie theme, dan cache",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const theme = getThemeFlag();
  return (
    <html lang="id" data-theme={theme}>
      <body>
        <main className="app-container">{children}</main>
      </body>
    </html>
  );
}
