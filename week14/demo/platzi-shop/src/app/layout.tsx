import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";

export const metadata: Metadata = {
  title: {
    default: "Platzi Shop Demo",
    template: "%s | Platzi Shop Demo",
  },
  description: "Demo Next.js + TypeScript memanfaatkan FakeAPI Platzi untuk Week 14.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <body>
        <header style={{ padding: "1.5rem 1.5rem 0" }}>
          <nav className="nav">
            <Link href={"/" as Route} className="badge">Home</Link>
            <Link href={"/products" as Route}>Products</Link>
            <Link href={"/dashboard/orders" as Route}>Orders</Link>
            <Link href={"/dashboard/users/new" as Route}>Create User</Link>
            <Link href={"/logout" as Route} className="button secondary">Logout</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
