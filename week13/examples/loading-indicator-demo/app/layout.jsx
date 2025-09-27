import './globals.css';

export const metadata = {
  title: 'Loading Indicator Demo',
  description: 'Contoh spinner, skeleton, dan overlay di Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <header style={{ padding: '2.5rem 1.5rem 1rem', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '2.25rem' }}>Loading Indicator Demo</h1>
          <p style={{ margin: '0.75rem auto 0', maxWidth: '640px', color: '#475569' }}>
            Gunakan proyek ini untuk mendemonstrasikan tiga pola loading: spinner singkat, skeleton konten, dan overlay
            saat menjalankan aksi asynchronous yang lebih lama.
          </p>
        </header>
        {children}
      </body>
    </html>
  );
}
