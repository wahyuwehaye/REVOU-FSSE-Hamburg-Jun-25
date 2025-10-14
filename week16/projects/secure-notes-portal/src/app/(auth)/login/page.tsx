import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <LoginForm />
      <p style={{ marginTop: "1rem", color: "#cbd5f5" }}>
        <Link href="/">Kembali ke beranda</Link>
      </p>
    </main>
  );
}
