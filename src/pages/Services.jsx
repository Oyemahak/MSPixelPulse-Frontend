import { Link } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import { useTheme } from "@/lib/theme.js";
import Meta from "@/components/Meta.jsx";
import ContactActions from "@/components/ContactActions.jsx";
import DemoOffer from "@/components/DemoOffer.jsx";
import { seoPages } from "@/data/seoPages.js";
import { serviceCatalog } from "@/data/serviceCatalog.js";
import { usePublicContent } from "@/hooks/usePublicContent.js";
import { PageHero } from "@/components/public/PublicPageHeader.jsx";

import {
  LuArrowRight,
  LuCalendar,
  LuCircleCheck,
  LuGraduationCap,
  LuLifeBuoy,
  LuPenTool,
  LuRocket,
  LuShieldCheck,
  LuShoppingCart,
  LuWorkflow,
} from "react-icons/lu";

export default function Services() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { items: persistedServices } = usePublicContent('service', serviceCatalog);
  const services = persistedServices;

  return (
    <section className="section overflow-x-hidden">
      <Meta {...seoPages.services} />
      <Container>
        <PageHero
          align="center"
          eyebrow="Services"
          title="Web design and development that supports a real business."
          description="Toronto web design for small businesses, including WordPress and React development, responsive redesigns, e-commerce, website maintenance, Moodle LMS work, and custom client portals."
          contentClassName="max-w-5xl"
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {services.map((service, index) => (
            <ServiceModule key={service.title} service={service} isDark={isDark} priority={index === 0} />
          ))}
        </div>

        <DemoOffer compact className="mt-10" />

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
            className="btn btn-glass"
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
  const iconMap = {
    design: LuPenTool,
    commerce: LuShoppingCart,
    improve: LuShieldCheck,
    support: LuLifeBuoy,
    workflow: LuWorkflow,
    education: LuGraduationCap,
    launch: LuRocket,
  };
  const Icon = service.icon || iconMap[service.iconKey] || iconMap[service.visual] || LuPenTool;

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
          className="btn btn-primary mt-6"
        >
          {service.cta}
          <LuArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
