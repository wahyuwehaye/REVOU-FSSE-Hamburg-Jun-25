import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main style={{ display: "grid", gap: "2rem" }}>
      <section className="card" style={{ display: "grid", gap: "1rem" }}>
        <span className="badge">advanced next.js</span>
        <h1 style={{ fontSize: "2.5rem", margin: 0 }}>Secure Notes Portal</h1>
        <p style={{ margin: 0, color: "#cbd5f5" }}>
          Demo aplikasi yang memadukan middleware, NextAuth, state management, dan custom hooks. Gunakan akun
          demo untuk mengeksplorasi area kerja yang dilindungi.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/login">
            <button style={{ background: "#2563eb", color: "white" }}>Masuk</button>
          </Link>
          <Link href="/workspace">
            <button style={{ background: "rgba(226,232,240,0.08)", color: "#bfdbfe" }}>
              Lihat Workspace
            </button>
          </Link>
        </div>
      </section>

      <section className="card" style={{ display: "grid", gap: "1rem", background: "rgba(15,23,42,0.75)" }}>
        <h2 style={{ margin: 0 }}>Apa yang bisa dipelajari?</h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#cbd5f5" }}>
          <li>Middleware + role-based redirect menggunakan NextAuth.</li>
          <li>Custom hook `useSecureFetch` dengan validasi Zod.</li>
          <li>Context API untuk toast notification.</li>
          <li>Optimasi gambar menggunakan `next/image` dengan remote loader.</li>
        </ul>
      </section>

      <section className="card" style={{ background: "rgba(15,23,42,0.7)", display: "grid", gap: "1rem" }}>
        <h2 style={{ margin: 0 }}>Sneak peek Workspace</h2>
        <Image
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80"
          alt="Collaboration"
          width={1200}
          height={600}
          priority
          style={{ width: "100%", borderRadius: "1rem" }}
        />
      </section>
    </main>
  );
}
