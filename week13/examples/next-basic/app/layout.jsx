import './globals.css';

export const metadata = {
  title: 'Next.js Basic Demo',
  description: 'Contoh Next.js untuk sesi React & Next.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <header style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h1 style={{ margin: 0 }}>Next.js Basic Example</h1>
          <p style={{ margin: '0.75rem 0 0', color: '#475569' }}>
            Demo fitur routing, server component, dan client component.
          </p>
        </header>
        {children}
        <footer style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
          © 2024 Next.js Class
        </footer>
      </body>
    </html>
  );
}
