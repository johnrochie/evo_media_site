"use client";

import { useState, useRef, forwardRef } from "react";
import Link from "next/link";

const formats = {
  square: { label: "Instagram Square", w: 400, h: 400, ratio: "1:1", exportW: 1080, exportH: 1080 },
  story: { label: "Story / Reel", w: 300, h: 533, ratio: "9:16", exportW: 1080, exportH: 1920 },
  feed: { label: "Facebook Feed", w: 470, h: 352, ratio: "4:3", exportW: 1080, exportH: 810 },
} as const;

type FormatKey = keyof typeof formats;

const PostCanvas = forwardRef<HTMLDivElement, { format: FormatKey }>(function PostCanvas({ format }, ref) {
  const { w, h } = formats[format];
  const isStory = format === "story";
  const isSquare = format === "square";

  return (
    <div
      ref={ref}
      style={{
        width: w,
        height: h,
        background: "#050810",
        borderRadius: 12,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
        flexShrink: 0,
      }}
    >
      {/* Animated grid */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`grid-${format}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f72585" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${format})`} />
      </svg>

      {/* Glow orb top-right */}
      <div
        style={{
          position: "absolute",
          top: isStory ? -60 : -40,
          right: isStory ? -60 : -40,
          width: isStory ? 220 : 180,
          height: isStory ? 220 : 180,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(247,37,133,0.25) 0%, transparent 70%)",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />

      {/* Bottom glow */}
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: "20%",
          width: 200,
          height: 150,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(247,37,133,0.15) 0%, transparent 70%)",
          animation: "pulse 5s ease-in-out infinite reverse",
        }}
      />

      {/* Diagonal accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, transparent 60%, rgba(247,37,133,0.04) 100%)",
        }}
      />

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, #7b2ff7, #f72585, transparent)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: isStory ? "center" : "space-between",
          padding: isStory ? "40px 28px" : isSquare ? "28px" : "24px 28px",
          gap: isStory ? 20 : 0,
        }}
      >
        {/* Logo / Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            animation: "fadeUp 0.6s ease both",
          }}
        >
          <div
            style={{
              width: isStory ? 36 : 28,
              height: isStory ? 36 : 28,
              borderRadius: 6,
              background: "linear-gradient(180deg, #7b2ff7 0%, #f72585 50%, #ff6b35 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isStory ? 16 : 12,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-1px",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            E
          </div>
          <span
            style={{
              color: "#ffffff",
              fontSize: isStory ? 15 : 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Evolution Media
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            animation: "fadeUp 0.6s 0.15s ease both",
            opacity: 0,
          }}
        >
          <div
            style={{
              fontSize: isStory ? 38 : isSquare ? 30 : 26,
              fontWeight: 900,
              lineHeight: 1.05,
              color: "#ffffff",
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            Your Brand
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #7b2ff7, #f72585, #ff6b35)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Deserves Better.
            </span>
          </div>
          <div
            style={{
              width: isStory ? 60 : 40,
              height: 2,
              background: "linear-gradient(90deg, #f72585, transparent)",
              marginTop: 10,
              marginBottom: isStory ? 16 : 10,
            }}
          />
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: isStory ? 14 : isSquare ? 12 : 11,
              lineHeight: 1.6,
              maxWidth: isStory ? 260 : 280,
              margin: 0,
            }}
          >
            We design and build high-performance websites that make your business impossible to ignore.
          </p>
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isStory ? 8 : 6,
            animation: "fadeUp 0.6s 0.3s ease both",
            opacity: 0,
          }}
        >
          {["Custom Design", "Fast Delivery", "Built to Convert"].map((tag) => (
            <span
              key={tag}
              style={{
                background: "rgba(247,37,133,0.08)",
                border: "1px solid rgba(247,37,133,0.25)",
                color: "#f72585",
                borderRadius: 20,
                padding: isStory ? "5px 14px" : "4px 10px",
                fontSize: isStory ? 12 : 10,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            animation: "fadeUp 0.6s 0.45s ease both",
            opacity: 0,
          }}
        >
          <Link
            href="/#contact"
            style={{
              background: "linear-gradient(135deg, #7b2ff7, #f72585)",
              color: "#fff",
              fontWeight: 700,
              fontSize: isStory ? 14 : 12,
              padding: isStory ? "10px 20px" : "8px 16px",
              borderRadius: 6,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              boxShadow: "0 0 20px rgba(247,37,133,0.3)",
              textDecoration: "none",
            }}
          >
            Get a Free Quote
          </Link>
          <span
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: isStory ? 11 : 10,
              letterSpacing: "0.08em",
            }}
          >
            evomedia.site
          </span>
        </div>
      </div>
    </div>
  );
});

const CAPTION_TEXT = `Is your website doing its job? 💻

Your website is often the first impression a potential customer has of your brand — and first impressions are everything.

At Evolution Media, we build custom, high-performance websites designed to convert visitors into customers. No templates. No shortcuts. Just sharp design, fast delivery, and results that speak for themselves.

✦ Bespoke design tailored to your brand
✦ Optimised for speed and search engines
✦ Built to grow with your business

Ready to elevate your online presence?

👉 Get your free quote today at evomedia.site

#WebDesign #DigitalMarketing #SmallBusiness #WebDevelopment #BrandDesign #EvolutionMedia #BusinessGrowth #OnlinePresence`;

export default function SocialMockupsPage() {
  const [active, setActive] = useState<FormatKey>("square");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(CAPTION_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { exportW, exportH, w } = formats[active];
      const scale = exportW / w;
      const canvas = await html2canvas(cardRef.current, {
        scale,
        width: w,
        height: formats[active].h,
        backgroundColor: "#050810",
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      const outW = Math.round(w * scale);
      const outH = Math.round(formats[active].h * scale);
      const resized = document.createElement("canvas");
      resized.width = exportW;
      resized.height = exportH;
      const ctx = resized.getContext("2d");
      if (ctx) {
        ctx.drawImage(canvas, 0, 0, outW, outH, 0, 0, exportW, exportH);
        const dataUrl = resized.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `evolution-media-mockup-${active}.png`;
        link.href = dataUrl;
        link.click();
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #03050d; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #f7258544; border-radius: 2px; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #03050d 0%, #060c1a 100%)",
          color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
          padding: "32px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease both" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(247,37,133,0.08)",
              border: "1px solid rgba(247,37,133,0.2)",
              borderRadius: 20,
              padding: "4px 14px",
              fontSize: 11,
              color: "#f72585",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Social Media Creative Studio
          </div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 900,
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            Evolution Media — Ad Mockups
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>
            Evergreen creative for Meta platforms
          </p>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: "flex",
            gap: 6,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            padding: 4,
            animation: "fadeUp 0.5s 0.1s ease both",
            opacity: 0,
          }}
        >
          {(Object.entries(formats) as [FormatKey, (typeof formats)[FormatKey]][]).map(([key, val]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              style={{
                background: active === key ? "linear-gradient(135deg, #7b2ff722, #f7258522)" : "transparent",
                border: active === key ? "1px solid rgba(247,37,133,0.35)" : "1px solid transparent",
                color: active === key ? "#f72585" : "rgba(255,255,255,0.4)",
                borderRadius: 7,
                padding: "7px 14px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {val.label}
              <span
                style={{
                  marginLeft: 6,
                  opacity: 0.5,
                  fontSize: 10,
                }}
              >
                {val.ratio}
              </span>
            </button>
          ))}
        </div>

        {/* Post preview */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            animation: "fadeUp 0.5s 0.2s ease both",
            opacity: 0,
          }}
        >
          <PostCanvas ref={cardRef} key={active} format={active} />
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            style={{
              background: "linear-gradient(135deg, #7b2ff7, #f72585)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontSize: 13,
              fontWeight: 600,
              cursor: downloading ? "wait" : "pointer",
              opacity: downloading ? 0.8 : 1,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              boxShadow: "0 0 20px rgba(247,37,133,0.3)",
            }}
          >
            {downloading ? "Preparing…" : `Download ${formats[active].exportW}×${formats[active].exportH} PNG`}
          </button>
        </div>

        {/* Caption section */}
        <div
          style={{
            width: "100%",
            maxWidth: 500,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            overflow: "hidden",
            animation: "fadeUp 0.5s 0.3s ease both",
            opacity: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Post Caption
            </span>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                background: copied ? "rgba(247,37,133,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${copied ? "rgba(247,37,133,0.4)" : "rgba(255,255,255,0.1)"}`,
                color: copied ? "#f72585" : "rgba(255,255,255,0.6)",
                borderRadius: 6,
                padding: "5px 12px",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                letterSpacing: "0.05em",
              }}
            >
              {copied ? "✓ Copied!" : "Copy Caption"}
            </button>
          </div>
          <div
            style={{
              padding: "14px 16px",
              fontSize: 12,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.55)",
              whiteSpace: "pre-wrap",
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            {CAPTION_TEXT}
          </div>
        </div>

        {/* Notes */}
        <div
          style={{
            width: "100%",
            maxWidth: 500,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            animation: "fadeUp 0.5s 0.4s ease both",
            opacity: 0,
          }}
        >
          {[
            { label: "Post Type", value: "Evergreen / Always-on" },
            { label: "Platform", value: "Facebook + Instagram" },
            { label: "Objective", value: "Lead Generation" },
            { label: "CTA", value: "Free Quote → evomedia.site" },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: "10px 14px",
              }}
            >
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
                {label}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
