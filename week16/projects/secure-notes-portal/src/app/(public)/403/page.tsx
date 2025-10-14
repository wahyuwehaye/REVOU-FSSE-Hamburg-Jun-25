import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100vh", padding: "2rem" }}>
      <section className="card" style={{ textAlign: "center", maxWidth: "420px" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>403 – Akses ditolak</h1>
        <p style={{ color: "#cbd5f5" }}>
          Perlu role lebih tinggi untuk membuka halaman ini. Jika merasa ini kesalahan, hubungi admin Anda.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
          <Link href="/">
            <button style={{ background: "rgba(226,232,240,0.1)", color: "#bfdbfe" }}>Beranda</button>
          </Link>
          <Link href="/login">
            <button style={{ background: "#2563eb", color: "white" }}>Ganti akun</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
