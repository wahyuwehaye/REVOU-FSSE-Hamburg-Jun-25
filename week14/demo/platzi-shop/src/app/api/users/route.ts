import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/platzi-client';
import type { NewUserInput } from '@/types/platzi';

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as NewUserInput;
    const result = await createUser(payload);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal membuat user';
    return NextResponse.json({ message }, { status: 500 });
  }
}
