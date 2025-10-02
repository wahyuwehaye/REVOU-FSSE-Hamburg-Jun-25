import { NextRequest, NextResponse } from 'next/server';
import type { PlatziApiError } from '@/types/platzi';

const USERS_ENDPOINT = 'https://api.escuelajs.co/api/v1/users';

export async function POST(request: NextRequest) {
  const { email } = (await request.json()) as { email?: string };
  if (!email) {
    return NextResponse.json({ message: 'Email wajib diisi' }, { status: 400 });
  }

  try {
    const res = await fetch(`${USERS_ENDPOINT}?offset=0&limit=50`);
    if (!res.ok) {
      const error = (await res.json().catch(() => null)) as PlatziApiError | null;
      throw new Error(error?.message ?? res.statusText);
    }
    const users = (await res.json()) as Array<{ id: number; email: string; name: string }>;
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return NextResponse.json({ message: 'Email tidak ditemukan di FakeAPI' }, { status: 404 });
    }
    const response = NextResponse.json({ ok: true, user }, { status: 200 });
    response.cookies.set('session-token', `user:${user.id}`, { path: '/', httpOnly: true, maxAge: 60 * 60 });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal memeriksa email';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('session-token');
  return response;
}
