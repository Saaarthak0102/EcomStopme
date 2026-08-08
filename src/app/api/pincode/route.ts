import { NextRequest, NextResponse } from "next/server";

// Uses the free India Post Pincode API
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pin = searchParams.get("pin");

  if (!pin || !/^\d{6}$/.test(pin)) {
    return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      next: { revalidate: 86400 }, // cache 24h
    });
    const data = await res.json();

    if (data?.[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
      const po = data[0].PostOffice[0];
      return NextResponse.json({
        city: po.District,
        state: po.State,
        district: po.District,
      });
    }
    return NextResponse.json({ error: "Pincode not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
