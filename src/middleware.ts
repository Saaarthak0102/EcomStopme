import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Reconstruct absolute URL to prevent localhost redirects behind a reverse proxy
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const publicOrigin = `${proto}://${host}`;
  const redirectUrl = (path: string) => new URL(path, publicOrigin);

  // Protect /account routes — redirect to login if not authenticated
  if (pathname.startsWith("/account") && !user) {
    return NextResponse.redirect(redirectUrl("/auth/login"));
  }

  // Protect /admin routes — DB check for admin access
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!user) {
      return NextResponse.redirect(redirectUrl("/admin/login"));
    }

    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    const isEmailAdmin = user.email && adminEmails.includes(user.email.toLowerCase());

    if (!isEmailAdmin) {
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!adminUser) {
        return NextResponse.redirect(redirectUrl("/admin/login?error=unauthorized"));
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith("/auth/login") && user) {
    return NextResponse.redirect(redirectUrl("/account"));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/auth/login"],
};
