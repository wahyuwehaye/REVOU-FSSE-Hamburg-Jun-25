const PRODUCTS = [
  { id: 'p1', name: 'Starter Design Kit', price: '99K', category: 'UI Kit' },
  { id: 'p2', name: 'Tailwind Components', price: '149K', category: 'Component' },
  { id: 'p3', name: 'Next.js Boilerplate', price: '0', category: 'Template' },
  { id: 'p4', name: 'Pro Analytics Dashboard', price: '299K', category: 'Template' },
];

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return Response.json(PRODUCTS);
}
