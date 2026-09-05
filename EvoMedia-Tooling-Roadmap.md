# EvoMedia Toolkit Roadmap

Planning doc for the full-lifecycle AI toolkit sitting behind EvoMedia — lead gen, brief, build, deployment, handover, and post-launch. Captured from planning session, 2 Sept 2026.

---

## Status key
- 🟢 Near-term (build next)
- 🟡 Mid-term (once near-term items are live)
- 🔵 Future / longer horizon

---

## 1. Lead Generation

### 🟢 Scheduled Autonomous Lead Discovery + CRM Pipeline
The big one. Runs on a schedule (e.g. hourly / every 12h):
- Agent searches for target keywords + area
- Pulls candidate business websites
- Runs each through SiteAnalyser (once refined)
- Flags strong redevelopment candidates
- Auto-creates lead in CRM (Notion, for now)
- **Open question:** workload/rate limiting, keyword list management, dedup against existing prospects

### 🟡 Competitor Benchmarking (bolt-on to lead gen)
When SiteAnalyser flags a prospect:
- Pull 2–3 competitors in same town/niche with strong sites
- Sharpens outreach hook: "your competitor down the road has a modern site and you don't"

---

## 2. Build Tooling

### 🟢 Site Scraper / Asset Extractor
- Playwright-based tool
- Takes a copy of an old client site: text, images, structure, data
- Feeds extracted assets into the new redesign build process
- (Already scoped in a prior chat — needs to be pulled into this roadmap properly)

### 🟡 Auto-Audit Tool
- Refinement of SiteAnalyser as a standalone audit deliverable (not just lead scoring)
- Could double as a prospecting asset and a sales tool during the brief phase

### 🟡 Before/After Visual Generator
- Automated screenshot / mockup generator showing old site vs proposed redesign
- Strong persuasion asset for outreach and proposals

### 🔵 Agent-Driven First Draft Generation (human approval gate)
- Client checks out → answers structured brief
- Agent generates first-pass site draft: layout, copy, imagery, brand colors
- Pauses for John's approve/adjust before anything moves to deployment
- Not fully autonomous — deliberate human checkpoint before go-live

---

## 3. Onboarding / Sales

### 🔵 Domain Registration + Auto-Onboarding
- Client lands on site, registers domain directly (reseller-style, like old host-scanner days)
- Feeds automatically into onboarding pipeline — no manual back-and-forth
- Needs registrar API relationship — future phase, not urgent

---

## 4. Client Management / Post-Launch

### 🟡 Automated Client Communication & Status Agent
- Drafts/sends status updates automatically as project moves through pipeline stages ("your site is in design, here's a preview")
- Flags John only when a client reply needs a real decision

### 🟢 Post-Launch Monitoring Agent
- Pings live client sites periodically: uptime, broken links, outdated info
- Natural upsell hook into the monthly managed/hosting tier
- Directly answers the market gap seen in RFP presentations (agencies charging €2.5–3k/year for maintenance that should cost a fraction of that)

---

### 🟢 Automated Proposal / Quote Generator
- Once a lead is qualified, agent pulls SiteAnalyser audit findings
- Auto-drafts a personalized one-page proposal with pricing
- Removes a big chunk of manual admin time per lead

### 🟡 Review / Testimonial Capture Flow
- Once a client site goes live, automatically prompts client at the right moment for a testimonial or Google review
- Social proof is high-value for a young brand and easy to let slip when busy

### 🟡 Content Refresh Agent (managed tier clients)
- Periodically suggests small copy/image updates to keep a live site feeling current
- Reinforces the managed/maintenance tier upsell story

---

## Market Context (from RFP presentations, to review further)
- Comparable agencies quoting **€15–25k** for a redesign of an existing (old, needs updating) site
- **€2.5–3k/year** for maintenance/hosting — seen as disproportionate to actual hosting costs
- Reinforces EvoMedia's core wedge: same/better outcome via AI tooling, at a fraction of the cost, while still preserving healthy recurring revenue via managed tier
- **Next step:** John to share the actual RFP presentation decks for review — check for tooling/positioning ideas not yet captured here

---

---

## Pricing Structure (revised — planning session, 3 Sept 2026; supersedes 2 Sept version below where they conflict)

### Model shift: CMS now standard, license model for premium modules

Two structural changes from the original pricing pass:

1. **CMS panel is now included as standard on every site**, not a paid add-on. Rationale: reduces manual "can you change this text" support requests over time (John's own admin overhead), removes a decision point from the sales conversation, and every client running the same reusable admin core means improvements benefit everyone at once. Tier prices increased slightly to absorb this rather than giving it away for free.
2. **Higher-effort, reusable-core modules move to a setup fee + recurring license model**, instead of a flat one-time fee. Applies specifically to modules with real ongoing liability/maintenance burden and a reusable core (booking, e-commerce, and any future module built the same way) — **not** the low-effort/low-risk modules (click-to-call, gallery, newsletter, etc.), which stay flat one-time as before. The "license" is effectively an activation key/flag on EvoMedia's reusable module code, not a per-client rebuild — same architecture as before, different commercial wrapper. This also means a module can be bundled into a build from the start, or activated later as an upsell, using the same mechanism.

### Tiers

**Tier 1 — One-Page Scroller: 599 euro** *(was 499)*
- Single page, unlimited sections (undefined cap currently)
- SEO basics included (automated)
- GDPR-compliant cookie consent + privacy/cookies pages included
- **CMS panel included as standard** (custom Supabase admin — client edits text/images/posts without touching WordPress or similar)
- Effectively a static site — this build becomes the template/engine for Tier 2

**Tier 2 — Multi-Page Site: 949 euro** *(was 799)*
- Up to approx. 10-15 pages (exact cap still to be finalized)
- Standard pages: home, about, services, contact (with working contact form)
- **CMS panel included as standard**
- Same quality bar as Tier 1, just more structure/scale — no advanced functionality bundled in beyond CMS
- Extra pages beyond the cap: 35 euro per additional page
- Tier 1's build does the heavy lifting — additional pages are template tweaks, not fresh builds

### Modules — flat one-time (low effort/risk, unchanged model)

| Module | Price | Notes |
|---|---|---|
| Click-to-call / WhatsApp button | 50 euro | Minimal setup, wiring a button to phone/WhatsApp link |
| Gallery / portfolio (lightbox viewer) | 75 euro | Template-driven, low risk — suits trades, creatives |
| Newsletter signup + integration | 50 euro | Plug into email service, add signup form |
| Analytics dashboard (simple, self-owned) | 75 euro | Supabase-based visits/enquiries view, not Google Analytics — GA integration flagged as a future managed-tier upsell |
| Review / testimonial display widget | 75 euro | Pulls Google reviews, styled display component |
| Blog / news section | 150 euro | CMS-style backend logic, single content type |
| Multi-language module | 100 euro per additional language | Translation + language switch logic |

### Modules — setup fee + recurring license (high effort/risk, reusable core)

| Module | Setup fee | License | Notes |
|---|---|---|---|
| AI chatbot (customer Q&A + lead capture) | 175 euro | 10 euro/month | Already fit this pattern before the shift — monthly fee covers AI token/API costs, not a revenue line itself |
| Booking / appointment system | **249 euro** *(was 600)* | **200 euro/year, or ~20 euro/month** | Premium liability item (double-booking etc.) — recurring license reflects ongoing support/maintenance, not just build cost. Core built against 2 pilot clients, reusable IP over time. Monthly priced slightly above annual÷12 to nudge toward annual. |
| E-commerce add-on (small catalog) | **~199 euro** *(was 450 — proposed, not yet confirmed)* | **~250 euro/year, or ~25 euro/month** (proposed) | Same reusable-core logic as booking (cart/checkout/Stripe built once, per-client work is catalog population + styling). Numbers here are a proposed mirror of the booking model — confirm with John before treating as locked. |
| *Any future high-effort/reusable module* | case-by-case | annual ÷ 12 + a little extra for monthly | Standing rule going forward, not just for booking/e-commerce |

### Pricing Philosophy
- Not competing with high-end agencies quoting 15-25k+ for redesigns, or 2.5-3k/year maintenance — that's the wedge EvoMedia exploits
- Target market: independent traders, small businesses (tradesmen, bars, restaurants, salons) — not enterprise/large chains (for now)
- CMS is now a baseline expectation, not an upsell — reduces John's own ongoing admin load as client volume grows, which matters more than the lost one-off CMS revenue line
- Low-effort/low-risk modules stay flat one-time (50-150 euro); high-effort/reusable-core modules (booking, e-commerce, future equivalents) carry a setup fee + recurring license instead of a single flat fee, reflecting genuine ongoing liability and support burden
- Booking and e-commerce (and future modules built the same way) are EvoMedia-owned reusable systems — the license is an activation mechanism on that shared codebase, not bespoke per-client work, so setup fees can be lower than before since revenue is now also recurring

### Open Questions
- Exact page cap for Tier 2 (10 vs 15 pages) — not yet finalized
- E-commerce setup fee + license figures are proposed by mirroring the booking model — need explicit confirmation, not yet locked in the way booking's numbers are
- Whether existing/pipeline clients (if any signed under the old one-time CMS/module pricing) need any transition handling, or this only applies going forward
- How the license "activation key" is technically implemented (env flag, DB record, license table) — a build decision for whoever builds the CMS/module system, not yet specified here

---

<details>
<summary>Original pricing structure (2 Sept 2026) — superseded, kept for reference</summary>

**Tier 1 — One-Page Scroller: 499 euro**
- Single page, unlimited sections (undefined cap currently)
- SEO basics included (automated)
- GDPR-compliant cookie consent + privacy/cookies pages included
- Effectively a static site — this build becomes the template/engine for Tier 2

**Tier 2 — Multi-Page Site: 799 euro**
- Up to approx. 10-15 pages (exact cap still to be finalized)
- Standard pages: home, about, services, contact (with working contact form)
- Same quality bar as Tier 1, just more structure/scale — no advanced functionality bundled in
- Extra pages beyond the cap: 35 euro per additional page
- Tier 1's build does the heavy lifting — additional pages are template tweaks, not fresh builds

**Modules — add-ons available on top of either tier**
Reusable, built once by EvoMedia as owned IP, reconfigured per client. Priced on effort/risk, not a flat rate.

| Module | Price | Notes |
|---|---|---|
| Click-to-call / WhatsApp button | 50 euro | Minimal setup, wiring a button to phone/WhatsApp link |
| Gallery / portfolio (lightbox viewer) | 75 euro | Template-driven, low risk — suits trades, creatives |
| Newsletter signup + integration | 50 euro | Plug into email service, add signup form |
| Analytics dashboard (simple, self-owned) | 75 euro | Supabase-based visits/enquiries view, not Google Analytics — GA integration flagged as a future managed-tier upsell |
| AI chatbot (customer Q&A + lead capture) | 175 euro + 10 euro/month | Monthly fee covers low AI token usage/API costs, not a revenue line itself |
| Review / testimonial display widget | 75 euro | Pulls Google reviews, styled display component |
| Blog / news section | 150 euro | CMS-style backend logic, single content type |
| Multi-language module | 100 euro per additional language | Translation + language switch logic |
| CMS panel (custom Supabase admin) | 350 euro | Reusable admin template; client edits text/images/posts without touching WordPress or similar |
| Booking / appointment system | 600 euro (base, may reduce over time) | Premium — high liability if it breaks (double-booking etc.); building core version against 2 pilot clients; reusable IP over time |
| E-commerce add-on (small catalog) | 450 euro (base, may reduce over time) | Reusable core (cart/checkout/Stripe) — per-client work is mainly catalog population + styling |

</details>

---

---

## Build Sequencing (locked in — planning session, 2 Sept 2026)

**Guiding principle:** Build in revenue-first order, not pain-first order. There's no existing client volume creating manual pain yet, so the priority is filling the pipeline and generating revenue first. Once real client volume exists, it will surface the actual bottlenecks worth solving next, rather than guessing at them now.

**Tooling approach across all phases:**
- **Claude Code** — backend work, heavy logic, core system building
- **Cursor** — customer-facing frontend work
- **Claude (Design)** — visual/UI design work, slotted in ahead of frontend build where relevant
- Consistent with John's existing three-layer Cursor methodology (prompt to arrow SCAFFOLD.md to arrow .cursorrules)

### Phase 1 — Fill the Funnel
1. **Scheduled Autonomous Lead Discovery + CRM Pipeline** — build first. Nothing else matters until there are prospects flowing in.

### Phase 2 — Process What the Funnel Brings In
2. **Site Scraper / Asset Extractor**
3. **Auto-Audit Tool** (refined SiteAnalyser)
4. **Automated Proposal / Quote Generator**

### Phase 3 — Sharpen the Pitch (dual-purpose: outreach + own marketing content)
5. **Before/After Visual Generator** — also doubles as content for EvoMedia's own social/paid campaigns (Instagram, etc.)
6. **Competitor Benchmarking** (bolt-on to lead gen/audit)

### Phase 4 — Client Handoff & Build Speed
7. **Automated Client Communication & Status Agent** — natural handoff point once a prospect becomes a client
8. **CMS Panel** (custom Supabase admin) — also a priced module, but build the reusable core here
9. **Agent-Driven First Draft Generation** (human approval gate)

### Phase 5 — Post-Launch Tail
10. **Post-Launch Monitoring Agent**
11. **Review / Testimonial Capture Flow**
12. **Content Refresh Agent** (managed tier)

### Future / Not Sequenced Yet
- **Domain Registration + Auto-Onboarding** (reseller-style) — long horizon, needs registrar API relationship, revisit later

---

---

## Phase 1 Build Notes — Lead Discovery Engine (in progress)

### Search approach
- **Starting approach:** Direct Playwright-based browser search against Google, at low volume (approx. hourly, ~24 searches/day)
- **Rationale:** At this volume, well within normal human browsing behavior, unlikely to trigger Google's bot detection (which looks for rapid-fire requests, missing browser headers/JS execution, flagged datacenter IPs — no published hard threshold, deliberately vague)
- **Cost-first principle:** Keep investment at zero to start. Prove the concept works before paying for anything.
- **Fallback:** If CAPTCHAs / rate limiting start appearing, move to a paid search API (e.g. SerpAPI or similar third-party wrapper) — typically a few cents to ~10 cents per query with a free tier. At 20-50 searches/day this would only be a couple of dollars/day, trivial against the value of one converted client. Revisit pricing properly if/when this becomes necessary.

---

### Filtering step (pre-analyzer)
- **Decision:** Filtering happens as its own lightweight step, BEFORE SiteAnalyser runs — not absorbed into the analyzer itself
- **Rationale:** Analyzer does heavier scoring work (design, performance, structure) — don't waste that compute on obvious non-candidates. Keeping filtering separate also means filter rules can be tuned/swapped independently without touching analyzer core logic.
- **What gets filtered out:**
  - Known social media / directory domains (Facebook, Instagram, LinkedIn, Yelp, etc.) — excluded outright
  - Large/established brands and chains — signal via domain age, backlink profile, and/or cross-check against a known list of major chains for the search category
- **Pipeline shape so far:** Search (Playwright/Google) to arrow Filter (exclude social/directories/big brands) to arrow SiteAnalyser scoring to arrow Lead created in CRM

---

---

## Infrastructure / Hosting Approach (locked in — planning session, 2 Sept 2026)

- **Where it runs:** John's own self-hosted machines at home (24/7 uptime, plenty of bandwidth/headroom, currently running other services e.g. an on-rate system, a limit system). Full control, zero ongoing hosting cost — fits EvoMedia's lean/low-overhead philosophy.
- **Containerization:** Docker containers per service/tool (search+filter script, SiteAnalyser, etc.) — isolated, independently updatable, portable to another machine or cloud later without rebuilding.
- **Scheduling:** Lightweight scheduler (e.g. cron job or simple scheduler container) triggers the lead discovery run on the target cadence (~hourly).
- **Rationale:** Keeps infrastructure investment at zero while validating the pipeline; containers mean any future migration (e.g. to cloud, or scaling up) is a lift-and-shift rather than a rebuild.

---

## Open Questions / Not Yet Decided
- Sequencing/prioritization across all items above
- CRM choice for the lead pipeline (Notion currently used for client briefs — same system or separate?)
- Rate limits / cost management for scheduled search + scraping agents
- How "human checkpoint" gates get surfaced to John in practice (Notion? Slack? email digest?)
