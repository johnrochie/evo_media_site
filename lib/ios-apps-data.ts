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
    name: "LoopNik!",
    tagline: "Orbit. Reverse. Survive.",
    description:
      "A one-tap arcade game for iPhone. Tap to reverse your orbit and dodge obstacles for as long as you can.",
    category: "Arcade",
    developer: "John Rochie",
    appStoreUrl: "",
    screenshot: "/ios-apps/loopnik.jpg",
    icon: "/ios-apps/icons/loopnik.png",
    features: ["One-tap controls", "Offline play", "Remove Ads IAP"],
    gradient: "from-orange-500/30 to-rose-600/30",
    accent: "#f97316",
    year: 2026,
    supportEmailEncoded: "am9obnJvY2hpZTg2QGdtYWlsLmNvbQ==",
  },
  {
    id: "puff-pop-panic",
    name: "Puff Pop Panic",
    tagline: "Pop fast. Stay calm. Don't panic.",
    description:
      "A fast-paced casual game for iPhone. Pop the puffs before they overwhelm you—quick reflexes and steady nerves win the day.",
    category: "Casual",
    developer: "John Rochie",
    appStoreUrl: "",
    screenshot: "/ios-apps/puff-pop-panic.jpg",
    icon: "/ios-apps/icons/puff-pop-panic.png",
    features: ["Quick sessions", "Offline play", "Remove Ads IAP"],
    gradient: "from-sky-400/30 to-violet-600/30",
    accent: "#a855f7",
    year: 2026,
    supportEmailEncoded: "am9obnJvY2hpZTg2QGdtYWlsLmNvbQ==",
  },
];

export function getIosAppById(id: string): IosApp | undefined {
  return iosAppsData.find((app) => app.id === id);
}
