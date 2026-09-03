/**
 * Batch runner for SiteAnalyser.
 *
 * Takes the candidate list from the Lead Discovery engine (Prompt 1's
 * candidates.json) and runs every URL through analyzeWebsite(), with:
 *   - bounded concurrency (default 3)
 *   - polite stagger between requests (delay + jitter)
 *   - per-site isolation: one unreachable/slow site never aborts the run
 *   - a progress callback
 *
 * Returns { results, summary }. `results` is the candidate list enriched with
 * an `analysis` block per entry — this feeds the CRM lead record in Prompt 3.
 */

const { analyzeWebsite, ANALYZER_VERSION } = require("./analyzer");
const { closeBrowser } = require("./renderer");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const BATCH_DEFAULTS = {
  concurrency: 3,
  delayMs: 400, // minimum gap before each request starts
  jitterMs: 400, // random extra 0..jitterMs
  limit: null, // cap number of candidates processed
};

function candidateUrl(item) {
  if (typeof item === "string") return item;
  return item.url || item.website || item.finalUrl || "";
}

function enrich(item, analysis, error, ms) {
  const bare = typeof item === "string" ? { url: item } : { ...item };

  if (!analysis) {
    return {
      ...bare,
      analysis: {
        score: null,
        scorePct: null,
        band: "unknown",
        priority: "UNKNOWN",
        needsUpgrade: null,
        reachable: false,
        criteria: [],
        summary: `Analysis failed: ${error?.message || error || "unknown error"}`,
        analyzerVersion: ANALYZER_VERSION,
        analyzedAt: new Date().toISOString(),
      },
      analysisError: error?.code || error?.message || String(error),
      analysisMs: ms,
    };
  }

  return {
    ...bare,
    analysis: {
      score: analysis.score,
      maxScore: analysis.maxScore,
      applicableMaxScore: analysis.applicableMaxScore,
      scorePct: analysis.scorePct,
      band: analysis.band,
      priority: analysis.priority,
      needsUpgrade: analysis.needsUpgrade,
      reachable: analysis.reachable,
      blocked: analysis.blocked ?? false,
      finalUrl: analysis.finalUrl,
      redirected: analysis.redirected ?? null,
      httpStatus: analysis.httpStatus ?? null,
      https: analysis.https ?? null,
      rendered: analysis.rendered ?? false,
      noWebsite: analysis.noWebsite ?? false,
      criteria: analysis.criteria,
      summary: analysis.summary,
      analyzerVersion: analysis.analyzerVersion,
      analyzedAt: analysis.analyzedAt,
    },
    analysisError: analysis.reachable ? null : analysis.error || null,
    analysisMs: ms,
  };
}

function summarize(results) {
  const byBand = { high: 0, medium: 0, low: 0, unknown: 0, greenfield: 0, blocked: 0 };
  let reachable = 0;
  let unreachable = 0;
  let blocked = 0;
  let needsUpgrade = 0;
  let pctSum = 0;
  let pctCount = 0;

  for (const r of results) {
    const a = r.analysis || {};
    byBand[a.band] = (byBand[a.band] || 0) + 1;
    if (a.blocked) {
      blocked++;
    } else if (a.reachable) {
      reachable++;
      if (typeof a.scorePct === "number") {
        pctSum += a.scorePct;
        pctCount++;
      }
    } else {
      unreachable++;
    }
    if (a.needsUpgrade) needsUpgrade++;
  }

  return {
    total: results.length,
    reachable,
    unreachable,
    blocked,
    needsUpgrade,
    byBand,
    avgScorePct: pctCount ? Number((pctSum / pctCount).toFixed(3)) : null,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * @param {Array<object|string>} candidates
 * @param {object} [opts] BATCH_DEFAULTS + any analyzeWebsite opts
 *   (timeout, retries, render, userAgent, ...), plus onProgress(evt).
 * @returns {Promise<{ results: object[], summary: object }>}
 */
function withDefaults(defaults, opts) {
  const cfg = { ...defaults };
  for (const [k, v] of Object.entries(opts || {})) {
    if (v !== undefined) cfg[k] = v;
  }
  return cfg;
}

async function runBatch(candidates, opts = {}) {
  const cfg = withDefaults(BATCH_DEFAULTS, opts);
  const list = Array.isArray(candidates) ? candidates : [];
  const items = cfg.limit ? list.slice(0, cfg.limit) : list;
  const results = new Array(items.length);

  let cursor = 0;
  let completed = 0;

  async function worker() {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      const item = items[i];
      const url = candidateUrl(item);

      await sleep(cfg.delayMs + Math.random() * cfg.jitterMs);

      const t0 = Date.now();
      let result;
      try {
        // analyzeWebsite is designed not to throw, but guard anyway so a bug
        // in scoring can't take down the whole batch.
        const analysis = await analyzeWebsite(url, {
          businessName: (typeof item === "object" && (item.businessName || item.title)) || undefined,
          category: (typeof item === "object" && item.category) || undefined,
          timeout: cfg.timeout,
          retries: cfg.retries,
          maxRedirects: cfg.maxRedirects,
          userAgent: cfg.userAgent,
          render: cfg.render,
          renderTimeout: cfg.renderTimeout,
        });
        result = enrich(item, analysis, null, Date.now() - t0);
      } catch (err) {
        result = enrich(item, null, err, Date.now() - t0);
      }

      results[i] = result;
      completed++;
      if (typeof cfg.onProgress === "function") {
        cfg.onProgress({ done: completed, total: items.length, index: i, result });
      }
    }
  }

  const workerCount = Math.max(1, Math.min(cfg.concurrency, items.length));
  try {
    await Promise.all(Array.from({ length: workerCount }, () => worker()));
  } finally {
    if (cfg.render) await closeBrowser().catch(() => {});
  }

  return { results, summary: summarize(results) };
}

module.exports = { runBatch, summarize, BATCH_DEFAULTS };
