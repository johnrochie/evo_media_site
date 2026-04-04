import FAQJsonLd from "@/components/evomedia/FAQJsonLd";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQJsonLd />
      {children}
    </>
  );
}
