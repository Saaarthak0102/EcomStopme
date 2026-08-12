import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { OrderItem } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, customizations } = body as {
      order_id: string;
      customizations: Array<{
        item_index: number;
        name_inputs?: string[];
        photo_urls?: string[];
      }>;
    };

    if (!order_id || !customizations?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("items")
      .eq("id", order_id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const items = (order.items as OrderItem[]).map((item, idx) => {
      const customization = customizations.find((c) => c.item_index === idx);
      if (!customization) return item;
      return {
        ...item,
        ...(customization.name_inputs !== undefined && { name_inputs: customization.name_inputs }),
        ...(customization.photo_urls !== undefined && { photo_urls: customization.photo_urls }),
      };
    });

    const { error: updateError } = await supabase
      .from("orders")
      .update({ items })
      .eq("id", order_id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[orders/customization]", err);
    return NextResponse.json({ error: "Failed to save customization" }, { status: 500 });
  }
}
