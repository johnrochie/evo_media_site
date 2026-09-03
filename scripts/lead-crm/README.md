# Lead → CRM sync (Notion)

Final step of the Phase 1 lead-discovery pipeline. Reads
`candidates.enriched.json` (SiteAnalyser batch output) and creates / updates
lead records in a Notion database.

> Pipeline overview: [`../../SCAFFOLD.md`](../../SCAFFOLD.md).

```
search + filter  →  candidates.json
      → analyse-batch  →  candidates.enriched.json
            → sync-to-notion  →  Notion "Leads" database   ← you are here
```

## Status — needs credentials

There is **no Notion API key or database id configured** in this repo yet
(`.env.local` has none; `.env.example` shows placeholders). Before this runs:

1. Create an internal integration at <https://www.notion.so/my-integrations>,
   copy its secret.
2. Create the leads database in Notion (schema below) and **share it with the
   integration** (`•••` → Connections → your integration).
3. Set env vars:
   ```
   NOTION_API_KEY=secret_xxx
   NOTION_LEADS_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

The script checks the live database schema on startup and tells you exactly
which properties are missing — it does not guess or create properties.

## Usage

```bash
npm run leads:crm -- scripts/lead-discovery/candidates.enriched.json

# see the mapping without writing (works with NO credentials — prints payloads)
npm run leads:crm -- scripts/lead-discovery/candidates.enriched.json --dry-run

node scripts/lead-crm/sync-to-notion.mjs <file> --band high --limit 20 -v
```

Options: `--database <id>`, `--band high,medium` (default; = `needsUpgrade`),
`--limit <n>`, `--no-update` (skip existing instead of refreshing), `--dry-run`,
`-v`.

Only candidates with `analysis.needsUpgrade === true` are synced. Unreachable
(`band: unknown`) and SSRF-blocked (`band: blocked`) candidates are never synced.

## Dedupe

On the **normalised website URL** (`https://` + lowercased host without `www.`,
no trailing slash, no fragment) — stored in the `Website` property and queried
with a `url equals` filter. Repeat pipeline runs update the existing lead
(score + last-scanned refreshed; `Status`, `Discovered`, `Source` left alone)
rather than creating a duplicate. `--no-update` makes existing rows a pure skip.

## Expected Notion database schema

Matched by property **name** (case-insensitive). Alternative names in brackets.

| Property | Type | Notes |
|---|---|---|
| *(title)* | title | Business name — uses `businessName` / `title` / domain. **required** |
| `Website` (`Website URL`, `URL`) | url | Website URL, dedupe key. **required** |
| `Score` | number | `analysis.score` (0–15) |
| `Score %` (`Score Percent`) | number | `analysis.scorePct` × 100 |
| `Band` (`Opportunity`) | select | `high` / `medium` / `low` |
| `Needs Upgrade` | checkbox | |
| `Reachable` | checkbox | |
| `Contact Method` (`Contact`) | select | `Direct (email/phone)` / `Form / link only` / `None found` / `Unknown` |
| `Score Reasons` (`Reasons`, `Notes`) | rich_text | summary + per-criterion breakdown |
| `Discovered` (`Date Discovered`) | date | set once, on first insert |
| `Last Scanned` (`Scanned`) | date | `analysis.analyzedAt` |
| `Search Query` (`Query`, `Keyword`) | rich_text | keyword + location from the run |
| `Status` (`Stage`) | select | set to `New` on insert only |
| `Source` (`Lead Source`) | select | set to `Lead Discovery` on insert only |

Missing **optional** properties are skipped with a warning; only the title and
`Website` are hard requirements. The page **body** gets the summary + a
bulleted criteria breakdown.

## Known follow-ups (flagged, not built here)

- **Contact details.** `analyzer.js` only detects *whether* a contact method
  exists (`mailto:` / `tel:` / form) — it does **not extract** the address or
  number. The lead records a `Contact Method` category only. Extracting the
  actual email/phone would be new scraping logic (out of scope for this step).
- **Screenshot.** `renderer.js` returns rendered HTML, not an image — there is
  no screenshot to attach. Adding one means `page.screenshot()` in the render
  step plus Notion file-upload handling. Left for a later pass.
- **Split vs unified CRM.** Client briefs already live in Notion; this reuses
  Notion for leads (see the open question in the tooling roadmap). Revisit if
  leads outgrow it.
