import type { Note, NoteInput, NotePatch } from "@/types/note";

const globalStore = globalThis as typeof globalThis & { __NOTES__?: Note[] };

if (!globalStore.__NOTES__) {
    globalStore.__NOTES__ = [];
}

function getStore(): Note[] {
    return globalStore.__NOTES__!;
}

export function listNotes(): Note[] {
    return [...getStore()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createNote(input: NoteInput): Note {
    const note: Note = {
        id: crypto.randomUUID(),
        title: input.title.trim(),
        content: input.content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    getStore().unshift(note);
    return note;
}

export function updateNote(id: string, patch: NotePatch): Note | undefined {
    const store = getStore();
    const index = store.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    const current = store[index];
    const updated: Note = {
        ...current,
        ...patch,
        title: (patch.title ?? current.title).trim(),
        content: (patch.content ?? current.content).trim(),
        updatedAt: new Date().toISOString(),
    };
    store[index] = updated;
    return updated;
}

export function deleteNote(id: string): boolean {
    const store = getStore();
    const index = store.findIndex((item) => item.id === id);
    if (index === -1) return false;
    store.splice(index, 1);
    return true;
}

export function findNote(id: string): Note | undefined {
    return getStore().find((item) => item.id === id);
}
