"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: searchParams?.get("redirect") ?? "/dashboard",
    });

    setLoading(false);

    if (result?.error) {
      setError("Email atau password salah");
      return;
    }

    if (result?.url) {
      window.location.href = result.url;
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div>
        <h1 style={{ marginBottom: "0.5rem" }}>Masuk ke Akun</h1>
        <p style={{ margin: 0, color: "#475569" }}>
          Coba kredensial demo atau ubah sesuai kebutuhan. Role menentukan akses ke halaman admin.
        </p>
      </div>

      {error ? <div className="alert">{error}</div> : null}

      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </label>

      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••"
          autoComplete="current-password"
          required
        />
      </label>

      <button
        type="submit"
        style={{ background: "#2563eb", color: "white", width: "100%" }}
        disabled={loading}
      >
        {loading ? "Sedang masuk..." : "Masuk"}
      </button>

      <div style={{ fontSize: "0.85rem", color: "#475569" }}>
        <p style={{ margin: "0.25rem 0" }}>Demo user:</p>
        <ul style={{ margin: 0, paddingLeft: "1rem" }}>
          <li>admin@example.com / admin123</li>
          <li>user@example.com / user123</li>
        </ul>
      </div>
    </form>
  );
}
