import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type PaymentType = "deposit" | "package";

/**
 * The actual fields StartYourProjectForm collects (components/intake/
 * StartYourProjectForm.tsx) — everything except sessionId (already the
 * row's own stripe_session_id, redundant to store twice) and website_url
 * (the honeypot; meaningless once a submission's gotten this far).
 */
export type BriefPayload = {
  businessName: string;
  industry: string;
  description: string;
  existingDomain: string;
  logoNote: string;
  colours: string;
  inspiration: string;
  pagesNeeded: string;
  existingContent: string;
  photos: string;
  functionality: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};

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

/**
 * Advances a client_projects row to `brief_received` — called from
 * /api/intake once the (real, payment-gated) Build Brief Form at
 * /start-your-project is submitted. Also backfills business_name and
 * contact_email, since neither is known at payment time (Stripe Checkout
 * doesn't collect a business name, and the brief's contact email is more
 * current/reliable than whatever Stripe captured at checkout), and now
 * the full brief itself — until this, the brief's actual content
 * (industry, description, colours, inspiration, pages needed, existing
 * content, photos, functionality) existed nowhere queryable, only ever
 * as the body of the internal notification email. Found while deepening
 * Item 9's scope (it needs a structured brief to read from, eventually);
 * useful today regardless, as an actual record of what a client asked
 * for.
 *
 * Matches on stripe_session_id, the join key StartYourProjectForm already
 * threads through to this endpoint. Returns null (and logs) rather than
 * throwing on any failure — including "no matching row" — since a brief
 * submission's real job (notifying John) must not regress if this
 * best-effort pipeline update fails.
 */
export async function markBriefReceived(
  brief: BriefPayload,
  opts: { stripeSessionId: string }
): Promise<{ id: string } | null> {
  if (!supabaseAdmin) {
    console.error("markBriefReceived: Supabase admin client not configured");
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from("client_projects")
    .update({
      stage: "brief_received",
      stage_updated_at: new Date().toISOString(),
      business_name: brief.businessName,
      contact_email: brief.contactEmail,
      brief,
    })
    .eq("stripe_session_id", opts.stripeSessionId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("markBriefReceived update failed:", error);
    return null;
  }
  if (!data) {
    console.error(`markBriefReceived: no client_projects row found for session "${opts.stripeSessionId}"`);
    return null;
  }

  return { id: data.id as string };
}
