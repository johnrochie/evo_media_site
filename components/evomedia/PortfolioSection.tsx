"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ScrollSection, ScrollItem } from "./ScrollSection";
import { evomediaContent } from "@/lib/evomedia-content";

const projects = [
  {
    id: "nexus",
    title: "Nexus Fintech",
    clientType: "Fintech startup",
    description: "Modern dashboard and marketing site that built trust and sign-ups.",
    gradient: "from-cyan-500/20 to-blue-600/20",
    accent: "#00d4ff",
    brief: "A new fintech needed a professional web presence and a simple dashboard for early users.",
    solution: "We built a bold marketing site with clear value props and a clean, secure dashboard UI.",
    outcome: "40% increase in sign-up conversion and a product that scaled to Series A.",
  },
  {
    id: "luna",
    title: "Luna Cosmetics",
    clientType: "E-commerce / beauty",
    description: "Online store that reflects the brand and converts browsers into buyers.",
    gradient: "from-pink-500/20 to-rose-600/20",
    accent: "#ff00aa",
    brief: "Luna wanted to move from marketplace-only to their own store without losing their look.",
    solution: "Custom e-commerce with their visual identity, fast checkout, and inventory sync.",
    outcome: "Launch in 2 weeks; first-month sales beat their previous channel.",
  },
  {
    id: "apex",
    title: "Apex Fitness",
    clientType: "Local business / gym",
    description: "Local gym site that ranks and converts—book classes, see schedules, join online.",
    gradient: "from-amber-500/20 to-orange-600/20",
    accent: "#ffb800",
    brief: "Apex needed a site that showed class times, allowed bookings, and brought in local members.",
    solution: "Mobile-first site with booking, SEO for local terms, and simple member area.",
    outcome: "Higher local search visibility and 25% more class bookings in 3 months.",
  },
  {
    id: "verdant",
    title: "Verdant Eco",
    clientType: "Sustainability brand",
    description: "Landing and motion that communicates mission and drives newsletter sign-ups.",
    gradient: "from-emerald-500/20 to-teal-600/20",
    accent: "#00d4ff",
    brief: "Verdant needed a single strong page to explain their mission and grow their list.",
    solution: "Scroll-driven storytelling with subtle motion and a clear CTA to subscribe.",
    outcome: "Doubled newsletter sign-ups and stronger brand recognition.",
  },
  {
    id: "frame",
    title: "Frame Studio",
    clientType: "Creative / portfolio",
    description: "Portfolio and CMS so the team can update work without touching code.",
    gradient: "from-violet-500/20 to-purple-600/20",
    accent: "#ff00aa",
    brief: "A design studio wanted a portfolio that they could update themselves.",
    solution: "Custom design with a simple CMS: add projects, images, and case studies in minutes.",
    outcome: "Team updates the site weekly; no developer needed for content.",
  },
];

export default function PortfolioSection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = projects.find((p) => p.id === selectedId);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedId(null);
    }
    if (selectedId) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedId]);

  const p = evomediaContent.portfolio;

  return (
    <ScrollSection id="portfolio" className="py-20 md:py-28 bg-[#0d0d12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollItem className="text-center mb-16">
          <p className="text-[#00d4ff] font-semibold tracking-widest uppercase text-sm mb-2">
            {p.label}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {p.title} <span className="evomedia-gradient-text">{p.titleHighlight}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {p.subtitle}
          </p>
        </ScrollItem>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ScrollItem key={project.id} delay={i * 0.06}>
              <motion.button
                type="button"
                onClick={() => setSelectedId(project.id)}
                className="w-full text-left block group relative overflow-hidden rounded-2xl bg-[#12121a] border border-white/5 hover:border-[#00d4ff]/30 transition-colors aspect-[4/3]"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-60 group-hover:opacity-80 transition-opacity`}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-[#0a0a0f]/95 to-transparent">
                  <span
                    className="text-xs font-semibold tracking-wider uppercase mb-1"
                    style={{ color: project.accent }}
                  >
                    {project.clientType}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#00d4ff] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </motion.button>
            </ScrollItem>
          ))}
        </div>
      </div>

      {/* Case study modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl bg-[#12121a] border border-white/10 shadow-xl overflow-hidden"
            >
              <div
                className={`h-32 bg-gradient-to-br ${selected.gradient} opacity-80`}
              />
              <div className="p-6 md:p-8 -mt-4 relative">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
                <span
                  className="text-xs font-semibold tracking-wider uppercase"
                  style={{ color: selected.accent }}
                >
                  {selected.clientType}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1 mb-4">
                  {selected.title}
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-[#00d4ff] mb-1">Brief</h4>
                    <p className="text-gray-400">{selected.brief}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#00d4ff] mb-1">Solution</h4>
                    <p className="text-gray-400">{selected.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#00d4ff] mb-1">Outcome</h4>
                    <p className="text-gray-400">{selected.outcome}</p>
                  </div>
                </div>
                <a
                  href="#contact"
                  onClick={() => setSelectedId(null)}
                  className="mt-6 inline-block px-6 py-3 rounded-lg font-semibold bg-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-colors"
                >
                  Start a similar project
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScrollSection>
  );
}
