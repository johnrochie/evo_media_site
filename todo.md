\# Evo Media Site — Review \& Improvement Todo



> Reviewed: 2026-04-04

> Stack: Next.js 16, React 18, TypeScript, Tailwind CSS, Framer Motion



\---



\## ACCESSIBILITY



\- \[ ] Add `aria-expanded` and `aria-controls` to FAQ accordion buttons

\- \[ ] Add a \*\*skip-to-main-content\*\* link at the top of every page

\- \[ ] Wrap all checkbox groups (BriefForm sections, functionality) in `<fieldset>` + `<legend>`

\- \[ ] Add `aria-hidden="true"` to all decorative SVG icons and background gradient elements

\- \[ ] Run a full color contrast audit — gradient text on dark backgrounds may fail WCAG AA

\- \[ ] Ensure form error messages use `role="alert"` or `aria-live="polite"` for screen readers

\- \[ ] Add `aria-required="true"` to all required form inputs

\- \[ ] Add focus-visible ring styles for keyboard users (check all interactive elements)



\---



\## SEO



\- \[ ] Add \*\*FAQ schema\*\* (`FAQPage` JSON-LD) to the FAQ section on the homepage

\- \[ ] Add \*\*Service schema\*\* (`Service` JSON-LD) for each pricing tier

\- \[ ] Add \*\*BreadcrumbList schema\*\* on the portfolio listing and individual portfolio pages

\- \[ ] Add unique `<title>` and `<meta description>` to each individual portfolio item page

\- \[ ] Add `<meta name="description">` to `/brief` page (currently missing)

\- \[ ] Diversify image `alt` text — portfolio images all follow the same `name – category` pattern; make descriptions more unique and keyword-rich

\- \[ ] Add `hreflang` attribute if the site targets multiple regions/languages

\- \[ ] Confirm `og:image` and `twitter:image` are populated for all shareable pages (portfolio items, blog posts)

\- \[ ] Add a \*\*Review/Testimonial schema\*\* (`Review` / `AggregateRating`) once real testimonials are in place

\- \[ ] Verify `sitemap.ts` includes all dynamic portfolio slugs at build time

\- \[ ] Consider adding a `<link rel="canonical">` tag on pages that can be reached via multiple URLs



\---



\## UI / VISUAL DESIGN



\- \[ ] Add a \*\*loading skeleton\*\* or shimmer effect for the portfolio grid while filtering

\- \[ ] Add real \*\*client logos\*\* or brand marks to the "Why Us" or testimonials section for social proof

\- \[ ] Replace initials-only testimonial avatars with real headshots or high-quality AI avatars

\- \[ ] Add a \*\*sticky CTA bar\*\* or floating "Get a Quote" button that persists on long scroll

\- \[ ] Add \*\*active/highlighted state\*\* to the current nav section during scroll (scroll-spy)

\- \[ ] Add transition/hover effects to the footer social links

\- \[ ] Review pricing card layout on medium-width screens (768–1024px) — may need a 2-column layout

\- \[ ] Add \*\*micro-animations\*\* to the "How It Works" step numbers (count-up, draw, or pop-in)

\- \[ ] Add a \*\*back-to-top button\*\* that appears after scrolling past the hero section

\- \[ ] Ensure light mode theme is fully reviewed and tested — many dark-specific colours may not adapt well

\- \[ ] Add a \*\*progress indicator\*\* or step labels to the BriefForm multi-field flow



\---



\## UX



\- \[ ] Add \*\*form persistence\*\* — save InterestForm / BriefForm state to `localStorage` so users don't lose progress on accidental refresh

\- \[ ] Add \*\*inline validation\*\* on form fields (validate on blur, not just on submit)

\- \[ ] Show a \*\*confirmation email preview\*\* or summary page after successful form submission

\- \[ ] Add a \*\*word/character count\*\* to the free-text fields in BriefForm (textarea fields)

\- \[ ] Add an \*\*estimated project timeline\*\* display in the pricing section (e.g., "Live in 5–7 days")

\- \[ ] Make the portfolio demo pages \*\*linkable/shareable\*\* with individual URLs and back navigation

\- \[ ] Add a \*\*"View Live Site"\*\* button on portfolio cards that links to the actual demo or live URL

\- \[ ] Add keyboard navigation support for the portfolio filter buttons (arrow keys between categories)

\- \[ ] Add a \*\*scroll progress bar\*\* at the top of the page (optional, matches design aesthetic)

\- \[ ] On the `/brief` page, add a visual checklist summary of what information is needed before the user starts



\---



\## PERFORMANCE



\- \[ ] Convert all portfolio images in `/public/portfolio-samples/` from JPEG to \*\*WebP\*\* (add JPEG fallback via `<picture>`)

\- \[ ] Add `priority` prop to the hero image (or above-the-fold elements) in Next.js Image

\- \[ ] Set explicit `Cache-Control` headers for static assets and API routes in `next.config.js`

\- \[ ] Audit and reduce \*\*Framer Motion bundle size\*\* — consider lazy-importing animation variants

\- \[ ] Profile and minimise \*\*Cumulative Layout Shift (CLS)\*\* — especially in portfolio grid and hero section

\- \[ ] Add `loading="eager"` only to above-the-fold images; confirm all others use lazy loading

\- \[ ] Run Lighthouse audit and target scores: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 95

\- \[ ] Audit the animated pulsing gradient blobs in the hero — consider reducing or pausing on `prefers-reduced-motion`

\- \[ ] Add `next/bundle-analyzer` to identify and split large dependencies



\---



\## FEATURES



\- \[ ] \*\*Blog\*\* — Create at least 4–6 seed posts covering: web design tips, AI tools, launch stories, local SEO. Currently shows "No posts yet."

\- \[ ] \*\*Case Studies\*\* — Add detailed case study pages for 2–3 portfolio projects (problem → solution → result format)

\- \[ ] \*\*Live Chat Trigger Logic\*\* — Review Crisp triggers (30s, pricing in view, exit intent); add a trigger on CTA button hover

\- \[ ] \*\*Booking / Calendar Integration\*\* — Add a Calendly or Cal.com embed on the contact page for discovery calls

\- \[ ] \*\*Portfolio Demo Links\*\* — Ensure all 6 portfolio demo components have individual routes and are linked from portfolio cards

\- \[ ] \*\*Testimonials with Video\*\* — Add short video testimonials or Loom snippets for higher trust conversion

\- \[ ] \*\*Comparison Table\*\* — Add a feature comparison table between pricing tiers (Starter vs Professional vs Custom)

\- \[ ] \*\*reCAPTCHA v3\*\* — Supplement the honeypot field with Google reCAPTCHA v3 for stronger spam protection

\- \[ ] \*\*Social Proof Counter\*\* — Add a live or static "X sites launched" / "X happy clients" stat near the CTA

\- \[ ] \*\*WhatsApp / Direct Contact Button\*\* — Add a WhatsApp button or direct email link for visitors who prefer not to use a form

\- \[ ] \*\*Portfolio Filtering Enhancement\*\* — Add multi-select filtering (e.g., filter by industry AND feature type)

\- \[ ] \*\*Exit Intent Popup\*\* — Add a lightweight exit-intent modal with a discount or free consultation offer



\---



\## CONTENT



\- \[ ] Expand portfolio project descriptions — each project should have a brief 1–2 sentence story/outcome, not just a list of features

\- \[ ] Add a dedicated \*\*"About"\*\* section or page introducing the team/founder

\- \[ ] Write a proper \*\*bio/story\*\* for Evolution Media (founding story, mission, approach)

\- \[ ] Add \*\*location/market\*\* specifics to service copy — e.g., mention cities or regions served

\- \[ ] Add a \*\*FAQ about pricing\*\* — e.g., "What's included in the €499 package?", "Do you offer payment plans?"

\- \[ ] Clarify the difference between the `/contact` form and the `/brief` form in the UI — users may be confused about which to use

\- \[ ] Add a \*\*"What happens next?"\*\* section after the form on `/contact` — set expectations (response time, process)

\- \[ ] Replace placeholder testimonials with real, verifiable quotes (name + business + website)

\- \[ ] Add \*\*portfolio count\*\* or projects-completed metric to the hero or social proof section



\---



\## TECHNICAL / CODE QUALITY



\- \[ ] Add `aria-label` to the newsletter email `<input>` field (currently has no label)

\- \[ ] Resolve `html2canvas` in `package.json` — confirm it's actively used or remove it

\- \[ ] Add \*\*unit tests\*\* with Jest + React Testing Library for form components and server actions

\- \[ ] Add \*\*E2E tests\*\* with Playwright for the full contact form submission flow

\- \[ ] Add custom \*\*GA4 events\*\* for key conversions: form submits, pricing CTA clicks, portfolio views

\- \[ ] Add \*\*Stripe conversion tracking\*\* — fire a GA4 event on checkout success page

\- \[ ] Add `NEXT\_PUBLIC\_SITE\_URL` validation at build time to catch misconfigured deployments

\- \[ ] Review and complete \*\*Sentry source maps\*\* configuration for production error tracking

\- \[ ] Add `Suspense` boundaries around data-fetching components to improve perceived load time

\- \[ ] Clean up `portfolio-projects.ts` vs `portfolio-data.ts` — consolidate into a single source of truth

\- \[ ] Add `.env.local` to `.gitignore` if not already present; verify no secrets in repo history

\- \[ ] Pin dependency versions in `package.json` (replace `^` with exact versions) for reproducible builds



\---



\## LEGAL / COMPLIANCE



\- \[ ] Verify \*\*Cookie Consent banner\*\* lists all third-party cookies used (Crisp, GA4, Stripe)

\- \[ ] Confirm \*\*Privacy Policy\*\* covers Supabase data storage, Resend email processing, and Stripe

\- \[ ] Add a \*\*Cookie Policy\*\* page (separate from Privacy Policy) per GDPR best practice

\- \[ ] Add \*\*Terms of Service\*\* link prominently in the footer and on the checkout flow

\- \[ ] Confirm \*\*opt-out mechanism\*\* for marketing emails collected via newsletter subscription

\- \[ ] Add clear \*\*data retention policy\*\* disclosure for form submissions stored in Supabase



\---



\## QUICK WINS (do first)



\- \[ ] Add `aria-expanded` to FAQ buttons

\- \[ ] Convert portfolio images to WebP

\- \[ ] Add FAQ JSON-LD schema

\- \[ ] Add skip-to-main-content link

\- \[ ] Write 2–3 blog posts

\- \[ ] Add Calendly/Cal.com booking embed to contact page

\- \[ ] Add "View Live Site" button to portfolio cards

\- \[ ] Add form persistence to InterestForm

\- \[ ] Run Lighthouse audit and fix top issues

\- \[ ] Replace placeholder testimonials with real ones

