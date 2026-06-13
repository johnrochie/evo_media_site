import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppPageShell } from "@/components/evomedia/AppPageShell";
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
      appName={`${app.name} — Privacy Policy`}
      backHref={`/apps/${app.id}`}
      backLabel={`Back to ${app.name} support`}
    >
      <p className="text-gray-400 text-sm mb-8">Last updated: {privacy.lastUpdated}</p>

      <p className="text-gray-300 leading-relaxed mb-8">{privacy.intro}</p>

      <div className="space-y-8">
        {privacy.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold text-white mb-4">{section.title}</h2>
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-gray-300 leading-relaxed mb-3"
              >
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
          </section>
        ))}

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Contact</h2>
          <p className="text-gray-300 leading-relaxed">
            Questions? Email{" "}
            <a
              href={`mailto:${app.supportEmail}`}
              className="text-[#00d4ff] hover:underline"
            >
              {app.supportEmail}
            </a>
            .
          </p>
        </section>
      </div>

      <p className="mt-10 text-gray-400">
        <Link href={`/apps/${app.id}`} className="text-[#00d4ff] hover:underline">
          Back to support
        </Link>
      </p>
    </AppPageShell>
  );
}
