export const pricingModes = Object.freeze({
  FIXED: "fixed",
  STARTING: "starting",
  HOURLY: "hourly",
  CUSTOM: "custom",
});

export const pricingPlans = [
  {
    key: "one-page",
    group: "core",
    name: "One-Page Website",
    shortName: "One-Page",
    price: 1000,
    pricePrefix: "From",
    priceSuffix: "CAD",
    badge: "Focused launch",
    accent: "blue",
    bestFor: "A new offer, event, personal brand, or service that needs one clear conversion path.",
    summary: "A custom, responsive one-page website with up to six sections, a contact path, basic search setup, and launch support.",
    features: ["Custom one-page design", "Responsive layouts", "Inquiry form", "Basic SEO setup"],
    cta: "Choose One-Page",
  },
  {
    key: "starter",
    group: "core",
    name: "Starter Business Website",
    shortName: "Starter",
    price: 2000,
    pricePrefix: "From",
    priceSuffix: "CAD",
    badge: "Most popular",
    accent: "purple",
    featured: true,
    bestFor: "A small service business that needs a credible, easy-to-navigate website.",
    summary: "A practical multi-page website for your core services, business story, trust content, and customer inquiries.",
    features: ["Up to five core pages", "Custom visual direction", "Responsive layouts", "Launch handoff"],
    cta: "Choose Starter",
  },
  {
    key: "growth",
    group: "core",
    name: "Growth Website",
    shortName: "Growth",
    price: 3000,
    pricePrefix: "From",
    priceSuffix: "CAD",
    badge: "Expanded content",
    accent: "amber",
    bestFor: "A growing business with more services, content, locations, or customer journeys.",
    summary: "A larger website with room for detailed services, proof, content discovery, and focused calls to action.",
    features: ["Up to ten core pages", "Expanded service layouts", "Content-ready structure", "Two revision rounds"],
    cta: "Choose Growth",
  },
  {
    key: "redesign",
    group: "specialized",
    name: "Website Redesign",
    price: 400,
    pricePrefix: "From",
    priceSuffix: "CAD",
    badge: "Existing websites",
    accent: "rose",
    summary: "Focused redesign work starts at $400 CAD. Smaller approved updates may cost less; larger redesigns are quoted separately after the current site is reviewed.",
    cta: "Plan a Redesign",
  },
  {
    key: "moodle",
    group: "specialized",
    name: "Moodle LMS & Education Portal",
    price: 1000,
    pricePrefix: "From",
    priceSuffix: "CAD",
    badge: "Education systems",
    accent: "blue",
    summary: "Setup and development for Moodle-based learning environments and education portals. Final pricing depends on courses, roles, integrations, migration, hosting, and support needs.",
    boundary: "MSPixelPulse is an independent service provider and is not affiliated with or endorsed by Moodle HQ.",
    cta: "Discuss an LMS",
  },
  {
    key: "maintenance",
    group: "specialized",
    name: "Website Maintenance & Small Updates",
    price: 25,
    pricePrefix: "",
    priceSuffix: "CAD / hour",
    badge: "Approved work only",
    accent: "amber",
    summary: "Pay for actual approved maintenance or small update time at $25 CAD per hour. Larger development work is quoted separately.",
    boundary: "Hosting, domains, paid plugins, subscriptions, and other third-party costs are not included unless written into the quote.",
    cta: "Request an Update",
  },
  {
    key: "ecommerce",
    group: "specialized",
    name: "E-commerce Website",
    price: 4000,
    pricePrefix: "From",
    priceSuffix: "CAD",
    badge: "Online selling",
    accent: "purple",
    summary: "A responsive storefront with product discovery, cart and checkout setup for agreed providers, and a practical owner handoff.",
    boundary: "Product volume, paid apps, payment fees, shipping tools, and advanced store workflows are scoped separately.",
    cta: "Plan a Store",
  },
];

export const pricingIncluded = [
  "Phone, tablet, and desktop layouts",
  "Accessible, conversion-focused UI",
  "Basic technical SEO setup",
  "Build, launch, and handoff checks",
];

export const planBuilderServices = [
  {
    id: "new-website",
    label: "New website",
    shortLabel: "New website",
    description: "A new responsive business website planned from the ground up.",
    mode: pricingModes.FIXED,
    basePrice: 1000,
    servicePath: "/services/website-design",
  },
  {
    id: "redesign",
    label: "Website redesign",
    shortLabel: "Redesign",
    description: "Improve an existing website's design, structure, mobile experience, or conversion path.",
    mode: pricingModes.STARTING,
    basePrice: 400,
    servicePath: "/services/website-redesign",
  },
  {
    id: "ecommerce",
    label: "E-commerce website",
    shortLabel: "E-commerce",
    description: "A storefront with product browsing and checkout for agreed providers.",
    mode: pricingModes.STARTING,
    basePrice: 4000,
    servicePath: "/services/ecommerce-development",
  },
  {
    id: "wordpress",
    label: "WordPress website",
    shortLabel: "WordPress",
    description: "A content-managed website or a structured WordPress improvement project.",
    mode: pricingModes.STARTING,
    basePrice: 2000,
    servicePath: "/services/wordpress-development",
  },
  {
    id: "moodle",
    label: "Moodle LMS & education portal",
    shortLabel: "Moodle LMS",
    description: "An independently delivered Moodle-based learning environment or education portal.",
    mode: pricingModes.STARTING,
    basePrice: 1000,
    servicePath: "/services/moodle-lms-development",
  },
  {
    id: "maintenance",
    label: "Website maintenance & small updates",
    shortLabel: "Maintenance",
    description: "Approved routine maintenance, content changes, and small website updates.",
    mode: pricingModes.HOURLY,
    hourlyRate: 25,
    servicePath: "/services/website-maintenance",
  },
  {
    id: "custom-development",
    label: "Custom development",
    shortLabel: "Custom development",
    description: "A portal, application, integration, or workflow that needs discovery and custom scoping.",
    mode: pricingModes.CUSTOM,
    basePrice: 4000,
    servicePath: "/services/web-development",
  },
];

export const pageSizeOptions = [
  { id: "single", label: "1 page", description: "A focused landing or one-page website.", adjustment: 0 },
  { id: "small", label: "2–5 pages", description: "Core business, service, and contact pages.", adjustment: 1000 },
  { id: "medium", label: "6–10 pages", description: "More services, proof, or content pathways.", adjustment: 2000 },
  { id: "large", label: "11+ pages", description: "A larger content system requiring a closer scope review.", adjustment: 3500 },
  { id: "unsure", label: "Not sure yet", description: "Start with the service minimum and confirm scope together.", adjustment: 0 },
];

export const planAddons = [
  { id: "copy-support", label: "Copywriting support", description: "Help shaping clear page copy from approved business information.", price: 450 },
  { id: "content-migration", label: "Content migration", description: "Move and format agreed content from an existing website.", price: 350 },
  { id: "blog", label: "Blog or resource setup", description: "Reusable content listing and article structure.", price: 300 },
  { id: "booking", label: "Booking integration", description: "Connect an agreed third-party appointment tool.", price: 450 },
  { id: "advanced-forms", label: "Advanced forms", description: "Multi-step or conditional inquiry flows beyond a standard contact form.", price: 350 },
  { id: "analytics", label: "Analytics setup", description: "Consent-aware measurement setup for agreed website actions.", price: 150 },
  { id: "local-seo", label: "Expanded local SEO setup", description: "Additional local intent, metadata, and structured content work.", price: 300 },
];

export const maintenanceOptions = [
  { id: "none", label: "No maintenance selected", description: "Discuss support later if you need it." },
  { id: "hourly", label: "$25 CAD/hour as needed", description: "Actual approved maintenance and small-update time only." },
  { id: "plan", label: "Discuss an ongoing plan", description: "Scope recurring checks or support around the website." },
];

export const pricingFaqs = [
  {
    question: "Are these final website prices?",
    answer: "They are practical starting points or planning estimates. Your written quote confirms the deliverables, timeline, revisions, exclusions, and final price before work begins.",
  },
  {
    question: "What affects website pricing?",
    answer: "Page count, content readiness, custom design, product volume, integrations, user roles, migration, accessibility needs, and launch support can all affect the scope.",
  },
  {
    question: "Can a small redesign cost less than $400 CAD?",
    answer: "Yes. The $400 CAD redesign price is a starting point for focused redesign work. A smaller approved update may be billed at the maintenance rate, while a larger redesign is quoted separately.",
  },
  {
    question: "What does $25 CAD per hour maintenance include?",
    answer: "It covers actual approved time for routine maintenance and small updates. Larger development, hosting, domains, paid plugins, subscriptions, and other third-party charges are separate unless written into the quote.",
  },
  {
    question: "Is MSPixelPulse affiliated with Moodle?",
    answer: "No. MSPixelPulse is an independent service provider. Moodle is an open-source learning platform, and project scope depends on the required courses, roles, integrations, migration, hosting, and support.",
  },
];

export function mergePricingPlans(items = []) {
  const remoteByKey = new Map(
    (Array.isArray(items) ? items : []).filter((item) => item?.key).map((item) => [item.key, item]),
  );

  return pricingPlans.map((localPlan) => {
    const remotePlan = remoteByKey.get(localPlan.key);
    if (!remotePlan) return localPlan;
    return {
      ...localPlan,
      name: remotePlan.name || localPlan.name,
      shortName: remotePlan.shortName || localPlan.shortName,
      badge: remotePlan.badge || localPlan.badge,
      accent: remotePlan.accent || localPlan.accent,
      featured: typeof remotePlan.featured === "boolean" ? remotePlan.featured : localPlan.featured,
      bestFor: remotePlan.bestFor || localPlan.bestFor,
      summary: remotePlan.summary || localPlan.summary,
      features: Array.isArray(remotePlan.features) && remotePlan.features.length
        ? remotePlan.features.slice(0, 4)
        : localPlan.features,
      pricingNote: remotePlan.pricingNote || localPlan.pricingNote,
      boundary: localPlan.key === "ecommerce"
        ? remotePlan.boundary || localPlan.boundary
        : localPlan.boundary,
      cta: remotePlan.cta || localPlan.cta,
    };
  });
}
