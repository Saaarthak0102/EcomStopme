import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, razorpay_payment_id, razorpay_order_id, razorpay_signature } = body as {
      order_id: string;
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    };

    // 1. Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // 2. Fetch the order to check for NFC items
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("items")
      .eq("id", order_id)
      .single();

    if (fetchError) throw fetchError;

    // 3. Determine new status — nfc_pending if order has NFC items, else processing
    const items = order?.items as Array<{ has_nfc: boolean }>;
    const hasNfcItems = items?.some((i) => i.has_nfc);
    const newStatus = hasNfcItems ? "nfc_pending" : "processing";

    // 4. Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        razorpay_payment_id,
        razorpay_signature,
        paid_at: new Date().toISOString(),
      })
      .eq("id", order_id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, status: newStatus });
  } catch (err) {
    console.error("[orders/verify]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
