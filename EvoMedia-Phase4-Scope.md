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
  brief ever submitted. Needs real secrets this build's sandbox didn't
  have — see [EvoMedia-Phase4-Prompt3-Checklist.md](EvoMedia-Phase4-Prompt3-Checklist.md),
  a step-by-step checklist to run wherever those secrets actually live.

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
what's left before calling it fully done — see
[EvoMedia-Phase4-Prompt3-Checklist.md](EvoMedia-Phase4-Prompt3-Checklist.md).

## Item 8 — CMS Panel (deepened scope 2026-09-05; still no build — see below)

Per the pricing table: "Reusable admin template; client edits text/images/
posts without touching WordPress or similar," €350 per client.

Re-confirmed with the user (2026-09-05) before deepening this: there's no
real client/site to build the first instance against yet, so this stays
the same "decisions + open questions, build deferred" shape Item 9 also
has — just with the decisions worked through further, and one more real
finding underneath them.

### What it does

Today, a client's finished site is finished — any text or image change
means asking John (or Cursor) to edit and redeploy. The CMS Panel is a
small admin area *inside the client's own delivered site* (not part of
`evo_media_site`) where the client logs in and edits their own text and
images directly — the €350 module the pricing table already prices,
reused per client rather than built bespoke each time.

### A second real finding, underneath the first

Phase 4's original scope found there's no shared client-site template.
Looking at an actual delivered site now (`dental-practice`, checked via
the GitHub API) surfaces a deeper one: it's a plain Next.js/React/
Tailwind app with **zero backend** — no Supabase, no database, nothing.
Its `lib/` folder holds exactly one file, `colors.ts` (brand color
tokens) — every piece of actual page content (headings, service
descriptions, copy) is hardcoded directly inside JSX components, not
pulled from any data layer at all.

That matters for sequencing: a CMS panel isn't just "add an admin route"
to a site like this — it means retrofitting content out of JSX and into
a database for every page it should cover, which is real, nontrivial
work independent of building the admin UI itself. **This makes it far
cheaper to build a CMS panel into a site from day one of that site's
build** (writing components to read from Supabase from the start) **than
to retrofit it into an already-delivered, hardcoded site after the
fact.** Worth factoring into which real client this gets attached to
first — a new build is a much smaller lift than a retrofit.

### Decisions (defaults set now, to revisit against the real first case)

These aren't left fully open anymore — each has a reasoned default below
— but none are built, and the real first case may still reasonably
override any of them.

1. **One shared Supabase project across all client sites, not one project
   per client.** A brand-new Supabase project per €350 sale doesn't scale
   operationally (one more project to provision, monitor, and pay for
   per client) or financially (most paid tiers price per-project). A
   single project with every client's content scoped by a `site_id`
   column and RLS policies keyed to that column is the standard
   multi-tenant pattern RLS exists for, and it's a *different* Supabase
   project from `evo_media_site`'s own (that one holds Evolution Media's
   own intake/pipeline data — a client's site content is a separate
   concern, not something to mix into that database).
2. **Fixed fields per page, not a generic content-block system.** Given
   the retrofit finding above, the realistic v1 scope is "replace the
   specific hardcoded strings and images a site already has" — a `pages`
   table keyed by slug with named fields matching that site's actual
   sections (hero headline, about text, services list, contact details),
   not a general-purpose page-builder. Same reasoning this whole repo
   already applies elsewhere (no JS-rendering in `shared/analyzer.mjs`,
   no brand-color extraction in `site-scraper`): don't build the general
   version before one specific, real version has proven what's actually
   needed.
3. **Auth: Supabase Auth, magic link, to the client's known contact
   email** — no real ambiguity here, it's already the stack in use
   everywhere else and needs no separate password to manage. v1 assumes
   one authorized editor per site, not multi-user roles (see below).
4. **Images: Supabase Storage**, one bucket, each client's files under
   their own path prefix (`<site-slug>/...`) — same project as the
   content table, no separate service to wire up.
5. **Rendering: plain server-side fetch on each request** (Next.js Server
   Components already do this by default), not ISR/caching. A small
   business site's traffic and edit frequency don't justify cache-
   invalidation complexity before there's a real performance reason to
   add it.

### Explicitly out of scope for v1

- **Multi-user roles/permissions** — one authorized editor per site is
  enough until a client asks for more.
- **Draft/preview before publish** — v1 is "save = live," the simplest
  correct model; add a draft state only once someone actually needs to
  stage a change before it goes out.
- **Version history / undo** — real, useful, and deliberately not v1.
- **A generic drag-and-drop page builder** — see decision 2 above.

### Suggested build breakdown (whenever a real client triggers this)

- **Prompt 1** — the shared `site_content` table + RLS (scoped to the
  first real client's `site_id`), retrofit that site's first page (most
  likely the homepage) to read its content from Supabase instead of
  hardcoded JSX, and a minimal `/admin` (magic-link login + one edit
  form for that page's fields). Verify by actually editing content
  through the form and confirming the live site updates.
- **Prompt 2** — image upload/replacement via Supabase Storage, extend
  the same pattern to the rest of that site's pages.
- **Prompt 3** — verification pass with the actual client using it for
  real, and — the point of deferring this in the first place — write
  down what turned out to actually generalize versus what only looked
  reusable in the abstract, ready for when a second client needs the
  same thing.

## Item 9 — Agent-Driven First Draft Generation (deepened scope 2026-09-05; still no build)

Per the roadmap: client checks out, answers the structured brief, an agent
generates a first-pass draft (layout, copy, imagery, brand colors), then
**pauses for John's approval** before anything moves to deployment — not
fully autonomous.

### Correction to the earlier scope

The original pass here cited `intake_stage2` as the brief this would work
from. **That's wrong, and Item 7's Prompt 1 is why it's now known to be
wrong:** `intake_stage2` belongs to the orphaned `/brief` page (flagged
separately as `task_f576d7c6`), not the real, live brief flow. The real
one is `StartYourProjectForm` → `/api/intake` — its actual fields are
`businessName`, `industry`, `description`, `existingDomain`, `logoNote`,
`colours`, `inspiration`, `pagesNeeded`, `existingContent`, `photos`,
`functionality`, `contactName`/`contactEmail`/`contactPhone`. Still a
reasonable head start (business description, desired pages, color/style
preferences, reference sites, existing copy) — just the wrong table name
attached to it before.

### A sharper real gap than "no codebase to land in" — fixed 2026-09-05

**The real brief content wasn't persisted anywhere queryable — only as
an email body.** Item 7's Prompts 1-2 only persisted `business_name` and
`contact_email` onto `client_projects`; every other field (`industry`,
`description`, `colours`, `inspiration`, `pagesNeeded`,
`existingContent`, `photos`, `functionality`) existed only in the
internal notification email John receives, nowhere in the database.
Whenever Item 9 gets built, it needs a structured brief to read — an
email body isn't that. This was small and mechanical enough to just fix
rather than leave as a recommendation: `client_projects` now has a
`brief jsonb` column, populated by `markBriefReceived()` alongside the
`business_name`/`contact_email` backfill it already did. Useful
immediately as an actual record of what a client asked for; also now
what Item 9 will read from whenever it's built. (Needs the same real-
secrets verification as everything else in Item 7 — see the checklist.)

**A second, more specific version of Item 8's dependency:** it's not
just that a first draft needs "somewhere to land" — it's that *what
shape that landing spot takes* determines whether this is even
tractable. Generating a full, arbitrary site's worth of React/TSX code
well is a hard, high-risk automation target. Filling in known fields on
Item 8's eventual fixed-fields-per-page content model (hero headline,
about text, services list — decision 2 in Item 8's scope) is a much
closer match to what an LLM already does reliably. **Item 9 isn't
just gated on Item 8 existing — it specifically needs Item 8's
content-model shape to exist first**, because that's what turns "generate
a website" into the far more tractable "fill in a known schema from a
brief." This sharpens (not just repeats) the existing Phase 4 build
order — Item 8 genuinely has to come first in substance, not just in
the roadmap's listed order.

**A real connection to Phase 2, not yet exploited:** for a client with
`hasCurrentWebsite = true` and an `existingDomain`, the brief's own text
description isn't the only real material available — `site-scraper`
already knows how to pull that domain's actual text/images/structure.
Feeding that extraction into a first draft (as source material to
rewrite/modernize, not copy verbatim) is a much richer starting point
than the brief's free-text fields alone, and the tool to do it already
exists. Worth designing in whenever this is actually built, not
something to build now.

### Explicitly out of scope for v1

- **Automatic image sourcing/generation.** Same category of deferred
  problem as `before-after-generator`'s own "no image-guessing, always
  the clean placeholder" call — a first draft uses the client's own
  photos (already asked for via the `photos` brief field) or a
  placeholder, not AI-generated or scraped imagery.
- **Automatic full-site code generation.** Only tractable once there's a
  structured content model to fill in, not before (see above).
- **Skipping the human approval gate.** The roadmap is explicit this
  must not be fully autonomous — not something to revisit for
  convenience later.

### Decision (unchanged in substance, sharpened above)

Don't scope this as a standalone automated tool yet. For the next real
client, the actual "v1 agent" is this exact workflow used directly — hand
the real brief to Claude Code/Cursor as the input to a guided build, the
same way every tool in `evomedia-tools` was built this session (scope →
build → verify against something real). The unlock condition is now more
specific than "two real clients": it's **two real clients built on Item
8's content-model shape** — that's the point a repeatable, fillable
pattern actually exists to formalize into an agent/pipeline step, not
before.

### The natural integration point with Item 7, once this is real

Item 7's `ready_for_review` stage is currently a manual CLI command
(`scripts/advance-project-stage.ts`) because nothing today can tell it a
build is actually ready. Once Item 9 exists for real, "the agent finished
a draft" is exactly that signal — the natural end state is Item 9
finishing a draft, automatically triggering Item 7's existing
`ready_for_review` email, with John's approval automatically advancing to
`live`. Not building this connection now; noting it because Item 7 was
built in a shape that already accommodates it without rework.

## Build order

Item 7, in full, now (done, pending Prompt 3 — see above). Items 8 and 9
wait on a real client to build the first instance against — revisit each
the moment that client exists, not on a fixed schedule. Note the
sharpened dependency above: build the two in that order (8 before 9) for
substantive reasons now, not just because the roadmap lists them that
way.
