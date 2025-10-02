import { NextResponse } from 'next/server';
import { fetchProducts } from '@/lib/platzi-client';

export async function GET() {
  try {
    const products = await fetchProducts();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal mengambil produk';
    return NextResponse.json({ message }, { status: 500 });
  }
}
