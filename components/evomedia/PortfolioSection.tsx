"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ScrollSection, ScrollItem } from "./ScrollSection";
import Link from "next/link";
import { evomediaContent } from "@/lib/evomedia-content";
import { portfolioProjects as projects } from "@/lib/portfolio-projects";

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
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/portfolio/${selected.id}`}
                    onClick={() => setSelectedId(null)}
                    className="inline-block px-6 py-3 rounded-lg font-semibold bg-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-colors"
                  >
                    View demo
                  </Link>
                  <a
                    href="#contact"
                    onClick={() => setSelectedId(null)}
                    className="inline-block px-6 py-3 rounded-lg font-semibold border border-white/20 text-gray-300 hover:border-[#00d4ff]/50 hover:text-[#00d4ff] transition-colors"
                  >
                    Start a similar project
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScrollSection>
  );
}
