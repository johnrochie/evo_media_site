"use client";

import EvomediaNav from "@/components/evomedia/EvomediaNav";
import { site } from "@/lib/loopnik-site";

export default function LoopnikSiteNav() {
  return (
    <EvomediaNav
      fromNestedRoute
      trailing={
        <a
          href={site.appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[var(--loopnik-accent,#2ec7fa)] px-3 py-1.5 text-xs font-bold text-[#0a0a0f] transition-opacity hover:opacity-90 md:px-4 md:py-2 md:text-sm"
        >
          App Store
        </a>
      }
    />
  );
}
