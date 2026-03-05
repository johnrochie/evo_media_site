"use client";

import EvomediaNav from "@/components/evomedia/EvomediaNav";
import HeroSection from "@/components/evomedia/HeroSection";
import ServicesSection from "@/components/evomedia/ServicesSection";
import WhyUsSection from "@/components/evomedia/WhyUsSection";
import HowItWorksSection from "@/components/evomedia/HowItWorksSection";
import PortfolioSection from "@/components/evomedia/PortfolioSection";
import PricingSection from "@/components/evomedia/PricingSection";
import TestimonialsSection from "@/components/evomedia/TestimonialsSection";
import FAQSection from "@/components/evomedia/FAQSection";
import NewsletterSection from "@/components/evomedia/NewsletterSection";
import ContactSection from "@/components/evomedia/ContactSection";
import FooterSection from "@/components/evomedia/FooterSection";

export default function EvolutionMediaPage() {
  return (
    <>
      <EvomediaNav />
      <HeroSection />
      <ServicesSection />
      <WhyUsSection />
      <HowItWorksSection />
      <PortfolioSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
      <ContactSection />
      <FooterSection />
    </>
  );
}
