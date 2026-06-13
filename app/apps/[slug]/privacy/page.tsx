import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppContentCard, AppPageShell } from "@/components/evomedia/AppPageShell";
import ObfuscatedEmail from "@/components/evomedia/ObfuscatedEmail";
import { getIosAppById, iosAppsData } from "@/lib/ios-apps-data";
import { getIosAppPageContent } from "@/lib/ios-app-pages";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return iosAppsData.map((app) => ({ slug: app.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = getIosAppById(slug);
  if (!app) return { title: "Privacy policy not found" };

  return {
    title: `${app.name} — Privacy Policy`,
    description: `Privacy policy for ${app.name}, a ${app.category.toLowerCase()} game for iPhone.`,
  };
}

export default async function AppPrivacyPage({ params }: Props) {
  const { slug } = await params;
  const app = getIosAppById(slug);
  const pageContent = getIosAppPageContent(slug);
  if (!app || !pageContent) notFound();

  const { privacy } = pageContent;

  return (
    <AppPageShell
      appName={`${app.name} Privacy Policy`}
      appNameHighlight="Privacy Policy"
      accent={app.accent}
      backHref={`/apps/${app.id}`}
      backLabel={`Back to ${app.name} support`}
    >
      <p className="text-gray-500 text-sm -mt-6 mb-2">Last updated: {privacy.lastUpdated}</p>

      <AppContentCard title="Overview" accent={app.accent}>
        <p>{privacy.intro}</p>
      </AppContentCard>

      {privacy.sections.map((section) => (
        <AppContentCard key={section.title} title={section.title}>
          {section.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraph.slice(0, 40)}>
              {paragraph}
              {section.links &&
                section.links.length > 0 &&
                paragraphIndex === section.paragraphs.length - 1 && (
                  <>
                    {" "}
                    See{" "}
                    {section.links.map((link, i) => (
                      <span key={link.href}>
                        {i > 0 && " and "}
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00d4ff] hover:underline"
                        >
                          {link.label}
                        </a>
                      </span>
                    ))}
                    .
                  </>
                )}
            </p>
          ))}
        </AppContentCard>
      ))}

      <AppContentCard title="Contact">
        <p>
          Questions? Email <ObfuscatedEmail encoded={app.supportEmailEncoded} />.
        </p>
      </AppContentCard>

      <p className="text-center pt-2">
        <Link
          href={`/apps/${app.id}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
        >
          Back to support
        </Link>
      </p>
    </AppPageShell>
  );
}
