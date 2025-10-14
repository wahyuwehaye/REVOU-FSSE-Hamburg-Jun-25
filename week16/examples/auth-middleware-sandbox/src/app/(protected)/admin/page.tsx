import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    redirect("/403");
  }

  return (
    <main>
      <section className="card" style={{ maxWidth: "680px" }}>
        <h1>Area Admin</h1>
        <p>Hanya admin yang dapat melihat halaman ini.</p>
        <ul style={{ margin: 0, paddingLeft: "1rem", color: "#475569" }}>
          <li>Kelola user</li>
          <li>Review laporan</li>
          <li>Cek log keamanan</li>
        </ul>
      </section>
    </main>
  );
}
