import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    const url = await createCheckoutSession(
      `${baseUrl}/app?upgraded=true`,
      `${baseUrl}/app?canceled=true`
    );

    if (!url) {
      return NextResponse.json(
        { error: "Failed to create checkout session." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Payment setup failed.";
    console.error("Stripe checkout error:", message);
    return NextResponse.json(
      { error: `Stripe error: ${message}` },
      { status: 500 }
    );
  }
}
