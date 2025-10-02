import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (!name) return NextResponse.json({ message: "name required" }, { status: 400 });

  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.set("token", `user:${name}`, { httpOnly: true, path: "/", maxAge: 60 * 60 });
  return res;
}
