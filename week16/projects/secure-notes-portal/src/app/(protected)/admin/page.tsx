import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    redirect("/403");
  }

  return (
    <main style={{ display: "grid", gap: "1.5rem" }}>
      <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <span className="badge">admin audit</span>
        <h1 style={{ margin: 0 }}>Log Aktivitas</h1>
        <p style={{ color: "#cbd5f5", margin: 0 }}>
          Area ini hanya dapat diakses admin. Gunakan untuk memonitor percobaan login dan aktivitas penting.
        </p>
      </section>

      <section className="card" style={{ display: "grid", gap: "1rem" }}>
        <h2 style={{ margin: 0 }}>Ringkasan Hari Ini</h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#cbd5f5" }}>
          <li>3 login sukses (admin/member)</li>
          <li>1 percobaan login gagal</li>
          <li>5 catatan baru dibuat</li>
        </ul>
      </section>
    </main>
  );
}
