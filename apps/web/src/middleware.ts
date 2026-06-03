import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    if (path.startsWith("/admin/login")) return NextResponse.next();

    if (path.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname.startsWith("/admin/login")) return true;
        if (req.nextUrl.pathname.startsWith("/admin")) return !!token;
        return true;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
