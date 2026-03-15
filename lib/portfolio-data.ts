/**
 * Portfolio projects – real delivered work.
 * Used by the PortfolioSection and /portfolio page.
 */

export type PortfolioCategory =
  | "Travel"
  | "Bridal"
  | "Real Estate"
  | "Healthcare"
  | "Restaurant"
  | "Beauty";

export interface PortfolioProject {
  id: string;
  name: string;
  category: PortfolioCategory;
  url: string;
  image: string;
  features: string[];
  gradient: string;
  accent: string;
  description?: string;
}

export const portfolioCategories: PortfolioCategory[] = [
  "Travel",
  "Bridal",
  "Real Estate",
  "Healthcare",
  "Restaurant",
  "Beauty",
];

export const portfolioData: PortfolioProject[] = [
  {
    id: "luxe-estates",
    name: "Luxe Estates",
    category: "Real Estate",
    url: "https://real-estate-agency-lemon.vercel.app/",
    image: "/portfolio-samples/luxe-estates.jpg",
    features: ["Property listings", "Search filters", "Contact forms", "Mobile-first"],
    gradient: "from-sky-500/20 to-cyan-600/20",
    accent: "#00d4ff",
    description:
      "One-page scroller for a luxury estate agency. Next.js, Tailwind, responsive layout with hero, listings, services, and contact. Built for speed and local SEO.",
  },
  {
    id: "premier-dental",
    name: "Premier Dental Care",
    category: "Healthcare",
    url: "https://dental-practice-xi.vercel.app/",
    image: "/portfolio-samples/premier-dental.jpg",
    features: ["Services", "Team profiles", "Testimonials", "Booking CTA"],
    gradient: "from-slate-400/20 to-blue-500/20",
    accent: "#0ea5e9",
    description:
      "Dental practice site with services, team section, and patient testimonials. Single-page layout, clean typography, and clear booking CTA. Next.js and Tailwind.",
  },
  {
    id: "travel-bug",
    name: "Travel Bug",
    category: "Travel",
    url: "https://travelbug-v1.vercel.app/",
    image: "/portfolio-samples/travel-bug.jpg",
    features: ["Services", "Offers", "Trip planning", "Contact form"],
    gradient: "from-amber-500/20 to-orange-600/20",
    accent: "#f59e0b",
    description:
      "Independent travel advisor site: services, offers, and trip planning. One-page scroller with strong CTAs and contact form. Next.js, Tailwind, mobile-first.",
  },
  {
    id: "golden-dragon",
    name: "Golden Dragon",
    category: "Restaurant",
    url: "https://golden-dragon-chinese-ukrt.vercel.app/",
    image: "/portfolio-samples/golden-dragon.jpg",
    features: ["Menu", "Online ordering", "Private events", "Gallery"],
    gradient: "from-red-600/20 to-amber-700/20",
    accent: "#dc2626",
    description:
      "Chinese restaurant one-pager with menu, online ordering, private events, and gallery. Bold visuals and clear ordering flow. Next.js and Tailwind.",
  },
  {
    id: "oak-ember",
    name: "The Oak & Ember",
    category: "Restaurant",
    url: "https://restaurant-sigma-peach.vercel.app/",
    image: "/portfolio-samples/oak-ember.jpg",
    features: ["Seasonal menu", "Bookings", "Order online", "Gallery"],
    gradient: "from-amber-600/20 to-orange-700/20",
    accent: "#f97316",
    description:
      "Modern dining site with seasonal menu, booking CTA, and online ordering. One-page scroller, warm palette, and gallery. Next.js, Tailwind, responsive.",
  },
  {
    id: "luna-co",
    name: "Luna & Co Hair Studio",
    category: "Bridal",
    url: "https://salon-opal-zeta.vercel.app/",
    image: "/portfolio-samples/luna-co.jpg",
    features: ["Services", "Team", "Gallery", "Booking", "Bridal"],
    gradient: "from-purple-500/20 to-pink-600/20",
    accent: "#a855f7",
    description:
      "Hair studio and bridal salon: services, team, gallery, and booking. One-page layout with premium feel. Next.js, Tailwind, mobile-first.",
  },
];
