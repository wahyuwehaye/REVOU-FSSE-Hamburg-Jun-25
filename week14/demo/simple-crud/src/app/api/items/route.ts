import { NextRequest, NextResponse } from "next/server";
import { createNote, listNotes } from "@/lib/store";
import type { NoteInput } from "@/types/note";

export async function GET() {
    return NextResponse.json(listNotes(), { status: 200 });
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as NoteInput;
        if (!body.title || !body.title.trim()) {
            return NextResponse.json({ message: "Judul wajib diisi" }, { status: 400 });
        }
        const note = createNote(body);
        return NextResponse.json(note, { status: 201 });
    } catch {
        return NextResponse.json({ message: "Payload tidak valid" }, { status: 400 });
    }
}
