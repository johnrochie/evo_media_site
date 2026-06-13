"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Apple, ExternalLink } from "lucide-react";
import type { IosApp } from "@/lib/ios-apps-data";

function PhoneMockup({
  app,
  imageError,
  imageLoaded,
  onLoad,
  onError,
}: {
  app: IosApp;
  imageError: boolean;
  imageLoaded: boolean;
  onLoad: () => void;
  onError: () => void;
}) {
  return (
    <div className="relative mx-auto w-[200px] sm:w-[220px] shrink-0">
      {/* Phone frame */}
      <div className="relative rounded-[2.5rem] border-[3px] border-white/15 bg-[#1a1a24] p-2 shadow-2xl shadow-black/50">
        {/* Dynamic island */}
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-5 rounded-full bg-black z-10"
          aria-hidden
        />
        {/* Screen */}
        <div className="relative aspect-[9/19.5] rounded-[2rem] overflow-hidden bg-[#0a0a0f]">
          {!imageError ? (
            <>
              {!imageLoaded && (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${app.gradient} animate-pulse`}
                  aria-hidden
                />
              )}
              <Image
                src={app.screenshot}
                alt={`${app.name} screenshot`}
                fill
                sizes="220px"
                className={`object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={onLoad}
                onError={onError}
              />
            </>
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${app.gradient} flex flex-col items-center justify-center p-6`}
            >
              <AppIconFallback app={app} size="lg" />
              <p className="text-white/60 text-xs text-center mt-4 font-medium">
                Add screenshot to
                <br />
                <code className="text-[10px] text-white/40">{app.screenshot}</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AppIconFallback({
  app,
  size = "sm",
}: {
  app: IosApp;
  size?: "sm" | "lg";
}) {
  const dims = size === "lg" ? "w-16 h-16 rounded-2xl" : "w-12 h-12 rounded-xl";
  const textSize = size === "lg" ? "text-2xl" : "text-lg";

  return (
    <div
      className={`${dims} flex items-center justify-center font-bold text-white shadow-lg`}
      style={{
        background: `linear-gradient(135deg, ${app.accent}40, ${app.accent}80)`,
      }}
      aria-hidden
    >
      <span className={textSize}>{app.name.charAt(0)}</span>
    </div>
  );
}

export function IosAppCard({
  app,
  delay = 0,
  layout = "horizontal",
}: {
  app: IosApp;
  delay?: number;
  layout?: "horizontal" | "vertical";
}) {
  const [screenshotError, setScreenshotError] = useState(false);
  const [screenshotLoaded, setScreenshotLoaded] = useState(false);
  const [iconError, setIconError] = useState(false);

  const hasAppStoreLink = Boolean(app.appStoreUrl);

  const cardContent = (
    <div
      className={`group h-full rounded-2xl bg-[#12121a] border border-white/5 hover:border-[#00d4ff]/30 transition-colors overflow-hidden ${
        layout === "horizontal"
          ? "flex flex-col sm:flex-row gap-6 sm:gap-8 p-6 md:p-8"
          : "flex flex-col p-6"
      }`}
    >
      <PhoneMockup
        app={app}
        imageError={screenshotError}
        imageLoaded={screenshotLoaded}
        onLoad={() => setScreenshotLoaded(true)}
        onError={() => setScreenshotError(true)}
      />

      <div className={`flex flex-col flex-1 ${layout === "vertical" ? "mt-6" : "justify-center"}`}>
        <div className="flex items-start gap-4 mb-4">
          {!iconError ? (
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md">
              <Image
                src={app.icon}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
                onError={() => setIconError(true)}
              />
            </div>
          ) : (
            <AppIconFallback app={app} />
          )}
          <div className="min-w-0">
            <span
              className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: app.accent }}
            >
              {app.category}
              {app.year ? ` · ${app.year}` : ""}
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#00d4ff] transition-colors truncate">
              {app.name}
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">{app.tagline}</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 leading-relaxed mb-4">{app.description}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {app.features.map((feature) => (
            <span
              key={feature}
              className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/5"
            >
              {feature}
            </span>
          ))}
        </div>

        {hasAppStoreLink ? (
          <a
            href={app.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start px-4 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Apple className="w-4 h-4" aria-hidden />
            App Store
            <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden />
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 self-start px-4 py-2.5 rounded-xl bg-white/5 text-gray-500 text-sm font-medium border border-white/5">
            <Apple className="w-4 h-4" aria-hidden />
            Coming to App Store
          </span>
        )}
      </div>
    </div>
  );

  if (hasAppStoreLink) {
    return (
      <motion.a
        href={app.appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.4 }}
        whileHover={{ scale: 1.01 }}
      >
        {cardContent}
      </motion.a>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
    >
      {cardContent}
    </motion.div>
  );
}
