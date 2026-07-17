// src/components/Meta.jsx
import { useEffect } from "react";
import { site } from "@/data/site.js";

export default function Meta({
  title,
  description,
  canonical,
  image,
  type = "website",
  robots = "index, follow",
  jsonLd,
}) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (!robotsTag) {
      robotsTag = document.createElement("meta");
      robotsTag.setAttribute("name", "robots");
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute("content", robots);
  }, [title, description, robots]);

  useEffect(() => {
    const setMeta = (selector, attrs, content) => {
      if (!content) return;
      let t = document.querySelector(selector);
      if (!t) {
        t = document.createElement("meta");
        Object.entries(attrs).forEach(([key, value]) => t.setAttribute(key, value));
        document.head.appendChild(t);
      }
      t.setAttribute("content", content);
    };
    const absoluteUrl = canonical?.startsWith("http")
      ? canonical
      : `${site.url}${canonical || window.location.pathname}`;
    const absoluteImage = image?.startsWith("http")
      ? image
      : `${site.url}${image || "/logo.svg"}`;

    setMeta('meta[property="og:title"]', { property: "og:title" }, title);
    setMeta('meta[property="og:description"]', { property: "og:description" }, description);
    setMeta('meta[property="og:type"]', { property: "og:type" }, type);
    setMeta('meta[property="og:url"]', { property: "og:url" }, absoluteUrl);
    setMeta('meta[property="og:image"]', { property: "og:image" }, absoluteImage);
    setMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    setMeta('meta[name="twitter:title"]', { name: "twitter:title" }, title);
    setMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    setMeta('meta[name="twitter:image"]', { name: "twitter:image" }, absoluteImage);

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", absoluteUrl);
  }, [canonical, description, image, title, type]);

  useEffect(() => {
    const id = "page-json-ld";
    document.getElementById(id)?.remove();
    document.querySelectorAll("[data-static-page-jsonld]").forEach((script) => script.remove());
    if (!jsonLd) return;
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => script.remove();
  }, [jsonLd]);

  return null;
}
