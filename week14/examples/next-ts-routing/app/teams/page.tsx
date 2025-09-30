import Link from 'next/link';
import { routes } from '../routes';

const teams = [
  { slug: 'next-wave', name: 'Next Wave', focus: 'Migrasi Next.js + TS' },
  { slug: 'data-force', name: 'Data Force', focus: 'Dashboard data realtime' },
  { slug: 'design-lab', name: 'Design Lab', focus: 'Komponen desain system' },
] as const;

export type Team = (typeof teams)[number];

export default function TeamsPage() {
  return (
    <main style={{ display: 'grid', gap: '1.5rem' }}>
      <h2>Daftar Tim</h2>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
        {teams.map((team) => (
          <li key={team.slug} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem 1.5rem', borderRadius: '1.5rem' }}>
            <Link href={routes.teamDetail(team.slug)}>{team.name}</Link>
            <p style={{ margin: '0.5rem 0 0' }}>{team.focus}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
