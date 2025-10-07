import { NextResponse } from "next/server";
import { deleteAdminProduct, updateAdminProduct } from "@/lib/admin-store";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
  }
  try {
    const payload = await request.json();
    const updated = updateAdminProduct(id, payload);
    if (!updated) {
      return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Payload tidak valid" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
  }
  const success = deleteAdminProduct(id);
  if (!success) {
    return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}
