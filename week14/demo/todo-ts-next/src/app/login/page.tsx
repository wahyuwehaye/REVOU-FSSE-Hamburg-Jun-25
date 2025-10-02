"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [name, setName] = useState("");
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/";

  const login = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) router.push(next);
    else alert("Login gagal");
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Login Sederhana</h2>
      <input
        className="w-full rounded border px-3 py-2"
        placeholder="Ketik nama"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={login} className="rounded bg-blue-600 px-3 py-2 text-white">Masuk</button>
    </div>
  );
}
