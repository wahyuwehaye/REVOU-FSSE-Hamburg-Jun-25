import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo App dengan Testing",
  description: "Todo app Next.js dengan cakupan testing menyeluruh",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
