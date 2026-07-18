import { site } from "@/lib/loopnik-site";

type StoreButtonsProps = {
  className?: string;
  size?: "sm" | "md";
};

export default function StoreButtons({
  className = "",
  size = "md",
}: StoreButtonsProps) {
  const pad =
    size === "sm"
      ? "px-4 py-2 text-sm"
      : "px-7 py-3.5 text-base sm:px-8";

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-3 ${className}`}
    >
      <a
        href={site.appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`glow-accent inline-flex rounded-full bg-[var(--loopnik-accent)] font-display font-black text-[var(--loopnik-bg)] transition-opacity hover:opacity-90 ${pad}`}
      >
        App Store
      </a>
      {site.playStoreUrl ? (
        <a
          href={site.playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex rounded-full border border-white/20 font-display font-bold text-white transition-colors hover:border-[var(--loopnik-accent)]/50 hover:bg-white/5 ${pad}`}
        >
          Google Play
        </a>
      ) : (
        <span
          className={`inline-flex rounded-full border border-white/15 font-display font-bold text-[var(--loopnik-muted)] ${pad}`}
          title="Coming soon on Google Play"
        >
          Play Store — coming soon
        </span>
      )}
    </div>
  );
}
