import type { Note, NoteDraft } from "@/types/note";

const STORAGE_KEY = "revo-simple-crud-notes";

type Diagnostics = {
  hasCache: boolean;
  cacheHits: number;
  cacheMisses: number;
  lastStorageSync: number;
  lastMutation: number;
  notesInCache: number;
};

let cachedNotes: Note[] | null = null;
let cacheHits = 0;
let cacheMisses = 0;
let lastStorageSync = 0;
let lastMutation = 0;

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clone(note: Note): Note {
  return { ...note };
}

function cloneList(notes: Note[]): Note[] {
  return notes.map(clone);
}

function sortNotesDescending(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function getNotesFromLocalStorage(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistNotes(notes: Note[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function updateCache(notes: Note[], markMutation: boolean) {
  cachedNotes = cloneList(notes);
  if (markMutation) {
    lastMutation = Date.now();
  }
}

function getWorkingCopy(): Note[] {
  if (cachedNotes) {
    return cloneList(cachedNotes);
  }
  const fromStorage = sortNotesDescending(getNotesFromLocalStorage());
  updateCache(fromStorage, false);
  return cloneList(cachedNotes ?? []);
}

export function listNotes(options?: { fresh?: boolean }): Note[] {
  if (!options?.fresh && cachedNotes) {
    cacheHits += 1;
    return cloneList(cachedNotes);
  }
  const fromStorage = sortNotesDescending(getNotesFromLocalStorage());
  cacheMisses += 1;
  lastStorageSync = Date.now();
  updateCache(fromStorage, false);
  return cloneList(cachedNotes ?? []);
}

export function createNote(draft: NoteDraft): Note {
  const baseline = getWorkingCopy();
  const now = new Date().toISOString();
  const note: Note = {
    id: createId(),
    title: draft.title.trim(),
    content: draft.content.trim(),
    createdAt: now,
    updatedAt: now,
  };
  const next = sortNotesDescending([note, ...baseline]);
  persistNotes(next);
  updateCache(next, true);
  return note;
}

export function updateNote(id: string, draft: NoteDraft): Note | null {
  const baseline = getWorkingCopy();
  const index = baseline.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const now = new Date().toISOString();
  const updated: Note = {
    ...baseline[index],
    title: draft.title.trim(),
    content: draft.content.trim(),
    updatedAt: now,
  };
  baseline[index] = updated;
  const next = sortNotesDescending(baseline);
  persistNotes(next);
  updateCache(next, true);
  return updated;
}

export function deleteNote(id: string): boolean {
  const baseline = getWorkingCopy();
  const next = baseline.filter((item) => item.id !== id);
  if (next.length === baseline.length) return false;
  const sorted = sortNotesDescending(next);
  persistNotes(sorted);
  updateCache(sorted, true);
  return true;
}

export function clearNotes() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  cachedNotes = [];
  lastStorageSync = Date.now();
  lastMutation = Date.now();
}

export function getNotesDiagnostics(): Diagnostics {
  return {
    hasCache: cachedNotes !== null,
    cacheHits,
    cacheMisses,
    lastStorageSync,
    lastMutation,
    notesInCache: cachedNotes?.length ?? 0,
  };
}
