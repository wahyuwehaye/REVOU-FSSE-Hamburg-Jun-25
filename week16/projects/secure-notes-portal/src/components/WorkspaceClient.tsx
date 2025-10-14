"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Session } from "next-auth";
import { useNotes } from "@/hooks/useNotes";
import { useFormState } from "@/hooks/useFormState";
import { useToast } from "@/context/ToastContext";

export default function WorkspaceClient({ user }: { user: Session["user"] }) {
  const toast = useToast();
  const { data, loading, error, refetch, createNote } = useNotes();

  const form = useFormState({
    initialValues: { title: "", content: "" },
    validate: (values) => ({
      title: values.title.trim().length >= 3 ? undefined : "Judul minimal 3 karakter",
      content: values.content.trim().length >= 10 ? undefined : "Minimal 10 karakter",
    }),
    onSubmit: async (values) => {
      try {
        await createNote(values);
        form.reset();
      } catch (err) {
        console.error(err);
      }
    },
  });

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat pagi";
    if (hour < 18) return "Selamat sore";
    return "Selamat malam";
  }, []);

  return (
    <main style={{ display: "grid", gap: "1.5rem" }}>
      <header
        className="card"
        style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", justifyContent: "space-between" }}
      >
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <span className="badge">workspace</span>
          <h1 style={{ margin: 0 }}>{greeting}, {user?.name ?? user?.email}</h1>
          <p style={{ margin: 0, color: "#cbd5f5" }}>
            Kelola catatan tim dengan aman. Semua request melewati middleware + NextAuth.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link href="/api/auth/signout?callbackUrl=/" style={{ color: "#93c5fd" }}>
            Logout
          </Link>
          <Link href="/admin/audit" style={{ color: "#c4b5fd" }}>
            Area Admin
          </Link>
        </div>
      </header>

      <section className="card" style={{ display: "grid", gap: "1rem" }}>
        <h2 style={{ margin: 0 }}>Catatan Baru</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
          style={{ display: "grid", gap: "0.75rem" }}
        >
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span>Judul</span>
            <input
              value={form.values.title}
              onChange={(event) => form.handleChange("title", event.target.value)}
              placeholder="Daily sync"
            />
            {form.errors.title ? <span style={{ color: "#f87171" }}>{form.errors.title}</span> : null}
          </label>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span>Isi</span>
            <textarea
              value={form.values.content}
              onChange={(event) => form.handleChange("content", event.target.value)}
              placeholder="Catat poin aksi, pemilik tugas, deadline, dll."
            />
            {form.errors.content ? <span style={{ color: "#f87171" }}>{form.errors.content}</span> : null}
          </label>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button type="submit" style={{ background: "#2563eb", color: "white" }} disabled={form.submitting}>
              {form.submitting ? "Menyimpan..." : "Simpan catatan"}
            </button>
            <button type="button" onClick={form.reset} style={{ background: "rgba(226,232,240,0.1)", color: "#cbd5f5" }}>
              Reset
            </button>
            <button type="button" onClick={refetch} style={{ background: "rgba(148,163,184,0.2)", color: "#e2e8f0" }}>
              Muat ulang catatan
            </button>
          </div>
        </form>
      </section>

      <section className="card" style={{ display: "grid", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Daftar Catatan</h2>
          {loading ? <span style={{ color: "#cbd5f5" }}>Memuat...</span> : null}
        </div>
        {error ? <p style={{ color: "#f87171" }}>Gagal memuat catatan: {error}</p> : null}
        <div className="grid" style={{ gap: "1rem" }}>
          {(data ?? []).map((note) => (
            <article
              key={note.id}
              style={{
                border: "1px solid rgba(148,163,184,0.15)",
                borderRadius: "1rem",
                padding: "1.1rem",
                display: "grid",
                gap: "0.5rem",
                background: "rgba(15,23,42,0.55)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>{note.title}</h3>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  {new Date(note.updatedAt).toLocaleString("id-ID")}
                </span>
              </div>
              <p style={{ margin: 0, color: "#cbd5f5" }}>{note.content}</p>
              <span style={{ fontSize: "0.8rem", color: "#93c5fd" }}>oleh: {note.author.email}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="card" style={{ display: "grid", gap: "1rem", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Tips Performa</h2>
        <div style={{ display: "grid", gap: "0.75rem", color: "#cbd5f5" }}>
          <p>`next/image` optimasi gambar hero di halaman depan.</p>
          <p>`next/font` (Inter) menghindari FOUT.</p>
          <p>`useSecureFetch` menghindari fetch ganda dan memvalidasi data sebelum dipakai.</p>
        </div>
        <Image
          src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80"
          alt="Notes Illustration"
          width={1200}
          height={600}
          style={{ width: "100%", borderRadius: "1rem" }}
        />
      </section>
    </main>
  );
}
