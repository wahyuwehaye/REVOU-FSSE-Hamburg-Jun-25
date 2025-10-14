import { CartSummary } from "@/components/CartSummary";
import { CreateNoteForm } from "@/components/CreateNoteForm";
import { ProductCard } from "@/components/ProductCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useFetchProducts } from "@/hooks/useFetchProducts";

// karena hook hanya dapat dipakai di client, buat wrapper client
import ClientShell from "@/components/ClientShell";

export default function HomePage() {
  return <ClientShell />;
}
