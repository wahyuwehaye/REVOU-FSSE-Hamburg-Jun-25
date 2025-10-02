import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get('session-token')?.value;
  if (!token) {
    redirect('/login?next=/dashboard/orders');
  }
  return <section className='card'>{children}</section>;
}
