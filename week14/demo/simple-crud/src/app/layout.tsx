import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Simple Notes CRUD",
    description: "Demo CRUD sederhana dengan Next.js App Router + TypeScript.",
};

type RootLayoutProps = {
    children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="id">
            <body>
                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}
