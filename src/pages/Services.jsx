// src/pages/Services.jsx
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useTheme } from "@/lib/theme.js";
import Meta from "@/components/Meta.jsx";
import ContactActions from "@/components/ContactActions.jsx";

/* Icons */
import {
  LuPenTool,
  LuCode,
  LuShieldCheck,
  LuGauge,
  LuSearch,
  LuGraduationCap,
  LuCalendar,
} from "react-icons/lu";

const items = [
  {
    t: "Website Design & Development",
    icon: LuPenTool,
    d: "Custom business websites, landing pages, and redesigns built around clear services and mobile-first UX.",
    best: "Best for new launches and refreshes",
  },
  {
    t: "E-commerce",
    icon: LuCode,
    d: "Storefront structure, product pages, checkout guidance, and shopping flows that feel easy to use.",
    best: "Best for product-based businesses",
  },
  {
    t: "Website Improvements",
    icon: LuShieldCheck,
    d: "Focused UI, speed, accessibility, SEO structure, and responsive fixes for websites that already exist.",
    best: "Best for sites that feel outdated",
  },
  {
    t: "Ongoing Support",
    icon: LuGauge,
    d: "Maintenance, content updates, technical support, backups, and practical post-launch care.",
    best: "Best for steady business updates",
  },
  {
    t: "Custom Solutions",
    icon: LuSearch,
    d: "Client portals, dashboards, custom forms, booking flows, and integrations for more specific workflows.",
    best: "Best for app-like requirements",
  },
  {
    t: "SEO & Launch Readiness",
    icon: LuGraduationCap,
    d: "Metadata, sitemap, local keyword mapping, launch QA, analytics readiness, and domain migration support.",
    best: "Best before public launch",
  },
];

export default function Services() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="section overflow-x-hidden">
      <Container>
        <Meta
          title="Website Services — MSPixelPulse"
          description="MSPixelPulse provides website design and development, WordPress and React websites, e-commerce, redesigns, maintenance, SEO-ready structure, and custom solutions."
          canonical="/services"
        />
        <div className="mb-8 text-center">
          <div className="mb-2 inline-flex items-center gap-2">
            <span className="text-sm font-black uppercase tracking-[0.28em] text-primary">
              Services
            </span>
          </div>
          <h1 className={isDark ? "mx-auto max-w-2xl text-2xl font-black leading-tight text-white sm:text-3xl md:text-4xl" : "mx-auto max-w-2xl text-2xl font-black leading-tight text-slate-900 sm:text-3xl md:text-4xl"}>
            Website services for small businesses
          </h1>
        </div>

        <div className={isDark ? "mx-auto mb-8 max-w-2xl break-words text-center text-textSub" : "mx-auto mb-8 max-w-2xl break-words text-center text-slate-600"}>
          Choose the level of help you need, from a cleaner business website to custom workflows and steady post-launch support.
        </div>

        {/* Services grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ t, d, best, icon: Icon }) => (
            <div
              key={t}
              className={
                isDark
                  ? "relative min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:bg-white/[0.065]"
                  : "relative min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300"
              }
            >
              <div
                className={
                  isDark
                    ? "pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    : "pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
                }
              />
              <div className="flex min-w-0 items-center gap-2">
                {Icon && (
                  <Icon
                    className={
                      isDark ? "h-5 w-5 text-primary" : "h-5 w-5 text-[#2563ff]"
                    }
                    aria-hidden="true"
                  />
                )}
                <h3 className={isDark ? "min-w-0 break-words font-extrabold" : "min-w-0 break-words font-extrabold text-slate-900"}>
                  {t}
                </h3>
              </div>
              <p className={isDark ? "mt-3 break-words text-sm leading-6 text-textSub" : "mt-3 break-words text-sm leading-6 text-slate-600"}>{d}</p>
              <div className={isDark ? "mt-5 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-bold text-white/70" : "mt-5 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600"}>
                {best}
              </div>
            </div>
          ))}
        </div>

        {/* Inline CTA */}
        {isDark ? (
          <div className="mt-12 card-surface p-6 md:p-8 rounded-2xl grid md:grid-cols-[1fr_auto_auto] gap-4 items-center glass-hover">
            <div>
              <h3 className="text-2xl font-black">Have a project in mind?</h3>
              <p className="text-textSub mt-1 text-[16px] md:text-[18px] leading-relaxed">
                Tell us your goals — we’ll propose the simplest path to launch.
              </p>
            </div>

            <ContactActions
              dark={isDark}
              showPhone={false}
              whatsappLabel="Discuss your project"
              message="Hi MSPixelPulse, I would like to discuss website services for my business."
            />

            <a
              className="btn btn-outline"
              href="https://calendly.com/mspixelpulse/30min"
              target="_blank"
              rel="noreferrer"
            >
              <LuCalendar className="mr-2 h-5 w-5" aria-hidden="true" />
              Book appointment
            </a>
          </div>
        ) : (
          <div className="mt-12 rounded-2xl bg-white border border-slate-200 shadow-sm p-6 md:p-8 grid md:grid-cols-[1fr_auto_auto] gap-4 items-center">
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Have a project in mind?
              </h3>
              <p className="text-slate-500 mt-1">
                Tell us your goals — we’ll propose the simplest path to launch.
              </p>
            </div>

            <ContactActions
              dark={isDark}
              showPhone={false}
              whatsappLabel="Discuss your project"
              message="Hi MSPixelPulse, I would like to discuss website services for my business."
            />

            <a
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold shadow-sm"
              href="https://calendly.com/mspixelpulse/30min"
              target="_blank"
              rel="noreferrer"
            >
              <LuCalendar className="h-5 w-5" aria-hidden="true" />
              Book appointment
            </a>
          </div>
        )}
      </Container>
    </section>
  );
}
