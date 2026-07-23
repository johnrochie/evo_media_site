import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = new Stripe(secret);
  const depositAmount = parseInt(process.env.STRIPE_DEPOSIT_AMOUNT || "15000", 10);
  const currency = process.env.STRIPE_CURRENCY || "eur";
  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.evomedia.site";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "EvoMedia project deposit",
              description:
                "Secures your build slot. This is a deposit against the final project fee, not an extra charge.",
            },
            unit_amount: depositAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/start-your-project?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
      metadata: {
        type: "deposit",
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "No checkout URL" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session failed:", err);
    return NextResponse.json({ error: "Failed to start checkout" }, { status: 500 });
  }
}
