"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("admin@revoshop.dev");
  const [password, setPassword] = useState("revoshop123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });
    setLoading(false);
    if (result?.error) {
      setError("Email atau password salah");
      return;
    }
    router.push(callbackUrl);
  };

  return (
    <section style={{ maxWidth: 420, margin: "0 auto" }}>
      <h1 className="text-2xl font-semibold">Masuk ke RevoShop</h1>
      <p className="text-gray-600">Gunakan akun admin demo untuk mengakses dashboard.</p>
      <form onSubmit={handleSubmit} className="card">
        <label>
          <span>Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          <span>Password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        {error && <p className="badge" style={{ background: "rgba(239, 68, 68, 0.2)", color: "#ef4444" }}>{error}</p>}
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </section>
  );
}
