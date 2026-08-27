import { publishedProjects } from "../../src/data/projects.js";
import { servicePages, servicePath } from "../../src/data/servicePages.js";
import { site } from "../../src/data/site.js";

function absolute(path) {
  return `${site.url}${path}`;
}

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (!["GET", "HEAD"].includes(req.method)) {
    res.setHeader("Allow", "GET, HEAD, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const payload = {
    name: site.name,
    canonicalId: `${site.url}/#organization`,
    url: `${site.url}/`,
    description:
      "MSPixelPulse is a Toronto web development and UX/UI agency providing WordPress, React, website design, redesign, Moodle LMS, school website, small-business website, and maintenance services.",
    areasServed: [
      "Toronto, Ontario, Canada",
      "Brampton, Ontario, Canada",
      "Mississauga, Ontario, Canada",
      "Greater Toronto Area, Ontario, Canada",
      "Canada",
    ],
    services: servicePages.map((service) => ({
      name: service.name,
      url: absolute(servicePath(service.slug)),
      description: service.summary,
    })),
    projects: publishedProjects.map((project) => ({
      name: project.title,
      url: absolute(`/projects/${project.slug}`),
      classification: project.classification,
      industry: project.industry,
    })),
    primaryPages: {
      about: absolute("/about"),
      services: absolute("/services"),
      projects: absolute("/projects"),
      blog: absolute("/blog"),
      faq: absolute("/faq"),
      pricing: absolute("/pricing"),
      contact: absolute("/contact"),
    },
    contact: {
      email: site.email,
      url: absolute("/contact"),
    },
    sameAs: [site.github, site.linkedin, site.portfolio],
  };

  if (req.method === "HEAD") {
    return res.status(200).end();
  }

  return res.status(200).json(payload);
}

