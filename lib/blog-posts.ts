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
    slug: “website-cost-ireland-small-business-2026”,
    title: “How Much Does a Website Cost for a Small Business in Ireland (2026 Guide)”,
    date: “2026-04-07”,
    description:
      “Realistic price ranges for DIY, freelancers, and agencies—plus hidden costs, VAT, and how to budget without overpaying.”,
    paragraphs: [],
    blocks: [
      {
        type: “p”,
        text: “If you’re a small business owner in Ireland, one of the first questions you’ll ask when thinking about getting a website is: ‘How much is this actually going to cost me?’”,
      },
      {
        type: “p”,
        text: “The honest answer: anywhere from nothing to tens of thousands, depending on what you need. But for most Irish sole traders and small businesses, a professional website shouldn’t cost more than €500–€1,500 to get right—and in many cases it can be done for significantly less.”,
      },
      {
        type: “p”,
        text: “In this guide we’ll break down the real price ranges in Ireland in 2026, what you actually get at each level, the hidden costs most people forget about, and how to decide what’s right for your stage of business.”,
      },
      { type: “h2”, text: “Quick summary: typical website costs in Ireland” },
      {
        type: “table”,
        headers: [“Option”, “Typical cost”, “Who it suits”],
        rows: [
          [“DIY (Wix, Squarespace, Webflow)”, “€0 – €400/year”, “Hobby or very early-stage businesses”],
          [“Fixed-price web studio”, “€400 – €800 once-off”, “Small businesses that want fast, professional results”],
          [“Freelance web designer”, “€800 – €3,000”, “Businesses wanting more custom input”],
          [“Small design agency”, “€2,500 – €7,000+”, “Growing businesses with defined brand needs”],
          [“Custom / full-stack build”, “€7,000 – €20,000+”, “Complex platforms, e-commerce, web apps”],
        ],
      },
      {
        type: “p”,
        text: “These ranges reflect what’s typical in the Irish market in 2026. The spread is wide—but once you understand what drives the cost at each level, it becomes easier to decide where you fit.”,
      },
      { type: “h2”, text: “What you actually get at each price point” },
      { type: “h3”, text: “DIY builders — €0 to €400/year” },
      {
        type: “p”,
        text: “Platforms like Wix, Squarespace, and Webflow let you build a site yourself using templates and drag-and-drop tools. The software cost is low, but your time is not free—expect to spend 10–30 hours getting something that looks decent. Templates can also be hard to customise meaningfully, so many DIY sites end up looking generic.”,
      },
      {
        type: “ul”,
        items: [
          “Best for: testing an idea, very early-stage businesses, or side projects”,
          “Pitfall: ongoing subscription costs add up; you own nothing if you leave the platform”,
          “Pitfall: search engines index these sites just fine, but performance and control are limited”,
        ],
      },
      { type: “h3”, text: “Fixed-price web studios — €400 to €800” },
      {
        type: “p”,
        text: “A newer model that has grown significantly: studios that offer a defined scope at a fixed price, typically delivered in days rather than weeks. You get a custom-designed site built on proper technology (not a template builder), with clear terms and a fast turnaround. This is where the best value sits for most Irish small businesses right now.”,
      },
      {
        type: “ul”,
        items: [
          “Best for: sole traders, local businesses, anyone who needs to get online quickly and professionally”,
          “What’s included: custom design, mobile-responsive, basic SEO, contact form, deployment”,
          “What’s typically not included: e-commerce, booking systems, complex custom functionality”,
        ],
      },
      { type: “h3”, text: “Freelance web designers — €800 to €3,000” },
      {
        type: “p”,
        text: “A freelancer will typically spend more time on your project and offer more back-and-forth. Quality varies significantly—the best freelancers deliver excellent work, but there’s less consistency than working with a structured studio. Budget more time for communication, revisions, and following up.”,
      },
      {
        type: “ul”,
        items: [
          “Best for: businesses wanting a more involved design process”,
          “Pitfall: scope creep is common; make sure any quote includes a revision limit”,
          “Pitfall: timelines often stretch—ask specifically how many active projects they’re running”,
        ],
      },
      { type: “h3”, text: “Small agencies — €2,500 to €7,000+” },
      {
        type: “p”,
        text: “An agency brings a team: designer, developer, possibly a strategist or copywriter. The process is more structured and the results more consistent. You’re paying for more heads and more time, which is worth it for businesses where the website is a primary sales tool.”,
      },
      { type: “h3”, text: “Custom builds — €7,000+” },
      {
        type: “p”,
        text: “Fully bespoke sites, web applications, large e-commerce platforms, or anything with complex integrations. These projects involve significant scoping, longer timelines, and specialist development. Rarely appropriate for a business at early stage.”,
      },
      { type: “h2”, text: “The hidden costs most people miss” },
      {
        type: “p”,
        text: “The quoted price is rarely the total cost. Here’s what to factor in:”,
      },
      {
        type: “table”,
        headers: [“Cost”, “Typical amount”, “Notes”],
        rows: [
          [“Domain name”, “€10 – €20/year”, “.ie domains from €15–€25/year; .com from €10–€12”],
          [“Hosting”, “€0 – €25/month”, “Modern platforms like Vercel are free or low-cost for basic sites”],
          [“SSL certificate”, “Usually free”, “Included with most hosting; never pay extra for this”],
          [“Email (professional)”, “€3 – €8/user/month”, “Google Workspace or Microsoft 365—not included in most web packages”],
          [“Ongoing maintenance”, “€0 – €50/month”, “Updates, backups, minor edits—worth budgeting for”],
          [“Photography / images”, “€0 – €500+”, “Stock images are cheap; professional photos add real value”],
        ],
      },
      {
        type: “p”,
        text: “A common trap: a business pays €600 for a website, then spends €50/month on tools, hosting, and email—and after a year has spent €1,200 in total. Factor in these ongoing costs before choosing your approach.”,
      },
      { type: “h2”, text: “What about VAT?” },
      {
        type: “p”,
        text: “This catches a lot of Irish business owners off guard. If your web designer or agency is VAT-registered, they must add 23% VAT on top of their quoted price for Irish clients. Always ask whether quoted prices are VAT-inclusive or exclusive.”,
      },
      {
        type: “p”,
        text: “For example: a quoted €1,000 from a VAT-registered designer actually costs you €1,230. If you’re VAT-registered yourself, you can reclaim it—but if you’re not (many sole traders aren’t), you pay the full amount.”,
      },
      {
        type: “p”,
        text: “Smaller studios and freelancers below the VAT threshold (€37,500 in annual turnover for services) don’t charge VAT, which can make their all-in prices more competitive than they look at first glance.”,
      },
      { type: “h2”, text: “What should you actually budget?” },
      {
        type: “p”,
        text: “For most Irish small businesses—a local shop, a tradesperson, a therapist, a restaurant, a sole trader of any kind—a realistic and appropriate budget is €400–€1,000 for the website itself. Within that range, you should be able to get:”,
      },
      {
        type: “ul”,
        items: [
          “A custom-designed, mobile-responsive site”,
          “Clear messaging that reflects your business”,
          “A contact form or booking link”,
          “Basic SEO setup”,
          “Something live within a week”,
        ],
      },
      {
        type: “p”,
        text: “If you’re being quoted more than that for a basic site, make sure you understand specifically what extra value you’re getting. More pages? Stronger strategy? A dedicated account manager? These can all justify a higher price—just make sure the extra spend is deliberate, not accidental.”,
      },
      { type: “h2”, text: “Frequently asked questions” },
      { type: “h3”, text: “Can I get a decent website for under €500?” },
      {
        type: “p”,
        text: “Yes. A well-built one-page site at €499 can outperform a bloated five-page site at €3,000 if it’s designed with a clear goal. For most early-stage businesses, one page done well is the right starting point.”,
      },
      { type: “h3”, text: “How long should a website take to build?” },
      {
        type: “p”,
        text: “A focused one-page site should be live within 3–7 working days once you’ve provided your content. Longer timelines are usually a sign of scope creep, an overloaded developer, or unclear requirements—not that the job is genuinely more complex.”,
      },
      { type: “h3”, text: “Do I need to pay someone to maintain it?” },
      {
        type: “p”,
        text: “Not necessarily. A well-built site on a modern platform is low-maintenance. You might pay €30–€50/month for a care plan that handles updates, backups, and minor text changes—or handle it yourself if you’re comfortable. Agree this at the start rather than getting a surprise invoice later.”,
      },
      { type: “h3”, text: “What’s the difference between a website and a landing page?” },
      {
        type: “p”,
        text: “In practice, not much for a small business. A landing page is a single focused page designed for one action (usually a lead or sale). A website typically has multiple pages and sections. For most Irish businesses at early stage, a well-structured single-page site does the same job as a multi-page site at a fraction of the cost.”,
      },
      { type: “h2”, text: “The bottom line” },
      {
        type: “p”,
        text: “Website pricing in Ireland is genuinely wide—from nothing to six figures. But for most small businesses the answer sits in a much tighter range: €400–€1,000 for a professional first site, built fast, on proper technology, with clear terms.”,
      },
      {
        type: “p”,
        text: “The goal for most businesses at this stage isn’t perfection. It’s getting something professional online quickly, so you can start generating enquiries while you grow.”,
      },
      {
        type: “inline”,
        segments: [
          “If you want a clearer picture of what your specific business needs—and what it would cost—“,
          { href: “/brief”, label: “fill in a quick brief” },
          “ and we’ll come back to you within 24 hours with a straightforward answer.”,
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
