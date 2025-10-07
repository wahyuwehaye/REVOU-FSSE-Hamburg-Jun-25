import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";

export const metadata: Metadata = {
  title: {
    default: "Data Safety Demo",
    template: "%s | Data Safety Demo",
  },
  description: "Contoh fetch API bertipe dengan Zod di Next.js.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <body>
        <header>
          <nav className="nav">
            <Link href={"/" as Route}>Home</Link>
            <Link href={"/products" as Route}>Products</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
