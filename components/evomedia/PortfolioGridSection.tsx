"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ScrollSection, ScrollItem } from "./ScrollSection";
import {
  portfolioData,
  portfolioCategories,
  type PortfolioProject,
  type PortfolioCategory,
} from "@/lib/portfolio-data";

function PortfolioCard({
  project,
  delay,
}: {
  project: PortfolioProject;
  delay: number;
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <ScrollItem delay={delay}>
      <motion.a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block group relative overflow-hidden rounded-2xl bg-[#12121a] border border-white/5 hover:border-[#00d4ff]/30 transition-colors aspect-[4/3]"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="absolute inset-0">
          {!imageError ? (
            <>
              {!imageLoaded && (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 animate-pulse`}
                  aria-hidden
                />
              )}
              <Image
                src={project.image}
                alt={`${project.name} – ${project.category}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40`}
              aria-hidden
            />
          )}
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent">
          <span
            className="text-xs font-semibold tracking-wider uppercase mb-2"
            style={{ color: project.accent }}
          >
            {project.category}
          </span>
          <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-[#00d4ff] transition-colors flex items-center gap-2 mb-3">
            {project.name}
            <ExternalLink className="w-4 h-4 opacity-70 shrink-0" aria-hidden />
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/5"
              >
                {feature}
              </span>
            ))}
          </div>
          {project.description && (
            <p className="text-[11px] text-gray-500 mt-2 line-clamp-1 leading-snug">
              {project.description}
            </p>
          )}
        </div>
      </motion.a>
    </ScrollItem>
  );
}

export default function PortfolioGridSection() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory | "All">("All");

  const filteredProjects =
    activeCategory === "All"
      ? portfolioData
      : portfolioData.filter((p) => p.category === activeCategory);

  return (
    <ScrollSection id="portfolio" className="py-20 md:py-28 bg-[#0d0d12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollItem className="text-center mb-12">
          <p className="text-[#00d4ff] font-semibold tracking-widest uppercase text-sm mb-2">
            Our work
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Delivered <span className="evomedia-gradient-text">projects</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Real sites we&apos;ve built for clients across industries.
          </p>
        </ScrollItem>

        <ScrollItem className="mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("All")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === "All"
                  ? "bg-[#00d4ff] text-[#0a0a0f]"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
              }`}
            >
              All
            </button>
            {portfolioCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-[#00d4ff] text-[#0a0a0f]"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollItem>

        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredProjects.map((project, i) => (
                <PortfolioCard key={project.id} project={project} delay={i * 0.05} />
              ))}
            </motion.div>
          ) : (
            <ScrollItem>
              <p className="text-center text-gray-400 py-12">No projects in this category.</p>
            </ScrollItem>
          )}
        </AnimatePresence>

        <ScrollItem className="text-center mt-12">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-colors"
          >
            View All Projects
            <ExternalLink className="w-4 h-4" aria-hidden />
          </Link>
        </ScrollItem>
      </div>
    </ScrollSection>
  );
}
