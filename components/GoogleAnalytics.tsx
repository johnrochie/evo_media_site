"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (!GA_MEASUREMENT_ID || typeof w.gtag !== "function") return;
    w.gtag("config", GA_MEASUREMENT_ID, { page_path: pathname });
  }, [pathname]);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
