'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      await fetch('/api/session', { method: 'DELETE' });
      router.replace('/');
    };
    run();
  }, [router]);

  return <p className='text-gray-600'>Menghapus sesi...</p>;
}
