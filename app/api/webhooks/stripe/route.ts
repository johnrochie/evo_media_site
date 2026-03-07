import { NextRequest } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecret = process.env.STRIPE_SECRET_KEY;

  if (!webhookSecret || !signature) {
    return new Response("Missing configuration", { status: 500 });
  }
  if (!stripeSecret) {
    return new Response("Stripe not configured", { status: 500 });
  }

  const stripe = new Stripe(stripeSecret);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return new Response(message, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const tier = (session.metadata?.tier as string) ?? "Unknown";
    const amountTotal = session.amount_total ?? 0;
    const customerEmail = session.customer_email ?? session.customer_details?.email;

    const to = process.env.RESEND_TO;
    if (to && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM ?? "Evolution Media <onboarding@resend.dev>",
        to: [to],
        subject: `[Evolution Media] Payment received – ${tier}`,
        html: `
          <h2>New payment received</h2>
          <p><strong>Tier:</strong> ${tier}</p>
          <p><strong>Amount:</strong> €${(amountTotal / 100).toFixed(2)}</p>
          <p><strong>Customer email:</strong> ${customerEmail ?? "N/A"}</p>
          <p><strong>Session ID:</strong> ${session.id}</p>
        `,
      });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
