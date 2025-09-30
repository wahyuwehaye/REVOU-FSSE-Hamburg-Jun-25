import { NextResponse } from 'next/server';
import { z } from 'zod';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  topic: 'partnership' | 'mentoring' | 'general';
  message: string;
};

const messages: ContactMessage[] = [];

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  topic: z.enum(['partnership', 'mentoring', 'general']),
  message: z.string().min(20),
});

type ContactPayload = z.infer<typeof schema>;

export async function GET() {
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = schema.parse(json) as ContactPayload;
    const entry: ContactMessage = {
      id: crypto.randomUUID(),
      ...payload,
    };
    messages.unshift(entry);
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 422 });
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
