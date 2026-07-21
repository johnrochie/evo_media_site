# Security Audit — evomedia.site

**Date:** 2026-07-21
**Scope:** Full repository review — server actions, API routes, client components, configuration, dependencies, and git history.
**Stack:** Next.js 16.1.6 (App Router), React 18.3.1, Stripe, Resend, Supabase, Crisp, Sentry, deployed on Vercel.

---

## Summary

| Severity | Count | Findings |
|----------|-------|----------|
| Critical | 1 | Live Resend API key committed to git |
| High | 1 | Client-controlled checkout price (payment tampering) |
| Medium | 3 | HTML/header injection into notification emails; no rate limiting on public actions; vulnerable dependencies |
| Low | 2 | No security headers / CSP; raw provider error messages surfaced to clients |

The overall attack surface is small: no auth system, no admin panel, and no user-generated content is rendered back to visitors. Several things are done well — see "What's already good" at the end. The critical item should be addressed immediately, before anything else.

### Remediation status (updated 2026-07-21)

| ID | Finding | Status |
|----|---------|--------|
| C1 | Live Resend API key in `.env.example` | ⚠️ **Placeholder committed; owner must still rotate the leaked key in Resend** |
| H1 | Client-controlled checkout price | ✅ Fixed — price resolved server-side from trusted content |
| M1 | HTML/header injection in emails | ✅ Fixed — shared `escapeHtml` / `sanitizeSubject` applied to all email actions |
| M2 | No rate limiting on public actions | ⏳ Not yet implemented |
| M3 | Vulnerable dependencies | ⏳ Not yet implemented (`npm audit fix`) |
| L1 | No security headers / CSP | ⏳ Not yet implemented |
| L2 | Raw provider errors surfaced to clients | ✅ Fixed for checkout action (generic message + server-side log) |

---

## Critical

### C1. Live Resend API key committed to the repository

`.env.example:10` contains a **real Resend API key**, not a placeholder:

```
RESEND_API_KEY=re_QQH2tz5n_8ph3go1NG75vL4PtyVR6YYVQ
```

Every other secret in the file is a placeholder (`sk_live_...`, `secret_...`, `eyJ...`), but this one is a working key, and it has been in git history since the file was first committed and pushed to GitHub. Anyone with repository access — or anyone at all, if the repo is ever made public — can send email through your Resend account: burning your quota and, worse, sending phishing mail **from your verified domain** (`hello@evomedia.site`).

The same file also hardcodes a personal Gmail address as `RESEND_TO`.

**Remediation (do this first):**
1. Revoke the key at https://resend.com/api-keys and issue a new one. Rotation is the only real fix — deleting it from the repo does not un-leak it, because it remains in git history and in any existing clones.
2. Replace the value in `.env.example` with a placeholder (`re_...`) and keep the real key only in Vercel environment variables / a local `.env.local` (already gitignored).
3. Optionally rewrite history with `git filter-repo` or BFG — worthwhile only if the repo may become public. Rotation already neutralises the leak, so this is cleanup, not a substitute.

---

## High

### H1. Checkout price is controlled by the client (payment tampering)

`app/actions/create-checkout-session.ts:5` — the server action accepts `tierName` and `amountCents` directly from the browser:

```ts
export async function createCheckoutSession(tierName: string, amountCents: number)
```

A `"use server"` action is a public HTTP endpoint. `PricingSection.tsx` passes the correct tier price, but nothing stops an attacker from calling the action directly with `amountCents: 1` and receiving a legitimate Stripe Checkout link to buy any package for €0.01 — or with a negative/huge value. The attacker-supplied `tierName` also flows unchecked into the Stripe product name, the session metadata, and the notification email.

**Remediation:** Do not accept the amount from the client. Pass only a tier identifier and look the price up server-side from a trusted map (or use pre-created Stripe `price` IDs). Reject any tier ID that isn't in the map.

```ts
const TIERS = {
  starter: { name: "Starter", amountCents: 49900 },
  growth:  { name: "Growth",  amountCents: 99900 },
  premium: { name: "Premium", amountCents: 199900 },
} as const;

export async function createCheckoutSession(tierId: keyof typeof TIERS) {
  const tier = TIERS[tierId];
  if (!tier) return { ok: false, error: "Unknown package.", url: null };
  // ...use tier.name and tier.amountCents, never a client-supplied amount
}
```

---

## Medium

### M1. HTML and header injection into notification emails

Two email actions interpolate user input into HTML **without escaping**, unlike `submit-intake-stage1.ts`, which correctly uses a local `escapeHtml()` helper:

- `app/actions/send-contact.ts:37-45` — `name`, `email`, `websiteType`, `budget`, and `message` are placed directly into the email body (`message` only has newlines converted).
- `app/actions/subscribe-newsletter.ts:19` — `email` is interpolated raw into `<strong>${email}</strong>`.

These emails are delivered to the site owner, so this is not a public XSS. But a submitter can inject arbitrary HTML and links into the mail you receive — phishing-style content, hidden links, layout breakage. The **subject lines** in both files (and in `submit-intake-stage1.ts`) also interpolate raw input, which allows subject/header injection via embedded newlines.

**Remediation:** Reuse the `escapeHtml()` helper for every interpolated value in the email bodies, and strip newlines/trim the values that go into subject lines.

### M2. No rate limiting on public server actions

None of the public actions — `send-contact`, `subscribe-newsletter`, `submit-intake-stage1`, `submit-intake-stage2`, `create-checkout-session` — have any rate limiting. The honeypot fields (`website_url`) stop naive bots, but a scripted attacker can:

- flood the owner inbox via Resend (and burn Resend quota / cost),
- insert unbounded rows into the anonymous-insert Supabase tables (`intake_stage1` / `intake_stage2`),
- create unlimited Stripe Checkout sessions.

**Remediation:** Add per-IP throttling in front of each action (e.g. Upstash / Vercel KV rate limiting, or a lightweight in-memory limiter for low volume). Consider minimal server-side input validation (length caps, email format) at the same time.

### M3. Vulnerable dependencies

`npm audit --omit=dev` reports 17 vulnerabilities (5 high), almost all transitive:

- `@sentry/nextjs` → `@opentelemetry/*` (moderate DoS), and `@sentry/webpack-plugin` → `uuid`.
- `resend` → `svix` → `uuid`.
- `ws` (high: memory disclosure, DoS) and `brace-expansion` (high: DoS), `fast-uri`, `@babel/core` (arbitrary file read).

Real-world exposure is low for a marketing site, but these should be cleared. Next.js 16.1.6 and React 18.3.1 are current — good.

**Remediation:** Run `npm audit fix`, then re-run the build and a smoke test. Review any changes that require `--force`.

---

## Low

### L1. No security headers / Content-Security-Policy

`next.config.js` only sets headers for `/app-ads.txt`. The site sends no `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, or HSTS.

Two `dangerouslySetInnerHTML` uses exist — the inline theme script in `app/layout.tsx:48` and the JSON-LD in `components/evomedia/FAQJsonLd.tsx:22` — both render static/trusted content, so they are not injection vectors today. But a CSP would add defence-in-depth (clickjacking, mixed content, third-party script containment). Note the inline theme script would need a nonce or `'unsafe-inline'` to keep working under a strict CSP.

**Remediation:** Add a global `headers()` block in `next.config.js` with `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security`, and a CSP scoped to your third parties (Crisp, Google Analytics/Tag Manager, Stripe, Vercel, Sentry).

### L2. Raw provider error messages surfaced to clients

`create-checkout-session.ts` and the intake/contact actions return raw error strings from Stripe/Supabase/Resend to the browser (and `PricingSection.tsx:22` shows them in an `alert()`). These can leak internal detail (configuration state, provider-side messages).

**Remediation:** Log the real error server-side (you already have Sentry) and return a generic user-facing message.

---

## What's already good

- **Stripe webhook** (`app/api/webhooks/stripe/route.ts`) verifies the signature with `stripe.webhooks.constructEvent` before acting on the event — correct and important.
- **Intake Stage 1** consistently escapes user input in its notification email via `escapeHtml()` — this is the pattern the other actions should follow.
- **Supabase** uses the public anon key (safe by design) with insert-only RLS policies documented in the schema comments. Confirm in the Supabase dashboard that RLS is actually enabled and that `SELECT` is not exposed on the `intake_*` tables.
- **Google Analytics** loads only after cookie consent and sets `anonymize_ip`.
- Secrets are read from environment variables throughout; nothing except the C1 leak is hardcoded in source.
- Honeypot fields are present on the public forms.

---

## Suggested priority order

1. **C1** — rotate the Resend key and sanitise `.env.example` (today).
2. **H1** — move checkout pricing to a server-side trusted map.
3. **M1 / M2** — escape email HTML and add rate limiting + input validation.
4. **M3 / L1 / L2** — `npm audit fix`, add security headers, and stop leaking raw provider errors.
