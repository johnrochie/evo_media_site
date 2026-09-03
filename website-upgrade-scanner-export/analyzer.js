/**
 * SiteAnalyser — website scoring core.
 *
 * Extracted from server.js so it can be reused by the HTTP API, the bulk
 * endpoint, and the batch CLI without duplicating logic.
 *
 * Design goals for batch use (see CODE-REVIEW.md):
 *   - deterministic: same site -> same score (retries on transient failure,
 *     signal-based detection instead of loose substring matching)
 *   - never throws: unreachable sites resolve to a structured result with
 *     reachable:false, so a batch run can log-and-continue
 *   - explainable: every result carries a `criteria` array (the key reasons
 *     behind the score) for the CRM lead record
 *
 * Still callable as a one-off:  analyzeWebsite(url, { businessName, category })
 */

const axios = require("axios");
const cheerio = require("cheerio");
const { renderPage, shouldRender } = require("./renderer");
const {
  assertUrlAllowed,
  httpAgent,
  httpsAgent,
  beforeRedirect,
  isSsrfBlock,
  ssrfReason,
  SSRF_CODE,
} = require("./ssrf");

const ANALYZER_VERSION = "2.0.0";

const DEFAULT_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 " +
  `EvoMediaSiteAnalyser/${ANALYZER_VERSION}`;

const FETCH_DEFAULTS = {
  timeout: 12000,
  maxRedirects: 5,
  maxContentBytes: 8 * 1024 * 1024,
  retries: 2,
  retryBaseDelayMs: 800,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Scoring criteria — total 15 points. Each evaluate(ctx) returns:
//   { points, passed, evidence, shortFail?, notApplicable? }
// ---------------------------------------------------------------------------

const CRITERIA = [
  {
    key: "https",
    label: "HTTPS / secure transport",
    maxPoints: 3,
    shortFail: "no HTTPS",
    evaluate(ctx) {
      if (ctx.isHttps) {
        return {
          points: 3,
          passed: true,
          evidence: ctx.httpsUpgraded
            ? "Redirects HTTP → HTTPS"
            : "Served over HTTPS",
        };
      }
      return {
        points: 0,
        passed: false,
        evidence: `Final URL is ${new URL(ctx.finalUrl).protocol.replace(":", "")} — no HTTPS`,
      };
    },
  },
  {
    key: "mobile",
    label: "Mobile-friendly viewport",
    maxPoints: 3,
    shortFail: "not mobile-friendly",
    evaluate(ctx) {
      const viewport = ctx.$('meta[name="viewport"]').attr("content") || "";
      if (/width\s*=\s*device-width/i.test(viewport)) {
        return { points: 3, passed: true, evidence: `viewport: "${viewport.trim()}"` };
      }
      if (viewport) {
        return {
          points: 1,
          passed: false,
          evidence: `viewport present but no device-width: "${viewport.trim()}"`,
        };
      }
      return { points: 0, passed: false, evidence: "No viewport meta tag" };
    },
  },
  {
    key: "modern_stack",
    label: "Modern front-end stack",
    maxPoints: 3,
    shortFail: "no modern framework",
    evaluate(ctx) {
      const { html, $ } = ctx;
      const signals = [];

      if (/\/_next\/|id="__next"|__NEXT_DATA__/.test(html)) signals.push("Next.js");
      if (/\/_nuxt\/|window\.__NUXT__/.test(html)) signals.push("Nuxt");
      if (/data-reactroot|react-dom(?:\.production)?|["']react["']/.test(html))
        signals.push("React");
      if (/data-v-[0-9a-f]{6,}|__vue__|vue(?:\.runtime)?\.[a-z]+\.js/.test(html))
        signals.push("Vue");
      if (/ng-version="|\sng-app|\[ng-/.test(html)) signals.push("Angular");
      if (/svelte-[0-9a-z]{4,}/.test(html)) signals.push("Svelte");
      if (/cdn\.tailwindcss\.com|tailwind(?:\.min)?\.css|--tw-/.test(html))
        signals.push("Tailwind");
      if (/\.astro-|astro-island/.test(html)) signals.push("Astro");

      const generator = ($('meta[name="generator"]').attr("content") || "").trim();
      if (/webflow/i.test(generator) || /webflow\.io|assets\.website-files\.com/.test(html))
        signals.push("Webflow");
      if (/framer/i.test(generator) || /framerusercontent\.com/.test(html))
        signals.push("Framer");

      const legacyCms = /wp-content|wp-includes/.test(html)
        ? "WordPress"
        : /squarespace/i.test(generator + html)
          ? "Squarespace"
          : /wix\.com|_wixCssVars/.test(html)
            ? "Wix"
            : generator && !signals.length
              ? generator
              : null;

      if (signals.length) {
        return {
          points: 3,
          passed: true,
          evidence: `Detected: ${[...new Set(signals)].join(", ")}`,
        };
      }
      const jquery = /jquery(?:-\d|\.min)?\.js/.test(html);
      return {
        points: 0,
        passed: false,
        evidence: legacyCms
          ? `No modern framework — ${legacyCms}${jquery ? " + jQuery" : ""}`
          : jquery
            ? "No modern framework — jQuery-era markup"
            : "No modern framework signals",
      };
    },
  },
  {
    key: "contact",
    label: "Reachable contact method",
    maxPoints: 2,
    shortFail: "no contact method",
    evaluate(ctx) {
      const { $ } = ctx;
      const mailto = $('a[href^="mailto:"]').length;
      const tel = $('a[href^="tel:"]').length;
      const emailInput = $('form input[type="email"]').length;
      const contactLink = $("a").filter((_, el) => {
        const href = ($(el).attr("href") || "").toLowerCase();
        const text = $(el).text().toLowerCase();
        return /contact|get in touch|enquir/.test(href) || /contact|get in touch|enquir/.test(text);
      }).length;

      if (mailto || tel) {
        const bits = [];
        if (mailto) bits.push(`${mailto} mailto: link${mailto > 1 ? "s" : ""}`);
        if (tel) bits.push(`${tel} tel: link${tel > 1 ? "s" : ""}`);
        return { points: 2, passed: true, evidence: bits.join(", ") };
      }
      if (emailInput || contactLink) {
        return {
          points: 1,
          passed: false,
          evidence: emailInput
            ? "Only a contact form (no direct mailto:/tel:)"
            : "Only a 'Contact' link (no direct mailto:/tel:)",
        };
      }
      return { points: 0, passed: false, evidence: "No mailto:, tel:, contact form or contact link" };
    },
  },
  {
    key: "img_alt",
    label: "Image alt-text coverage",
    maxPoints: 2,
    shortFail: "weak image alt-text",
    evaluate(ctx) {
      const imgs = ctx.$("img").toArray();
      if (imgs.length === 0) {
        return { points: 0, notApplicable: true, passed: null, evidence: "No <img> tags on the page" };
      }
      // An alt attribute that is *present* (even empty, for decorative images)
      // counts as intentional. A missing alt attribute is the accessibility fail.
      const withAlt = imgs.filter((el) => ctx.$(el).attr("alt") !== undefined).length;
      const ratio = withAlt / imgs.length;
      const evidence = `${withAlt}/${imgs.length} <img> tags have an alt attribute`;
      if (ratio >= 0.9) return { points: 2, passed: true, evidence };
      if (ratio >= 0.6) return { points: 1, passed: false, evidence };
      return { points: 0, passed: false, evidence };
    },
  },
  {
    key: "weight",
    label: "Lean HTML document",
    maxPoints: 2,
    shortFail: "heavy HTML",
    note: "HTML document only — excludes images, CSS and JS",
    evaluate(ctx) {
      const kb = Math.round(ctx.htmlBytes / 1024);
      const evidence = `HTML document ${kb} KB (excludes images/CSS/JS)`;
      if (ctx.htmlBytes < 250 * 1024) return { points: 2, passed: true, evidence };
      if (ctx.htmlBytes < 600 * 1024) return { points: 1, passed: false, evidence };
      return { points: 0, passed: false, evidence };
    },
  },
];

const MAX_SCORE = CRITERIA.reduce((s, c) => s + c.maxPoints, 0); // 15

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------

function buildUrlCandidates(raw) {
  const trimmed = raw.trim().replace(/\s+/g, "");
  if (/^https?:\/\//i.test(trimmed)) return [trimmed];
  // No protocol — prefer HTTPS, fall back to HTTP so we can still score the site.
  return [`https://${trimmed}`, `http://${trimmed}`];
}

function resolveFinalUrl(res, fallback) {
  return (
    res.request?.res?.responseUrl ||
    res.request?._redirectable?._currentUrl ||
    res.request?.responseURL ||
    fallback
  );
}

function isRetriable(err) {
  if (err.retriable) return true;
  const code = err.code || "";
  return [
    "ECONNRESET",
    "ETIMEDOUT",
    "ECONNABORTED",
    "EAI_AGAIN",
    "EPIPE",
    "ERR_SOCKET_CONNECTION_TIMEOUT",
  ].includes(code);
}

function normalizeError(err) {
  if (isSsrfBlock(err)) {
    return { code: SSRF_CODE, message: ssrfReason(err) };
  }
  const code =
    err.code ||
    (err.response?.status ? `HTTP_${err.response.status}` : null) ||
    "EUNKNOWN";
  const message =
    err.code === "ECONNABORTED" || /timeout/i.test(err.message || "")
      ? "Request timed out"
      : err.message || String(err);
  return { code, message };
}

async function fetchOnce(url, cfg) {
  const res = await axios.get(url, {
    timeout: cfg.timeout,
    maxRedirects: cfg.maxRedirects,
    maxContentLength: cfg.maxContentBytes,
    maxBodyLength: cfg.maxContentBytes,
    responseType: "text", // never let axios auto-parse JSON into an object
    decompress: true,
    validateStatus: () => true,
    // SSRF protection: private-IP DNS rejection on the initial request and every
    // redirect hop (see ssrf.js).
    httpAgent,
    httpsAgent,
    beforeRedirect,
    headers: {
      "User-Agent": cfg.userAgent || DEFAULT_UA,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-IE,en;q=0.9",
    },
  });

  if (res.status >= 500) {
    const e = new Error(`HTTP ${res.status}`);
    e.code = `HTTP_${res.status}`;
    e.retriable = true;
    throw e;
  }

  const html = typeof res.data === "string" ? res.data : String(res.data ?? "");
  const finalUrl = resolveFinalUrl(res, url);
  return {
    requestUrl: url,
    finalUrl,
    status: res.status,
    headers: res.headers || {},
    html,
    httpError: res.status >= 400,
  };
}

function withDefaults(defaults, opts = {}) {
  const cfg = { ...defaults };
  for (const [k, v] of Object.entries(opts)) {
    if (v !== undefined) cfg[k] = v; // never let an explicit `undefined` clobber a default
  }
  return cfg;
}

async function fetchWithRetries(url, opts) {
  const cfg = withDefaults(FETCH_DEFAULTS, opts);

  // Synchronous SSRF pre-flight — reject localhost / private literals / bad
  // protocols before opening a socket. DNS-resolves-to-private is caught by the
  // agent's lookup during the request.
  assertUrlAllowed(url);

  let lastErr;
  for (let attempt = 0; attempt <= cfg.retries; attempt++) {
    try {
      return await fetchOnce(url, cfg);
    } catch (err) {
      lastErr = err;
      if (isSsrfBlock(err)) break; // never retry a blocked target
      if (!isRetriable(err) || attempt === cfg.retries) break;
      await sleep(cfg.retryBaseDelayMs * 2 ** attempt + Math.random() * 250);
    }
  }
  const { code, message } = normalizeError(lastErr);
  throw Object.assign(new Error(message), { code });
}

// ---------------------------------------------------------------------------
// Aggregation
// ---------------------------------------------------------------------------

function bandFor(scorePct) {
  if (scorePct == null) return "unknown";
  if (scorePct >= 0.75) return "low";
  if (scorePct >= 0.45) return "medium";
  return "high";
}

const PRIORITY_BY_BAND = { high: "HIGH", medium: "MEDIUM", low: "LOW", unknown: "UNKNOWN", greenfield: "HIGH" };

function buildTextSummary({ reachable, band, criteria, errorCode, httpStatus, noWebsite }) {
  if (noWebsite) return "No website on file — greenfield rebuild opportunity";
  if (!reachable) {
    return `Site did not respond (${errorCode || "unknown error"}) — verify the URL before outreach`;
  }
  const failed = criteria
    .filter((c) => c.passed === false && !c.notApplicable)
    .map((c) => c.shortFail || c.label.toLowerCase());
  const lead =
    {
      high: "strong rebuild candidate",
      medium: "partial upgrade opportunity",
      low: "modern site — low priority",
      unknown: "needs manual review",
    }[band] || "needs manual review";
  const prefix = httpStatus >= 400 ? `HTTP ${httpStatus} page; ` : "";
  if (!failed.length) return `${prefix}passes all automated checks — ${lead}`;
  return `${prefix}${failed.slice(0, 3).join(", ")}${failed.length > 3 ? ", …" : ""} — ${lead}`;
}

function toLegacyDetails(criteria) {
  return criteria.map((c) => {
    const mark = c.notApplicable ? "➖" : c.passed ? "✅" : "❌";
    return `${mark} ${c.label}${c.evidence ? ` — ${c.evidence}` : ""}`;
  });
}

function scoreHtml(ctx) {
  const criteria = CRITERIA.map((c) => {
    const r = c.evaluate(ctx);
    return {
      key: c.key,
      label: c.label,
      maxPoints: c.maxPoints,
      points: r.points ?? 0,
      passed: r.passed,
      notApplicable: !!r.notApplicable,
      evidence: r.evidence || null,
      shortFail: c.shortFail || null,
      ...(c.note ? { note: c.note } : {}),
    };
  });

  const applicable = criteria.filter((c) => !c.notApplicable);
  const applicableMaxScore = applicable.reduce((s, c) => s + c.maxPoints, 0);
  const score = applicable.reduce((s, c) => s + c.points, 0);
  const scorePct = applicableMaxScore ? Number((score / applicableMaxScore).toFixed(3)) : null;
  const band = bandFor(scorePct);

  return { criteria, score, applicableMaxScore, scorePct, band };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * @param {string} url
 * @param {object} [opts]
 *   businessName, category            passed through onto the result
 *   timeout, retries, maxRedirects    fetch tuning (see FETCH_DEFAULTS)
 *   userAgent
 *   render: boolean | "always"        use a headless browser for JS-rendered
 *                                     sites (slower; off by default)
 * @returns {Promise<object>} always resolves — never throws for a bad site
 */
async function analyzeWebsite(url, opts = {}) {
  const { businessName = null, category = null } = opts;
  const requested = (url || "").trim();
  const analyzedAt = new Date().toISOString();
  const base = { url: requested, requestedUrl: requested, businessName, category, analyzerVersion: ANALYZER_VERSION, analyzedAt };

  if (!requested || requested.toUpperCase() === "NO_WEBSITE") {
    return {
      ...base,
      hasWebsite: false,
      noWebsite: true,
      reachable: false,
      blocked: false,
      finalUrl: null,
      score: null,
      maxScore: MAX_SCORE,
      applicableMaxScore: MAX_SCORE,
      scorePct: null,
      band: "greenfield",
      priority: PRIORITY_BY_BAND.greenfield,
      needsUpgrade: true,
      criteria: [],
      details: ["No website found"],
      summary: buildTextSummary({ noWebsite: true }),
    };
  }

  // 1. Fetch (try https then http; retry transient failures)
  let fetched = null;
  let fetchError = null;
  for (const candidate of buildUrlCandidates(requested)) {
    try {
      fetched = await fetchWithRetries(candidate, opts);
      break;
    } catch (err) {
      fetchError = err;
      // A blocked target is blocked on every scheme — don't try the http:// variant.
      if (isSsrfBlock(err)) break;
    }
  }

  if (!fetched) {
    const { code, message } = fetchError ? normalizeError(fetchError) : { code: "EUNKNOWN", message: "unknown error" };
    const blocked = code === SSRF_CODE;
    return {
      ...base,
      hasWebsite: false,
      reachable: false,
      blocked,
      finalUrl: null,
      error: code,
      errorMessage: message,
      score: null,
      maxScore: MAX_SCORE,
      applicableMaxScore: MAX_SCORE,
      scorePct: null,
      band: blocked ? "blocked" : "unknown",
      priority: "UNKNOWN",
      needsUpgrade: blocked ? false : null,
      criteria: [],
      details: [blocked ? `Blocked: ${message}` : `Error: ${message}`],
      summary: blocked
        ? `${message} — not scanned`
        : buildTextSummary({ reachable: false, errorCode: code }),
    };
  }

  // 2. Optionally render JS-heavy pages
  let html = fetched.html;
  let rendered = false;
  if (shouldRender(html, opts)) {
    try {
      // finalUrl already passed the SSRF agent check during the fetch; re-run the
      // sync guard before handing it to the headless browser. (Puppeteer's own
      // sub-resource / redirect requests are not IP-filtered — a follow-up if
      // rendering is ever enabled in production.)
      assertUrlAllowed(fetched.finalUrl);
      html = await renderPage(fetched.finalUrl, opts);
      rendered = true;
    } catch {
      /* fall back to the raw HTML we already have */
    }
  }

  // 3. Score
  const $ = cheerio.load(html);
  const finalUrl = fetched.finalUrl;
  const isHttps = /^https:/i.test(finalUrl);
  const ctx = {
    requestedUrl: requested,
    finalUrl,
    isHttps,
    httpsUpgraded:
      isHttps && /^http:\/\//i.test(fetched.requestUrl) && finalUrl !== fetched.requestUrl,
    status: fetched.status,
    headers: fetched.headers,
    html,
    $,
    htmlBytes: Buffer.byteLength(html, "utf8"),
  };

  const { criteria, score, applicableMaxScore, scorePct, band } = scoreHtml(ctx);
  const needsUpgrade = band === "high" || band === "medium";
  const summary = buildTextSummary({
    reachable: true,
    band,
    criteria,
    httpStatus: fetched.status,
  });

  return {
    ...base,
    finalUrl,
    hasWebsite: true,
    reachable: true,
    blocked: false,
    redirected: finalUrl !== fetched.requestUrl,
    httpStatus: fetched.status,
    httpError: fetched.httpError,
    https: isHttps,
    rendered,
    score,
    maxScore: MAX_SCORE,
    applicableMaxScore,
    scorePct,
    band,
    priority: PRIORITY_BY_BAND[band] || "UNKNOWN",
    needsUpgrade,
    criteria,
    details: toLegacyDetails(criteria),
    summary,
  };
}

module.exports = {
  analyzeWebsite,
  scoreHtml,
  CRITERIA,
  MAX_SCORE,
  FETCH_DEFAULTS,
  ANALYZER_VERSION,
};
