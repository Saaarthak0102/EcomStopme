import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const adminSecret = process.env.ADMIN_SECRET || "change-me-to-a-long-random-secret";

    if (password !== adminSecret) {
      return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });

    // Set cookie for 7 days
    response.cookies.set("admin_token", password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[admin/login]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
