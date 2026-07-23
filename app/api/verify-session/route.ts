import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ paid: false }, { status: 400 });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ paid: false }, { status: 500 });
  }

  try {
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const isDeposit = session.metadata?.type === "deposit";
    const paid = session.payment_status === "paid" && isDeposit;
    return NextResponse.json({ paid });
  } catch (err) {
    console.error("Session verification failed:", err);
    return NextResponse.json({ paid: false }, { status: 400 });
  }
}
