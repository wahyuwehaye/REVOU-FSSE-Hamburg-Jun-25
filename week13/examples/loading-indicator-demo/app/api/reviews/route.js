const REVIEWS = [
  { id: 'r1', author: 'Dira', message: 'Spinnernya sangat membantu untuk form yang lambat.' },
  { id: 'r2', author: 'Farhan', message: 'Skeleton bikin user nggak panik saat data masih dimuat.' },
  { id: 'r3', author: 'Luna', message: 'Overlay cocok buat aksi simpan massal yang agak lama.' },
];

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 1800));
  return Response.json(REVIEWS);
}
