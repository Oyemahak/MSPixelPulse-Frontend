import { site } from "./site.js";

const absolute = (path = "/") => (path.startsWith("http") ? path : `${site.url}${path}`);
export const organizationId = `${site.url}/#organization`;
const websiteId = `${site.url}/#website`;
const founderId = `${site.url}/about#mahak-patel`;
export const seoReleaseDate = "2026-08-25";

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": organizationId,
  name: site.name,
  legalName: site.legalName,
  url: `${site.url}/`,
  email: site.email,
  logo: {
    "@type": "ImageObject",
    "@id": `${site.url}/#logo`,
    url: absolute("/icon.svg"),
    contentUrl: absolute("/icon.svg"),
    caption: site.name,
  },
  description: site.description,
  founder: { "@id": founderId },
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
  "@id": websiteId,
  name: site.name,
  url: `${site.url}/`,
  description: site.description,
  inLanguage: "en-CA",
  publisher: { "@id": organizationId },
  creator: { "@id": organizationId },
};

export const founderJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": founderId,
  name: "Mahak Patel",
  url: absolute("/about"),
  jobTitle: "Founder and design lead",
  worksFor: { "@id": organizationId },
  sameAs: [site.portfolio, site.linkedin],
};

export const seoPages = {
  home: {
    path: "/",
    title: "MSPixelPulse | Web Development & UX/UI Agency in Toronto",
    description:
      "MSPixelPulse builds WordPress, React, UX/UI, school, Moodle LMS, redesign, and small-business website solutions in Toronto and across Canada.",
    canonical: "/",
    image: "/hero/mspixelpulse-web-design-collaboration.webp",
    component: "src/pages/Home.jsx",
    jsonLd: [organizationJsonLd, websiteJsonLd],
    lastModified: seoReleaseDate,
  },
  projects: {
    path: "/projects",
    title: "Toronto Web Design Projects & Website Examples | MSPixelPulse",
    description:
      "Explore live MSPixelPulse web design work and clearly labeled website demos for small businesses, service brands, and education teams.",
    canonical: "/projects",
    image: "/projects/mockups/canstem-education.webp",
    component: "src/pages/Projects.jsx",
    jsonLd: [
      webPageJsonLd("/projects", "MSPixelPulse website projects and case studies", "CollectionPage"),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Website projects", path: "/projects" },
      ]),
    ],
    lastModified: "2026-08-27",
  },
  services: {
    path: "/services",
    title: "Web Design & Development Services Toronto | MSPixelPulse",
    description:
      "Toronto web design and development for small businesses: WordPress, React, e-commerce, redesign, maintenance, Moodle LMS, portals, and custom web applications.",
    canonical: "/services",
    component: "src/pages/Services.jsx",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${absolute("/services")}#webpage`,
        name: "MSPixelPulse web design and development services",
        url: absolute("/services"),
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
      ]),
    ],
    lastModified: "2026-08-27",
  },
  pricing: {
    path: "/pricing",
    title: "Website Design Pricing Toronto | MSPixelPulse",
    description:
      "Compare MSPixelPulse website design starting prices in CAD for one-page, business, e-commerce, custom application, redesign, and maintenance work.",
    canonical: "/pricing",
    component: "src/pages/Pricing.jsx",
    jsonLd: [
      webPageJsonLd("/pricing", "MSPixelPulse website pricing"),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Website pricing", path: "/pricing" },
      ]),
    ],
    lastModified: seoReleaseDate,
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
      webPageJsonLd("/contact", "Contact MSPixelPulse", "ContactPage"),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]),
    ],
    lastModified: seoReleaseDate,
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
      "@id": `${absolute("/blog")}#webpage`,
      name: "MSPixelPulse website and digital growth guides",
      description:
        "People-first website, local SEO, AI search, accessibility, performance, content, learning platform, and conversion guidance for Canadian organizations.",
      url: absolute("/blog"),
      inLanguage: "en-CA",
      isPartOf: { "@id": websiteId },
      publisher: { "@id": organizationId },
    },
    lastModified: seoReleaseDate,
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
      founderJsonLd,
      webPageJsonLd("/about", "About MSPixelPulse", "AboutPage"),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "About MSPixelPulse", path: "/about" },
      ]),
    ],
    lastModified: seoReleaseDate,
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

export function webPageJsonLd(path, name, type = "WebPage") {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${absolute(path)}#webpage`,
    url: absolute(path),
    name,
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    inLanguage: "en-CA",
  };
}

export function projectSeo(project) {
  const path = `/projects/${project.slug}`;
  const projectId = `${absolute(path)}#project`;
  return {
    path,
    title: `${project.title} | MSPixelPulse Portfolio`,
    description: project.shortDescription || project.summary,
    canonical: path,
    image: project.thumb,
    component: "src/pages/ProjectDetail.jsx",
    lastModified: project.lastModified || seoReleaseDate,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": projectId,
        name: project.title,
        url: absolute(path),
        description: project.shortDescription || project.summary,
        image: absolute(project.thumb),
        genre: project.websiteType,
        about: project.industry,
        creator: { "@id": organizationId },
        keywords: [...(project.stack || []), ...(project.services || [])].join(", "),
      },
      {
        ...webPageJsonLd(path, `${project.title} case study`),
        mainEntity: { "@id": projectId },
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Website projects", path: "/projects" },
        { name: project.title, path },
      ]),
    ],
  };
}

export function blogPostSeo(post) {
  const path = `/blog/${post.slug}`;
  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${absolute(path)}#article`,
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
    author: { "@id": organizationId },
    publisher: {
      "@id": organizationId,
    },
    mainEntityOfPage: { "@id": `${absolute(path)}#webpage` },
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
      {
        ...webPageJsonLd(path, post.title, "Article"),
        mainEntity: { "@id": `${absolute(path)}#article` },
      },
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
