#!/usr/bin/env node
/**
 * Lead Discovery Engine — v1: search + filter (standalone, manually run).
 *
 *   node scripts/lead-discovery/run.mjs --keyword "plumber" --location "Cork, Ireland"
 *   node scripts/lead-discovery/run.mjs plumber "Cork, Ireland"
 *   npm run leads:discover -- -k "dentist" -l "Galway, Ireland" -v
 *
 * Out of scope for this version (later build steps):
 *   - SiteAnalyser integration
 *   - CRM / database writes
 *   - scheduling / cron
 *
 * First-time setup:  npx playwright install chromium
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getSearchResults } from "./search.mjs";
import { filterCandidates, loadFilterConfig } from "./filter.mjs";
import { log, setLevel, isDebug } from "./lib/logger.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));

const USAGE = `
Lead Discovery Engine — search + filter (v1)

Usage:
  node scripts/lead-discovery/run.mjs --keyword <kw> --location <loc> [options]
  node scripts/lead-discovery/run.mjs <kw> <loc> [options]

Required:
  -k, --keyword <text>    business type to search for, e.g. "plumber"
  -l, --location <text>   location, e.g. "Cork, Ireland"

Options:
  -c, --category <text>   category for the big-chain exclusion list (default: keyword)
      --limit <n>         max organic results to consider (default: 20)
  -p, --provider <name>   search provider: google-playwright (default) | serpapi
  -o, --out <path>        output JSON file (default: scripts/lead-discovery/candidates.json)
      --headful           run the browser with a visible window (google-playwright only)
  -v, --verbose           debug logging (shows what was filtered out and why)
  -h, --help              show this help

Env:
  LEAD_SEARCH_PROVIDER    same as --provider
  LEAD_LOG_LEVEL          error | warn | info | debug
  SERPAPI_KEY             required for --provider serpapi
`;

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--keyword" || a === "-k") args.keyword = argv[++i];
    else if (a === "--location" || a === "-l") args.location = argv[++i];
    else if (a === "--category" || a === "-c") args.category = argv[++i];
    else if (a === "--limit") args.limit = Number(argv[++i]);
    else if (a === "--provider" || a === "-p") args.provider = argv[++i];
    else if (a === "--out" || a === "-o") args.out = argv[++i];
    else if (a === "--headful") args.headful = true;
    else if (a === "--verbose" || a === "-v") args.verbose = true;
    else if (a === "--help" || a === "-h") args.help = true;
    else args._.push(a);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(USAGE);
    return;
  }
  if (args.verbose) setLevel("debug");

  const keyword = args.keyword || args._[0];
  const location = args.location || args._[1];
  if (!keyword || !location) {
    console.error("Error: both --keyword and --location are required.\n");
    console.log(USAGE);
    process.exitCode = 1;
    return;
  }

  const category = args.category || keyword;
  const limit = Number.isFinite(args.limit) && args.limit > 0 ? args.limit : 20;
  const outPath = path.resolve(args.out || path.join(here, "candidates.json"));

  log.step(`Lead discovery — "${keyword}" in "${location}"`);

  // 1. Search
  const { provider, query, results } = await getSearchResults({
    keyword,
    location,
    limit,
    headful: args.headful,
    provider: args.provider,
  });

  // 2. Filter
  log.step("Filter step");
  if (results.length === 0) {
    log.warn("no search results to filter");
  }
  const config = loadFilterConfig();
  const { candidates, rejected } = filterCandidates(results, {
    category,
    config,
    limit,
  });
  for (const r of rejected) {
    log.debug(`filtered out  ${r.domain ?? r.url}  —  ${r.reason}`);
  }

  // 3. Output
  const payload = {
    query: { keyword, location, category, searchQuery: query },
    provider,
    generatedAt: new Date().toISOString(),
    counts: {
      found: results.length,
      candidates: candidates.length,
      rejected: rejected.length,
    },
    candidates,
    rejected,
  };
  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`);

  log.step(`Candidates (${candidates.length})`);
  if (candidates.length) {
    for (const c of candidates) {
      console.log(`  • ${c.domain}${c.title ? `  —  ${c.title}` : ""}`);
      console.log(`    ${c.url}`);
    }
  } else {
    console.log("  (none)");
  }
  console.log(`\n  full report → ${path.relative(process.cwd(), outPath)}`);
}

main().catch((err) => {
  log.error(err.message);
  if (isDebug()) console.error(err);
  process.exitCode = 1;
});
