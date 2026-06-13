/**
 * iOS apps – hobby games and side projects.
 * Edit this file to add your App Store links, screenshots, and copy.
 *
 * Screenshots go in public/ios-apps/ (e.g. public/ios-apps/pixel-drop.jpg)
 * App icons go in public/ios-apps/icons/ (e.g. public/ios-apps/icons/pixel-drop.png)
 */

export type IosAppCategory = "Puzzle" | "Arcade" | "Casual" | "Strategy";

export interface IosApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: IosAppCategory;
  /** App Store URL – leave empty until published */
  appStoreUrl?: string;
  /** Path under public/ – e.g. /ios-apps/my-game.jpg */
  screenshot: string;
  /** Path under public/ – e.g. /ios-apps/icons/my-game.png */
  icon: string;
  features: string[];
  gradient: string;
  accent: string;
  /** Release year for display */
  year?: number;
}

export const iosAppCategories: IosAppCategory[] = [
  "Puzzle",
  "Arcade",
  "Casual",
  "Strategy",
];

export const iosAppsData: IosApp[] = [
  {
    id: "game-one",
    name: "Your Game Name",
    tagline: "Short hook that sells the game",
    description:
      "Replace this with a sentence or two about your game—what players do, what makes it fun, and why you built it.",
    category: "Puzzle",
    appStoreUrl: "", // e.g. "https://apps.apple.com/app/idXXXXXXXXX"
    screenshot: "/ios-apps/game-one.jpg",
    icon: "/ios-apps/icons/game-one.png",
    features: ["Single-player", "Offline play", "No ads"],
    gradient: "from-violet-500/30 to-fuchsia-600/30",
    accent: "#a855f7",
    year: 2025,
  },
  {
    id: "game-two",
    name: "Your Second Game",
    tagline: "Another catchy one-liner",
    description:
      "Describe your second hobby game here. Mention the core loop, difficulty, or anything that sets it apart.",
    category: "Arcade",
    appStoreUrl: "", // e.g. "https://apps.apple.com/app/idXXXXXXXXX"
    screenshot: "/ios-apps/game-two.jpg",
    icon: "/ios-apps/icons/game-two.png",
    features: ["Quick sessions", "High scores", "Haptic feedback"],
    gradient: "from-cyan-500/30 to-blue-600/30",
    accent: "#00d4ff",
    year: 2025,
  },
];
