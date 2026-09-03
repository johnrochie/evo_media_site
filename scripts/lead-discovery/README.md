# Lead Discovery Engine — v1 (search + filter)

Standalone, manually-run first step of EvoMedia's autonomous lead discovery
engine. It searches Google for a business type in a location, filters the
results down to plausible small-business websites, and writes a JSON report.

> Pipeline overview and data handoffs: [`../../SCAFFOLD.md`](../../SCAFFOLD.md).
> Next step (scoring): [`../../website-upgrade-scanner-export/`](../../website-upgrade-scanner-export).

**Later build steps (not here yet):** SiteAnalyser integration, CRM / database
writes, scheduling / cron.

## Setup

```bash
npx playwright install chromium   # one time
```

Playwright itself is already a dev dependency of the main project.

## Usage

```bash
npm run leads:discover -- --keyword "plumber" --location "Cork, Ireland"

# positional form
node scripts/lead-discovery/run.mjs plumber "Cork, Ireland"

# verbose: shows exactly what got filtered out and why (for tuning the rules)
node scripts/lead-discovery/run.mjs -k "dentist" -l "Galway, Ireland" -v

# watch the browser
node scripts/lead-discovery/run.mjs -k "electrician" -l "Limerick, Ireland" --headful
```

### Options

| Flag | Meaning |
| --- | --- |
| `-k, --keyword` | business type (required) |
| `-l, --location` | location (required) |
| `-c, --category` | key into `config/major-chains.json` (default: keyword) |
| `--limit` | max organic results to consider (default: 20) |
| `-p, --provider` | `google-playwright` (default) or `serpapi` |
| `-o, --out` | output path (default: `candidates.json` beside the script) |
| `--headful` | visible browser window |
| `-v, --verbose` | debug logging |

Env equivalents: `LEAD_SEARCH_PROVIDER`, `LEAD_LOG_LEVEL`, and `SERPAPI_KEY`
(required for the `serpapi` provider).

## Output

`candidates.json`:

```jsonc
{
  "query": { "keyword": "plumber", "location": "Cork, Ireland", "category": "plumber", "searchQuery": "plumber Cork, Ireland" },
  "provider": "google-playwright",
  "generatedAt": "2026-09-02T12:00:00.000Z",
  "counts": { "found": 18, "candidates": 9, "rejected": 9 },
  "candidates": [
    { "url": "https://example-plumbing.ie/", "domain": "example-plumbing.ie", "title": "Example Plumbing Cork", "rank": 3 }
  ],
  "rejected": [
    { "url": "https://facebook.com/...", "domain": "facebook.com", "title": "...", "rank": 1, "reason": "excluded-domain:facebook.com" }
  ]
}
```

Every `rejected` entry has a `reason` (`unparseable-url`, `duplicate-domain`,
`excluded-domain:<d>`, `major-chain:<d>`) so you can tune the config from the log.

## Structure

```
run.mjs                     CLI entry — orchestrates search → filter → output
search.mjs                  provider-agnostic dispatcher (getSearchResults)
providers/
  google-playwright.mjs     v1 default: real browser Google search
  serpapi.mjs               drop-in paid API alternative
filter.mjs                  filterCandidates() + config loader
config/
  excluded-domains.json     social / directory / marketplace domains
  major-chains.json         large chains, keyed by category
lib/
  logger.mjs  human.mjs  url.mjs
```

### Swapping in a paid search API

Every provider implements one function:

```js
export async function search(query, opts) // -> Array<{ url, title, rank }>
```

Add a module under `providers/`, register it in the `PROVIDERS` map in
`search.mjs`, then select it with `--provider <name>` or
`LEAD_SEARCH_PROVIDER=<name>`. Nothing in `filter.mjs` or `run.mjs` changes.

## Notes

- Runs slowly on purpose (human-ish delays, one search per run). It is built to
  be scheduled at low volume (~hourly), not looped.
- Only ever clicks **Reject all** on Google's cookie consent wall.
- If Google serves a bot-check page the run fails with a clear message — back
  off and retry later, or use `--provider serpapi`.
- The filter is deliberately simple for v1. The big-chain list starts small;
  grow `config/major-chains.json` as chains slip through.
