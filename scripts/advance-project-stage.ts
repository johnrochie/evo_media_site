/**
 * Manually advance a client_projects row to its next pipeline stage and
 * send the matching status email — Phase 4, item 7, Prompt 2 (see
 * EvoMedia-Phase4-Scope.md). This is the small, deliberate manual action
 * the scope calls for: there's no code signal today for "design is
 * done" / "build is done" / "ready for review" — that work happens in
 * Cursor, outside anything this app observes — so advancing those
 * stages is a one-command action for John, not invented automation.
 * (`paid` and `brief_received` already advance automatically — see the
 * Stripe webhook and /api/intake.)
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/advance-project-stage.ts <stripe_session_id> <stage> [live_url]
 *
 * Stages: in_design | in_build | ready_for_review | live
 * live_url is required (and only used) for the `live` stage.
 *
 * Needs SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL, and
 * RESEND_API_KEY set (via .env.local locally, or the real environment).
 */

import { supabaseAdmin } from "../lib/supabaseAdmin";
import { renderClientEmail, sendClientEmail } from "../lib/clientEmail";

const STAGES = ["in_design", "in_build", "ready_for_review", "live"] as const;
type ManualStage = (typeof STAGES)[number];

function fail(message: string): never {
  console.error(`Error: ${message}\n`);
  console.error(
    "Usage: npx tsx --env-file=.env.local scripts/advance-project-stage.ts <stripe_session_id> <stage> [live_url]"
  );
  console.error(`Stages: ${STAGES.join(" | ")}`);
  process.exit(1);
}

function displayName(businessName: string | null): string {
  return businessName && businessName.trim() ? businessName.trim() : "your site";
}

function buildStageEmail(
  stage: ManualStage,
  opts: { businessName: string | null; liveUrl?: string }
): { subject: string; html: string } {
  const name = displayName(opts.businessName);
  switch (stage) {
    case "in_design":
      return {
        subject: "Your site is in design",
        html: renderClientEmail({
          heading: "Your site is in design",
          bodyHtml: `<p>We've started on the design for ${name}. We'll be in touch with a preview once the first pass is ready.</p>`,
        }),
      };
    case "in_build":
      return {
        subject: "Your site is now in build",
        html: renderClientEmail({
          heading: "Your site is now in build",
          bodyHtml: `<p>The design for ${name} is signed off and we're building it out. Next stop: a link to review.</p>`,
        }),
      };
    case "ready_for_review":
      return {
        subject: "Ready for your review",
        html: renderClientEmail({
          heading: "Ready for your review",
          bodyHtml: `<p>Your site is built and ready for a look. Reply to this email with any changes, or give us the go-ahead to launch.</p>`,
        }),
      };
    case "live":
      return {
        subject: "Your site is live",
        html: renderClientEmail({
          heading: "Your site is live",
          bodyHtml: `<p>${name} is live${
            opts.liveUrl ? ` at <a href="${opts.liveUrl}">${opts.liveUrl}</a>` : ""
          }. Congratulations — thanks for building with Evolution Media.</p>`,
        }),
      };
  }
}

async function main() {
  const [stripeSessionId, stage, liveUrl] = process.argv.slice(2);

  if (!stripeSessionId || !stage) fail("stripe_session_id and stage are both required.");
  if (!STAGES.includes(stage as ManualStage)) fail(`unknown stage "${stage}".`);
  if (stage === "live" && !liveUrl) fail("live_url is required for the 'live' stage.");
  if (!supabaseAdmin) {
    fail("Supabase admin client not configured — check SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL.");
  }

  const { data: project, error: lookupError } = await supabaseAdmin
    .from("client_projects")
    .select("id, business_name, contact_email, stage")
    .eq("stripe_session_id", stripeSessionId)
    .maybeSingle();

  if (lookupError) fail(`lookup failed: ${lookupError.message}`);
  if (!project) fail(`no client_projects row found for session "${stripeSessionId}".`);
  if (!project.contact_email) {
    fail(`project ${project.id} has no contact_email on file — can't send the status email.`);
  }

  const update: Record<string, unknown> = { stage, stage_updated_at: new Date().toISOString() };
  if (stage === "live" && liveUrl) update.live_url = liveUrl;

  const { error: updateError } = await supabaseAdmin
    .from("client_projects")
    .update(update)
    .eq("id", project.id);
  if (updateError) fail(`update failed: ${updateError.message}`);

  const { subject, html } = buildStageEmail(stage as ManualStage, {
    businessName: project.business_name,
    liveUrl,
  });
  await sendClientEmail({ to: project.contact_email, subject, html });

  console.log(
    `Done — ${displayName(project.business_name)}: ${project.stage} -> ${stage}. Email sent to ${project.contact_email}.`
  );
}

main().catch((err) => {
  console.error(err.stack || err.message);
  process.exit(1);
});
