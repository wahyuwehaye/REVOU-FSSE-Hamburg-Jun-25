import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Auth Middleware Sandbox",
  description: "Contoh middleware + NextAuth dengan App Router",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
