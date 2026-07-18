import Link from "next/link";
import { site } from "@/lib/loopnik-site";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-sm font-black tracking-tight">
            <span className="text-white">LOOP</span>
            <span className="text-[var(--loopnik-accent)]">NIK</span>
          </p>
          <p className="mt-1 text-xs text-[var(--loopnik-muted)]">
            © {site.copyrightYear}{" "}
            <Link
              href={site.studioUrl}
              className="text-[var(--loopnik-muted)] underline-offset-2 hover:text-[var(--loopnik-accent)] hover:underline"
            >
              {site.studio}
            </Link>
          </p>
        </div>
        <nav className="flex items-center gap-6 text-sm text-[var(--loopnik-muted)]">
          <Link
            href="/loopnik/privacy"
            className="transition-colors hover:text-[var(--loopnik-accent)]"
          >
            Privacy Policy
          </Link>
          <a
            href="#support"
            className="transition-colors hover:text-[var(--loopnik-accent)]"
          >
            Support
          </a>
        </nav>
      </div>
    </footer>
  );
}
