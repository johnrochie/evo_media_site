/**
 * Search provider: real browser-based Google search via Playwright.
 *
 * Contract (shared by every provider in ./):
 *   export async function search(query, opts) -> Array<{ url, title, rank }>
 *
 *   query : full search string, e.g. "plumber Cork, Ireland"
 *   opts  : { limit?: number, headful?: boolean, location?: string }
 *
 * This is the v1 default. To swap in a paid API later, add a sibling module
 * (see ./serpapi.mjs) and register it in ../search.mjs — nothing else changes.
 *
 * By design this runs slowly with human-ish pacing. It is meant to be called
 * on a schedule at low volume, not in a loop.
 */

import { chromium } from "playwright";
import { log } from "../lib/logger.mjs";
import { sleep, randInt, humanType, humanScroll, settle } from "../lib/human.mjs";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

// "Reject all" only — we never accept non-essential cookies.
const CONSENT_REJECT_SELECTORS = [
  "#W0wltc",
  'button:has-text("Reject all")',
  'button:has-text("Reject All")',
  'button[aria-label="Reject all"]',
  'div[role="dialog"] button:has-text("Reject")',
];

export async function search(query, opts = {}) {
  const { limit = 20, headful = false } = opts;

  const browser = await chromium.launch({
    headless: !headful,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  });
  const context = await browser.newContext({
    locale: "en-US",
    timezoneId: "Europe/Dublin",
    viewport: { width: 1280, height: 900 },
    userAgent: USER_AGENT,
  });
  // Light touch: hide the most obvious automation tell. This is not a full
  // anti-detection layer — Google may still serve a bot-check, especially from
  // datacentre IPs. When that happens the run fails with a clear message.
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });
  const page = await context.newPage();

  try {
    log.debug("opening google.com");
    await page.goto("https://www.google.com/?hl=en", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await dismissConsent(page);
    await settle(page);

    const box = page.locator('textarea[name="q"], input[name="q"]').first();
    await box.waitFor({ state: "visible", timeout: 15000 });
    await box.click();
    await sleep(randInt(300, 900));
    await humanType(box, query);
    await sleep(randInt(400, 1200));
    await page.keyboard.press("Enter");

    await page.waitForLoadState("domcontentloaded");
    await page
      .waitForSelector("#search, #rso, form#captcha-form", { timeout: 20000 })
      .catch(() => {});
    await sleep(randInt(800, 1800));

    if (await looksBlocked(page)) {
      throw new Error(
        "Google returned a bot-check / CAPTCHA page. Back off and retry later, " +
          "or run with --provider serpapi.",
      );
    }

    await humanScroll(page);

    const raw = await page.evaluate(() => {
      const container =
        document.querySelector("#search") ||
        document.querySelector("#rso") ||
        document.body;
      const seen = new Set();
      const out = [];
      container.querySelectorAll("h3").forEach((h3) => {
        const a = h3.closest("a[href]");
        if (!a) return;
        const href = a.href;
        if (!href || !href.startsWith("http")) return;
        if (seen.has(href)) return;
        seen.add(href);
        out.push({ url: href, title: h3.textContent.trim() });
      });
      return out;
    });

    const results = raw
      .filter((r) => !isGoogleInternal(r.url))
      .slice(0, limit)
      .map((r, i) => ({ url: r.url, title: r.title || null, rank: i + 1 }));

    log.debug(`extracted ${results.length} organic result(s) from the page`);
    return results;
  } finally {
    await context.close();
    await browser.close();
  }
}

async function dismissConsent(page) {
  // A consent wall may appear inline or as a redirect to consent.google.com.
  await sleep(randInt(500, 1200));
  for (const sel of CONSENT_REJECT_SELECTORS) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 1500 })) {
        await el.click({ timeout: 2000 });
        log.debug(`rejected consent cookies via ${sel}`);
        await page.waitForLoadState("domcontentloaded").catch(() => {});
        await sleep(randInt(500, 1200));
        return;
      }
    } catch {
      /* try the next selector */
    }
  }
  log.debug("no consent dialog detected");
}

async function looksBlocked(page) {
  if (/\/sorry\/|consent\.google\.com/.test(page.url())) return true;
  if (await page.locator("form#captcha-form").count()) return true;
  const body = (await page.locator("body").innerText().catch(() => "")) || "";
  return /unusual traffic|not a robot|systems have detected/i.test(body);
}

function isGoogleInternal(url) {
  try {
    const h = new URL(url).hostname;
    return (
      h.endsWith("google.com") ||
      h.endsWith("google.ie") ||
      h.endsWith("gstatic.com") ||
      h.endsWith("googleusercontent.com")
    );
  } catch {
    return true;
  }
}
