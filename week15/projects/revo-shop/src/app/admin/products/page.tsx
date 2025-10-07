import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminProductsPanel from "@/components/AdminProductsPanel";
import { authOptions } from "@/lib/auth";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/products");
  }

  return (
    <section>
      <h1 className="text-2xl" style={{ fontWeight: 600 }}>Manajemen Produk</h1>
      <p className="text-gray-600">Tambah, ubah, hapus produk internal sebagai latihan CRUD.</p>
      <AdminProductsPanel />
    </section>
  );
}
