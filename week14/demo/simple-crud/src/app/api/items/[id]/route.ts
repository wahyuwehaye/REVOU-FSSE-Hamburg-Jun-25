import { NextRequest, NextResponse } from "next/server";
import { deleteNote, findNote, updateNote } from "@/lib/store";
import type { NotePatch } from "@/types/note";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const patch = (await request.json()) as NotePatch;
        const updated = updateNote(params.id, patch);
        if (!updated) {
            return NextResponse.json({ message: "Tidak ditemukan" }, { status: 404 });
        }
        return NextResponse.json(updated, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Payload tidak valid" }, { status: 400 });
    }
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    const note = findNote(params.id);
    if (!note) {
        return NextResponse.json({ message: "Tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(note, { status: 200 });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const removed = deleteNote(params.id);
    if (!removed) {
        return NextResponse.json({ message: "Tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
}
