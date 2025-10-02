import { NextRequest, NextResponse } from "next/server";
import { deleteTodo, findTodo, updateTodo } from "@/lib/todo-store";
import type { UpdateTodoDto } from "@/types/todo";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = (await req.json()) as UpdateTodoDto;
    const updated = updateTodo(params.id, body);
    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const existed = findTodo(params.id);
  if (!existed) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  deleteTodo(params.id);
  return NextResponse.json({ message: "Deleted" }, { status: 200 });
}
