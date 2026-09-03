/**
 * SSRF protection for SiteAnalyser.
 *
 * The scanner fetches arbitrary URLs supplied via the dashboard / API. Without
 * this, a caller could point it at `http://localhost`, `http://169.254.169.254`
 * (cloud metadata), or any RFC1918 address — or at a public URL that *redirects*
 * to one of those.
 *
 * Two layers, both driven by the helpers here so there is a single source of
 * truth (no per-endpoint duplication):
 *
 *   1. assertUrlAllowed(url)      — fast, synchronous pre-flight. Rejects bad
 *                                   protocols, `localhost`, obviously-internal
 *                                   hostnames, and private/reserved IP literals
 *                                   before any socket is opened.
 *
 *   2. httpAgent / httpsAgent     — HTTP(S) agents whose DNS `lookup` resolves
 *                                   the host and rejects the connection if the
 *                                   resolved IP is private/reserved. This runs
 *                                   for the initial request AND every redirect
 *                                   hop, and the connection uses the exact IP
 *                                   that was checked (no TOCTOU / DNS-rebinding
 *                                   window).
 *
 * Escape hatch: SSRF_ALLOWED_HOSTS (comma-separated hostnames / IPs) skips the
 * checks for those hosts only — for scanning known-safe internal/staging sites.
 * Leave it unset in production. Read live so tests and ops can toggle it.
 *
 * No external dependency — Node `dns` / `net` only. The checks are cheap
 * (string / bitmask ops + one cached DNS lookup that the request needs anyway).
 */

const dns = require("dns");
const net = require("net");
const http = require("http");
const https = require("https");

const SSRF_BLOCK_REASON = "blocked: private/internal address";
const SSRF_CODE = "ESSRFBLOCKED";

class SsrfBlockedError extends Error {
  constructor(message = SSRF_BLOCK_REASON) {
    super(message);
    this.name = "SsrfBlockedError";
    this.code = SSRF_CODE;
    this.blocked = true;
  }
}

// ---------------------------------------------------------------------------
// Allowlist (opt-in, env-driven)
// ---------------------------------------------------------------------------

function allowedHosts() {
  return (process.env.SSRF_ALLOWED_HOSTS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowlisted(host) {
  if (!host) return false;
  const h = String(host).toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
  return allowedHosts().includes(h);
}

// ---------------------------------------------------------------------------
// IPv4
// ---------------------------------------------------------------------------

function ipv4ToInt(ip) {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const x = Number(p);
    if (x > 255) return null;
    n = n * 256 + x;
  }
  return n >>> 0;
}

// CIDR blocks that must never be reachable from a public URL scanner.
const V4_BLOCKS = [
  ["0.0.0.0", 8], // "this" network
  ["10.0.0.0", 8], // RFC1918
  ["100.64.0.0", 10], // CGNAT
  ["127.0.0.0", 8], // loopback
  ["169.254.0.0", 16], // link-local (incl. 169.254.169.254 metadata)
  ["172.16.0.0", 12], // RFC1918
  ["192.0.0.0", 24], // IETF protocol assignments
  ["192.0.2.0", 24], // TEST-NET-1
  ["192.168.0.0", 16], // RFC1918
  ["198.18.0.0", 15], // benchmarking
  ["198.51.100.0", 24], // TEST-NET-2
  ["203.0.113.0", 24], // TEST-NET-3
  ["224.0.0.0", 4], // multicast
  ["240.0.0.0", 4], // reserved
  ["255.255.255.255", 32], // broadcast
].map(([base, bits]) => {
  const baseInt = ipv4ToInt(base);
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return { baseInt: (baseInt & mask) >>> 0, mask };
});

function isBlockedIPv4(ip) {
  const n = ipv4ToInt(ip);
  if (n === null) return true; // unparseable -> block
  return V4_BLOCKS.some(({ baseInt, mask }) => ((n & mask) >>> 0) === baseInt);
}

// ---------------------------------------------------------------------------
// IPv6
// ---------------------------------------------------------------------------

function ipv6ToBytes(input) {
  let ip = String(input).toLowerCase().split("%")[0]; // drop zone id

  // Embedded IPv4 tail (e.g. ::ffff:192.168.0.1)
  if (ip.includes(".")) {
    const idx = ip.lastIndexOf(":");
    const v4 = ipv4ToInt(ip.slice(idx + 1));
    if (v4 === null) return null;
    ip =
      ip.slice(0, idx + 1) +
      ((v4 >>> 16) & 0xffff).toString(16) +
      ":" +
      (v4 & 0xffff).toString(16);
  }

  const halves = ip.split("::");
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(":") : [];
  const tail = halves.length === 2 ? (halves[1] ? halves[1].split(":") : []) : null;

  let groups;
  if (tail === null) {
    groups = head;
  } else {
    const missing = 8 - head.length - tail.length;
    if (missing < 1) return null;
    groups = [...head, ...Array(missing).fill("0"), ...tail];
  }
  if (groups.length !== 8) return null;

  const bytes = [];
  for (const g of groups) {
    if (!/^[0-9a-f]{1,4}$/.test(g || "0")) return null;
    const n = parseInt(g || "0", 16);
    bytes.push((n >> 8) & 0xff, n & 0xff);
  }
  return bytes;
}

function isBlockedIPv6(ip) {
  const b = ipv6ToBytes(ip);
  if (!b) return true;

  const firstTwelveZero = b.slice(0, 12).every((x) => x === 0);
  const v4Mapped = b.slice(0, 10).every((x) => x === 0) && b[10] === 0xff && b[11] === 0xff;
  if (v4Mapped || (firstTwelveZero && !(b[12] === 0 && b[13] === 0 && b[14] === 0 && b[15] <= 1))) {
    return isBlockedIPv4(`${b[12]}.${b[13]}.${b[14]}.${b[15]}`);
  }

  // :: (unspecified) and ::1 (loopback)
  if (b.slice(0, 15).every((x) => x === 0) && b[15] <= 1) return true;

  if ((b[0] & 0xfe) === 0xfc) return true; // fc00::/7  unique local
  if (b[0] === 0xfe && (b[1] & 0xc0) === 0x80) return true; // fe80::/10 link-local
  if (b[0] === 0xff) return true; // ff00::/8  multicast
  return false;
}

// ---------------------------------------------------------------------------
// Combined checks
// ---------------------------------------------------------------------------

function isBlockedIP(ip) {
  const fam = net.isIP(ip);
  if (fam === 4) return isBlockedIPv4(ip);
  if (fam === 6) return isBlockedIPv6(ip);
  return true; // not an IP literal
}

const BLOCKED_HOST_EXACT = new Set([
  "localhost",
  "ip6-localhost",
  "ip6-loopback",
  "metadata.google.internal",
  "metadata.goog",
]);
const BLOCKED_HOST_SUFFIX = [
  ".localhost",
  ".local",
  ".internal",
  ".intranet",
  ".lan",
  ".home",
  ".corp",
];

function isBlockedHostname(host) {
  const h = String(host || "").toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
  if (!h) return true;
  if (BLOCKED_HOST_EXACT.has(h)) return true;
  if (BLOCKED_HOST_SUFFIX.some((s) => h.endsWith(s))) return true;
  if (net.isIP(h)) return isBlockedIP(h);
  return false;
}

/**
 * Synchronous pre-flight. Throws SsrfBlockedError for anything we can reject
 * without a DNS lookup. DNS-resolves-to-private is caught later by safeLookup.
 * @param {string} rawUrl
 */
function assertUrlAllowed(rawUrl) {
  let u;
  try {
    u = new URL(rawUrl);
  } catch {
    throw new SsrfBlockedError("blocked: invalid URL");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new SsrfBlockedError(`blocked: unsupported protocol "${u.protocol.replace(":", "")}"`);
  }
  // WHATWG URL already canonicalises decimal/octal/hex IPv4 (e.g.
  // http://2130706433 -> hostname "127.0.0.1"), so net.isIP / isBlockedIP see
  // the normalised form.
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (isAllowlisted(host)) return;
  if (isBlockedHostname(host)) throw new SsrfBlockedError();
}

/**
 * DNS lookup for the HTTP agents. Rejects the connection if the resolved
 * address is private/reserved. Runs on the first request and every redirect.
 */
function safeLookup(hostname, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  const opts = typeof options === "number" ? { family: options } : options || {};

  if (isAllowlisted(hostname)) {
    return dns.lookup(hostname, opts, callback);
  }

  dns.lookup(hostname, opts, (err, address, family) => {
    if (err) return callback(err);
    const list = Array.isArray(address) ? address : [{ address, family }];
    for (const entry of list) {
      if (isBlockedIP(entry.address)) {
        return callback(new SsrfBlockedError());
      }
    }
    callback(null, address, family);
  });
}

const httpAgent = new http.Agent({ lookup: safeLookup, keepAlive: false });
const httpsAgent = new https.Agent({ lookup: safeLookup, keepAlive: false });

/**
 * follow-redirects `beforeRedirect` hook — a cheap synchronous check on the
 * redirect target's hostname before the next hop is attempted. The authoritative
 * IP check still happens in safeLookup; this just fails fast with a clean error
 * for `Location: http://localhost/` style redirects.
 */
function beforeRedirect(options) {
  const host = String(options.hostname || options.host || "")
    .replace(/^\[|\]$/g, "")
    .toLowerCase();
  if (isAllowlisted(host)) return;
  if (isBlockedHostname(host)) throw new SsrfBlockedError();
}

const BLOCK_MSG_RE =
  /blocked: (private\/internal address|invalid URL|unsupported protocol|missing host|DNS)/;

// Walk the (possibly wrapped, e.g. follow-redirects ERR_FR_REDIRECTION_FAILURE)
// error chain looking for our marker.
function isSsrfBlock(err) {
  let e = err;
  for (let i = 0; i < 6 && e && typeof e === "object"; i++) {
    if (e.code === SSRF_CODE || e instanceof SsrfBlockedError) return true;
    if (BLOCK_MSG_RE.test(e.message || "")) return true;
    e = e.cause && e.cause !== e ? e.cause : null;
  }
  return false;
}

// Pull the clean "blocked: ..." phrase out of a wrapped message.
function ssrfReason(err) {
  const m = /blocked: [^\n"]+/.exec(err?.message || "");
  return m ? m[0].trim() : SSRF_BLOCK_REASON;
}

module.exports = {
  assertUrlAllowed,
  safeLookup,
  beforeRedirect,
  httpAgent,
  httpsAgent,
  isBlockedIP,
  isBlockedIPv4,
  isBlockedIPv6,
  isBlockedHostname,
  isSsrfBlock,
  ssrfReason,
  SsrfBlockedError,
  SSRF_BLOCK_REASON,
  SSRF_CODE,
};
