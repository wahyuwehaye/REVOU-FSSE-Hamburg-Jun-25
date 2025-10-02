import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Todo TS Next",
  description: "Demo Next.js + TypeScript + RHF + CRUD",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="mx-auto max-w-2xl p-4">
        <Navbar />
        <main className="mt-6">{children}</main>
      </body>
    </html>
  );
}
