import { site } from "./site.js";

const absolute = (path = "/") => (path.startsWith("http") ? path : `${site.url}${path}`);

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  email: site.email,
  logo: absolute("/logo.svg?v=black-light-mark-v9"),
  description: site.description,
  areaServed: [
    { "@type": "City", name: "Toronto, Ontario, Canada" },
    { "@type": "City", name: "Brampton, Ontario, Canada" },
    { "@type": "City", name: "Mississauga, Ontario, Canada" },
    { "@type": "AdministrativeArea", name: "Greater Toronto Area, Ontario, Canada" },
    { "@type": "Country", name: "Canada" },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: site.phoneDisplay,
    email: site.email,
    contactType: "sales and customer support",
    areaServed: "CA",
    availableLanguage: "English",
  },
  sameAs: [site.portfolio, site.linkedin, site.github],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  description: site.description,
  publisher: {
    "@type": "Organization",
    name: site.name,
  },
};

export const seoPages = {
  home: {
    path: "/",
    title: "MSPixelPulse — Toronto Website Design for Small Businesses",
    description:
      "MSPixelPulse builds professional websites for small businesses and offers a free personalized demo to review before choosing a website plan.",
    canonical: "/",
    image: "/hero/mspixelpulse-web-design-collaboration.webp",
    component: "src/pages/Home.jsx",
    jsonLd: [organizationJsonLd, websiteJsonLd],
  },
  projects: {
    path: "/projects",
    title: "Toronto Web Design Projects & Website Examples | MSPixelPulse",
    description:
      "Explore live MSPixelPulse web design work and clearly labeled website demos for small businesses, service brands, and education teams.",
    canonical: "/projects",
    image: "/projects/mockups/canstem-education.webp",
    component: "src/pages/Projects.jsx",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Website projects", path: "/projects" },
    ]),
  },
  services: {
    path: "/services",
    title: "Web Design & Development Services Toronto | MSPixelPulse",
    description:
      "Toronto web design and development for small businesses: WordPress, React, e-commerce, redesign, maintenance, Moodle LMS, portals, and custom web applications.",
    canonical: "/services",
    component: "src/pages/Services.jsx",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
    ]),
  },
  moodleLms: {
    path: "/services/moodle-lms-development",
    title: "Moodle LMS Development & Support Canada | MSPixelPulse",
    description:
      "Custom Moodle LMS development and support for schools and training organizations, including setup, UI, courses, roles, plugins, upgrades, hosting, and administration.",
    canonical: "/services/moodle-lms-development",
    component: "src/pages/MoodleLmsDevelopment.jsx",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Moodle LMS Development and Support",
        serviceType: "Moodle LMS development, customization and support",
        url: absolute("/services/moodle-lms-development"),
        description:
          "Custom Moodle learning management system development, configuration, responsive UI improvement, course and role setup, plugin and integration support, upgrades, hosting planning, and ongoing administration.",
        provider: {
          "@type": "Organization",
          name: site.name,
          url: site.url,
        },
        areaServed: [
          { "@type": "Country", name: "Canada" },
          { "@type": "AdministrativeArea", name: "Ontario, Canada" },
        ],
        audience: {
          "@type": "Audience",
          audienceType: "Schools, training organizations, education teams and organizations using Moodle",
        },
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Moodle LMS development", path: "/services/moodle-lms-development" },
      ]),
    ],
  },
  pricing: {
    path: "/pricing",
    title: "Website Design Pricing Toronto | MSPixelPulse",
    description:
      "Compare MSPixelPulse website design starting prices in CAD for one-page, business, e-commerce, custom application, redesign, and maintenance work.",
    canonical: "/pricing",
    component: "src/pages/Pricing.jsx",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Website pricing", path: "/pricing" },
    ]),
  },
  contact: {
    path: "/contact",
    title: "Contact a Toronto Web Design Studio | MSPixelPulse",
    description:
      "Contact MSPixelPulse about website design, redesign, WordPress, React, Moodle LMS, e-commerce, maintenance, or small-business website support.",
    canonical: "/contact",
    component: "src/pages/Contact.jsx",
    jsonLd: [
      organizationJsonLd,
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]),
    ],
  },
  blog: {
    path: "/blog",
    title: "Website & Local SEO Guides for Canadian Businesses — MSPixelPulse",
    description:
      "Practical website, local SEO, AI search, accessibility, performance, Moodle LMS, and growth guides for businesses and education teams in Canada.",
    canonical: "/blog",
    image: "/hero/mspixelpulse-web-design-collaboration.webp",
    component: "src/pages/Blog.jsx",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "MSPixelPulse website and digital growth guides",
      description:
        "People-first website, local SEO, AI search, accessibility, performance, content, learning platform, and conversion guidance for Canadian organizations.",
      url: absolute("/blog"),
      inLanguage: "en-CA",
      publisher: {
        "@type": "Organization",
        name: site.name,
        url: site.url,
      },
    },
  },
  about: {
    path: "/about",
    title: "About MSPixelPulse | Toronto Web Design Studio",
    description:
      "Learn about MSPixelPulse, a Toronto website agency focused on clear, responsive, maintainable websites and digital platforms for businesses and education teams.",
    canonical: "/about",
    image: "/about/mahak-patel.webp",
    component: "src/pages/About.jsx",
    jsonLd: [
      organizationJsonLd,
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "About MSPixelPulse", path: "/about" },
      ]),
    ],
  },
  login: {
    path: "/login",
    title: "Portal Login — MSPixelPulse",
    description:
      "Secure access for approved MSPixelPulse client, developer, and admin workspaces.",
    canonical: "/login",
    robots: "noindex, nofollow",
    component: "src/pages/auth/Login.jsx",
  },
  notFound: {
    path: "/404",
    title: "Page not found — MSPixelPulse",
    description:
      "The requested MSPixelPulse page could not be found. Return home or browse our website projects.",
    canonical: "/404",
    robots: "noindex, nofollow",
    component: "src/pages/NotFound.jsx",
  },
};

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function projectSeo(project) {
  const path = `/projects/${project.slug}`;
  return {
    path,
    title: `${project.title} | MSPixelPulse Portfolio`,
    description: project.shortDescription || project.summary,
    canonical: path,
    image: project.thumb,
    component: "src/pages/ProjectDetail.jsx",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Website projects", path: "/projects" },
      { name: project.title, path },
    ]),
  };
}

export function blogPostSeo(post) {
  const path = `/blog/${post.slug}`;
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    image: {
      "@type": "ImageObject",
      url: absolute(post.cover),
      caption: post.coverAlt,
      width: 1200,
      height: 675,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    articleSection: post.pillar || post.category,
    inLanguage: "en-CA",
    isAccessibleForFree: true,
    keywords: post.tags.join(", "),
    citation: post.resources?.map((resource) => resource.url),
    author: { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: absolute("/logo.svg?v=black-light-mark-v9") },
    },
    mainEntityOfPage: absolute(path),
  };

  return {
    path,
    title: post.seoTitle,
    description: post.metaDescription,
    canonical: path,
    image: post.cover,
    type: "article",
    component: "src/pages/BlogPost.jsx",
    lastModified: post.updatedAt,
    jsonLd: [
      article,
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Website design blog", path: "/blog" },
        { name: post.title, path },
      ]),
    ],
  };
}

export function legalSeo(page, content) {
  const path = `/${page}`;
  return {
    path,
    title: `${content.title} — MSPixelPulse`,
    description: content.description,
    canonical: path,
    robots: "noindex, nofollow",
    component: "src/pages/LegalPage.jsx",
  };
}
