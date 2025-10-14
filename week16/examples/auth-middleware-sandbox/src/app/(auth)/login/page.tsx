import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
      <p style={{ marginTop: "1rem", color: "#64748b" }}>
        <Link href="/">Kembali ke beranda</Link>
      </p>
    </main>
  );
}
