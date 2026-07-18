import type { Metadata } from "next";
import { Nunito, Outfit } from "next/font/google";
import "./loopnik.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Loopnik — One tap. Reverse. Survive.",
    template: "%s · Loopnik",
  },
  description:
    "Loopnik is the one-tap arcade game you can't put down. Orbit, reverse, dodge spikes, and survive as long as you can.",
  openGraph: {
    title: "Loopnik — One tap. Reverse. Survive.",
    description:
      "A tiny satellite, a deadly orbit, one button. How long can you last?",
    images: [
      {
        url: "/loopnik-icon.png",
        width: 1024,
        height: 1024,
        alt: "Loopnik",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Loopnik — One tap. Reverse. Survive.",
    description:
      "A tiny satellite, a deadly orbit, one button. How long can you last?",
    images: ["/loopnik-icon.png"],
  },
  icons: {
    icon: "/loopnik-icon.png",
    apple: "/loopnik-icon.png",
  },
};

export default function LoopnikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${nunito.variable} ${outfit.variable} loopnik-page`}>
      {children}
    </div>
  );
}
