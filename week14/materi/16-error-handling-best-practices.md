# Error Handling and Best Practices

## Tujuan Pembelajaran
- Menangani error pada client dan server secara type-safe.
- Menggunakan custom error type atau `Result` pattern.
- Menyusun strategi logging dan fallback UI.

## Server-Side Error Handling
```tsx
// app/api/notes/route.ts
class AppError extends Error {
  constructor(message: string, public status: number = 500) {
    super(message);
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { title?: string };
    if (!payload.title) {
      throw new AppError('Title is required', 400);
    }
    // ...
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
```

## Client-Side Pattern
```tsx
type AsyncState<T> = {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: T | null;
  error: string | null;
};

function useAsync<T>(asyncFn: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle', data: null, error: null });

  async function run() {
    setState({ status: 'loading', data: null, error: null });
    try {
      const result = await asyncFn();
      setState({ status: 'success', data: result, error: null });
    } catch (error) {
      setState({ status: 'error', data: null, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  return { ...state, run };
}
```

## Fallback UI
- Gunakan `error.tsx` di App Router untuk menangani error pada tree tertentu.
- Tambahkan `reset` function untuk mencoba ulang.
```tsx
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Terjadi kesalahan</h2>
      <pre>{error.message}</pre>
      <button onClick={reset}>Coba lagi</button>
    </div>
  );
}
```

## Best Practice Ringkas
- Gunakan type union untuk status asynchronous.
- Log error dengan context (user id, payload) di server (Sentry, Logtail, dsb.).
- Tampilkan pesan ramah pengguna + opsi retry.
- Jangan expose detail sensitif di response error client.

## Latihan Mandiri
- Implementasikan `Result<T, E>` pattern (success/error) untuk API client.
- Tambahkan logging eksternal (misal Sentry) dan ketik event payload-nya.

## Rangkuman Singkat
- Error handling type-safe membantu aplikasi pulih gracefully dan mempermudah debugging.
- Gunakan custom error class atau union type untuk membedakan error yang dapat dipulihkan.
- Sediakan fallback UI dan logging terstruktur untuk pengalaman pengguna dan developer yang lebih baik.
