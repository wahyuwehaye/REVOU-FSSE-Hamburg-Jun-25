import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main>
      <section className="card" style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "1.8rem" }}>403 – Akses Ditolak</h1>
        <p>Sepertinya kamu tidak memiliki izin untuk melihat halaman ini.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
          <Link href="/">
            <button style={{ background: "#f1f5f9" }}>Kembali ke beranda</button>
          </Link>
          <Link href="/login">
            <button style={{ background: "#2563eb", color: "white" }}>Ganti akun</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
