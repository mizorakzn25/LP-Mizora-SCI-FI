/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'id' | 'en';

export interface EcosystemItem {
  id: string;
  abbrev: string;
  name: string;
  tagline: string;
  description: string;
  architecture: string[];
  modules: string[];
  status: 'operational' | 'optimized' | 'active';
}

export interface ServiceItem {
  id: string;
  iconName: string;
  name: string;
  tagline: string;
  benefit: string;
  scope: string[];
  features: string[];
  targetMetric: string;
  detail: ServiceDetail;
}

export interface ServiceDetail {
  title: string;
  about: string;
  suitableFor: string[];
  workItems: { title: string; description: string }[];
  deliverables: string[];
  benefits: { title: string; description: string }[];
  ctaLabel: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  price: string;
  focus: string;
  deliverables: string[];
  revisions: string;
  timeline: string;
  addons: string[];
  badge?: string;
}

export interface RatecardServiceSpecs {
  timeline: Record<Language, string>;
  pages: Record<Language, string>;
  techStack: string;
  revisions: string;
  responsive: boolean;
  seo: boolean;
}

export interface RatecardService {
  code: string;
  name: string;
  desc: Record<Language, string>;
  fullDesc: Record<Language, string>;
  price: Record<Language, string>;
  tags: {
    timeline: string;
    scope: string;
    tech: string;
  };
  specs: RatecardServiceSpecs;
  features: Record<Language, string[]>;
  deliverables: Record<Language, string[]>;
}

export interface RatecardCategory {
  id: string;
  name: string;
  prefix: string;
  color: string;
  label: Record<Language, string>;
  services: RatecardService[];
}

export interface RatecardCommitment {
  icon: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
}

export interface RatecardProjectEntry {
  name: Record<Language, string>;
  category: Record<Language, string>;
  timeline: Record<Language, string>;
  price: Record<Language, string>;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  coverImg: string;
  client: string;
  story: string;
  objective: string;
  process: string[];
  result: string;
  impact: string[];
  metadata: {
    year: string;
    role: string;
    tech: string;
  };
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TranslationSet {
  nav: {
    home: string;
    about: string;
    ecosystem: string;
    services: string;
    workflow: string;
    ratecard: string;
    portfolio: string;
    faq: string;
    contact: string;
    consultation: string;
  };
  hero: {
    tagline: string;
    accentWord: string;
    headlinePart1: string;
    headlinePart2: string;
    subheadline: string;
    ctaConsultText: string;
    ctaRatecardText: string;
    systemStatus: string;
    statusBadge: string;
    trustedBy: string;
    clientTicker: string;
    imageLabelTop: string;
    imageLabelBottom: string;
  };
  about: {
    sectionTitle: string;
    subtitle: string;
    storyParagraph1: string;
    storyParagraph2: string;
    philosophyTitle: string;
    philosophyText: string;
    founderName: string;
    founderRole: string;
    founderQuote: string;
  };
  ecosystem: {
    sectionTitle: string;
    subtitle: string;
    systems: EcosystemItem[];
    viewSpecs: string;
    hideSpecs: string;
  };
  services: {
    sectionTitle: string;
    subtitle: string;
    servicesList: ServiceItem[];
    viewDetail: string;
  };
  workflow: {
    sectionTitle: string;
    subtitle: string;
    steps: {
      id: string;
      title: string;
      duration: string;
      description: string;
      deliverables: string[];
    }[];
  };
  ratecard: {
    sectionTitle: string;
    subtitle: string;
    packages: PricingPackage[];
    getStarted: string;
    currency: string;
    addonsTitle: string;
    billingSubtitle: string;
    categories: RatecardCategory[];
    commitments: RatecardCommitment[];
    projectEntries: RatecardProjectEntry[];
    projectListTitle: string;
    projectListSubtitle: string;
    startingFromLabel: string;
    comingSoonLabel: string;
  };
  portfolio: {
    sectionTitle: string;
    subtitle: string;
    viewCaseStudy: string;
    closeCaseStudy: string;
    projects: CaseStudy[];
  };
  faq: {
    sectionTitle: string;
    subtitle: string;
    faqsList: FaqItem[];
  };
  contact: {
    sectionTitle: string;
    subtitle: string;
    formName: string;
    formEmail: string;
    formWhatsApp: string;
    formService: string;
    formMessage: string;
    formSubmit: string;
    formSubmitting: string;
    formSuccess: string;
    formPlaceholderName: string;
    formPlaceholderEmail: string;
    formPlaceholderWhatsApp: string;
    formPlaceholderMessage: string;
    contactInfoTitle: string;
    availability: string;
    availableStatus: string;
    responseGuarantee: string;
    location: string;
  };
}
