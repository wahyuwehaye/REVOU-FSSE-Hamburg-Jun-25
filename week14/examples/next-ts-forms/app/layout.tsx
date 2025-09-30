import './globals.css';

export const metadata = {
  title: 'TypeScript Forms Demo',
  description: 'React Hook Form + Zod + Next.js API typed.',
} satisfies import('next').Metadata;

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <body>
        <header style={{ textAlign: 'center', padding: '2.5rem 1.5rem 1rem' }}>
          <h1 style={{ margin: 0, fontSize: '2.25rem' }}>Type-Safe Forms</h1>
          <p style={{ marginTop: '0.75rem', color: '#475569' }}>
            Demo penggunaan React Hook Form, Zod, dan API typenya.
          </p>
        </header>
        {children}
        <footer style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>© 2024 Week 14</footer>
      </body>
    </html>
  );
}
