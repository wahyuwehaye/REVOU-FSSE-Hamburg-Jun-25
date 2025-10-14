"use client";

import { useFormState } from "@/hooks/useFormState";
import { useToggle } from "@/hooks/useToggle";

export function CreateNoteForm() {
  const modal = useToggle();
  const form = useFormState({
    initialValues: { title: "", content: "" },
    validate: (values) => ({
      title: values.title.trim() ? undefined : "Judul wajib diisi",
      content: values.content.trim().length >= 10 ? undefined : "Isi minimal 10 karakter",
    }),
    onSubmit: async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert(`Catatan tersimpan: ${values.title}`);
      form.reset();
      modal.setFalse();
    },
  });

  if (!modal.value) {
    return (
      <button onClick={modal.setTrue} style={{ background: "#7c3aed", color: "white" }}>
        Buat Catatan Baru
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.45)",
        display: "grid",
        placeItems: "center",
        padding: "1rem",
        zIndex: 20,
      }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
        style={{ width: "min(420px, 100%)" }}
        className="card"
      >
        <h2>Catatan Baru</h2>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          <span>Judul</span>
          <input
            value={form.values.title}
            onChange={(event) => form.handleChange("title", event.target.value)}
          />
          {form.errors.title ? <span style={{ color: "#ef4444" }}>{form.errors.title}</span> : null}
        </label>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          <span>Isi</span>
          <textarea
            rows={4}
            value={form.values.content}
            onChange={(event) => form.handleChange("content", event.target.value)}
          />
          {form.errors.content ? <span style={{ color: "#ef4444" }}>{form.errors.content}</span> : null}
        </label>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="submit"
            style={{ background: "#2563eb", color: "white" }}
            disabled={form.submitting}
          >
            {form.submitting ? "Menyimpan..." : "Simpan"}
          </button>
          <button type="button" onClick={modal.setFalse} style={{ background: "#f8fafc" }}>
            Tutup
          </button>
        </div>
        {!form.isDirty && <small style={{ color: "#64748b" }}>Belum ada perubahan.</small>}
      </form>
    </div>
  );
}
