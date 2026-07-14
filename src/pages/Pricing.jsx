// src/pages/Pricing.jsx
import { Link, useNavigate } from "react-router-dom";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuCircleCheck,
  LuClock3,
  LuMail,
  LuRocket,
  LuShieldCheck,
  LuSparkles,
} from "react-icons/lu";
import { SiReact, SiWordpress, SiWix } from "react-icons/si";
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useTheme } from "@/lib/theme.js";
import Meta from "@/components/Meta.jsx";
import ContactActions from "@/components/ContactActions.jsx";

const CAD = (n) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
  }).format(n);

const included = [
  { icon: LuShieldCheck, label: "Mobile-first responsive QA" },
  { icon: LuSparkles, label: "Clean visual direction" },
  { icon: LuBadgeCheck, label: "SEO-ready page basics" },
  { icon: LuClock3, label: "Launch checklist and handoff notes" },
];

const plans = [
  {
    key: "wordpress",
    name: "WordPress Website",
    shortName: "WordPress",
    price: 2000,
    badge: "Practical CMS",
    icon: SiWordpress,
    accent: "blue",
    bestFor: "service businesses that want familiar editing after launch",
    summary: "A flexible business website with service pages, blog-ready structure, and practical editing support.",
    features: [
      "Core business pages",
      "Responsive WordPress theme setup",
      "Contact and WhatsApp paths",
      "Basic SEO metadata setup",
      "Owner-friendly handoff notes",
    ],
  },
  {
    key: "react",
    name: "React Custom Build",
    shortName: "React",
    price: 4000,
    badge: "Most custom",
    icon: SiReact,
    accent: "purple",
    featured: true,
    bestFor: "brands that need custom UI, fast frontend behavior, or portal-style flows",
    summary: "A custom-coded website or interface with polished UX, reusable components, and stronger technical control.",
    features: [
      "Custom page system",
      "Reusable React components",
      "API-ready contact flows",
      "Portal or dashboard planning",
      "Deeper responsive QA",
    ],
  },
  {
    key: "wix",
    name: "Wix Website",
    shortName: "Wix",
    price: 3000,
    badge: "Visual editing",
    icon: SiWix,
    accent: "amber",
    bestFor: "business owners who prefer drag-and-drop editing and a quick visual handoff",
    summary: "A clean Wix build for owners who want a polished website and simpler content updates.",
    features: [
      "Wix page design",
      "Service and contact sections",
      "Mobile layout review",
      "Form and link checks",
      "Editing guidance",
    ],
  },
  {
    key: "email",
    name: "Professional Email",
    shortName: "Email",
    price: 400,
    badge: "Add-on",
    icon: LuMail,
    accent: "rose",
    bestFor: "businesses that need domain-based email alongside a website launch",
    summary: "Business email setup support so your contact path looks more professional.",
    features: [
      "Domain email planning",
      "Mailbox setup guidance",
      "DNS record support",
      "Basic deliverability notes",
      "Launch contact review",
    ],
  },
];

const compareRows = [
  ["Best editing fit", "CMS editing", "Custom code", "Visual builder", "Domain email"],
  ["Website pages", "Core pages", "Custom scope", "Core pages", "Not included"],
  ["Portal/update workflow", "Available", "Strong fit", "Light handoff", "Not needed"],
  ["Maintenance", "Recommended", "Recommended", "Recommended", "Email checks"],
];

export default function Pricing() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const nav = useNavigate();
  const muted = isDark ? "text-textSub" : "text-slate-600";

  function startPlan(plan) {
    const params = new URLSearchParams({
      plan: plan.key,
      label: plan.name,
    }).toString();
    nav(`/contact?${params}`);
  }

  return (
    <section className="section">
      <Container>
        <Meta
          title="Website Pricing — MSPixelPulse"
          description="Compare starting points for WordPress, React, Wix, professional email, and custom website projects with MSPixelPulse."
          canonical="/pricing"
        />
        <SectionTitle
          eyebrow="Pricing"
          title="Easy starting points for clean business websites"
          align="center"
          as="h1"
        />

        <div className={isDark ? "pricing-include-strip pricing-include-strip-dark" : "pricing-include-strip"}>
          <span>All website plans include:</span>
          {included.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="pricing-include-item">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <article
                key={plan.key}
                className={[
                  "pricing-plan-card",
                  isDark ? "pricing-plan-card-dark" : "",
                  plan.featured ? "pricing-plan-card-featured" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                data-accent={plan.accent}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="pricing-plan-icon" aria-hidden="true">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="pricing-plan-badge">{plan.badge}</span>
                </div>
                <h2>{plan.name}</h2>
                <p className="pricing-best-for">{plan.bestFor}</p>
                <div className="pricing-price">
                  <span>Starting from</span>
                  <strong>{CAD(plan.price)}</strong>
                </div>
                <p className="pricing-summary">{plan.summary}</p>
                <ul className="pricing-feature-list">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <LuCircleCheck className="h-4 w-4" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button type="button" className="pricing-start-button" onClick={() => startPlan(plan)}>
                  Discuss this option
                  <LuRocket className="h-4 w-4" aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </div>

        <section className={isDark ? "pricing-compare pricing-compare-dark" : "pricing-compare"} aria-labelledby="pricing-compare-title">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-blue-500">Compare plan features</p>
              <h2 id="pricing-compare-title">Pick the build style around how you will use the site.</h2>
            </div>
            <Link to="/contact" className="pricing-compare-link">
              Ask for a recommendation
              <LuArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.key}>{plan.shortName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <td key={`${row[0]}-${index}`} className={index === 0 ? "pricing-row-label" : ""}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className={isDark ? "mx-auto mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.045] p-5 text-center" : "mx-auto mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-white/80 p-5 text-center shadow-sm backdrop-blur-xl"}>
          <p className={`text-sm leading-6 ${muted}`}>
            Final pricing depends on scope, pages, content, integrations, and launch support. Send a quick note and we will recommend the simplest practical starting point.
          </p>
          <ContactActions
            dark={isDark}
            className="mt-4 justify-center"
            whatsappLabel="Discuss pricing"
            message="Hi MSPixelPulse, I would like to discuss website pricing."
          />
        </div>
      </Container>
    </section>
  );
}
