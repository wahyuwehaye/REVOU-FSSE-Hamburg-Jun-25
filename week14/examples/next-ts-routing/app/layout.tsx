import './globals.css';

export const metadata = {
  title: 'Type-Safe Routing Demo',
  description: 'Menunjukkan penggunaan params, Link, dan nested routes dengan TypeScript.',
} satisfies import('next').Metadata;

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <body>
        <nav style={{ display: 'flex', gap: '1rem', justifyContent: 'center', padding: '2rem 1.5rem' }}>
          <a href="/">Home</a>
          <a href="/teams">Teams</a>
          <a href="/teams/next-wave">Tim Next Wave</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
