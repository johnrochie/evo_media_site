"use client";

import { ScrollSection, ScrollItem } from "./ScrollSection";
import { evomediaContent } from "@/lib/evomedia-content";
import InterestForm from "@/components/intake/InterestForm";

const c = evomediaContent.contact;

export default function ContactSection() {
  return (
    <ScrollSection id="contact" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <ScrollItem className="text-center mb-12">
            <p className="text-[#00d4ff] font-semibold tracking-widest uppercase text-sm mb-2">
              {c.label}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {c.title} <span className="evomedia-gradient-text">{c.titleHighlight}</span>
            </h2>
            <p className="text-gray-400 mb-2">
              {c.subtitle}
            </p>
            <p className="text-[#00d4ff] text-sm font-medium">
              {c.promise}
            </p>
          </ScrollItem>

          <ScrollItem>
            <InterestForm />
          </ScrollItem>

          {process.env.NEXT_PUBLIC_BOOKING_URL ? (
            <ScrollItem className="mt-10 text-center">
              <p className="text-gray-500 text-sm mb-3">Prefer to talk first?</p>
              <a
                href={process.env.NEXT_PUBLIC_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-colors"
              >
                Book an intro call
              </a>
            </ScrollItem>
          ) : null}
        </div>
      </div>
    </ScrollSection>
  );
}
