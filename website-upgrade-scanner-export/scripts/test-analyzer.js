#!/usr/bin/env node
/**
 * Lightweight, mostly network-free checks for the scoring core.
 *
 * Exercises scoreHtml() directly against fixed HTML so the same input always
 * produces the same score (the batch-consistency requirement), plus a couple
 * of checks that unreachable / empty inputs resolve instead of throwing.
 *
 *   node scripts/test-analyzer.js
 */

const assert = require("assert");
const http = require("http");
const cheerio = require("cheerio");
const { scoreHtml, analyzeWebsite } = require("../analyzer");
const { isBlockedIP, isBlockedHostname } = require("../ssrf");

let pass = 0;
let fail = 0;
async function check(name, fn) {
  try {
    await fn();
    pass++;
    console.log(`  ok   ${name}`);
  } catch (err) {
    fail++;
    console.log(`  FAIL ${name}\n       ${err.message}`);
  }
}

function ctxFor(html, finalUrl = "https://example.com/") {
  return {
    requestedUrl: finalUrl,
    finalUrl,
    isHttps: /^https:/i.test(finalUrl),
    httpsUpgraded: false,
    status: 200,
    headers: {},
    html,
    $: cheerio.load(html),
    htmlBytes: Buffer.byteLength(html, "utf8"),
  };
}

const MODERN = `<!doctype html><html><head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="/_next/static/chunks/main.js"></script>
</head><body>
  <div id="__next"><h1>Acme Plumbing</h1><p>Cork's trusted plumbers.</p>
  <a href="mailto:hi@acme.ie">Email us</a><a href="tel:+353211234567">Call</a>
  <img src="/a.jpg" alt="Team photo" /><img src="/b.jpg" alt="Van" />
  </div>
</body></html>`;

const LEGACY = `<!doctype html><html><head><title>Joe's Plumbing</title>
  <meta name="generator" content="WordPress 5.2" />
</head><body>
  <table><tr><td>Welcome to Joe's Plumbing</td></tr></table>
  <a href="/contact.html">Contact</a>
  <img src="1.jpg" /><img src="2.jpg" /><img src="3.jpg" />
  <script src="/js/jquery-1.11.min.js"></script>
</body></html>`;

async function main() {
  await check("modern site scores 15 and is not flagged", () => {
    const r = scoreHtml(ctxFor(MODERN));
    assert.strictEqual(r.score, 15, `expected 15, got ${r.score}`);
    assert.strictEqual(r.band, "low");
  });

  await check("legacy site scores low and is flagged high", () => {
    const r = scoreHtml(ctxFor(LEGACY, "http://joesplumbing.example/"));
    assert.ok(r.score <= 4, `expected <=4, got ${r.score}`);
    assert.strictEqual(r.band, "high");
  });

  await check("scoring is deterministic across runs", () => {
    const a = JSON.stringify(scoreHtml(ctxFor(LEGACY)).criteria);
    const b = JSON.stringify(scoreHtml(ctxFor(LEGACY)).criteria);
    assert.strictEqual(a, b);
  });

  await check("'react' as a content word does not trigger the framework signal", () => {
    const html =
      '<html><head><meta name="viewport" content="width=device-width"></head>' +
      "<body><p>We react fast to every plumbing emergency in Cork.</p></body></html>";
    const stack = scoreHtml(ctxFor(html)).criteria.find((c) => c.key === "modern_stack");
    assert.strictEqual(stack.passed, false, "content word 'react' should not count");
  });

  await check("a bare 'Contact' link is not a real contact method", () => {
    const html = '<html><body><a href="/contact">Contact</a></body></html>';
    const contact = scoreHtml(ctxFor(html)).criteria.find((c) => c.key === "contact");
    assert.strictEqual(contact.points, 1);
    assert.strictEqual(contact.passed, false);
  });

  await check('alt="" on decorative images still counts as an alt attribute', () => {
    const html = '<html><body><img src="x" alt=""><img src="y" alt="Logo"></body></html>';
    const imgAlt = scoreHtml(ctxFor(html)).criteria.find((c) => c.key === "img_alt");
    assert.strictEqual(imgAlt.points, 2);
  });

  await check("no images -> alt criterion not-applicable, applicable max drops to 13", () => {
    const html =
      '<html><head><meta name="viewport" content="width=device-width"></head><body><p>hi</p></body></html>';
    const r = scoreHtml(ctxFor(html));
    const imgAlt = r.criteria.find((c) => c.key === "img_alt");
    assert.strictEqual(imgAlt.notApplicable, true);
    assert.strictEqual(r.applicableMaxScore, 13);
  });

  await check("unreachable host resolves with reachable:false (does not throw)", async () => {
    const r = await analyzeWebsite("https://nonexistent.invalid-tld-zzz/", { timeout: 3000, retries: 0 });
    assert.strictEqual(r.reachable, false);
    assert.strictEqual(r.score, null);
    assert.strictEqual(r.needsUpgrade, null);
    assert.ok(r.error, "expected an error code");
  });

  await check("NO_WEBSITE input resolves as greenfield", async () => {
    const r = await analyzeWebsite("NO_WEBSITE");
    assert.strictEqual(r.noWebsite, true);
    assert.strictEqual(r.needsUpgrade, true);
    assert.strictEqual(r.score, null);
  });

  // --- SSRF protection ---

  await check("IP-range checks: private/reserved addresses are blocked", () => {
    for (const ip of ["127.0.0.1", "10.1.2.3", "172.16.5.5", "192.168.0.1",
                      "169.254.169.254", "0.0.0.0", "::1", "fd00::1", "fe80::1"]) {
      assert.strictEqual(isBlockedIP(ip), true, `${ip} should be blocked`);
    }
    for (const ip of ["1.1.1.1", "8.8.8.8", "93.184.216.34", "2606:4700:4700::1111"]) {
      assert.strictEqual(isBlockedIP(ip), false, `${ip} should be allowed`);
    }
  });

  await check("hostname pre-check blocks localhost and .internal names", () => {
    assert.strictEqual(isBlockedHostname("localhost"), true);
    assert.strictEqual(isBlockedHostname("foo.localhost"), true);
    assert.strictEqual(isBlockedHostname("db.internal"), true);
    assert.strictEqual(isBlockedHostname("metadata.google.internal"), true);
    assert.strictEqual(isBlockedHostname("example.com"), false);
  });

  await check("analyzeWebsite: direct localhost URL is blocked (band 'blocked')", async () => {
    const r = await analyzeWebsite("http://localhost:8080/", { retries: 0, timeout: 3000 });
    assert.strictEqual(r.reachable, false);
    assert.strictEqual(r.blocked, true);
    assert.strictEqual(r.band, "blocked");
    assert.strictEqual(r.error, "ESSRFBLOCKED");
    assert.match(r.summary, /private\/internal address/);
  });

  await check("analyzeWebsite: direct private-IP URL is blocked", async () => {
    const r = await analyzeWebsite("http://192.168.1.1/", { retries: 0, timeout: 3000 });
    assert.strictEqual(r.blocked, true);
    assert.strictEqual(r.needsUpgrade, false);
  });

  await check("analyzeWebsite: decimal-encoded 127.0.0.1 (http://2130706433) is blocked", async () => {
    const r = await analyzeWebsite("http://2130706433/", { retries: 0, timeout: 3000 });
    assert.strictEqual(r.blocked, true);
  });

  await check("analyzeWebsite: public URL that redirects to a private IP is blocked mid-flight", async () => {
    // Entry point is loopback (allow-listed just for this test); the redirect
    // target 169.254.169.254 is NOT allow-listed and must be rejected by the
    // agent's DNS lookup on the redirect hop.
    const server = http.createServer((req, res) => {
      res.writeHead(302, { Location: "http://169.254.169.254/latest/meta-data/" });
      res.end();
    });
    await new Promise((r) => server.listen(0, "127.0.0.1", r));
    const port = server.address().port;
    process.env.SSRF_ALLOWED_HOSTS = "127.0.0.1";
    try {
      const r = await analyzeWebsite(`http://127.0.0.1:${port}/`, { retries: 0, timeout: 4000 });
      assert.strictEqual(r.reachable, false, "redirect to private IP must not be scored");
      assert.strictEqual(r.blocked, true);
      assert.strictEqual(r.band, "blocked");
    } finally {
      delete process.env.SSRF_ALLOWED_HOSTS;
      server.close();
    }
  });

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

main();
