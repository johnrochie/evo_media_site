export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  /** Plain paragraphs for rendering */
  paragraphs: string[];
};

export const blogPosts: BlogPost[] = [
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
