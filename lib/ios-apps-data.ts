/**
 * iOS apps – hobby games and side projects.
 *
 * Screenshots: public/ios-apps/ (e.g. loopnik.jpg)
 * App icons:   public/ios-apps/icons/ (e.g. loopnik.png)
 */

export type IosAppCategory = "Puzzle" | "Arcade" | "Casual" | "Strategy";

export interface IosApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: IosAppCategory;
  developer: string;
  /** App Store URL – leave empty until published */
  appStoreUrl?: string;
  screenshot: string;
  icon: string;
  /** Extra screenshots for the support page gallery */
  gallery?: string[];
  features: string[];
  gradient: string;
  accent: string;
  year?: number;
  /** Base64-encoded support email — avoids plain-text in HTML source */
  supportEmailEncoded: string;
}

export const iosAppCategories: IosAppCategory[] = [
  "Puzzle",
  "Arcade",
  "Casual",
  "Strategy",
];

export const iosAppsData: IosApp[] = [
  {
    id: "loopnik",
    name: "Loopnik",
    tagline: "One tap. Reverse. Survive.",
    description:
      "A tiny satellite, a deadly orbit, one button. Tap to reverse and dodge spikes for as long as you can.",
    category: "Arcade",
    developer: "Evo Media",
    appStoreUrl: "https://apps.apple.com/ie/app/loopnik/id6779780237",
    screenshot: "/loopnik-icon.png",
    icon: "/ios-apps/icons/loopnik.png",
    features: ["One-tap controls", "Daily Challenge", "Remove Ads IAP"],
    gradient: "from-cyan-500/30 to-sky-600/30",
    accent: "#2ec7fa",
    year: 2026,
    supportEmailEncoded: "am9obnJvY2hpZTg2QGdtYWlsLmNvbQ==",
  },
  {
    id: "puff-pop-panic",
    name: "Puff Pop Panic",
    tagline: "Trap foes, jump to pop!",
    description:
      "Meet Puff, a small dragon with a big talent: blowing bubbles that trap trouble. Run and jump through 10 single-screen rooms packed with grumpy spike-blobs—blow a bubble to trap them, then jump up and pop it before they wriggle free. Chain pops for combo bonuses and collect the fruit they leave behind.",
    category: "Arcade",
    developer: "John Rochie",
    appStoreUrl: "",
    screenshot: "/ios-apps/puff-pop-panic.jpg",
    icon: "/ios-apps/icons/puff-pop-panic.png",
    features: ["10 arcade rooms", "Combo scoring", "No ads or tracking"],
    gradient: "from-cyan-500/30 to-pink-500/30",
    accent: "#38bdf8",
    year: 2026,
    supportEmailEncoded: "am9obnJvY2hpZTg2QGdtYWlsLmNvbQ==",
  },
  {
    id: "neon-blocks",
    name: "Neon Blocks — Block Drop",
    tagline: "Classic blocks. Neon glow.",
    description:
      "A polished Tetris-style block-stacking puzzle built for iPhone. All seven tetrominoes with SRS rotation and wall kicks, 7-bag randomizer, ghost piece, hold, and next-piece preview. Clear lines to advance through 16 speed levels, chain combos for bonus points, and climb a persistent top-10 high score board. Auto-save on background—or tap Save & Quit—and pick up where you left off. Sound, haptics, and a modern jewel-tone UI on a board that scales to any iPhone or iPad. Developed by Evo Media.",
    category: "Puzzle",
    developer: "Evo Media",
    appStoreUrl: "",
    screenshot: "/ios-apps/neon-blocks.jpg",
    icon: "/ios-apps/icons/neon-blocks.svg",
    gallery: [
      "/ios-apps/neon-blocks.jpg",
      "/ios-apps/neon-blocks-gameplay.jpg",
      "/ios-apps/neon-blocks-gameplay-2.jpg",
      "/ios-apps/neon-blocks-high-scores.jpg",
    ],
    features: ["Full Tetris rules", "Save & resume", "Gameplay ad-free"],
    gradient: "from-fuchsia-500/30 to-cyan-500/30",
    accent: "#00d4ff",
    year: 2026,
    supportEmailEncoded: "am9obnJvY2hpZTg2QGdtYWlsLmNvbQ==",
  },
];

export function getIosAppById(id: string): IosApp | undefined {
  return iosAppsData.find((app) => app.id === id);
}
