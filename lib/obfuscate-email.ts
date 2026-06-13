/** Base64-encoded support addresses — decoded only on the client for mailto links. */

export function decodeEmail(encoded: string): string {
  if (typeof atob === "function") {
    return atob(encoded);
  }
  return Buffer.from(encoded, "base64").toString("utf-8");
}

/** Human-readable mask, e.g. johnrochie86 [at] gmail [dot] com */
export function maskEmail(encoded: string): string {
  const email = decodeEmail(encoded);
  const [user, domain] = email.split("@");
  if (!user || !domain) return "support [at] example [dot] com";
  const maskedDomain = domain.replace(/\./g, " [dot] ");
  return `${user} [at] ${maskedDomain}`;
}
