import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import Providers from "@/components/Providers";
import CartButton from "@/components/CartButton";

export const metadata: Metadata = {
  title: {
    default: "RevoShop",
    template: "%s | RevoShop",
  },
  description: "Milestone e-commerce demo dengan Next.js, NextAuth, dan Zustand",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Providers>
          <header style={{ padding: "1.5rem 0" }}>
            <nav>
              <Link href={"/" as Route} className="badge">
                RevoShop
              </Link>
              <Link href={"/products" as Route}>Products</Link>
              <Link href={"/admin/products" as Route}>Admin</Link>
              <CartButton />
              <Link href={"/api/auth/signin" as Route} style={{ marginLeft: "auto" }}>
                Masuk
              </Link>
            </nav>
          </header>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
