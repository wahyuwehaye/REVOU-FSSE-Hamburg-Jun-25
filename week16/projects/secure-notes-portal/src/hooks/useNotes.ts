"use client";

import { useCallback } from "react";
import { z } from "zod";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { useToast } from "@/context/ToastContext";

const NoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: z.object({
    email: z.string().email(),
  }),
});

const NotesSchema = z.array(NoteSchema);

export type Note = z.infer<typeof NoteSchema>;

type CreatePayload = {
  title: string;
  content: string;
};

export function useNotes() {
  const toast = useToast();
  const state = useSecureFetch<Note[]>("/api/notes", NotesSchema);

  const createNote = useCallback(
    async (payload: CreatePayload) => {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.push({ title: "Gagal membuat catatan", description: error.message ?? "Unknown error", variant: "error" });
        throw new Error(error.message);
      }
      toast.push({ title: "Catatan tersimpan", description: payload.title, variant: "success" });
      await state.refetch();
    },
    [toast, state],
  );

  return { ...state, createNote };
}
