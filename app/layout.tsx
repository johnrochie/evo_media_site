import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evolution Media",
  description: "Evolution Media site",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
