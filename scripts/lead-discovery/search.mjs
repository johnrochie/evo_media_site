/**
 * Search step — provider-agnostic dispatcher.
 *
 * The rest of the engine only ever calls getSearchResults(). Providers live in
 * ./providers/*.mjs and all implement the same contract:
 *
 *   export async function search(query, opts) -> Array<{ url, title, rank }>
 *
 * To add a paid API later: drop in a new provider module and register it in
 * PROVIDERS below. No other file needs to change.
 */

import { log } from "./lib/logger.mjs";
import * as googlePlaywright from "./providers/google-playwright.mjs";
import * as serpapi from "./providers/serpapi.mjs";

const PROVIDERS = {
  "google-playwright": googlePlaywright,
  serpapi,
};

export const DEFAULT_PROVIDER = "google-playwright";

export function resolveProviderName(explicit) {
  return explicit || process.env.LEAD_SEARCH_PROVIDER || DEFAULT_PROVIDER;
}

/**
 * @param {object} args
 * @param {string} args.keyword   e.g. "plumber"
 * @param {string} args.location  e.g. "Cork, Ireland"
 * @param {number} [args.limit]   max organic results to keep (default 20)
 * @param {boolean} [args.headful]
 * @param {string} [args.provider]
 * @returns {Promise<{ provider: string, query: string, results: Array<{url,title,rank}> }>}
 */
export async function getSearchResults({
  keyword,
  location,
  limit = 20,
  headful = false,
  provider,
} = {}) {
  const name = resolveProviderName(provider);
  const impl = PROVIDERS[name];
  if (!impl) {
    throw new Error(
      `Unknown search provider "${name}". Available: ${Object.keys(PROVIDERS).join(", ")}`,
    );
  }

  const query = [keyword, location].filter(Boolean).join(" ").trim();
  log.step(`Search step — provider "${name}"`);
  log.info(`query: "${query}"`);

  const started = Date.now();
  const rawResults = await impl.search(query, { limit, headful, location });

  // Normalise: drop blanks, dedupe by URL, re-rank.
  const seen = new Set();
  const results = [];
  for (const r of rawResults || []) {
    if (!r || !r.url || seen.has(r.url)) continue;
    seen.add(r.url);
    results.push({
      url: r.url,
      title: r.title ?? null,
      rank: Number.isFinite(r.rank) ? r.rank : results.length + 1,
    });
  }

  const secs = ((Date.now() - started) / 1000).toFixed(1);
  log.info(`found ${results.length} organic result(s) in ${secs}s`);
  for (const r of results) log.debug(`#${r.rank} ${r.url}`);

  return { provider: name, query, results };
}
