import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <div className="card">
        <h1>Auth Middleware Sandbox</h1>
        <p>
          Contoh sederhana untuk mempelajari middleware Next.js dan NextAuth. Coba login sebagai admin
          atau member, kemudian buka halaman dashboard & admin.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/login">
            <button style={{ background: "#2563eb", color: "white" }}>Ke Halaman Login</button>
          </Link>
          <Link href="/dashboard">
            <button style={{ background: "#f1f5f9", color: "#1f2937" }}>Langsung ke Dashboard</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
