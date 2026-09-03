# EvoMedia lead-discovery pipeline — Docker + scheduler

Closes out Phase 1: the four pipeline pieces run automatically, in order, on a
schedule. **No logic inside the four scripts changed** — this is purely
orchestration.

```
┌─────────────────────┐   hourly
│ evomedia-scheduler  │─┬─▶ 1. docker compose run evomedia-pipeline  (search + filter)
│  (busybox cron)     │ │        → /data/candidates.<slug>.json
│  run-pipeline.sh    │ ├─▶ 2. POST evomedia-siteanalyser /api/batch-analyze
│  no business logic  │ │        → /data/candidates.<slug>.enriched.json
└─────────────────────┘ └─▶ 3. docker compose run evomedia-pipeline  (CRM sync → Notion)
        │
        └─▶ evomedia-siteanalyser  (always-on: dashboard + /api/* on :4005)
```

## Containers

| Container | Kind | What |
|---|---|---|
| `evomedia-siteanalyser` | long-running service | The existing Express app — dashboard + `/api/analyze` / `/api/batch-analyze` on port 4005. Step 2 calls its `/api/batch-analyze`. |
| `evomedia-pipeline` | one-shot job image | Bundles the search+filter script (Prompt 1) and the CRM-write script (Prompt 4) with a single Node + Playwright dependency set. **Not started by `up`** — invoked per step via `docker compose run --rm`. |
| `evomedia-scheduler` | thin cron | On `$SCHEDULE`, runs the 3-step sequence and nothing else. No business logic. Drives the other containers through the mounted Docker socket. |

## First run

```bash
cd docker
cp .env.example .env            # fill in Notion creds, tweak schedule/port
$EDITOR pipeline.config.json    # your keyword list + target areas

docker compose --profile jobs build     # builds all three images
docker compose up -d                    # starts siteanalyser + scheduler
```

`--profile jobs` is needed on **build** so `evomedia-pipeline` is built too;
`up` deliberately does not start it.

Watch it:

```bash
docker compose logs -f evomedia-scheduler          # live
docker compose exec evomedia-scheduler cat /state/pipeline-runs.log   # full history
```

Trigger a run immediately without waiting for the schedule:

```bash
docker compose exec evomedia-scheduler /usr/local/bin/run-pipeline.sh
# or set RUN_ON_START=1 in .env and `docker compose up -d`
```

Stop / start as a group (leaves other services on the box alone):

```bash
docker compose down          # stop; keeps volumes (data + logs)
docker compose up -d
docker compose down -v       # also wipe the data + log volumes
```

## Configuration — no rebuild needed

| What | Where | Applied by |
|---|---|---|
| Keyword list + target areas | `docker/pipeline.config.json` → `searches[]` | read live each run |
| Per-step options (search limit, provider, analyse concurrency, CRM bands, dry-run) | `docker/pipeline.config.json` | read live each run |
| Schedule interval, timezone | `docker/.env` → `SCHEDULE`, `TZ` | `docker compose up -d` |
| Notion credentials | `docker/.env` → `NOTION_API_KEY`, `NOTION_LEADS_DATABASE_ID` | `docker compose up -d` |
| Dashboard host port | `docker/.env` → `SITEANALYSER_HOST_PORT` | `docker compose up -d` |

`pipeline.config.json`:

```jsonc
{
  "searches": [
    { "keyword": "plumber", "location": "Cork, Ireland" },
    { "keyword": "electrician", "location": "Galway, Ireland", "category": "electrician" }
  ],
  "search":  { "limit": 20, "provider": "google-playwright" },
  "analyse": { "concurrency": 3, "timeout": 12000 },
  "crm":     { "bands": "high,medium", "dryRun": false, "noUpdate": false }
}
```

Each `searches[]` entry runs the full 3-step sequence independently and writes
its own `candidates.<slug>.json` / `.enriched.json` in the `pipeline_data` volume.

## Run sequence & failure handling

For every search, in order:

1. **search + filter** — `docker compose run --rm evomedia-pipeline node scripts/lead-discovery/run.mjs …`
   → `candidates.<slug>.json`. If it exits non-zero (e.g. Google bot-check) the
   analyse + CRM steps are **skipped for that search**. Zero candidates after
   filtering → also skipped (nothing to do), not an error.
2. **batch scoring** — `POST http://evomedia-siteanalyser:4005/api/batch-analyze`
   with the candidates doc (plus the `analyse` options from the config folded
   in). The scheduler rebuilds the full enriched doc (`original + scored
   candidates + summary`) at `candidates.<slug>.enriched.json`. Non-200 or a
   malformed response → CRM step **skipped for that search**. Individual sites
   being unreachable / SSRF-blocked is normal and does not stop the step.
3. **CRM sync** — `docker compose run --rm evomedia-pipeline node scripts/lead-crm/sync-to-notion.mjs …`
   Upserts Notion leads for `needsUpgrade` candidates. If Notion isn't
   configured the step is logged as skipped, not failed. A few individual
   record write failures are logged and counted, not fatal.

The next search always runs even if the previous one failed a step.

## The consolidated run log

`/state/pipeline-runs.log` (volume `scheduler_state`), also echoed to
`docker compose logs evomedia-scheduler`. One block per run:

```
2026-09-03T10:00:01Z [run-20260903T100001Z] ════════ pipeline run start — 2 search(es) ════════
2026-09-03T10:00:01Z [run-20260903T100001Z] ──── [plumber-cork-ireland]  "plumber" @ "Cork, Ireland"  (1/2) ────
2026-09-03T10:00:01Z [run-20260903T100001Z] [plumber-cork-ireland] 1/3  search + filter
2026-09-03T10:01:14Z [run-20260903T100001Z] [plumber-cork-ireland] 1/3  ok — 18 found, 9 candidate(s) after filter
2026-09-03T10:01:14Z [run-20260903T100001Z] [plumber-cork-ireland] 2/3  SiteAnalyser batch scoring
2026-09-03T10:02:47Z [run-20260903T100001Z] [plumber-cork-ireland] 2/3  ok — reachable 7/9   unreachable 1   blocked 1   needs-upgrade 5
2026-09-03T10:02:47Z [run-20260903T100001Z] [plumber-cork-ireland] 3/3  CRM sync → Notion
2026-09-03T10:03:10Z [run-20260903T100001Z] [plumber-cork-ireland] 3/3  Done: 3 created, 2 updated, 0 skipped (already in CRM), 4 skipped (not a lead), 0 failed
2026-09-03T10:06:05Z [run-20260903T100001Z] ════════ run complete — 2/2 search(es) fully processed; leads: 6 created, 3 updated, 0 failed ════════
```

Each step's raw stdout is also appended (indented) for debugging.

## Notes & caveats

- **Docker socket.** The scheduler mounts `/var/run/docker.sock` to drive
  `docker compose`. That's effectively host-level Docker access — fine for a
  single self-hosted box, worth knowing.
- **Ports.** Only `evomedia-siteanalyser` publishes a port (`${SITEANALYSER_HOST_PORT:-4005}`).
  The others are internal. Nothing else on the box is touched — everything is
  namespaced under the `evomedia` compose project (`evomedia_net`,
  `evomedia_pipeline_data`, `evomedia_scheduler_state`).
- **Arch.** All base images (`node:22-bookworm-slim`, `docker:29-cli`) are
  multi-arch — works on an amd64 box or an arm64 one (e.g. a Pi 4/5).
- **Playwright / bot-checks.** Step 1 uses the Playwright Google provider by
  default. From a residential IP at hourly volume it's usually fine; if Google
  starts serving CAPTCHAs, set `LEAD_SEARCH_PROVIDER=serpapi` + `SERPAPI_KEY` in
  `.env` (the search step already supports this, no code change).
- **Metric parsing.** Step 1 + 2 counts come from the JSON files (`jq`). Only
  the step 3 line (`X created, Y updated, …`) is parsed from `sync-to-notion.mjs`
  stdout — if that wording changes, update the `grep`s in
  `scheduler/run-pipeline.sh` (or add a `--json-summary` flag to the script).
- **No alerting.** v1 is check-the-log. An alert layer (healthcheck ping on run
  completion, etc.) can be added to `run-pipeline.sh` later.
