#!/usr/bin/env node
/**
 * Batch SiteAnalyser CLI.
 *
 *   node scripts/analyse-batch.js ../scripts/lead-discovery/candidates.json
 *   node scripts/analyse-batch.js candidates.json --out enriched.json --concurrency 4 -v
 *
 * Input: the Lead Discovery engine's candidates.json  (Prompt 1), i.e.
 *   { query, provider, candidates: [ { url, domain, title, rank }, ... ], ... }
 * A bare JSON array of candidates (or of URL strings) also works.
 *
 * Output: the same document with each candidate enriched with an `analysis`
 * block, plus a top-level `analysis` summary. Written to
 * <input>.enriched.json by default. Feeds the CRM step (Prompt 3).
 *
 * Out of scope here: CRM / DB writes, scheduling.
 */

const fs = require("fs");
const path = require("path");
const { runBatch } = require("../batch");
const { ANALYZER_VERSION } = require("../analyzer");

const USAGE = `
Batch SiteAnalyser

Usage:
  node scripts/analyse-batch.js <candidates.json> [options]

Options:
  -o, --out <path>        output file (default: <input>.enriched.json)
      --concurrency <n>   parallel requests (default: 3)
      --delay <ms>        min gap before each request (default: 400)
      --timeout <ms>      per-request timeout (default: 12000)
      --retries <n>       transient-failure retries (default: 2)
      --limit <n>         only analyse the first n candidates
      --render            use a headless browser for empty SPA shells (slow)
  -v, --verbose           per-site progress logging
  -h, --help
`;

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out" || a === "-o") args.out = argv[++i];
    else if (a === "--concurrency") args.concurrency = Number(argv[++i]);
    else if (a === "--delay") args.delay = Number(argv[++i]);
    else if (a === "--timeout") args.timeout = Number(argv[++i]);
    else if (a === "--retries") args.retries = Number(argv[++i]);
    else if (a === "--limit") args.limit = Number(argv[++i]);
    else if (a === "--render") args.render = true;
    else if (a === "--verbose" || a === "-v") args.verbose = true;
    else if (a === "--help" || a === "-h") args.help = true;
    else args._.push(a);
  }
  return args;
}

function loadCandidates(inputPath) {
  const raw = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  if (Array.isArray(raw)) return { doc: { candidates: raw }, candidates: raw };
  const candidates = raw.candidates || raw.websites || raw.results || [];
  if (!Array.isArray(candidates)) {
    throw new Error("Could not find a candidate array (expected `candidates`, `websites` or a top-level array).");
  }
  return { doc: raw, candidates };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return console.log(USAGE);

  const inputPath = args._[0];
  if (!inputPath) {
    console.error("Error: path to candidates.json is required.\n");
    console.log(USAGE);
    process.exitCode = 1;
    return;
  }
  const resolvedIn = path.resolve(inputPath);
  const outPath = path.resolve(
    args.out || resolvedIn.replace(/\.json$/i, "") + ".enriched.json",
  );

  const { doc, candidates } = loadCandidates(resolvedIn);
  const total = args.limit ? Math.min(args.limit, candidates.length) : candidates.length;
  console.log(`\n▸ SiteAnalyser batch — ${total} candidate(s) from ${path.relative(process.cwd(), resolvedIn)}`);
  if (args.render) console.log("  headless rendering: on");

  const started = Date.now();
  const { results, summary } = await runBatch(candidates, {
    concurrency: args.concurrency,
    delayMs: args.delay,
    timeout: args.timeout,
    retries: args.retries,
    limit: args.limit,
    render: args.render,
    onProgress: ({ done, total, result }) => {
      const a = result.analysis || {};
      const score = a.score == null ? "  –" : `${String(a.score).padStart(2)}/${a.maxScore}`;
      const tag = a.blocked ? "BLOCKED" : a.reachable ? a.band.toUpperCase().padEnd(6) : "UNREACH";
      if (args.verbose || !a.reachable) {
        console.log(
          `  [${String(done).padStart(3)}/${total}] ${score}  ${tag}  ${result.url}` +
            (a.reachable ? "" : `  (${result.analysisError || "error"})`),
        );
      } else if (done % 10 === 0 || done === total) {
        console.log(`  [${String(done).padStart(3)}/${total}] …`);
      }
    },
  });

  const enriched = {
    ...doc,
    candidates: results,
    analysis: {
      ...summary,
      analyzerVersion: ANALYZER_VERSION,
      options: {
        concurrency: args.concurrency ?? 3,
        delayMs: args.delay ?? 400,
        timeout: args.timeout ?? 12000,
        retries: args.retries ?? 2,
        render: !!args.render,
      },
      elapsedSeconds: Number(((Date.now() - started) / 1000).toFixed(1)),
    },
  };
  fs.writeFileSync(outPath, JSON.stringify(enriched, null, 2) + "\n");

  const s = summary;
  console.log(`\n▸ Done in ${enriched.analysis.elapsedSeconds}s`);
  console.log(
    `  reachable ${s.reachable}/${s.total}   unreachable ${s.unreachable}   blocked ${s.blocked || 0}   needs-upgrade ${s.needsUpgrade}`,
  );
  console.log(
    `  bands  high ${s.byBand.high}  medium ${s.byBand.medium}  low ${s.byBand.low}  unknown ${s.byBand.unknown}  blocked ${s.byBand.blocked || 0}`,
  );
  console.log(`  avg score ${s.avgScorePct == null ? "n/a" : Math.round(s.avgScorePct * 100) + "%"} of applicable`);
  console.log(`\n  written to ${path.relative(process.cwd(), outPath)}\n`);
}

main().catch((err) => {
  console.error("Batch failed:", err.message);
  process.exitCode = 1;
});
