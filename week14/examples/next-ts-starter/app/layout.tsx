import './globals.css';

export const metadata = {
  title: 'Next.js + TypeScript Starter',
  description: 'Contoh dasar Next.js 13 App Router dengan TypeScript.',
} satisfies import('next').Metadata;

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <body>
        <header style={{ textAlign: 'center', padding: '2.5rem 1.5rem 1rem' }}>
          <h1 style={{ margin: 0, fontSize: '2.25rem' }}>Next.js TypeScript Starter</h1>
          <p style={{ marginTop: '0.75rem', color: '#475569' }}>
            Gunakan proyek ini untuk mendemonstrasikan setup TypeScript, props typed, dan metadata.
          </p>
        </header>
        {children}
        <footer style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>© 2024 TS Week 14</footer>
      </body>
    </html>
  );
}
