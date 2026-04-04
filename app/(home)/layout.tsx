import FAQJsonLd from "@/components/evomedia/FAQJsonLd";
import "../evomedia/evomedia.css";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQJsonLd />
      {children}
    </>
  );
}
