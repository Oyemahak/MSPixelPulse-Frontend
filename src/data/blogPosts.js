const resourceLinks = {
  googleSeoStarter: {
    label: "Google SEO Starter Guide",
    url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
    note: "Official Google guidance for helping search engines understand website content.",
  },
  googleSearchDocs: {
    label: "Google Search Central Documentation",
    url: "https://developers.google.com/search/docs",
    note: "A practical reference hub for crawling, indexing, structured data, and search appearance.",
  },
  pageSpeed: {
    label: "PageSpeed Insights",
    url: "https://pagespeed.web.dev/",
    note: "Google's public tool for reviewing mobile and desktop performance opportunities.",
  },
  structuredData: {
    label: "Google Structured Data Guide",
    url: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
    note: "A starting point for JSON-LD and structured data planning.",
  },
  schemaWebsite: {
    label: "Schema.org WebSite",
    url: "https://schema.org/WebSite",
    note: "The Schema.org type for describing a website with structured data.",
  },
  wcag: {
    label: "W3C WCAG 2.2",
    url: "https://www.w3.org/TR/WCAG22/",
    note: "The accessibility standard used to evaluate perceivable, operable, understandable, and robust web content.",
  },
  wordpressDocs: {
    label: "WordPress Documentation",
    url: "https://wordpress.org/documentation/",
    note: "Official WordPress guidance for publishing, customization, security, and ongoing care.",
  },
  reactDocs: {
    label: "React Documentation",
    url: "https://react.dev/",
    note: "Official React documentation for component-based interface planning.",
  },
  viteDocs: {
    label: "Vite Documentation",
    url: "https://vite.dev/",
    note: "Official Vite documentation for modern frontend builds and deployment-ready tooling.",
  },
  googleBusiness: {
    label: "Google Business Profile",
    url: "https://business.google.com/us/business-profile/",
    note: "Google's official business profile resource for local visibility on Search and Maps.",
  },
};

export const blogPosts = [
  {
    slug: "small-business-website-cost-canada",
    title: "How Much Does a Small Business Website Cost in Canada?",
    category: "Planning",
    tags: ["Website cost", "Small business", "Canada"],
    author: "MSPixelPulse",
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-12",
    readingTime: "5 min read",
    excerpt:
      "A practical guide to what affects website pricing, from platform choice and page count to e-commerce, content, maintenance, and launch support.",
    seoTitle: "Small Business Website Cost in Canada | MSPixelPulse",
    metaDescription:
      "Learn what affects small business website cost in Canada, including WordPress, React, e-commerce, redesigns, hosting, and maintenance.",
    cover: "/blog/small-business-website-cost-canada.webp",
    coverAlt: "Editorial cover showing a laptop website estimate with pricing cards and Canadian small business planning cues",
    sections: [
      {
        heading: "There is no single fixed price",
        body:
          "A simple brochure website, a WordPress site, an online store, and a custom React application all require different planning, design, development, content, and testing work. A useful quote should explain scope, assumptions, launch support, and what happens after the website goes live.",
      },
      {
        heading: "What usually changes the budget",
        body:
          "The biggest cost drivers are page count, custom design depth, content writing, booking or payment features, product catalog setup, integrations, accessibility work, speed optimization, and maintenance expectations.",
      },
      {
        heading: "How to compare quotes",
        body:
          "Compare what is included, not just the headline price. Ask whether mobile design, basic SEO setup, analytics readiness, redirects, form testing, post-launch fixes, and maintenance are included.",
      },
    ],
    resources: [
      resourceLinks.googleSeoStarter,
      resourceLinks.pageSpeed,
      resourceLinks.wcag,
      resourceLinks.googleBusiness,
    ],
  },
  {
    slug: "wordpress-vs-react-business-website",
    title: "WordPress vs React: Which Is Better for Your Business Website?",
    category: "Technology",
    tags: ["WordPress", "React", "Website planning"],
    author: "MSPixelPulse",
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-12",
    readingTime: "6 min read",
    excerpt:
      "WordPress and React can both support a professional business website. The right choice depends on editing needs, integrations, performance goals, and long-term maintenance.",
    seoTitle: "WordPress vs React for Business Websites | MSPixelPulse",
    metaDescription:
      "Compare WordPress and React for small business websites, including editing, performance, custom features, maintenance, and growth needs.",
    cover: "/blog/wordpress-vs-react.webp",
    coverAlt: "Editorial cover comparing WordPress content editing and React custom interface planning",
    sections: [
      {
        heading: "When WordPress makes sense",
        body:
          "WordPress is often a good fit when the business needs familiar content editing, blog publishing, service pages, and proven plugin support. It still needs careful setup, security updates, performance review, and plugin restraint.",
      },
      {
        heading: "When React makes sense",
        body:
          "React is useful when the website needs a custom interface, app-like features, unusual workflows, or tighter control over the frontend experience. It usually requires a more technical maintenance path.",
      },
      {
        heading: "The practical answer",
        body:
          "Choose the platform around the job. A salon, dental clinic, or school may prefer WordPress editing. A custom portal, dashboard, or interactive preview may be better as a React application.",
      },
    ],
    resources: [
      resourceLinks.wordpressDocs,
      resourceLinks.reactDocs,
      resourceLinks.viteDocs,
      resourceLinks.pageSpeed,
    ],
  },
  {
    slug: "small-business-website-features",
    title: "10 Features Every Small Business Website Should Have",
    category: "Growth",
    tags: ["Small business", "UX", "Lead generation"],
    author: "MSPixelPulse",
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-12",
    readingTime: "5 min read",
    excerpt:
      "A strong small business website needs clear services, contact paths, mobile speed, trust signals, and content that answers real customer questions.",
    seoTitle: "Small Business Website Features | MSPixelPulse",
    metaDescription:
      "Review essential small business website features including clear services, mobile design, trust signals, forms, SEO basics, and maintenance.",
    cover: "/blog/small-business-website-features.webp",
    coverAlt: "Editorial cover with modular website feature cards for trust, contact, and mobile UX",
    sections: [
      {
        heading: "Clarity beats cleverness",
        body:
          "Visitors should quickly understand what you offer, who you help, where you serve, and how to contact you. Clear service pages and strong calls to action reduce friction.",
      },
      {
        heading: "Mobile experience matters",
        body:
          "Many local-business searches happen on phones. Buttons should be easy to tap, forms should be readable, images should load quickly, and phone or WhatsApp actions should not cover the content.",
      },
      {
        heading: "Trust needs evidence",
        body:
          "Use real work, accurate service details, transparent process steps, privacy-aware forms, and practical FAQs. Avoid fake testimonials or unsupported claims.",
      },
    ],
    resources: [
      resourceLinks.googleSeoStarter,
      resourceLinks.structuredData,
      resourceLinks.pageSpeed,
      resourceLinks.wcag,
    ],
  },
  {
    slug: "website-redesign-checklist-small-business",
    title: "Website Redesign Checklist for Small Businesses",
    category: "Redesign",
    tags: ["Website redesign", "SEO", "Migration"],
    author: "MSPixelPulse",
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-12",
    readingTime: "6 min read",
    excerpt:
      "Before redesigning your website, audit goals, content, search visibility, forms, redirects, mobile usability, analytics, and launch risk.",
    seoTitle: "Website Redesign Checklist for Small Businesses | MSPixelPulse",
    metaDescription:
      "Use this small business website redesign checklist to plan content, SEO, forms, redirects, mobile UX, analytics, and launch QA.",
    cover: "/blog/website-redesign-checklist.webp",
    coverAlt: "Editorial cover showing a website redesign checklist with before and after layout panels",
    sections: [
      {
        heading: "Start with the business goal",
        body:
          "A redesign should improve a specific outcome: clearer services, more qualified inquiries, better mobile usability, faster pages, or easier content updates.",
      },
      {
        heading: "Protect what already works",
        body:
          "Review current pages, rankings, forms, analytics, and customer paths before changing URLs or removing content. Plan redirects when slugs change.",
      },
      {
        heading: "Test before launch",
        body:
          "Check forms, phone links, navigation, project examples, mobile layouts, accessibility basics, image loading, page titles, meta descriptions, and 404 behavior.",
      },
    ],
    resources: [
      resourceLinks.googleSearchDocs,
      resourceLinks.pageSpeed,
      resourceLinks.structuredData,
      resourceLinks.wcag,
    ],
  },
  {
    slug: "professional-website-builds-local-trust",
    title: "How a Professional Website Builds Trust for Local Businesses",
    category: "Trust",
    tags: ["Local business", "Trust", "Conversion"],
    author: "MSPixelPulse",
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-12",
    readingTime: "4 min read",
    excerpt:
      "Local customers look for signs that a business is active, organized, and easy to contact. Your website can support that trust before the first conversation.",
    seoTitle: "How Websites Build Local Business Trust | MSPixelPulse",
    metaDescription:
      "Learn how professional website design supports local business trust with clear services, contact paths, proof, accessibility, and mobile usability.",
    cover: "/blog/website-trust-local-business.webp",
    coverAlt: "Editorial cover showing local business website trust signals, contact paths, and security cues",
    sections: [
      {
        heading: "Trust starts with obvious basics",
        body:
          "A visitor should see what the business does, where it serves, how to contact it, and what the next step is. Missing basics can make even a good business feel hard to evaluate.",
      },
      {
        heading: "Design should support confidence",
        body:
          "Readable typography, consistent spacing, fast loading, clear forms, accessible contrast, and organized service pages all help visitors feel the business is cared for.",
      },
      {
        heading: "Honesty is part of trust",
        body:
          "Use real project examples and accurate descriptions. If something is a concept, label it clearly. Honest presentation is stronger than inflated claims.",
      },
    ],
    resources: [
      resourceLinks.googleBusiness,
      resourceLinks.googleSeoStarter,
      resourceLinks.schemaWebsite,
      resourceLinks.wcag,
    ],
  },
  {
    slug: "best-website-features-salons-dental-service-businesses",
    title: "Best Website Features for Salons, Dental Clinics, and Service Businesses",
    category: "Industry UX",
    tags: ["Service businesses", "Bookings", "Local SEO"],
    author: "MSPixelPulse",
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-12",
    readingTime: "5 min read",
    excerpt:
      "Service businesses need websites that make services, booking paths, trust details, and local contact options easy to find on any device.",
    seoTitle: "Website Features for Salons, Dental Clinics, and Service Businesses | MSPixelPulse",
    metaDescription:
      "Review practical website features for salons, dental clinics, and local service businesses, including booking paths, service pages, FAQs, and trust signals.",
    cover: "/blog/industry-website-features.webp",
    coverAlt: "Editorial cover showing booking, service, and contact website modules for salons, dental clinics, and service businesses",
    sections: [
      {
        heading: "Make services easy to evaluate",
        body:
          "Visitors should be able to scan service categories, common questions, pricing context when appropriate, location details, and next steps without digging through long pages.",
      },
      {
        heading: "Put booking and contact paths close to intent",
        body:
          "A useful service website repeats the right call to action near service descriptions, mobile headers, FAQs, and project examples while keeping the experience calm and uncluttered.",
      },
      {
        heading: "Build trust without exaggeration",
        body:
          "Use accurate service details, professional imagery, privacy-aware forms, accessible design, and clear labels. Avoid invented testimonials or claims that cannot be supported.",
      },
    ],
    resources: [
      resourceLinks.googleBusiness,
      resourceLinks.structuredData,
      resourceLinks.pageSpeed,
      resourceLinks.wcag,
    ],
  },
  {
    slug: "mobile-friendly-website-design-local-businesses",
    title: "Why Mobile-Friendly Website Design Matters for Local Businesses",
    category: "Mobile UX",
    tags: ["Mobile design", "Local business", "Responsive websites"],
    author: "MSPixelPulse",
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-12",
    readingTime: "4 min read",
    excerpt:
      "Local customers often compare businesses from a phone. A mobile-friendly website keeps services, trust signals, and contact actions clear when attention is short.",
    seoTitle: "Mobile-Friendly Website Design for Local Businesses | MSPixelPulse",
    metaDescription:
      "Learn why mobile-friendly website design matters for local businesses, including responsive layouts, readable content, forms, buttons, and speed.",
    cover: "/blog/mobile-friendly-web-design.webp",
    coverAlt: "Editorial cover showing mobile-first website screens and responsive breakpoint cards",
    sections: [
      {
        heading: "Mobile is often the first impression",
        body:
          "People searching for a nearby service may only spend a few seconds deciding whether a business looks credible. Clear mobile navigation, readable text, and obvious contact buttons help reduce hesitation.",
      },
      {
        heading: "Responsive design is more than shrinking content",
        body:
          "A strong mobile layout changes content order, tap targets, image crops, form spacing, and sticky actions so the page feels intentionally designed for smaller screens.",
      },
      {
        heading: "Speed and clarity work together",
        body:
          "Optimized images, focused sections, and concise copy help mobile pages load and scan faster. That matters for both customer experience and search visibility.",
      },
    ],
    resources: [
      resourceLinks.pageSpeed,
      resourceLinks.googleSeoStarter,
      resourceLinks.wcag,
    ],
  },
  {
    slug: "website-maintenance-small-businesses",
    title: "Website Maintenance: What Small Businesses Need to Know",
    category: "Maintenance",
    tags: ["Website maintenance", "Security", "Updates"],
    author: "MSPixelPulse",
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-12",
    readingTime: "5 min read",
    excerpt:
      "A website needs steady care after launch: updates, backups, form checks, content edits, analytics review, and practical security basics.",
    seoTitle: "Website Maintenance for Small Businesses | MSPixelPulse",
    metaDescription:
      "Learn what website maintenance includes for small businesses, from updates and backups to content changes, forms, analytics, and security basics.",
    cover: "/blog/website-maintenance-guide.webp",
    coverAlt: "Editorial cover showing a website maintenance dashboard with backup, update, and monitoring indicators",
    sections: [
      {
        heading: "Launch is not the finish line",
        body:
          "After a website goes live, forms, links, plugins, images, and content still need attention. Small issues can quietly hurt trust if they are not reviewed.",
      },
      {
        heading: "Maintenance should be practical",
        body:
          "Useful maintenance covers backups, updates, basic security checks, page-speed review, content updates, SEO metadata checks, and testing important contact paths.",
      },
      {
        heading: "Plan ownership early",
        body:
          "Decide who handles edits, technical updates, emergency fixes, and future improvements. Clear ownership keeps the site from becoming stale or risky.",
      },
    ],
    resources: [
      resourceLinks.pageSpeed,
      resourceLinks.googleSearchDocs,
      resourceLinks.wordpressDocs,
      resourceLinks.wcag,
    ],
  },
];

export const publishedBlogPosts = blogPosts;
