import NotesClient from "@/components/NotesClient";
import { listNotes } from "@/lib/store";

export const metadata = {
    title: "Simple CRUD",
};

export default async function HomePage() {
    const notes = listNotes();
    return <NotesClient initialNotes={notes} />;
}
