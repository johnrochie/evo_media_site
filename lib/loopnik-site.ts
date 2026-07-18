/** Loopnik marketing site content — sourced from App Store listing + support docs. */

export const site = {
  name: "Loopnik",
  tagline: "One tap. Reverse. Survive.",
  description:
    "A tiny satellite, a deadly orbit, one button. How long can you last?",
  appStoreUrl: "https://apps.apple.com/ie/app/loopnik/id6779780237",
  /** Empty until published — CTA shows Coming soon */
  playStoreUrl: "",
  supportEmailEncoded: "am9obnJvY2hpZTg2QGdtYWlsLmNvbQ==",
  copyrightYear: 2026,
  studio: "Evo Media",
  studioUrl: "/",
} as const;

export const features = [
  {
    title: "Combo gems",
    body: "Chain gems into combos — reversing breaks the chain. Push for up to 5×.",
    accent: "var(--loopnik-gold)",
  },
  {
    title: "Near-miss bonuses",
    body: "Skim past armed spikes for bonus points — if you dare.",
    accent: "var(--loopnik-hazard)",
  },
  {
    title: "Shield & Nova",
    body: "Grab power-ups: shield yourself and smash through spikes, or nova-blast the whole ring clear.",
    accent: "var(--loopnik-shield)",
  },
  {
    title: "Daily Challenge",
    body: "A new modifier every day with its own leaderboard. Keep the streak alive.",
    accent: "var(--loopnik-gold)",
  },
  {
    title: "Game Center",
    body: "Climb leaderboards and hunt achievements. Pure reflexes, instant restarts.",
    accent: "var(--loopnik-accent)",
  },
  {
    title: "Remove Ads",
    body: "Free to play with occasional ads — or remove them forever with a single purchase.",
    accent: "var(--loopnik-accent)",
  },
] as const;
