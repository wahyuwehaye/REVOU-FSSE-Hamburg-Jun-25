# CRUD Operations with API (TypeScript)

## Tujuan Pembelajaran
- Membuat API Route Next.js dengan TypeScript.
- Mengonsumsi API secara type-safe dari client component.
- Mengelola status loading, error, dan optimistic update.

## API Route Typed
```tsx
// app/api/notes/route.ts
import { NextResponse } from 'next/server';

type Note = {
  id: string;
  title: string;
  body: string;
};

let notes: Note[] = [];

export async function GET() {
  return NextResponse.json<Note[]>(notes);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Pick<Note, 'title' | 'body'>;
  const note: Note = { id: crypto.randomUUID(), ...payload };
  notes = [note, ...notes];
  return NextResponse.json(note, { status: 201 });
}

export async function PUT(request: Request) {
  const payload = (await request.json()) as Note;
  notes = notes.map((item) => (item.id === payload.id ? payload : item));
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  notes = notes.filter((note) => note.id !== id);
  return NextResponse.json({ success: true });
}
```

## Client Component
```tsx
'use client';
import { useEffect, useState } from 'react';

type Note = {
  id: string;
  title: string;
  body: string;
};

type Status = 'idle' | 'loading' | 'error';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    async function load() {
      try {
        setStatus('loading');
        const res = await fetch('/api/notes');
        if (!res.ok) throw new Error('Failed');
        const data: Note[] = await res.json();
        setNotes(data);
        setStatus('idle');
      } catch (error) {
        setStatus('error');
      }
    }
    load();
  }, []);

  // Handler create/update/delete typed serupa
}
```

## Tips
- Gunakan type alias bersama antara API dan client untuk konsistensi.
- Pertimbangkan `zod` atau validator lain memeriksa payload pada API.
- Simpan error dalam type union (`{ type: 'NETWORK' }` dll) untuk feedback user.

## Latihan Mandiri
- Implementasikan optimistic update menggunakan state `setNotes` terlebih dahulu.
- Tambahkan validasi Zod pada API agar payload wajib berisi `title` minimal 3 karakter.

## Rangkuman Singkat
- TypeScript di API route memastikan kontrak data konsisten antara server dan client.
- Gunakan type alias bersama dan validator runtime untuk keamanan ekstra.
- Kelola state loading/error dengan union type agar UI mudah dipelihara.
