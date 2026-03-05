"use client";

import { ScrollSection, ScrollItem } from "./ScrollSection";
import { evomediaContent } from "@/lib/evomedia-content";
import { howItWorksIcons } from "./evomedia-icons";

const c = evomediaContent.howItWorks;

export default function HowItWorksSection() {
  return (
    <ScrollSection id="how-it-works" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollItem className="text-center mb-16">
          <p className="text-[#ffb800] font-semibold tracking-widest uppercase text-sm mb-2">
            {c.label}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {c.title} <span className="evomedia-gradient-text">{c.titleHighlight}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {c.subtitle}
          </p>
        </ScrollItem>

        <div className="relative">
          <div className="hidden md:block absolute top-14 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00d4ff]/30 via-[#ff00aa]/30 to-[#ffb800]/30" style={{ top: "3.5rem" }} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {c.steps.map((item, i) => {
              const Icon = howItWorksIcons[item.icon.toLowerCase()];
              return (
                <ScrollItem key={item.step} delay={i * 0.12}>
                  <div className="relative flex flex-col items-center text-center">
                    {Icon && (
                      <div className="w-14 h-14 rounded-2xl bg-[#12121a] border-2 border-[#00d4ff]/40 flex items-center justify-center mb-4 relative z-10">
                        <Icon className="w-7 h-7 text-[#00d4ff]" />
                      </div>
                    )}
                    <span className="text-xs font-bold text-[#00d4ff]/80 tracking-widest mb-2">
                      STEP {item.step}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm max-w-xs">{item.description}</p>
                  </div>
                </ScrollItem>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollSection>
  );
}
