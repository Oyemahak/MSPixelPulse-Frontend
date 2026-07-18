export const pricingPlans = [
  {
    key: "one-page",
    category: "websites",
    name: "One-Page Website",
    shortName: "One-Page",
    price: 1000,
    priceSuffix: "CAD",
    badge: "Introductory offer",
    accent: "blue",
    featured: true,
    bestFor:
      "Small businesses, personal brands, service providers, events, or new ideas that need one focused page.",
    summary:
      "A complete professional one-page website that explains your offer clearly and gives visitors an easy way to contact you.",
    pricingNote:
      "This limited introductory offer is available for suitable project scopes. Final scope is confirmed before work begins.",
    features: [
      "Custom one-page website design",
      "Phone, tablet, and computer layouts",
      "Up to six clearly organized sections",
      "Contact or inquiry form",
      "Basic search-engine setup",
      "Social media links",
      "Google Maps integration when required",
      "Basic animations and interactions",
      "One revision round",
      "Website launch support",
      "Performance and accessibility checks",
    ],
    cta: "Start Your Website",
  },
  {
    key: "starter",
    category: "websites",
    name: "Starter Business Website",
    shortName: "Starter",
    price: 2000,
    priceSuffix: "CAD",
    badge: "Clear foundation",
    accent: "purple",
    bestFor:
      "Small service businesses that need a clear, professional online presence.",
    summary:
      "A practical multi-page website for your services, business details, and customer inquiries.",
    features: [
      "Up to five core pages",
      "Custom visual direction",
      "Phone, tablet, and computer layouts",
      "Contact or inquiry form",
      "Basic search-engine setup",
      "Social links and map when needed",
      "One revision round",
      "Launch support and handoff",
    ],
    cta: "Discuss the Starter Plan",
  },
  {
    key: "growth",
    category: "websites",
    name: "Growth Website",
    shortName: "Growth",
    price: 3000,
    priceSuffix: "CAD",
    badge: "More room to grow",
    accent: "amber",
    bestFor:
      "Growing businesses with more services, content, or customer journeys to explain.",
    summary:
      "A larger business website with more room for service details, trust-building content, and focused calls to action.",
    features: [
      "Up to ten core pages",
      "Expanded service layouts",
      "Blog or content-ready structure when needed",
      "Multiple contact paths",
      "Basic analytics readiness",
      "Two revision rounds",
      "Launch support and handoff",
    ],
    cta: "Discuss the Growth Plan",
  },
  {
    key: "ecommerce",
    category: "advanced",
    name: "E-commerce Website",
    shortName: "E-commerce",
    price: 4000,
    priceSuffix: "CAD",
    badge: "Online selling",
    accent: "rose",
    bestFor:
      "Small businesses ready to sell products or accept orders online.",
    summary:
      "An online store with clear product browsing and a straightforward path from product discovery to checkout.",
    features: [
      "Storefront and product-page design",
      "Category and navigation setup",
      "Cart and checkout setup",
      "Payment and shipping setup for agreed providers",
      "Phone, tablet, and computer layouts",
      "Basic product search setup",
      "Store-owner handoff",
    ],
    boundary:
      "Product entry volume, paid apps, payment fees, subscriptions, and advanced store features are reviewed and quoted separately.",
    cta: "Discuss Your Store",
  },
  {
    key: "custom-app",
    category: "advanced",
    name: "Custom Web Application",
    shortName: "Custom App",
    price: 4000,
    priceSuffix: "CAD",
    badge: "Custom workflow",
    accent: "purple",
    bestFor:
      "Businesses that need a client portal, dashboard, booking workflow, or another custom online tool.",
    summary:
      "A custom website experience planned around the way your customers or team need to work.",
    features: [
      "Discovery and workflow planning",
      "Custom interface design",
      "Agreed forms and user flows",
      "Agreed third-party connections",
      "Responsive and accessibility checks",
      "Launch support and handoff",
    ],
    boundary:
      "Final pricing depends on user roles, data, security, integrations, and feature complexity.",
    cta: "Discuss Your Application",
  },
  {
    key: "support",
    category: "support",
    name: "Monthly Website Support",
    shortName: "Support",
    price: 40,
    priceSuffix: "CAD / month",
    badge: "24-month option",
    accent: "blue",
    bestFor:
      "Clients who want dependable help with small updates after launch.",
    summary:
      "Ongoing support for routine website updates and common website issues.",
    pricingNote:
      "Available as a two-year support option at $40 CAD per month. The 24-month commitment is confirmed before the plan begins.",
    features: [
      "Basic website wording changes",
      "Small content updates",
      "Plugin updates",
      "Basic error fixes",
      "Routine website checks",
      "Minor layout or image replacements",
      "General maintenance support",
    ],
    boundary:
      "This plan does not include full redesigns, complex new features, large page additions, e-commerce expansion, custom application development, third-party subscription costs, or hosting and domain fees unless a separate agreement says otherwise. Larger updates will be reviewed and quoted separately before any work begins.",
    cta: "Discuss Website Support",
  },
];

export const pricingCategories = [
  {
    key: "websites",
    label: "Business websites",
    description: "Focused options for new and growing businesses",
  },
  {
    key: "advanced",
    label: "Stores & custom tools",
    description: "Online selling and custom business workflows",
  },
  {
    key: "support",
    label: "Ongoing support",
    description: "Small updates and routine website care",
  },
];

export const pricingIncluded = [
  "Phone, tablet, and computer layouts",
  "Clear visual direction",
  "Basic search setup",
  "Launch and handoff checks",
];
