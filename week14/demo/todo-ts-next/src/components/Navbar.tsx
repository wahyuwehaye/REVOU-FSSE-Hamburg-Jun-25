"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";

export default function Navbar() {
  const router = useRouter();

  const goTodos = () => {
    // contoh router dengan type yang aman (Route)
    const target = "/todos" as Route;
    router.push(target);
  };

  return (
    <header className="flex items-center gap-4">
      <Image src="/logo.png" alt="Logo" width={36} height={36} priority />
      <nav className="flex gap-3 text-blue-600 underline">
        <Link href={"/" as Route}>Home</Link>
        <Link href={"/todos" as Route}>Todos</Link>
        <Link href={"/private" as Route}>Private</Link>
      </nav>
      <button onClick={goTodos} className="ml-auto rounded bg-blue-600 px-3 py-1 text-white">
        Go Todos
      </button>
    </header>
  );
}
