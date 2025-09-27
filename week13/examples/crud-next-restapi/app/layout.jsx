import './globals.css';

export const metadata = {
  title: 'Next.js CRUD REST API Demo',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <header style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <h1 style={{ margin: 0 }}>CRUD Todo dengan Next.js API Routes</h1>
          <p style={{ color: '#475569', marginTop: '0.75rem' }}>
            Demo untuk materi fetching data, useEffect, dan integrasi REST API.
          </p>
        </header>
        {children}
      </body>
    </html>
  );
}
