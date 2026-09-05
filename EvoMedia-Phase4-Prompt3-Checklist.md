# Phase 4, Item 7, Prompt 3 — Verification Checklist

Everything below needs real secrets (`SUPABASE_SERVICE_ROLE_KEY`,
`RESEND_API_KEY`) that don't exist in the sandbox Prompts 1-2 were built
in, so it couldn't be run there — this is the "run it for real" pass
that's left before calling Item 7 done. Run it wherever those secrets
actually live: a local `.env.local` filled in with real (test-mode)
values, or a Vercel preview/production deployment. Use **Stripe test
mode** throughout (test API keys, test card `4242 4242 4242 4242`, any
future expiry/CVC) — nothing here needs a real charge.

Check items off as you go. If anything in Section 1 isn't done, nothing
else below will work — start there.

## 0. Before you start

- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (Supabase dashboard → Settings →
      API → `service_role` secret — **not** the `anon` key already in use
      elsewhere). Local: add to `.env.local`. Vercel: Project Settings →
      Environment Variables.
- [ ] `RESEND_API_KEY` and `RESEND_FROM` set, same place.
- [ ] `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` already
      set (should be, from the existing intake forms) — confirm they
      point at the same Supabase project you're about to run the schema
      change against.
- [ ] `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` are **test-mode**
      keys, and the webhook endpoint registered in the Stripe dashboard
      (test mode) points at wherever you're testing (a Vercel preview URL,
      or `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
      for local).

## 1. Apply the schema change

The `client_projects` table (added in `supabase-schema.sql`) doesn't
exist in any real Supabase project yet — this is a script in the repo,
not an automatic migration.

- [ ] Open the Supabase SQL Editor for the real project and run the
      `client_projects` block from `supabase-schema.sql` (the whole file
      is safe to re-run — every `create table` is `if not exists` and
      every policy is `drop ... if exists` first).
- [ ] Confirm in the Table Editor: `client_projects` exists, RLS is
      enabled, and it has **exactly one** policy (`Allow service role
      full access`) — no `Allow anonymous insert`/`select` policy like
      the intake tables have. This is the security decision from Prompt 1
      — worth actually looking at, not just trusting the SQL did what it
      says.

## 2. Deposit path, end to end

- [ ] From the live site, start the deposit checkout (whatever button
      triggers `app/api/checkout/route.ts`) and pay with the test card.
- [ ] Stripe webhook fires → **check Resend's dashboard/logs** (or the
      test inbox) for two emails: the existing internal "Deposit
      received" notification to John (regression check — must still
      arrive, unchanged), **and** the new client-facing "Your deposit is
      confirmed" email at the address used at checkout.
- [ ] In Supabase, confirm a new `client_projects` row: `stage = 'paid'`,
      `payment_type = 'deposit'`, `stripe_session_id` matches the
      checkout session, `contact_email` populated, `business_name` still
      `null` (expected — not known yet).
- [ ] You're redirected to `/start-your-project?session_id=...` — fill in
      and submit the brief form.
- [ ] Check for two more emails: John's existing internal "New brief"
      notification (regression check), **and** the new client-facing
      "Brief received" email.
- [ ] In Supabase, confirm the same row now has `stage = 'brief_received'`,
      `business_name` filled in from the form, `stage_updated_at` bumped.

## 3. Package path, end to end

- [ ] From the pricing section, pay a tier's full price directly (the
      `app/actions/create-checkout-session.ts` path) with the test card.
- [ ] Check for John's existing internal "Payment received – {tier}"
      notification (regression check) **and** the new client-facing
      "Payment received — thanks for choosing Evolution Media" email.
- [ ] In Supabase, confirm a new row: `stage = 'paid'`,
      `payment_type = 'package'`, `tier` set to whichever tier was bought.
      (This client never goes through `/start-your-project` today, so
      this row correctly stays at `paid` — that's the honest gap the
      scope doc already flags, not a bug to chase here.)

## 4. Manual stage-advance script, against a real row

Using the `stripe_session_id` from either row created above:

- [ ] `npm run advance-stage -- <stripe_session_id> in_design` — confirm
      the row's `stage` updates and the client receives "Your site is in
      design".
- [ ] `npm run advance-stage -- <stripe_session_id> in_build` — same
      check, "Your site is now in build".
- [ ] `npm run advance-stage -- <stripe_session_id> ready_for_review` —
      same check, "Ready for your review".
- [ ] `npm run advance-stage -- <stripe_session_id> live https://example-client-site.vercel.app`
      — confirm `stage = 'live'` **and** `live_url` is set correctly, and
      the email's link actually points there and works.

## 5. Idempotency — a webhook redelivery must not double up

Stripe redelivers webhooks (network hiccups, timeouts) — this was
designed for in Prompt 1, worth actually proving:

- [ ] In the Stripe dashboard (test mode), find the `checkout.session.completed`
      event from Section 2 or 3 and click **Resend**.
- [ ] Confirm: **no** second `client_projects` row is created (still
      exactly one row for that `stripe_session_id`), and the client does
      **not** receive a second confirmation email.

## 6. Security — the RLS policy actually holds, not just in the SQL

- [ ] From a browser console on the live site (or `curl`), try reading
      `client_projects` using the **public anon key** (the same one
      `NEXT_PUBLIC_SUPABASE_ANON_KEY` exposes to the browser) — e.g.
      `supabase.from('client_projects').select('*')` in the console, or
      a REST call with `apikey: <anon key>`. Confirm it returns **zero
      rows / a permission error**, not real client data. This is the
      actual, deployed proof of Prompt 1's security decision — not just
      that the SQL looked right.

## 7. The edge case the old fallback already covers

- [ ] Pay the deposit, then deliberately **don't** submit the brief form.
      Confirm the pre-existing "Deposit received... If no project brief
      follows shortly, it's worth following up directly" internal email
      still arrives (this behavior predates Phase 4 and must be
      unaffected).

## 8. Read the actual emails, not just the rendered HTML

The browser-based rendering check in Prompts 1-2 is not the same as a
real inbox:

- [ ] Open at least the deposit-confirmation and one manual-stage email
      in a real mail client (Gmail and/or Outlook, if available) —
      confirm the layout, cyan accent, and CTA button all render
      correctly there too. Email clients strip/mangle CSS differently
      than a browser; this is the check that actually catches that.

## Sign-off

- [ ] All of the above pass.
- [ ] Any failure found has a note here on what broke and whether it was
      fixed or is a known, accepted gap (e.g. Section 3's package-path
      "never reaches brief_received" isn't a bug — it's the honest
      state the scope doc already calls out).

Once this is checked off, Item 7 (Automated Client Communication &
Status Agent) is fully done — the last piece of Phase 4 that's slated to
build now. Items 8 and 9 stay deferred until a real second client site
exists (see `EvoMedia-Phase4-Scope.md`).
