"use client";

import { ScrollSection, ScrollItem } from "./ScrollSection";
import { evomediaContent } from "@/lib/evomedia-content";
import { serviceIcons } from "./evomedia-icons";

const c = evomediaContent.whatWeDo;

export default function ServicesSection() {
  return (
    <ScrollSection id="what-we-do" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollItem className="text-center mb-16">
          <p className="text-[#00d4ff] font-semibold tracking-widest uppercase text-sm mb-2">
            {c.label}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {c.title} <span className="evomedia-gradient-text">{c.titleHighlight}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {c.subtitle}
          </p>
        </ScrollItem>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {c.services.map((service, i) => {
            const Icon = serviceIcons[service.icon.toLowerCase()];
            return (
              <ScrollItem key={service.title} delay={i * 0.1}>
                <div className="group h-full p-6 md:p-8 rounded-2xl bg-[#12121a] border border-white/5 hover:border-[#00d4ff]/30 transition-colors flex flex-col">
                  {Icon && (
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${service.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: service.color }} />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00d4ff] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-4 flex-1">{service.description}</p>
                  <p className="text-sm font-semibold" style={{ color: service.color }}>
                    {service.price}
                  </p>
                </div>
              </ScrollItem>
            );
          })}
        </div>
      </div>
    </ScrollSection>
  );
}
