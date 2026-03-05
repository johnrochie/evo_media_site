import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import Script from "next/script";
import "../evomedia/evomedia.css";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.evomedia.site";

export const metadata: Metadata = {
  title: "Evolution Media | AI-Powered Web Design & Digital Agency",
  description:
    "AI-powered web design. Built fast. Built right. Custom sites, e-commerce, and portfolios. Get your site live in days.",
  keywords: ["web design", "digital agency", "branding", "e-commerce", "evolution media", "creative agency"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Evolution Media | AI-Powered Web Design & Digital Agency",
    description: "AI-powered web design. Custom sites, e-commerce, portfolios. Get live in days.",
    url: "/",
    siteName: "Evolution Media",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evolution Media | AI-Powered Web Design & Digital Agency",
    description: "AI-powered web design. Custom sites, e-commerce, portfolios. Get live in days.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Evolution Media",
  description:
    "AI-powered web design. Custom websites, e-commerce, and portfolios. Get your site live in days.",
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressCountry: "GB",
  },
  sameAs: [
    "https://x.com/evomediax",
    "https://instagram.com/evomedia_gram",
  ],
  areaServed: "GB",
  priceRange: "€€",
};

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${syne.variable} ${dmSans.variable} evomedia-page min-h-screen bg-[#0a0a0f] text-gray-100`}
    >
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="afterInteractive"
      />
      {children}
    </div>
  );
}
