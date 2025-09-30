import Link from 'next/link';

const teams = [
  { slug: 'next-wave', name: 'Next Wave', description: 'Tim fokus pada migrasi Next.js.' },
  { slug: 'data-force', name: 'Data Force', description: 'Tim analytics & data pipeline.' },
  { slug: 'design-lab', name: 'Design Lab', description: 'Tim UI/UX playground.' },
] as const;

type Team = (typeof teams)[number];

export default function HomePage() {
  return (
    <main style={{ display: 'grid', gap: '2rem' }}>
      <header>
        <h1>Type-Safe Routing</h1>
        <p>Gunakan contoh ini untuk menjelaskan dynamic params, `generateStaticParams`, dan nested layout.</p>
      </header>
      <section style={{ display: 'grid', gap: '1rem' }}>
        {teams.map((team) => (
          <article key={team.slug} style={{ padding: '1.5rem', borderRadius: '1.5rem', background: 'rgba(15, 23, 42, 0.6)' }}>
            <h3 style={{ marginTop: 0 }}>
              <Link href={`/teams/${team.slug}`}>{team.name}</Link>
            </h3>
            <p style={{ marginBottom: 0 }}>{team.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
