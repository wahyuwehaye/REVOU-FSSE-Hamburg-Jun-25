"use client";

import { useFormState } from "@/hooks/useFormState";
import { useToast } from "@/context/ToastContext";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const form = useFormState({
    initialValues: { email: "admin@revonotes.dev", password: "admin123" },
    validate: (values) => ({
      email: values.email.includes("@") ? undefined : "Email tidak valid",
    }),
    onSubmit: async (values) => {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: searchParams?.get("redirect") ?? "/workspace",
      });

      if (result?.error) {
        toast.push({ title: "Login gagal", description: "Periksa kembali email & password", variant: "error" });
        return;
      }

      toast.push({ title: "Login sukses", description: "Selamat datang kembali!", variant: "success" });
      if (result?.url) {
        window.location.href = result.url;
      }
    },
  });

  return (
    <form
      className="card"
      style={{ width: "min(420px, 92vw)", display: "grid", gap: "1rem" }}
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <div>
        <h1 style={{ marginBottom: "0.35rem" }}>Masuk ke Secure Notes</h1>
        <p style={{ margin: 0, color: "#cbd5f5" }}>
          Gunakan akun demo atau ganti dengan kredensial Anda sendiri.
        </p>
      </div>

      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span>Email</span>
        <input
          value={form.values.email}
          onChange={(event) => form.handleChange("email", event.target.value)}
          type="email"
          autoComplete="email"
          required
        />
        {form.errors.email ? <span style={{ color: "#f87171" }}>{form.errors.email}</span> : null}
      </label>

      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span>Password</span>
        <input
          value={form.values.password}
          onChange={(event) => form.handleChange("password", event.target.value)}
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      <button type="submit" style={{ background: "#2563eb", color: "white" }} disabled={form.submitting}>
        {form.submitting ? "Memeriksa..." : "Masuk"}
      </button>

      <small style={{ color: "#cbd5f5" }}>
        Demo: admin@revonotes.dev / admin123 • member@revonotes.dev / member123
      </small>
    </form>
  );
}
