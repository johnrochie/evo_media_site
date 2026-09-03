# SiteAnalyser — code review & batch-readiness changes

> Pipeline context: [`../SCAFFOLD.md`](../SCAFFOLD.md).


Review of `server.js` as shipped (single-file Express app, in-memory state).
No prior written review existed in the repo, so this is the record of findings
plus what was changed for the Lead Discovery batch use case (Prompt 2).

Scope: targeted fixes for batch use + scoring reliability. **Not** a rewrite —
the scoring model (6 criteria, 15 points) and the HTTP API are unchanged in
shape. Single-URL use still works.

---

## Findings

### A. Single-URL assumptions that break or degrade under batch use

| # | Finding | Fix |
|---|---------|-----|
| A1 | `/api/bulk-analyze` was hard-capped at `websites.slice(0, 20)` — silently drops candidates 21+. | Removed the cap; configurable `limit` (default = list length, hard max 200). |
| A2 | Bulk loop was fully serial with a fixed `500ms` sleep. A 100-site run ≈ blocking for minutes inside one HTTP request. | New `batch.js` runner: bounded concurrency (default 3) + politeness delay with jitter. |
| A3 | Outer `try/catch` in `/api/bulk-analyze` returns `500` and **loses all partial results** if anything above the per-site catch throws. | Runner never throws; every item resolves to a result (success or `reachable:false`). Endpoint returns `{ summary, candidates }`. |
| A4 | No timeout budget / no retry. A transient blip = permanent `score 0` = false "no website" lead. Two runs of the same list disagree. | Retries with exponential backoff on transient errors (`ECONNRESET`, `ETIMEDOUT`, 5xx…). DNS failures (`ENOTFOUND`) are not retried. |
| A5 | `axios.get` had no `maxContentLength` / `maxBodyLength`. One giant response can OOM a batch. | Capped at 8 MB; `responseType: "text"`. |
| A6 | `puppeteer` was imported but **never used** — every scan ran on raw HTML, so JS-rendered SPAs (React/Vue/…) were scored on an empty shell. Inconsistent by design. | `renderer.js`: opt-in headless rendering (`--render` / `{render:true}`), lazy-required, off by default to keep batches fast and deterministic. |
| A7 | `analyzeWebsite(url, businessName, category)` but `/api/analyze` called it as `analyzeWebsite(url)` then patched fields on. Divergent call paths. | Single signature `analyzeWebsite(url, opts)`; all callers updated. |
| A8 | `if (analysis.score < 15)` decides leads — with `score` now possibly `null`, `null < 15` is `true`, so every unreachable site becomes a lead. | Lead creation keyed off `analysis.needsUpgrade`. |
| A9 | Shared module arrays `scanHistory` / `leads` mutated from every path with no dedupe. | Left as-is (out of scope; in-memory store is Prompt 3's problem) — but batch CLI does **not** touch them; it writes a file. |

### B. Scoring reliability

| # | Finding | Fix |
|---|---------|-----|
| B1 | **HTTPS** was `cleanUrl.startsWith('https://')` — a string check on the *input*. `http://` input that 301s to HTTPS scored 0; a URL typed with `https://` but a dead cert scored 3. | Checks the **final URL after redirects**. Also tries `https://` first for bare domains, notes HTTP→HTTPS upgrades. |
| B2 | No URL normalisation. `acme.ie` (no scheme) → `axios` throws → `score 0`, `hasWebsite:false` → treated as a business with no website. Large false-positive source. | `buildUrlCandidates()` tries `https://` then `http://`. |
| B3 | **Framework detection** = `html.toLowerCase().includes('react' \| 'vue' \| 'angular' \| …)`. "vue" matches *value/avenue/revue*; "react" matches *reaction*; "angular" is a normal English word. Effectively random on content-heavy sites. | Signal-based: `/_next/`, `__NEXT_DATA__`, `id="__next"`, `window.__NUXT__`, `data-reactroot`, `react-dom`, `data-v-<hash>`, `ng-version=`, `svelte-<hash>`, Tailwind CDN/`--tw-`, Webflow/Framer asset hosts. Legacy CMS (WordPress/Wix/Squarespace) and jQuery are reported as evidence but don't score. |
| B4 | **Contact detection** = `html.includes('contact' \| 'email' \| 'phone' \| 'address')`. The word "contact" is in almost every nav. Scored 2/2 on nearly everything. | `mailto:` / `tel:` links = 2 pts; only a contact form or "Contact" link = 1 pt (not "passed"); nothing = 0. |
| B5 | **Alt text**: `images.filter((i, el) => $(el).attr('alt'))` treats `alt=""` (valid, decorative) as a failure and only rewards non-empty alt. Penalised correct markup. | Counts *presence* of the `alt` attribute (empty included) as intentional; missing attribute is the fail. Tiered 90% / 60%. |
| B6 | **Performance** = `Buffer.byteLength(html)` — HTML document only. 40 KB of HTML pulling 9 MB of images scored "reasonable page size". Misleadingly labelled. | Kept as a cheap proxy but **relabelled** "Lean HTML document (excludes images/CSS/JS)" with a `note`, and thresholds tightened (250 KB / 600 KB). A real perf metric needs Lighthouse — noted as future work. |
| B7 | `cheerio.load(response.data)` throws if the server returns JSON (`response.data` is then an object). Became a generic "website error". | `responseType: "text"` forces a string. |
| B8 | `maxScore: 15` only on the success path; error/no-website paths returned `score: 0` with no `maxScore`. Averages downstream mixed real zeros with "unknown". | Consistent shape everywhere. `score` is `null` (not `0`) when unreachable. `applicableMaxScore` + `scorePct` added; the "no images" criterion is marked `notApplicable` and excluded from the denominator so sites are compared fairly. |
| B9 | `needsUpgrade` / `priority` thresholds hardcoded at 3 different cutoffs in 3 places (`<15`, `<10`, `<5`). | One place: `band` (`high` / `medium` / `low`) derived from `scorePct`. `priority` + `needsUpgrade` derive from `band`. |
| B10 | Non-deterministic: score depended on whether the site happened to respond that second. | Retries (A4) + signal-based checks (B3–B5) make repeat runs stable. Guarded by `scripts/test-analyzer.js`. |

---

## What was added

```
analyzer.js              extracted + hardened scoring core (analyzeWebsite, scoreHtml)
renderer.js              optional lazy puppeteer rendering for SPA shells
batch.js                 runBatch(candidates, opts) — concurrency, isolation, summary
scripts/analyse-batch.js CLI: candidates.json -> <name>.enriched.json
scripts/test-analyzer.js network-light regression checks for the scoring rules
```

`server.js`: `/api/analyze` and `/api/bulk-analyze` now delegate to the shared
module; new `/api/batch-analyze` takes the Prompt 1 `candidates.json` shape
directly.

## SSRF protection (added)

`server.js` / `analyzer.js` previously fetched any URL given, including
`http://localhost`, RFC1918 addresses, and `169.254.169.254` (cloud metadata) —
and any public URL that *redirects* to one. Fixed in `ssrf.js`:

- **Sync pre-flight** (`assertUrlAllowed`) rejects bad protocols, `localhost`,
  `*.internal` / `*.local` etc., and private/reserved IP literals before a
  socket opens. WHATWG URL canonicalisation means decimal/octal/hex IP
  encodings (`http://2130706433`) are normalised and caught too.
- **`safeLookup` on the HTTP(S) agents** resolves the host and rejects the
  connection if the IP is in a blocked range — IPv4 (`0/8`, `10/8`, `100.64/10`,
  `127/8`, `169.254/16`, `172.16/12`, `192.168/16`, `198.18/15`, TEST-NETs,
  multicast, reserved) and IPv6 (`::1`, `::`, `fc00::/7`, `fe80::/10`, `ff00::/8`,
  v4-mapped). This runs on the **initial request and every redirect hop**, and
  the socket connects to the exact IP that was checked (no TOCTOU / DNS-rebind
  window). A `beforeRedirect` hook fails fast on obvious cases.
- Applied once, in the shared `analyzeWebsite` / `runBatch` path, so all of
  `/api/analyze`, `/api/bulk-analyze`, `/api/batch-analyze` and the CLI inherit it.
- Blocked targets return `reachable: false`, `blocked: true`, `band: "blocked"`,
  `error: "ESSRFBLOCKED"` — distinct from "site is down".
- Escape hatch: `SSRF_ALLOWED_HOSTS` (comma-separated) for scanning known-safe
  internal/staging hosts. Unset = full protection.
- Covered by `scripts/test-analyzer.js` (localhost, private IP, decimal-encoded
  loopback, and a live redirect-to-private-IP case).

Still **not** addressed (separately flagged): no API authentication.

## Deliberately left alone (out of scope)

- In-memory `scanHistory` / `leads` and CSV export — Prompt 3 (CRM/DB).
- `convertToCSV` uses `'\\n'` (literal backslash-n) as the row separator — a
  pre-existing bug, not touched here.
- `app.get('*', …)` catch-all — fine on Express 4.
- Real performance measurement (Lighthouse / total transfer weight).
- **No auth on the API** — known gap, separate fix.
