import Link from "next/link";
import type { Route } from "next";

export default function HomePage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Typed Fetch Demo</h1>
      <p className="text-gray-600">
        Contoh sederhana bagaimana TypeScript + Zod membantu memastikan data dari API eksternal sesuai ekspektasi.
      </p>
      <Link href={"/products" as Route} className="badge">
        Lihat daftar produk
      </Link>
    </section>
  );
}
