type AnalyticsPageProps = {
  params: {
    team: string;
  };
};

export default function TeamAnalyticsPage({ params }: AnalyticsPageProps) {
  return (
    <main style={{ display: 'grid', gap: '1.5rem' }}>
      <h1>Analytics Tim {params.team}</h1>
      <p>Demo nested route di dalam segmen `(dashboard)` yang bisa digunakan untuk private routing.</p>
    </main>
  );
}
