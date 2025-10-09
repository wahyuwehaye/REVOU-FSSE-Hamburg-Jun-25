import { NotesApp } from "@/components/NotesApp";
import { getThemeFlag } from "@/lib/server-flags";

export default function HomePage() {
  const theme = getThemeFlag();

  return <NotesApp initialTheme={theme} />;
}
