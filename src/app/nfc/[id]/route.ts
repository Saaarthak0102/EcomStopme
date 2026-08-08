import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// NFC redirect: /nfc/[id] → customer's submitted memory link
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("nfc_memories")
    .select("memory_link, is_active")
    .eq("unique_nfc_id", id)
    .single();

  if (!data || !data.is_active || !data.memory_link) {
    // Redirect to a nice "memory not found" page or home
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL!));
  }

  return NextResponse.redirect(data.memory_link);
}
