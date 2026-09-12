export const locationPages = [
  {
    slug: "web-design-brampton",
    path: "/web-design-brampton",
    city: "Brampton",
    region: "Ontario",
    name: "Web Design Brampton",
    eyebrow: "Serving Brampton businesses",
    title: "Web design for Brampton businesses that need a clearer path to customers.",
    summary:
      "MSPixelPulse plans, designs, builds, and improves responsive websites for businesses serving Brampton and the wider Greater Toronto Area.",
    intro:
      "A useful local-business website should make the offer, service area, proof, and next step easy to understand on a phone. MSPixelPulse combines content structure, responsive design, development, search foundations, and launch testing in one practical workflow.",
    seoTitle: "Web Design Brampton | Websites for Local Businesses | MSPixelPulse",
    metaDescription:
      "Web design for Brampton businesses: responsive websites, WordPress, React, e-commerce, redesigns, local SEO foundations, and practical launch support.",
    image: "/hero/mspixelpulse-web-design-collaboration.webp",
    imageAlt: "A business owner and web designer planning a responsive website on a laptop and phone",
    lastModified: "2026-09-12",
    needs: [
      "Explain services, service areas, and customer fit without vague marketing language",
      "Make calls, messages, quote requests, bookings, or purchases easy from a phone",
      "Show genuine work, accurate business details, clear policies, and useful answers",
      "Give each important service one focused page that search engines and people can understand",
    ],
    services: [
      {
        slug: "website-design",
        title: "Website design",
        body: "Clear page hierarchy, brand-aware visual direction, mobile layouts, and conversion paths based on real customer questions.",
      },
      {
        slug: "web-development",
        title: "Web development",
        body: "Responsive WordPress, React, and custom website implementation with accessible components, forms, and approved integrations.",
      },
      {
        slug: "ecommerce-development",
        title: "E-commerce development",
        body: "Product discovery, mobile shopping, cart and checkout planning, payments, and operational launch checks for online stores.",
      },
      {
        slug: "website-seo",
        title: "Website SEO",
        body: "Technical checks, local search foundations, content architecture, internal links, structured data, and measurement readiness.",
      },
    ],
    process: [
      { title: "Understand the business", body: "Confirm the customers, services, service area, proof, content, and most valuable next action." },
      { title: "Plan the page system", body: "Assign each search and customer intent to the right service, location, project, or guide page." },
      { title: "Design and build", body: "Create the agreed responsive experience with reusable components and truthful local context." },
      { title: "Verify the launch", body: "Check mobile layouts, forms, links, metadata, indexability, analytics readiness, and the production domain." },
    ],
    relatedProjects: [
      "canstem-education",
      "nexus-education-private-school",
      "unity-and-hope-home-care",
    ],
    faq: [
      {
        question: "Does MSPixelPulse serve businesses in Brampton?",
        answer: "Yes. MSPixelPulse provides website design, development, redesign, e-commerce, SEO foundations, and support for businesses serving Brampton and the wider GTA. The site does not claim a Brampton storefront or office address.",
      },
      {
        question: "What kind of Brampton business website can MSPixelPulse build?",
        answer: "Projects can include small-business websites, service websites, WordPress sites, React interfaces, online stores, education websites, redesigns, forms, and approved integrations. The statement of work confirms the exact pages and features.",
      },
      {
        question: "Can a new website guarantee better local rankings?",
        answer: "No. A website can improve relevance, clarity, indexability, speed, and conversion paths, but rankings also depend on competition, genuine reviews, local profiles, links, citations, authority, and ongoing business activity.",
      },
    ],
  },
];

export function getLocationPage(slug) {
  return locationPages.find((location) => location.slug === slug);
}
