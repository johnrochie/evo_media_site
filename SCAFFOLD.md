# SCAFFOLD.md — Lead Discovery Engine

Persistent project context for the EvoMedia autonomous lead-discovery pipeline.
Reference with `@file` in Cursor / Claude Code prompts.

> This reflects **what is actually built** — Phase 1 is code-complete
> (search+filter, SiteAnalyser batch + SSRF, CRM sync, Docker + scheduler). It
> deviates from the original standalone-monorepo sketch — see *Deviations from
> the original sketch* at the bottom. Update this file as Phase 2 lands.

---

## Project purpose

Autonomous lead discovery for EvoMedia's €499 website service:

```
Search (Playwright/Google)  →  Filter (drop social/directories/chains)
      →  SiteAnalyser scoring (batch, SSRF-guarded)  →  create/update lead in Notion CRM
```

Intended to run unattended on a schedule (~hourly, ~24 runs/day) on John's
self-hosted home infrastructure. Fully backend — no customer-facing frontend.

Each stage is a **standalone, manually-runnable script** first; scheduling and
containerisation come later (separate prompt — the `docker/` scheduler).

Build steps so far:

| Step | What | State |
|---|---|---|
| Search + filter | `scripts/lead-discovery/` | ✅ built |
| SiteAnalyser batch + scoring fixes | `website-upgrade-scanner-export/` | ✅ built |
| SiteAnalyser SSRF protection | `website-upgrade-scanner-export/ssrf.js` | ✅ built |
| CRM / lead record creation | `scripts/lead-crm/` | ✅ built — **needs Notion credentials** |
| Docker + scheduler (wires it all together) | `docker/` | ✅ built — **needs Notion creds in `docker/.env`** |

Phase 1 is code-complete. Remaining before it's live: create the Notion
integration + leads database, fill in `docker/.env`, `docker compose up -d`.

---

## Where the code lives

The pipeline spans **three locations** (not one monorepo):

### 1. Search + Filter — `scripts/lead-discovery/` (this repo)

Node ESM (`.mjs`), uses the `playwright` dev-dependency already in the repo.

```
scripts/lead-discovery/
├── run.mjs                        # CLI entry — orchestrates search → filter → output
├── search.mjs                     # provider-agnostic dispatcher: getSearchResults()
├── providers/
│   ├── google-playwright.mjs      # v1 default: real browser Google search, human pacing,
│   │                              #   consent = "Reject all" only, bot-check detection
│   └── serpapi.mjs                # drop-in paid-API alternative (same search() contract)
├── filter.mjs                     # filterCandidates() + loadFilterConfig()
├── config/
│   ├── excluded-domains.json      # social / directory / marketplace / builder domains
│   └── major-chains.json          # large chains, keyed by category ("_global" always applies)
├── lib/
│   ├── logger.mjs                 # leveled logger (LEAD_LOG_LEVEL / --verbose)
│   ├── human.mjs                  # sleep / jitter / human-type / scroll helpers
│   └── url.mjs                    # hostname + registrable-domain (eTLD+1) extraction
├── candidates.json                # OUTPUT (git-ignored)
└── README.md
```

Run:

```bash
npm run leads:discover -- --keyword "plumber" --location "Cork, Ireland" --verbose
# or:  node scripts/lead-discovery/run.mjs plumber "Cork, Ireland"
```

Key flags: `--category` (chain-list key, defaults to keyword), `--limit`,
`--provider google-playwright|serpapi`, `--out`, `--headful`, `--verbose`.
Env: `LEAD_SEARCH_PROVIDER`, `LEAD_LOG_LEVEL`, `SERPAPI_KEY`.

**Provider abstraction:** every provider in `providers/` implements
`search(query, opts) -> Array<{ url, title, rank }>`. To swap in a paid API,
add a module and register it in the `PROVIDERS` map in `search.mjs` — nothing
in `filter.mjs` or `run.mjs` changes.

### 2. SiteAnalyser (scoring) — `website-upgrade-scanner-export/` (this repo, git-untracked)

Separate Express app (CommonJS), extracted from
`website-upgrade-scanner-export.tar.gz`. Extended in Prompt 2 for batch use.

```
website-upgrade-scanner-export/
├── server.js                      # Express API (port 4005)
│                                  #   POST /api/analyze        single URL (unchanged shape)
│                                  #   POST /api/batch-analyze   takes candidates.json shape
│                                  #   POST /api/bulk-analyze    legacy { websites: [...] }, cap removed
├── analyzer.js                    # scoring core: analyzeWebsite(url, opts), scoreHtml(ctx)
│                                  #   deterministic, never throws, 6 criteria / 15 pts
├── ssrf.js                        # SSRF guard — private-IP rejection on request + every redirect
├── batch.js                       # runBatch(candidates, opts) — concurrency, isolation, summary
├── renderer.js                    # optional lazy puppeteer render for JS-only SPA shells
├── scripts/
│   ├── analyse-batch.js           # CLI: candidates.json → <name>.enriched.json
│   └── test-analyzer.js           # regression checks incl. SSRF (npm run test:analyzer)
├── CODE-REVIEW.md                 # review findings + batch/scoring/SSRF fixes
└── (public/, README.md, package.json, …)
```

Run the batch:

```bash
cd website-upgrade-scanner-export
npm run analyse:batch -- ../scripts/lead-discovery/candidates.json -v
# → ../scripts/lead-discovery/candidates.enriched.json   (git-ignored)
```

Flags: `--out`, `--concurrency` (3), `--delay`, `--timeout`, `--retries`,
`--limit`, `--render`, `-v`.

**SSRF protection (`ssrf.js`):** every fetch — single, bulk, batch, CLI — goes
through one guard. `localhost`, private/reserved IPv4+IPv6 ranges and cloud
metadata IPs are rejected, on the initial URL **and every redirect hop** (custom
DNS `lookup` on the HTTP agents, so the socket connects to the exact IP that was
checked). Blocked targets → `reachable:false`, `blocked:true`, `band:"blocked"`,
`error:"ESSRFBLOCKED"`. Escape hatch: `SSRF_ALLOWED_HOSTS` (comma-separated),
unset in production.

### 3. CRM sync — `scripts/lead-crm/` (this repo)

Node ESM. Pushes enriched leads into Notion. **Not yet runnable — needs a
Notion integration token + leads database id** (none configured in the repo;
`.env.example` shows the vars). The script validates the live database schema on
start and reports exactly what's missing rather than guessing.

```
scripts/lead-crm/
├── sync-to-notion.mjs             # CLI: candidates.enriched.json → Notion pages
├── notion.mjs                     # tiny fetch-based Notion REST client (no SDK)
├── lead-mapping.mjs               # candidate → Notion properties; schema resolver; URL dedupe
└── README.md                      # setup + the expected Notion database schema
```

```bash
npm run leads:crm -- scripts/lead-discovery/candidates.enriched.json
npm run leads:crm -- <file> --dry-run          # prints the mapping, no writes (works w/o creds)
```

Flags: `--database <id>`, `--band high,medium` (default = `needsUpgrade`),
`--limit`, `--no-update`, `--dry-run`, `-v`.
Env: `NOTION_API_KEY` / `NOTION_TOKEN`, `NOTION_LEADS_DATABASE_ID` /
`NOTION_DATABASE_ID`, `NOTION_API_BASE` (override, for testing).

---

## Data handoffs between steps

### 1. Search + Filter → `scripts/lead-discovery/candidates.json`

```jsonc
{
  "query":    { "keyword": "plumber", "location": "Cork, Ireland",
                "category": "plumber", "searchQuery": "plumber Cork, Ireland" },
  "provider": "google-playwright",
  "generatedAt": "2026-09-02T12:00:00.000Z",
  "counts":   { "found": 18, "candidates": 9, "rejected": 9 },
  "candidates": [
    { "url": "https://example-plumbing.ie/", "domain": "example-plumbing.ie",
      "title": "Example Plumbing Cork", "rank": 3 }
  ],
  "rejected": [
    { "url": "https://facebook.com/...", "domain": "facebook.com", "title": "...",
      "rank": 1, "reason": "excluded-domain:facebook.com" }
  ]
}
```

Rejection reasons: `unparseable-url`, `duplicate-domain`,
`excluded-domain:<d>`, `major-chain:<d>`.

### 2. SiteAnalyser batch → `scripts/lead-discovery/candidates.enriched.json`

Same document; each `candidates[]` entry gains `analysis` (+ `analysisError`,
`analysisMs`), and a top-level `analysis` summary is added.

```jsonc
{
  "query": { ... }, "provider": "...", "generatedAt": "...", "counts": { ... },
  "rejected": [ ... ],
  "candidates": [
    {
      "url": "https://example-plumbing.ie/", "domain": "...", "title": "...", "rank": 3,
      "analysis": {
        "score": 7, "maxScore": 15, "applicableMaxScore": 13, "scorePct": 0.538,
        "band": "medium", "priority": "MEDIUM", "needsUpgrade": true,
        "reachable": true, "finalUrl": "https://example-plumbing.ie/",
        "redirected": false, "httpStatus": 200, "https": true, "rendered": false,
        "noWebsite": false,
        "criteria": [
          { "key": "https", "label": "HTTPS / secure transport", "maxPoints": 3,
            "points": 3, "passed": true, "notApplicable": false,
            "evidence": "Served over HTTPS", "shortFail": "no HTTPS" }
          /* mobile, modern_stack, contact, img_alt, weight */
        ],
        "summary": "no modern framework, weak image alt-text — partial upgrade opportunity",
        "analyzerVersion": "2.0.0", "analyzedAt": "2026-09-02T12:05:00.000Z"
      },
      "analysisError": null,
      "analysisMs": 512
    }
  ],
  "analysis": {
    "total": 9, "reachable": 7, "unreachable": 1, "blocked": 1, "needsUpgrade": 5,
    "byBand": { "high": 2, "medium": 3, "low": 2, "unknown": 1, "greenfield": 0, "blocked": 1 },
    "avgScorePct": 0.61,
    "analyzerVersion": "2.0.0",
    "options": { "concurrency": 3, "delayMs": 400, "timeout": 12000, "retries": 2, "render": false },
    "elapsedSeconds": 41.2
  }
}
```

- Unreachable / failed URLs: `analysis.score = null`, `reachable = false`,
  `band = "unknown"`, `analysisError` set — **logged and skipped, never fatal.**
- SSRF-blocked URLs: `reachable = false`, `blocked = true`, `band = "blocked"`,
  `error = "ESSRFBLOCKED"`, `needsUpgrade = false`.
- `band`: `high` (< 45% of applicable) / `medium` (45–75%) / `low` (≥ 75%) /
  `unknown` (unreachable) / `blocked` (private/internal address) /
  `greenfield` (no website on file).
- `criteria[]` is the "score reasons" — feeds the CRM lead record.

### 3. CRM sync → Notion "Leads" database

`scripts/lead-crm/sync-to-notion.mjs` reads `candidates.enriched.json`, takes
every candidate with `analysis.needsUpgrade === true` in band `high`/`medium`,
and **upserts** a Notion page (dedupe on the normalised website URL — repeat
runs refresh score + last-scanned, they don't duplicate).

Lead record: business name, website URL, score, score %, band, needsUpgrade,
reachable, contact-method category, score reasons (summary + per-criterion),
discovered date, last-scanned date, search query. Page body = summary + criteria
bullets. `Status` = `New` and `Source` = `Lead Discovery` set on insert only.

One failed Notion write is logged and skipped; run ends with a summary
(`X created, Y updated, Z skipped, N failed`).

**Blocked on:** Notion API token + leads database id (not in the repo yet).
**Not captured** (flagged in `scripts/lead-crm/README.md`): actual contact
email/phone (analyzer only detects *presence*), and screenshots (renderer
returns HTML, not an image).

---

## Infrastructure — `docker/` (built)

Three containers, `docker compose` project **`evomedia`** (own network/volumes —
doesn't touch other services on the box). Full details: `docker/README.md`.

```
docker/
├── docker-compose.yml            # name: evomedia — the 3 services below
├── .env.example                  # schedule, TZ, ports, Notion creds  (→ cp to .env)
├── pipeline.config.json          # keyword list + areas + per-step options (read live)
├── pipeline/     Dockerfile + package.json   # node:22-slim + playwright/chromium
├── siteanalyser/ Dockerfile                  # node:22-slim + chromium (for --render)
└── scheduler/    Dockerfile + entrypoint.sh + run-pipeline.sh
```

| Service | Kind | Notes |
|---|---|---|
| `evomedia-siteanalyser` | long-running | dashboard + `/api/*` on `${SITEANALYSER_HOST_PORT:-4005}`; also the image the batch **CLI** runs from |
| `evomedia-pipeline` | one-shot job image | search+filter + CRM scripts, one Node/Playwright dep set; `profiles: ["jobs"]` so `up` doesn't start it; invoked via `docker compose run --rm` |
| `evomedia-scheduler` | thin cron (busybox) | on `$SCHEDULE`, runs `run-pipeline.sh`; drives the others via the mounted Docker socket + `docker compose run`; no business logic |

**Run sequence** (`scheduler/run-pipeline.sh`, once per entry in
`pipeline.config.json` → `searches[]`):

1. `docker compose run --rm evomedia-pipeline node scripts/lead-discovery/run.mjs …` → `/data/candidates.<slug>.json`
2. `POST evomedia-siteanalyser:4005/api/batch-analyze` (the always-on server), scheduler rebuilds the full doc → `/data/candidates.<slug>.enriched.json`
3. `docker compose run --rm evomedia-pipeline node scripts/lead-crm/sync-to-notion.mjs …`

A step failing **outright** (non-zero exit / no usable output) stops the
remaining steps *for that search* and moves to the next; the run itself never
aborts. Individual candidates failing inside a step is normal.

**Shared state:** volume `pipeline_data` (`/data`, the JSON handoff files) mounted
in `pipeline` + `siteanalyser` — both images run as uid 1000 so files interop.
Volume `scheduler_state` holds the consolidated `/state/pipeline-runs.log`
(also echoed to `docker compose logs evomedia-scheduler`).

**Config without rebuild:** `pipeline.config.json` (keywords/areas/step options,
read live each run) and `docker/.env` (schedule, TZ, ports, Notion creds — needs
`docker compose up -d` to re-read).

- **Search:** Playwright Google at low volume; `serpapi` provider as the
  fallback when bot-checks appear — set `LEAD_SEARCH_PROVIDER=serpapi` +
  `SERPAPI_KEY` in `.env`, no code change.
- **Caveat:** the scheduler needs the host Docker socket. The scheduler parses
  step counts from each script's **stdout** (fragile if wording changes — a
  `--json-summary` flag on the scripts would harden this later).
- **No alerting** in v1 — check the log.

---

## Open / not yet decided

- **CRM target:** defaulted to **Notion** (unified with client briefs) for this
  build — dedicated leads database, separate from the briefs one. Revisit if
  leads outgrow Notion or want a real CRM.
- **Notion credentials:** `NOTION_API_KEY` + `NOTION_LEADS_DATABASE_ID` need to
  be created/configured before the CRM step can run (see
  `scripts/lead-crm/README.md` for the database schema to set up).
- **Contact-detail extraction:** the analyzer detects only *whether* a contact
  method exists. Pulling the actual email/phone would be new scraping — deferred.
- **Lead screenshots:** `renderer.js` returns HTML, not an image — deferred.
- **`major-chains.json` shape:** currently per-category with a `_global` array.
  Revisit if a flat list turns out to be enough.
- **Silent-failure monitoring:** how a failed scheduled run gets alerted
  (healthcheck ping, log scrape, etc.). v1 is manual log-checking.
- **No API auth on SiteAnalyser** — `/api/*` and the dashboard are open. Fine
  while it's only reachable on the home LAN / behind the scheduler; flagged in
  `website-upgrade-scanner-export/CODE-REVIEW.md`, deliberately deferred.
- **Multi-query runs:** one `candidates.json` per (keyword, location) today.
  If runs get merged into one file, per-candidate `keyword`/`location`/`foundAt`
  fields will be needed (currently only top-level `query`).
- **`website-upgrade-scanner-export/` is git-untracked** — decide whether it
  lives in this repo, its own repo, or is vendored.

---

## Tooling split

- **Claude Code** — all backend/logic (search, filter, SiteAnalyser batch, CRM).
- **Cursor** — future customer-facing frontend (none planned for this pipeline).
- **Claude (Design)** — n/a here.

---

## Deviations from the original sketch

| Sketch | Actual | Why |
|---|---|---|
| standalone `lead-discovery-engine/` monorepo | `scripts/lead-discovery/` in the main repo + existing `website-upgrade-scanner-export/` | Playwright + npm scripts already exist in this repo; SiteAnalyser is its own app. No monorepo created. |
| `search/search.js`, `filter/filter.js` (CJS) | `search.mjs` + `providers/*.mjs`, `filter.mjs` (ESM) | Matches the repo's existing `.mjs` script style (`scripts/capture-portfolio.mjs`). |
| `search/config/search-config.json` | flags + env + `lib/human.mjs` defaults | Timing is jittered in code; no separate config file needed yet. |
| `filter/exclusions/social-directories.json`, `known-chains.json` | `config/excluded-domains.json`, `config/major-chains.json` | Same idea, renamed. |
| `siteanalyser/src/analyse.js`, `src/batch.js` | `analyzer.js`, `batch.js`, `renderer.js` at app root | SiteAnalyser has no `src/`; kept its flat layout. |
| `output/scored-candidates.json` | `<input>.enriched.json` next to `candidates.json` | Keeps the search→score handoff in one folder; enriched file is the same doc + `analysis`. |
| handoff fields `businessName`, `scoreReasons`, `analysedAt`, `foundAt` | `title`, `criteria`, `analyzedAt`; no `foundAt` | Names follow what each script already emits. |
| (CRM step location unspecified) | `scripts/lead-crm/` in the main repo (ESM, fetch-based Notion client, no SDK dep) | Sibling of `scripts/lead-discovery/`; no `@notionhq/client` added. |
| 4 containers (`search-filter`, `siteanalyser`, `scheduler`, ... ) | **3**: `evomedia-pipeline` (search+filter **and** CRM as one job image), `evomedia-siteanalyser`, `evomedia-scheduler` | User's own revision — search+filter and CRM are short one-shot steps, not services; no point in two idle images. |
| scheduler triggers a persistent pipeline container | scheduler runs `docker compose run --rm evomedia-pipeline <step>` via the mounted Docker socket | Honors "run-and-exit, not idling"; pipeline has `profiles: ["jobs"]` so `up` never starts it. |
| `output/scored-candidates.json` in a dedicated dir | handoff files live in the `pipeline_data` Docker volume at `/data/candidates.<slug>.json` | One volume shared by `pipeline` + `siteanalyser` (both uid 1000). |
| step 2 details | `POST /api/batch-analyze` on the running server; scheduler merges `original doc + scored candidates + summary` into the enriched file with `jq` | Avoids a `docker compose run` against a `container_name`d service; uses the always-on server as intended. |
