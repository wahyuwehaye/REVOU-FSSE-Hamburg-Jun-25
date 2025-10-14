import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <main>
      <section className="card" style={{ maxWidth: "640px" }}>
        <h1>Dashboard</h1>
        <p>Selamat datang, {session?.user?.email}</p>
        <p>Role Anda: {session?.user?.role ?? "unknown"}</p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/admin">
            <button style={{ background: "#7c3aed", color: "white" }}>Menu Admin</button>
          </Link>
          <Link href="/api/auth/signout?callbackUrl=/">
            <button style={{ background: "#f8fafc", color: "#0f172a" }}>Logout</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
