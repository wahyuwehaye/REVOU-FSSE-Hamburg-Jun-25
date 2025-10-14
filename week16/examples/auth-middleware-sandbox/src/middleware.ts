import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(request: NextRequest) {
    const token = request.nextauth.token;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (request.nextUrl.pathname.startsWith("/admin") && token.role !== "admin") {
      return NextResponse.redirect(new URL("/403", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
