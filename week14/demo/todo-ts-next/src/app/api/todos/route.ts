import { NextRequest, NextResponse } from "next/server";
import { addTodo, listTodos } from "@/lib/todo-store";
import type { Todo, CreateTodoDto } from "@/types/todo";

export async function GET() {
  return NextResponse.json(listTodos(), { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateTodoDto;
    if (!body.title || body.title.trim().length < 3) {
      return NextResponse.json({ message: "Title minimal 3 karakter" }, { status: 400 });
    }

    const todo: Todo = {
      id: crypto.randomUUID(),
      title: body.title.trim(),
      done: false,
      createdAt: new Date().toISOString(),
    };

    addTodo(todo);

    return NextResponse.json(todo, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
}
