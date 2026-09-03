#!/usr/bin/env node
/**
 * Phase 1 pipeline — final step: push SiteAnalyser results into the CRM (Notion).
 *
 *   node scripts/lead-crm/sync-to-notion.mjs scripts/lead-discovery/candidates.enriched.json
 *   npm run leads:crm -- <enriched.json> --dry-run -v
 *
 * Reads candidates.enriched.json, and for every candidate with
 * `analysis.needsUpgrade === true` creates (or updates) a lead in the Notion
 * database. Dedupes on the (normalised) website URL, so repeat pipeline runs
 * don't create duplicate leads. One failed Notion write is logged and skipped —
 * it never aborts the run.
 *
 * Out of scope: scheduling/cron (that's the docker/ scheduler), any changes to
 * search/filter/SiteAnalyser, and new contact-detail scraping.
 *
 * Requires:  NOTION_API_KEY   and   NOTION_LEADS_DATABASE_ID
 * (see README.md for the expected database schema — the script checks the real
 *  schema on start and tells you exactly what's missing rather than guessing.)
 */

import fs from "node:fs";
import path from "node:path";
import {
  makeClient,
  resolveToken,
  resolveDatabaseId,
  NotionConfigError,
} from "./notion.mjs";
import {
  resolveSchema,
  buildProperties,
  buildPageChildren,
  normalizeUrlForDedupe,
} from "./lead-mapping.mjs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const USAGE = `
Lead → Notion sync

Usage:
  node scripts/lead-crm/sync-to-notion.mjs <candidates.enriched.json> [options]

Options:
  -d, --database <id>   Notion database id (else NOTION_LEADS_DATABASE_ID / NOTION_DATABASE_ID)
      --band <list>     only sync these bands (default: high,medium — i.e. needsUpgrade)
      --limit <n>       cap number of leads processed
      --no-update       if a lead already exists, skip it (default: refresh its score/scan date)
      --dry-run         don't write to Notion — report what would happen
                        (with no credentials, prints the mapped payloads and exits)
  -v, --verbose
  -h, --help

Env:  NOTION_API_KEY (or NOTION_TOKEN),  NOTION_LEADS_DATABASE_ID (or NOTION_DATABASE_ID)
`;

const SCHEMA_HINT = `
Expected Notion database properties (matched by name, case-insensitive):

  <title>            (title)      — business name          [required]
  Website            (url)        — website URL, dedupe key [required]
  Score              (number)
  Score %            (number)
  Band               (select)     — high / medium / low
  Needs Upgrade      (checkbox)
  Reachable          (checkbox)
  Contact Method     (select)     — Direct (email/phone) / Form / link only / None found / Unknown
  Score Reasons      (rich_text)
  Discovered         (date)       — set once, on first insert
  Last Scanned       (date)
  Search Query       (rich_text)
  Status             (select)     — set to "New" on insert only
  Source             (select)     — set to "Lead Discovery" on insert only

Missing optional properties are skipped with a warning. See scripts/lead-crm/README.md.
`;

function parseArgs(argv) {
  const args = { _: [], update: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--database" || a === "-d") args.database = argv[++i];
    else if (a === "--band") args.band = argv[++i];
    else if (a === "--limit") args.limit = Number(argv[++i]);
    else if (a === "--no-update") args.update = false;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--verbose" || a === "-v") args.verbose = true;
    else if (a === "--help" || a === "-h") args.help = true;
    else args._.push(a);
  }
  return args;
}

function loadEnrichedFile(p) {
  const doc = JSON.parse(fs.readFileSync(p, "utf8"));
  const candidates = Array.isArray(doc) ? doc : doc.candidates || [];
  if (!Array.isArray(candidates) || !candidates.length) {
    throw new Error("no candidates found in the enriched file");
  }
  if (!candidates.some((c) => c.analysis)) {
    throw new Error(
      "candidates have no `analysis` block — run the SiteAnalyser batch step first (analyse-batch.js)",
    );
  }
  const searchQuery =
    (doc.query &&
      [doc.query.keyword, doc.query.location].filter(Boolean).join(" ").trim()) ||
    doc.query?.searchQuery ||
    "";
  return { candidates, searchQuery };
}

function selectLeads(candidates, args) {
  const bands = (args.band || "high,medium")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  let leads = candidates.filter((c) => {
    const a = c.analysis || {};
    return a.needsUpgrade === true && bands.includes(a.band);
  });
  if (args.limit) leads = leads.slice(0, args.limit);
  return leads;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return console.log(USAGE);

  const input = args._[0];
  if (!input) {
    console.error("Error: path to candidates.enriched.json is required.\n");
    console.log(USAGE);
    process.exitCode = 1;
    return;
  }

  const { candidates, searchQuery } = loadEnrichedFile(path.resolve(input));
  const leads = selectLeads(candidates, args);
  const notLead = candidates.length - leads.length;

  console.log(`\n▸ Lead sync — ${leads.length} lead(s) to sync, ${notLead} candidate(s) skipped (not a lead)`);
  if (searchQuery) console.log(`  search query: "${searchQuery}"`);

  const token = resolveToken(args.token);
  const databaseId = resolveDatabaseId(args.database);

  // --- no credentials: flag it (offline dry-run still shows the mapping) ---
  if (!token || !databaseId) {
    console.log("\n⚠  Notion is not configured.");
    if (!token) console.log("   missing: NOTION_API_KEY (or NOTION_TOKEN)");
    if (!databaseId) console.log("   missing: NOTION_LEADS_DATABASE_ID (or NOTION_DATABASE_ID)");
    console.log("\n   Create an integration at https://www.notion.so/my-integrations,");
    console.log("   share the leads database with it, then set the two env vars.");
    console.log(SCHEMA_HINT);

    if (args.dryRun) {
      console.log("── dry-run: mapped payload for the first lead(s) ──");
      const fakeSchema = {
        titleProp: "Name",
        resolved: Object.fromEntries(
          ["website", "score", "scorePct", "band", "needsUpgrade", "reachable",
           "contact", "reasons", "lastScanned", "query", "status", "source"].map((s) => [
            s, { name: s, type: "x" },
          ]),
        ),
      };
      for (const lead of leads.slice(0, 3)) {
        console.log(`\n${lead.url}`);
        console.log(JSON.stringify(buildProperties(lead, fakeSchema, { searchQuery, isCreate: true }), null, 2));
      }
      return;
    }
    process.exitCode = 1;
    return;
  }

  // --- connect + validate schema ---
  let client;
  let db;
  try {
    client = makeClient({ token });
    db = await client.retrieveDatabase(databaseId);
  } catch (err) {
    console.error(`\n✗ Could not open the Notion database (${databaseId}):`);
    console.error(`  ${err.message}`);
    if (err instanceof NotionConfigError || err.status === 404 || err.status === 401) {
      console.error("  Check the id, and that the database is shared with your integration.");
    }
    process.exitCode = 1;
    return;
  }

  const schema = resolveSchema(db);
  if (schema.errors.length) {
    console.error("\n✗ The Notion database is missing required properties:");
    for (const e of schema.errors) console.error(`  - ${e}`);
    console.error(SCHEMA_HINT);
    process.exitCode = 1;
    return;
  }
  if (schema.missing.length) {
    console.log(`\n  note: optional properties not found (skipped): ${schema.missing.join(", ")}`);
  }

  const urlProp = schema.resolved.website.name;
  const tally = { created: 0, updated: 0, skippedExisting: 0, failed: 0 };

  for (const [i, lead] of leads.entries()) {
    const normUrl = normalizeUrlForDedupe(lead.url);
    const label = `[${i + 1}/${leads.length}] ${normUrl}`;
    try {
      const found = await client.queryDatabase(databaseId, {
        filter: { property: urlProp, url: { equals: normUrl } },
        page_size: 1,
      });
      const existing = found.results && found.results[0];

      if (existing && !args.update) {
        tally.skippedExisting++;
        if (args.verbose) console.log(`  ${label}  — exists, skipped`);
      } else if (existing) {
        if (!args.dryRun) {
          await client.updatePage(existing.id, {
            properties: buildProperties(lead, schema, { searchQuery, isCreate: false }),
          });
        }
        tally.updated++;
        if (args.verbose) console.log(`  ${label}  — ${args.dryRun ? "would update" : "updated"}`);
      } else {
        if (!args.dryRun) {
          await client.createPage({
            parent: { database_id: databaseId },
            properties: buildProperties(lead, schema, { searchQuery, isCreate: true }),
            children: buildPageChildren(lead),
          });
        }
        tally.created++;
        if (args.verbose) console.log(`  ${label}  — ${args.dryRun ? "would create" : "created"} (${lead.analysis.band})`);
      }
    } catch (err) {
      tally.failed++;
      console.error(`  ${label}  ✗ ${err.message}`);
    }

    await sleep(350); // stay under Notion's ~3 req/s
  }

  console.log(
    `\n▸ ${args.dryRun ? "Dry run" : "Done"}: ` +
      `${tally.created} created, ${tally.updated} updated, ` +
      `${tally.skippedExisting} skipped (already in CRM), ` +
      `${notLead} skipped (not a lead), ${tally.failed} failed\n`,
  );
  if (tally.failed) process.exitCode = 1;
}

main().catch((err) => {
  console.error("Lead sync failed:", err.message);
  process.exitCode = 1;
});
