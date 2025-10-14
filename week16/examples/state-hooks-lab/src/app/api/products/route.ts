import { NextResponse } from "next/server";

const products = [
  {
    id: "p-1",
    name: "Keychron K2",
    price: 1250000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p-2",
    name: "Logitech MX Master 3S",
    price: 1499000,
    image: "https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p-3",
    name: "LG UltraFine 4K",
    price: 8800000,
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p-4",
    name: "Ergonomic Chair",
    price: 2100000,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
  },
];

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 650));
  return NextResponse.json(products);
}
