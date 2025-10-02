"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { CreateTodoDto } from "@/types/todo";

type TodoFormProps = {
  onCreate: (payload: CreateTodoDto) => Promise<void>;
};

export default function TodoForm({ onCreate }: TodoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTodoDto>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: CreateTodoDto) => {
    try {
      setLoading(true);
      setError(null);
      await onCreate(data);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="Tulis todo..."
          {...register("title", {
            required: "Wajib diisi",
            minLength: { value: 3, message: "Min 3 karakter" },
          })}
        />
        <button disabled={loading} className="rounded bg-green-600 px-3 py-2 text-white">
          {loading ? "Menyimpan..." : "Tambah"}
        </button>
      </div>
      <div className="min-h-[1.25rem] text-sm text-red-600">
        {errors.title?.message ?? error}
      </div>
    </form>
  );
}
