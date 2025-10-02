import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PrivatePage() {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/login?next=/private");

  return <p>Halo! Ini halaman privat. Token: {token?.slice(0, 6)}***</p>;
}
