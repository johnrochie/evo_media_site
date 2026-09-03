/**
 * Filter step.
 *
 * Takes the raw search results and removes anything that isn't a plausible
 * small-business website:
 *   1. unparseable URLs
 *   2. duplicate domains (keep the highest-ranked hit)
 *   3. known social / directory / marketplace domains  (config/excluded-domains.json)
 *   4. known large chains for the search category       (config/major-chains.json)
 *
 * Returns { candidates, rejected } where every rejected entry carries a reason,
 * so the filter rules can be tuned from the run log.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { toHost, toDomain, hostMatches } from "./lib/url.mjs";
import { log } from "./lib/logger.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_DIR = path.join(here, "config");

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

export function loadFilterConfig(dir = CONFIG_DIR) {
  return {
    excluded: readJson(path.join(dir, "excluded-domains.json")),
    chains: readJson(path.join(dir, "major-chains.json")),
  };
}

/**
 * @param {Array<{url,title,rank}>} results
 * @param {object} [opts]
 * @param {string} [opts.category]  used to look up the chain list
 * @param {object} [opts.config]    from loadFilterConfig()
 * @param {number} [opts.limit]     cap the candidate list length
 * @returns {{ candidates: Array, rejected: Array }}
 */
export function filterCandidates(results, opts = {}) {
  const { category, config = loadFilterConfig(), limit } = opts;

  const excluded = (config.excluded.domains || []).map((d) => d.toLowerCase());
  const chains = collectChains(config.chains, category);
  log.debug(
    `filter config: ${excluded.length} excluded domains, ${chains.length} chain domain(s) for category "${category ?? "-"}"`,
  );

  const candidates = [];
  const rejected = [];
  const seenDomains = new Set();

  for (const r of results) {
    const host = toHost(r.url);
    const domain = toDomain(r.url);

    if (!host || !domain) {
      rejected.push({ ...r, domain: null, reason: "unparseable-url" });
      continue;
    }
    if (seenDomains.has(domain)) {
      rejected.push({ ...r, domain, reason: "duplicate-domain" });
      continue;
    }

    const exHit = excluded.find((d) => hostMatches(host, d));
    if (exHit) {
      seenDomains.add(domain);
      rejected.push({ ...r, domain, reason: `excluded-domain:${exHit}` });
      continue;
    }

    const chainHit = chains.find((d) => hostMatches(host, d) || domain === d);
    if (chainHit) {
      seenDomains.add(domain);
      rejected.push({ ...r, domain, reason: `major-chain:${chainHit}` });
      continue;
    }

    seenDomains.add(domain);
    candidates.push({
      url: r.url,
      domain,
      title: r.title ?? null,
      rank: r.rank ?? null,
    });
  }

  const trimmed =
    typeof limit === "number" ? candidates.slice(0, limit) : candidates;

  log.info(
    `kept ${trimmed.length} candidate(s); filtered out ${rejected.length} ` +
      `(${countReasons(rejected)})`,
  );

  return { candidates: trimmed, rejected };
}

function collectChains(chains, category) {
  const out = new Set((chains._global || []).map((d) => d.toLowerCase()));
  if (category) {
    const key = Object.keys(chains).find(
      (k) => k.toLowerCase() === String(category).toLowerCase(),
    );
    if (key && Array.isArray(chains[key])) {
      for (const d of chains[key]) out.add(d.toLowerCase());
    }
  }
  return [...out];
}

function countReasons(rejected) {
  const tally = {};
  for (const r of rejected) {
    const kind = r.reason.split(":")[0];
    tally[kind] = (tally[kind] || 0) + 1;
  }
  return (
    Object.entries(tally)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ") || "none"
  );
}
