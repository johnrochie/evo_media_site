export type InlineSegment = string | { href: string; label: string };

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "inline"; segments: InlineSegment[] }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  /** Plain paragraphs when `blocks` is omitted */
  paragraphs: string[];
  /** When set, rendered instead of `paragraphs` */
  blocks?: BlogBlock[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "website-cost-ireland-small-business-2026",
    title: "How Much Does a Website Cost for a Small Business in Ireland (2026 Guide)",
    date: "2026-04-07",
    description:
      "Realistic price ranges for DIY, freelancers, and agencies—plus hidden costs and how to budget without overpaying.",
    paragraphs: [],
    blocks: [
      {
        type: "p",
        text: "If you’re a small business owner in Ireland, one of the first questions you’ll ask when thinking about getting a website is simple: “How much is this actually going to cost me?”",
      },
      {
        type: "p",
        text: "The answer varies more than you might expect—but once you understand the different options available, it becomes much easier to decide what’s right for your business.",
      },
      {
        type: "p",
        text: "In this guide, we’ll break down realistic website costs in Ireland in 2026, what you get at each price point, and how to avoid overpaying.",
      },
      { type: "h2", text: "1. Typical website costs in Ireland" },
      {
        type: "p",
        text: "Here’s a realistic breakdown of what small businesses are paying right now:",
      },
      {
        type: "table",
        headers: ["Type of website", "Typical cost"],
        rows: [
          ["DIY (Wix, Squarespace)", "€0 – €300/year"],
          ["Freelancer", "€500 – €2,500"],
          ["Small agency", "€2,000 – €5,000+"],
          ["Custom / large projects", "€5,000 – €15,000+"],
        ],
      },
      {
        type: "p",
        text: "At first glance, this range can feel confusing—but the differences come down to time, expertise, and level of service.",
      },
      { type: "h2", text: "2. What you actually get at each level" },
      { type: "h3", text: "DIY builders (€0–€300/year)" },
      {
        type: "ul",
        items: [
          "You build it yourself",
          "Templates and drag-and-drop tools",
          "Low cost, but time-intensive",
        ],
      },
      {
        type: "p",
        text: "Best for: very early-stage or hobby businesses.",
      },
      { type: "h3", text: "Freelancers (€500–€2,500)" },
      {
        type: "ul",
        items: [
          "Custom design (to a degree)",
          "Faster than DIY",
          "Quality varies significantly",
        ],
      },
      {
        type: "p",
        text: "Best for: small businesses needing a basic online presence.",
      },
      { type: "h3", text: "Agencies (€2,000–€5,000+)" },
      {
        type: "ul",
        items: [
          "Structured process",
          "Branding, UX, and content support",
          "More reliable outcomes",
        ],
      },
      {
        type: "p",
        text: "Best for: businesses investing in long-term growth.",
      },
      { type: "h3", text: "Custom builds (€5,000+)" },
      {
        type: "ul",
        items: [
          "Fully bespoke",
          "Advanced features (booking systems, integrations, and similar)",
        ],
      },
      {
        type: "p",
        text: "Best for: scaling or complex businesses.",
      },
      { type: "h2", text: "3. The hidden cost most people miss" },
      {
        type: "p",
        text: "The biggest cost is not always the website itself. It’s time lost to delays, endless revisions, and unclear scope.",
      },
      {
        type: "p",
        text: "Many projects start at a reasonable price but expand because of:",
      },
      {
        type: "ul",
        items: [
          "Unclear requirements",
          "Too many revision rounds",
          "Poor communication",
        ],
      },
      {
        type: "p",
        text: "That’s where costs quietly increase.",
      },
      { type: "h2", text: "4. A faster alternative: fixed-price delivery" },
      {
        type: "p",
        text: "A newer model is becoming more common: fixed-price websites with a clear scope and rapid delivery—often in days rather than weeks.",
      },
      {
        type: "p",
        text: "That approach can reduce long timelines, unpredictable pricing, and ongoing back-and-forth. For many small businesses, it strikes a sensible balance between cost and quality.",
      },
      { type: "h2", text: "5. What should you budget?" },
      {
        type: "p",
        text: "For most Irish small businesses, a realistic starting budget is around €400–€1,000. That range should cover a professional-looking, mobile-friendly site with clear messaging and a quick turnaround.",
      },
      {
        type: "p",
        text: "Anything significantly above that should come with clear added value: extra features, stronger strategy, or a measurable business benefit you can point to.",
      },
      { type: "h2", text: "Conclusion" },
      {
        type: "p",
        text: "There’s no single “correct” price for a website—but there is a sound approach: know what you need, avoid overbuilding too early, and choose a model that matches your stage.",
      },
      {
        type: "p",
        text: "For most small businesses, the goal isn’t perfection—it’s getting online quickly with something professional that works.",
      },
      {
        type: "inline",
        segments: [
          "If you’re exploring options and want a clearer idea of what your business needs, feel free to ",
          { href: "/contact", label: "reach out" },
          " or ",
          { href: "/#contact", label: "request a quick quote" },
          "—we’re happy to help.",
        ],
      },
    ],
  },
  {
    slug: "one-page-site-vs-multi-page",
    title: "When a one-page site is enough (and when it isn’t)",
    date: "2026-03-15",
    description:
      "A single scroller can launch fast and convert well—here’s how to decide if it fits your business.",
    paragraphs: [
      "Many small businesses don’t need a dozen pages on day one. A focused one-page site puts your offer, proof, and contact in one scroll—ideal when you have one primary goal: bookings, leads, or enquiries.",
      "Choose a one-pager when your story is simple, you’re validating an offer, or you need something live in days. Plan for more pages when you have distinct product lines, lots of SEO landing targets, or heavy content like a blog.",
      "At Evolution Media we often start with a tight one-page build so you can ship, learn from real traffic, then add sections or pages as you grow.",
    ],
  },
  {
    slug: "nextjs-tailwind-why-fast",
    title: "Why we build with Next.js and Tailwind",
    date: "2026-03-22",
    description:
      "Performance, maintainability, and a great editor experience—without locking you into a brittle template.",
    paragraphs: [
      "Next.js gives you server rendering, smart image handling, and routing out of the box. That means faster first paint for visitors and fewer surprises when you scale traffic or add features.",
      "Tailwind keeps styling consistent and easy to tweak without hunting through giant CSS files. Together they’re a sweet spot for custom sites that still feel fast to iterate.",
      "You don’t need to care about the stack day to day—but when you hire another developer or agency, popular tools make handoffs smoother.",
    ],
  },
  {
    slug: "launch-checklist-small-business",
    title: "A practical launch checklist for your new site",
    date: "2026-04-01",
    description:
      "Before you point the domain, run through these checks so you don’t lose leads or trust.",
    paragraphs: [
      "Test every form: submit once for real and confirm the message hits your inbox or CRM. Check phone and email links on mobile.",
      "Set your page titles and meta descriptions for the homepage and key sections. Add your site to Google Search Console and submit the sitemap when you’re ready.",
      "Compress hero and gallery images, turn on HTTPS, and skim your privacy and cookie messaging if you use analytics or chat. Small details add up to a professional first impression.",
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
