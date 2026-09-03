/**
 * Search provider: SerpAPI (https://serpapi.com) — a paid Google search API.
 *
 * Same contract as ./google-playwright.mjs:
 *   export async function search(query, opts) -> Array<{ url, title, rank }>
 *
 * Enable it with either:
 *   --provider serpapi        (CLI flag)
 *   LEAD_SEARCH_PROVIDER=serpapi   (env)
 * and set SERPAPI_KEY in the environment.
 *
 * Kept intentionally minimal — the point is that switching providers is an
 * isolated change with no impact on the search dispatcher or the filter step.
 */

import { log } from "../lib/logger.mjs";

export async function search(query, opts = {}) {
  const key = process.env.SERPAPI_KEY;
  if (!key) {
    throw new Error(
      "SERPAPI_KEY is not set — cannot use the serpapi provider. " +
        "Add it to your environment or use the default google-playwright provider.",
    );
  }

  const { limit = 20, location } = opts;
  const params = new URLSearchParams({
    engine: "google",
    q: query,
    num: String(Math.min(Math.max(limit * 2, 10), 100)),
    hl: "en",
    api_key: key,
  });
  if (location) params.set("location", location);

  log.debug(`GET serpapi.com/search.json (q="${query}")`);
  const res = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`SerpAPI request failed: HTTP ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (data.error) throw new Error(`SerpAPI error: ${data.error}`);

  const organic = Array.isArray(data.organic_results) ? data.organic_results : [];
  return organic
    .filter((r) => r && r.link)
    .slice(0, limit)
    .map((r, i) => ({ url: r.link, title: r.title || null, rank: r.position ?? i + 1 }));
}
