import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type PaymentType = "deposit" | "package";

export type ClientProjectPaymentInfo = {
  stripeSessionId: string;
  paymentType: PaymentType;
  tier: string | null;
  contactEmail: string | null;
  amountTotal: number;
  currency: string;
};

/**
 * Creates the client_projects row for a completed Stripe checkout — the
 * first record of a real, paying client. Idempotent on stripe_session_id
 * (Stripe can and does redeliver webhook events), so a resend never
 * creates a duplicate project or re-sends the confirmation email twice.
 *
 * Returns null (and logs) rather than throwing if Supabase isn't
 * configured or the insert fails — the webhook that calls this already
 * has its own internal-notification fallback, so a DB hiccup here
 * shouldn't be a hard failure for the whole webhook.
 */
export async function createClientProjectFromPayment(
  info: ClientProjectPaymentInfo
): Promise<{ id: string; created: boolean } | null> {
  if (!supabaseAdmin) {
    console.error("createClientProjectFromPayment: Supabase admin client not configured");
    return null;
  }

  // Check first rather than relying solely on a unique-constraint catch —
  // makes the "already exists, this is a webhook redelivery" case explicit
  // and lets us report whether this call actually created anything.
  const { data: existing, error: lookupError } = await supabaseAdmin
    .from("client_projects")
    .select("id")
    .eq("stripe_session_id", info.stripeSessionId)
    .maybeSingle();

  if (lookupError) {
    console.error("createClientProjectFromPayment lookup failed:", lookupError);
    return null;
  }
  if (existing) {
    return { id: existing.id as string, created: false };
  }

  const { data, error } = await supabaseAdmin
    .from("client_projects")
    .insert({
      stage: "paid",
      payment_type: info.paymentType,
      tier: info.tier,
      contact_email: info.contactEmail,
      amount_total: info.amountTotal,
      currency: info.currency,
      stripe_session_id: info.stripeSessionId,
    })
    .select("id")
    .single();

  if (error) {
    console.error("createClientProjectFromPayment insert failed:", error);
    return null;
  }

  return { id: data.id as string, created: true };
}
