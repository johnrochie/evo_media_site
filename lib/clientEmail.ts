import { Resend } from "resend";

/**
 * Client-facing email chrome — Phase 4, item 7. Same brand voice rules as
 * every other client-facing document Evolution Media generates (see
 * evomedia-brand-guide.docx): "Evolution Media" always in full, sentence
 * case headings, at most one exclamation mark, cyan (#00D4FF) accent,
 * navy (#1A1A2E) ink on a light/white background — the printable-document
 * variant of the brand, not the site's own dark hero background, since an
 * email needs to render reliably in inboxes that strip a dark background
 * and leave light text unreadable.
 *
 * This lives here rather than importing evomedia-tools' shared/brand.mjs
 * because that's a separate repo/stack (Node ESM vs this Next.js/
 * TypeScript app) — same cross-repo "port, don't import" reasoning as
 * every other case of this in evomedia-tools itself.
 */

const COLORS = {
  accent: "#00D4FF",
  ink: "#1A1A2E",
  muted: "#5B6472",
  border: "#E5E7EB",
  bg: "#FFFFFF",
};

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderClientEmail(opts: {
  heading: string;
  bodyHtml: string;
  ctaHtml?: string;
}): string {
  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:Arial,Helvetica,sans-serif;color:${COLORS.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="padding-bottom:24px;border-bottom:2px solid ${COLORS.accent};">
              <span style="font-size:13px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:${COLORS.accent};">Evolution Media</span>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 0 8px;">
              <h1 style="margin:0;font-size:22px;line-height:1.3;color:${COLORS.ink};">${opts.heading}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:8px;font-size:15px;line-height:1.6;color:${COLORS.ink};">
              ${opts.bodyHtml}
            </td>
          </tr>
          ${
            opts.ctaHtml
              ? `<tr><td style="padding:20px 0;">${opts.ctaHtml}</td></tr>`
              : ""
          }
          <tr>
            <td style="padding-top:24px;border-top:1px solid ${COLORS.border};font-size:12px;color:${COLORS.muted};">
              Evolution Media — modern websites for independent businesses.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderCtaButton(label: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;background:${COLORS.accent};color:${COLORS.ink};font-weight:bold;font-size:14px;text-decoration:none;padding:12px 24px;border-radius:6px;">${escapeHtml(
    label
  )}</a>`;
}

/**
 * Sends a client-facing email, using the same RESEND_API_KEY/RESEND_FROM
 * env vars already wired for the internal-only notifications. Fails soft
 * (logs, doesn't throw) — a client email that fails to send shouldn't
 * fail the Stripe webhook or intake submission it's attached to; both of
 * those already have their own internal-notification fallback.
 */
export async function sendClientEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "Evolution Media <onboarding@resend.dev>";
  if (!apiKey) {
    console.error("sendClientEmail: RESEND_API_KEY not configured, skipping client email");
    return;
  }
  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({ from, to: [opts.to], subject: opts.subject, html: opts.html });
  } catch (err) {
    console.error("sendClientEmail failed:", err);
  }
}
