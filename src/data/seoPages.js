import { site } from "./site.js";

const absolute = (path = "/") => (path.startsWith("http") ? path : `${site.url}${path}`);

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  logo: absolute("/logo.svg"),
  description: site.description,
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Toronto, Ontario, Canada",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: site.phoneDisplay,
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
      "MSPixelPulse builds professional websites, redesigns, portals, and maintenance workflows for small businesses in Toronto and across Canada.",
    canonical: "/",
    image: "/hero/mspixelpulse-web-design-collaboration.webp",
    component: "src/pages/Home.jsx",
    jsonLd: [organizationJsonLd, websiteJsonLd],
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
      "Explore MSPixelPulse website design, WordPress, React, e-commerce, redesign, maintenance, and SEO-ready launch services for small businesses.",
    canonical: "/services",
    component: "src/pages/Services.jsx",
  },
  pricing: {
    path: "/pricing",
    title: "Website Pricing & Project Options — MSPixelPulse",
    description:
      "Compare practical starting points for WordPress, React, Wix, professional email, and custom small-business website projects.",
    canonical: "/pricing",
    component: "src/pages/Pricing.jsx",
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
    title: "Website Design Blog — MSPixelPulse",
    description:
      "Practical website design, redesign, SEO, performance, and maintenance guidance for Canadian small businesses.",
    canonical: "/blog",
    image: "/blog/small-business-website-cost-canada.webp",
    component: "src/pages/Blog.jsx",
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
    image: absolute(post.cover),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    keywords: post.tags.join(", "),
    citation: post.resources?.map((resource) => resource.url),
    author: { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: absolute("/logo.svg") },
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
