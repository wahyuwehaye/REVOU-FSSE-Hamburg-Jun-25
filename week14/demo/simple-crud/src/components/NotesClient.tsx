"use client";

import { useEffect, useState } from "react";
import type { Note, NoteInput } from "@/types/note";

type NotesClientProps = {
    initialNotes: Note[];
};

type FormState = {
    id?: string;
    title: string;
    content: string;
};

const emptyForm: FormState = {
    title: "",
    content: "",
};

export default function NotesClient({ initialNotes }: NotesClientProps) {
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!initialNotes.length) {
            void refresh();
        }
    }, []);

    const refresh = async () => {
        const res = await fetch("/api/items", { cache: "no-store" });
        const data = (await res.json()) as Note[];
        setNotes(data);
    };

    const resetForm = () => {
        setForm(emptyForm);
        setError(null);
    };

    const onChange = (field: keyof NoteInput) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!form.title.trim()) {
            setError("Judul wajib diisi");
            return;
        }
        try {
            setLoading(true);
            setError(null);
            if (form.id) {
                const res = await fetch(`/api/items/${form.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title: form.title, content: form.content }),
                });
                if (!res.ok) {
                    throw new Error("Gagal memperbarui");
                }
                const updated = (await res.json()) as Note;
                setNotes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
            } else {
                const res = await fetch("/api/items", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title: form.title, content: form.content }),
                });
                if (!res.ok) {
                    const body = await res.json().catch(() => ({} as { message?: string }));
                    throw new Error(body.message ?? "Gagal membuat catatan");
                }
                const created = (await res.json()) as Note;
                setNotes((prev) => [created, ...prev]);
            }
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (note: Note) => {
        setForm({ id: note.id, title: note.title, content: note.content });
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Hapus catatan ini?");
        if (!confirmed) return;
        const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
        if (res.ok) {
            setNotes((prev) => prev.filter((item) => item.id !== id));
            if (form.id === id) {
                resetForm();
            }
        }
    };

    const handleCancel = () => {
        resetForm();
    };

    return (
        <section>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h1 style={{ margin: 0 }}>Simple Notes CRUD</h1>
                    <p className="text-gray-600">Demo Next.js + TypeScript dengan API Route in-memory.</p>
                </div>
                <span className="badge">{notes.length} catatan</span>
            </header>

            <form onSubmit={handleSubmit} className="card" style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ margin: 0 }}>{form.id ? "Edit Catatan" : "Catatan Baru"}</h2>
                <label>
                    <span>Judul</span>
                    <input value={form.title} onChange={onChange("title")} placeholder="Belajar TypeScript" />
                </label>
                <label>
                    <span>Isi</span>
                    <textarea value={form.content} onChange={onChange("content")} rows={4} placeholder="Catat poin penting..." />
                </label>
                {error && <p className="error-text">{error}</p>}
                <div className="note-actions">
                    <button type="submit" className="button" disabled={loading}>
                        {loading ? "Menyimpan..." : form.id ? "Simpan Perubahan" : "Tambah Catatan"}
                    </button>
                    {form.id && (
                        <button type="button" className="button secondary" onClick={handleCancel}>
                            Batalkan
                        </button>
                    )}
                </div>
            </form>

            <div className="note-list">
                {notes.length === 0 ? (
                    <p className="text-gray-600">Belum ada catatan. Tambahkan melalui form di atas.</p>
                ) : (
                    notes.map((note) => (
                        <article key={note.id} className="note-card">
                            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h3 style={{ margin: 0 }}>{note.title}</h3>
                                <small className="text-gray-500">
                                    {new Date(note.updatedAt).toLocaleString("id-ID")}
                                </small>
                            </header>
                            <p style={{ margin: 0 }}>{note.content || <em className="text-gray-500">(kosong)</em>}</p>
                            <div className="note-actions">
                                <button type="button" className="button secondary" onClick={() => handleEdit(note)}>
                                    Edit
                                </button>
                                <button type="button" className="button" style={{ background: "#dc2626" }} onClick={() => handleDelete(note.id)}>
                                    Hapus
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </section>
    );
}
