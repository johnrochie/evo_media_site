import type { Metadata } from "next";
import ObfuscatedEmail from "@/components/evomedia/ObfuscatedEmail";
import LoopnikSiteNav from "@/components/loopnik/LoopnikSiteNav";
import { site } from "@/lib/loopnik-site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for the Loopnik arcade game.",
};

const sections = [
  {
    title: "Data we collect directly",
    paragraphs: [
      "None. Loopnik has no accounts, no sign-in, and we operate no servers. Your best score and settings are stored only on your device.",
    ],
  },
  {
    title: "Advertising (Google AdMob)",
    paragraphs: [
      "The free version of Loopnik shows ads served by Google AdMob. To serve and measure ads, Google may collect device information including device identifiers (such as the advertising identifier), IP address, and ad interaction data. This data is collected and processed by Google, not by us.",
    ],
    links: [
      {
        href: "https://policies.google.com/privacy",
        label: "Google's Privacy Policy",
      },
      {
        href: "https://support.google.com/admob/answer/6128543",
        label: "how Google uses data from AdMob",
      },
    ],
  },
  {
    title: "In-app purchase",
    paragraphs: [
      'The "Remove Ads" purchase is processed entirely by Apple through your App Store account. We never see your payment details. After purchase, no ads are shown and no advertising data is collected by the app.',
    ],
  },
  {
    title: "Children",
    paragraphs: [
      "Loopnik is not directed at children. We do not knowingly collect personal information from children.",
    ],
  },
  {
    title: "Your choices",
    paragraphs: [
      'You can reset your device\'s advertising identifier or limit ad tracking in iOS Settings > Privacy & Security. Purchasing "Remove Ads" disables advertising entirely.',
    ],
  },
  {
    title: "Changes",
    paragraphs: [
      "If this policy changes, the updated version will be posted at this address.",
    ],
  },
] as const;

export default function LoopnikPrivacyPage() {
  return (
    <div className="min-h-screen">
      <LoopnikSiteNav />

      <main className="mx-auto max-w-3xl px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32">
        <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[var(--loopnik-muted)]">
          Last updated: June 2026
        </p>
        <p className="mt-6 leading-relaxed text-[var(--loopnik-muted)]">
          Loopnik is a free arcade game developed by {site.studio} (&quot;we&quot;,
          &quot;us&quot;). This policy explains what data is handled when you play
          Loopnik.
        </p>

        {sections.map((section) => (
          <section key={section.title} className="mt-10">
            <h2 className="font-display text-xl font-black tracking-tight text-white">
              {section.title}
            </h2>
            {section.paragraphs.map((p) => (
              <p
                key={p.slice(0, 40)}
                className="mt-3 leading-relaxed text-[var(--loopnik-muted)]"
              >
                {p}
              </p>
            ))}
            {"links" in section && section.links && (
              <p className="mt-3 leading-relaxed text-[var(--loopnik-muted)]">
                See{" "}
                {section.links.map((link, i) => (
                  <span key={link.href}>
                    {i > 0 &&
                      (i === section.links.length - 1 ? " and " : ", ")}
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--loopnik-accent)] underline-offset-2 hover:underline"
                    >
                      {link.label}
                    </a>
                  </span>
                ))}
                .
              </p>
            )}
          </section>
        ))}

        <section className="mt-10">
          <h2 className="font-display text-xl font-black tracking-tight text-white">
            Contact
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--loopnik-muted)]">
            Questions? Email{" "}
            <ObfuscatedEmail encoded={site.supportEmailEncoded} />.
          </p>
        </section>
      </main>
    </div>
  );
}
