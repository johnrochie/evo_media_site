/**
 * Minimal Notion REST client — just the four calls the lead sync needs.
 * Uses global fetch (Node 18+); no SDK dependency.
 *
 * Auth: NOTION_API_KEY (or NOTION_TOKEN). Get one at
 * https://www.notion.so/my-integrations and share the target database with it.
 */

const DEFAULT_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class NotionConfigError extends Error {}
export class NotionApiError extends Error {}

export function resolveToken(explicit) {
  return explicit || process.env.NOTION_API_KEY || process.env.NOTION_TOKEN || null;
}

export function resolveDatabaseId(explicit) {
  return (
    explicit ||
    process.env.NOTION_LEADS_DATABASE_ID ||
    process.env.NOTION_DATABASE_ID ||
    null
  );
}

export function makeClient({ token, version = NOTION_VERSION, base } = {}) {
  const auth = resolveToken(token);
  if (!auth) {
    throw new NotionConfigError(
      "NOTION_API_KEY (or NOTION_TOKEN) is not set — cannot talk to Notion.",
    );
  }
  const BASE = base || process.env.NOTION_API_BASE || DEFAULT_BASE;

  async function req(method, path, body, { retries = 3 } = {}) {
    let lastErr;
    for (let attempt = 0; attempt <= retries; attempt++) {
      let res;
      try {
        res = await fetch(BASE + path, {
          method,
          headers: {
            Authorization: `Bearer ${auth}`,
            "Notion-Version": version,
            "Content-Type": "application/json",
          },
          body: body ? JSON.stringify(body) : undefined,
        });
      } catch (err) {
        lastErr = new NotionApiError(`Notion ${method} ${path} — network error: ${err.message}`);
        if (attempt < retries) {
          await sleep(500 * 2 ** attempt);
          continue;
        }
        throw lastErr;
      }

      if (res.status === 429 && attempt < retries) {
        await sleep((Number(res.headers.get("retry-after")) || 1) * 1000);
        continue;
      }

      const json = await res.json().catch(() => ({}));
      if (res.ok) return json;

      const err = new NotionApiError(
        `Notion ${method} ${path} → ${res.status} ${json.code || ""}: ${json.message || res.statusText}`.trim(),
      );
      err.status = res.status;
      err.notionCode = json.code;
      if (res.status >= 500 && attempt < retries) {
        lastErr = err;
        await sleep(500 * 2 ** attempt);
        continue;
      }
      throw err;
    }
    throw lastErr;
  }

  return {
    retrieveDatabase: (id) => req("GET", `/databases/${id}`),
    queryDatabase: (id, filterBody) => req("POST", `/databases/${id}/query`, filterBody),
    createPage: (body) => req("POST", "/pages", body),
    updatePage: (id, patch) => req("PATCH", `/pages/${id}`, patch),
  };
}
