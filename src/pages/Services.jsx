import { Link } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import { useTheme } from "@/lib/theme.js";
import Meta from "@/components/Meta.jsx";
import ContactActions from "@/components/ContactActions.jsx";
import { seoPages } from "@/data/seoPages.js";

import {
  LuArrowRight,
  LuCalendar,
  LuCircleCheck,
  LuLifeBuoy,
  LuPenTool,
  LuRocket,
  LuShieldCheck,
  LuShoppingCart,
  LuWorkflow,
} from "react-icons/lu";

const services = [
  {
    title: "Website Design & Development",
    icon: LuPenTool,
    description:
      "Custom business websites, landing pages, and redesigns built around clear services, mobile-first UX, and real launch needs.",
    best: "New launches, redesigns, and service websites",
    benefits: ["Responsive page structure", "Conversion-focused CTAs", "SEO-ready content sections"],
    cta: "View related work",
    related: "/projects?service=design",
    photo:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=75",
    photoAlt: "Illustrative photo of a professional team reviewing website planning notes",
    visual: "design",
  },
  {
    title: "E-commerce",
    icon: LuShoppingCart,
    description:
      "Storefront structure, product pages, checkout guidance, and shopping flows that make buying feel simple and trustworthy.",
    best: "Product catalogs, boutique shops, and order inquiries",
    benefits: ["Product-card hierarchy", "Checkout-path review", "Mobile shopping flow"],
    cta: "See website examples",
    related: "/projects?type=E-commerce",
    photo:
      "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=900&q=75",
    photoAlt: "Illustrative photo of a person using a laptop for an online storefront workflow",
    visual: "commerce",
  },
  {
    title: "Website Improvements",
    icon: LuShieldCheck,
    description:
      "Focused UI, speed, accessibility, SEO structure, and responsive fixes for websites that already exist but feel harder to use.",
    best: "Older sites, confusing pages, and mobile friction",
    benefits: ["Before/after layout review", "Accessibility and speed basics", "Clearer content paths"],
    cta: "Explore this service",
    related: "/contact?service=website-improvements",
    photo:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=75",
    photoAlt: "Illustrative photo of a professional reviewing analytics and interface improvements on a laptop",
    visual: "improve",
  },
  {
    title: "Ongoing Support",
    icon: LuLifeBuoy,
    description:
      "Maintenance, content updates, technical support, backups, and practical post-launch care for steady business changes.",
    best: "Businesses that need reliable updates after launch",
    benefits: ["Update planning", "Form and link checks", "Backup and health reminders"],
    cta: "Discuss support",
    related: "/contact?service=ongoing-support",
    photo:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=75",
    photoAlt: "Illustrative photo of a support professional working at a computer",
    visual: "support",
  },
  {
    title: "Custom Solutions",
    icon: LuWorkflow,
    description:
      "Client portals, dashboards, custom forms, booking flows, and integrations for workflows that need more than a brochure site.",
    best: "Portal, dashboard, and custom workflow ideas",
    benefits: ["Role-aware UI planning", "Form and data-flow mapping", "API-connected interfaces"],
    cta: "Discuss your project",
    related: "/contact?service=custom-solutions",
    photo:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=75",
    photoAlt: "Illustrative photo of professionals collaborating on a dashboard workflow",
    visual: "workflow",
  },
  {
    title: "SEO & Launch Readiness",
    icon: LuRocket,
    description:
      "Metadata, sitemap, local keyword mapping, launch QA, analytics readiness, and domain migration support before the public switch.",
    best: "Pre-launch QA, redesign launches, and local SEO basics",
    benefits: ["Metadata and sitemap checks", "Launch QA checklist", "Local search structure"],
    cta: "Plan your launch",
    related: "/contact?service=seo-launch",
    photo:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=75",
    photoAlt: "Illustrative photo of a person reviewing search and launch readiness on a laptop",
    visual: "launch",
  },
];

export default function Services() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="section overflow-x-hidden">
      <Meta {...seoPages.services} />
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className={isDark ? "badge mb-4" : "mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700"}>
            Services
          </span>
          <h1 className={isDark ? "text-3xl font-extrabold leading-[1.08] text-white md:text-[2.75rem]" : "text-3xl font-extrabold leading-[1.08] text-slate-950 md:text-[2.75rem]"}>
            Website services with the visuals, structure, and support a real business needs.
          </h1>
          <p className={isDark ? "mx-auto mt-4 max-w-2xl text-base leading-7 text-textSub md:text-lg" : "mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg"}>
            Choose focused help for launch, redesign, e-commerce, support, custom workflows, or SEO-ready release checks.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {services.map((service, index) => (
            <ServiceModule key={service.title} service={service} isDark={isDark} priority={index === 0} />
          ))}
        </div>

        <div className={isDark ? "mt-12 card-surface grid gap-5 rounded-2xl p-6 md:grid-cols-[1fr_auto_auto] md:items-center md:p-8" : "mt-12 grid gap-5 rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-[0_22px_70px_rgba(37,99,255,0.10)] md:grid-cols-[1fr_auto_auto] md:items-center md:p-8"}>
          <div>
            <h2 className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-950"}>
              Have a project in mind?
            </h2>
            <p className={isDark ? "mt-2 text-textSub" : "mt-2 text-slate-600"}>
              Send a short note and we will propose the simplest path to launch, improve, or maintain your website.
            </p>
          </div>

          <ContactActions
            dark={isDark}
            showPhone={false}
            whatsappLabel="Discuss your project"
            message="Hi MSPixelPulse, I would like to discuss website services for my business."
          />

          <a
            className={isDark ? "btn btn-outline" : "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 font-bold text-slate-900 shadow-sm hover:bg-slate-50"}
            href="https://calendly.com/mspixelpulse/30min"
            target="_blank"
            rel="noreferrer"
          >
            <LuCalendar className="h-5 w-5" aria-hidden="true" />
            Book appointment
          </a>
        </div>
      </Container>
    </section>
  );
}

function ServiceModule({ service, isDark, priority }) {
  const Icon = service.icon;

  return (
    <article className={isDark ? "service-module service-module-dark" : "service-module"}>
      <div className="service-visual" data-visual={service.visual}>
        <img
          src={service.photo}
          alt={service.photoAlt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
          width="900"
          height="620"
        />
        <div className="service-ui-stack" aria-hidden="true">
          <div className="service-browser">
            <span />
            <span />
            <span />
          </div>
          <div className="service-ui-row service-ui-row-strong" />
          <div className="service-ui-grid">
            <span />
            <span />
            <span />
          </div>
          <div className="service-pulse" />
        </div>
      </div>

      <div className="service-copy">
        <div className="flex items-center gap-3">
          <span className={isDark ? "grid h-11 w-11 place-items-center rounded-xl bg-primary/20 text-white" : "grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700"}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className={isDark ? "text-xl font-black text-white" : "text-xl font-black text-slate-950"}>
            {service.title}
          </h2>
        </div>

        <p className={isDark ? "mt-4 text-sm leading-6 text-textSub" : "mt-4 text-sm leading-6 text-slate-600"}>
          {service.description}
        </p>

        <div className={isDark ? "mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/75" : "mt-5 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm font-bold text-slate-700"}>
          Best for: {service.best}
        </div>

        <ul className={isDark ? "mt-5 space-y-2 text-sm text-textSub" : "mt-5 space-y-2 text-sm text-slate-600"}>
          {service.benefits.map((benefit) => (
            <li key={benefit} className="flex gap-2">
              <LuCircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <Link
          to={service.related}
          className={isDark ? "mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primaryAccent" : "mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-blue-500"}
        >
          {service.cta}
          <LuArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
