import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/private")) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      const nextPath = pathname + request.nextUrl.search;
      loginUrl.searchParams.set("next", nextPath || "/private");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/private/:path*"],
};
