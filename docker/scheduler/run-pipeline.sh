#!/bin/bash
# Three-step lead-discovery pipeline, one pass over every search in the config.
#
#   1. evomedia-pipeline     : search + filter  (docker compose run)
#                              -> /data/candidates.<slug>.json
#   2. evomedia-siteanalyser : batch scoring via POST /api/batch-analyze
#                              -> /data/candidates.<slug>.enriched.json
#   3. evomedia-pipeline     : CRM sync -> Notion  (docker compose run)
#
# A step that fails outright (non-zero exit / non-200 / no usable output) stops
# the remaining steps FOR THAT SEARCH and moves to the next one. Individual
# candidates failing inside a step is normal and does not stop anything.
#
# No business logic here — every step is one of the existing scripts/endpoints,
# unchanged.

set -u

COMPOSE_FILE="${COMPOSE_FILE:-/compose/docker-compose.yml}"
PROJECT="${COMPOSE_PROJECT_NAME:-evomedia}"
CONFIG="${PIPELINE_CONFIG:-/compose/pipeline.config.json}"
LOG="${RUN_LOG:-/state/pipeline-runs.log}"
SITEANALYSER_URL="${SITEANALYSER_URL:-http://evomedia-siteanalyser:4005}"
DATA_DIR="${DATA_DIR:-/data}"

DC="docker compose --profile jobs -f ${COMPOSE_FILE} -p ${PROJECT}"
RUN_ID="run-$(date -u +%Y%m%dT%H%M%SZ)"

ts()  { date -u +%Y-%m-%dT%H:%M:%SZ; }
log() { printf '%s [%s] %s\n' "$(ts)" "$RUN_ID" "$*" | tee -a "$LOG"; }
raw() { sed 's/^/                             | /' >> "$LOG"; }

mkdir -p "$(dirname "$LOG")"

if [ ! -f "$CONFIG" ]; then
  log "FATAL: config file not found: $CONFIG"; exit 1
fi
if ! jq -e '(.searches | type) == "array" and (.searches | length) > 0' "$CONFIG" >/dev/null 2>&1; then
  log "FATAL: $CONFIG has no non-empty \"searches\" array"; exit 1
fi
for img in evomedia-pipeline:latest evomedia-siteanalyser:latest; do
  docker image inspect "$img" >/dev/null 2>&1 || \
    log "WARNING: image '$img' not found locally — run 'docker compose --profile jobs build' on the host"
done

# ---- per-run step args from config (edit the file, no rebuild needed) --------
SEARCH_ARGS=""
v=$(jq -r '.search.limit    // empty' "$CONFIG"); [ -n "$v" ] && SEARCH_ARGS="$SEARCH_ARGS --limit $v"
v=$(jq -r '.search.provider // empty' "$CONFIG"); [ -n "$v" ] && SEARCH_ARGS="$SEARCH_ARGS --provider $v"

CRM_ARGS=""
v=$(jq -r '.crm.bands // empty' "$CONFIG"); [ -n "$v" ] && CRM_ARGS="$CRM_ARGS --band $v"
[ "$(jq -r '.crm.dryRun   // false' "$CONFIG")" = "true" ] && CRM_ARGS="$CRM_ARGS --dry-run"
[ "$(jq -r '.crm.noUpdate // false' "$CONFIG")" = "true" ] && CRM_ARGS="$CRM_ARGS --no-update"

n=$(jq '.searches | length' "$CONFIG")
log "════════ pipeline run start — ${n} search(es) ════════"

ok=0; created=0; updated=0; failed=0

i=0
while [ "$i" -lt "$n" ]; do
  kw=$(jq -r ".searches[$i].keyword"        "$CONFIG")
  loc=$(jq -r ".searches[$i].location"      "$CONFIG")
  cat=$(jq -r ".searches[$i].category // empty" "$CONFIG")
  slug=$(printf '%s-%s' "$kw" "$loc" | tr 'A-Z ' 'a-z-' | tr -cd 'a-z0-9-' | cut -c1-60)
  cand="$DATA_DIR/candidates.${slug}.json"
  enr="$DATA_DIR/candidates.${slug}.enriched.json"
  req="$DATA_DIR/.request.${slug}.json"
  resp="$DATA_DIR/.response.${slug}.json"
  catarg=""; [ -n "$cat" ] && catarg="--category $cat"
  i=$((i + 1))

  log "──── [$slug]  \"$kw\" @ \"$loc\"  ($i/$n) ────"

  # ---- STEP 1: search + filter ---------------------------------------------
  log "[$slug] 1/3  search + filter"
  out=$($DC run --rm -T evomedia-pipeline \
        node scripts/lead-discovery/run.mjs \
          --keyword "$kw" --location "$loc" $catarg --out "$cand" $SEARCH_ARGS 2>&1)
  rc=$?
  printf '%s\n' "$out" | raw
  if [ $rc -ne 0 ]; then
    log "[$slug] 1/3  FAILED (exit $rc) — search step errored; skipping analyse + CRM for this search"
    continue
  fi
  if [ ! -s "$cand" ]; then
    log "[$slug] 1/3  FAILED — no candidates.json was written; skipping analyse + CRM"
    continue
  fi
  found=$(jq -r '.counts.found     // "?"' "$cand" 2>/dev/null)
  cands=$(jq -r '.counts.candidates // 0'  "$cand" 2>/dev/null); cands=${cands:-0}
  log "[$slug] 1/3  ok — ${found} found, ${cands} candidate(s) after filter"
  if [ "$cands" -eq 0 ] 2>/dev/null; then
    log "[$slug] no candidates to score — nothing more to do for this search"
    continue
  fi

  # ---- STEP 2: SiteAnalyser batch endpoint --------------------------------
  log "[$slug] 2/3  SiteAnalyser batch scoring"
  # fold the analyse options from the config into the POST body
  jq --slurpfile a <(jq '.analyse // {}' "$CONFIG") '. + $a[0]' "$cand" > "$req" 2>>"$LOG" || cp "$cand" "$req"
  code=$(curl -sS -m "${ANALYSE_HTTP_TIMEOUT:-900}" -o "$resp" -w '%{http_code}' \
         -X POST "${SITEANALYSER_URL}/api/batch-analyze" \
         -H 'content-type: application/json' --data-binary "@$req" 2>>"$LOG") || code=000
  rm -f "$req"
  if [ "$code" != "200" ]; then
    log "[$slug] 2/3  FAILED (HTTP $code) — batch endpoint errored; skipping CRM for this search"
    rm -f "$resp"; continue
  fi
  if ! jq -e '.candidates | type == "array"' "$resp" >/dev/null 2>&1; then
    log "[$slug] 2/3  FAILED — batch endpoint returned no candidate array; skipping CRM"
    rm -f "$resp"; continue
  fi
  # rebuild the full enriched doc the CRM script expects:
  #   original doc  +  scored candidates  +  the run summary under `analysis`
  jq -s '.[0] + {candidates: .[1].candidates, analysis: .[1].summary}' "$cand" "$resp" > "$enr"
  rm -f "$resp"
  scored=$(jq -r '.analysis | "reachable \(.reachable)/\(.total)  unreachable \(.unreachable)  blocked \(.blocked // 0)  needs-upgrade \(.needsUpgrade)"' "$enr" 2>/dev/null)
  log "[$slug] 2/3  ok — ${scored:-scored}"

  # ---- STEP 3: CRM sync -> Notion ----------------------------------------
  log "[$slug] 3/3  CRM sync → Notion"
  out=$($DC run --rm -T evomedia-pipeline \
        node scripts/lead-crm/sync-to-notion.mjs "$enr" $CRM_ARGS 2>&1)
  rc=$?
  printf '%s\n' "$out" | raw
  done_line=$(printf '%s' "$out" | grep -E '(Done|Dry run):' | head -1 | sed 's/^[^A-Za-z]*//')

  if printf '%s' "$out" | grep -q 'Notion is not configured'; then
    log "[$slug] 3/3  SKIPPED — Notion not configured (set NOTION_API_KEY + NOTION_LEADS_DATABASE_ID in docker/.env)"
  elif [ $rc -ne 0 ] && [ -z "$done_line" ]; then
    log "[$slug] 3/3  FAILED (exit $rc) — CRM step errored"
    continue
  else
    log "[$slug] 3/3  ${done_line:-done}"
    c=$(printf '%s' "$done_line" | grep -oE '[0-9]+ created' | grep -oE '[0-9]+'); created=$((created + ${c:-0}))
    u=$(printf '%s' "$done_line" | grep -oE '[0-9]+ updated' | grep -oE '[0-9]+'); updated=$((updated + ${u:-0}))
    f=$(printf '%s' "$done_line" | grep -oE '[0-9]+ failed'  | grep -oE '[0-9]+'); failed=$((failed + ${f:-0}))
  fi
  ok=$((ok + 1))
done

log "════════ run complete — ${ok}/${n} search(es) fully processed; leads: ${created} created, ${updated} updated, ${failed} failed ════════"
