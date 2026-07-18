import Nav from "@/components/loopnik/Nav";
import Hero from "@/components/loopnik/Hero";
import HowToPlay from "@/components/loopnik/HowToPlay";
import Features from "@/components/loopnik/Features";
import Download from "@/components/loopnik/Download";
import Support from "@/components/loopnik/Support";
import Footer from "@/components/loopnik/Footer";

export default function LoopnikPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="outline-none">
        <Hero />
        <HowToPlay />
        <Features />
        <Download />
        <Support />
      </main>
      <Footer />
    </>
  );
}
