/**
 * Evolution Media editable content.
 * Edit content/evomedia.json to change headlines, copy, prices, testimonials, etc.
 */

import evomediaJson from "@/content/evomedia.json";

export const evomediaContent = evomediaJson as EvomediaContent;

export type EvomediaContent = {
  hero: {
    headline1: string;
    headline2: string;
    subheadline: string;
    ctaWork: string;
    ctaQuote: string;
  };
  whatWeDo: {
    label: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    services: Array<{
      icon: string;
      title: string;
      description: string;
      price: string;
      color: string;
    }>;
  };
  whyUs: {
    label: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  howItWorks: {
    label: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    steps: Array<{
      step: string;
      icon: string;
      title: string;
      description: string;
    }>;
  };
  portfolio: {
    label: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    sampleSitesLabel?: string;
    sampleSitesSubtitle?: string;
  };
  pricing: {
    label: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    customCta: string;
    customCtaButton: string;
    tiers: Array<{
      name: string;
      subtitle: string;
      price: string;
      period: string;
      amountCents?: number;
      features: string[];
      cta: string;
      highlighted: boolean;
      accent: string;
    }>;
  };
  faq: {
    label: string;
    title: string;
    titleHighlight: string;
    items: Array<{ question: string; answer: string }>;
  };
  newsletter: {
    label: string;
    title: string;
    subtitle: string;
    placeholder: string;
    button: string;
    success: string;
    error: string;
  };
  testimonials: {
    label: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    items: Array<{
      quote: string;
      author: string;
      role: string;
      avatar: string;
    }>;
  };
  contact: {
    label: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    promise: string;
    submitSuccess: string;
    submitMessage: string;
    websiteTypes: string[];
    budgetRanges: string[];
  };
  footer: {
    logoHighlight: string;
    logoRest: string;
    tagline: string;
    location: string;
    quickLinksTitle: string;
    followTitle: string;
    copyright: string;
    privacy: string;
    terms: string;
    trendpulseLabel: string;
    trendpulseUrl: string;
  };
  nav: {
    logoHighlight: string;
    logoRest: string;
    links: Array<{ href: string; label: string }>;
  };
};

