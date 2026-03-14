import type { Metadata } from "next";
import CookieConsent from "@/components/CookieConsent";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.evomedia.site";

export const metadata: Metadata = {
  title: "Evolution Media | AI-Powered Web Design",
  description:
    "AI-powered web design. Built fast. Built right. One-page sites from €499. Custom and e-commerce available. Live in days.",
  metadataBase: new URL(siteUrl),
  keywords: ["web design", "digital agency", "e-commerce", "portfolio", "evolution media", "AI web design"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Evolution Media | AI-Powered Web Design",
    description: "One-page sites from €499. Custom and e-commerce. Live in days.",
    url: "/",
    siteName: "Evolution Media",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evolution Media | AI-Powered Web Design",
    description: "One-page sites from €499. Custom and e-commerce. Live in days.",
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
