import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { order_id, memory_type, memory_link } = await req.json() as {
      order_id: string;
      memory_type: string;
      memory_link: string;
    };

    if (!order_id || !memory_type || !memory_link?.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Check the NFC memory record exists and hasn't been submitted yet
    const { data: existing, error: fetchError } = await supabase
      .from("nfc_memories")
      .select("id, memory_link")
      .eq("order_id", order_id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "NFC record not found" }, { status: 404 });
    }

    if (existing.memory_link) {
      return NextResponse.json({ error: "Memory already submitted — one-time only" }, { status: 409 });
    }

    // Save the memory link
    await supabase
      .from("nfc_memories")
      .update({
        memory_link: memory_link.trim(),
        memory_type,
        submitted_at: new Date().toISOString(),
      })
      .eq("order_id", order_id);

    // Update order status to processing
    await supabase
      .from("orders")
      .update({ status: "processing" })
      .eq("id", order_id)
      .eq("status", "nfc_pending");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[orders/nfc-link]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
