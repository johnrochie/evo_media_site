import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ad Mockups | Evolution Media",
  description: "Social media creative studio — evergreen ad mockups for Facebook and Instagram.",
};

export default function SocialMockupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
