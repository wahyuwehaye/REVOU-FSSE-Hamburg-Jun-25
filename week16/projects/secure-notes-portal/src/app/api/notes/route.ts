import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const NoteInputSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Isi minimal 10 karakter"),
});

let notes = [
  {
    id: "note-1",
    title: "Kick-off meeting",
    content: "Susun agenda mingguan dan tentukan PIC untuk setiap milestone.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: { email: "admin@revonotes.dev" },
  },
];

export async function GET() {
  return NextResponse.json(notes);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Tidak terautentikasi" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = NoteInputSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Input tidak valid" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const note = {
    id: crypto.randomUUID(),
    ...parsed.data,
    createdAt: now,
    updatedAt: now,
    author: { email: session.user?.email ?? "anonymous" },
  };

  notes = [note, ...notes];
  return NextResponse.json(note, { status: 201 });
}
