import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "../evomedia/evomedia.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "iOS Apps | Evolution Media",
  description:
    "Hobby games and iOS side projects built by Evolution Media—casual games made for fun.",
};

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${syne.variable} ${dmSans.variable}`}>{children}</div>
  );
}
