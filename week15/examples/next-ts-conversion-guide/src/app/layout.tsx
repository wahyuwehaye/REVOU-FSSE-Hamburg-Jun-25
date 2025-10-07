import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conversion Guide",
  description: "Template migrasi Next.js dari JSX ke TypeScript.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
