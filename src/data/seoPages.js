import { site } from "./site.js";

const absolute = (path = "/") => (path.startsWith("http") ? path : `${site.url}${path}`);

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  email: site.email,
  logo: absolute("/icon-512.png?v=brand-tile-v1"),
  description: site.description,
  areaServed: site.serviceAreas.map((name) => ({ "@type": "Place", name })),
  contactPoint: {
    "@type": "ContactPoint",
    telephone: site.phoneDisplay,
    email: site.email,
    contactType: "sales and customer support",
    areaServed: "CA",
    availableLanguage: "English",
  },
  sameAs: [site.github],
};

export const localBusinessJsonLd = site.publicAddress
  ? {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${site.url}/#local-business`,
      name: site.name,
      url: site.url,
      image: absolute("/hero/mspixelpulse-web-design-collaboration.webp"),
      logo: absolute("/icon-512.png?v=brand-tile-v1"),
      telephone: site.phoneDisplay,
      email: site.email,
      address: {
        "@type": "PostalAddress",
        ...site.publicAddress,
      },
      areaServed: site.serviceAreas.map((name) => ({ "@type": "Place", name })),
      ...(site.businessHours.length ? { openingHours: site.businessHours } : {}),
      sameAs: [site.github],
    }
  : null;

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
    jsonLd: [organizationJsonLd, websiteJsonLd, localBusinessJsonLd].filter(Boolean),
  },
  projects: {
    path: "/projects",
    title: "Website Projects — MSPixelPulse",
    description:
      "Explore live MSPixelPulse website work and clearly labeled industry concept websites by industry, platform, and website type.",
    canonical: "/projects",
    image: "/projects/mockups/canstem-education.webp",
    component: "src/pages/Projects.jsx",
  },
  services: {
    path: "/services",
    title: "Website Design & Development Services — MSPixelPulse",
    description:
      "Explore clear website design, online store, redesign, ongoing support, custom tool, and launch services for small businesses.",
    canonical: "/services",
    component: "src/pages/Services.jsx",
  },
  pricing: {
    path: "/pricing",
    title: "Website Pricing & Project Options — MSPixelPulse",
    description:
      "Compare MSPixelPulse website plans in CAD, including one-page, business, growth, e-commerce, custom application, and monthly support options.",
    canonical: "/pricing",
    component: "src/pages/Pricing.jsx",
  },
  freeDemo: {
    path: "/free-demo",
    title: "Free Personalized Website Demo — MSPixelPulse Toronto",
    description:
      "Request a free personalized website demo from MSPixelPulse and review a mobile-first visual direction before deciding whether to start a paid website project.",
    canonical: "/free-demo",
    image: "/hero/mspixelpulse-web-design-collaboration.webp",
    component: "src/pages/FreeDemo.jsx",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${site.url}/free-demo#service`,
      name: "Free personalized website demo",
      serviceType: "Website design planning demo",
      description:
        "A free personalized visual website direction for business owners to review before discussing an optional paid production project.",
      provider: { "@id": `${site.url}/#organization` },
      areaServed: { "@type": "Country", name: "Canada" },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CAD",
        url: absolute("/free-demo"),
      },
    },
  },
  contact: {
    path: "/contact",
    title: "Contact MSPixelPulse — Start a Website Project",
    description:
      "Contact MSPixelPulse about website design, redesign, WordPress, React, e-commerce, maintenance, or small-business website support.",
    canonical: "/contact",
    component: "src/pages/Contact.jsx",
    jsonLd: organizationJsonLd,
  },
  blog: {
    path: "/blog",
    title: "Website & Local SEO Guides for Canadian Businesses — MSPixelPulse",
    description:
      "Practical website, local SEO, AI search, accessibility, performance, and growth guides for businesses in Toronto, Brampton, Mississauga, and Canada.",
    canonical: "/blog",
    image: "/hero/mspixelpulse-web-design-collaboration.webp",
    component: "src/pages/Blog.jsx",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "MSPixelPulse website and digital growth guides",
      description:
        "People-first website, local SEO, AI search, accessibility, performance, content, and conversion guidance for Canadian small businesses.",
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
    title: "About MSPixelPulse — Toronto Website Agency",
    description:
      "Learn about MSPixelPulse, a Toronto website agency focused on clear, responsive, maintainable websites for small businesses.",
    canonical: "/about",
    image: "/about/mahak-patel.webp",
    component: "src/pages/About.jsx",
    jsonLd: organizationJsonLd,
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
  register: {
    path: "/register",
    title: "Request Portal Access — MSPixelPulse",
    description:
      "Request access to an MSPixelPulse client, developer, or admin workspace.",
    canonical: "/register",
    robots: "noindex, nofollow",
    component: "src/pages/auth/Register.jsx",
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
      logo: { "@type": "ImageObject", url: absolute("/icon-512.png?v=brand-tile-v1") },
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
