"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ScrollSection, ScrollItem } from "./ScrollSection";
import { IosAppCard } from "./IosAppCard";
import { evomediaContent } from "@/lib/evomedia-content";
import { iosAppsData } from "@/lib/ios-apps-data";

const c = evomediaContent.iosApps;

export default function IosAppsSection() {
  return (
    <ScrollSection id="ios-apps" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollItem className="text-center mb-12">
          <p className="text-[#00d4ff] font-semibold tracking-widest uppercase text-sm mb-2">
            {c.label}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {c.title}{" "}
            <span className="evomedia-gradient-text">{c.titleHighlight}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{c.subtitle}</p>
        </ScrollItem>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {iosAppsData.map((app, i) => (
            <ScrollItem key={app.id} delay={i * 0.1}>
              <IosAppCard app={app} layout="vertical" />
            </ScrollItem>
          ))}
        </div>

        <ScrollItem className="text-center mt-12">
          <Link
            href="/apps"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-colors"
          >
            {c.viewAllLabel}
            <ExternalLink className="w-4 h-4" aria-hidden />
          </Link>
        </ScrollItem>
      </div>
    </ScrollSection>
  );
}
