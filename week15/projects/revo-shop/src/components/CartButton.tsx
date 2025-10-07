"use client";

import Link from "next/link";
import type { Route } from "next";
import { useCartStore } from "@/stores/useCartStore";

export default function CartButton() {
  const count = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));
  return (
    <Link href={"/cart" as Route} className="button secondary" style={{ marginLeft: "auto" }}>
      Cart ({count})
    </Link>
  );
}
