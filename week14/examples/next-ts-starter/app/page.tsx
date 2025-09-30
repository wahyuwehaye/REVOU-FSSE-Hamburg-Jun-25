import { StatsCard, type Stats } from './components/StatsCard';
import { FocusList } from './components/FocusList';

async function fetchStats(): Promise<Stats[]> {
  return [
    { label: 'Peserta Aktif', value: 128, unit: 'orang', trend: 'up' },
    { label: 'Jam Belajar', value: 432, unit: 'jam', trend: 'flat' },
    { label: 'Project Selesai', value: 34, trend: 'down' },
  ];
}

export default async function HomePage() {
  const stats = await fetchStats();
  const focus = [
    {
      title: 'Migrasi TypeScript Modul Auth',
      description: 'Prioritaskan migrasi kode autentikasi agar bug login cepat terdeteksi.',
      priority: 'high' as const,
    },
    {
      title: 'Refactor API Layer',
      description: 'Tambahkan type shared untuk response API agar front-end sinkron.',
      priority: 'medium' as const,
    },
    {
      title: 'Dokumentasi Komponen UI',
      description: 'Perbarui Storybook dengan tipe props terbaru.',
      priority: 'low' as const,
    },
  ];

  return (
    <main>
      <section style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {stats.map((stat) => (
          <StatsCard key={stat.label} stat={stat} />
        ))}
      </section>

      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Fokus Minggu Ini</h2>
        <FocusList items={focus} />
      </section>
    </main>
  );
}
