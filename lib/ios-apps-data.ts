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
  supportEmail: string;
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
    supportEmail: "johnrochie86@gmail.com",
  },
];

export function getIosAppById(id: string): IosApp | undefined {
  return iosAppsData.find((app) => app.id === id);
}
