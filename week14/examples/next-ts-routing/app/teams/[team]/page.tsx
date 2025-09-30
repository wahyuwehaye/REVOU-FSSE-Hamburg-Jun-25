import Link from 'next/link';
import { notFound } from 'next/navigation';
import { routes } from '../../routes';
import type { Team } from '../page';

const teamDetail: Record<Team['slug'], Team & { description: string }> = {
  'next-wave': {
    slug: 'next-wave',
    name: 'Next Wave',
    focus: 'Migrasi Next.js + TS',
    description: 'Menangani konversi project lama ke Next.js 13 dengan TypeScript strict mode.',
  },
  'data-force': {
    slug: 'data-force',
    name: 'Data Force',
    focus: 'Dashboard data realtime',
    description: 'Membangun pipeline data dengan typed API dan chart real-time.',
  },
  'design-lab': {
    slug: 'design-lab',
    name: 'Design Lab',
    focus: 'Komponen desain system',
    description: 'Mengembangkan Storybook dan komponen UI dengan TypeScript generics.',
  },
};

type PageProps = {
  params: {
    team: Team['slug'];
  };
  searchParams: {
    view?: 'overview' | 'members';
  };
};

export function generateStaticParams(): Array<PageProps['params']> {
  return Object.keys(teamDetail).map((team) => ({ team: team as Team['slug'] }));
}

export default function TeamDetailPage({ params, searchParams }: PageProps) {
  const data = teamDetail[params.team];
  if (!data) return notFound();

  const view = searchParams.view ?? 'overview';

  return (
    <main style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h1>{data.name}</h1>
        <p>{data.description}</p>
      </header>
      <nav style={{ display: 'flex', gap: '1rem' }}>
        <Link href={routes.teamDetail(data.slug)}>Overview</Link>
        <Link href={{ pathname: routes.teamDetail(data.slug), query: { view: 'members' } }}>Anggota</Link>
        <Link href={routes.teamAnalytics(data.slug)}>Analytics</Link>
      </nav>
      <section>
        {view === 'overview' ? (
          <p>Fokus tim: {data.focus}</p>
        ) : (
          <ul>
            <li>{data.name} Member 1</li>
            <li>{data.name} Member 2</li>
          </ul>
        )}
      </section>
    </main>
  );
}
