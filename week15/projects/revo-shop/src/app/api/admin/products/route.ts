import { NextResponse } from "next/server";
import { createAdminProduct, listAdminProducts } from "@/lib/admin-store";
import type { AdminProduct } from "@/lib/admin-store";

export async function GET() {
  return NextResponse.json(listAdminProducts(), { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AdminProduct;
    if (!body.id || !body.title) {
      return NextResponse.json({ message: "ID dan title wajib" }, { status: 400 });
    }
    const created = createAdminProduct(body);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Payload tidak valid" }, { status: 400 });
  }
}
