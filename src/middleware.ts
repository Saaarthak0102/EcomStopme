import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Protect /account routes — redirect to login if not authenticated
  if (pathname.startsWith("/account") && !user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Protect /admin routes — basic check (full admin check done server-side)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const adminSecret = req.cookies.get("admin_token")?.value;
    if (!adminSecret) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith("/auth/login") && user) {
    return NextResponse.redirect(new URL("/account", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/auth/login"],
};
