"use client";

import { ScrollSection, ScrollItem } from "./ScrollSection";
import { evomediaContent } from "@/lib/evomedia-content";
import { whyUsIcons } from "./evomedia-icons";

const c = evomediaContent.whyUs;

export default function WhyUsSection() {
  return (
    <ScrollSection id="why-evolution-media" className="py-20 md:py-28 bg-[#0d0d12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollItem className="text-center mb-16">
          <p className="text-[#ff00aa] font-semibold tracking-widest uppercase text-sm mb-2">
            {c.label}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {c.title} <span className="evomedia-gradient-text">{c.titleHighlight}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {c.subtitle}
          </p>
        </ScrollItem>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {c.items.map((item, i) => {
            const Icon = whyUsIcons[item.icon.toLowerCase()];
            return (
              <ScrollItem key={item.title} delay={i * 0.1}>
                <div className="text-center">
                  {Icon && (
                    <div className="inline-flex w-14 h-14 rounded-2xl bg-[#00d4ff]/10 items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-[#00d4ff]" />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </ScrollItem>
            );
          })}
        </div>
      </div>
    </ScrollSection>
  );
}
