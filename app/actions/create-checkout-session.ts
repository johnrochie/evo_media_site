"use server";

import Stripe from "stripe";
import { evomediaContent } from "@/lib/evomedia-content";

/**
 * The price is derived server-side from the trusted content file, keyed by
 * tier name. The client only chooses *which* tier to buy — never the amount —
 * so it cannot tamper with what it pays.
 */
function resolveTier(tierName: string): { name: string; amountCents: number } | null {
  const tier = evomediaContent.pricing.tiers.find((t) => t.name === tierName);
  if (!tier || tier.amountCents == null) return null;
  return { name: tier.name, amountCents: tier.amountCents };
}

export async function createCheckoutSession(tierName: string) {
  const tier = resolveTier(tierName);
  if (!tier) {
    return { ok: false, error: "Unknown package.", url: null };
  }

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
              name: `${tier.name} - Evolution Media`,
              description: `Web design package: ${tier.name}`,
            },
            unit_amount: tier.amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: {
        tier: tier.name,
      },
    });

    if (!session.url) {
      return { ok: false, error: "Could not create checkout URL.", url: null };
    }

    return { ok: true, url: session.url, error: null };
  } catch (err) {
    console.error("Stripe checkout session creation failed:", err);
    return { ok: false, error: "Checkout failed. Please try again.", url: null };
  }
}
