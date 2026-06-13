"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IosAppCard } from "@/components/evomedia/IosAppCard";
import {
  iosAppsData,
  iosAppCategories,
  type IosAppCategory,
} from "@/lib/ios-apps-data";

export default function AppsPage() {
  const [activeCategory, setActiveCategory] = useState<IosAppCategory | "All">("All");

  const filteredApps =
    activeCategory === "All"
      ? iosAppsData
      : iosAppsData.filter((app) => app.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0a0a0f] evomedia-page">
      <header className="border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#00d4ff] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Evolution Media
          </Link>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 outline-none"
      >
        <div className="text-center mb-12">
          <p className="text-[#00d4ff] font-semibold tracking-widest uppercase text-sm mb-2">
            Side projects
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            iOS <span className="evomedia-gradient-text">apps</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hobby games and experiments we&apos;ve shipped to the App Store—built for fun,
            polished like client work.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
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
          {iosAppCategories.map((cat) => (
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

        <AnimatePresence mode="wait">
          {filteredApps.length > 0 ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-8 max-w-3xl mx-auto"
            >
              {filteredApps.map((app, i) => (
                <IosAppCard key={app.id} app={app} delay={i * 0.05} layout="horizontal" />
              ))}
            </motion.div>
          ) : (
            <p className="text-center text-gray-400 py-12">No apps in this category.</p>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
