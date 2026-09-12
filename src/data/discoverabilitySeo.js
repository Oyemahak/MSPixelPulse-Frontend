import { allFaqs } from "./faqs.js";
import { locationPages } from "./locationPages.js";
import { servicePages, servicePath } from "./servicePages.js";
import {
  breadcrumbJsonLd,
  organizationId,
  seoReleaseDate,
  webPageJsonLd,
} from "./seoPages.js";
import { site } from "./site.js";

const absolute = (path = "/") => (path.startsWith("http") ? path : `${site.url}${path}`);
const websiteId = `${site.url}/#website`;

export const faqSeo = {
  path: "/faq",
  title: "Website Development FAQ | MSPixelPulse",
  description:
    "Answers about MSPixelPulse website development, WordPress, React, UX/UI, pricing, process, maintenance, Moodle LMS, school, and small-business website services.",
  canonical: "/faq",
  component: "src/pages/Faq.jsx",
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${absolute("/faq")}#faq`,
      url: absolute("/faq"),
      isPartOf: { "@id": websiteId },
      mainEntity: allFaqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Frequently asked questions", path: "/faq" },
    ]),
  ],
  lastModified: seoReleaseDate,
};

export function servicePageSeo(service) {
  const path = servicePath(service.slug);
  const serviceId = `${absolute(path)}#service`;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": serviceId,
    name: service.name,
    serviceType: service.name,
    url: absolute(path),
    description: service.summary,
    provider: { "@id": organizationId },
    areaServed: [
      { "@type": "City", name: "Brampton, Ontario, Canada" },
      { "@type": "City", name: "Toronto, Ontario, Canada" },
      { "@type": "City", name: "Mississauga, Ontario, Canada" },
      { "@type": "AdministrativeArea", name: "Greater Toronto Area, Ontario, Canada" },
      { "@type": "Country", name: "Canada" },
    ],
    audience: service.audience.map((audienceType) => ({
      "@type": "Audience",
      audienceType,
    })),
  };

  return {
    path,
    title: service.seoTitle,
    description: service.metaDescription,
    canonical: path,
    image: service.image || "/hero/mspixelpulse-web-design-collaboration.webp",
    imageAlt: service.imageAlt || `${service.name} service from MSPixelPulse`,
    component: "src/pages/ServiceDetail.jsx",
    lastModified: service.lastModified || seoReleaseDate,
    jsonLd: [
      serviceSchema,
      {
        ...webPageJsonLd(path, `${service.name} | MSPixelPulse`),
        mainEntity: { "@id": serviceId },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${absolute(path)}#faq`,
        mainEntity: service.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: service.name, path },
      ]),
    ],
  };
}

export const serviceSeoEntries = servicePages.map(servicePageSeo);

export function locationPageSeo(location) {
  const path = location.path;
  const serviceId = `${absolute(path)}#service`;

  return {
    path,
    title: location.seoTitle,
    description: location.metaDescription,
    canonical: path,
    image: location.image,
    imageAlt: location.imageAlt,
    component: "src/pages/LocationPage.jsx",
    lastModified: location.lastModified || seoReleaseDate,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": serviceId,
        name: "Web design and development for Brampton businesses",
        serviceType: "Website design and development",
        url: absolute(path),
        description: location.summary,
        provider: { "@id": organizationId },
        areaServed: { "@type": "City", name: "Brampton, Ontario, Canada" },
      },
      {
        ...webPageJsonLd(path, location.name),
        mainEntity: { "@id": serviceId },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${absolute(path)}#faq`,
        mainEntity: location.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Web design Brampton", path },
      ]),
    ],
  };
}

export const locationSeoEntries = locationPages.map(locationPageSeo);
