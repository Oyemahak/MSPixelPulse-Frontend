export const faqGroups = [
  {
    category: "Website Development",
    items: [
      {
        question: "What does MSPixelPulse do?",
        answer:
          "MSPixelPulse is a Toronto web development and UX/UI agency that plans, designs, builds, improves, and supports websites, WordPress sites, React interfaces, Moodle LMS environments, school websites, and selected custom web workflows.",
      },
      {
        question: "Where does MSPixelPulse provide services?",
        answer:
          "MSPixelPulse serves businesses and organizations in Toronto, Brampton, Mississauga, the Greater Toronto Area, Ontario, and remote clients across Canada.",
      },
      {
        question: "What technologies does MSPixelPulse use?",
        answer:
          "Technology is chosen for the project need. Public work includes React, Vite, React Router, WordPress, Moodle, HTML, CSS, JavaScript, APIs, and common hosting and deployment workflows.",
      },
    ],
  },
  {
    category: "WordPress",
    items: [
      {
        question: "Does MSPixelPulse build WordPress websites?",
        answer:
          "Yes. MSPixelPulse builds and improves responsive WordPress websites, including page templates, content structure, forms, basic search setup, launch checks, and maintenance planning.",
      },
      {
        question: "Can MSPixelPulse work on an existing WordPress website?",
        answer:
          "Yes. Existing-site work can focus on content, responsive layout, usability, accessibility, performance basics, plugin review, forms, search setup, or a carefully planned redesign.",
      },
    ],
  },
  {
    category: "React",
    items: [
      {
        question: "Does MSPixelPulse build React websites?",
        answer:
          "Yes. MSPixelPulse develops React websites and interfaces when a project benefits from reusable components, custom interactions, structured routes, portals, filters, forms, or approved API connections.",
      },
      {
        question: "Is React better than WordPress for every website?",
        answer:
          "No. React can suit custom interfaces and application-like workflows, while WordPress can suit teams that need a familiar publishing system. The choice depends on content editing, features, performance, maintenance, and ownership needs.",
      },
    ],
  },
  {
    category: "UX/UI",
    items: [
      {
        question: "Does MSPixelPulse provide UX/UI design?",
        answer:
          "Yes. UX/UI work can include information architecture, responsive layouts, task flows, reusable components, form and navigation review, accessibility, interaction states, and implementation guidance.",
      },
      {
        question: "Can MSPixelPulse review a website without rebuilding it?",
        answer:
          "Yes. A focused review can identify content hierarchy, navigation, mobile, accessibility, performance, form, and conversion issues before deciding whether targeted improvements or a larger redesign are needed.",
      },
    ],
  },
  {
    category: "Pricing",
    items: [
      {
        question: "How much does website development cost?",
        answer:
          "MSPixelPulse publishes starting prices in Canadian dollars. Final pricing depends on page count, content, custom features, e-commerce, integrations, third-party services, and launch support, and is confirmed in a project quote.",
      },
      {
        question: "Are hosting, domains, paid plugins, and subscriptions included?",
        answer:
          "They are included only when the written agreement says so. Third-party fees and ongoing subscriptions are identified separately so the project cost remains clear.",
      },
    ],
  },
  {
    category: "Process",
    items: [
      {
        question: "How long does a website project take?",
        answer:
          "Timing depends on scope, content readiness, feedback, integrations, and launch requirements. MSPixelPulse confirms the working timeline after reviewing the project rather than promising one schedule for every website.",
      },
      {
        question: "What happens before development begins?",
        answer:
          "The first step is to clarify the audience, services, content, required pages, customer actions, technical constraints, and launch responsibilities. The agreed scope then guides design, development, testing, and handoff.",
      },
    ],
  },
  {
    category: "Maintenance",
    items: [
      {
        question: "Does MSPixelPulse provide website maintenance and support?",
        answer:
          "Yes. Support can include agreed content updates, small layout or image changes, form and link checks, routine website review, WordPress updates, and basic accessibility, performance, or search cleanup.",
      },
      {
        question: "Does maintenance include a full redesign or large new feature?",
        answer:
          "Not automatically. Redesigns, complex features, large page additions, e-commerce expansion, and custom application work are scoped separately before work begins.",
      },
    ],
  },
  {
    category: "LMS/Moodle",
    items: [
      {
        question: "Does MSPixelPulse develop Moodle LMS websites?",
        answer:
          "Yes. MSPixelPulse supports Moodle setup, customization, responsive UI, courses, roles, plugins, upgrades, hosting planning, administration, and ongoing technical support for agreed education and training projects.",
      },
      {
        question: "Can MSPixelPulse improve an existing Moodle environment?",
        answer:
          "Yes. Existing Moodle work can review learner and administrator usability, course structure, roles, plugins, integrations, performance, backups, upgrades, and operational workflows.",
      },
    ],
  },
  {
    category: "School Websites",
    items: [
      {
        question: "Does MSPixelPulse build school websites?",
        answer:
          "Yes. MSPixelPulse builds and supports public school websites, program and course discovery pages, admissions-focused journeys, reusable content routes, and separate Moodle learning environments.",
      },
      {
        question: "Can a school website include a large course catalogue?",
        answer:
          "Yes. A course catalogue can use structured data, reusable routes, summaries, search, and filtering. The authoritative data source and update process are confirmed before implementation.",
      },
    ],
  },
  {
    category: "Small Business Websites",
    items: [
      {
        question: "Does MSPixelPulse build websites for small businesses?",
        answer:
          "Yes. Small-business website services include new websites, redesigns, WordPress or React development, responsive service pages, inquiry forms, search-ready structure, and ongoing support.",
      },
      {
        question: "What should a small-business website include?",
        answer:
          "The right scope depends on the business, but most useful sites clearly explain services, audience, service area, trust information, contact options, and the next step on mobile and desktop.",
      },
    ],
  },
];

export const allFaqs = faqGroups.flatMap((group) => group.items);

