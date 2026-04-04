"use client";

import EvomediaNav from "@/components/evomedia/EvomediaNav";
import HeroSection from "@/components/evomedia/HeroSection";
import ServicesSection from "@/components/evomedia/ServicesSection";
import PortfolioGridSection from "@/components/evomedia/PortfolioGridSection";
import WhyUsSection from "@/components/evomedia/WhyUsSection";
import HowItWorksSection from "@/components/evomedia/HowItWorksSection";
import PricingSection from "@/components/evomedia/PricingSection";
import TestimonialsSection from "@/components/evomedia/TestimonialsSection";
import FAQSection from "@/components/evomedia/FAQSection";
import NewsletterSection from "@/components/evomedia/NewsletterSection";
import ContactSection from "@/components/evomedia/ContactSection";
import FooterSection from "@/components/evomedia/FooterSection";

export default function HomePage() {
  return (
    <>
      <EvomediaNav />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <HeroSection />
        <ServicesSection />
        <PortfolioGridSection />
        <WhyUsSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <NewsletterSection />
        <ContactSection />
      </main>
      <FooterSection />
    </>
  );
}
