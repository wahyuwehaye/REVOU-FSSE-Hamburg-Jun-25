"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  clearNotes,
  createNote,
  deleteNote,
  getNotesDiagnostics,
  listNotes,
  updateNote,
} from "@/lib/note-store";
import type { Note, NoteDraft } from "@/types/note";

const emptyDraft: NoteDraft = { title: "", content: "" };

const diagnosticsTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const noteTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

type Theme = "light" | "dark";

type Diagnostics = ReturnType<typeof getNotesDiagnostics>;

type NotesAppProps = {
  initialTheme: Theme;
};

export function NotesApp({ initialTheme }: NotesAppProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState<NoteDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<Diagnostics>(() => getNotesDiagnostics());

  const isEditing = Boolean(editingId);

  const noteCharacters = useMemo(
    () =>
      notes.reduce((total, note) => total + note.title.length + note.content.length, 0),
    [notes],
  );

  const loadNotes = useCallback(
    (mode: "cache" | "storage" = "cache") => {
      setLoading(true);
      const data = listNotes(mode === "storage" ? { fresh: true } : undefined);
      setNotes(data);
      setDiagnostics(getNotesDiagnostics());
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    loadNotes("storage");
  }, [loadNotes]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [message]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = draft.title.trim();
    const trimmedContent = draft.content.trim();
    if (!trimmedTitle) {
      setMessage("Judul wajib diisi.");
      return;
    }
    if (!trimmedContent) {
      setMessage("Isi catatan tidak boleh kosong.");
      return;
    }

    if (editingId) {
      const updated = updateNote(editingId, { title: trimmedTitle, content: trimmedContent });
      if (!updated) {
        setMessage("Catatan tidak ditemukan. Sinkronisasi ulang daftar.");
        loadNotes("storage");
        return;
      }
      setNotes((prev) => sortNotes(prev.map((note) => (note.id === editingId ? updated : note))));
      setMessage("Catatan diperbarui dan cache disegarkan.");
    } else {
      const created = createNote({ title: trimmedTitle, content: trimmedContent });
      setNotes((prev) => sortNotes([created, ...prev]));
      setMessage("Catatan baru tersimpan di localStorage.");
    }

    setDiagnostics(getNotesDiagnostics());
    setDraft(emptyDraft);
    setEditingId(null);
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setDraft({ title: note.title, content: note.content });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDraft(emptyDraft);
  };

  const handleDelete = (id: string) => {
    const removed = deleteNote(id);
    if (!removed) {
      setMessage("Catatan sudah tidak tersedia.");
      return;
    }
    setNotes((prev) => prev.filter((note) => note.id !== id));
    setDiagnostics(getNotesDiagnostics());
    setMessage("Catatan dihapus, cache diperbarui.");
    if (editingId === id) {
      handleCancelEdit();
    }
  };

  const handleClearAll = () => {
    if (notes.length === 0) return;
    if (!window.confirm("Hapus semua catatan dari localStorage?")) return;
    clearNotes();
    setNotes([]);
    setDiagnostics(getNotesDiagnostics());
    setMessage("Semua catatan dibersihkan.");
    handleCancelEdit();
  };

  const handleRefresh = (mode: "cache" | "storage") => {
    loadNotes(mode);
    setMessage(
      mode === "storage"
        ? "Sinkronisasi ulang dari localStorage."
        : "Daftar catatan dibaca dari cache memori.",
    );
  };

  const persistTheme = async (next: Theme) => {
    try {
      await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: next }),
        cache: "no-store",
      });
    } catch (error) {
      console.error(error);
      setMessage("Gagal menyimpan tema di cookie.");
    }
  };

  const handleThemeChange = (next: Theme) => {
    if (next === theme) return;
    setTheme(next);
    persistTheme(next);
    setMessage(`Tema ${next === "dark" ? "gelap" : "terang"} aktif.`);
  };

  const lastChangeLabel = useMemo(() => {
    if (diagnostics.lastMutation > diagnostics.lastStorageSync) {
      return "Terakhir ada perubahan catatan";
    }
    if (diagnostics.lastStorageSync) {
      return "Terakhir sinkron dari localStorage";
    }
    return "Belum ada catatan";
  }, [diagnostics.lastMutation, diagnostics.lastStorageSync]);

  return (
    <>
      <section className="app-header">
        <h1>Simple CRUD + Storage Demo</h1>
        <p>
          Proyek mini untuk memperlihatkan bagaimana localStorage, cookie (tema), dan cache memori bekerja
          bersama dalam Next.js + TypeScript.
        </p>
      </section>

      <section className="toolbar">
        <div className="toolbar-group">
          <span className="theme-toggle">
            Tema:
            <button
              type="button"
              className={theme === "light" ? "active" : undefined}
              onClick={() => handleThemeChange("light")}
            >
              Light
            </button>
            <button
              type="button"
              className={theme === "dark" ? "active" : undefined}
              onClick={() => handleThemeChange("dark")}
            >
              Dark
            </button>
          </span>
          <button
            type="button"
            className="button secondary small"
            onClick={() => handleRefresh("cache")}
          >
            Muat dari Cache
          </button>
          <button
            type="button"
            className="button secondary small"
            onClick={() => handleRefresh("storage")}
          >
            Sinkron dari localStorage
          </button>
        </div>
        <div className="toolbar-group">
          <button
            type="button"
            className="button ghost small"
            onClick={handleClearAll}
            disabled={notes.length === 0}
          >
            Hapus Semua Catatan
          </button>
        </div>
      </section>

      {message ? <div className="state-message">{message}</div> : null}

      <section>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="note-title">Judul</label>
            <input
              id="note-title"
              name="title"
              placeholder="Contoh: Daily Standup"
              value={draft.title}
              onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="note-content">Isi catatan</label>
            <textarea
              id="note-content"
              name="content"
              placeholder="Catat poin penting, action item, atau highlight pembelajaran."
              value={draft.content}
              onChange={(event) => setDraft((prev) => ({ ...prev, content: event.target.value }))}
            />
          </div>
          <div className="note-actions">
            <button type="submit" className="button primary">
              {isEditing ? "Update catatan" : "Simpan catatan"}
            </button>
            {isEditing ? (
              <button type="button" className="button ghost" onClick={handleCancelEdit}>
                Batalkan edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section>
        <div className="metrics-grid">
          <div className="metric-card">
            <span>Total catatan</span>
            <strong>{notes.length}</strong>
          </div>
          <div className="metric-card">
            <span>Karakter tersimpan</span>
            <strong>{noteCharacters}</strong>
          </div>
          <div className="metric-card">
            <span>Cache hits</span>
            <strong>{diagnostics.cacheHits}</strong>
          </div>
          <div className="metric-card">
            <span>Cache miss</span>
            <strong>{diagnostics.cacheMisses}</strong>
          </div>
          <div className="metric-card">
            <span>Catatan di cache</span>
            <strong>{diagnostics.notesInCache}</strong>
          </div>
          <div className="metric-card">
            <span>{lastChangeLabel}</span>
            <strong>{formatDiagnosticsTime(Math.max(diagnostics.lastMutation, diagnostics.lastStorageSync))}</strong>
          </div>
        </div>
      </section>

      <section>
        {loading ? (
          <article className="note-card note-list__empty">Memuat catatan dari localStorage…</article>
        ) : notes.length === 0 ? (
          <article className="note-card note-list__empty">
            <h3>Belum ada catatan</h3>
            <p>Gunakan form di atas untuk membuat catatan pertama. Semua data disimpan di browser Anda.</p>
          </article>
        ) : (
          <div className="note-list">
            {notes.map((note) => (
              <article key={note.id} className="note-card">
                <header>
                  <h3>{note.title}</h3>
                  <span className="badge badge--muted">{formatNoteTimestamp(note.updatedAt)}</span>
                </header>
                <p>{note.content}</p>
                <footer className="note-actions">
                  <button
                    type="button"
                    className="button secondary small"
                    onClick={() => handleEdit(note)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="button danger small"
                    onClick={() => handleDelete(note.id)}
                  >
                    Hapus
                  </button>
                </footer>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function sortNotes(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function formatDiagnosticsTime(value: number): string {
  if (!value) return "-";
  return diagnosticsTimeFormatter.format(new Date(value));
}

function formatNoteTimestamp(iso: string): string {
  return noteTimeFormatter.format(new Date(iso));
}
