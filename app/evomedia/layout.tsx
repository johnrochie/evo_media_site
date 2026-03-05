import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./evomedia.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Evolution Media | Bold Web Design & Digital Agency",
  description:
    "We craft bold, creative digital experiences. Web design, branding, and development that evolves your brand. evomedia.site",
  keywords: ["web design", "digital agency", "branding", "evolution media", "creative agency"],
  openGraph: {
    title: "Evolution Media | Bold Web Design & Digital Agency",
    description: "We craft bold, creative digital experiences. evomedia.site",
  },
};

export default function EvolutionMediaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${syne.variable} ${dmSans.variable} evomedia-page min-h-screen bg-[#0a0a0f] text-gray-100`}
    >
      {children}
    </div>
  );
}
