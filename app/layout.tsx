import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Evolution Media | AI-Powered Web Design",
  description:
    "AI-powered web design. Built fast. Built right. Custom sites, e-commerce, and portfolios. Get your site live in days.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://evomedia.site"),
  openGraph: {
    title: "Evolution Media | AI-Powered Web Design",
    description: "Custom web design, e-commerce, and portfolios. Get live in days.",
    url: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
