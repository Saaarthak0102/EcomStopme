import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createServiceClient } from "@/lib/supabase/server";
import { CartItem } from "@/lib/types";



function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `STM-${year}-${rand}`;
}

function generateNfcId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const uid = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `STM-NFC-${uid}`;
}

export async function POST(req: NextRequest) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const body = await req.json();
    const { items, total_amount, customer_email, customer_phone, shipping_address, referrer } = body as {
      items: CartItem[];
      total_amount: number;
      customer_email: string;
      customer_phone: string;
      shipping_address: Record<string, string>;
      referrer?: string | null;
    };

    if (!items?.length || !total_amount || !customer_email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Create Razorpay order
    const rzpOrder = await razorpay.orders.create({
      amount: total_amount,   // already in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    // 2. Save order to Supabase
    const supabase = createServiceClient();
    const orderNumber = generateOrderNumber();

    const orderItems = items.map((item) => ({
      product_id: item.productId,
      product_name: item.productName,
      variant_name: Object.values(item.selectedVariants).join(" · "),
      quantity: item.quantity,
      unit_price: item.unitPrice,
      has_nfc: item.hasNfc,
      rakhi_type: item.rakhiType || "none",
    }));

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_email,
        customer_phone,
        items: orderItems,
        subtotal: total_amount,
        shipping_charge: 0,
        total_amount,
        shipping_address,
        status: "pending",
        razorpay_order_id: rzpOrder.id,
        referrer: referrer || null,
      })
      .select()
      .single();

    if (error) throw error;

    // 3. Pre-create NFC memory records for NFC-enabled items
    const nfcItems = items.filter((i) => i.hasNfc);
    if (nfcItems.length > 0) {
      const nfcRecords = nfcItems.map((_, idx) => ({
        order_id: order.id,
        order_item_index: idx,
        unique_nfc_id: generateNfcId(),
      }));
      await supabase.from("nfc_memories").insert(nfcRecords);
    }

    return NextResponse.json({
      razorpay_order_id: rzpOrder.id,
      order_id: order.id,
      order_number: orderNumber,
    });
  } catch (err) {
    console.error("[orders/create]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
