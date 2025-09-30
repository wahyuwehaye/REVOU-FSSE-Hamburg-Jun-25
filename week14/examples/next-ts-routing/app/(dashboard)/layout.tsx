import { redirect } from 'next/navigation';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

async function isAuthenticated(): Promise<boolean> {
  // Simulasi: di dunia nyata, cek session atau token.
  return true;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const auth = await isAuthenticated();
  if (!auth) redirect('/login');
  return <section style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '2rem', borderRadius: '1.5rem' }}>{children}</section>;
}
