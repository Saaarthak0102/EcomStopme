import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const orderId = formData.get("order_id") as string;
    const itemIndex = parseInt(formData.get("item_index") as string, 10);
    const pieceIndex = parseInt(formData.get("piece_index") as string, 10);
    const photo = formData.get("photo") as File;

    if (!orderId || isNaN(itemIndex) || isNaN(pieceIndex) || !photo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const fileExt = photo.name.split(".").pop() || "jpg";
    const path = `order-photos/${orderId}/${itemIndex}-${pieceIndex}-${Date.now()}.${fileExt}`;

    const arrayBuffer = await photo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("order-photos")
      .upload(path, buffer, { contentType: photo.type, upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from("order-photos").getPublicUrl(path);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error("[orders/upload-photo]", err);
    return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
  }
}
