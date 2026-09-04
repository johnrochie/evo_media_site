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

### Pipeline stages (v1)

```
deposit_paid → brief_received → in_design → in_build → ready_for_review → live
```

Derived from the two real intake stages that already exist, plus the
roadmap's own example. Two of these six already have a real code signal
to trigger off automatically:

- `deposit_paid` — the existing Stripe webhook, `checkout.session.completed`
- `brief_received` — the existing `/api/intake` route (Build Brief Form
  submission)

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

### Data model (sketch)

```sql
create table client_projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  stage text not null default 'deposit_paid',
  stage_updated_at timestamptz default now(),
  business_name text not null,
  contact_email text not null,
  tier text,                        -- from Stripe session metadata
  stripe_session_id text,
  intake_stage2_id uuid references intake_stage2(id),
  live_url text
);
```

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
