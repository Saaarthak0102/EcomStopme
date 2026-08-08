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

  // Protect /admin routes — DB check for admin access
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
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
        return NextResponse.redirect(new URL("/admin/login?error=unauthorized", req.url));
      }
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
