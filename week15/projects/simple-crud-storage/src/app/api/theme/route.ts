import { NextResponse } from "next/server";
import { getThemeFlag, setThemeFlag } from "@/lib/server-flags";

type Theme = "light" | "dark";

type ThemePayload = {
  theme: Theme;
};

export async function GET() {
  const theme = getThemeFlag();
  return NextResponse.json({ theme });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ThemePayload>;
    if (body.theme !== "light" && body.theme !== "dark") {
      return NextResponse.json({ error: "Tema tidak valid" }, { status: 400 });
    }
    setThemeFlag(body.theme);
    return NextResponse.json({ ok: true, theme: body.theme });
  } catch (error) {
    return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 });
  }
}
