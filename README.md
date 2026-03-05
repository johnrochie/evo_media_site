# Evolution Media – export package

This folder contains everything needed to run the **Evolution Media** single-page site. It was exported from a Next.js project (Trend Pulse) and can be dropped into another Next.js app or used as reference.

## What’s included

- **`app/evomedia/`** – Route layout, page, and styles (`layout.tsx`, `page.tsx`, `evomedia.css`)
- **`components/evomedia/`** – All section components (Hero, Services, Pricing, Contact, etc.)
- **`content/evomedia.json`** – Editable copy (headlines, prices, testimonials, contact, footer)
- **`lib/evomedia-content.ts`** – Loads the JSON and types for components

## How to use in another Next.js project

1. **Copy the folders**  
   Merge into your project root so you have:
   - `app/evomedia/`
   - `components/evomedia/`
   - `content/`
   - `lib/evomedia-content.ts` (add to existing `lib/` or create `lib/`)

2. **Path alias**  
   Ensure `tsconfig.json` has `"@/*": ["./*"]` (or equivalent) so imports like `@/content/evomedia.json` and `@/lib/evomedia-content` resolve.

3. **Dependencies**  
   The site uses:
   - `next`, `react`, `react-dom`
   - `framer-motion`
   - `lucide-react`
   - Tailwind CSS  

   Install if missing:  
   `npm install framer-motion lucide-react`

4. **Tailwind**  
   No extra Tailwind config is required; the components use utility classes and a small amount of custom CSS in `app/evomedia/evomedia.css`.

5. **Route**  
   The Evolution Media page will be available at **`/evomedia`**.

## Editing content

Edit **`content/evomedia.json`** to change headlines, services, pricing, testimonials, contact copy, footer, and nav. See `content/README-evomedia.md` for a field-by-field guide.

## Standalone / separate app

To run Evolution Media as its own app (e.g. its own repo), create a new Next.js project and copy this export into it, then:

- Move `app/evomedia/*` to `app/` and make it the default route (e.g. rename to `app/page.tsx` and adjust layout), or
- Keep `app/evomedia/` and set the homepage to redirect to `/evomedia`.

---

Exported from trend-pulse. Evolution Media – evomedia.site
