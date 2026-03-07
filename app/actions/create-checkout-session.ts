"use server";

import Stripe from "stripe";

export async function createCheckoutSession(tierName: string, amountCents: number) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return { ok: false, error: "Stripe is not configured.", url: null };
  }

  const stripe = new Stripe(secret);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.evomedia.site";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "eur",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${tierName} - Evolution Media`,
              description: `Web design package: ${tierName}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: {
        tier: tierName,
      },
    });

    if (!session.url) {
      return { ok: false, error: "Could not create checkout URL.", url: null };
    }

    return { ok: true, url: session.url, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed.";
    return { ok: false, error: message, url: null };
  }
}
