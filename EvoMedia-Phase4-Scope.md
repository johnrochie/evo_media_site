# Phase 4 — Client Handoff & Build Speed: Scope

Phase 4 of the [12-tool roadmap](EvoMedia-Tooling-Roadmap.md), scoped
2026-09-04. Phases 1-3 (Lead Discovery, Site Scraper/Auto-Audit/Proposal
Generator, Before/After Generator + Competitor Benchmarking) are all
complete and live in `evo_media_site` + the separate `lead-discovery-engine`
and `evomedia-tools` repos. Phase 4 is a different kind of work: those
three phases were internal CLI tools operating on *other people's*
websites (scan, score, generate a document). Phase 4 operates on
**Evolution Media's own delivery pipeline** — what happens after someone
actually pays a deposit.

Per the roadmap, Phase 4 is three items:

7. **Automated Client Communication & Status Agent**
8. **CMS Panel** (custom Supabase admin) — also a priced module (€350)
9. **Agent-Driven First Draft Generation** (human approval gate)

## What's actually there today (checked, not assumed)

- `evo_media_site`'s Stripe webhook (`app/api/webhooks/stripe/route.ts`)
  fires on `checkout.session.completed` and sends exactly one email —
  **to John, never to the client.** Same story everywhere else email is
  sent in this codebase (`submit-intake-stage1.ts`, `app/api/intake/route.ts`,
  `send-contact.ts`): every send goes to an internal address, with the
  customer's email only set as `replyTo`. **A paying client currently
  receives zero automated communication, not even a payment confirmation.**
- Two Supabase tables exist: `intake_stage1` (the pre-payment interest
  form) and `intake_stage2` (the post-deposit "Build Brief Form," per
  `supabase-schema.sql`). Neither has a status/stage field — they're
  point-in-time form submissions, not an ongoing project record.
- Notion has a "Leads" database (pre-sale, used by `lead-discovery-engine`)
  and a "Projects" database — checked, and the latter is an unused, generic
  Notion template (Project Manager/Sponsor, Budget, Cost Type = "Hardware")
  with no EvoMedia-specific pipeline stages. **No client-project pipeline
  tracker exists anywhere today.**
- Every client site delivered so far (`dental-practice`, `salon`,
  `restaurant`, `rei-bridal`, `golden-dragon-chinese`, `dublin-yoga-studio`,
  `travel-bug-site`, etc. — checked the GitHub repo list) is its own
  bespoke one-off repo. **No shared client-site starter/template repo
  exists.**

That last point is the load-bearing finding for this scope: Items 8 and 9
both assume a "reusable" template to build against, and that template
doesn't exist yet. Item 7 has no such dependency and is fully buildable
now.

## Decisions (settled 2026-09-04)

1. **The new client-project record lives in Supabase**, as a new table
   alongside `intake_stage1`/`intake_stage2` — same database the Stripe
   webhook and both intake forms already use, no new API/latency/rate-limit
   surface. (Alternative considered: a new Notion database, consistent
   with the Leads CRM — rejected because it would mean the Communication
   Agent's webhook calling out to the Notion API on every stage change, for
   no benefit over a same-DB row.)
2. **Items 8 and 9 are scoped here (decisions + open questions) but not
   built yet.** Building either "reusable" now, before a second real
   client site exists to generalize from, means guessing at a shape with
   nothing real to validate it against — the same mistake this repo's own
   `shared/` promotion rule exists to prevent ("promote once 2+ things
   need it," never before). The plan: build the first real instance of
   each directly into the next real client's site as a one-off, then
   extract a shared/reusable version once a second client proves the
   pattern. Item 7 proceeds to full build now since it has no such
   dependency.

## Item 7 — Automated Client Communication & Status Agent

### What it does

As a client's project moves through Evolution Media's delivery pipeline,
sends the client (not just John) a brand-consistent status email at each
stage, starting with the one that's missing today: **a payment
confirmation.** Per the roadmap: "your site is in design, here's a
preview," and flags John only when a client reply needs a real decision.

### Pipeline stages (v1, revised during Prompt 1 — see below)

```
paid → brief_received → in_design → in_build → ready_for_review → live
```

(First stage renamed from `deposit_paid` to `paid` once Prompt 1's real
code-reading found a second live payment path that isn't a deposit at
all — see "Real findings from Prompt 1.") Two of these six already have a
real code signal to trigger off automatically:

- `paid` — the existing Stripe webhook, `checkout.session.completed`
  (both real payment paths, deposit and full package)
- `brief_received` — the existing `/api/intake` route (the live,
  payment-gated Build Brief Form at `/start-your-project` — see below,
  this is NOT the same as the separate, unlinked `/brief` page)

The other three (`in_design`, `in_build`, `ready_for_review`, plus moving
to `live`) have **no code signal today** — that work happens in Cursor,
outside anything this system observes. Being honest about that: v1 doesn't
pretend to auto-detect when design work finishes. It automates the *email*
half (the moment a stage value changes, the right email goes out
automatically) and leaves the *stage advance itself* as a small, deliberate
manual action for John — a one-field update, not a rebuilt admin UI. Fully
automatic stage detection is a real future upgrade once there's an actual
signal to hook (e.g. a git push to a client's site repo, or a Vercel
deployment webhook) — not invented here.

### Explicitly out of scope for v1

- **Inbound reply triage** ("flags John only when a client reply needs a
  real decision") — the harder, riskier half of the roadmap line. Deciding
  whether a client's reply needs a real decision is a real classification
  problem, not a status-email templating problem; wiring it to whatever
  inbox John actually uses day-to-day is a separate, bigger piece of work.
  Deferred rather than half-built.
- **Automatic detection of design/build/review completion** — see above.
- **Testimonial capture** — that's its own, later roadmap item (Phase 5).

### Data model (as built — see supabase-schema.sql for the real thing)

```sql
create table client_projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  stage text not null default 'paid',
  stage_updated_at timestamptz default now(),
  payment_type text not null,       -- 'deposit' | 'package' — see finding below
  tier text,                        -- only known for the package flow
  business_name text,               -- unknown at payment time either way
  contact_email text,
  amount_total integer,
  currency text,
  stripe_session_id text unique,
  live_url text
);
```

No `intake_stage2_id` link after all — see the `/brief` finding below;
the real brief flow doesn't go through `intake_stage2`.

### Suggested build breakdown

- **Prompt 1 — Data model + the payment confirmation.** Create
  `client_projects`, wire the Stripe webhook to create a row on
  `checkout.session.completed` (in addition to, not instead of, the
  existing internal notification), and send the client their first-ever
  automated email: a brand-consistent payment confirmation with what
  happens next. This alone closes the biggest gap found above.
- **Prompt 2 — Brief-received stage + manual stage-advance + remaining
  templates.** Wire `/api/intake` to advance the stage and email the
  client; build the small manual stage-advance action for the three
  stages with no code signal; write the `in_design`/`in_build`/
  `ready_for_review`/`live` email templates, all in the same brand voice
  as everything else (Direct, Confident, sentence case, "Evolution Media"
  in full, no exclamation-mark abuse).
- **Prompt 3 — Verification pass.** A real Stripe test-mode checkout
  through to a real brief submission, confirming every email actually
  sends and renders correctly (checked directly, not assumed), plus the
  edge case the current fallback already half-covers: deposit paid but no
  brief ever submitted.

### Prompt 1 — done (2026-09-05)

Built `client_projects` (see `supabase-schema.sql`), `lib/supabaseAdmin.ts`
(service-role client), `lib/clientEmail.ts` (brand-consistent email
template + `sendClientEmail`), `lib/clientProjects.ts`
(`createClientProjectFromPayment`, idempotent on `stripe_session_id` so a
Stripe webhook redelivery doesn't create a duplicate row or double-send
the email), and wired all of it into `app/api/webhooks/stripe/route.ts`
alongside the existing internal-only notifications (kept, not replaced).

**Two real findings changed the plan while building this, not before:**

1. **There are two live payment paths, not one.** Reading
   `app/api/checkout/route.ts` and `app/actions/create-checkout-session.ts`
   side by side: a visitor can either pay a flat deposit (unlocks
   `/start-your-project`) *or* pay a tier's full price directly from the
   pricing section on the homepage (`app/checkout/success` — a static
   "we'll be in touch" page, no brief flow triggered at all). The original
   scope only accounted for the deposit path. Fixed by renaming the first
   stage from `deposit_paid` to `paid` and adding a `payment_type` column
   (`'deposit' | 'package'`) — both paths now create a `client_projects`
   row and both get a client-facing confirmation email, worded
   appropriately for which one it was.
2. **There are two separate, inconsistent "brief" flows live in the
   codebase**, not one: `/start-your-project` → `StartYourProjectForm` →
   `/api/intake` (email-only, no DB write, gated behind a paid Stripe
   session — this is the one real clients actually reach) and a second,
   completely separate `/brief` → `BriefForm` → `submitIntakeStage2`
   (writes to `intake_stage2` + an optional Notion push, fully wired up,
   but **linked from nowhere in the app** — confirmed via a repo-wide
   search for `href="/brief"`). The original scope assumed
   `/api/intake` writes to `intake_stage2`; it doesn't, and the table that
   does get written to is orphaned. This directly affects Prompt 2 (which
   needs to add a DB write to whichever brief flow is real) and is
   flagged separately as its own housekeeping item — not silently touched
   here, since fixing or removing it isn't this task's job.

**Security decision made while building, not left to a sketch:**
`client_projects` holds payment/PII (email, amount, Stripe session id).
The existing tables' RLS pattern (`anon` insert + `service_role` full
access) is safe for *write-only* form tables, but this table also needs
to be *read back* by server code — an anonymous SELECT policy would let
anyone holding the public anon key enumerate every client's email and
payment info from the browser. So `client_projects` gets **no anonymous
policy at all**: service-role only, via a new `lib/supabaseAdmin.ts`
(requires `SUPABASE_SERVICE_ROLE_KEY`, documented in `.env.example`,
server-only — never `NEXT_PUBLIC_*`).

**Verified:**
- `npx tsc --noEmit` — clean.
- Both email templates (deposit and package) rendered for real via `tsx`
  and viewed in a real browser at a realistic viewport — brand-consistent,
  correct copy, working CTA link, no layout bugs. (An initial screenshot
  at a narrower viewport showed what looked like clipped text; checked the
  actual computed styles and DOM directly — `overflow: visible`,
  `scrollWidth === clientWidth === 560`, full text present — confirmed
  that was a rendering-tool artifact at that viewport size, not a real
  bug, before trusting the wider-viewport screenshot instead of guessing.)
- The Stripe webhook route itself, end-to-end: generated two real,
  correctly-signed `checkout.session.completed` payloads (one deposit,
  one package) with the Stripe SDK's own test-signature helper, POSTed
  them to an isolated local dev server, and confirmed both returned
  `200` with the expected control flow (signature verified, correct
  branch taken, `createClientProjectFromPayment` failing closed and
  logging clearly — not crashing — when Supabase isn't configured).
- **What couldn't be verified here:** a real Supabase insert and a real
  Resend delivery — this sandbox's `.env.local` has Stripe keys but no
  `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY`. That needs testing
  wherever those secrets actually live (production/Vercel, or a fully
  filled-in local `.env.local`) before this ships for real.

### Prompt 2 — done (2026-09-05)

Wired `/api/intake` (the real brief endpoint, reached from
`/start-your-project`) to call a new `markBriefReceived()` — advances the
`client_projects` row to `brief_received`, backfilling `business_name`
and `contact_email` (neither known at payment time), matched by the
`stripeSessionId` the form already threads through. On success, sends the
client the "Brief received" confirmation email — mirroring the copy
already shown on-page after a successful submission, so the client has
the same message as a written record even if they close the tab. Kept
strictly best-effort and placed after the existing internal-notification
email, same as Prompt 1's philosophy: this endpoint's real job (telling
John) must not regress if the new pipeline logic fails for any reason.

Built the small manual stage-advance action for the three stages with no
code signal (`in_design`, `in_build`, `ready_for_review`) plus `live` —
`scripts/advance-project-stage.ts`, a one-command CLI
(`npx tsx --env-file=.env.local scripts/advance-project-stage.ts
<stripe_session_id> <stage> [live_url]`), following this repo's existing
`scripts/capture-portfolio.mjs` precedent rather than inventing a new
admin-UI pattern. Looks up the project, updates its stage, and sends the
matching brand-consistent email — all four email templates written to
the same voice as everything else. Added `tsx` as a devDependency (this
repo had none yet; needed to reuse `lib/clientEmail.ts`/
`lib/clientProjects.ts` directly from a script rather than duplicating
the brand-email logic a second time).

**Verified:**
- `npx tsc --noEmit` — clean.
- The stage-advance script's validation paths, run directly: missing
  args, an unknown stage, `live` without a `live_url`, and "Supabase not
  configured" — all exit 1 with a clear, specific message.
- All 5 remaining email templates (brief received, in design, in build,
  ready for review, live — including the "live" one's working link)
  rendered for real via `tsx` and viewed in a browser at a correct
  viewport — brand-consistent, correct copy, no layout bugs.
- `markBriefReceived()` called directly against an unconfigured Supabase
  client — logs clearly and returns `null` rather than throwing, same
  contract as Prompt 1's `createClientProjectFromPayment`.
- **Still not verified here, same boundary as Prompt 1:** a real
  Supabase update or a real Resend send for either the brief-received
  email or any of the four manual-stage emails — this sandbox has neither
  `SUPABASE_SERVICE_ROLE_KEY` nor `RESEND_API_KEY`. Needs a real run
  wherever those secrets live before this ships.

Item 7 is now feature-complete for v1 (all 6 stages have a path from
payment through to live, either automatic or one manual command).
Prompt 3 (verification pass with real secrets in a real environment) is
what's left before calling it fully done.

## Item 8 — CMS Panel (deferred build, decisions only)

Per the pricing table: "Reusable admin template; client edits text/images/
posts without touching WordPress or similar," €350 per client.

**Real gap this scoping pass found:** there is no shared client-site
codebase to add a CMS panel *to* — every delivered site is its own repo.
Building a "reusable" admin now means guessing its shape (single
Supabase project shared across all client sites vs. one per client; what
content model — free-form blocks vs. fixed fields; how auth works per
client) with zero real cases to validate against.

**Decision:** build the first real one directly into the next client site
that actually needs it, as a normal one-off feature of that build — keep
it reasonably clean but don't over-engineer for reuse prematurely. Extract
a shared template/package only once a second client needs the same thing,
at which point the two real implementations will show what's actually
common versus what only looked common in the abstract.

**Open questions to answer only when that first real case exists** (not
now):
- One Supabase project per client site, or one shared project with
  per-client schemas/row-level security?
- Content model: fixed fields per page (simpler, less flexible) vs.
  generic content blocks (more flexible, more to build)?
- Auth: Supabase Auth (magic link, matches the stack already in use) is
  the obvious default whenever this gets built for real.

## Item 9 — Agent-Driven First Draft Generation (deferred build, decisions only)

Per the roadmap: client checks out, answers the structured brief, an agent
generates a first-pass draft (layout, copy, imagery, brand colors), then
**pauses for John's approval** before anything moves to deployment — not
fully autonomous.

**Real head start already in place:** `intake_stage2` already collects
almost everything this needs — `brand_colours`, three reference-site
fields, `sections_needed`, `key_competitors`, `what_makes_different`,
`functionality_needed`. The brief schema likely doesn't need to change for
this; the gap isn't the input, it's the output.

**Real gap:** a "first draft" needs a codebase to land in, and (per Item
8's finding) there isn't a shared one yet. This is also the most
speculative, longest-horizon item in the entire 12-tool roadmap (marked
🔵, longest horizon, in the original planning doc) — it depends on Item 7
being live (so there's a pipeline stage to pause at) and effectively on
Item 8 existing in some form (so a draft has somewhere consistent to go).

**Decision:** don't scope this as a standalone automated tool yet. For the
next real client, the actual "v1 agent" is this exact workflow used
directly — hand the real brief to Claude Code/Cursor as the input to a
guided build, the same way every tool in `evomedia-tools` was built this
session (scope → build → verify against something real). Once that's been
done for two or more real clients and a repeatable shape is visible,
*that* is what gets formalized into an actual agent/pipeline step —
not before.

## Build order

Item 7, in full, now (see its Prompt 1-3 breakdown above). Items 8 and 9
wait on a real client to build the first instance against — revisit each
the moment that client exists, not on a fixed schedule.
