import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  // Reconstruct public origin from headers for reverse proxy compatibility
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const publicOrigin = `${proto}://${host}`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        const adminEmails = (process.env.ADMIN_EMAILS || "")
          .split(",")
          .map((e) => e.trim().toLowerCase());

        if (adminEmails.includes(user.email.toLowerCase())) {
          const adminSupabase = createServiceClient();
          await adminSupabase.from("admin_users").upsert({
            id: user.id,
            email: user.email.toLowerCase(),
            role: "admin",
          });
        }
      }
      return NextResponse.redirect(`${publicOrigin}${next}`);
    }
  }

  return NextResponse.redirect(`${publicOrigin}/auth/login?error=could_not_authenticate`);
}
