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
    b: [
      "Business websites, landing pages, and portfolio websites",
      "WordPress and React builds based on the project need",
      "Responsive redesigns for outdated or hard-to-use sites",
      "Clear content structure, UX flows, and accessibility basics",
    ],
  },
  {
    t: "E-commerce",
    icon: LuCode,
    b: [
      "WooCommerce and online storefront planning",
      "Product-page layout and checkout guidance",
      "Payment and inquiry-flow integration support",
      "Mobile-first shopping experience review",
    ],
  },
  {
    t: "Website Improvements",
    icon: LuShieldCheck,
    b: [
      "UI/UX improvements and responsive fixes",
      "Speed, image, and Core Web Vitals basics",
      "SEO-ready structure, metadata, and internal links",
      "Content and layout updates for clearer services",
    ],
  },
  {
    t: "Ongoing Support",
    icon: LuGauge,
    b: [
      "Maintenance, content updates, and technical support",
      "Security updates, backups, and uptime checks",
      "Analytics and Search Console readiness",
      "Practical handover notes for business owners",
    ],
  },
  {
    t: "Custom Solutions",
    icon: LuSearch,
    b: [
      "Client portals, dashboards, and internal tools",
      "Custom forms, booking flows, and integrations",
      "API-connected React interfaces where useful",
      "Role-based workflows that protect private data",
    ],
  },
  {
    t: "SEO & Launch Readiness",
    icon: LuGraduationCap,
    b: [
      "Page titles, descriptions, sitemap, and robots review",
      "Local and industry keyword mapping without stuffing",
      "Launch QA for forms, links, images, and mobile layouts",
      "Domain migration and analytics setup guidance",
    ],
  },
];

export default function Services() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="section">
      <Container>
        <Meta
          title="Website Services — MSPixelPulse"
          description="MSPixelPulse provides website design and development, WordPress and React websites, e-commerce, redesigns, maintenance, SEO-ready structure, and custom solutions."
          canonical="/services"
        />
        <SectionTitle
          eyebrow="Services"
          title={isDark ? "Website services for small businesses" : "Website services for small businesses"}
          centered
        />

        {/* Services grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {items.map(({ t, b, icon: Icon }) => (
            <div
              key={t}
              className={
                isDark
                  ? "relative card-surface p-6 rounded-2xl hover:bg-white/[0.09] transition-colors"
                  : "relative rounded-2xl bg-white border border-slate-200 shadow-sm p-6 hover:border-slate-300 transition-colors"
              }
            >
              {/* glow/top line */}
              <div
                className={
                  isDark
                    ? "pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    : "pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
                }
              />
              <div className="flex items-center gap-2">
                {Icon && (
                  <Icon
                    className={
                      isDark ? "h-5 w-5 text-primary" : "h-5 w-5 text-[#2563ff]"
                    }
                    aria-hidden="true"
                  />
                )}
                <h3 className={isDark ? "font-extrabold" : "font-extrabold text-slate-900"}>
                  {t}
                </h3>
              </div>
              <ul
                className={
                  isDark
                    ? "mt-3 space-y-2 text-textSub text-[16px] md:text-[18px] leading-relaxed"
                    : "mt-3 space-y-2 text-slate-500 text-[15px] leading-relaxed"
                }
              >
                {b.map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span
                      className={
                        isDark
                          ? "mt-2 inline-block h-1.5 w-1.5 rounded-full bg-primary/90"
                          : "mt-2 inline-block h-1.5 w-1.5 rounded-full bg-[#2563ff]"
                      }
                    />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
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
