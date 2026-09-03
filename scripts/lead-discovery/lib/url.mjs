/**
 * URL / domain helpers for the filter step.
 *
 * We deliberately avoid a public-suffix-list dependency to keep this script
 * lightweight. MULTI_PART_SUFFIXES covers the country-code TLDs we actually
 * expect to see for Ireland / UK / common markets. Add to it as needed.
 */

const MULTI_PART_SUFFIXES = new Set([
  "co.uk", "org.uk", "me.uk", "gov.uk", "ac.uk", "ltd.uk", "plc.uk", "net.uk",
  "com.au", "net.au", "org.au", "id.au",
  "co.nz", "co.za", "co.in", "co.jp", "co.kr",
  "com.br", "com.mx", "com.sg", "com.tr", "com.pt", "com.es",
]);

/** Full lower-cased hostname, minus a leading "www.". Null if unparseable. */
export function toHost(rawUrl) {
  try {
    return new URL(rawUrl).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Registrable domain (eTLD+1), e.g. "shop.acme.co.uk" -> "acme.co.uk". */
export function toDomain(rawUrl) {
  const host = toHost(rawUrl);
  if (!host) return null;
  const parts = host.split(".");
  if (parts.length <= 2) return host;
  const lastTwo = parts.slice(-2).join(".");
  if (MULTI_PART_SUFFIXES.has(lastTwo)) return parts.slice(-3).join(".");
  return lastTwo;
}

/** True if `host` is `base` or a subdomain of it. */
export function hostMatches(host, base) {
  return host === base || host.endsWith(`.${base}`);
}
