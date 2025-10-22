import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Missing reference parameter" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });

    const data = await res.json();

    // Log full Paystack payload (in Vercel or console)
    console.log("🔍 PAYSTACK VERIFY DEBUG:", JSON.stringify(data, null, 2));

    return NextResponse.json({
      message: "Paystack verification response",
      statusCode: res.status,
      ok: res.ok,
      data,
    });
  } catch (err) {
    console.error("⚠️ Error fetching from Paystack:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
