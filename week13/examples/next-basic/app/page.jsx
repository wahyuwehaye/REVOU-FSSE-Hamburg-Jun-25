import FeatureCard from './components/FeatureCard.jsx';
import Counter from './components/Counter.jsx';
import ServerClock from './components/ServerClock.jsx';

const features = [
  {
    id: 'routing',
    title: 'Routing otomatis',
    description: 'Buat file di folder app/ dan Next akan membuat halaman sesuai struktur folder.',
  },
  {
    id: 'rendering',
    title: 'Rendering fleksibel',
    description: 'Pilih antara Static, Server, atau Client Components sesuai kebutuhan fitur.',
    highlight: true,
  },
  {
    id: 'api',
    title: 'API routes built-in',
    description: 'Bangun endpoint backend langsung di proyek yang sama menggunakan app/api/.',
  },
];

export default async function HomePage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await res.json();

  return (
    <main>
      <section style={{ display: 'grid', gap: '2rem' }}>
        <div>
          <h2>Mengapa Next.js menarik?</h2>
          <p style={{ color: '#475569', lineHeight: 1.7 }}>
            Next.js menambahkan struktur dan tooling di atas React. Demo ini memperlihatkan percampuran Server & Client
            Components, serta data fetching di server secara langsung.
          </p>
          <ServerClock />
        </div>
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {features.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </div>
      </section>

      <section>
        <h2>Client Component Counter</h2>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          Contoh di bawah ini menggunakan `'use client'` karena memerlukan state dan event handler.
        </p>
        <Counter />
      </section>

      <section>
        <h2>Data pengguna (di-fetch di server)</h2>
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
          {users.slice(0, 4).map((user) => (
            <li key={user.id} style={{ background: 'white', borderRadius: '1rem', padding: '1.25rem' }}>
              <strong>{user.name}</strong>
              <p style={{ margin: '0.4rem 0 0', color: '#64748b' }}>{user.email}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
