/**
 * Optional headless-browser rendering for JS-only sites.
 *
 * server.js imported puppeteer but never used it, so SPA shells (React/Vue/etc.
 * that ship an near-empty <body>) were mis-scored on their raw HTML. Rendering
 * is opt-in because it is ~10-20x slower and less deterministic than a plain
 * fetch — batch runs stay fast and repeatable by default.
 *
 * Enable per call with { render: true } (render only when the raw HTML looks
 * like an empty shell) or { render: "always" }. Puppeteer is lazy-required so
 * a batch run that doesn't ask for rendering never loads it.
 */

let _puppeteer = null;
let _browserPromise = null;

const DEFAULT_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

/** Heuristic: does this HTML look like an un-hydrated SPA shell? */
function looksLikeEmptyShell(html) {
  if (!html) return true;
  const bodyMatch = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(html);
  const body = bodyMatch ? bodyMatch[1] : html;
  const visibleText = body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const hasRootDiv = /<div[^>]+id=["'](?:root|app|__next|__nuxt)["']/i.test(html);
  return visibleText.length < 200 && hasRootDiv;
}

function shouldRender(html, opts = {}) {
  if (opts.render === "always") return true;
  if (!opts.render) return false;
  return looksLikeEmptyShell(html);
}

async function getBrowser() {
  if (!_browserPromise) {
    _puppeteer = _puppeteer || require("puppeteer");
    _browserPromise = _puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
  }
  return _browserPromise;
}

async function renderPage(url, opts = {}) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setUserAgent(opts.userAgent || DEFAULT_UA);
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: opts.renderTimeout || 20000,
    });
    return await page.content();
  } finally {
    await page.close().catch(() => {});
  }
}

async function closeBrowser() {
  if (_browserPromise) {
    const b = await _browserPromise.catch(() => null);
    _browserPromise = null;
    if (b) await b.close().catch(() => {});
  }
}

module.exports = { renderPage, shouldRender, looksLikeEmptyShell, closeBrowser };
