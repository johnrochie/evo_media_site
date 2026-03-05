import { Syne, DM_Sans } from "next/font/google";
import Link from "next/link";
import "../evomedia/evomedia.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${syne.variable} ${dmSans.variable} min-h-screen bg-[#0a0a0f] text-gray-100 font-[family-name:var(--font-dm-sans)]`}
    >
      <header className="border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <Link
            href="/evomedia"
            className="text-xl font-bold hover:opacity-80 transition-opacity"
          >
            <span className="evomedia-gradient-text">Evolution</span>
            <span className="text-white"> Media</span>
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">{children}</main>
    </div>
  );
}
